<style lang="scss" scope>
.home {
  .scope {
    display: flex;
    align-items: center;
    justify-content: center;
    i {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin-right: 8px;
    }
  }
  .tart-content {
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    cursor: pointer;
  }
  .secces {
    color: #33dda1;
  }
}
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
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
        <el-form-item label="帖子类型">
          <el-select
            size="small"
            v-model="params.category"
            placeholder="请选择帖子类型"
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
        <el-form-item label="帖子内容">
          <el-input
            v-model="params.content"
            placeholder="请输入帖子内容"
            size="small"
            clearable
          ></el-input>
        </el-form-item>
      </div>

      <el-form-item>
        <el-button
          size="small"
          @click="handleSearch"
          icon="el-icon-search"
          type="primary"
          >搜索</el-button
        >
        <el-button
          icon="el-icon-plus"
          @click="handleGoTo({}, 'edit')"
          type="warning"
          size="small"
          >增加</el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      :row-class-name="tableRowClassName"
      :data="list"
      v-loading="loading"
      class="publi-table"
      size="medium"
      @cell-click="handleCellClick"
      @sort-change="handleTableSort"
    >
      <el-table-column align="center" type="index" label="序号">
      </el-table-column>

      <el-table-column align="center" prop="username" label="姓名">
        <template slot-scope="scope">
          {{ scope.row.yibei_member && scope.row.yibei_member.username }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="email" label="邮箱">
        <template slot-scope="scope">
          {{ scope.row.yibei_member && scope.row.yibei_member.email }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="phone" label="电话">
        <template slot-scope="scope">
          {{ scope.row.yibei_member && scope.row.yibei_member.phone }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="phone" label="类型">
        <template slot-scope="scope">
          {{
            scope.row.yibei_bbs_category && scope.row.yibei_bbs_category.name
          }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="phone" label="内容">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            title="帖子内容"
            width="200"
            trigger="hover"
            :content="scope.row.content"
          >
            <div class="tart-content" slot="reference">
              {{ scope.row.content }}
            </div>
          </el-popover>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" prop="phone" label="状态">
        <template slot-scope="scope">
          <span :class="{ secces: scope.row.status == 1 }">
            {{ scope.row.status == 1 ? "启用" : "禁用" }}
          </span>
        </template>
      </el-table-column> -->

      <el-table-column align="center" label="发布时间">
        <template slot-scope="scope">
          {{ scope.row.createdAt | formatDate }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            type="info"
            @click="handleGoTo(scope.row, 'details')"
            >详情</el-button
          > -->
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)"
            >删除</el-button
          >
          <el-button
            size="mini"
            type="success"
            @click="handleGoTo(scope.row, 'edit')"
            >编辑</el-button
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
import { getBbsTartList, getBbsCategory, delBbsTar } from "@api/bbs";
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
      total: 0,
      list: [],
      categoryList: [],
    };
  },

  methods: {
    /**
     * 获取列表
     */
    async queryList() {
      this.loading = true;

      const { data: resData } = await getBbsTartList(this.params, this.pages);
      if (!resData.data.status) return;

      this.loading = false;

      this.total = resData.data.data.count;
      this.list = resData.data.data.rows;
    },

    /**
     * 获取类型列表
     */
    async queryCategory() {
      const { data: resData } = await getBbsCategory();
      if (!resData.data.status) return;

      this.categoryList = resData.data.data;
    },

    /**
     * 删除帖子
     */
    async handleDelete(row) {
      this.$confirm("是否删除当前帖子？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      })
        .then(async () => {
          const { data: resData } = await delBbsTar(row.id);
          if (!resData.data.status) return;

          this.$message.success("删除成功");
          this.queryList();
        })
        .catch(() => {});
    },

    /**
     * 处理单元格点击
     */
    handleCellClick(row, column, cell, event) {
      // if (column.property == "username") this.handleGoTo(row, "details");
    },

    /**
     * 处理表格排序
     */
    handleTableSort({ column, prop, order }) {
      // if (order == "ascending") {
      //   this.params.ordertype = 0;
      // } else {
      //   this.params.ordertype = 1;
      // }
      // this.params.ordername = prop;
      // this.queryList();
    },

    /**
     * 表格颜色
     */
    tableRowClassName({ row, rowIndex }) {
      // if (rowIndex === 1) {
      //   return "warning-row";
      // } else if (rowIndex === 3) {
      //   return "success-row";
      // }
      // return "";
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
        name: "BBS_EDIT",
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

  async created() {
    this.queryList();
    this.queryCategory();
  },
};
</script>
