<style lang="scss" scope>
.order-revenue {
  width: calc(100% - 6px);
  margin: auto;
}
</style>

<template>
  <section class="public-wp">
    <TabsNav :list="tabsNavList" />

    <el-tabs
      v-model="activeName"
      type="card"
      @tab-click="handleClick"
      style="margin-top: 20px"
    >
      <el-tab-pane label="站点统计" name="all">
        <!-- 访问量 -->
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <div class="order-revenue" v-loading="chartLoading">
              <div
                class="order-revenue-statis"
                style="margin-top: 4px;padding-bottom:20px"
              >
                <div class="title">
                  <h5>访问量</h5>
                  <ul class="title-btn">
                    <li
                      v-for="(name, key) in categoryList"
                      :key="key"
                      @click="handleTabsClick(key, 'order')"
                      :class="{ on: category == key }"
                    >
                      {{ name }}
                    </li>
                  </ul>
                </div>
                <div
                  id="orderChart"
                  :style="{
                    width: '860px',
                    maxWidth: '100%',
                    height: '560px',
                    margin: 'auto',
                  }"
                ></div>
              </div>
            </div>
          </el-col>
        </el-row>
        <!-- 渠道 -->
        <el-row style="margin-top: 30px" :gutter="20">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="order-revenue" v-loading="channelLoading">
              <div class="order-revenue-statis" style="margin-bottom: 6px;">
                <div class="title">
                  <h5>注册渠道</h5>
                  <ul class="title-btn">
                    <li
                      v-for="(name, key) in categoryList"
                      :key="key"
                      @click="handleTabsClick(key, 'channel')"
                      :class="{ on: channelType == key }"
                    >
                      {{ name }}
                    </li>
                  </ul>
                </div>
                <div
                  id="ditchChart"
                  :style="{
                    height: '350px',
                    margin: 'auto',
                  }"
                ></div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="order-revenue" v-loading="facilityLoading">
              <div class="order-revenue-statis" style="margin-bottom: 6px;">
                <div class="title">
                  <h5>访问设备</h5>
                  <ul class="title-btn">
                    <li
                      v-for="(name, key) in categoryList"
                      :key="key"
                      @click="handleTabsClick(key, 'facility')"
                      :class="{ on: facilityType == key }"
                    >
                      {{ name }}
                    </li>
                  </ul>
                </div>
                <div
                  id="facilityChart"
                  :style="{
                    height: '350px',
                    margin: 'auto',
                  }"
                ></div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="常用/跳出页面" name="exam">
        <!-- 用户经常访问的页面 -->
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <div
              class="order-revenue"
              v-loading="visitLoading"
              style="margin-bottom: 30px;"
            >
              <div
                class="order-revenue-statis"
                style="margin-top: 4px;padding-bottom:20px"
              >
                <div class="title" style="margin-bottom: 20px;">
                  <h5>用户经常访问的页面</h5>
                </div>
                <div
                  id="visitChart"
                  :style="{
                    width: '1160px',
                    maxWidth: '100%',
                    margin: 'auto',
                    height: '410px',
                  }"
                ></div>
              </div>
            </div>
          </el-col>
        </el-row>
        <!-- 跳出率高的页面 -->
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <div class="order-revenue" v-loading="jumpLoading">
              <div
                class="order-revenue-statis"
                style="margin-top: 4px;padding-bottom:20px"
              >
                <div class="title" style="margin-bottom: 20px;">
                  <h5>跳出率高的页面</h5>
                </div>
                <div
                  id="jumpChart"
                  :style="{
                    height: '410px',
                    width: '1160px',
                    maxWidth: '100%',
                    margin: 'auto',
                  }"
                ></div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
