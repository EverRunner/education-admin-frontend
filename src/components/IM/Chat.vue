<style lang="scss" scoped>
.im-content {
  background-color: #fff;
  &.border {
    border: 1px solid #eee;
  }
  &-title {
    overflow: hidden;
    padding: 15px 20px;
    &__thumb {
      float: left;
      position: relative;
      img {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        &::before {
          content: "";
          width: 5px;
          height: 5px;
          border: 1px solid #fff;
          position: absolute;
          right: -2px;
          bottom: -2px;
        }
      }
    }
    h5 {
      float: left;
      font-size: 17px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #222222;
      line-height: 35px;
      margin-left: 10px;
    }
    i {
      float: right;
      font-size: 14px;
      color: #222;
      line-height: 35px;
      cursor: pointer;
    }
  }
  &-body {
    padding: 20px;
    height: 300px;
    box-sizing: border-box;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    overflow-y: auto;
    li {
      margin-bottom: 20px;
      display: flex;

      &.my-msg {
        justify-content: flex-end;
        .im-content-body__text {
          margin-right: 10px;

          h6 {
            text-align: right;
          }

          .msg {
            background: #12be6e;
            color: #fff;
            // text-align: right;
          }
        }
      }
    }
    &__thumb {
      width: 35px;
      height: 35px;
      border-radius: 50%;
    }
    &__text {
      max-width: 80%;
      padding-left: 10px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      &.on {
        align-items: flex-end;
      }
      h6 {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        margin-bottom: 5px;
        margin-top: 5px;
      }
      .msg {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #222222;
        background: #f6f6f6;
        border-radius: 4px;
        padding: 6px 10px;
        line-height: 1.6;
        letter-spacing: 1px;
      }
    }
  }

  &-btn {
    height: 33px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
    padding: 0 15px;
    li {
      display: flex;
      align-items: center;
      i {
        font-size: 18px;
        color: #222;
      }
      span {
        font-size: 12px;
        color: #222;
        margin-left: 5px;
      }
    }
  }

  &-input {
    height: 80px;
    padding: 15px;
    textarea {
      height: calc(100% - 40px);
      width: 100%;
      border: 1px solid #fff;
      font-size: 15px;
      outline: none;
    }
    &__btn {
      text-align: right;
      padding-top: 10px;
      button {
        width: 120px;
        height: 34px;
        background: #16c674;
        border-radius: 4px;
        text-align: center;
        line-height: 34px;
        border: 0;
        font-size: 14px;
        color: #ffffff;
        line-height: 14px;
      }
    }
  }
}

audio {
  opacity: 0;
  width: 0;
  height: 0;
  z-index: -100;
  position: relative;
}
</style>

