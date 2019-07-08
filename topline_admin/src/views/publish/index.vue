<template>
  <el-card class="publish-card">
    <div slot="header" class="clearfix header">
      <span>发表文章</span>
      <div>
        <el-button
          type="success"
          @click.native="handelPublish(false)"
          :loading="publishLoading"
        >{{ isEdit ? '更新' : '发布'}}</el-button>
        <el-button type="primary" @click.native="handelPublish(true)" :loading="publishLoading">存入草稿</el-button>
      </div>
    </div>
    <el-form v-loading="isEdit && editLoading">
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
      <el-form-item label="封面">
        <el-radio-group v-model="articleForm.cover.type">
          <el-radio :label="1">单图</el-radio>
          <el-radio :label="3">三图</el-radio>
          <el-radio :label="0">无图</el-radio>
          <el-radio :label="-1">自动</el-radio>
        </el-radio-group>
        <!-- 根据不同的类型判断显示不同的组件 -->
        <template v-if="articleForm.cover.type > 0">
          <el-row>
            <el-col :span="6" v-for="n in articleForm.cover.type" :key="n">
              <uploadImage v-model="articleForm.cover.images[n-1]"></uploadImage>
            </el-col>
          </el-row>
        </template>
      </el-form-item>
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
import uploadImage from "./components/uploadImage";
export default {
  name: "AppPublish",
  components: {
    ArticleChannel,
    quillEditor,
    uploadImage
  },
  data() {
    return {
      articleForm: {
        title: "", //标题
        content: "", //内容
        channel_id: "", //频道
        cover: {
          type: 1, //封面类型
          images: [] //图片链接
        }
      },
      editorOption: {
        // some quill options
      },
      editLoading: false,
      publishLoading: false,
      formDirty: false //默认第一次数据未被修改过
    };
  },
  // 监视器：监视组件实例中的成员，当成员发生改变的时候，会被调用
  // 注意：使用watch配置的监视会无法取消，会重复监视，如果需要有一个可以取消的监视，则可以通过 this.$watch 的方式进行监视了
  // 这个监视会被重复调用
  watch:{
    // articleForm:{
    //   handler(){  //当被监视的数据发生改变的时候会被调用
    //     // console.log(123); 
    //     // 这里如果是编辑请求的数据,这里可以先调用监视,再关闭监视
    //     this.formDirty = true; //这里监视表单有改动
    //   },
    //   deep:true // 对象 数组类型需要配置深度监视，如果是普通数据不需要
    //   // immediate： true或者false 默认只有当被监视成员发生改变的时候，才会调用监视函数，如果希望初始值的时候就迪调用一次，则可以配置该值为true

    // }
    $route(to,from){
      // 如果，路由页面来自修改页面，清空表单内容
      if(from.name === 'publish-edit'){
        this.articleForm = {
          title: "", //标题
          content: "", //内容
          channel_id: "", //频道
          cover: {
            type: 1, //封面类型
            images: [] //图片链接
          }
        }
      }
    }
  },
  created() {
    // console.log(this.articleForm);
    // 在这里判断一下
    // console.log(this.$route);
    // console.log(this.$router);
    // if (this.$route.name === "publish-edit") {
    //     // console.log(this.$route.params.id)
    //   this.loadArticle();
    // }
    // 如果这里是更新页面，加载文章列表
    this.isEdit && this.loadArticle();

    //如果是发布页面，一上来就开启监视
    if (this.$route.name === "publish") {
      this.watchForm();
    }
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    },
    // 这里使用计算属性，让publish-edit当属性使用
    isEdit() {
      return this.$route.name === "publish-edit";
    },
    articleId() {
      return this.$route.params.id;
    }
  },
  mounted() {
    // console.log("this is current quill instance object", this.editor);
    // 如果你此时去操作上面数据驱动视图的更新，此时的拿到的 DOM 是更新前的
    // 如果你需要在数据驱改变影响视图更新之后做一些 DOM 操作，可以把代码写到 this.$nextTick()
    // 数据的修改并不是立即触发视图的更新的
    // 这个监视器的监视先于真正的数据修改执行
    // 官方文档也没有对应的说明，只是通过实际代码观察到的效果
    // 这种代码的执行，即便上面先修改数据，后面去监视也会被监视到
    // this.watchForm()
  },
  methods: {
    handelPublish(draft = false) {
      this.publishLoading = true;
      // 在这里判断是更新还是提交
      // 这里还能再继续使用.then是因为axios返回的是promise对象，所以还能继续调用
      if (this.isEdit) {
        // 执行编辑操作
        // this.submitEdit(draft).then(() => {
        //   this.publishLoading = false
        // })
        // this.submitEdit(draft).then(() => {
        //   this.publishLoading = false;
        // });
        this.submitEdit(draft);
      } else {
        // 执行添加
        // this.submitAdd(draft).then(() => {
        //   this.publishLoading = false;
        // });
        this.submitAdd(draft);
      }
    },
    submitEdit(draft) {
      this.publishLoading = true;
      this.$http({
        method: "PUT",
        url: `/articles/${this.articleId}`,
        data: this.articleForm,
        params: {
          draft
        }
      })
        .then(data => {
          console.log(data);
          this.$message({
            type: "success",
            message: "更新成功"
          });
          this.publishLoading = false;
        })
        .catch(err => {
          // console.log(err);
          this.$message.error("更新失败");
          this.publishLoading = false;
        });
    },
    submitAdd(draft) {
      this.publishLoading = true;
      this.$http({
        method: "POST",
        url: "/articles",
        data: this.articleForm,
        params: {
          draft
        }
      })
        .then(data => {
          // console.log(data);
          this.$message({
            type: "success",
            message: "发布成功"
          });
          this.publishLoading = false;
        })
        .catch(err => {
          // console.log(err);
          this.$message.error("发布失败");
          this.publishLoading = false;
        });
    },
    loadArticle() {
      this.editLoading = true;
      this.$http({
        method: "GET",
        url: `/articles/${this.articleId}`
      })
        .then(data => {
          // console.log(data);
          this.editLoading = false;
          // 这个数据的修改也会触发对表单数据的监视，这个数据非用户修改的数据，所以不要让其变脏
          this.articleForm = data;
          this.formDirty = false;
          // vue提供了这样的API，用来延时的
          // 监视器先与加载页面执行
          this.$nextTick(() => {
            // 更新好数据之后，开启监视
            this.watchForm();
          });
        })
        .catch(err => {
          // console.log(err);
          this.$message.error("加载失败");
        });
    },
    // 在这里手动监视对象内部变化
    watchForm() {
      const unWatch = this.$watch(
        "articleForm",
        function() {
          // console.log("watchForm");
          this.formDirty = true;
          // // 关闭监视器
          unWatch();
          // console.log(this.formDirty);
        },
        {
          deep: true
        }
      );
    }
  },
  // 当我们要从当前导航到另一个路由的时候被触发，用组件内的守卫来控制路由的离开
  beforeRouteLeave(to, from, next) {
    // 如果当前用户没有被用户修改过，则让导航直接
    if (!this.formDirty) {
      return next();
    }
    // 如果已经被修改过了，则判断是否保存
    const answer = window.confirm("当前有未保存的数据，确认离开吗？");
    if (answer) {
      // 正常往后进行导航
      next();
    } else {
      // 取消当前导航
      next(false);
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