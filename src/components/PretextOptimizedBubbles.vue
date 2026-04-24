<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { prepareWithSegments, walkLineRanges, layoutWithLines } from '@chenglou/pretext'

interface Bubble {
  id: number
  text: string
  isUser: boolean
  cssWidth: number | null
  pretextWidth: number | null
}

const FONT_SIZE = '14px "Noto Sans SC", sans-serif'
const MAX_WIDTH = 400
const LINE_HEIGHT = 20
const PADDING_HORIZONTAL = 16

const bubbles = ref<Bubble[]>([
  { id: 1, text: '嘿，你看到新的 Pretext 库了吗？', isUser: true, cssWidth: null, pretextWidth: null },
  { id: 2, text: '看到了！它不需要 DOM 就能测量文本，纯 JavaScript 算力。', isUser: false, cssWidth: null, pretextWidth: null },
  { id: 3, text: '那个收缩包装（Shrinkwrap）演示太强了，它能找到多行文本的精确最小宽度。CSS 做不到这一点。', isUser: true, cssWidth: null, pretextWidth: null },
  { id: 4, text: '是的，性能优化做得非常到位 🎉', isUser: false, cssWidth: null, pretextWidth: null },
  { id: 5, text: '哇，它对中文、韩文和表情符号的支持也这么好？', isUser: true, cssWidth: null, pretextWidth: null },
  { id: 6, text: '全支持！混合双向文本、字符簇，随心所欲。试试调整窗口大小。', isUser: false, cssWidth: null, pretextWidth: null },
  { id: 7, text: '最棒的是：零布局重排。即使你对 10,000 个气泡进行宽度计算，浏览器也不会卡顿。', isUser: true, cssWidth: null, pretextWidth: null }
])

const calculateWidths = () => {
  bubbles.value.forEach(bubble => {
    const prepared = prepareWithSegments(bubble.text, FONT_SIZE)
    
    let maxLineWidth = 0
    walkLineRanges(prepared, MAX_WIDTH, line => {
      if (line.width > maxLineWidth) maxLineWidth = line.width
    })
    
    const { lines } = layoutWithLines(prepared, MAX_WIDTH, LINE_HEIGHT)
    const actualCssWidth = Math.min(Math.max(...lines.map(l => l.width)), MAX_WIDTH)
    
    bubble.cssWidth = actualCssWidth + PADDING_HORIZONTAL * 2
    bubble.pretextWidth = maxLineWidth + PADDING_HORIZONTAL * 2
  })
}

onMounted(() => {
  calculateWidths()
})
</script>

<template>
  <div class="w-full h-full p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl overflow-y-auto">
    <div class="max-w-5xl mx-auto">
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          Pretext 优化气泡展示
        </h2>
        <p class="text-gray-400 text-sm">对比 CSS fit-content 与 Pretext 精确文本测量的效果</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="text-center mb-2">
            <h3 class="text-lg font-semibold text-amber-400">CSS fit-content</h3>
            <p class="text-gray-500 text-xs">使用 width: fit-content，存在空白区域</p>
          </div>
          <div class="space-y-3">
            <div v-for="bubble in bubbles" :key="`css-${bubble.id}`" class="flex" :class="bubble.isUser ? 'justify-end' : 'justify-start'">
              <div class="relative">
                <div
                  :class="['px-4 py-2 rounded-2xl max-w-[400px]',
                    bubble.isUser ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-br-sm' : 'bg-gray-700 text-gray-100 rounded-bl-sm'
                  ]"
                  style="width: fit-content;"
                >
                  <p class="text-sm leading-5">{{ bubble.text }}</p>
                </div>
                <div v-if="bubble.cssWidth" class="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
                  宽度: {{ bubble.cssWidth }}px
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div class="text-center mb-2">
            <h3 class="text-lg font-semibold text-emerald-400">Pretext Shrinkwrap</h3>
            <p class="text-gray-500 text-xs">精确测量文本宽度，无多余空白</p>
          </div>
          <div class="space-y-3">
            <div v-for="bubble in bubbles" :key="`pretext-${bubble.id}`" class="flex" :class="bubble.isUser ? 'justify-end' : 'justify-start'">
              <div class="relative">
                <div
                  :class="['px-4 py-2 rounded-2xl',
                    bubble.isUser ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white rounded-br-sm' : 'bg-gray-700 text-gray-100 rounded-bl-sm'
                  ]"
                  :style="bubble.pretextWidth ? { width: `${bubble.pretextWidth}px` } : {}"
                >
                  <p class="text-sm leading-5">{{ bubble.text }}</p>
                </div>
                <div v-if="bubble.pretextWidth" class="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
                  宽度: {{ bubble.pretextWidth }}px
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-10 glass-panel rounded-xl p-6">
        <h3 class="text-lg font-semibold text-white mb-4">Pretext 优势说明</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div class="space-y-3">
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span class="text-emerald-400 text-xs">✓</span>
              </div>
              <div>
                <h4 class="text-gray-200 font-medium">零布局重排</h4>
                <p class="text-gray-500">不使用 DOM 测量，避免昂贵的布局重排操作</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span class="text-emerald-400 text-xs">✓</span>
              </div>
              <div>
                <h4 class="text-gray-200 font-medium">精确测量</h4>
                <p class="text-gray-500">计算最紧凑的文本宽度，消除空白区域</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span class="text-emerald-400 text-xs">✓</span>
              </div>
              <div>
                <h4 class="text-gray-200 font-medium">多语言支持</h4>
                <p class="text-gray-500">支持 CJK、emoji、双向文本和各种文字系统</p>
              </div>
            </div>
          </div>
          <div class="space-y-3">
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span class="text-cyan-400 text-xs">⚡</span>
              </div>
              <div>
                <h4 class="text-gray-200 font-medium">高性能</h4>
                <p class="text-gray-500">layout() 仅需 0.0002ms，比 DOM 测量快 300-600 倍</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span class="text-cyan-400 text-xs">🎯</span>
              </div>
              <div>
                <h4 class="text-gray-200 font-medium">信息密度</h4>
                <p class="text-gray-500">提高 UI 空间利用率，显示更多内容</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span class="text-cyan-400 text-xs">🔄</span>
              </div>
              <div>
                <h4 class="text-gray-200 font-medium">缓存优化</h4>
                <p class="text-gray-500">prepare() 结果可缓存，重复布局计算极快</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
