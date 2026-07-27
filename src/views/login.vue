<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/useLoginUserStore'
import { userLogin } from '@/api/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
// 创建用户状态管理实例，用于管理登录状态、token、用户信息
const userStore = useUserStore()

const loginForm = ref({
  username: '',
  password: ''
})

const loading = ref(false)

//键盘按键绑定全局，这样在进入页面后就可以直接点击
const handleKeydown = (event) => {
  if (event.key === 'Enter') {
    handleLogin()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

//表单的输入字符判定
const handleUsernameInput = (e) => {
  let value = e.target.value.replace(/[^\w]/g, '')
  if (value.length > 20) {
    value = value.slice(0, 20)
  }
  loginForm.value.username = value
}

const handlePasswordInput = (e) => {
  let value = e.target.value
  if (value.length > 20) {
    value = value.slice(0, 20)
  }
  loginForm.value.password = value
}

const handleLogin = async () => {
  if (loading.value) return

  const { username, password } = loginForm.value

  if (!username) {
    ElMessage.error('请输入用户名')
    return
  }
  if (username.length < 3) {
    ElMessage.error('用户名至少3个字符')
    return
  }

  if (!password) {
    ElMessage.error('请输入密码')
    return
  }
  if (password.length < 6) {
    ElMessage.error('密码至少6个字符')
    return
  }

  loading.value = true
  try {
    // 2. 调接口
    const res = await userLogin({
      username: loginForm.value.username,
      password: loginForm.value.password
    })

    // 3. 成功后处理
    // axios 返回的 res.data 是后端响应的整个 JSON 对象
    // 后端格式: { code, message, data: { token, user } }
    // 所以要通过 res.data.data 才能拿到 token 和 user
    if (res.data.code === 200) {
      ElMessage.success('登录成功')
      // 调用 Pinia Store 的 login 方法，统一管理登录状态
      // 这个方法内部会自动把 token 和 userInfo 保存到 localStorage
      userStore.login(res.data.data.token, res.data.data.user)
      // 跳转到首页
      router.push('/')
    } else {
      // 后端返回错误时，message 也在 res.data 里面
      ElMessage.error(res.data.message || '登录失败')
    }
  } catch (error) {
    ElMessage.error(error?.response?.data?.message || '登录失败，请检查网络')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <img src="https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png" alt="logo" class="login-logo">
        <h2>用户登录</h2>
      </div>

      <el-form :model="loginForm" class="login-form" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="loginForm.username" placeholder="3-20个字符，仅支持英文、数字、下划线"
            @input="handleUsernameInput"></el-input>
        </el-form-item>

        <el-form-item label="密码">
          <el-input v-model="loginForm.password" type="password" placeholder="6-20个字符"
            @input="handlePasswordInput"></el-input>
          <div class="password-tip">密码长度需在6-20个字符之间</div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="login-btn" :loading="loading" @click="handleLogin">登录</el-button>
        </el-form-item>

        <div class="login-links">
          <el-link type="primary" href="/user/register">还没有账号？去注册</el-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-logo {
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
}

.login-header h2 {
  margin: 0;
  color: #303133;
}

.login-form {
  width: 100%;
}

.login-btn {
  width: 100%;
  height: 40px;
  font-size: 16px;
}

.login-links {
  text-align: center;
  margin-top: 20px;
}

.password-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}
</style>
