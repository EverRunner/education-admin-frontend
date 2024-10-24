<style lang="scss" scoped>
.ratio {
  &.error {
    color: #00d489;
  }
  &.correct {
    color: #fa5376;
  }
}
.public-search-form {
  transition: all 0.3s ease;
  &.on {
    height: 0;
  }

  .el-input {
    // width: 110px;
  }

  .el-form-item {
    width: 390px;
  }
  .content {
    flex-wrap: wrap;
  }
  .line {
    text-align: center;
  }
}
</style>

<template>
  <section>
    <ul class="public-search" style="padding-top: 0;">
      <li class="public-search-left">
        <el-button
          :icon="showUp ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"
          @click="showUp = !showUp"
          size="medium"
          >筛选条件</el-button
        >
      </li>
      <li class="public-search-right"></li>
    </ul>

    <el-form
      class="public-search-form"
      :class="{ on: showUp }"
      ref="form"
      :model="params"
      label-width="130px"
    >
      <div class="content">
        <el-form-item label="平均每日学习小时">
          <el-col :span="11">
            <el-input
              v-model="params.studyhoursedaymin"
              placeholder="最小值1"
              size="small"
              clearable
            ></el-input>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-input
              v-model="params.studyhoursedaymax"
              placeholder="最大值24"
              size="small"
              clearable
            ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="关键词平均（中英）">
          <el-col :span="11">
            <el-input
              v-model="params.category1min"
              placeholder="最小值0"
              size="small"
              clearable
            ></el-input>
          </el-col>
          <el-col class="line" :span="2"> - </el-col>
          <el-col :span="11">
            <el-input
              v-model="params.category1max"
              placeholder="最大值100"
              size="small"
              clearable
            ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="关键词平均（英）">
          <el-col :span="11">
            <el-input
              v-model="params.category2min"
              placeholder="最小值0"
              size="small"
              clearable
            ></el-input>
          </el-col>
          <el-col class="line" :span="2"> - </el-col>
          <el-col :span="11">
            <el-input
              v-model="params.category2max"
              placeholder="最大值100"
              size="small"
              clearable
            ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="单元测试平均">
          <el-col :span="11">
            <el-input
              v-model="params.category3min"
              placeholder="最小值0"
              size="small"
              clearable
            ></el-input>
          </el-col>
          <el-col class="line" :span="2"> - </el-col>
          <el-col :span="11">
            <el-input
              v-model="params.category3max"
              placeholder="最大值100"
              size="small"
              clearable
            ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="Final测试平均">
          <el-col :span="11">
            <el-input
              v-model="params.category4min"
              placeholder="最小值0"
              size="small"
              clearable
            ></el-input>
          </el-col>
          <el-col class="line" :span="2"> - </el-col>
          <el-col :span="11">
            <el-input
              v-model="params.category4max"
              placeholder="最大值100"
              size="small"
              clearable
            ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="模拟测试平均">
          <el-col :span="11">
            <el-input
              v-model="params.category5min"
              placeholder="最小值0"
              size="small"
              clearable
            ></el-input>
          </el-col>
          <el-col class="line" :span="2"> - </el-col>
          <el-col :span="11">
            <el-input
              v-model="params.category5max"
              placeholder="最大值100"
              size="small"
              clearable
            ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="我的错题测试平均">
          <el-col :span="11">
            <el-input
              v-model="params.category6min"
              placeholder="最小值0"
              size="small"
              clearable
            ></el-input>
          </el-col>
          <el-col class="line" :span="2"> - </el-col>
          <el-col :span="11">
            <el-input
              v-model="params.category6max"
              placeholder="最大值100"
              size="small"
              clearable
            ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="高频错题测试平均">
          <el-col :span="11">
            <el-input
              v-model="params.category7min"
              placeholder="最小值0"
              size="small"
              clearable
            ></el-input>
          </el-col>
          <el-col class="line" :span="2"> - </el-col>
          <el-col :span="11">
            <el-input
              v-model="params.category7max"
              placeholder="最大值100"
              size="small"
              clearable
            ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="课程列表">
          <el-select
            size="small"
            v-model="params.courseid"
            placeholder="请选择课程"
            clearable
          >
            <el-option
              v-for="(item, index) in courseList"
              :key="index"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="">
          <el-button
            size="small"
            @click="handleSearch"
            icon="el-icon-search"
            type="primary"
            >搜索</el-button
          >
        </el-form-item>
      </div>
    </el-form>

    <el-table
      :data="list"
      v-loading="loading"
      @cell-click="handleCellClick"
      class="publi-table"
      :border="true"
      size="mini"
    >
      <!-- <el-table-column align="center" type="index" label="序号">
      </el-table-column> -->

      <el-table-column align="center" label="姓名" fixed="left">
        <template slot-scope="scope">
          <p class="table-column">{{ scope.row.username }}</p>
        </template>
      </el-table-column>

      <!-- 关键词平均准确率（中英） -->
      <el-table-column align="center" label="关键词平均准确率（中英）">
        <el-table-column align="center" width="60" label="本周">
          <template slot-scope="scope">
            {{ handleRetainNum(scope.row.correctpercent_week_1) }}%
          </template>
        </el-table-column>
        <el-table-column align="center" width="65" label="同比上周">
          <template slot-scope="scope">
            <p
              class="ratio"
              :class="{
                correct:
                  scope.row.correctpercent_week_1 -
                    scope.row.correctpercent_last_week_1 >
                  0,
                error:
                  scope.row.correctpercent_week_1 -
                    scope.row.correctpercent_last_week_1 <
                  0,
              }"
            >
              {{
                scope.row.correctpercent_week_1 -
                  scope.row.correctpercent_last_week_1 >
                0
                  ? "+"
                  : ""
              }}{{
                scope.row.correctpercent_last_week_1 == 0
                  ? 0
                  : handleRetainNum(
                      (scope.row.correctpercent_week_1 -
                        scope.row.correctpercent_last_week_1) /
                        100
                    )
              }}%
            </p>
          </template>
        </el-table-column>
        <el-table-column align="center" width="60" label="本月">
          <template slot-scope="scope">
            {{ handleRetainNum(scope.row.correctpercent_month_1) }}%
          </template>
        </el-table-column>
        <el-table-column align="center" width="65" label="同比上月">
          <template slot-scope="scope">
            <p
              class="ratio"
              :class="{
                correct:
                  scope.row.correctpercent_month_1 -
                    scope.row.correctpercent_last_month_1 >
                  0,
                error:
                  scope.row.correctpercent_month_1 -
                    scope.row.correctpercent_last_month_1 <
                  0,
              }"
            >
              {{
                scope.row.correctpercent_month_1 -
                  scope.row.correctpercent_last_month_1 >
                0
                  ? "+"
                  : ""
              }}{{
                scope.row.correctpercent__last_month_1 == 0
                  ? 0
                  : handleRetainNum(
                      (scope.row.correctpercent_month_1 -
                        scope.row.correctpercent__last_month_1) /
                        100
                    )
              }}%
            </p>
          </template>
        </el-table-column>
      </el-table-column>

      <!-- 关键词平均准确率（英) -->
      <el-table-column align="center" label="关键词平均准确率（英）">
        <el-table-column align="center" width="60" label="本周">
          <template slot-scope="scope">
            {{ handleRetainNum(scope.row.correctpercent_week_2) }}%
          </template>
        </el-table-column>
        <el-table-column align="center" width="60" label="同比上周">
          <template slot-scope="scope">
            <p
              class="ratio"
              :class="{
                correct:
                  scope.row.correctpercent_week_2 -
                    scope.row.correctpercent_last_week_2 >
                  0,
                error:
                  scope.row.correctpercent_week_2 -
                    scope.row.correctpercent_last_week_2 <
                  0,
              }"
            >
              {{
                scope.row.correctpercent_week_2 -
                  scope.row.correctpercent_last_week_2 >
                0
                  ? "+"
                  : ""
              }}{{
                scope.row.correctpercent_last_week_2 == 0
                  ? 0
                  : handleRetainNum(
                      (scope.row.correctpercent_week_2 -
                        scope.row.correctpercent_last_week_2) /
                        100
                    )
              }}%
            </p>
          </template>
        </el-table-column>
        <el-table-column align="center" width="60" label="本月">
          <template slot-scope="scope">
            {{ handleRetainNum(scope.row.correctpercent_month_2) }}%
          </template>
        </el-table-column>
        <el-table-column align="center" width="65" label="同比上月">
          <template slot-scope="scope">
            <p
              class="ratio"
              :class="{
                correct:
                  scope.row.correctpercent_month_2 -
                    scope.row.correctpercent_last_month_2 >=
                  0,
                error:
                  scope.row.correctpercent_month_2 -
                    scope.row.correctpercent_last_month_2 <
                  0,
              }"
            >
              {{
                scope.row.correctpercent_month_2 -
                  scope.row.correctpercent_last_month_2 >
                0
                  ? "+"
                  : ""
              }}{{
                scope.row.correctpercent__last_month_2 == 0
                  ? 0
                  : handleRetainNum(
                      (scope.row.correctpercent_month_2 -
                        scope.row.correctpercent__last_month_2) /
                        100
                    )
              }}%
            </p>
          </template>
        </el-table-column>
      </el-table-column>

      <!-- 单元测试 -->
      <el-table-column align="center" label="单元测试平均成绩">
        <el-table-column align="center" width="60" label="本周">
          <template slot-scope="scope">
            {{ handleRetainNum(scope.row.correctpercent_week_3) }}%
          </template>
        </el-table-column>
        <el-table-column align="center" width="60" label="同比上周">
          <template slot-scope="scope">
            <p
              class="ratio"
              :class="{
                correct:
                  scope.row.correctpercent_week_3 -
                    scope.row.correctpercent_last_week_3 >=
                  0,
                error:
                  scope.row.correctpercent_week_3 -
                    scope.row.correctpercent_last_week_3 <
                  0,
              }"
            >
              {{
                scope.row.correctpercent_week_3 -
                  scope.row.correctpercent_last_week_3 >
                0
                  ? "+"
                  : ""
              }}{{
                scope.row.correctpercent_last_week_3 == 0
                  ? 0
                  : handleRetainNum(
                      (scope.row.correctpercent_week_3 -
                        scope.row.correctpercent_last_week_3) /
                        100
                    )
              }}%
            </p>
          </template>
        </el-table-column>
        <el-table-column align="center" width="60" label="本月">
          <template slot-scope="scope">
            {{ handleRetainNum(scope.row.correctpercent_month_3) }}%
          </template>
        </el-table-column>
        <el-table-column align="center" width="65" label="同比上月">
          <template slot-scope="scope">
            <p
              class="ratio"
              :class="{
                correct:
                  scope.row.correctpercent_month_3 -
                    scope.row.correctpercent_last_month_3 >=
                  0,
                error:
                  scope.row.correctpercent_month_3 -
                    scope.row.correctpercent_last_month_3 <
                  0,
              }"
            >
              {{
                scope.row.correctpercent_month_3 -
                  scope.row.correctpercent_last_month_3 >
                0
                  ? "+"
                  : ""
              }}{{
                scope.row.correctpercent__last_month_3 == 0
                  ? 0
                  : handleRetainNum(
                      (scope.row.correctpercent_month_3 -
                        scope.row.correctpercent__last_month_3) /
                        100
                    )
              }}%
            </p>
          </template>
        </el-table-column>
      </el-table-column>

      <!-- Final测试平均成绩 -->
      <el-table-column align="center" label="Final测试平均成绩">
        <el-table-column align="center" width="60" label="本周">
          <template slot-scope="scope">
            {{ handleRetainNum(scope.row.correctpercent_week_4) }}%
          </template>
        </el-table-column>
        <el-table-column align="center" width="60" label="同比上周">
          <template slot-scope="scope">
            <p
              class="ratio"
              :class="{
                correct:
                  scope.row.correctpercent_week_4 -
                    scope.row.correctpercent_last_week_4 >=
                  0,
                error:
                  scope.row.correctpercent_week_4 -
                    scope.row.correctpercent_last_week_4 <
                  0,
              }"
            >
              {{
                scope.row.correctpercent_week_4 -
                  scope.row.correctpercent_last_week_4 >
                0
                  ? "+"
                  : ""
              }}{{
                scope.row.correctpercent_last_week_4 == 0
                  ? 0
                  : handleRetainNum(
                      (scope.row.correctpercent_week_4 -
                        scope.row.correctpercent_last_week_4) /
                        100
                    )
              }}%
            </p>
          </template>
        </el-table-column>
        <el-table-column align="center" width="60" label="本月">
          <template slot-scope="scope">
            {{ handleRetainNum(scope.row.correctpercent_month_4) }}%
          </template>
        </el-table-column>
        <el-table-column align="center" width="65" label="同比上月">
          <template slot-scope="scope">
            <p
              class="ratio"
              :class="{
                correct:
                  scope.row.correctpercent_month_4 -
                    scope.row.correctpercent_last_month_4 >=
                  0,
                error:
                  scope.row.correctpercent_month_4 -
                    scope.row.correctpercent_last_month_4 <
                  0,
              }"
            >
              {{
                scope.row.correctpercent_month_4 -
                  scope.row.correctpercent_last_month_4 >
                0
                  ? "+"
                  : ""
              }}{{
                scope.row.correctpercent__last_month_4 == 0
                  ? 0
                  : handleRetainNum(
                      (scope.row.correctpercent_month_4 -
                        scope.row.correctpercent__last_month_4) /
                        100
                    )
              }}%
            </p>
          </template>
        </el-table-column>
      </el-table-column>

      <!-- 综合模拟测试平均成绩 -->
      <el-table-column align="center" label="综合模拟测试平均成绩">
        <el-table-column align="center" width="60" label="本周">
          <template slot-scope="scope">
            {{ handleRetainNum(scope.row.correctpercent_week_5) }}%
          </template>
        </el-table-column>
        <el-table-column align="center" width="60" label="同比上周">
          <template slot-scope="scope">
            <p
              class="ratio"
              :class="{
                correct:
                  scope.row.correctpercent_week_5 -
                    scope.row.correctpercent_last_week_5 >=
                  0,
                error:
                  scope.row.correctpercent_week_5 -
                    scope.row.correctpercent_last_week_5 <
                  0,
              }"
            >
              {{
                scope.row.correctpercent_week_5 -
                  scope.row.correctpercent_last_week_5 >
                0
                  ? "+"
                  : ""
              }}{{
                scope.row.correctpercent_last_week_5 == 0
                  ? 0
                  : handleRetainNum(
                      (scope.row.correctpercent_week_5 -
                        scope.row.correctpercent_last_week_5) /
                        100
                    )
              }}%
            </p>
          </template>
        </el-table-column>
        <el-table-column align="center" width="60" label="本月">
          <template slot-scope="scope">
            {{ handleRetainNum(scope.row.correctpercent_month_5) }}%
          </template>
        </el-table-column>
        <el-table-column align="center" width="65" label="同比上月">
          <template slot-scope="scope">
            <p
              class="ratio"
              :class="{
                correct:
                  scope.row.correctpercent_month_5 -
                    scope.row.correctpercent_last_month_5 >=
                  0,
                error:
                  scope.row.correctpercent_month_5 -
                    scope.row.correctpercent_last_month_5 <
                  0,
              }"
            >
              {{
                scope.row.correctpercent_month_5 -
                  scope.row.correctpercent_last_month_5 >
                0
                  ? "+"
                  : ""
              }}{{
                scope.row.correctpercent__last_month_5 == 0
                  ? 0
                  : handleRetainNum(
                      (scope.row.correctpercent_month_5 -
                        scope.row.correctpercent__last_month_5) /
                        100
                    )
              }}%
            </p>
          </template>
        </el-table-column>
      </el-table-column>

      <!-- 我的错题测试平均成绩 -->
      <el-table-column align="center" label="综合模拟测试平均成绩">
        <el-table-column align="center" width="60" label="本周">
          <template slot-scope="scope">
            {{ handleRetainNum(scope.row.correctpercent_week_6) }}%
          </template>
        </el-table-column>
        <el-table-column align="center" width="60" label="同比上周">
          <template slot-scope="scope">
            <p
              class="ratio"
              :class="{
                correct:
                  scope.row.correctpercent_week_6 -
                    scope.row.correctpercent_last_week_6 >=
                  0,
                error:
                  scope.row.correctpercent_week_6 -
                    scope.row.correctpercent_last_week_6 <
                  0,
              }"
            >
              {{
                scope.row.correctpercent_week_6 -
                  scope.row.correctpercent_last_week_6 >
                0
                  ? "+"
                  : "-"
              }}{{
                scope.row.correctpercent_last_week_6 == 0
                  ? 0
                  : handleRetainNum(
                      (scope.row.correctpercent_week_6 -
                        scope.row.correctpercent_last_week_6) /
                        100
                    )
              }}%
            </p>
          </template>
        </el-table-column>
        <el-table-column align="center" width="60" label="本月">
          <template slot-scope="scope">
            {{ handleRetainNum(scope.row.correctpercent_month_6) }}%
          </template>
        </el-table-column>
        <el-table-column align="center" width="65" label="同比上月">
          <template slot-scope="scope">
            <p
              class="ratio"
              :class="{
                correct:
                  scope.row.correctpercent_month_6 -
                    scope.row.correctpercent_last_month_6 >=
                  0,
                error:
                  scope.row.correctpercent_month_6 -
                    scope.row.correctpercent_last_month_6 <
                  0,
              }"
            >
              {{
                scope.row.correctpercent_month_6 -
                  scope.row.correctpercent_last_month_6 >
                0
                  ? "+"
                  : ""
              }}{{
                scope.row.correctpercent__last_month_6 == 0
                  ? 0
                  : handleRetainNum(
                      (scope.row.correctpercent_month_6 -
                        scope.row.correctpercent__last_month_6) /
                        100
                    )
              }}%
            </p>
          </template>
        </el-table-column>
      </el-table-column>

      <!-- 高频错题测试平均成绩 -->
      <el-table-column align="center" label="高频错题测试平均成绩">
        <el-table-column align="center" width="60" label="本周">
          <template slot-scope="scope">
            {{ handleRetainNum(scope.row.correctpercent_week_7) }}%
          </template>
        </el-table-column>
        <el-table-column align="center" width="60" label="同比上周">
          <template slot-scope="scope">
            <p
              class="ratio"
              :class="{
                correct:
                  scope.row.correctpercent_week_7 -
                    scope.row.correctpercent_last_week_7 >=
                  0,
                error:
                  scope.row.correctpercent_week_7 -
                    scope.row.correctpercent_last_week_7 <
                  0,
              }"
            >
              {{
                scope.row.correctpercent_week_7 -
                  scope.row.correctpercent_last_week_7 >
                0
                  ? "+"
                  : ""
              }}{{
                scope.row.correctpercent_last_week_7 == 0
                  ? 0
                  : handleRetainNum(
                      (scope.row.correctpercent_week_7 -
                        scope.row.correctpercent_last_week_7) /
                        100
                    )
              }}%
            </p>
          </template>
        </el-table-column>
        <el-table-column align="center" width="60" label="本月">
          <template slot-scope="scope">
            {{ handleRetainNum(scope.row.correctpercent_month_7) }}%
          </template>
        </el-table-column>
        <el-table-column align="center" width="65" label="同比上月">
          <template slot-scope="scope">
            <p
              class="ratio"
              :class="{
                correct:
                  scope.row.correctpercent_month_7 -
                    scope.row.correctpercent_last_month_7 >=
                  0,
                error:
                  scope.row.correctpercent_month_7 -
                    scope.row.correctpercent_last_month_7 <
                  0,
              }"
            >
              {{
                scope.row.correctpercent_month_7 -
                  scope.row.correctpercent_last_month_7 >
                0
                  ? "+"
                  : ""
              }}{{
                scope.row.correctpercent__last_month_7 == 0
                  ? 0
                  : handleRetainNum(
                      (scope.row.correctpercent_month_7 -
                        scope.row.correctpercent__last_month_7) /
                        100
                    )
              }}%
            </p>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>

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
  </section>
