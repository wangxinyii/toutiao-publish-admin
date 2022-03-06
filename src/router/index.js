import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Home from '@/views/home'
import Layout from '@/views/layout'
import Article from '@/views/article'

Vue.use(VueRouter)

//路由配置表
const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    //name: 'layout',
    component: Layout,
    children: [
      {
        path: '', // path 为空会作为默认子路由渲染
        name: 'home',
        component: Home
      },
      {
        path: '/article',
        name: 'article',
        component: Article
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const user = window.localStorage.getItem('user')
  if(to.path !== '/login') {
    if(user) {
      next()
    }else {
      next('/login')
    }
  }else {
    next()
  }
})

export default router
