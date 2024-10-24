<style lang="scss" scope></style>

<template>
  <section class="course" v-loading="loading">
    <el-collapse v-model="activeNames" class="course-list">
      <el-collapse-item
        v-for="(item, index) in courseTerrList"
        :key="item.id"
        :name="index"
        class="course-list-item"
      >
        <template slot="title">
          <div class="title">
            <div class="title-left">
              <span>课程{{ index + 1 }}</span>
              <h5>{{ item.title }}</h5>
            </div>
            <div class="title-right">
              <el-button
                size="mini"
                type="primary"
                plain
                class="public-button-primary--plain"
                @click.stop="handleGoTo(item)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                plain
                size="mini"
                class="public-button-danger--plain"
                @click.stop="handleDelete(item)"
                >删除</el-button
              >
            </div>
          </div>
        </template>
        <div
          class="title chapter"
          v-for="(son, key) in item.yibei_course_chapter"
          :key="son.id"
        >
          <div class="title-left">
            <span>章节{{ key + 1 }}</span>
            <h5>{{ son.title }}</h5>
          </div>
          <div class="title-right">
            <div class="title-right-icon">
              <i v-if="!son.isfinal" class="title-right-icon__video"></i>
              <!-- <i v-if="!son.isfinal" class="title-right-icon__chinese"></i>
              <i v-if="!son.isfinal" class="title-right-icon__english"></i>
              <i class="title-right-icon__test"></i> -->
            </div>
            <el-button
              size="mini"
              type="primary"
              plain
              class="public-button-primary--plain"
              @click="handleChapterGoTo(son, 'edit')"
              >编辑</el-button
            >
            <el-button
              type="danger"
              plain
              size="mini"
              class="public-button-danger--plain"
              @click="handleDelete(son)"
              >删除</el-button
            >
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </section>
</template>

<script>
import { getCourseList, getCourseChapterTree, deleteCourse } from "@api/course";
import { PAGE_SIZE } from "@config";

export default {
  components: {},
  data() {
    return {
      loading: true,
      params: {
        type: 0, // 0：免费  1：付费
      },
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

      activeNames: [0],

      courseTerrList: [],
    };
  },

  methods: {
    /**
     * 获取课程列表树状
     */
    async queryCourseTerrList(keyword) {
      this.loading = true;

      const { data: resData } = await getCourseChapterTree(this.params.type, {
        title: keyword,
      });
      this.loading = false;
      if (!resData.data.status) return (this.loading = false);

      // id:13  为辅助学习资源
      resData.data.dataList.forEach((item) => {
        if (item.id == 13) this.courseTerrList.push(item);
      });
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
    handleSearch() {
      this.queryCourseTerrList(1);
    },

    /**
     * 处理跳转课程
     */
    handleGoTo(row) {
      this.$router.push({
        name: "COURSE_EDIT",
        query: {
          id: row.id,
          title: row.title,
        },
      });
    },

    /**
     * 处理跳转章节
     */
    handleChapterGoTo(row) {
      this.$router.push({
        name: "COURSE_CHAPTER_EDIT",
        query: {
          courseId: row.id,
          id: row.id,
        },
      });
    },
  },

  created() {
    this.queryCourseTerrList();
  },
};
</script>
