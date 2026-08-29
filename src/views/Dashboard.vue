<script setup lang="ts">
import RegisterTrendChart from '@/components/charts/RegisterTrendChart.vue'
import RolePieChart from '@/components/charts/RolePieChart.vue'
import StatusRingChart from '@/components/charts/StatusRingChart.vue'
import GrowthAreaChart from '@/components/charts/GrowthAreaChart.vue'
</script>

<template>
    <div class="dashboard">
        <h2 class="page-title">数据看板</h2>
        <div class="grid">
            <div class="panel">
                <RegisterTrendChart />
            </div>
            <div class="panel">
                <RolePieChart />
            </div>
            <div class="panel">
                <StatusRingChart />
            </div>
            <div class="panel">
                <GrowthAreaChart />
            </div>
        </div>
    </div>
</template>

<style scoped>
.page-title {
    margin: 0 0 16px;
}

.grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.panel {
    background: #fff;
    border-radius: 8px;
    padding: 8px;
}

@media (max-width: 900px) {
    .grid {
        grid-template-columns: 1fr;
    }
}
</style>