<style lang="scss" scope>
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
</style>

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

      <el-table-column align="center" label="用户类型" min-width="150">
        <template slot-scope="scope">
          <div class="scope">
            <i :style="`background-color:${scope.row.color}`"></i>
            {{ scope.row.categoryname }}
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户等级" min-width="150">
        <template slot-scope="scope">
          <el-tag type="success" size="small" v-if="scope.row.level > 0"
            >付费用户</el-tag
          >
          <el-tag type="info" size="small" v-else>免费用户</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="logincount"
        sortable="custom"
        label="学习天数"
        min-width="150"
      >
        <template slot-scope="scope">
          {{ scope.row.allstudydate || 0 }}天
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="lastlogintime"
        sortable="custom"
        label="上次登录"
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
import dayjs from "dayjs";

export default {
  name: "listAll",

  components: { Mirror },

  data() {
    return {
      loading: true,
      params: {},
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
      this.list = resData.data.data.rows;
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
      if (column.property == "username")
        this.$router.push({
          // name: row.level > 0 ? "MEMBER_DETAILS" : "MEMBER_FREE_DETAILS",
          name: "MEMBER_DETAILS",
          query: {
            id: row.id,
          },
        });
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

    if (!this.$route.query.keyword) {
      this.queryList();
    }

    // this.queryCategory()
  },
};
</script>
