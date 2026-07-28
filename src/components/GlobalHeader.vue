<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/useLoginUserStore'

const router = useRouter()
const route = useRoute()
//登录状态
const userStore = useUserStore()
const goLogin = () => {
  router.push('/user/login')
}
// 退出登录：调用 Pinia Store 的 logout 方法
const handleLogout = () => {
  userStore.logout()
  if (route.path === '/') return
  router.push('/') //当用户在首页的时候就不会执行跳转了
}


const activeName = ref(route.name || 'home')

// 标签页名 → 实际路由路径的映射
const routeMap = {
  home: '/',
  userLogin: '/user/login',
  userRegister: '/user/register',
  userManage: '/user/userManage',
  userCenter: '/user/center',
}

// 点击标签切换路由
const handleClick = (tab) => {
  activeName.value = tab.props.name
  router.push(routeMap[tab.props.name] || '/')
}

// 浏览器前进/后退时同步标签高亮
watch(() => route.name, (newName) => {
  if (newName) activeName.value = newName
})
</script>

<template>
  <el-row>
    <el-col :span="4">
      <div class="grid-content bg-purple">
        <img src="https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png" alt="logo" style="height: 60px;">
        <span style="font-size: 20px;color: blue;">全局头</span>
      </div>
    </el-col>
    <el-col :span="16">
      <div class="grid-content bg-purple-light">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="首页" name="home"></el-tab-pane>
          <el-tab-pane label="用户登录" name="userLogin"></el-tab-pane>
          <el-tab-pane label="用户注册" name="userRegister"></el-tab-pane>
          <el-tab-pane label="用户管理" name="userManage"
            v-if="userStore.isLoggedIn && userStore.userInfo?.role == 'admin'"></el-tab-pane>
          <el-tab-pane label="个人中心" name="userCenter" v-if="userStore.isLoggedIn"></el-tab-pane>
        </el-tabs>
      </div>
    </el-col>
    <el-col :span="4">
      <div class="grid-content bg-purple">
        <template v-if="userStore.isLoggedIn">
          <span>{{ userStore.userInfo?.username }}</span>
          <el-button type="primary" @click="handleLogout">退出</el-button>

        </template>
        <template v-else>
          <el-button type="primary" @click="goLogin">登录</el-button>
        </template>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped></style>
