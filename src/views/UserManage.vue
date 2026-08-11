<script setup>
import { ref, onMounted } from 'vue'
import { manageData, deleteUser, addUser, updateUser } from '@/api/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useKeyboardSubmit } from '@/composable/useKeyboardSubmit'
import { usePage } from '@/composable/usePage'
import { useDebounce } from '@/composable/useDebounce'
import { useUserStore } from '@/store/useLoginUserStore'



const manageDataList = ref([])
const keyword = ref('')
const { currentPage, pageSize, total, onPageChange, resetPage } = usePage()

const loading = ref(false)
const labelPosition = ref('right')

//分页查询用户列表
const getManageData = async () => {
  loading.value = true
  try {
    const res = await manageData(keyword.value, currentPage.value, pageSize.value)
    manageDataList.value = res.data.list
    total.value = res.data.total
  } catch (err) {
    console.error('获取用户列表失败', err);
    ElMessage.error('获取用户列表失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
onMounted(() => { getManageData() })



// 增加用户
//通用表单
const formLabelAlign = ref({
  username: '',
  name: '',
  email: '',
  password: '',
  role: 'user',
  status: 1
})
const isEditMode = ref(false)
const editId = ref(null)
const dialogVisible = ref(false)
const handleAdd = () => {
  isEditMode.value = false
  dialogVisible.value = true
  editId.value = null
  formLabelAlign.value = {       // 清空表单
    username: '',
    name: '',
    email: '',
    password: '',
    role: 'user',
    status: 1
  }
}
//编辑用户
const handleEdit = (row) => {
  isEditMode.value = true
  editId.value = row.id
  formLabelAlign.value = {
    username: row.username,
    name: row.name,
    email: row.email,
    password: '',
    role: row.role,
    status: row.status
  }
  dialogVisible.value = true
}
const handleSubmit = async () => {
  let res
  if (!formLabelAlign.value.username) {
    ElMessage.error('请输入用户名')
    return
  }
  if (!formLabelAlign.value.name) {
    ElMessage.error('请输入姓名')
    return
  }
  if (!formLabelAlign.value.email) {
    ElMessage.error('请输入邮箱')
    return
  }
  if (!isEditMode.value && !formLabelAlign.value.password) {
    ElMessage.error('请输入密码')
    return
  }
  if (isEditMode.value) {
    res = await updateUser(editId.value, {
      name: formLabelAlign.value.name,
      email: formLabelAlign.value.email,
      role: formLabelAlign.value.role,
      status: formLabelAlign.value.status
    })
  } else {
    res = await addUser({
      username: formLabelAlign.value.username,
      name: formLabelAlign.value.name,
      email: formLabelAlign.value.email,
      password: formLabelAlign.value.password
    })
  }

  if (res.code === 200) {
    ElMessage.success(isEditMode.value ? '更新成功' : '添加成功')
    getManageData()
    dialogVisible.value = false
    formLabelAlign.value = {
      username: '',
      name: '',
      email: '',
      password: '',
      role: 'user',
      status: 1,
    }
  } else {
    ElMessage.error(res.message || '提交失败')
  }
}

//删除用户
const handleDelete = async (id) => {
  const shore = useUserStore()
  if (shore.userInfo.id === id) {
    ElMessage.error('不能删除自己')
    return
  }
  try {
    await ElMessageBox.confirm('确认删除，该用户？', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const res = await deleteUser(id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      getManageData()
    } else {
      ElMessage.error(res.message || '删除失败')
    }
  } catch (err) {
    if (err === 'cancel' || err === 'close') {
      return
    }
    ElMessage.error(err?.message || '删除失败，请稍后重试')
  }
}

//搜索
const handleSearch = useDebounce(() => {
  resetPage()
  getManageData()
})
const handleCurrentChange = (e) => {
  onPageChange(e)
  getManageData()
}

//键盘按键绑定全局，这样在进入页面后就可以直接点击
useKeyboardSubmit(handleSearch)


</script>

<template>

  <!-- 查找用户的表单 -->
  <el-dialog v-model="dialogVisible" :title="isEditMode ? '编辑用户' : '新增用户'" width="500px">
    <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
      <el-form-item label="用户名">
        <el-input v-model="formLabelAlign.username"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="formLabelAlign.name"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="formLabelAlign.email"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formLabelAlign.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="formLabelAlign.role">
          <el-option label="管理员" value="admin" />
          <el-option label="普通用户" value="user" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="formLabelAlign.status">
          <el-option label="正常" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item size="large">
        <el-button type="primary" @click="handleSubmit">提交</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>




  <div class="manage-container">
    <!-- 标题区 -->
    <div class="page-header">
      <h1>用户管理</h1>
      <p class="page-desc">管理系统中的所有用户</p>
    </div>

    <!-- 工具栏：搜索 + 增加用户按钮 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <el-input v-model="keyword" placeholder="搜索用户名..." style="width: 240px" clearable />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
      <div class="toolbar-right">
        <el-button type="success" @click="handleAdd">增加用户</el-button>
      </div>
    </div>

    <!-- 用户表格 -->
    <el-table :data="manageDataList" border stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="60" align="center" />
      <el-table-column prop="username" label="用户名" width="100" />
      <el-table-column prop="name" label="姓名" width="100" />
      <el-table-column prop="email" label="邮箱" min-width="180" />

      <!-- 角色列：用 el-tag 显示 -->
      <el-table-column prop="role" label="角色" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.role === 'admin' ? 'danger' : 'primary'" effect="plain">
            {{ row.role === 'admin' ? '管理员' : '普通用户' }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- 状态列：用 el-tag 显示 -->
      <el-table-column prop="status" label="状态" width="80" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'" effect="plain" size="small">
            {{ row.status === 1 ? '正常' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="createdAt" label="注册时间" width="180" />

      <!-- 操作列 -->
      <el-table-column label="操作" width="160" align="center">
        <template #default="{ row }">
          <el-button size="small" type="primary" plain @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" plain @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :total="total" :current-page="currentPage"
      :page-size="pageSize" @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>

<style scoped>
.manage-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px;
  text-align: left;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 22px;
  margin: 0 0 6px;
  color: var(--text-primary);
}

.page-desc {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
}

.toolbar {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toolbar-left {
  display: flex;
  gap: 10px;
}

.toolbar-right {
  display: flex;
  gap: 10px;
}
</style>