<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const carbonProgress = 68

const initChart = () => {
  if (!chartRef.value) return
  
  chartInstance = echarts.init(chartRef.value)
  
  const option: any = {
    backgroundColor: 'transparent',
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: '#22c55e',
      borderWidth: 1,
      padding: [10, 14],
      textStyle: {
        color: '#ffffff',
        fontSize: 13,
        fontWeight: '500'
      },
      formatter: '零碳进度: <strong>{c}%</strong>'
    },
    series: [
      {
        name: '碳足迹',
        type: 'gauge',
        radius: '90%',
        center: ['50%', '50%'],
        min: 0,
        max: 100,
        splitNumber: 5,
        axisLine: {
          lineStyle: {
            width: 12,
            color: [
              [0.3, '#ef4444'],
              [0.6, '#eab308'],
              [1, '#22c55e']
            ]
          }
        },
        pointer: {
          itemStyle: {
            color: '#22c55e'
          },
          length: '50%',
          width: 2.5
        },
        axisTick: {
          distance: -10,
          length: 6,
          lineStyle: {
            color: '#fff',
            width: 1.5
          }
        },
        splitLine: {
          distance: -12,
          length: 12,
          lineStyle: {
            color: '#fff',
            width: 2
          }
        },
        axisLabel: {
          color: '#94a3b8',
          distance: 18,
          fontSize: 9,
          formatter: (value: number) => {
            if (value === 0) return '0%'
            if (value === 25) return '25%'
            if (value === 50) return '50%'
            if (value === 75) return '75%'
            if (value === 100) return '100%'
            return ''
          }
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}%',
          color: '#22c55e',
          fontSize: 22,
          fontWeight: 'bold',
          offsetCenter: [0, '25%']
        },
        data: [{ value: carbonProgress, name: '零碳进度' }]
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
  <div class="h-full glass-panel rounded-xl p-3 flex flex-col" style="min-height: 320px;">
    <h3 class="text-sm font-semibold text-eco-green-400 mb-2 flex items-center gap-2">
      <span class="w-1.5 h-1.5 rounded-full bg-eco-green-400 animate-pulse"></span>
      零碳足迹进度
    </h3>
    <div ref="chartRef" class="flex-1"></div>
    <div class="text-center mt-1">
      <p class="text-gray-400 text-xs">碳抵消比例</p>
      <p class="text-lg font-bold text-eco-green-400">{{ carbonProgress }}%</p>
    </div>
  </div>
</template>
