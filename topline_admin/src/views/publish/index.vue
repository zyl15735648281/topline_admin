<template>
  <el-card class="publish-card">
    <div slot="header" class="clearfix header">
      <span>发表文章</span>
      <div>
        <el-button type="success" @click.native="handelPublish(false)">发布</el-button>
        <el-button type="primary" @click.native="handelPublish(true)">存入草稿</el-button>
      </div>
    </div>
    <el-form>
      <el-form-item>
        <el-input type="text" v-model="articleForm.title" placeholder="标题"></el-input>
      </el-form-item>
      <!-- <el-form-item label="内容">
        <el-input type="textarea" v-model="articleForm.content"></el-input>
      </el-form-item>-->
      <quill-editor
        v-model="articleForm.content"
        ref="myQuillEditor"
        :options="editorOption"
        class="ql-editor"
      ></quill-editor>
      <el-form-item label="封面"></el-form-item>
      <!-- 这里使用组件通信父子传值，实现频道交互 -->
      <el-form-item label="频道">
        <article-channel v-model="articleForm.channel_id"></article-channel>
        <!-- 这一步的value是自定义的要发送的数据，传给article-cahnnel组件的value 到article-cahnnel里面接收 -->
        <!-- 这里$event可以看做是事件对象 -->
        <!-- <article-channel :value="articleForm.channel_id" @input="articleForm.channel_id = $event"></article-channel> -->
        <!-- <el-select v-model="articleForm.channel_id">
          <el-option label="" value=""></el-option>
        </el-select>-->
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import ArticleChannel from "@/components/article-channel";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
export default {
  name: "AppPublish",
  components: {
    ArticleChannel,
    quillEditor
  },
  data() {
    return {
      articleForm: {
        title: "", //标题
        content: "", //内容
        channel_id: '', //频道
        cover: {
          type: 0, //封面类型
          images: [] //图片链接
        },
      },
      editorOption: {
        // some quill options
      }
    };
  },
  created() {
    console.log(this.articleForm);
    // 在这里判断一下
    // console.log(this.$route);
    // console.log(this.$router);
    if (this.$route.name === "publish-edit") {
        console.log(this.$route.params.id)
      this.loadArticle();
    }
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  mounted() {
    // console.log("this is current quill instance object", this.editor);
  },
  methods: {
    handelPublish(draft = false) {
      this.$http({
        method: "POST",
        url: "/articles",
        data: this.articleForm,
        params: {
          draft
        }
      })
        .then(data => {
          console.log(data);
          this.$message({
            type: "success",
            message: "发布成功"
          });
        })
        .catch(err => {
          console.log(err);
          this.$message.error("发布失败");
        });
    },
    loadArticle() {
      this.$http({
        method: "GET",
        url: `/articles/${this.$route.params.id}`
      }).then(data => {
        console.log(data);
        this.articleForm = data
      }).catch(err => {
        console.log(err);
        this.$message.error('加载失败')
      });
    }
  }
};
</script>

<style scoped lang="less">
.publish-card {
  min-height: 100%;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.ql-editor {
  height: 250px !important;
  overflow: scroll;
}
</style>