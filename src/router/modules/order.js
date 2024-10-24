export default [
  {
    path: "list",
    name: "ORDER_LIST",
    meta: {
      title: "订单列表",
      icon: "",
      isNav: true,
      keepAlive: true,
    },
    component: () => import("@/views/order/list/index.vue"),
  },
  {
    path: "revenueStatis",
    name: "ORDER_REVENUE_STATIS",
    meta: {
      title: "营收概况",
      icon: "",
      isNav: true,
      keepAlive: true,
    },
    component: () => import("@/views/order/revenueStatis.vue"),
  },
];
