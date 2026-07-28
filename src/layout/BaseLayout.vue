<script setup>
import { useRoute } from 'vue-router'
import GlobalHeader from '@/components/GlobalHeader.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
const route = useRoute()

</script>


<template>
  <el-container>
    <el-header class="el-header" style="background-color: #fff; padding-bottom: 100px;">
      <GlobalHeader />
    </el-header>
    <el-main class="el-main">
      <Breadcrumb />
      <router-view :key="route.fullPath"></router-view>
    </el-main>
    <el-footer class="el-footer">全局管理系统 © 2026</el-footer>
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
