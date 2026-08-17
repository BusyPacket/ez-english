<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import dayjs from 'dayjs'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const message = useMessage()
const userStore = useUserStore()

const roleLabels: Record<string, string> = {
  user: '普通用户',
  member: '会员用户',
  admin: '管理员',
}

const createdAt = computed(() =>
  userStore.user?.createdAt ? dayjs(userStore.user.createdAt).format('YYYY-MM-DD HH:mm') : '-',
)

function handleLogout() {
  userStore.logout()
  message.success('已退出登录')
  router.push('/')
}
</script>

<template>
  <div class="profile-page">
    <n-card class="profile-card">
      <n-h2 class="profile-title">个人资料</n-h2>
      <n-descriptions bordered :column="1" size="large">
        <n-descriptions-item label="邮箱">
          {{ userStore.user?.email ?? '-' }}
        </n-descriptions-item>
        <n-descriptions-item label="昵称">
          {{ userStore.user?.nickname ?? '未设置' }}
        </n-descriptions-item>
        <n-descriptions-item label="角色">
          {{ roleLabels[userStore.user?.role ?? ''] ?? userStore.user?.role ?? '-' }}
        </n-descriptions-item>
        <n-descriptions-item label="注册时间">
          {{ createdAt }}
        </n-descriptions-item>
      </n-descriptions>
      <n-button type="error" block class="logout-btn" @click="handleLogout">
        退出登录
      </n-button>
    </n-card>
  </div>
</template>

<style scoped>
.profile-page {
  max-width: 480px;
  margin: 48px auto;
  padding: 0 16px;
}

.profile-title {
  text-align: center;
}

.logout-btn {
  margin-top: 24px;
}
</style>
