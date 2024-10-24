export default [
  {
    path: "sms",
    name: "MESSAGE_SMS",
    meta: {
      title: "短信列表",
      icon: "",
      isNav: true,
    },
    component: () => import("@/views/message/sms/list.vue"),
  },

  {
    path: "smsEdit",
    name: "MESSAGE_SMS_EDIT",
    meta: {
      title: "发送通知",
      icon: "",
      isNav: false,
      parent: "MESSAGE_SMS",
    },
    component: () => import("@/views/message/sms/edit.vue"),
  },

  {
    path: "smsInfoList",
    name: "MESSAGE_SMS_INOF_LIST",
    meta: {
      title: "发送详细列表",
      icon: "",
      isNav: false,
      parent: "MESSAGE_SMS",
    },
    component: () => import("@/views/message/sms/infoList.vue"),
  },

  {
    path: "eMail",
    name: "MESSAGE_EMAIL",
    meta: {
      title: "邮件列表",
      icon: "",
      isNav: true,
    },
    component: () => import("@/views/message/eMail/list.vue"),
  },

  {
    path: "eMailEdit",
    name: "MESSAGE_NOTICE_EDIT",
    meta: {
      title: "邮件列表",
      icon: "",
      isNav: true,
    },
    component: () => import("@/views/message/eMail/edit.vue"),
  },

  {
    path: "standLetter",
    name: "MESSAGE_STAND_LETTER",
    meta: {
      title: "站内信列表",
      icon: "",
      isNav: true,
    },
    component: () => import("@/views/message/standLetter/list.vue"),
  },

  {
    path: "standLetterEdit",
    name: "MESSAGE_STAND_LETTER_EDIT",
    meta: {
      title: "站内信编辑",
      icon: "",
      isNav: false,
      parent: "MESSAGE_STAND_LETTER",
    },
    component: () => import("@/views/message/standLetter/edit.vue"),
  },

  {
    path: "standLetterInfoList",
    name: "MESSAGE_STAND_LETTER_INOF_LIST",
    meta: {
      title: "发送详细列表",
      icon: "",
      isNav: false,
      parent: "MESSAGE_STAND_LETTER",
    },
    component: () => import("@/views/message/standLetter/infoList.vue"),
  },

  {
    path: "affiche",
    name: "MESSAGE_AFFICHE",
    meta: {
      title: "通知公告列表",
      icon: "",
      isNav: true,
    },
    component: () => import("@/views/message/affiche/list.vue"),
  },

  {
    path: "afficheEdit",
    name: "MESSAGE_AFFICHE_EDIT",
    meta: {
      title: "通知公告编辑",
      icon: "",
      isNav: false,
      parent: "MESSAGE_NOTICE",
    },
    component: () => import("@/views/message/affiche/edit.vue"),
  },

  {
    path: "evaluate",
    name: "MESSAGE_EVALUATE",
    meta: {
      title: "评价列表",
      icon: "",
      isNav: true,
    },
    component: () => import("@/views/message/evaluate/list.vue"),
  },

  {
    path: "sendLog",
    name: "MESSAGE_SEND_LOG",
    meta: {
      title: "发送日志",
      icon: "",
      isNav: true,
    },
    component: () => import("@/views/message/send/list.vue"),
  },

  {
    path: "youtubeEmail",
    name: "MESSAGE_YOUTUBE_EMAIL",
    meta: {
      title: "YouTube邮件",
      icon: "",
      isNav: true,
    },
    component: () => import("@/views/message/youtubeEmail/list.vue"),
  },
  {
    path: "appUpdate",
    name: "MESSAGE_APP_UPDATE",
    meta: {
      title: "APP更新",
      icon: "",
      isNav: true,
    },
    component: () => import("@/views/message/appUpdate/list.vue"),
  },
  {
    path: "appUpdateEdit",
    name: "MESSAGE_APP_UPDATE_EDIT",
    meta: {
      title: "APP更新编辑",
      icon: "",
      isNav: true,
    },
    component: () => import("@/views/message/appUpdate/edit.vue"),
  },
];
