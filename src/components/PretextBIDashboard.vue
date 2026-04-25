<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Fullscreen, Minimize2, Cpu } from 'lucide-vue-next'
import * as echarts from 'echarts'
import MicroClimateChart from './MicroClimateChart.vue'
import SensorDensityChart from './SensorDensityChart.vue'
// import LightFlow from './visuals/LightFlow.vue'
import EcoScanner from './visuals/EcoScanner.vue'
// import TimelineSlider from './visuals/TimelineSlider.vue'
import EcoGalaxy from './visuals/EcoGalaxy.vue'

// 状态管理
const isFullscreen = ref(false)
const currentTime = ref('')
const dashboardRef = ref<HTMLElement | null>(null)
const scale = ref(1)
// const timelineOptions = ['谷雨 (Q1)', '立夏 (Q2)', '小满 (Q3)', '芒种 (Q4)']
const currentTimelineIndex = ref(0)

// 模拟不同节气的数据
const seasonalData = [
  // 谷雨 (Q1)
  { ecoRadar: [75, 82, 90, 85, 80], diversity: [10, 30, 90, 60], climate: 72.5, footerValues: [85.0, 32, 72.5, 280] },
  // 立夏 (Q2)
  { ecoRadar: [80, 88, 95, 88, 85], diversity: [12, 35, 100, 70], climate: 78.0, footerValues: [90.5, 38, 78.0, 300] },
  // 小满 (Q3)
  { ecoRadar: [82, 90, 96, 89, 86], diversity: [14, 40, 110, 75], climate: 80.5, footerValues: [92.0, 40, 80.5, 310] },
  // 芒种 (Q4)
  { ecoRadar: [85, 92, 98, 90, 88], diversity: [15, 45, 120, 80], climate: 82.5, footerValues: [94.5, 42, 82.5, 320] }
]

watch(currentTimelineIndex, (newIdx) => {
  const data = seasonalData[newIdx]
  if (ecoChart) ecoChart.setOption({ series: [{ data: [{ value: data.ecoRadar }] }] })
  if (diversityChart) diversityChart.setOption({ series: [{ data: data.diversity }] })
})

// 气泡动态数据
const bubbleData = ref({
  carbon: { value: 124.5, trend: 3.2, unit: 't', label: '碳汇贡献值' },
  water: { value: 98.2, trend: 1.5, unit: '%', label: '水资源智慧循环' },
  photo: { value: 85.0, trend: -0.8, unit: '%', label: '光合效率指数' },
  community: { value: 320, trend: 5.6, unit: '万', label: '社区共生价值' }
})

// 气泡数值动态波动
const animateBubbleValues = () => {
  const fluctuate = (base: number, range: number) =>
    Math.round((base + (Math.random() - 0.5) * range) * 10) / 10

  bubbleData.value = {
    carbon: { ...bubbleData.value.carbon, value: fluctuate(124.5, 4), trend: fluctuate(3.2, 1) },
    water: { ...bubbleData.value.water, value: fluctuate(98.2, 1), trend: fluctuate(1.5, 0.5) },
    photo: { ...bubbleData.value.photo, value: fluctuate(85.0, 2), trend: fluctuate(-0.8, 0.6) },
    community: { ...bubbleData.value.community, value: fluctuate(320, 8), trend: fluctuate(5.6, 2) }
  }
}

// 图表实例
let ecoChart: echarts.ECharts | null = null
let diversityChart: echarts.ECharts | null = null
let growthChart: echarts.ECharts | null = null

const toggleFullscreen = () => {
  if (!isFullscreen.value) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}

const updateTime = () => {
  currentTime.value = new Date().toLocaleString('zh-CN')
}

// 自动缩放逻辑：基于 1920x1080 设计稿
const updateScale = () => {
  const designWidth = 1920
  const designHeight = 1080
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  
  scale.value = Math.min(windowWidth / designWidth, windowHeight / designHeight)
}

