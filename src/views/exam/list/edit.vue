<style lang="scss" scope>
.hint {
  color: #606266;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  margin-top: 4px;
}
</style>

<template>
  <section>
    <div class="member-details-wp" style="margin-bottom: 80px">
      <div class="member-edit-title">测试设置</div>

      <el-form
        :model="params"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="测试名称" prop="title" required>
          <el-input
            v-model="params.title"
            placeholder="请输入测试名称"
            maxlength="200"
          ></el-input>
        </el-form-item>

        <el-form-item label="通过比例" prop="qualifiedproportion" required>
          <el-input-number
            v-model="params.qualifiedproportion"
            :min="0.1"
            :max="1"
            :step="0.1"
            placeholder="通过比例"
          ></el-input-number>
          <p class="hint">注：为0.9时，通过率为90%</p>
        </el-form-item>

        <el-form-item label="重复测试" prop="isrepeattest" required>
          <el-radio-group v-model="params.isrepeattest">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="答题数量" required>
          <el-input
            type="number"
            v-model="params.randomcount"
            placeholder="请输入答题数量"
            maxlength="10"
          ></el-input>
          <p class="hint">
            注：为0时，所有题都会展示；设置对应值后，会随机出现对应值的题数
          </p>
        </el-form-item>

        <el-form-item label="答题时间" required>
          <el-input
            v-model="params.timelimit"
            type="number"
            placeholder="请输入答题时间"
            maxlength="10"
          ></el-input>
          <span class="hint">注：单位分钟；为0时，默认为15分钟</span>
        </el-form-item>

        <el-form-item label="说明" required>
          <el-input placeholder="请输入说明" v-model="params.description">
          </el-input>
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

      loading: false,
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
            this.loading = true;

            if (this.params.id) {
              const { data: resData } = await updateExam(this.params);
              this.loading = false;
              if (!resData.data.status) return;

              this.$router.go(-1);
              this.$message.success("修改成功");
            } else {
              const { data: resData } = await addExam(this.params);
              this.loading = false;
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
