<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Fullscreen, Minimize2, Maximize2, Info, Thermometer, Droplets, Cloud, Clock, Shield, Flower2, TrendingUp, Sun, AlertTriangle, Users } from 'lucide-vue-next'
import { prepare, layout, prepareWithSegments, walkLineRanges } from '@chenglou/pretext'
import * as echarts from 'echarts'

const FONT = '14px "Noto Sans SC", sans-serif'

// 状态管理
const isFullscreen = ref(false)
const currentTime = ref('')

// 图表实例
let ecoChart: echarts.ECharts | null = null
let diversityChart: echarts.ECharts | null = null
let growthChart: echarts.ECharts | null = null
let climateChart: echarts.ECharts | null = null

// 全屏功能
const toggleFullscreen = () => {
  if (!isFullscreen.value) {
    const elem = document.documentElement
    if (elem.requestFullscreen) {
      elem.requestFullscreen()
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen()
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen()
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    }
  }
}

// 监听全屏状态变化
const handleFullscreenChange = () => {
  isFullscreen.value = !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement)
}

// 自动全屏（如果是大屏设备）
const checkAutoFullscreen = () => {
  const screenWidth = window.screen.width
  const screenHeight = window.screen.height
  
  // 大屏设备判断（例如 1920x1080 及以上）
  if (screenWidth >= 1920 && screenHeight >= 1080) {
    toggleFullscreen()
  }
}

// 更新时间
const updateTime = () => {
  currentTime.value = new Date().toLocaleString('zh-CN')
}

// 初始化图表
const initCharts = () => {
  // 生态健康雷达图
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
      splitArea: { show: false },
      axisLine: { lineStyle: { color: 'rgba(0, 255, 136, 0.3)' } },
      splitLine: { lineStyle: { color: 'rgba(0, 255, 136, 0.1)' } }
    },
    series: [{
      type: 'radar',
      data: [{
        value: [85, 92, 98, 90, 88],
        name: '当前状态',
        areaStyle: { color: 'rgba(0, 255, 136, 0.2)' },
        lineStyle: { color: 'rgba(0, 255, 136, 0.8)' },
        itemStyle: { color: '#00ff88' }
      }]
    }]
  })

  // 生物多样性柱状图
  diversityChart = echarts.init(document.getElementById('diversityChart'))
  diversityChart.setOption({
    grid: { top: 10, bottom: 20, left: 40, right: 10 },
    xAxis: { type: 'category', data: ['鸟类', '昆虫', '植物', '微生物'], axisLabel: { color: '#aaa' } },
    yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#222' } }, axisLabel: { color: '#aaa' } },
    series: [{
      data: [15, 45, 120, 80],
      type: 'bar',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#00d4ff' },
          { offset: 1, color: '#00ff88' }
        ])
      }
    }]
  })

  // 智慧生长图谱
  growthChart = echarts.init(document.getElementById('growthChart'))
  growthChart.setOption({
    grid: { top: 20, bottom: 20, left: 40, right: 10 },
    xAxis: { type: 'category', data: ['谷雨', '立夏', '小满', '芒种'], axisLabel: { color: '#aaa' } },
    yAxis: { type: 'value', axisLabel: { color: '#aaa' } },
    series: [{
      data: [45, 60, 85, 95],
      type: 'line',
      smooth: true,
      areaStyle: { opacity: 0.1 },
      lineStyle: { width: 3, color: '#ffcc33' },
      itemStyle: { color: '#ffcc33' }
    }]
  })

  // 微气候平衡度
  climateChart = echarts.init(document.getElementById('climateChart'))
  climateChart.setOption({
    series: [{
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: 100,
      splitNumber: 5,
      progress: { show: true, width: 8, itemStyle: { color: '#00d4ff' } },
      axisLine: { lineStyle: { width: 8, color: [[1, '#111']] } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      anchor: { show: false },
      title: { show: false },
      detail: {
        valueAnimation: true,
        offsetCenter: [0, -10],
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        formatter: '{value}%'
      },
      data: [{ value: 82.5 }]
    }]
  })
}

// 响应式调整
const handleResize = () => {
  ecoChart?.resize()
  diversityChart?.resize()
  growthChart?.resize()
  climateChart?.resize()
}

