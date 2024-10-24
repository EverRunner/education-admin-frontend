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
}
</style>

<template>
  <section class="public-wp">
    <TabsNav :list="tabsNavList" />

    <div class="public-search">
      <el-form
        class="public-search-form"
        ref="form"
        :model="params"
        label-width="80px"
      >
        <div class="content">
          <el-form-item label="用户类型">
            <el-select v-model="params.category" placeholder="请选择用户类型">
              <el-option
                v-for="(item, index) in categoryList"
                :key="index"
                :label="item.categoryname"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发送日期">
            <el-date-picker
              v-model="sendDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="handleDateChange"
            >
            </el-date-picker>
          </el-form-item>
        </div>

        <el-form-item>
          <el-button @click="handleSearch" icon="el-icon-search" type="primary"
            >搜索</el-button
          >
          <el-button
            icon="el-icon-plus"
            @click="handleGoTo({}, 'add')"
            type="warning"
            >发送邮箱</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="list" v-loading="loading" class="publi-table">
      <el-table-column align="center" type="index" label="序号">
      </el-table-column>

      <el-table-column
        align="center"
        prop="membercategorynames"
        label="用户分类"
      >
      </el-table-column>

      <el-table-column align="center" prop="title" label="邮件标题">
      </el-table-column>

      <!-- <el-table-column align="center" label="发送内容">
        <template slot-scope="scope">
          <div v-html="scope.row.content"></div>
        </template>
      </el-table-column> -->

      <el-table-column align="center" label="发送方式">
        <template slot-scope="scope">
          {{ scope.row.pushtype == 1 ? "邮件" : "短信" }}
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="remark"
        label="备注"
      ></el-table-column>

      <el-table-column align="center" label="发送日期">
        <template slot-scope="scope">
          {{ scope.row.createdAt | formatDate }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="info"
            @click="handleGoTo(scope.row, 'details')"
            >详情</el-button
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
import { getMemberCategory } from "@api/member";
import { getNoticeList } from "@api/user";
import { PAGE_SIZE, MESSAGE_TABS_NAV_LIST } from "@config";
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
      sendDate: "",
      categoryList: [],
    };
  },

  methods: {
    /**
     * 获取列表
     */
    async queryList() {
      this.loading = true;

      const { data: resData } = await getNoticeList(this.params, this.pages);
      if (!resData.data.status) return;

      this.loading = false;

      this.list = resData.data.data.rows;
      this.total = resData.data.data.count;
    },

    /**
     * 获取类型列表
     */
    async queryCategory() {
      const { data: resData } = await getMemberCategory();
      if (!resData.data.status) return;

      this.categoryList = resData.data.dataList;
    },

    /**
     * 处理搜索
     */
    handleSearch(row, type) {
      this.pages.pageindex = 1;
      this.queryList();
    },

    /**
     * 选拔日期
     */
    handleDateChange(data) {
      if (data) {
        this.params.startdate = data[0];
        this.params.enddate = data[1];
      } else {
        this.params.startdate = "";
        this.params.enddate = "";
      }
    },

    /**
     * 处理跳转
     */
    handleGoTo(row, type) {
      this.$router.push({
        name:
          type == "details"
            ? "MESSAGE_NOTICE_INOF_LIST"
            : "MESSAGE_NOTICE_EDIT",
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
    this.queryCategory();
  },
};
</script>
