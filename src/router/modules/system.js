export default [
  {
    path: "festival",
    name: "SYSTEM_FESTIVAL",
    meta: {
      title: "节日设置",
      icon: "",
      isNav: true,
    },
    component: () => import("@/views/system/festival/list.vue"),
  },
  {
    path: "festivalEdit",
    name: "SYSTEM_FESTIVAL_EDIT",
    meta: {
      title: "节日设置编辑",
      icon: "",
      isNav: false,
      parent: "SYSTEM_FESTIVAL",
    },
    component: () => import("@/views/system/festival/edit.vue"),
  },
  {
    path: "role",
    name: "SYSTEM_ROLE",
    meta: {
      title: "角色列表",
      icon: "",
      isNav: true,
    },
    component: () => import("@/views/system/role/list.vue"),
  },
  {
    path: "roleEdit",
    name: "SYSTEM_ROLE_EDIT",
    meta: {
      title: "角色编辑",
      icon: "",
      isNav: false,
      parent: "SYSTEM_ROLE",
    },
    component: () => import("@/views/system/role/edit.vue"),
  },
  {
    path: "rolePermissions",
    name: "SYSTEM_ROLE_PERMISSIONS",
    meta: {
      title: "权限编辑",
      icon: "",
      isNav: false,
      parent: "SYSTEM_ROLE",
    },
    component: () => import("@/views/system/role/permissions.vue"),
  },
  {
    path: "menu",
    name: "SYSTEM_MENU",
    meta: {
      title: "菜单列表",
      icon: "",
      isNav: true,
    },
    component: () => import("@/views/system/menu/list.vue"),
  },
  {
    path: "menuEdit",
    name: "SYSTEM_MENU_EDIT",
    meta: {
      title: "菜单编辑",
      icon: "",
      isNav: false,
      parent: "SYSTEM_MENU",
    },
    component: () => import("@/views/system/menu/edit.vue"),
  },
  {
    path: "admin",
    name: "SYSTEM_ADMIN",
    meta: {
      title: "管理员列表",
      icon: "",
      isNav: true,
    },
    component: () => import("@/views/system/admin/list.vue"),
  },
  {
    path: "adminEdit",
    name: "SYSTEM_ADMIN_EDIT",
    meta: {
      title: "管理员编辑",
      icon: "",
      isNav: false,
      parent: "SYSTEM_ADMIN",
    },
    component: () => import("@/views/system/admin/edit.vue"),
  },
  {
    path: "adminPassword",
    name: "SYSTEM_ADMIN_PASSWORD",
    meta: {
      title: "密码修改",
      icon: "",
      isNav: false,
      parent: "SYSTEM_ADMIN",
    },
    component: () => import("@/views/system/admin/passowrd.vue"),
  },
];
