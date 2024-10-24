import index from "../../views/main/index";

export default [
  {
    path: "site",
    name: "MAIN_SITE",
    meta: {
      title: "首页",
      icon: "",
      isNav: true,
    },
    component: index,
  },
  // {
  //   path: "finance",
  //   name: "MAIN_FINANCE",
  //   meta: {
  //     title: "营收状况",
  //     icon: "",
  //     isNav: true,
  //   },
  //   component: () => import("@/views/main/finance.vue"),
  // },

  {
    path: "dataStatistics",
    name: "MAIN_DATA_STATISTICS",
    meta: {
      title: "数据统计",
      icon: "",
      isNav: true,
    },
    component: () => import("@/views/main/dataStatistics.vue"),
  },

  // {
  //   path: "visitList",
  //   name: "MAIN_MEMBER_VISI_TLIST",
  //   meta: {
  //     title: "用户访问记录",
  //     icon: "",
  //     isNav: true,
  //   },
  //   component: () => import("@/views/main/memberVisitList.vue"),
  // },

  // {
  //   path: "studyContrast",
  //   name: "MAIN_STUDY_CONTRAST",
  //   meta: {
  //     title: "学习数据对比",
  //     icon: "",
  //     isNav: true,
  //   },
  //   component: () => import("@/views/main/studyContrast.vue"),
  // },

  {
    path: "im",
    name: "MAIN_IM",
    meta: {
      title: "IM聊天",
      icon: "",
      isNav: true,
    },
    component: () => import("@/views/main/im.vue"),
  },

  {
    path: "service",
    name: "MAIN_SERVICE",
    meta: {
      title: "游客聊天",
      icon: "",
      isNav: true,
    },
    component: () => import("@/views/main/service.vue"),
  },

  // {
  //   path: "browse",
  //   name: "MAIN_BROWSE",
  //   meta: {
  //     title: "浏览记录",
  //     icon: "",
  //     isNav: true,
  //   },
  //   component: () => import("@/views/main/browse.vue"),
  // },

  {
    path: "siteStatistics",
    name: "MAIN_SITE_STATISTICS",
    meta: {
      title: "站点统计",
      icon: "",
      isNav: true,
    },
    component: () => import("@/views/main/siteStatistics.vue"),
  },
];
