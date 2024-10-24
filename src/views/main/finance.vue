<style lang="scss" scope>
.finance {
  &-source {
    background: #fff;
    border-radius: 8px;
    &-title {
      font-size: 20px;
      color: rgba(0, 0, 0, 0.85);
      padding: 25px;
    }
    ul {
      display: flex;
      justify-content: space-between;
      padding: 10px 25px 25px;
      li {
        width: 22%;
        border-radius: 8px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        color: #fff;
        padding: 20px;
        &.one {
          background: linear-gradient(311deg, #645eff 0%, #a97fff 100%);
        }
        &.two {
          background: linear-gradient(311deg, #f7ac68 0%, #f36462 100%);
        }
        &.three {
          background: linear-gradient(135deg, #ff8a99 0%, #9468ef 100%);
        }
        &.four {
          background: linear-gradient(134deg, #38d8be 0%, #44b3f1 100%);
        }
        .number {
          padding-left: 20px;
          padding-bottom: 10px;
          span {
            font-size: 14px;
            color: #ffffff;
            font-weight: bold;
          }
          p {
            font-size: 26px;
            font-weight: 600;
            padding-top: 5px;
          }
        }
      }
    }
  }

  &-backlog {
    background-color: #fff;
    margin-top: 25px;
    border-radius: 8px;
    padding-bottom: 50px;
    &-wp {
      display: flex;
      .item {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50%;
        position: relative;
        &:nth-of-type(1)::before {
          content: "";
          position: absolute;
          top: 50%;
          right: 0;
          background: #c0c4cc;
          width: 1px;
          height: 55px;
          transform: translateY(-50%);
        }
        img {
          width: 80px;
          height: 80px;
        }
        &-text {
          padding-left: 20px;
          display: flex;
          flex-direction: column;
          text-align: center;
          span {
            font-size: 36px;
            font-weight: 600;
            color: #222222;
            text-align: center;
            width: 140px;
          }
          p {
            font-size: 18px;
            font-weight: 500;
            color: #666666;
            padding-top: 8px;
            width: 140px;
          }
        }
      }
    }
  }

  &-statis {
    background-color: #fff;
    margin-top: 25px;
    border-radius: 8px;
    &-wp {
      padding: 0 25px 25px;
      .text {
        color: rgba(0, 0, 0, 0.85);
        display: flex;
        padding-left: 40px;
        p {
          font-size: 14px;
          padding-right: 50px;
          span {
            font-size: 20px;
          }
        }
      }
      #incomeChart {
        width: 100%;
        height: 400px;
      }
    }
  }
}
</style>

<template>
  <section class="finance">
    <div class="finance-source">
      <h5 class="finance-source-title">订单收入</h5>
      <ul>
        <li class="one">
          <img src="../../assets/images/jrddsl.png" alt="" />
          <div class="number">
            <span>今日订单收入</span>
            <p>$ {{ (info.todayAllFee / 100) | formatMoney }}</p>
          </div>
        </li>
        <li class="two">
          <img src="../../assets/images/jrddss.png" alt="" />
          <div class="number">
            <span>今日订单数量</span>
            <p>{{ info.todayAllCount }}</p>
          </div>
        </li>
        <li class="three">
          <img src="../../assets/images/jrddsl.png" alt="" />
          <div class="number">
            <span>7日内订单数量</span>
            <p>{{ info.oneWeekLastAllCount }}</p>
          </div>
        </li>
        <li class="four">
          <img src="../../assets/images/jrddss.png" alt="" />
          <div class="number">
            <span>7日内订单收入</span>
            <p>$ {{ (info.oneWeekLastAllFee / 100) | formatMoney }}</p>
          </div>
        </li>
      </ul>
    </div>

    <div class="finance-backlog">
      <h5 class="finance-source-title">待办事项</h5>
      <div class="finance-backlog-wp">
        <div class="item">
          <img src="../../assets/images/dfkdd.png" alt="" />
          <div class="item-text">
            <span>{{ info.noPayCount }}</span>
            <p>待付款订单数量</p>
          </div>
        </div>
        <div class="item">
          <img src="../../assets/images/dqrdd.png" alt="" />
          <div class="item-text">
            <span>{{ info.refundPayCount }}</span>
            <p>退款订单数量</p>
          </div>
        </div>
      </div>
    </div>

    <div class="finance-statis">
      <h5 class="finance-source-title">统计营收</h5>
      <div class="finance-statis-wp">
        <div class="text">
          <p>
            本月订单总数：<span>{{ monthOrder }}单</span>
          </p>
          <p>
            本月订单总金额：<span>${{ (monthMoney / 100) | formatMoney }}</span>
          </p>
        </div>
        <div id="incomeChart"></div>
      </div>
    </div>
  </section>
</template>

<script>
import echarts from "echarts";
import { getOrderStatics } from "@api/order";
import { getWeekdaysorderTotal, getCurrentMonthOrDer } from "@api/main";
import { formatDateTime } from "@utils/tools";

export default {
  components: {},
  data() {
    return {
      info: {},

      monthOrder: 0,
      monthMoney: 0,
    };
  },

  methods: {
    /**
     * 获取详情
     */
    async queryInfo() {
      const { data: resData } = await getOrderStatics();
      if (!resData.data.status) return;

      this.info = resData.data.data;
    },

    /**
     * 获取本月订单数量和金额汇总
     */
    async queryCurrentMonthOrDer() {
      const { data: resData } = await getCurrentMonthOrDer();

      if (!resData.data.status) return;

      this.monthOrder = resData.data.data.paycount;
      this.monthMoney = resData.data.data.paytotal;
    },

    /**
     * 订单走势图
     */
    async drawChart() {
      const { data: resData } = await getWeekdaysorderTotal();

      if (!resData.data.status) return;

      const xAxis = resData.data.data.map((a) =>
        formatDateTime(a.date, "YYYY-MM-DD")
      );
      const yAxis = resData.data.data.map((a) =>  Math.floor(a.total * 100) / 10000 );

      // 初始化echarts实例
      let myChart = echarts.init(document.getElementById("incomeChart"));

      // 指定图表的配置项和数据
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#007aff",
            },
          },
          formatter: "日期：{b0} <br /> 金额：${c0}",
        },
        xAxis: {
          name: "日期",
          nameTextStyle: {
            color: "#000",
            fontSize: 14,
          },
          type: "category",
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: "#E9E9E9",
            },
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#000",
            },
          },
          data: xAxis,
        },
        yAxis: {
          name: "金额",
          nameTextStyle: {
            color: "#000",
            fontSize: 14,
          },
          axisLine: {
            lineStyle: {
              color: "#E9E9E9",
            },
          },
          splitLine: {
            //网格线
            lineStyle: {
              color: "#E9E9E9",
              type: "dashed", //设置网格线类型 dotted：虚线   solid:实线
            },
            show: true,
          }, //隐藏或显示

          axisLabel: {
            show: true,
            textStyle: {
              color: "#000",
            },
          },
          type: "value",
        },
        series: [
          {
            data: yAxis,
            type: "line",
            lineStyle: { color: "#1890FF" },
            symbolSize: 10,
            itemStyle: {
              color: "#1890FF",
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "#1890FF", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(24, 144, 255, 0.01)", // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        ],
        grid: {
          left: "80px",
          right: "80px",
          bottom: "80px",
          top: "80px",
        },
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
  },
  mounted() {
    this.queryCurrentMonthOrDer();
    this.drawChart();
    this.queryInfo();
  },
};
</script>
