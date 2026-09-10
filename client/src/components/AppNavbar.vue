<script setup lang="ts">
import { computed, h, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { UserRole } from '@ez-english/shared'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'
import TimerWidget from '@/components/TimerWidget.vue'

const themeStore = useThemeStore()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const mainMenuOptions = [
  { label: '首页', key: '/' },
  { label: '学习', key: '/progress' },
  { label: '真题', key: '/exam-paper' },
  { label: '收藏', key: '/favorites' },
  { label: '排行', key: '/leaderboard' },
  { label: '反馈', key: '/feedback' },
]

/** 右侧后台菜单（仅管理员，右对齐） */
const adminMenuOptions = computed(() =>
  userStore.user?.role === UserRole.Admin ? [{ label: '后台', key: '/admin' }] : [],
)

/** 移动端下拉：全部菜单项（含后台），登录时以「我的」代替用户名 */
const mobileOptions = computed(() => {
  const options = [...mainMenuOptions, ...adminMenuOptions.value]
  options.push(
    userStore.isLoggedIn
      ? { label: '我的', key: '/profile' }
      : { label: '登录/注册', key: '/login' },
  )
  return options
})

const activeKey = computed(() => route.path)

/** 移动端下拉菜单显隐 */
const showMobileMenu = ref(false)

function handleMenuSelect(key: string) {
  showMobileMenu.value = false
  router.push(key)
}

/**
 * 菜单项渲染为真实 <a href> 链接：
 * 左键阻止默认跳转（交给 n-menu 的 update:value → router.push 做 SPA 导航）；
 * 中键（auxclick）不受 preventDefault 影响，由浏览器新开标签页访问对应路由。
 */
const renderMenuLink = (option: {
  key?: string | number
  label?: string | (() => import('vue').VNodeChild)
}) =>
  h(
    'a',
    {
      href: String(option.key ?? ''),
      class: 'nav-menu-link',
      onClick: (e: MouseEvent) => e.preventDefault(),
    },
    {
      default: () =>
        typeof option.label === 'function'
          ? option.label()
          : (option.label ?? String(option.key ?? '')),
    },
  )
</script>

<template>
  <n-layout-header bordered class="navbar">
    <div class="navbar-inner">
      <div class="brand">📚 ez-english</div>
      <n-menu
        class="nav-menu"
        mode="horizontal"
        :options="mainMenuOptions"
        :value="activeKey"
        :render-label="renderMenuLink"
        @update:value="handleMenuSelect"
      />
      <div class="spacer" />
      <n-menu
        v-if="adminMenuOptions.length"
        class="nav-menu nav-menu-right"
        mode="horizontal"
        :options="adminMenuOptions"
        :value="activeKey"
        :render-label="renderMenuLink"
        @update:value="handleMenuSelect"
      />
      <n-space v-if="userStore.isLoggedIn" align="center">
        <n-a
          :strong="true"
          class="nav-username"
          :title="userStore.displayName"
          @click="router.push('/profile')"
        >
          {{ userStore.displayName }}
        </n-a>
      </n-space>
      <n-button v-else quaternary size="small" @click="router.push('/login')">登录/注册</n-button>
      <TimerWidget />
      <n-button
        quaternary
        circle
        :title="themeStore.isDark ? '切换到浅色模式' : '切换到深色模式'"
        @click="themeStore.toggle"
      >
        <template #icon>
          <span class="theme-icon">{{ themeStore.isDark ? '🌙' : '☀️' }}</span>
        </template>
      </n-button>
      <n-dropdown
        :options="mobileOptions"
        :show="showMobileMenu"
        trigger="click"
        @select="handleMenuSelect"
        @update:show="(v: boolean) => (showMobileMenu = v)"
      >
        <n-button quaternary circle class="mobile-menu-btn" title="菜单">
          <template #icon>
            <span class="menu-icon">☰</span>
          </template>
        </n-button>
      </n-dropdown>
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

/* n-menu 横向默认 width:100%，覆盖为按内容宽度，由 spacer 撑开右侧空间 */
.nav-menu {
  width: fit-content;
  max-width: fit-content;
  flex: 0 0 auto;
}

/* 右侧「后台」菜单：高度与用户名一致（28px），字形与用户名完全对齐 */
.nav-menu-right :deep(.n-menu-item-content) {
  height: 28px;
  min-height: 28px;
  margin-top: 8px;
  align-content: center;
  align-items: center;
}

/* 菜单项作为真实链接的样式：去掉 <a> 默认蓝色下划线，继承菜单文字颜色 */
.nav-menu :deep(.nav-menu-link),
.nav-menu-right :deep(.nav-menu-link) {
  text-decoration: none;
  color: inherit;
  outline: none;
}

.theme-icon {
  font-size: 1.125rem;
  line-height: 1;
}

.menu-icon {
  font-size: 1.125rem;
  line-height: 1;
}

/* 用户名：与右侧后台菜单项字号/行高一致，保证垂直对齐 */
.nav-username {
  display: inline-block;
  /* 必须给绝对上限：父级 n-space 宽度由内容撑开（fit-content），max-width: 100% 等于无约束，
     长昵称会把导航栏顶宽、页面出现横向滚动条 */
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
  font-size: 16px;
  line-height: 28px;
}

/* 汉堡按钮：默认隐藏，窗口不够宽时显示 */
.mobile-menu-btn {
  display: none;
}

/*
 * 完整导航栏按默认间距需要约 992px，窗口更窄时会把页面顶宽、出现横向滚动条。
 * 这里通过压缩间距（而不是隐藏菜单）把需求宽度降到 ~750px，保证 768px 以上都能完整显示。
 */
@media (max-width: 1023px) {
  .navbar-inner {
    gap: 8px;
    padding: 0 8px;
  }

  .nav-username {
    max-width: 100px;
  }

  /* 菜单项默认左右各 20px 内边距，6 项合计 240px，是导航栏最占地方的部分 */
  .nav-menu :deep(.n-menu-item-content) {
    padding-left: 6px;
    padding-right: 6px;
  }
}

/* 移动端：横向菜单收进汉堡菜单，隐藏用户名（汉堡里以「我的」代替） */
@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }

  .mobile-menu-btn {
    display: inline-flex;
  }

  .nav-username {
    display: none;
  }

  .brand {
    font-size: 0.9rem;
  }
}
</style>
