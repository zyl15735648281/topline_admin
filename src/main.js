import Vue from 'vue'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'nprogress/nprogress.css'
import './styles/index.less'
// 导入axios
import axios from 'axios'
import JSONbig from 'json-biginit'

import App from './App.vue'
// 配置axios的基础路由：配置了这个东西以后每次都不用写很长的http地址
//路径中的/，多退少补
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// 这里设置axios拦截器，统一设置token令牌
// 请求拦截器
axios.interceptors.request.use(config => {
  //在发送请求之前要做的事
  // console.log(111);
  // console.log(config);
  //config 是本次请求相关的配置对象
  const userInfo = JSON.parse(window.localStorage.getItem('user_info'))
  // 如果有userInfo，给哪些接口设置令牌，如果没有的话根本进不去
  if(userInfo){
    // 进入这里说明登陆了，才能给需要token的接口统一添加令牌，
    config.headers.Authorization = `Bearer ${userInfo.token}`
  }
  // console.log(userInfo);
  // refresh_token
  // config.headers.Authorization = `Bearer ${userInfo.token}`;
  return config;  //允许通过的方式
}, error => {
  // console.log(config);
  // Do something with request error
  return Promise.reject(error);
});

// 响应拦截器 [这里一定要改成箭头函数，指向Vue实例对象]
axios.interceptors.response.use(response => {
  //在响应拦截器中，统一设置返回的数据格式
  console.log("response=>" + response);
  // return 123;
  return response.data.data;
},error => { //>400的状态码都会进入这里
  // console.log(response);
  const status = error.response.status
  if(status === 401){
    // 务必删除本地存储的用户信息数据
    // 这里不删的话，此时的userInfo还存在
    window.localStorage.removeItem('user_info')
    // 跳转到登录页面
    router.push({
      name:'login'
    })
  }
  return Promise.reject(error);
});

//这句话解决了每个组件都需要引入axios的麻烦，将频繁使用的成员放入vue.prototype中，那么就可以直接在组件中使用this.xxx，【因为所有组件都是vue实例】，所以vue.prototype中添加的成员可以直接通过组件实例的this进行访问
// 往Vue原型中添加成员，尽量使用 $名字起名字，目的是为了防止和组件中的成员冲突
Vue.prototype.$http = axios
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
