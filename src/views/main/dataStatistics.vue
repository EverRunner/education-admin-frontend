<style lang="scss" scope>
.browse {
  .leave {
    color: #fa5376;
  }
}
</style>

<template>
  <section class="public-wp">
    <TabsNav :list="tabsNavList" />

    <el-tabs v-model="activeName" type="card" style="margin-top: 20px">
      <el-tab-pane label="易错题" name="fallibility">
        <ErrorTopic />
      </el-tab-pane>
      <el-tab-pane label="学习数据对比" name="learning ">
        <StudyContrast />
      </el-tab-pane>
      <el-tab-pane label="浏览记录" name="browsing"><Browse /></el-tab-pane>
      <el-tab-pane label="用户访问记录" name="user"
        ><MemberVisitList />
      </el-tab-pane>
      <el-tab-pane label="异常登录" name="exception "
        ><Exception />
      </el-tab-pane>
      <el-tab-pane label="关注学员" name="attention "
        ><ListFocus />
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
import ErrorTopic from "./components/errorTopic";
import StudyContrast from "./components/studyContrast";
import Browse from "./components/browse";
import MemberVisitList from "./components/memberVisitList";
import Exception from "./components/exception";
import ListFocus from "./components/listFocus";
import TabsNav from "@comp/TabsNav";

export default {
  components: {
    TabsNav,
    ErrorTopic,
    StudyContrast,
    Browse,
    MemberVisitList,
    Exception,
    ListFocus,
  },

  data() {
    return {
      tabsNavList: [
        { name: "站点统计", path: "/main/siteStatistics" },
        { name: "数据列表", path: "/main/dataStatistics" },
      ],

      activeName: "fallibility",
    };
  },

  methods: {},

  created() {},
};
</script>
