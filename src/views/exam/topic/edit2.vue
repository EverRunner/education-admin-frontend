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
}

.tab-pane-conten {
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      display: flex;
      flex-direction: column;
      width: calc(100% - 50px);
    }
    em {
      font-size: 14px;
      color: #007aff;
      font-style: normal;
    }
  }

  li + li {
    border-top: 1px dashed #ddd;
  }
}
</style>

<template>
  <section class="public-edit public-body" v-loading="loading">
    <div class="public-edit-title">试题编辑</div>
    <div class="public-edit-form">
      <el-form
        :model="params"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="params.title"
            :autosize="{ minRows: 3, maxRows: 8 }"
            placeholder="请输入标题"
            type="textarea"
          ></el-input>
        </el-form-item>

        <el-form-item label="类型" prop="category">
          <el-select v-model="params.category" placeholder="请选择类型">
            <el-option
              v-for="(item, index) in categoryList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="图片">
          <el-upload
            class="avatar-uploader"
            action="/api/uploadhandler/image"
            :show-file-list="false"
            name="file"
            :on-success="
              (res, file) => {
                handleUploadSuccess(res, file, 'thumb');
              }
            "
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

        <el-form-item label="排序" prop="sort">
          <el-input
            v-model="params.sort"
            placeholder="请输入排序"
            maxlength="5"
            type="number"
          ></el-input>
        </el-form-item>

        <el-form-item label="选项" required>
          <el-radio-group v-model="option">
            <el-radio :label="1">文字</el-radio>
            <el-radio :label="2">图片</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="状态" required>
          <el-radio-group v-model="params.status">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 文字选项 -->
        <div class="options" v-if="option == 1">
          <el-checkbox-group v-model="correctList" v-if="params.category == 1">
            <div
              v-for="(item, index) in params.optionList"
              :key="index"
              class="options-item"
            >
              <span class="sort"> {{ letter(index) }}:</span>
              <el-input
                v-model="item.title"
                placeholder="请输入答案"
                maxlength="100"
              ></el-input>
              <el-checkbox :label="index" v-model="item.correct"
                >正确</el-checkbox
              >
              <el-button
                v-if="params.optionList.length > 1"
                size="small"
                type="danger"
                icon="el-icon-delete"
                circle
                @click="handleOptionDel(index)"
              ></el-button>
            </div>
          </el-checkbox-group>
          <el-radio-group v-model="correct" v-else>
            <div
              v-for="(item, index) in params.optionList"
              :key="index"
              class="options-item"
            >
              <span class="sort"> {{ letter(index) }}:</span>
              <el-input
                v-model="item.title"
                placeholder="请输入答案"
                maxlength="100"
              ></el-input>
              <el-radio :label="index" v-model="item.correct">正确</el-radio>
              <el-button
                v-if="params.optionList.length > 1"
                size="mini"
                type="danger"
                icon="el-icon-delete"
                circle
                @click="handleOptionDel(index)"
              ></el-button>
            </div>
          </el-radio-group>
        </div>

        <!-- 图片选项 -->
        <div class="options" v-else>
          <div
            v-for="(item, index) in params.optionList"
            :key="index"
            class="options-item"
          >
            <span class="sort"> {{ letter(index) }}:</span>
            <el-upload
              class="avatar-uploader"
              action="/api/uploadhandler/image"
              :show-file-list="false"
              name="file"
              :on-success="
                (res, file) => {
                  handleUploadSuccess(res, file, 'itemThumb', index);
                }
              "
              :on-error="handleUploadError"
              :before-upload="beforeUpload"
            >
              <img v-if="item.imageUrl" :src="item.imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-radio :label="index" v-model="item.correct">正确</el-radio>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="handleOptionDel(index)"
            ></el-button>
          </div>
        </div>

        <el-form-item label="">
          <el-button
            size="small"
            icon="el-icon-plus"
            type="warning"
            @click="handleOptionAdd"
            >增加</el-button
          >
        </el-form-item>

        <el-form-item label="答案解析" prop="answeranalysis">
          <el-input
            v-model="params.answeranalysis"
            :autosize="{ minRows: 4, maxRows: 8 }"
            placeholder="请输入答案解析"
            type="textarea"
          ></el-input>
        </el-form-item>

        <el-form-item class="percentage">
          <el-tabs type="border-card">
            <el-tab-pane>
              <span slot="label"
                ><i class="el-icon-s-promotion"></i> 添加单词</span
              >
              <ul v-if="wordOnList.length > 0" class="tab-pane-conten">
                <li v-for="(item, index) in wordOnList" :key="index">
                  <div class="title">
                    <span>
                      <em>A面单词：</em>
                      <div
                        v-html="
                          item.yibei_newdcword_paper_const &&
                            item.yibei_newdcword_paper_const.atitle
                        "
                      ></div>
                    </span>
                    <span class="title">
                      <em>B面单词：</em>
                      <div
                        v-html="
                          item.yibei_newdcword_paper_const &&
                            item.yibei_newdcword_paper_const.btitle
                        "
                      ></div
                    ></span>
                  </div>

                  <div>
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
          </el-tabs>
        </el-form-item>

        <el-form-item class="percentage" label="详情" prop="content">
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
    <el-dialog title="添加单词" width="1000px" :visible.sync="showWord">
      <ul class="public-search">
        <li class="public-search-left"></li>
        <li class="public-search-right">
          <el-input
            v-model="wordParams.keyword"
            placeholder="请输入单词"
          ></el-input>
          <el-button type="warning" @click="handleSearch('word')"
            >搜索</el-button
          >
        </li>
      </ul>

      <el-table :data="wordList" v-loading="loading" size="small">
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

        <el-table-column align="center" label="最近修改">
          <template slot-scope="scope">
            {{ scope.row.updatedAt | formatDate }}
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
  </section>
