<style lang="scss" scope>
.classify {
  .color {
    height: 15px;
    width: 25px;
    border-radius: 4px;
    display: inline-block;
  }
}
</style>

<template>
  <section class="public-wp">
    <TabsNav :list="tabsNavList" />

    <ul class="public-search">
      <li class="public-search-left">
        <el-button
          icon="el-icon-plus"
          @click="handleGoTo({}, 'edit')"
          type="primary"
          >添加分类</el-button
        >
      </li>
      <li class="public-search-right">
        <el-input placeholder="请输入名称" v-model="keyword"></el-input>
        <el-button type="warning" @click="handleSearch">搜 索</el-button>
      </li>
    </ul>

    <el-table :data="list" v-loading="loading" class="publi-table">
      <el-table-column prop="categoryname" label="名称"> </el-table-column>

      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.createdAt | formatDate }}
        </template>
      </el-table-column>

      <el-table-column label="修改时间">
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
import { getMemberCategory, deleteCategory } from "@api/member";
import { PAGE_SIZE } from "@config";
import TabsNav from "@comp/TabsNav";

export default {
  components: { TabsNav },

  data() {
    return {
      tabsNavList: [
        { name: "学员列表", path: "/member/list" },
        { name: "学员分类设置", path: "/member/classify" },
      ],

      list: [],
      loading: true,
      keyword: "",
    };
  },

  methods: {
    /**
     * 获取列表
     */
    async queryList() {
      this.loading = true;

      const { data: resData } = await getMemberCategory();
      if (!resData.data.status) return;

      this.loading = false;

      this.list = resData.data.dataList;
    },

    /**
     * 删除类型
     */
    async handleDelete(row) {
      this.$confirm("是否删除当前类型？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      })
        .then(async () => {
          const { data: resData } = await deleteCategory(row.id);
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
        name: "CLASSIFY_EDIT",
        query: {
          id: row.id,
          name: row.categoryname,
          color: row.color,
        },
      });
    },

    handleSearch() {},
  },

  created() {
    this.queryList();
  },
};
</script>
