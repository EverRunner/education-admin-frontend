<style lang="scss" scope>
.main {
  &-breadcrumb {
    position: absolute;
    left: 263px;
    right: 20px;
    top: 90px;
  }
  &-body {
    position: absolute;
    left: 0;
    right: 0;
    // bottom: 20px;
    bottom: 0px;
    top: 68px;
    box-sizing: border-box;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #fff;
    &-form {
      display: flex;
      width: 100%;
    }
    /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background-color: #f5f5f5;
    }
    /*定义滚动条轨道 内阴影+圆角*/
    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      background-color: #f5f5f5;
    }
    /*定义滑块 内阴影+圆角*/
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);
      background-color: #d4d4d4;
    }
  }
  &-footer {
    color: #000;
    opacity: 0.45;
    position: absolute;
    left: 260px;
    right: 20px;
    bottom: 17px;
    text-align: center;
    font-size: 12px;
  }
}

//breadcrumb transition
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all 0.5s;
}

.breadcrumb-enter,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-move {
  transition: all 0.5s;
}

.breadcrumb-leave-active {
  position: absolute;
}
</style>

<template>
  <section class="main">
    <top-nav />

    <div class="main-body">
      <transition name="fade-transform" mode="out-in">
        <div>
          <!-- 需要缓存的页面 -->
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive" />
          </keep-alive>

          <!-- 不用缓存的页面 -->
          <router-view v-if="!$route.meta.keepAlive" />
        </div>
      </transition>
    </div>
  </section>
</template>

<script>
import LeftMenu from "./components/LeftMenu";
import TopNav from "./components/TopNav";

export default {
  components: {
    LeftMenu,
    TopNav,
  },

  data() {
    return {
      breadcrumb: [],
    };
  },

  created() {
    this.getBreadcrumb(this.$router.options.routes, this.$route);
  },

  watch: {
    $route(to, from) {
      this.breadcrumb = [];
      this.getBreadcrumb(this.$router.options.routes, this.$route);
    },
  },

  methods: {
    /**
     * 面包屑
     */
    getBreadcrumb(routes, route) {
      routes.forEach((item) => {
        if (
          route.meta.parent == item.name ||
          route.name.indexOf(item.name) != -1
        ) {
          this.breadcrumb.push(item);
        }
        if (item.children) this.getBreadcrumb(item.children, route);
      });
    },
  },
};
</script>
