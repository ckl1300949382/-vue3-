<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, onUnmounted, ref } from 'vue'
import { getRegisterMonthly } from '@/api/stats'
import type { MonthlyPoint } from '@/types/stats'

const chartRef = ref<HTMLDivElement | null>(null)
let charts: echarts.ECharts | null = null
const loadData = async () => {
    const res = await getRegisterMonthly()
    if (res.code === 200) {
        renderChart(res.data)
    }
}
const renderChart = (list: MonthlyPoint[]) => {
    if (!chartRef.value) return
    charts = echarts.init(chartRef.value)
    charts.setOption({
        title: { text: '近12月注册增长' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: list.map(n => n.month) },
        yAxis: { type: 'value', minInterval: 1 },
        series: [{ type: 'line', data: list.map(n => n.count), smooth: true, areaStyle: {} }]
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