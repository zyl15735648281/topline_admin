<template>
  <div class="login-wrap">
    <div class="login-wrap-form">
      <div class="login-head">
        <img src="./logo_index.png" alt="黑马头条">
      </div>
      <div class="login-form">
        <el-form ref="form" :model="form">
          <el-form-item>
            <el-input v-model="form.mobile" placeholder="手机号"></el-input>
          </el-form-item>
          <el-form-item>
            <!-- 支持栅格布局，一共是24列 -->
            <el-col :span="10">
              <el-input v-model="form.code" placeholder="验证码" class="yzm"></el-input>
            </el-col>
            <el-col :span="10" :offset="2">
              <el-button>获取验证码</el-button>
            </el-col>
          </el-form-item>
          <el-form-item>
            <!-- 给组件加 class，会作用到它的根元素 -->
            <el-button class="btn-login" type="primary" @click="onSubmit">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppLogin",
  components: {},
  data() {
    return {
      form: {
        mobile: "",
        code: ""
      }
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    }
  }
};
</script>

<style scoped lang="less">
.login-wrap {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("./timg.gif") no-repeat;
  background-size: 100% 100%;
  .login-wrap-form {
    background-color: #fff;
    padding: 50px;
    border-radius: 10px;
    .login-head {
      display: flex;
      justify-content: center;
      margin-bottom: 50px;
      img {
        width: 200px;
      }
      .login-form {
          .yzm{
              width: 500px !important;
          }
        .btn-login {
          width: 100%;
        }
      }
    }
  }
}
</style>