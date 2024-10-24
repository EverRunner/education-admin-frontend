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
    <el-form
      class="public-search-form"
      ref="form"
      :model="params"
      label-width="80px"
    >
      <div class="content">
        <el-form-item label="用户名">
          <el-input v-model="params.name" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="支付状态">
          <el-select v-model="params.category" placeholder="请选择支付状态">
            <el-option
              v-for="(item, index) in statusList"
              :key="index"
              :label="item"
              :value="index"
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

      <el-table-column align="center" prop="ordercode" label="订单编号">
      </el-table-column>

      <el-table-column align="center" label="用户名">
        <template slot-scope="scope">
          {{ scope.row.yibei_member && scope.row.yibei_member.username }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="分享人">
        <template slot-scope="scope">
          {{
            (scope.row.yibei_member &&
              scope.row.yibei_member.yibei_member_parent &&
              scope.row.yibei_member.yibei_member_parent.username) ||
              "-"
          }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="分享码">
        <template slot-scope="scope">
          {{
            (scope.row.yibei_member &&
              scope.row.yibei_member.yibei_member_parent &&
              scope.row.yibei_member.yibei_member_parent.sharecode) ||
              "-"
          }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="payfee" label="支付金额">
        <template slot-scope="scope">
          ${{ (scope.row.payfee / 100) | formatMoney }}
        </template>
      </el-table-column>
      <!-- 
      <el-table-column align="center" prop="membertype" label="会员类型">
      </el-table-column> -->

      <el-table-column align="center" prop="paychannel" label="支付渠道">
        <template slot-scope="scope">
          {{ payChannel[scope.row.paychannel] }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="payip" label="支付ip">
      </el-table-column>

      <el-table-column align="center" prop="payip" label="ip城市">
      </el-table-column>

      <el-table-column align="center" prop="payipcity" label="定位城市">
      </el-table-column>

      <el-table-column align="center" prop="remark" label="备注">
      </el-table-column>

      <el-table-column align="center" label="支付状态">
        <template slot-scope="scope">
          <span
            :class="[
              'pay-status',
              {
                await: scope.row.status == 0,
                success: scope.row.status == 1,
                fail: scope.row.status == 2,
                refund: scope.row.status == 5,
              },
            ]"
            >{{ statusList[scope.row.status] }}</span
          >
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间" width="180">
        <template slot-scope="scope">
          {{ scope.row.createdAt | formatDate }}
        </template>
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
        stripe: "Stripe 支付",
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
