<style lang="scss" scope>
.public-edit {
  &-form {
    width: 100%;
    .el-form-item {
      width: 440px;
      &.percentage {
        width: 90%;
      }
    }
  }
  .options {
    &-item {
      width: 650px;
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .el-input {
        width: 400px;
      }
      .el-checkbox {
        margin: 0 30px 0 20px;
      }
      .el-radio {
        margin: 0 30px 0 20px;
      }
      .sort {
        font-size: 14px;
        color: #606266;
        width: 100px;
        text-align: right;
        padding-right: 12px;
        box-sizing: border-box;
      }
    }
  }
}
</style>
<template>
  <section class="public-edit public-body">
    <div class="public-edit-title">发送站内信</div>
    <div class="public-edit-form">
      <el-form :model="params" ref="ruleForm" label-width="100px">
        <el-form-item label="标题" required>
          <el-input placeholder="请输入标题" v-model="params.sendTitle">
          </el-input>
        </el-form-item>

        <el-form-item label="用户类型" required>
          <el-select
            style="width: 340px"
            v-model="category"
            placeholder="请选择用户类型"
            multiple
          >
            <el-option
              v-for="(item, index) in categoryList"
              :key="index"
              :label="item.categoryname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="percentage" label="内容" required>
          <tinymce-editor
            height="400px"
            ref="editor"
            v-model="params.sendContent"
          />
        </el-form-item>

        <el-form-item>
          <el-button :loading="loading" type="primary" @click="handleSubmit"
            >提 交</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>

<script>
import { getMemberCategory } from "@api/member";
import { sendNoticeToUserCategory } from "@api/message";
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
     * 获取类型列表
     */
    async queryCategory() {
      const { data: resData } = await getMemberCategory();
      if (!resData.data.status) return;

      this.categoryList = resData.data.dataList;
    },

    /**
     * 提交修改
     */
    handleSubmit() {
      const selectCategory = [];

      if (!this.params.sendTitle) return this.$message.error("请填写标题");

      if (this.category <= 0) return this.$message.error("请填写用户分类");

      if (!this.params.sendContent) return this.$message.error("请填写内容");

      this.categoryList.map((item) => {
        if (this.category.indexOf(item.id) > -1)
          selectCategory.push(item.categoryname);
      });
      this.params.category = this.category.join(",");
      this.params.categorynames = selectCategory.join(",");

      this.$confirm("是否发送？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.loading = true;

          const { data: resData } = await sendNoticeToUserCategory(this.params);
          if (!resData.data.status) return;

          this.$router.go(-1);
          this.$message.success("通知公告发送成功！");

          this.loading = false;
        })
        .catch(() => {});
    },

    /**
     * 发送方法切换
     */
    handleRadioChange() {
      this.params.sendcontent = "";
    },
  },

  async created() {
    await this.queryCategory();
  },
};
</script>
