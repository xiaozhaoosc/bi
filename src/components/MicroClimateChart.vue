<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null
let updateInterval: ReturnType<typeof setInterval> | null = null

const balance = ref(85)
const temperature = ref(24.5)
const humidity = ref(68)
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
          temperature: { name: '温度', value: temperature.value, unit: '°C', color: '#ef4444' },
          humidity: { name: '湿度', value: humidity.value, unit: '%', color: '#3b82f6' },
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
              [0.25, 'rgba(239, 68, 68, 0.3)'],
              [0.5, 'rgba(59, 130, 246, 0.3)'],
              [0.75, 'rgba(234, 179, 8, 0.3)'],
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
                { offset: 0, color: '#ef4444' },
                { offset: 0.33, color: '#3b82f6' },
                { offset: 0.66, color: '#eab308' },
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
        name: 'temperature',
        type: 'gauge',
        radius: '75%',
        center: ['50%', '50%'],
        min: 15,
        max: 35,
        startAngle: 180,
        endAngle: 90,
        splitNumber: 5,
        axisLine: {
          lineStyle: {
            width: 6,
            color: [[1, 'rgba(239, 68, 68, 0.4)']]
          }
        },
        pointer: {
          itemStyle: { color: '#ef4444' },
          length: '55%',
          width: 2.5
        },
        axisTick: { show: false },
        splitLine: {
          distance: -8,
          length: 6,
          lineStyle: { color: '#ef4444', width: 1.5 }
        },
        axisLabel: {
          color: '#ef4444',
          distance: 12,
          fontSize: 8,
          formatter: (v: number) => v === 25 ? '25°C' : ''
        },
        detail: { show: false },
        data: [{ value: temperature.value, name: '温度' }]
      },
      {
        name: 'humidity',
        type: 'gauge',
        radius: '75%',
        center: ['50%', '50%'],
        min: 40,
        max: 90,
        startAngle: 90,
        endAngle: 0,
        splitNumber: 5,
        axisLine: {
          lineStyle: {
            width: 6,
            color: [[1, 'rgba(59, 130, 246, 0.4)']]
          }
        },
        pointer: {
          itemStyle: { color: '#3b82f6' },
          length: '55%',
          width: 2.5
        },
        axisTick: { show: false },
        splitLine: {
          distance: -8,
          length: 6,
          lineStyle: { color: '#3b82f6', width: 1.5 }
        },
        axisLabel: {
          color: '#3b82f6',
          distance: 12,
          fontSize: 8,
          formatter: (v: number) => v === 65 ? '65%' : ''
        },
        detail: { show: false },
        data: [{ value: humidity.value, name: '湿度' }]
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
    
    const tempBase = 24.5
    const humiBase = 68
    const lightBase = 72
    const co2Base = 450
    
    temperature.value = tempBase + Math.sin(time * 0.5) * 2 + Math.sin(time * 1.3) * 1.5
    humidity.value = humiBase + Math.cos(time * 0.7) * 4 + Math.sin(time * 1.1) * 2
    light.value = Math.max(30, Math.min(95, lightBase + Math.sin(time * 0.3) * 15 + Math.random() * 5 - 2.5))
    co2.value = co2Base + Math.cos(time * 0.4) * 20 + Math.random() * 10 - 5
    
    const tempScore = Math.abs(temperature.value - 25) < 5 ? 95 : Math.max(60, 100 - Math.abs(temperature.value - 25) * 4)
    const humiScore = Math.abs(humidity.value - 65) < 10 ? 95 : Math.max(50, 100 - Math.abs(humidity.value - 65) * 2)
    const lightScore = light.value > 40 && light.value < 90 ? 90 : Math.max(50, light.value)
    const co2Score = co2.value > 380 && co2.value < 550 ? 95 : Math.max(40, 100 - Math.abs(co2.value - 450) * 0.3)
    
    balance.value = Math.round((tempScore * 0.25 + humiScore * 0.25 + lightScore * 0.25 + co2Score * 0.25))

    chartInstance.setOption({
      series: [
        { name: '平衡环', data: [{ value: balance.value }] },
        { name: 'temperature', data: [{ value: temperature.value }] },
        { name: 'humidity', data: [{ value: humidity.value }] },
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
  <div class="h-full glass-panel rounded-xl p-3 flex flex-col" style="min-height: 300px;">
    <h3 class="text-sm font-semibold text-smart-blue-400 mb-2 flex items-center gap-2">
      <span class="w-1.5 h-1.5 rounded-full bg-smart-blue-400 animate-pulse"></span>
      微气候平衡度
    </h3>
    <div ref="chartRef" class="flex-1 min-h-[200px]">
      <div class="w-full h-full flex items-center justify-center">
        <div class="text-center">
          <div class="text-3xl font-bold text-smart-blue-400 mb-1">{{ balance }}%</div>
          <div class="text-xs text-gray-400">协同稳定系数</div>
        </div>
      </div>
    </div>
    <div class="flex justify-around mt-1 text-xs">
      <div class="text-center">
        <div class="w-2 h-2 rounded-full bg-earth-gold-500 mx-auto mb-0.5 animate-pulse"></div>
        <span class="text-gray-400">温度</span>
        <p class="text-sm font-bold text-earth-gold-400">{{ temperature.toFixed(1) }}°C</p>
      </div>
      <div class="text-center">
        <div class="w-2 h-2 rounded-full bg-smart-blue-500 mx-auto mb-0.5 animate-pulse" style="animation-delay: 0.3s"></div>
        <span class="text-gray-400">湿度</span>
        <p class="text-sm font-bold text-smart-blue-400">{{ humidity.toFixed(1) }}%</p>
      </div>
      <div class="text-center">
        <div class="w-2 h-2 rounded-full bg-earth-gold-400 mx-auto mb-0.5 animate-pulse" style="animation-delay: 0.6s"></div>
        <span class="text-gray-400">光照</span>
        <p class="text-sm font-bold text-earth-gold-400">{{ light.toFixed(1) }}%</p>
      </div>
      <div class="text-center">
        <div class="w-2 h-2 rounded-full bg-eco-green-500 mx-auto mb-0.5 animate-pulse" style="animation-delay: 0.9s"></div>
        <span class="text-gray-400">CO₂</span>
        <p class="text-sm font-bold text-eco-green-400">{{ co2.toFixed(0) }}ppm</p>
      </div>
    </div>
  </div>
</template>