const initCharts = () => {
  ecoChart = echarts.init(document.getElementById('ecoChart'))
  ecoChart.setOption({
    backgroundColor: 'transparent',
    radar: {
      indicator: [
        { name: '生物多样性', max: 100 },
        { name: '土壤健康', max: 100 },
        { name: '空气质量', max: 100 },
        { name: '水质指标', max: 100 },
        { name: '生态平衡', max: 100 }
      ],
      radius: '65%',
      center: ['50%', '55%'],
      name: { textStyle: { color: '#888', fontSize: 11 } },
      splitArea: { show: false },
      axisLine: { lineStyle: { color: 'rgba(0, 255, 136, 0.3)' } },
      splitLine: { lineStyle: { color: 'rgba(0, 255, 136, 0.1)' } }
    },
    series: [{
      type: 'radar',
      data: [{
        value: [85, 92, 98, 90, 88],
        areaStyle: { color: 'rgba(0, 255, 136, 0.2)' },
        lineStyle: { color: 'rgba(0, 255, 136, 0.8)', width: 2 },
        itemStyle: { color: '#00ff88' }
      }]
    }],
    graphic: [{
      type: 'text',
      left: 'center',
      top: '52%',
      style: {
        text: '94.5',
        fontSize: 28,
        fill: '#00ff88',
        fontWeight: 'bold',
        fontFamily: 'Orbitron',
        shadowColor: 'rgba(0, 255, 136, 0.8)',
        shadowBlur: 20,
        textAlign: 'center'
      }
    }, {
      type: 'text',
      left: 'center',
      top: '66%',
      style: {
        text: '综合评分',
        fontSize: 10,
        fill: '#888',
        fontFamily: 'Noto Sans SC',
        textAlign: 'center'
      }
    }]
  })

  diversityChart = echarts.init(document.getElementById('diversityChart'))
  diversityChart.setOption({
    grid: { top: 20, bottom: 30, left: 40, right: 10 },
    xAxis: { type: 'category', data: ['鸟类', '昆虫', '植物', '微生物'], axisLabel: { color: '#888' } },
    yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#333' } }, axisLabel: { color: '#888' } },
    series: [{
      data: [15, 45, 120, 80],
      type: 'bar',
      barWidth: '40%',
      itemStyle: { 
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#00ff88' },
          { offset: 1, color: '#00d4ff' }
        ]),
        borderRadius: [4, 4, 0, 0]
      }
    }]
  })

  const growthChartDom = document.getElementById('growthChart')
  if (growthChartDom) {
    const rect = growthChartDom.getBoundingClientRect()
    if (rect.width > 0 && rect.height > 0) {
      growthChart = echarts.init(growthChartDom)
    } else {
      growthChart = echarts.init(growthChartDom, undefined, { width: 300, height: 200 })
    }
    growthChart.setOption({
      backgroundColor: 'transparent',
      grid: { top: 20, bottom: 30, left: 40, right: 10 },
      xAxis: { 
        type: 'category', 
        data: ['立春', '雨水', '惊蛰', '春分', '清明', '谷雨', '立夏', '小满'], 
        axisLabel: { color: '#888' },
        axisLine: { lineStyle: { color: '#444' } }
      },
      yAxis: { 
        type: 'value', 
        axisLabel: { color: '#888' }, 
        splitLine: { lineStyle: { color: '#333' } },
        axisLine: { lineStyle: { color: '#444' } }
      },
      series: [{
        data: [46, 32, 40, 91, 65, 80, 90, 83],
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        color: '#00ff88',
        lineStyle: { 
          color: '#00ff88', 
          width: 3
        },
        itemStyle: { 
          color: '#00ff88',
          borderColor: '#00ff88',
          borderWidth: 2,
          shadowBlur: 10,
          shadowColor: '#00ff88'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 255, 136, 0.3)' },
            { offset: 1, color: 'rgba(0, 255, 136, 0.05)' }
          ])
        }
      }]
    })
  }
}

const handleResize = () => {
  updateScale()
  ecoChart?.resize()
  diversityChart?.resize()
  growthChart?.resize()
}

onMounted(() => {
  updateTime()
  updateScale()
  setInterval(updateTime, 1000)
  setInterval(animateBubbleValues, 5000)
  window.addEventListener('resize', handleResize)
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  
  // 确保DOM完全渲染后再初始化图表
  setTimeout(() => {
    initCharts()
    // 再次调整大小确保图表正确显示
    setTimeout(() => {
      ecoChart?.resize()
      diversityChart?.resize()
      growthChart?.resize()
    }, 100)
  }, 100)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  ecoChart?.dispose()
  diversityChart?.dispose()
  growthChart?.dispose()
})
</script>

