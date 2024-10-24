<template>
  <ul class="public-tabs">
    <li
      v-for="(item, index) in list"
      :class="{ on: $route.path == item.path }"
      :key="index"
      @click="handleGoto(item.path)"
    >
      <i
        v-if="item.icon"
        :class="item.icon"
        style="margin-right: 5px;font-size: 16px;"
      ></i
      >{{ item.name }}
    </li>
  </ul>
</template>

<script>
export default {
  name: "TabsNav",

  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },

  data() {
    return {};
  },
  watch: {},

  mounted() {},

  computed: {},

  methods: {
    /**
     * 处理跳转
     */
    handleGoto(path) {
      if (path == this.$route.path) return;

      this.$router.push({
        path,
      });
    },
  },
};
</script>
