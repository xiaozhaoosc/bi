<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Leaf, MessageSquare, Monitor } from 'lucide-vue-next'
import EnvironmentPanel from './components/EnvironmentPanel.vue'
import EcoHealthSphere from './components/EcoHealthSphere.vue'
import BiodiversityStars from './components/BiodiversityStars.vue'
import GrowthRhythmChart from './components/GrowthRhythmChart.vue'
import MicroClimateChart from './components/MicroClimateChart.vue'
import SensorDensityChart from './components/SensorDensityChart.vue'
import WarningChart from './components/WarningChart.vue'
import CommunityValueChart from './components/CommunityValueChart.vue'
import WaterCycleChart from './components/WaterCycleChart.vue'
import PretextOptimizedBubbles from './components/PretextOptimizedBubbles.vue'

const currentPage = ref<'dashboard' | 'pretext'>('dashboard')
const updateTime = ref('')
const serverDelay = ref(12)

const updateGlobalData = () => {
  updateTime.value = new Date().toLocaleString('zh-CN')
  serverDelay.value = Math.floor(8 + Math.random() * 8)
}

let globalTimer: number

onMounted(() => {
  updateGlobalData()
  globalTimer = window.setInterval(updateGlobalData, 3000)
})

onUnmounted(() => {
  clearInterval(globalTimer)
})
</script>

<template>
  <div class="w-full h-screen bg-dark-bg-200 p-2 overflow-hidden flex flex-col">
    <header class="h-[70px] mb-1.5 flex-shrink-0">
      <div class="h-full glass-panel rounded-xl p-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-eco-green-500 to-smart-blue-600 flex items-center justify-center animate-pulse-glow">
            <Leaf class="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 class="text-xl font-bold flex items-center gap-2">
              <span class="text-eco-green-400">时茗园</span>
              <span class="text-smart-blue-400">茶园</span>
              <span class="text-earth-gold-400">智慧生态大屏</span>
            </h1>
          </div>
        </div>
        
        <div class="flex items-center gap-4">
          <div class="flex bg-gray-800/50 rounded-lg p-1">
            <button
              @click="currentPage = 'dashboard'"
              :class="['flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all',
                currentPage === 'dashboard'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              ]"
            >
              <Monitor class="w-4 h-4" />
              大屏视图
            </button>
            <button
              @click="currentPage = 'pretext'"
              :class="['flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all',
                currentPage === 'pretext'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              ]"
            >
              <MessageSquare class="w-4 h-4" />
              Pretext 示例
            </button>
          </div>
          <EnvironmentPanel />
        </div>
      </div>
    </header>

    <main class="flex-1 flex flex-col gap-1.5 overflow-hidden">
      <template v-if="currentPage === 'dashboard'">
        <div class="flex-1 grid grid-cols-12 gap-1.5 min-h-0">
          <div class="col-span-3 h-full min-h-0">
            <EcoHealthSphere />
          </div>
          <div class="col-span-3 h-full min-h-0">
            <BiodiversityStars />
          </div>
          <div class="col-span-3 h-full min-h-0">
            <GrowthRhythmChart />
          </div>
          <div class="col-span-3 h-full min-h-0">
            <MicroClimateChart />
          </div>
        </div>
        <div class="flex-1 grid grid-cols-12 gap-1.5 min-h-0">
          <div class="col-span-3 h-full min-h-0">
            <SensorDensityChart />
          </div>
          <div class="col-span-3 h-full min-h-0">
            <WarningChart />
          </div>
          <div class="col-span-3 h-full min-h-0">
            <CommunityValueChart />
          </div>
          <div class="col-span-3 h-full min-h-0">
            <WaterCycleChart />
          </div>
        </div>
      </template>
      
      <template v-else-if="currentPage === 'pretext'">
        <div class="flex-1 min-h-0">
          <PretextOptimizedBubbles />
        </div>
      </template>
    </main>

    <footer class="h-[55px] flex-shrink-0 mt-1.5">
      <div class="h-full glass-panel rounded-xl p-3">
        <div class="h-full flex items-center justify-between text-sm text-gray-400">
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-2">
              <span class="w-1 h-1 rounded-full bg-eco-green-400 animate-pulse"></span>
              <span>数据更新时间:</span>
              <span class="text-eco-green-400 font-mono">{{ updateTime }}</span>
            </span>
            <span>系统版本: v1.0.0</span>
          </div>
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-eco-green-400 animate-pulse"></span>
              在线状态
            </span>
            <span>服务端延迟: <span class="text-smart-blue-400 font-mono">{{ serverDelay }}ms</span></span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
