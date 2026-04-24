<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const ecoHealthIndex = ref(88.3)
const biodiversityScore = ref(85)
const soilHealthScore = ref(92)
const airWaterScore = ref(88)

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
      formatter: () => {
        return `生态健康指数: <strong style="color: #22c55e">${ecoHealthIndex.value}%</strong>`
      }
    },
    series: [
      {
        name: '生态健康指数',
        type: 'gauge',
        radius: '85%',
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 100,
        splitNumber: 5,
        axisLine: {
          lineStyle: {
            width: 8,
            color: [
              [0.3, '#3b82f6'],
              [0.7, '#22c55e'],
              [1, '#eab308']
            ]
          }
        },
        pointer: {
          itemStyle: {
            color: '#22c55e',
            shadowBlur: 10,
            shadowColor: '#22c55e'
          },
          length: '60%',
          width: 4
        },
        axisTick: {
          distance: -12,
          length: 4,
          lineStyle: {
            color: '#94a3b8',
            width: 1
          }
        },
        splitLine: {
          distance: -16,
          length: 10,
          lineStyle: {
            color: '#94a3b8',
            width: 2
          }
        },
        axisLabel: {
          color: '#94a3b8',
          distance: 20,
          fontSize: 10
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}%',
          color: '#22c55e',
          fontSize: 24,
          fontWeight: 'bold',
          offsetCenter: [0, '60%']
        },
        title: {
          offsetCenter: [0, '75%'],
          color: '#94a3b8',
          fontSize: 11
        },
        data: [{ value: ecoHealthIndex.value, name: '综合评分' }]
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
    setTimeout(() => {
      chartInstance?.resize()
    }, 100)
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<template>
  <div class="h-full glass-panel rounded-xl p-3 flex flex-col" style="min-height: 340px;">
    <h3 class="text-base font-semibold text-eco-green-400 mb-2 flex items-center gap-2">
      <span class="w-1.5 h-1.5 rounded-full bg-eco-green-400 animate-pulse"></span>
      生态健康指数
    </h3>
    <div ref="chartRef" class="flex-1"></div>
    <div class="flex justify-around mt-2 text-xs">
      <div class="text-center">
        <div class="w-2 h-2 rounded-full bg-smart-blue-500 mb-1 mx-auto animate-pulse"></div>
        <span class="text-gray-400">生物多样性</span>
        <p class="text-sm font-bold text-smart-blue-400">{{ biodiversityScore }}%</p>
      </div>
      <div class="text-center">
        <div class="w-2 h-2 rounded-full bg-eco-green-500 mb-1 mx-auto animate-pulse" style="animation-delay: 0.3s"></div>
        <span class="text-gray-400">土壤健康</span>
        <p class="text-sm font-bold text-eco-green-400">{{ soilHealthScore }}%</p>
      </div>
      <div class="text-center">
        <div class="w-2 h-2 rounded-full bg-earth-gold-500 mb-1 mx-auto animate-pulse" style="animation-delay: 0.6s"></div>
        <span class="text-gray-400">空气水质</span>
        <p class="text-sm font-bold text-earth-gold-400">{{ airWaterScore }}%</p>
      </div>
    </div>
  </div>
</template>
