<style lang="scss" scope></style>

<template>
  <section class="public-wp">
    <TabsNav :list="tabsNavList" />

    <ul class="public-search">
      <li class="public-search-left">
        <el-button
          type="primary"
          @click="handleGoTo({}, 'edit')"
          icon="el-icon-plus"
          >添加单词</el-button
        >
      </li>
      <li class="public-search-right">
        <el-input v-model="params.title" placeholder="请输入单词"></el-input>
        <el-button type="warning" @click="handleSearch">搜索</el-button>
      </li>
    </ul>

    <el-table :data="list" v-loading="loading">
      <el-table-column
        wordIndex
        prop="title"
        label="单词组名称"
        min-width="220"
      >
      </el-table-column>

      <el-table-column align="center" prop="" label="单词数量" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.wordcount || 0 }}个
        </template>
      </el-table-column>

      <el-table-column align="center" prop="" label="说明" min-width="160">
        <template slot-scope="scope">
          {{ scope.row.bb || "" }}
        </template>
      </el-table-column>

      <el-table-column wordIndex label="最近修改" min-width="160">
        <template slot-scope="scope">
          {{ scope.row.updatedAt | formatDate }}
        </template>
      </el-table-column>

      <el-table-column wordIndex label="操作" min-width="250">
        <template slot-scope="scope">
          <el-button
            plain
            size="mini"
            type="warning"
            class="public-button-warning--plain"
            @click="handleGoTo(scope.row, 'details')"
            >管理单词</el-button
          >
          <el-button
            plain
            size="mini"
            type="primary"
            class="public-button-primary--plain"
            @click="handleGoTo(scope.row, 'edit')"
            >编辑</el-button
          >
          <el-button
            plain
            size="mini"
            class="public-button-danger--plain"
            type="danger"
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
import { getPracticeList, deletePractice } from "@api/word";
import { PAGE_SIZE } from "@config";
import TabsNav from "@comp/TabsNav";

export default {
  components: { TabsNav },

  data() {
    return {
      tabsNavList: [
        { name: "课程列表", path: "/course/index" },
        { name: "单词列表", path: "/word/list" },
        { name: "测试列表", path: "/exam/list" },
        { name: "试题列表", path: "/exam/topic" },
      ],

      loading: true,
      params: {},
      pages: {
        pageindex: 1,
        pagesize: PAGE_SIZE,
      },
      total: 0,
      list: [],
      levelList: {
        0: "注册用户",
        1: "一级会员",
        2: "二级会员",
      },
      categoryList: [],
    };
  },

  methods: {
    /**
     * 获取列表
     */
    async queryList() {
      this.loading = true;

      const { data: resData } = await getPracticeList(this.params, this.pages);
      if (!resData.data.status) return;

      this.loading = false;

      this.list = resData.data.data.rows;
      this.total = resData.data.data.count;
    },

    /**
     * 删除用户
     */
    async handleDelete(row) {
      if (row.id == 346) {
        this.$message.error("公共单词库，不能删除");
        return;
      }
      this.$confirm("是否删除该条测试？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      })
        .then(async () => {
          const { data: resData } = await deletePractice(row.id);
          if (!resData.data.status) return;

          this.$message.success("删除成功");
          this.queryList();
        })
        .catch(() => {});
    },

    /**
     * 处理搜索
     */
    handleSearch() {
      this.pages.pageindex = 1;
      this.queryList();
    },

    /**
     * 处理跳转
     */
    handleGoTo(row, type) {
      this.$router.push({
        name: type == "edit" ? "WORD_EDIT" : "WORD_LIST_TOPIC",
        query: {
          id: row.id,
          title: row.title,
        },
        params: {
          title: row.title,
          description: row.description,
          sort: row.sort,
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
