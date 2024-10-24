<style lang="scss" scope></style>

<template>
  <section class="left-menu">
    11111
  </section>
</template>

<script>
import { getRolePermission } from "@api/system";
import { getUserInfo } from "@api/user";

export default {
  name: "LeftMenu",
  data() {
    return {
      routes: [],
      defaultActive: "",
      rulesData: [],
      whiteList: ["/", "/login", "/test", "*", "/error"],
      roleid: null,
      menuList: [],
    };
  },

  async created() {
    if (
      JSON.parse(sessionStorage.getItem("userInfo")) &&
      JSON.parse(sessionStorage.getItem("userInfo")).roleid
    ) {
      this.roleid = JSON.parse(sessionStorage.getItem("userInfo")).roleid;
    }

    // 获取用户信息
    await this.queryUserInfo();

    // 获取权限
    await this.queryRolePermission();

    // 菜单
    this.rulesData = this.$router.options.routes.filter(
      (route) => this.whiteList.indexOf(route.path) == -1
    );
    this.getFrontRouter(this.rulesData);

    //展开对应路由的菜单
    this.defaultActive = this.$route.name;
  },

  methods: {
    /**
     * 查询用户信息
     */
    async queryUserInfo() {
      if (this.roleid) return;

      const { data: resData } = await getUserInfo();
      if (!resData.data.status) return;

      this.roleid = resData.data.roleid;
    },

    /**
     * 获取前端所有路由
     */
    getFrontRouter(routes) {
      if (!routes) return;

      routes.forEach((route) => {
        route.label = route.meta.title;

        // 是否有权限
        if (this.menuList.indexOf(route.name) > -1) route.isRole = true;

        if (route.children) this.getFrontRouter(route.children);
      });
    },

    /**
     * 获取角色权限
     */
    async queryRolePermission() {
      const { data: resData } = await getRolePermission(this.roleid);
      if (!resData.data.status) return;

      resData.data.data.forEach((menu) => this.menuList.push(menu.menuid));
    },
  },
};
</script>