</template>

<script>
import { getMemberStudyStatics } from "@api/main";
import { PAGE_SIZE } from "@config";
import { getCourseList } from "@api/course";

export default {
  components: {},

  data() {
    return {
      loading: true,
      params: {
        courseid: "",
      },
      PAGE_SIZE,
      pages: {
        pageindex: 1,
        pagesize: PAGE_SIZE,
      },
      total: 0,
      list: [],
      courseList: [],

      showUp: true,
    };
  },

  methods: {
    /**
     * 获取列表
     */
    async querList() {
      this.loading = true;

      let params = {};

      if (this.params.category1min)
        params.category1min = this.params.category1min / 100;
      if (this.params.category1max)
        params.category1max = this.params.category1max / 100;

      if (this.params.category2min)
        params.category2min = this.params.category2min / 100;
      if (this.params.category2max)
        params.category2max = this.params.category2max / 100;

      if (this.params.category3min)
        params.category3min = this.params.category3min / 100;
      if (this.params.category3max)
        params.category3max = this.params.category3max / 100;

      if (this.params.category4min)
        params.category4min = this.params.category4min / 100;
      if (this.params.category4max)
        params.category4max = this.params.category4max / 100;

      if (this.params.category5min)
        params.category5min = this.params.category5min / 100;
      if (this.params.category5max)
        params.category5max = this.params.category5max / 100;

      if (this.params.category6min)
        params.category6min = this.params.category6min / 100;
      if (this.params.category1max)
        params.category6max = this.params.category6max / 100;

      if (this.params.category7min)
        params.category7min = this.params.category7min / 100;
      if (this.params.category7max)
        params.category7max = this.params.category7max / 100;

      const { data: resData } = await getMemberStudyStatics(
        {
          ...this.params,
          ...params,
        },
        this.pages
      );
      this.loading = false;
      if (!resData.data.status) return;

      this.list = resData.data.data.rows;
      this.total = resData.data.count;
    },

    /**
     * 处理搜索
     */
    handleSearch(row, type) {
      this.pages.pageindex = 1;
      this.querList();
    },

    /**
     * 处理跳转
     */
    handleGoTo(row, type) {
      this.$router.push({
        name: type == "edit" ? "MEMBER_EDIT" : "MEMBER_DETAILS",
        query: {
          id: row.memberid,
        },
      });
    },

    /**
     * 获取课程列表
     */
    async queryCourseList() {
      //type 课程类型（0:免费课程  1：付费课程）
      const { data: resData } = await getCourseList(
        {
          type: 1,
        },
        this.pages
      );
      if (!resData.data.status) return;

      this.courseList = resData.data.data.rows;
    },

    /**
     * 处理单元格点击
     */
    handleCellClick(row, column, cell, event) {
      if (column.property == "username") this.handleGoTo(row, "details");
    },

    /**
     * pageSize 改变时会触发
     */
    handleSizeChange(val) {
      this.pages.pagesize = val;
      this.pages.pageindex = 1;
      this.querList();
    },

    /**
     * pageindex 改变时会触发
     */
    handleCurrentChange(val) {
      this.pages.pageindex = val;
      this.querList();
    },

    /**
     * 处理保存1位小数
     */
    handleRetainNum(num) {
      if (!num) return 0;
      return Math.floor(num * 1000) / 10;
    },
  },

  async created() {
    this.querList();
    this.queryCourseList();
  },

  /**
   * 页面销毁前
   */
  beforeDestroy() {},
};
</script>
