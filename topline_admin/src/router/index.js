import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const router = new Router({
  routes: [
    // {
    //   name: 'home',
    //   path: '/',
    //   component: () => import('@/views/home')
    // },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login')
    },
    {
      // name: 'layout',
      path: '/',
      component: () => import('@/views/layout'),
      children: [
        {
          name: 'home',
          path: '',
          component: () => import('@/views/home')
        },
        {
          name: 'publish',
          path: '/publish',
          component: () => import('@/views/publish')
        }
      ]
    },
  ]
})

router.beforeEach((to,from,next) => {
  const userInfo = window.localStorage.getItem('user_info')
  if(to.path !== '/login'){
    if(!userInfo){
      next({name: 'login'})
    }
    next()
  }else{
    // 如果是登陆页面，而且还检测到l用户信息，那就不允许访问了
    if(userInfo){
      next(false)
    }
    next()
  }
})
export default router
