<template>
  <el-button type="primary" @click="queryInfo">登入学员端</el-button>
</template>

<script>
import { getMenberToken } from "@api/member";

export default {
  name: "Mirror",

  props: {
    memberId: {
      type: Number | String,
      default: 0,
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
     * 获取用户token
     */
    async queryInfo() {
      this.$confirm("是否登入学员系统？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.$message({
            showClose: true,
            message: "正在登入学员系统，请稍等！",
            type: "success",
          });

          const { data: resData } = await getMenberToken(this.memberId);

          if (!resData.data.status) return;

          window.open(
            "https://www.ybmblex.net/#/account/?token=" +
              // "http://localhost:9002/#/account/?token=" +
              resData.data.temporarytoken
          );
        })
        .catch(() => {});
    },
  },
};
</script>