// 文本测量优化（使用 Pretext）
const optimizeTextLayout = async () => {
  const hudLabels = document.querySelectorAll('.hud-label')
  hudLabels.forEach(async (label) => {
    const text = label.textContent || ''
    const prepared = await prepare(text, FONT)
    const { width } = layout(prepared, 1000, 20)
    // 可以根据计算的宽度进行布局优化
  })
}

onMounted(async () => {
  updateTime()
  setInterval(updateTime, 1000)
  
  initCharts()
  window.addEventListener('resize', handleResize)
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.addEventListener('MSFullscreenChange', handleFullscreenChange)
  
  // 检查是否需要自动全屏
  checkAutoFullscreen()
  
  // 优化文本布局
  await optimizeTextLayout()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
  
  ecoChart?.dispose()
  diversityChart?.dispose()
  growthChart?.dispose()
  climateChart?.dispose()
})
</script>

<template>
  <div class="w-full h-screen bg-dark-bg-200 overflow-hidden">
    <div class="container">
      <header>
        <div class="title-group">
          <h1>时茗园 · 生态守护全景</h1>
        </div>
        <div class="status-group">
          <div class="flex items-center gap-1.5">
            <Thermometer class="w-4 h-4" />
            <span>温度: <span style="color: var(--eco-green)">22°C</span></span>
          </div>
          <div class="flex items-center gap-1.5">
            <Droplets class="w-4 h-4" />
            <span>湿度: <span style="color: var(--eco-green)">65%</span></span>
          </div>
          <div class="flex items-center gap-1.5">
            <Cloud class="w-4 h-4" />
            <span>天气: <span style="color: var(--earth-gold)">晴转多云</span></span>
          </div>
          <div class="flex items-center gap-1.5">
            <Clock class="w-4 h-4" />
            <span id="datetime">{{ currentTime }}</span>
          </div>
          <button 
            @click="toggleFullscreen" 
            class="p-2 rounded-full hover:bg-white/10 transition-colors"
            :title="isFullscreen ? '退出全屏' : '进入全屏'"
          >
            <Fullscreen v-if="!isFullscreen" class="w-5 h-5" />
            <Minimize2 v-else class="w-5 h-5" />
          </button>
        </div>
      </header>

      <!-- Left: Ecological Galaxy -->
      <aside class="panel">
        <div class="panel-title">
          <div class="flex items-center gap-2">
            <Shield class="w-5 h-5" />
            生态健康指数
          </div>
          <span>实时评分: 94.5</span>
        </div>
        <img src="/biv2/a_high_fidelity_3d_holographic_model_of_a_lush_green_mountain_landscape_with.png" alt="Eco Mountain" class="panel-img">
        <div id="ecoChart" class="chart-container"></div>
        <div class="panel-title">
          <div class="flex items-center gap-2">
            <Flower2 class="w-5 h-5" />
            生物多样性丰度
          </div>
        </div>
        <div style="font-size: 0.85rem; color: #aaa;">
          <p><span class="tag">声纹识别</span> 检测到珍稀鸟类: 3种</p>
          <p style="margin-top: 5px;"><span class="tag">影像追踪</span> 活跃物种: 42种</p>
        </div>
        <div id="diversityChart" class="chart-container"></div>
      </aside>

      <!-- Center: Holographic Sand Table -->
      <main class="center-stage">
        <div class="hologram-container">
          <!-- Floating HUD Indicators -->
          <div class="hud-card top-left">
            <span class="hud-label">Carbon Sequestration</span>
            <span class="hud-value">124.5 t</span>
          </div>
          <div class="hud-card top-right">
            <span class="hud-label">Water Cycle</span>
            <span class="hud-value">98.2 %</span>
          </div>
          <div class="hud-card bottom-left">
            <span class="hud-label">Zero Carbon Progress</span>
            <span class="hud-value">85.0 %</span>
          </div>
          <div class="hud-card bottom-right">
            <span class="hud-label">Community Value</span>
            <span class="hud-value">320 万</span>
          </div>

          <img src="/biv2/a_high_fidelity_3d_digital_twin_of_a_lush_green_tea_garden_landscape_isolated.png" alt="Tea Garden Digital Twin" class="hologram-img">
          <div class="hologram-base"></div>
        </div>
      </main>

      <!-- Right: AI Wisdom Flow -->
      <aside class="panel">
        <div class="panel-title">
          <div class="flex items-center gap-2">
            <TrendingUp class="w-5 h-5" />
            智慧生长图谱
          </div>
          <span>AI 决策建议</span>
        </div>
        <img src="/biv2/tea_garden_hologram.png" alt="Original Model" class="panel-img">
        <div id="growthChart" class="chart-container"></div>
        <div class="panel-title">
          <div class="flex items-center gap-2">
            <Sun class="w-5 h-5" />
            微气候平衡度
          </div>
        </div>
        <div id="climateChart" class="chart-container"></div>
        <div class="panel-title">
          <div class="flex items-center gap-2">
            <AlertTriangle class="w-5 h-5" />
            AI 预警中枢
          </div>
        </div>
        <div style="background: rgba(255, 77, 79, 0.1); border: 1px solid rgba(255, 77, 79, 0.3); padding: 10px; border-radius: 8px; font-size: 0.85rem;">
          <p style="color: #ff4d4f;">● 局部湿度异常 (提前量: 45min)</p>
          <p style="color: #aaa; font-size: 0.75rem;">建议: 开启 3 号区自动化排灌系统</p>
        </div>
      </aside>

      <!-- Bottom Value Ring -->
      <div class="footer-ring">
        <div class="value-card">
          <div class="value-icon">
            <Shield class="w-6 h-6" />
          </div>
          <div class="value-info">
            <h4>生态健康指数</h4>
            <div class="number">94.5</div>
          </div>
        </div>
        <div class="value-card">
          <div class="value-icon">
            <Flower2 class="w-6 h-6" />
          </div>
          <div class="value-info">
            <h4>生物多样性</h4>
            <div class="number">42 种</div>
          </div>
        </div>
        <div class="value-card">
          <div class="value-icon">
            <Sun class="w-6 h-6" />
          </div>
          <div class="value-info">
            <h4>微气候平衡</h4>
            <div class="number">82.5%</div>
          </div>
        </div>
        <div class="value-card">
          <div class="value-icon">
            <Users class="w-6 h-6" />
          </div>
          <div class="value-info">
            <h4>社区价值</h4>
            <div class="number">320 万</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:root {
  --eco-green: #00ff88;
  --tech-blue: #00d4ff;
  --earth-gold: #ffcc33;
  --bg-dark: #0a1118;
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: var(--bg-dark);
  color: #fff;
  font-family: 'Noto Sans SC', sans-serif;
  overflow: hidden;
  background-image: 
    radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.1) 0%, transparent 80%),
    radial-gradient(circle at 20% 80%, rgba(0, 255, 136, 0.05) 0%, transparent 50%);
}

