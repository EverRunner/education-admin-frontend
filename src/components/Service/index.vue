<style lang="scss" scoped>
.im {
  position: fixed;
  z-index: 200;
  &-index {
    background: #ffffff;
    box-shadow: 0px 0px 30px 0px #d4d8dc;
    border-radius: 10px;
    display: flex;
    width: 900px;
    box-sizing: border-box;
    &-user {
      border-right: 1px solid #eee;
      width: 350px;
      box-sizing: border-box;
    }
    &-content {
      width: calc(900px - 350px);
      box-sizing: border-box;
    }
  }
  &-btn {
    width: 60px;
    height: 60px;
    background: #12be6e;
    box-shadow: 0px 0px 30px 0px #d4d8dc;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: fixed;
    right: 15px;
    bottom: 9vh;
    cursor: pointer;
    z-index: 100;
    opacity: 0.9;
    transition: all 0.3s ease;
    &:hover {
      right: 12px;
      opacity: 1;
    }
    i {
      font-size: 24px;
      color: #fff;
    }
    p {
      font-size: 12px;
      color: #fff;
      padding-top: 5px;
    }
  }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}

.slide-fade-enter {
  transform: translateX(900px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(900px);
  opacity: 0;
}
</style>

<template>
  <section class="im">
    <transition name="slide-fade">
      <div class="im-index">
        <div class="im-index-user">
          <user-list />
        </div>
        <div class="im-index-content">
          <chat />
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import Chat from "./Chat";
import UserList from "./UserList";
import { FILE_ROOT, IM_WEBSOCKET_URL } from "@config";

export default {
  name: "Service",
  components: { Chat, UserList },

  props: {},

  data() {
    return {
      peopleChat: {},
      isShow: false,

      userInfo: {
        id: 2983, // 客服
      },
    };
  },
  watch: {},

  created() {},

  mounted() {},

  computed: {
    ...mapGetters(["getImShowAddUser", "getImShow"]),
  },

  methods: {
    ...mapMutations(["setImShow"]),

    handleClick() {
      this.setImShow(!this.getImShow);
    },
  },

  /**
   * 销毁
   */
  beforeDestroy() {},
};
</script>
