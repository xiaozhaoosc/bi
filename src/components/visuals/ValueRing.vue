<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  value: number // 0-100
  color: string
  size?: number
  strokeWidth?: number
}>()

const radius = computed(() => (props.size || 60) / 2 - (props.strokeWidth || 4))
const circumference = computed(() => radius.value * 2 * Math.PI)
const strokeDashoffset = computed(() => circumference.value - (props.value / 100) * circumference.value)
</script>

<template>
  <div class="relative flex items-center justify-center" :style="{ width: `${size || 60}px`, height: `${size || 60}px` }">
    <!-- Background Circle -->
    <svg class="transform -rotate-90 absolute inset-0 w-full h-full">
      <circle
        cx="50%"
        cy="50%"
        :r="radius"
        fill="transparent"
        :stroke="`${color}33`"
        :stroke-width="strokeWidth || 4"
      />
      <!-- Progress Circle -->
      <circle
        cx="50%"
        cy="50%"
        :r="radius"
        fill="transparent"
        :stroke="color"
        :stroke-width="strokeWidth || 4"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="strokeDashoffset"
        class="transition-all duration-1000 ease-out"
        :style="{ filter: `drop-shadow(0 0 4px ${color})` }"
      />
    </svg>
    <div class="relative z-10 flex items-center justify-center">
      <slot></slot>
    </div>
  </div>
</template>
