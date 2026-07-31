<script setup>
import { ref } from 'vue'
import { userRegister } from '@/api/user'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useKeyboardSubmit } from '@/composable/useKeyboardSubmit'
import { useInputLimit } from '@/composable/useInputLimit'
import AuthLayout from '@/components/AuthLayout.vue'

const router = useRouter()

const registerForm = ref({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  name: ''
})

const handleRegister = async () => {
  const { username, password, confirmPassword, email, name } = registerForm.value

  if (!username) { ElMessage.error('请输入用户名'); return }
  if (username.length < 3) { ElMessage.error('用户名至少3个字符'); return }

  if (!password) { ElMessage.error('请输入密码'); return }
  if (password.length < 6) { ElMessage.error('密码至少6个字符'); return }

  if (!confirmPassword) { ElMessage.error('请确认密码'); return }
  if (password !== confirmPassword) { ElMessage.error('两次输入的密码不一致'); return }

  if (!email) { ElMessage.error('请输入邮箱'); return }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { ElMessage.error('邮箱格式不正确'); return }

  if (!name) { ElMessage.error('请输入姓名'); return }
  if (name.length < 2) { ElMessage.error('姓名至少2个字符'); return }

  const res = await userRegister({
    username, password, email, name
  })

  if (res.code === 200) {
    ElMessage.success('注册成功')
    router.push('/user/login')
  } else {
    ElMessage.error(res.message || '注册失败')
  }
}

useKeyboardSubmit(handleRegister)

const { limitLength, limitAlphanumeric } = useInputLimit(20)

const handleUsernameInput = (val) => {
  registerForm.value.username = limitAlphanumeric(val)
}
const handlePasswordInput = (val) => {
  registerForm.value.password = limitLength(val)
}
const handleNameInput = (val) => {
  registerForm.value.name = limitLength(val)
}
const handleConfirmPasswordInput = (val) => {
  registerForm.value.confirmPassword = limitLength(val)
}
</script>

<template>
  <AuthLayout title="用户注册" width="450px">
    <el-form :model="registerForm" class="auth-form" label-width="80px">
      <el-form-item label="用户名">
        <el-input
          :model-value="registerForm.username"
          placeholder="请输入用户名"
          @update:model-value="handleUsernameInput"
        />
      </el-form-item>

      <el-form-item label="密码">
        <el-input
          :model-value="registerForm.password"
          type="password"
          placeholder="请输入密码"
          @update:model-value="handlePasswordInput"
        />
      </el-form-item>

      <el-form-item label="确认密码">
        <el-input
          :model-value="registerForm.confirmPassword"
          type="password"
          placeholder="请再次输入密码"
          @update:model-value="handleConfirmPasswordInput"
        />
      </el-form-item>

      <el-form-item label="邮箱">
        <el-input v-model="registerForm.email" placeholder="请输入邮箱" />
      </el-form-item>

      <el-form-item label="姓名">
        <el-input
          :model-value="registerForm.name"
          placeholder="请输入姓名"
          @update:model-value="handleNameInput"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" class="submit-btn" @click="handleRegister">注册</el-button>
      </el-form-item>

      <div class="form-links">
        <el-link type="primary" href="/user/login">已有账号？去登录</el-link>
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
</style>
