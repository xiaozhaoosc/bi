<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Fullscreen, Minimize2, Shield, Flower2, Sun, Users, Activity, Cpu, Leaf, Zap } from 'lucide-vue-next'
import * as echarts from 'echarts'
import CarbonTree from './visuals/CarbonTree.vue'
import RootNetwork from './visuals/RootNetwork.vue'
import LightFlow from './visuals/LightFlow.vue'
import EcoScanner from './visuals/EcoScanner.vue'
import ValueRing from './visuals/ValueRing.vue'
import TimelineSlider from './visuals/TimelineSlider.vue'
import EcoGalaxy from './visuals/EcoGalaxy.vue'

// 状态管理
const isFullscreen = ref(false)
const currentTime = ref('')
const dashboardRef = ref<HTMLElement | null>(null)
const scale = ref(1)
const timelineOptions = ['谷雨 (Q1)', '立夏 (Q2)', '小满 (Q3)', '芒种 (Q4)']
const currentTimelineIndex = ref(0)
const currentRole = ref<'researcher' | 'investor' | 'consumer'>('researcher')
const roles = [
  { id: 'researcher', name: '研究者', icon: Cpu, desc: '专注生态技术指标' },
  { id: 'investor', name: '投资者', icon: Zap, desc: '关注资产与社会价值' },
  { id: 'consumer', name: '消费者', icon: Leaf, desc: '追溯品质与健康指数' }
] as const

// 底部卡片响应式数据
const footerData = ref([
  {icon: Shield, title: '生态健康指数', value: 94.5, display: '94.5', unit: '分', color: 'text-eco-green-400', glow: 'shadow-eco-green-500/10', valColor: '#00ff88'},
  {icon: Flower2, title: '生物多样性丰度', value: 84, display: '42', unit: '种', color: 'text-earth-gold-400', glow: 'shadow-earth-gold-500/10', valColor: '#ffcc33'},
  {icon: Sun, title: '微气候平衡度', value: 82.5, display: '82.5', unit: '%', color: 'text-smart-blue-400', glow: 'shadow-smart-blue-500/10', valColor: '#00d4ff'},
  {icon: Users, title: '社会价值贡献', value: 80, display: '320', unit: '万', color: 'text-purple-400', glow: 'shadow-purple-500/10', valColor: '#a855f7'}
])

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
  if (climateChart) climateChart.setOption({ series: [{ data: [{ value: data.climate }] }] })
  
  // 更新底部环形图数据
  footerData.value[0].value = data.footerValues[0]
  footerData.value[0].display = data.footerValues[0].toFixed(1)
  footerData.value[1].value = data.footerValues[1] * 2 // 满分假设50种，映射到0-100
  footerData.value[1].display = data.footerValues[1].toString()
  footerData.value[2].value = data.footerValues[2]
  footerData.value[2].display = data.footerValues[2].toFixed(1)
  footerData.value[3].value = data.footerValues[3] / 4 // 满分假设400万，映射到0-100
  footerData.value[3].display = data.footerValues[3].toString()
})

// 图表实例
let ecoChart: echarts.ECharts | null = null
let diversityChart: echarts.ECharts | null = null
let growthChart: echarts.ECharts | null = null
let climateChart: echarts.ECharts | null = null

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
      name: { textStyle: { color: '#888', fontSize: 12 } },
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

  growthChart = echarts.init(document.getElementById('growthChart'))
  growthChart.setOption({
    grid: { top: 20, bottom: 30, left: 40, right: 10 },
    xAxis: { type: 'category', data: ['谷雨', '立夏', '小满', '芒种'], axisLabel: { color: '#888' } },
    yAxis: { type: 'value', axisLabel: { color: '#888' }, splitLine: { lineStyle: { color: '#333' } } },
    series: [{
      data: [45, 60, 85, 95],
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      color: '#00ff88',
      lineStyle: { 
        color: '#00ff88', 
        width: 2
      },
      itemStyle: { 
        color: '#00ff88',
        borderColor: '#00ff88',
        borderWidth: 1
      }
    }]
  })

  climateChart = echarts.init(document.getElementById('climateChart'))
  climateChart.setOption({
    series: [{
      type: 'gauge',
      radius: '90%',
      progress: { show: true, width: 12, itemStyle: { color: '#00d4ff' } },
      axisLine: { lineStyle: { width: 12, color: [[1, '#111']] } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      detail: { fontSize: 24, color: '#fff', offsetCenter: [0, '30%'], formatter: '{value}%' },
      data: [{ value: 82.5 }]
    }]
  })
}

