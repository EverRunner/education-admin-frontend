<style lang="scss" scope>
.public-edit {
  &-form {
    width: 100%;
    .el-form-item {
      width: 500px;
      &.percentage {
        width: 100%;
      }
    }
  }
  .options {
    &-item {
      width: 650px;
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .el-input {
        width: 400px;
      }
      .el-checkbox {
        margin: 0 30px 0 20px;
      }
      .el-radio {
        margin: 0 30px 0 20px;
      }
      .sort {
        font-size: 14px;
        color: #606266;
        width: 100px;
        text-align: right;
        padding-right: 12px;
        box-sizing: border-box;
      }
    }
  }
  .tab-pane-conten {
    padding: 20px 0;
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      height: 50px;
      line-height: 50px;
      &:hover {
        background-color: #f0f0ff;
      }
    }
  }
}
</style>

<template>
  <section class="public-edit public-body">
    <div class="public-edit-title">
      {{ $route.meta.title }}
    </div>
    <div class="public-edit-form">
      <el-form
        :model="params"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="params.title" placeholder="请输入标题"></el-input>
        </el-form-item>

        <el-form-item label="缩略图" prop="thumb">
          <el-upload
            class="avatar-uploader"
            action="/api/uploadhandler/image"
            :show-file-list="false"
            name="file"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :before-upload="beforeUpload"
          >
            <img
              v-if="params.thumb"
              :src="params.thumb | formatImage"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="单元测试" required>
          <el-radio-group v-model="params.isfinal">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="需复习进入" required>
          <el-radio-group v-model="params.isreview">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="开启关键词" required>
          <el-radio-group v-model="params.isbindword">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input
            v-model="params.sort"
            placeholder="请输入排序"
            maxlength="5"
            type="number"
          ></el-input>
        </el-form-item>

        <el-form-item label="视频地址" prop="videopath">
          <el-input
            v-model="params.videopath"
            :autosize="{ minRows: 3, maxRows: 8 }"
            placeholder="请输入视频地址"
            type="textarea"
          ></el-input>
        </el-form-item>

        <el-form-item label="视频时间" prop="videotimes">
          <el-input
            v-model="params.videotimes"
            placeholder="请输入视频时间"
            maxlength="20"
            type="text"
          ></el-input>
        </el-form-item>

        <el-form-item label="简介" prop="description">
          <el-input
            v-model="params.description"
            :autosize="{ minRows: 3, maxRows: 8 }"
            placeholder="请输入简介"
            type="textarea"
          ></el-input>
        </el-form-item>

        <el-form-item class="percentage">
          <el-tabs type="border-card">
            <el-tab-pane>
              <span slot="label"
                ><i class="el-icon-s-promotion"></i> 添加单词</span
              >
              <ul class="tab-pane-conten">
                <li v-for="(item, index) in wordOnList" :key="index">
                  <span>{{ index + 1 }}.{{ item.title }}</span>

                  <div>
                    <el-button
                      type="warning"
                      size="mini"
                      circle
                      icon="el-icon-top"
                      @click="handleWordSort(index, 'word', 'up')"
                    ></el-button>
                    <el-button
                      type="warning"
                      size="mini"
                      circle
                      icon="el-icon-bottom"
                      @click="handleWordSort(index, 'word', 'down')"
                    ></el-button>
                    <el-button
                      type="danger"
                      size="mini"
                      circle
                      icon="el-icon-delete"
                      @click="handleDelWordOrExam(item, 'word')"
                    ></el-button>
                  </div>
                </li>
              </ul>

              <el-button
                @click="showWordOrExam('word')"
                type="warning"
                size="small"
              >
                添加单词</el-button
              >
            </el-tab-pane>
            <el-tab-pane label="label">
              <ul class="tab-pane-conten">
                <li v-for="(item, index) in examOnList" :key="index">
                  <span>{{ index + 1 }}.{{ item.title }}</span>

                  <div>
                    <el-button
                      type="danger"
                      size="mini"
                      circle
                      icon="el-icon-delete"
                      @click="handleDelWordOrExam(item, 'exam')"
                    ></el-button>
                  </div>
                </li>
              </ul>
              <span slot="label"><i class="el-icon-s-help"></i> 添加测试</span>
              <el-button
                @click="showWordOrExam('exam')"
                type="warning"
                plain
                size="small"
                >添加测试</el-button
              ></el-tab-pane
            >
          </el-tabs>
        </el-form-item>

        <el-form-item class="percentage" label="详情内容" prop="content">
          <tinymce-editor ref="editor" v-model="params.content" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit('ruleForm')"
            >提 交</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <!-- 添加单词 -->
    <el-dialog title="添加单词" width="80%" :visible.sync="showWord">
      <el-form
        class="public-search-form"
        :model="wordParams"
        label-width="80px"
      >
        <div class="content">
          <el-form-item label="标题">
            <el-input
              v-model="wordParams.title"
              placeholder="请输入标题"
            ></el-input>
          </el-form-item>
        </div>

        <el-form-item>
          <el-button
            @click="handleSearch('word')"
            icon="el-icon-search"
            type="primary"
            >搜索</el-button
          >
        </el-form-item>
      </el-form>

      <el-table :data="wordList" v-loading="loading" size="small">
        <el-table-column align="center" type="index" label="序号">
        </el-table-column>

        <el-table-column align="center" prop="title" label="标题">
        </el-table-column>

        <el-table-column align="center" prop="sort" label="排序">
        </el-table-column>

        <el-table-column align="center" label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.createdAt | formatDate }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="warning"
              @click="handleAddWordOrExam(scope.row, 'word')"
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
          :page-sizes="[pages.pagesize, 30, 50, 100, 200]"
          :page-size="pages.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeWordOrExam">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加测试 -->
    <el-dialog title="添加测试" width="80%" :visible.sync="showExam">
      <el-form
        class="public-search-form"
        :model="examParams"
        label-width="80px"
      >
        <div class="content">
          <el-form-item label="标题">
            <el-input
              v-model="examParams.title"
              placeholder="请输入标题"
            ></el-input>
          </el-form-item>
        </div>

        <el-form-item>
          <el-button @click="handleSearch" icon="el-icon-search" type="primary"
            >搜索</el-button
          >
        </el-form-item>
      </el-form>

      <el-table :data="examList" v-loading="loading" size="small">
        <el-table-column align="center" type="index" label="序号">
        </el-table-column>

        <el-table-column align="center" prop="title" label="标题">
        </el-table-column>

        <el-table-column align="center" prop="title" label="通过比例">
          <template slot-scope="scope">
            {{ scope.row.qualifiedproportion * 100 }}%
          </template>
        </el-table-column>

        <el-table-column align="center" prop="phone" label="重复测试">
          <template slot-scope="scope">
            {{ scope.row.isrepeattest ? "是" : "否" }}
          </template>
        </el-table-column>

        <el-table-column align="center" prop="sort" label="排序">
        </el-table-column>

        <el-table-column align="center" label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.createdAt | formatDate }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="warning"
              @click="handleAddWordOrExam(scope.row, 'exam')"
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
          :page-sizes="[pages.pagesize, 30, 50, 100, 200]"
          :page-size="pages.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeWordOrExam">取 消</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import TinymceEditor from "@comp/TinymceEditor";
