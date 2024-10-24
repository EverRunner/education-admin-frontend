import Vue from "vue";
import Vuex from "vuex";
import { getImMyFriendList } from "@api/im";
import { getMemberCategory } from "@api/member";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    guideShow: false,
    isWebSocket: 0,

    // im即时聊天
    isChatFor: false,
    imTimer: 0,
    imNowUser: {},
    imShowAddUser: "addUser",
    imUserList: [],
    imShow: false,
    imLoading: false,
    ws: null, // 即时聊天对象

    groupInfo: {
      createdAt: "",
      email: "",
      frindid: 0,
      id: 0,
      memberid: -1,
      msg: "",
      msgid: 0,
      msgstatus: 0,
      online: 1,
      phone: null,
      status: 1,
      updatedAt: "",
      username: "易北学习交流群",
    },

    nowYouke: {}, // 游客聊天
  },

  getters: {
    getGroupInfo(state) {
      return state.groupInfo;
    },

    getGuideShow(state) {
      return state.guideShow;
    },

    getIsWebSocket(state) {
      return state.isWebSocket;
    },

    getImNowUser(state) {
      return state.imNowUser;
    },

    getImShowAddUser(state) {
      return state.imShowAddUser;
    },

    getImTimer(state) {
      return state.imTimer;
    },

    getImUserList(state) {
      return state.imUserList;
    },

    getImShow(state) {
      return state.imShow;
    },

    getImLoading(state) {
      return state.imLoading;
    },

    getWS(state) {
      return state.ws;
    },

    getNowYouke(state) {
      return state.nowYouke;
    },
  },

  mutations: {
    setGroupInfo(state, info) {
      state.groupInfo = info;
    },

    setGuideShow(state, status) {
      state.guideShow = status;
    },

    setIsWebSocket(state, status) {
      state.isWebSocket = status;
    },

    setIsChatFor(state, status) {
      state.isChatFor = status;
    },

    setImNowUser(state, user) {
      state.imNowUser = user;
    },

    setImShowAddUser(state, status) {
      state.imShowAddUser = status;
    },

    setImTimer(state, status) {
      state.imTimer = status;
    },

    setImUserList(state, list) {
      state.imUserList = list;
    },

    setImShow(state, status) {
      state.imShow = status;
    },

    setImLoading(state, status) {
      state.imLoading = status;
    },

    setWS(state, ws) {
      state.ws = ws;
    },

    setNowYouke(state, nowYouke) {
      state.nowYouke = nowYouke;
    },
  },

  actions: {
    // 获取im用户列表
    async actionsImUserList({ commit }, params) {
      const { data: resDataCategory } = await getMemberCategory();
      const { data: resData } = await getImMyFriendList(params);
      if (!resData.data.status) return;

      const friendList = resData.data.data.map((item) => {
        const category = resDataCategory.data.dataList.find(
          (a) => a.id == item.userCategory
        );
        if (category) item.userCategoryName = category.categoryname;

        return item;
      });

      commit("setImUserList", friendList);
    },

    // 设置客服默认用户
    async actionsNowYouke({ commit }, user) {
      commit("setNowYouke", user);
    },
  },

  modules: {},
});
