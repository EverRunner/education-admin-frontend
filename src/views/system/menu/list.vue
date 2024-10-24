<style lang="scss" scope>
.home {
}
</style>

<template>
  <section class="home public-body">
    <el-form
      class="public-search-form"
      ref="form"
      :model="params"
      label-width="80px"
    >
      <div class="content">
        <el-form-item label="菜单名称">
          <el-input
            v-model="params.menuname"
            placeholder="请输入菜单名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="一级菜单">
          <el-select v-model="params.parentid" placeholder="请选择一级菜单">
            <el-option
              v-for="(item, index) in parentList"
              v-show="item.parentid == 0"
              :key="index"
              :label="item.menuname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>

      <el-form-item>
        <el-button @click="queryList" icon="el-icon-search" type="primary"
          >搜索</el-button
        >
        <el-button
          icon="el-icon-plus"
          @click="handleGoTo({}, 'edit')"
          type="warning"
          >增加</el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      :data="list"
      :tree-props="{ children: 'child', hasChildren: 'hasChildren' }"
      row-key="id"
      v-loading="loading"
      class="publi-table"
    >
      <el-table-column align="center" prop="id" label="id">
      </el-table-column>

      <el-table-column align="center" prop="menuname" label="菜单名称">
      </el-table-column>

      <el-table-column align="center" prop="url" label="链接">
      </el-table-column>

      <el-table-column align="center" prop="parentid" label="父级id">
      </el-table-column>

      <el-table-column align="center" prop="thumb" label="图标">
      </el-table-column>

      <el-table-column align="center" prop="sort" label="排序">
      </el-table-column>

      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          {{ scope.row.status ? "启用" : "禁用" }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            @click="handleGoTo(scope.row, 'edit')"
            >编辑</el-button
          >
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
import { getAllMenuTree, deleteMenu } from "@api/system";

export default {
  components: {},
  data() {
    return {
      loading: true,
      params: {},
      total: 0,
      list: [],
      parentList: [],
    };
  },

  methods: {
    /**
     * 获取列表
     */
    async queryList() {
      this.loading = true;

      const { data: resData } = await getAllMenuTree(this.params);
      if (!resData.data.status) return;

      this.loading = false;

      this.list = resData.data.menutree;

      if (this.parentList.length <= 0) {
        this.parentList = resData.data.menutree;
      }
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
          const { data: resData } = await deleteMenu(row.id);
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
        name: "SYSTEM_MENU_EDIT",
        query: {
          id: row.id,
        },
      });
    },
  },

  created() {
    this.queryList();
  },
};
</script>
