import axios from 'axios'
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/store/useLoginUserStore'
import router from '@/router'


const instance = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  const store = useUserStore()
  if (store.token) {
    config.headers.Authorization = `Bearer ${store.token}`
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

instance.interceptors.response.use(function (response) {
  const body = response.data
  if (body.code === 200) {
    return body;
  }
  ElMessage.error(body.message || '请求失败')
  return Promise.reject(body)
}, function (error) {
  const isAuthRequest = ['/api/login', '/api/register'].includes(error.config?.url)
  if (isAuthRequest) {
    return Promise.reject(error)
  }
  if (!error.response) {
    ElMessage.error('网络错误，请检查后端服务是否启动')
    return Promise.reject(error)
  }
  if (error?.response?.status === 401) {
    const store = useUserStore()
    store.logout()
    if (router.currentRoute.value.path !== '/user/login') {
      router.push('/user/login').catch(() => { })
    }
    ElMessage.error('登录过期，请从新登录')
  } else {
    ElMessage.error(error?.response?.data?.message || '网络错误')
  }
  return Promise.reject(error)
});

export default instance