<style lang="scss" scope>
.home {
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
}
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>

<template>
  <section class="home public-body">
    <el-form
      class="public-search-form"
      ref="form"
      :model="params"
      label-width="80px"
    >
      <div class="content">
        <el-form-item label="关键字">
          <el-input
            v-model="params.username"
            placeholder="请输入姓名/手机/邮箱/分享码"
            size="mini"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="用户等级">
          <el-select
            size="mini"
            v-model="params.level"
            placeholder="请选择用户等级"
          >
            <el-option
              v-for="(label, index) in levelList"
              :key="index"
              :label="label"
              :value="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户类型">
          <el-select
            size="mini"
            v-model="params.category"
            placeholder="请选择用户类型"
            clearable
          >
            <el-option
              v-for="(item, index) in categoryList"
              :key="index"
              :label="item.categoryname"
              :value="item.id"
              v-show="item.id > 1"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="学完课程">
          <el-select
            size="mini"
            v-model="params.progresscourseid"
            placeholder="请选择课程"
            clearable
          >
            <el-option
              v-for="(item, index) in courseList"
              :key="index"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="到期时间">
          <el-date-picker
            v-model="dateTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="left"
            size="mini"
            style="width: 260px"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item> -->
      </div>

      <el-form-item>
        <el-button
          size="mini"
          @click="handleSearch"
          icon="el-icon-search"
          type="primary"
          >搜索</el-button
        >
        <el-button
          icon="el-icon-plus"
          @click="handleGoTo({}, 'edit')"
          type="warning"
          size="mini"
          >增加</el-button
        >
        <el-button @click="handleExportAll" size="mini">导出</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :row-class-name="tableRowClassName"
      :data="list"
      v-loading="loading"
      class="publi-table"
      size="mini"
      @cell-click="handleCellClick"
      @sort-change="handleTableSort"
      :height="tableHeight"
    >
      <el-table-column align="center" type="index" label="序号" width="60">
      </el-table-column>

      <el-table-column align="center" prop="username" label="姓名" width="130">
        <template slot-scope="scope">
          <div class="table-column">
            {{ scope.row.username || "-" }}
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户类型" width="110">
        <template slot-scope="scope">
          <div class="scope">
            <i :style="`background-color:${scope.row.color}`"></i>
            {{ scope.row.categoryname }}
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户等级" width="110">
        <template slot-scope="scope">
          <div class="scope">
            <i :style="`background-color:${scope.row.color}`"></i>
            {{ scope.row.categoryname }}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="logincount"
        sortable="custom"
        label="学习天数"
        width="110"
      >
        <template slot-scope="scope">
          {{ scope.row.allstudydate || 0 }}天
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="allstudytime"
        sortable="custom"
        label="学习小时"
        width="110"
      >
        <template slot-scope="scope">
          {{ scope.row.allstudytime }}小时
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="studytimeavg"
        sortable="custom"
        label="每天平均小时"
        width="130"
      >
        <template slot-scope="scope">
          <span
            >{{
              Math.floor(((scope.row.studytimeavg || 0) * 10) / 60 / 60) / 10 ||
                "0"
            }}小时</span
          >
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="avgzhongwen"
        sortable="custom"
        label="平均准确率（中英）"
        width="170"
      >
        <template slot-scope="scope">
          {{ Math.floor((scope.row.avgzhongwen || 0) * 1000) / 10 || "0" }}%
        </template></el-table-column
      >

      <el-table-column
        align="center"
        prop="avgenglish"
        sortable="custom"
        label="平均准确率（英）"
        width="160"
      >
        <template slot-scope="scope">
          {{ Math.floor((scope.row.avgenglish || 0) * 1000) / 10 || "0" }}%
        </template></el-table-column
      >

      <el-table-column
        align="center"
        sortable="custom"
        prop="progresscourseid"
        label="学习进度"
        width="160"
      >
        <template slot-scope="scope">
          <el-popover
            ref="popover"
            placement="left"
            :title="scope.row.coursetitle || '当前用户还未开始学习'"
            width="250"
            trigger="hover"
            :content="scope.row.chaptertitle || '-'"
          >
          </el-popover>
          <el-progress
            :stroke-width="4"
            v-popover:popover
            :percentage="scope.row.alreadyChapter"
          ></el-progress>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="lastlogintime"
        sortable="custom"
        label="最后登入时间"
        width="130"
      >
        <template slot-scope="scope">
          {{ scope.row.lastlogintime | formatDate }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="210" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleDelete(scope.row)"
            >删除</el-button
          >
          <el-button
            size="mini"
            type="text"
            @click="handleGoTo(scope.row, 'edit')"
            >编辑</el-button
          >
          <el-button type="text" size="mini" @click="handleExport(scope.row)"
            >导出</el-button
          >
          <el-button
            v-if="$route.query.exportParams"
            type="text"
            size="mini"
            @click="handleGetParams(scope.row)"
            >导出请求参数</el-button
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
  deleteMember,
  deleteMemberStatus,
  getMemberCourseExport,
  getMemberParamsExport,
  getMemberExport,
} from "@api/member";
import { getCourseList, getCourseChapterTree } from "@api/course";
import { PAGE_SIZE, USER_LEVEL } from "@config";
import Mirror from "@comp/Mirror";

