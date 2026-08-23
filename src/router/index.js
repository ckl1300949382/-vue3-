import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import UserManage from '@/views/UserManage.vue'
import UserCenter from '@/views/UserCenter.vue'
import { useUserStore } from '@/store/useLoginUserStore'
import { ElMessage } from 'element-plus'
import NotFound from '@/views/NotFound.vue'

const router = createRouter({
  // hash 模式：GitHub Pages 是纯静态托管，不支持 history 模式的服务端路由回退，
  // 用 hash 模式可以避免刷新/直接访问子路径时 404
  history: createWebHashHistory(),
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
      meta: { title: '登录', requestGuest: true }
    },
    {
      path: '/user/register',
      name: 'userRegister',
      component: Register,
      meta: { title: '注册', requestRegister: true }
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