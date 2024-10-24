<style lang="scss" scope>
.pay-status {
  &.await {
    color: #ffa61f;
  }
  &.success {
    color: #33dda1;
  }
  &.fail {
    color: #fa5376;
  }
  &.refund {
    color: #a8aebb;
  }
}
</style>
<template>
  <section class="member-details">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item class="on">学员</el-breadcrumb-item>
      <el-breadcrumb-item class="on">考试学员列表</el-breadcrumb-item>
      <el-breadcrumb-item class="on">{{
        params.username || "-"
      }}</el-breadcrumb-item>
      <el-breadcrumb-item>执照申请资料</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="member-details-licence">
      <div class="info">
        <el-row>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <div class="info-item">
              <em>姓名：</em><span class="on">{{ info.username || "-" }}</span>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <div class="info-item">
              <em>订单内容：</em><span>执照申请</span>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <div class="info-item">
              <em>购买时间：</em><span>{{ info.createdAt | formatDate }}</span>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <div class="info-item">
              <em>订单编号：</em><span>{{ info.ordercode || "-" }}</span>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <div class="info-item">
              <em>最近更新：</em><span>{{ info.updatedAt | formatDate }}</span>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <div class="info-item">
              <em>支付方式：</em
              ><span>{{ info.paytype == 1 ? "微信" : "银行卡" }}</span>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <div class="info-item">
              <em>申请状态：</em
              ><span>{{ LICENSE_STATUS[info.status] || "-" }}</span>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <div class="info-item">
              <em>进度：</em><span>{{ LICENSE_STEP[info.step] || "-" }}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="tabs">
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="申请内容" name="first">
            <ul class="tabs-list">
              <!-- 执照更新独有的 -->
              <template v-if="info.type == 1">
                <li>
                  <h5>持有哪几个州的执照：</h5>
                  <p class="text">{{ info.existinglicensenumber || "-" }}个</p>
                </li>
                <li class="block">
                  <h5>现持有州执照（照片）：</h5>
                  <div v-for="(item, index) in updateNowLcense" :key="index">
                    <p class="text" style="margin-top: 5px">
                      执照过期日：{{ item.date | formatDate("YYYY-MM-DD") }}
                    </p>
                    <div class="images" style="padding-top:10px">
                      <el-image
                        class="image"
                        v-if="item.image"
                        :src="FILE_ROOT + item.image"
                        :preview-src-list="[FILE_ROOT + item.image]"
                      />
                    </div>
                  </div>
                </li>
                <li class="block">
                  <h5>过去两年 24 个再教育学分：</h5>
                  <div class="images">
                    <el-image
                      class="image"
                      :src="FILE_ROOT + info.massagehoursclosedlow"
                      :preview-src-list="[
                        FILE_ROOT + info.massagehoursclosedlow,
                      ]"
                    />
                  </div>
                </li>
                <li>
                  <h5>是否收到过刑事罚单：</h5>
                  <p class="text">
                    {{ info.iscriminalticketinusaupdate == 1 ? "是" : "否" }}
                  </p>
                </li>
                <li>
                  <h5>是否曾经被逮捕：</h5>
                  <p class="text">
                    {{ info.isarrestinusaupdate == 1 ? "是" : "否" }}
                  </p>
                </li>
                <li>
                  <h5>是否曾经在美国被判刑事罪：</h5>
                  <p class="text">
                    {{ info.iscriminaloffenseupdate == 1 ? "是" : "否" }}
                  </p>
                </li>
              </template>
              <li>
                <h5>申请州：</h5>
                <p class="text">{{ info.whichstation || "-" }}</p>
              </li>
              <li>
                <h5>考试地点：</h5>
                <p class="text">{{ info.examinationaddress || "-" }}</p>
              </li>
              <li>
                <h5>入学时间：</h5>
                <p class="text">
                  {{ info.entrancedate | formatDate("YYYY-MM-DD") }}
                </p>
              </li>
              <li>
                <h5>毕业时间：</h5>
                <p class="text">
                  {{ info.graduationdate | formatDate("YYYY-MM-DD") }}
                </p>
              </li>
              <li>
                <h5>曾用名：</h5>
                <p class="text">{{ info.nameusedbefore || "-" }}</p>
              </li>
              <li>
                <h5>过去5年居住的州：</h5>
                <p class="text">{{ info.lastfiveyearlivestate || "-" }}</p>
              </li>
              <li>
                <h5>电话号码：</h5>
                <p class="text">{{ info.phone || "-" }}</p>
              </li>
              <li>
                <h5>电子邮件：</h5>
                <p class="text">{{ info.email || "-" }}</p>
              </li>
              <li>
                <h5>邮寄地址：</h5>
                <p class="text">{{ info.mailingaddress || "-" }}</p>
              </li>
              <li>
                <h5>账单地址：</h5>
                <p class="text">{{ info.accountaddress || "-" }}</p>
              </li>
              <li>
                <h5>是否收过罚单：</h5>
                <p class="text">
                  {{ info.infringementnotice == 1 ? "是" : "否" }}
                </p>
              </li>
              <li>
                <h5>备注：</h5>
                <p class="text">{{ info.defaitcontent || "-" }}</p>
              </li>
              <li class="block">
                <h5>MBLEX联邦考试通过PASS纸图片：</h5>
                <div class="images">
                  <el-image
                    class="image"
                    :src="FILE_ROOT + info.mblexpasspaperimg"
                    :preview-src-list="[FILE_ROOT + info.mblexpasspaperimg]"
                  />
                </div>
              </li>
              <li class="block">
                <h5>小时证书图片：</h5>
                <div class="images">
                  <el-image
                    class="image"
                    :src="FILE_ROOT + info.hourcertificateimg"
                    :preview-src-list="[FILE_ROOT + info.hourcertificateimg]"
                  />
                </div>
              </li>
              <li class="block">
                <h5>成绩单图片：</h5>
                <div class="images">
                  <el-image
                    class="image"
                    :src="FILE_ROOT + info.schoolreportimg"
                    :preview-src-list="[FILE_ROOT + info.schoolreportimg]"
                  />
                </div>
              </li>
              <li class="block">
                <h5>过去的工作经验：</h5>
                <p
                  class="text"
                  v-for="(item, index) in workExperience"
                  :key="index"
                >
                  <span>公司名字：{{ item.company }}</span>
                  <span>工作性质：{{ item.workType }}</span>
                  <span>地址：{{ item.addr }}</span>
                  <span
                    >开始工作：{{
                      item.startDate | formatDate("YYYY-MM-DD")
                    }}</span
                  >
                  <span
                    >结束工作：{{
                      item.endtDate | formatDate("YYYY-MM-DD")
                    }}</span
                  >
                </p>
              </li>
              <li
                class="block"
                v-if="
                  info.whichstation == '北卡罗莱纳州' ||
                    info.whichstation == '华盛顿州'
                "
              >
                <h5>专业经验 （北卡罗莱纳州和华盛顿州）：</h5>
                <p class="text">
                  <span>公司名字：{{ info.company }}</span>
                  <span>职位：{{ info.zyworkxz }}</span>
                  <span>地址：{{ info.zyaddress }}</span>
                  <span>开始工作：{{ info.zystart }}</span>
                  <span>结束工作：{{ info.zyend }}</span>
                </p>
              </li>
              <li class="block" v-if="info.whichstation == '北卡罗莱纳州'">
                <h5>4个推荐信 （北卡罗莱纳州）：</h5>
                <div class="images">
                  <el-image
                    class="image"
                    :src="FILE_ROOT + info.recommendationimg1"
                    :preview-src-list="[FILE_ROOT + info.recommendationimg1]"
                  />
                  <el-image
                    class="image"
                    :src="FILE_ROOT + info.recommendationimg2"
                    :preview-src-list="[FILE_ROOT + info.recommendationimg2]"
                  />
                  <el-image
                    class="image"
                    :src="FILE_ROOT + info.recommendationimg3"
                    :preview-src-list="[FILE_ROOT + info.recommendationimg3]"
                  />
                  <el-image
                    class="image"
                    :src="FILE_ROOT + info.recommendationimg4"
                    :preview-src-list="[FILE_ROOT + info.recommendationimg4]"
                  />
                </div>
              </li>

              <li class="block" v-if="info.whichstation == '北卡罗莱纳州'">
                <h5>教学大纲认证（北卡罗来纳州）：</h5>
                <div class="images">
                  <el-image
                    class="image"
                    :src="FILE_ROOT + info.syllabuscertification"
                    :preview-src-list="[FILE_ROOT + info.syllabuscertification]"
                  />
                </div>
              </li>

              <li class="block" v-if="info.whichstation == '北卡罗莱纳州'">
                <h5>高中毕业证书和成绩单（北卡罗莱纳州）：</h5>
                <div class="images">
                  <el-image
                    class="image"
                    :src="FILE_ROOT + info.highschoolcertificate"
                    :preview-src-list="[FILE_ROOT + info.highschoolcertificate]"
                  />
                  <el-image
                    class="image"
                    :src="FILE_ROOT + info.highschoolagree"
                    :preview-src-list="[FILE_ROOT + info.highschoolagree]"
                  />
                </div>
              </li>

              <li class="block" v-if="info.whichstation == '俄勒冈州'">
                <h5>3 个推荐人（俄勒冈州）：</h5>
                <p class="text">
                  <span>名字：{{ info.recommender1name }}</span>
                  <span>地址：{{ info.recommender1address }}</span>
                  <span>电话：{{ info.recommender1phone }}</span>
                </p>
                <p class="text">
                  <span>名字：{{ info.recommender2name }}</span>
                  <span>地址：{{ info.recommender2address }}</span>
                  <span>电话：{{ info.recommender2phone }}</span>
                </p>
                <p class="text">
                  <span>名字：{{ info.recommender3name }}</span>
                  <span>地址：{{ info.recommender3address }}</span>
                  <span>电话：{{ info.recommender3phone }}</span>
                </p>
              </li>

              <li class="block" v-if="info.whichstation == '田纳西州'">
                <h5>高中毕业证书和成绩单（北卡罗莱纳州）：</h5>
                <div class="images">
                  <el-image
                    class="image"
                    :src="FILE_ROOT + info.recommenderimg1"
                    :preview-src-list="[FILE_ROOT + info.highschoolagree]"
                  />
                  <el-image
                    class="image"
                    :src="FILE_ROOT + info.recommenderimg1"
                    :preview-src-list="[FILE_ROOT + info.highschoolagree]"
                  />
                </div>
              </li>

              <li class="block" v-if="info.whichstation == '马萨诸塞州'">
                <h5>专业和个人推荐人 （马萨诸塞州）：</h5>
                <p class="text">
                  <span>专业推荐人名字:{{ info.majorrecommender1name }}</span>
                  <span>地址：{{ info.majorrecommender1address }}</span>
                  <span>电话：{{ info.majorrecommender1phone }}</span>
                </p>
                <p class="text">
                  <span>个推荐人名字:{{ info.majorrecommender2name }}</span>
                  <span>地址：{{ info.majorrecommender3address }}</span>
                  <span>电话：{{ info.majorrecommender4phone }}</span>
                </p>
              </li>

              <li class="block">
                <h5>驾照：</h5>
                <div class="images">
                  <el-image
                    class="image"
                    :src="FILE_ROOT + info.driverlicensefrontimg"
                    :preview-src-list="[FILE_ROOT + info.driverlicensefrontimg]"
                  />
                  <el-image
                    class="image"
                    :src="FILE_ROOT + info.driverlicensebackimg"
                    :preview-src-list="[FILE_ROOT + info.driverlicensebackimg]"
                  />
                </div>
              </li>
              <li class="block">
                <h5>2x2照片(护照上使用的照片类型)：</h5>
                <div class="images">
                  <el-image
                    class="image"
                    :src="FILE_ROOT + info.passportimg"
                    :preview-src-list="[FILE_ROOT + info.passportimg]"
                  />
                </div>
              </li>
              <li class="block">
                <h5>银行卡：</h5>
                <div class="images">
                  <el-image
                    class="image"
                    :src="FILE_ROOT + info.bankcardfrontimg"
                    :preview-src-list="[FILE_ROOT + info.passportimg]"
                  />
                  <el-image
                    class="image"
                    :src="FILE_ROOT + info.bankcardbackimg"
                    :preview-src-list="[FILE_ROOT + info.bankcardbackimg]"
                  />
                </div>
              </li>
              <li class="block">
                <h5>更名照片：</h5>
                <div class="images">
                  <el-image
                    class="image"
                    :src="FILE_ROOT + info.changenamefileimg"
                    :preview-src-list="[FILE_ROOT + info.changenamefileimg]"
                  />
                </div>
              </li>
              <li class="block">
                <h5>公民身份或身份状态：</h5>
                <div class="images">
                  <el-image
                    class="image"
                    :src="FILE_ROOT + info.idcardfrontimg"
                    :preview-src-list="[FILE_ROOT + info.idcardfrontimg]"
                  />
                  <el-image
                    class="image"
                    :src="FILE_ROOT + info.idcardbackimg"
                    :preview-src-list="[FILE_ROOT + info.idcardbackimg]"
                  />
                </div>
              </li>
              <li class="block">
                <h5>社会安全号码(正反面照片)：</h5>
                <div class="images">
                  <el-image
                    class="image"
                    :src="FILE_ROOT + info.ssnfrontimg"
                    :preview-src-list="[FILE_ROOT + info.ssnfrontimg]"
                  />
                  <el-image
                    class="image"
                    :src="FILE_ROOT + info.ssnbackimg"
                    :preview-src-list="[FILE_ROOT + info.ssnbackimg]"
                  />
                </div>
              </li>
              <li class="block">
                <h5>cpr、aids、急救、基本生命支持卡/证书照片：</h5>
                <div class="images" v-if="info.cpraidsothercertificateimg">
                  <el-image
                    class="image"
                    :src="FILE_ROOT + info.cprimg"
                    :preview-src-list="[FILE_ROOT + info.cprimg]"
                  />
                  <el-image
                    class="image"
                    :src="FILE_ROOT + info.aidsimg"
                    :preview-src-list="[FILE_ROOT + info.aidsimg]"
                  />
                  <el-image
                    class="image"
                    :src="FILE_ROOT + info.firstaidimg"
                    :preview-src-list="[FILE_ROOT + info.firstaidimg]"
                  />
                  <el-image
                    class="image"
                    :src="FILE_ROOT + info.lifesupportcardimg"
                    :preview-src-list="[FILE_ROOT + info.lifesupportcardimg]"
                  />
                </div>
              </li>
            </ul>
          </el-tab-pane>
          <el-tab-pane label="电子协议" name="second">
            <ul class="tabs-list">
              <li>
                <h5>姓名：</h5>
                <p class="text">{{ info.username || "-" }}</p>
              </li>
              <li>
                <h5>协议内容（中文）：</h5>
                <p class="text">
                  本人，{{ info.username || "-" }}
                  （姓名），特此授权易北教育（https://ybmblex.net）代理申请执照/更新执照以及办理相关文件及手续的一切事宜。我将准确回答所有关于执照申请/执照更新的问题。如果我的回答与事实不符，我将承担一切法律责任和无法顺利获取执照的后果。
                </p>
              </li>
              <li>
                <h5>协议内容（英文）：</h5>
                <p class="text">
                  I, {{ info.username || "-" }}, hereby authorize
                  (https://ybmblex.net) to assist all matters regarding license
                  application/license renewal and related documents and
                  procedures. I will answer all questions regarding license
                  application/ license renewal accurately. In the event my
                  answer does not match with the authorities, I will bear all
                  legal responsibility and the result of being unable to acquire
                  the license.
                </p>
              </li>
              <li>
                <h5>是否在美国收过刑事罚单：</h5>
                <p class="text">
                  {{ info.iscriminalticketinusa == 1 ? "是" : "否" }}
                </p>
              </li>
              <li>
                <h5>是否曾经在美国被逮捕：</h5>
                <p class="text">
                  {{ info.isarrestinusa == 1 ? "是" : "否" }}
                </p>
              </li>

              <li class="block">
                <h5>签名：</h5>
                <div class="images">
                  <img
                    style="max-width: 200px; max-height: 150px; "
                    :src="FILE_ROOT + info.signimg"
                    alt=""
                  />
                </div>
              </li>
            </ul>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </section>
</template>

<script>
import { getLicenseInfo } from "@api/user";
import { FILE_ROOT, LICENSE_STEP, LICENSE_STATUS } from "@config";
export default {
  components: {},
  data() {
    return {
      id: null,
      info: {},
      params: {},
      activeName: "first",
      FILE_ROOT,
      LICENSE_STEP,
      LICENSE_STATUS,
      workExperience: [],
      updateNowLcense: [],
    };
  },

  methods: {
    /**
     * 获取详情
     */
    async queryInfo() {
      const { data: resData } = await getLicenseInfo(this.id);
      if (!resData.data.status) return;

      this.info = resData.data.data;

      // 更新执照-现在执照
      if (this.info.existinglicense)
        this.updateNowLcense = JSON.parse(this.info.existinglicense);

      // 申请执照-过去的工作经验
      if (this.info.lastsofworkingexperience)
        this.workExperience = JSON.parse(this.info.lastsofworkingexperience);

      this.$forceUpdate();
    },
  },

  async created() {
    if (this.$route.query.id) {
      // this.id = this.$route.query.id ;
      this.id = 12;
      this.params.username = this.$route.query.name;
      this.queryInfo();
    }
  },
};
</script>
