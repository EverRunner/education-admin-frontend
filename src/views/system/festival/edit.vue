<style lang="scss" scope>
.edit {
}
</style>

<template>
  <section>
    <div class="member-details-wp" style="margin-bottom: 80px">
      <div class="member-edit-title">节日编辑</div>
      <el-form
        :model="params"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="节日名称" prop="hlname">
          <el-select
            style="width: 100%"
            v-model="params.hlname"
            placeholder="请选择发布时间"
            clearable
          >
            <el-option
              v-for="(val, index) in festivalList"
              :key="index"
              :label="val"
              :value="val"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="节日时间" prop="hldate">
          <el-date-picker
            style="width: 100%"
            v-model="params.hldate"
            type="datetime"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="发布时间" prop="releaseData">
          <el-date-picker
            v-model="releaseTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:01', '23:59:59']"
            @change="handleDateChange"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 100%"
          >
            >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="发布内容" prop="hlcontent">
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
              v-if="params.hlcontent"
              :src="params.hlcontent | formatImage"
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

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="params.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
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
import { addFestival, updateFestival, getFestivalInfo } from "@api/system";
import { formatDateTime } from "@utils/tools";

export default {
  components: {},
  data() {
    return {
      loading: false,
      params: {
        status: 1,
        hldate: "",
        releaseData: "",
        hlcontent: "",
      },
      releaseTime: [],
      publishList: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      festivalList: [
        "元旦节 New Year's Day",
        "中国春节 Spring Festival",
        "元宵节",
        "妇女节",
        "端午节",
        "中秋节",
        "感恩节 Thanksgiving Day",
        "圣诞节 Christmas",
      ],
      rules: {
        hlname: [
          { required: true, message: "请选择节日名称", trigger: "change" },
        ],
        hldate: [
          { required: true, message: "请选择节日时间", trigger: "change" },
        ],
        releaseData: [
          { required: true, message: "请选择发布时间", trigger: "change" },
        ],
        hlcontent: [
          { required: true, message: "请选择图片", trigger: "change" },
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
      },
      roleList: [],
      fileList: [],
    };
  },
  methods: {
    /**
     * 获取详情
     */
    async queryInfo() {
      this.loading = true;
      const { data: resData } = await getFestivalInfo(this.params.id);
      this.loading = false;
      if (!resData.data.status) return;

      this.params = resData.data.data;
      this.releaseTime = [
        formatDateTime(this.params.hlshow_date, "YYYY-MM-DD hh:mm:ss"),
        formatDateTime(this.params.hlhide_date, "YYYY-MM-DD hh:mm:ss"),
      ];
      this.params.releaseData = 1;

      this.$forceUpdate();
    },

    /**
     * 处理日期改变
     */
    handleDateChange(val) {
      if (val) {
        this.params.hlshow_date = val[0];
        this.params.hlhide_date = val[1];
        this.params.releaseData = "1";
      } else {
        this.params.hlshow_date = "";
        this.params.hlhide_date = "";
        this.params.releaseData = "";
      }

      this.$forceUpdate();
    },

    /**
     * 文件上传成功
     */
    handleUploadSuccess(res, file) {
      this.params.hlcontent = res.data.path;
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
            this.params.hlshow_date = this.releaseTime[0];
            this.params.hlhide_date = this.releaseTime[1];

            if (this.params.id) {
              const { data: resData } = await updateFestival(this.params);
              if (!resData.data.status) return;

              this.$router.go(-1);
              this.$message.success("修改成功");
            } else {
              const { data: resData } = await addFestival(this.params);
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