.container {
  display: grid;
  grid-template-columns: 400px 1fr 400px;
  grid-template-rows: 100px 1fr 120px;
  height: 100vh;
  padding: 20px;
  gap: 20px;
}

/* Header */
header {
  grid-column: 1 / 4;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent);
  padding: 0 40px;
  border-bottom: 1px solid var(--glass-border);
}

.title-group h1 {
  font-family: 'Orbitron', sans-serif;
  font-size: 2.5rem;
  letter-spacing: 4px;
  background: linear-gradient(45deg, var(--eco-green), var(--tech-blue));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
}

.status-group {
  display: flex;
  gap: 30px;
  font-size: 0.9rem;
  color: var(--tech-blue);
  align-items: center;
}

/* Sidebar Panels */
.panel {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: 15px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  animation: fadeIn 1s ease-out;
}

.panel-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--earth-gold);
  border-left: 4px solid var(--eco-green);
  padding-left: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-title span {
  font-size: 0.8rem;
  color: var(--tech-blue);
  font-weight: normal;
}

/* Center Content */
.center-stage {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hologram-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1200px;
  transform-style: preserve-3d;
}

.hologram-img {
  max-width: 90%;
  max-height: 90%;
  filter: drop-shadow(0 0 30px rgba(0, 212, 255, 0.5));
  animation: float 6s ease-in-out infinite;
}

.panel-img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid var(--glass-border);
  margin: 10px 0;
  filter: brightness(0.8) contrast(1.2);
  transition: all 0.3s;
}

.panel-img:hover {
  filter: brightness(1);
  transform: scale(1.02);
  border-color: var(--tech-blue);
}

.hologram-base {
  position: absolute;
  bottom: 10%;
  width: 60%;
  height: 20px;
  background: radial-gradient(ellipse at center, rgba(0, 255, 136, 0.4) 0%, transparent 70%);
  transform: rotateX(60deg);
}

