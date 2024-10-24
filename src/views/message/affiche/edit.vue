<style lang="scss" scope></style>
<template>
  <section>
    <div class="member-details-wp" style="margin-bottom: 80px">
      <div class="member-edit-title">发布公告</div>
      <el-form
        :model="params"
        ref="ruleForm"
        label-width="80px"
        v-loading="loading"
      >
        <el-form-item label="标题" required>
          <el-input placeholder="请输入标题" v-model="params.title"> </el-input>
        </el-form-item>

        <el-form-item class="percentage" label="内容" required>
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入内容"
            maxlength="500"
            v-model="params.content"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="排序" required>
          <el-input placeholder="请输入排序" v-model="params.sort"> </el-input>
        </el-form-item>

        <el-form-item label="结束时间" required>
          <el-date-picker
            style="width: 100%"
            v-model="params.enddate"
            type="datetime"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>

    <div class="member-edit-footer" v-if="!loading">
      <el-button @click="$router.go(-1)">取 消</el-button>
      <el-button type="primary" @click="handleSubmit('ruleForm')">
        提 交</el-button
      >
    </div>
  </section>
</template>

<script>
import { getMemberCategory } from "@api/member";
import {
  addContentNotice,
  getContentNoticeByid,
  editContentNotice,
} from "@api/message";
import TinymceEditor from "@comp/TinymceEditor";

export default {
  components: { TinymceEditor },
  data() {
    return {
      params: {},

      loading: false,

      categoryList: [],

      category: [],
    };
  },
  methods: {
    /**
     * 获取详情
     */
    async queryInfo() {
      const { data: resData } = await getContentNoticeByid(this.params.id);

      if (!resData.data.status) return;

      this.params = resData.data.data;
    },

    /**
     * 提交修改
     */
    handleSubmit() {
      if (!this.params.title) return this.$message.error("请填写标题");

      if (!this.params.content) return this.$message.error("请填写内容");

      this.$confirm("是否发布？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.loading = true;

          if (this.params.id) {
            const { data: resData } = await editContentNotice(this.params);
            if (!resData.data.status) return;

            this.$router.go(-1);
            this.$message.success("修改成功！");

            this.loading = false;
          } else {
            const { data: resData } = await addContentNotice(this.params);
            if (!resData.data.status) return;

            this.$router.go(-1);
            this.$message.success("发布成功！");

            this.loading = false;
          }
        })
        .catch(() => {});
    },
  },

  async created() {
    if (this.$route.query.id) {
      this.params.id = this.$route.query.id;
      this.queryInfo();
    }
  },
};
</script>
