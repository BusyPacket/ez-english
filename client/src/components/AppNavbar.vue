<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const router = useRouter()
const route = useRoute()

const menuOptions = [
  { label: '首页', key: '/' },
  { label: '学习进度', key: '/progress' },
  { label: '考试内容', key: '/exam' },
  { label: '英语真题', key: '/exam-paper' },
]

const activeKey = computed(() => route.path)

function handleMenuSelect(key: string) {
  router.push(key)
}
</script>

<template>
  <n-layout-header bordered class="navbar">
    <div class="navbar-inner">
      <div class="brand">📚 ez-english</div>
      <n-menu mode="horizontal" :options="menuOptions" :value="activeKey" @update:value="handleMenuSelect" />
      <div class="spacer" />
      <n-button quaternary circle :title="themeStore.isDark ? '切换到浅色模式' : '切换到深色模式'" @click="themeStore.toggle">
        <template #icon>
          <span class="theme-icon">{{ themeStore.isDark ? '🌙' : '☀️' }}</span>
        </template>
      </n-button>
    </div>
  </n-layout-header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 10;
}

.navbar-inner {
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 960px;
  margin: 0 auto;
  padding: 0 16px;
  height: 48px;
}

.brand {
  font-weight: 600;
  font-size: 16px;
  white-space: nowrap;
}

.spacer {
  flex: 1;
}

.theme-icon {
  font-size: 18px;
  line-height: 1;
}
</style>
