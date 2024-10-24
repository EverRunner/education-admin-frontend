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
  .pay-status {
    &.await {
      color: #ffa61f;
    }
    &.success {
      color: #33dda1;
    }
    &.fail {
      color: #fa5376;
    }
    &.refund {
      color: #a8aebb;
    }
  }
}
</style>

<template>
  <section class="public-wp">
    <TabsNav :list="tabsNavList" />

    <ul class="public-search">
      <li class="public-search-left">
        <el-select
          v-model="params.category"
          placeholder="订单内容"
          style="width: 110px"
          clearable
        >
          <el-option
            v-for="(item, index) in buyCategory"
            :key="index"
            :label="item"
            :value="index"
          ></el-option>
        </el-select>
        <el-select
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
        </el-select>
      </li>
      <li class="public-search-right">
        <el-input
          placeholder="请输入学员"
          clearable
          v-model="params.username"
        ></el-input>
        <el-button type="warning" @click="handleSearch">搜 索</el-button>
      </li>
    </ul>

    <el-table :data="list" v-loading="loading" @cell-click="handleCellClick">
      <el-table-column
        align="center"
        prop="ordercode"
        label="订单编号"
        width="155"
      >
      </el-table-column>

      <el-table-column
        align="center"
        prop="username"
        label="购买学员"
        width="120"
      >
        <template slot-scope="scope">
          <div class="table-column">
            {{ scope.row.yibei_member && scope.row.yibei_member.username }}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="category"
        label="订单内容"
        width="100"
      >
        <template slot-scope="scope">
          {{ buyCategory[scope.row.category] }}
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="payfee"
        label="订单金额"
        width="100"
      >
        <template slot-scope="scope">
          ${{ (scope.row.payfee / 100) | formatMoney }}
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="paychannel"
        label="支付方式"
        width="100"
      >
        <template slot-scope="scope">
          {{ payChannel[scope.row.paychannel] }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="支付状态" width="100">
        <template slot-scope="scope">
          <el-tag
            size="medium"
            :type="scope.row.status == 1 ? 'success' : 'warning'"
            >{{ statusList[scope.row.status] }}</el-tag
          >
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="payip"
        label="支付ip/城市"
        width="160"
      >
        <template slot-scope="scope">
          {{ scope.row.payip }} / {{ scope.row.payipcity }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="购买时间" width="180">
        <template slot-scope="scope">
          {{ scope.row.createdAt | formatDate }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="推荐人" width="140">
        <template slot-scope="scope">
          {{
            (scope.row.yibei_member &&
              scope.row.yibei_member.yibei_member_parent &&
              scope.row.yibei_member.yibei_member_parent.username) ||
              "-"
          }}
          <p>
            {{
              scope.row.yibei_member &&
              scope.row.yibei_member.yibei_member_parent &&
              scope.row.yibei_member.yibei_member_parent.sharecode
                ? `（${scope.row.yibei_member.yibei_member_parent.sharecode}）`
                : ""
            }}
          </p>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="remark" label="备注">
      </el-table-column>

      <!-- <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="info"
            @click="handleGoTo(scope.row, 'details')"
            >详情</el-button
          >
        </template>
      </el-table-column> -->
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
import { getOrderList } from "@api/order";
import { PAGE_SIZE } from "@config";
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
      total: 0,
      list: [],
      statusList: {
        0: "待支付",
        1: "已支付",
        2: "失败了",
        5: "已退款",
      },

      payChannel: {
        cheque: "支票",
        transferAccounts: "转账",
        stripe: "Stripe",
      },

      buyCategory: {
        0: "新购课",
        1: "续费",
        2: "执照申请",
        3: "执照更新",
      },
    };
  },

  methods: {
    /**
     * 获取列表
     */
    async queryList() {
      this.loading = true;

      const { data: resData } = await getOrderList(this.params, this.pages);
      if (!resData.data.status) return;

      this.loading = false;

      this.list = resData.data.data.rows;
      this.total = resData.data.data.count;
    },

    /**
     * 处理搜索
     */
    handleSearch() {
      this.pages.pageindex = 1;
      this.queryList();
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
