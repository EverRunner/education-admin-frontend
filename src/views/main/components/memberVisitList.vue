<style lang="scss" scoped></style>

<template>
  <section>
    <ul class="public-search" style="padding-top: 0;">
      <li class="public-search-left">
        <el-date-picker
          v-model="dateTime"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="访问开始"
          end-placeholder="访问结束"
          align="left"
          style="width: 260px"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
        >
        </el-date-picker>
      </li>
      <li class="public-search-right">
        <el-input
          v-model="params.keywords"
          placeholder="学员姓名"
          clearable
        ></el-input>
        <el-button type="warning" @click="handleSearch">搜索</el-button>
      </li>
    </ul>

    <el-table
      :data="list"
      v-loading="loading"
      @cell-click="handleCellClick"
      class="publi-table"
      @sort-change="handleTableSort"
    >
      <el-table-column width="120" prop="username" label="姓名">
        <template slot-scope="scope">
          <span
            :class="[
              'table-column-mark',
              {
                succeed: scope.row.online == 1,
              },
            ]"
            >{{ scope.row.username }}</span
          >
        </template>
      </el-table-column>

      <el-table-column width="100" prop="categoryName" label="用户类型">
      </el-table-column>

      <el-table-column width="100" prop="category" label="设备类型">
        <template slot-scope="scope">
          {{ category[scope.row.category] }}
        </template>
      </el-table-column>

      <el-table-column
        width="100"
        sortable="custom"
        prop="logincount"
        label="学习天数"
      >
        <template slot-scope="scope">
          {{ (scope.row.endhydate ? 120 : 0) + scope.row.xfpaycount * 60 }}天
        </template>
      </el-table-column>

      <el-table-column
        width="120"
        sortable="custom"
        prop="allstudytime"
        label="学习小时"
      >
        <template slot-scope="scope">
          {{ scope.row.allStudyTime }}小时
        </template>
      </el-table-column>

      <el-table-column width="120" label="每天平均小时">
        <template slot-scope="scope">
          <span>{{ scope.row.averageHour }}小时</span>
        </template>
      </el-table-column>

      <el-table-column width="150" prop="avgenglish" label="平均准确率（中英）">
        <template slot-scope="scope">
          {{ Math.floor((scope.row.avgzhongwen || 0) * 10000) / 100 || "0" }}%
        </template></el-table-column
      >

      <el-table-column width="150" prop="avgenglish" label="平均准确率（英）">
        <template slot-scope="scope">
          {{ Math.floor((scope.row.avgenglish || 0) * 10000) / 100 || "0" }}%
        </template></el-table-column
      >

      <el-table-column width="120" label="学习进度">
        <template slot-scope="scope">
          <el-popover
            ref="popover"
            placement="left"
            :title="
              scope.row.alreadyChapter
                ? scope.row.alreadyChapter.course
                : '当前用户还未开始学习'
            "
            width="250"
            trigger="hover"
            :content="
              scope.row.alreadyChapter ? scope.row.alreadyChapter.chapter : '-'
            "
          >
          </el-popover>
          <el-progress
            v-popover:popover
            :percentage="scope.row.alreadyChapter.popover"
          ></el-progress>
        </template>
      </el-table-column>

      <el-table-column
        sortable="custom"
        prop="lastlogindate"
        label="登录时间"
      >
        <template slot-scope="scope">
          {{ scope.row.lastlogindate | formatDate }}
        </template>
      </el-table-column>
    </el-table>

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
  </section>
</template>

<script>
import { getMemberCategory } from "@api/member";
import { getMemberVisitList } from "@api/main";
import { getCourseChapterTree } from "@api/course";
import { getOnlineMember } from "@api/user";
import { PAGE_SIZE } from "@config";
import { formatDateTime } from "@utils/tools";
import Mirror from "@comp/Mirror";

