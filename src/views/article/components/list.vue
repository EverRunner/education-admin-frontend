<style lang="scss" scope></style>

<template>
  <section>
    <ul class="public-search" style="padding-top:0">
      <li class="public-search-left">
        <el-button
          type="primary"
          @click="handleGoTo({}, 'edit')"
          icon="el-icon-plus"
          >添加文章</el-button
        >
        <el-select
          v-model="params.category"
          placeholder="请选择类型"
          style="margin-left:10px"
          clearable
        >
          <el-option
            v-for="(item, index) in categoryList"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </li>
      <li class="public-search-right">
        <el-input placeholder="请输入文章" v-model="params.title"></el-input>
        <el-button type="warning" @click="handleSearch">搜索</el-button>
      </li>
    </ul>

    <el-table :data="list" v-loading="loading" class="publi-table">
      <el-table-column prop="title" label="标题"> </el-table-column>

      <!-- <el-table-column label="缩略图">
        <template slot-scope="scope">
          <img
            v-if="scope.row.thumb"
            :src="FILE_ROOT + scope.row.thumb"
            class="thumb"
            alt=""
          />
          <span v-else>-</span>
        </template>
      </el-table-column> -->

      <el-table-column prop="category" label="类型">
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

      <!-- <el-table-column prop="sort" label="排序"> </el-table-column> -->

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
