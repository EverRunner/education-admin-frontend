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
    <div class="public-edit-title">
      APP更新{{ params.id ? "编辑" : "增加" }}
    </div>
    <div class="public-edit-form">
      <el-form :model="params" ref="ruleForm" label-width="100px">
        <el-form-item label="APP类型" required>
          <el-select
            style="width: 340px"
            v-model="params.appid"
            placeholder="请选择类型"
          >
            <el-option
              v-for="(val, key) in APP_TYPE"
              :key="key"
              :label="val"
              :value="key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="系统平台" required>
          <el-select
            style="width: 340px"
            v-model="params.platform"
            placeholder="请选择系统平台"
          >
            <el-option
              v-for="(val, key) in APP_STYSY_TYPE"
              :key="key"
              :label="val"
              :value="key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="版本号" required>
          <el-input
            placeholder="请输入版本号"
            maxlength="500"
            v-model="params.version"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="强制更新" required>
          <el-radio-group v-model="params.isforceupdate">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="更新内容" required>
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输更新内容"
            maxlength="200"
            v-model="params.description"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="下载地址" required>
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输下载地址"
            maxlength="200"
            v-model="params.downloadurl"
          >
          </el-input>
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
import { editUpdate, addUpdate, getUpdateInfo } from "@api/message";
import { APP_TYPE, APP_STYSY_TYPE } from "@config";

export default {
  components: {},
  data() {
    return {
      APP_TYPE,
      APP_STYSY_TYPE,
      params: {
        isforceupdate: 1,
        appid: null,
        version: null,
        description: null,
        platform: null,
        downloadurl: null,
      },

      loading: false,

      categoryList: [],

      category: [],
    };
  },
  methods: {
    /**
     * 提交修改
     */
    handleSubmit() {
      if (!this.params.appid) return this.$message.error("请填写APP类型");
      if (!this.params.version) return this.$message.error("请填写版本号");
      if (!this.params.description)
        return this.$message.error("请填写更新内容");
      if (!this.params.platform) return this.$message.error("请选择系统平台");
      if (!this.params.downloadurl)
        return this.$message.error("请填写下载链接");

      this.$confirm("是否保存？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.loading = true;

          if (this.params.id) {
            await this.handleEditUpdate();
            this.loading = false;
          } else {
            await this.handleAddUpdate();
            this.loading = false;
          }
        })
        .catch(() => {});
    },

    /**
     * 添加
     */
    async handleAddUpdate() {
      const { data: resData } = await addUpdate(this.params);
      if (!resData.data.status) return;

      this.$router.go(-1);
      this.$message.success("保存成功");
    },

    /**
     * 编辑
     */
    async handleEditUpdate() {
      const { data: resData } = await editUpdate(this.params);
      if (!resData.data.status) return;

      this.$router.go(-1);
      this.$message.success("保存成功");
    },

    /**
     * 获取详情
     */
    async queryInfo() {
      const { data: resData } = await getUpdateInfo(this.params.id);

      if (!resData.data.status) return;

      this.params = resData.data.data;
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
