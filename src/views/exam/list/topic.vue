<style lang="scss" scope>
.answer {
  padding: 10px 0;
  &.on {
    em,
    span {
      color: #67c23a;
      font-weight: bold;
    }
  }
  em {
    font-size: 14px;
    color: #666;
    font-style: normal;
    margin-right: 2px;
  }
  span {
    font-size: 14px;
    color: #333;
  }
}
.word-a {
  &,
  * {
    color: #004988;
  }
}
.word-b {
  &,
  * {
    color: #e6a23c;
  }
}
.el-dialog__body {
  padding-top: 0px;
}
</style>

<template>
  <section class="public-wp">
    <el-breadcrumb
      separator="/"
      class="public-breadcrumb"
      style="margin-bottom: 5px"
    >
      <el-breadcrumb-item class="on">课程</el-breadcrumb-item>
      <el-breadcrumb-item class="on">单词列表</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $route.query.title || "-" }}</el-breadcrumb-item>
    </el-breadcrumb>

    <ul class="public-search">
      <li class="public-search-left">
        <el-button type="primary" @click="handleOpenTopic" icon="el-icon-plus"
          >添加试题</el-button
        >
        <el-button @click="handleOpenExam" icon="el-icon-plus"
          >添加测试列表</el-button
        >
        <el-button @click="handleDeleteAll" icon="el-icon-delete"
          >清空</el-button
        >
        <el-button @click="handleExport" icon="el-icon-download"
          >导出</el-button
        >
        <el-button type="success" @click="handleSubmit" icon="el-icon-postcard"
          >保存</el-button
        >
      </li>
      <li class="public-search-right">
        <el-input v-model="params.title" placeholder="请输入单词"></el-input>
        <el-button type="warning" @click="handleSearch">搜索</el-button>
      </li>
    </ul>

    <el-table
      :data="topicList"
      v-loading="loading"
      @expand-change="handleExpandChange"
      class="publi-table"
    >
      <el-table-column type="expand" align="center" width="60">
        <template slot-scope="scope">
          <div
            class="answer"
            v-for="(item, index) in scope.row.optionList"
            :key="index"
            :class="{ on: item.iscorrectoption == 1 }"
          >
            <em>{{ "答案" + (index + 1) }}：</em>
            <span>{{ item.content }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="title" label="试题名称">
      </el-table-column>

      <el-table-column align="center" prop="title" label="题目">
        <template slot-scope="scope">
          <div
            v-if="scope.row.yibei_requestion_const"
            v-html="scope.row.yibei_requestion_const.content"
          ></div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="单词">
        <template slot-scope="scope">
          <div class="word-a" v-html="scope.row.wordA"></div>
          <div class="word-b" v-html="scope.row.wordB"></div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="类型" width="80">
        <template slot-scope="scope">
          {{ categoryList[scope.row.category] }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status" size="medium" type="success"
            >启用</el-tag
          >
          <el-tag v-else size="medium" type="danger">禁用</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="最近修改" width="150">
        <template slot-scope="scope">
          {{ scope.row.updatedAt | formatDate }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <el-button
            plain
            size="mini"
            type="primary"
            class="public-button-primary--plain"
            @click="handleGoTo(scope.row, 'edit')"
            >编辑</el-button
          >
          <el-button
            plain
            size="mini"
            class="public-button-danger--plain"
            type="danger"
            @click="handleDelTopic(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加试题-题库 -->
    <el-dialog
      title="添加试题（从题库添加）"
      width="1200px"
      :visible.sync="addTopic"
    >
      <ul class="public-search">
        <li class="public-search-left">
          <el-button
            type="primary"
            @click="handleAddlSelect"
            icon="el-icon-edit-outline"
            >添加选中</el-button
          >
        </li>
        <li class="public-search-right">
          <el-input v-model="params.title" placeholder="请输入试题"></el-input>
          <el-button type="warning" @click="handleSearch('exam')"
            >搜索</el-button
          >
        </li>
      </ul>

      <el-table
        ref="multipleTable"
        :data="list"
        v-loading="loading2"
        size="small"
        @expand-change="handleExpandChange"
      >
        <!-- @expand-change="handleExpandChange" -->
        <el-table-column type="expand" align="center" width="60">
          <template slot-scope="scope">
            <div
              class="answer"
              v-for="(item, index) in scope.row.optionList"
              :key="index"
              :class="{ on: item.iscorrectoption == 1 }"
            >
              <em>{{ "答案" + (index + 1) }}：</em>
              <span>{{ item.content }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column type="selection" width="60"></el-table-column>

        <el-table-column align="center" prop="title" label="试题名称">
        </el-table-column>

        <el-table-column align="center" prop="title" label="题目">
          <template slot-scope="scope">
            <div v-if="scope.row.content" v-html="scope.row.content"></div>
          </template>
        </el-table-column>

        <el-table-column align="center" label="单词">
          <template slot-scope="scope" v-if="scope.row.bindWordsList[0]">
            <div
              class="word-a"
              v-html="
                scope.row.bindWordsList[0].yibei_newdcword_paper_const.atitle
              "
            ></div>
            <div
              class="word-b"
              v-html="
                scope.row.bindWordsList[0].yibei_newdcword_paper_const.btitle
              "
            ></div>
          </template>
        </el-table-column>

        <el-table-column align="center" label="类型" width="80">
          <template slot-scope="scope">
            {{ categoryList[scope.row.category] }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="状态" width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status" size="medium" type="success"
              >启用</el-tag
            >
            <el-tag v-else size="medium" type="danger">禁用</el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" label="最近修改" width="150">
          <template slot-scope="scope">
            {{ scope.row.updatedAt | formatDate }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="250">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleAddlTopic(scope.row)"
              >添加</el-button
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
          :page-sizes="[pages.pagesize, 30, 50, 100, 1000]"
          :page-size="pages.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addTopic = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加试题-测试列表 -->
    <el-dialog
      title="添加试题（从测试列表添加）"
      width="1200px"
      :visible.sync="showExam"
    >
      <ul class="public-search">
        <li class="public-search-left">
          <el-button
            type="primary"
            @click="handleExamAddlSelect"
            icon="el-icon-edit-outline"
            >添加选中</el-button
          >
        </li>
        <li class="public-search-right">
          <el-input v-model="params.title" placeholder="请输入测试名"></el-input>
          <el-button type="warning" @click="handleSearch('exam')"
            >搜索</el-button
          >
        </li>
      </ul>

      <el-table
        ref="examListTable"
        :data="examList"
        v-loading="loading3"
        size="small"
      >
        <el-table-column type="selection" width="60"></el-table-column>

        <el-table-column align="center" prop="title" label="测试名称">
        </el-table-column>

        <el-table-column align="center" prop="title" label="通过标准">
          <template slot-scope="scope">
            {{ scope.row.qualifiedproportion * 100 }}%
          </template>
        </el-table-column>

        <el-table-column align="center" prop="phone" label="重复测试">
          <template slot-scope="scope">
            {{ scope.row.isrepeattest ? "是" : "否" }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="最近修改">
          <template slot-scope="scope">
            {{ scope.row.updatedAt | formatDate }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleAddExamTopic([scope.row])"
              >添加</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-algin">
        <el-pagination
          background
          @size-change="handleSizeChange2"
          @current-change="handleCurrentChange2"
          :current-page="pages.pageindex"
          :page-sizes="[pages.pagesize, 30, 50, 100, 200]"
          :page-size="pages.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addTopic = false">取 消</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import {
  getRequestionList,
  setExamOption,
  getExamOption,
  getRequestionInfo,
  getExamList,
  getRrequesListByIds,
  exportQuestionsById,
} from "@api/exam";

import { PAGE_SIZE } from "@config";

export default {
  components: {},
  data() {
    return {
      loading: true,
      loading2: true,

      params: {
        paperid: "",
        requestionList: [],
      },
      topicParams: {},
      dialogParams: {},
      pages: {
        pageindex: 1,
        // pagesize: PAGE_SIZE,
        pagesize: 50,
      },
      total: 0,
      list: [],
      topicList: [],
      categoryList: {
        0: "单选",
        1: "多选",
        2: "判断",
      },
      addTopic: false,

      examList: [],
      showExam: false,
      loading3: false,
    };
  },

  methods: {
    /**
     * 获取详情
     */
    async queryInfo() {
      this.loading = true;

      const { data: resData } = await getExamOption(this.params.paperid);
      if (!resData.data.status) return;

      this.loading = false;

      this.topicList = resData.data.requestList.map((item) => {
        item.optionList = [];

        // 返回绑定的单词
        if (
          item.yibei_newdcword_paper_const.length > 0 &&
          item.yibei_newdcword_paper_const[0].yibei_newdcword_paper_const
        ) {
          item.wordA =
            item.yibei_newdcword_paper_const[0].yibei_newdcword_paper_const.atitle;
          item.wordB =
            item.yibei_newdcword_paper_const[0].yibei_newdcword_paper_const.btitle;
        } else {
          item.word = "-";
        }

        // 返回选项
        if (item.yibei_requestion_const) {
          item.content = item.yibei_requestion_const.content;
          item.title = item.yibei_requestion_const.title;
          item.sort = item.yibei_requestion_const.sort;
          item.category = item.yibei_requestion_const.category;
          item.status = item.yibei_requestion_const.status;
        }

        return item;
      });
    },

    /**
     * 获取测试列表
     */
    async queryExamList() {
      this.loading3 = true;

      const { data: resData } = await getExamList(this.params, this.pages);
      if (!resData.data.status) return;

      this.loading3 = false;

      this.examList = resData.data.data.rows;
      this.total = resData.data.data.count;
    },

    /**
     * 导出试题
     */
    handleExport(row) {
      this.$confirm("是否导出测试题？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await exportQuestionsById(
            this.params.paperid,
            this.$route.query.title
          );
        })
        .catch(() => {});
    },

    /**
     * 获取题详情
     */
    async queryTopicInfo(id) {
      this.loading = true;

      const { data: resData } = await getRequestionInfo(id);

      this.loading = false;

      if (!resData.data.status) return;

      return resData.data.optionList;
    },

    /**
     * 获取列表
     */
    async queryList() {
      this.loading2 = true;

      const { data: resData } = await getRequestionList(
        this.params,
        this.pages
      );
      if (!resData.data.status) return;

      this.loading2 = false;

      this.list = resData.data.data.rows.map((item) => {
        item.optionList = [];
        item.requestionid = item.id;

        return item;
      });

      this.total = resData.data.data.count;
    },

    /**
     * 添加试题
     */
    async handleAddlTopic(row) {
      if (
        this.$_.find(this.topicList, (a) => {
          return a.requestionid == row.requestionid;
        })
      )
        this.$message({
          duration: "1000",
          message: "已添加，请勿重复添加！",
          type: "error",
        });
      else {
        this.topicList.push(row);
        this.$message({
          duration: "700",
          message: "试题添加成功！",
          type: "success",
        });
      }
    },

    /**
     * 添加选中试题
     */
    handleAddlSelect() {
      const topicList = this.$refs.multipleTable.selection;
      topicList.forEach((item) => {
        this.handleAddlTopic(item);
      });
    },

    /**
     * 添加试题-从测试列表中
     */
    async handleAddExamTopic(rows) {
      if (rows.length <= 0) return;

      const ids = rows.map((a) => a.id);

      const resData = await this.queryExamTopicById(ids && ids.join(","));

      //添加题
      resData.forEach((item) => {
        this.handleAddlTopic(item);
      });
    },

    /**
     * 添加选中试题-从测试列表中
     */
    handleExamAddlSelect() {
      const topicList = this.$refs.examListTable.selection;

      if (!topicList)
        return this.$message({
          duration: "3000",
          message: "至少选择一行！",
          type: "error",
        });

      this.handleAddExamTopic(topicList);
    },

    /**
     * 通过测试列表id-从测试列表中
     */
    async queryExamTopicById(ids) {
      const { data: resData } = await getRrequesListByIds({
        ids,
        pageindex: 1,
        pagesize: 1000,
      });

      if (!resData.data.status) return [];

      return resData.data.data.rows.map((item) => {
        if (item.yibei_requestion_const) {
          item.content = item.yibei_requestion_const.content;
          item.title = item.yibei_requestion_const.title;
          item.sort = item.yibei_requestion_const.sort;
          item.category = item.yibei_requestion_const.category;
        }
        return item;
      });
    },

    /**
     * 删除试题
     */
    async handleDelTopic(row) {
      this.topicList = this.$_.remove(this.topicList, function(a) {
        return a.id != row.id;
      });

      this.$message({
        duration: "1000",
        message: "删除成功！",
        type: "success",
      });
    },

    /**
     * 删除试题-全部
     */
    handleDeleteAll() {
      this.$confirm("是否清空全部试题？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        this.topicList = [];
        this.$message.success("测试题已清空");
      });
    },

    /**
     * 处理搜索
     */
    handleSearch(type) {
      if (type == "exam") {
        this.pages.pageindex = 1;
        this.queryExamList();
      } else {
        this.pages.pageindex = 1;
        this.queryList();
      }
    },

    /**
     * 处理跳转
     */
    handleGoTo(row, type) {
      this.$router.push({
        name: "EXAM_TOPIC_EDIT",
        query: {
          id: row.requestionid,
        },
      });
    },

    /**
     * 提交修改
     */
    handleSubmit() {
      //获取试题的id
      this.topicList.forEach((item) => {
        this.params.requestionList.push(item.requestionid);
      });

      if (this.params.requestionList.length <= 0) {
        return this.$message.error("请至少添加一道试题！");
      }

      this.$confirm("是否保存？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const { data: resData } = await setExamOption(this.params);
        if (!resData.data.status) return;

        this.$router.go(-1);
        this.$message.success("保存成功");
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
    handleCurrentChange2(val) {
      this.pages.pageindex = val;
      this.queryExamList();
    },

    /**
     * pageSize 改变时会触发
     */
    handleSizeChange2(val) {
      this.pages.pagesize = val;
      this.pages.pageindex = 1;
      this.queryExamList();
    },

    /**
     * pageindex 改变时会触发
     */
    handleCurrentChange(val) {
      this.pages.pageindex = val;
      this.queryList();
    },

    /**
     * 打开题库
     */
    handleOpenTopic() {
      this.pages.pageindex = 1;

      this.addTopic = true;
      this.queryList();
    },

    /**
     * 打测试列表
     */
    handleOpenExam() {
      this.pages.pageindex = 1;

      this.showExam = true;
      this.queryExamList();
    },

    /**
     * 表格展开
     */
    async handleExpandChange(row, expandedRows) {
      //关闭和optionList已有数据 不触发
      if (expandedRows <= 0 || row.optionList.length > 0) return;

      const list = await this.queryTopicInfo(row.requestionid);
      row.optionList = list;

      // this.topicList.map((item, index) => {
      //   if (row.id == item.id) this.topicList[index].optionList = list;
      // });
    },
  },

  created() {
    if (this.$route.query.id) this.params.paperid = this.$route.query.id;
    this.queryInfo();
  },
};
</script>
