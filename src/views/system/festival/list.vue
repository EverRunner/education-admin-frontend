<style lang="scss" scope></style>

<template>
  <section class="public-wp">
    <TabsNav :list="tabsNavList" />

    <ul class="public-search">
      <li class="public-search-left">
        <el-button
          type="primary"
          @click="handleGoTo({}, 'edit')"
          icon="el-icon-plus"
          >添加节日</el-button
        >
      </li>
      <li class="public-search-right"></li>
    </ul>

    <el-table :data="list" v-loading="loading">
      <el-table-column prop="hlname" label="节日名称"> </el-table-column>

      <el-table-column prop="hldate" label="节日日期">
        <template slot-scope="scope">
          {{ scope.row.hldate | formatDate("YYYY-MM-DD") }}
        </template>
      </el-table-column>

      <el-table-column prop="hlshow_date" label="开始展示">
        <template slot-scope="scope">
          {{ scope.row.hlshow_date | formatDate("YYYY-MM-DD") }}
        </template>
      </el-table-column>

      <el-table-column prop="hlhide_date" label="结束展示">
        <template slot-scope="scope">
          {{ scope.row.hlhide_date | formatDate("YYYY-MM-DD") }}
        </template>
      </el-table-column>

      <el-table-column prop="hlcontent" label="内容">
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.hlcontent"
            style="height: 100px"
            :src="formatImg(scope.row.hlcontent)"
            :preview-src-list="[formatImg(scope.row.hlcontent)]"
          >
          </el-image>
          <span v-else>-</span>
        </template>
      </el-table-column>

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

      <el-table-column label="操作" width="180">
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
            size="mini"
            plain
            type="danger"
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
import { getFestivalList, deleteFestival } from "@api/system";
import { PAGE_SIZE, MESSAGE_TABS_NAV_LIST } from "@config";
import { formatImg } from "@utils/tools";
import TabsNav from "@comp/TabsNav";

export default {
  components: { TabsNav },

  data() {
    return {
      tabsNavList: MESSAGE_TABS_NAV_LIST,

      loading: true,
      params: {},
      pages: {
        pageindex: 1,
        pagesize: PAGE_SIZE,
      },
      total: 0,
      list: [],
      roleList: [],
    };
  },

  methods: {
    formatImg,

    /**
     * 获取列表
     */
    async queryList() {
      this.loading = true;

      const { data: resData } = await getFestivalList();
      if (!resData.data.status) return;

      this.loading = false;

      this.list = resData.data.data.rows;
    },

    /**
     * 删除用户
     */
    async handleDelete(row) {
      this.$confirm("是否删除当前管理员？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      })
        .then(async () => {
          const { data: resData } = await deleteFestival(row.id);
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
        name: "SYSTEM_FESTIVAL_EDIT",
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
