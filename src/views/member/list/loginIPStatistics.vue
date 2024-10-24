<style lang="scss" scope></style>

<template>
  <section class="member-details">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item class="on">学员</el-breadcrumb-item>
      <el-breadcrumb-item class="on">考试学员列表</el-breadcrumb-item>
      <el-breadcrumb-item class="on">{{
        params.username || "-"
      }}</el-breadcrumb-item>
      <el-breadcrumb-item>登入IP统计</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="member-details-table">
      <el-table
        :data="list"
        border
        size="small"
        v-loading="loading"
        style="width: 100%"
      >
        <el-table-column align="center" type="index" label="序号">
        </el-table-column>

        <el-table-column align="center" prop="ipaddress" label="ip地址">
        </el-table-column>

        <!-- <el-table-column align="center" prop="logincity" label="登录城市">
            </el-table-column>

              <el-table-column align="center" prop="devicecate" label="登录设备">
              <template slot-scope="scope">
                {{ category[scope.row.devicecate] }}
              </template>
            </el-table-column> -->

        <el-table-column align="center" prop="logincount" label="次数">
        </el-table-column>
      </el-table>
    </div>
  </section>
</template>

<script>
import { getLoginIpStatics } from "@api/member";
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

      const { data: resData } = await getLoginIpStatics(this.params.memberid);
      this.loading = false;
      if (!resData.data.status) return;

      this.list = resData.data.data;
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
