<style lang="scss" scope></style>

<template>
  <section class="public-wp">
    <TabsNav :list="tabsNavList" />

    <ul class="public-search">
      <li class="public-search-left">
        <el-button
          type="primary"
          @click="handleGoTo({}, 'add')"
          icon="el-icon-plus"
          >发布公告</el-button
        >
      </li>
      <li class="public-search-right">
        <el-input placeholder="请输入公告" v-model="params.title"></el-input>
        <el-button type="warning" @click="handleSearch">搜索</el-button>
      </li>
    </ul>

    <el-table :data="list" v-loading="loading">
      <el-table-column prop="title" label="标题"></el-table-column>

      <el-table-column prop="title2" label="内容">
        <template slot-scope="scope">
          {{ scope.row.title2 || "-" }}
        </template>
      </el-table-column>

      <el-table-column prop="sort" label="排序"> </el-table-column>

      <el-table-column label="创建日">
        <template slot-scope="scope">
          {{ scope.row.createdAt | formatDate("YYYY-DD-MM") }}
        </template>
      </el-table-column>

      <el-table-column label="到期日">
        <template slot-scope="scope">
          {{ scope.row.enddate | formatDate("YYYY-DD-MM") }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            class="public-button-primary--plain"
            @click="handleGoTo(scope.row, 'details')"
            >编辑</el-button
          >
          <el-button
            type="danger"
            plain
            size="mini"
            class="public-button-danger--plain"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
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
import { getMemberCategory } from "@api/member";
import { getMyContentNotice, deleteContentNotice } from "@api/message";
import { PAGE_SIZE, MESSAGE_TABS_NAV_LIST } from "@config";
import TabsNav from "@comp/TabsNav";

export default {
  components: { TabsNav },

  data() {
    return {
      tabsNavList: MESSAGE_TABS_NAV_LIST,

      loading: false,
      params: {},
      pages: {
        pageindex: 1,
        pagesize: PAGE_SIZE,
      },
      total: 0,
      list: [],
      sendDate: "",
      categoryList: [],
    };
  },

  methods: {
    /**
     * 获取列表
     */
    async queryList() {
      this.loading = true;

      const { data: resData } = await getMyContentNotice(
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
     * 删除用户
     */
    async handleDelete(row) {
      this.$confirm("是否删除通知公告？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      })
        .then(async () => {
          const { data: resData } = await deleteContentNotice(row.id);
          if (!resData.data.status) return;

          this.$message.success("删除成功");
          this.queryList();
        })
        .catch(() => {});
    },

    /**
     * 处理跳转
     */
    handleGoTo(row, type) {
      this.$router.push({
        name: "MESSAGE_AFFICHE_EDIT",
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