/* HUD Floating Indicators */
.hud-card {
  position: absolute;
  background: rgba(0, 255, 136, 0.08);
  border: 1px solid rgba(0, 255, 136, 0.4);
  padding: 12px 18px;
  border-radius: 4px;
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 160px;
  pointer-events: none;
  mix-blend-mode: screen;
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.1);
  transition: all 0.5s ease;
}

/* 3D 空间定位与旋转 */
.hud-card.top-left { 
  top: 15%; left: 8%; 
  transform: translateZ(50px) rotateY(20deg) rotateX(10deg);
  animation: hudFloatLeft 5s infinite ease-in-out;
}
.hud-card.top-right { 
  top: 15%; right: 8%; text-align: right; 
  transform: translateZ(50px) rotateY(-20deg) rotateX(10deg);
  animation: hudFloatRight 5s infinite ease-in-out;
}
.hud-card.bottom-left { 
  bottom: 25%; left: 10%; 
  transform: translateZ(80px) rotateY(15deg) rotateX(-5deg);
  animation: hudFloatLeft 6s infinite ease-in-out -1s;
}
.hud-card.bottom-right { 
  bottom: 25%; right: 10%; text-align: right; 
  transform: translateZ(80px) rotateY(-15deg) rotateX(-5deg);
  animation: hudFloatRight 6s infinite ease-in-out -1s;
}

.hud-card::before {
  content: '';
  position: absolute;
  width: 40px;
  height: 1px;
  background: linear-gradient(to right, var(--eco-green), transparent);
  opacity: 0.6;
}

.hud-card.top-left::before { bottom: -25px; right: -30px; transform: rotate(45deg); }
.hud-card.top-right::before { bottom: -25px; left: -30px; transform: rotate(-45deg); background: linear-gradient(to left, var(--eco-green), transparent); }
.hud-card.bottom-left::before { top: -25px; right: -30px; transform: rotate(-45deg); }
.hud-card.bottom-right::before { top: -25px; left: -30px; transform: rotate(45deg); background: linear-gradient(to left, var(--eco-green), transparent); }

.hud-label {
  font-size: 0.75rem;
  color: var(--tech-blue);
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: bold;
}

.hud-value {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.4rem;
  color: #fff;
  text-shadow: 0 0 15px var(--eco-green);
}

@keyframes hudFloatLeft {
  0%, 100% { transform: translateZ(50px) rotateY(20deg) rotateX(10deg) translateY(0); }
  50% { transform: translateZ(80px) rotateY(22deg) rotateX(12deg) translateY(-10px); }
}

@keyframes hudFloatRight {
  0%, 100% { transform: translateZ(50px) rotateY(-20deg) rotateX(10deg) translateY(0); }
  50% { transform: translateZ(80px) rotateY(-22deg) rotateX(12deg) translateY(-10px); }
}

/* Bottom Value Ring */
.footer-ring {
  grid-column: 1 / 4;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.value-card {
  background: var(--glass-bg);
  backdrop-filter: blur(5px);
  border-radius: 10px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 20px;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
}

.value-card:hover {
  border-bottom-color: var(--eco-green);
  background: rgba(255, 255, 255, 0.1);
}

.value-icon {
  width: 50px;
  height: 50px;
  background: rgba(0, 255, 136, 0.1);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  color: var(--eco-green);
}

.value-info h4 {
  font-size: 0.9rem;
  color: #ccc;
}

.value-info .number {
  font-size: 1.5rem;
  font-weight: 700;
  font-family: 'Orbitron', sans-serif;
  color: #fff;
}

/* Charts */
.chart-container {
  flex: 1;
  min-height: 200px;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Responsive Tags */
.tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  background: rgba(0, 212, 255, 0.2);
  color: var(--tech-blue);
  margin-right: 5px;
}

/* 大屏优化 */
@media screen and (min-width: 1920px) {
  .container {
    grid-template-columns: 500px 1fr 500px;
    padding: 30px;
    gap: 30px;
  }
  
  .title-group h1 {
    font-size: 3rem;
  }
  
  .panel {
    padding: 25px;
  }
  
  .panel-title {
    font-size: 1.4rem;
  }
  
  .hud-card {
    min-width: 200px;
    padding: 15px 20px;
  }
  
  .hud-value {
    font-size: 1.8rem;
  }
  
  .value-card {
    padding: 20px;
  }
  
  .value-info .number {
    font-size: 1.8rem;
  }
}
</style>
