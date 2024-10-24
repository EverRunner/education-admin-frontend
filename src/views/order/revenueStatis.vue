<style lang="scss" scope></style>

<template>
  <section class="public-wp">
    <TabsNav :list="tabsNavList" />

    <div class="order-revenue">
      <el-row :gutter="16" class="home-report">
        <el-col
          :xs="24"
          :sm="24"
          :md="14"
          :lg="14"
          :xl="14"
          v-loading="orderLoading"
        >
          <div
            class="home-report-item home-report-item--order"
            ref="refOrder"
            :style="{ height: height }"
          >
            <div class="order-revenue-title">
              <h5>订单情况（本周）</h5>
            </div>
            <ul class="week">
              <li v-for="(item, index) in orderList" :key="index">
                <em class="week-title" :class="{ on: item.nowDate }">{{
                  weekList[index]
                }}</em>
                <p class="week-time">
                  {{ item.date | formatDate("M/DD") }}
                </p>
                <dl class="week-list">
                  <dd
                    v-for="(son, index) in item.data"
                    :key="index"
                    @click="handleGoTo('MEMBER_DETAILS', son.memberid)"
                  >
                    <span>{{ son.username }}</span>
                    <p>{{ hanldeOrderType(son.category) }}</p>
                  </dd>
                </dl>
              </li>
            </ul>
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :md="10"
          :lg="10"
          :xl="10"
          v-loading="orderLoading"
        >
          <div
            class="home-report-item home-report-item--order"
            ref="refWeek"
            :style="{ height: height }"
          >
            <div class="order-revenue-title">
              <h5>订单收入（最近7天）</h5>
            </div>
            <div class="order-revenue-week">
              <ul>
                <li>
                  <span>购课 x {{ sevenOrderInfo.xgcount }}</span>
                  <em>${{ (sevenOrderInfo.xgpayfee / 100) | formatMoney }}</em>
                </li>
                <li>
                  <span>续费 x {{ sevenOrderInfo.xfcount }}</span>
                  <em>${{ (sevenOrderInfo.xfpayfee / 100) | formatMoney }}</em>
                </li>
                <li>
                  <span>执照申请 x {{ sevenOrderInfo.zzcount }}</span>
                  <em>${{ (sevenOrderInfo.zzpayfee / 100) | formatMoney }}</em>
                </li>
              </ul>
              <div class="total">
                <div class="total-left">
                  <p>总计：</p>
                  <p>
                    (
                    {{
                      dayjs()
                        .subtract(7, "days")
                        .format("YYYY/MM/DD")
                    }}-{{ dayjs().format("YYYY/MM/DD") }}
                    )
                  </p>
                </div>
                <em>${{ (sevenOrderInfo.total / 100) | formatMoney }}</em>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <!-- 营收统计 -->
      <div class="order-revenue-statis">
        <div class="title">
          <h5>营收统计</h5>
          <ul class="title-btn">
            <li
              v-for="(name, key) in categoryList"
              :key="key"
              @click="handleTabsClick(key)"
              :class="{ on: category == key }"
            >
              {{ name }}
            </li>
          </ul>
        </div>
        <el-row v-loading="chartLoading">
          <el-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
            <div id="orderChart" :style="{ height: '560px' }"></div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="10">
            <div class="order-revenue-week">
              <div class="month">{{ legendDataList[category][0] }}</div>
              <ul>
                <li>
                  <span>购课 x {{ currentOrderInfo.xgcount }}</span>
                  <em
                    >${{ (currentOrderInfo.xgpayfee / 100) | formatMoney }}</em
                  >
                </li>
                <li>
                  <span>续费 x {{ currentOrderInfo.xfcount }}</span>
                  <em
                    >${{ (currentOrderInfo.xfpayfee / 100) | formatMoney }}</em
                  >
                </li>
                <li>
                  <span>执照申请 x {{ currentOrderInfo.zzcount }}</span>
                  <em
                    >${{ (currentOrderInfo.zzpayfee / 100) | formatMoney }}</em
                  >
                </li>
              </ul>
              <div class="total">
                <div class="total-left">
                  <p>总计：</p>
                  <p>
                    (
                    {{
                      dayjs()
                        .startOf(dateTypeList[category])
                        .format("YYYY/MM/DD")
                    }}-{{
                      dayjs()
                        .endOf(dateTypeList[category])
                        .format("YYYY/MM/DD")
                    }})
                  </p>
                </div>
                <em>${{ (currentOrderInfo.total / 100) | formatMoney }}</em>
              </div>
            </div>
            <div class="order-revenue-week">
              <div class="month on">{{ legendDataList[category][1] }}</div>
              <ul>
                <li>
                  <span>购课 x {{ lastOrderInfo.xgcount }}</span>
                  <em>${{ (lastOrderInfo.xgpayfee / 100) | formatMoney }}</em>
                </li>
                <li>
                  <span>续费 x {{ lastOrderInfo.xfcount }}</span>
                  <em>${{ (lastOrderInfo.xfpayfee / 100) | formatMoney }}</em>
                </li>
                <li>
                  <span>执照申请 x {{ lastOrderInfo.zzcount }}</span>
                  <em>${{ (lastOrderInfo.zzpayfee / 100) | formatMoney }}</em>
                </li>
              </ul>
              <div class="total">
                <div class="total-left">
                  <p>总计：</p>
                  <p>
                    (
                    {{
                      dayjs()
                        .subtract(1, dateTypeList[category])
                        .startOf(dateTypeList[category])
                        .format("YYYY/MM/DD")
                    }}-{{
                      dayjs()
                        .subtract(1, dateTypeList[category])
                        .endOf(dateTypeList[category])
                        .format("YYYY/MM/DD")
                    }}
                    )
                  </p>
                </div>
                <em>${{ (lastOrderInfo.total / 100) | formatMoney }}</em>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </section>
