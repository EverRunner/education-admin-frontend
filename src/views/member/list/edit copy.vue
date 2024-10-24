<style lang="scss" scope>
.flex {
  .el-form-item__content {
    display: flex;
  }
}
.add-make {
  padding-top: 50px;
}
</style>

<template>
  <section class="public-edit public-body">
    <div class="public-edit-title">用户编辑</div>
    <div class="public-edit-form">
      <el-form
        :model="params"
        :rules="rules"
        ref="ruleForm"
        label-width="110px"
      >
        <el-form-item label="姓名" prop="username">
          <el-input
            v-model="params.username"
            placeholder="请输入姓名"
            maxlength="40"
          ></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="params.phone"
            type="number"
            maxlength="10"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>

        <el-form-item label="用户类型" prop="category">
          <el-select
            style="width: 340px"
            v-model="params.category"
            placeholder="请选择用户类型"
          >
            <el-option
              v-for="(item, index) in categoryList"
              :key="index"
              :label="item.categoryname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="用户等级" prop="level">
          <el-select
            style="width: 340px"
            v-model="params.level"
            placeholder="请选择用户等级"
          >
            <el-option
              v-for="(item, index) in levelList"
              :key="index"
              :label="item.val"
              :value="item.key"
              :disabled="item.key == 1"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="会员购买时间">
          <el-date-picker
            style="width: 340px"
            v-model="params.creathydate"
            align="right"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            disabled
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="会员到期时间" class="flex">
          <el-date-picker
            v-if="params.level > 0"
            style="width: 340px"
            v-model="params.endhydate"
            align="right"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
          <el-button
            style="margin-left:5px"
            type="warning"
            @click="dialogFormVisible = true"
            >去购买</el-button
          >
        </el-form-item>

        <el-form-item v-if="!params.id" label="设置密码" prop="password">
          <el-input
            v-model="params.password"
            placeholder="请输入密码"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item label="电子邮箱" prop="email">
          <el-input
            v-model="params.email"
            placeholder="请输入电子邮箱"
            maxlength="100"
          ></el-input>
        </el-form-item>

        <el-form-item label="邮编" prop="youbian">
          <el-input
            v-model="params.youbian"
            placeholder="请输入邮编"
            maxlength="10"
          ></el-input>
        </el-form-item>

        <el-form-item label="预约考试时间" class="flex">
          <el-date-picker
            style="width: 340px"
            v-model="examdate"
            align="right"
            type="date"
            placeholder="选择日期"
            disabled
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
          <el-button
            style="margin-left:5px"
            type="warning"
            @click="makeDialogVisible = true"
            >预约考试</el-button
          >
        </el-form-item>

        <el-form-item label="考过时间">
          <el-date-picker
            style="width: 340px"
            v-model="params.kaoshidate"
            align="right"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="params.sex">
            <el-radio label="1">男</el-radio>
            <el-radio label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="params.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="地址">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入地址"
            maxlength="200"
            v-model="params.address"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入备注（考试情况、学习情况等）"
            maxlength="200"
            v-model="params.remark"
          >
          </el-input>
        </el-form-item>

        <!-- <el-form-item label="共学习的天数">
          <el-input
            type="number"
            placeholder="请输入天数"
            maxlength="4"
            v-model="params.allstudydate"
          >
          </el-input>
        </el-form-item> -->

        <el-form-item>
          <el-button type="primary" @click="handleSubmit('ruleForm')"
            >提 交</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <el-dialog title="购买课程" width="500px" :visible.sync="dialogFormVisible">
      <el-form
        :model="orederParams"
        label-width="80px"
        ref="orderForm"
        :rules="orederRules"
      >
        <el-form-item label="推荐人码" prop="">
          <el-input
            @change="handleTuijianChange"
            v-model="orederParams.sharecode"
            placeholder="请输入推荐码"
            style="width: 340px"
          ></el-input>
        </el-form-item>
        <el-form-item label="支付渠道" prop="paychannel">
          <el-select
            v-model="orederParams.paychannel"
            placeholder="请选择支付渠道"
            style="width: 340px"
          >
            <el-option label="支票" value="cheque"></el-option>
            <el-option label="转账" value="transferAccounts"></el-option>
            <el-option label="Stripe 支付" disabled value="stripe"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="购买类型" prop="category">
          <el-select
            v-model="orederParams.category"
            placeholder="请选择购买类型"
            style="width: 340px"
            @change="handleBuyChange"
          >
            <el-option label="课程购买（120天）" :value="0"></el-option>
            <el-option label="课程续费（60天）" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付金额" prop="payfee">
          <el-input
            v-model="orederParams.payfee"
            placeholder="请输入支付金额（美元）"
            style="width: 340px"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="">
          <el-input
            v-model="orederParams.remark"
            type="textarea"
            :rows="2"
            placeholder="请输入备注"
            style="width: 340px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :loding="orderLoding" @click="handleAddOrder"
          >提 交</el-button
        >
      </div>
    </el-dialog>

    <el-dialog title="考试预约" width="750px" :visible.sync="makeDialogVisible">
      <el-table
        :data="makeList"
        border
        style="width: 100%"
        empty-text="暂无考试预约记录"
        :loding="makeLoding"
      >
        <el-table-column align="center" type="index" label="序号" width="50px">
        </el-table-column>
        <el-table-column prop="tpapdate" label="预约考试时间" width="130px">
          <template slot-scope="scope">
            {{ scope.row.tpapdate | formatDate("YYYY-MM-DD") }}
          </template>
        </el-table-column>
        <el-table-column prop="tpapremark" label="备注"></el-table-column>
        <el-table-column prop="tpapisadopt" label="是否考过" width="200px">
          <template slot-scope="scope">
            <template v-if="scope.row.tpapisadopt === null">
              <el-radio-group
                v-model="makeRadio[scope.$index]"
                @change="
                  (val) => {
                    handleMakeRadioChange(val, scope.$index);
                  }
                "
              >
                <el-radio :label="1">已考过</el-radio>
                <el-radio :label="2">未考过</el-radio>
              </el-radio-group>
            </template>
            <template v-else>
              <el-tag type="success" v-if="scope.row.tpapisadopt == 1"
                >已考过</el-tag
              >
              <el-tag type="danger" v-else>未考过</el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="tpapdate" label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.createdAt | formatDate }}
          </template>
        </el-table-column>
      </el-table>
      <div class="add-make">
        <el-form
          :model="makeParams"
          label-width="80px"
          ref="makeForm"
          :rules="makeRules"
        >
          <el-form-item label="预约时间" prop="tpapdate">
            <el-date-picker
              style="width: 340px"
              v-model="makeParams.tpapdate"
              align="right"
              type="date"
              placeholder="请选择预约时间"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="备注" prop="">
            <el-input
              v-model="makeParams.tpapremark"
              type="textarea"
              :rows="2"
              placeholder="请输入备注"
              style="width: 340px"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="handleAddMakeExam"
              :loding="makeLoding"
              >添 加</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import {
  getMemberInfo,
  getMemberCategory,
  addMemberInfo,
  updateMemberInfo,
  getMakeExamList,
  addMakeExamInfo,
  editMakeExamInfo,
} from "@api/member";
import { addOrder } from "@api/order";
import { PAGE_SIZE, USER_LEVEL } from "@config";
import { formatDateTime } from "@utils/tools";
import dayjs from "moment-timezone";

