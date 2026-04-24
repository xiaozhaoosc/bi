<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { prepare, layoutWithLines, prepareWithSegments } from '@chenglou/pretext'

interface Segment {
  text: string
  font: string
  color?: string
}

const props = defineProps<{
  text?: string
  segments?: Segment[]
  maxWidth?: number
  lineHeight?: number
  baseFont?: string
  align?: 'left' | 'center' | 'right'
}>()

const containerRef = ref<HTMLDivElement | null>(null)
const renderedLines = ref<any[]>([])

const FONT_DEFAULT = '14px "Noto Sans SC", sans-serif'

const doLayout = async () => {
  if (props.segments) {
    const prepared = prepareWithSegments(
      props.segments.map(s => s.text).join(''),
      props.baseFont || FONT_DEFAULT
    ) as any
    const { lines } = layoutWithLines(prepared, props.maxWidth || 1000, props.lineHeight || 1.5)
    renderedLines.value = lines
  } else if (props.text) {
    const prepared = prepare(props.text, props.baseFont || FONT_DEFAULT) as any
    const { lines } = layoutWithLines(prepared, props.maxWidth || 1000, props.lineHeight || 1.5)
    renderedLines.value = lines
  }
}

watch([() => props.text, () => props.segments, () => props.maxWidth], doLayout)

onMounted(() => {
  // 确保字体加载后再测量
  if (document.fonts) {
    document.fonts.ready.then(doLayout)
  } else {
    setTimeout(doLayout, 500)
  }
})
</script>

<template>
  <div ref="containerRef" class="pretext-container" :style="{ textAlign: align || 'left' }">
    <div v-for="(line, lIdx) in renderedLines" :key="lIdx" class="pretext-line flex items-baseline" :class="{
      'justify-center': align === 'center',
      'justify-end': align === 'right'
    }">
      <span 
        v-for="(glyph, gIdx) in (line as any).glyphs || []" 
        :key="gIdx" 
        class="pretext-glyph inline-block"
        :style="{
          width: glyph.width + 'px',
          font: glyph.font,
          color: (glyph as any).segmentIndex !== undefined ? (segments?.[(glyph as any).segmentIndex]?.color || 'inherit') : 'inherit'
        }"
      >
        {{ glyph.char }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.pretext-container {
  user-select: none;
  pointer-events: none;
  white-space: nowrap;
}
.pretext-line {
  min-height: 1em;
}
.pretext-glyph {
  line-height: 1;
}
</style>