import { getChapterInfo, addChapter, updateChapter } from "@api/course";
import { getExamList } from "@api/exam";
import { getPracticeList } from "@api/word";
import { PAGE_SIZE } from "@config";

export default {
  components: {
    TinymceEditor,
  },
  data() {
    return {
      params: {
        category: 1,
        thumb: "",
        dcwordsList: [],
        requestPaperList: [],
        isfinal: 0,
        isreview: 0,
        isbindword: 0,
      },
      option: 1,
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "change" }],
        // thumb: [{ required: true, message: "请上传缩略图", trigger: "change" }],
        sort: [{ required: true, message: "请输入排序", trigger: "change" }],
      },
      pages: {
        pageindex: 1,
        pagesize: PAGE_SIZE,
      },
      total: 0,
      activeName: "",
      wordParams: {},
      wordList: [],
      wordOnList: [],
      examParams: {},
      examList: [],
      examOnList: [],
      showExam: false,
      showWord: false,
      loading: false,
    };
  },
  methods: {
    /**
     * 获取详情
     */
    async queryInfo() {
      const { data: resData } = await getChapterInfo(this.params.id);
      if (!resData.data.status) return;

      this.params = resData.data.data;

      //单词练习列表
      this.params.dcwordsList.forEach((item) => {
        this.wordOnList.push({
          id: item.dcwordspaperid,
          title: item.yibei_newdcword_paper && item.yibei_newdcword_paper.title,
        });
      });

      //单元测试列表
      this.params.requestPaperList.forEach((item) => {
        this.examOnList.push({
          id: item.requestpaperid,
          title:
            item.yibei_requestion_paper && item.yibei_requestion_paper.title,
        });
      });
    },

    /**
     * 获取单词列表
     */
    async queryWordList() {
      this.loading = true;
      const { data: resData } = await getPracticeList(
        this.wordParams,
        this.pages
      );
      if (!resData.data.status) return;

      this.loading = false;

      this.wordList = resData.data.data.rows;
      this.total = resData.data.data.count;
    },

    /**
     * 获取考试列表
     */
    async queryExamList() {
      this.loading = true;
      const { data: resData } = await getExamList(this.examParams, this.pages);
      if (!resData.data.status) return;

      this.loading = false;

      this.examList = resData.data.data.rows;
      this.total = resData.data.data.count;
    },

    /**
     * 文件上传成功
     */
    handleUploadSuccess(res, file) {
      this.params.thumb = res.data.path;
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
      const isImage = file.type.indexOf("image") != -1;

      if (!isImage) {
        this.$message.error("只能上传图片!");
      }

      if (!isLt2M) {
        this.$message.error("图片大小不能超过 2MB!");
      }
      return isLt2M && isImage;
    },

    /**
     * 提交修改
     */
    handleSubmit(formName) {
      //单词参数
      this.params.dcwordsList = this.wordOnList.map((item, index) => {
        return { dcwordspaperid: item.id, sort: index };
      });

      //测试题参数
      this.params.requestPaperList = this.examOnList.map((item, index) => {
        return { requestpaperid: item.id, sort: index };
      });

      this.$refs[formName].validate((valid) => {
        if (!valid) return false;

        this.$confirm("是否保存？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            if (this.params.id) {
              const { data: resData } = await updateChapter(this.params);
              if (!resData.data.status) return;

              this.$router.go(-1);
              this.$message.success("修改成功");
            } else {
              const { data: resData } = await addChapter(this.params);
              if (!resData.data.status) return;

              this.$router.go(-1);
              this.$message.success("添加成功");
            }
          })
          .catch(() => {});
      });
    },

    /**
     * 显示添加单词、测试弹框
     */
    showWordOrExam(type) {
      this.pages.pageindex == 1;

      if (type == "word") {
        this.showWord = true;
        this.queryWordList();
      } else {
        this.showExam = true;
        this.queryExamList();
      }
    },

    /**
     * 关闭添加单词、测试弹框
     */
    closeWordOrExam(type) {
      this.showWord = false;
      this.showExam = false;
    },

    /**
     * 添加单词、测试
     */
    async handleAddWordOrExam(row, type) {
      if (type == "word") {
        if (
          this.$_.find(this.wordOnList, (a) => {
            return a.id == row.id;
          })
        )
          this.$message({
            duration: "1000",
            message: "已添加，请勿重复添加单词！",
            type: "error",
          });
        else {
          this.wordOnList.push(row);
          this.$message({
            duration: "700",
            message: "单词添加成功！",
            type: "success",
          });
        }
      } else {
        if (
          this.$_.find(this.examOnList, (a) => {
            return a.id == row.id;
          })
        )
          this.$message({
            duration: "1000",
            message: "已添加，请勿重复添加测试！",
            type: "error",
          });
        else {
          this.examOnList.push(row);
          this.$message({
            duration: "700",
            message: "测试添加成功！",
            type: "success",
          });
        }
      }
    },

    /**
     * 删除单词、测试
     */
    async handleDelWordOrExam(row, type) {
      if (type == "word") {
        this.wordOnList = this.$_.remove(this.wordOnList, function(a) {
          return a.id != row.id;
        });

        this.$message({
          duration: "1000",
          message: "单词，删除成功！",
          type: "success",
        });
      } else {
        this.examOnList = this.$_.remove(this.examOnList, function(a) {
          return a.id != row.id;
        });

        this.$message({
          duration: "1000",
          message: "测试，删除成功！",
          type: "success",
        });
      }
    },

    /**
     * 处理排序
     */
    handleWordSort(index, type, action) {
      if (type == "word") {
        //上移
        if (action == "up") {
          if (index == 0) return;

          this.wordOnList[index] = this.wordOnList.splice(
            index - 1,
            1,
            this.wordOnList[index]
          )[0];
        }

        //下移
        if (action == "down") {
          if (index >= this.wordOnList.length - 1) return;

          this.wordOnList[index] = this.wordOnList.splice(
            index + 1,
            1,
            this.wordOnList[index]
          )[0];
        }

        return;
      }
    },

    /**
     * 处理搜索
     */
    handleSearch(type) {
      this.pages.pageindex = 1;

      if (type == "word") {
        this.queryWordList();
      } else {
        this.queryExamList();
      }
    },

    /**
     * pageSize 改变时会触发
     */
    handleSizeChange(val) {
      this.pages.pagesize = val;
      this.pages.pageindex = 1;
      this.queryWordList();
    },

    /**
     * pageindex 改变时会触发
     */
    handleCurrentChange(val) {
      this.pages.pageindex = val;
      this.queryWordList();
    },
  },

  async created() {
    if (this.$route.query.courseId)
      this.params.courseid = this.$route.query.courseId;

    if (this.$route.query.id) {
      this.params.id = this.$route.query.id;
      this.queryInfo();
    }
  },
};
</script>
