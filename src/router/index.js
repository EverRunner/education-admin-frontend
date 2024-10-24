import Vue from "vue";
import VueRouter from "vue-router";
import login from "../views/common/login";
import layout from "../views/layout";
import member from "./modules/member";
import system from "./modules/system";
import main from "./modules/main";
import exam from "./modules/exam";
import course from "./modules/course";
import order from "./modules/order";
import word from "./modules/word";
import message from "./modules/message";
import article from "./modules/article";
import bbs from "./modules/bbs";
import pass from "./modules/pass";

// 解决编程式路由往同一地址跳转时会报错的情况
const originalPush = VueRouter.prototype.push;
const originalReplace = VueRouter.prototype.replace;

// push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};

//replace
VueRouter.prototype.replace = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalReplace.call(this, location, onResolve, onReject);
  return originalReplace.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "HOME",
    meta: {
      index: 0,
      title: "首页",
      isNav: false,
    },
    redirect: {
      name: "MAIN_SITE",
    },
  },

  {
    path: "/login",
    name: "LOGIN",
    meta: {
      index: 1,
      title: "登录",
      isNav: false,
    },
    component: login,
  },

  //仪表盘
  {
    path: "/main",
    name: "MAIN",
    meta: {
      title: "主页",
      icon: "el-icon-s-home",
      isNav: true,
    },
    component: layout,
    redirect: {
      name: "MAIN_SITE",
    },
    children: main,
  },

  //用户管理
  {
    path: "/member",
    name: "MEMBER",
    meta: {
      title: "用户管理",
      icon: "el-icon-s-custom",
      isNav: true,
    },
    component: layout,
    redirect: {
      name: "MEMBER_LIST",
    },
    children: member,
  },

  // 考过生服务
  {
    path: "/pass",
    name: "PASS",
    meta: {
      title: "考过生服务",
      icon: "el-icon-s-claim",
      isNav: true,
    },
    component: layout,
    redirect: {
      name: "LICENSE_LIST",
    },
    children: pass,
  },

  //课程管理
  {
    path: "/course",
    name: "COURSE",
    meta: {
      title: "课程管理",
      icon: "el-icon-s-management",
      isNav: true,
    },
    component: layout,
    redirect: {
      name: "COURSE_LIST",
    },
    children: course,
  },

  //单词管理
  {
    path: "/word",
    name: "WORD",
    meta: {
      title: "单词管理",
      icon: "el-icon-s-promotion",
      isNav: true,
    },
    component: layout,
    redirect: {
      name: "WORD_LIST",
    },
    children: word,
  },

  //单元测试
  {
    path: "/exam",
    name: "EXAM",
    meta: {
      title: "单元测试",
      icon: "el-icon-s-help",
      isNav: true,
    },
    component: layout,
    redirect: {
      name: "EXAM_LIST",
    },
    children: exam,
  },

  //订单管理
  {
    path: "/order",
    name: "ORDER",
    meta: {
      title: "订单管理",
      icon: "el-icon-s-order",
      isNav: true,
    },
    component: layout,
    redirect: {
      name: "ORDER_LIST",
    },
    children: order,
  },

  //消息管理
  {
    path: "/message",
    name: "MESSAGE",
    meta: {
      title: "消息管理",
      icon: "el-icon-s-comment",
      isNav: true,
    },
    component: layout,
    redirect: {
      name: "MEMBER_NOTICE",
    },
    children: message,
  },

  //文章管理
  {
    path: "/article",
    name: "ARTICLE",
    meta: {
      title: "文章管理",
      icon: "el-icon-document",
      isNav: true,
    },
    component: layout,
    redirect: {
      name: "ARTICLE_LIST",
    },
    children: article,
  },

  // 论坛
  {
    path: "/bbs",
    name: "BBS",
    meta: {
      title: "论坛管理",
      icon: "el-icon-chat-line-round",
      isNav: true,
    },
    component: layout,
    redirect: {
      name: "BBS_LIST",
    },
    children: bbs,
  },

  //系统设置
  {
    path: "/system",
    name: "SYSTEM",
    meta: {
      title: "系统设置",
      icon: "el-icon-s-tools",
      isNav: true,
    },
    component: layout,
    redirect: {
      name: "SYSTEM_ROLE",
    },
    children: system,
  },

  //错误页面
  {
    path: "/error",
    name: "ERROR",
    meta: {
      title: "错误页面",
      icon: "",
      isNav: false,
    },
    component: { template: `<router-view/>` },
    redirect: {
      name: "ERROR_404",
    },
    children: [
      {
        path: "404",
        name: "ERROR_404",
        meta: {
          title: "404",
          icon: "",
          isNav: false,
        },

        component: () => import("@/views/common/404.vue"),
      },
    ],
  },

  // 测试
  {
    path: "/test",
    name: "TEST",
    meta: {
      title: "测试",
      icon: "",
      isNav: false,
    },
    component: () => import("@/views/common/test.vue"),
  },

  //未找到路由
  {
    path: "*",
    name: "PULL",
    meta: {
      title: "未找到路由",
      icon: "",
      isNav: false,
    },
    redirect: {
      name: "ERROR_404",
    },
    hidden: true,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
