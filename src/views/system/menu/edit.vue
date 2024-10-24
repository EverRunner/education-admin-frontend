<style lang="scss" scope>
.edit {
}
</style>

<template>
  <section class="public-edit public-body">
    <div class="public-edit-title">
      菜单编辑
    </div>
    <div class="public-edit-form">
      <el-form
        :model="params"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="菜单名称" prop="menuname">
          <el-input
            v-model="params.menuname"
            placeholder="请输入菜单名称"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item label="链接" prop="url">
          <el-input
            v-model="params.url"
            placeholder="请输入链接"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item label="父级" prop="parentid">
          <el-select v-model="params.parentid" placeholder="请选择一级菜单">
            <el-option label="顶级菜单" :value="0"></el-option>
            <el-option
              v-for="(item, index) in list"
              :key="index"
              :label="item.menuname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="图标" prop="thumb">
          <el-input
            v-model="params.thumb"
            placeholder="请输入图标"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input
            v-model="params.sort"
            placeholder="请输入排序"
            type="number"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="params.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
            maxlength="200"
            v-model="params.remark"
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
import { getMenuList, getRoleInfo, addMenu, updateMenu } from "@api/system";

export default {
  components: {},
  data() {
    return {
      params: {
        parentid: 0,
        status:1,
      },
      list: [],
      rules: {
        menuname: [
          { required: true, message: "请输入菜单名称", trigger: "change" },
        ],
        url: [{ required: true, message: "请输入链接", trigger: "change" }],
        sort: [{ required: true, message: "请输入排序", trigger: "change" }],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
      },
    };
  },
  methods: {
    /**
     * 获取列表
     */
    async queryList() {
      const { data: resData } = await getMenuList(this.params);
      if (!resData.data.status) return;

      this.list = resData.data.menulist;
    },

    /**
     * 获取详情
     */
    async queryInfo() {
      const { data: resData } = await getRoleInfo(this.params.id);
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
              const { data: resData } = await updateMenu(this.params);
              if (!resData.data.status) return;

              this.$router.go(-1);
              this.$message.success("修改成功");
            } else {
              const { data: resData } = await addMenu(this.params);
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
    await this.queryList();

    if (this.$route.query.id) {
      this.params.id = this.$route.query.id;
      this.queryInfo();
    }
  },
};
</script>

