import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import UserManage from '@/views/UserManage.vue'
import UserCenter from '@/views/UserCenter.vue'
import { useUserStore } from '@/store/useLoginUserStore'
import NotFound from '@/views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: '首页' }
    },
    {
      path: '/user/login',
      name: 'userLogin',
      component: Login,
      meta: { title: '登录' }
    },
    {
      path: '/user/register',
      name: 'userRegister',
      component: Register,
      meta: { title: '注册' }
    },
    {
      path: '/user/userManage',
      name: 'userManage',
      component: UserManage,
      meta: { requestAdmin: true, title: '用户管理' }
    },
    {
      path: '/user/center',
      name: 'userCenter',
      component: UserCenter,
      meta: { title: '个人中心', requestUser: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: NotFound,
      meta: { title: '404 Not Found' }
    },
  ],
})

router.beforeEach((to, from, next) => {
  const store = useUserStore()
  if (to.meta.requestAdmin) {
    if (store.isLoggedIn && store.userInfo?.role == 'admin') {
      return true
    } else {
      return '/'
    }
  } else if (to.meta.requestUser) {
    if (store.userInfo) {
      return true
    } else {
      return '/'
    }
  } else {
    return true
  }
})
export default router