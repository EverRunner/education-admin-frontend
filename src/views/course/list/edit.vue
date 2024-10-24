<style lang="scss" scope></style>

<template>
  <section>
    <div class="member-details-wp" style="margin-bottom: 80px">
      <div class="member-edit-title">课程设置</div>

      <el-form :model="params" :rules="rules" ref="ruleForm" label-width="80px">
        <el-form-item label="课程名称" prop="title">
          <el-input
            v-model="params.title"
            placeholder="请输入课程名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="课程类型" prop="type">
          <el-select
            style="width: 100%;"
            v-model="params.type"
            placeholder="请选择课程类型"
          >
            <el-option
              v-for="(item, index) in categoryList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="课程排序" prop="sort">
          <el-input
            v-model="params.sort"
            placeholder="请输入课程排序"
            maxlength="5"
            type="number"
          ></el-input>
        </el-form-item>

        <el-form-item label="课程缩图" prop="thumb">
          <el-upload
            class="public-upload-drag"
            action="/api/uploadhandler/image"
            :show-file-list="false"
            name="file"
            :on-success="handleUploadSuccess"
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
import TinymceEditor from "@comp/TinymceEditor";
import { getCourseInfo, addCourse, updateCourse } from "@api/course";

export default {
  components: {
    TinymceEditor,
  },
  data() {
    return {
      params: {
        category: 1,
        status: 1,
        thumb: "",
      },
      option: 1,
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "change" }],
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
        thumb: [{ required: true, message: "请上传缩略图", trigger: "change" }],
        sort: [{ required: true, message: "请输入排序", trigger: "change" }],
      },
      categoryList: [
        {
          name: "免费课程",
          id: 0,
        },
        {
          name: "付费课程",
          id: 1,
        },
      ],
      imageUrl: "",

      loading: false,
    };
  },
  methods: {
    /**
     * 获取详情
     */
    async queryInfo() {
      const { data: resData } = await getCourseInfo(this.params.id);
      if (!resData.data.status) return;

      this.params = resData.data.data;
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

        this.$confirm("是否保存？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            if (this.params.id) {
              const { data: resData } = await updateCourse(this.params);
              if (!resData.data.status) return;

              this.$router.go(-1);
              this.$message.success("修改成功");
            } else {
              const { data: resData } = await addCourse(this.params);
              if (!resData.data.status) return;

              this.$router.go(-1);
              this.$message.success("添加成功");
            }
          })
          .catch(() => {});
      });
    },
  },

  async created() {
    if (this.$route.query.id) {
      this.params.id = this.$route.query.id;
      this.queryInfo();
    }
  },
};
</script>
