<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Calendar, Clock, MapPin } from 'lucide-vue-next'

const currentDate = ref('')
const currentTime = ref('')

const updateDateTime = () => {
  const now = new Date()
  currentDate.value = now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' })
  currentTime.value = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

const openMap = () => {
  const mapUrl = 'https://map.baidu.com/search/%E6%97%A0%E9%94%A1%E6%97%B6%E8%8C%97%E5%9B%AD/@13368929.802159993,3665294.032109811,19.25z/maptype%3DB_EARTH_MAP?querytype=s&da_src=shareurl&wd=%E6%97%A0%E9%94%A1%E6%97%B6%E8%8C%97%E5%9B%AD&c=140&src=0&pn=0&sug=0&l=13&b=(12614284,2531229;12663436,2553469)&from=webmap&biz_forward=%7B%22scaler%22:2,%22styles%22:%22pl%22%7D&device_ratio=2'
  window.open(mapUrl, '_blank')
}

let timer: number

onMounted(() => {
  updateDateTime()
  timer = window.setInterval(updateDateTime, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <div class="glass-panel rounded-xl p-4 flex items-center justify-end gap-6">
    <div class="flex items-center gap-2">
      <Calendar class="w-5 h-5 text-gray-400" />
      <span class="text-gray-300 font-medium">{{ currentDate }}</span>
    </div>
    
    <div class="flex items-center gap-2">
      <Clock class="w-5 h-5 text-eco-green-400 animate-pulse" />
      <span class="text-eco-green-400 font-mono text-lg">{{ currentTime }}</span>
    </div>
    
    <div class="flex items-center gap-2 text-smart-blue-400 cursor-pointer hover:text-smart-blue-300 transition-colors" @click="openMap">
      <MapPin class="w-4 h-4" />
      <span class="text-sm">无锡市时茗园</span>
    </div>
  </div>
</template>
