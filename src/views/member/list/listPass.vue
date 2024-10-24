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

.table-column {
  width: 100%;
  height: 100%;
  text-align: center;
  cursor: pointer;
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
            size="small"
            v-model="params.username"
            placeholder="请输入姓名/手机/邮箱/分享码"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="用户等级">
          <el-select size="small" v-model="params.level" placeholder="请选择用户等级">
            <el-option
              v-for="(label, index) in levelList"
              :key="index"
              :label="label"
              :value="index"
            ></el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item label="学完课程">
          <el-select
            size="small"
            v-model="params.progresscourseid"
            placeholder="请选择课程"
          >
            <el-option
              v-for="(item, index) in courseList"
              :key="index"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>

      <el-form-item>
        <!-- <el-button
          size="small"
          @click="handleSearch"
          icon="el-icon-search"
          type="primary"
          >搜索</el-button
        >
        <el-button
          size="small"
          icon="el-icon-plus"
          @click="handleGoTo({}, 'edit')"
          type="warning"
          >增加</el-button
        > -->
        <el-button size="small" type="primary" @click="handleXuanHuangDaoChu"
          >循环导出</el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      :row-class-name="tableRowClassName"
      :data="list"
      v-loading="loading"
      class="publi-table"
      size="medium"
      @cell-click="handleCellClick"
      @sort-change="handleTableSort"
    >
      <el-table-column align="center" type="index" label="序号" min-width="100">
      </el-table-column>

      <el-table-column align="center" prop="username" label="姓名">
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

      <el-table-column
        align="center"
        prop="logincount"
        sortable="custom"
        label="学习天数"
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
      >
        <template slot-scope="scope">
          <span
            >{{
              Math.floor(((scope.row.studytimeavg || 0) * 100) / 60 / 60) /
                100 || "0"
            }}小时</span
          >
        </template>
      </el-table-column>

      <!-- <el-table-column
        align="center"
        prop="avgzhongwen"
        sortable="custom"
        label="平均准确率（中英）"
      >
        <template slot-scope="scope">
          {{ Math.floor((scope.row.avgzhongwen || 0) * 10000) / 100 || "0" }}%
        </template></el-table-column
      >

      <el-table-column
        align="center"
        prop="avgenglish"
        sortable="custom"
        label="平均准确率（英）"
      >
        <template slot-scope="scope">
          {{ Math.floor((scope.row.avgenglish || 0) * 10000) / 100 || "0" }}%
        </template></el-table-column
      > -->

      <el-table-column
        align="center"
        prop="rotedegree"
        sortable="custom"
        label="机械学习率"
      >
        <template slot-scope="scope">
          {{ Math.floor((scope.row.rotedegree || 0) * 1000) / 10 || "0" }}%
        </template></el-table-column
      >

      <el-table-column
        align="center"
        prop="aiyctgtime"
        sortable="custom"
        label="预测试通过率"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.aiyctgtime > 0.8" type="success">
            {{ Math.floor((scope.row.aiyctgtime || 0) * 1000) / 10 || "0" }}%
          </el-tag>
          <el-tag v-else type="danger">
            {{
              Math.floor((scope.row.aiyctgtime || 0) * 1000) / 10 || "0"
            }}%</el-tag
          >
        </template>
      </el-table-column>

      <!-- <el-table-column
        align="center"
        sortable="custom"
        prop="progresscourseid"
        label="学习进度"
        width="150"
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
            v-popover:popover
            :percentage="scope.row.alreadyChapter"
          ></el-progress>
        </template>
      </el-table-column> -->

      <el-table-column
        align="center"
        label="考过时间"
        prop="kaoshidate"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ scope.row.kaoshidate | formatDate("YYYY-MM-DD") }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="190" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleExport(scope.row)"
            >导出</el-button
          >
          <!-- <el-button type="text" size="small" @click="handleDelete(scope.row)"
            >删除</el-button
          > -->
          <el-button
            type="text"
            size="small"
            @click="handleGoTo(scope.row, 'edit')"
            >编辑</el-button
          >
          <!-- <Mirror :memberId="scope.row.id" /> -->
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
import {
  getCourseList,
  getCourseChapterTree,
  getMemberStudyLogs,
} from "@api/course";
import { PAGE_SIZE, USER_LEVEL } from "@config";
import Mirror from "@comp/Mirror";

export default {
  components: { Mirror },
  data() {
    return {
      loading: true,
      params: {
        // level: 1,
        category: "2,5,6,22",
        // category: 2,
        ordername: "createdAt",
        ordertype: 0,
      },
      PAGE_SIZE,
      pages: {
        pageindex: 1,
        pagesize: 3000,
        // pagesize: PAGE_SIZE,
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

      const { data: resData } = await getMemberList(this.params, this.pages);
      if (!resData.data.status) return;

      this.loading = false;

      this.total = resData.data.data.count;
      this.list = resData.data.data.rows.map((item) => {
        //学习小时格式化
        item.allstudytime =
          Math.floor(((item.allstudytime || 0) / 60 / 60) * 100) / 100;

        //进度类型   体验：0  付费：1
        if (item.progresstype == 0) {
          item.alreadyChapter = 0;
          return item;
        }

        //已学习的章节名称
        item.alreadyChapter = this.countUserProgress(item.progresschapterid);
        return item;
      });

      //  手动统计每日学习平均值（可删除）
      // let num = 0;
      // let allnum = 0;
      // this.list.forEach((item) => {
      //   if (item.studytimeavg > 0) {
      //     num++;
      //     allnum = item.studytimeavg + allnum;
      //   }
      // });
      // console.log(num, allnum);
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
    async queryCourseTerrList() {
      this.loading = true;

      const { data: resData } = await getCourseChapterTree(1); //0: 免费  1：付费

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
    async handleDelete(row) {
      this.$message.error("请联系程序员删除！");

      // this.$confirm("是否删除当前会员？", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "error",
      // })
      //   .then(async () => {
      //     const { data: resData } = await deleteMemberStatus(row.id);
      //     if (!resData.data.status) return;

      //     this.$message.success("删除成功");
      //     this.queryList();
      //   })
      //   .catch(() => {});
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
          // await getMemberCourseExport("2428", "YIDIFAN");
        })
        .catch(() => {});
    },

    /**
     * 循环导出
     */
    handleXuanHuangDaoChu() {
      let index = 0;

      // 遍历出有考过日期的学员列表
      // const userList = this.list.filter((item) => item.kaoshidate);
      const userList = this.list;

      console.log("循环导出开始了。。。，共计：", userList.length);

      const interval = setInterval(() => {
        console.log("当前index：", index);

        getMemberCourseExport(userList[index].id, userList[index].username); // 秦章用的
        // getMemberStudyLogs(
        //   userList[index].id,
        //   userList[index].username + "_" + userList[index].categoryname
        // ); // 尚方方用的
        ++index;

        if (index > userList.length) {
          console.log("循环导出结束了！！！");
          clearInterval(interval);
        }
      }, 20 * 1000);
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
    //删除筛选‘免费用户’
    // delete this.levelList[0];

    await this.queryCourseTerrList();

    this.queryList();
    this.queryCategory();
    this.queryCourseList();
  },
};
</script>
