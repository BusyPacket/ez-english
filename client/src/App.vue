<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { darkTheme, type GlobalThemeOverrides } from 'naive-ui'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'

const themeStore = useThemeStore()
const theme = computed(() => (themeStore.isDark ? darkTheme : null))
const userStore = useUserStore()

/**
 * Naive UI 组件字号：跟随全局唯一基准 --base-font-size（定义于 styles.css）。
 * 修改 styles.css 的 --base-font-size 并刷新页面，全站所有字号（页面 rem + Naive UI 组件）按比例缩放。
 * 正文比例取 Naive UI 默认的 14/16。
 */
const themeOverrides = computed<GlobalThemeOverrides>(() => {
  const base =
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--base-font-size'),
    ) || 16
  const fs = Math.round(base * 0.875) // 正文 = 基准的 14/16
  return {
    common: { fontSize: `${fs}px` },
    Button: {
      fontSizeTiny: `${Math.round(fs * 0.85)}px`,
      fontSizeSmall: `${Math.round(fs * 0.9)}px`,
      fontSizeMedium: `${fs}px`,
      fontSizeLarge: `${Math.round(fs * 1.1)}px`,
    },
    Typography: {
      headerFontSize1: `${Math.round(fs * 2.14)}px`, // h1
      headerFontSize2: `${Math.round(fs * 1.57)}px`, // h2
      headerFontSize3: `${Math.round(fs * 1.29)}px`, // h3
      headerFontSize4: `${Math.round(fs * 1.14)}px`, // h4
      headerFontSize5: `${fs}px`,
      headerFontSize6: `${Math.round(fs * 0.86)}px`,
    },
  }
})

// 恢复登录态后刷新 AI 可用状态（已配置 API Key 且有效才为 true）
onMounted(() => {
  if (userStore.isLoggedIn) {
    void userStore.refreshAiAvailable()
  }
})
</script>

<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <n-global-style />
    <n-message-provider>
      <AppNavbar />
      <n-layout class="content">
        <router-view />
      </n-layout>
    </n-message-provider>
  </n-config-provider>
</template>

<style>
/* 全局样式（基准字号 --base-font-size）见 styles.css */
</style>
