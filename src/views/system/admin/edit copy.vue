<style lang="scss" scope>
.edit {
}
</style>

<template>
  <section class="public-edit public-body">
    <div class="public-edit-title">
      管理员编辑
    </div>
    <div class="public-edit-form">
      <el-form
        :model="params"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="姓名" prop="username">
          <el-input
            v-model="params.username"
            placeholder="请输入姓名"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item label="帐号" prop="account">
          <el-input
            v-model="params.account"
            placeholder="请输入帐号"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item v-if="!this.params.id" label="密码" prop="password">
          <el-input
            v-model="params.password"
            placeholder="请输入密码"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item label="角色" prop="status">
          <el-select v-model="params.roleid" placeholder="请选择角色">
            <el-option
              v-for="(item, index) in roleList"
              :key="index"
              :label="item.rolename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="params.email"
            placeholder="请输入邮箱"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item label="电话" prop="phone">
          <el-input
            v-model="params.phone"
            placeholder="请输入电话"
            maxlength="11"
          ></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="params.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
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
import { getAdminInfo, addAdmin, updateAdmin } from "@api/user";
import { getRoleList } from "@api/system";

export default {
  components: {},
  data() {
    return {
      params: {
        status: 1,
      },
      rules: {
        username: [
          { required: true, message: "请输入姓名", trigger: "change" },
        ],
        account: [{ required: true, message: "请输入帐号", trigger: "change" }],
        password: [
          { required: true, message: "请输入密码", trigger: "change" },
        ],
        rolename: [
          { required: true, message: "请选择角色", trigger: "change" },
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
      },
      roleList: [],
    };
  },
  methods: {
    /**
     * 获取详情
     */
    async queryInfo() {
      const { data: resData } = await getAdminInfo(this.params.id);
      if (!resData.data.status) return;

      this.params = resData.data.info;
    },

    /**
     * 获取列表
     */
    async queryRoleList() {
      const { data: resData } = await getRoleList();
      if (!resData.data.status) return;

      this.roleList = resData.data.rolelist;
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
              const { data: resData } = await updateAdmin(this.params);
              if (!resData.data.status) return;

              this.$router.go(-1);
              this.$message.success("修改成功");
            } else {
              const { data: resData } = await addAdmin(this.params);
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
    await this.queryRoleList();

    if (this.$route.query.id) {
      this.params.id = this.$route.query.id;

      //修改时，不能修改密码
      this.rules.password[0].required = false;

      this.queryInfo();
    }
  },
};
</script>
