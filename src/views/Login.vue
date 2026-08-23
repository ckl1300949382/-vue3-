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
const formRef = ref(null)
const labelPosition = ref('top')
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度 3-20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度 6-20 个字符', trigger: 'blur' }
  ]
}

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
  try {
    await formRef.value?.validate()
  } catch {
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
    }
  } catch (error) {
    // 登录失败的具体原因（密码错误、账号被禁用、网络异常等）
    // 已由 request.ts 全局拦截器统一弹出提示，这里不需要重复弹窗
  } finally {
    loading.value = false
  }
}

useKeyboardSubmit(handleLogin)
</script>

<template>
  <AuthLayout title="用户登录">
    <el-form :model="loginForm" class="auth-form" label-width="80px" :label-position="labelPosition" ref="formRef"
      :rules="rules">
      <el-form-item label="用户名" prop="username">
        <el-input :model-value="loginForm.username" placeholder="3-20个字符，仅支持英文、数字、下划线"
          @update:model-value="handleUsernameInput" />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input :model-value="loginForm.password" type="password" placeholder="6-20个字符"
          @update:model-value="handlePasswordInput" />
        <div class="form-tip">密码长度需在6-20个字符之间</div>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" class="submit-btn" :loading="loading" @click="handleLogin">
          登录
        </el-button>
      </el-form-item>

      <div class="form-links">
        <el-link type="primary" @click="router.push('/user/register')">还没有账号？去注册</el-link>
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
