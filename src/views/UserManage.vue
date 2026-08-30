<script setup lang="ts">
import { ref } from 'vue'
import UserFormDialog from '@/components/user/UserFormDialog.vue'
import UserTable from '@/components/user/UserTable.vue'
import type { UserVO } from '@/types/user'
import { useKeyboardSubmit } from '@/composable/useKeyboardSubmit'
import { useUserManage } from '@/composable/useUserManage'

const {
  manageDataList, keyword, loading,
  currentPage, pageSize, total, dialogVisible,
  handleSearch, handleCurrentChange, handleDelete, getManageData
} = useUserManage()

// —— 新增状态:正在编辑的用户(null = 新增模式)——
const editingUser = ref<UserVO | null>(null)

// 开弹窗:新增 = 置 null;编辑 = 抄行数据
const handleAdd = () => {
  editingUser.value = null
  dialogVisible.value = true
}
const handleEdit = (row: UserVO) => {
  editingUser.value = row
  dialogVisible.value = true
}

// 弹窗提交成功:关窗 + 刷新列表(刷新是父的职责)
const handleSuccess = () => {
  dialogVisible.value = false
  getManageData()
}

//键盘按键绑定全局，这样在进入页面后就可以直接点击
useKeyboardSubmit(handleSearch)


</script>

<template>

  <UserFormDialog :visible="dialogVisible" :user="editingUser" @close="dialogVisible = false"
    @success="handleSuccess" />




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

    <UserTable :list="manageDataList" :total="total" :current-page="currentPage" :page-size="pageSize"
      :loading="loading" @edit="handleEdit" @delete="handleDelete" @page-change="handleCurrentChange" />
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