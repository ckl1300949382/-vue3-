<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/useLoginUserStore'
import { userLogin } from '@/api/user'
import { ElMessage } from 'element-plus'
import { useInputLimit } from '@/composable/useInputLimit'
import { useKeyboardSubmit } from '@/composable/useKeyboardSubmit'
import AuthLayout from '@/components/AuthLayout.vue'

const router = useRouter()
const userStore = useUserStore()

const loginForm = ref({
  username: '',
  password: ''
})

const loading = ref(false)

const { limitLength, limitAlphanumeric } = useInputLimit(20)
const handlePasswordInput = (val) => {
  loginForm.value.password = limitLength(val)
}
const handleUsernameInput = (val) => {
  loginForm.value.username = limitAlphanumeric(val)
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
    const res = await userLogin({
      username: loginForm.value.username,
      password: loginForm.value.password
    })

    if (res.code === 200) {
      ElMessage.success('登录成功')
      userStore.login(res.data.token, res.data.user)
      router.push('/')
    } else {
      ElMessage.error(res.message || '登录失败')
    }
  } catch (error) {
    ElMessage.error('登录失败，请检查网络')
  } finally {
    loading.value = false
  }
}

useKeyboardSubmit(handleLogin)
</script>

<template>
  <AuthLayout title="用户登录">
    <el-form :model="loginForm" class="auth-form" label-width="80px">
      <el-form-item label="用户名">
        <el-input
          :model-value="loginForm.username"
          placeholder="3-20个字符，仅支持英文、数字、下划线"
          @update:model-value="handleUsernameInput"
        />
      </el-form-item>

      <el-form-item label="密码">
        <el-input
          :model-value="loginForm.password"
          type="password"
          placeholder="6-20个字符"
          @update:model-value="handlePasswordInput"
        />
        <div class="form-tip">密码长度需在6-20个字符之间</div>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" class="submit-btn" :loading="loading" @click="handleLogin">
          登录
        </el-button>
      </el-form-item>

      <div class="form-links">
        <el-link type="primary" href="/user/register">还没有账号？去注册</el-link>
      </div>
    </el-form>
  </AuthLayout>
</template>

<style scoped>
.auth-form {
  width: 100%;
}

.submit-btn {
  width: 100%;
  height: 40px;
  font-size: 16px;
}

.form-links {
  text-align: center;
  margin-top: 20px;
}

.form-tip {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 8px;
}
</style>
