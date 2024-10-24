<style lang="scss" scope>
.dialog-wp {
  height: 70vh;
  overflow-y: auto;
}
</style>

<template>
  <section class="member-details">
    <el-breadcrumb separator="/" class="public-breadcrumb">
      <el-breadcrumb-item class="on">学员</el-breadcrumb-item>
      <el-breadcrumb-item class="on">学员列表</el-breadcrumb-item>
      <el-breadcrumb-item>{{ userInfo.username || "-" }}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 个人信息 -->
    <div class="member-details-wp" v-loading="loading">
      <div class="user">
        <div class="user-one">
          <div class="user-one-name">
            <em><img v-if="userInfo.avatar" :src="userInfo.avatar" alt=""/></em>
            <span>{{ userInfo.username || "-" }}</span>
          </div>
          <ul class="user-one-icon">
            <li>
              <el-tooltip
                class="item"
                effect="dark"
                content="登录学员端"
                placement="bottom"
              >
                <img
                  @click="handleGoLogin"
                  src="@/assets/images/member-details-login.png"
                  alt=""
                />
              </el-tooltip>
            </li>
            <li>
              <el-tooltip
                class="item"
                effect="dark"
                content="IM 聊天"
                placement="bottom"
              >
                <img
                  @click="handleOpenIm"
                  src="@/assets/images/member-details-message.png"
                  alt=""
                />
              </el-tooltip>
            </li>
            <li>
              <el-tooltip
                class="item"
                effect="dark"
                content="导出数据"
                placement="bottom"
              >
                <img
                  @click="handleExport"
                  src="@/assets/images/member-details-download.png"
                  alt=""
                />
              </el-tooltip>
            </li>
            <li>
              <el-tooltip
                class="item"
                effect="dark"
                content="编辑资料"
                placement="bottom"
              >
                <img
                  @click="handleGoto('MEMBER_EDIT')"
                  src="@/assets/images/member-details-edit.png"
                  alt=""
                />
              </el-tooltip>
            </li>
            <li>
              <el-tooltip
                class="item"
                effect="dark"
                content="删除资料"
                placement="bottom"
              >
                <img
                  @click="handleDelete"
                  src="@/assets/images/member-details-trash.png"
                  alt=""
                />
              </el-tooltip>
            </li>
            <li v-if="$route.query.exportParams">
              <el-tooltip
                class="item"
                effect="dark"
                content="获取请求参数"
                placement="bottom"
              >
                <i @click="handleGetParams" class="el-icon-document"></i>
              </el-tooltip>
            </li>
          </ul>
        </div>
        <div class="user-two">
          <el-row>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <div class="user-two-item">
                <em>姓名：</em><span>{{ userInfo.username || "-" }}</span>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <div class="user-two-item">
                <em>邮编：</em><span>{{ userInfo.youbian || "-" }}</span>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <div class="user-two-item">
                <em>登录：</em>
                <span>
                  <template v-if="userInfo.openid_gg || userInfo.openid_wx">
                    {{ userInfo.openid_gg ? "谷歌登录" : "" }}
                    {{ userInfo.openid_gg && userInfo.openid_wx ? "|" : "" }}
                    {{ userInfo.openid_wx ? "微信登录" : "" }}
                  </template>
                  <template v-else>-</template>
                </span>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <div class="user-two-item">
                <em>手机号：</em><span>{{ userInfo.phone || "-" }}</span>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <div class="user-two-item">
                <em>性别：</em
                ><span>{{ userInfo.sex == 1 ? "男" : "女" }}</span>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <div class="user-two-item">
                <em>分享码：</em>
                <span v-if="userInfo.sharecode">{{ userInfo.sharecode }}</span>
                <span v-else>
                  <span @click="handleCreateShare" style="cursor: pointer;"
                    >点击生成</span
                  >
                </span>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <div class="user-two-item">
                <em>邮箱：</em><span>{{ userInfo.email || "-" }}</span>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <div class="user-two-item">
                <em>地址：</em><span>{{ userInfo.address || "-" }}</span>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <div class="user-two-item">
                <em>备注：</em><span>{{ userInfo.remark || "-" }}</span>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <div class="user-two-item">
                <em>经常提问：</em>
                <el-radio-group
                  v-model="userInfo.ismorereq"
                  @change="handleQuiz"
                >
                  <el-radio :label="0">否</el-radio>
                  <el-radio :label="1">是</el-radio>
                </el-radio-group>
              </div>
            </el-col>
          </el-row>
        </div>
        <ul class="user-three">
          <li>
            <h1>已学习</h1>
            <div class="user-three-item">
              <em> {{ userInfo.allstudydate || 0 }}</em>
              <p>天</p>
            </div>
          </li>
          <li>
            <h1>平均学习</h1>
            <div class="user-three-item">
              <em>
                {{
                  Math.floor(((userInfo.studytimeavg || 0) * 10) / 60 / 60) /
                    10 || 0
                }}</em
              >
              <p>时/日</p>
            </div>
          </li>
          <li>
            <h1>预测完成</h1>
            <div class="user-three-item">
              <em> {{ userInfo.forecastDate || "-" }}</em>
            </div>
          </li>
          <!-- <li>
            <h1>机械学习率</h1>
            <div class="user-three-item">
              <em>
                {{ Math.floor((userInfo.rotedegree || 0) * 1000) / 10 || "0" }}
              </em>
              <p>％</p>
            </div>
          </li> -->
          <li>
            <h1>是否通过</h1>
            <div class="user-three-item">
              <em>
                <el-tag
                  :type="userInfo.predict_label == 1 ? 'success' : 'info'"
                  size="small"
                  style="cursor: pointer;"
                  @click="forecastVisible = true"
                >
                  {{ userInfo.predict_label == 1 ? "是" : "否" }}
                  ({{ Math.floor(userInfo.predict_score * 1000) / 10 }}%)
                </el-tag>
              </em>
            </div>
          </li>
          <!-- <li>
            <h1>考试预测</h1>
            <div class="user-three-item">
              <em>
                {{
                  Math.floor((userInfo.aiyctgtime || 0) * 1000) / 10 || "0"
                }}</em
              >
              <p>％</p>
            </div>
          </li> -->
        </ul>
        <ul class="user-four">
          <li>
            <span @click="handleGoto('MEMBER_LOGIN_RECORD')">登入记录</span>
          </li>
          <li>
            <span @click="handleGoto('MEMBER_LOGIN_IP_STATISTICS')"
              >登入IP统计</span
            >
          </li>
          <li>
            <span @click="handleGoto('MEMBER_AGREEMENT_RECORDS')"
              >协议签定记录</span
            >
          </li>
          <!-- <li>
            <span>考试预测图</span>
          </li> -->
        </ul>
      </div>
    </div>

    <!-- 学习员 身份 -->
    <div class="member-details-wp" v-loading="loading">
      <div class="identity">
        <h1 class="identity-title">
          学员身份<em> {{ userInfo.categoryname || "-" }}</em>
        </h1>
        <div class="identity-content">
          <div class="identity-content-item">
            <h2 :class="{ succeed: userProgress.status == 1 }">
              课程
              <em v-if="userInfo.vipstatus">已暂停</em>
              <em v-else>{{
                userProgress.status == 1 ? "已完成" : " 学习中"
              }}</em>
            </h2>
            <div class="identity-content-text">
              <p>
                （剩余
                {{
                  new Date(userInfo.endhydate) > new Date()
                    ? dateDifference(new Date(), userInfo.endhydate)
                    : 0
                }}
                天，{{ userInfo.endhydate | formatDate("MM/DD/YYYY") }}
                到期）
              </p>
            </div>
            <div class="identity-content-text">
              <p class="bold">
                购买 {{ userInfo.level > 0 ? "1" : "0" }} 次，续费
                {{ userInfo.hasPayElseCount || 0 }} 次
              </p>
            </div>
            <div class="identity-content-text">
              <!-- 不是考过生，并且是会员，才显示 ‘暂停’ -->
              <el-button
                :disabled="userInfo.category == 2 || userInfo.level < 1"
                size="small"
                type="primary"
                @click="vipStatusDialogVisible = true"
                >{{ userInfo.vipstatus == 1 ? "恢复" : "暂停" }}</el-button
              >
              <el-button
                size="small"
                type="primary"
                @click="dialogFormVisible = true"
                >购买/赠送</el-button
              >
              <el-button
                @click="handleGoto('MEMBER_STUDY_BUY_INFO')"
                size="small"
                type="primary"
                >购买记录</el-button
              >
            </div>
            <div class="identity-content-text">
              <p>注册： {{ userInfo.createdAt | formatDate("MM/DD/YYYY") }}</p>
            </div>
            <div class="identity-content-text">
              <p>
                购买 120 天：{{
                  detailStatics.firstbydate | formatDate("MM/DD/YYYY")
                }}
              </p>
            </div>
            <div class="identity-content-text">
              <p>
                续费 60 天：{{
                  detailStatics.lastxfdate | formatDate("MM/DD/YYYY")
                }}
              </p>
            </div>
          </div>
          <div class="identity-content-item">
            <h2 class="succeed" v-if="userInfo.category == 2">
              考试 <em>已通过</em>
            </h2>
            <h2 v-else>
              考试
              <em>{{ userInfo.category == 22 ? "已预约" : "待预约" }}</em>
            </h2>
            <div class="identity-content-text">
              <p>
                （通过日：{{ userInfo.kaoshidate | formatDate("MM/DD/YYYY") }}）
              </p>
            </div>
            <div class="identity-content-text">
              <p class="bold">
                考试 {{ detailStatics.allcount || 0 }} 次 ，失败
                {{ detailStatics.failcount || 0 }} 次
              </p>
            </div>
            <div class="identity-content-text">
              <el-button
                size="small"
                type="primary"
                @click="makeDialogVisible = true"
                :disabled="userInfo.category == 2"
                >新增记录</el-button
              >
            </div>
            <div
              v-for="(item, index) in makeList"
              :key="index"
              class="identity-content-text"
            >
              <p v-if="item.tpapisadopt == 1">
                通过考试：{{ item.tpapdate | formatDate("MM/DD/YYYY") }}
              </p>
              <p v-else>
                {{ item.tpapisadopt == 2 ? "考试失败" : "预约考试" }}：
                <el-tooltip
                  v-if="item.tpapremark"
                  class="item"
                  effect="dark"
                  :content="item.tpapremark"
                  placement="top-start"
                >
                  <span style="cursor: pointer;">{{
                    item.tpapdate | formatDate("MM/DD/YYYY")
                  }}</span>
                </el-tooltip>
                <span v-else>{{
                  item.tpapdate | formatDate("MM/DD/YYYY")
                }}</span>
                <i
                  v-if="!item.tpapisadopt"
                  @click="handleMakeChangeShow(item)"
                  class="el-icon-edit-outline"
                ></i>
                <i
                  @click="handleMakeDelete(item)"
                  class="el-icon-delete delete"
                ></i>
              </p>
            </div>
          </div>
          <div class="identity-content-item last">
            <h2 class="succeed" v-if="detailStatics.licensesuccessdate">
              执照申请 <em>成功</em>
            </h2>
            <h2 v-else>执照申请 <em>未申请</em></h2>
            <div class="identity-content-text">
              <p>（申请时间： -）</p>
            </div>
            <div class="identity-content-text">
              <p class="bold">申请 0 次 ，更新 0 次</p>
            </div>
            <div class="identity-content-text">
              <!-- <el-button size="small" type="primary">新增记录</el-button> -->
              <el-button
                @click="handleGoto('PASS_LICENSE_DETAILS')"
                size="small"
                type="primary"
                >申请资料</el-button
              >
            </div>
            <div class="identity-content-text">
              <p>
                购买：{{
                  detailStatics.licensepaydate | formatDate("MM/DD/YYYY")
                }}
              </p>
            </div>
            <div class="identity-content-text">
              <p>
                学员填写：{{
                  detailStatics.licenseapplydate | formatDate("MM/DD/YYYY")
                }}
              </p>
            </div>
            <div class="identity-content-text">
              <p>
                管理员提交：{{
                  detailStatics.licensesubdate | formatDate("MM/DD/YYYY")
                }}
              </p>
            </div>
            <div class="identity-content-text">
              <p>
                申请成功：{{
                  detailStatics.licensesuccessdate | formatDate("MM/DD/YYYY")
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 学习情况 -->
    <div class="member-details-wp">
      <div class="statics">
        <div class="statics-title">
          <h2>学习情况</h2>
          <div class="statics-title-btn">
            <el-button
              @click="handleGoto('MEMBER_STUDY_PROGRESS')"
              size="small"
              type="primary"
              >课程学习进度</el-button
            >
            <el-button
              @click="handleGoto('MEMBER_STUDY_HISTORY')"
              size="small"
              type="primary"
              >学习历史记录</el-button
            >
          </div>
        </div>
        <div class="statics-content" v-loading="staticsLoading">
          <StudyRadarStatics
            :userRadarData="userRadarData"
            v-if="!staticsLoading"
          />
        </div>
      </div>
    </div>

    <!-- 赠送会员时间 -->
    <el-dialog
      title="购买/赠送学习"
      width="500px"
      :visible.sync="dialogFormVisible"
    >
      <el-form label-width="80px">
        <el-form-item label="类型">
          <el-radio-group v-model="isGiveBuy">
            <el-radio :label="1">购买</el-radio>
            <el-radio :label="2">赠送</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <!--  购买 -->
      <el-form
        :model="orederParams"
        label-width="80px"
        ref="orderForm"
        :rules="orederRules"
        v-if="isGiveBuy == 1"
      >
        <el-form-item label="推荐人码">
          <el-input
            @change="handleTuijianChange"
            v-model="orederParams.sharecode"
            placeholder="请输入推荐码"
            style="max-width: 95%"
          ></el-input>
        </el-form-item>
        <el-form-item label="支付渠道" prop="paychannel">
          <el-select
            v-model="orederParams.paychannel"
            placeholder="请选择支付渠道"
            style="width: 95%"
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
            style="width: 95%"
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
            style="max-width: 95%"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="">
          <el-input
            v-model="orederParams.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
            style="max-width: 95%"
          ></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="verifyCode">
          <el-input
            type="number"
            placeholder="请输入验证码"
            v-model="orederParams.verifyCode"
            clearable
            style="max-width: 95%"
          />
        </el-form-item>
      </el-form>
      <!-- 赠送 -->
      <el-form
        label-width="80px"
        ref="vipDatesForm"
        :rules="vipDatesRules"
        :model="giveParams"
        v-else
      >
        <el-form-item label="姓名" required>
          <el-input
            placeholder="请输入姓名"
            :value="userInfo.username"
            clearable
            style="max-width: 95%"
            disabled
          />
        </el-form-item>
        <el-form-item label="赠送天数" prop="vipDates">
          <el-input
            type="number"
            placeholder="请输入赠送天数"
            v-model="giveParams.vipDates"
            clearable
            style="max-width: 95%"
          />
        </el-form-item>
        <el-form-item label="备注" prop="vipDatesRemark">
          <el-input
            type="textarea"
            style="max-width: 95%"
            :rows="3"
            placeholder="请输入备注"
            maxlength="200"
            v-model="giveParams.vipDatesRemark"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="verifyCode">
          <el-input
            type="number"
            placeholder="请输入验证码"
            v-model="giveParams.verifyCode"
            clearable
            style="max-width: 95%"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <template v-if="isGiveBuy == 1">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-popconfirm
            @confirm="handleAddOrder"
            title="确定购买学习吗？"
            style="margin-left: 10px;"
          >
            <el-button type="primary" :loding="orderLoding" slot="reference"
              >提交购买</el-button
            >
          </el-popconfirm>
        </template>
        <template v-else>
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-popconfirm
            @confirm="handleSubmitVipTime"
            title="确定赠送学习吗？"
            style="margin-left: 10px;"
          >
            <el-button type="primary" slot="reference">提交赠送</el-button>
          </el-popconfirm>
        </template>
      </div>
    </el-dialog>

    <!-- IM 聊天 -->
    <el-dialog
      class="member-details-im"
      :title="`与${userInfo.username}聊天`"
      :visible.sync="imVisible"
      width="600px"
      top="10vh"
      :close-on-click-modal="false"
    >
      <chat :border="true" />
    </el-dialog>

    <!-- 考试预约 -->
    <el-dialog title="考试预约" width="500px" :visible.sync="makeDialogVisible">
      <div class="add-make">
        <el-form
          :model="makeParams"
          label-width="80px"
          ref="makeForm"
          :rules="makeRules"
        >
          <el-form-item label="姓名" required>
            <el-input
              placeholder="请输入姓名"
              :value="userInfo.username"
              clearable
              style="max-width: 95%"
              disabled
            />
          </el-form-item>
          <el-form-item label="预约时间" prop="tpapdate">
            <el-date-picker
              style="width: 95%"
              v-model="makeParams.tpapdate"
              align="right"
              type="date"
              placeholder="请选择预约时间"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd 15:00:00"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="备注" prop="">
            <el-input
              v-model="makeParams.tpapremark"
              type="textarea"
              :rows="4"
              placeholder="请输入备注"
              style="width: 95%"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="makeDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleAddMakeExam"
          :loding="makeLoding"
          >提 交</el-button
        >
      </div>
    </el-dialog>

    <!-- 编辑学员考试 -->
    <el-dialog
      title="学员考试结果"
      width="500px"
      :visible.sync="makeRadioDialogVisible"
    >
      <div class="add-make">
        <el-form
          :model="makeParams"
          label-width="80px"
          ref="makeForm"
          :rules="makeRules"
        >
          <el-form-item label="考试结果" required>
            <el-radio-group v-model="makeRadio.tpapisadopt">
              <el-radio :label="1">已考过</el-radio>
              <el-radio :label="2">未考过</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="makeRadioDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleMakeChange" :loding="makeLoding"
          >提 交</el-button
        >
      </div>
    </el-dialog>

    <!-- 暂停/恢复 -->
    <el-dialog
      :title="userInfo.vipstatus == 1 ? '恢复学习' : '暂停学习'"
      width="500px"
      :visible.sync="vipStatusDialogVisible"
    >
      <div class="add-make">
        <el-form
          :model="makeParams"
          label-width="80px"
          ref="makeForm"
          :rules="makeRules"
        >
          <el-form-item
            :label="userInfo.vipstatus == 1 ? '恢复备注' : '暂停备注'"
            required
          >
            <el-input
              type="textarea"
              style="max-width: 95%"
              :rows="5"
              placeholder="请输入备注"
              maxlength="200"
              v-model="vipStatusRemark"
            >
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="vipStatusDialogVisible = false">取 消</el-button>
        <el-button
          :loading="vipStatusLoading"
          type="primary"
          @click="handlePause"
          :loding="makeLoding"
          >提 交</el-button
        >
      </div>
    </el-dialog>

    <!-- 预测历史 -->
    <el-dialog
      title="预测历史记录"
      :visible.sync="forecastVisible"
      width="600px"
      top="10vh"
      :close-on-click-modal="false"
    >
      <div class="dialog-wp">
        <el-table :data="forecastList" v-loading="forecastLoading" size="mini">
          <el-table-column
            align="center"
            type="index"
            label="序号"
            width="60"
          ></el-table-column>
          <el-table-column align="center" label="预测日期">
            <template slot-scope="scope">
              {{ scope.row.predict_day | formatDate("MM/DD/YYYY") }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="预测结果">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.predict_label == 1 ? 'success' : 'info'"
                size="small"
              >
                {{ scope.row.predict_label == 1 ? "是" : "否" }}
                （{{ Math.floor(scope.row.predict_score * 1000) / 10 }}%）
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-algin">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pages.pageindex"
            :page-sizes="[30, 60, 90, 200, 300]"
            :page-size="pages.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import {
  getMemberInfo,
  giveVipDates,
  getMemberParamsExport,
  getMemberCourseExport,
  createMemberShare,
  addMemberPayCount,
  getMenberToken,
  deleteMemberStatus,
  getMakeExamList,
  addMakeExamInfo,
  editMakeExamInfo,
  getMemberDetailStatics,
  delMakeExamInfo,
  updateIsMoreReq,
  getUserForecastHistory,
} from "@api/member";
import {
  getMemberStudyExport,
  getUserStudyStaticsData,
  changeUserVipStatus,
} from "@api/user";
import { addOrder } from "@api/order";
import { PAGE_SIZE, USER_LEVEL, STUDY_TYPE, VIP_LOG_TYPE } from "@config";
import { dateDifference } from "@utils/tools";
import Chat from "@comp/IM/Chat";
import { mapMutations } from "vuex";
import StudyRadarStatics from "./components/StudyRadarStatics";
import dayjs from "dayjs";
import { formatDateTime } from "@utils/tools";

export default {
  components: { Chat, StudyRadarStatics },

  data() {
    return {
      loading: true,
      userInfo: {
        username: "",
      },
      params: {},
      levelList: USER_LEVEL,

      memberProgress: {},

      pages: {
        pageindex: 1,
        pagesize: 30,
      },
      PAGE_SIZE,
      total: 0,
      studyList: [],
      studyParams: {
        courseid: null,
      },

      userProgress: {},
      allProgress: 0,

      allChapter: 0,
      alreadyChapter: 0,

      nowTitle: "未开始学习",
      nowSecondTitle: "暂无",

      vipLog: [],

      courseList: [],

      pages2: {
        pageindex: 1,
        pagesize: 50,
      },

      errorLoading: false,
      errorLogList: [],

      completeLoading: false,
      completeLogList: [],

      loginPages: {
        pageindex: 1,
        pagesize: PAGE_SIZE,
      },
      loginTotal: 0,
      loginList: [],
      loginType: {
        WX_LOGIN: "微信登录",
        GOOGLE_LOGIN: "谷歌登录",
        ACCOUNT_PASSWORD_LOGIN: "帐密登录",
      },

      STUDY_TYPE,

      VIP_LOG_TYPE,

      highTestLog: [],
      highTestLogLoading: false,
      pages3: {
        pageindex: 1,
        pagesize: 50,
      },

      scheduleEditShow: false,
      courseChapterTree: [],
      scheduleEditParams: {
        status: 0, //总进度状态： 0：进行中 1：已完成
      },

      answerVisible: false,
      answerLoading: false,
      answerList: [],

      category: {
        1: "电脑",
        2: "手机",
        3: "平板",
      },

      ipStaticsList: [],

      historyPages: {
        pageindex: 1,
        pagesize: PAGE_SIZE,
        // pagesize: 9999,
      },
      historyTotal: 0,
      studyHistory: [], // 学习历史
      studyHistoryType: {
        1: "视频学习",
        2: "关键词学习（中英）",
        3: "关键词-测试（中英）",
        4: "关键词学习（英）",
        5: "关键词-测试（英）",
        6: "单元测试",
        7: "单元测试（测前关键词）",
        8: "我的错题（测前单词）",
        9: "我的错题测试",
        10: "高频错题（测前单词）",
        11: "高频错题测试",
        12: "综合题（测前单词）",
        13: "综合题测试",
      },

      summaryStudyVisible: false,
      summaryStudyList: [],
      summaryStudyLoading: false,

      agreementLoading: true, // 用户同意协议列表
      agreementList: [],

      imVisible: false,

      userRadarData: {},
      staticsLoading: true,

      makeList: [], // 考试预约
      makeDialogVisible: false,
      makeRadio: { id: "", tpapisadopt: "" },
      makeLoding: false,
      makeParams: { tpapdate: "" },
      makeRules: {
        tpapdate: [
          { required: true, message: "请选择预约时间", trigger: "change" },
        ],
      },
      makeRadioDialogVisible: false,

      detailStatics: {},
      vipStatusLoading: false,
      vipStatusRemark: "",
      vipStatusDialogVisible: false,

      isGiveBuy: 1, // 赠送、购买
      dialogFormVisible: false,
      giveParams: {
        vipDates: null,
        vipDatesRemark: "",
      },
      vipDatesRules: {
        vipDates: [
          { required: true, message: "请输入赠送天数", trigger: "input" },
        ],
        vipDatesRemark: [
          { required: true, message: "请输入备注", trigger: "input" },
        ],
        verifyCode: [
          { required: true, message: "请输入验证码", trigger: "input" },
        ],
      },
      orederRules: {
        paychannel: [
          { required: true, message: "请选择支付渠道", trigger: "change" },
        ],
        category: [
          { required: true, message: "请选择购买类型", trigger: "change" },
        ],
        payfee: [
          { required: true, message: "请输入支付金额", trigger: "input" },
        ],
        verifyCode: [
          { required: true, message: "请输入验证码", trigger: "input" },
        ],
      },
      orederParams: { payfee: null },
      orderLoding: false,

      forecastList: [], // 预测历史
      forecastLoading: false,
      forecastVisible: false,
    };
  },

  methods: {
    ...mapMutations(["setImNowUser", "setWS"]),
    dateDifference,

    /**
     * 获取会员详情
     */
    async queryInfo() {
      this.loading = true;
      const { data: resData } = await getMemberInfo(this.params.memberid);
      this.loading = false;
      if (!resData.data.status) return;

      this.userInfo = resData.data.info[0];

      // 预测完成小时
      const finishHour =
        Math.floor(((this.userInfo.aiycwctime || 0) * 10) / 60 / 60) / 10 || 0;

      // 预计完成时间
      if (this.userInfo.aiycwctime == 0) {
        this.userInfo.forecastDate = "已完成";
      } else {
        // 计算预计的天数
        const expectedDay = Math.ceil(
          this.userInfo.aiycwctime / this.userInfo.studytimeavg
        );

        this.userInfo.forecastDate = dayjs()
          .add(expectedDay || 0, "day")
          .format("MM/DD/YY");
      }
    },

    /**
     * 赠送会员时间
     */
    handleSubmitVipTime() {
      this.$refs.vipDatesForm.validate(async (valid) => {
        if (!valid) return false;

        const { data: resData } = await giveVipDates({
          memberid: this.params.memberid,
          date: this.giveParams.vipDates,
          remark: this.giveParams.vipDatesRemark,
          verifyCode: this.giveParams.verifyCode,
        });
        if (!resData.data.status) return;
        this.queryInfo();
        this.$message.success("赠送成功！");
        this.dialogFormVisible = false;
      });
    },

    /**
     * 生成分享码
     */
    handleCreateShare() {
      if (this.userInfo.sharecode) return;

      if (this.userInfo.level != 1)
        return this.$message.error("付费会员才能生成分享码");

      this.$confirm("是否创建分享码？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: resData } = await createMemberShare(
            this.params.memberid
          );
          if (!resData.data.status) return;

          this.queryInfo();
          this.$message.success("分享码创建成功");
        })
        .catch(() => {});
    },

    /**
     * 增加续约次数
     */
    handleAddPayNum() {
      this.$confirm("是否为该学员增加1次续费机会？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: resData } = await addMemberPayCount(
            this.params.memberid
          );
          if (!resData.data.status) return;

          this.queryInfo();
          this.$message.success("续费增加成功");
        })
        .catch(() => {});
    },

    /**
     * 发送消息给 个人
     * 用户id: 2983 是易北客服
     */
    async handleSendMsg(frindid, content) {
      const { data: resData } = await this.$post("/im/sendmsg", {
        frindid,
        content,
      });
    },

    /**
     * 打开IM
     */
    handleOpenIm() {
      this.setImNowUser({
        ...this.userInfo,
        memberid: this.userInfo.id,
      });

      this.imVisible = true;
    },

    /**
     * 导出
     */
    handleStudyExport() {
      this.$confirm("是否导出学员学习历史数据？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await getMemberStudyExport(this.params.memberid);
        })
        .catch(() => {});
    },

    /**
     * 处理登入学员端
     */
    handleGoLogin(key, name, row) {
      this.$confirm("是否登入学员系统？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.$message({
            showClose: true,
            message: "正在登入学员系统，请稍等！",
            type: "success",
          });

          const { data: resData } = await getMenberToken(this.params.memberid);

          if (!resData.data.status) return;

          console.log(resData.data.temporarytoken);

          window.open(
            "https://www.ybmblex.net/#/account/?token=" +
              resData.data.temporarytoken
          );
        })
        .catch(() => {});
    },

    /**
     * 获取当前用户的学习雷达图
     */
    async queryUserRadarStatics() {
      this.staticsLoading = true;
      const { data: resData } = await getUserStudyStaticsData(
        this.params.memberid
      );
      this.staticsLoading = false;
      if (!resData.data.status) return;

      this.userRadarData = resData.data.data[0];
    },

    /**
     * 处理跳转
     */
    handleGoto(name) {
      this.$router.push({
        name,
        query: {
          id: this.userInfo.id,
          name: this.userInfo.username,
          level: this.userInfo.level,
        },
      });
    },

    /**
     * 导出该学员
     */
    handleExport() {
      this.$confirm("是否导出该学员数据统计？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await getMemberCourseExport(this.userInfo.id, this.userInfo.username);
          // await getMemberCourseExport("2428", "YIDIFAN");
        })
        .catch(() => {});
    },

    /**
     * 导出该学员的-请求参数
     */
    handleGetParams() {
      this.$confirm("获取学员请求参数？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await getMemberParamsExport(this.userInfo.id);
          // await getMemberCourseExport("2428", "YIDIFAN");
          if (!resData.data.status) return;
        })
        .catch(() => {});
    },

    /**
     * 删除用户
     */
    async handleDelete() {
      // this.$message.error("请联系程序员删除！");

      this.$confirm("是否删除当前会员？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: resData } = await deleteMemberStatus(this.userInfo.id);
          if (!resData.data.status) return;

          this.$message.success("删除成功");
          this.queryList();
        })
        .catch(() => {});
    },

    /**
     * 暂停/恢复学习
     */
    handlePause() {
      this.$confirm("确认提交吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.vipStatusLoading = true;

          const status = this.userInfo.vipstatus == 1 ? 0 : 1; // 0：恢复，1：暂停

          const { data: resData } = await changeUserVipStatus({
            memberid: this.userInfo.id,
            status,
            remark: this.vipStatusRemark,
          });
          this.vipStatusLoading = false;
          if (!resData.data.status) return;

          this.$message.success("操作成功");
          this.vipStatusDialogVisible = false;
          this.vipStatusRemark = "";
          this.queryInfo();
        })
        .catch(() => {});
    },

    /**
     * 获取预约考试
     */
    async queryMakeExamList() {
      this.makeLoding = true;

      const { data: resData } = await getMakeExamList({
        memberid: this.params.memberid,
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
            this.makeParams.memberid = this.params.memberid;

            const { data: resData } = await addMakeExamInfo(this.makeParams);
            if (!resData.data.status) return;

            this.$message.success("预约考试，添加成功！");

            this.$refs.makeForm.resetFields();
            this.queryMakeExamList();
            this.queryInfo();
            this.makeDialogVisible = false;
          })
          .catch(() => {});
      });
    },

    /**
     * 编辑学员考试结果 - 显示
     */
    handleMakeChangeShow(row) {
      this.makeRadio.id = row.id;
      this.makeRadio.tpapdate = formatDateTime(
        row.tpapdate,
        "YYYY-MM-DD 15:00:00"
      );

      this.makeRadioDialogVisible = true;
    },

    /**
     * 编辑学员考试结果
     */
    handleMakeChange() {
      this.$confirm("确认学员是否考过？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.makeLoding = true;

          const { data: resData } = await editMakeExamInfo({
            ...this.makeRadio,
            memberid: this.userInfo.id,
          });
          this.makeLoding = false;
          if (!resData.data.status) return;

          this.$message.success("修改成功！");
          this.makeRadioDialogVisible = false;
          this.queryMakeExamList();
          this.queryInfo();
        })
        .catch(() => {});
    },

    /**
     * 删除预约考试
     */
    handleMakeDelete(row) {
      this.$confirm("确认删除预约考试？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: resData } = await delMakeExamInfo(row.id);

          if (!resData.data.status) return;

          this.$message.success("删除成功！");
          this.queryMakeExamList();
          this.queryInfo();
        })
        .catch(() => {});
    },

    /**
     * 获取用户详情的统计数据
     */
    async queryDetailStatics() {
      const { data: resData } = await getMemberDetailStatics(
        this.params.memberid
      );
      if (!resData.data.status || !resData.data.data[0]) return;

      this.detailStatics = resData.data.data[0];
    },

    /**
     * 处理购买 - 类型更新
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
     * 去购买 - 推荐人
     */
    handleTuijianChange(key) {
      if (!key || this.orederParams.category !== 0) return;

      this.orederParams.payfee = 1099;

      this.$forceUpdate();
    },

    /**
     * 去购买 - 添加订单
     */
    handleAddOrder() {
      this.$refs.orderForm.validate(async (valid) => {
        if (!valid) return false;

        this.orderLoding = true;

        // 追加参数
        this.orederParams.username = this.userInfo.username;
        this.orederParams.memberid = this.params.memberid;
        this.orederParams.paycategory = 1;

        const { data: resData } = await addOrder({
          ...this.orederParams,
          payfee: this.orederParams.payfee * 100, // 转为美分
        });
        this.orderLoding = false;
        if (!resData.data.status) return;

        this.dialogFormVisible = false;
        this.$message.success("购买成功！");
        this.queryInfo();
      });
    },

    /**
     *  处理经常性提问
     */
    handleQuiz(value) {
      this.$confirm("确认修改经常提问？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: resData } = await updateIsMoreReq({
            memberid: this.params.memberid,
            ismorereq: value,
          });
          if (!resData.data.status) return;

          this.$message.success("修改成功！");
        })
        .catch(() => {});
    },

    /**
     * 获取预测历史
     */
    async queryForecastHistory() {
      this.forecastLoading = true;
      const { data: resData } = await getUserForecastHistory(
        { memberid: this.params.memberid },
        this.pages
      );
      this.forecastLoading = false;
      if (!resData.data.status) return;

      this.forecastList = resData.data.data.v2.rows;

      this.total = resData.data.data.v2.count;
    },

    /**
     * pageSize 改变时会触发
     */
    handleSizeChange(val) {
      this.pages.pagesize = val;
      this.pages.pageindex = 1;
      this.queryForecastHistory();
    },

    /**
     * pageindex 改变时会触发
     */
    handleCurrentChange(val) {
      this.pages.pageindex = val;
      this.queryForecastHistory();
    },
  },

  async created() {
    if (this.$route.query.id) {
      this.params.memberid = this.$route.query.id;

      this.queryInfo();
      this.queryMakeExamList();
      this.queryUserRadarStatics();
      this.queryDetailStatics();
      this.queryForecastHistory();
    }
  },
};
</script>
