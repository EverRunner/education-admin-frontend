<style lang="scss" scope>
.home {
  .thumb {
    max-height: 100%;
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
          <el-input v-model="params.name" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="params.level" placeholder="请选择类型" clearable>
            <el-option
              v-for="(label, index) in categoryList"
              :key="index"
              :label="label"
              :value="index"
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

      <el-table-column align="center" label="类型">
        <template slot-scope="scope">
          {{ categoryList[scope.row.type] }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="缩略图">
        <template slot-scope="scope">
          <img :src="scope.row.thumb" class="thumb" alt="" />
        </template>
      </el-table-column>

      <el-table-column align="center" prop="sort" label="积分">
      </el-table-column>

      <el-table-column align="center" prop="sort" label="作者">
      </el-table-column>

      <el-table-column align="center" prop="sort" label="排序">
      </el-table-column>

      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          {{ scope.row.status ? "启用" : "禁用" }}
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
            type="info"
            @click="handleGoTo(scope.row, 'details')"
            >章节</el-button
          >
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
import { getCourseList, deleteCourse } from "@api/course";
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

      const { data: resData } = await getCourseList(this.params, this.pages);
      if (!resData.data.status) return;

      this.loading = false;

      this.list = resData.data.data.rows;
      this.total = resData.data.data.count;
    },

    /**
     * 删除课程
     */
    async handleDelete(row) {
      this.$confirm("是否删除当前课程？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      })
        .then(async () => {
          const { data: resData } = await deleteCourse(row.id);
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
        name: type == "edit" ? "COURSE_EDIT" : "COURSE_CHAPTER",
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

  created() {
    this.queryList();
  },
};
</script>