export default {
  components: { Mirror },

  data() {
    return {
      loading: true,
      params: {
        username: "",
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
      dateTime: "",

      courseList: [],

      courseTerrList: [],
      courseFreeTerrList: [],

      tableHeight: 400,
    };
  },

  mounted() {
    this.calHeight();
  },

  methods: {
    /**
     * 计算表格高度
     */
    calHeight() {
      this.$nextTick(() => {
        const rect = document.documentElement.clientHeight;

        this.tableHeight = rect - 315;
      });
    },

    /**
     * 获取列表
     */
    async queryList() {
      this.loading = true;

      const { data: resData } = await getMemberList(this.params, this.pages);
      if (!resData.data.status) return;

      this.loading = false;

      this.total = resData.data.data.count;
      this.list = resData.data.data.rows.map((item) => {
        //学习小时格式化
        item.allstudytime =
          Math.floor(((item.allstudytime || 0) / 60 / 60) * 10) / 100;

        //进度类型 体验：0  付费：1
        if (item.progresstype == 0) {
          item.alreadyChapter = 0;
          return item;
        }

        //已学习的章节名称
        item.alreadyChapter = this.countUserProgress(
          item.progresschapterid,
          item.progresstype
        );
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
          type: 1,
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
    async queryCourseTerrList(type) {
      this.loading = true;

      const { data: resData } = await getCourseChapterTree(type); //0: 免费  1：付费

      if (!resData.data.status) return (this.loading = false);

      if (type == 1) this.courseTerrList = resData.data.dataList;
      else this.courseFreeTerrList = resData.data.dataList;
    },

    /**
     * 计算用户进度
     */
    countUserProgress(currentcoursechapterid, type) {
      let isStudy = true; //是否学习过
      let isStudyIndex = 0;
      let allChapter = 0; //全部章节
      let alreadyChapter = 0; //已学习过的章节
      let courseTerrList = [];

      //根据进度类型，判断进度
      if (type == 1) courseTerrList = this.courseTerrList;
      else courseTerrList = this.courseFreeTerrList;

      //没有学习的章节Id时
      if (!currentcoursechapterid) return 0;

      courseTerrList.forEach((item) => {
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
     * 是否进入学员端
     */
    handleEnterUser(id) {
      this.$confirm("是否进入学员界面？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {})
        .catch(() => {});
    },

    /**
     * 删除用户
     */
    async handleDelete(row) {
      // this.$message.error("请联系程序员删除！");

      this.$confirm("是否删除当前会员？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
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
     * 导出所有
     */
    handleExportAll() {
      this.$confirm("是否导出所有学员数据？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await getMemberExport(this.params);
        })
        .catch(() => {});
    },

    /**
     * 导出该学员
     */
    handleExport(row) {
      this.$confirm("是否导出该学员数据统计？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await getMemberCourseExport(row.id, row.username);
          // await getMemberCourseExport("2428", "YIDIFAN");
        })
        .catch(() => {});
    },

    /**
     * 导出该学员的-请求参数
     */
    handleGetParams(row) {
      this.$confirm("获取请求参数？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await getMemberParamsExport(row.id);
          // await getMemberCourseExport("2428", "YIDIFAN");
          if (!resData.data.status) return;
        })
        .catch(() => {});
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
     * pageindex 改变时会触发
     */
    handleCurrentChange(val) {
      this.pages.pageindex = val;
      this.queryList();
    },

    /**
     * 日期改变
     */
    handleDateChange(dateTime) {
      if (dateTime) {
        this.params.startdate = dateTime[0];
        this.params.enddate = dateTime[1];
      } else {
        this.params.startdate = "";
        this.params.enddate = "";
      }

      this.handleSearch();
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
    if (this.$route.query.keyword)
      this.params.username = this.$route.query.keyword;

    //删除筛选‘免费用户’
    // delete this.levelList[0];

    await this.queryCourseTerrList(0);
    await this.queryCourseTerrList(1);

    this.queryList();
    this.queryCategory();
    // this.queryCourseList();
  },
};
</script>
