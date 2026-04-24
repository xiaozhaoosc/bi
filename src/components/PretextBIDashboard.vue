<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Fullscreen, Minimize2 } from 'lucide-vue-next'
import * as echarts from 'echarts'
import MicroClimateChart from './MicroClimateChart.vue'
import SensorDensityChart from './SensorDensityChart.vue'
import EcoScanner from './visuals/EcoScanner.vue'

// 状态管理
const isFullscreen = ref(false)
const currentTime = ref('')
const dashboardRef = ref<HTMLElement | null>(null)
const scale = ref(1)

// 图表实例
let ecoChart: echarts.ECharts | null = null
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

  growthChart = echarts.init(document.getElementById('growthChart'))
  growthChart.setOption({
    grid: { top: 20, bottom: 30, left: 40, right: 10 },
    xAxis: { type: 'category', data: ['立春', '雨水', '惊蛰', '春分', '清明', '谷雨', '立夏', '小满'], axisLabel: { color: '#888' } },
    yAxis: { type: 'value', axisLabel: { color: '#888' }, splitLine: { lineStyle: { color: '#333' } } },
    series: [{
      data: [25, 32, 40, 55, 65, 80, 90, 95],
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

const handleResize = () => {
  updateScale()
  ecoChart?.resize()
  growthChart?.resize()
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

      <div class="grid grid-cols-12 gap-8 flex-1 min-h-0">
        <!-- Left Panel -->
        <aside class="col-span-3 flex flex-col gap-8 overflow-hidden">
          <!-- Bubble Metrics - New Position -->
          <section class="glass-panel rounded-3xl p-6 flex-[1.5] flex flex-col overflow-hidden border-t border-white/20 relative">
            <div class="flex items-center justify-between mb-2 relative z-10">
              <div class="flex items-center gap-2">
                <div class="w-1 h-5 bg-eco-green-500 shadow-[0_0_8px_#00ff88]"></div>
                <span class="text-earth-gold-400 font-bold text-lg tracking-wider">生态指标</span>
              </div>
            </div>
            
            <div class="flex-1 grid grid-cols-2 gap-4 p-2">
              <!-- Top Left Bubble -->
              <div class="glass-panel p-4 rounded-xl border border-eco-green-400/30 shadow-[0_0_20px_rgba(0,255,136,0.2)] backdrop-blur-md flex flex-col justify-center">
                <span class="text-eco-green-400 mb-1 block font-['Noto_Sans_SC'] text-sm">碳汇贡献值</span>
                <div class="block">
                  <span class="font-['Orbitron'] font-bold text-xl text-eco-green-400">124.5</span>
                  <span class="font-['Noto_Sans_SC'] font-bold text-sm text-eco-green-400"> t</span>
                </div>
              </div>

              <!-- Top Right Bubble -->
              <div class="glass-panel p-4 rounded-xl border border-smart-blue-400/30 shadow-[0_0_20px_rgba(0,212,255,0.2)] backdrop-blur-md flex flex-col justify-center">
                <span class="text-smart-blue-400 mb-1 block font-['Noto_Sans_SC'] text-sm text-right">水资源智慧循环</span>
                <div class="block text-right">
                  <span class="font-['Orbitron'] font-bold text-xl text-smart-blue-400">98.2</span>
                  <span class="font-['Noto_Sans_SC'] font-bold text-sm text-smart-blue-400"> %</span>
                </div>
              </div>

              <!-- Bottom Left Bubble -->
              <div class="glass-panel p-4 rounded-xl border border-earth-gold-400/30 shadow-[0_0_20px_rgba(255,204,51,0.2)] backdrop-blur-md flex flex-col justify-center">
                <span class="text-earth-gold-400 mb-1 block font-['Noto_Sans_SC'] text-sm">光合效率指数</span>
                <div class="block">
                  <span class="font-['Orbitron'] font-bold text-xl text-earth-gold-400">85.0</span>
                  <span class="font-['Noto_Sans_SC'] font-bold text-sm text-earth-gold-400"> %</span>
                </div>
              </div>

              <!-- Bottom Right Bubble -->
              <div class="glass-panel p-4 rounded-xl border border-purple-400/30 shadow-[0_0_20px_rgba(168,85,247,0.2)] backdrop-blur-md flex flex-col justify-center">
                <span class="text-purple-400 mb-1 block font-['Noto_Sans_SC'] text-sm text-right">社区共生价值</span>
                <div class="block text-right">
                  <span class="font-['Orbitron'] font-bold text-xl text-purple-400">320</span>
                  <span class="font-['Noto_Sans_SC'] font-bold text-sm text-purple-400"> 万</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Small Growth Chart - New Position -->
          <section class="glass-panel rounded-3xl p-6 flex-1 flex flex-col overflow-hidden border-t border-white/20 relative">
            <div class="flex items-center justify-between mb-2 relative z-10">
              <div class="flex items-center gap-2">
                <div class="w-1 h-5 bg-eco-green-500 shadow-[0_0_8px_#00ff88]"></div>
                <span class="text-earth-gold-400 font-bold text-lg tracking-wider">智慧生长图谱</span>
              </div>
              <div class="text-smart-blue-400 text-sm font-mono tracking-widest">
                AI 决策建议
              </div>
            </div>
            
            <div id="growthChart" class="flex-1 min-h-0 relative z-10"></div>
          </section>
        </aside>

        <!-- Center Stage -->
        <main class="col-span-6 relative perspective-lg preserve-3d">
          <div class="absolute inset-0 flex items-center justify-center">
            <!-- 3D Tea Garden Model -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="relative w-[600px] h-[600px] flex items-center justify-center">
                <img 
                  src="/images/a_high_fidelity_3d_digital_twin_of_a_lush_green_tea_garden_landscape_isolated.png" 
                  alt="Tea Garden Digital Twin" 
                  class="max-w-full max-h-full object-contain filter drop-shadow-[0_0_30px_rgba(0,255,136,0.5)] animate-float"
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

            <div class="w-[800px] h-[800px] bg-gradient-to-b from-eco-green-500/10 to-transparent rounded-full blur-[150px] animate-pulse"></div>
            <div class="hologram-base w-[700px] h-[60px] bg-eco-green-500/20 absolute bottom-16 blur-3xl transform rotateX(80deg)"></div>
          </div>
        </main>

        <!-- Right Panel -->
        <aside class="col-span-3 flex flex-col gap-8 overflow-hidden">
          <!-- MicroClimate Chart - New Position -->
          <MicroClimateChart />

          <!-- Sensor Density Chart - New Position -->
          <SensorDensityChart />

          <!-- Eco Health Chart - New Position -->
          <section class="glass-panel rounded-3xl p-6 flex-1 flex flex-col overflow-hidden border-t border-white/20 relative">
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

          <section class="glass-panel rounded-3xl p-6 border-t border-white/20 relative">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-1 h-5 bg-eco-green-500 shadow-[0_0_8px_#00ff88]"></div>
              <span class="text-earth-gold-400 font-bold text-lg tracking-wider">AI 预警中枢</span>
            </div>
            <div class="flex flex-col gap-1 text-xs">
              <div class="flex items-center gap-2 text-red-400">
                <div class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                <span>局部湿度异常 (提前量: 45min)</span>
              </div>
              <div class="text-gray-400 pl-3.5 mt-1">
                建议: 开启 3 号区自动化排灌系统
              </div>
            </div>
          </section>
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
</style>
