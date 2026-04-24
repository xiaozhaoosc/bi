<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null
let animationFrame: number | null = null

const sensorDensity = 45
const dataTypes = 8

const initChart = () => {
  if (!chartRef.value) return
  
  chartInstance = echarts.init(chartRef.value)
  
  const gridSize = 8
  const sensors: any[] = []
  
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const value = Math.random() > 0.3
      if (value) {
        sensors.push({
          name: `传感器(${i},${j})`,
          value: [10 + i * 11.25, 10 + j * 11.25],
          symbolSize: 6 + Math.random() * 8,
          itemStyle: {
            color: '#3b82f6',
            shadowBlur: 15,
            shadowColor: '#3b82f6',
            opacity: 0.6 + Math.random() * 0.4
          },
          blinkPhase: Math.random() * Math.PI * 2,
          blinkSpeed: 1 + Math.random() * 2
        })
      }
    }
  }

  const connections: any[] = []
  for (let i = 0; i < sensors.length; i++) {
    for (let j = i + 1; j < sensors.length; j++) {
      const dx = sensors[i].value[0] - sensors[j].value[0]
      const dy = sensors[i].value[1] - sensors[j].value[1]
      const distance = Math.sqrt(dx * dx + dy * dy)
      if (distance < 25 && Math.random() > 0.4) {
        connections.push({
          source: i,
          target: j,
          lineStyle: {
            color: 'rgba(59, 130, 246, 0.2)',
            width: 1
          }
        })
      }
    }
  }

  const starBackground = Array.from({ length: 30 }, (_, i) => ({
    name: `背景星${i}`,
    value: [Math.random() * 100, Math.random() * 100],
    symbolSize: 1 + Math.random() * 3,
    itemStyle: {
      color: '#fff',
      opacity: 0.2 + Math.random() * 0.4
    }
  }))

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
      formatter: (params: any) => {
        if (params.seriesName === '传感器网络') {
          return `传感器节点: <strong>在线</strong>`
        }
        return `${params.name}`
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
        name: '背景星空',
        type: 'scatter',
        data: starBackground,
        symbol: 'circle',
        z: 1
      },
      {
        name: '传感器网络',
        type: 'graph',
        layout: 'none',
        coordinateSystem: 'cartesian2d',
        data: sensors,
        links: connections,
        symbol: 'circle',
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 2,
            color: '#3b82f6'
          },
          itemStyle: {
            shadowBlur: 25,
            shadowColor: '#3b82f6'
          }
        },
        roam: false,
        z: 2
      },
      {
        name: '信号范围',
        type: 'effectScatter',
        data: sensors.slice(0, 5).map(s => ({
          value: s.value,
          symbolSize: 30,
          itemStyle: {
            color: 'rgba(59, 130, 246, 0.1)',
            borderColor: '#3b82f6',
            borderWidth: 1
          },
          effect: {
            show: true,
            period: 3 + Math.random(),
            scale: 1.5,
            color: '#3b82f6'
          }
        })),
        z: 0
      }
    ]
  }
  
  chartInstance.setOption(option)

  const animate = () => {
    if (!chartInstance) return
    
    const time = Date.now() / 1000
    
    const updatedSensors = sensors.map((sensor) => ({
      ...sensor,
      itemStyle: {
        ...sensor.itemStyle,
        opacity: 0.4 + Math.sin(time * sensor.blinkSpeed + sensor.blinkPhase) * 0.4 + 0.2
      }
    }))

    const updatedStars = starBackground.map((star, i) => ({
      ...star,
      itemStyle: {
        ...star.itemStyle,
        opacity: 0.1 + Math.sin(time * 0.5 + i) * 0.2 + 0.1
      }
    }))

    chartInstance.setOption({
      series: [
        { name: '背景星空', data: updatedStars },
        { name: '传感器网络', data: updatedSensors }
      ]
    })

    animationFrame = requestAnimationFrame(animate)
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
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
  chartInstance?.dispose()
})
</script>

<template>
  <section class="glass-panel rounded-3xl p-6 flex flex-col overflow-hidden border-t border-white/20 relative">
    <div class="flex items-center gap-2 mb-3">
      <div class="w-1 h-4 bg-smart-blue-500 shadow-[0_0_8px_#3b82f6]"></div>
      <span class="text-earth-gold-400 font-bold text-base tracking-wider">物联感知密度</span>
    </div>
    <div ref="chartRef" class="flex-1 min-h-0"></div>
    <div class="flex justify-around mt-2 text-xs">
      <div class="text-center">
        <p class="text-gray-400">传感器密度</p>
        <p class="text-sm font-bold text-smart-blue-400">{{ sensorDensity }}/公顷</p>
      </div>
      <div class="text-center">
        <p class="text-gray-400">数据类型</p>
        <p class="text-sm font-bold text-eco-green-400">{{ dataTypes }}种</p>
      </div>
      <div class="text-center">
        <p class="text-gray-400">覆盖节点</p>
        <p class="text-sm font-bold text-earth-gold-400">52个</p>
      </div>
    </div>
  </section>
</template>
