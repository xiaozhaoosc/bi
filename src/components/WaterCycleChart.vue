<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null
let animationFrame: number | null = null

const waterRecycleRate = ref(76)
const rainCollection = ref(125)
const storage = ref(88)
const irrigation = ref(95)
const soilAbsorb = ref(72)

const initChart = () => {
  if (!chartRef.value) return
  
  chartInstance = echarts.init(chartRef.value)
  
  const stations = [
    { name: '降雨收集', x: 15, y: 30, type: 'rain' },
    { name: '储水系统', x: 85, y: 30, type: 'storage' },
    { name: '灌溉系统', x: 85, y: 70, type: 'irrigation' },
    { name: '土壤吸收', x: 15, y: 70, type: 'soil' }
  ]

  const flowConnections = [
    { from: '降雨收集', to: '储水系统', direction: 'right' },
    { from: '储水系统', to: '灌溉系统', direction: 'down' },
    { from: '灌溉系统', to: '土壤吸收', direction: 'left' },
    { from: '土壤吸收', to: '降雨收集', direction: 'up' }
  ]

  const flowParticles: any[] = []
  const flowLines: any[] = []
  
  flowConnections.forEach((conn, connIdx) => {
    const fromStation = stations.find(s => s.name === conn.from)!
    const toStation = stations.find(s => s.name === conn.to)!
    
    flowLines.push({
      source: conn.from,
      target: conn.to,
      lineStyle: {
        color: 'rgba(59, 130, 246, 0.4)',
        width: 3,
        curveness: 0
      }
    })
    
    const particleNum = conn.direction === 'right' ? 12 : conn.direction === 'left' ? 10 : 8
    for (let i = 0; i < particleNum; i++) {
      flowParticles.push({
        name: `粒子${connIdx}-${i}`,
        connIdx,
        fromX: fromStation.x,
        fromY: fromStation.y,
        toX: toStation.x,
        toY: toStation.y,
        progress: i / particleNum,
        speed: 0.006 + Math.random() * 0.004,
        baseDelay: i * 0.05
      })
    }
  })

  const rainDrops = Array.from({ length: 15 }, (_, i) => ({
    name: `雨滴${i}`,
    x: 10 + Math.random() * 80,
    startY: 5,
    y: 5 + Math.random() * 20,
    speed: 0.012 + Math.random() * 0.008,
    size: 3 + Math.random() * 2
  }))

  const option: any = {
    backgroundColor: 'transparent',
    tooltip: {
      show: true,
      alwaysShowContent: true,
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
        if (params.seriesName === '循环站点') {
          const values: Record<string, { value: number; unit: string; desc: string }> = {
            '降雨收集': { value: rainCollection.value, unit: 'm³', desc: '雨水收集量' },
            '储水系统': { value: storage.value, unit: 'm³', desc: '储水量' },
            '灌溉系统': { value: irrigation.value, unit: 'm³', desc: '灌溉用水量' },
            '土壤吸收': { value: soilAbsorb.value, unit: '%', desc: '吸收效率' }
          }
          const data = values[params.name]
          return `${params.name}: <strong style="color: #3b82f6">${data.value}${data.unit}</strong><br/>${data.desc}`
        }
        return `${params.name}`
      },
      triggerOn: 'mousemove',
      triggerOff: 'none'
    },
    xAxis: { show: false, min: 0, max: 100 },
    yAxis: { show: false, min: 0, max: 100 },
    grid: { left: 0, right: 0, top: 0, bottom: 0 },
    series: [
      {
        name: '流动轨道',
        type: 'graph',
        layout: 'none',
        coordinateSystem: 'cartesian2d',
        data: stations.map(s => ({
          name: s.name,
          x: s.x,
          y: s.y,
          symbol: 'circle',
          symbolSize: 12,
          itemStyle: {
            color: '#3b82f6',
            borderColor: '#fff',
            borderWidth: 2
          }
        })),
        links: flowLines,
        roam: false,
        z: 1
      },
      {
        name: '循环站点',
        type: 'effectScatter',
        data: stations.map(s => ({
          value: [s.x, s.y],
          name: s.name,
          symbol: 'circle',
          symbolSize: 14,
          itemStyle: {
            color: new echarts.graphic.RadialGradient(0.3, 0.3, 1, [
              { offset: 0, color: '#93c5fd' },
              { offset: 0.5, color: '#3b82f6' },
              { offset: 1, color: '#1d4ed8' }
            ]),
            shadowBlur: 15,
            shadowColor: '#3b82f6',
            borderColor: '#fff',
            borderWidth: 2
          }
        })),
        effect: {
          show: true,
          period: 2,
          trailLength: 0.3,
          scale: 1.5,
          color: '#3b82f6'
        },
        z: 3
      },
      {
        name: '流动粒子',
        type: 'effectScatter',
        data: flowParticles.map(p => ({
          ...p,
          value: [p.fromX + (p.toX - p.fromX) * p.progress, p.fromY + (p.toY - p.fromY) * p.progress],
          symbolSize: 6,
          itemStyle: {
            color: '#60a5fa',
            shadowBlur: 10,
            shadowColor: '#60a5fa'
          }
        })),
        effect: {
          show: true,
          period: 1.2,
          trailLength: 0.5,
          color: '#60a5fa'
        },
        z: 2
      },
      {
        name: '雨滴',
        type: 'effectScatter',
        data: rainDrops.map(d => ({
          value: [d.x, d.y],
          symbolSize: d.size,
          itemStyle: {
            color: '#60a5fa',
            shadowBlur: 8,
            shadowColor: '#60a5fa',
            opacity: 0.7
          }
        })),
        effect: {
          show: true,
          period: 0.8,
          trailLength: 0.7,
          color: '#60a5fa'
        },
        z: 2
      },
      {
        name: '站点标签',
        type: 'scatter',
        data: stations.map(s => ({
          value: [s.x, s.y + 15],
          symbol: 'none',
          label: {
            show: true,
            formatter: s.name,
            position: 'bottom',
            color: '#94a3b8',
            fontSize: 11,
            fontWeight: '500'
          }
        })),
        z: 4
      }
    ]
  }
  
  chartInstance.setOption(option)

  const animate = () => {
    if (!chartInstance) return
    
    const time = Date.now() / 1000
    
    const updatedParticles = flowParticles.map((p) => {
      let newProgress = p.progress + p.speed + Math.sin(time + p.baseDelay) * 0.002
      if (newProgress >= 1) newProgress = 0
      
      return {
        ...p,
        progress: newProgress,
        value: [
          p.fromX + (p.toX - p.fromX) * newProgress,
          p.fromY + (p.toY - p.fromY) * newProgress
        ],
        symbolSize: 5 + Math.sin(time * 4 + p.connIdx) * 2,
        itemStyle: {
          color: '#60a5fa',
          shadowBlur: 8 + Math.sin(time * 3 + p.connIdx) * 6,
          shadowColor: '#60a5fa',
          opacity: 0.6 + Math.sin(time * 2 + p.baseDelay) * 0.3 + 0.1
        }
      }
    })

    const updatedRain = rainDrops.map((d) => {
      let newY = d.y + d.speed * 8
      if (newY >= 28) {
        newY = 5 + Math.random() * 5
        d.x = 10 + Math.random() * 80
      }
      return {
        ...d,
        y: newY,
        x: d.x + Math.sin(time * 2 + d.x) * 0.3,
        itemStyle: {
          opacity: 0.5 + Math.sin(time + d.x) * 0.3
        }
      }
    })

    chartInstance.setOption({
      series: [
        {
          name: '流动粒子',
          data: updatedParticles.map(fp => ({
            ...fp,
            value: fp.value,
            symbolSize: fp.symbolSize,
            itemStyle: fp.itemStyle
          }))
        },
        {
          name: '雨滴',
          data: updatedRain.map(r => ({
            value: [r.x, r.y],
            symbolSize: r.size,
            itemStyle: {
              color: '#60a5fa',
              shadowBlur: 8,
              shadowColor: '#60a5fa',
              opacity: r.itemStyle.opacity
            }
          }))
        }
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
  <div class="h-full glass-panel rounded-xl p-3 flex flex-col" style="min-height: 320px;">
    <h3 class="text-sm font-semibold text-smart-blue-400 mb-2 flex items-center gap-2">
      <span class="w-1.5 h-1.5 rounded-full bg-smart-blue-400 animate-pulse"></span>
      水资源智慧循环率
    </h3>
    <div ref="chartRef" class="flex-1"></div>
    <div class="text-center mt-1">
      <p class="text-gray-400 text-xs">循环利用率</p>
      <p class="text-lg font-bold text-smart-blue-400">{{ waterRecycleRate }}%</p>
    </div>
  </div>
</template>
