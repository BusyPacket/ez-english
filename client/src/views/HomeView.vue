<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'

const router = useRouter()
const themeStore = useThemeStore()

// —— 副标题打字机 ——
const SUBTITLE = '借助 AI，让学习英语变得简单。'
const typed = ref('')
const typingDone = ref(false)
let typeTimer: ReturnType<typeof setInterval> | null = null

// —— 粒子网络背景 ——
const canvasRef = ref<HTMLCanvasElement | null>(null)
let rafId = 0
let particles: { x: number; y: number; vx: number; vy: number; r: number }[] = []
const mouse = { x: -9999, y: -9999 }

/** 粒子配色：随主题切换（亮色用蓝紫、暗色用亮蓝） */
function palette() {
  return themeStore.isDark
    ? { dot: '139, 170, 255', line: '139, 170, 255' }
    : { dot: '92, 124, 255', line: '92, 124, 255' }
}

function initParticles() {
  const canvas = canvasRef.value
  if (!canvas) return
  const count = Math.min(70, Math.floor((canvas.width * canvas.height) / 16000))
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    r: Math.random() * 1.8 + 0.8,
  }))
}

function resizeCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  initParticles()
}

function draw() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const { dot, line } = palette()
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (const p of particles) {
    p.x += p.vx
    p.y += p.vy
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1
  }

  for (let i = 0; i < particles.length; i++) {
    const a = particles[i]!
    ctx.beginPath()
    ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${dot}, 0.55)`
    ctx.fill()

    // 粒子间连线
    for (let j = i + 1; j < particles.length; j++) {
      const b = particles[j]!
      const dist = Math.hypot(a.x - b.x, a.y - b.y)
      if (dist < 120) {
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = `rgba(${line}, ${0.18 * (1 - dist / 120)})`
        ctx.stroke()
      }
    }

    // 与鼠标连线
    const mdist = Math.hypot(a.x - mouse.x, a.y - mouse.y)
    if (mdist < 150) {
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(mouse.x, mouse.y)
      ctx.strokeStyle = `rgba(${dot}, ${0.4 * (1 - mdist / 150)})`
      ctx.stroke()
    }
  }
  rafId = requestAnimationFrame(draw)
}

function onMouseMove(e: MouseEvent) {
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  mouse.x = e.clientX - rect.left
  mouse.y = e.clientY - rect.top
}

function onMouseLeave() {
  mouse.x = -9999
  mouse.y = -9999
}

/** 浮动装饰字母：随机分布位置与大小，且彼此不重叠、避开优势卡片（每次进入首页重新随机） */
function randomizeFloatingLetters() {
  const homeEl = document.querySelector<HTMLElement>('.home')
  if (!homeEl) return
  const homeRect = homeEl.getBoundingClientRect()
  const W = homeEl.clientWidth
  const H = homeEl.clientHeight
  const GAP = 30 // 字母间最小间距（px）

  // 不可放置区域（相对 .home 的像素矩形）：优势卡片区，防止字母被卡片遮挡
  const blocks: { x: number; y: number; w: number; h: number }[] = []
  const advEl = document.querySelector<HTMLElement>('.advantages')
  if (advEl) {
    const r = advEl.getBoundingClientRect()
    blocks.push({ x: r.left - homeRect.left, y: r.top - homeRect.top, w: r.width, h: r.height })
  }

  const overlaps = (x: number, y: number, w: number, h: number) =>
    blocks.some(
      (b) => x < b.x + b.w + GAP && x + w + GAP > b.x && y < b.y + b.h + GAP && y + h + GAP > b.y,
    )

  document.querySelectorAll<HTMLElement>('.float-letter').forEach((el) => {
    const text = (el.textContent ?? '').trim()
    const words = text.split(/\s+/).length
    const fontSize = words > 1 ? 24 + Math.random() * 22 : 38 + Math.random() * 34
    // 粗略估算文本占用尺寸（用于碰撞检测）
    const w = text.length * fontSize * (words > 1 ? 0.55 : 0.65)
    const h = fontSize * 1.3

    let topPct = 0
    let leftPct = 0
    for (let attempt = 0; attempt < 60; attempt++) {
      leftPct = Math.random() * 84 + 4
      topPct = Math.random() * 82 + 4
      const x = (leftPct / 100) * W
      const y = (topPct / 100) * H
      if (overlaps(x, y, w, h)) continue
      // 找到一个不与卡片、不与已放置字母重叠的位置
      blocks.push({ x, y, w, h })
      break
    }
    el.style.fontSize = `${Math.round(fontSize)}px`
    el.style.top = `${topPct.toFixed(1)}%`
    el.style.left = `${leftPct.toFixed(1)}%`
  })
}

onMounted(() => {
  randomizeFloatingLetters()
  resizeCanvas()
  draw()
  window.addEventListener('resize', resizeCanvas)
  const canvas = canvasRef.value
  canvas?.addEventListener('mousemove', onMouseMove)
  canvas?.addEventListener('mouseleave', onMouseLeave)

  let i = 0
  typeTimer = setInterval(() => {
    i += 1
    typed.value = SUBTITLE.slice(0, i)
    if (i >= SUBTITLE.length && typeTimer) {
      clearInterval(typeTimer)
      typeTimer = null
      typingDone.value = true
    }
  }, 140)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('resize', resizeCanvas)
  if (typeTimer) clearInterval(typeTimer)
})
</script>

<template>
  <div class="home" :class="{ 'is-dark': themeStore.isDark }">
    <canvas ref="canvasRef" class="home-canvas" aria-hidden="true" />
    <div class="home-hero">
      <h1 class="gradient-title">浙江专升本英语学习站</h1>
      <p class="subtitle">{{ typed }}<span v-if="typingDone" class="cursor">|</span></p>
      <n-button class="start-btn" type="primary" size="large" @click="router.push('/progress')">
        开始学习
      </n-button>
      <div class="hero-glow" aria-hidden="true" />
    </div>

    <!-- 优势介绍 -->
    <section class="advantages">
      <h2 class="advantages-title">为什么选择我们</h2>
      <div class="adv-grid">
        <div class="adv-card">
          <div class="adv-icon" aria-hidden="true">💰</div>
          <h3 class="adv-name">学多少花多少，不学不花钱</h3>
          <p class="adv-desc">
            学一道题花一道题的钱，学 100 道题花 100 道题的钱——使用 AI 动态实时计费，不花冤枉钱。
            传统报班不管学没学都要先交钱，这里每一分钱都花在实际学习上。目前国产 AI 例如 DeepSeek
            比较便宜，还采用类似电费的峰谷计费
            <n-tooltip
              trigger="hover"
              :style="{ maxWidth: '280px', whiteSpace: 'normal', lineHeight: '1.6' }"
            >
              <template #trigger>
                <span class="tip-badge" aria-label="峰谷计费说明">?</span>
              </template>
              DeepSeek 采用类似电费的峰谷计费：空闲时段价格仅为高峰时段的一半。高峰时段为北京时间
              9:00-12:00、14:00-18:00，其余为空闲时段。
            </n-tooltip>
            。
          </p>
        </div>
        <div class="adv-card">
          <div class="adv-icon" aria-hidden="true">🎯</div>
          <h3 class="adv-name">沉浸式学习，一站式解决</h3>
          <p class="adv-desc">
            传统纸质学习想问 AI
            还得拍照问豆包，效率低下；拿起手机更容易切到其他乱七八糟的软件干扰学习。
            在这里随时提问、即时解答，专注不分心。
          </p>
        </div>
        <div class="adv-card">
          <div class="adv-icon" aria-hidden="true">🤖</div>
          <h3 class="adv-name">AI 英语正确率极高</h3>
          <p class="adv-desc">
            AI 的学名是 LLM（大语言模型），语言能力是它最基础的能力，正确率能达到
            99.9%。相比于高等数学， AI 非常适合作为英语学习的老师。
          </p>
        </div>
      </div>
    </section>

    <footer class="home-footer">
      作者：
      <a
        class="author-link"
        href="https://github.com/BusyPacket"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="author-icon" aria-hidden="true">
          <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
            <path
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"
            />
          </svg>
        </span>
        BusyPacket
      </a>
    </footer>
    <span class="float-letter l1" aria-hidden="true">level up</span>
    <span class="float-letter l2" aria-hidden="true">never give up</span>
    <span class="float-letter l3" aria-hidden="true">advanced</span>
    <span class="float-letter l4" aria-hidden="true">efficient</span>
    <span class="float-letter l5" aria-hidden="true">✦</span>
    <span class="float-letter l6" aria-hidden="true">?</span>
    <span class="float-letter l7" aria-hidden="true">proficient</span>
    <span class="float-letter l8" aria-hidden="true">sufficient</span>
  </div>
</template>

<style scoped>
.home {
  position: relative;
  /* 扣除导航栏高度，保证一屏放得下、无滚动条 */
  min-height: calc(100vh - var(--navbar-h));
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  padding: 0 16px;
}

/* —— 粒子画布 —— */
.home-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.home-hero {
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  text-align: center;
  padding: 11vh 24px 6vh;
}

/* —— 标题：渐变流动文字 —— */
.gradient-title {
  margin: 0;
  font-size: clamp(2rem, 5.5vw, 3.2rem);
  font-weight: 800;
  letter-spacing: 0.02em;
  background: linear-gradient(90deg, #4f6ef7, #8b5cf6, #06b6d4, #4f6ef7);
  background-size: 300% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: gradient-flow 6s linear infinite;
}

@keyframes gradient-flow {
  to {
    background-position: 300% 0;
  }
}

/* —— 副标题打字机 —— */
.subtitle {
  margin: 0;
  font-size: clamp(1rem, 2.4vw, 1.25rem);
  color: #6b7280;
  min-height: 1.6em;
}

.is-dark .subtitle {
  color: #9ca3c6;
}

.cursor {
  display: inline-block;
  margin-left: 2px;
  color: #4f6ef7;
  font-weight: 700;
  animation: blink 0.85s steps(1) infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

/* —— 按钮：hover 发光上浮 —— */
.start-btn {
  box-shadow: 0 8px 24px rgba(79, 110, 247, 0.35);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.start-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 34px rgba(79, 110, 247, 0.5);
}

/* —— hero 底部光晕脉动 —— */
.hero-glow {
  position: absolute;
  bottom: -90px;
  left: 50%;
  width: 340px;
  height: 170px;
  background: radial-gradient(closest-side, rgba(79, 110, 247, 0.3), transparent);
  filter: blur(20px);
  pointer-events: none;
  animation: glow-pulse 3.5s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%,
  100% {
    opacity: 0.6;
    transform: translateX(-50%) scale(1);
  }

  50% {
    opacity: 1;
    transform: translateX(-50%) scale(1.15);
  }
}

/* —— 入场动画（依次浮现） —— */
.home-hero > * {
  opacity: 0;
  animation: fade-in-up 0.8s ease forwards;
}

.home-hero > :nth-child(1) {
  animation-delay: 0.1s;
}

.home-hero > :nth-child(2) {
  animation-delay: 0.35s;
}

.home-hero > :nth-child(3) {
  animation-delay: 0.6s;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(26px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 优势区与页脚依次浮现 */
.advantages-title,
.adv-card,
.home-footer {
  opacity: 0;
  animation: fade-in-up 0.8s ease forwards;
}

.advantages-title {
  animation-delay: 0.7s;
}

.adv-card:nth-child(1) {
  animation-delay: 0.85s;
}

.adv-card:nth-child(2) {
  animation-delay: 1s;
}

.adv-card:nth-child(3) {
  animation-delay: 1.15s;
}

.home-footer {
  animation-delay: 1.3s;
}

/* —— 浮动装饰字母 —— */
.float-letter {
  position: absolute;
  z-index: 0;
  font-weight: 800;
  line-height: 1;
  color: rgba(92, 124, 255, 0.14);
  user-select: none;
  pointer-events: none;
  animation: floaty 8s ease-in-out infinite;
}

.is-dark .float-letter {
  color: rgba(139, 170, 255, 0.18);
}

.l1 {
  animation-delay: 0s;
}

.l2 {
  animation-delay: 1.2s;
}

.l3 {
  animation-delay: 2s;
}

.l4 {
  animation-delay: 0.6s;
}

.l5 {
  animation-delay: 2.6s;
}

.l6 {
  animation-delay: 1.8s;
}

.l7 {
  animation-delay: 0.9s;
}

.l8 {
  animation-delay: 2.2s;
}

@keyframes floaty {
  0%,
  100% {
    transform: translateY(0) rotate(-6deg);
  }

  50% {
    transform: translateY(-24px) rotate(8deg);
  }
}

/* —— 优势介绍 —— */
.advantages {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  padding: 8px 0 36px;
}

.advantages-title {
  margin: 0 0 26px;
  text-align: center;
  font-size: clamp(1.3rem, 3vw, 1.6rem);
  font-weight: 800;
  background: linear-gradient(90deg, #4f6ef7, #8b5cf6, #06b6d4);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.adv-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.adv-card {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(79, 110, 247, 0.16);
  border-radius: 16px;
  padding: 22px 20px;
  box-shadow: 0 8px 24px rgba(31, 45, 94, 0.08);
  backdrop-filter: blur(6px);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}

.adv-card:hover {
  transform: translateY(-6px);
  border-color: rgba(79, 110, 247, 0.45);
  box-shadow: 0 16px 36px rgba(79, 110, 247, 0.22);
}

.is-dark .adv-card {
  background: rgba(30, 34, 54, 0.6);
  border-color: rgba(139, 170, 255, 0.2);
}

.adv-icon {
  font-size: 2.3rem;
  line-height: 1;
  margin-bottom: 12px;
}

.adv-name {
  margin: 0 0 8px;
  font-size: 1.05rem;
  font-weight: 700;
}

.adv-desc {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.7;
  color: #6b7280;
}

.is-dark .adv-desc {
  color: #a5adc8;
}

/* 峰谷计费问号提示（颜色跟随文字） */
.tip-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin: 0 4px;
  border: 1px solid currentColor;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  color: inherit;
  background: transparent;
  cursor: help;
  vertical-align: 1px;
  transition:
    color 0.2s ease,
    border-color 0.2s ease;
}

.tip-badge:hover {
  color: #4f6ef7;
}

/* —— 网站作者 —— */
.home-footer {
  position: relative;
  z-index: 1;
  margin-top: auto;
  padding: 8px 16px 36px;
  text-align: center;
  font-size: 0.92rem;
  color: #8a93a6;
}

.author-link {
  color: #4f6ef7;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
}

.author-link:hover {
  color: #8b5cf6;
  text-decoration: underline;
}

.author-icon {
  display: inline-block;
  line-height: 0;
  margin-right: 5px;
  vertical-align: -3px;
}

/* 移动端：优势卡片单列 */
@media (max-width: 860px) {
  .adv-grid {
    grid-template-columns: 1fr;
  }
}

/* 尊重系统减弱动效偏好 */
@media (prefers-reduced-motion: reduce) {
  .gradient-title,
  .hero-glow,
  .float-letter,
  .home-hero > *,
  .advantages-title,
  .adv-card,
  .home-footer {
    animation: none !important;
  }

  .home-hero > *,
  .advantages-title,
  .adv-card,
  .home-footer {
    opacity: 1;
  }
}
</style>
