<style lang="scss" scope>
.member-edit-title {
  span {
    font-size: 12px;
    color: #f56c6c;
  }
}
</style>

<template>
  <section>
    <div class="member-details-wp" style="margin-bottom: 80px">
      <div class="member-edit-title">
        <p>同步进度</p>
        <span
          >重要提示：课程有增加、删除、顺序调整时必须同步进度，否则学习进度会有问题。这个功能同步一次，需要花费很长时间，所以请不频繁执行。</span
        >
      </div>

      <el-form :model="params" :rules="rules" ref="ruleForm" label-width="80px">
        <el-form-item label="课程" prop="type">
          <el-select
            style="width: 100%;"
            v-model="params.courseasyncIds"
            placeholder="请选择需要同步的课程（多选）"
            multiple
          >
            <el-option
              v-for="(item, index) in courseList"
              :key="index"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="通知邮箱" prop="email">
          <el-input
            v-model="params.email"
            placeholder="请输入同步完成后，发送提示的邮箱"
          ></el-input>
        </el-form-item>

        <!-- <el-form-item label="作者">
          <el-input
            v-model="params.author"
            placeholder="请输入作者"
            maxlength="5"
            type="number"
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

        <el-form-item class="percentage" label="详情内容" prop="content">
          <tinymce-editor ref="editor" v-model="params.content" />
        </el-form-item> 
        -->
      </el-form>
    </div>

    <div class="member-edit-footer" v-if="!loading">
      <el-button @click="$router.go(-1)">取 消</el-button>
      <el-button type="primary" @click="handleSubmit('ruleForm')">
        提 交</el-button
      >
    </div>
  </section>
</template>

<script>
import { getCourseList } from "@api/course";
import { asyncCourseAndChapter } from "@api/member";

export default {
  components: {},
  data() {
    return {
      params: {
        courseasyncIds: [],
        email: "usual.rain3325@fastmail.com",
      },
      option: 1,
      rules: {
        courseasyncIds: [
          { required: true, message: "请选择课程", trigger: "change" },
        ],
      },
      courseList: [],
      imageUrl: "",
      pages: {
        pageindex: 1,
        pagesize: 999,
      },

      loading: false,
    };
  },
  methods: {
    /**
     * 获取课程列表
     */
    async queryCourseList() {
      this.loading = true;

      const { data: resData } = await getCourseList(
        {
          type: 1,
        },
        this.pages
      );
      if (!resData.data.status) return;
      this.loading = false;

      this.courseList = resData.data.data.rows;
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
      this.$refs[formName].validate((valid) => {
        if (!valid) return false;

        this.$confirm("同步执行需花费很长时间，确认执行吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            const { data: resData } = await asyncCourseAndChapter(this.params);
            if (!resData.data.status) return;

            this.$router.go(-1);
            this.$message.success("同步执行中，全部完成后会自动发送邮件！ ");
          })
          .catch(() => {});
      });
    },
  },

  async created() {
    this.queryCourseList();
  },
};
</script>
