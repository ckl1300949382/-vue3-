<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, onUnmounted, ref } from 'vue'
import { getStatusDistribution } from '@/api/stats'
import type { StatusItem } from '@/types/stats'

const chartRef = ref<HTMLDivElement | null>(null)
let charts: echarts.ECharts | null = null

const loadData = async () => {
    const res = await getStatusDistribution()
    if (res.code === 200) {
        renderChart(res.data)
    }
}
const renderChart = (list: StatusItem[]) => {
    if (!chartRef.value) return
    charts = echarts.init(chartRef.value)
    charts.setOption({
        title: { text: '用户状态分布' },
        tooltip: { trigger: 'item', formatter: '{b}: {c}人 ({d}%)' },
        legend: { bottom: 0 },
        series: [{ type: 'pie', radius: ['50%', '70%'], data: list }]
    })
}

const handleResize = () => { charts?.resize() }
onMounted(() => {
    loadData()
    window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    if (charts) {
        charts.dispose()
        charts = null
    }
})

</script>
<template>
    <div ref="chartRef" style="width: 100%; height: 320px"></div>
</template>