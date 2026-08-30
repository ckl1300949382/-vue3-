<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, onUnmounted, ref } from 'vue'
import { getRegisterTrend } from '@/api/stats'
import type { TrendPoint } from '@/types/stats'

const chartRef = ref<HTMLDivElement | null>(null)

let chart: echarts.ECharts | null = null

const loadData = async () => {
    const res = await getRegisterTrend()
    if (res.code === 200) {
        renderChart(res.data)
    }
}

// 画图
const renderChart = (list: TrendPoint[]) => {
    if (!chartRef.value) return
    chart = echarts.init(chartRef.value)
    chart.setOption({
        title: { text: '30天注册趋势' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: list.map(P => P.date) },
        yAxis: { type: 'value', minInterval: 1 },
        series: [{ type: 'line', data: list.map(p => p.count), smooth: true }]
    })

}

// 窗口变化 → 重画
const handleResize = () => { chart?.resize() }

onMounted(() => {
    loadData()
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    if (chart) {
        chart.dispose()
        chart = null
    }
})
</script>

<template>
    <div ref="chartRef" style="width: 100%; height: 320px"></div>
</template>