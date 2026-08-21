<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const trialDays = userStore.user?.trialDays ?? 7
</script>

<template>
  <div class="trial-expired-page">
    <n-result
      status="warning"
      :title="`${trialDays} 天试用期已到`"
      description="免费试用期已结束，请联系管理员升级为会员以继续使用全部功能。"
    >
      <template #footer>
        <n-button type="primary" @click="router.push('/')">返回首页</n-button>
      </template>
    </n-result>
  </div>
</template>

<style scoped>
.trial-expired-page {
  max-width: 620px;
  margin: 0 auto;
  padding: 80px 16px;
}
</style>
