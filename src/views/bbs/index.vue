<style lang="scss" scope></style>

<template>
  <section class="public-wp">
    <TabsNav :list="tabsNavList" />

    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="帖子列表" name="all">
        <List ref="all" />
      </el-tab-pane>
      <el-tab-pane label="帖子分类" name="exam">
        <Classify ref="exam" />
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
import { getCourseList, deleteCourse } from "@api/course";
import { PAGE_SIZE, MESSAGE_TABS_NAV_LIST } from "@config";
import TabsNav from "@comp/TabsNav";
import Classify from "./components/classify";
import List from "./components/list";

export default {
  components: { TabsNav, Classify, List },

  data() {
    return {
      tabsNavList: MESSAGE_TABS_NAV_LIST,

      keyword: "",

      activeName: "all",

      loading: true,
      params: {},
      pages: {
        pageindex: 1,
        pagesize: PAGE_SIZE,
      },
      total: 0,
      list: [],
      categoryList: {
        0: "免费课程",
        1: "付费课程",
      },
    };
  },

  methods: {
    handleClick(tab, event) {},

    /**
     * 获取列表
     */
    async queryList() {
      this.loading = true;

      const { data: resData } = await getCourseList(this.params, this.pages);
      if (!resData.data.status) return;

      this.loading = false;

      this.list = resData.data.data.rows;
      this.total = resData.data.data.count;
    },

    /**
     * 删除课程
     */
    async handleDelete(row) {
      this.$confirm("是否删除当前课程？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      })
        .then(async () => {
          const { data: resData } = await deleteCourse(row.id);
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
      this.$refs[this.activeName].queryCourseTerrList(this.keyword);
    },

    /**
     * 处理跳转
     */
    handleGoTo(type) {
      this.$router.push({
        name: type == "chapter" ? "COURSE_CHAPTER_EDIT" : "COURSE_EDIT",
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
