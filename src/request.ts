import axios from 'axios'
import { ElMessage } from 'element-plus';


const instance = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
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
  ElMessage.error(error?.response?.data?.message || '网络错误')
  return Promise.reject(error)
});

export default instance