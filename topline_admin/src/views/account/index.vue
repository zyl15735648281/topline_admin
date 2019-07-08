<template>
  <el-card>
    <div slot="header">
      <span>账户设置</span>
    </div>
    <el-row>
      <el-col :offset="2" :span="8">
        <el-form>
          <el-form-item label="媒体名称">
            <el-input v-model="userInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="媒体简介">
            <el-input v-model="userInfo.intro"></el-input>
          </el-form-item>
          <el-form-item label="头条号">
            <el-input disabled :value="userInfo.id && userInfo.id.toString()"></el-input>
          </el-form-item>
          <el-form-item label="绑定手机">
            <el-input disabled v-model="userInfo.mobile"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="userInfo.type"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handelUpload">保存更新</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :offset="2" :span="4">
        <!-- 这里本来可以自己发送页面，但是不可以需要使用axios发送求情 -->
        <el-upload
          class="avatar-uploader"
          action="http://ttapi.research.itcast.cn/mp/v1_0/user/photo"
          :headers="{Authorization:token}"
          name="photo"
          :show-file-list="false"
          :http-request="handelUpload"
        >
          <img v-if="$store.state.user.photo" :src="$store.state.user.photo" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: "Account",
  components: {},
  data() {
    return {
      userInfo: {},
      token: `Bearer ${
        JSON.parse(window.localStorage.getItem("user_info")).token
      }`
    };
  },
  created() {
    this.loadAccount();
  },
  methods: {
    loadAccount() {
      this.$http({
        method: "GET",
        url: "/user/profile"
      }).then(data => {
        // console.log(111);
        // console.log(data);
        this.userInfo = data;
      });
    },
    handleUpdate() {
      const { name, intro, email } = this.userInfo;
      this.$http({
        method: "PATCH",
        url: "/user/profile",
        data: {
          name,
          intro,
          email
        }
      })
        .then(() => {
          console.log(222);
          this.$message({
            type: "success",
            message: "更新用户信息成功"
          });
        })
        .catch(err => {
          console.log(err);
          this.$message.error("更新用户信息失败");
        });
    },
    handelUpload(uploadConfig) {
      // axios 上传文件
      // 1.构建一个formData表单对象，将文件对象添加到formdata中
      // 2.将formdata配置到请求体的data选项中
      const formData = new FormData();
      formData.append("photo", uploadConfig.file);
      this.$http({
        method: "PATCH",
        url: "/user/photo",
        data: formData
      })
        .then(data => {
          console.log(data);
          // this.userInfo.photo = data.photo;
          // 提交mutation的内容，更改用户信息
          this.$store.commit('changeUser',data)
          this.$message({
            type: "success",
            message: "上传成功"
          });
        })
        .catch(err => {
          console.log(err);
          this.$message.error("上传失败");
        });
    }
  }
};
</script>

<style scoped lang="less">
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
</style>
