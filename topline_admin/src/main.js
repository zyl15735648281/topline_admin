import Vue from 'vue'

import router from './router'
import ElementUI from 'element-ui'
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.less'
import 'nprogress/nprogress.css'
import JSONbig from 'json-bigint'
import '@/components/common/js/otherRender.js'
import App from './App.vue'
import store from './store'
// 全局配置路径，为了减少每次请求都写那么长的路径
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// 这里为什么将axios放在原型中就可以直接在页面中 this.xxx 使用了，
// 因为所有的组件都是vue实例，所以 往vue.prototype中添加成员可以直接通过组件实例 this 访问
// 这就是为什么 导入 vue-router，他可以直接使用$router

// 使用JSONbig处理返回数据中超出 JavaScript 安全范围的数字
// JSONbig 自己会分析数据中哪个数字超出范围了
// 由于后端数据 id 超出了 js的安全整数范围，会导致无法准确表识，可以用json-bigint 来处理，它帮你把超出范围的数字处理好
// ----------查看官方文档
// 【axios的一个API，axios拿到数据之后，默认会按照JSON格式转换成对象，进入拦截器中的数据是axios处理过的，把原始的JSON格式的字符串转换成javaScript，这里的data就是发送请求前得到的原始数据】
// console.log(typeof data);
// 思路：在外面先转换成JSON格式的字符串，然后再在拦截器中使用json-bigint来处理JSON字符串中超出安全范围的数字问题
axios.defaults.transformResponse = [function (data) {
  // console.log(typeof data);
  // data 是未经后端处理的后端响应数据：JSON 格式字符串
  try {
    return JSONbig.parse(data)
  }catch (err) {
    // console.log(err);
    return data
  }
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
  // return response.data.data;
  // 根据上面的返回数据格式进行再次判断
  if (typeof response.data === 'object' && response.data.data) {
    return response.data.data
  } else {
    return response.data
  }
}, (error) => {
  // Do something with response error
  const status = error.response.status
  if (status === 401) {
    // 务必删除本地存储中的用户信息数据
    window.localStorage.removeItem('user_info')
    // 跳转到登录页面
    router.push({
      name: 'login'
    })
  }
  return Promise.reject(error)
});
Vue.prototype.$http = axios
Vue.use(ElementUI)
Vue.config.productionTip = false

Vue.directive('otherRender',{
  inserted:function (el,name,vm) {
    var  icon='';
    var  vClass='';
    var  type=vm.context.type;
    AllBrnName:forEach(function (item) {
      if(type.indexOf(item.type)!=-1){
        vClass=item.class;
        icon=item.icon;
      }
    });
    var  className=el.getAttribute('class').split('');
    className.push(vClass)
    el.setAttribute('class',className.jion(''));
    //添加图标
    vm.context.otherRender=function (h) {
      return h('i',{
        class:icon
      })
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
