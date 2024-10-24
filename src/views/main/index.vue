<style lang="scss" scope>
.home-tab {
  .el-dialog {
    max-width: 800px;
  }
  .el-dialog__body {
    padding-top: 5px;
  }
}

.service {
  position: fixed;
  right: 30px;
  bottom: 15%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  z-index: 100;

  // 图标
  &-icon {
    position: relative;
    // animation: shadow 0.5s linear infinite;
    // animation: rotate 0.5s linear infinite;
    cursor: pointer;

    img {
      width: 75px;
      height: 75px;
    }
    i {
      width: 18px;
      height: 18px;
      background: red;
      border-radius: 50%;
      font-size: 12px;
      position: absolute;
      right: 3px;
      top: 10px;
      color: #fff;
      text-align: center;
      line-height: 18px;
    }
  }
}
</style>

<template>
  <section class="home">
    <!-- 消息提示 -->
    <div class="service">
      <div @click="hanldeIconClick" class="service-icon">
        <img src="@assets/images/service-icon.png" alt="" />
        <!-- <i v-if="msgNumber > 0">{{ msgNumber }}</i> -->
      </div>
    </div>

    <div class="home-wp">
      <div class="home-search">
        <el-input
          placeholder="请输入学员信息（姓名、手机、邮箱号）搜索"
          v-model="searchUser"
        ></el-input>
        <el-button type="warning" @click="handleSearchUser">搜 索</el-button>
      </div>

      <h5 class="home-title">管理入口</h5>
      <el-row :gutter="16" class="home-nav">
        <el-col :xs="8" :sm="4" :md="4" :lg="4" :xl="4">
          <div class="home-nav-item" @click="handleGoTo('MEMBER_LIST')">
            <div>
              <img src="@/assets/images/home-nav1.png" alt="" />
              <p>学员</p>
            </div>
          </div>
        </el-col>
        <el-col :xs="8" :sm="4" :md="4" :lg="4" :xl="4">
          <div
            class="home-nav-item"
            @click="handleGoTo('ORDER_REVENUE_STATIS')"
          >
            <div>
              <img src="@/assets/images/home-nav2.png" alt="" />
              <p>订单</p>
            </div>
          </div></el-col
        >
        <el-col :xs="8" :sm="4" :md="4" :lg="4" :xl="4">
          <div class="home-nav-item" @click="handleGoTo('COURSE_LIST')">
            <div>
              <img src="@/assets/images/home-nav3.png" alt="" />
              <p>课程</p>
            </div>
          </div></el-col
        >
        <el-col :xs="8" :sm="4" :md="4" :lg="4" :xl="4">
          <div
            class="home-nav-item"
            @click="handleGoTo('MAIN_SITE_STATISTICS')"
          >
            <div>
              <img src="@/assets/images/home-nav4.png" alt="" />
              <p>数据统计</p>
            </div>
          </div></el-col
        >
        <el-col :xs="8" :sm="4" :md="4" :lg="4" :xl="4">
          <div class="home-nav-item" @click="handleGoTo('MESSAGE_AFFICHE')">
            <div>
              <img src="@/assets/images/home-nav5.png" alt="" />
              <p>站点内容</p>
            </div>
          </div></el-col
        >
        <el-col :xs="8" :sm="4" :md="4" :lg="4" :xl="4">
          <div class="home-nav-item" @click="handleGoTo('SYSTEM_ADMIN')">
            <div>
              <img src="@/assets/images/home-nav6.png" alt="" />
              <p>后台设置</p>
            </div>
          </div></el-col
        >
      </el-row>

      <h5 class="home-title">重点报告</h5>
      <el-row :gutter="16" class="home-calendar" v-loading="loading">
        <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
          <div class="home-calendar-content">
            <el-calendar v-model="nowDate" id="calendar">
              <template slot="dateCell" slot-scope="{ date, data }">
                <div class="day" @click="handleOpenTab(data.day)">
                  <h5 class="day-time">
                    {{
                      data.day
                        .split("-")
                        .slice(2)
                        .join("-")
                    }}
                  </h5>
                  <div
                    v-for="(item, index) in monthData"
                    v-if="item.day == data.day"
                    :key="index"
                  >
                    <ul
                      class="day-item"
                      v-if="
                        item.day == data.day &&
                          showCalendarValue.indexOf('exam') > -1
                      "
                    >
                      <li
                        v-for="(exam, key) in item.appointmentData"
                        :key="key"
                        v-show="key < 3"
                      >
                        <el-tooltip effect="dark" placement="bottom">
                          <div slot="content">
                            <p>考试学员</p>
                            <p>
                              {{
                                exam.predict_label == 1
                                  ? "(预测通过)"
                                  : "(预测不通过)"
                              }}
                            </p>
                          </div>
                          <em
                            class="user"
                            @click.stop="
                              handleGoTo('MEMBER_DETAILS', exam.userid)
                            "
                            :class="{ on: exam.predict_label == 1 }"
                            >{{ exam.username || "-" }}</em
                          >
                        </el-tooltip>
                        <el-tooltip effect="dark" placement="bottom">
                          <div slot="content">
                            <p>{{ handleExamType(exam.tpapisadopt).text }}</p>
                          </div>
                          <i :class="handleExamType(exam.tpapisadopt).icon"></i>
                        </el-tooltip>
                      </li>
                    </ul>
                    <ul
                      class="day-item"
                      v-if="
                        item.day == data.day &&
                          showCalendarValue.indexOf('order') > -1
                      "
                    >
                      <li
                        v-for="(order, key) in item.orderList"
                        :key="key"
                        v-show="key < 2"
                      >
                        <el-tooltip effect="dark" placement="bottom">
                          <div slot="content">
                            <p>
                              {{
                                "订单：" + handleOrderType(order.category).text
                              }}
                            </p>
                          </div>
                          <div>
                            <em
                              @click="
                                handleGoTo('MEMBER_DETAILS', order.userid)
                              "
                              class="user buy"
                            >
                              {{ order.username || "-" }}
                            </em>
                            <span class="hint">{{
                              handleOrderType(order.category).simple
                            }}</span>
                          </div>
                        </el-tooltip>
                      </li>
                    </ul>
                    <span
                      v-if="
                        item.day == data.day &&
                          showCalendarValue.length > 0 &&
                          (item.orderList.length > 2 ||
                            item.appointmentData.length > 3)
                      "
                      class="day-item-more"
                      >更多</span
                    >
                  </div>
                </div>
              </template>
            </el-calendar>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
          <div class="home-calendar-condition">
            <el-checkbox-group v-model="showCalendarValue" size="small">
              <el-checkbox label="exam" border>考试情况</el-checkbox>
              <el-checkbox class="btn" label="order" border
                >订单情况</el-checkbox
              >
            </el-checkbox-group>
            <ul class="exam">
              <li>
                <div class="exam-left">
                  <h5>{{ nowMonth }} 月考过人数</h5>
                  <p>
                    <img
                      v-if="examConst.disLastCount > 0"
                      src="@/assets/images/home-icon-up.png"
                      alt=""
                    />
                    <img
                      v-else
                      src="@/assets/images/home-icon-dowp.png"
                      alt=""
                    />
                    <em :class="{ on: examConst.disLastCount > 0 }">
                      {{
                        examConst.disLastTcPercent
                          ? Math.floor(
                              Math.abs(examConst.disLastTcPercent) * 10000
                            ) / 100
                          : 0
                      }}％</em
                    >
                  </p>
                </div>
                <div class="exam-right">
                  <h4>{{ examConst.tcCount || 0 }}</h4>
                  <span>人</span>
                </div>
              </li>
              <li>
                <div class="exam-left">
                  <h5>{{ nowMonth }} 月考试通过率</h5>
                  <h5 class="on">(排除预测不通过)</h5>
                  <p>
                    <img
                      v-if="
                        examConst.ycNoPassPercent -
                          examConst.ycNoPassLastPercent >
                          0
                      "
                      src="@/assets/images/home-icon-up.png"
                      alt=""
                    />
                    <img
                      v-else
                      src="@/assets/images/home-icon-dowp.png"
                      alt=""
                    />
                    <em
                      :class="{
                        on:
                          examConst.ycNoPassPercent -
                            examConst.ycNoPassLastPercent >
                          0,
                      }"
                    >
                      {{
                        examConst.ycNoPassPercent &&
                        examConst.ycNoPassLastPercent
                          ? Math.floor(
                              Math.abs(
                                examConst.ycNoPassPercent -
                                  examConst.ycNoPassLastPercent
                              ) * 10000
                            ) /
                              100 -
                            3
                          : 0
                      }}％</em
                    >
                  </p>
                </div>
                <div class="exam-right">
                  <h4>
                    {{
                      examConst.tcPercent
                        ? Math.floor(examConst.tcPercent * 10000) / 100
                        : 0
                    }}
                  </h4>
                  <span>%</span>
                </div>
              </li>
            </ul>
            <div class="forecast">
              <h5>昨日学习考试预测</h5>
              <ul v-if="lastDayYc.length > 0">
                <li
                  v-for="(item, index) in lastDayYc"
                  :key="index"
                  v-show="index <= forecastLength"
                >
                  <em @click="handleGoTo('MEMBER_DETAILS', item.userid)">{{
                    item.username
                  }}</em>
                  <span
                    >{{ item.predict_label == 1 ? "通过" : "不通过" }}（{{
                      Math.floor(item.predict_score * 1000) / 10
                    }}%）</span
                  >
                </li>
              </ul>
              <div class="forecast-null" v-else>无</div>
              <span
                @click="handleForecastLengthMore"
                v-if="lastDayYc.length >= 5"
                class="forecast-more"
                >更多</span
              >
            </div>
            <ul class="exam on">
              <li>
                <div class="exam-left">
                  <h5>{{ nowMonth }} 月新购课学员数</h5>
                  <p>
                    <img
                      v-if="orderConst.disLastNewBuy > 0"
                      src="@/assets/images/home-icon-up.png"
                      alt=""
                    />
                    <img
                      v-else
                      src="@/assets/images/home-icon-dowp.png"
                      alt=""
                    />
                    <em :class="{ on: orderConst.disLastNewBuy > 0 }">
                      {{
                        orderConst.disLastNewBuyPercent
                          ? Math.floor(
                              Math.abs(orderConst.disLastNewBuyPercent) * 10000
                            ) / 100
                          : 0
                      }}％</em
                    >
                  </p>
                </div>
                <div class="exam-right">
                  <h4>{{ orderConst.newbuy || 0 }}</h4>
                  <span>人</span>
                </div>
              </li>
              <li>
                <div class="exam-left">
                  <h5>{{ nowMonth }} 月续费学员数</h5>
                  <p>
                    <img
                      v-if="orderConst.disLastXufei > 0"
                      src="@/assets/images/home-icon-up.png"
                      alt=""
                    />
                    <img
                      v-else
                      src="@/assets/images/home-icon-dowp.png"
                      alt=""
                    />
                    <em :class="{ on: orderConst.disLastXufei > 0 }">
                      {{
                        orderConst.disLastXufeiPercent
                          ? Math.floor(
                              Math.abs(orderConst.disLastXufeiPercent) * 10000
                            ) / 100
                          : 0
                      }}％</em
                    >
                  </p>
                </div>
                <div class="exam-right">
                  <h4>
                    {{ orderConst.xufeibuy || 0 }}
                  </h4>
                  <span>人</span>
                </div>
              </li>
            </ul>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 考试预约 -->
    <el-dialog
      title="考试预约"
      width="90%"
      :visible.sync="makeDialogVisible"
      class="home-exam"
      :before-close="handleExamStatusClose"
    >
      <div class="public-dialog-wp">
        <el-table
          :data="untreatedExamList"
          border
          style="width: 100%"
          empty-text="暂无考试预约记录"
          @selection-change="handleSelectionChange"
          @cell-click="handleCellClick"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column align="center" prop="username" label="姓名">
            <template slot-scope="scope">
              <div class="table-column">
                {{ scope.row.yibei_member && scope.row.yibei_member.username }}
              </div>
            </template></el-table-column
          >
          <el-table-column prop="tpapdate" label="预约考试时间" align="center">
            <template slot-scope="scope">
              {{ scope.row.tpapdate | formatDateNoZone("YYYY-MM-DD") }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="tpapisadopt" label="是否考过">
            <template>
              未处理
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="tpapremark"
            label="备注"
          ></el-table-column>
        </el-table>
      </div>
      <div slot="footer">
        <div class="home-exam-footer">
          <el-radio-group v-model="makeRadio">
            <el-radio :label="1">已考过</el-radio>
            <el-radio :label="2">未考过</el-radio>
          </el-radio-group>
          <div>
            <el-button
              @click="makeDialogVisible = false"
              class="hidden-xs-only"
              size="medium"
              >取 消</el-button
            >
            <el-button type="primary" @click="handleExamStatus" size="medium"
              >提 交</el-button
            >
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- tab弹窗 -->
    <el-dialog
      :title="tabDialogData.title"
      width="90%"
      :visible.sync="tabDialogData.visible"
      class="home-tab"
      :before-close="handleExamStatusClose"
    >
      <div class="public-dialog-wp">
        <el-tabs v-model="activeName">
          <el-tab-pane label="考试情况" name="first">
            <el-table
              :data="tabDialogData.examData"
              border
              style="width: 100%"
              empty-text="暂无考试预约记录"
              @selection-change="handleSelectionChange"
              @cell-click="handleCellClick"
            >
              <el-table-column align="center" prop="username" label="学员">
              </el-table-column>
              <el-table-column
                prop="predict_label"
                label="考试预测"
                align="center"
              >
                <template slot-scope="scope">
                  {{ scope.row.predict_label == 1 ? "通过" : "不通过" }}
                  （{{ Math.floor(scope.row.predict_score * 1000) / 10 }}%）
                </template>
              </el-table-column>
              <el-table-column
                prop="tpapisadopt"
                label="考试结果"
                align="center"
              >
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.tpapisadopt == 1" type="success"
                    >通过</el-tag
                  >
                  <el-tag v-else-if="scope.row.tpapisadopt == 0" type="danger"
                    >未通过</el-tag
                  >
                  <span v-else>-</span>
                  <!-- <el-button
                    v-else
                    @click="makeDialogVisible = true"
                    type="text"
                    size="small"
                    >完善考试记录</el-button
                  > -->
                </template>
              </el-table-column>
              <el-table-column align="center" prop="tpapisadopt" label="操作">
                <template slot-scope="scope">
                  <el-button
                    @click="handleGoTo('MEMBER_DETAILS', scope.row.userid)"
                    type="text"
                    size="small"
                    >查看学员</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="考试预测" name="second"
            ><el-table
              :data="tabDialogData.forecastData"
              border
              style="width: 100%"
              empty-text="暂无考试预约记录"
              @selection-change="handleSelectionChange"
              @cell-click="handleCellClick"
            >
              <el-table-column align="center" prop="username" label="学员">
              </el-table-column>
              <el-table-column
                prop="predict_label"
                label="考试预测"
                align="center"
              >
                <template slot-scope="scope">
                  {{ scope.row.predict_label == 1 ? "通过" : "不通过" }}
                  （{{ Math.floor(scope.row.predict_score * 1000) / 10 }}%）
                </template>
              </el-table-column>
              <el-table-column align="center" prop="tpapisadopt" label="操作">
                <template slot-scope="scope">
                  <el-button
                    @click="handleGoTo('MEMBER_DETAILS', scope.row.userid)"
                    type="text"
                    size="small"
                    >查看学员</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="订单情况" name="third"
            ><el-table
              :data="tabDialogData.orderList"
              border
              style="width: 100%"
              empty-text="暂无考试预约记录"
              @selection-change="handleSelectionChange"
              @cell-click="handleCellClick"
            >
              <el-table-column align="center" prop="username" label="学员">
              </el-table-column>
              <el-table-column prop="tpapdate" label="订单类型" align="center">
                <template slot-scope="scope">
                  {{ handleOrderType(scope.row.category).text }}
                </template>
              </el-table-column>
              <el-table-column align="center" prop="tpapisadopt" label="操作">
                <template slot-scope="scope">
                  <el-button
                    @click="handleGoTo('MEMBER_DETAILS', scope.row.userid)"
                    type="text"
                    size="small"
                    >查看学员</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="tabDialogData.visible = false"
          >关闭</el-button
        >
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { formatDateNoTimezone } from "@utils/tools";
import {
  getUntreatedExamList,
  updateBatchExamStatus,
  getMemberPayOrYcStatics,
} from "@api/member";

export default {
  components: {},
  data() {
    return {
      // 未处理的预约考试
      untreatedExamList: [],
      makeDialogVisible: false,
      makeRadio: null,
      examSelection: [],

      // 搜索
      searchUser: "",

      // 日历相关
      nowDate: new Date(),
      lastDate: new Date(),
      nowMonth: formatDateNoTimezone(new Date(), "M"),
      showCalendarValue: ["exam", "order"],
      loading: false,
      monthData: [], // 月度数据
      examConst: {}, // 考试统计
      lastDayYc: [], // 昨日考试预测数据
      orderConst: {}, // 订单数据
      activeName: "first",
      tabDialogData: {
        title: "",
        visible: false,
        orderList: [],
        examData: [],
        forecastData: [],
      },
      forecastLength: 5,
    };
  },

  created() {
    this.queryMemberPayOrYcStatics();
    this.queryUntreatedExamList();
  },

  watch: {
    nowDate(newVal, oldVal) {
      if (
        formatDateNoTimezone(this.lastDate, "YYYY-MM") !=
        formatDateNoTimezone(newVal, "YYYY-MM")
      ) {
        this.lastDate = newVal;
        this.nowMonth = formatDateNoTimezone(newVal, "M");
        this.queryMemberPayOrYcStatics();
      }
    },
  },

  mounted() {
    // this.$nextTick(() => {
    //   // 点击前一个月
    //   const prevBtn = document.querySelector(
    //     ".el-calendar__button-group .el-button-group>button:nth-child(1)"
    //   );
    //   prevBtn.addEventListener("click", () => {
    //     console.log(1111);
    //   });
    // });
    // this.$nextTick(() => {
    //   // 点击后一个月
    //   const nextBtn = document.querySelector(
    //     ".el-calendar__button-group .el-button-group>button:last-child"
    //   );
    //   nextBtn.addEventListener("click", () => {
    //     console.log(22222);
    //   });
    // });
  },

  methods: {
    /**
     * 获取日历数据
     */
    async queryMemberPayOrYcStatics() {
      this.loading = true;
      const year = formatDateNoTimezone(this.nowDate, "YYYY");
      const month = formatDateNoTimezone(this.nowDate, "M");

      const { data: resData } = await getMemberPayOrYcStatics({
        year,
        month,
      });
      this.loading = false;
      // if (!resData.status) return;

      this.monthData = resData.data.monthData.map((item) => {
        item.day = formatDateNoTimezone(
          `${item.year}-${item.month}-${item.date}`,
          "YYYY-MM-DD"
        );

        return item;
      });
      this.examConst = resData.data.appointconst;
      this.lastDayYc = resData.data.lastDayYc;
      this.orderConst = resData.data.orderConst;
    },

    /**
     * 获取考试类型
     */
    handleExamType(type) {
      switch (type) {
        case 1:
          return {
            text: "通过考试",
            icon: "el-icon-success",
          };

        case 2:
          return {
            text: "未通过考试",
            icon: "el-icon-error",
          };

        default:
          return {
            text: "考试结果未知",
            icon: "el-icon-question",
          };
      }
    },

    /**
     * 获取订单类型
     */
    handleOrderType(type) {
      switch (type) {
        case 0:
          return {
            text: "购课",
            simple: "(购)",
          };

        case 1:
          return {
            text: "续费",
            simple: "(续)",
          };

        case 2:
          return {
            text: "执照申请",
            simple: "(执)",
          };

        default:
          return {
            text: "--",
            simple: "(-)",
          };
      }
    },

    /**
     * 处理是否显示更多
     */
    handleShowMore() {},

    /**
     * 搜索学员
     */
    handleSearchUser() {
      if (!this.searchUser) return;

      this.$router.push({
        name: "MEMBER_LIST",
        query: {
          keyword: this.searchUser,
        },
      });
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

    /**
     * 处理更多长度
     */
    handleForecastLengthMore() {
      if (this.forecastLength == 5) {
        this.forecastLength = 100;
      } else {
        this.forecastLength = 5;
      }
    },

    /**
     * 打开tab页
     */
    handleOpenTab(day) {
      const title = formatDateNoTimezone(day, "YYYY 年 MM 月 DD 日");

      const row = this.monthData.find((item) => item.day == day);

      this.tabDialogData = {
        visible: true,
        title,
        orderList: row.orderList,
        examData: row.appointmentData,
        forecastData: row.appointmentData,
      };
    },

    /**
     * 处理单元格点击
     */
    handleCellClick(row, column, cell, event) {
      if (column.property == "username")
        this.$router.push({
          name: "MEMBER_DETAILS",
          query: {
            id: row.memberid,
          },
        });
    },

    /**
     * 聊天
     */
    hanldeIconClick() {
      this.$router.push({
        name: "MAIN_IM",
      });
    },

    /**
     * 获取未处理的预约考试列表
     */
    async queryUntreatedExamList(isShowConfirm = 1) {
      const { data: resData } = await getUntreatedExamList();
      if (!resData.data.status) return;

      this.untreatedExamList = resData.data.data;

      if (this.untreatedExamList.length > 0 && isShowConfirm == 1)
        this.$confirm("发现有学员的预约状态未处理！", "提示", {
          confirmButtonText: "马上处理",
          cancelButtonText: "稍后再说",
          type: "warning",
        })
          .then(async () => {
            this.makeDialogVisible = true;
          })
          .catch(() => {});
    },

    /**
     * 处理预约考试列表-复选的
     */
    handleSelectionChange(val) {
      this.examSelection = val;
    },

    /**
     * 批量修改预约考试状态
     */
    async handleExamStatus(val) {
      if (!this.makeRadio) return this.$message.error("请选择是否考过");

      if (this.examSelection.length < 1)
        return this.$message.error("请选择预计考试记录");

      // id 字符串
      const ids = this.examSelection.map((item) => item.id);

      const { data: resData } = await updateBatchExamStatus({
        ids: ids.join(","),
        tpapisadopt: this.makeRadio,
      });
      if (!resData.data.status) return;

      this.queryUntreatedExamList(0);
      this.queryWeekExamList();
      this.$message.success("操作成功！");
      this.makeRadio = "";
      this.examSelection = [];
    },

    /**
     * 关闭弹框
     */
    handleExamStatusClose() {
      this.makeRadio = "";
      this.examSelection = [];
      this.makeDialogVisible = false;
      this.tabDialogData.visible = false;
    },
  },
};
</script>
