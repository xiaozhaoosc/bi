<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null
let animationFrame: number | null = null

const efficiency = 78
const actualYield = 850
const theoreticalMax = 1090
const lightUtilization = 0.92

const initChart = () => {
  if (!chartRef.value) return
  
  chartInstance = echarts.init(chartRef.value)
  
  const rayCount = 8
  const rays = Array.from({ length: rayCount }, (_, i) => {
    const angle = (i / rayCount) * Math.PI * 2
    return {
      name: `光线${i}`,
      value: [
        50 + 40 * Math.cos(angle),
        50 + 40 * Math.sin(angle)
      ],
      symbolSize: 6,
      itemStyle: {
        color: '#fde047',
        shadowBlur: 20,
        shadowColor: '#fde047'
      },
      lineStyle: {
        color: 'rgba(253, 224, 71, 0.3)',
        width: 2
      }
    }
  })

  const photonCount = 20
  const photons = Array.from({ length: photonCount }, (_, i) => {
    const angle = (i / photonCount) * Math.PI * 2
    const speed = 0.02 + Math.random() * 0.02
    return {
      name: `光子${i}`,
      angle,
      speed,
      distance: Math.random() * 35,
      value: [
        50 + (45 - Math.random() * 10) * Math.cos(angle),
        50 + (45 - Math.random() * 10) * Math.sin(angle)
      ],
      symbolSize: 4 + Math.random() * 3,
      itemStyle: {
        color: '#f97316',
        shadowBlur: 15,
        shadowColor: '#f97316'
      }
    }
  })

  const absorptionZones = [
    { x: 35, y: 45, radius: 8, color: '#22c55e' },
    { x: 55, y: 50, radius: 7, color: '#16a34a' },
    { x: 50, y: 60, radius: 6, color: '#15803d' }
  ]

  const option: any = {
    backgroundColor: 'transparent',
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: '#f97316',
      borderWidth: 1,
      padding: [10, 14],
      textStyle: {
        color: '#ffffff',
        fontSize: 13,
        fontWeight: '500'
      },
      formatter: (params: any) => {
        if (params.seriesName === '光线') {
          return `光能输入: <strong>活跃</strong>`
        } else if (params.seriesName === '光子流') {
          return `光子: <strong>能量传递中</strong>`
        } else if (params.seriesName === '吸收区域') {
          return `叶片吸收点: <strong>正在进行光合作用</strong>`
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
        name: '光线',
        type: 'effectScatter',
        data: rays,
        symbol: 'circle',
        effect: {
          show: true,
          period: 2,
          trailLength: 0.8,
          color: '#fde047'
        },
        animationDuration: 2000
      },
      {
        name: '光子流',
        type: 'scatter',
        data: photons,
        symbol: 'circle',
        emphasis: {
          itemStyle: {
            shadowBlur: 25,
            shadowColor: '#f97316'
          }
        }
      },
      {
        name: '吸收区域',
        type: 'graph',
        layout: 'none',
        coordinateSystem: 'cartesian2d',
        data: absorptionZones.map((zone, i) => ({
          name: `吸收区${i + 1}`,
          x: zone.x,
          y: zone.y,
          symbolSize: zone.radius * 2,
          itemStyle: {
            color: new echarts.graphic.RadialGradient(0.3, 0.3, 1, [
              { offset: 0, color: zone.color },
              { offset: 1, color: `${zone.color}40` }
            ]),
            shadowBlur: 15,
            shadowColor: zone.color
          }
        })),
        roam: false
      },
      {
        name: '光合核心',
        type: 'pie',
        radius: ['25%', '30%'],
        center: ['50%', '50%'],
        startAngle: 90,
        itemStyle: {
          borderRadius: 0,
          borderColor: '#1e293b',
          borderWidth: 0
        },
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        data: [
          { value: efficiency, name: '效率', itemStyle: { color: '#22c55e' } },
          { value: 100 - efficiency, name: '待提升', itemStyle: { color: '#334155' } }
        ]
      }
    ]
  }
  
  chartInstance.setOption(option)

  const animate = () => {
    if (!chartInstance) return
    
    const time = Date.now() / 1000
    
    const updatedPhotons = photons.map((p) => ({
      ...p,
      angle: p.angle + p.speed,
      distance: 35 * (0.8 + Math.sin(time * 2 + p.angle) * 0.2),
      value: [
        50 + p.distance * Math.cos(p.angle),
        50 + p.distance * Math.sin(p.angle)
      ]
    }))

    chartInstance.setOption({
      series: [{
        name: '光子流',
        data: updatedPhotons
      }]
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
  <div class="h-full glass-panel rounded-xl p-3 flex flex-col" style="min-height: 300px;">
    <h3 class="text-sm font-semibold text-earth-gold-400 mb-2 flex items-center gap-2">
      <span class="w-1.5 h-1.5 rounded-full bg-earth-gold-400 animate-pulse"></span>
      光合效率指数
    </h3>
    <div ref="chartRef" class="flex-1 min-h-[200px]">
      <div class="w-full h-full flex items-center justify-center">
        <div class="text-center">
          <div class="text-3xl font-bold text-earth-gold-400 mb-1">{{ efficiency }}%</div>
          <div class="text-xs text-gray-400">光能利用率</div>
        </div>
      </div>
    </div>
    <div class="flex justify-around mt-1 text-xs">
      <div class="text-center">
        <p class="text-gray-400">实际产物</p>
        <p class="text-sm font-bold text-eco-green-400">{{ actualYield }}g/m²</p>
      </div>
      <div class="text-center">
        <p class="text-gray-400">理论最大</p>
        <p class="text-sm font-bold text-smart-blue-400">{{ theoreticalMax }}g/m²</p>
      </div>
      <div class="text-center">
        <p class="text-gray-400">光照效率</p>
        <p class="text-sm font-bold text-earth-gold-400">{{ (lightUtilization * 100).toFixed(0) }}%</p>
      </div>
    </div>
  </div>
</template>
