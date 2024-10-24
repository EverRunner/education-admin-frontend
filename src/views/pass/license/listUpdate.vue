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
        <el-form-item label="关键词">
          <el-input
            v-model="params.wrord"
            placeholder="姓名/手机号/邮件"
          ></el-input>
        </el-form-item>
        <el-form-item label="申请状态">
          <el-select
            v-model="params.step"
            placeholder="请选择申请状态"
            clearable
          >
            <el-option
              v-for="(name, key) in LICENSE_STEP"
              :key="key"
              :label="name"
              :value="key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="当前进度">
          <el-select
            v-model="params.step"
            placeholder="请选择当前进度"
            clearable
          >
            <el-option
              v-for="(name, key) in LICENSE_STATUS"
              :key="key"
              :label="name"
              :value="key"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>

      <el-form-item>
        <el-button @click="handleSearch" icon="el-icon-search" type="primary"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>

    <el-table :data="list" v-loading="loading" class="publi-table">
      <el-table-column align="center" type="index" label="序号">
      </el-table-column>

      <el-table-column align="center" prop="username" label="姓名">
      </el-table-column>

      <el-table-column align="center" prop="phone" label="手机号">
        <template slot-scope="scope">
          {{ scope.row.phone || "-" }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="email" label="邮箱">
        <template slot-scope="scope">
          {{ scope.row.email || "-" }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="title" label="支付方式">
        <template slot-scope="scope">
          {{
            scope.row.paytype
              ? scope.row.paytype == 1
                ? "微信"
                : "银行卡"
              : "-"
          }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="title" label="当前进度">
        <template slot-scope="scope">
          {{ LICENSE_STEP[scope.row.step] }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="title" label="申请状态">
        <template slot-scope="scope">
          {{ scope.row.paytype ? LICENSE_STATUS[scope.row.status] : "-" }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="申请时间">
        <template slot-scope="scope">
          {{ scope.row.createdAt | formatDate }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="更新时间">
        <template slot-scope="scope">
          {{ scope.row.updatedAt | formatDate }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="handleGoTo(scope.row)">详情</el-button>
          <el-button
            v-if="scope.row.step == 4"
            type="text"
            @click="handleShowFormVisible(scope.row)"
            >更改状态</el-button
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

    <el-dialog title="更新状态" :visible.sync="dialogFormVisible" width="400px">
      <el-form>
        <el-form-item label="状态">
          <el-select
            v-model="updateParams.status"
            placeholder="请选择申请状态"
            clearable
            style="width:300px"
          >
            <el-option
              v-show="key != 1"
              v-for="(name, key) in LICENSE_STATUS"
              :key="key"
              :label="key == 0 ? '重新填写' : name"
              :value="key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
            v-model="updateParams.defaitcontent"
            style="width:300px"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleupdateStatus">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { getLicenseList, updateLicenseaStatus } from "@api/user";
import { PAGE_SIZE, FILE_ROOT, LICENSE_STEP, LICENSE_STATUS } from "@config";

export default {
  components: {},
  data() {
    return {
      loading: true,
      params: {},
      pages: {
        pageindex: 1,
        pagesize: PAGE_SIZE,
        type: 1,
      },
      total: 0,
      list: [],
      categoryList: [],
      FILE_ROOT,
      LICENSE_STEP,
      LICENSE_STATUS,
      dialogFormVisible: false,

      nowRow: {},
      updateParams: {
        defaitcontent: "",
        status: null,
      },
    };
  },

  methods: {
    /**
     * 获取列表
     */
    async queryList() {
      this.loading = true;

      const { data: resData } = await getLicenseList(this.params, this.pages);
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
    handleGoTo(row) {
      this.$router.push({
        name: "PASS_LICENSE_DETAILS",
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

    /**
     * 显示更新状态
     */
    handleShowFormVisible(row) {
      this.dialogFormVisible = true;
      this.updateParams.applyid = row.id;
    },

    /**
     * 接口-更新状态
     */
    handleupdateStatus() {
      this.$confirm("是否当更新当前状态？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(async () => {
          const { data: resData } = await updateLicenseaStatus(
            this.updateParams
          );
          if (!resData.data.status) return;

          this.$message.success("更新成功");
          this.queryList();
          this.dialogFormVisible = false;
        })
        .catch(() => {});
    },
  },

  async created() {
    this.queryList();
  },
};
</script>
