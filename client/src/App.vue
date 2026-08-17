<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { darkTheme } from 'naive-ui'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'

const themeStore = useThemeStore()
const theme = computed(() => (themeStore.isDark ? darkTheme : null))
const userStore = useUserStore()

// 恢复登录态后刷新 AI 可用状态（已配置 API Key 且有效才为 true）
onMounted(() => {
  if (userStore.isLoggedIn) {
    void userStore.refreshAiAvailable()
  }
})
</script>

<template>
  <n-config-provider :theme="theme">
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
body {
  margin: 0;
}
</style>