<template>
  <section
    class="im-content "
    :class="[
      'im-content',
      {
        border: border,
      },
    ]"
  >
    <div class="im-content-title" v-if="!border">
      <div class="im-content-title__thumb">
        <img src="../../assets/images/honours-thumb.png" alt="" />
      </div>
      <h5>
        {{ getImNowUser.username || "-" }}
        <span
          v-if="getImNowUser.memberid > 0"
          style="font-size: 10px;color: #666;"
          >({{ getImNowUser.userCategoryName }})</span
        >
      </h5>
      <i class="el-icon-close" @click="handleClose"></i>
    </div>

    <ul
      class="im-content-body public-scrollbar"
      ref="imContentBody"
      v-loading="msgLoading"
      v-if="getImNowUser.memberid == -1"
    >
      <li
        v-for="item in msgGroupList"
        :key="item.id"
        :class="{ 'my-msg': item.memberid == userInfo.id }"
      >
        <template v-if="item.memberid != userInfo.id">
          <img
            class="im-content-body__thumb"
            src="../../assets/images/honours-thumb.png"
            alt=""
          />
          <div class="im-content-body__text">
            <h6>
              {{ item.yibei_member && item.yibei_member.username }}
              {{ item.createdAt | formatDate("MM/DD HH:mm") }}
            </h6>
            <div class="msg" v-html="item.msg"></div>
          </div>
        </template>

        <template v-else>
          <div class="im-content-body__text on">
            <h6>
              易北
              {{ item.createdAt | formatDate("MM/DD HH:mm") }}
            </h6>
            <div class="msg" v-html="item.msg"></div>
          </div>
          <img
            class="im-content-body__thumb"
            src="../../assets/images/honours-thumb.png"
            alt=""
          />
        </template>
      </li>
    </ul>

    <ul
      class="im-content-body public-scrollbar"
      ref="imContentBody"
      v-loading="msgLoading"
      v-else
    >
      <li
        v-for="item in msgList"
        :key="item.id"
        :class="{ 'my-msg': item.memberid == userInfo.id }"
      >
        <template v-if="item.memberid != userInfo.id">
          <img
            class="im-content-body__thumb"
            src="../../assets/images/honours-thumb.png"
            alt=""
          />
          <div class="im-content-body__text">
            <h6>
              {{ getImNowUser.username }}
              {{ item.createdAt | formatDate("MM/DD HH:mm") }}
            </h6>
            <div class="msg" v-html="item.msg"></div>
          </div>
        </template>

        <template v-else>
          <div class="im-content-body__text on">
            <h6>
              易北
              {{ item.createdAt | formatDate("MM/DD HH:mm") }}
            </h6>
            <div class="msg" v-html="item.msg"></div>
          </div>
          <img
            class="im-content-body__thumb"
            src="../../assets/images/honours-thumb.png"
            alt=""
          />
        </template>
      </li>
    </ul>
    <ul class="im-content-btn">
      <el-upload
        action="/clientapi/uploadhandler/image"
        :show-file-list="false"
        :http-request="handleFileUpload"
      >
        <li>
          <i class="el-icon-picture"></i>
          <span>图片</span>
        </li>
      </el-upload>
    </ul>
    <div class="im-content-input">
      <textarea
        v-model="msgContent"
        ref="msgContent"
        placeholder="输入消息"
        cols="3"
        @keyup.enter="sendMsg"
      ></textarea>
      <div class="im-content-input__btn">
        <button @click="sendMsg">提交内容</button>
      </div>
    </div>

    <!-- 音乐 -->
    <audio src="@assets/media/service.mp3" ref="serviceAudio"></audio>
  </section>
</template>

<script>
import axios from "axios";
import { mapGetters, mapMutations, mapActions } from "vuex";
import { v4 as uuidv4 } from "uuid"; // uuid插件
import { FILE_ROOT, IM_WEBSOCKET_URL } from "@config";
import Bus from "@utils/tools/bus.js";

// window.onfocus = () => {
//   this.pollingMsgListNer();
// };

// window.onblur = () => {
//   clearInterval(this.getImTimer);
// };

// 取消请求
const CancelToken = axios.CancelToken;

