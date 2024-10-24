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

        <el-form-item
          class="percentage proportion"
          label="通过比例"
          prop="qualifiedproportion"
        >
          <el-input-number
            v-model="params.qualifiedproportion"
            :min="0.1"
            :max="1"
            :step="0.1"
            placeholder="通过比例"
          ></el-input-number>
          <span class="proportion-annotation">注：为0.9时，通过率为90%</span>
        </el-form-item>

        <el-form-item label="重复测试" prop="isrepeattest">
          <el-radio-group v-model="params.isrepeattest">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item class="percentage proportion" label="答题数量">
          <el-input
            type="number"
            v-model="params.randomcount"
            placeholder="请输入答题数量"
            style="width: 400px"
            maxlength="10"
          ></el-input>
          <span class="proportion-annotation"
            >注：为0时，所有题都会展示；设置对应值后，会随机出现对应值的题数</span
          >
        </el-form-item>

        <el-form-item class="percentage proportion" label="答题时间">
          <el-input
            v-model="params.timelimit"
            type="number"
            placeholder="请输入答题时间"
            style="width: 400px"
            maxlength="10"
          ></el-input>
          <span class="proportion-annotation"
            >注：单位分钟；为0时，默认为15分钟</span
          >
        </el-form-item>

        <el-form-item label="排序">
          <el-input
            v-model="params.sort"
            type="number"
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
import { getExamInfo, addExam, updateExam } from "@api/exam";

export default {
  components: {},
  data() {
    return {
      params: {
        isrepeattest: 1,
        qualifiedproportion: 0.9,
        randomcount: 0,
        timelimit: 0,
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
     * 获取详情
     */
    async queryInfo() {
      const { data: resData } = await getExamInfo(this.params.id);
      if (!resData.data.status) return;

      this.params = resData.data.data;
    },

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
              const { data: resData } = await updateExam(this.params);
              if (!resData.data.status) return;

              this.$router.go(-1);
              this.$message.success("修改成功");
            } else {
              const { data: resData } = await addExam(this.params);
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
      this.queryInfo();
    }
  },
};
</script>
