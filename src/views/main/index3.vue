<style lang="scss" scope>
.index {
  &-title {
    font-size: 20px;
    color: rgba(0, 0, 0, 0.85);
    padding: 25px;
  }
  &-screen {
    display: flex;
    span {
      background: #ffffff;
      width: 60px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      border-radius: 4px 0px 0px 4px;
      border: 1px solid #d9d9d9;
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
      cursor: pointer;
      &:nth-of-type(2) {
        border-radius: 0px 4px 4px 0px;
      }
      &.on {
        border: 1px solid #007aff;
        color: #007aff;
      }
    }
  }
  &-source {
    margin-top: 25px;

    display: flex;
    justify-content: space-between;
    &-ditch {
      width: calc(50% - 15px);
      background-color: #fff;
      border-radius: 8px;
    }
    &-visit {
      width: calc(70% - 30px);
      background-color: #fff;
      border-radius: 8px;
      box-sizing: border-box;
      .index-screen {
        justify-content: flex-end;
        padding-right: 25px;
      }
    }
    &-wp {
      padding: 0 25px 25px;
    }
  }
  &-page {
    margin-top: 30px;
    background: #fff;
    &-wp {
      padding: 25px;
    }
    &-top {
      display: flex;
      justify-content: space-between;
      padding: 0 10px;
      border-bottom: 1px solid #d9d9d9;
      .nav {
        display: flex;
        span {
          position: relative;
          padding: 15px 30px;
          font-size: 16px;
          color: rgba(0, 0, 0, 0.65);
          cursor: pointer;
          &.on {
            color: #007aff;
            &::after {
              content: "";
              position: absolute;
              bottom: -1px;
              left: 0;
              right: 0;
              background: #007aff;
              height: 2px;
            }
          }
        }
      }
      .screen {
        display: flex;
        span {
          width: 60px;
          height: 48px;
          line-height: 48px;
          text-align: center;
          color: rgba(0, 0, 0, 0.65);
          font-size: 14px;
          cursor: pointer;
          &.on {
            color: #007aff;
          }
        }
      }
    }
  }
  &-ratio {
    margin-top: 30px;
    background-color: #fff;
    &-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 30px;
    }
  }
}
#visitChart,
#ditchChart,
#ratioChart,
#facilityChart,
#pageChart {
  width: 100%;
  height: 400px;
}

#ipChart {
  width: 100%;
  height: 550px;
}
</style>

<template>
  <section class="index">
    <!-- 每一部分 渠道、访问 -->
    <div class="index-source">
      <div class="index-source-ditch" v-loading="loadingChannel">
        <div class="index-ratio-top">
          <h5 class="index-title">用户来源（渠道）</h5>
          <div class="index-screen">
            <span @click="queryChannel(0)" :class="{ on: channelType == 0 }"
              >按月</span
            >
            <span @click="queryChannel(1)" :class="{ on: channelType == 1 }"
              >按年</span
            >
          </div>
        </div>
        <div class="index-source-wp">
          <div id="ditchChart"></div>
        </div>
      </div>
      <div class="index-source-ditch" v-loading="loadingFacility">
        <div class="index-ratio-top">
          <h5 class="index-title">用户来源（访问设备）</h5>
          <div class="index-screen">
            <span @click="queryFacility(0)" :class="{ on: facilityType == 0 }"
              >按月</span
            >
            <span @click="queryFacility(1)" :class="{ on: facilityType == 1 }"
              >按年</span
            >
          </div>
        </div>
        <div class="index-source-wp">
          <div id="facilityChart"></div>
        </div>
      </div>
      <!-- <div class="index-source-visit">
        <div class="index-ratio-top">
          <h5 class="index-title">用户来源（访问量）</h5>
          <div class="index-screen">
            <span class="on">按月</span>
            <span>按年</span>
          </div>
        </div>
        <div class="index-source-wp">
       
        </div>
      </div> -->
    </div>

    <!-- 用户来源（访问量） -->
    <div class="index-ratio">
      <div class="index-ratio-top">
        <h5 class="index-title">用户来源（访问量）</h5>
        <div class="index-screen">
          <span class="on">按月</span>
          <span>按年</span>
        </div>
      </div>

      <div class="index-source-wp">
        <div id="visitChart"></div>
      </div>
    </div>

    <!-- 每二部分 页面统计 -->
    <div class="index-page" v-loading="loading">
      <div class="index-page-top">
        <div class="nav">
          <span @click="handlePageCount(0)" :class="{ on: activity == 0 }"
            >用户经常访问的页面</span
          >
          <span @click="handlePageCount(1)" :class="{ on: activity == 1 }"
            >跳出率高的页面</span
          >
        </div>
        <div class="screen">
          <!-- <span class="on">按月</span>
          <span>按年</span> -->
        </div>
      </div>
      <div class="index-page-wp">
        <div id="pageChart"></div>
      </div>
    </div>

    <!-- 每三部分 转化率 -->
    <div class="index-ratio">
      <div class="index-ratio-top">
        <h5 class="index-title">用户转化率</h5>
        <div class="index-screen">
          <span class="on">按月</span>
          <span>按年</span>
        </div>
      </div>

      <div class="index-source-wp">
        <div id="ratioChart"></div>
      </div>
    </div>

    <!-- 每四部分 ip访问地图 -->
    <div class="index-ratio">
      <div class="index-ratio-top">
        <h5 class="index-title">用户IP分析</h5>
        <div class="index-screen">
          <span class="on">按月</span>
          <span>按年</span>
        </div>
      </div>

      <div class="index-source-wp">
        <div id="ipChart"></div>
      </div>
    </div>
  </section>
