<style lang="scss" scope></style>

<template>
  <section class="course-chapter-edit" v-loading="infoLoading">
    <el-form :model="params" :rules="rules" ref="ruleForm" label-width="100px">
      <div class="member-details-wp">
        <div class="member-edit-title">章节设置</div>
        <el-form-item label="章节名称" prop="title" required>
          <el-input
            v-model="params.title"
            placeholder="请输章节名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="课程选择" prop="courseid" required>
          <el-select
            style="width: 100%;"
            v-model="params.courseid"
            placeholder="请选择课程选择"
          >
            <el-option
              v-for="(item, index) in courseList"
              :key="index"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input
            v-model="params.sort"
            placeholder="请输入排序"
            maxlength="5"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="学习步骤" required>
          <el-checkbox-group v-model="studyStepList">
            <el-checkbox label="0">视频</el-checkbox>
            <el-checkbox label="1">关键词（中英）</el-checkbox>
            <el-checkbox label="2">关键词（中英）测试</el-checkbox>
            <el-checkbox label="3">关键词（英）</el-checkbox>
            <el-checkbox label="4">关键词（英）测试</el-checkbox>
            <el-checkbox label="5">章节测试</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="须复习进入" required>
          <el-radio-group v-model="params.isreview">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="章节总测试" required>
          <el-radio-group
            @change="handleIsFinalChange"
            v-model="params.isfinal"
          >
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="开启关键词" required>
          <el-radio-group
            :disabled="params.isfinal ? true : false"
            v-model="params.isbindword"
          >
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>

      <div class="member-details-wp">
        <div class="member-edit-title">视频课程</div>
        <el-form-item label="视频链接" prop="videopath">
          <el-input
            v-model="params.videopath"
            placeholder="请输入视频链接"
          ></el-input>
        </el-form-item>
        <el-form-item label="视频长度" prop="videotimes">
          <el-input
            v-model="params.videotimes"
            placeholder="请输入视频长度"
            maxlength="20"
            type="text"
          ></el-input>
        </el-form-item>
      </div>

      <div class="member-details-wp">
        <div class="member-edit-title">中英关键词卡＆测试</div>

        <div class="title" v-if="wordOnList[0] && wordOnList[0].title">
          <h5>{{ wordOnList[0].title }}</h5>
          <el-button
            type="danger"
            @click="handleDelWordOrExam(wordOnList[0], 'wordZhEn')"
            >删除</el-button
          >
        </div>
        <el-button v-else icon="el-icon-plus" @click="showWordOrExam('word', 0)"
          >添加单词组</el-button
        >
      </div>

      <div class="member-details-wp">
        <div class="member-edit-title">英文关键词卡＆测试</div>
        <div class="title" v-if="wordOnList[1] && wordOnList[1].title">
          <h5>{{ wordOnList[1].title }}</h5>
          <el-button
            type="danger"
            @click="handleDelWordOrExam(wordOnList[1], 'wordEn')"
            >删除</el-button
          >
        </div>
        <el-button v-else icon="el-icon-plus" @click="showWordOrExam('word', 1)"
          >添加单词组</el-button
        >
      </div>

      <div class="member-details-wp" style="margin-bottom: 80px">
        <div class="member-edit-title">章节测试</div>
        <div class="title" v-if="examOnList[0]">
          <h5>{{ examOnList[0].title }}</h5>
          <el-button
            type="danger"
            @click="handleDelWordOrExam(examOnList[0], 'exam')"
            >删除</el-button
          >
        </div>
        <el-button v-else icon="el-icon-plus" @click="showWordOrExam('exam')"
          >添加测试</el-button
        >
      </div>
    </el-form>

    <div class="member-edit-footer" v-if="!loading">
      <el-button @click="$router.go(-1)">取 消</el-button>
      <el-button type="primary" @click="handleSubmit('ruleForm')">
        提 交</el-button
      >
    </div>

    <!-- 添加单词 -->
    <el-dialog title="添加单词组" width="800px" :visible.sync="showWord">
      <ul class="public-search">
        <li class="public-search-left"></li>
        <li class="public-search-right">
          <el-input v-model="wordParams.title" placeholder="单词"></el-input>
          <el-button
            @click="handleSearch('word')"
            icon="el-icon-search"
            type="warning"
            >搜索</el-button
          >
        </li>
      </ul>

      <el-table :data="wordList" v-loading="loading" size="small">
        <el-table-column align="center" prop="title" label="单词组名称">
        </el-table-column>

        <el-table-column align="center" prop="" label="单词数量">
          <template slot-scope="scope">
            {{ scope.row.aa || 20 }}
          </template>
        </el-table-column>

        <el-table-column align="center" prop="" label="说明">
          <template slot-scope="scope">
            {{ scope.row.bb || "" }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="最近修改">
          <template slot-scope="scope">
            {{ scope.row.updatedAt | formatDate }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="90">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleAddWordOrExam(scope.row, 'word', wordIndex)"
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
    <el-dialog title="添加测试" width="800px" :visible.sync="showExam">
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
        <el-table-column align="center" prop="title" label="测试名称">
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
import {
  getChapterInfo,
  addChapter,
  updateChapter,
  getCourseList,
} from "@api/course";
import { getExamList } from "@api/exam";
import { getPracticeList } from "@api/word";
import { PAGE_SIZE } from "@config";

export default {
  components: {
    TinymceEditor,
  },
  data() {
    return {
      studyStepList: [],
      params: {
        category: 1,
        thumb: "",
        dcwordsList: [],
        requestPaperList: [],
        isfinal: 0,
        isreview: 0,
        isbindword: 0,
      },
      infoLoading: false,
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
      wordIndex: 0,
      wordOnList: [{}, {}],
      examParams: {},
      examList: [],
      examOnList: [],
      showExam: false,
      showWord: false,
      loading: false,

      courseList: [],
    };
  },
  methods: {
    /**
     * 获取列表
     */
    async queryCourseList() {
      this.loading = true;

      const { data: resData } = await getCourseList();
      if (!resData.data.status) return;

      this.loading = false;

      this.courseList = resData.data.data.rows;
    },

    /**
     * 获取详情
     */
    async queryInfo() {
      this.infoLoading = true;

      const { data: resData } = await getChapterInfo(this.params.id);
      this.infoLoading = false;
      if (!resData.data.status) return;

      this.params = resData.data.data;

      if (resData.data.data.studystep)
        this.studyStepList = resData.data.data.studystep.split(",");

      //单词练习列表
      this.params.dcwordsList.forEach((item, index) => {
        this.wordOnList[index] = {
          id: item.dcwordspaperid,
          title: item.yibei_newdcword_paper && item.yibei_newdcword_paper.title,
        };
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
      this.params.dcwordsList = this.wordOnList
        .filter((a) => a.id)
        .map((item, index) => {
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
            this.params.studystep = this.studyStepList.sort().join(",");

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
    showWordOrExam(type, index) {
      this.pages.pageindex == 1;

      if (type == "word") {
        this.showWord = true;
        this.wordIndex = index;
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
    async handleAddWordOrExam(row, type, index) {
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
          this.wordOnList[index] = row;
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
      this.showWord = false;
      this.showExam = false;
    },

    /**
     * 删除单词、测试
     */
    async handleDelWordOrExam(row, type) {
      if (type == "wordZhEn") {
        this.$set(this.wordOnList, 0, {});

        this.$message({
          duration: "1000",
          message: "中英单词，删除成功！",
          type: "success",
        });
      } else if (type == "wordEn") {
        this.$set(this.wordOnList, 1, {});

        this.$message({
          duration: "1000",
          message: "英文单词，删除成功！",
          type: "success",
        });
      } else {
        this.$set(this, "examOnList", []);

        this.$message({
          duration: "1000",
          message: "测试，删除成功！",
          type: "success",
        });
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

    /**
     * 处理章节总测试改变时
     */
    handleIsFinalChange(val) {
      if (val == 1) this.params.isbindword = 1;
    },
  },

  async created() {
    if (this.$route.query.courseId)
      this.params.courseid = this.$route.query.courseId;

    if (this.$route.query.id) {
      this.params.id = this.$route.query.id;
      this.queryInfo();
    }

    this.queryCourseList();
  },
};
</script>
