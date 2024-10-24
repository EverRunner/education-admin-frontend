<style lang="scss" scope>
.home {
  .content-title {
    font-size: 20px;
    font-weight: bold;
    color: #000;
    padding-top: 7px;
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
        <div class="content-title">{{ $route.query.title }}</div>
      </div>

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

      <el-table-column align="center" prop="title" label="标题">
      </el-table-column>

      <el-table-column align="center" prop="sort" label="排序">
      </el-table-column>

      <el-table-column align="center" prop="description" label="简介">
      </el-table-column>

      <el-table-column align="center" label="更新时间">
        <template slot-scope="scope">
          {{ scope.row.updatedAt | formatDate }}
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
  </section>
</template>

<script>
import { getChapterList, mildDeleteChapter } from "@api/course";
import { PAGE_SIZE } from "@config";

export default {
  components: {},
  data() {
    return {
      loading: true,
      params: {},
      list: [],
    };
  },

  methods: {
    /**
     * 获取列表
     */
    async queryList() {
      this.loading = true;

      const { data: resData } = await getChapterList(this.params.courseid);
      if (!resData.data.status) return;

      this.loading = false;
      this.list = resData.data.dataList;
    },

    /**
     * 删除章节
     */
    async handleDelete(row) {

      this.$confirm("删除请联系程序员！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      })

      return 

      // this.$confirm("是否删除当前章节？", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "error",
      // })
      //   .then(async () => {
      //     const { data: resData } = await deleteChapter(row.id);
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
        name: "COURSE_CHAPTER_EDIT",
        query: {
          courseId: this.$route.query.id,
          id: row.id,
        },
      });
    },
  },

  created() {
    if (this.$route.query.id) {
      this.params.courseid = this.$route.query.id;
      this.queryList();
    }
  },
};
</script>
