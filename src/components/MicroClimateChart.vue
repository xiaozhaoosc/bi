<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null
let updateInterval: ReturnType<typeof setInterval> | null = null

const balance = ref(85)
const light = ref(72)
const co2 = ref(450)

const initChart = () => {
  if (!chartRef.value) return
  
  chartInstance = echarts.init(chartRef.value)
  
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
        const name = params.seriesName as string
        const indicators: Record<string, { name: string; value: number; unit: string; color: string }> = {
          light: { name: '光照', value: light.value, unit: '%', color: '#eab308' },
          co2: { name: 'CO₂', value: co2.value, unit: 'ppm', color: '#22c55e' }
        }
        const data = indicators[name] || { name: params.seriesName, value: 0, unit: '', color: '#fff' }
        return `${data.name}: <strong style="color: ${data.color}">${data.value.toFixed(1)}${data.unit}</strong>`
      }
    },
    series: [
      {
        name: '平衡环',
        type: 'gauge',
        radius: '90%',
        center: ['50%', '50%'],
        min: 0,
        max: 100,
        splitNumber: 4,
        startAngle: 90,
        endAngle: -270,
        axisLine: {
          lineStyle: {
            width: 12,
            color: [
              [0.5, 'rgba(234, 179, 8, 0.3)'],
              [1, 'rgba(34, 197, 94, 0.3)']
            ]
          }
        },
        pointer: {
          show: false
        },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#eab308' },
                { offset: 1, color: '#22c55e' }
              ]
            }
          }
        },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: {
          show: false
        },
        data: [{ value: balance.value, name: '平衡度' }],
        detail: {
          show: false
        }
      },

      {
        name: 'light',
        type: 'gauge',
        radius: '75%',
        center: ['50%', '50%'],
        min: 20,
        max: 100,
        startAngle: 0,
        endAngle: -90,
        splitNumber: 4,
        axisLine: {
          lineStyle: {
            width: 6,
            color: [[1, 'rgba(234, 179, 8, 0.4)']]
          }
        },
        pointer: {
          itemStyle: { color: '#eab308' },
          length: '55%',
          width: 2.5
        },
        axisTick: { show: false },
        splitLine: {
          distance: -8,
          length: 6,
          lineStyle: { color: '#eab308', width: 1.5 }
        },
        axisLabel: {
          color: '#eab308',
          distance: 12,
          fontSize: 8,
          formatter: (v: number) => v === 60 ? '60%' : ''
        },
        detail: { show: false },
        data: [{ value: light.value, name: '光照' }]
      },
      {
        name: 'co2',
        type: 'gauge',
        radius: '75%',
        center: ['50%', '50%'],
        min: 350,
        max: 600,
        startAngle: -90,
        endAngle: -180,
        splitNumber: 5,
        axisLine: {
          lineStyle: {
            width: 6,
            color: [[1, 'rgba(34, 197, 94, 0.4)']]
          }
        },
        pointer: {
          itemStyle: { color: '#22c55e' },
          length: '55%',
          width: 2.5
        },
        axisTick: { show: false },
        splitLine: {
          distance: -8,
          length: 6,
          lineStyle: { color: '#22c55e', width: 1.5 }
        },
        axisLabel: {
          color: '#22c55e',
          distance: 12,
          fontSize: 8,
          formatter: (v: number) => v === 475 ? '475' : ''
        },
        detail: { show: false },
        data: [{ value: co2.value, name: 'CO₂' }]
      },
      {
        name: '核心',
        type: 'graph',
        layout: 'none',
        coordinateSystem: 'cartesian2d',
        data: [{
          name: '平衡点',
          x: 50,
          y: 50,
          symbolSize: 20,
          itemStyle: {
            color: new echarts.graphic.RadialGradient(0.3, 0.3, 1, [
              { offset: 0, color: '#3b82f6' },
              { offset: 0.5, color: '#2563eb' },
              { offset: 1, color: '#1d4ed8' }
            ]),
            shadowBlur: 20,
            shadowColor: '#3b82f6'
          }
        }],
        roam: false
      }
    ],
    xAxis: { show: false, min: 0, max: 100 },
    yAxis: { show: false, min: 0, max: 100 },
    grid: { left: 0, right: 0, top: 0, bottom: 0 }
  }
  
  chartInstance.setOption(option)

  const updateParams = () => {
    if (!chartInstance) return
    
    const time = Date.now() / 1000
    
    const lightBase = 72
    const co2Base = 450
    
    light.value = Math.max(30, Math.min(95, lightBase + Math.sin(time * 0.3) * 15 + Math.random() * 5 - 2.5))
    co2.value = co2Base + Math.cos(time * 0.4) * 20 + Math.random() * 10 - 5
    
    const lightScore = light.value > 40 && light.value < 90 ? 90 : Math.max(50, light.value)
    const co2Score = co2.value > 380 && co2.value < 550 ? 95 : Math.max(40, 100 - Math.abs(co2.value - 450) * 0.3)
    
    balance.value = Math.round((lightScore * 0.5 + co2Score * 0.5))

    chartInstance.setOption({
      series: [
        { name: '平衡环', data: [{ value: balance.value }] },
        { name: 'light', data: [{ value: light.value }] },
        { name: 'co2', data: [{ value: co2.value }] }
      ]
    })
  }
  
  updateParams()
  updateInterval = setInterval(updateParams, 10000)
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
  if (updateInterval) {
    clearInterval(updateInterval)
  }
  chartInstance?.dispose()
})
</script>

<template>
  <section class="glass-panel rounded-3xl p-4 border-t border-white/20 relative">
    <div class="flex items-center gap-2 mb-3">
      <div class="w-1 h-4 bg-eco-green-500 shadow-[0_0_8px_#00ff88]"></div>
      <span class="text-earth-gold-400 font-bold text-base tracking-wider">微气候平衡度</span>
    </div>
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 flex items-center justify-center">
          <div class="text-2xl font-bold text-smart-blue-400">{{ balance }}%</div>
        </div>
        <div class="flex flex-col gap-1 text-xs">
          <div class="flex items-center gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-earth-gold-400 animate-pulse"></div>
            <span class="text-gray-400">光照: <span class="text-earth-gold-400 font-bold">{{ light.toFixed(1) }}%</span></span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-eco-green-500 animate-pulse" style="animation-delay: 0.3s"></div>
            <span class="text-gray-400">CO₂: <span class="text-eco-green-400 font-bold">{{ co2.toFixed(0) }}ppm</span></span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
