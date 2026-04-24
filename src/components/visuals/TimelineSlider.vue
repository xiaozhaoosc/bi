<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  options: string[]
  modelValue: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'change', value: number): void
}>()

const select = (index: number) => {
  emit('update:modelValue', index)
  emit('change', index)
}
</script>

<template>
  <div class="relative w-full max-w-xl mx-auto py-4">
    <!-- Base Line -->
    <div class="absolute top-1/2 left-0 right-0 h-1 bg-white/10 rounded-full -translate-y-1/2"></div>
    
    <!-- Active Line -->
    <div 
      class="absolute top-1/2 left-0 h-1 bg-eco-green-500 rounded-full -translate-y-1/2 transition-all duration-500 shadow-[0_0_10px_#00ff88]"
      :style="{ width: `${(modelValue / (options.length - 1)) * 100}%` }"
    ></div>

    <div class="relative flex justify-between">
      <div 
        v-for="(option, index) in options" 
        :key="index"
        class="flex flex-col items-center gap-2 cursor-pointer group"
        @click="select(index)"
      >
        <!-- Node -->
        <div 
          class="w-4 h-4 rounded-full border-2 transition-all duration-300 relative z-10"
          :class="[
            modelValue >= index 
              ? 'bg-eco-green-500 border-eco-green-400 shadow-[0_0_15px_#00ff88]' 
              : 'bg-dark-bg-200 border-white/30 group-hover:border-eco-green-500/50'
          ]"
        >
          <!-- Pulse ring for active -->
          <div v-if="modelValue === index" class="absolute inset-[-4px] rounded-full border border-eco-green-500 animate-ping opacity-50"></div>
        </div>
        <!-- Label -->
        <span 
          class="text-xs font-mono tracking-widest transition-colors duration-300"
          :class="modelValue === index ? 'text-eco-green-400 font-bold' : 'text-gray-500 group-hover:text-gray-300'"
        >
          {{ option }}
        </span>
      </div>
    </div>
  </div>
</template>
