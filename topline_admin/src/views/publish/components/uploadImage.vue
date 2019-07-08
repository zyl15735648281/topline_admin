这里将图片当成一个组件
<template>
  <div>
    <div class="box-wrap" @click="handleShowMediBox">
      <p>点击图标选择图片</p>
      <i
        style="margin-top: 20px;
      font-size: 90px; color: #eee;"
        class="iconfont icon-image_upload"
        v-if="!value"
      ></i>
      <img v-else style="width:140px;height:140px" :src="value" />
    </div>
    <!-- 对话框 -->
    <el-dialog title="上传图片" :visible.sync="dialogVisible" width="60%">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材" name="first">
          <el-radio-group v-model="radio1">
            <el-radio-button label="全部"></el-radio-button>
            <el-radio-button label="收藏"></el-radio-button>
          </el-radio-group>
          <el-row :gutter="20" style="margin-top:20px">
            <el-col :span="8" v-for="item in imgCollect" :key="item.id">
              <el-card style="height:240px;width:260px;text-align:center;">
                <!-- 这个图片应该做一个判断，通过 is_collected的属性来判断 -->
                <img :src="item.url" style="display:block;height:200px;width:220px;" />
              </el-card>
            </el-col>
          </el-row>
          <!-- 分页 -->
          <!-- 1.总共多少页  totalCount
          2.每页多少个，默认显示哪页数据， -->
          <el-pagination
            background
            layout="prev, pager, next"
            :page-count="Math.ceil(totalCount/3)"
            class="center"
            @current-change="getPageImages"
          >
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="second">上传图片</el-tab-pane>
        <el-upload
          class="avatar-uploader"
          action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
          :headers="{ Authorization: `Bearer ${$store.state.user.token}` }"
          name="image"
          :show-file-list="false"
          :on-success="handleAddImage"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "uploadImage",
  components: {},
  props:['value'], //这里的value就是从publish页面上传的cover.image[]的图片
  data() {
    return {
      dialogVisible: false,
      activeName: "first",
      radio1: "全部",
      imgUrl: null,
      imgCollect:[],
      totalCount:0,
    };
  },
  methods: {
    handleShowMediBox() {
      // 1.在这里展示对话框
      this.dialogVisible = true;
      // 2.并且在素材这里直接加载素材库的图片
      this.loadImage()
    },
    loadImage(page = 1){
      this.$http({
        method:'GET',
        url:'/user/images',
        params:{
          page,
          per_page:3,
        }
      }).then(data => {
        console.log(data);
        // 发送请求成功，在全部里面加载is_collected为false的内容，在收藏里面加载is_collected为true的内容
        // const collect = !data.is_collected;
        if(data.is_collected = true){
          this.imgCollect = data.results
        }
        // data.is_collected = collect;
        // console.log(data.per_page);
        // this.totalCount = this.per_page
        this.totalCount = data.total_count
        // console.log(this.totalCount);
        
      })
    },
    getPageImages(page){
      // 当页码发生变化的时候，请求该页面的数据
      this.loadImage(page)
    },
    handleAddImage(res){
      // 上传成功，返回结果
      console.log(res);
      // 这里上传成功，将链接传出去
      this.imgUrl = res.data.url
      //上传成功之后，点击确定时候需要将图片上传到发布页面，需要通过组件之间的通信，让上传的图片显示在发布页面
    },
    handleOk() {
      this.$emit('input',this.imgUrl)  //将数据同步到绑定的数据中
      this.dialogVisible = false  //隐藏对话框
    }
  }
};
</script>

<style scoped lang="less">
.box-wrap {
  width: 200px;
  height: 200px;
  border: 1px solid #eee;
  cursor: pointer;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.center{
  display:flex;
  justify-content: center;
  align-items: center;
  margin-top:20px;
}
</style>
