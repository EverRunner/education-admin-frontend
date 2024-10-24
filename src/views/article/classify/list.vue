<style lang="scss" scope>
.home {
  .thumb {
    height: 70px;
    max-width: 100%;
  }
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
      <el-form-item></el-form-item>
      
      <el-form-item>
        <el-button
          icon="el-icon-plus"
          @click="handleGoTo({}, 'edit')"
          type="warning"
          >增加</el-button
        >
      </el-form-item>
    </el-form>

    <el-table :data="list" v-loading="loading" class="publi-table">
      <el-table-column align="center" type="index" label="序号">
      </el-table-column>

      <el-table-column align="center" prop="name" label="名称">
      </el-table-column>

      <el-table-column align="center" prop="sort" label="排序">
      </el-table-column>

      <el-table-column align="center" prop="status" label="状态">
        <template slot-scope="scope">
          {{ scope.row.status ? "可用" : "禁用" }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.createdAt | formatDate }}
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
import { getArticleClassify, deleteArticleClassify } from "@api/article";
import { PAGE_SIZE } from "@config";

export default {
  components: {},
  data() {
    return {
      loading: true,
      params: {},
      pages: {
        pageindex: 1,
        pagesize: PAGE_SIZE,
      },
      total: 0,
      list: [],
      categoryList: {
        0: "免费课程",
        1: "付费课程",
      },
    };
  },

  methods: {
    /**
     * 获取列表
     */
    async queryList() {
      this.loading = true;

      const { data: resData } = await getArticleClassify(
        this.params,
        this.pages
      );
      if (!resData.data.status) return;

      this.loading = false;

      this.list = resData.data.dataList;
    },

    /**
     * 删除用户
     */
    async handleDelete(row) {
      this.$confirm("是否删除当前分类？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      })
        .then(async () => {
          const { data: resData } = await deleteArticleClassify(row.id);
          if (!resData.data.status) return;

          this.$message.success("删除成功");
          this.queryList();
        })
        .catch(() => {});
    },

    /**
     * 处理搜索
     */
    handleSearch(row, type) {
      this.pages.pageindex = 1;
      this.queryList();
    },

    /**
     * 处理跳转
     */
    handleGoTo(row, type) {
      this.$router.push({
        name: "ARTICLE_CLASSIFY_EDIT",
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
  },
};
</script>
