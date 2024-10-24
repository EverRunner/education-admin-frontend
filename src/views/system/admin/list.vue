<style lang="scss" scope></style>

<template>
  <section class="public-wp">
    <TabsNav :list="tabsNavList" />

    <ul class="public-search">
      <li class="public-search-left">
        <el-button
          type="primary"
          @click="handleGoTo({}, 'edit')"
          icon="el-icon-plus"
          >添加管理员</el-button
        >
      </li>
      <li class="public-search-right">
        <el-input
          placeholder="请输入管理员"
          v-model="params.username"
        ></el-input>
        <el-button type="warning" @click="queryList">搜索</el-button>
      </li>
    </ul>

    <el-table :data="list" v-loading="loading">
      <el-table-column align="center" prop="username" label="姓名">
      </el-table-column>

      <el-table-column align="center" prop="account" label="帐号">
      </el-table-column>

      <el-table-column align="center" label="角色">
        <template slot-scope="scope">
          {{ scope.row.yibei_role && scope.row.yibei_role.rolename }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="email" label="邮箱">
      </el-table-column>

      <el-table-column align="center" prop="phone" label="手机">
      </el-table-column>

      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status" type="success">启用</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="最近修改">
        <template slot-scope="scope">
          {{ scope.row.updatedAt | formatDate }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            class="public-button-primary--plain"
            @click="handleGoTo(scope.row, 'edit')"
            >编辑</el-button
          >
          <el-button
            v-if="scope.row.id != 1"
            type="danger"
            plain
            size="mini"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-algin">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pages.pageindex"
        :page-sizes="[pages.pagesize, 30, 50, 100, 200]"
        :page-size="pages.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </section>
</template>

<script>
import { getAdminList, deleteAdmin } from "@api/user";
import { getRoleList } from "@api/system";
import { PAGE_SIZE } from "@config";
import TabsNav from "@comp/TabsNav";

export default {
  components: { TabsNav },

  data() {
    return {
      tabsNavList: [
        { name: "管理员列表", path: "/system/admin" },
        { name: "角色列表", path: "/system/role" },
      ],

      loading: true,
      params: {},
      pages: {
        pageindex: 1,
        pagesize: PAGE_SIZE,
      },
      total: 0,
      list: [],
      roleList: [],
    };
  },

  methods: {
    /**
     * 获取列表
     */
    async queryList() {
      this.loading = true;

      const { data: resData } = await getAdminList();
      if (!resData.data.status) return;

      this.loading = false;

      this.list = resData.data.data.rows;
    },

    /**
     * 获取角色列表
     */
    async queryRoleList() {
      const { data: resData } = await getRoleList();
      if (!resData.data.status) return;

      this.roleList = resData.data.rolelist;
    },

    /**
     * 删除用户
     */
    async handleDelete(row) {
      this.$confirm("是否删除当前管理员？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      })
        .then(async () => {
          const { data: resData } = await deleteAdmin(row.id);
          if (!resData.data.status) return;

          this.$message.success("删除成功");
          this.queryList();
        })
        .catch(() => {});
    },

    /**
     * 处理跳转
     */
    handleGoTo(row, type) {
      this.$router.push({
        name: "SYSTEM_ADMIN_EDIT",
        query: {
          id: row.id,
        },
      });
    },

    /**
     * pageSize 改变时会触发
     */
    handleSizeChange(val) {
      this.pages.pagesize = val;
      this.pages.pageindex = 1;
      this.queryList();
    },

    /**
     * pageindex 改变时会触发
     */
    handleCurrentChange(val) {
      this.pages.pageindex = val;
      this.queryList();
    },
  },

  created() {
    this.queryList();
    this.queryRoleList();
  },
};
</script>
