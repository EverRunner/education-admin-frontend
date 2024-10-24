<style lang="scss" scope>
.pay-status {
  &.await {
    color: #ffa61f;
  }
  &.success {
    color: #33dda1;
  }
  &.fail {
    color: #fa5376;
  }
  &.refund {
    color: #a8aebb;
  }
}
</style>
<template>
  <section class="member-details">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item class="on">学员</el-breadcrumb-item>
      <el-breadcrumb-item class="on">考试学员列表</el-breadcrumb-item>
      <el-breadcrumb-item class="on">{{
        params.username || "-"
      }}</el-breadcrumb-item>
      <el-breadcrumb-item>课程购买记录</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="member-details-table">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="课程购买记录" name="all">
          <el-table
            :data="list"
            border
            v-loading="loading"
            size="small"
            style="width: 100%"
          >
            <el-table-column prop="ordercode" align="center" label="订单号">
              <template slot-scope="scope">
                {{ scope.row.ordercode || "-" }}
              </template>
            </el-table-column>
            <el-table-column prop="category" label="类型">
              <template slot-scope="scope">
                {{ VIP_LOG_TYPE[scope.row.category] }}
              </template>
            </el-table-column>
            <el-table-column prop="fee" label="金额">
              <template slot-scope="scope">
                ${{ scope.row.fee ? scope.row.fee / 100 : 0 }}
              </template>
            </el-table-column>
            <el-table-column prop="datecount" label="时长">
              <template slot-scope="scope">
                {{ scope.row.datecount }}天
              </template>
            </el-table-column>
            <el-table-column prop="enddate" label="操作时间">
              <template slot-scope="scope">
                {{ scope.row.createdAt | formatDate("YYYY-MM-DD HH:mm") }}
              </template>
            </el-table-column>
            <el-table-column prop="enddate" label="到期时间">
              <template slot-scope="scope">
                {{ scope.row.enddate | formatDate("YYYY-MM-DD") }}
              </template>
            </el-table-column>

            <el-table-column prop="remark" label="备注"> </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="暂停/恢复记录" name="nights">
          <el-table
            :data="record"
            border
            v-loading="loading"
            size="small"
            style="width: 100%"
          >
            <el-table-column type="index" align="center" label="序号">
            </el-table-column>
            <el-table-column prop="category" align="center" label="类型">
              <template slot-scope="scope">
                <el-tag
                  size="medium"
                  :type="scope.row.status == 1 ? 'warning' : 'success'"
                >
                  {{ scope.row.status == 1 ? "暂停" : "恢复" }}</el-tag
                >
              </template>
            </el-table-column>

            <el-table-column prop="enddate" align="center" label="操作时间">
              <template slot-scope="scope">
                {{ scope.row.createdAt | formatDate("YYYY-MM-DD HH:mm") }}
              </template>
            </el-table-column>

            <el-table-column prop="remark" label="备注"> </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </section>
</template>

<script>
import { getMemberVipLog } from "@api/member";
import { getUserVipStatusRecord } from "@api/user";
import { PAGE_SIZE, VIP_LOG_TYPE } from "@config";

export default {
  components: {},

  data() {
    return {
      params: {},
      PAGE_SIZE,
      pages: {
        pageindex: 1,
        pagesize: PAGE_SIZE,
      },
      loading: false,
      total: 0,
      list: [],
      VIP_LOG_TYPE,

      statusList: {
        0: "待支付",
        1: "已支付",
        2: "失败了",
        5: "已退款",
      },

      payChannel: {
        cheque: "支票",
        transferAccounts: "转账",
        stripe: "Stripe 支付",
      },

      categoryList: {
        0: "新购课",
        1: "续费",
        2: "执照申请",
        3: "执照更换",
      },

      vipDates: null,
      vipDatesRemark: "",

      activeName: "all",

      record: [],
    };
  },

  methods: {
    /**
     * 获取列表
     */
    async queryList() {
      this.loading = true;

      const { data: resData } = await getMemberVipLog(this.params.memberid);
      this.loading = false;
      if (!resData.data.status) return;

      this.list = resData.data.data;
    },

    handleClick(tab, event) {},

    /**
     * 获取暂停/恢复记录
     */
    async queryVipStatusList() {
      this.loading = true;

      const { data: resData } = await getUserVipStatusRecord(
        this.params.memberid
      );
      this.loading = false;
      if (!resData.data.status) return;

      this.record = resData.data.data;
    },
  },

  async created() {
    if (this.$route.query.id) {
      this.params.memberid = this.$route.query.id;
      this.params.username = this.$route.query.name;
    }

    this.queryList();
    this.queryVipStatusList();
  },
};
</script>