</template>

<script>
import {
  getWeekMemberOrderList,
  getOrderZhStatics,
  getLastSevenDayStatics,
} from "@api/order";
import { formatDateTime } from "@utils/tools";
import TabsNav from "@comp/TabsNav";
import echarts from "echarts";
import dayjs from "moment-timezone";

// 生成数字字符数组
function createNumArray(num, text) {
  let days = [];
  for (let index = 0; index < num; index++) {
    days.push(index + 1 + text);
  }
  return days;
}

export default {
  components: { TabsNav },
  data() {
    return {
      tabsNavList: [
        { name: "营收概况", path: "/order/revenueStatis" },
        { name: "课程订单", path: "/order/list" },
        { name: "考过生服务订单", path: "/pass/license" },
        { name: "续费申请", path: "/member/renew" },
      ],

      orderLoading: true,
      orderList: [],
      orderInfo: {
        weekXg: 0,
        weekXf: 0,
      },

      height: 71,
      weekList: ["S", "M", "T", "W", "T", "F", "S"],

      category: 1, //  0：周，1：月，2：季度，3：年
      categoryList: {
        0: "周",
        1: "月",
        2: "季",
        3: "年",
      },
      chartLoading: true,

      sevenOrderInfo: {},
      sevenLoading: true,

      currentOrderInfo: {},
      lastOrderInfo: {},

      myChart: null,
      xAxisDataList: {
        0: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        1: createNumArray(31, "号"),
        2: ["第一个月", "第二个月", "第三个月"],
        3: createNumArray(12, "月"),
      },
      legendDataList: {
        0: ["本周", "上周"],
        1: ["本月", "上月"],
        2: ["本季度", "上季度"],
        3: ["本年", "昨年"],
      },
      dateTypeList: {
        0: "week",
        1: "month",
        2: "quarter",
        3: "year",
      },
    };
  },

  created() {},

  mounted() {
    // 初始化echarts实例
    this.myChart = echarts.init(document.getElementById("orderChart"));

    this.queryWeekOrderList();
    this.drawOrderChart();
    this.querySevenOrderInfo();
  },

  methods: {
    dayjs,

    /**
     * 获取订单列表（本周）
     */
    async queryWeekOrderList() {
      const { data: resData } = await getWeekMemberOrderList();
      this.orderLoading = false;
      if (!resData.data.status) return;

      // 列表信息
      const arr = resData.data.data.map((item) => {
        return {
          ...item,
          nowDate:
            formatDateTime(item.date, "MM-DD") ==
            formatDateTime(new Date(), "MM-DD"),
        };
      });
      this.orderList = arr.sort(
        (a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)
      );

      // this.orderList.shift(); // 删除第一项

      const windowWidth = document.documentElement.clientWidth;
      // 设置两边等高 屏幕宽度 大于 768
      if (windowWidth > 768) {
        const examHeight = this.$refs.refWeek.offsetHeight;
        const orderHeight = this.$refs.refOrder.offsetHeight;
        if (examHeight - orderHeight > 0) {
          this.height = examHeight + "px";
        } else {
          this.height = orderHeight + "px";
        }
      }
    },

    /**
     * 获取最近7天的订单
     */
    async querySevenOrderInfo() {
      const { data: resData } = await getLastSevenDayStatics();
      this.sevenLoading = false;
      if (!resData.data.status) return;

      this.sevenOrderInfo = {
        ...resData.data.data,
        total:
          resData.data.data.xfpayfee +
          resData.data.data.xgpayfee +
          resData.data.data.zzpayfee,
      };
    },

    /**
     * 获取订单类型
     */
    hanldeOrderType(type) {
      switch (type) {
        case 0:
          return "（购课）";

        case 1:
          return "（续费）";

        case 2:
          return "（执照申请）";

        default:
          return "（--）";
      }
    },

    /**
     * 周、月、季、年 切换
     */
    handleTabsClick(key) {
      this.category = key;
      this.drawOrderChart();
    },

    /**
     * 订单统计
     */
    async drawOrderChart() {
      this.chartLoading = true;

      const { data: resData } = await getOrderZhStatics({
        category: this.category,
      });
      this.chartLoading = false;
      if (!resData.data.status) return;

      // 图表数据
      const chartData = resData.data.data.data;
      const seriesData = [],
        legendData = this.legendDataList[this.category];

      // 本月的数据统计
      this.currentOrderInfo = {
        xfpayfee: chartData.current.xfpayfee,
        xgpayfee: chartData.current.xgpayfee,
        zzpayfee: chartData.current.zzpayfee,
        xfcount: chartData.current.xfcount,
        xgcount: chartData.current.xgcount,
        zzcount: chartData.current.zzcount,
        total:
          chartData.current.xfpayfee +
          chartData.current.xgpayfee +
          chartData.current.zzpayfee,
      };

      // 上月的数据统计
      this.lastOrderInfo = {
        xfpayfee: chartData.last.xfpayfee,
        xgpayfee: chartData.last.xgpayfee,
        zzpayfee: chartData.last.zzpayfee,
        xfcount: chartData.last.xfcount,
        xgcount: chartData.last.xgcount,
        zzcount: chartData.last.zzcount,
        total:
          chartData.last.xfpayfee +
          chartData.last.xgpayfee +
          chartData.last.zzpayfee,
      };

      // 本月的数据
      if (chartData.current && chartData.current.dataconst) {
        const currentData = [];

        for (const key in chartData.current.dataconst) {
          currentData.push((chartData.current.dataconst[key] || 0) / 100);
        }

        seriesData.push({
          name: legendData[0],
          type: "line",
          data: currentData,
          symbolSize: 6,
          itemStyle: {
            normal: {
              color: "#004988", //折点颜色
              lineStyle: {
                color: "#004988", //折线颜色
              },
            },
          },
        });
      }

      // 上月的数据
      if (chartData.last && chartData.last.dataconst) {
        const lastData = [];

        for (const key in chartData.last.dataconst) {
          lastData.push((chartData.last.dataconst[key] || 0) / 100);
        }

        seriesData.push({
          name: legendData[1],
          type: "line",
          data: lastData,
          symbolSize: 6,
          itemStyle: {
            normal: {
              color: "#E6A23C", //折点颜色
              lineStyle: {
                color: "#E6A23C", //折线颜色
              },
            },
          },
        });
      }

      // 指定图表的配置项和数据
      let option = (option = {
        tooltip: {
          trigger: "axis",
          // axisPointer: {
          //   type: "cross",
          //   label: {
          //     backgroundColor: "#007aff",
          //   },
          // },
          // formatter: "{a0}：{c0} <br /> {a1}：{c1}  <br /> ",
        },
        legend: {
          data: legendData,
          icon: "rect",
          padding: [30, 50, 0, 0],
          itemWidth: 12,
          itemHeight: 12,
          borderRadius: 2,
        },
        toolbox: {},
        xAxis: {
          name: "日期",
          type: "category",
          boundaryGap: false,
          data: this.xAxisDataList[this.category],
          nameTextStyle: {
            color: "#000",
            fontSize: 14,
          },
          type: "category",
          axisLine: {
            lineStyle: {
              color: "rgba(0, 0, 0, 0.25)",
            },
            axisTick: {
              alignWithLabel: true,
            },
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "rgba(0, 0, 0, 0.65)",
            },
          },
          nameTextStyle: {
            color: "rgba(0, 0, 0, 0.65)",
          },
        },
        yAxis: {
          name: "金额（美元）",
          type: "value",
          nameTextStyle: {
            color: "#000",
            fontSize: 14,
          },
          axisLine: {
            lineStyle: {
              color: "rgba(0, 0, 0, 0.25)",
            },
          },
          splitLine: {
            //网格线
            lineStyle: {
              color: "rgba(0, 0, 0, 0.1)",
              type: "dashed", //设置网格线类型 dotted：虚线   solid:实线
            },
            show: true,
          }, //隐藏或显示
          axisLabel: {
            show: true,
            textStyle: {
              color: "rgba(0, 0, 0, 0.65)",
            },
          },
          nameTextStyle: {
            color: "rgba(0, 0, 0, 0.65)",
          },
        },
        series: seriesData,
        grid: {
          left: 60,
          right: 60,
          bottom: 30,
          top: 70,
        },
      });

      // 使用刚指定的配置项和数据显示图表。
      this.myChart.setOption(option);
    },

    /**
     * 处理跳转
     */
    handleGoTo(name, id) {
      const query = id ? { id } : {};

      this.$router.push({
        name,
        query,
      });
    },
  },
};
</script>
