<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const annualCarbon = 2520
const teaTreeCarbon = 1250
const forestCarbon = 850
const carbonFactor = annualCarbon - teaTreeCarbon - forestCarbon

const initChart = () => {
  if (!chartRef.value) return
  
  chartInstance = echarts.init(chartRef.value)
  
  const teaLeaves = Array.from({ length: Math.floor(teaTreeCarbon / 100) }, (_, i) => ({
    name: `茶树叶片${i + 1}`,
    value: [25 + Math.random() * 30, 30 + Math.random() * 45],
    symbolSize: 8 + Math.random() * 8,
    itemStyle: {
      color: '#4ade80',
      shadowBlur: 12,
      shadowColor: '#4ade80'
    }
  }))

  const forestLeaves = Array.from({ length: Math.floor(forestCarbon / 100) }, (_, i) => ({
    name: `林地叶片${i + 1}`,
    value: [55 + Math.random() * 30, 25 + Math.random() * 40],
    symbolSize: 6 + Math.random() * 6,
    itemStyle: {
      color: '#16a34a',
      shadowBlur: 10,
      shadowColor: '#16a34a'
    }
  }))

  const factorLeaves = Array.from({ length: Math.floor(carbonFactor / 50) }, (_, i) => ({
    name: `交易系数${i + 1}`,
    value: [35 + Math.random() * 30, 60 + Math.random() * 25],
    symbolSize: 4 + Math.random() * 4,
    itemStyle: {
      color: '#15803d',
      shadowBlur: 8,
      shadowColor: '#15803d'
    }
  }))

  const option: any = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
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
        let type = '其他'
        if (params.seriesName === '茶树固碳') type = '茶树固碳'
        else if (params.seriesName === '林地固碳') type = '林地固碳'
        else if (params.seriesName === '碳交易系数') type = '碳交易系数'
        return `${type}: <strong>${params.data.value ? params.data.value[2] || '--' : '--'} kg</strong>`
      }
    },
    xAxis: {
      show: false,
      min: 0,
      max: 100
    },
    yAxis: {
      show: false,
      min: 0,
      max: 100
    },
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    },
    series: [
      {
        name: '树干',
        type: 'graph',
        layout: 'none',
        coordinateSystem: 'cartesian2d',
        data: [
          {
            name: '树根',
            x: 50,
            y: 92,
            symbolSize: 20,
            itemStyle: {
              color: '#78350f',
              shadowBlur: 8,
              shadowColor: '#78350f'
            }
          },
          {
            name: '树干',
            x: 50,
            y: 60,
            symbolSize: 15,
            itemStyle: {
              color: '#92400e',
              shadowBlur: 10,
              shadowColor: '#92400e'
            }
          },
          {
            name: '树冠',
            x: 50,
            y: 35,
            symbolSize: 25,
            itemStyle: {
              color: '#22c55e',
              shadowBlur: 15,
              shadowColor: '#22c55e'
            }
          }
        ],
        links: [
          { source: '树根', target: '树干', lineStyle: { color: '#92400e', width: 8 } },
          { source: '树干', target: '树冠', lineStyle: { color: '#22c55e', width: 6 } }
        ],
        roam: false
      },
      {
        name: '茶树固碳',
        type: 'scatter',
        data: teaLeaves.map((leaf) => ({
          ...leaf,
          value: [...leaf.value, teaTreeCarbon]
        })),
        animationDelay: (idx: number) => idx * 50,
        emphasis: {
          itemStyle: {
            shadowBlur: 20,
            shadowColor: '#4ade80'
          }
        }
      },
      {
        name: '林地固碳',
        type: 'scatter',
        data: forestLeaves.map((leaf) => ({
          ...leaf,
          value: [...leaf.value, forestCarbon]
        })),
        animationDelay: (idx: number) => idx * 50 + 200,
        emphasis: {
          itemStyle: {
            shadowBlur: 18,
            shadowColor: '#16a34a'
          }
        }
      },
      {
        name: '碳交易系数',
        type: 'scatter',
        data: factorLeaves.map((leaf) => ({
          ...leaf,
          value: [...leaf.value, carbonFactor]
        })),
        animationDelay: (idx: number) => idx * 50 + 400,
        emphasis: {
          itemStyle: {
            shadowBlur: 15,
            shadowColor: '#15803d'
          }
        }
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
    <h3 class="text-base font-semibold text-smart-blue-400 mb-2 flex items-center gap-2">
      <span class="w-1.5 h-1.5 rounded-full bg-smart-blue-400 animate-pulse"></span>
      碳汇贡献值
    </h3>
    <div ref="chartRef" class="flex-1"></div>
    <div class="flex justify-around mt-2 text-xs">
      <div class="flex items-center gap-1.5">
        <div class="w-2 h-2 rounded-full bg-emerald-400"></div>
        <span class="text-gray-400">茶树叶片</span>
        <span class="text-sm font-bold text-emerald-400">{{ Math.floor(teaTreeCarbon / 100) }}片</span>
      </div>
      <div class="flex items-center gap-1.5">
        <div class="w-2 h-2 rounded-full bg-green-600"></div>
        <span class="text-gray-400">林地叶片</span>
        <span class="text-sm font-bold text-green-600">{{ Math.floor(forestCarbon / 100) }}片</span>
      </div>
    </div>
    <div class="text-center mt-1">
      <p class="text-gray-400 text-xs">年固碳总量</p>
      <p class="text-xl font-bold text-eco-green-400">{{ annualCarbon.toLocaleString() }} <span class="text-sm">kg</span></p>
    </div>
  </div>
</template>
