<style lang="scss" scope>
.left-menu {
  width: 240px;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  background: #001529;
  border-right: solid 1px #e6e6e6;
  box-sizing: border-box;
  overflow-y: auto;
  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  &::-webkit-scrollbar {
    width: 0px;
    height: 5px;
    background-color: #001529;
  }
  /*定义滚动条轨道 内阴影+圆角*/
  // &::-webkit-scrollbar-track {
  //   -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);
  //   border-radius: 10px;
  //   background-color: #001529;
  // }
  /*定义滑块 内阴影+圆角*/
  // &::-webkit-scrollbar-thumb {
  //   border-radius: 10px;
  //   -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);
  //   background-color: #fff;
  // }
  &-logo {
    height: 65px;
    box-sizing: border-box;
    display: flex;
    padding: 0 25px;
    align-items: center;
    img {
      max-width: 95%;
      max-height: 95%;
    }
  }
  .el-menu {
    border: 0;
  }
}
</style>

<template>
  <section class="left-menu">
    <div class="left-menu-logo">
      <img src="../../../assets/images/logo2.png" alt="" />
    </div>
    <el-menu
      :default-active="defaultActive"
      class="el-menu-vertical-demo"
      background-color="#001529"
      text-color="#ccc"
      active-text-color="#fff"
      :router="true"
    >
      <el-submenu
        v-for="(item, index) in rulesData"
        v-show="item.meta.isNav && item.isRole"
        :key="index"
        :index="item.name"
      >
        <template slot="title">
          <i :class="item.meta.icon"></i>
          <span>{{ item.meta.title }}</span>
        </template>
        <el-menu-item
          v-for="(son, key) in item.children"
          v-show="son.meta.isNav && item.isRole"
          :key="key"
          :index="son.name"
          :route="{ name: son.name }"
          >{{ son.meta.title }}</el-menu-item
        >
      </el-submenu>
    </el-menu>
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
