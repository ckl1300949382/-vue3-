<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '400px'
  }
})
</script>

<template>
  <div class="auth-container">
    <div class="auth-box" :style="{ width }">
      <div class="auth-header">
        <img src="@/assets/logo.svg" alt="logo" class="auth-logo" />
        <h2>{{ title }}</h2>
      </div>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a2a6c 0%, #2d4373 50%, #1e3c72 100%);
}

.auth-box {
  padding: 40px;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
}

.auth-header {
  text-align: center;
  margin-bottom: 30px;
}

.auth-logo {
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
}

.auth-header h2 {
  margin: 0;
  color: var(--text-primary);
}
</style>
