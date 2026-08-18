<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import type { FormInst, FormRules } from 'naive-ui'
import { api } from '@/api/http'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const message = useMessage()
const userStore = useUserStore()

/** 注册是否开放（默认开放，挂载时从后端读取） */
const regOpen = ref(true)
onMounted(async () => {
  try {
    const res = await api<{ open: boolean }>('/settings/registration-open')
    regOpen.value = res.open
  } catch {
    regOpen.value = true
  }
})

const formRef = ref<FormInst>()
const loading = ref(false)
const form = ref({ email: '', password: '', confirmPassword: '' })

const rules: FormRules = {
  email: {
    required: true,
    type: 'email',
    message: '请输入正确的邮箱',
    trigger: ['blur', 'input'],
  },
  password: {
    required: true,
    min: 6,
    message: '密码至少 6 位',
    trigger: ['blur', 'input'],
  },
  confirmPassword: {
    required: true,
    validator: (_rule, value) =>
      value === form.value.password ? true : new Error('两次密码不一致'),
    trigger: ['blur', 'input'],
  },
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }
  if (!regOpen.value) {
    message.error('注册未开放')
    return
  }
  loading.value = true
  try {
    await userStore.register(form.value.email, form.value.password)
    message.success('注册成功，请登录')
    router.push('/login')
  } catch (e) {
    message.error((e as Error).message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <n-card class="auth-card">
      <n-h2 class="auth-title">注册</n-h2>
      <n-alert v-if="!regOpen" type="warning" :bordered="false" class="reg-closed-alert">
        注册暂未开放，请联系管理员
      </n-alert>
      <n-form ref="formRef" :model="form" :rules="rules" size="large">
        <n-form-item label="邮箱" path="email">
          <n-input v-model:value="form.email" placeholder="用户名即邮箱" />
        </n-form-item>
        <n-form-item label="密码" path="password">
          <n-input v-model:value="form.password" type="password" show-password-on="click" placeholder="至少 6 位" />
        </n-form-item>
        <n-form-item label="确认密码" path="confirmPassword">
          <n-input v-model:value="form.confirmPassword" type="password" show-password-on="click" placeholder="再次输入密码"
            @keyup.enter="handleSubmit" />
        </n-form-item>
        <n-button type="primary" block :loading="loading" @click="handleSubmit">
          注册
        </n-button>
      </n-form>
      <n-p class="auth-tip">
        已有账号？<n-a @click="router.push('/login')">去登录</n-a>
      </n-p>
    </n-card>
  </div>
</template>

<style scoped>
.auth-page {
  max-width: 400px;
  margin: 48px auto;
  padding: 0 16px;
}

.auth-title {
  text-align: center;
}

.auth-tip {
  margin-top: 16px;
  text-align: center;
}

.reg-closed-alert {
  margin-bottom: 16px;
}
</style>
