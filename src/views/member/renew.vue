<style lang="scss" scope>
.home {
}
</style>

<template>
  <section class="home public-body">
    <TabsNav :list="tabsNavList" />

    <ul class="public-search">
      <li class="public-search-left">
        <el-select
          v-model="params.status"
          placeholder="状态"
          style="width: 100px;"
          clearable
        >
          <el-option
            v-for="(val, index) in statusList"
            :key="index"
            :label="val"
            :value="index"
          ></el-option>
        </el-select>
      </li>
      <li class="public-search-right">
        <el-input
          placeholder="请输入学员"
          clearable
          v-model="params.wrord"
        ></el-input>
        <el-button type="warning" @click="handleSearch">搜索</el-button>
      </li>
    </ul>

    <el-table @cell-click="handleCellClick" :data="list" v-loading="loading">
      <el-table-column align="center" prop="username" label="申请学员">
        <template slot-scope="scope">
          <div class="table-column">
            {{
              (scope.row.yibei_member && scope.row.yibei_member.username) || "-"
            }}
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="预约考试证明">
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.idcardimg"
            style="height: 100px"
            :src="formatImg(scope.row.idcardimg)"
            :preview-src-list="[formatImg(scope.row.idcardimg)]"
          >
          </el-image>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 0">申请中</el-tag>
          <el-tag v-else-if="scope.row.status == 1" type="success">通过</el-tag>
          <el-tag v-else type="danger">拒绝</el-tag>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" prop="msg" label="备注">
      </el-table-column> -->

      <el-table-column align="center" label="申请时间">
        <template slot-scope="scope">
          {{ scope.row.createdAt | formatDate }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status == 0"
            size="mini"
            @click="handleShowAudit(scope.row)"
            >审核</el-button
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

    <el-dialog title="审核" :visible.sync="dialogFormVisible" width="400px">
      <el-form>
        <el-form-item label="状态">
          <el-select
            v-model="auditParams.status"
            placeholder="请选择申请状态"
            clearable
            size="mini"
            style="width:300px"
          >
            <el-option
              v-show="key != 0"
              v-for="(val, key) in statusList"
              :key="key"
              :label="val"
              :value="key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
            v-model="auditParams.msg"
            style="width:300px"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAudit">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { getRenewList, auditRenew } from "@api/user";
import { PAGE_SIZE } from "@config";
import { formatImg } from "@utils/tools";
import TabsNav from "@comp/TabsNav";

export default {
  components: { TabsNav },
  data() {
    return {
      tabsNavList: [
        { name: "营收概况", path: "/order/revenueStatis" },
        { name: "课程订单", path: "/order/list" },
        { name: "考过生服务订单", path: "/pass/license" },
        { name: "续费申请", path: "/member/renew" },
      ],

      loading: true,
      params: {},
      pages: {
        pageindex: 1,
        pagesize: PAGE_SIZE,
      },
      auditParams: {},
      total: 0,
      list: [],

      dialogFormVisible: false,
      nowData: {},
      statusList: {
        0: "申请中",
        1: "通过",
        2: "拒绝",
      },
    };
  },

  methods: {
    formatImg,

    /**
     * 获取列表
     */
    async queryList() {
      this.loading = true;

      const { data: resData } = await getRenewList(this.params);
      if (!resData.data.status) return;

      this.loading = false;

      this.list = resData.data.data.rows;
    },

    /**
     * 当前选中的行
     */
    handleShowAudit(row) {
      this.nowData = row;
      this.dialogFormVisible = true;
    },

    /**
     * 接口-审核
     */
    handleAudit() {
      this.$confirm("是否提交审核？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(async () => {
          if (this.auditParams.status == 2 && !this.auditParams.msg)
            return this.$message.error("拒绝时，备注内容必须填写！");

          const { data: resData } = await auditRenew({
            id: this.nowData.id,
            ...this.auditParams,
          });
          if (!resData.data.status) return;

          this.$message.success("操作成功");
          this.dialogFormVisible = false;
          this.queryList();
          this.auditParams = {};

          this.$forceUpdate();
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
     * 处理单元格点击
     */
    handleCellClick(row, column, cell, event) {
      if (column.property == "username") this.handleGoTo(row, "details");
    },

    /**
     * 处理跳转
     */
    handleGoTo(row, type) {
      this.$router.push({
        name: type == "edit" ? "MEMBER_EDIT" : "MEMBER_DETAILS",
        query: {
          id: row.memberid,
        },
      });
    },

    /**
     * 处理搜索
     */
    handleSearch(row, type) {
      this.pages.pageindex = 1;
      this.queryList();
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
