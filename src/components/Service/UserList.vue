<style lang="scss" scoped>
.im {
  &-user {
    box-sizing: border-box;
    padding: 20px 0;
    &-title {
      overflow: hidden;
      margin-bottom: 10px;
      padding: 0 20px;
      span {
        float: left;
        font-size: 22px;
        font-weight: 600;
        color: #222222;
      }
      i {
        float: right;
        margin-left: 20px;
        font-size: 16px;
        cursor: pointer;
      }
    }
    &-search {
      max-width: 100%;
      height: 35px;
      background: #f0f2f5;
      border-radius: 19px;
      padding: 1px 15px;
      margin: 0 20px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      input {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #333;
        box-sizing: border-box;
        background: transparent;
        border: 0;
        max-height: 100%;
        width: 85%;
        margin-left: 10px;
        outline: none;
      }
    }
    &-list {
      padding-top: 12px;
      height: 400px;
      max-height: 90%;
      li {
        display: flex;
        overflow: hidden;
        align-items: center;
        margin-bottom: 12px;
        position: relative;
        cursor: pointer;
        padding: 10px 20px;
        &.on {
          background-color: #f5f5f5;
        }
      }
      &__thumb {
        width: 50px;
        height: 50px;
        position: relative;
        img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        &.on {
          &::before {
            display: none;
            content: "";
            width: 8px;
            height: 8px;
            background: #12be6e;
            position: absolute;
            border: 1px solid #fff;
            z-index: 2;
            right: 2px;
            bottom: 2px;
            border-radius: 50%;
          }
        }
      }
      &__content {
        padding: 0 15px 0 10px;
        width: calc(100% - 90px);
        h5 {
          font-size: 15px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 600;
          color: #222222;
          padding-bottom: 6px;
        }
        p {
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        i {
          color: #8590a6;
          font-size: 12px;
          position: absolute;
          top: 50%;
          right: 25px;
          margin-top: -5px;
          &.unread {
            font-style: normal;
            background: #004d92;
            width: 18px;
            height: 18px;
            line-height: 18px;
            text-align: center;
            color: #fff;
            border-radius: 50%;
            font-size: 10px;
          }
        }
        &::before {
          display: none;
          content: "";
          width: 9px;
          height: 9px;
          background: #004d92;
          position: absolute;
          z-index: 2;
          right: 25px;
          top: 50%;
          margin-top: -5px;
          border-radius: 50%;
        }
      }
      &--line {
        .im-user-list__thumb::before {
          display: inline-block;
        }
      }
      &--msg {
        .im-user-list__content p {
          color: #004d92;
        }
        .im-user-list__content::before {
          display: inline-block;
        }
        .im-user-list__content i {
          display: none;
        }
      }
    }
  }
}
</style>

<template>
  <section class="im-user">
    <div class="im-user-title">
      <span>聊天</span>
      <i class="el-icon-edit-outline"></i>
    </div>
    <div class="im-user-search">
      <i class="el-icon-search"></i>
      <input
        @keyup.enter="queryUserList"
        type="text"
        v-model="params.account"
        placeholder="请输入关键字"
      />
    </div>
    <ul class="im-user-list public-scrollbar">
      <li
        v-for="item in userList"
        v-show="item.id != 1"
        :key="item.id"
        class="im-user-list--line"
        :class="{
          'im-user-list--msg': item.msgstatus == 1,
          on: item.id == getNowYouke.id,
        }"
        @click="handleUserClick(item)"
      >
        <div class="im-user-list__thumb" :class="{ on: item.msgcount > 0 }">
          <img src="../../assets/images/honours-thumb.png" alt="" />
        </div>
        <div class="im-user-list__content">
          <h5>{{ item.username }}</h5>
          <p>{{ item.msg || " " }}</p>
          <i v-if="item.msgcount > 0" class="unread">{{ item.msgcount }}</i>
          <i v-else class="el-icon-circle-check"></i>
        </div>
      </li>
      <!-- <li class="im-user-list--line">
        <div class="im-user-list__thumb">
          <img src="../../assets/images/honours-thumb.png" alt="" />
        </div>
        <div class="im-user-list__content">
          <h5>客户</h5>
          <p>你好，欢迎使用易北教育在线客服系统</p>
          <i class="el-icon-circle-check"></i>
        </div>
      </li> -->
    </ul>
  </section>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import Bus from "@utils/tools/bus.js";
import { getYoukeList, getYoukeMsgAll } from "@api/service";

export default {
  name: "IMUserList",
  components: {},

  props: {},

  data() {
    return {
      userList: [],
      params: {
        account: "",
      },
      getImTimer: null,
    };
  },
  watch: {},

  created() {},

  mounted() {
    this.queryUserList();

    // console.log(12313, this.$store);

    this.getImTimer = setInterval(() => {
      this.queryUserList();
    }, 6000);
  },

  computed: {
    ...mapGetters(["getNowYouke", "getImUserList"]),
  },

  methods: {
    ...mapMutations(["setNowYouke"]),
    ...mapActions(["actionsNowYouke"]),

    /**
     * 获取用户列表及未读消息
     */
    async queryUserList() {
      // Promise.all([getYoukeMsgAll(), getYoukeList()]).then((values) => {
      //   const { data: unReadMsg } = values[0]; // 未读数据
      //   const { data: userList } = values[1]; // 用户列表
      //   if (!unReadMsg?.data?.status || !userList?.data?.status) return;

      //   this.userList = userList.data.data.rows.map((user) => {
      //     // 获取当前用户的未读条数
      //     const unRead = unReadMsg.data.data.filter(
      //       (msg) => msg.memberid == user.id
      //     );

      //     // 获得最新的一条消息
      //     const unReadLast = unRead[unRead.length - 1];
      //     if (unReadLast && unReadLast.id) {
      //       user.msgId = unReadLast.id;
      //       user.msg = unReadLast.msg;
      //     }

      //     return user;
      //   });

      //   // 设置默认用户
      //   if (!this.getNowYouke || !this.getNowYouke.id) {
      //     this.actionsNowYouke(this.userList[0]);
      //     this.handleClickRow(this.userList[0]);
      //   }
      // });

      const { data: resData } = await getYoukeList();

      if (!resData.data.status) return;

      this.userList = resData.data.data.rows;
    },

    /**
     * 处理用户点击
     */
    handleUserClick(row) {
      // 已读消息
      row.msgcount = 0;

      this.setNowYouke(row);
      this.handleClickRow(row);
    },

    handleClickRow(row) {
      Bus.$emit("userClickService", row);
    },
  },

  /**
   * 销毁
   */
  beforeDestroy() {
    if (this.getImTimer) window.clearInterval(this.getImTimer);
  },
};
</script>
