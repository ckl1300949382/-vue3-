import { ElMessage } from 'element-plus';
import { useUserStore } from '@/store/useLoginUserStore'
import router from '@/router'
import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import type { BizResult } from '@/types/api'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// 添加请求拦截器
instance.interceptors.request.use(function (config: InternalAxiosRequestConfig) {
  const store = useUserStore()
  if (store.token) {
    config.headers.Authorization = `Bearer ${store.token}`
  }
  return config;
}, function (error: AxiosError) {
  return Promise.reject(error);
});

instance.interceptors.response.use(function (response: AxiosResponse) {
  const body = response.data
  if (body.code === 200) {
    return body;
  }
  ElMessage.error(body.message || '请求失败')
  return Promise.reject(body)
}, function (error: AxiosError<BizResult<null>>) {
  const isAuthRequest = ['/api/login', '/api/register'].includes(error.config?.url)
  if (isAuthRequest) {
    // 登录/注册属于鉴权接口：错误原因必须让用户看到（如"用户名或密码错误"），
    // 但这里不做登出/跳转，页面只需负责复位 loading
    if (!error.response) {
      ElMessage.error('网络错误，请检查后端服务是否启动')
    } else {
      ElMessage.error(error?.response?.data?.message || '登录或注册失败，请重试')
    }
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
    ElMessage.error('登录过期，请重新登录')
  } else {
    ElMessage.error(error?.response?.data?.message || '网络错误')
  }
  return Promise.reject(error)
});

export default instance