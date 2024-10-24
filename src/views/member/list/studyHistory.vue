<style lang="scss" scope></style>

<template>
  <section class="member-details">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item class="on">学员</el-breadcrumb-item>
      <el-breadcrumb-item class="on">考试学员列表</el-breadcrumb-item>
      <el-breadcrumb-item class="on">{{
        params.username || "-"
      }}</el-breadcrumb-item>
      <el-breadcrumb-item>学习历史记录</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="member-details-table">
      <el-button
        style="margin-bottom: 20px"
        size="small"
        @click="handleSummaryStudy"
        type="warning"
        >汇总学习记录</el-button
      >
      <el-button
        style="margin-bottom: 20px"
        size="small"
        @click="handleStudyExport"
        >导出学习记录</el-button
      >
      <el-table :data="list" border size="small" style="width: 100%">
        <el-table-column align="center" label="课程" min-width="120">
          <template slot-scope="scope">
            {{
              (scope.row.yibei_course && scope.row.yibei_course.title) || "-"
            }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="章节" min-width="130">
          <template slot-scope="scope">
            {{
              (scope.row.yibei_course_chapter &&
                scope.row.yibei_course_chapter.title) ||
                "-"
            }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="内容" min-width="100">
          <template slot-scope="scope">
            {{ studyHistoryType[scope.row.category] }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="测试成绩" min-width="100">
          <template slot-scope="scope">
            <template v-if="scope.row.testscore">
              <el-tag
                type="success"
                size="small"
                v-if="scope.row.testscore >= 90"
                >{{ scope.row.testscore }}%</el-tag
              >
              <el-tag type="info" size="small" v-else
                >{{ scope.row.testscore }}%</el-tag
              >
            </template>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="停留时长" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.minutes || "0" }}分钟
          </template>
        </el-table-column>

        <el-table-column align="center" label="进入时间" min-width="90">
          <template slot-scope="scope">
            {{ scope.row.startdate | formatDate("MM/DD/YYYY HH:mm:ss") }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="测试完成" min-width="90">
          <template slot-scope="scope">
            {{ scope.row.testfinishtime | formatDate("MM/DD/YYYY HH:mm:ss") }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="离开时间" min-width="90">
          <template slot-scope="scope">
            {{ scope.row.enddate | formatDate("MM/DD/YYYY HH:mm:ss") }}
          </template>
        </el-table-column>

        <!-- <el-table-column
          align="center"
          prop="remark"
          label="备注"
          min-width="120"
        >
        </el-table-column> -->
      </el-table>
      <!-- 分页 -->
      <div class="pagination-algin" v-if="historyTotal > PAGE_SIZE">
        <el-pagination
          @size-change="handleSizeChange(arguments, 'history')"
          @current-change="handleCurrentChange(arguments, 'history')"
          :current-page="historyPages.pageindex"
          :page-sizes="[PAGE_SIZE, 30, 50, 100, 200]"
          :page-size="historyPages.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="historyTotal"
        >
        </el-pagination>
      </div>

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
import {
  getStudyHistory,
  getUserStudyConstStatics,
  getMemberStudyExport,
} from "@api/user";
import { PAGE_SIZE } from "@config";
import { dateDiff } from "@utils/tools";

export default {
  components: {},

  data() {
    return {
      params: {},
      PAGE_SIZE,
      pages: {
        pageindex: 1,
        pagesize: PAGE_SIZE,
      },
      loading: false,
      total: 0,
      historyTotal: 0,
      list: [],
      studyHistoryType: {
        1: "视频学习",
        2: "关键词学习（中英）",
        3: "关键词-测试（中英）",
        4: "关键词学习（英）",
        5: "关键词-测试（英）",
        6: "单元测试",
        7: "单元测试（测前关键词）",
        8: "我的错题（测前单词）",
        9: "我的错题测试",
        10: "高频错题（测前单词）",
        11: "高频错题测试",
        12: "综合题（测前单词）",
        13: "综合题测试",
        14: "应变测试（测前单词）",
        15: "应变测试",
      },
    };
  },

  methods: {
    /**
     * 获取列表
     */
    async queryList() {
      this.loading = true;

      const { data: resData } = await getStudyHistory(
        this.params.memberid,
        this.pages
      );
      this.loading = false;
      if (!resData.data.status) return;

      // let counTminutes = 0;

      this.total = resData.data.data.count;
      this.list = resData.data.data.rows.map((item) => {
        if (item.enddate && item.startdate) {
          item.minutes = dateDiff(item.startdate, item.enddate, "minutes") || 1;
          // counTminutes = counTminutes + item.minutes;
        }

        return item;
      });
    },

    /**
     * 学习汇总记录
     */
    async handleSummaryStudy() {
      this.summaryStudyVisible = true;
      this.summaryStudyLoading = true;

      const { data: resData } = await getUserStudyConstStatics(
        this.params.memberid
      );
      this.summaryStudyLoading = false;
      if (!resData.data.status) return;

      this.summaryStudyList = resData.data.data;
    },

    /**
     * 导出
     */
    handleStudyExport() {
      this.$confirm("是否导出学员学习历史数据？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await getMemberStudyExport(this.params.memberid);
        })
        .catch(() => {});
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
