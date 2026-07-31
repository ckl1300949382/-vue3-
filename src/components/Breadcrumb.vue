<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router'
const route = useRoute()
const breadcrumb = computed(() => {
    const items = route.matched.map((item) => ({
        title: item.meta.title || '未知页面',
        path: item.path
    }))
    if (route.path !== '/') {
        items.unshift({
            title: '首页',
            path: '/'
        })
    }
    return items
})
</script>
<template>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="my-breadcrumb">
        <el-breadcrumb-item :to="{ path: item.path }" v-for="item in breadcrumb" :key="item.path">
          {{ item.title }}
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<style scoped>
.my-breadcrumb {
  margin-bottom: 16px;
  font-size: 13px;
}
</style>
