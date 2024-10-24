<style lang="scss" scope>
.public-edit {
  &-form {
    width: 100%;
    .el-form-item {
      width: 500px;
      &.percentage {
        width: 100%;
      }
    }
  }
  .options {
    &-item {
      width: 650px;
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .el-input {
        width: 400px;
      }
      .el-checkbox {
        margin: 0 30px 0 20px;
      }
      .el-radio {
        margin: 0 30px 0 20px;
      }
      .sort {
        font-size: 14px;
        color: #606266;
        width: 100px;
        text-align: right;
        padding-right: 12px;
        box-sizing: border-box;
      }
    }
  }
}
</style>

<template>
  <section class="public-edit public-body">
    <div class="public-edit-title">
        {{  $route.meta.title }}
    </div>
    <div class="public-edit-form">
      <el-form
        :model="params"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="params.title"
            :autosize="{ minRows: 3, maxRows: 8 }"
            placeholder="请输入标题"
            type="textarea"
          ></el-input>
        </el-form-item>

        <el-form-item label="类型" prop="category">
          <el-select v-model="params.category" placeholder="请选择类型">
            <el-option
              v-for="(item, index) in categoryList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="图片">
          <el-upload
            class="avatar-uploader"
            action="/api/uploadhandler/image"
            :show-file-list="false"
            name="file"
            :on-success="
              (res, file) => {
                handleUploadSuccess(res, file, 'thumb');
              }
            "
            :on-error="handleUploadError"
            :before-upload="beforeUpload"
          >
            <img
              v-if="params.thumb"
              :src="params.thumb | formatImage"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input
            v-model="params.sort"
            placeholder="请输入排序"
            maxlength="5"
            type="number"
          ></el-input>
        </el-form-item>

        <el-form-item label="选项" required>
          <el-radio-group v-model="option">
            <el-radio :label="1">文字</el-radio>
            <el-radio :label="2">图片</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 文字选项 -->
        <div class="options" v-if="option == 1">
          <el-checkbox-group v-model="correctList" v-if="params.category == 1">
            <div
              v-for="(item, index) in params.optionList"
              :key="index"
              class="options-item"
            >
              <span class="sort"> {{ letter(index) }}:</span>
              <el-input
                v-model="item.title"
                placeholder="请输入答案"
                maxlength="100"
              ></el-input>
              <el-checkbox :label="index" v-model="item.correct"
                >正确</el-checkbox
              >
              <el-button
                v-if="params.optionList.length > 1"
                size="small"
                type="danger"
                icon="el-icon-delete"
                circle
                @click="handleOptionDel(index)"
              ></el-button>
            </div>
          </el-checkbox-group>
          <el-radio-group v-model="correct" v-else>
            <div
              v-for="(item, index) in params.optionList"
              :key="index"
              class="options-item"
            >
              <span class="sort"> {{ letter(index) }}:</span>
              <el-input
                v-model="item.title"
                placeholder="请输入答案"
                maxlength="100"
              ></el-input>
              <el-radio :label="index" v-model="item.correct">正确</el-radio>
              <el-button
                v-if="params.optionList.length > 1"
                size="mini"
                type="danger"
                icon="el-icon-delete"
                circle
                @click="handleOptionDel(index)"
              ></el-button>
            </div>
          </el-radio-group>
        </div>

        <!-- 图片选项 -->
        <div class="options" v-else>
          <div
            v-for="(item, index) in params.optionList"
            :key="index"
            class="options-item"
          >
            <span class="sort"> {{ letter(index) }}:</span>
            <el-upload
              class="avatar-uploader"
              action="/api/uploadhandler/image"
              :show-file-list="false"
              name="file"
              :on-success="
                (res, file) => {
                  handleUploadSuccess(res, file, 'itemThumb', index);
                }
              "
              :on-error="handleUploadError"
              :before-upload="beforeUpload"
            >
              <img v-if="item.imageUrl" :src="item.imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-radio :label="index" v-model="item.correct">正确</el-radio>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="handleOptionDel(index)"
            ></el-button>
          </div>
        </div>

        <el-form-item label="">
          <el-button
            size="small"
            icon="el-icon-plus"
            type="warning"
            @click="handleOptionAdd"
            >增加</el-button
          >
        </el-form-item>

        <el-form-item class="percentage" label="详情" prop="content">
          <tinymce-editor ref="editor" v-model="params.content" />
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
import TinymceEditor from "@comp/TinymceEditor";
import { getWordInfo, addWord, updateWord } from "@api/word";
import { creationLetter } from "@utils/tools";

