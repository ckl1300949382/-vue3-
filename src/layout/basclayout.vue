<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import GLobalHeader from '@/components/GlobalHeader.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
const route = useRoute()

// 调试：监听路由变化
watch(() => route.fullPath, (path) => {
  console.log('路由变化:', path, '组件:', route.component)
})
</script>


<template>
  <el-container>
    <el-header class="el-header" style="background-color: #fff; padding-bottom: 100px;">
      <GLobalHeader />
    </el-header>
    <el-main class="el-main">
      <Breadcrumb />
      <router-view :key="route.fullPath"></router-view>
    </el-main>
    <el-footer class="el-footer">Footer</el-footer>
  </el-container>
</template>

<style scoped>
.el-header,
.el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
}
</style>
