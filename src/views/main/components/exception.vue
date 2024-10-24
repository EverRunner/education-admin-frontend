<style lang="scss" scope></style>

<template>
  <section>
    <!-- <el-form
      class="public-search-form"
      ref="form"
      :model="params"
      label-width="80px"
    >
      <div class="content">
        <el-form-item label="关键字">
          <el-input
            v-model="params.username"
            placeholder="请输入姓名/手机/邮箱/分享码"
            size="small"
            clearable
          ></el-input>
        </el-form-item>
 
        <el-form-item label="用户类型">
          <el-select
            size="small"
            v-model="params.category"
            placeholder="请选择用户类型"
            clearable
          >
            <el-option
              v-for="(item, index) in categoryList"
              :key="index"
              :label="item.categoryname"
              :value="item.id"
              v-show="item.id > 1"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学完课程">
          <el-select
            size="small"
            v-model="params.progresscourseid"
            placeholder="请选择课程"
            clearable
          >
            <el-option
              v-for="(item, index) in courseList"
              :key="index"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="到期时间">
          <el-date-picker
            v-model="dateTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="left"
            size="small"
            style="width: 260px"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
          >
          </el-date-picker>
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
    </el-form> -->

    <el-table
      :data="list"
      v-loading="loading"
      class="publi-table"
      size="medium"
      @cell-click="handleCellClick"
    >
      <el-table-column width="120" prop="username" label="姓名">
        <template slot-scope="scope">
          <div class="table-column" style="text-align: left;">
            {{ scope.row.yibei_member && scope.row.yibei_member.username }}
          </div>
        </template>
      </el-table-column>

      <el-table-column width="110" label="手机">
        <template slot-scope="scope">
          {{ scope.row.yibei_member && scope.row.yibei_member.phone }}
        </template>
      </el-table-column>

      <el-table-column width="150" label="邮箱">
        <template slot-scope="scope">
          {{ scope.row.yibei_member && scope.row.yibei_member.email }}
        </template>
      </el-table-column>

      <el-table-column width="120" prop="ipaddress" label="ip地址">
      </el-table-column>

      <el-table-column prop="logincity" label="登录城市"> </el-table-column>

      <el-table-column width="100" prop="lng" label="经度"> </el-table-column>

      <el-table-column width="100" prop="lat" label="纬度"> </el-table-column>

      <el-table-column prop="address" label="定位地址"> </el-table-column>

      <el-table-column width="80" prop="address" label="距离上次">
        <template slot-scope="scope">
          {{ scope.row.distanceyl || 0 }}mi
        </template>
      </el-table-column>

      <el-table-column width="80" prop="devicecate" label="登录设备">
        <template slot-scope="scope">
          {{ category[scope.row.devicecate] }}
        </template>
      </el-table-column>

      <el-table-column width="150" prop="enddate" label="登录时间">
        <template slot-scope="scope">
          {{ scope.row.createdAt | formatDate }}
        </template>
      </el-table-column>

      <el-table-column width="100" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)"
            >移出</el-button
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
import { getMemberLoginWornList, removeMemberException } from "@api/user";
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

      category: {
        1: "电脑",
        2: "手机",
        3: "平板",
      },
    };
  },

  methods: {
    /**
     * 获取列表
     */
    async queryList() {
      this.loading = true;

      const { data: resData } = await getMemberLoginWornList(
        this.params,
        this.pages
      );
      if (!resData.data.status) return;

      this.loading = false;

      this.total = resData.data.data.count;
      this.list = resData.data.data.rows.map((item) => {
        // 截取定位地址
        if (item.address) {
          const index = item.address.indexOf(" ");
          item.address = item.address.slice(index);
        }
        return item;
      });
    },

    /**
     * 处理单元格点击
     */
    handleCellClick(row, column, cell, event) {
      if (column.property == "username") this.handleGoTo(row, "details");
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
          id: row.memberid,
        },
      });
    },

    /**
     * 删除用户
     */
    async handleDelete(row) {
      this.$confirm("是否移出列表？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      })
        .then(async () => {
          const { data: resData } = await removeMemberException(row.id);
          if (!resData.data.status) return;

          this.$message.success("移出成功");
          this.queryList();
        })
        .catch(() => {});
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
  },
};
</script>
