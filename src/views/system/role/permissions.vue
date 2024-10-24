<style lang="scss" scope>
.edit {
}
</style>

<template>
  <section class="public-edit public-body">
    <div class="public-edit-title">
      权限编辑
    </div>
    <div class="public-edit-form">
      <el-form
        :model="params"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="videopath">
          <el-input
            placeholder="角色名称"
            v-model="params.name"
            :disabled="true"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="选择权限" prop="videopath">
          <el-tree
            :data="rulesData"
            show-checkbox
            node-key="name"
            ref="roleTree"
            :props="defaultProps"
          >
          </el-tree>
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
import { setRolePermission, getRolePermission } from "@api/system";

export default {
  components: {},
  data() {
    return {
      params: {
        roleid: "",
        menuidlist: [],
      },
      rules: {},
      rulesData: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      whiteList: ["/", "/login", "/test", "*", "/error"],
    };
  },

  methods: {
    /**
     * 获取角色权限
     */
    async queryRolePermission() {
      const { data: resData } = await getRolePermission(this.params.roleid);
      if (!resData.data.status) return;

      const menuList = [];
      resData.data.data.forEach((menu) => menuList.push(menu.menuid));

      this.$refs.roleTree.setCheckedKeys(menuList);
    },

    /**
     * 提交修改
     */
    handleSubmit(formName) {
      this.params.menuidlist = this.$refs.roleTree.getCheckedKeys();
      if (this.params.menuidlist.length <= 0) return;

      this.$refs[formName].validate((valid) => {
        if (!valid) return false;

        this.$confirm("是否保存？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            const { data: resData } = await setRolePermission(this.params);
            if (!resData.data.status) return;

            this.$router.go(-1);
            this.$message.success("权限保存成功");
          })
          .catch(() => {});
      });
    },

    /**
     * 获取前端所有路由
     */
    getFrontRouter(routes) {
      if (!routes) return;

      routes.forEach((route) => {
        route.label = route.meta.title;
        if (route.children) this.getFrontRouter(route.children);
      });
    },
  },

  async created() {
    this.rulesData = this.$router.options.routes.filter(
      (route) => this.whiteList.indexOf(route.path) == -1
    );
    this.getFrontRouter(this.rulesData);

    if (this.$route.query.id) {
      this.params.roleid = this.$route.query.id;
      this.params.name = this.$route.query.name;
    }

    this.queryRolePermission();
  },
};
</script>
