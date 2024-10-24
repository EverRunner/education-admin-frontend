<style lang="scss" scope></style>

<template>
  <section class="login">
    <div class="login-content">
      <!-- <img
        class="login-content-img hidden-md-and-down"
        src="../../assets/images/login-bg.png"
        alt=""
      /> -->
      <div class="login-content-form">
        <img
          class="login-content-img"
          src="../../assets/images/logo.png"
          alt=""
        />
        <h5>轻松通过联邦考试，最权威的华人在线辅导</h5>
        <div class="login-content-form__input">
          <el-input
            v-model="params.account"
            maxlength="15"
            placeholder="请输入帐号"
          ></el-input>
        </div>
        <div class="login-content-form__input">
          <el-input
            v-model="params.userpwd"
            maxlength="15"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </div>
        <!-- <div class="login-content-form__input">
          <el-input
            v-model="params.validatecode"
            maxlength="4"
            @keyup.enter.native="handleLogin"
            placeholder="请输入验证码"
          ></el-input>
          <div class="img" v-html="loginCode" @click="queryLoginCode"></div>
        </div> -->
        <div class="login-content-form__input">
          <el-checkbox v-model="params.isSavePassword">记住密码</el-checkbox>
        </div>
        <div class="login-content-form__input">
          <el-button @click="handleLogin" type="primary">登 录</el-button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { login } from "@api/user";
import { getLoginCode } from "@api/common";

export default {
  data() {
    return {
      params: {
        isSavePassword: false,
      },
      loginCode: "",

      loginInfo: JSON.parse(localStorage.getItem("loginInfo")) || {},
    };
  },

  methods: {
    /**
     * 登录
     */
    async handleLogin() {
      if (!this.params.account) return this.$message.error("请输入帐号");
      if (!this.params.userpwd) return this.$message.error("请输入密码");
      // if (!this.params.validatecode) return this.$message.error("请输入验证码");

      //验证码
      await this.queryLoginCode();

      const { data: resData } = await login(this.params);
      if (!resData.data.status) return;

      sessionStorage.setItem("userInfo", JSON.stringify(resData.data.userInfo));

      //记住密码
      if (this.params.isSavePassword) {
        delete this.params.validatecode;
        localStorage.setItem("loginInfo", JSON.stringify(this.params));
      } else localStorage.setItem("loginInfo", null);

      this.$router.push({
        name: "MAIN",
      });
    },

    /**
     * 登录验证码
     */
    async queryLoginCode() {
      const { data: resData } = await getLoginCode();
      if (resData.code != 200) return;

      this.loginCode = resData.data.img;
      this.params.validatecode = resData.data.v;
    },
  },

  created() {
    if (this.$route.query.type == "past")
      this.$message.error("登录过期，请重新登录！");

    //获取-记住密码、帐号
    if (this.loginInfo.isSavePassword) this.params = this.loginInfo;
  },
};
</script>
