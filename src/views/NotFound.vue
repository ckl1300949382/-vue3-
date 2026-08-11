<script setup>
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

const goHome = () => {
    router.push('/')
}
</script>
<template>
    <div class="not-found">
        <h1 class="error-code">404</h1>
        <p class="error-msg">页面不存在</p>
        <p class="error-path">您访问的路径：{{ route.path }}</p>
        <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
</template>

<style scoped>
.not-found {
    text-align: center;
    padding: 80px 20px;
}

.error-code {
    font-size: 96px;
    margin: 0;
    color: #f56c6c;
}

.error-msg {
    font-size: 20px;
    color: #606266;
    margin: 12px 0;
}

.error-path {
    color: #909399;
    margin-bottom: 24px;
}
</style>