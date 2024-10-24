<style lang="scss" scope>
.details {
  &-info {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 15px;
    li {
      width: 33.333%;
      display: flex;
      align-items: center;
      height: 32px;
      span {
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.85);
        width: 70px;
      }
      p {
        font-size: 14px;
        padding-left: 5px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.65);
        &.share {
          color: #007aff;
          cursor: pointer;
        }
      }
      img {
        width: 29px;
        height: 29px;
        border-radius: 50%;
      }
    }
  }
  &-title {
    font-size: 18px;
    font-weight: bold;
    padding: 30px 0;
    color: #222;
    em {
      color: #555;
      font-size: 14px;
      font-style: normal;
    }
  }
  &-progress {
    padding-bottom: 30px;
  }
  &-timeline {
    padding-top: 20px;
    h4 {
      padding: 8px;
      font-size: 15px;
    }
    h5 {
      padding: 12px 8px;
      color: rgba(0, 0, 0, 0.65);
      font-weight: 500;
      font-size: 14px;
    }
    .row {
      font-size: 14px;
      padding: 8px;
      color: rgba(0, 0, 0, 0.65);
      display: flex;
      align-items: center;
      .prompt {
        display: flex;
        i {
          width: 48px;
          height: 28px;
          line-height: 28px;
          text-align: center;
          border-radius: 4px;
          border: 1px solid #fa5376;
          font-style: normal;
          font-size: 14px;
          font-weight: 400;
          color: #fa5376;
          margin-left: 20px;
          cursor: pointer;
        }
        p {
          font-size: 14px;
          font-weight: 400;
          color: #00d58a;
          line-height: 20px;
          margin-left: 20px;
          display: flex;
          align-items: center;
          &::before {
            content: "";
            width: 5px;
            height: 5px;
            background: #00d58a;
            margin-right: 5px;
            border-radius: 50%;
          }
        }
      }
      span {
        color: #007aff;
        font-weight: 600;
      }
      em {
        color: #000;
        font-style: normal;
        font-weight: 600;
        &.error {
          color: #fa5376;
        }
        &.finish {
          color: #00d58a;
        }
      }
    }
  }
  &-vip-list {
    padding: 30px 0 35px;
  }
}
</style>

