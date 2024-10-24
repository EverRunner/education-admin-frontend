<style lang="scss" scope></style>

<template>
  <section>
    <el-table
      :row-class-name="tableRowClassName"
      :data="list"
      v-loading="loading"
      size="medium"
      @cell-click="handleCellClick"
      @sort-change="handleTableSort"
    >
      <el-table-column align="center" prop="username" label="姓名" width="180">
        <template slot-scope="scope">
          <div class="table-column">
            {{ scope.row.username || "-" }}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="examdate"
        sortable="custom"
        label="考试预约日"
        min-width="120"
      >
        <template slot-scope="scope">
          {{ scope.row.examdate | formatDate("YYYY-MM-DD") }}
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="allstudydate"
        sortable="custom"
        label="学习天数"
        min-width="120"
      >
        <template slot-scope="scope">
          {{ scope.row.allstudydate || 0 }}天
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="allstudytime"
        sortable="custom"
        label="学习时数"
        min-width="120"
      >
        <template slot-scope="scope">
          {{ scope.row.allstudytime }}小时
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="studytimeavg"
        sortable="custom"
        label="平均时长"
        min-width="130"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.studytimeavg }}时/日</span>
        </template>
      </el-table-column>

      <!-- <el-table-column
        align="center"
        prop="aiyctgtime"
        sortable="custom"
        label="考试预测 (1天/7天比较)"
        min-width="260"
      >
        <template slot-scope="scope">
          {{ scope.row.aiyctgtimeNum }}
          (<span
            :class="{
              'public-tag--success': scope.row.lastdayfvFlag == '+',
              'public-tag--danger': scope.row.lastdayfvFlag == '-',
            }"
            >{{ scope.row.lastdayfvNum }}</span
          >/<span
            :class="{
              'public-tag--success': scope.row.lweekfvFlag == '+',
              'public-tag--danger': scope.row.lweekfvFlag == '-',
            }"
            >{{ scope.row.weekfvNum }}</span
          >)
        </template>
      </el-table-column> -->

      <el-table-column
        align="center"
        prop="predict_label"
        sortable="custom"
        label="是否通过"
        min-width="120"
      >
        <template slot-scope="scope">
          <!-- {{ Math.floor((scope.row.rotedegree || 0) * 1000) / 10 || "0" }}% -->
          <el-tag
            :type="scope.row.predict_label == 1 ? 'success' : 'info'"
            size="small"
          >
            {{ scope.row.predict_label == 1 ? "是" : "否" }}</el-tag
          >
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="lastlogintime"
        sortable="custom"
        label="最后登入时间"
        min-width="160"
      >
        <template slot-scope="scope">
          {{ scope.row.lastlogintime | formatDate }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" min-width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            class="public-button-primary--plain"
            @click="handleGoTo(scope.row, 'edit')"
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
import {
  getMemberList,
  getMemberCategory,
  deleteMemberStatus,
  getMemberCourseExport,
} from "@api/member";
import { getCourseList, getCourseChapterTree } from "@api/course";
import { PAGE_SIZE, USER_LEVEL } from "@config";
import Mirror from "@comp/Mirror";

export default {
  name: "listExam",

  components: { Mirror },

  data() {
    return {
      loading: true,
      params: {
        level: 1,
        category: 22,
        ordername: "examdate",
        ordertype: "0",
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
    async queryList(keyword) {
      this.loading = true;

      const { data: resData } = await getMemberList(
        {
          ...this.params,
          username: keyword,
        },
        this.pages
      );
      if (!resData.data.status) return;

      this.loading = false;

      this.total = resData.data.data.count;
      this.list = resData.data.data.rows.map((item) => {
        // 学习小时格式化
        item.allstudytime =
          Math.floor(((item.allstudytime || 0) / 60 / 60) * 100) / 100;

        // 每天平均小时
        item.studytimeavg =
          Math.floor(((item.studytimeavg || 0) * 10) / 60 / 60) / 10 || 0;

        // 考试预测
        if (item.aiyctgtime > 0) {
          item.aiyctgtimeNum =
            (Math.floor((item.aiyctgtime || 0) * 1000) / 10 || "0") + "%";
        } else {
          item.aiyctgtimeNum = "0%";
        }

        // 考试预测-比较昨天
        if (item.lastdayfv > 0) {
          if (item.aiyctgtime - item.lastdayfv > 0) {
            item.lastdayfvFlag = "+";
          } else {
            item.lastdayfvFlag = "-";
          }
          item.lastdayfvNum =
            (Math.floor((item.aiyctgtime - item.lastdayfv || 0) * 1000) / 10 ||
              "0") + "%";
        } else {
          item.lastdayfvNum = "0%";
          item.lastdayfvFlag = "";
        }

        // 考试预测-比较7天
        if (item.weekfv > 0) {
          if (item.aiyctgtime - item.weekfv > 0) {
            item.lweekfvFlag = "+";
          } else {
            item.weekfvFlag = "-";
          }
          item.weekfvNum =
            (Math.floor((item.aiyctgtime - item.weekfv || 0) * 1000) / 10 ||
              "0") + "%";
        } else {
          item.lastdayfvNum = "0%";
          item.lweekfvFlag = "";
        }

        return item;
      });
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
     * 删除用户
     */
    async handleDelete(row) {
      // this.$message.error("请联系程序员删除！");

      this.$confirm("是否删除当前会员？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      })
        .then(async () => {
          const { data: resData } = await deleteMemberStatus(row.id);
          if (!resData.data.status) return;

          this.$message.success("删除成功");
          this.queryList();
        })
        .catch(() => {});
    },

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
     * pageindex 改变时会触发x
     */
    handleCurrentChange(val) {
      this.pages.pageindex = val;
      this.queryList();
    },

    /**
     * 导出
     */
    handleExport(row) {
      this.$confirm("是否导出该学员数据统计？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await getMemberCourseExport(row.id, row.username);
          // await getMemberCourseExport('3118', 'aijunxiong');
        })
        .catch(() => {});
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
    //删除筛选‘免费用户’
    // delete this.levelList[0];

    this.queryList();
  },
};
</script>
