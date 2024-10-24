<style lang="scss" scoped>
.test {
  width: 50%;
  padding: 30px;
  h2 {
    padding: 30px;
  }
}
</style>

<template>
  <div class="test">
    <h2>根据试卷id修改试题状态</h2>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="试卷id">
        <el-input v-model="form.paperid"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="form.status">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { updateRequestStatusById } from "@api/exam";

export default {
  name: "404",
  data() {
    return {
      form: {
        paperid: null,
        status: 1,
      },
    };
  },
  methods: {
    async onSubmit() {
      if (!this.form.paperid) return this.$message.error("id没有传");

      const { data: resData } = await updateRequestStatusById(this.form);
      if (!resData.data.status) return;

      this.$message.success("成功");
    },
  },
};
</script>
