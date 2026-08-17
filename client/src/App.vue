<script setup lang="ts">
import { computed } from 'vue'
import { darkTheme } from 'naive-ui'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const theme = computed(() => (themeStore.isDark ? darkTheme : null))
</script>

<template>
  <n-config-provider :theme="theme">
    <n-global-style />
    <AppNavbar />
    <n-layout class="content">
      <router-view />
    </n-layout>
  </n-config-provider>
</template>

<style>
body {
  margin: 0;
}
</style>
