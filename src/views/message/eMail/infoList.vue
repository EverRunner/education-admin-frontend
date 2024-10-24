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

  .succeed {
    color: #00d489;
  }
  .fall {
    color: #fa5376;
  }
}
</style>

<template>
  <section class="home public-body">
    <el-table :data="list" v-loading="loading" class="publi-table">
      <el-table-column align="center" type="index" label="序号">
      </el-table-column>

      <el-table-column align="center" label="用户名">
        <template slot-scope="scope">
          {{ scope.row.yibei_member && scope.row.yibei_member.username }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="account" label="帐号">
      </el-table-column>

      <el-table-column align="center" prop="title" label="标题">
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

      <el-table-column align="center" label="发送状态">
        <template slot-scope="scope">
          <span class="succeed" v-if="scope.row.status == 1">
            发送成功
          </span>
          <span class="fall" v-else>
            发送失败
          </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="发送日期">
        <template slot-scope="scope">
          {{ scope.row.createdAt | formatDate }}
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
import { getNoticeInfoList } from "@api/user";
import { PAGE_SIZE } from "@config";

export default {
  components: {},
  data() {
    return {
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

      const { data: resData } = await getNoticeInfoList(
        this.params,
        this.pages
      );
      if (!resData.data.status) return;

      this.loading = false;

      this.list = resData.data.data;
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
        name: type == "edit" ? "MESSAGE_NOTICE_EDIT" : "MESSAGE_NOTICE_EDIT",
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
    if (this.$route.query.id) this.params.pushid = this.$route.query.id;
    this.queryList();
  },
};
</script>
