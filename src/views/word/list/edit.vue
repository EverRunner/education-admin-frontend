<style lang="scss" scope></style>

<template>
  <section>
    <div class="member-details-wp" style="margin-bottom: 80px">
      <div class="member-edit-title">单词组设置</div>
      <el-form
        :model="params"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="单词组名称" prop="title">
          <el-input
            v-model="params.title"
            placeholder="请输入单词组名称"
            maxlength="200"
          ></el-input>
        </el-form-item>

        <el-form-item label="说明">
          <el-input placeholder="请输入说明" v-model="params.description">
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
import { addPractice, updatePractice } from "@api/word";

export default {
  components: {},
  data() {
    return {
      params: {
        title: "",
        description: "",
        sort: "",
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "change" }],
        qualifiedproportion: [
          { required: true, message: "请选择通过比例", trigger: "change" },
        ],
        isrepeattest: [
          { required: true, message: "请选择重复测试", trigger: "change" },
        ],
      },

      loading: false,
    };
  },
  methods: {
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
              const { data: resData } = await updatePractice(this.params);
              if (!resData.data.status) return;

              this.$router.go(-1);
              this.$message.success("修改成功");
            } else {
              const { data: resData } = await addPractice(this.params);
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
      this.params.title = this.$route.params.title;
      this.params.description = this.$route.params.description;
      this.params.sort = this.$route.params.sort;
    }
  },
};
</script>
