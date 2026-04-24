<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null
let animationFrameId: number | null = null

const rhythmMatch = ref(89)

const seasons = ['立春', '雨水', '惊蛰', '春分', '清明', '谷雨', '立夏', '小满']
const baseValues = [85, 88, 92, 95, 88, 82, 78, 85]

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
      formatter: '{b}: <strong>{c}%</strong>'
    },
    xAxis: {
      type: 'category',
      data: seasons,
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      axisLabel: {
        color: '#94a3b8',
        fontSize: 8
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      min: 60,
      max: 100,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.05)'
        }
      }
    },
    series: [
      {
        name: '生长节律',
        type: 'line',
        data: baseValues,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          color: '#22c55e',
          width: 2
        },
        itemStyle: {
          color: '#22c55e',
          shadowBlur: 10,
          shadowColor: '#22c55e'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(34, 197, 94, 0.4)' },
              { offset: 1, color: 'rgba(34, 197, 94, 0.05)' }
            ]
          }
        },
        animationDuration: 2000,
        animationEasing: 'cubicInOut'
      }
    ]
  }
  
  chartInstance.setOption(option)
  
  const animate = () => {
    if (!chartInstance) return
    
    const time = Date.now() / 1000
    
    const animatedValues = baseValues.map((v, i) => {
      const variance = Math.sin(time * 1.5 + i * 0.5) * 3
      return Math.round(Math.max(60, Math.min(100, v + variance)))
    })
    
    const avgValue = animatedValues.reduce((a, b) => a + b, 0) / animatedValues.length
    rhythmMatch.value = Math.round(avgValue)
    
    chartInstance.setOption({
      series: [{
        data: animatedValues
      }]
    })
    
    animationFrameId = requestAnimationFrame(animate)
  }
  
  animate()
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
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  chartInstance?.dispose()
})
</script>

<template>
  <div class="h-full glass-panel rounded-xl p-3 flex flex-col" style="min-height: 320px;">
    <h3 class="text-sm font-semibold text-eco-green-400 mb-2 flex items-center gap-2">
      <span class="w-1.5 h-1.5 rounded-full bg-eco-green-400 animate-pulse"></span>
      智慧生长节律
    </h3>
    <div ref="chartRef" class="flex-1"></div>
    <div class="text-center mt-1">
      <p class="text-gray-400 text-xs">节气匹配度</p>
      <p class="text-lg font-bold text-eco-green-400">{{ rhythmMatch }}%</p>
    </div>
  </div>
</template>