const handleResize = () => {
  updateScale()
  ecoChart?.resize()
  diversityChart?.resize()
  growthChart?.resize()
  climateChart?.resize()
}

onMounted(() => {
  updateTime()
  updateScale()
  setInterval(updateTime, 1000)
  initCharts()
  window.addEventListener('resize', handleResize)
  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  ecoChart?.dispose()
  diversityChart?.dispose()
  growthChart?.dispose()
  climateChart?.dispose()
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
      class="dashboard-content w-[1920px] h-[1080px] p-8 flex flex-col relative"
      :style="{ transform: `scale(${scale})` }"
    >
      <!-- Header -->
      <header class="flex justify-between items-start mb-10">
        <div class="flex flex-col gap-2">
          <h1 class="text-4xl font-bold tracking-[4px] bg-gradient-to-r from-eco-green-400 to-smart-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,255,136,0.3)] font-['Orbitron']">
            时茗园 · 生态守护全景
          </h1>
        </div>
        
        <div class="flex items-center gap-6">
          <!-- Role Switcher -->
          <div class="flex bg-white/5 backdrop-blur-md rounded-full p-1 border border-white/10">
            <button 
              v-for="role in roles" 
              :key="role.id"
              @click="currentRole = role.id"
              :class="[
                'flex items-center gap-2 px-4 py-1.5 rounded-full transition-all text-xs font-bold tracking-wider',
                currentRole === role.id ? 'bg-eco-green-500 text-black shadow-[0_0_15px_rgba(0,255,136,0.5)]' : 'text-gray-400 hover:text-white'
              ]"
            >
              <component :is="role.icon" class="w-3 h-3" />
              {{ role.name }}
            </button>
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
        </div>
      </header>

      <div class="grid grid-cols-12 gap-8 flex-1 min-h-0">
        <!-- Left Panel -->
        <aside class="col-span-3 flex flex-col gap-8 overflow-hidden">
          <section class="glass-panel rounded-3xl p-6 flex-[1.2] flex flex-col overflow-hidden border-t border-white/20 relative">
            <div class="flex items-center justify-between mb-2 relative z-10">
              <div class="flex items-center gap-2">
                <div class="w-1 h-5 bg-eco-green-500 shadow-[0_0_8px_#00ff88]"></div>
                <span class="text-earth-gold-400 font-bold text-lg tracking-wider">生态健康指数</span>
              </div>
              <div class="text-smart-blue-400 text-sm font-mono tracking-widest">
                实时评分: 94.5
              </div>
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
            <div class="flex flex-col gap-2 mb-4 relative z-10">
              <div class="flex items-center gap-2">
                <div class="w-1 h-5 bg-eco-green-500 shadow-[0_0_8px_#00ff88]"></div>
                <span class="text-earth-gold-400 font-bold text-lg tracking-wider">生物多样性丰度</span>
              </div>
              <div class="flex flex-col gap-1 mt-2 text-xs">
                <div class="flex items-center gap-2">
                  <span class="px-1.5 py-0.5 bg-smart-blue-500/20 text-smart-blue-400 rounded">声纹识别</span>
                  <span class="text-gray-400">检测到珍稀鸟类: <span class="text-white">3种</span></span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="px-1.5 py-0.5 bg-smart-blue-500/20 text-smart-blue-400 rounded">影像追踪</span>
                  <span class="text-gray-400">活跃物种: <span class="text-white">42种</span></span>
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
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <!-- Central Hologram Graphic (Abstract) -->
            <div class="relative w-[600px] h-[600px] flex items-center justify-center transform-gpu animate-float">
               <!-- Carbon Sequestration Tree -->
               <div class="absolute w-64 h-80 bottom-24 left-1/2 -translate-x-1/2 opacity-80" style="transform: translateZ(50px)">
                  <CarbonTree :value="124.5" color="#00ff88" />
               </div>
               
               <!-- Underground Network (Root) -->
               <div class="absolute w-full h-40 bottom-0 left-0 opacity-40 blur-[1px]" style="transform: rotateX(70deg) translateZ(-50px)">
                  <RootNetwork :health="92" color="#00d4ff" />
               </div>

               <!-- Floating HUD Points -->
               <div class="absolute inset-0">
                  <div class="absolute top-1/4 left-1/4 animate-pulse">
                    <div class="w-2 h-2 bg-eco-green-400 rounded-full shadow-[0_0_10px_#00ff88]"></div>
                  </div>
                  <div class="absolute bottom-1/3 right-1/4 animate-pulse-slow">
                    <div class="w-2 h-2 bg-smart-blue-400 rounded-full shadow-[0_0_10px_#00d4ff]"></div>
                  </div>
               </div>
            </div>

            <!-- HUD Cards from backup with precise animations -->
            <div 
              class="hud-card top-left glass-panel p-6 rounded-2xl absolute border-l-4 border-l-eco-green-500 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-20 transition-all duration-700"
              :class="{ 'scale-110 shadow-[0_0_60px_rgba(0,255,136,0.4)] border-white/40': currentRole === 'investor' || currentRole === 'researcher' }"
            >

              <div class="flex items-center gap-2 mb-2">
                <Leaf class="w-4 h-4 text-eco-green-500" />
                <span class="text-eco-green-500 opacity-70 tracking-widest text-sm">立体碳汇总量</span>
              </div>
              <div>
                <span class="font-['Orbitron'] font-bold text-2xl text-white">124.5</span>
                <span class="text-['Noto_Sans_SC'] text-base text-eco-green-500"> 吨/年</span>
              </div>

            </div>

            <div 
              class="hud-card top-right glass-panel p-6 rounded-2xl absolute border-r-4 border-r-smart-blue-500 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-20 transition-all duration-700"
              :class="{ 'scale-110 shadow-[0_0_60px_rgba(0,212,255,0.4)] border-white/40': currentRole === 'researcher' }"
            >

              <div class="flex items-center justify-end gap-2 mb-2">
                <span class="text-smart-blue-400 opacity-70 tracking-widest text-sm">光合能量效率</span>
                <Zap class="w-4 h-4 text-smart-blue-400" />
              </div>
              <div class="text-right">
                <span class="font-['Orbitron'] font-bold text-2xl text-white">88.2</span>
                <span class="text-['Noto_Sans_SC'] text-base text-smart-blue-400"> %</span>
              </div>
            </div>

            <div 
              class="hud-card bottom-left glass-panel p-6 rounded-2xl absolute border-l-4 border-l-earth-gold-500 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-20 transition-all duration-700"
              :class="{ 'scale-110 shadow-[0_0_60px_rgba(255,204,51,0.4)] border-white/40': currentRole === 'consumer' || currentRole === 'researcher' }"
            >

              <div class="flex items-center gap-2 mb-2">
                <Activity class="w-4 h-4 text-earth-gold-500" />
                <span class="text-earth-gold-500 opacity-70 tracking-widest text-sm">水资源循环率</span>
              </div>
              <div>
                <span class="font-['Orbitron'] font-bold text-2xl text-white">98.2</span>
                <span class="text-['Noto_Sans_SC'] text-base text-earth-gold-500"> %</span>
              </div>

            </div>

            <div 
              class="hud-card bottom-right glass-panel p-6 rounded-2xl absolute border-r-4 border-r-purple-500 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-20 transition-all duration-700"
              :class="{ 'scale-110 shadow-[0_0_60px_rgba(168,85,247,0.4)] border-white/40': currentRole === 'investor' }"
            >

              <div class="flex items-center justify-end gap-2 mb-2">
                <span class="text-purple-400 opacity-70 tracking-widest text-sm">社区共生价值</span>
                <Users class="w-4 h-4 text-purple-400" />
              </div>
              <div class="text-right">
                <span class="font-['Orbitron'] font-bold text-2xl text-white">320</span>
                <span class="text-['Noto_Sans_SC'] text-base text-purple-400"> 万元</span>
              </div>
            </div>

            <div class="w-[800px] h-[800px] bg-gradient-to-b from-eco-green-500/10 to-transparent rounded-full blur-[150px] animate-pulse"></div>
            <div class="hologram-base w-[700px] h-[60px] bg-eco-green-500/20 absolute bottom-16 blur-3xl transform rotateX(80deg)"></div>

            <!-- Time-space Travel Slider -->
            <div class="absolute bottom-4 w-[600px] z-30" style="transform: translateZ(100px)">
               <TimelineSlider :options="timelineOptions" v-model="currentTimelineIndex" />
            </div>
          </div>
        </main>

        <!-- Right Panel -->
        <aside class="col-span-3 flex flex-col gap-8 overflow-hidden">
          <section class="glass-panel rounded-3xl p-6 flex-1 flex flex-col overflow-hidden border-t border-white/20 relative">
            <div class="flex items-center justify-between mb-4 relative z-10">
              <div class="flex items-center gap-2">
                <div class="w-1 h-5 bg-eco-green-500 shadow-[0_0_8px_#00ff88]"></div>
                <span class="text-earth-gold-400 font-bold text-lg tracking-wider">智慧生长图谱</span>
              </div>
              <div class="text-smart-blue-400 text-sm font-mono tracking-widest">
                AI 决策建议
              </div>
            </div>
            
            <!-- Tron Light Flow Overlay -->
            <div class="absolute inset-x-6 top-20 bottom-6 opacity-40 pointer-events-none">
              <LightFlow :intensity="80" color="#00ff88" />
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

          <section class="glass-panel rounded-3xl p-6 flex-1 flex flex-col overflow-hidden border-t border-white/20">
            <div class="flex items-center gap-2 mb-6">
              <div class="w-1 h-5 bg-eco-green-500 shadow-[0_0_8px_#00ff88]"></div>
              <span class="text-earth-gold-400 font-bold text-lg tracking-wider">微气候平衡度</span>
            </div>
            <div id="climateChart" class="flex-1 min-h-0"></div>
          </section>

          <section class="glass-panel rounded-3xl p-6 border-t border-white/20 relative">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-1 h-5 bg-eco-green-500 shadow-[0_0_8px_#00ff88]"></div>
              <span class="text-earth-gold-400 font-bold text-lg tracking-wider">AI 预警中枢</span>
            </div>
            <div v-if="currentRole !== 'consumer'" class="flex flex-col gap-1 text-xs">
              <div class="flex items-center gap-2 text-red-400">
                <div class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                <span>局部湿度异常 (提前量: 45min)</span>
              </div>
              <div class="text-gray-400 pl-3.5 mt-1">
                建议: 开启 3 号区自动化排灌系统
              </div>
            </div>
            
            <!-- Consumer View: AR Traceability Placeholder -->
            <div v-else class="flex flex-col items-center gap-3">
              <div class="w-24 h-24 bg-white p-2 rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                <!-- Mock QR Code -->
                <div class="w-full h-full border-2 border-black flex flex-wrap p-1">
                  <div v-for="i in 16" :key="i" class="w-1/4 h-1/4" :class="Math.random() > 0.5 ? 'bg-black' : 'bg-transparent'"></div>
                </div>
              </div>
              <div class="text-center">
                <div class="text-eco-green-400 font-bold text-xs mb-1">扫码开启 AR 溯源</div>
                <div class="text-[10px] text-gray-500">查看到期茶叶地块、采摘时间、加工工序</div>
              </div>
            </div>
          </section>
        </aside>
      </div>

      <!-- Footer Values (Sustainable Value Ring) -->
    <footer class="mt-10 grid grid-cols-4 gap-8">
      <div v-for="(item, idx) in footerData" :key="idx" class="glass-panel rounded-2xl p-6 flex items-center gap-6 hover:border-white/40 transition-all cursor-pointer group shadow-xl" :class="item.glow">
        
        <!-- Animated Value Ring -->
        <ValueRing :value="item.value" :color="item.valColor" :size="70" :strokeWidth="4" class="group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
          <div class="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
            <component :is="item.icon" class="w-6 h-6" :class="item.color" />
          </div>
        </ValueRing>

        <div class="flex flex-col gap-1">
          <span class="text-gray-500 font-medium tracking-wider text-base">{{ item.title }}</span>
          <div>
            <span class="font-['Orbitron'] font-bold text-3xl text-white">{{ item.display }}</span>
            <span class="font-['Noto_Sans_SC'] font-bold text-sm" :style="{ color: item.valColor }"> {{ item.unit }}</span>
          </div>
        </div>
      </div>
    </footer>
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
</style>
