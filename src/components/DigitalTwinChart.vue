<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const accuracy = 94

const initChart = () => {
  if (!chartRef.value) return
  
  chartInstance = echarts.init(chartRef.value)
  
  const option: any = {
    backgroundColor: 'transparent',
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: '#eab308',
      borderWidth: 1,
      padding: [10, 14],
      textStyle: {
        color: '#ffffff',
        fontSize: 13,
        fontWeight: '500'
      },
      formatter: '匹配度: <strong>{c}%</strong>'
    },
    series: [
      {
        name: '虚实融合',
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#1e293b',
          borderWidth: 1.5
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            formatter: '{b}\n{c}%'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: accuracy, name: '匹配', itemStyle: { color: '#3b82f6' } },
          { value: 100 - accuracy, name: '差异', itemStyle: { color: '#334155' } }
        ]
      }
    ]
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
    <h3 class="text-sm font-semibold text-earth-gold-400 mb-2 flex items-center gap-2">
      <span class="w-1.5 h-1.5 rounded-full bg-earth-gold-400 animate-pulse"></span>
      数字孪生精度
    </h3>
    <div ref="chartRef" class="flex-1"></div>
    <div class="text-center mt-1">
      <p class="text-gray-400 text-xs">虚拟与实际匹配度</p>
      <p class="text-lg font-bold text-earth-gold-400">{{ accuracy }}%</p>
    </div>
  </div>
</template>
