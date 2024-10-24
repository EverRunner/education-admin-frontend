<style lang="scss" scope>
.edit {
}
</style>

<template>
  <section class="course-topic" v-loading="loading">
    <el-form :model="params" ref="ruleForm" label-width="80px">
      <div class="member-details-wp">
        <div class="member-edit-title">角色编辑</div>
        <el-form-item label="角色名称" required>
          <el-input
            v-model="params.rolename"
            placeholder="请输入角色名称"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item label="状态" required>
          <el-radio-group v-model="params.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
            maxlength="200"
            v-model="params.remark"
          >
          </el-input>
        </el-form-item>
      </div>

      <div class="member-details-wp">
        <div class="member-edit-title">权限编辑</div>
        <el-form-item label="" required>
          <el-tree
            :data="rulesData"
            show-checkbox
            node-key="name"
            ref="roleTree"
            :props="defaultProps"
          >
          </el-tree>
        </el-form-item>
      </div>
    </el-form>

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
  getRoleInfo,
  addRole,
  updateRole,
  setRolePermission,
  getRolePermission,
} from "@api/system";

export default {
  components: {},
  data() {
    return {
      loading: false,
      params: {
        status: 1,
        sex: 1,
      },
      rules: {},

      params2: {
        menuidlist: [],
      },
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
      const { data: resData } = await getRolePermission(this.params.id);
      if (!resData.data.status) return;

      const menuList = [];
      resData.data.data.forEach((menu) => menuList.push(menu.menuid));

      this.$refs.roleTree.setCheckedKeys(menuList);
    },

    /**
     * 获取详情
     */
    async queryInfo() {
      const { data: resData } = await getRoleInfo(this.params.id);
      if (!resData.data.status) return;

      this.params = resData.data.data;
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
              const { data: resData } = await updateRole(this.params);
              if (!resData.data.status) return;

              this.handlePermissionSubmit();
            } else {
              const { data: resData } = await addRole(this.params);
              if (!resData.data.status) return;

              this.handlePermissionSubmit();
            }
          })
          .catch(() => {});
      });
    },

    /**
     * 提交权限修改
     */
    async handlePermissionSubmit() {
      this.params2.menuidlist = this.$refs.roleTree.getCheckedKeys();
      if (this.params2.menuidlist.length <= 0) return;

      const { data: resData } = await setRolePermission(this.params);
      if (!resData.data.status) return;
      this.$message.success("修改成功");
      this.$router.go(-1);
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
      this.params.id = this.$route.query.id;
      this.queryInfo();
    }

    this.queryRolePermission();
  },
};
</script>
