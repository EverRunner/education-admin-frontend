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
  <section class="home public-body">
    <TabsNav :list="tabsNavList" />

    <ul class="public-search" style="padding-top:0">
      <li class="public-search-left">
        <el-button
          type="primary"
          @click="handleGoTo({}, 'edit')"
          icon="el-icon-plus"
          >添加更新</el-button
        >
        <el-select
          v-model="params.platform"
          placeholder="请选择系统类型"
          style="margin-left:10px"
        >
          <el-option
            v-for="(val, key) in APP_STYSY_TYPE"
            :key="key"
            :label="val"
            :value="key"
          ></el-option>
        </el-select>
      </li>
      <li class="public-search-right">
        <el-input placeholder="版本号" v-model="params.version"></el-input>
        <el-button type="warning" @click="handleSearch">搜索</el-button>
      </li>
    </ul>

    <el-table :data="list" v-loading="loading" class="publi-table">
      <el-table-column align="center" prop="appid" label="APP类型">
        <template slot-scope="scope">
          {{ APP_TYPE[scope.row.appid] }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="version" label="版本号">
      </el-table-column>

      <el-table-column align="center" prop="platform" label="系统平台">
        <template slot-scope="scope">
          {{ APP_STYSY_TYPE[scope.row.platform] }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="description" label="更新内容">
        <template slot-scope="scope">
          <div style="white-space: pre-line;">
            {{ scope.row.description }}
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="强制更新">
        <template slot-scope="scope">
          {{ scope.row.isforceupdate == 1 ? "是" : "否" }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建日期">
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
import { getAppUpdateList } from "@api/message";
import {
  PAGE_SIZE,
  APP_STYSY_TYPE,
  APP_TYPE,
  MESSAGE_TABS_NAV_LIST,
} from "@config";
import TabsNav from "@comp/TabsNav";

export default {
  components: { TabsNav },

  data() {
    return {
      APP_STYSY_TYPE,
      APP_TYPE,

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
    };
  },

  methods: {
    /**
     * 获取列表
     */
    async queryList() {
      this.loading = true;

      const { data: resData } = await getAppUpdateList(this.params, this.pages);
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
    handleGoTo(row) {
      this.$router.push({
        name: "MESSAGE_APP_UPDATE_EDIT",
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
