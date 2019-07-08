import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  // 可以通过store.state来获取状态对象

  // 通过store.commit 方法触发状态变更 
  //通过提交 mutation 的方法改变this.store.state.xxx 里面的属性
  state:{
    user: JSON.parse(window.localStorage.getItem('user_info'))
  },
  mutations:{
    changeUser(state,data){
      // console.log(state);
      // console.log(data);
      // console.log(user);
      // 修改容器中的用户信息，对象拷贝，将data中的数据成员拷贝到state.user中
      Object.assign(state.user,data)
      // 将修改之后的用户信息，备份一份到本地存储
      window.localStorage.setItem('user_info',JSON.stringify(state.user))
    }
  }
})

export default store

