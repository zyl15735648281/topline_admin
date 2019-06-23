<template>
  <div class="login-wrap">
    <div class="login-wrap-form">
      <div class="login-head">
        <img src="./logo_index.png" alt="黑马头条">
      </div>
      <div class="login-form">
        <el-form :model="form" :rules="rules" ref="ruleForm">
          <el-form-item prop="mobile">
            <el-input v-model="form.mobile" placeholder="手机号"></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <!-- 支持栅格布局，一共是24列 -->
            <el-col :span="10">
              <el-input v-model="form.code" placeholder="验证码" class="yzm"></el-input>
            </el-col>
            <el-col :span="10" :offset="2">
              <el-button @click="handelSendCode">获取验证码</el-button>
            </el-col>
          </el-form-item>
          <el-form-item>
            <!-- 给组件加 class，会作用到它的根元素 -->
            <el-button class="btn-login" type="primary" @click="handleLogin" :loading="loginLoding">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import '@/vendor/gt.js';

export default {
  name: 'AppLogin',
  components: {},
  data () {
    return {
      form: {
        mobile: '15735648281',
        code: ''
      },
      loginLoding:false,
      rules: {
        mobile: [
          { required: true,message: "请输入手机号",trigger: "blur" },
          { len: 11,message: "长度必须为11个字符",trigger: "blur" }
        ],
        code: [
          { required: true,message: "请输入验证码",trigger: "blur" },
          { len: 6,message: "长度必须为6个字符",trigger: "blur" }
        ]
      },
      captchaObj: null
    }
  },
  methods: {
    handleLogin () {
      // 表单组件的一个方法
      this.$refs['ruleForm'].validate(valid => {
        if (!valid) {
          return
        }
        // 表单通过验证，提交登录
        this.submitLogin()
      })
    },
    submitLogin () {
      this.loginLoding = true,
      axios({
        method: 'POST',
        url: 'http://ttapi.research.itcast.cn/mp/v1_0/authorizations',
        data: this.form
      }).then(res => {
          // 使用组件提示信息
          this.$message({
            message: '恭喜你，这是一条成功消息',
            type: 'success',
          })
          this.loginLoding = false,
          // 路由跳转应该都使用name去跳转
          this.$router.push({
            name: 'home'
          })
        }).catch(err => {
          if (err.response.status === 400) {
            this.$message.error("登录失败，手机号或者验证码错误")
            console.dir(err)
            this.loginLoding = false
          }
        })
    },
    handelSendCode () {
      const { mobile } = this.form
      if (this.captchaObj) {
        return this.captchaObj.verify()
      }
      axios({
        method: 'GET',
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${mobile}`
      }).then(res => {
        // 这里得到的是一个数组，数组里面的data
        // console.log(res.data)
        const data = res.data.data
        window.initGeetest(
          {
            gt: data.gt,
            challenge: data.challenge,
            offline: !data.success,
            new_captcha: data.new_captcha,
            product: 'bind' //隐藏式按钮
          },
          captchaObj => {
            this.captchaObj = captchaObj;
            captchaObj.onReady(function() {
                //验证码ready之后才能调用verify方法显示验证码
                captchaObj.verify()
              })
              .onSuccess(function() {
                // 这里进行二次验证
                const {
                  geetest_challenge: challenge,
                  geetest_seccode: seccode,
                  geetest_validate: validate
                } = captchaObj.getValidate()
                // 调用 获取短信验证码接口
                axios({
                  method: 'GET',
                  url: `http://ttapi.research.itcast.cn/mp/v1_0/sms/codes/${mobile}`,
                  //这个参数用来 传递 query 查询字符串参数
                  params: {
                    challenge,
                    seccode,
                    validate
                  }
                }).then(res => {
                  console.log(res.data)
                })
              })
          }
        )
      })
    }
  }
}
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
    }
  }
  .login-form {
    .btn-login {
      width: 100%;
    }
  }
}
</style>
