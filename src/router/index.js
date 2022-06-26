import Vue from 'vue'
import VueRouter from 'vue-router'
import { getToken } from '@/utils/token'
// import Login from '@/views/Login' // 登录页面引入配置路由
// import Layout from '@/views/Layout'
// import Home from '@/views/Home'// 首页
// import USer from '@/views/User'// 我的
// import Search from '@/views/Search'// 搜索
// import SearchResult from '@/views/Search/SearchResult'
// import ArticleDetail from '@/views/ArticleDetail'
// import UserEdit from '@/views/User/UserEdit.vue'
// import Chat from '@/views/Chat'
Vue.use(VueRouter)

// 路由懒加载
const routes = [
  { path: '/', redirect: '/layout/home' },
  { path: '/login', component: () => import('@/views/Login') },
  {
    path: '/layout',
    component: () => import('@/views/Layout'),
    children: [
      {
        path: 'home',
        component: () => import('@/views/Home'),
        meta: {
          scrollT: 0 // 保存首页离开时的滚动位置
        }
      },
      { path: 'user', component: () => import('@/views/User') }
    ]
  },
  { path: '/search', component: () => import('@/views/Search') },
  { path: '/searchResult/:kw', component: () => import('@/views/Search/SearchResult') },
  { path: '/detail', component: () => import('@/views/ArticleDetail') },
  { path: '/user_edit', component: () => import('@/views/User/UserEdit.vue') },
  { path: '/chat', component: () => import('@/views/Chat') }

]

const router = new VueRouter({
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  if (getToken()?.length > 0 && to.path === '/login') {
    // next(false)
    next('/layout/home')
  } else {
    next()
  }
})
export default router
