<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import type { FormInst, FormRules } from 'naive-ui'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const message = useMessage()
const userStore = useUserStore()

const formRef = ref<FormInst>()
const loading = ref(false)
const form = ref({ email: '', password: '' })

const rules: FormRules = {
  email: {
    required: true,
    type: 'email',
    message: '请输入正确的邮箱',
    trigger: ['blur', 'input'],
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: ['blur', 'input'],
  },
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }
  loading.value = true
  try {
    await userStore.login(form.value.email, form.value.password)
    message.success('登录成功')
    const redirect = (router.currentRoute.value.query.redirect as string) || '/'
    router.push(redirect)
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
      <n-h2 class="auth-title">登录</n-h2>
      <n-form ref="formRef" :model="form" :rules="rules" size="large">
        <n-form-item label="邮箱" path="email">
          <n-input v-model:value="form.email" placeholder="请输入邮箱" />
        </n-form-item>
        <n-form-item label="密码" path="password">
          <n-input
            v-model:value="form.password"
            type="password"
            show-password-on="click"
            placeholder="请输入密码"
            @keyup.enter="handleSubmit"
          />
        </n-form-item>
        <n-button type="primary" block :loading="loading" @click="handleSubmit"> 登录 </n-button>
      </n-form>
      <n-p class="auth-tip"> 还没有账号？<n-a @click="router.push('/register')">去注册</n-a> </n-p>
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
</style>
