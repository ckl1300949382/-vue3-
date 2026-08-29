<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/useLoginUserStore'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const goLogin = () => {
  router.push('/user/login')
}

const handleLogout = () => {
  userStore.logout()
  if (route.path === '/') return
  router.push('/')
}

const activeName = ref(route.name || 'home')

const routeMap = {
  home: '/',
  userLogin: '/user/login',
  userRegister: '/user/register',
  userManage: '/user/userManage',
  userCenter: '/user/center',
  dashboard: '/user/dashboard',
}

const handleClick = (tab) => {
  activeName.value = tab.props.name
  router.push(routeMap[tab.props.name] || '/')
}

watch(() => route.name, (newName) => {
  if (newName) activeName.value = newName
})
</script>

<template>
  <div class="header-frame">
    <!-- 系统标题 - 固定在左侧 -->
    <span class="header-title">用户管理系统</span>

    <!-- 中间区域：与 main 内容左对齐 -->
    <div class="header-body">
      <!-- 导航 Tabs - 左对齐 -->
      <div class="header-nav">
        <el-tabs :model-value="activeName" @tab-click="handleClick">
          <el-tab-pane label="首页" name="home" />
          <el-tab-pane label="用户登录" name="userLogin" v-if="!userStore.isLoggedIn" />
          <el-tab-pane label="用户注册" name="userRegister" v-if="!userStore.isLoggedIn" />
          <el-tab-pane label="用户管理" name="userManage"
            v-if="userStore.isLoggedIn && userStore.userInfo?.role == 'admin'" />
          <el-tab-pane label="数据看板" name="dashboard"
            v-if="userStore.isLoggedIn && userStore.userInfo?.role == 'admin'" />
          <el-tab-pane label="个人中心" name="userCenter" v-if="userStore.isLoggedIn" />
        </el-tabs>
      </div>

      <!-- 用户区 -->
      <div class="header-right">
        <template v-if="userStore.isLoggedIn">
          <span class="header-username">{{ userStore.userInfo?.username }}</span>
          <el-button type="primary" size="small" @click="handleLogout">退出</el-button>
        </template>
        <template v-else>
          <el-button type="primary" size="small" @click="goLogin">登录</el-button>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-frame {
  position: relative;
  height: 60px;
}

.header-title {
  position: absolute;
  left: 24px;
  top: 0;
  line-height: 60px;
  font-size: 17px;
  font-weight: var(--weight-bold);
  color: var(--text-primary);
  white-space: nowrap;
  z-index: 1;
}

.header-body {
  display: flex;
  align-items: center;
  height: 60px;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
  gap: 24px;
}

/* Tab 导航 - 左对齐 */
.header-nav {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  min-width: 0;
  overflow: hidden;
}

.header-nav :deep(.el-tabs) {
  height: 60px;
}

.header-nav :deep(.el-tabs__header) {
  margin: 0;
  border-bottom: none;
}

.header-nav :deep(.el-tabs__nav-wrap) {
  border-bottom: none;
}

.header-nav :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.header-nav :deep(.el-tabs__item) {
  height: 60px;
  line-height: 60px;
  font-size: 14px;
  padding: 0 16px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.header-username {
  font-size: 14px;
  color: var(--text-regular);
  font-weight: var(--weight-medium);
  white-space: nowrap;
}
</style>
