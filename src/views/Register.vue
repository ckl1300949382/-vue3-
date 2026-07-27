<script setup>
import { ref } from 'vue'
import { userRegister } from '@/api/user'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

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

  // 用户名验证
  if (!username) { ElMessage.error('请输入用户名'); return }
  if (username.length < 3) { ElMessage.error('用户名至少3个字符'); return }

  // 密码验证
  if (!password) { ElMessage.error('请输入密码'); return }
  if (password.length < 6) { ElMessage.error('密码至少6个字符'); return }

  // 确认密码验证
  if (!confirmPassword) { ElMessage.error('请确认密码'); return }
  if (password !== confirmPassword) { ElMessage.error('两次输入的密码不一致'); return }

  // 邮箱验证
  if (!email) { ElMessage.error('请输入邮箱'); return }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { ElMessage.error('邮箱格式不正确'); return }

  // 姓名验证
  if (!name) { ElMessage.error('请输入姓名'); return }
  if (name.length < 2) { ElMessage.error('姓名至少2个字符'); return }
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }

  const res = await userRegister({
    username: registerForm.value.username,
    password: registerForm.value.password,
    email: registerForm.value.email,
    name: registerForm.value.name
  })

  if (res.data.code === 200) {
    ElMessage.success('注册成功')
    router.push('/user/login')
  } else {
    ElMessage.error('注册失败')
  }
}


//表单校验
const handleUsernameInput = (e) => {
  let value = e.target.value.replace(/[^\w]/g, '')
  if (value.length > 20) {
    value = value.slice(0, 20)
  }
  registerForm.value.username = value
}
const handlePasswordInput = (e) => {
  let value = e.target.value
  if (value.length > 20) {
    value = value.slice(0, 20)
  }
  registerForm.value.password = value
}
const handleNameInput = (e) => {
  let value = e.target.value
  if (value.length > 20) {
    value = value.slice(0, 20)
  }
  registerForm.value.name = value
}
const handleConfirmPasswordInput = (e) => {
  let value = e.target.value
  if (value.length > 20) {
    value = value.slice(0, 20)
  }
  registerForm.value.confirmPassword = value
}

</script>

<template>
  <div class="register-container">
    <div class="register-box">
      <div class="register-header">
        <img src="https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png" alt="logo" class="register-logo">
        <h2>用户注册</h2>
      </div>

      <el-form :model="registerForm" class="register-form" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="registerForm.username" placeholder="请输入用户名" @input="handleUsernameInput"></el-input>
        </el-form-item>

        <el-form-item label="密码">
          <el-input v-model="registerForm.password" type="password" placeholder="请输入密码"
            @input="handlePasswordInput"></el-input>
        </el-form-item>

        <el-form-item label="确认密码">
          <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请再次输入密码"
            @input="handleConfirmPasswordInput"></el-input>
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input v-model="registerForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>

        <el-form-item label="姓名">
          <el-input v-model="registerForm.name" placeholder="请输入姓名" @input="handleNameInput"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="register-btn" @click="handleRegister">注册</el-button>
        </el-form-item>

        <div class="register-links">
          <el-link type="primary" href="/user/login">已有账号？去登录</el-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-box {
  width: 450px;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-logo {
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
}

.register-header h2 {
  margin: 0;
  color: #303133;
}

.register-form {
  width: 100%;
}

.register-btn {
  width: 100%;
  height: 40px;
  font-size: 16px;
}

.register-links {
  text-align: center;
  margin-top: 20px;
}
</style>
