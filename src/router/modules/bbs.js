export default [
  {
    path: "list",
    name: "BBS_LIST",
    meta: {
      title: "帖子列表",
      icon: "",
      isNav: true,
      keepAlive: true,
    },
    component: () => import("@/views/bbs/index.vue"),
  },
  {
    path: "edit",
    name: "BBS_EDIT",
    meta: {
      title: "用户编辑",
      icon: "",
      isNav: false,
      parent: "BBS_LIST",
    },
    component: () => import("@/views/bbs/list/edit.vue"),
  },
  {
    path: "classify",
    name: "BBS_CLASSIFY",
    meta: {
      title: "帖子分类",
      icon: "",
      isNav: true,
    },
    component: () => import("@/views/bbs/classify/classify.vue"),
  },
  {
    path: "classifyEdit",
    name: "BBS_CLASSIFY_EDIT",
    meta: {
      title: "分类编辑",
      icon: "",
      isNav: false,
      parent: "BBS_CLASSIFY",
    },
    component: () => import("@/views/bbs/classify/edit.vue"),
  },
];
