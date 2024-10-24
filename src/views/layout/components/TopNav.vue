<style lang="scss" scope></style>

<template>
  <section>
    <!-- 头部 -->
    <div class="layout-head">
      <span class="layout-head-logo" @click="handleGoTo">
        <img src="@/assets/images/head-logo.png" alt="" />
        <em>易北教育后台管理系统</em>
      </span>
      <div class="layout-head-btn" @click="drawerMenu = true">
        <div class="icon">
          <i></i>
        </div>
        <span>菜单</span>
      </div>
    </div>

    <!-- 菜单 -->
    <el-drawer
      title="菜单"
      :visible.sync="drawerMenu"
      direction="rtl"
      class="layout-menu"
      :before-close="handleClose"
      size="300px"
    >
      <el-menu :default-active="defaultActive" :router="true">
        <template v-for="(item, index) in rulesData">
          <el-submenu
            :key="index"
            :index="item.name"
            v-if="item.children && item.meta.isNav && item.isRole"
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
          <el-menu-item
            v-else
            :key="index"
            :index="item.name"
            :route="{ name: item.name }"
          >
            <template slot="title">
              <i :class="item.meta.icon"></i>
              <span>{{ item.meta.title }}</span>
            </template></el-menu-item
          >
        </template>
      </el-menu>
    </el-drawer>
  </section>
</template>

<script>
import { loginOut } from "@api/user";
import { getRolePermission } from "@api/system";
import { getUserInfo } from "@api/user";

export default {
  name: "TopNav",
  data() {
    return {
      userInfo: JSON.parse(sessionStorage.getItem("userInfo")),
      routes: [],
      defaultActive: "",
      rulesData: [
        {
          name: "MAIN",
          meta: {
            title: "主页",
            icon: "el-icon-s-home",
            isNav: true,
          },
        },

        {
          name: "MEMBER",
          meta: {
            title: "用户",
            icon: "el-icon-s-custom",
            isNav: true,
          },
          children: [
            {
              name: "MEMBER_LIST",
              meta: {
                title: "学员列表",
                icon: "",
                isNav: true,
              },
            },
            {
              name: "MEMBER_CLASSIFY",
              meta: {
                title: "用户分类",
                icon: "",
                isNav: true,
              },
            },
          ],
        },

        {
          name: "ORDER",
          meta: {
            title: "订单",
            icon: "el-icon-s-order",
            isNav: true,
          },
          children: [
            {
              path: "revenueStatis",
              name: "ORDER_REVENUE_STATIS",
              meta: {
                title: "营收概况",
                icon: "",
                isNav: true,
              },
            },
            {
              path: "revenueStatis",
              name: "ORDER_LIST",
              meta: {
                title: "课程订单",
                icon: "",
                isNav: true,
              },
            },
            {
              path: "revenueStatis",
              name: "PASS_LICENSE",
              meta: {
                title: "考过生服务订单",
                icon: "",
                isNav: true,
              },
            },
            {
              path: "revenueStatis",
              name: "MEMBER_RENEW",
              meta: {
                title: "续费申请",
                icon: "",
                isNav: true,
              },
            },
          ],
        },

        {
          name: "COURSE",
          meta: {
            title: "课程",
            icon: "el-icon-s-management",
            isNav: true,
          },
          children: [
            {
              name: "COURSE_LIST",
              meta: {
                title: "课程列表",
                icon: "",
                isNav: true,
              },
            },
            {
              name: "WORD_LIST",
              meta: {
                title: "单词列表",
                icon: "",
                isNav: true,
              },
            },
            {
              name: "EXAM_LIST",
              meta: {
                title: "测试列表",
                icon: "",
                isNav: true,
              },
            },
            {
              name: "EXAM_TOPIC",
              meta: {
                title: "试题列表",
                icon: "",
                isNav: true,
              },
            },
          ],
        },

        {
          name: "PASS",
          meta: {
            title: "数据统计",
            icon: "el-icon-s-marketing",
            isNav: true,
          },
          children: [
            {
              path: "license",
              name: "MAIN_SITE_STATISTICS",
              meta: {
                title: "站点统计",
                icon: "",
                isNav: true,
              },
            },
            {
              path: "licenseUpdate",
              name: "MAIN_DATA_STATISTICS",
              meta: {
                title: "数据列表",
                icon: "",
                isNav: true,
              },
            },
          ],
        },

        {
          name: "WORD",
          meta: {
            title: "站点内容",
            icon: "el-icon-s-management",
            isNav: true,
          },
          children: [
            {
              name: "MESSAGE_AFFICHE",
              meta: {
                title: "公告",
                icon: "",
                isNav: true,
              },
            },
            {
              name: "MESSAGE_EVALUATE",
              meta: {
                title: "评价",
                icon: "",
                isNav: true,
              },
            },
            {
              name: "MESSAGE_SEND_LOG",
              meta: {
                title: "发送日志",
                icon: "",
                isNav: true,
              },
            },
            {
              name: "ARTICLE_LIST",
              meta: {
                title: "文章",
                icon: "",
                isNav: true,
              },
            },
            {
              name: "BBS_LIST",
              meta: {
                title: "帖子",
                icon: "",
                isNav: true,
              },
            },
            {
              name: "SYSTEM_FESTIVAL",
              meta: {
                title: "节日",
                icon: "",
                isNav: true,
              },
            },
          ],
        },

        {
          name: "MESSAGE",
          meta: {
            title: "后台设置",
            icon: "el-icon-s-tools",
            isNav: true,
          },
          children: [
            {
              path: "smsEdit",
              name: "SYSTEM_ADMIN",
              meta: {
                title: "管理员列表",
                icon: "",
                isNav: true,
              },
            },
            {
              name: "SYSTEM_ROLE",
              meta: {
                title: "角色列表",
                icon: "",
                isNav: true,
              },
            },
          ],
        },
      ],
      whiteList: ["/", "/login", "/test", "*", "/error"],
      roleid: null,
      menuList: [],
      drawerMenu: false,
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
    // this.rulesData = this.$router.options.routes.filter(
    //   (route) => this.whiteList.indexOf(route.path) == -1
    // );

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

    /**
     * 关闭菜单
     */
    handleClose() {
      this.drawerMenu = false;
    },

    /**
     * 跳转
     */
    handleGoTo() {
      window.location.href = "/";
    },

    /**
     * 处理下拉菜单事件
     */
    async handleCommand(command) {
      switch (command) {
        //退出登录
        case "loginOut":
          this.$confirm("是否确认退出登录？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "error",
          })
            .then(async () => {
              await loginOut();

              this.$router.push({
                name: "LOGIN",
              });
            })
            .catch(() => {});
          break;

        //密码修改
        case "passwordEdit":
          this.$router.push({
            name: "SYSTEM_ADMIN_PASSWORD",
          });
          break;
      }
    },
  },
};
</script>
