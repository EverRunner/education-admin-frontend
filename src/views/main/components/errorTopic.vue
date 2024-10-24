<style lang="scss" scope>
.content {
  img {
    max-height: 100px;
    max-width: 100px;
  }
}
</style>

<template>
  <section>
    <el-table :data="list" v-loading="loading">
      <el-table-column prop="title" width="200" label="标题"> </el-table-column>

      <el-table-column label="内容">
        <template slot-scope="scope">
          <div class="content" v-html="scope.row.content"></div>
        </template>
      </el-table-column>

      <el-table-column width="80" prop="pageurl" label="类型">
        <template slot-scope="scope">
          {{ categoryList[scope.row.category] }}
        </template>
      </el-table-column>

      <el-table-column width="80" prop="rescount" label="错误次数">
      </el-table-column>

      <el-table-column width="100" label="最近修改">
        <template slot-scope="scope">
          {{ scope.row.updatedAt | formatDate("YYYY-MM-DD") }}
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-algin">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pages.pageindex"
        :page-sizes="[PAGE_SIZE, 30, 50, 100, 200]"
        :page-size="pages.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </section>
</template>

<script>
import { getErrorResPageList } from "@api/main";
import { PAGE_SIZE } from "@config";

export default {
  components: {},
  data() {
    return {
      loading: true,
      params: {},
      PAGE_SIZE,
      pages: {
        pageindex: 1,
        pagesize: PAGE_SIZE,
      },
      total: 2000,
      list: [],

      categoryList: {
        0: "单选",
        1: "多选",
        2: "判断",
      },
    };
  },

  methods: {
    /**
     * 获取列表
     */
    async queryList() {
      this.loading = true;

      const { data: resData } = await getErrorResPageList(
        this.params,
        this.pages
      );
      if (!resData.data.status) return;

      this.loading = false;

      this.list = resData.data.data;
      // this.total = resData.data.data.count;
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
        name: type == "edit" ? "MEMBER_EDIT" : "MEMBER_DETAILS",
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
