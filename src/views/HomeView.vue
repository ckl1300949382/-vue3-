<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getStats } from '@/api/user'

const stats = ref({})
const loading = ref(false)

const getdata = async () => {
  loading.value = true
  try {
    const res = await getStats()
    if (res.code === 200) {
      stats.value = res.data
    } else {
      ElMessage.error(res.message || '获取统计数据失败')
    }
  } catch (err) {
    ElMessage.error('获取统计数据失败')
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  getdata()
})
</script>

<template>
  <div class="home">
    <!-- ===== 顶部欢迎区 ===== -->
    <div class="hero">
      <div class="hero-content">
        <h1 class="hero-title">欢迎回来</h1>
        <p class="hero-desc">这是你的全局管理系统，在这里你可以管理用户、查看数据。</p>
        <div class="hero-tags">
          <span class="hero-tag">Vue 3</span>
          <span class="hero-tag">Vite</span>
          <span class="hero-tag">Vue Router</span>
          <span class="hero-tag">Pinia</span>
          <span class="hero-tag">Element Plus</span>
          <span class="hero-tag">Axios</span>
          <span class="hero-tag">Express</span>
        </div>
      </div>
    </div>

    <!-- ===== 数据统计 ===== -->
    <div class="stats">
      <div class="stat-card">
        <div class="stat-icon stat-icon-users">👤</div>
        <div class="stat-body">
          <span class="stat-num">{{ stats?.total || 0 }}</span>
          <span class="stat-label">用户总数</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon stat-icon-active">✅</div>
        <div class="stat-body">
          <span class="stat-num">{{ stats?.active || 0 }}</span>
          <span class="stat-label">活跃用户</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon stat-icon-admin">🛡️</div>
        <div class="stat-body">
          <span class="stat-num">{{ stats?.admin || 0 }}</span>
          <span class="stat-label">管理员</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon stat-icon-year">📅</div>
        <div class="stat-body">
          <span class="stat-num">{{ stats?.year || 0 }}</span>
          <span class="stat-label">系统年份</span>
        </div>
      </div>
    </div>

    <!-- ===== 内容区 ===== -->
    <div class="content">
      <div class="panel">
        <div class="panel-header">📌 快捷入口</div>
        <div class="panel-body shortcuts">
          <a class="shortcut" href="/user/userManage">
            <span class="shortcut-icon">👥</span>
            <span class="shortcut-text">用户管理</span>
          </a>
          <a class="shortcut" href="/user/login">
            <span class="shortcut-icon">🔑</span>
            <span class="shortcut-text">用户登录</span>
          </a>
          <a class="shortcut" href="/user/register">
            <span class="shortcut-icon">📝</span>
            <span class="shortcut-text">用户注册</span>
          </a>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">ℹ️ 系统信息</div>
        <div class="panel-body">
          <div class="info-row">
            <span class="info-key">系统名称</span>
            <span class="info-val">全局管理系统</span>
          </div>
          <div class="info-row">
            <span class="info-key">前端版本</span>
            <span class="info-val">Vue 3 + Element Plus</span>
          </div>
          <div class="info-row">
            <span class="info-key">后端版本</span>
            <span class="info-val">Express</span>
          </div>
          <div class="info-row">
            <span class="info-key">运行状态</span>
            <span class="info-val">
              <span class="status-dot"></span> 运行中
            </span>
          </div>
        </div>
      </div>
    </div>

	  </div>
	</template>

<style scoped>
/* ===== 整体容器 ===== */
.home {
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 24px 0;
}

/* ===== 欢迎区 ===== */
.hero {
  background: linear-gradient(135deg, #1a2a6c 0%, #2d4373 50%, #1e3c72 100%);
  border-radius: var(--radius-lg);
  padding: 48px 40px;
  margin-bottom: 28px;
  color: #fff;
}

.hero-title {
  font-size: 30px;
  font-weight: var(--weight-bold);
  margin: 0 0 10px;
}

.hero-desc {
  font-size: 15px;
  margin: 0 0 20px;
  opacity: 0.85;
  line-height: 1.6;
}

.hero-tags {
  display: flex;
  gap: 10px;
}

.hero-tag {
  display: inline-block;
  padding: 4px 16px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: var(--weight-medium);
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(4px);
  color: #fff;
}

/* ===== 统计卡片 ===== */
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}

.stat-card {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-normal), transform var(--transition-normal);
  cursor: default;
}

.stat-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.stat-icon-users {
  background: var(--primary-bg);
}

.stat-icon-active {
  background: #f0f9eb;
}

.stat-icon-admin {
  background: #fdf6ec;
}

.stat-icon-year {
  background: #f4f4f5;
}

.stat-body {
  display: flex;
  flex-direction: column;
}

.stat-num {
  font-size: 24px;
  font-weight: var(--weight-bold);
  color: var(--text-primary);
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 2px;
}

/* ===== 内容面板 ===== */
.content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 40px;
}

.panel {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.panel-header {
  padding: 16px 20px;
  font-size: 15px;
  font-weight: var(--weight-bold);
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-lighter);
}

.panel-body {
  padding: 16px 20px;
}

/* 快捷入口 */
.shortcuts {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.shortcut {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  background: var(--bg-hover);
  text-decoration: none;
  color: var(--text-primary);
  transition: background var(--transition-fast);
}

.shortcut:hover {
  background: var(--primary-bg);
}

.shortcut-icon {
  font-size: 20px;
}

.shortcut-text {
  font-size: 14px;
  font-weight: var(--weight-medium);
}

/* 系统信息 */
.info-row {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-lighter);
}

.info-row:last-child {
  border-bottom: none;
}

.info-key {
  width: 90px;
  font-size: 13px;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.info-val {
  font-size: 13px;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--success);
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .content {
    grid-template-columns: 1fr;
  }

  .hero {
    padding: 32px 24px;
  }

  .hero-title {
    font-size: 24px;
  }
}
</style>
