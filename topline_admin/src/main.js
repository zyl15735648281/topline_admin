import Vue from 'vue'

import router from './router'
import ElementUI from 'element-ui'
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.less'
import 'nprogress/nprogress.css'
import JSONbig from 'json-bigint'
import App from './App.vue'
// 全局配置路径，为了减少每次请求都写那么长的路径
axios.defaults.baseURL = 'http://toutiao.course.itcast.cn/mp/v1_0/'
// 这里为什么将axios放在原型中就可以直接在页面中 this.xxx 使用了，
// 因为所有的组件都是vue实例，所以 往vue.prototype中添加成员可以直接通过组件实例 this 访问
// 这就是为什么 导入 vue-router，他可以直接使用$router

// 使用JSONbig处理返回数据中超出 JavaScript 安全范围的数字
// JSONbig 自己会分析数据中哪个数字超出范围了
// 由于后端数据 id 超出了 js的安全整数范围，会导致无法准确表识，可以用json-bigint 来处理，它帮你把超出范围的数字处理好
// ----------查看官方文档
axios.defaults.transfromResponse = [function (data) {
  // data 是未经后端处理的后端响应数据：JSON 格式字符串
  return JSONbig.parse(data)
}]
// 配置axios到vue原型中
// 请求拦截器 【统一添加token，相当于对登录框做了个验证】
axios.interceptors.request.use((config) => {
  // config是本次请求相关的配置对象
  // return config 允许通过的方式 
  // 可以通过更改config参数的配置来统一自定义请求相关参数
  const userInfo = JSON.parse(window.localStorage.getItem('user_info'))
  if (userInfo) {
    // 设置请求头[添加统一的token令牌]
    config.headers.Authorization = `Bearer ${userInfo.token}`
  }
  // Do something before request is sent
  return config;
}, (error) => {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use((response) => {
  // console.log(response);
  // Do something with response data
  // 处理401状态码
  return response.data.data;
  // if (typeof response.data === 'object' && response.data.data) {
  //   return response.data.data
  // } else {
  //   return response.data
  // }
}, (error) => {
  // Do something with response error
  // const status = error.response.status
  // if (status === 401) {
  //   // 务必删除本地存储中的用户信息数据
  //   window.localStorage.removeItem('user_info')
  //   // 跳转到登录页面
  //   router.push({
  //     name: 'login'
  //   })
  // }
  return Promise.reject(error)
});
Vue.prototype.$http = axios
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