export default {
  components: {
    TinymceEditor,
  },
  data() {
    return {
      params: {
        category: 0,
        thumb: "",
        optionList: [
          { title: "", sort: 0, thumb: "", imageUrl: "", iscorrectoption: 0 },
          { title: "", sort: 0, thumb: "", imageUrl: "", iscorrectoption: 0 },
          { title: "", sort: 0, thumb: "", imageUrl: "", iscorrectoption: 0 },
          { title: "", sort: 0, thumb: "", imageUrl: "", iscorrectoption: 0 },
        ],
      },
      option: 1,
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "change" }],
        category: [
          { required: true, message: "请选择类型", trigger: "change" },
        ],
      },
      categoryList: [
        {
          name: "单选",
          id: 0,
        },
        {
          name: "多选",
          id: 1,
        },
        {
          name: "判断",
          id: 2,
        },
      ],
      correctList: [],
      correct: 0,
    };
  },
  methods: {
    /**
     * 获取详情
     */
    async queryInfo() {
      const { data: resData } = await getWordInfo(this.params.id);
      if (!resData.data.status) return;

      const resObj = {
        ...resData.data.dcWordsInfo,
        optionList: resData.data.optionList,
      };

      this.params = this.$_.cloneDeep(resObj);

      //格式正确答案
      if (this.params.category == 2) {
        this.params.optionList.forEach((item, index) => {
          if (item.iscorrectoption == 1) this.correctList.push(index);
        });
      } else {
        this.params.optionList.forEach((item, index) => {
          if (item.iscorrectoption == 1) this.correct = index;
        });
      }
    },

    /**
     * 增加选项
     */
    handleOptionAdd() {
      this.params.optionList.push({
        title: "",
        thumb: "",
        sort: 0,
        imageUrl: "",
        iscorrectoption: 0,
      });

    },

    /**
     * 删除选项
     */
    handleOptionDel(index) {
      this.params.optionList.splice(index, 1);
    },

    /**
     * 选择正确的值
     */
    handleOptionCorrect(val) {
    },

    /**
     * 生成字母
     */
    letter(index) {
      return creationLetter(index);
    },

    /**
     * 文件上传成功
     */
    handleUploadSuccess(res, file, type, index) {
      if (type == "thumb") {
        this.params.thumb = res.data.path;
      } else {
        this.params.optionList[index].imageUrl = URL.createObjectURL(file.raw);
        this.params.optionList[index].thumb = res.data.path;
      }
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

    /**
     * 
     * 提交修改
     */
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false;

        //根据题的类型，整理正确答案
        if (this.params.category == 2) {
          this.params.optionList.forEach((item, index) => {
            item.sort = index;
            if (this.correctList.indexOf(index) != -1) item.iscorrectoption = 1;
          });
        } else {
          this.params.optionList.forEach((item, index) => {
            item.sort = index;
            if (this.correct == index) item.iscorrectoption = 1;
          });
        }

        this.$confirm("是否保存？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            if (this.params.id) {
              const { data: resData } = await updateWord(this.params);
              if (!resData.data.status) return;

              this.$router.go(-1);
              this.$message.success("修改成功");
            } else {
              const { data: resData } = await addWord(this.params);
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
      this.queryInfo();
    }
  },
};
</script>
