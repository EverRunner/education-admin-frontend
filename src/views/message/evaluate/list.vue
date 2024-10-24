<style lang="scss" scope>
.evaluate-details {
  li {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
  }
  h5 {
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;
    color: #909399;
  }
  p {
    color: #303133;
    font-weight: 500;
    font-size: 13px;
    line-height: 20px;
  }
  img {
    max-height: 100px;
    min-width: 100px;
  }
}
</style>

<template>
  <section class="public-wp">
    <TabsNav :list="tabsNavList" />

    <ul class="public-search">
      <li class="public-search-left">
        <el-select v-model="params.status" clearable placeholder="状态">
          <!-- <el-option label="审核中" :value="0"> </el-option> -->
          <el-option label="通过" :value="1"> </el-option>
          <el-option label="驳回" :value="2"> </el-option>
        </el-select>
      </li>
      <li class="public-search-right">
        <el-input placeholder="请输入评价" v-model="params.title"></el-input>
        <el-button type="warning" @click="handleSearch">搜索</el-button>
      </li>
    </ul>

    <el-table :data="list" v-loading="loading" class="publi-table">
      <el-table-column prop="username" label="用户名">
        <template slot-scope="scope">
          {{ scope.row.yibei_member && scope.row.yibei_member.username }}
        </template>
      </el-table-column>

      <el-table-column prop="content" label="内容"> </el-table-column>

      <el-table-column prop="score" label="评分">
        <template slot-scope="scope">
          <el-rate :value="scope.row.score" disabled></el-rate>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1" type="success">通过</el-tag>
          <el-tag v-else type="warning">驳回</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="创建日">
        <template slot-scope="scope">
          {{ scope.row.createdAt | formatDate("YYYY-MM-DD") }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" plain @click="handleDetailsShow(scope.row)"
            >详情</el-button
          >

          <el-button
            size="mini"
            type="primary"
            plain
            @click="handleShowEdit(scope.row)"
            >修改</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-algin">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pages.pageindex"
        :page-sizes="[pages.pagesize, 30, 50, 100, 200]"
        :page-size="pages.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>

    <!-- 评价修改 -->
    <el-dialog title="评价修改" width="500px" :visible.sync="showEdit">
      <el-form label-width="80px">
        <el-form-item label="分数" required>
          <el-rate style="margin-top: 12px" v-model="editForm.score"></el-rate>
        </el-form-item>
        <el-form-item label="内容" required>
          <el-input
            style="width: 100%"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="editForm.content"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="多张图片">
          <el-upload
            ref="uploadImg"
            action="/api/uploadhandler/image"
            list-type="picture-card"
            :file-list="imgArray"
            :limit="4"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
          >
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{ file }">
              <img
                class="el-upload-list__item-thumbnail"
                :src="FILE_ROOT + file.url"
                alt=""
              />
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="审核" required>
          <el-radio-group v-model="auditStatus">
            <el-radio :label="1">通过</el-radio>
            <el-radio :label="2">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show = false">取 消</el-button>
        <el-button type="primary" @click="handleEidt">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 评价审核 -->
    <!-- <el-dialog title="评价审核" width="550px" :visible.sync="show">
      <el-form label-width="130px">
        <el-form-item label="审核" required>
          <el-radio-group v-model="auditStatus">
            <el-radio :label="1">通过</el-radio>
            <el-radio :label="2">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show = false">取 消</el-button>
        <el-button type="primary" @click="handleAudit">确 定</el-button>
      </div>
    </el-dialog> -->

    <!-- 评价详情 -->
    <el-dialog title="评价详情" width="550px" :visible.sync="detailsShow">
      <ul class="evaluate-details">
        <li>
          <h5>年龄段：</h5>
          <p>{{ details.agedis || "-" }}</p>
        </li>
        <li>
          <h5>英文水平：</h5>
          <p>{{ details.enlevel || "-" }}</p>
        </li>
        <li>
          <h5>电脑水平：</h5>
          <p>{{ details.computerlevel || "-" }}</p>
        </li>
        <li>
          <h5>每天花在学习上的时间：</h5>
          <p>{{ details.studyeverytime || "-" }}</p>
        </li>
        <li>
          <h5>从开始学习到参加考试，花了多长时间：</h5>
          <p>{{ details.studytocoursetime || "-" }}</p>
        </li>
        <li>
          <h5>为什么要参加联邦按摩考试：</h5>
          <p>{{ details.studywhy || "-" }}</p>
        </li>
        <li>
          <h5>顺利通过考试最关键的学习步骤：</h5>
          <p>{{ details.keystep || "-" }}</p>
        </li>
        <li>
          <h5>给易北教育和徐老师打多少分：</h5>
          <p>{{ details.score || "-" }}分</p>
        </li>
        <li>
          <h5>愿意向朋友或同事推荐易北教育课程和徐老师：</h5>
          <p>{{ details.istotuijian || "-" }}</p>
        </li>
        <li>
          <h5>对还在奋战的易北学员们说些什么：</h5>
          <p>{{ details.content || "-" }}</p>
        </li>
        <li v-if="details.imgArr" class="details-images">
          <h5>图片</h5>
          <img
            v-for="(url, index) in details.imgArr"
            :key="index"
            :src="FILE_ROOT + url"
            alt=""
          />
        </li>
      </ul>
    </el-dialog>
  </section>
</template>

<script>
import { getEvaluateList, editEvaluate } from "@api/course";
import { PAGE_SIZE, FILE_ROOT, MESSAGE_TABS_NAV_LIST } from "@config";
import TabsNav from "@comp/TabsNav";

export default {
  components: { TabsNav },

  data() {
    return {
      tabsNavList: MESSAGE_TABS_NAV_LIST,

      FILE_ROOT,
      loading: false,
      params: {
        courseid: 0,
      },
      pages: {
        pageindex: 1,
        pagesize: PAGE_SIZE,
      },
      total: 0,
      list: [],

      show: false,
      row: {},

      auditStatus: 1,

      details: {},
      detailsShow: false,

      showEdit: false,
      editForm: {},
      imgArray: [],
    };
  },

  methods: {
    /**
     * 获取列表
     */
    async queryList() {
      this.loading = true;

      const { data: resData } = await getEvaluateList(this.params, this.pages);
      if (!resData.data.status) return;

      this.loading = false;

      this.list = resData.data.data.rows;
      this.total = resData.data.data.count;
    },

    /**
     * 处理搜索
     */
    handleSearch(row, type) {
      this.pages.pageindex = 1;
      this.queryList();
    },

    /**
     * 评价-修改显示
     */
    handleShowEdit(row) {
      this.imgArray = [];
      this.editForm = row;

      if (row.imgarray) {
        row.imgarray.split(",").forEach((url) => {
          this.imgArray.push({
            url,
          });
        });
      }

      this.showEdit = true;
    },

    /**
     * 提交修改
     */
    async handleEidt() {
      // 整理图片数组
      let fileList = [];
      this.imgArray.forEach((item) => {
        fileList.push(item.url);
      });
      this.editForm.imgarray = fileList.join(",");

      this.$confirm("是否提交修改？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: resData } = await editEvaluate(this.editForm);
          if (!resData.data.status) return;

          this.showEdit = false;
          this.$message.success("修改成功");
          this.queryList();
        })
        .catch(() => {});
    },

    /**
     * 评价详情显示
     */
    handleDetailsShow(row) {
      this.details = row;
      if (row.imgarray) {
        this.details.imgArr = row.imgarray.split(",");
      }

      this.detailsShow = true;
    },

    /**
     * pageSize 改变时会触发
     */
    handleSizeChange(val) {
      this.pages.pagesize = val;
      this.pages.pageindex = 1;
      this.queryList();
    },

    /**
     * pageindex 改变时会触发
     */
    handleCurrentChange(val) {
      this.pages.pageindex = val;
      this.queryList();
    },

    /**
     * 文件上传成功
     */
    handleUploadSuccess(res, file) {
      this.imgArray.push({
        name: file.name,
        url: res.data.path,
      });
    },

    /**
     * 删除文件
     */
    handleRemove(file) {
      this.imgArray = this.imgArray.filter((a) => a.url != file.url);
    },

    /**
     * 文件上传失败时
     */
    handleUploadError() {
      this.$message.error("上传网络错误，请重新上传！");
    },

    /**
     * 文件上传前的操作
     */
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      const isImage = file.type.indexOf("image") != -1;

      if (!isImage) {
        this.$message.error("只能上传图片!");
      }

      if (!isLt2M) {
        this.$message.error("图片大小不能超过 2MB!");
      }
      return isLt2M && isImage;
    },
  },

  created() {
    this.queryList();
  },
};
</script>