export default {
  components: {},
  data() {
    return {
      params: {
        status: 1,
        sex: "1",
        type: 1,
      },
      rules: {
        username: [
          { required: true, message: "请输入姓名", trigger: "change" },
          {
            min: 2,
            max: 50,
            message: "长度在 2 到 50 个字符",
            trigger: "change",
          },
        ],
        phone: [
          { required: false, message: "请输手机号", trigger: "change" },
          {
            min: 10,
            max: 10,
            message: "手机号长度是 10 位数字",
            trigger: "change",
          },
        ],
        // email: [
        //   { required: true, message: "请输入电子邮箱", trigger: "change" },
        // ],
        // youbian: [{ required: true, message: "请输入邮编", trigger: "change" }],
        level: [
          { required: true, message: "请选择用户等级", trigger: "change" },
        ],
        category: [
          { required: true, message: "请选择用户类型", trigger: "change" },
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        password: [
          { required: true, message: "请输入密码", trigger: "change" },
          {
            min: 6,
            max: 20,
            message: "密码长度在 6 到 20 个字符",
            trigger: "change",
          },
        ],
      },
      levelList: [],
      categoryList: [],

      allProgress: "",

      dialogFormVisible: false,
      orederParams: { payfee: null },
      orderLoding: false,
      orederRules: {
        paychannel: [
          { required: true, message: "请选择支付渠道", trigger: "change" },
        ],
        category: [
          { required: true, message: "请选择购买类型", trigger: "change" },
        ],
        payfee: [
          { required: true, message: "请输入支付金额", trigger: "change" },
        ],
      },

      makeList: [],
      makeDialogVisible: false,
      makeRadio: {},
      makeLoding: false,
      makeParams: { tpapdate: "" },
      makeRules: {
        tpapdate: [
          { required: true, message: "请选择预约时间", trigger: "change" },
        ],
      },
      makeLoding: false,

      examdate: "",
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
     * 获取会员详情
     */
    async queryInfo() {
      const { data: resData } = await getMemberInfo(this.params.id);
      if (!resData.data.status) return;

      //回显参数
      if (resData.data.info[0]) {
        this.examdate = resData.data.info[0].examdate
          ? formatDateTime(resData.data.info[0].examdate, "YYYY-MM-DD 15:00:00")
          : null;

        this.params = {
          id: resData.data.info[0].id,
          username: resData.data.info[0].username,
          phone: resData.data.info[0].phone,
          level: resData.data.info[0].level,
          category: resData.data.info[0].category,
          // password:resData.data.info[0].password,   //编辑时不需要
          email: resData.data.info[0].email,
          youbian: resData.data.info[0].youbian,
          kaoshidate: resData.data.info[0].kaoshidate
            ? formatDateTime(
                resData.data.info[0].kaoshidate,
                "YYYY-MM-DD 15:00:00"
              )
            : null,
          creathydate: resData.data.info[0].creathydate
            ? formatDateTime(
                resData.data.info[0].creathydate,
                "YYYY-MM-DD 15:00:00"
              )
            : null,

          endhydate: resData.data.info[0].endhydate
            ? formatDateTime(
                resData.data.info[0].endhydate,
                "YYYY-MM-DD 15:00:00"
              )
            : null,
          sex: resData.data.info[0].sex,
          status: resData.data.info[0].status,
          type: resData.data.info[0].type,
          address: resData.data.info[0].address,
          remark: resData.data.info[0].remark,
        };
      }
    },

    /**
     * 处理购买类型更新
     */
    handleBuyChange(key) {
      switch (key) {
        case 0:
          if (this.orederParams.sharecode) this.orederParams.payfee = 1099;
          else this.orederParams.payfee = 1199;
          break;

        case 1:
          this.orederParams.payfee = 200;
          break;

        default:
          break;
      }

      this.$forceUpdate();
    },

    /**
     * 处理购买类型更新
     */
    handleTuijianChange(key) {
      if (!key || this.orederParams.category !== 0) return;

      this.orederParams.payfee = 1099;

      this.$forceUpdate();
    },

    /**
     * 处理添加订单
     */
    handleAddOrder() {
      this.$refs.orderForm.validate((valid) => {
        if (!valid) return false;

        this.$confirm("确认是否购买？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            // 追加参数
            this.orederParams.username = this.params.username;
            this.orederParams.memberid = this.params.id;
            this.orederParams.payfee *= 100; // 转为美分
            this.orederParams.paycategory = 1;

            this.orderLoding = true;

            const { data: resData } = await addOrder(this.orederParams);
            this.orderLoding = false;
            if (!resData.data.status) return;

            this.dialogFormVisible = false;
            this.$message.success("购买成功！");
            this.queryInfo();
          })
          .catch(() => {});
      });
    },

    /**
     * 获取预约考试
     */
    async queryMakeExamList() {
      this.makeLoding = true;

      const { data: resData } = await getMakeExamList({
        memberid: this.$route.query.id,
      });
      this.makeLoding = false;
      if (!resData.data.status) return;

      this.makeList = resData.data.data.rows;
    },

    /**
     * 处理添加预约考试
     */
    handleAddMakeExam() {
      this.$refs.makeForm.validate((valid) => {
        if (!valid) return false;

        this.$confirm("确认是否添加预约时间？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            this.makeParams.memberid = this.params.id;

            const { data: resData } = await addMakeExamInfo(this.makeParams);
            if (!resData.data.status) return;

            this.$message.success("预约考试，添加成功！");
            this.examdate = dayjs(this.makeParams.tpapdate)
              .utcOffset("+15:00") //时区-世界协同时间
              .format("YYYY-MM-DD");
            // this.queryInfo();
            this.$refs.makeForm.resetFields();
            this.queryMakeExamList();
            this.makeDialogVisible = false;
          })
          .catch(() => {});
      });
    },

    /**
     *  修改预约时间
     */
    handleMakeRadioChange(val, index) {
      this.$confirm("确认学员是否考过？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const params = {
            id: this.makeList[index].id,
            memberid: this.params.id,
            tpapisadopt: val,
          };

          this.makeLoding = true;

          const { data: resData } = await editMakeExamInfo(params);
          this.makeLoding = false;
          if (!resData.data.status) return;

          this.$message.success("修改成功！");
          this.queryMakeExamList();
        })
        .catch(() => {});
    },

    /**
     * 提交修改(用户编辑)
     */
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false;

        this.$confirm("确认是否保存？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            // 加15个小时
            if (this.params.kaoshidate)
              this.params.kaoshidate = formatDateTime(
                this.params.kaoshidate,
                "YYYY-MM-DD 15:00:00"
              );

            if (this.params.creathydate)
              this.params.creathydate = formatDateTime(
                this.params.creathydate,
                "YYYY-MM-DD 15:00:00"
              );

            // if (this.params.examdate)
            //   this.params.examdate = formatDateTime(
            //     this.params.examdate,
            //     "YYYY-MM-DD 15:00:00"
            //   );

            if (this.params.endhydate)
              this.params.endhydate = formatDateTime(
                this.params.endhydate,
                "YYYY-MM-DD 15:00:00"
              );

            if (this.params.id) {
              const { data: resData } = await updateMemberInfo(this.params);
              if (!resData.data.status) return;

              this.$router.go(-1);
              this.$message.success("修改成功");
            } else {
              const { data: resData } = await addMemberInfo(this.params);
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
    //用户等级回显
    for (let key in USER_LEVEL) {
      this.levelList.push({
        key: Number(key),
        val: USER_LEVEL[key],
      });
    }

    this.queryMakeExamList();
    await this.queryCategory();

    if (this.$route.query.id) {
      this.params.id = this.$route.query.id;
      this.queryInfo();
    }
  },
};
</script>
