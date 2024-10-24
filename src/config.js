/** ***************************正式环境************************************/
export const API_ROOT = "/api";

/** ****************************测试环境***********************************/
// export const API_ROOT = "http://47.114.151.82:8092/api";

// 生产环境和测试环境
export const debug = process.env.NODE_ENV !== "production";

// 设置请求的超时时间   单位毫秒
export const REQUEST_TIMEOUT = 5 * 60 * 1000;

// 文件服务器
// export const FILE_ROOT = "http://47.114.151.82:8092/";
export const FILE_ROOT = "https://admin.ybmblex.net/";

// 一页显示的条目
export const PAGE_SIZE = 15;

// 用户等级
export const USER_LEVEL = {
  0: "免费用户",
  1: "付费用户",
  // 2: "二级会员",
};

// WebSocket 地址
export const WEBSOCKET_URL =
  process.env.NODE_ENV === "production"
    ? "wss://socket.ybmblex.net" //正式
    : // : "ws://54.183.226.51:18090"; //测试
      "wss://socket.ybmblex.net"; //测试

// 即时聊天 WebSocket 地址
export const IM_WEBSOCKET_URL =
  process.env.NODE_ENV === "production"
    ? "wss://socket.ybmblex.net" //正式
    : "ws://54.183.226.51:18090"; //测试

// 用户详情，学习进度记录类型
export const STUDY_TYPE = {
  0: "章节测试",
  1: "关键词测试（中英）",
  2: "关键词测试（英）",
  3: "章节测试前（关键词）",
  4: "我的错题测试",
  5: "综合模拟测试",
  6: "高频模拟测试",
  7: "我的错题测前（关键词）",
  8: "综合模拟测前（关键词）",
  9: "高频模拟测前（关键词）",
  10: "应变测试前（关键词）",
  11: "应变测试",
};

// 会员开通记录类型
export const VIP_LOG_TYPE = {
  1: "购买",
  2: "赠送",
  3: "后台处理",
};

// 执照申请-步骤
export const LICENSE_STEP = {
  1: "电子协议填写中",
  2: "待支付",
  3: "填写资料中",
  4: "填写完成",
};

// 执照申请-状态
export const LICENSE_STATUS = {
  0: "资料填写中",
  1: "申请中",
  2: "申请成功",
  3: "申请失败",
};

// message tab list
export const MESSAGE_TABS_NAV_LIST = [
  { name: "公告", path: "/message/affiche" },
  { name: "评价", path: "/message/evaluate" },
  { name: "发送日志", path: "/message/sendLog" },
  { name: "邮箱", path: "/message/eMail" },
  { name: "文章", path: "/article/list" },
  { name: "帖子", path: "/bbs/list" },
  { name: "节日", path: "/system/festival" },
  { name: "YouTube邮件", path: "/message/youtubeEmail" },
  { name: "APP更新", path: "/message/appUpdate" },
];

// app 系统类型
export const APP_STYSY_TYPE = {
  ios: "IOS",
  android: "Android",
};

// app 类型
export const APP_TYPE = {
  yb_student: "学员端",
  yb_manage: "管理端",
};

// 谷歌密码器服务名称
export const YB_GOOGLE_VERIFY_SERVICE = "ybmblex_google_authenticator";
