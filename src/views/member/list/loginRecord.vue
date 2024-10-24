<style lang="scss" scope></style>

<template>
  <section class="member-details">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item class="on">学员</el-breadcrumb-item>
      <el-breadcrumb-item class="on">考试学员列表</el-breadcrumb-item>
      <el-breadcrumb-item class="on">{{
        params.username || "-"
      }}</el-breadcrumb-item>
      <el-breadcrumb-item>登入记录</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="member-details-table">
      <el-table
        v-loading="loading"
        :data="list"
        border
        size="small"
        style="width: 100%"
      >
        <el-table-column align="center" type="index" label="序号">
        </el-table-column>

        <el-table-column align="center" prop="ipaddress" label="ip地址">
        </el-table-column>

        <el-table-column align="center" label="ip城市">
          <template slot-scope="scope">
            <span :class="{ 'table-row--green': !scope.row.address }"
              >{{ scope.row.logincity }}
            </span>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="lng" label="经度">
        </el-table-column>

        <el-table-column align="center" prop="lat" label="纬度">
        </el-table-column>

        <el-table-column align="center" label="定位地址">
          <template slot-scope="scope">
            <span
              :class="{
                'table-row--green': scope.row.address,
              }"
              >{{ scope.row.address || "-" }}</span
            >
          </template>
        </el-table-column>

        <el-table-column align="center" label="距离上次">
          <template slot-scope="scope">
            {{ scope.row.distanceyl || 0 }}mi
          </template>
        </el-table-column>

        <el-table-column align="center" prop="devicecate" label="登录方式">
          <template slot-scope="scope">
            {{ loginType[scope.row.logincate] || "-" }}
          </template>
        </el-table-column>

        <el-table-column align="center" prop="devicecate" label="登录设备">
          <template slot-scope="scope">
            {{ category[scope.row.devicecate] }}
          </template>
        </el-table-column>

        <el-table-column align="center" prop="enddate" label="登录时间">
          <template slot-scope="scope">
            {{ scope.row.createdAt | formatDate }}
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-algin" v-if="total > PAGE_SIZE">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pages.pageindex"
          :page-sizes="[PAGE_SIZE, 30, 50, 100, 200]"
          :page-size="pages.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </section>
</template>

<script>
import { getMemberLoginList } from "@api/member";
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

      const { data: resData } = await getMemberLoginList(
        this.params.memberid,
        this.pages
      );
      this.loading = false;
      if (!resData.data.status) return;

      this.total = resData.data.data.count;

      this.list = resData.data.data.rows.map((item) => {
        // 截取定位地址
        if (item.address) {
          const index = item.address.indexOf(" ");
          item.address = item.address.slice(index);
        }
        return item;
      });
    },

    /**
     * pageSize 改变时会触发
     */
    handleSizeChange(val) {
      this.pages.pagesize = val;
      this.pages.pageindex = 1;
      this.queryList();
    },

    /**
     * pageindex 改变时会触发
     */
    handleCurrentChange(val) {
      this.pages.pageindex = val;
      this.queryList();
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
