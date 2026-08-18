<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'
import TimerWidget from '@/components/TimerWidget.vue'

const themeStore = useThemeStore()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const menuOptions = [
  { label: '首页', key: '/' },
  { label: '进度', key: '/progress' },
  { label: '真题', key: '/exam-paper' },
  { label: '收藏', key: '/favorites' },
  { label: '排行榜', key: '/leaderboard' },
  { label: '反馈', key: '/feedback' },
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
      <n-button v-if="userStore.user?.role === 'admin'" quaternary size="small"
        @click="router.push('/admin')">后台</n-button>
      <div class="spacer" />
      <n-space v-if="userStore.isLoggedIn" align="center">
        <n-a :strong="true" @click="router.push('/profile')">{{ userStore.displayName }}</n-a>
      </n-space>
      <n-button v-else quaternary size="small" @click="router.push('/login')">登录/注册</n-button>
      <TimerWidget />
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
  height: var(--navbar-h);
  box-sizing: border-box;
}

.navbar-inner {
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 960px;
  margin: 0 auto;
  padding: 0 16px;
  height: 56px;
}

.brand {
  font-weight: 600;
  font-size: 1rem;
  white-space: nowrap;
}

.spacer {
  flex: 1;
}

.theme-icon {
  font-size: 1.125rem;
  line-height: 1;
}
</style>
