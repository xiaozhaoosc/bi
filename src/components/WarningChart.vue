<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null
let animationFrame: number | null = null

const warningAdvance = ref(72)

const initChart = () => {
  if (!chartRef.value) return
  
  chartInstance = echarts.init(chartRef.value)
  
  const ripples = Array.from({ length: 5 }, (_, i) => ({
    name: `涟漪${i}`,
    radius: 15 + i * 12,
    delay: i * 0.6,
    duration: 2.5 + i * 0.3,
    itemStyle: {
      color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
        { offset: 0, color: 'rgba(239, 68, 68, 0)' },
        { offset: 0.7, color: 'rgba(239, 68, 68, 0.15)' },
        { offset: 1, color: 'rgba(239, 68, 68, 0.3)' }
      ]),
      borderColor: 'rgba(239, 68, 68, 0.5)',
      borderWidth: 1
    }
  }))

  const warningNodes = [
    { name: '温度异常', x: 75, y: 30, type: 'warning', level: 1 },
    { name: '湿度预警', x: 25, y: 70, type: 'warning', level: 2 },
    { name: '病虫害', x: 80, y: 65, type: 'danger', level: 1 },
    { name: '光照不足', x: 20, y: 35, type: 'info', level: 3 }
  ]

  const option: any = {
    backgroundColor: 'transparent',
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: '#ef4444',
      borderWidth: 1,
      padding: [10, 14],
      textStyle: {
        color: '#ffffff',
        fontSize: 13,
        fontWeight: '500'
      },
      formatter: (params: any) => {
        if (params.seriesName === '预警中心') {
          return `预警提前量: <strong style="color: #ef4444">${warningAdvance.value}小时</strong>`
        } else if (params.seriesName === '预警节点') {
          const levels = ['严重', '中等', '轻微']
          const colors = ['#ef4444', '#f97316', '#84cc16']
          return `${params.name}: <strong style="color: ${colors[params.data.level]}">${levels[params.data.level]}预警</strong>`
        }
        return `${params.name}`
      }
    },
    xAxis: { show: false, min: 0, max: 100 },
    yAxis: { show: false, min: 0, max: 100 },
    grid: { left: 0, right: 0, top: 0, bottom: 0 },
    series: [
      ...ripples.map((ripple, i) => ({
        name: `涟漪层${i}`,
        type: 'scatter',
        data: [{
          value: [50, 50],
          symbolSize: ripple.radius * 2,
          itemStyle: {
            ...ripple.itemStyle,
            opacity: 0.3
          }
        }],
        z: i,
        silent: true
      })),
      {
        name: '预警中心',
        type: 'effectScatter',
        data: [{
          value: [50, 50],
          symbolSize: 22,
          itemStyle: {
            color: new echarts.graphic.RadialGradient(0.3, 0.3, 1, [
              { offset: 0, color: '#fca5a5' },
              { offset: 0.4, color: '#ef4444' },
              { offset: 1, color: '#b91c1c' }
            ]),
            shadowBlur: 30,
            shadowColor: '#ef4444'
          }
        }],
        effect: {
          show: true,
          period: 1.5,
          trailLength: 0.1,
          scale: 2,
          color: '#ef4444'
        },
        z: 10
      },
      {
        name: '预警节点',
        type: 'effectScatter',
        data: warningNodes.map(node => ({
          ...node,
          symbolSize: node.level === 1 ? 10 : node.level === 2 ? 8 : 6,
          itemStyle: {
            color: node.type === 'danger' ? '#ef4444' : node.type === 'warning' ? '#f97316' : '#84cc16',
            shadowBlur: node.level === 1 ? 15 : node.level === 2 ? 10 : 5,
            shadowColor: node.type === 'danger' ? '#ef4444' : node.type === 'warning' ? '#f97316' : '#84cc16'
          }
        })),
        effect: {
          show: true,
          period: (idx: number) => 2 + warningNodes[idx].level * 0.5,
          trailLength: 0.3,
          color: (idx: number) => warningNodes[idx].type === 'danger' ? '#ef4444' : warningNodes[idx].type === 'warning' ? '#f97316' : '#84cc16'
        },
        z: 8
      },
      {
        name: '连接线',
        type: 'graph',
        layout: 'none',
        coordinateSystem: 'cartesian2d',
        data: warningNodes.map((_, i) => ({
          name: `节点${i}`,
          x: warningNodes[i].x,
          y: warningNodes[i].y
        })),
        links: warningNodes.map((_, i) => ({
          source: { x: 50, y: 50 },
          target: { x: warningNodes[i].x, y: warningNodes[i].y },
          lineStyle: {
            color: `rgba(${warningNodes[i].type === 'danger' ? '239, 68, 68' : warningNodes[i].type === 'warning' ? '249, 115, 22' : '132, 204, 22'}, 0.4)`,
            width: 1.5,
            curveness: 0.1
          }
        })),
        roam: false,
        z: 5
      },
      {
        name: '预警范围',
        type: 'pie',
        radius: ['70%', '75%'],
        center: ['50%', '50%'],
        startAngle: 90,
        itemStyle: {
          borderRadius: 0,
          borderColor: '#1e293b',
          borderWidth: 0
        },
        label: { show: false },
        labelLine: { show: false },
        data: [
          { value: warningAdvance.value, name: '预警', itemStyle: { color: '#ef4444' } },
          { value: 100 - warningAdvance.value, name: '正常', itemStyle: { color: '#334155' } }
        ],
        z: 3
      }
    ]
  }
  
  chartInstance.setOption(option)

  const animate = () => {
    if (!chartInstance) return
    
    const time = Date.now() / 1000
    
    const updatedRipples = ripples.map((ripple, i) => {
      const progress = ((time + ripple.delay) % ripple.duration) / ripple.duration
      const opacity = 0.1 + progress * 0.4
      const scale = 0.7 + progress * 0.6
      
      return {
        name: `涟漪层${i}`,
        data: [{
          value: [50, 50],
          symbolSize: ripple.radius * 2 * scale,
          itemStyle: {
            ...ripple.itemStyle,
            opacity
          }
        }]
      }
    })

    const updatedNodes = warningNodes.map((node, i) => {
      const wave = Math.sin(time * 2 + i) * 0.5 + 0.5
      return {
        ...node,
        symbolSize: (node.level === 1 ? 10 : node.level === 2 ? 8 : 6) * (0.9 + wave * 0.2),
        itemStyle: {
          color: node.type === 'danger' ? '#ef4444' : node.type === 'warning' ? '#f97316' : '#84cc16',
          shadowBlur: (node.level === 1 ? 15 : node.level === 2 ? 10 : 5) * (0.8 + wave * 0.4),
          shadowColor: node.type === 'danger' ? '#ef4444' : node.type === 'warning' ? '#f97316' : '#84cc16'
        }
      }
    })

    chartInstance.setOption({
      series: [
        ...updatedRipples,
        {
          name: '预警节点',
          data: updatedNodes
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
    <h3 class="text-sm font-semibold text-earth-gold-400 mb-2 flex items-center gap-2">
      <span class="w-1.5 h-1.5 rounded-full bg-earth-gold-400 animate-pulse"></span>
      生态预警提前量
    </h3>
    <div ref="chartRef" class="flex-1 relative">
      <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-50">
        <div class="text-xs text-gray-400 mb-1">预警提前量</div>
        <div class="flex items-baseline gap-1">
          <span class="text-4xl font-bold text-earth-gold-400 drop-shadow-lg">{{ warningAdvance }}</span>
          <span class="text-sm text-earth-gold-300">小时</span>
        </div>
        <div class="text-xs text-gray-500 mt-1">预警发出与问题发生时间差</div>
      </div>
    </div>
    <div class="flex justify-around mt-1 text-xs">
      <div class="text-center">
        <div class="w-2 h-2 rounded-full bg-earth-gold-500 mb-1 mx-auto animate-pulse"></div>
        <span class="text-gray-400">严重预警</span>
        <p class="text-sm font-bold text-earth-gold-400">1项</p>
      </div>
      <div class="text-center">
        <div class="w-2 h-2 rounded-full bg-smart-blue-500 mb-1 mx-auto animate-pulse" style="animation-delay: 0.3s"></div>
        <span class="text-gray-400">中等预警</span>
        <p class="text-sm font-bold text-smart-blue-400">2项</p>
      </div>
      <div class="text-center">
        <div class="w-2 h-2 rounded-full bg-eco-green-500 mb-1 mx-auto animate-pulse" style="animation-delay: 0.6s"></div>
        <span class="text-gray-400">轻微预警</span>
        <p class="text-sm font-bold text-green-400">1项</p>
      </div>
    </div>
  </div>
</template>