export default {
  components: { Mirror },

  data() {
    return {
      loading: true,
      params: {
        orderType: 0,
      },
      PAGE_SIZE,
      pages: {
        pageindex: 1,
        pagesize: PAGE_SIZE,
      },
      total: 0,
      list: [],

      category: {
        1: "电脑",
        2: "手机",
        3: "平板",
      },

      userCategoryList: [],

      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      dateTime: [],

      onlineList: [],
      onlineCount: 0, // 当前在线人数

      courseTerrListFree: [],
      courseTerrList: [],
    };
  },

  methods: {
    /**
     * 获取列表
     */
    async querList() {
      this.loading = true;

      const { data: resData } = await getMemberVisitList(
        this.params,
        this.pages
      );
      if (!resData.data.status) return;

      this.loading = false;

      this.list = resData.data.data.map((item) => {
        //在线状态
        let row = this.onlineList.find((a) => item.memberid == a.userid);
        if (row) item.online = 1;

        item.allStudyTime =
          Math.floor(((item.allstudytime || 0) / 60 / 60) * 100) / 100 || "0";

        //平均小时
        if (item.logincount > 0 && item.allstudytime > 0)
          item.averageHour =
            Math.floor((item.allStudyTime / item.logincount) * 100) / 100;
        else item.averageHour = 0;

        //用户分类
        let categoryRow = this.userCategoryList.find(
          (a) => item.memberCategory == a.id
        );
        if (categoryRow) item.categoryName = categoryRow.categoryname;

        //进度类型
        item.alreadyChapter = this.countUserProgress(
          item.progresschapterid,
          item.progresstype
        );

        return item;
      });
      this.total = resData.data.count;
    },

    /**
     * 获取在线用户列表
     */
    async quergetOnlineList() {
      this.loading = true;

      const { data: resData } = await getOnlineMember();
      if (!resData.data.status) return;

      this.loading = false;

      this.onlineList = resData.data.data.userIdList;
      this.onlineCount = resData.data.data.count;
    },

    /**
     * 获取用户类型
     */
    async queryCategory() {
      const { data: resData } = await getMemberCategory();
      if (!resData.data.status) return;

      this.userCategoryList = resData.data.dataList;
    },

    /**
     * 计算用户进度
     * @parasm  type  体验：0  付费：1
     */
    countUserProgress(currentcoursechapterid, type) {
      let isStudy = true; //是否学习过
      let isStudyIndex = 0;
      let allChapter = 0; //全部章节
      let alreadyChapter = 0; //已学习过的章节
      let course, chapter; //课程、章节
      let courseTerrList =
        type == 0 ? this.courseTerrListFree : this.courseTerrList;

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
            course = item.title;
            chapter = son.title;
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

      //总进度、课程、章节
      return {
        popover: Math.floor((alreadyChapter / allChapter) * 1000) / 10,
        course,
        chapter,
      };
    },

    /**
     * 获取课程列表树状
     */
    async queryCourseTerrList(type) {
      this.loading = true;

      const { data: resData } = await getCourseChapterTree(type); //0: 免费  1：付费

      if (!resData.data.status) return (this.loading = false);

      if (type == 0) this.courseTerrListFree = resData.data.dataList;
      else this.courseTerrList = resData.data.dataList;
    },

    /**
     * 处理表格排序
     */
    handleTableSort({ column, prop, order }) {
      switch (order) {
        case "ascending":
          if (prop == "lastlogindate") this.params.orderType = 1;

          if (prop == "allstudytime") this.params.orderType = 3;

          if (prop == "logincount") this.params.orderType = 5;

          break;

        case "descending":
          if (prop == "lastlogindate") this.params.orderType = 0;

          if (prop == "allstudytime") this.params.orderType = 2;

          if (prop == "logincount") this.params.orderType = 4;

          break;

        default:
          this.params.orderType = 0;
          break;
      }

      this.querList();
    },

    /**
     * 处理搜索
     */
    handleSearch(row, type) {
      this.pages.pageindex = 1;
      this.querList();
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
    },

    /**
     * 处理单元格点击
     */
    handleCellClick(row, column, cell, event) {
      if (column.property == "username") this.handleGoTo(row, "details");
    },

    /**
     * pageSize 改变时会触发
     */
    handleSizeChange(val) {
      this.pages.pagesize = val;
      this.pages.pageindex = 1;
      this.querList();
    },

    /**
     * pageindex 改变时会触发
     */
    handleCurrentChange(val) {
      this.pages.pageindex = val;
      this.querList();
    },
  },

  async created() {
    this.quergetOnlineList();
    this.queryCategory();
    this.queryCourseTerrList(0);
    await this.queryCourseTerrList(1);

    this.querList();
  },

  /**
   * 页面销毁前
   */
  beforeDestroy() {},
};
</script>
