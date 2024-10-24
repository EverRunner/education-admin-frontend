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
.table-content-img {
  img {
    max-width: 300px;
    max-height: 300px;
    width: auto !important;
  }
}
</style>

<template>
  <section class="public-wp">
    <TabsNav :list="tabsNavList" />

    <ul class="public-search">
      <li class="public-search-left">
        <el-button
          type="primary"
          @click="handleGoTo({}, 'edit')"
          icon="el-icon-plus"
          >添加试题</el-button
        >
        <el-button @click="importTopic = true" icon="el-icon-plus"
          >导入试题</el-button
        >
        <!-- <el-button
          type="primary"
          plain
          @click="handleGoToStrain"
          icon="el-icon-right"
          >应变分类</el-button
        > -->
      </li>
      <li class="public-search-right">
        <el-select
          v-model="params.strain"
          placeholder="请选择应变测试"
          clearable
          @change="strainCategoryChange"
        >
          <el-option
            v-for="(item, index) in strainCategoryList"
            :key="index"
            :label="item"
            :value="index"
          ></el-option>
        </el-select>
        <el-input
          v-model="params.title"
          placeholder="请输入试题"
          clearable
          style="margin-left: 10px;"
        ></el-input>
        <el-button type="warning" @click="handleSearch">搜索</el-button>
      </li>
    </ul>

    <el-table :data="list" v-loading="loading">
      <el-table-column prop="title" label="试题名称" min-width="220">
      </el-table-column>

      <el-table-column prop="title" label="题目" min-width="300">
        <template slot-scope="scope">
          <div
            class="table-content-img"
            v-if="scope.row.content"
            v-html="scope.row.content"
          ></div>
        </template>
      </el-table-column>

      <el-table-column label="单词" min-width="220">
        <template slot-scope="scope">
          <div class="word-a" v-html="scope.row.wordA"></div>
          <div class="word-b" v-html="scope.row.wordB"></div>
        </template>
      </el-table-column>

      <el-table-column label="类型" min-width="100">
        <template slot-scope="scope">
          {{ categoryList[scope.row.category] }}
        </template>
      </el-table-column>

      <el-table-column prop="status" label="状态" min-width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status" size="medium" type="success"
            >启用</el-tag
          >
          <el-tag v-else size="medium" type="danger">禁用</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="最近修改" min-width="160">
        <template slot-scope="scope">
          {{ scope.row.updatedAt | formatDate }}
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="250">
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            type="info"
            @click="handleGoTo(scope.row, 'details')"
            >详情</el-button
          > -->
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
            @click="handleDelete(scope.row)"
            >禁用</el-button
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

    <!-- 导入试题 -->
    <el-dialog
      title="导入试题"
      width="750px"
      top="10vh"
      :visible.sync="importTopic"
    >
      <div>
        <el-form :model="params" style="width:80%" label-width="100px">
          <el-form-item label="Excel表格">
            <el-upload
              class="upload-demo"
              action="/api/uploadhandler/image"
              name="file"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
              :before-upload="beforeUpload"
              :limit="1"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传xls,xlsx文件，且不超过2M
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleImportTopic">提 交</el-button>
        <el-button @click="addTopic = false">取 消</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { getRequestionList, deleteRequestion, importQuestion } from "@api/exam";
import { PAGE_SIZE } from "@config";
import TabsNav from "@comp/TabsNav";

export default {
  components: { TabsNav },

  data() {
    return {
      tabsNavList: [
        { name: "课程列表", path: "/course/index" },
        { name: "单词列表", path: "/word/list" },
        { name: "测试列表", path: "/exam/list" },
        { name: "试题列表", path: "/exam/topic" },
      ],

      loading: true,
      params: {},
      pages: {
        pageindex: 1,
        pagesize: PAGE_SIZE,
      },
      total: 0,
      list: [],
      categoryList: {
        0: "单选",
        1: "多选",
        2: "判断",
      },
      strainCategoryList: {
        "-1": "全部",
        "0": "解剖与机能",
        "1": "评估与治疗",
        "2": "手法与实践",
        "3": "病理与禁忌",
        "4": "专业与道德",
      },

      importTopic: false,
      filePath: "",
    };
  },

  methods: {
    /**
     * 获取列表
     */
    async queryList() {
      this.loading = true;

      const { data: resData } = await getRequestionList(
        this.params,
        this.pages
      );
      if (!resData.data.status) return;

      this.loading = false;

      this.list = resData.data.data.rows.map((item) => {
        // 返回绑定的单词
        if (
          item.bindWordsList.length > 0 &&
          item.bindWordsList[0].yibei_newdcword_paper_const
        ) {
          item.wordA = item.bindWordsList[0].yibei_newdcword_paper_const.atitle;
          item.wordB = item.bindWordsList[0].yibei_newdcword_paper_const.btitle;
        } else {
          item.word = "-";
        }
        return item;
      });
      this.total = resData.data.data.count;
    },

    /**
     * 禁用用户
     */
    async handleDelete(row) {
      this.$confirm("是否禁用当前试题？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      })
        .then(async () => {
          const { data: resData } = await deleteRequestion(row.id);
          if (!resData.data.status) return;

          this.$message.success("禁用成功");
          this.queryList();
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
        name: "EXAM_TOPIC_EDIT",
        query: {
          id: row.id,
        },
      });
    },

    /**
     * 处理跳转到应应变分类
     */
    handleGoToStrain() {
      this.$router.push({
        name: "EXAM_TOPIC_LIST_STRAIN_CATEGORY",
      });
    },

    /**
     * 处理应变分类选择
     */
    strainCategoryChange(val) {
      if (!val) {
        this.params.title = "";
      } else if (val == "-1") {
        this.params.title = "应变测试";
      } else {
        this.params.title = this.strainCategoryList[val];
      }
      this.pages.pageindex = 1;
      this.queryList();
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
     * 文件上传成功
     */
    handleUploadSuccess(res, file) {
      this.filePath = res.data.path;
    },

    /**
     * 文件上传失败时
     */
    handleUploadError() {
      this.$message.error("上传网络错误，请重新上传！");
    },

    /**
     * 文件上传前的操作
     */
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      const isTable =
        file.type !=
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
        file.type != "application/vnd.ms-excel";

      if (isTable) {
        this.$message.error("只能上传表格文件，后缀为：xls、xlsx");
      }

      if (!isLt2M) {
        this.$message.error("文件大小不能超过 2MB!");
      }

      return isLt2M && !isTable;
    },

    /**
     * 导入试题
     */
    async handleImportTopic() {
      if (!this.filePath) return;

      this.$confirm("是否导入？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const { data: resData } = await importQuestion({
          filePath: this.filePath,
        });
        if (!resData.data.status) return;

        this.queryInfo();
        this.importTopic = false;
        // this.filePath = "";
        this.$message.success("导入成功");
      });
    },
  },

  created() {
    this.queryList();
  },
};
</script>
