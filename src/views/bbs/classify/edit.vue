<style lang="scss" scope>
.edit {
}
</style>

<template>
  <section>
    <div class="member-details-wp" style="margin-bottom: 80px">
      <div class="member-edit-title">帖子类型编辑</div>

      <el-form
        :model="params"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="类型名称" prop="name">
          <el-input
            v-model="params.name"
            placeholder="请输入类型名称"
            maxlength="30"
          ></el-input>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input
            v-model="params.sort"
            placeholder="请输入排序"
            type="numberFG"
            maxlength="4"
          ></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="params.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
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
import { addBbsCategory, editBbsCategory } from "@api/bbs";

export default {
  components: {},
  data() {
    return {
      loading:false,
      
      params: {
        name: "",
        sort: null,
        status: 1,
      },
      rules: {
        name: [
          { required: true, message: "请输入类型名称", trigger: "change" },
        ],
        sort: [{ required: true, message: "请填写排序", trigger: "change" }],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
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
              const { data: resData } = await editBbsCategory(this.params);
              if (!resData.data.status) return;

              this.$router.go(-1);
              this.$message.success("修改成功");
            } else {
              const { data: resData } = await addBbsCategory(this.params);
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
      this.params.name = this.$route.query.name;
      this.params.sort = this.$route.query.sort;
      this.params.status = this.$route.query.status;
      // this.queryInfo();
    }
  },
};
</script>