</template>

<script>
import TinymceEditor from "@comp/TinymceEditor";
import {
  getRequestionInfo,
  addRequestion,
  updateRequestion,
  setWordRequestion,
  getWordRequestion,
  delWordRequestion,
} from "@api/exam";

import { getWordRequestionList } from "@api/word";
import { creationLetter } from "@utils/tools";

import { PAGE_SIZE } from "@config";

export default {
  components: {
    TinymceEditor,
  },
  data() {
    return {
      params: {
        category: 0,
        thumb: "",
        status: 1,
        optionList: [
          {
            title: "",
            content: "",
            sort: 0,
            thumb: "",
            imageUrl: "",
            iscorrectoption: 0,
          },
          {
            title: "",
            content: "",
            sort: 0,
            thumb: "",
            imageUrl: "",
            iscorrectoption: 0,
          },
          {
            title: "",
            content: "",
            sort: 0,
            thumb: "",
            imageUrl: "",
            iscorrectoption: 0,
          },
          {
            title: "",
            content: "",
            sort: 0,
            thumb: "",
            imageUrl: "",
            iscorrectoption: 0,
          },
        ],
      },
      option: 1,
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "change" }],
        category: [
          { required: true, message: "请选择类型", trigger: "change" },
        ],
      },
      categoryList: [
        {
          name: "单选",
          id: 0,
        },
        {
          name: "多选",
          id: 1,
        },
        {
          name: "判断",
          id: 2,
        },
      ],
      correctList: [],
      correct: 0,
      loading: false,

      pages: {
        pageindex: 1,
        pagesize: PAGE_SIZE,
      },
      total: 0,
      showWord: false,
      wordParams: {},
      wordList: [],
      wordOnList: [],
    };
  },
  methods: {
    /**
     * 获取详情
     */
    async queryInfo() {
      this.loading = true;

      const { data: resData } = await getRequestionInfo(this.params.id);

      this.loading = false;

      if (!resData.data.status) return;

      const resObj = {
        ...resData.data.requestInfo,
        optionList: resData.data.optionList,
      };

      this.params = this.$_.cloneDeep(resObj); //深拷贝

      //格式正确答案
      if (this.params.category == 2) {
        this.params.optionList.forEach((item, index) => {
          if (item.iscorrectoption == 1) this.correctList.push(index);
        });
      } else {
        this.params.optionList.forEach((item, index) => {
          if (item.iscorrectoption == 1) this.correct = index;
        });
      }
    },

    /**
     * 增加选项
     */
    handleOptionAdd() {
      this.params.optionList.push({
        title: "",
        content: "",
        thumb: "",
        sort: 0,
        imageUrl: "",
        iscorrectoption: 0,
      });
    },

    /**
     * 删除选项
     */
    handleOptionDel(index) {
      this.params.optionList.splice(index, 1);
    },

    /**
     * 选择正确的值
     */
    handleOptionCorrect(val) {},

    /**
     * 生成字母
     */
    letter(index) {
      return creationLetter(index);
    },

    /**
     * 文件上传成功
     */
    handleUploadSuccess(res, file, type, index) {
      if (type == "thumb") {
        this.params.thumb = res.data.path;
      } else {
        this.params.optionList[index].imageUrl = URL.createObjectURL(file.raw);
        this.params.optionList[index].thumb = res.data.path;
      }
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
      this.$refs[formName].validate((valid) => {
        if (!valid) return false;

        //清空选项
        this.params.optionList.forEach((item) => {
          item.iscorrectoption = 0;
        });

        //根据题的类型，整理正确答案
        if (this.params.category == 2) {
          this.params.optionList.forEach((item, index) => {
            item.sort = index;
            item.content = item.title;
            if (this.correctList.indexOf(index) != -1) item.iscorrectoption = 1;
          });
        } else {
          this.params.optionList.forEach((item, index) => {
            item.sort = index;
            item.content = item.title;
            if (this.correct == index) item.iscorrectoption = 1;
          });
        }

        this.$confirm("是否保存？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            if (this.params.id) {
              const { data: resData } = await updateRequestion(this.params);
              if (!resData.data.status) return;

              this.$router.go(-1);
              this.$message.success("修改成功");
            } else {
              const { data: resData } = await addRequestion(this.params);
              if (!resData.data.status) return;

              this.$router.go(-1);
              this.$message.success("添加成功");
            }
          })
          .catch(() => {});
      });
    },

    /**
     * 获取单词列表
     */
    async queryWordList() {
      this.loading = true;
      const { data: resData } = await getWordRequestionList(
        this.wordParams,
        this.pages
      );
      if (!resData.data.status) return;

      this.loading = false;

      this.wordList = resData.data.data.rows;
      this.total = resData.data.data.count;
    },

    /**
     * 显示添加单词弹框
     */
    showWordOrExam(type) {
      this.pages.pageindex == 1;

      if (type == "word") {
        this.showWord = true;
        this.queryWordList();
      }
    },

    /**
     * 添加单词、测试
     */
    async handleAddWordOrExam(row, type) {
      const { data: resData } = await setWordRequestion({
        requestid: this.params.id,
        wordsid: row.id,
      });

      if (!resData.data.status) return;

      this.showWord = false;

      this.$message.success("单词绑定成功");

      this.queryWordRequestion();
    },

    /**
     * 删除单词关系
     */
    handleDelWordOrExam(row, type) {
      this.$confirm("是否解除绑定？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const { data: resData } = await delWordRequestion({
          requestid: this.params.id,
          wordsid:
            row.yibei_newdcword_paper_const &&
            row.yibei_newdcword_paper_const.id,
        });

        if (!resData.data.status) return;

        this.showWord = false;

        this.$message.success("单词解除绑定");

        this.queryWordRequestion();
      });
    },

    /**
     * 获取绑定的单词
     */
    async queryWordRequestion() {
      const { data: resData } = await getWordRequestion(this.params.id);
      if (!resData.data.status) return;

      this.wordOnList = resData.data.data;
    },

    /**
     * 关闭添加单词、测试弹框
     */
    closeWordOrExam(type) {
      this.showWord = false;
    },

    /**
     * 处理搜索
     */
    handleSearch(type) {
      this.pages.pageindex = 1;

      if (type == "word") {
        this.queryWordList();
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
    if (this.$route.query.id) {
      this.params.id = this.$route.query.id;
      this.queryInfo();
      this.queryWordRequestion();
    }
  },
};
</script>
