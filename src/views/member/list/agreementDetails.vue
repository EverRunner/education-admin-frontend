<style lang="scss" scope>
.agreement {
  background: #fff;
  padding: 20px;
  min-height: 70vh;
  &-title {
    font-size: 24px;
    text-align: center;
    padding: 20px 0;
  }
  &-info {
    &-content {
      width: calc(100% - 100px);
      p {
        padding-bottom: 10px;
      }
    }
    li {
      display: flex;
      color: rgba(0, 0, 0, 0.65);
      padding-bottom: 20px;
      line-height: 1.6;
      span {
        min-width: 90px;
      }
    }
  }
}
</style>

<template>
  <section class="agreement" v-loading="loading">
    <h1 class="agreement-title">学员同意《易北教育服务条款》详情</h1>
    <ul class="agreement-info">
      <li>
        <span>姓名：</span>
        <div class="agreement-info-content">{{ info.membername || "-" }}</div>
      </li>
      <li>
        <span>类型：</span>
        <div class="agreement-info-content">
          {{ info.category === "BUY" ? "购买" : "续费" }}
        </div>
      </li>
      <li>
        <span>城市：</span>
        <div class="agreement-info-content">{{ info.cityname || "-" }}</div>
      </li>
      <li>
        <span>ip：</span>
        <div class="agreement-info-content">{{ info.ip || "-" }}</div>
      </li>
      <li>
        <span>经纬度：</span>
        <div class="agreement-info-content">
          {{ info.lat || "-" }},{{ info.lng || "-" }}
        </div>
      </li>
      <li>
        <span>同意时间：</span>
        <div class="agreement-info-content">
          {{ info.createdAt | formatDate }}
        </div>
      </li>
      <li>
        <span>协议内容：</span>
        <div class="agreement-info-content" v-html="info.content || '-'"></div>
      </li>
    </ul>
  </section>
</template>

<script>
import { getAgreementInfo } from "@api/user";

export default {
  components: {},

  data() {
    return {
      params: {},
      info: {},
      loading: true,
    };
  },

  methods: {
    /**
     * 获取会员详情
     */
    async queryInfo() {
      const { data: resData } = await getAgreementInfo(this.params.id);
      this.loading = false;
      if (!resData.data.status) return;

      this.info = resData.data.data;
    },
  },

  async created() {
    if (this.$route.query.id) {
      this.params.id = this.$route.query.id;
      this.queryInfo();
    }
  },
};
</script>
