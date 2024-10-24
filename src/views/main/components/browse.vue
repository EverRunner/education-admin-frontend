<style lang="scss" scope></style>

<template>
  <section>
    <ul class="public-search" style="padding-top: 0;">
      <li class="public-search-left"></li>
      <li class="public-search-right">
        <el-input v-model="params.username" placeholder="学员姓名"></el-input>
        <el-input
          style="margin-left: 10px"
          v-model="params.pageurl"
          placeholder="页面链接"
        ></el-input>
        <el-button type="warning" @click="handleSearch">搜索</el-button>
      </li>
    </ul>

    <el-table :data="list" v-loading="loading" class="publi-table">
      <el-table-column label="学员姓名">
        <template slot-scope="scope">
          <div class="table-column" style="text-align: left;">
            {{ scope.row.yibei_member && scope.row.yibei_member.username }}
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="pagename" label="页面名称"> </el-table-column>

      <el-table-column prop="pageurl" label="页面链接"> </el-table-column>

      <el-table-column prop="entryuurl" label="来源链接"> </el-table-column>

      <el-table-column label="离开链接">
        <template slot-scope="scope">
          <span v-if="scope.row.endurl">
            {{ scope.row.endurl }}
          </span>
          <span class="leave" v-else>离开</span>
        </template>
      </el-table-column>

      <el-table-column prop="pageurl" label="进入时间">
        <template slot-scope="scope">
          {{ scope.row.createdAt | formatDate }}
        </template>
      </el-table-column>

      <el-table-column prop="pageurl" label="离开时间">
        <template slot-scope="scope">
          {{ scope.row.createdAt | formatDate }}
        </template>
      </el-table-column>

      <el-table-column label="停留时间">
        <template slot-scope="scope">
          {{ scope.row.staytime + "s" }}
        </template>
      </el-table-column>

      <el-table-column prop="ipaddress" label="ip"> </el-table-column>

      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.createdAt | formatDate }}
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
import { getPageReviewList } from "@api/main";
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
    };
  },

  methods: {
    /**
     * 获取列表
     */
    async queryList() {
      this.loading = true;

      const { data: resData } = await getPageReviewList(
        this.params,
        this.pages
      );
      if (!resData.data.status) return;

      this.loading = false;

      this.list = resData.data.data.rows;
      this.total = resData.data.data.count;
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