</template>

<script>
import echarts from "echarts";
import usaJson from "@assets/map/USA.js";
import { formatDateTime } from "@utils/tools";
import {
  getReviewmostFive,
  getMmostredirectPage,
  getLastweekreview,
  getReviewmosChannel,
  getReviewmosFacility,
} from "@api/main";

export default {
  components: {},
  data() {
    return {
      activity: 0,
      loading: false,

      channelObj: {
        0: "直接访问",
        1: "短信访问",
        2: "邮箱访问",
      },
      channelType: 0, // 0：按月，1：按年
      loadingChannel: false,

      facilityObj: {
        1: "电脑访问",
        2: "手机访问",
        3: "平板访问",
      },
      facilityType: 0, // 0：按月，1：按年
      loadingFacility: false,
    };
  },

  methods: {
    /**
     * 用户来源（访问量）
     */
    async drawVisitChart() {
      const { data: resData } = await getLastweekreview();

      if (!resData.data.status) return;

      const xAxis = resData.data.data.map((a) =>
        formatDateTime(a.date, "YYYY-MM-DD")
      );
      const yAxis = resData.data.data.map((a) => a.total);

      // 初始化echarts实例
      let myChart = echarts.init(document.getElementById("visitChart"));

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
          formatter: "日期：{b0} <br /> 访问量：{c0}",
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
          name: "次数",
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
          left: "50px",
          right: "50px",
          bottom: "50px",
          top: "50px",
        },
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },

    /**
     * 用户来源（渠道）
     */
    drawChannelChart(seriesData, legendData) {
      let myChart = echarts.init(document.getElementById("ditchChart"));

      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          bottom: 10,
          left: "center",
          icon: "circle",
          data: ["直接访问", "短信访问", "邮箱访问"],
        },
        color: ["#007AFF", "#FFCE07", "#32D483"],
        series: [
          {
            name: "访问渠道",
            type: "pie",
            radius: "55%",
            center: ["50%", "50%"],
            data: seriesData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      myChart.setOption(option);
    },

    /**
     * 用户访问（渠道）
     */
    async queryChannel(type) {
      this.channelType = type;

      this.loadingChannel = true;

      const { data: resData } = await getReviewmosChannel(this.channelType);

      this.loadingChannel = false;

      if (!resData.data.status) return;

      const legendData = [];
      const seriesData = resData.data.data.map((item) => {
        legendData.push(this.channelObj[item.entryway]);
        return {
          value: item.count,
          name: this.channelObj[item.entryway],
        };
      });

      this.drawChannelChart(seriesData);
    },

    /**
     * 用户访问（访问设备）
     */
    drawFacilityChart(seriesData, legendData) {
      let myChart = echarts.init(document.getElementById("facilityChart"));

      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          bottom: 10,
          left: "center",
          icon: "circle",
          data: ["电脑访问", "手机访问", "平板访问"],
        },
        color: ["#007AFF", "#FFCE07", "#32D483"],
        series: [
          {
            name: "访问设备",
            type: "pie",
            radius: "55%",
            center: ["50%", "50%"],
            data: seriesData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      myChart.setOption(option);
    },

    /**
     * 用户访问（访问设备）
     */
    async queryFacility(type) {
      this.facilityType = type;

      this.loadingFacility = true;

      const { data: resData } = await getReviewmosFacility(this.facilityType);

      this.loadingFacility = false;

      if (!resData.data.status) return;

      const legendData = [];
      let resSeriesData = resData.data.data.map((item) => {
        legendData.push(this.facilityObj[item.category]);
        return {
          value: item.count,
          name: this.facilityObj[item.category],
        };
      });

      const seriesData = resSeriesData.filter((a) => a.name); //过滤空值

      this.drawFacilityChart(seriesData);
    },

    /**
     * 用户访问页面统计 / 跳出 率高的页面
     */
    async handlePageCount(index) {
      this.activity = index;
      this.loading = true;

      //用户访问页面统计
      if (index == 0) {
        const { data: resData } = await getReviewmostFive();

        this.loading = false;

        if (!resData.data.status) return;

        const xAxis = resData.data.data.map((a) => a.pagename);
        const yAxis = resData.data.data.map((a) => a.viewcount);

        this.drawPageChart(xAxis, yAxis);
        return;
      }

      // 跳出率高的页面
      const { data: resData } = await getMmostredirectPage();

      this.loading = false;

      if (!resData.data.status) return;

      const xAxis = resData.data.data.map((a) => a.pagename);
      const yAxis = resData.data.data.map((a) => a.staytimecount);

      this.drawPageChart(xAxis, yAxis);
    },

    /**
     * 用户访问页面统计
     */
    drawPageChart(xAxis, yAxis) {
      let myChart = echarts.init(document.getElementById("pageChart"));

      let option = {
        color: ["#007AFF"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "100px",
          right: "50px",
          bottom: "50px",
          top: "50px",
        },

        xAxis: [
          {
            name: "页面",
            nameTextStyle: {
              color: "#000",
              fontSize: 14,
            },
            type: "category",
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
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            name: "次数",
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
        ],
        series: [
          {
            name: "直接访问",
            type: "bar",
            barWidth: "50px",
            data: yAxis,
          },
        ],
      };

      myChart.setOption(option);
    },

    /**
     * 转化率
     */
    drawRatioChart() {
      let myChart = echarts.init(document.getElementById("ratioChart"));

      let option = {
        color: ["#007AFF", "#00E1E1", "#39E096", "#FFCC00", "#FA5376"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "50px",
          right: "50px",
          bottom: "50px",
          top: "70px",
        },

        legend: {
          top: 5,
          left: "center",
          icon: "circle",
          data: [
            "访问次数",
            "注册用户",
            "试用用户",
            "未付款用户",
            "已购买用户",
          ],
        },
        xAxis: [
          {
            name: "月份",
            nameTextStyle: {
              color: "#000",
              fontSize: 14,
            },
            type: "category",
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
            data: [
              "2020-1",
              "2020-2",
              "2020-3",
              "2020-4",
              "2020-5",
              "2020-6",
              "2020-7",
            ],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            name: "次数",
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
        ],
        series: [
          {
            name: "访问次数",
            type: "bar",
            barWidth: "12",
            data: [23, 5, 200, 334, 120, 10, 90],
          },
          {
            name: "注册用户",
            type: "bar",
            barWidth: "12",
            data: [5, 52, 34, 334, 30, 90, 20],
          },
          {
            name: "试用用户",
            type: "bar",
            barWidth: "12",
            data: [65, 52, 44, 34, 109, 80, 10],
          },
          {
            name: "未付款用户",
            type: "bar",
            barWidth: "12",
            data: [23, 52, 66, 334, 69, 60, 60],
          },
          {
            name: "已购买用户",
            type: "bar",
            barWidth: "12",
            data: [34, 52, 4, 134, 70, 40, 20],
          },
        ],
      };

      myChart.setOption(option);
    },

    /**
     * ip统计图
     */
    drawIPChart() {
      let myChart = echarts.init(document.getElementById("ipChart"));

      let option = {
        tooltip: {
          trigger: "item",
          showDelay: 0,
          transitionDuration: 0.2,
          formatter: function(params) {
            var value = (params.value + "").split(".");
            value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, "$1,");
            return params.seriesName + "<br/>" + params.name + ": " + value;
          },
        },
        visualMap: {
          left: "right",
          min: 500000,
          max: 38000000,
          inRange: {
            color: [
              "#313695",
              "#4575b4",
              "#74add1",
              "#abd9e9",
              "#e0f3f8",
              "#ffffbf",
              "#fee090",
              "#fdae61",
              "#f46d43",
              "#d73027",
              "#a50026",
            ],
          },
          text: ["最高", "最低"], // 文本，默认为数值文本
          calculable: true,
        },

        series: [
          {
            name: "用户IP分析",
            type: "map",
            roam: true,
            map: "USA",
            emphasis: {
              label: {
                show: true,
              },
            },
            // 文本位置修正
            textFixed: {
              Alaska: [20, -20],
            },
            data: [
              { name: "Alabama", value: 4822023 },
              { name: "Alaska", value: 731449 },
              { name: "Arizona", value: 6553255 },
              { name: "Arkansas", value: 2949131 },
              { name: "California", value: 38041430 },
              { name: "Colorado", value: 5187582 },
              { name: "Connecticut", value: 3590347 },
              { name: "Delaware", value: 917092 },
              { name: "District of Columbia", value: 632323 },
              { name: "Florida", value: 19317568 },
              { name: "Georgia", value: 9919945 },
              { name: "Hawaii", value: 1392313 },
              { name: "Idaho", value: 1595728 },
              { name: "Illinois", value: 12875255 },
              { name: "Indiana", value: 6537334 },
              { name: "Iowa", value: 3074186 },
              { name: "Kansas", value: 2885905 },
              { name: "Kentucky", value: 4380415 },
              { name: "Louisiana", value: 4601893 },
              { name: "Maine", value: 1329192 },
              { name: "Maryland", value: 5884563 },
              { name: "Massachusetts", value: 6646144 },
              { name: "Michigan", value: 9883360 },
              { name: "Minnesota", value: 5379139 },
              { name: "Mississippi", value: 2984926 },
              { name: "Missouri", value: 6021988 },
              { name: "Montana", value: 1005141 },
              { name: "Nebraska", value: 1855525 },
              { name: "Nevada", value: 2758931 },
              { name: "New Hampshire", value: 1320718 },
              { name: "New Jersey", value: 8864590 },
              { name: "New Mexico", value: 2085538 },
              { name: "New York", value: 19570261 },
              { name: "North Carolina", value: 9752073 },
              { name: "North Dakota", value: 699628 },
              { name: "Ohio", value: 11544225 },
              { name: "Oklahoma", value: 3814820 },
              { name: "Oregon", value: 3899353 },
              { name: "Pennsylvania", value: 12763536 },
              { name: "Rhode Island", value: 1050292 },
              { name: "South Carolina", value: 4723723 },
              { name: "South Dakota", value: 833354 },
              { name: "Tennessee", value: 6456243 },
              { name: "Texas", value: 26059203 },
              { name: "Utah", value: 2855287 },
              { name: "Vermont", value: 626011 },
              { name: "Virginia", value: 8185867 },
              { name: "Washington", value: 6897012 },
              { name: "West Virginia", value: 1855413 },
              { name: "Wisconsin", value: 5726398 },
              { name: "Wyoming", value: 576412 },
              { name: "Puerto Rico", value: 3667084 },
            ],
          },
        ],
      };

      echarts.registerMap("USA", usaJson, {
        Alaska: {
          // 把阿拉斯加移到美国主大陆左下方
          left: -131,
          top: 25,
          width: 15,
        },
        Hawaii: {
          left: -110, // 夏威夷
          top: 28,
          width: 5,
        },
        "Puerto Rico": {
          // 波多黎各
          left: -76,
          top: 26,
          width: 2,
        },
      });

      myChart.setOption(option);
    },
  },
  mounted() {
    this.handlePageCount(0);

    this.drawVisitChart();

    this.drawRatioChart();
    this.drawIPChart();
    this.queryChannel(0);
    this.queryFacility(0);
  },
};
</script>
