<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'

// ===== 计时器状态 =====
const timerRunning = ref(false)
const timerElapsed = ref(0) // 已累计毫秒（暂停时定格）
const timerStartAt = ref(0) // 本次开始计时的时间戳
let timerTimer: number | null = null

const timerText = computed(() => {
    const totalSec = Math.floor(timerElapsed.value / 1000)
    const h = Math.floor(totalSec / 3600)
    const m = Math.floor((totalSec % 3600) / 60)
    const s = totalSec % 60
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${pad(h)}:${pad(m)}:${pad(s)}`
})

function startTimer() {
    if (timerRunning.value) return
    timerRunning.value = true
    timerStartAt.value = Date.now()
    timerTimer = window.setInterval(() => {
        timerElapsed.value += Date.now() - timerStartAt.value
        timerStartAt.value = Date.now()
    }, 250)
}

function pauseTimer() {
    if (!timerRunning.value) return
    timerRunning.value = false
    if (timerTimer !== null) {
        window.clearInterval(timerTimer)
        timerTimer = null
    }
    timerElapsed.value += Date.now() - timerStartAt.value
}

function toggleTimer() {
    timerRunning.value ? pauseTimer() : startTimer()
}

function resetTimer() {
    pauseTimer()
    timerElapsed.value = 0
    timerStartAt.value = 0
}

onBeforeUnmount(() => {
    if (timerTimer !== null) window.clearInterval(timerTimer)
})
</script>

<template>
    <n-popover trigger="hover" placement="bottom" :show-arrow="true">
        <template #trigger>
            <n-button quaternary :circle="!timerRunning" :title="'计时器 ' + timerText" class="timer-trigger"
                :class="{ running: timerRunning }">
                <template #icon>
                    <span class="timer-icon" :class="{ 'timer-text': timerRunning }">{{ timerRunning ? timerText : '⏱️'
                        }}</span>
                </template>
            </n-button>
        </template>
        <div class="timer-card">
            <div class="timer-time" :class="{ running: timerRunning }">{{ timerText }}</div>
            <div class="timer-actions">
                <n-button size="small" :type="timerRunning ? 'warning' : 'primary'" @click.stop="toggleTimer">
                    {{ timerRunning ? '暂停' : '开始' }}
                </n-button>
                <n-button size="small" quaternary @click.stop="resetTimer">归零</n-button>
            </div>
        </div>
    </n-popover>
</template>

<style scoped>
.timer-icon {
    font-size: 1.125rem;
    line-height: 1;
}

.timer-icon.timer-text {
    font-size: 0.8125rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.5px;
    white-space: nowrap;
    color: #18a058;
}

.timer-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 4px;
}

.timer-time {
    font-size: 1.375rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.5px;
    white-space: nowrap;
    color: inherit;
}

.timer-time.running {
    color: #18a058;
}

.timer-actions {
    display: flex;
    gap: 8px;
}
</style>
