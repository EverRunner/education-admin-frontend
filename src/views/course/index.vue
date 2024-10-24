<style lang="scss" scope>
.home {
  .thumb {
    max-height: 100%;
    max-width: 100%;
  }
}
</style>

<template>
  <section class="public-wp">
    <TabsNav :list="tabsNavList" />

    <ul class="public-search">
      <li class="public-search-left">
        <el-button type="primary" @click="handleGoTo" icon="el-icon-plus"
          >添加课程</el-button
        >
        <el-button
          type="info"
          @click="handleGoTo('chapter')"
          icon="el-icon-plus"
          >添加章节</el-button
        >
        <el-button
          type="danger"
          @click="handleGoTo('asyncCourse')"
          icon="el-icon-plus"
          >同步进度</el-button
        >
      </li>

      <li class="public-search-right">
        <el-input placeholder="请输入课程" v-model="keyword"></el-input>
        <el-button type="warning" @click="handleSearch">搜索</el-button>
      </li>
    </ul>

    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="付费课程" name="all">
        <PaidCourse ref="all" />
      </el-tab-pane>
      <el-tab-pane label="体验课程" name="exam">
        <FreeCourse ref="exam" />
      </el-tab-pane>
      <!-- <el-tab-pane label="辅助学习资源" name="nights">
        <AssistCourse ref="nights" />
      </el-tab-pane> -->
    </el-tabs>
  </section>
</template>

<script>
import { getCourseList, deleteCourse } from "@api/course";
import { PAGE_SIZE } from "@config";
import TabsNav from "@comp/TabsNav";
import PaidCourse from "./components/paidCourse";
import FreeCourse from "./components/freeCourse";
import AssistCourse from "./components/assistCourse";

export default {
  components: { TabsNav, PaidCourse, FreeCourse, AssistCourse },

  data() {
    return {
      tabsNavList: [
        { name: "课程列表", path: "/course/index" },
        { name: "单词列表", path: "/word/list" },
        { name: "测试列表", path: "/exam/list" },
        { name: "试题列表", path: "/exam/topic" },
      ],

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
      if (type == "asyncCourse") {
        return this.$router.push({
          name: "COURSE_ASYNC_COURSE",
        });
      }

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
