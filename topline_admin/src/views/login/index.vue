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
              <el-button
                @click="handelSendCode"
                :disabled="!!codeTimer || codeLoading"
              >{{codeTimer ? `剩余${totalCode}秒`: "获取验证码" }}</el-button>
            </el-col>
          </el-form-item>
          <el-form-item prop="agree">
            <el-checkbox v-model="form.agree"></el-checkbox>
            <span>
              我已阅读并同意
              <a href="#">用户协议</a>和
              <a href="#">隐私条款</a>
            </span>
          </el-form-item>
          <el-form-item>
            <!-- 给组件加 class，会作用到它的根元素 -->
            <el-button
              class="btn-login"
              type="primary"
              @click="handleLogin"
              :loading="loginLoding"
            >登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import "@/vendor/gt.js";
const initShowCode = 10;
export default {
  name: "AppLogin",
  components: {},
  data() {
    return {
      form: {
        mobile: "15735648281",
        code: "",
        agree: "" //是否同意用户协议
      },
      loginLoding: false,
      rules: {
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { len: 11, message: "长度必须为11个字符", trigger: "blur" }
        ],
        code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { len: 6, message: "长度必须为6个字符", trigger: "blur" }
        ],
        agree: [
          { required: true, message: "请输入验证码", trigger: "change" },
          { pattern: /true/, message: "请输入验证码", trigger: "change" }
        ]
      },
      captchaObj: null,
      codeTimer: null, //初始化一个定时器
      totalCode: initShowCode, //初始化定时器的时间
      initMobile: "", //定义一个第一次输入的手机号
      codeLoading:false
    };
  },
  methods: {
    handleLogin() {
      // 表单组件的一个方法
      this.$refs["ruleForm"].validate(valid => {
        if (!valid) {
          return;
        }
        // 表单通过验证，提交登录
        this.submitLogin();
      });
    },
    submitLogin() {
      (this.loginLoding = true),
        axios({
          method: "POST",
          url: "http://ttapi.research.itcast.cn/mp/v1_0/authorizations",
          data: this.form
        })
          .then(res => {
            // 在登录成功之后将返回的用户信息放到本地存储
            window.localStorage.setItem('user_info',JSON.stringify(res.data.data))
            // 使用组件提示信息
            this.$message({
              message: "恭喜你，这是一条成功消息",
              type: "success"
            });
            (this.loginLoding = false),
              // 路由跳转应该都使用name去跳转
              this.$router.push({
                name: "home"
              });
          })
          .catch(err => {
            if (err.response.status === 400) {
              this.$message.error("登录失败，手机号或者验证码错误");
              console.dir(err);
              this.loginLoding = false;
            }
          });
    },
    handelSendCode() {
      // 检验手机号是否有效
      this.$refs["ruleForm"].validateField("mobile", errorMessage => {
        if (errorMessage.trim().length > 0) {
          return;
        }
        // 手机号有效，再次判断手机号是否第一个手机号一样[通过验证是否有验证码插件对象]，再选择是否进行初始化
        if (this.captchaObj) {
          if (this.initMobile !== this.form.mobile) {
            // 重新初始化之前要进行将原来的验证码插件插件删除
            document.body.removeChild(document.querySelector('.geetest_panel'))
            this.showGeetest();
          }
          this.captchaObj.verify();
        }
        this.showGeetest();
      });
    },
    showGeetest() {
      // const { mobile } = this.form;
      // 在初始化期间禁用
      this.codeLoading = true
      axios({
        method: "GET",
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${this.form.mobile}`
      }).then(res => {
        // 这里得到的是一个数组，数组里面的data
        // console.log(res.data)
        const data = res.data.data;
        window.initGeetest(
          {
            gt: data.gt,
            challenge: data.challenge,
            offline: !data.success,
            new_captcha: data.new_captcha,
            product: "bind" //隐藏式按钮
          },
          captchaObj => {
            this.captchaObj = captchaObj;
            captchaObj
              .onReady(() => {
                this.initMobile = this.form.mobile
                //验证码ready之后才能调用verify方法显示验证码
                captchaObj.verify();
                //当初始化好之后可以点击验证码
                this.codeLoading = false
              })
              .onSuccess(() => {
                // 这里进行二次验证
                const {
                  geetest_challenge: challenge,
                  geetest_seccode: seccode,
                  geetest_validate: validate
                } = captchaObj.getValidate();
                // 调用 获取短信验证码接口
                axios({
                  method: "GET",
                  url: `http://ttapi.research.itcast.cn/mp/v1_0/sms/codes/${this.form.mobile}`,
                  //这个参数用来 传递 query 查询字符串参数
                  params: {
                    challenge,
                    seccode,
                    validate
                  }
                }).then(res => {
                  // console.log(res.data);
                  // 在这里发送验证码成功，这里显示倒计时
                  this.codeCutDown();
                });
              });
          }
        );
      });
    },
    codeCutDown() {
      this.codeTimer = setInterval(() => {
        this.totalCode--;
        if (this.totalCode <= 0) {
          this.totalCode = initShowCode; //让倒计时回到最初的状态，
          clearInterval(this.codeTimer); //清除倒计时
          this.codeTimer = null; //清除倒计时定时器的标志
        }
      }, 1000);
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
    }
  }
  .login-form {
    .btn-login {
      width: 100%;
    }
  }
}
</style>
