import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/store/useLoginUserStore'
import { ElMessage } from 'element-plus'

const router = createRouter({
  // hash 模式：GitHub Pages 是纯静态托管，不支持 history 模式的服务端路由回退，
  // 用 hash 模式可以避免刷新/直接访问子路径时 404
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: '首页' }
    },
    {
      path: '/user/login',
      name: 'userLogin',
      component: () => import('@/views/Login.vue'),
      meta: { title: '登录', requestGuest: true }
    },
    {
      path: '/user/register',
      name: 'userRegister',
      component: () => import('@/views/Register.vue'),
      meta: { title: '注册', requestRegister: true }
    },
    {
      path: '/user/userManage',
      name: 'userManage',
      component: () => import('@/views/UserManage.vue'),
      meta: { requestAdmin: true, title: '用户管理' }
    },
    {
      path: '/user/center',
      name: 'userCenter',
      component: () => import('@/views/UserCenter.vue'),
      meta: { title: '个人中心', requestUser: true }
    },
    {
      path: '/user/dashboard',
      name: 'dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: { title: '数据看板', requestAdmin: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('@/views/NotFound.vue'),
      meta: { title: '404 Not Found' }
    },
  ],
})

router.beforeEach((to) => {
  const store = useUserStore()
  //拦截用户登录
  if (to.meta.requestGuest) {
    if (store.isLoggedIn) {
      ElMessage.warning('你已登录')
      return '/'
    }
    return true
  }
  //拦截用户注册
  if (to.meta.requestRegister) {
    if (store.isLoggedIn) {
      ElMessage.warning('你都登录了还来干嘛')
      return '/'
    }
    return true
  }
  //拦截普通用户进入管理界面
  if (to.meta.requestAdmin) {
    if (store.isLoggedIn && store.userInfo?.role === 'admin') {
      return true
    }
    ElMessage.warning('该页面需要管理员权限')
    return '/'
  } else if (to.meta.requestUser) {
    if (store.userInfo) {
      return true
    }
    ElMessage.warning('请先登录后再访问')
    return '/'
  } else {
    return true
  }
})
export default router