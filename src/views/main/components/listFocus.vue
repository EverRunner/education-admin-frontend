<style lang="scss" scope></style>

<template>
  <section>
    <ul class="public-search" style="padding-top: 0;">
      <li class="public-search-left"></li>
      <li class="public-search-right">
        <el-input v-model="params.username" placeholder="学员姓名"></el-input>
        <el-button type="warning" @click="handleSearch">搜索</el-button>
      </li>
    </ul>

    <el-table
      :row-class-name="tableRowClassName"
      :data="list"
      v-loading="loading"
      class="publi-table"
      size="medium"
      @cell-click="handleCellClick"
      @sort-change="handleTableSort"
    >
      <el-table-column width="120" prop="username" label="姓名">
        <template slot-scope="scope">
          <div class="table-column" style="text-align: left;">
            {{ scope.row.yibei_member && scope.row.yibei_member.username }}
          </div>
        </template>
      </el-table-column>

      <el-table-column width="150" prop="pastDay" label="重置章节">
        <template slot-scope="scope">
          {{ scope.row.yibei_course ? scope.row.yibei_course.title : "-" }}
        </template>
      </el-table-column>

      <el-table-column width="200" prop="pastDay" label="重置到小节">
        <template slot-scope="scope">
          {{
            scope.row.yibei_course_chapter
              ? scope.row.yibei_course_chapter.title
              : "-"
          }}
        </template>
      </el-table-column>

      <el-table-column width="150" label="重置时间">
        <template slot-scope="scope">
          {{ scope.row.resetdate | formatDate }}
        </template>
      </el-table-column>

      <el-table-column prop="remark" width="250" label="备注">
        <template slot-scope="scope">
          {{ scope.row.remark }}
          <!-- {{
            scope.row.courseid
              ? scope.row.remark
              : `【测前评估】${scope.row.remark}`
          }} -->
        </template>
      </el-table-column>

      <el-table-column
        width="160"
        prop="lastWrodDate"
        label="最后学习关键词时间"
      >
        <template slot-scope="scope">
          {{ scope.row.lastWrodDate | formatDate }}
        </template>
      </el-table-column>

      <el-table-column prop="isStudyWrod" label="3天未学习关键词">
      </el-table-column>
    </el-table>

    <div class="pagination-algin">
      <el-pagination
        background
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
  </section>
</template>

<script>
import { getClaimList, deleteMemberStatus } from "@api/member";
import { getCourseList, getCourseChapterTree } from "@api/course";
import { PAGE_SIZE, USER_LEVEL } from "@config";
import { dateDiff } from "@utils/tools";
import Mirror from "@comp/Mirror";

export default {
  components: { Mirror },
  data() {
    return {
      loading: true,
      params: {
        level: 0,
        category: 20,
      },
      PAGE_SIZE,
      pages: {
        pageindex: 1,
        pagesize: PAGE_SIZE,
      },
      total: 0,
      list: [],
      levelList: USER_LEVEL,
      categoryList: [],

      courseList: [],

      courseTerrList: [],
    };
  },

  methods: {
    /**
     * 获取列表
     */
    async queryList() {
      this.loading = true;

      const { data: resData } = await getClaimList(this.params, this.pages);
      if (!resData.data.status) return;

      this.loading = false;

      this.total = resData.data.data.count;
      this.list = resData.data.data.rows.map((item) => {
        item.lastWrodDate = item.yibei_member.laststudyworddate || "";

        // 三天未学习关键词了
        if (
          item.courseid &&
          item.lastWrodDate &&
          dateDiff(new Date(), item.lastWrodDate) >= 3
        ) {
          item.isStudyWrod = "是";
        } else {
          item.isStudyWrod = "-";
        }
        return item;
      });
    },

    /**
     * 获取课程列表
     */
    async queryCourseList() {
      this.loading = true;

      //type 课程类型（0:免费课程  1：付费课程）
      const { data: resData } = await getCourseList(
        {
          type: 0,
        },
        this.pages
      );
      if (!resData.data.status) return;

      this.loading = false;

      this.courseList = resData.data.data.rows;
    },

    /**
     * 获取类型列表
     */
    async queryCategory() {
      const { data: resData } = await getMemberCategory();
      if (!resData.data.status) return;

      this.categoryList = resData.data.dataList;
    },

    /**
     * 获取课程列表树状
     */
    async queryCourseTerrList() {
      this.loading = true;

      const { data: resData } = await getCourseChapterTree(0); //0: 免费  1：付费

      if (!resData.data.status) return (this.loading = false);

      this.courseTerrList = resData.data.dataList;
    },

    /**
     * 计算用户进度
     */
    countUserProgress(currentcoursechapterid) {
      let isStudy = true; //是否学习过
      let isStudyIndex = 0;
      let allChapter = 0; //全部章节
      let alreadyChapter = 0; //已学习过的章节

      //没有学习的章节Id时
      if (!currentcoursechapterid) return 0;

      this.courseTerrList.forEach((item) => {
        //章节
        if (!item.yibei_course_chapter) return;

        //章节是否已经学习
        item.yibei_course_chapter.forEach((son) => {
          //计算所有小节数量
          allChapter++;

          if (currentcoursechapterid == son.id || !currentcoursechapterid) {
            son.isStudy = isStudy;
            isStudy = false;
          } else {
            son.isStudy = isStudy;
          }

          //计算已学习的章节
          if (son.isStudy == true) {
            alreadyChapter++;
          }

          // if (this.userProgress.completecoursecount == isStudyIndex)
          //   son.isStudy = true;

          isStudyIndex++;
        });
      });

      //总进度
      return Math.floor((alreadyChapter / allChapter) * 1000) / 10;
    },

    /**
     * 删除用户
     */
    // async handleDelete(row) {

    //   this.$confirm("是否删除当前会员？", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "error",
    //   })
    //     .then(async () => {
    //       const { data: resData } = await deleteMemberStatus(row.id);
    //       if (!resData.data.status) return;

    //       this.$message.success("删除成功");
    //       this.queryList();
    //     })
    //     .catch(() => {});
    // },

    /**
     * 处理表格排序
     */
    handleTableSort({ column, prop, order }) {
      if (order == "ascending") {
        this.params.ordertype = 0;
      } else {
        this.params.ordertype = 1;
      }

      this.params.ordername = prop;

      this.queryList();
    },

    /**
     * 处理单元格点击
     */
    handleCellClick(row, column, cell, event) {
      if (column.property == "username") this.handleGoTo(row, "details");
    },

    /**
     * 处理搜索
     */
    handleSearch(row, type) {
      this.pages.pageindex = 1;
      this.queryList();
    },

    /**
     * 处理跳转
     */
    handleGoTo(row, type) {
      this.$router.push({
        name: type == "edit" ? "MEMBER_EDIT" : "MEMBER_DETAILS",
        query: {
          id: row.memberid,
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

    /**
     * 表格颜色
     */
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
  },

  async created() {
    // await this.queryCourseTerrList();

    this.queryList();
    // this.queryCategory();
    // this.queryCourseList();
  },
};
</script>
