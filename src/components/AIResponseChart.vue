<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const responseTime = 0.8

const initChart = () => {
  if (!chartRef.value) return
  
  chartInstance = echarts.init(chartRef.value)
  
  const option: any = {
    backgroundColor: 'transparent',
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: '#3b82f6',
      borderWidth: 1,
      padding: [10, 14],
      textStyle: {
        color: '#ffffff',
        fontSize: 13,
        fontWeight: '500'
      },
      formatter: '响应时间: <strong>{c}s</strong>'
    },
    xAxis: {
      show: false
    },
    yAxis: {
      show: false
    },
    series: [
      {
        name: '响应脉冲',
        type: 'effectScatter',
        data: Array.from({ length: 5 }, (_, i) => ({
          value: [10 + i * 22, 50],
          symbolSize: 15,
          itemStyle: {
            color: '#3b82f6',
            shadowBlur: 15,
            shadowColor: '#3b82f6'
          },
          effect: {
            show: true,
            period: 1 + i * 0.15,
            trailLength: 0.4,
            color: '#3b82f6'
          }
        })),
        animationDuration: 1500,
        animationEasing: 'linear'
      },
      {
        name: '连接线',
        type: 'line',
        data: [[8, 50], [28, 50], [50, 50], [72, 50], [94, 50]],
        lineStyle: {
          color: 'rgba(59, 130, 246, 0.3)',
          width: 2,
          type: 'dashed'
        },
        showSymbol: false
      }
    ],
    grid: { left: 0, right: 0, top: 0, bottom: 0 }
  }
  
  chartInstance.setOption(option)
}

const handleResize = () => {
  chartInstance?.resize()
}

onMounted(() => {
  nextTick(() => {
    initChart()
    window.addEventListener('resize', handleResize)
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<template>
  <div class="h-full glass-panel rounded-xl p-3 flex flex-col">
    <h3 class="text-sm font-semibold text-smart-blue-400 mb-2 flex items-center gap-2">
      <span class="w-1.5 h-1.5 rounded-full bg-smart-blue-400 animate-pulse"></span>
      AI决策响应速度
    </h3>
    <div ref="chartRef" class="flex-1"></div>
    <div class="text-center mt-1">
      <p class="text-gray-400 text-xs">平均响应时间</p>
      <p class="text-lg font-bold text-smart-blue-400">{{ responseTime }} <span class="text-xs">秒</span></p>
    </div>
  </div>
</template>
