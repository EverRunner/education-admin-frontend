<style lang="scss" scope>
.public-edit {
  &-form {
    width: 100%;
    .el-form-item {
      width: 500px;
      &.percentage {
        width: 100%;
      }
    }
  }
  .proportion {
    .el-form-item__content {
      display: flex;
      align-items: center;
    }
    &-annotation {
      font-size: 12px;
      color: #999;
      margin-left: 20px;
    }
  }
}
</style>

<template>
  <section class="public-edit public-body">
    <div class="public-edit-title">
      {{ $route.meta.title }}
    </div>
    <div class="public-edit-form">
      <el-form
        :model="params"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="params.title"
            placeholder="请输入标题"
            maxlength="200"
          ></el-input>
        </el-form-item>

        <el-form-item label="排序">
          <el-input
            v-model="params.sort"
            placeholder="请输入排序"
            maxlength="10"
          ></el-input>
        </el-form-item>

        <el-form-item label="简介">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入简介"
            maxlength="200"
            v-model="params.description"
          >
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit('ruleForm')"
            >提 交</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>

<script>
import { addPractice, updatePractice } from "@api/word";

export default {
  components: {},
  data() {
    return {
      params: {
        title:'',
        description:'',
        sort:'',
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "change" }],
        qualifiedproportion: [
          { required: true, message: "请选择通过比例", trigger: "change" },
        ],
        isrepeattest: [
          { required: true, message: "请选择重复测试", trigger: "change" },
        ],
      },
    };
  },
  methods: {


    /**
     * 提交修改
     */
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false;

        this.$confirm("是否保存？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            if (this.params.id) {
              const { data: resData } = await updatePractice(this.params);
              if (!resData.data.status) return;

              this.$router.go(-1);
              this.$message.success("修改成功");
            } else {
              const { data: resData } = await addPractice(this.params);
              if (!resData.data.status) return;

              this.$router.go(-1);
              this.$message.success("添加成功");
            }
          })
          .catch(() => {});
      });
    },
  },

  async created() {
    if (this.$route.query.id) {
      this.params.id = this.$route.query.id;
      this.params.title = this.$route.params.title;
      this.params.description = this.$route.params.description;
      this.params.sort = this.$route.params.sort;
    }
  },
};
</script>
