<script setup>
import { useRoute } from 'vue-router'
import GlobalHeader from '@/components/GlobalHeader.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
const route = useRoute()
</script>

<template>
  <el-container class="layout-wrapper">
    <el-header class="el-header">
      <GlobalHeader />
    </el-header>
    <el-main class="el-main">
      <div class="main-inner">
        <Breadcrumb />
        <router-view v-slot="{ Component }">
          <transition name="fade-slide">
            <component :is="Component" :key="route.fullPath" />
          </transition>
        </router-view>
      </div>
    </el-main>
    <el-footer class="el-footer">
      <div class="footer-inner">
        <div class="footer-links">
          <a href="#">关于我们</a>
          <a href="#">帮助文档</a>
          <a href="#">联系我们</a>
        </div>
        <div class="footer-info">
          <span class="footer-copy">© 2026 全局管理系统 · 用 Vue 3 构建</span>
          <span class="footer-tech">Vue 3 + Element Plus + Express</span>
        </div>
      </div>
    </el-footer>
  </el-container>
</template>

<style scoped>
.layout-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.el-header {
  background-color: var(--bg-card);
  color: var(--text-primary);
  box-shadow: var(--shadow-sm);
  position: relative;
  z-index: 10;
  height: 60px;
  line-height: 60px;
  padding: 0;
}

.el-main {
  background-color: var(--bg-page);
  color: var(--text-primary);
  flex: 1;
  padding: 0;
}

.main-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 16px 24px;
  text-align: left;
}

.el-footer {
  background-color: var(--bg-card);
  color: var(--text-secondary);
  border-top: 1px solid var(--border-lighter);
  height: auto;
  line-height: 1.6;
  padding: 0;
}

.footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
}

.footer-links {
  display: flex;
  gap: 24px;
}

.footer-links a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color var(--transition-fast);
  font-size: 14px;
}

.footer-links a:hover {
  color: var(--primary);
}

.footer-info {
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.footer-copy {
  color: var(--text-placeholder);
  font-size: 12px;
}

.footer-tech {
  color: var(--text-placeholder);
  font-size: 11px;
}
</style>

<!-- 路由过渡动画 · 非 scoped 确保 transition classes 生效 -->
<style>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
