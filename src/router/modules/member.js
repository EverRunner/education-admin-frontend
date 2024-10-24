export default [
  {
    path: "list",
    name: "MEMBER_LIST",
    meta: {
      title: "学员列表",
      icon: "",
      isNav: true,
      keepAlive: true,
    },
    component: () => import("@/views/member/list/list.vue"),
  },
  {
    path: "listPass",
    name: "MEMBER_LIST_PASS",
    meta: {
      title: "考过学员列表",
      icon: "",
      isNav: true,
      keepAlive: true,
    },
    component: () => import("@/views/member/list/listPass.vue"),
  },
  {
    path: "listAverage",
    name: "MEMBER_AVERAGE_LIST",
    meta: {
      title: "超过平均值学员",
      icon: "",
      isNav: true,
      keepAlive: true,
    },
    component: () => import("@/views/member/list/listAverage.vue"),
  },

  {
    path: "edit",
    name: "MEMBER_EDIT",
    meta: {
      title: "用户编辑",
      icon: "",
      isNav: false,
      parent: "MEMBER_LIST",
    },
    component: () => import("@/views/member/list/edit.vue"),
  },
  {
    path: "details",
    name: "MEMBER_DETAILS",
    meta: {
      title: "用户详情",
      icon: "",
      isNav: false,
      parent: "MEMBER_LIST",
    },
    component: () => import("@/views/member/list/details.vue"),
  },
  {
    path: "detailsFree",
    name: "MEMBER_FREE_DETAILS",
    meta: {
      title: "体验用户详情",
      icon: "",
      isNav: false,
      parent: "MEMBER_FREE_LIST",
    },
    component: () => import("@/views/member/list/detailsFree.vue"),
  },

  {
    path: "classify",
    name: "MEMBER_CLASSIFY",
    meta: {
      title: "用户分类",
      icon: "",
      isNav: true,
    },
    component: () => import("@/views/member/classify/classify.vue"),
  },
  {
    path: "classifyEdit",
    name: "CLASSIFY_EDIT",
    meta: {
      title: "分类编辑",
      icon: "",
      isNav: false,
      parent: "MEMBER_CLASSIFY",
    },
    component: () => import("@/views/member/classify/edit.vue"),
  },
  // {
  //   path: "exception",
  //   name: "MEMBER_EXCEPTION",
  //   meta: {
  //     title: "异常登录",
  //     icon: "",
  //     isNav: true,
  //   },
  //   component: () => import("@/views/member/list/exception.vue"),
  // },
  {
    path: "renew",
    name: "MEMBER_RENEW",
    meta: {
      title: "续费申请",
      icon: "",
      isNav: true,
    },
    component: () => import("@/views/member/renew.vue"),
  },
  {
    path: "loginRecord",
    name: "MEMBER_LOGIN_RECORD",
    meta: {
      title: "登入记录",
      icon: "",
      isNav: false,
      parent: "MEMBER_DETAILS",
    },
    component: () => import("@/views/member/list/loginRecord.vue"),
  },
  {
    path: "loginIPStatistics",
    name: "MEMBER_LOGIN_IP_STATISTICS",
    meta: {
      title: "登入IP统计",
      icon: "",
      isNav: false,
      parent: "MEMBER_DETAILS",
    },
    component: () => import("@/views/member/list/loginIPStatistics.vue"),
  },
  {
    path: "agreementRecords",
    name: "MEMBER_AGREEMENT_RECORDS",
    meta: {
      title: "协议签定记录",
      icon: "",
      isNav: false,
      parent: "MEMBER_DETAILS",
    },
    component: () => import("@/views/member/list/agreementRecords.vue"),
  },
  {
    path: "agreementDetails",
    name: "MEMBER_AGREEMENT_DETAILS",
    meta: {
      title: "协议详情",
      icon: "",
      isNav: false,
      parent: "MEMBER_DETAILS",
    },
    component: () => import("@/views/member/list/agreementDetails.vue"),
  },
  {
    path: "studyProgress",
    name: "MEMBER_STUDY_PROGRESS",
    meta: {
      title: "课程学习进度",
      icon: "",
      isNav: false,
      parent: "MEMBER_DETAILS",
    },
    component: () => import("@/views/member/list/studyProgress.vue"),
  },
  {
    path: "studyHistory",
    name: "MEMBER_STUDY_HISTORY",
    meta: {
      title: "学习历史记录",
      icon: "",
      isNav: false,
      parent: "MEMBER_DETAILS",
    },
    component: () => import("@/views/member/list/studyHistory.vue"),
  },
  {
    path: "studyBuyInfo",
    name: "MEMBER_STUDY_BUY_INFO",
    meta: {
      title: "学习历史记录",
      icon: "",
      isNav: false,
      parent: "MEMBER_DETAILS",
    },
    component: () => import("@/views/member/list/studyBuyInfo.vue"),
  },
  {
    path: "licenceApplyInfo",
    name: "MEMBER_LICENCE_APPLY_INFO",
    meta: {
      title: "执照申请资料",
      icon: "",
      isNav: false,
      parent: "MEMBER_DETAILS",
    },
    component: () => import("@/views/member/list/licenceApplyInfo.vue"),
  },
];
