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
        <el-form-item label="标题">
          <el-input v-model="params.title" placeholder="请输入标题"></el-input>
        </el-form-item>
      </div>

      <el-form-item>
        <el-button @click="handleSearch" icon="el-icon-search" type="primary"
          >搜索</el-button
        >
        <el-button icon="el-icon-plus" @click="importTopic = true" type="danger"
          >导入</el-button
        >
        <el-button
          icon="el-icon-plus"
          @click="handleShowEdit('add')"
          type="warning"
          >增加</el-button
        >
      </el-form-item>
    </el-form>

    <el-table :data="topicList" v-loading="loading" class="publi-table">
      <el-table-column align="center" type="index" label="序号" width="80">
      </el-table-column>

      <el-table-column align="center" prop="atitle" label="A面单词">
        <template slot-scope="scope">
          <div v-html="scope.row.atitle"></div>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="btitle" label="B面单词">
        <template slot-scope="scope">
          <div v-html="scope.row.btitle"></div>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="sort" label="排序" width="80">
      </el-table-column>

      <el-table-column align="center" label="创建时间" width="150">
        <template slot-scope="scope">
          {{ scope.row.createdAt | formatDate }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            @click="handleShowEdit('edit', scope.row)"
            >编辑</el-button
          >
          <el-button size="mini" type="info" @click="handleDelTopic(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 导入单词 -->
    <el-dialog
      title="导入单词"
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

    <!-- 添加试题 -->
    <el-dialog title="添加单词" width="60%" top="10vh" :visible.sync="addTopic">
      <div>
        <el-form ref="ruleform" :model="params" label-width="100px">
          <el-form-item
            class="percentage"
            label="A面单词"
            prop="atitle"
            style="width:95%"
          >
            <tinymce-editor
              id="atitle"
              height="220px"
              ref="atitle"
              :menubar="false"
              toolbar="bold italic underline strikethrough | removeformat | code"
              v-model="paramsEdit.atitle"
            />
          </el-form-item>

          <el-form-item
            class="percentage"
            label="B面单词"
            prop="btitle"
            style="width:95%"
          >
            <tinymce-editor
              height="220px"
              id="btitle"
              :menubar="false"
              ref="btitle"
              toolbar="bold italic underline strikethrough | removeformat | code"
              v-model="paramsEdit.btitle"
            />
          </el-form-item>

          <!-- <el-form-item label="发音音频">
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :limit="1"
              :on-exceed="handleExceed"
              :file-list="fileList"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传mp3文件，且不超过2M
              </div>
            </el-upload>
          </el-form-item> -->

          <el-form-item label="排序" style="width:340px">
            <el-input
              v-model="paramsEdit.sort"
              placeholder="请输入排序"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleAddlTopic">提 交</el-button>
        <el-button @click="addTopic = false">取 消</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import TinymceEditor from "@comp/TinymceEditor";
import {
  getWordList,
  setPracticeOption,
  updateWord,
  addWord,
  deleteWord,
  importWord,
} from "@api/word";
import { PAGE_SIZE } from "@config";

export default {
  components: {
    TinymceEditor,
  },

  data() {
    return {
      loading: true,
      params: {
        paperid: "",
        requestionid: [],
      },
      topicParams: {},
      dialogParams: {},

      list: [],
      topicList: [],
      addAndEdit: "add",
      paramsEdit: {
        paperid: "",
        atitle: "",
        btitle: "",
        sort: "",
      },
      addTopic: false,

      importTopic: false,

      rules: {
        atitle: [
          { required: true, message: "请输入A面单词", trigger: "change" },
        ],
        btitle: [
          { required: true, message: "请输入B面单词", trigger: "change" },
        ],
      },

      categoryList: {
        0: "单选",
        1: "多选",
        2: "判断",
      },
    };
  },

  methods: {
    /**
     * 获取详情
     */
    async queryInfo() {
      this.loading = true;

      const { data: resData } = await getWordList(this.params.paperid);
      if (!resData.data.status) return;
      this.loading = false;

      this.topicList = resData.data.data;
    },

    /**
     * 添加编辑显示
     */
    async handleShowEdit(type, row) {
      this.addTopic = true;
      this.addAndEdit = type;

      if (type == "edit") {
        this.paramsEdit = row;
      } else {
        this.paramsEdit.atitle = "";
        this.paramsEdit.btitle = "";
        this.paramsEdit.sort = "";
      }
    },

    /**
     * 添加试题
     */
    async handleAddlTopic() {
      this.$refs.ruleform.validate((valid) => {
        if (!valid) return false;

        this.$confirm("是否保存？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(async () => {
          if (this.addAndEdit == "edit") {
            const { data: resData } = await updateWord(this.paramsEdit);
            if (!resData.data.status) return;

            this.addTopic = false;
            this.queryInfo();
            this.$message.success("修改成功");
          } else {
            const { data: resData } = await addWord(this.paramsEdit);
            if (!resData.data.status) return;

            this.addTopic = false;
            this.queryInfo();
            this.$message.success("添加成功");
          }
        });
      });
    },

    /**
     * 删除试题
     */
    async handleDelTopic(row) {
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const { data: resData } = await deleteWord(row.id);
        if (!resData.data.status) return;

        this.queryInfo();
        this.$message.success("删除成功");
      });
    },

    /**
     * 文件上传成功
     */
    handleUploadSuccess(res, file) {
      this.paramsEdit.filePath = res.data.path;
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
     * 导入单词
     */
    async handleImportTopic(row) {
      this.$confirm("是否导入？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const { data: resData } = await importWord(this.paramsEdit);
        if (!resData.data.status) return;

        this.queryInfo();
        this.importTopic = false;
        this.$message.success("导入成功");
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
        name: "EXAM_TOPIC_EDIT",
        query: {
          id: row.id,
        },
      });
    },
  },

  created() {
    if (this.$route.query.id) {
      this.params.paperid = this.$route.query.id;
      this.paramsEdit.paperid = this.$route.query.id;
    }
    this.queryInfo();
  },
};
</script>
