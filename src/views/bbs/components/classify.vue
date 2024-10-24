<style lang="scss" scope></style>

<template>
  <section>
    <ul class="public-search" style="padding-top:0">
      <li class="public-search-left">
        <el-button
          type="primary"
          @click="handleGoTo({}, 'edit')"
          icon="el-icon-plus"
          >添加分类</el-button
        >
      </li>
      <li class="public-search-right"></li>
    </ul>

    <el-table :data="list" v-loading="loading" class="publi-table">
      <el-table-column prop="name" label="名称"> </el-table-column>

      <el-table-column prop="sort" label="排序"> </el-table-column>

      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1" type="success">启用</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="最近修改">
        <template slot-scope="scope">
          {{ scope.row.updatedAt | formatDate }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150">
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
            class="public-button-danger--plain"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
import { getBbsCategory, deleteBbsCategory } from "@api/bbs";
import { PAGE_SIZE } from "@config";

export default {
  components: {},
  data() {
    return {
      list: [],
      loading: true,
    };
  },

  methods: {
    /**
     * 获取列表
     */
    async queryList() {
      this.loading = true;

      const { data: resData } = await getBbsCategory();
      if (!resData.data.status) return;

      this.loading = false;

      this.list = resData.data.data;
    },

    /**
     * 删除类型
     */
    async handleDelete(row) {
      this.$message.warning("需要删除时，请联系程序员！");
      // this.$confirm("是否删除当前类型？", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "error",
      // })
      //   .then(async () => {
      //     const { data: resData } = await deleteBbsCategory(row.id);
      //     if (!resData.data.status) return;

      //     this.$message.success("删除成功");
      //     this.queryList();
      //   })
      //   .catch(() => {});
    },

    /**
     * 处理跳转
     */
    handleGoTo(row, type) {
      this.$router.push({
        name: "BBS_CLASSIFY_EDIT",
        query: {
          id: row.id,
          name: row.name,
          sort: row.sort,
          status: row.status,
        },
      });
    },
  },

  created() {
    this.queryList();
  },
};
</script>