import { formatDateTime } from "@utils/tools";
import TabsNav from "@comp/TabsNav";
import echarts from "echarts";
import dayjs from "moment-timezone";
import {
  getReviewmostFive,
  getMmostredirectPage,
  getRegisterChannelStatics,
  getReviewmosFacility,
  getViewConstStatics,
} from "@api/main";

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
        { name: "站点统计", path: "/main/siteStatistics" },
        { name: "数据列表", path: "/main/dataStatistics" },
      ],

      activeName: "all",

      category: 1, //  0：周，1：月，2：季度，3：年
      categoryList: {
        0: "周",
        1: "月",
        2: "季",
        3: "年",
      },
      chartLoading: true,
      currentOrderInfo: {},
      lastOrderInfo: {},
      orderChart: null,
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

      channelObj: {
        0: "直接访问",
        1: "YouTube",
        2: "微信公众号",
      },
      channelLoading: true,
      channelType: 1, // 0:周 1：月 2：季度 3：年

      facilityObj: {
        1: "电脑访问",
        2: "手机访问",
        3: "平板访问",
      },
      facilityLoading: true,
      facilityType: 1, // 0:周 1：月 2：季度 3：年

      visitLoading: true,

      jumpLoading: true,
    };
  },

  created() {},

  mounted() {
    // 初始化用户访问量
    this.orderChart = echarts.init(document.getElementById("orderChart"));

    // 初始化注册渠道
    this.channelChart = echarts.init(document.getElementById("ditchChart"));

    // 初始化访问设备
    this.facilityChart = echarts.init(document.getElementById("facilityChart"));

    this.drawOrderChart();
    this.queryChannel();
    this.queryFacility();
  },

  methods: {
    dayjs,

    handleClick(tab, event) {
      if (this.activeName != "exam") return;
      if (this.visitChart && this.jumpChart) return;

      setTimeout(() => {
        // 初始化用户访问页面统计
        this.visitChart = echarts.init(document.getElementById("visitChart"));

        // 初始化用户访问页面统计
        this.jumpChart = echarts.init(document.getElementById("jumpChart"));

        this.queryMmostredirect();
        this.queryReviewmostFive();
      }, 100);
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
    handleTabsClick(key, type) {
      switch (type) {
        case "order":
          this.category = key;
          this.drawOrderChart();
          break;

        case "channel":
          this.channelType = key;
          this.queryChannel();
          break;

        case "facility":
          this.facilityType = key;
          this.queryFacility();
          break;

        default:
          break;
      }
    },

    /**
     * 访问量统计
     */
    async drawOrderChart() {
      this.chartLoading = true;

      const { data: resData } = await getViewConstStatics({
        category: this.category,
      });
      this.chartLoading = false;
      if (!resData.data.status) return;

      // 图表数据
      const chartData = resData.data.data;

      const seriesData = [],
        legendData = this.legendDataList[this.category];

      // 本月的数据
      if (chartData.currentdata) {
        const currentData = [];

        for (const key in chartData.currentdata) {
          currentData.push(chartData.currentdata[key] || 0);
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
      if (chartData.lastdata) {
        const lastData = [];

        for (const key in chartData.lastdata) {
          lastData.push(chartData.lastdata[key] || 0);
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
          name: "访问量（次）",
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
      this.orderChart.setOption(option);
    },

    /**
     * 用户来源（渠道）
     */
    drawChannelChart(seriesData, legendData) {
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          bottom: 10,
          left: "center",
          icon: "circle",
          data: legendData,
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

      this.channelChart.setOption(option);
    },

    /**
     * 用户访问（渠道）
     */
    async queryChannel() {
      this.channelLoading = true;
      const { data: resData } = await getRegisterChannelStatics(
        this.channelType
      );
      this.channelLoading = false;
      if (!resData.data.status) return;

      const channelCategory = {
        directaddress: "网址注册",
        mpwx: "微信公众号",
        youtube: "YouTube",
      };
      const legendData = [];
      const seriesData = resData.data.data.map((item) => {
        legendData.push(channelCategory[item.channel]);
        return {
          value: item.membercount,
          name: channelCategory[item.channel],
        };
      });

      this.drawChannelChart(seriesData);
    },

    /**
     * 用户访问（访问设备）
     */
    drawFacilityChart(seriesData, legendData) {
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          bottom: 10,
          left: "center",
          icon: "circle",
          data: legendData,
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

      this.facilityChart.setOption(option);
    },

    /**
     * 用户访问（访问设备）
     */
    async queryFacility() {
      this.facilityLoading = true;
      const { data: resData } = await getReviewmosFacility(this.facilityType);
      this.facilityLoading = false;
      if (!resData.data.status) return;

      const legendData = [];
      let resSeriesData = resData.data.data.map((item) => {
        legendData.push(this.facilityObj[item.category]);
        return {
          value: item.reviewcount,
          name: item.category,
        };
      });

      this.drawFacilityChart(resSeriesData, legendData);
    },

    /**
     * 用户访问页面统计
     */
    async queryReviewmostFive() {
      this.visitLoading = true;
      const { data: resData } = await getReviewmostFive();
      this.visitLoading = false;
      if (!resData.data.status) return;

      const xAxis = resData.data.data.map((a) => a.pagename);
      const yAxis = resData.data.data.map((a) => a.viewcount);

      this.drawPageChart(xAxis, yAxis, this.visitChart);
    },

    /**
     * 跳出率高的页面
     */
    async queryMmostredirect() {
      this.jumpLoading = true;
      const { data: resData } = await getMmostredirectPage();
      this.jumpLoading = false;
      if (!resData.data.status) return;

      const xAxis = resData.data.data.map((a) => a.pagename);
      const yAxis = resData.data.data.map((a) => a.staytimecount);

      this.drawPageChart(xAxis, yAxis, this.jumpChart);
    },

    /**
     * 用户访问页面统计
     */
    drawPageChart(xAxis, yAxis, myChart) {
      let option = {
        color: ["#007AFF"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "65px",
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
            // name: "直接访问",
            type: "bar",
            barWidth: "30%",
            data: yAxis,
          },
        ],
      };

      myChart.setOption(option);
    },
  },
};
</script>
