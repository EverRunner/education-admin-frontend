<style lang="scss" scope></style>

<template>
  <section class="course-topic" v-loading="loading">
    <el-form :model="params" :rules="rules" ref="ruleForm" label-width="80px">
      <div class="member-details-wp">
        <div class="member-edit-title">试题设置</div>
        <el-form-item label="试题名称" prop="title" required>
          <el-input
            v-model="params.title"
            :autosize="{ minRows: 3, maxRows: 8 }"
            placeholder="请输入标题"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" required>
          <el-radio-group v-model="params.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="类型" prop="category" required>
          <el-select v-model="params.category" placeholder="请选择类型">
            <el-option
              v-for="(item, index) in categoryList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>

      <div class="member-details-wp">
        <div class="member-edit-title">题目</div>
        <el-form-item class="percentage" label="题目" prop="content" required>
          <tinymce-editor
            height="245px"
            ref="editor"
            v-model="params.content"
          />
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            class="public-upload-drag"
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
            drag
          >
            <img
              v-if="params.thumb"
              :src="params.thumb | formatImage"
              class="avatar"
            />
            <template v-else>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">
                只能上传jpg/png文件，且不超过2M
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </div>

      <div class="member-details-wp">
        <div class="member-edit-title">选项</div>
        <el-form-item label="类型" required>
          <el-radio-group v-model="option">
            <el-radio :label="1">文字</el-radio>
            <el-radio :label="2">图片</el-radio>
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
                maxlength="200"
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
              <span class="sort"> {{ letter(index) }}</span>
              <el-input
                v-model="item.title"
                placeholder="请输入选项"
                maxlength="200"
              ></el-input>
              <el-radio :label="index" v-model="item.correct"
                >正确答案</el-radio
              >
              <el-button
                v-if="params.optionList.length > 1"
                size="small"
                type="danger"
                icon="el-icon-delete"
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
            <span class="sort"> {{ letter(index) }}</span>
            <el-upload
              class="public-upload-drag"
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
              drag
            >
              <img v-if="item.imageUrl" :src="item.imageUrl" class="avatar" />
              <template v-else>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  将文件拖到此处，或<em>点击上传</em>
                </div>
              </template>
            </el-upload>
            <el-radio :label="index" v-model="item.correct">正确</el-radio>
            <el-button
              size="small"
              type="danger"
              icon="el-icon-delete"
              @click="handleOptionDel(index)"
            ></el-button>
          </div>
        </div>
        <div class="options-add">
          <el-button size="small" icon="el-icon-plus" @click="handleOptionAdd"
            >添加选项</el-button
          >
        </div>
        <el-form-item label="答案解析" prop="answeranalysis">
          <el-input
            :autosize="{ minRows: 3, maxRows: 8 }"
            v-model="params.answeranalysis"
            placeholder="请输入答案解析"
            type="textarea"
          ></el-input>
        </el-form-item>
      </div>

      <div class="member-details-wp" style="margin-bottom: 80px">
        <div class="member-edit-title">关联单词</div>
        <div class="course-topic-word" v-if="wordOnList[0]">
          <div class="item">
            <span class="item-title">A面</span>
            <div
              class="item-content"
              v-html="
                wordOnList[0].yibei_newdcword_paper_const &&
                  wordOnList[0].yibei_newdcword_paper_const.atitle
              "
            ></div>
          </div>
          <div class="item">
            <span class="item-title">B面</span>
            <div
              class="item-content"
              v-html="
                wordOnList[0].yibei_newdcword_paper_const &&
                  wordOnList[0].yibei_newdcword_paper_const.btitle
              "
            ></div>
          </div>
          <el-button
            class="btn"
            type="primary"
            @click="handleShowEditWord(wordOnList[0])"
            >修改</el-button
          >
          <el-button
            class="btn"
            type="danger"
            @click="handleDelWordOrExam(wordOnList[0])"
            >移除</el-button
          >
        </div>
        <div v-else>
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="showWordOrExam('createWord')"
            >创建单词</el-button
          >
          <el-button icon="el-icon-plus" @click="showWordOrExam('word')"
            >选择增加单词</el-button
          >
        </div>
      </div>
    </el-form>

    <div class="member-edit-footer" v-if="!loading">
      <el-button @click="$router.go(-1)">取 消</el-button>
      <el-button type="primary" @click="handleSubmit('ruleForm')">
        提 交</el-button
      >
    </div>

    <el-dialog
      title="单词设置"
      width="700px"
      top="9vh"
      :visible.sync="showCreateWord"
    >
      <div>
        <el-form ref="ruleform" :model="paramsWord" label-width="80px">
          <el-form-item
            class="percentage"
            label="A面单词"
            prop="atitle"
            style="width: 96%"
            required
          >
            <tinymce-editor
              id="atitle"
              height="182px"
              ref="atitle"
              :menubar="false"
              toolbar="bold italic underline strikethrough | removeformat | code"
              v-model="paramsWord.atitle"
            />
          </el-form-item>

          <el-form-item
            class="percentage"
            label="B面单词"
            prop="btitle"
            style="width: 96%"
            required
          >
            <tinymce-editor
              height="182px"
              id="btitle"
              :menubar="false"
              ref="btitle"
              toolbar="bold italic underline strikethrough | removeformat | code"
              v-model="paramsWord.btitle"
            />
          </el-form-item>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleAddlTopic">提 交</el-button>
        <el-button @click="closeWordOrExam">取 消</el-button>
      </div>
    </el-dialog>

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
              v-model="wordParams.keyword"
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
              @click="handleAddWordOrExam(scope.row)"
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
import { updateWord, addWord } from "@api/word";
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
      paramsWord: {
        paperid: "346", // 单词列表-公共单词库
        atitle: "",
        btitle: "",
        sort: "",
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
      showCreateWord: false,
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
     * 处理显示单词编辑
     */
    handleShowEditWord(row) {
      const wordObj = row?.yibei_newdcword_paper_const;
      if (!wordObj) return;

      this.paramsWord.id = wordObj.id;
      this.paramsWord.paperid = wordObj.paperid;
      this.paramsWord.atitle = wordObj.atitle;
      this.paramsWord.btitle = wordObj.btitle;

      this.showCreateWord = true;
    },

    /**
     * 创建/编辑单词
     */
    async handleAddlTopic() {
      this.$refs.ruleform.validate((valid) => {
        if (!valid) return false;

        this.$confirm("是否保存？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(async () => {
          if (this.paramsWord.id) {
            const { data: resData } = await updateWord(this.paramsWord);
            if (!resData.data.status) return;

            this.queryWordRequestion();
            this.showCreateWord = false;
            this.$message.success("修改成功");
          } else {
            // 添加单词
            const { data: resData } = await addWord(this.paramsWord);
            if (!resData.data.status) return;

            // 绑定单词
            const resDataWord = await this.handleBindWord(
              this.params.id,
              resData.data.data.id
            );

            if (!resDataWord.data.status) return;

            this.queryWordRequestion();
            this.showCreateWord = false;
            this.$message.success("添加成功");
          }
        });
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

      if (type == "createWord") {
        this.showCreateWord = true;

        this.paramsWord = {
          paperid: "346", // 单词列表-公共单词库
          atitle: "",
          btitle: "",
          sort: "",
        };
      }
    },

    /**
     * 添加单词、测试
     */
    async handleBindWord(requestid, wordId) {
      const { data: resData } = await setWordRequestion({
        requestid: requestid,
        wordsid: wordId,
      });
      return resData;
    },

    /**
     * 添加单词、测试
     */
    async handleAddWordOrExam(row) {
      const resData = await this.handleBindWord(this.params.id, row.id);
      if (!resData.data.status) return;

      this.showWord = false;
      this.$message.success("单词绑定成功");
      this.queryWordRequestion();
    },

    /**
     * 删除单词关系
     */
    handleDelWordOrExam(row) {
      this.$confirm("是否移出绑定？", "提示", {
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
      this.showCreateWord = false;
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
