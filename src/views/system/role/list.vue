<style lang="scss" scope>
.home {
}
</style>

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
          v-model="params.rolename"
        ></el-input>
        <el-button type="warning" @click="queryList">搜索</el-button>
      </li>
    </ul>

    <el-table :data="list" v-loading="loading" class="publi-table">
      <el-table-column align="center" prop="rolename" label="角色名称">
      </el-table-column>

      <el-table-column align="center" prop="remark" label="备注">
      </el-table-column>

      <el-table-column align="center" label="最近修改">
        <template slot-scope="scope">
          {{ scope.row.updatedAt | formatDate }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status" type="success">启用</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="250">
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
            type="danger"
            plain
            size="mini"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
import { getRoleList, deleteRole } from "@api/system";
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

      total: 0,
      list: [],
    };
  },

  methods: {
    /**
     * 获取列表
     */
    async queryList() {
      this.loading = true;

      const { data: resData } = await getRoleList();
      if (!resData.data.status) return;

      this.loading = false;

      this.list = resData.data.rolelist;
    },

    /**
     * 删除用户
     */
    async handleDelete(row) {
      this.$confirm("是否删除当前会员？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      })
        .then(async () => {
          const { data: resData } = await deleteRole(row.id);
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
        name: type == "edit" ? "SYSTEM_ROLE_EDIT" : "SYSTEM_ROLE_PERMISSIONS",
        query: {
          id: row.id,
          name: row.rolename,
        },
      });
    },
  },

  created() {
    this.queryList();
  },
};
</script>
