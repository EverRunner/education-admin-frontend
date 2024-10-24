<style lang="scss" scope>
.edit {
}
</style>

<template>
  <section class="public-edit public-body">
    <div class="public-edit-title">
      密码修改
    </div>
    <div class="public-edit-form">
      <el-form
        :model="params"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="旧密码" prop="oldpassword">
          <el-input
            v-model="params.oldpassword"
            placeholder="请输入旧密码"
            type="password"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item label="新密码" prop="newpassword">
          <el-input
            v-model="params.newpassword"
            placeholder="请输入新密码"
            type="password"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="newpassword2">
          <el-input
            v-model="params.newpassword2"
            placeholder="请再次输入密码"
            type="password"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit('ruleForm')"
            >提 交</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>

<script>
import { updateAdminPassowrd } from "@api/user";

export default {
  components: {},
  data() {
    return {
      params: {},
      rules: {
        oldpassword: [
          { required: true, message: "请输入旧密码", trigger: "change" },
        ],
        newpassword: [
          { required: true, message: "请输入新密码", trigger: "change" },
        ],
        newpassword2: [
          { required: true, message: "请再次输入密码", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    /**
     * 提交修改
     */
    handleSubmit(formName) {
      if (this.params.newpassword != this.params.newpassword2)
        return this.$message.error("两次密码输入不一致");

      this.$refs[formName].validate((valid) => {
        if (!valid) return false;

        this.$confirm("是否保存？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            const { data: resData } = await updateAdminPassowrd(this.params);
            if (!resData.data.status) return;

            this.$message.success("修改成功");
          })
          .catch(() => {});
      });
    },
  },

  async created() {
    this.params.id = 111;
  },
};
</script>
