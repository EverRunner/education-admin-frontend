<style lang="scss" scoped>
.im-content {
  background-color: #fff;

  &-null {
    padding-top: 35%;
    text-align: center;
    color: #a6a7a7;
    i {
      font-size: 50px;
    }
    p {
      font-size: 16px;
      padding-top: 10px;
    }
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
            text-align: right;
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
        margin-top: 8px;
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
</style>

<template>
  <section class="im-content" v-loading="loading">
    <template v-if="getNowYouke.id">
      <div class="im-content-title">
        <div class="im-content-title__thumb">
          <img src="../../assets/images/honours-thumb.png" alt="" />
        </div>
        <h5>
          {{ getNowYouke.username || "无" }}
        </h5>
        <i class="el-icon-close" @click="handleClose"></i>
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
                {{ item.createdAt | formatDate("MM-DD HH:mm") }}
              </h6>
              <div class="msg" v-html="item.msg"></div>
            </div>
          </template>

          <template v-else>
            <div class="im-content-body__text on">
              <h6>
                {{ item.createdAt | formatDate }}
              </h6>
              <div class="msg" v-html="item.msg"></div>
            </div>
            <img
              class="im-content-body__thumb"
              src="../../assets/images/honours-thumb2.jpg"
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
    </template>

    <!-- 没有选择用户 -->
    <div v-else class="im-content-null">
      <i class="el-icon-coffee-cup"></i>
      <p>请选择聊天用户</p>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import { v4 as uuidv4 } from "uuid"; // uuid插件
import { FILE_ROOT, IM_WEBSOCKET_URL } from "@config";
import Bus from "@utils/tools/bus.js";
import { getOnlyYoukeMsg, sendYoukeMsg, readYoukeMsg } from "@api/service";

export default {
  name: "Chat",
  components: {},

  props: {},

  data() {
    return {
      msgContent: "",
      frindid: 0,
      lasmsgid: 0,
      msgList: [],
      userInfo: {
        id: 1, // 客服
      },
      loading: false,

      groupPages: {
        pageindex: 1,
        pagesize: 30,
      },

      getImTimer: null,
    };
  },

  watch: {},

  computed: {
    ...mapGetters(["getImShowAddUser", , "getNowYouke", "getWS"]),
  },

  created() {
    Bus.$on("userClickService", this.queryMsgList);
  },

  mounted() {},

  methods: {
    ...mapMutations(["setImTimer", "setImShow", "setImLoading"]),
    ...mapActions(["actionsImUserList"]),

    /**
     * 获取聊天列表
     */
    async queryMsgList() {
      if (!this.getNowYouke.id) return;

      this.loading = true;

      const { data: resData } = await getOnlyYoukeMsg({
        youkeid: this.getNowYouke.id,
      });

      this.loading = false;

      if (!resData.data.status) return;

      this.msgList = resData.data.data;
      this.handleAlignBottom();

      // 获取最近一条消息
      const msgPop = this.msgList.pop();

      if (msgPop && msgPop.id)
        this.handleReadMsg(msgPop.id, this.getNowYouke.id);
    },

    /**
     * 发送消息给某个游客
     */
    async sendMsg() {
      if (!this.msgContent) this.$message.error("发送内容不能为空！");

      const content = this.msgContent;

      this.msgList.push({
        createdAt: new Date(),
        frindid: this.getNowYouke.frindid,
        id: uuidv4(),
        memberid: 1,
        msg: content,
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
      const touser =
        this.getNowYouke.frindid == -1 ? 0 : this.getNowYouke.frindid;

      sendYoukeMsg({
        youkeid: this.getNowYouke.id,
        content,
      });
    },

    /**
     * 获取发送的消息 - 群聊、个人用户
     */
    async queryMsgListNer() {
      if (this.getNowYouke.frindid == -1) {
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
            frindid: this.getNowYouke.frindid,
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
        frindid: this.getNowYouke.frindid,
        id: uuidv4(),
        memberid: 1,
        msg: `<img src='${dataURL}' />`,
        status: 1,
        updatedAt: new Date(),
      });

      // 上传图片
      const { data: resData } = await this.$post("/uploadhandler/image", form);
      if (!resData.data.status) return;

      // 发送消息
      const { data: resData2 } = await this.$post("/im/sendmsg", {
        frindid: this.getNowYouke.frindid,
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
     * 标记消息己读
     */
    async handleReadMsg(msgId, youkeid) {
      const { data: resData } = await readYoukeMsg({
        id: msgId,
        youkeid,
      });
      if (!resData.data.status) return;
    },
  },

  /**
   * 销毁
   */
  beforeDestroy() {
    if (this.getImTimer) window.clearInterval(this.getImTimer);

    Bus.$off("userClickService");
  },
};
</script>
