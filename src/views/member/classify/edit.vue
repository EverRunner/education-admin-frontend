<style lang="scss" scope>
.edit {
}
</style>

<template>
  <section>
    <div class="member-details-wp" style="margin-bottom: 70px">
      <div class="member-edit-title">学员分类</div>

      <el-form
        :model="params"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="类型名称" prop="categoryname">
          <el-input
            v-model="params.categoryname"
            placeholder="请输入类型名称"
            maxlength="30"
          ></el-input>
        </el-form-item>

        <el-form-item label="颜色" prop="color">
          <el-color-picker v-model="params.color"></el-color-picker>
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
import {
  getMemberCategoryById,
  addCategoryInfo,
  updateCategoryInfo,
} from "@api/member";

export default {
  components: {},
  data() {
    return {
      params: {
        categoryname: "",
        color: "#000",
      },
      loading: false,
      rules: {
        categoryname: [
          { required: true, message: "请输入类型名称", trigger: "change" },
        ],
        color: [{ required: true, message: "请选择颜色", trigger: "change" }],
      },
    };
  },
  methods: {
    /**
     * 获取详情
     */
    async queryInfo() {
      this.loading = true;

      const { data: resData } = await getMemberCategoryById(this.params.id);
      this.loading = false;
      if (!resData.data.status) return;

      this.params = resData.data.info;
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
              const { data: resData } = await updateCategoryInfo(this.params);
              if (!resData.data.status) return;

              this.$router.go(-1);
              this.$message.success("修改成功");
            } else {
              const { data: resData } = await addCategoryInfo(this.params);
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
      this.params.categoryname = this.$route.query.name;
      this.params.color = this.$route.query.color;
      // this.queryInfo();
    }
  },
};
</script>
