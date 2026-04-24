<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const communityValue = 86

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
      formatter: (params: any) => {
        const descriptions: Record<string, string> = {
          '茶园': '核心生产基地',
          '加工厂': '茶叶加工与包装',
          '销售点': '产品销售与推广',
          '就业': '带动本地就业',
          '文化传承': '茶文化传承',
          '教育科研': '茶学研究与教育',
          '社区': '本地社区'
        }
        return `<strong>${params.name}</strong><br/>${descriptions[params.name] || ''}`
      }
    },
    series: [
      {
        name: '共生关系',
        type: 'graph',
        layout: 'force',
        data: [
          {
            name: '茶园',
            symbolSize: 32,
            itemStyle: {
              color: '#22c55e',
              shadowBlur: 15,
              shadowColor: '#22c55e'
            },
            label: {
              show: true,
              fontSize: 11,
              fontWeight: 'bold'
            }
          },
          {
            name: '加工厂',
            symbolSize: 20,
            itemStyle: {
              color: '#eab308',
              shadowBlur: 12,
              shadowColor: '#eab308'
            },
            label: {
              show: true,
              fontSize: 9
            }
          },
          {
            name: '销售点',
            symbolSize: 20,
            itemStyle: {
              color: '#3b82f6',
              shadowBlur: 12,
              shadowColor: '#3b82f6'
            },
            label: {
              show: true,
              fontSize: 9
            }
          },
          {
            name: '就业',
            symbolSize: 18,
            itemStyle: {
              color: '#3b82f6',
              shadowBlur: 10,
              shadowColor: '#3b82f6'
            },
            label: {
              show: true,
              fontSize: 9
            }
          },
          {
            name: '文化传承',
            symbolSize: 18,
            itemStyle: {
              color: '#eab308',
              shadowBlur: 10,
              shadowColor: '#eab308'
            },
            label: {
              show: true,
              fontSize: 9
            }
          },
          {
            name: '教育科研',
            symbolSize: 18,
            itemStyle: {
              color: '#22c55e',
              shadowBlur: 10,
              shadowColor: '#22c55e'
            },
            label: {
              show: true,
              fontSize: 9
            }
          },
          {
            name: '社区',
            symbolSize: 24,
            itemStyle: {
              color: '#3b82f6',
              shadowBlur: 14,
              shadowColor: '#3b82f6'
            },
            label: {
              show: true,
              fontSize: 10,
              fontWeight: 'bold'
            }
          }
        ],
        links: [
          { source: '茶园', target: '加工厂', value: 60 },
          { source: '加工厂', target: '销售点', value: 50 },
          { source: '销售点', target: '社区', value: 40 },
          { source: '茶园', target: '就业', value: 45 },
          { source: '茶园', target: '文化传承', value: 35 },
          { source: '茶园', target: '教育科研', value: 25 },
          { source: '加工厂', target: '就业', value: 30 },
          { source: '销售点', target: '就业', value: 25 },
          { source: '就业', target: '社区', value: 45 },
          { source: '文化传承', target: '社区', value: 35 },
          { source: '教育科研', target: '社区', value: 30 }
        ],
        force: {
          repulsion: 220,
          gravity: 0.2,
          edgeLength: [50, 90]
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 3
          }
        },
        lineStyle: {
          color: 'rgba(34, 197, 94, 0.3)',
          width: 1.5
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
  <div class="h-full glass-panel rounded-xl p-3 flex flex-col" style="min-height: 320px;">
    <h3 class="text-sm font-semibold text-earth-gold-400 mb-2 flex items-center gap-2">
      <span class="w-1.5 h-1.5 rounded-full bg-earth-gold-400 animate-pulse"></span>
      社区共生价值
    </h3>
    <div ref="chartRef" class="flex-1"></div>
    <div class="text-center mt-1">
      <p class="text-gray-400 text-xs">共生指数</p>
      <p class="text-lg font-bold text-earth-gold-400">{{ communityValue }}%</p>
    </div>
  </div>
</template>