export default {
  name: "Chat",
  components: {},

  props: {
    border: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      msgContent: "",
      frindid: 0,
      lasmsgid: 0,
      msgList: [],
      userInfo: {
        id: 2983, // 客服
        username: "易北客服",
      },

      groupPages: {
        pageindex: 1,
        pagesize: 30,
      },

      lockReconnect: false, // 避免ws重复连接
      ws: null, //  判断当前浏览器是否支持WebSocket,
      wsUrl: "",
      timeout: 1000 * 20, //1分钟发一次心跳
      timeoutObj: null,
      serverTimeoutObj: null,
      reconnectTimeout: null,

      msgLoading: false,

      pollingEnabled: false,
      msgGroupList: [],

      source: CancelToken.source(),
    };
  },

  watch: {},

  computed: {
    ...mapGetters([
      "getImShowAddUser",
      "getImTimer",
      "getImNowUser",
      "getWS",
      "getGroupInfo",
    ]),
  },

  created() {
    // this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    // this.pollingMsgListNer();

    // 用户详情聊天
    if (this.border) this.queryMsgList();

    this.startPolling();
  },

  mounted() {
    this.$nextTick(() => {
      Bus.$on("userClick", this.queryMsgList);

      this.createWebSocket();
    });
  },

  methods: {
    ...mapMutations([
      "setImTimer",
      "setImShow",
      "setImLoading",
      "setWS",
      "setGroupInfo",
    ]),
    ...mapActions(["actionsImUserList"]),

    createWebSocket() {
      //  创建1个socket连接
      const that = this;

      if (!("WebSocket" in window)) {
        console.log("您的浏览器不支持 WebSocket!");
        return;
      }

      // 打开一个 web socket
      this.ws = new WebSocket(`${IM_WEBSOCKET_URL}/${this.userInfo.id}`);

      // Web Socket 已连接上，使用 send() 方法发送数据
      this.ws.onopen = function(e) {
        if (this.reconnectTimeout) window.clearInterval(this.reconnectTimeout);
        that.heartCheck();
        console.log("Web Socket 已连接上 onopen", e, that.userInfo.id);
      };

      this.ws.onclose = function() {
        that.reconnect();
        console.log("连接关闭!" + new Date().toLocaleString());
      };

      this.ws.onerror = function() {
        that.reconnect();
        console.log("连接错误!");
      };

      this.ws.onmessage = function(evt) {
        // 如果获取到消息，心跳检测重置
        that.heartCheck(); // 拿到任何消息都说明当前连接是正常

        // if (msg) that.handleSendMsg(that.params.memberid, msg);

        if (evt.data.indexOf("status") >= 0) return;

        const { msg, fromuser } = JSON.parse(evt.data);

        that.msgList.push({
          createdAt: new Date(),
          frindid: that.getImNowUser.frindid,
          id: uuidv4(),
          memberid: fromuser,
          msg: msg,
          status: 1,
          updatedAt: new Date(),
        });

        // 播放声音
        if (that.$refs.serviceAudio && that.$refs.serviceAudioplay.play) {
          that.$refs.serviceAudio.play();
        }

        that.handleAlignBottom();
      };
    },

    /**
     * 获取聊天列表 群聊、个人
     */
    async queryMsgList() {
      if (!this.getImNowUser.memberid) return;

      if (this.getImNowUser.memberid == -1) {
        // 群聊
        this.handleAlignBottom();
      } else {
        // 个人
        this.msgLoading = true;
        const { data: resData } = await this.$get("/im/getfriendimmsg", {
          params: {
            frindid: this.getImNowUser.memberid,
            pageindex: 1,
            pagesize: 200,
          },
          headers: { isLoading: true },
        });
        this.msgLoading = false;
        this.setImLoading(false);
        if (!resData.data.status) return;

        this.msgList = resData.data.data;
        this.handleAlignBottom();
      }
    },

    /**
     * 发送消息给某个好友 群聊、个人
     */
    async sendMsg() {
      if (!this.msgContent) this.$message.error("发送内容不能为空！");

      const content = this.msgContent;
      this.msgContent = "";

      // 接收用户
      const touser =
        this.getImNowUser.memberid == -1 ? 0 : this.getImNowUser.memberid;

      const msgObj = JSON.stringify({
        category: this.getImNowUser.frindid == -1 ? 2 : 1, // 1：私聊 2：群聊
        fromuser: this.userInfo.id, // 客服的id
        touser, // 接收用户（群聊不需要）
        msg: content,
      });

      this.ws.send(msgObj);

      //群聊
      if (this.getImNowUser.memberid == -1) {
        this.pollingEnabled = false;
        this.source.cancel("操作取消");

        this.msgGroupList.push({
          createdAt: new Date(),
          frindid: this.getImNowUser.frindid,
          id: uuidv4(),
          memberid: this.userInfo.id,
          msg: content,
          status: 1,
          updatedAt: new Date(),
        });
        this.setGroupMessages(this.userInfo.id, content);

        // this.queryMsgListNer();
      } else {
        // 个人

        this.msgList.push({
          createdAt: new Date(),
          frindid: this.getImNowUser.frindid,
          id: uuidv4(),
          memberid: this.userInfo.id,
          msg: content,
          status: 1,
          updatedAt: new Date(),
        });
        const { data: resData } = await this.$post(
          "/im/sendmsg",
          {
            frindid: this.getImNowUser.frindid,
            content,
          },
          {
            headers: { isLoading: true },
          }
        );
        if (!resData.data.status) return;

        // this.queryMsgListNer();
      }

      this.msgContent = "";
      // 内容滑到底部
      this.handleAlignBottom();

      // 输入框获取焦点
      this.$nextTick((x) => {
        this.$refs.msgContent.focus();
      });
    },

    /**
     * 群聊-发送消息
     */
    async setGroupMessages(frindid, content) {
      await this.$post(
        "/im/sendgroupallmsg",
        {
          frindid: frindid,
          content: content,
        },
        {
          headers: { isLoading: true },
        }
      );

      this.source = CancelToken.source();
      this.startPolling();
    },

    /**
     * 获取发送的消息 - 群聊、个人用户
     */
    async queryMsgListNer() {
      if (this.getImNowUser.frindid == -1) {
        // 内容滑到底部
        this.handleAlignBottom();
        return;
      }

      // 个人用户
      const { data: resData } = await this.$get("/im/getmsglistner", {
        params: {
          lasmsgid: this.lasmsgid,
          frindid: this.getImNowUser.frindid,
        },
      });
      if (!resData.data.status) return this.queryMsgListNer();

      this.msgList = resData.data.data;
    },

    /**
     * 在线状态轮训接口
     *  status 状态（1：在线，0：离线）
     */
    async setOnline(status) {
      const { data: resData } = await this.$post("/im/onlineloop", {
        status,
      });
    },

    /**
     * 5秒全局轮询消息
     */
    async pollingMsgListNer() {
      if (this.getImTimer) return;

      // this.queryMsgList();
      // this.setOnline(1);
      // this.actionsImUserList();

      // this.setImTimer(timer);
    },

    /**
     * 获取群发消息
     */
    async getMessages(pageindex = 1, pagesize = 200) {
      const { data: resData } = await this.$get("/im/getgroupallmsglistner", {
        params: {
          pageindex: pageindex,
          pagesize: pagesize,
        },
        headers: { isLoading: true },
        cancelToken: this.source.token,
      });
      return resData.data.data.rows;
    },

    /**
     * 轮训获取群发消息
     */
    async fetchMessages() {
      try {
        // 发起请求
        this.msgGroupList = await this.getMessages();
        const lastMsg = this.msgGroupList[this.msgGroupList.length - 1];

        // 设置用户列表上显示的消息
        this.setGroupInfo({
          ...this.getGroupInfo,
          msg: lastMsg.msg,
          msgstatus: lastMsg.memberid == this.userInfo.id ? 1 : lastMsg.status,
          msgid: lastMsg.id,
        });

        // 请求成功后，等待2秒再执行下一次请求
        setTimeout(() => {
          if (this.pollingEnabled) {
            this.fetchMessages();
          }
        }, 2000);
      } catch (error) {
        console.error("获取消息出错", error);

        // 错误处理逻辑，这里可以根据实际情况决定是否继续轮询
        // 例如，可以在这里设置一个重试次数，超过后停止轮询
        if (this.pollingEnabled) {
          setTimeout(() => {
            this.fetchMessages();
          }, 2000); // 或者根据错误情况调整重试间隔
        }
      }
    },

    /**
     * 开始轮训
     */
    startPolling() {
      this.pollingEnabled = true;
      this.fetchMessages(); // 启动首次请求
    },

    /**
     * 停止轮训
     */
    stopPolling() {
      this.pollingEnabled = false;
    },

    getBase64(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        let fileResult = "";
        reader.readAsDataURL(file);
        //开始转
        reader.onload = function() {
          fileResult = reader.result;
        };
        //转 失败
        reader.onerror = function(error) {
          reject(error);
        };
        //转 结束  咱就 resolve 出去
        reader.onloadend = function() {
          resolve(fileResult);
        };
      });
    },

    /**
     * 图片上传
     */
    async handleFileUpload(params) {
      const file = params.file,
        fileType = file.type,
        isImage = fileType.indexOf("image") != -1,
        isLt2M = file.size / 1024 / 1024 < 2;
      // 这里常规检验，看项目需求而定
      if (!isImage) {
        this.$message.error("只能上传图片格式png、jpg、gif!");
        return;
      }
      if (!isLt2M) {
        this.$message.error("只能上传图片大小小于2M");
        return;
      }
      // 根据后台需求数据格式
      const form = new FormData();
      // 文件对象
      form.append("file", file);
      // 本例子主要要在请求时添加特定属性，所以要用自己方法覆盖默认的action
      // form.append("clientType", "xxx");

      //  图片转base64
      const dataURL = await this.getBase64(file);

      // 添加消息
      this.msgList.push({
        createdAt: new Date(),
        frindid: this.getImNowUser.frindid,
        id: uuidv4(),
        memberid: this.userInfo.id,
        msg: `<img src='${dataURL}' />`,
        status: 1,
        updatedAt: new Date(),
      });

      // 上传图片
      const { data: resData } = await this.$post("/uploadhandler/image", form);
      if (!resData.data.status) return;

      // 发送消息
      const { data: resData2 } = await this.$post("/im/sendmsg", {
        frindid: this.getImNowUser.frindid,
        content: `<img src='${FILE_ROOT + resData.data.path}' >`,
      });
      if (!resData2.data.status) return;

      // this.queryMsgListNer();
    },

    /**
     * 处理底部对齐
     */
    handleAlignBottom() {
      this.$nextTick(() => {
        var h = this.$refs.imContentBody?.scrollHeight;
        this.$refs.imContentBody.scrollTop = h;
      });
    },

    /**
     * 处理关闭
     */
    handleClose() {
      // this.setImShow(false);

      this.$router.go(-1);
    },

    /**
     * 心跳
     */
    heartCheck() {
      const self = this;

      clearTimeout(this.timeoutObj);
      clearTimeout(this.serverTimeoutObj);

      this.timeoutObj = setTimeout(function() {
        //这里发送一个心跳，后端收到后，返回一个心跳消息，
        //onmessage拿到返回的心跳就说明连接正常
        self.ws.send("ping");
        self.serverTimeoutObj = setTimeout(function() {
          // 如果超过一定时间还没重置，说明后端主动断开了
          self.ws.close(); //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
        }, self.timeout);
      }, this.timeout);
    },

    /**
     * 重新连接
     */
    reconnect() {
      if (this.lockReconnect) return;
      this.lockReconnect = true;
      this.reconnectTimeout = setTimeout(() => {
        // 没连接上会一直重连，设置延迟避免请求过多
        this.createWebSocket();
        this.lockReconnect = false;
      }, 2000);
    },
  },

  /**
   * 销毁
   */
  beforeDestroy() {
    this.stopPolling();

    if (this.getImTimer) window.clearInterval(this.getImTimer);
    if (this.timeoutObj) window.clearInterval(this.timeoutObj);
    if (this.serverTimeoutObj) window.clearInterval(this.serverTimeoutObj);
    if (this.reconnectTimeout) window.clearInterval(this.reconnectTimeout);

    this.setOnline(0);

    Bus.$off("userClick");
  },
};
</script>
