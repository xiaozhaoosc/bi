<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const sustainableIndex = 88.5
const ecoBenefit = 92
const socialBenefit = 85
const economicBenefit = 88

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
      formatter: (params: any) => {
        return `${params.name}: <strong>${params.value}%</strong>`
      }
    },
    series: [
      {
        name: '三生平衡',
        type: 'radar',
        indicator: [
          { name: '生态效益', max: 100 },
          { name: '社会效益', max: 100 },
          { name: '经济效益', max: 100 }
        ],
        center: ['50%', '50%'],
        radius: '55%',
        shape: 'polygon',
        splitNumber: 3,
        axisName: {
          color: '#94a3b8',
          fontSize: 10
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.08)'
          }
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['rgba(34, 197, 94, 0.03)', 'rgba(59, 130, 246, 0.03)', 'rgba(234, 179, 8, 0.03)']
          }
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.08)'
          }
        },
        data: [{
          value: [ecoBenefit, socialBenefit, economicBenefit],
          name: '永续发展',
          areaStyle: {
            color: {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.5,
              colorStops: [
                { offset: 0, color: 'rgba(34, 197, 94, 0.3)' },
                { offset: 0.5, color: 'rgba(59, 130, 246, 0.2)' },
                { offset: 1, color: 'rgba(234, 179, 8, 0.1)' }
              ]
            }
          },
          lineStyle: {
            color: '#22c55e',
            width: 2
          },
          itemStyle: {
            color: '#22c55e'
          }
        }]
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
      永续发展指数
    </h3>
    <div ref="chartRef" class="flex-1"></div>
    <div class="text-center mt-1">
      <p class="text-gray-400 text-xs">综合指数</p>
      <p class="text-lg font-bold text-eco-green-400">{{ sustainableIndex }}%</p>
    </div>
  </div>
</template>
