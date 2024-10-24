<style lang="scss" scope></style>

<template>
  <section class="home">
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
      <el-row :gutter="16" class="home-report">
        <el-col
          :xs="24"
          :sm="12"
          :md="12"
          :lg="12"
          :xl="12"
          v-loading="examLoading"
        >
          <el-collapse class="home-report-item" v-model="activeExam">
            <el-collapse-item title="考试情况 (本周)" name="1">
              <ul class="week" ref="refExam" :style="{ height: height }">
                <li v-for="(item, index) in examList" :key="index">
                  <em class="week-title" :class="{ on: item.nowDate }">{{
                    weekList[index]
                  }}</em>
                  <p class="week-time">
                    {{ item.date | formatDateNoZone("M/DD") }}
                  </p>
                  <dl class="week-list">
                    <dd
                      v-for="(son, index) in item.data"
                      :key="index"
                      @click="handleGoTo('MEMBER_DETAILS', son.memberid)"
                    >
                      <span>{{ son.username }}</span>
                      <p>{{ hanldeExamType(son.tpapisadopt) }}</p>
                    </dd>
                  </dl>
                </li>
              </ul>
              <ul class="statistics">
                <li>
                  <p>本周考过人数</p>
                  <h5>{{ examInfo.weekCount }}<em>人</em></h5>
                  <div class="statistics-bight">
                    <img
                      v-if="examInfo.monthpassRateCurve"
                      src="@/assets/images/home-icon-up.png"
                      alt=""
                    />
                    <img
                      v-else
                      src="@/assets/images/home-icon-dowp.png"
                      alt=""
                    />
                    <span :class="{ up: examInfo.monthpassRateCurve }"
                      >{{ examInfo.weekPassRate }}％</span
                    >
                  </div>
                </li>
                <li>
                  <p>本月考过人数</p>
                  <h5>{{ examInfo.monthTg }}<em>人</em></h5>
                  <div class="statistics-bight">
                    <img
                      v-if="examInfo.monthpassRateCurve"
                      src="@/assets/images/home-icon-up.png"
                      alt=""
                    />
                    <img
                      v-else
                      src="@/assets/images/home-icon-dowp.png"
                      alt=""
                    />
                    <span :class="{ up: examInfo.monthpassRateCurve }"
                      >{{ examInfo.monthPassRate }}％</span
                    >
                  </div>
                </li>
                <li>
                  <p>本月考试通过率</p>
                  <h5>{{ examInfo.passRate }}<em>%</em></h5>
                  <div class="statistics-bight">
                    <img
                      v-if="examInfo.passRateCurve"
                      src="@/assets/images/home-icon-up.png"
                      alt=""
                    />
                    <img
                      v-else
                      src="@/assets/images/home-icon-dowp.png"
                      alt=""
                    />
                    <span :class="{ up: examInfo.passRateCurve }"
                      >{{ examInfo.passRateAbs }}％</span
                    >
                  </div>
                </li>
              </ul>
            </el-collapse-item>
          </el-collapse>
        </el-col>
        <el-col
          :xs="24"
          :sm="12"
          :md="12"
          :lg="12"
          :xl="12"
          v-loading="orderLoading"
        >
          <el-collapse
            class="home-report-item home-report-item--order"
            v-model="activeReport"
          >
            <el-collapse-item title="订单情况 (本周)" name="1">
              <ul class="week" ref="refOrder" :style="{ height: height }">
                <li v-for="(item, index) in orderList" :key="index">
                  <em class="week-title" :class="{ on: item.nowDate }">{{
                    weekList[index]
                  }}</em>
                  <p class="week-time">
                    {{ item.date | formatDateNoZone("M/DD") }}
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
              <ul class="statistics">
                <li style="width:50%">
                  <p>本周新购课学员数</p>
                  <h5>{{ orderInfo.weekXg }}<em>人</em></h5>
                  <div class="statistics-bight">
                    <img
                      v-if="orderInfo.gmRateCurve"
                      src="@/assets/images/home-icon-up.png"
                      alt=""
                    />
                    <img
                      v-else
                      src="@/assets/images/home-icon-dowp.png"
                      alt=""
                    />
                    <span :class="{ up: orderInfo.gmRateCurve }"
                      >{{ orderInfo.gmRate }}％</span
                    >
                  </div>
                </li>
                <li style="width:50%">
                  <p>本周续费学员数</p>
                  <h5>{{ orderInfo.weekXf }}<em>人</em></h5>
                  <div class="statistics-bight">
                    <img
                      v-if="orderInfo.xfRateCurve"
                      src="@/assets/images/home-icon-up.png"
                      alt=""
                    />
                    <img
                      v-else
                      src="@/assets/images/home-icon-dowp.png"
                      alt=""
                    />
                    <span :class="{ up: orderInfo.xfRateCurve }"
                      >{{ orderInfo.xfRate }}％</span
                    >
                  </div>
                </li>
              </ul>
            </el-collapse-item>
          </el-collapse>
        </el-col>
        <el-col
          :xs="24"
          :sm="12"
          :md="12"
          :lg="12"
          :xl="12"
          v-loading="orderLoading"
        >
          <el-collapse
            class="home-report-item home-report-item--forecast"
            v-model="activeForecast"
          >
            <el-collapse-item title="考试预测（本周）" name="1">
              <div class="forecast" v-loading="passLoading">
                <div class="forecast-title">
                  <img src="@/assets/images/home-icon-up.png" alt="" />
                  <span class="up">上升最多5名</span>
                </div>
                <ul class="forecast-user">
                  <li v-for="(item, index) in passInfo.upData" :key="index">
                    <span>
                      (上升 {{ Math.floor(item.disdb * 10000) / 100 }}%，
                      考试预测
                      {{
                        Math.floor(item.currentaiyctgtime * 10000) / 100
                      }}%)</span
                    >
                    <em @click="handleGoTo('MEMBER_DETAILS', item.userid)">{{
                      item.username
                    }}</em>
                  </li>
                </ul>
                <div class="forecast-title">
                  <img src="@/assets/images/home-icon-dowp.png" alt="" />
                  <span>下降最多5名</span>
                </div>
                <ul class="forecast-user" style="border:0">
                  <li v-for="(item, index) in passInfo.downData" :key="index">
                    <span>
                      (下降 {{ Math.floor(item.disdb * 10000) / 100 }}%，
                      考试预测{{
                        Math.floor(item.currentaiyctgtime * 10000) / 100
                      }}%)</span
                    >
                    <em @click="handleGoTo('MEMBER_DETAILS', item.userid)">{{
                      item.username
                    }}</em>
                  </li>
                </ul>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>
    </div>

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
          <el-table-column
            align="center"
            prop="username"
            label="姓名"
            width="110"
          >
            <template slot-scope="scope">
              <div class="table-column">
                {{ scope.row.yibei_member && scope.row.yibei_member.username }}
              </div>
            </template></el-table-column
          >
          <el-table-column
            prop="tpapdate"
            label="预约考试时间"
            align="center"
            width="110"
          >
            <template slot-scope="scope">
              {{ scope.row.tpapdate | formatDateNoZone("YYYY-MM-DD") }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="tpapisadopt"
            label="是否考过"
            width="100"
          >
            <template slot-scope="scope">
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
  </section>
</template>

<script>
import { formatDateNoTimezone } from "@utils/tools";
import { getWeekMemberExamList, getPassStaticsConst } from "@api/user";
import { getUntreatedExamList, updateBatchExamStatus } from "@api/member";
import { getWeekMemberOrderList } from "@api/order";

export default {
  components: {},
  data() {
    return {
      activeExam: ["1"],
      activeReport: ["1"],
      activeForecast: ["1"],

      height: 71,

      searchUser: "",

      weekList: ["S", "M", "T", "W", "T", "F", "S"],

      examLoading: true,
      examList: [],
      examInfo: { weekCount: 0, monthTg: 0, monthAll: 0 },

      orderLoading: true,
      orderList: [],
      orderInfo: {
        weekXg: 0,
        weekXf: 0,
      },

      passLoading: true,
      passInfo: {
        upData: [],
        downData: [],
      },

      // 未处理的预约考试
      untreatedExamList: [],
      makeDialogVisible: false,
      makeRadio: null,
      examSelection: [],
    };
  },

  created() {
    this.queryPassStaticsConst();
    this.queryUntreatedExamList();
  },

  mounted() {
    Promise.all([this.queryWeekExamList(), this.queryWeekOrderList()])
      .then((result) => {
        this.$nextTick(() => {
          const windowWidth = document.documentElement.clientWidth;

          // 设置两边等高 屏幕宽度 大于 768
          if (windowWidth > 768) {
            const examHeight = this.$refs.refExam.offsetHeight;
            const orderHeight = this.$refs.refOrder.offsetHeight;
            if (examHeight - orderHeight > 0) {
              this.height = examHeight + "px";
            } else {
              this.height = orderHeight + "px";
            }
          }
        });
      })
      .catch((error) => {
        console.log(456, error);
      });
  },

  methods: {
    /**
     * 获取考试列表（本周）
     */
    async queryWeekExamList() {
      const { data: resData } = await getWeekMemberExamList();
      this.examLoading = false;
      if (!resData.data.status) return;

      // 列表信息
      const arr = resData.data.data.map((item) => {
        return {
          ...item,
          nowDate:
            formatDateNoTimezone(item.date, "MM-DD") ==
            formatDateNoTimezone(new Date(), "MM-DD"),
        };
      });
      this.examList = arr.sort(
        (a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)
      );
      // this.examList.shift(); // 删除第一项

      // 统计信息
      const anaData = resData.data.anaData;

      // 本月考试通过率
      const passRate =
        anaData.monthAll > 0
          ? Math.floor((anaData.monthTg / anaData.monthAll) * 1000) / 10
          : 0;

      // 上月考试通过率
      const passRateOld =
        anaData.lastWeekCount > 0
          ? Math.floor((anaData.lastMonthTg / anaData.lastWeekCount) * 1000) /
            10
          : 0;

      // 本月考过率
      let monthPassRate = 0;
      if (anaData.lastMonthTg > 0 && anaData.lastMonthTg - anaData.monthTg > 0)
        monthPassRate =
          Math.floor((1 - anaData.monthTg / anaData.lastMonthTg) * 1000) / 10;

      if (anaData.monthTg > 0 && anaData.lastMonthTg - anaData.monthTg < 0)
        monthPassRate =
          Math.floor((1 - anaData.lastMonthTg / anaData.monthTg) * 1000) / 10;

      // 本周考过率
      let weekPassRate = 0;
      if (
        anaData.lastWeekCount > 0 &&
        anaData.lastWeekCount - anaData.weekCount > 0
      )
        weekPassRate =
          Math.floor((1 - anaData.weekCount / anaData.lastWeekCount) * 1000) /
          10;

      if (
        anaData.weekCount > 0 &&
        anaData.lastWeekCount - anaData.weekCount < 0
      )
        weekPassRate =
          Math.floor((1 - anaData.lastWeekCount / anaData.weekCount) * 1000) /
          10;

      // 预约考试统计数据
      this.examInfo = {
        ...anaData,
        passRate,
        passRateAbs: Math.floor(Math.abs(passRate - passRateOld) * 100) / 100,
        passRateCurve: passRate - passRateOld > 0 ? true : false,

        monthPassRate,
        monthpassRateCurve:
          anaData.monthTg - anaData.lastMonthTg > 0 ? true : false,

        weekPassRate,
        monthpassRateCurve:
          anaData.weekCount - anaData.lastWeekCount > 0 ? true : false,
      };
    },

    /**
     * 获取考试类型
     */
    hanldeExamType(type) {
      switch (type) {
        case 1:
          return "（考过）";

        case 2:
          return "（未考过）";

        default:
          return "（--）";
      }
    },

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
            formatDateNoTimezone(item.date, "MM-DD") ==
            formatDateNoTimezone(new Date(), "MM-DD"),
        };
      });
      this.orderList = arr.sort(
        (a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)
      );

      // this.orderList.shift(); // 删除第一项

      // 统计信息
      const anaData = resData.data.anaData;

      // 本周续费
      let xfRate = 0;
      if (anaData.lastWeekXf > 0 && anaData.lastWeekXf - anaData.weekXf > 0)
        xfRate =
          Math.floor((1 - anaData.weekXf / anaData.lastWeekXf) * 1000) / 10;

      if (anaData.weekXf > 0 && anaData.lastWeekXf - anaData.weekXf < 0)
        xfRate =
          Math.floor((1 - anaData.lastWeekXf / anaData.weekXf) * 1000) / 10;

      // 本周购买课程
      let gmRate = 0;
      if (anaData.lastWeekXg > 0 && anaData.lastWeekXg - anaData.weekXg > 0)
        gmRate =
          Math.floor((1 - anaData.weekXg / anaData.lastWeekXg) * 1000) / 10;

      if (anaData.weekXg > 0 && anaData.lastWeekXg - anaData.weekXg < 0)
        gmRate =
          Math.floor((1 - anaData.lastWeekXg / anaData.weekXg) * 1000) / 10;

      // 预约考试统计数据
      this.orderInfo = {
        ...anaData,

        xfRate,
        xfRateCurve: anaData.weekXf - anaData.lastWeekXf > 0 ? true : false,

        gmRate,
        gmRateCurve: anaData.weekXg - anaData.lastWeekXg > 0 ? true : false,
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
     * 获取预测通过率统计
     */
    async queryPassStaticsConst() {
      const { data: resData } = await getPassStaticsConst();
      this.passLoading = false;
      if (!resData.data.status) return;

      this.passInfo = resData.data.data;
    },

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
    },
  },
};
</script>
