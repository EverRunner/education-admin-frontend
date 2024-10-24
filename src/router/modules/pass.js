export default [
  {
    path: "license",
    name: "PASS_LICENSE",
    meta: {
      title: "执照申请",
      icon: "",
      isNav: true,
      keepAlive: true,
    },
    component: () => import("@/views/pass/license/list.vue"),
  },

  {
    path: "licenseUpdate",
    name: "PASS_LICENSE_UPDATE",
    meta: {
      title: "执照更新",
      icon: "",
      isNav: true,
      keepAlive: true,
    },
    component: () => import("@/views/pass/license/listUpdate.vue"),
  },

  {
    path: "license/Details",
    name: "PASS_LICENSE_DETAILS",
    meta: {
      title: "执照申请详情",
      icon: "",
      isNav: false,
      parent: "PASS_LICENSE",
    },
    component: () => import("@/views/pass/license/details.vue"),
  },
];
