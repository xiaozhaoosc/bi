<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const speciesCount = 156
const rareSpeciesCount = 12
const weightedIndex = 91

const speciesData = [
  { name: '茶树', type: '植物', count: 12000, color: '#22c55e' },
  { name: '鸟类', type: '动物', count: 35, color: '#3b82f6' },
  { name: '昆虫', type: '动物', count: 86, color: '#eab308' },
  { name: '微生物', type: '微生物', count: 1200, color: '#16a34a' },
  { name: '草本植物', type: '植物', count: 45, color: '#2563eb' },
  { name: '珍稀鸟类', type: '珍稀', count: 8, color: '#ca8a04' },
  { name: '珍稀昆虫', type: '珍稀', count: 4, color: '#1d4ed8' }
]

const initChart = () => {
  if (!chartRef.value) return
  
  chartInstance = echarts.init(chartRef.value)
  
  const option: any = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: '#eab308',
      borderWidth: 1,
      padding: [10, 14],
      textStyle: {
        color: '#ffffff',
        fontSize: 13,
        fontWeight: '500'
      },
      formatter: (params: any) => {
        return `${params.name}: <strong>${params.value} 种</strong>`
      }
    },
    series: [
      {
        name: '物种分布',
        type: 'graph',
        layout: 'force',
        data: speciesData.map((item) => ({
          name: item.name,
          value: item.count,
          symbolSize: Math.sqrt(item.count) * 1.2,
          itemStyle: {
            color: item.color,
            shadowBlur: 15,
            shadowColor: item.color
          },
          label: {
            show: true,
            fontSize: 10,
            color: '#fff'
          }
        })),
        links: [
          { source: '茶树', target: '鸟类' },
          { source: '茶树', target: '昆虫' },
          { source: '茶树', target: '微生物' },
          { source: '茶树', target: '草本植物' },
          { source: '鸟类', target: '珍稀鸟类' },
          { source: '昆虫', target: '珍稀昆虫' },
          { source: '微生物', target: '草本植物' }
        ],
        force: {
          repulsion: 250,
          gravity: 0.15,
          edgeLength: [40, 120]
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 3
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
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<template>
  <div class="h-full glass-panel rounded-xl p-3 flex flex-col" style="min-height: 340px;">
    <h3 class="text-base font-semibold text-earth-gold-400 mb-2 flex items-center gap-2">
      <span class="w-1.5 h-1.5 rounded-full bg-earth-gold-400 animate-pulse"></span>
      生物多样性丰度
    </h3>
    <div ref="chartRef" class="flex-1"></div>
    <div class="flex justify-around mt-2 text-xs">
      <div class="text-center">
        <p class="text-gray-400">物种总数</p>
        <p class="text-sm font-bold text-smart-blue-400">{{ speciesCount }}</p>
      </div>
      <div class="text-center">
        <p class="text-gray-400">珍稀物种</p>
        <p class="text-sm font-bold text-earth-gold-400">{{ rareSpeciesCount }}</p>
      </div>
      <div class="text-center">
        <p class="text-gray-400">加权指数</p>
        <p class="text-sm font-bold text-eco-green-400">{{ weightedIndex }}%</p>
      </div>
    </div>
  </div>
</template>
