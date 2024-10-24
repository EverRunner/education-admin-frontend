export default [
  {
    path: "index",
    name: "COURSE_LIST",
    meta: {
      title: "课程列表",
      icon: "",
      isNav: true,
      keepAlive: true,
    },
    component: () => import("@/views/course/index.vue"),
  },
  {
    path: "edit",
    name: "COURSE_EDIT",
    meta: {
      title: "课程编辑",
      icon: "",
      isNav: false,
      parent: "COURSE_LIST",
    },
    component: () => import("@/views/course/list/edit.vue"),
  },
  {
    path: "asyncCourse",
    name: "COURSE_ASYNC_COURSE",
    meta: {
      title: "同步进度",
      icon: "",
      isNav: false,
      parent: "COURSE_LIST",
    },
    component: () => import("@/views/course/list/asyncCourse.vue"),
  },
  {
    path: "chapter",
    name: "COURSE_CHAPTER",
    meta: {
      title: "章节列表",
      icon: "",
      isNav: false,
      parent: "COURSE_LIST",
    },
    component: () => import("@/views/course/chapter/list.vue"),
  },
  {
    path: "chapterEdit",
    name: "COURSE_CHAPTER_EDIT",
    meta: {
      title: "章节编辑",
      icon: "",
      isNav: false,
      parent: "COURSE_LIST",
    },
    component: () => import("@/views/course/chapter/edit.vue"),
  },
];
