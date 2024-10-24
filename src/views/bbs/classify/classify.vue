<style lang="scss" scope>
.classify {
  .color {
    height: 15px;
    width: 25px;
    border-radius: 4px;
    display: inline-block;
  }
  .secces {
    color: #33dda1;
  }
}
</style>

<template>
  <section class="classify public-body">
    <el-form class="public-search-form" ref="form" label-width="80px">
      <div class="content"></div>

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
      <el-table-column align="center" prop="id" label="ID">
      </el-table-column>

      <el-table-column align="center" prop="name" label="名称">
      </el-table-column>

      <el-table-column align="center" prop="sort" label="排序">
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span :class="{ secces: scope.row.status == 1 }">{{
            scope.row.status ? "启用" : "禁用"
          }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.createdAt | formatDate }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="修改时间">
        <template slot-scope="scope">
          {{ scope.row.updatedAt | formatDate }}
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
import { getBbsCategory, deleteBbsCategory } from "@api/bbs";
import { PAGE_SIZE } from "@config";

export default {
  components: {},
  data() {
    return {
      list: [],
      loading: true,
    };
  },

  methods: {
    /**
     * 获取列表
     */
    async queryList() {
      this.loading = true;

      const { data: resData } = await getBbsCategory();
      if (!resData.data.status) return;

      this.loading = false;

      this.list = resData.data.data;
    },

    /**
     * 删除类型
     */
    async handleDelete(row) {
     this.$message.warning('需要删除时，请联系程序员！');
      // this.$confirm("是否删除当前类型？", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "error",
      // })
      //   .then(async () => {
      //     const { data: resData } = await deleteBbsCategory(row.id);
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
        name: "BBS_CLASSIFY_EDIT",
        query: {
          id: row.id,
          name: row.name,
          sort: row.sort,
          status: row.status,
        },
      });
    },
  },

  created() {
    this.queryList();
  },
};
</script>
