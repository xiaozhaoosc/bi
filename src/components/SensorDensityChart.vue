<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null
let animationFrame: number | null = null

const sensorDensity = 45
const dataTypes = 8
const coverageNodes = 52
const onlineRate = 98.6

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
          symbolSize: 5 + Math.random() * 7,
          itemStyle: {
            color: '#00ff88',
            shadowBlur: 12,
            shadowColor: '#00ff88',
            opacity: 0.5 + Math.random() * 0.4
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
            color: 'rgba(0, 255, 136, 0.15)',
            width: 1
          }
        })
      }
    }
  }

  const starBackground = Array.from({ length: 25 }, (_, i) => ({
    name: `背景星${i}`,
    value: [Math.random() * 100, Math.random() * 100],
    symbolSize: 1 + Math.random() * 2,
    itemStyle: {
      color: '#fff',
      opacity: 0.15 + Math.random() * 0.3
    }
  }))

  const option: any = {
    backgroundColor: 'transparent',
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: '#00ff88',
      borderWidth: 1,
      padding: [10, 14],
      textStyle: { color: '#ffffff', fontSize: 13, fontWeight: '500' },
      formatter: (params: any) => params.seriesName === '传感器网络' ? `传感器节点: <strong style="color:#00ff88">在线</strong>` : `${params.name}`
    },
    xAxis: { show: false, min: 0, max: 100 },
    yAxis: { show: false, min: 0, max: 100 },
    grid: { left: 0, right: 0, top: 0, bottom: 0 },
    series: [
      {
        name: '背景星空', type: 'scatter', data: starBackground, symbol: 'circle', z: 1
      },
      {
        name: '传感器网络',
        type: 'graph', layout: 'none', coordinateSystem: 'cartesian2d',
        data: sensors, links: connections, symbol: 'circle',
        emphasis: {
          focus: 'adjacency',
          lineStyle: { width: 2, color: '#00ff88' },
          itemStyle: { shadowBlur: 20, shadowColor: '#00ff88' }
        },
        roam: false, z: 2
      },
      {
        name: '信号范围',
        type: 'effectScatter',
        data: sensors.slice(0, 4).map(s => ({
          value: s.value, symbolSize: 26,
          itemStyle: {
            color: 'rgba(0, 255, 136, 0.08)',
            borderColor: '#00ff88', borderWidth: 1
          },
          effect: { show: true, period: 3 + Math.random(), scale: 1.5, color: '#00ff88' }
        })),
        z: 0
      }
    ]
  }
  
  chartInstance.setOption(option)

  const animate = () => {
    if (!chartInstance) return
    const time = Date.now() / 1000
    
    chartInstance.setOption({
      series: [
        { 
          name: '背景星空', 
          data: starBackground.map((star, i) => ({
            ...star,
            itemStyle: { ...star.itemStyle, opacity: 0.08 + Math.sin(time * 0.5 + i) * 0.12 + 0.08 }
          }))
        },
        { 
          name: '传感器网络', 
          data: sensors.map((sensor) => ({
            ...sensor,
            itemStyle: {
              ...sensor.itemStyle,
              opacity: 0.35 + Math.sin(time * sensor.blinkSpeed + sensor.blinkPhase) * 0.35 + 0.18
            }
          }))
        }
      ]
    })
    animationFrame = requestAnimationFrame(animate)
  }
  
  animate()
}

const handleResize = () => chartInstance?.resize()

onMounted(() => {
  nextTick(() => {
    initChart()
    window.addEventListener('resize', handleResize)
    setTimeout(() => chartInstance?.resize(), 100)
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (animationFrame) cancelAnimationFrame(animationFrame)
  chartInstance?.dispose()
})
</script>

<template>
  <section class="glass-panel rounded-3xl p-4 flex flex-col overflow-hidden border-t border-white/20 relative h-full">
    <!-- 标题栏 -->
    <div class="flex items-center justify-between mb-1">
      <div class="flex items-center gap-2">
        <div class="w-1 h-4 bg-eco-green-500 shadow-[0_0_8px_#00ff88]"></div>
        <span class="text-earth-gold-400 font-bold text-base tracking-wider">物联感知密度</span>
      </div>
      <span class="text-[10px] font-mono text-gray-500">IoT DENSITY</span>
    </div>

    <!-- 核心指标数值展示 -->
    <div class="flex items-baseline gap-3 mb-1">
      <span class="font-['Orbitron'] font-black text-3xl text-eco-green-400 drop-shadow-[0_0_12px_rgba(0,255,136,0.5)]">{{ sensorDensity }}</span>
      <span class="text-smart-blue-400 text-xs font-mono tracking-wider">/公顷</span>
      <div class="ml-auto flex items-center gap-1 px-2 py-0.5 bg-eco-green-500/10 rounded-full border border-eco-green-500/30">
        <div class="w-1.5 h-1.5 rounded-full bg-eco-green-400 animate-pulse"></div>
        <span class="text-eco-green-400 text-xs font-bold">{{ onlineRate }}% 在线</span>
      </div>
    </div>

    <!-- 图表区域 -->
    <div ref="chartRef" class="flex-1 min-h-[120px]"></div>

    <!-- 底部指标条 -->
    <div class="grid grid-cols-3 gap-2 mt-1 pt-2 border-t border-white/5">
      <div class="text-center">
        <p class="text-gray-500 text-[10px] mb-0.5">数据类型</p>
        <p class="text-sm font-bold text-eco-green-400">{{ dataTypes }}<span class="text-[10px] text-gray-500 ml-0.5">种</span></p>
      </div>
      <div class="text-center">
        <p class="text-gray-500 text-[10px] mb-0.5">覆盖节点</p>
        <p class="text-sm font-bold text-smart-blue-400">{{ coverageNodes }}<span class="text-[10px] text-gray-500 ml-0.5">个</span></p>
      </div>
      <div class="text-center">
        <p class="text-gray-500 text-[10px] mb-0.5">传输频率</p>
        <p class="text-sm font-bold text-earth-gold-400">5s<span class="text-[10px] text-gray-500 ml-0.5">/次</span></p>
      </div>
    </div>
  </section>
</template>
