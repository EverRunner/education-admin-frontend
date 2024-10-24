<style lang="scss" scope>
.top-nav {
  position: absolute;
  top: 0;
  left: 240px;
  right: 0;
  background: #fff;
  height: 65px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 20px 30px;
  box-sizing: border-box;

  .el-dropdown-link {
    cursor: pointer;
    color: #595959;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    img {
      width: 24px;
      height: 24px;
      margin-right: 10px;
      border-radius: 50%;
    }
    em {
      font-style: normal;
    }
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
}
</style>

<template>
  <section class="top-nav">
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        <img src="../../../assets/images/touxiang.png" alt="" />
        <em>
          帐号：{{ userInfo.username || "管理员"
          }}<i class="el-icon-arrow-down el-icon--right"></i
        ></em>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="passwordEdit">密码修改</el-dropdown-item>
        <el-dropdown-item command="loginOut">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </section>
</template>

<script>
import { loginOut } from "@api/user";

export default {
  name: "TopNav",
  data() {
    return {
      userInfo: JSON.parse(sessionStorage.getItem("userInfo")),
    };
  },

  methods: {
    /**
     * 处理下拉菜单事件
     */
    async handleCommand(command) {
      switch (command) {
        //退出登录
        case "loginOut":
          this.$confirm("是否确认退出登录？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "error",
          })
            .then(async () => {
              await loginOut();

              this.$router.push({
                name: "LOGIN",
              });
            })
            .catch(() => {});
          break;

        //密码修改
        case "passwordEdit":
          this.$router.push({
            name: "SYSTEM_ADMIN_PASSWORD",
          });
          break;
      }
    },
  },
};
</script>