<template>
  <section class="details public-edit public-body">
    <div class="public-edit-title">用户信息</div>

    <ul class="details-info">
      <li>
        <span>姓名：</span>
        <p>{{ userInfo.username || "-" }}</p>
      </li>
      <li>
        <span>手机号：</span>
        <p>{{ userInfo.phone || "-" }}</p>
      </li>
      <li>
        <span>邮箱：</span>
        <p>{{ userInfo.email || "-" }}</p>
      </li>
      <li>
        <span>注册时间：</span>
        <p>{{ userInfo.createdAt | formatDate }}</p>
      </li>
      <li>
        <span>用户等级：</span>
        <p>{{ levelList[userInfo.level] || "-" }}</p>
      </li>
      <li>
        <span>用户类型：</span>
        <p>
          {{ userInfo.categoryname || "-" }}
        </p>
      </li>
      <li>
        <span>状态：</span>
        <p>{{ userInfo.status ? "启用" : "禁用" }}</p>
      </li>
      <li>
        <span>家庭住址：</span>
        <p>{{ userInfo.address || "-" }}</p>
      </li>
      <li>
        <span>邮编：</span>
        <p>{{ userInfo.youbian || "-" }}</p>
      </li>
      <li>
        <span>{{ userInfo.level > 0 ? "会员到期" : "体验到期" }}</span>
        <p>{{ userInfo.endhydate | formatDate("YYYY-MM-DD") }}</p>
      </li>
      <li>
        <span>联系学员：</span>
        <p @click="handleChat" class="share">点击聊天</p>
      </li>
      <li>
        <span>备注：</span>
        <p>{{ userInfo.remark || "-" }}</p>
      </li>
      <li>
        <span>学习天数：</span>
        <!-- <p>{{ userInfo.logincount || "0" }}天</p> -->
        <p>0天</p>
      </li>
      <li>
        <span>学习小时：</span>
        <p>
          {{
            Math.floor(((userInfo.allstudytime || 0) / 60 / 60) * 100) / 100
          }}小时
        </p>
      </li>
      <li>
        <span>其他登录：</span>
        <p v-if="userInfo.openid_gg || userInfo.openid_wx">
          {{ userInfo.openid_gg ? "谷歌登录" : "" }}
          {{ userInfo.openid_gg && userInfo.openid_wx ? "|" : "" }}
          {{ userInfo.openid_wx ? "微信登录" : "" }}
        </p>
        <p v-else>-</p>
      </li>
      <li>
        <span>头像：</span>
        <img v-if="userInfo.avatar" :src="userInfo.avatar" alt="" />
        <p v-else>-</p>
      </li>
      <li>
        <span>昵称：</span>
        <p>
          {{ userInfo.nickname || "-" }}
        </p>
      </li>
      <li></li>
    </ul>

    <!-- 选项卡 -->
    <el-tabs type="border-card" v-loading="loading">
      <el-tab-pane label="课程学习进度（体验）">
        <div class="details-title" v-if="userProgress.status == 1">
          当前进度：已完成体验课程
        </div>
        <div class="details-title" v-else>
          当前进度： {{ nowTitle }} <em>（{{ nowSecondTitle }}）</em>
        </div>

        <!-- 进度 -->
        <div class="details-progress">
          <el-progress
            :text-inside="true"
            :percentage="allProgress"
            :stroke-width="20"
            color="#00D489"
          ></el-progress>
        </div>

        <!-- <el-select
          style="width: 240px"
          v-model="studyParams.courseid"
          @change="queryStudyList"
          size="small"
          clearable
          placeholder="请选择课程"
        >
          <el-option
            v-for="(item, index) in courseList"
            :key="index"
            :label="item.title"
            :value="item.id"
          >
          </el-option>
        </el-select> -->

        <div class="details-timeline">
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in studyList"
              :key="index"
              :timestamp="item.chapterName"
              placement="top"
            >
              <el-card>
                <div class="account-timeline-item">
                  <!-- <h4>{{ item.chapterName }}</h4> -->
                  <div
                    v-for="(son, key) in item.courseChapterList"
                    :key="key"
                    class="row"
                  >
                    <span v-if="son.remarkObj"
                      >{{
                        STUDY_TYPE[son.remarkObj.type] || "章节测试完成"
                      }}完成，正确{{ son.remarkObj.correctcount }}道题，错误{{
                        son.remarkObj.errorcount
                      }}道题，得分{{
                        Math.floor(
                          (son.remarkObj.correctcount /
                            son.remarkObj.allcount) *
                            100
                        )
                      }}%</span
                    >
                    <span v-else>{{ son.remark }}</span>
                    ，状态：<em
                      v-if="son.remarkObj"
                      :class="{
                        finish: son.remarkObj.status == 1,
                        error: son.remarkObj.status == 2,
                      }"
                      >{{ son.remarkObj.status == 1 ? "通过" : "未通过" }}</em
                    >
                    <em v-else class="finish">{{ son.status }}</em
                    >【{{ son.ipaddress || "-" }}】时间：
                    <p class="time">{{ son.createdAt | formatDate }}</p>
                  </div>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>

          <!-- 分页 -->
          <div class="pagination-algin" v-if="total > PAGE_SIZE">
            <el-pagination
              @size-change="handleSizeChange(arguments, 'study')"
              @current-change="handleCurrentChange(arguments, 'study')"
              :current-page="pages.pageindex"
              :page-sizes="[PAGE_SIZE, 30, 50, 100, 200]"
              :page-size="pages.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="学习历史记录">
        <el-table :data="studyHistory" border size="small" style="width: 100%">
          <el-table-column align="center" type="index" label="序号">
          </el-table-column>

          <el-table-column align="center" label="课程">
            <template slot-scope="scope">
              {{
                (scope.row.yibei_course && scope.row.yibei_course.title) || "-"
              }}
            </template>
          </el-table-column>

          <el-table-column align="center" label="章节">
            <template slot-scope="scope">
              {{
                (scope.row.yibei_course_chapter &&
                  scope.row.yibei_course_chapter.title) ||
                  "-"
              }}
            </template>
          </el-table-column>

          <el-table-column align="center" label="内容">
            <template slot-scope="scope">
              {{ studyHistoryType[scope.row.category] }}
            </template>
          </el-table-column>

          <el-table-column align="center" label="进入时间">
            <template slot-scope="scope">
              {{ scope.row.startdate | formatDate("YYYY-MM-DD HH:mm") }}
            </template>
          </el-table-column>

          <el-table-column align="center" label="离开时间">
            <template slot-scope="scope">
              {{ scope.row.enddate | formatDate("YYYY-MM-DD HH:mm") }}
            </template>
          </el-table-column>

          <el-table-column align="center" label="停留时长">
            <template slot-scope="scope">
              {{ scope.row.minutes || "0" }}分钟
            </template>
          </el-table-column>

          <el-table-column align="center" prop="remark" label="备注">
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination-algin" v-if="historyTotal > PAGE_SIZE">
          <el-pagination
            @size-change="handleSizeChange(arguments, 'history')"
            @current-change="handleCurrentChange(arguments, 'history')"
            :current-page="historyPages.pageindex"
            :page-sizes="[PAGE_SIZE, 30, 50, 100, 200]"
            :page-size="historyPages.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="historyTotal"
          >
          </el-pagination>
        </div>
      </el-tab-pane>

      <el-tab-pane label="会员开通记录">
        <div class="details-vip-list">
          <el-table :data="vipLog" border size="small" style="width: 100%">
            <el-table-column prop="ordercode" align="center" label="订单号">
              <template slot-scope="scope">
                {{ scope.row.ordercode || "-" }}
              </template>
            </el-table-column>
            <el-table-column prop="category" label="类型">
              <template slot-scope="scope">
                {{ VIP_LOG_TYPE[scope.row.category] }}
              </template>
            </el-table-column>
            <el-table-column prop="fee" label="金额"> </el-table-column>
            <el-table-column prop="datecount" label="赠送时长">
              <template slot-scope="scope">
                {{ scope.row.datecount }}天
              </template>
            </el-table-column>
            <el-table-column prop="enddate" label="操作时间">
              <template slot-scope="scope">
                {{ scope.row.createdAt | formatDate("YYYY-MM-DD") }}
              </template>
            </el-table-column>
            <el-table-column prop="enddate" label="到期时间">
              <template slot-scope="scope">
                {{ scope.row.enddate | formatDate("YYYY-MM-DD") }}
              </template>
            </el-table-column>

            <el-table-column prop="remark" label="备注"> </el-table-column>
          </el-table>
          <el-button
            style="margin-top: 20px"
            size="small"
            @click="dialogFormVisible = true"
            type="warning"
            >赠送（加减）</el-button
          >
        </div>
      </el-tab-pane>
      <el-tab-pane label="登入记录">
        <div class="details-vip-list">
          <el-table :data="loginList" border size="small" style="width: 100%">
            <el-table-column align="center" type="index" label="序号">
            </el-table-column>

            <el-table-column align="center" prop="ipaddress" label="ip地址">
            </el-table-column>

            <el-table-column align="center" label="ip城市">
              <template slot-scope="scope">
                <span
                  :class="{ 'table-row--green': scope.row.devicecate == 1 }"
                  >{{ scope.row.logincity }}</span
                >
              </template>
            </el-table-column>

            <el-table-column align="center" prop="lng" label="经度">
            </el-table-column>

            <el-table-column align="center" prop="lat" label="纬度">
            </el-table-column>

            <el-table-column align="center" label="定位地址">
              <template slot-scope="scope">
                <span
                  :class="{
                    'table-row--green':
                      scope.row.devicecate == 2 || scope.row.devicecate == 3,
                  }"
                  >{{ scope.row.address }}</span
                >
              </template>
            </el-table-column>

            <el-table-column align="center" label="距离上次">
              <template slot-scope="scope">
                {{ scope.row.distanceyl || 0 }}mi
              </template>
            </el-table-column>

            <el-table-column align="center" prop="devicecate" label="登录方式">
              <template slot-scope="scope">
                {{ loginType[scope.row.logincate] || "-" }}
              </template>
            </el-table-column>

            <el-table-column align="center" prop="devicecate" label="登录设备">
              <template slot-scope="scope">
                {{ category[scope.row.devicecate] }}
              </template>
            </el-table-column>

            <el-table-column align="center" prop="enddate" label="登录时间">
              <template slot-scope="scope">
                {{ scope.row.createdAt | formatDate }}
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 分页 -->
        <div class="pagination-algin" v-if="loginTotal > PAGE_SIZE">
          <el-pagination
            @size-change="handleSizeChange(arguments, 'login')"
            @current-change="handleCurrentChange(arguments, 'login')"
            :current-page="loginPages.pageindex"
            :page-sizes="[PAGE_SIZE, 30, 50, 100, 200]"
            :page-size="loginPages.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="loginTotal"
          >
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="登入IP统计">
        <div class="details-vip-list">
          <el-table
            :data="ipStaticsList"
            border
            size="small"
            style="width: 100%"
          >
            <el-table-column align="center" type="index" label="序号">
            </el-table-column>

            <el-table-column align="center" prop="ipaddress" label="ip地址">
            </el-table-column>

            <!-- <el-table-column align="center" prop="logincity" label="登录城市">
            </el-table-column>

              <el-table-column align="center" prop="devicecate" label="登录设备">
              <template slot-scope="scope">
                {{ category[scope.row.devicecate] }}
              </template>
            </el-table-column> -->

            <el-table-column align="center" prop="logincount" label="次数">
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      title="赠送会员时间"
      width="550px"
      :visible.sync="dialogFormVisible"
    >
      <el-form label-width="130px">
        <el-form-item label="赠送时长（天）" required>
          <el-input
            type="number"
            placeholder="请输入天数"
            v-model="vipDates"
            clearable
            style="max-width: 240px"
          />
        </el-form-item>
        <el-form-item label="赠送备注" required>
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入赠送备注"
            maxlength="200"
            v-model="vipDatesRemark"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="verifyCode">
          <el-input
            type="number"
            placeholder="请输入验证码"
            v-model="verifyCode"
            clearable
            style="max-width: 95%"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitVipTime">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog width="550px" :visible.sync="chatVisible">
      <Chat :frindId="userInfo.id" :userName="userInfo.username" />
    </el-dialog>
  </section>
