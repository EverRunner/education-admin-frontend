<style lang="scss" scope></style>

<template>
  <section class="member-details">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item class="on">学员</el-breadcrumb-item>
      <el-breadcrumb-item class="on">考试学员列表</el-breadcrumb-item>
      <el-breadcrumb-item class="on">{{
        params.username || "-"
      }}</el-breadcrumb-item>
      <el-breadcrumb-item>协议签定记录</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="member-details-table">
      <el-table
        :data="list"
        border
        size="small"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column align="center" type="index" label="序号">
        </el-table-column>

        <el-table-column align="center" prop="membername" label="学员">
        </el-table-column>

        <el-table-column align="center" prop="category" label="类型">
          <template slot-scope="scope">
            {{ scope.row.category === "BUY" ? "购买" : "续费" }}
          </template>
        </el-table-column>

        <el-table-column align="center" prop="lat" label="经度">
        </el-table-column>

        <el-table-column align="center" prop="lng" label="纬度">
        </el-table-column>

        <el-table-column align="center" prop="ip" label="ip"> </el-table-column>

        <el-table-column align="center" prop="cityname" label="定位城市">
        </el-table-column>

        <el-table-column align="center" prop="createdAt" label="同意时间">
          <template slot-scope="scope">
            {{ scope.row.createdAt | formatDate }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleGoTo(scope.row)"
              >签定详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </section>
</template>

<script>
import { getAgreementList } from "@api/user";
import { PAGE_SIZE } from "@config";

export default {
  components: {},

  data() {
    return {
      params: {},
      category: {
        1: "电脑",
        2: "手机",
        3: "平板",
      },
      PAGE_SIZE,
      pages: {
        pageindex: 1,
        pagesize: PAGE_SIZE,
      },
      loading: false,
      total: 0,
      list: [],
      loginType: {
        WX_LOGIN: "微信登录",
        GOOGLE_LOGIN: "谷歌登录",
        ACCOUNT_PASSWORD_LOGIN: "帐密登录",
      },
    };
  },

  methods: {
    /**
     * 获取列表
     */
    async queryList() {
      this.loading = true;

      const { data: resData } = await getAgreementList(this.params.memberid);
      this.loading = false;
      if (!resData.data.status) return;

      this.list = resData.data.data.rows;
    },

    /**
     * 处理跳转
     */
    handleGoTo(row) {
      this.$router.push({
        name: "MEMBER_AGREEMENT_DETAILS",
        query: {
          id: row.id,
        },
      });
    },
  },

  async created() {
    if (this.$route.query.id) {
      this.params.memberid = this.$route.query.id;
      this.params.username = this.$route.query.name;
    }

    this.queryList();
  },
};
</script>
