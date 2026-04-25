<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
// import { Monitor, MessageSquare } from 'lucide-vue-next'
import PretextBIDashboard from './components/PretextBIDashboard.vue'
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
  <div class="w-full h-screen bg-dark-bg-200 overflow-hidden flex flex-col">
    <!-- Overlay Navigation (Minimal) -->
    <!-- <nav class="fixed top-6 right-6 z-50 flex gap-2 bg-black/40 backdrop-blur-xl p-1 rounded-xl border border-white/10">
      <button
        @click="currentPage = 'dashboard'"
        :class="['p-2 rounded-lg transition-all',
          currentPage === 'dashboard' ? 'bg-white/20 text-white' : 'text-gray-500 hover:text-white'
        ]"
        title="大屏视图"
      >
        <Monitor class="w-5 h-5" />
      </button>
      <button
        @click="currentPage = 'pretext'"
        :class="['p-2 rounded-lg transition-all',
          currentPage === 'pretext' ? 'bg-white/20 text-white' : 'text-gray-500 hover:text-white'
        ]"
        title="技术演示"
      >
        <MessageSquare class="w-5 h-5" />
      </button>
    </nav> -->

    <main class="flex-1 relative overflow-hidden">
      <Transition name="fade" mode="out-in">
        <div v-if="currentPage === 'dashboard'" class="w-full h-full">
          <PretextBIDashboard />
        </div>
        <div v-else class="w-full h-full p-8">
          <PretextOptimizedBubbles />
        </div>
      </Transition>
    </main>

    <!-- Global Info Bar (Bottom Right) -->
    <div class="fixed bottom-4 right-6 z-50 flex items-center gap-4 text-[10px] text-gray-500 font-mono pointer-events-none">
      <span>SERVER_DELAY: {{ serverDelay }}ms</span>
      <span>SYSTEM_V1.0.0</span>
      <span>UPDATED: {{ updateTime }}</span>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&family=Orbitron:wght@400;700&display=swap');

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Ensure font is available globally for Pretext */

body {
  margin: 0;
  padding: 0;
  background: #020617;
  font-family: "Noto Sans SC", sans-serif;
}
</style>
