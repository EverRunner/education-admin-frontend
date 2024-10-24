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
    <TabsNav :list="tabsNavList" />

    <ul class="public-search">
      <li class="public-search-left">
        <el-select
          v-model="params.type"
          placeholder="订单内容"
          style="width: 110px;"
          clearable
        >
          <el-option label="执照申请" :value="0"></el-option>
          <el-option label="执照更新" :value="1"></el-option>
        </el-select>
        <!-- <el-select
          v-model="params.status"
          placeholder="支付状态"
          style="width: 110px;margin-left: 10px;"
          clearable
        >
          <el-option
            v-for="(item, index) in statusList"
            :key="index"
            :label="item"
            :value="index"
          ></el-option>
        </el-select> -->
        <el-select
          v-model="params.step"
          placeholder="进度"
          clearable
          style="width: 120px;margin-left: 10px;"
        >
          <el-option
            v-for="(name, key) in LICENSE_STATUS"
            :key="key"
            :label="name"
            :value="key"
          ></el-option>
        </el-select>
      </li>
      <li class="public-search-right">
        <el-input
          placeholder="请输入学员"
          v-model="params.wrord"
          clearable
        ></el-input>
        <el-button type="warning" @click="handleSearch">搜索</el-button>
      </li>
    </ul>

    <el-table :data="list" v-loading="loading" @cell-click="handleCellClick">
      <el-table-column
        align="center"
        prop="username"
        label="购买学员"
        width="120"
      >
        <template slot-scope="scope">
          <div class="table-column">
            {{ scope.row.username || "-" }}
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="phone" label="手机号" width="120">
        <template slot-scope="scope">
          {{ scope.row.phone || "-" }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="phone" label="订单内容" width="100">
        <template slot-scope="scope">
          {{ scope.row.type == 1 ? "执照更新" : "执照申请" }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="email" label="邮箱" width="150">
        <template slot-scope="scope">
          {{ scope.row.email || "-" }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="title" label="支付方式" width="100">
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

      <el-table-column align="center" prop="title" label="当前进度" width="100">
        <template slot-scope="scope">
          {{ LICENSE_STEP[scope.row.step] }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="title" label="申请状态" width="100">
        <template slot-scope="scope">
          <!-- <el-tag
            size="medium"
            :type="scope.row.status == 1 ? 'success' : 'warning'"
            >{{ statusList[scope.row.status] }}</el-tag
          > -->
          {{ scope.row.paytype ? LICENSE_STATUS[scope.row.status] : "-" }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="申请时间" width="160">
        <template slot-scope="scope">
          {{ scope.row.createdAt | formatDate }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="更新时间" width="160">
        <template slot-scope="scope">
          {{ scope.row.updatedAt | formatDate }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleGoTo(scope.row)"
            >申请资料</el-button
          >
          <el-button
            v-if="scope.row.step == 4"
            size="mini"
            @click="handleShowFormVisible(scope.row)"
            >审核结果</el-button
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
            size="mini"
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
        type: 0,
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
          type: "order",
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

    /**
     * 处理单元格点击
     */
    handleCellClick(row, column, cell, event) {
      if (column.property == "username")
        this.$router.push({
          name: "MEMBER_DETAILS",
          query: {
            id: row.memberid,
          },
        });
    },
  },

  async created() {
    this.queryList();
  },
};
</script>
