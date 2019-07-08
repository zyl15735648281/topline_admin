<template>
  <el-card>
    <div slot="header">
      <span>图片管理</span>
    </div>
    <div class="action" style="margin:10px">
      <el-radio-group v-model="active">
        <el-radio-button label="全部" @click.native="loadImages(false)"></el-radio-button>
        <el-radio-button label="收藏" @click.native="loadImages(true)"></el-radio-button>
      </el-radio-group>
      <el-upload
        class="upload-demo"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="{Authorization: `Bearer ${$store.state.user.token}` }"
        name="image"
        :show-file-list="false"
        :on-success="handleUplaodSuccess"
        :value="images.url"
      >
      <!-- 这里的name属性是因为单张图片，所以需要去掉绑定的列表，传入上传类型的字段 -->
      <!-- 这里的on-success是属性不是方法，所以需要绑定事件来处理 -->
      <!-- on-success是prop参数，绑定数据 -->
      <el-button size="big" type="primary">点击上传</el-button>
      </el-upload>
    </div>
    <el-row>
      <el-col :span="6" :body-style="{ padding: '0px'}" v-for="item in images" :key="item.id">
        <el-card style="height:300px;width:260px;text-align:center;">
          <img :src="item.url" style="display:block;height:200px;width:220px;" />
          <div style="padding:10px; display:flex; justify-content:center;">
            <el-button
              :icon="item.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
              type="success"
              circle
              plain
              @click="handleCollect(item)"
              style="margin-right:20px;background-color:#67c23a;color:white"
            ></el-button>
            <el-button icon="el-icon-delete" type="danger" @click="handleDelete(item)"></el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
// import uploadImage from "./components/uploadImage";
export default {
  name: "image",
  components: {
    // uploadImage
  },
  data() {
    return {
      active: "全部",
      images: [] //这里是存放图片的位置
    };
  },
  created() {
    this.loadImages();
  },
  methods: {
    loadImages(collect = false) {
      this.$http({
        method: "GET",
        url: "/user/images",
        params: {
          collect
        }
      }).then(data => {
        // console.log(data);
        this.images = data.results;
      });
    },
    // 这里可以直接传入 item.is_collected
    handleCollect(item) {
      // 定义一个是否收藏的状态，这个状态取决于遍历中的每个is_collected选项，视图中传过来的
      const collect = !item.is_collected;
      this.$http({
        method: "PUT",
        url: `/user/images/${item.id}`,
        data: {
          collect: !item.is_collected
        }
      })
        .then(data => {
          // console.log(data);
          // data里面是 id 和 collect
          // console.log(this.images);
          // 这里传过来的item有id，is_collected，url
          // console.log(111);
          item.is_collected = collect;
          this.$message({
            type: "success",
            message: `${collect ? "" : "取消"}'收藏成功'`
          });
        })
        .catch(err => {
          console.log(err);
          this.$message.error(`${collect ? "" : "取消"}'收藏失败'`);
        });
    },
    handleDelete(item) {
      this.$http({
        method: "DELETE",
        url: `/user/images/${item.id}`
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功"
          });
          this.loadImages();
          // console.log(111);
        })
        .catch(err => {
          this.$message.error("删除失败");
        });
    },
    handleUplaodSuccess() {
      this.loadImages(false);
    }
  }
};
</script>

<style scoped lang="less">
.action {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>