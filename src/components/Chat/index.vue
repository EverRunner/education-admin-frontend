<style lang="scss" scoped>
.im-content {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 3px;
  padding-bottom: 10px;
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
        cursor: pointer;
      }
    }
  }
}
</style>

<template>
  <section class="im-content">
    <div class="im-content-title">
      <div class="im-content-title__thumb">
        <img src="../../assets/images/honours-thumb.png" alt="" />
      </div>
      <h5>与{{ userName }}的对话</h5>
      <!-- <i class="el-icon-close" @click="handleClose"></i> -->
    </div>
    <ul class="im-content-body public-scrollbar" ref="imContentBody">
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
              {{ item.yibei_member && item.yibei_member.username }}
              {{ item.createdAt | formatDate("MM-DD HH:mm") }}
            </h6>
            <div class="msg" v-html="item.msg"></div>
          </div>
        </template>

        <template v-else>
          <div class="im-content-body__text on">
            <h6>{{ item.createdAt | formatDate }}</h6>
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
        cols="4"
        @keyup.enter="sendMsg"
      ></textarea>
      <div class="im-content-input__btn">
        <button @click="sendMsg">提交内容</button>
      </div>
    </div>
  </section>
</template>

<script>
import { v4 as uuidv4 } from "uuid"; // uuid插件
import { FILE_ROOT, IM_WEBSOCKET_URL } from "@config";
import Bus from "@utils/tools/bus.js";

export default {
  name: "Chat",
  components: {},

  props: {
    frindId: {
      type: Number,
      default: 0,
    },
    userName: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      msgContent: "",
      lasmsgid: 0,
      msgList: [],
      userInfo: {
        id: 2983, // 客服
      },

      ws: null,

      groupPages: {
        pageindex: 1,
        pagesize: 30,
      },
    };
  },

  watch: {},

  computed: {},

  created() {
    // this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    // this.pollingMsgListNer();

    this.createWebSocket();
  },

  mounted() {
    this.$nextTick(() => {
      Bus.$on("userClick", this.queryMsgList);

      // this.createWebSocket();
    });
  },

  methods: {
    /**
     * 获取聊天列表 群聊、个人
     */
    async queryMsgList(e) {
      if (!this.frindId) return;

      if (this.frindId == -1) {
        // 群聊
        const { data: resData } = await this.$get("/im/getgroupallmsglistner", {
          params: {
            lasmsgid:
              this.msgList[this.msgList.length - 1] &&
              this.msgList[this.msgList.length - 1].id,
          },
        });
        this.setImLoading(false);
        if (!resData.data.status) return;

        this.msgList = resData.data.data;
        this.handleAlignBottom();
      } else {
        // 个人
        const { data: resData } = await this.$get("/im/getfriendimmsg", {
          params: {
            frindid: this.frindId,
            pageindex: 1,
            pagesize: 200,
          },
        });
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

      this.ws.send(
        JSON.stringify({
          category: 1, // 1：私聊 2：群聊
          fromuser: this.userInfo.id, // 本人的id
          touser: this.frindId, // 接收用户（群聊不需要）
          msg: content,
        })
      );

      this.msgList.push({
        createdAt: new Date(),
        frindid: this.frindId,
        id: uuidv4(),
        memberid: this.userInfo.id,
        msg: this.msgContent,
        status: 1,
        updatedAt: new Date(),
      });

      this.msgContent = "";
      // 内容滑到底部
      this.handleAlignBottom();

      // 输入框获取焦点
      this.$nextTick((x) => {
        this.$refs.msgContent.focus();
      });

      // 接收用户
      const touser = this.frindId == -1 ? 0 : this.frindId;

      // if (this.frindId == -1) {
      //   //群聊
      //   const { data: resData } = await this.$post("/im/sendgroupallmsg", {
      //     frindid: this.frindId,
      //     content,
      //   });
      //   if (!resData.data.status) return;

      //   this.queryMsgListNer();
      // } else {
      //   //个人
      //   const { data: resData } = await this.$post("/im/sendmsg", {
      //     frindid: this.frindId,
      //     content,
      //   });
      //   if (!resData.data.status) return;

      //   this.queryMsgListNer();
      // }
    },

    /**
     * 获取发送的消息 - 群聊、个人用户
     */
    async queryMsgListNer() {
      if (this.frindId == -1) {
        // 群聊
        const { data: resData } = await this.$get("/im/getgroupallmsg", {
          params: this.groupPages,
        });
        if (!resData.data.status) return this.queryMsgListNer();

        this.msgList = resData.data.data;
      } else {
        // 个人用户
        const { data: resData } = await this.$get("/im/getmsglistner", {
          params: {
            lasmsgid: this.lasmsgid,
            frindid: this.frindId,
          },
        });
        if (!resData.data.status) return this.queryMsgListNer();

        this.msgList = resData.data.data;
      }
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
        frindid: this.frindId,
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
        frindid: this.frindId,
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
        var h = this.$refs.imContentBody.scrollHeight;
        this.$refs.imContentBody.scrollTop = h;
      });
    },

    /**
     * 处理关闭
     */
    handleClose() {
      this.setImShow(false);
    },

    /**
     * 创建1个socket连接
     * @returns success
     */
    createWebSocket() {
      const that = this;

      if (!("WebSocket" in window)) {
        console.log("您的浏览器不支持 WebSocket!");
        return;
      }

      console.log(333334444, this.userInfo.id);

      // 打开一个 web socket
      this.ws = new WebSocket(`${IM_WEBSOCKET_URL}/${this.userInfo.id}`);

      this.ws.onopen = function(e) {
        // Web Socket 已连接上，使用 send() 方法发送数据
        console.log("onopen", e, that.userInfo.id);
      };

      this.ws.onmessage = function(evt) {
        //数据已接收
        console.log("onmessage3", evt.data);

        // if (evt.data == '{"status":true}') return;

        // that.msgList.push({
        //   createdAt: new Date(),
        //   frindid: that.getImNowUser.frindid,
        //   id: uuidv4(),
        //   memberid: that.userInfo.id,
        //   msg: evt.data,
        //   status: 1,
        //   updatedAt: new Date(),
        // });

        // that.handleAlignBottom();
      };
    },
  },

  /**
   * 销毁
   */
  beforeDestroy() {
    if (this.getImTimer) window.clearInterval(this.getImTimer);

    this.setOnline(0);

    this.ws.onclose = function() {
      // 关闭 websocket
      console.log("关闭 websocket");
    };
  },
};
</script>
