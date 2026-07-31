<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { updateUser, changePassword } from '@/api/user'
import { useUserStore } from '@/store/useLoginUserStore'


const router = useRouter()

const FormLabelAlign = ref({
  username: '',
  name: '',
  email: '',
  role: '',
  status: 1,
  createdAt: ''
})

// 在 onMounted 中初始化数据（此时 Pinia 已就绪）
onMounted(() => {
  const userStore = useUserStore()
  FormLabelAlign.value = {
    username: userStore.userInfo?.username || '',
    name: userStore.userInfo?.name || '',
    email: userStore.userInfo?.email || '',
    role: userStore.userInfo?.role || '',
    status: userStore.userInfo?.status || 1,
    createdAt: userStore.userInfo?.createdAt || ''
  }
})

const handleSubmit = async () => {
  const userStore = useUserStore()
  const res = await updateUser(userStore.userInfo?.id, {
    name: FormLabelAlign.value.name,
    email: FormLabelAlign.value.email,
  })

  if (res.code === 200) {
    ElMessage.success('修改成功')
    userStore.updateUserInfo({
      name: FormLabelAlign.value.name,
      email: FormLabelAlign.value.email
    })
  } else {
    ElMessage.error(res.message || '修改失败')
  }
}

const handleLogoutClick = () => {
  const userStore = useUserStore()
  userStore.logout()
  ElMessage.success('退出登录成功')
  router.push('/')
}

// 修改密码
const dialogVisible = ref(false)
const handlePassword = () => {
  dialogVisible.value = true
}

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const submitForm = async () => {
  try {
    const userStore = useUserStore()
    if (!passwordForm.value.oldPassword) {
      ElMessage.error('请输入旧密码')
      return
    }
    if (!passwordForm.value.newPassword) {
      ElMessage.error('请输入新密码')
      return
    }
    if (!passwordForm.value.confirmPassword) {
      ElMessage.error('请再次确认新密码')
      return
    }
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      ElMessage.error('两次输入密码不一致')
      return
    }
    const res = await changePassword(userStore.userInfo?.id, {
      oldPassword: passwordForm.value.oldPassword,
      newPassword: passwordForm.value.newPassword
    })
    if (res.code === 200) {
      ElMessage.success('修改成功')
      dialogVisible.value = false
      passwordForm.value = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  } catch (err) {
    ElMessage.error(err?.message || '修改失败')
  }
}
const resetForm = (formName) => {
  passwordForm.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}

</script>

<template>
  <el-dialog title="修改密码" v-model="dialogVisible" width="400px">
    <el-form status-icon :model="passwordForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input type="password" v-model="passwordForm.oldPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="newPassword">
        <el-input type="password" v-model="passwordForm.newPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="再次确认新密码" prop="confirmPassword">
        <el-input type="password" v-model="passwordForm.confirmPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>


  <div class="user-center">
    <el-card class="center-card">
      <template #header>
        <div class="card-header">
          <span>个人中心</span>
        </div>
      </template>

      <el-form label-width="100px" size="large">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="用户名">
              <el-input v-model="FormLabelAlign.username" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名">
              <el-input v-model="FormLabelAlign.name" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="邮箱">
              <el-input v-model="FormLabelAlign.email" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色">
              <el-tag type="danger" size="large">{{ FormLabelAlign.role }}</el-tag>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="状态">
              <el-tag type="success" size="large">{{ FormLabelAlign.status === 1 ? '正常' : '禁用' }}</el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="注册时间">
              <el-input v-model="FormLabelAlign.createdAt" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item class="form-actions">
          <el-button type="primary" size="large" @click="handleSubmit">保存修改</el-button>
          <el-button size="large" @click="handlePassword">修改密码</el-button>
          <el-button size="large" @click="handleLogoutClick">退出登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.user-center {
  max-width: 700px;
  margin: 30px auto;
  padding: 0 20px;
}

.center-card {
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}

.card-header {
  font-size: 18px;
  font-weight: var(--weight-bold);
  color: var(--text-primary);
}

.form-actions {
  padding-left: 100px;
}
</style>