<template>
  <div class="dashboard-wrapper w-full h-full flex items-center justify-center overflow-hidden relative">
    <!-- Background Gradients from backup -->
    <div class="absolute inset-0 z-0 pointer-events-none opacity-40">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_50%_50%,_rgba(0,212,255,0.15)_0%,_transparent_70%)]"></div>
      <div class="absolute bottom-[-10%] left-[-10%] w-[80%] h-[80%] bg-[radial-gradient(circle_at_center,_rgba(0,255,136,0.1)_0%,_transparent_60%)]"></div>
    </div>

    <div 
      ref="dashboardRef"
      class="dashboard-content w-[1920px] h-[1080px] p-7 flex flex-col relative"
      :style="{ transform: `scale(${scale})` }"
    >
      <!-- Header -->
      <header class="flex justify-between items-start mb-9">
        <div class="flex flex-col gap-2">
          <h1 class="text-4xl font-bold tracking-[4px] bg-gradient-to-r from-eco-green-400 to-smart-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,255,136,0.3)] font-['Orbitron']">
            时茗园 · 生态守护全景
          </h1>
        </div>
        
        <div class="flex items-center gap-6 text-smart-blue-400 font-bold text-sm tracking-wider">
          <div>温度: <span class="text-eco-green-400 ml-1">22°C</span></div>
          <div>湿度: <span class="text-eco-green-400 ml-1">65%</span></div>
          <div>天气: <span class="text-earth-gold-400 ml-1">晴转多云</span></div>
          <div class="font-mono text-gray-400 ml-4 border-l border-white/20 pl-6">{{ currentTime }}</div>
          <button @click="toggleFullscreen" class="p-1 hover:text-white transition-colors ml-2">
            <Fullscreen v-if="!isFullscreen" class="w-5 h-5" />
            <Minimize2 v-else class="w-5 h-5" />
          </button>
        </div>
      </header>

      <div class="grid grid-cols-12 gap-4 flex-1 min-h-0">
        <!-- Left Panel -->
        <aside class="col-span-3 flex flex-col gap-4 overflow-hidden">
          <section class="glass-panel rounded-3xl p-6 flex-[1.2] flex flex-col overflow-hidden border-t border-white/20 relative">
            <div class="flex items-center justify-between mb-1 relative z-10">
              <div class="flex items-center gap-2">
                <div class="w-1 h-5 bg-eco-green-500 shadow-[0_0_8px_#00ff88]"></div>
                <span class="text-earth-gold-400 font-bold text-lg tracking-wider">生态健康指数</span>
              </div>
            </div>

            <!-- 核心指标数值展示 -->
            <div class="flex items-baseline gap-2 mb-1 relative z-10">
              <span class="font-['Orbitron'] font-black text-4xl text-eco-green-400 drop-shadow-[0_0_15px_rgba(0,255,136,0.6)]">94.5</span>
              <span class="text-smart-blue-400 text-xs font-mono tracking-wider">实时评分</span>
            </div>
            
            <!-- Scanning Line Animation from backup style -->
            <div class="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-eco-green-500/50 to-transparent top-0 animate-scan z-20 pointer-events-none"></div>

            
            <!-- Eco Radar Scanner Overlay -->
            <div class="absolute inset-x-6 top-24 bottom-10 opacity-40 pointer-events-none scale-110">
              <EcoScanner color="#00ff88" />
            </div>

            <div id="ecoChart" class="flex-1 min-h-0 relative z-10"></div>
            
            <!-- Decorative Corners -->
            <div class="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-white/10 rounded-tl-lg"></div>
            <div class="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-white/10 rounded-br-lg"></div>
          </section>

          <section class="glass-panel rounded-3xl p-6 flex-1 flex flex-col overflow-hidden border-t border-white/20 relative">
            <div class="flex items-center justify-between mb-1 relative z-10">
              <div class="flex items-center gap-2">
                <div class="w-1 h-5 bg-eco-green-500 shadow-[0_0_8px_#00ff88]"></div>
                <span class="text-earth-gold-400 font-bold text-lg tracking-wider">生物多样性</span>
              </div>
            </div>

            <!-- 核心指标数值展示 -->
            <div class="flex items-baseline gap-2 mb-1 relative z-10">
              <span class="font-['Orbitron'] font-black text-4xl text-eco-green-400 drop-shadow-[0_0_15px_rgba(0,255,136,0.6)]">260</span>
              <span class="text-smart-blue-400 text-xs font-mono tracking-wider">活跃物种</span>
              <span class="ml-auto flex items-center gap-1 text-xs text-eco-green-400">
                <svg class="w-3 h-3" viewBox="0 0 12 12" fill="currentColor"><path d="M6 2L10 8H2L6 2Z"/></svg>
                +12.4%
              </span>
            </div>

            <div class="flex flex-col gap-1 mb-3 text-[11px] relative z-10">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="px-1.5 py-0.5 bg-smart-blue-500/20 text-smart-blue-400 rounded text-[10px]">声纹识别</span>
                  <span class="text-gray-500">珍稀鸟类: <span class="text-white font-bold">3种</span></span>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="px-1.5 py-0.5 bg-smart-blue-500/20 text-smart-blue-400 rounded text-[10px]">影像追踪</span>
                  <span class="text-gray-500">监测物种: <span class="text-white font-bold">42种</span></span>
                </div>
              </div>
            </div>
            
            <!-- Eco Galaxy Particle Effect -->
            <EcoGalaxy color="#00d4ff" />

            <div id="diversityChart" class="flex-1 min-h-0 relative z-10"></div>
          </section>
        </aside>

        <!-- Center Stage -->
        <main class="col-span-6 relative perspective-lg preserve-3d">
          <!-- 3D Tea Garden Model - 填满中心区域，避开底部栏 -->
          <div class="absolute inset-0 pb-[230px] p-1 flex items-center justify-center overflow-hidden">
            <div class="w-full h-full max-w-none overflow-hidden rounded-2xl relative">
              <img
                src="/images/a_high_fidelity_3d_digital_twin_of_a_lush_green_tea_garden_landscape_isolated.png"
                alt="Tea Garden Digital Twin"
                class="w-full h-full object-cover filter drop-shadow-[0_0_30px_rgba(0,255,136,0.5)] animate-float"
              />
              <!-- Digital Grid Overlay -->
              <div class="absolute inset-0 pointer-events-none">
                <div class="w-full h-full border border-eco-green-400/30 rounded-lg"></div>
                <div class="absolute inset-0 grid grid-cols-10 grid-rows-10 pointer-events-none">
                  <div v-for="i in 100" :key="i" class="border border-eco-green-400/10"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pretext Bubbles - 增强版 -->
          <div class="absolute inset-0 pointer-events-none">
              <!-- SVG 连接线动画层 -->
              <svg class="absolute inset-0 w-full h-full" viewBox="0 0 960 800" preserveAspectRatio="xMidYMid meet">
                <!-- 左上气泡连接线 -->
                <line x1="240" y1="200" x2="480" y2="400" stroke="rgba(0,255,136,0.3)" stroke-width="1.5" stroke-dasharray="6 4">
                  <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="2s" repeatCount="indefinite" />
                </line>
                <circle r="3" fill="#00ff88" opacity="0.8">
                  <animateMotion dur="2s" repeatCount="indefinite" path="M240,200 L480,400" />
                </circle>
                <!-- 右上气泡连接线 -->
                <line x1="720" y1="200" x2="480" y2="400" stroke="rgba(0,212,255,0.3)" stroke-width="1.5" stroke-dasharray="6 4">
                  <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="2.5s" repeatCount="indefinite" />
                </line>
                <circle r="3" fill="#00d4ff" opacity="0.8">
                  <animateMotion dur="2.5s" repeatCount="indefinite" path="M720,200 L480,400" />
                </circle>
                <!-- 左下气泡连接线 -->
                <line x1="240" y1="580" x2="480" y2="400" stroke="rgba(255,204,51,0.3)" stroke-width="1.5" stroke-dasharray="6 4">
                  <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="2.2s" repeatCount="indefinite" />
                </line>
                <circle r="3" fill="#ffcc33" opacity="0.8">
                  <animateMotion dur="2.2s" repeatCount="indefinite" path="M240,580 L480,400" />
                </circle>
                <!-- 右下气泡连接线 -->
                <line x1="720" y1="580" x2="480" y2="400" stroke="rgba(168,85,247,0.3)" stroke-width="1.5" stroke-dasharray="6 4">
                  <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="1.8s" repeatCount="indefinite" />
                </line>
                <circle r="3" fill="#a855f7" opacity="0.8">
                  <animateMotion dur="1.8s" repeatCount="indefinite" path="M720,580 L480,400" />
                </circle>
              </svg>

              <!-- 左上气泡：碳汇贡献值 -->
              <div class="absolute top-[18%] left-[12%] pretext-bubble pretext-bubble-green">
                <div class="glass-panel p-5 rounded-2xl border border-eco-green-400/30 shadow-[0_0_30px_rgba(0,255,136,0.3)] backdrop-blur-md min-w-[180px]">
                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-2 h-2 rounded-full bg-eco-green-400 animate-pulse shadow-[0_0_6px_#00ff88]"></div>
                    <span class="text-eco-green-400 font-['Noto_Sans_SC'] text-sm font-medium">碳汇贡献值</span>
                  </div>
                  <div class="flex items-baseline gap-1">
                    <span class="font-['Orbitron'] font-bold text-3xl text-eco-green-400">{{ bubbleData.carbon.value }}</span>
                    <span class="font-['Noto_Sans_SC'] font-bold text-base text-eco-green-400/70">{{ bubbleData.carbon.unit }}</span>
                  </div>
                  <div class="flex items-center gap-1 mt-1.5">
                    <svg class="w-3 h-3" :class="bubbleData.carbon.trend >= 0 ? 'text-eco-green-400' : 'text-red-400'" viewBox="0 0 12 12" fill="currentColor">
                      <path v-if="bubbleData.carbon.trend >= 0" d="M6 2L10 8H2L6 2Z" />
                      <path v-else d="M6 10L2 4H10L6 10Z" />
                    </svg>
                    <span class="text-xs" :class="bubbleData.carbon.trend >= 0 ? 'text-eco-green-400' : 'text-red-400'">
                      {{ bubbleData.carbon.trend >= 0 ? '+' : '' }}{{ bubbleData.carbon.trend }}%
                    </span>
                    <span class="text-gray-500 text-[10px] ml-1">较上季</span>
                  </div>
                  <div class="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-eco-green-500 to-eco-green-400 rounded-full transition-all duration-1000" style="width: 78%"></div>
                  </div>
                </div>
              </div>

              <!-- 右上气泡：水资源智慧循环 -->
              <div class="absolute top-[18%] right-[12%] pretext-bubble pretext-bubble-blue">
                <div class="glass-panel p-5 rounded-2xl border border-smart-blue-400/30 shadow-[0_0_30px_rgba(0,212,255,0.3)] backdrop-blur-md min-w-[180px]">
                  <div class="flex items-center justify-end gap-2 mb-2">
                    <span class="text-smart-blue-400 font-['Noto_Sans_SC'] text-sm font-medium">水资源智慧循环</span>
                    <div class="w-2 h-2 rounded-full bg-smart-blue-400 animate-pulse shadow-[0_0_6px_#00d4ff]"></div>
                  </div>
                  <div class="flex items-baseline justify-end gap-1">
                    <span class="font-['Orbitron'] font-bold text-3xl text-smart-blue-400">{{ bubbleData.water.value }}</span>
                    <span class="font-['Noto_Sans_SC'] font-bold text-base text-smart-blue-400/70">{{ bubbleData.water.unit }}</span>
                  </div>
                  <div class="flex items-center justify-end gap-1 mt-1.5">
                    <span class="text-gray-500 text-[10px] mr-1">较上季</span>
                    <span class="text-xs" :class="bubbleData.water.trend >= 0 ? 'text-smart-blue-400' : 'text-red-400'">
                      {{ bubbleData.water.trend >= 0 ? '+' : '' }}{{ bubbleData.water.trend }}%
                    </span>
                    <svg class="w-3 h-3" :class="bubbleData.water.trend >= 0 ? 'text-smart-blue-400' : 'text-red-400'" viewBox="0 0 12 12" fill="currentColor">
                      <path v-if="bubbleData.water.trend >= 0" d="M6 2L10 8H2L6 2Z" />
                      <path v-else d="M6 10L2 4H10L6 10Z" />
                    </svg>
                  </div>
                  <div class="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-smart-blue-500 to-smart-blue-400 rounded-full transition-all duration-1000" style="width: 92%"></div>
                  </div>
                </div>
              </div>

              <!-- 左下气泡：光合效率指数 -->
              <div class="absolute bottom-[28%] left-[12%] pretext-bubble pretext-bubble-gold">
                <div class="glass-panel p-5 rounded-2xl border border-earth-gold-400/30 shadow-[0_0_30px_rgba(255,204,51,0.3)] backdrop-blur-md min-w-[180px]">
                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-2 h-2 rounded-full bg-earth-gold-400 animate-pulse shadow-[0_0_6px_#ffcc33]"></div>
                    <span class="text-earth-gold-400 font-['Noto_Sans_SC'] text-sm font-medium">光合效率指数</span>
                  </div>
                  <div class="flex items-baseline gap-1">
                    <span class="font-['Orbitron'] font-bold text-3xl text-earth-gold-400">{{ bubbleData.photo.value }}</span>
                    <span class="font-['Noto_Sans_SC'] font-bold text-base text-earth-gold-400/70">{{ bubbleData.photo.unit }}</span>
                  </div>
                  <div class="flex items-center gap-1 mt-1.5">
                    <svg class="w-3 h-3" :class="bubbleData.photo.trend >= 0 ? 'text-earth-gold-400' : 'text-red-400'" viewBox="0 0 12 12" fill="currentColor">
                      <path v-if="bubbleData.photo.trend >= 0" d="M6 2L10 8H2L6 2Z" />
                      <path v-else d="M6 10L2 4H10L6 10Z" />
                    </svg>
                    <span class="text-xs" :class="bubbleData.photo.trend >= 0 ? 'text-earth-gold-400' : 'text-red-400'">
                      {{ bubbleData.photo.trend >= 0 ? '+' : '' }}{{ bubbleData.photo.trend }}%
                    </span>
                    <span class="text-gray-500 text-[10px] ml-1">较上季</span>
                  </div>
                  <div class="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-earth-gold-500 to-earth-gold-400 rounded-full transition-all duration-1000" style="width: 65%"></div>
                  </div>
                </div>
              </div>

              <!-- 右下气泡：社区共生价值 -->
              <div class="absolute bottom-[28%] right-[12%] pretext-bubble pretext-bubble-purple">
                <div class="glass-panel p-5 rounded-2xl border border-purple-400/30 shadow-[0_0_30px_rgba(168,85,247,0.3)] backdrop-blur-md min-w-[180px]">
                  <div class="flex items-center justify-end gap-2 mb-2">
                    <span class="text-purple-400 font-['Noto_Sans_SC'] text-sm font-medium">社区共生价值</span>
                    <div class="w-2 h-2 rounded-full bg-purple-400 animate-pulse shadow-[0_0_6px_#a855f7]"></div>
                  </div>
                  <div class="flex items-baseline justify-end gap-1">
                    <span class="font-['Orbitron'] font-bold text-3xl text-purple-400">{{ bubbleData.community.value }}</span>
                    <span class="font-['Noto_Sans_SC'] font-bold text-base text-purple-400/70">{{ bubbleData.community.unit }}</span>
                  </div>
                  <div class="flex items-center justify-end gap-1 mt-1.5">
                    <span class="text-gray-500 text-[10px] mr-1">较上季</span>
                    <span class="text-xs" :class="bubbleData.community.trend >= 0 ? 'text-purple-400' : 'text-red-400'">
                      {{ bubbleData.community.trend >= 0 ? '+' : '' }}{{ bubbleData.community.trend }}%
                    </span>
                    <svg class="w-3 h-3" :class="bubbleData.community.trend >= 0 ? 'text-purple-400' : 'text-red-400'" viewBox="0 0 12 12" fill="currentColor">
                      <path v-if="bubbleData.community.trend >= 0" d="M6 2L10 8H2L6 2Z" />
                      <path v-else d="M6 10L2 4H10L6 10Z" />
                    </svg>
                  </div>
                  <div class="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-1000" style="width: 85%"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 装饰背景效果 -->
            <div class="w-[800px] h-[800px] bg-gradient-to-b from-eco-green-500/10 to-transparent rounded-full blur-[150px] animate-pulse"></div>
            <div class="hologram-base w-[700px] h-[60px] bg-eco-green-500/20 absolute bottom-16 blur-3xl transform rotateX(80deg)"></div>

          <!-- 底部信息栏：微气候平衡度 + AI预警 + 多媒体区域 -->
          <div class="absolute bottom-0 inset-x-0 flex gap-2 z-30 h-[210px]">
            <MicroClimateChart class="flex-1" />
            
            <section class="glass-panel rounded-2xl p-2.5 border-t border-white/20 relative flex-1 flex flex-col">
              <div class="flex items-center gap-1.5 mb-1">
                <div class="w-1 h-3.5 bg-red-500 shadow-[0_0_8px_#ef4444]"></div>
                <span class="text-earth-gold-400 font-bold text-xs tracking-wider">AI 预警中枢</span>
                <div class="ml-auto flex items-center gap-0.5">
                  <div class="w-1 h-1 rounded-full bg-red-500 animate-pulse"></div>
                  <span class="text-red-400 text-[9px] font-mono">LIVE</span>
                </div>
              </div>
              
              <div class="flex-1 flex flex-col gap-1.5 justify-center">
                <div class="flex flex-col gap-1 text-[11px]">
                  <div class="flex items-center gap-1.5 text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">
                    <svg class="w-2.5 h-2.5 shrink-0" viewBox="0 0 12 12" fill="currentColor"><path d="M6 1L11 10H1L6 1Z"/></svg>
                    <span>局部湿度异常 (45min)</span>
                  </div>
                </div>

                <div class="flex flex-col gap-1.5 text-xs">
                  <div class="flex items-center gap-2 text-red-400 bg-red-500/10 px-2 py-1 rounded-lg">
                    <svg class="w-3 h-3 shrink-0" viewBox="0 0 12 12" fill="currentColor"><path d="M6 1L11 10H1L6 1Z"/></svg>
                    <span>局部湿度异常 (提前量: 45min)</span>
                  </div>
                  <div class="flex items-center gap-2 text-yellow-400/80 bg-yellow-500/5 px-2 py-1 rounded-lg">
                    <svg class="w-3 h-3 shrink-0" viewBox="0 0 12 12" fill="currentColor"><rect x="1" y="1" width="10" height="10" rx="2"/></svg>
                    <span>土壤 pH 偏移预警</span>
                  </div>
                  <div class="text-gray-400 pl-2 text-[10px] mt-0.5 border-l-2 border-red-500/30">
                    建议: 开启 3 号区自动化排灌系统
                  </div>
                </div>
              </div>
            </section>

            <section class="glass-panel rounded-2xl p-2.5 border-t border-white/20 relative flex-1 flex flex-col">
              <div class="flex items-center gap-1.5 mb-1">
                <div class="w-1 h-3.5 bg-smart-blue-500 shadow-[0_0_8px_#3b82f6]"></div>
                <span class="text-earth-gold-400 font-bold text-xs tracking-wider">茶园实况</span>
                <div class="ml-auto flex items-center gap-0.5">
                  <div class="w-1 h-1 rounded-full bg-red-500 animate-pulse"></div>
                  <span class="text-red-400 text-[9px] font-mono">REC</span>
                </div>
              </div>
              <div class="flex-1 relative rounded-lg overflow-hidden bg-black/40">
                <video
                  src="/videos/茶园茶山.mp4"
                  autoplay
                  loop
                  muted
                  playsinline
                  class="w-full h-full object-cover"
                ></video>
                <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
              </div>
            </section>
          </div>
        </main>

        <!-- Right Panel -->
        <aside class="col-span-3 flex flex-col gap-4 overflow-hidden">
          <section class="glass-panel rounded-3xl p-6 flex-[1.2] flex flex-col overflow-hidden border-t border-white/20 relative">
            <div class="flex items-center justify-between mb-1 relative z-10">
              <div class="flex items-center gap-2">
                <div class="w-1 h-5 bg-eco-green-500 shadow-[0_0_8px_#00ff88]"></div>
                <span class="text-earth-gold-400 font-bold text-lg tracking-wider">智慧生长图谱</span>
              </div>
              <span class="text-smart-blue-400 text-xs font-mono tracking-wider">AI 决策建议</span>
            </div>

            <!-- 核心指标数值展示 -->
            <div class="flex items-baseline gap-3 mb-1 relative z-10">
              <span class="font-['Orbitron'] font-black text-4xl text-eco-green-400 drop-shadow-[0_0_15px_rgba(0,255,136,0.6)]">95</span>
              <div class="flex flex-col">
                <span class="text-smart-blue-400 text-[11px] font-mono">当前指数</span>
                <span class="text-eco-green-400 text-xs flex items-center gap-0.5">
                  <svg class="w-2.5 h-2.5" viewBox="0 0 12 12" fill="currentColor"><path d="M6 2L10 8H2L6 2Z"/></svg>
                  +12.4%
                </span>
              </div>
            </div>

            <div id="growthChart" class="flex-1 min-h-0 relative z-10"></div>
            
            <div class="mt-2 p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Cpu class="w-4 h-4 text-eco-green-500" />
                <span class="text-gray-500 uppercase tracking-tighter text-xs">AI 产量预测</span>
              </div>
              <span class="text-eco-green-500 font-mono text-sm font-bold">Q3 预期产量: +12.4%</span>
            </div>

          </section>

          <div class="flex-1 flex flex-col min-h-[180px]">
            <SensorDensityChart />
          </div>
        </aside>
      </div>


    </div>
  </div>
</template>

<style scoped>
@keyframes scan {
  from { top: 0; }
  to { top: 100%; }
}

.animate-scan {
  animation: scan 3s linear infinite;
}

.dashboard-wrapper {

  background-color: #0a1118;
}

.dashboard-content {
  transform-origin: center center;
  transition: transform 0.1s linear;
  background: transparent;
  z-index: 10;
}

.hud-card {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  mix-blend-mode: screen;
  pointer-events: auto;
}

.hud-card:hover {
  transform: translateZ(300px) scale(1.1) !important;
  background: rgba(255, 255, 255, 0.2);
  border-color: #fff;
  box-shadow: 0 0 50px rgba(0, 255, 136, 0.4);
}

/* 3D Space Position & Rotation from backup */
.hud-card.top-left {
    top: 12%;
    left: 2%;
    transform: translateZ(100px) rotateY(20deg) rotateX(10deg);
    animation: hudFloatLeft 5s infinite ease-in-out;
}

.hud-card.top-right {
    top: 12%;
    right: 2%;
    text-align: right;
    transform: translateZ(100px) rotateY(-20deg) rotateX(10deg);
    animation: hudFloatRight 5s infinite ease-in-out;
}

.hud-card.bottom-left {
    bottom: 22%;
    left: 0%;
    transform: translateZ(150px) rotateY(15deg) rotateX(-5deg);
    animation: hudFloatLeft 6s infinite ease-in-out -1s;
}

.hud-card.bottom-right {
    bottom: 22%;
    right: 0%;
    text-align: right;
    transform: translateZ(150px) rotateY(-15deg) rotateX(-5deg);
    animation: hudFloatRight 6s infinite ease-in-out -1s;
}

@keyframes hudFloatLeft {
    0%, 100% {
        transform: translateZ(100px) rotateY(20deg) rotateX(10deg) translateY(0);
    }
    50% {
        transform: translateZ(140px) rotateY(22deg) rotateX(12deg) translateY(-15px);
    }
}

@keyframes hudFloatRight {
    0%, 100% {
        transform: translateZ(100px) rotateY(-20deg) rotateX(10deg) translateY(0);
    }
    50% {
        transform: translateZ(140px) rotateY(-22deg) rotateX(12deg) translateY(-15px);
    }
}

.glass-panel {
  background: rgba(15, 23, 42, 0.3);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

@keyframes pulse {
  0%, 100% { opacity: 0.1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(1.1); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.pretext-bubble {
  animation: pretextFloat 4s ease-in-out infinite;
  transition: all 0.3s ease;
}

.pretext-bubble-green { animation-delay: 0s; }
.pretext-bubble-blue { animation-delay: -1s; }
.pretext-bubble-gold { animation-delay: -2s; }
.pretext-bubble-purple { animation-delay: -3s; }

@keyframes pretextFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.pretext-bubble::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.pretext-bubble-green::before {
  background: linear-gradient(135deg, rgba(0,255,136,0.2), transparent 60%);
}
.pretext-bubble-blue::before {
  background: linear-gradient(225deg, rgba(0,212,255,0.2), transparent 60%);
}
.pretext-bubble-gold::before {
  background: linear-gradient(135deg, rgba(255,204,51,0.2), transparent 60%);
}
.pretext-bubble-purple::before {
  background: linear-gradient(225deg, rgba(168,85,247,0.2), transparent 60%);
}
</style>
