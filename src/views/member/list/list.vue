<style lang="scss" scope></style>

<template>
  <section class="public-wp">
    <TabsNav :list="tabsNavList" />

    <ul class="public-search">
      <li class="public-search-left"></li>
      <li class="public-search-right">
        <el-input
          placeholder="请输入姓名、手机、邮箱号"
          v-model="keyword"
        ></el-input>
        <el-button type="warning" @click="handleSearch">搜索</el-button>
      </li>
    </ul>

    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="全部" name="all">
        <ListAll ref="all" />
      </el-tab-pane>
      <el-tab-pane label="考试学员" name="exam">
        <ListExam ref="exam" />
      </el-tab-pane>
      <el-tab-pane label="在学生" name="nights">
        <List ref="nights" />
      </el-tab-pane>
      <el-tab-pane label="考过学员" name="pass">
        <ListPass ref="pass" />
      </el-tab-pane>
      <el-tab-pane label="注册/体验/弃学学员" name="register">
        <ListRegister ref="register" />
      </el-tab-pane>
      <el-tab-pane label="滞留/暂停学员" name="stagnate">
        <ListStagnate ref="stagnate" />
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
import Mirror from "@comp/Mirror";
import TabsNav from "@comp/TabsNav";
import List from "./components/list";
import ListAll from "./components/listAll";
import ListExam from "./components/listExam";
import ListPass from "./components/listPass";
import ListRegister from "./components/listRegister";
import ListStagnate from "./components/listStagnate";

export default {
  components: {
    Mirror,
    TabsNav,
    List,
    ListAll,
    ListExam,
    ListPass,
    ListRegister,
    ListStagnate,
  },

  data() {
    return {
      tabsNavList: [
        { name: "学员列表", path: "/member/list" },
        { name: "学员分类设置", path: "/member/classify" },
      ],

      activeName: "all",

      keyword: "",
    };
  },

  mounted() {
    if (this.$route.query.keyword) {
      this.activeName = "all";
      this.keyword = this.$route.query.keyword;
      this.handleSearch();
    }
  },

  methods: {
    handleClick(tab, event) {},

    handleSearch() {
      this.$refs[this.activeName].queryList(this.keyword);
    },
  },

  async created() {},
};
</script>
