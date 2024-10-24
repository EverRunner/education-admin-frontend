<style lang="scss" scope>
.home {
  .scope {
    display: flex;
    align-items: center;
    justify-content: center;
    i {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin-right: 8px;
    }
  }
}
</style>

<template>
  <section class="public-wp">
    <TabsNav :list="tabsNavList" />

    <ul class="public-search">
      <li class="public-search-left">
        <el-select v-model="params.category" placeholder="请选择发送方式">
          <el-option
            v-for="(item, index) in categoryList"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-date-picker
          style="margin-left: 10px"
          v-model="sendDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="handleDateChange"
        >
        </el-date-picker>
      </li>
      <li class="public-search-right">
        <el-input placeholder="手机/邮箱" v-model="params.account"></el-input>
        <el-button type="warning" @click="handleSearch">搜索</el-button>
      </li>
    </ul>

    <el-table :data="list" v-loading="loading" class="publi-table">
      <el-table-column prop="title" label="发送邮箱">
        <template slot-scope="scope">
          {{ scope.row.emailfrom || "-" }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="接收账号">
        <template slot-scope="scope">
          {{ scope.row.category == 0 ? scope.row.emailto : scope.row.phone }}
        </template>
      </el-table-column>

      <el-table-column label="发送方式">
        <template slot-scope="scope">
          {{ scope.row.category == 0 ? "邮件" : "短信" }}
        </template>
      </el-table-column>

      <el-table-column prop="content" label="内容"></el-table-column>

      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1" type="success">成功</el-tag>
          <el-tag v-else type="danger">失败</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="发送时间">
        <template slot-scope="scope">
          {{ scope.row.createdAt | formatDate }}
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-algin">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pages.pageindex"
        :page-sizes="[pages.pagesize, 30, 50, 100, 200]"
        :page-size="pages.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </section>
</template>

<script>
import { getSendSMSEmailList } from "@api/message";
import { PAGE_SIZE, MESSAGE_TABS_NAV_LIST } from "@config";
import TabsNav from "@comp/TabsNav";

export default {
  components: { TabsNav },

  data() {
    return {
      tabsNavList: MESSAGE_TABS_NAV_LIST,

      loading: true,
      params: {},
      pages: {
        pageindex: 1,
        pagesize: PAGE_SIZE,
      },
      total: 0,
      list: [],
      sendDate: "",
      categoryList: [
        {
          name: "邮件",
          id: 0,
        },
        {
          name: "短信",
          id: 1,
        },
      ],
    };
  },

  methods: {
    /**
     * 获取列表
     */
    async queryList() {
      this.loading = true;

      const { data: resData } = await getSendSMSEmailList(
        this.params,
        this.pages
      );
      if (!resData.data.status) return;

      this.loading = false;

      this.list = resData.data.data.rows;
      this.total = resData.data.data.count;
    },

    /**
     * 处理搜索
     */
    handleSearch(row, type) {
      this.pages.pageindex = 1;
      this.queryList();
    },

    /**
     * 选拔日期
     */
    handleDateChange(data) {
      if (data) {
        this.params.startdate = data[0];
        this.params.enddate = data[1];
      } else {
        this.params.startdate = "";
        this.params.enddate = "";
      }
    },

    /**
     * 处理跳转
     */
    handleGoTo(row, type) {
      this.$router.push({
        name:
          type == "details"
            ? "MESSAGE_NOTICE_INOF_LIST"
            : "MESSAGE_NOTICE_EDIT",
        query: {
          id: row.id,
        },
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

  created() {
    this.queryList();
  },
};
</script>
