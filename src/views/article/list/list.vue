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
      <div class="content">
        <el-form-item label="标题">
          <el-input v-model="params.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select
            v-model="params.category"
            placeholder="请选择类型"
            clearable
          >
            <el-option
              v-for="(item, index) in categoryList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>

      <el-form-item>
        <el-button @click="handleSearch" icon="el-icon-search" type="primary"
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

    <el-table :data="list" v-loading="loading" class="publi-table">
      <el-table-column align="center" type="index" label="序号">
      </el-table-column>

      <el-table-column align="center" prop="title" label="标题">
      </el-table-column>

      <el-table-column align="center" label="缩略图">
        <template slot-scope="scope">
          <img
            v-if="scope.row.thumb"
            :src="FILE_ROOT + scope.row.thumb"
            class="thumb"
            alt=""
          />
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="category" label="类型">
        <template slot-scope="scope">
          <span
            v-for="(item, index) in categoryList"
            :key="index"
            v-show="item.id == scope.row.category"
          >
            {{ item.name }}
          </span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="sort" label="排序">
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
import {
  getArticleList,
  getArticleClassify,
  deleteArticle,
} from "@api/article";
import { PAGE_SIZE, FILE_ROOT } from "@config";

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
      categoryList: [],
      FILE_ROOT,
    };
  },

  methods: {
    /**
     * 获取列表
     */
    async queryList() {
      this.loading = true;

      const { data: resData } = await getArticleList(this.params, this.pages);
      if (!resData.data.status) return;

      this.loading = false;

      this.list = resData.data.data.rows;
      this.total = resData.data.data.count;
    },

    /**
     * 获取列表
     */
    async queryClassify() {
      const { data: resData } = await getArticleClassify();

      if (!resData.data.status) return;

      this.categoryList = resData.data.dataList;
    },

    /**
     * 删除用户
     */
    async handleDelete(row) {
      this.$confirm("是否删除当前试题？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      })
        .then(async () => {
          const { data: resData } = await deleteArticle(row.id);
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
        name: "ARTICLE_EDIT",
        query: {
          id: row.id,
          title: row.title,
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

  async created() {
    await this.queryClassify();

    this.queryList();
  },
};
</script>