</template>

<script>
import {
  getMemberInfo,
  getMemberStudyList,
  getMemberstudyCourse,
  getMemberVipLog,
  giveVipDates,
  getMemberLoginList,
  getLoginIpStatics,
} from "@api/member";
import { getCourseList, getCourseChapterTree } from "@api/course";
import { getStudyHistory } from "@api/user";
import { PAGE_SIZE, USER_LEVEL, STUDY_TYPE, VIP_LOG_TYPE } from "@config";
import { dateDiff } from "@utils/tools";
import Chat from "@comp/Chat";

export default {
  components: { Chat },

  data() {
    return {
      userInfo: {},
      params: {},
      levelList: USER_LEVEL,

      memberProgress: {},

      pages: {
        pageindex: 1,
        pagesize: PAGE_SIZE,
      },
      PAGE_SIZE,
      total: 0,
      studyList: [],
      studyParams: {
        courseid: null,
      },
      loading: false,

      userProgress: {},
      allProgress: 0,

      allChapter: 0,
      alreadyChapter: 0,

      nowTitle: "未开始学习",
      nowSecondTitle: "暂无",

      vipLog: [],

      vipDates: null,
      vipDatesRemark: "",
      verifyCode: "",

      dialogFormVisible: false,

      courseList: [],

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

      category: {
        1: "电脑",
        2: "手机",
        3: "平板",
      },

      ipStaticsList: [],

      historyPages: {
        pageindex: 1,
        pagesize: PAGE_SIZE,
      },
      historyTotal: 0,
      studyHistory: [], // 学习历史
      studyHistoryType: {
        1: "视频学习",
        2: "关键词学习（中英）",
        3: "关键词测试（中英）",
        4: "关键词学习（英）",
        5: "关键词测试（英）",
        6: "单元测试",
        7: "单元测试（测前关键词）",
        8: "我的错题（测前单词）",
        9: "我的错题测试",
        10: "高频错题（测前单词）",
        11: "高频错题测试",
        12: "综合题（测前单词）",
        13: "综合题测试",
      },

      chatVisible: false,
    };
  },

  methods: {
    /**
     * 获取会员详情
     */
    async queryInfo() {
      const { data: resData } = await getMemberInfo(this.params.memberid);
      if (!resData.data.status) return;

      this.userInfo = resData.data.info[0];
    },

    /**
     * 赠送会员时间
     */
    handleSubmitVipTime() {
      if (!this.vipDates) return this.$message.error("请填写赠送时间！");
      if (!this.vipDatesRemark) return this.$message.error("请填写备注！");

      this.$confirm("确认赠送会员时间", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: resData } = await giveVipDates({
            memberid: this.params.memberid,
            date: this.vipDates,
            remark: this.vipDatesRemark,
            verifyCode: this.verifyCode,
          });

          if (!resData.data.status) return;
          this.queryVipLog();
          this.queryInfo();
          this.$message.success("赠送成功！");
          this.dialogFormVisible = false;
        })
        .catch(() => {});
    },

    /**
     * 获取用户的学习记录
     */
    async queryStudyList() {
      this.loading = true;

      const { data: resData } = await getMemberStudyList(
        { ...this.studyParams, ...this.params },
        this.pages
      );

      this.loading = false;

      if (!resData.data.status) return;

      //格式化remark
      this.studyList = resData.data.dataList.map((item) => {
        if (item.courseChapterList)
          item.courseChapterList.map((son) => {
            if (son.remark.length > 40) {
              son.remarkObj = JSON.parse(son.remark);
            }
            return son;
          });
        return item;
      });

      this.total = resData.data.count;
    },

    /**
     * 获取课程列表 （0：免费   1：付费）
     */
    async queryCourseTreeList() {
      let isStudy = true; //是否学习过
      let isStudyIndex = 0;

      //没有进度时
      if (!this.userProgress) return;

      const { data: resData } = await getCourseChapterTree(0);

      if (!resData.data.status) return;

      resData.data.dataList.forEach((item) => {
        //章节
        if (!item.yibei_course_chapter) return;

        //章节是否已经学习
        item.yibei_course_chapter.forEach((son) => {
          //计算所有小节数量
          this.allChapter++;

          if (
            this.userProgress.currentcoursechapterid == son.id ||
            !this.userProgress.currentcoursechapterid
          ) {
            son.isStudy = isStudy;
            //今日任务
            if (isStudy == true) {
              this.nowTitle = item.title;
              this.nowSecondTitle = son.title;
            }
            isStudy = false;
          } else {
            son.isStudy = isStudy;
          }

          //计算已学习的章节
          if (isStudy == true) {
            this.alreadyChapter++;
          }

          // if (this.userProgress.completecoursecount == isStudyIndex)
          //   son.isStudy = true;

          isStudyIndex++;
        });
      });

      this.courseList = resData.data.dataList;

      //总进度
      this.allProgress =
        Math.floor((this.alreadyChapter / this.allChapter) * 1000) / 10;

      if (this.userProgress.status == 1) this.allProgress = 100;
    },

    /**
     * 获取会员学习进度（0：免费   1：付费）
     */
    async queryMemberstudyCourse() {
      const { data: resData } = await getMemberstudyCourse(
        this.params.memberid,
        0
      );

      if (!resData.data.status) return;

      this.userProgress = resData.data.studyProgressList[0];
    },

    /**
     * 获取课程列表
     */
    async queryCourseList() {
      this.loading = true;

      const { data: resData } = await getCourseList(this.params, this.pages);
      if (!resData.data.status) return;

      this.loading = false;

      this.courseList = resData.data.data.rows;
    },

    /**
     * 获取会员开通记录
     */
    async queryVipLog() {
      const { data: resData } = await getMemberVipLog(this.params.memberid);

      if (!resData.data.status) return;

      this.vipLog = resData.data.data;
    },

    /**
     * ip统计记录
     */
    async queryIpStatics() {
      const { data: resData } = await getLoginIpStatics(this.params.memberid);

      if (!resData.data.status) return;

      this.ipStaticsList = resData.data.data;
    },

    /**
     * 获取用户的登录记录
     */
    async queryMemberLoginList() {
      this.loading = true;

      const { data: resData } = await getMemberLoginList(
        this.params.memberid,
        this.loginPages
      );
      this.loading = false;
      if (!resData.data.status) return;

      this.loginTotal = resData.data.data.count;
      this.loginList = resData.data.data.rows;
    },

    /**
     * 获取学习历史记录
     */
    async queryStudyHistory() {
      const { data: resData } = await getStudyHistory(
        this.params.memberid,
        this.historyPages
      );
      if (!resData.data.status) return;

      this.historyTotal = resData.data.data.count;
      this.studyHistory = resData.data.data.rows.map((item) => {
        if (item.enddate && item.startdate)
          item.minutes = dateDiff(item.startdate, item.enddate, "seconds") || 1;

        return item;
      });
    },

    /**
     * pageSize 改变时会触发
     */
    handleSizeChange(args, type) {
      switch (type) {
        case "study":
          this.pages.pagesize = args[0];
          this.pages.pageindex = 1;
          this.queryStudyList();
          break;

        case "login":
          this.loginPages.pagesize = args[0];
          this.loginPages.pageindex = 1;
          this.queryMemberLoginList();
          break;

        case "history":
          this.historyPages.pagesize = args[0];
          this.historyPages.pageindex = 1;
          this.queryStudyHistory();
          break;

        default:
          break;
      }
    },

    /**
     * pageindex 改变时会触发
     */
    handleCurrentChange(args, type) {
      switch (type) {
        case "study":
          this.pages.pageindex = args[0];
          this.queryStudyList();
          break;

        case "login":
          this.loginPages.pageindex = args[0];
          this.queryMemberLoginList();
          break;

        case "history":
          this.historyPages.pageindex = args[0];
          this.queryStudyHistory();
          break;

        default:
          break;
      }
    },

    /**
     * 聊天
     */
    handleChat() {
      this.chatVisible = true;
    },
  },

  async created() {
    if (this.$route.query.id) {
      this.params.memberid = this.$route.query.id;
      this.queryInfo();
      this.queryStudyList();
      this.queryCourseList();

      this.queryVipLog();
      this.queryMemberLoginList();
      this.queryIpStatics();
      this.queryStudyHistory();

      await this.queryMemberstudyCourse();
      this.queryCourseTreeList();
    }
  },
};
</script>
