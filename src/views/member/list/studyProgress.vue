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
        .im {
          color: #007aff;
          font-style: normal;
          margin-left: 2px;
          padding: 0 5px;
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
    padding-bottom: 30px;
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
    &-btn {
      display: flex;
      justify-content: flex-end;
      padding-bottom: 10px;
    }
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
      flex-wrap: wrap;
      line-height: 1.6;
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
      .time {
        margin-right: 10px;
      }
      span {
        color: #007aff;
        font-weight: 600;
        &.to-view {
          cursor: pointer;
          color: #0176df;
          i {
            font-size: 12px;
            margin-left: 3px;
          }
        }
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

  .el-radio-group {
    width: 100%;
    .el-radio {
      display: flex;
      align-items: center;
      line-height: 1.4;
    }
  }
}
.table-row--green {
  color: #00d58a;
}
.pay-else-count {
  background-color: #ffa61f;
  color: #fff;
  font-size: 10px;
  font-style: normal;
  border-radius: 5px;
  padding: 1px 5px;
  margin-left: 2px;
  cursor: pointer;
}

::v-deep .el-dialog__body {
  padding-top: 10px;
}

.study-log-list {
  padding: 30px 0 20px;
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
      <el-breadcrumb-item>课程学习进度</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="member-details-table">
      <div class="details-title" v-if="userProgress.status == 1">
        当前进度：已全部完成
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

      <template v-if="level > 0">
        <el-select
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
        </el-select>
        <el-button
          style="margin-left: 20px"
          size="small"
          @click="scheduleEditShow = true"
          type="warning"
          >手动修改进度</el-button
        >
        <el-button
          style="margin-left: 20px"
          size="small"
          @click="handleResetReview"
          type="danger"
          >手动重置复习</el-button
        >
      </template>

      <div class="study-log-list">
        <el-table
          :data="studyLogList"
          border
          size="small"
          style="width: 100%"
          v-loading="studyLogLoadin"
        >
          <el-table-column
            align="center"
            label="分类"
            min-width="100"
            prop="title"
          >
          </el-table-column>
          <el-table-column align="center" label="总通过率" min-width="100">
            <template slot-scope="scope">
              <el-tag type="success" size="small" v-if="scope.row.all >= 90"
                >{{ scope.row.allGrade }}%</el-tag
              >
              <el-tag type="info" size="small" v-else
                >{{ scope.row.allGrade }}%</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column align="center" label="总时长" min-width="100">
            <template slot-scope="scope"> {{ scope.row.allTime }}时 </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="关键词测试（中英）"
            min-width="140"
          >
            <el-table-column prop="name" label="通过率">
              <template slot-scope="scope">
                {{ scope.row.wordZnEn }}%
              </template>
            </el-table-column>
            <el-table-column prop="province" label="时长">
              <template slot-scope="scope">
                {{ scope.row.wordZnEnTime }}时
              </template></el-table-column
            >
          </el-table-column>
          <el-table-column
            align="center"
            label="关键词测试（英）"
            min-width="120"
          >
            <el-table-column prop="name" label="通过率">
              <template slot-scope="scope"> {{ scope.row.wordEn }}% </template>
            </el-table-column>
            <el-table-column prop="province" label="时长">
              <template slot-scope="scope">
                {{ scope.row.wordEnTime }}时
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            align="center"
            label="章节测试前（关键词）"
            min-width="150"
          >
            <el-table-column prop="name" label="通过率">
              <template slot-scope="scope">
                {{ scope.row.chapterTestWord }}%
              </template>
            </el-table-column>
            <el-table-column prop="province" label="时长">
              <template slot-scope="scope">
                {{ scope.row.chapterTestWordTime }}时
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="章节测试" min-width="140">
            <el-table-column prop="name" label="通过率">
              <template slot-scope="scope">
                {{ scope.row.chapterTest }}%
              </template>
            </el-table-column>
            <el-table-column prop="province" label="时长">
              <template slot-scope="scope">
                {{ scope.row.chapterTestTime }}时
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            align="center"
            label="我的错题（测前单词）"
            min-width="150"
          >
            <el-table-column prop="name" label="通过率">
              <template slot-scope="scope">
                {{ scope.row.errorTestWord }}%
              </template>
            </el-table-column>
            <el-table-column prop="province" label="时长">
              <template slot-scope="scope">
                {{ scope.row.errorTestWordTime }}时
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="我的错题测试" min-width="120">
            <el-table-column prop="name" label="通过率">
              <template slot-scope="scope">
                {{ scope.row.errorTest }}%
              </template>
            </el-table-column>
            <el-table-column prop="province" label="时长">
              <template slot-scope="scope">
                {{ scope.row.errorTestTime }}时
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            align="center"
            label="高频错题（测前单词）"
            min-width="150"
          >
            <el-table-column prop="name" label="通过率">
              <template slot-scope="scope">
                {{ scope.row.highTestWord }}%
              </template>
            </el-table-column>
            <el-table-column prop="province" label="时长">
              <template slot-scope="scope">
                {{ scope.row.highTestWordTime }}时
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="高频错题测试" min-width="120">
            <el-table-column prop="name" label="通过率">
              <template slot-scope="scope">
                {{ scope.row.highTest }}%
              </template>
            </el-table-column>
            <el-table-column prop="province" label="时长">
              <template slot-scope="scope">
                {{ scope.row.highTestTime }}时
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            align="center"
            label="综合题（测前单词）"
            min-width="130"
          >
            <el-table-column prop="name" label="通过率">
              <template slot-scope="scope">
                {{ scope.row.compositeTestWord }}%
              </template>
            </el-table-column>
            <el-table-column prop="province" label="时长">
              <template slot-scope="scope">
                {{ scope.row.compositeTestWordTime }}时
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            align="center"
            label="综合题测试"
            min-width="120"
            prop="compositeTest"
          >
            <el-table-column prop="name" label="通过率">
              <template slot-scope="scope">
                {{ scope.row.compositeTest }}%
              </template>
            </el-table-column>
            <el-table-column prop="province" label="时长">
              <template slot-scope="scope">
                {{ scope.row.compositeTestTime }}时
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>

      <div class="details-timeline" v-loading="loading">
        <div class="details-timeline-btn">
          <el-button
            size="small"
            @click="handleExportStudy"
            type="primary"
            plain
            >导出学习记录</el-button
          >
        </div>
        <el-timeline>
          <el-timeline-item
            v-for="(item, index) in studyList"
            :key="index"
            :timestamp="
              item.chapterid > 0
                ? item.chapterName
                : item.chapterid == -1
                ? '应变测试'
                : '综合测试'
            "
            placement="top"
          >
            <el-card>
              <div class="account-timeline-item">
                <!-- <h4>{{ item.chapterName }}</h4> -->
                <div
                  v-for="(son, key) in item.courseChapterList"
                  :key="key"
                  class="row"
                  v-show="son.remark || son.remarkObj"
                >
                  <span v-if="son.remarkObj"
                    >{{
                      STUDY_TYPE[son.remarkObj.type] || "章节测试"
                    }}完成，正确{{ son.remarkObj.correctcount }}道题，错误{{
                      son.remarkObj.errorcount
                    }}道题，用时：{{ son.remarkObj.timing }}分钟，得分{{
                      Math.floor(
                        (son.remarkObj.correctcount / son.remarkObj.allcount) *
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
                    >{{ son.remarkObj.status == 1 ? "通过" : "未通过" }}
                  </em>
                  <em v-else class="finish">{{ son.status }}</em
                  >【{{ son.ipaddress || "-" }} ，{{ son.place || "-" }}】时间：
                  <p class="time">{{ son.createdAt | formatDate }}</p>
                  <span
                    v-if="son.remarkObj && son.remarkObj.isShow"
                    @click="handleOpenTest(son.remarkObj)"
                    class="to-view"
                    >答题记录<i class="el-icon-arrow-right"></i
                  ></span>
                </div>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>

      <!-- 分页 -->
      <div class="pagination-algin" v-if="total > PAGE_SIZE">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pages.pageindex"
          :page-sizes="[PAGE_SIZE, 30, 50, 100, 200]"
          :page-size="pages.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>

    <!-- 手动修改用户进度 -->
    <el-dialog
      title="手动修改用户进度"
      width="550px"
      :visible.sync="scheduleEditShow"
    >
      <el-form label-width="130px">
        <el-form-item label="选择课程" required>
          <el-select
            style="width: 300px"
            v-model="scheduleEditParams.currentcoursechapterid"
            placeholder="请选择课程"
          >
            <el-option-group
              v-for="group in courseChapterTree"
              :key="group.id"
              :label="group.title"
            >
              <el-option
                v-for="item in group.yibei_course_chapter"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              >
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="总进度状态" required>
          <el-select
            style="width: 300px"
            v-model="scheduleEditParams.status"
            @change="queryStudyList"
            placeholder="请选择课程"
          >
            <el-option label="学习中" :value="0"> </el-option>
            <el-option label="已完成" :value="1"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="注" required>
          <div>修改学习用户进度时，需谨慎操作！</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitScheduleEdit"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 学员答题详情 -->
    <el-dialog
      title="答题记录"
      :visible.sync="answerVisible"
      :before-close="handleAnswerClose"
      width="90%"
      top="5vh"
    >
      <div class="test-results-list" v-loading="answerLoading">
        <div class="topic" v-for="(item, index) in answerList" :key="index">
          <div class="topic-title">
            {{ index + 1 }}、
            <div v-html="item.title"></div>
          </div>
          <div class="topic-answer">
            <el-radio-group v-model="item.memberanswser">
              <div
                v-for="(son, key) in item.yibei_requestion_const_option"
                :key="key"
                :class="[
                  'topic-answer-item',
                  { correct: item.status == 2 && son.iscorrectoption == 1 },
                  { error: item.status == 2 && son.id == item.memberanswser },
                  {
                    yes:
                      son.iscorrectoption == 1 && son.id == item.memberanswser,
                  },
                ]"
              >
                <el-radio :label="son.id">
                  <div v-html="son.content"></div>
                </el-radio>
              </div>
            </el-radio-group>
          </div>

          <div
            :class="[
              'topic-parsing',
              {
                error: item.status == 2,
              },
            ]"
          >
            {{ item.status == 2 ? "错误" : "正确" }}
          </div>
        </div>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import {
  getMemberStudyList,
  getMemberstudyCourse,
  updateStudyProgress,
  resetReview,
  getStudyLogStatistics,
} from "@api/member";
import {
  getCourseList,
  getCourseChapterTree,
  getMemberStudyLogs,
  getTestResults,
  getMyTestResults,
  getAllTestResults,
  getComTestResults,
  getTestBeforeWord,
} from "@api/course";
import {
  PAGE_SIZE,
  USER_LEVEL,
  STUDY_TYPE,
  VIP_LOG_TYPE,
  IM_WEBSOCKET_URL,
} from "@config";
import { dateDiff, formatDateTime } from "@utils/tools";

export default {
  components: {},

  data() {
    return {
      params: {},
      studyList: [],
      studyParams: {
        courseid: null,
      },

      answerVisible: false,
      answerLoading: false,
      answerList: [],

      userProgress: {},
      allProgress: 0,

      allChapter: 0,
      alreadyChapter: 0,

      nowTitle: "未开始学习",
      nowSecondTitle: "暂无",
      PAGE_SIZE,
      STUDY_TYPE,
      pages: {
        pageindex: 1,
        pagesize: PAGE_SIZE,
      },
      loading: false,
      total: 0,

      courseList: [],

      scheduleEditShow: false,
      courseChapterTree: [],
      scheduleEditParams: {
        status: 0, //总进度状态： 0：进行中 1：已完成
      },

      level: 0,

      studyLogList: [{ title: "全部" }, { title: "近期" }], // 学习历史统计
      studyLogLoadin: true,
    };
  },

  methods: {
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

      this.total = resData.data.count;

      //格式化remark
      this.studyList = resData.data.dataList.map((item) => {
        if (item.courseChapterList)
          item.courseChapterList.map((son) => {
            if (son.remark.length > 40) {
              son.remarkObj = JSON.parse(son.remark);

              // 章节测试-答题记录显示
              if (son.remarkObj && son.remarkObj.type == 0) {
                son.remarkObj.isShow = 1;
              }

              // 其他测试及关键词-答题记录显示
              // 3:章节测前（关键词）  4:我错题测试  5:综合测试  6:高频测试
              // 7:我错题测前（关键词） 8:综合测前（关键词） 9:高频测前（关键词）
              //  10: 应变测试前（关键词） 11: 应变测试
              if (
                son.remarkObj &&
                (son.remarkObj.type == 3 ||
                  son.remarkObj.type == 4 ||
                  son.remarkObj.type == 5 ||
                  son.remarkObj.type == 6 ||
                  son.remarkObj.type == 7 ||
                  son.remarkObj.type == 8 ||
                  son.remarkObj.type == 9 ||
                  son.remarkObj.type == 10 ||
                  son.remarkObj.type == 11)
              ) {
                // 时间：1630944000000  2021-9-7后的才有答题id
                if (
                  new Date(formatDateTime(son.createdAt)).getTime() >
                  1630944000000
                ) {
                  son.remarkObj.isShow = 1;
                }
              }

              //计算测试用时（分钟）
              son.remarkObj.timing = (
                dateDiff(
                  son.remarkObj.startdate,
                  son.remarkObj.enddate,
                  "seconds"
                ) / 60
              ).toFixed(2);
            }

            return son;
          });
        return item;
      });
    },
    /**
     *  获取会员学习进度（0：免费   1：付费）
     */
    async queryMemberstudyCourse() {
      const { data: resData } = await getMemberstudyCourse(
        this.params.memberid,
        this.level
      );

      if (!resData.data.status) return;

      this.userProgress = resData.data.studyProgressList[0];
    },

    /**
     * 重置复习
     */
    handleResetReview() {
      this.$confirm("是否重置复习？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: resData } = await resetReview(this.params.memberid);
          if (!resData.data.status) return;

          this.$message.success("重置成功");
        })
        .catch(() => {});
    },

    /**
     * 修改会员学习进度
     */
    handleSubmitScheduleEdit() {
      this.$confirm("确认修改学习进度", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          //进度类型  0:试听，1：免费
          this.level > 0
            ? (this.scheduleEditParams.type = 1)
            : (this.scheduleEditParams.type = 0);

          //获取课程id
          this.courseChapterTree.forEach((item) => {
            if (
              item.yibei_course_chapter.find(
                (a) => a.id == this.scheduleEditParams.currentcoursechapterid
              )
            )
              this.scheduleEditParams.currentcourseid = item.id;
          });

          const { data: resData } = await updateStudyProgress({
            ...this.scheduleEditParams,
            memberid: this.params.memberid,
          });
          if (!resData.data.status) return;

          this.$message.success("学习进度，修改成功！");

          //更新页面
          await this.queryMemberstudyCourse();
          this.queryCourseTreeList();

          this.scheduleEditShow = false;
        })
        .catch(() => {});
    },

    /**
     * 获取课程列表
     */
    async queryCourseList() {
      const { data: resData } = await getCourseList(this.params);
      if (!resData.data.status) return;

      this.courseList = resData.data.data.rows;
    },

    /**
     * 获取课程列表树
     */
    async queryCourseTreeList() {
      let isStudy = true; //是否学习过
      let isStudyIndex = 0;
      this.alreadyChapter = 0;
      this.allChapter = 0;

      const { data: resData } = await getCourseChapterTree(this.level);
      if (!resData.data.status) return;

      this.courseChapterTree = resData.data.dataList;

      //没有进度时
      if (!this.userProgress) return;

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
          if (son.isStudy == true) {
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
     * 获取学习记录的统计数据
     * @category 0:全部 1：近期
     */
    async queryStudyLogStatistics(category) {
      this.studyLogLoadin = true;

      const { data: resData } = await getStudyLogStatistics({
        memberid: this.params.memberid,
        category,
      });
      if (category == 0) this.studyLogLoadin = false;
      if (!resData.data.status) {
        this.studyLogLoadin = false;
        return;
      }

      this.handleStudyLog(resData.data.data, category);
    },

    /**
     * 关闭加高
     */
    handleAnswerClose() {
      this.answerVisible = false;
      this.summaryStudyVisible = false;
    },

    /**
     * 处理学习记录的数据转换
     */
    handleStudyLog(list, index) {
      let allNnu = 0,
        allPass = 0,
        allGrade = 0,
        allTime = 0,
        wordZnEn = 0,
        wordZnEnTime = 0,
        wordEn = 0,
        wordEnTime = 0,
        chapterTestWord = 0,
        chapterTestWordTime = 0,
        chapterTest = 0,
        chapterTestTime = 0,
        errorTestWord = 0,
        errorTestWordTime = 0,
        errorTest = 0,
        errorTestTime = 0,
        highTestWord = 0,
        highTestWordTime = 0,
        highTest = 0,
        highTestTime = 0,
        compositeTestWord = 0,
        compositeTestWordTime = 0,
        compositeTest = 0,
        compositeTestTime = 0;

      list.forEach((item) => {
        // 统计全部的成绩
        if (item.allcount) {
          allNnu += item.allcount;
          allPass += item.tccount;
        }

        // 统计全部的时长
        if (item.allstudytimes) {
          allTime += item.allstudytimes;
        }

        if (item.type == 0 && item.allcount > 0) {
          chapterTest =
            Math.floor((item.tccount / item.allcount) * 10000) / 100;
          chapterTestTime =
            Math.floor((item.allstudytimes / 60 / 60) * 100) / 100;
        }

        if (item.type == 1 && item.allcount > 0) {
          wordZnEn = Math.floor((item.tccount / item.allcount) * 10000) / 100;
          wordZnEnTime = Math.floor((item.allstudytimes / 60 / 60) * 100) / 100;
        }

        if (item.type == 2 && item.allcount > 0) {
          wordEn = Math.floor((item.tccount / item.allcount) * 10000) / 100;
          wordEnTime = Math.floor((item.allstudytimes / 60 / 60) * 100) / 100;
        }

        if (item.type == 3 && item.allcount > 0) {
          chapterTestWord =
            Math.floor((item.tccount / item.allcount) * 10000) / 100;
          chapterTestWordTime =
            Math.floor((item.allstudytimes / 60 / 60) * 100) / 100;
        }

        if (item.type == 4 && item.allcount > 0) {
          errorTest = Math.floor((item.tccount / item.allcount) * 10000) / 100;
          errorTestTime =
            Math.floor((item.allstudytimes / 60 / 60) * 100) / 100;
        }

        if (item.type == 5 && item.allcount > 0) {
          compositeTest =
            Math.floor((item.tccount / item.allcount) * 10000) / 100;
          compositeTestTime =
            Math.floor((item.allstudytimes / 60 / 60) * 100) / 100;
        }

        if (item.type == 6 && item.allcount > 0) {
          highTest = Math.floor((item.tccount / item.allcount) * 100) / 100;
          highTestTime = Math.floor((item.allstudytimes / 60 / 60) * 100) / 100;
        }

        if (item.type == 7 && item.allcount > 0) {
          errorTestWord =
            Math.floor((item.tccount / item.allcount) * 10000) / 100;
          errorTestWordTime =
            Math.floor((item.allstudytimes / 60 / 60) * 100) / 100;
        }

        if (item.type == 8 && item.allcount > 0) {
          compositeTestWord =
            Math.floor((item.tccount / item.allcount) * 10000) / 100;
          compositeTestWordTime =
            Math.floor((item.allstudytimes / 60 / 60) * 100) / 100;
        }

        if (item.type == 9 && item.allcount > 0) {
          highTestWord =
            Math.floor((item.tccount / item.allcount) * 10000) / 100;
          highTestWordTime =
            Math.floor((item.allstudytimes / 60 / 60) * 100) / 100;
        }
      });

      // 总通过率
      if (allNnu > 0) allGrade = Math.floor((allPass / allNnu) * 10000) / 100;

      // 总时长
      if (allTime > 0) allTime = Math.floor((allTime / 60 / 60) * 100) / 100;

      this.$set(this.studyLogList, index, {
        title: index == 0 ? "全部" : "近期",
        allGrade,
        allTime,
        wordZnEn,
        wordZnEnTime,
        wordEn,
        wordEnTime,
        chapterTestWord,
        chapterTestWordTime,
        chapterTest,
        chapterTestTime,
        errorTestWord,
        errorTestWordTime,
        errorTest,
        errorTestTime,
        highTestWord,
        highTestWordTime,
        highTest,
        highTestTime,
        compositeTestWord,
        compositeTestWordTime,
        compositeTest,
        compositeTestTime,
      });
    },

    /**
     * 打开测试题列表
     * 0:章节测试  3:章节测前（关键词）  4:我错题测试  5:综合测试  6:高频测试
     * 7:我错题测前（关键词） 8:综合测前（关键词） 9:高频测前（关键词）
     */
    handleOpenTest(row) {
      const type = row.type;

      switch (Number(type)) {
        case 0:
          this.queryTestResults(row.requestid);
          break;

        case 4:
          this.queryMyTestResults(row.requestid);
          break;

        case 5:
          this.queryComTestResults(row.requestid);
          break;

        case 6:
          this.queryAllTestResults(row.requestid);
          break;

        case 11:
          this.queryComTestResults(row.requestid);
          break;

        default:
          this.queryTestBeforeWord(row.ordercode);
      }
    },

    /**
     * 获取用户测试记录详情（章节）
     */
    async queryTestResults(requestId) {
      this.answerVisible = true;
      this.answerLoading = true;

      const { data: resData } = await getTestResults(
        {
          requestid: requestId,
          memberid: this.params.memberid,
        },
        {
          pageindex: 1,
          pagesize: 300,
        }
      );

      this.answerLoading = false;

      if (!resData.data.status) return;

      this.answerList = resData.data.data.map((item) => {
        item.memberanswser = Number(item.memberanswser);
        return item;
      });
    },

    /**
     * 获取用户测试记录详情（我的错误题）
     */
    async queryMyTestResults(requestId) {
      this.answerVisible = true;
      this.answerLoading = true;

      const { data: resData } = await getMyTestResults(
        {
          requestid: requestId,
          memberid: this.params.memberid,
        },
        {
          pageindex: 1,
          pagesize: 300,
        }
      );

      this.answerLoading = false;
      if (!resData.data.status) return;

      this.answerList = resData.data.data.map((item) => {
        item.memberanswser = Number(item.memberanswser);
        return item;
      });
    },

    /**
     * 获取用户测试记录详情（高频错题）
     */
    async queryAllTestResults(requestId) {
      this.answerVisible = true;
      this.answerLoading = true;

      const { data: resData } = await getAllTestResults(
        {
          requestid: requestId,
          memberid: this.params.memberid,
        },
        {
          pageindex: 1,
          pagesize: 300,
        }
      );
      this.answerLoading = false;
      if (!resData.data.status) return;

      this.answerList = resData.data.data.map((item) => {
        item.memberanswser = Number(item.memberanswser);
        return item;
      });
    },

    /**
     * 获取用户测试记录详情（综合题）
     */
    async queryComTestResults(requestId) {
      this.answerVisible = true;
      this.answerLoading = true;

      const { data: resData } = await getComTestResults(
        {
          requestid: requestId,
          memberid: this.params.memberid,
        },
        {
          pageindex: 1,
          pagesize: 300,
        }
      );

      this.answerLoading = false;

      if (!resData.data.status) return;

      this.answerList = resData.data.data.map((item) => {
        item.memberanswser = Number(item.memberanswser);
        return item;
      });
    },

    /**
     * 获取用户测试前的（关键词）
     */
    async queryTestBeforeWord(ordercode) {
      this.answerVisible = true;
      this.answerLoading = true;

      const { data: resData } = await getTestBeforeWord(
        {
          ordercode,
          memberid: this.params.memberid,
        },
        {
          pageindex: 1,
          pagesize: 300,
        }
      );
      this.answerLoading = false;
      if (!resData.data.status) return;

      if (resData.data.data.length <= 0)
        return this.$message.error("暂无答题记录");

      // 获取json串数据
      const list = JSON.parse(resData.data.data[0].jonstring);

      this.answerList = list.map((item) => {
        // 默认为错误的状态
        item.status = 2;

        // 检查该题是否做正确了
        item.answerList.forEach((son) => {
          if (son.iscorrectoption && item.answer == son.id) item.status = 1;
          son.content = son.title;
        });
        return {
          ...item,
          title: item.atitle,
          yibei_requestion_const_option: item.answerList,
          memberanswser: item.answer,
        };
      });
    },

    /**
     * 导出学员学习记录
     */
    handleExportStudy() {
      this.$confirm("是否导出该学员的学习记录？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await getMemberStudyLogs(this.params.memberid, this.params.username);
        })
        .catch(() => {});
    },

    /**
     * pageSize 改变时会触发
     */
    handleSizeChange(val) {
      this.pages.pagesize = val;
      this.pages.pageindex = 1;
      this.queryStudyList();
    },

    /**
     * pageindex 改变时会触发
     */
    handleCurrentChange(val) {
      this.pages.pageindex = val;
      this.queryStudyList();
    },
  },

  async created() {
    if (this.$route.query.id) {
      this.params.memberid = this.$route.query.id;
      this.params.username = this.$route.query.name;
      this.level = this.$route.query.level;
    }

    this.queryStudyList();
    this.queryCourseList();
    this.queryStudyLogStatistics(1);
    await this.queryMemberstudyCourse();
    this.queryCourseTreeList();
    this.queryStudyLogStatistics(0);
  },
};
</script>
