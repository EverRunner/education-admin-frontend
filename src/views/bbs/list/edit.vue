<style lang="scss" scope>
.edit {
}
</style>

<template>
  <section>
    <div class="member-details-wp" style="margin-bottom: 80px">
      <div class="member-edit-title">帖子编辑</div>

      <el-form
        :model="params"
        :rules="rules"
        ref="ruleForm"
        label-width="110px"
      >
        <el-form-item label="帖子类型" prop="category">
          <el-select
            style="width: 100%"
            v-model="params.category"
            placeholder="请选择帖子类型"
          >
            <el-option
              v-for="(item, index) in categoryList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="标题">
          <el-input
            style="width: 100%"
            placeholder="请输入标题"
            maxlength="200"
            v-model="params.title"
          >
          </el-input>
        </el-form-item>

        <!-- <el-form-item label="状态" prop="status">
          <el-radio-group v-model="params.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item> -->

        <el-form-item label="图片">
          <el-upload
            action="/api/uploadhandler/image"
            list-type="picture-card"
            name="file"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :before-upload="beforeUpload"
            :file-list="imgList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="视频地址" v-if="params.category == 5">
          <el-input
            type="textarea"
            style="width: 100%"
            :rows="3"
            placeholder="请输入视频地址"
            maxlength="200"
            v-model="params.vedio"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="联系人">
          <el-input
            style="width: 100%"
            placeholder="请输入视频地址"
            maxlength="200"
            v-model="params.contact"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="联系方式">
          <el-input
            style="width: 100%"
            placeholder="请输入联系方式"
            maxlength="200"
            v-model="params.contactnumber"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="洲名称">
          <el-input
            style="width: 100%"
            placeholder="请输入洲名称，例如：德克萨斯州"
            maxlength="200"
            v-model="params.location"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="经度">
          <el-input
            style="width: 100%"
            placeholder="请输入经度，例如：-97.56346"
            maxlength="200"
            v-model="params.longitude"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="纬度">
          <el-input
            style="width: 100%"
            placeholder="请输入纬度，例如：31.054487"
            maxlength="200"
            v-model="params.latitude"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="内容">
          <el-input
            style="width: 100%"
            type="textarea"
            :rows="9"
            placeholder="请输入发布的内容"
            maxlength="200"
            v-model="params.content"
          >
          </el-input>
        </el-form-item>
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
import { getBbsTarInfo, getBbsCategory, addBbsTar, editBbsTar } from "@api/bbs";
import { PAGE_SIZE } from "@config";
import { formatDateTime } from "@utils/tools";
import { FILE_ROOT } from "@config";

export default {
  components: {},
  data() {
    return {
      loading: false,
      params: {
        status: 1,
      },
      rules: {
        username: [
          { required: true, message: "请输入姓名", trigger: "change" },
          {
            min: 2,
            max: 50,
            message: "长度在 2 到 50 个字符",
            trigger: "change",
          },
        ],
      },
      categoryList: [],
      imgList: [],
      newImgList: [],
      FILE_ROOT,
    };
  },
  methods: {
    /**
     * 获取类型列表
     */
    async queryCategory() {
      const { data: resData } = await getBbsCategory();
      if (!resData.data.status) return;

      this.categoryList = resData.data.data;
    },

    /**
     * 获取会员详情
     */
    async queryInfo() {
      const { data: resData } = await getBbsTarInfo(this.params.id);
      if (!resData.data.status) return;

      const params = resData.data.data;

      //回显参数
      this.params = {
        id: params.id,
        category: params.category,
        content: params.content,
        vedio: params.vedio,
        title: params.title,
        contact: params.contact,
        contactnumber: params.contactnumber,
        location: params.location,
        longitude: params.longitude,
        latitude: params.latitude,
      };

      this.imgList = params.images.split(",").map((url) => {
        return {
          url: FILE_ROOT + url,
        };
      });
    },

    /**
     * 文件上传成功
     */
    handleUploadSuccess(res, file, fileList) {
      this.params.thumb = res.data.path;
      this.newImgList = fileList;
      console.log(12312, this.newImgList);
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

        const images = this.newImgList.map((item) => {
          if (item?.response?.data?.path) return item.response.data.path;
          if (item?.url) {
            return item.url.replace(FILE_ROOT, "");
          }
        });
        if (images.length <= 0)
          return this.$message.error("至少上传一张图片！");

        this.params.images = images.join(",");

        this.$confirm("是否保存？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            if (this.params.id) {
              const { data: resData } = await editBbsTar(this.params);
              if (!resData.data.status) return;

              this.$router.go(-1);
              this.$message.success("修改成功");
            } else {
              const { data: resData } = await addBbsTar(this.params);
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
    await this.queryCategory();

    if (this.$route.query.id) {
      this.params.id = this.$route.query.id;
      this.queryInfo();
    }
  },
};
</script>
