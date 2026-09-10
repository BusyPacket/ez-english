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

/** 当前步骤：1 = 账号信息，2 = 设置昵称 */
const step = ref(1)
const accountFormRef = ref<FormInst>()
const nicknameFormRef = ref<FormInst>()
const loading = ref(false)
const form = ref({ email: '', password: '', confirmPassword: '', nickname: '' })

/** 第一步（账号信息）校验规则 */
const accountRules: FormRules = {
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

/** 第二步（昵称）校验规则：与后端 nicknameField 保持一致 */
const nicknameRules: FormRules = {
  nickname: {
    required: true,
    validator: (_rule, value: string) => {
      const v = (value ?? '').trim()
      if (!v) return new Error('请输入昵称')
      if (v.length > 20) return new Error('昵称最长 20 个字符')
      if (!/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/.test(v)) {
        return new Error('昵称仅支持中文、字母、数字和下划线，不能包含特殊字符')
      }
      return true
    },
    trigger: ['blur', 'input'],
  },
}

/** 第一步 → 第二步：只校验账号信息 */
async function goNext() {
  try {
    await accountFormRef.value?.validate()
  } catch {
    return
  }
  step.value = 2
}

function goPrev() {
  step.value = 1
}

async function handleSubmit() {
  try {
    await nicknameFormRef.value?.validate()
  } catch {
    return
  }
  if (!regOpen.value) {
    message.error('注册未开放')
    return
  }
  loading.value = true
  try {
    await userStore.register(form.value.email, form.value.password, form.value.nickname.trim())
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
      <n-steps :current="step" size="small" class="reg-steps">
        <n-step title="账号信息" />
        <n-step title="设置昵称" />
      </n-steps>

      <n-form
        v-if="step === 1"
        ref="accountFormRef"
        :model="form"
        :rules="accountRules"
        size="large"
      >
        <n-form-item label="邮箱" path="email">
          <n-input v-model:value="form.email" placeholder="用户名即邮箱" />
        </n-form-item>
        <n-form-item label="密码" path="password">
          <n-input
            v-model:value="form.password"
            type="password"
            show-password-on="click"
            placeholder="至少 6 位"
          />
        </n-form-item>
        <n-form-item label="确认密码" path="confirmPassword">
          <n-input
            v-model:value="form.confirmPassword"
            type="password"
            show-password-on="click"
            placeholder="再次输入密码"
            @keyup.enter="goNext"
          />
        </n-form-item>
        <n-button type="primary" block @click="goNext">下一步</n-button>
      </n-form>

      <n-form v-else ref="nicknameFormRef" :model="form" :rules="nicknameRules" size="large">
        <n-form-item label="昵称" path="nickname">
          <n-input
            v-model:value="form.nickname"
            placeholder="1-20 位，中文/字母/数字/下划线"
            :maxlength="20"
            @keyup.enter="handleSubmit"
          />
        </n-form-item>
        <n-space :size="12">
          <n-button @click="goPrev">上一步</n-button>
          <n-button type="primary" :loading="loading" @click="handleSubmit">注册</n-button>
        </n-space>
      </n-form>
      <n-p class="auth-tip"> 已有账号？<n-a @click="router.push('/login')">去登录</n-a> </n-p>
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

/* 步骤条不再铺满卡片：限宽后水平居中 */
.reg-steps {
  max-width: 260px;
  margin: 0 auto 20px;
}

/* naive-ui 的水平步骤会把标题区（.n-step-content）撑满整个 step，导致内容左对齐、重心偏左；
   这里让标题区按内容宽度收缩，交给上面的 justify-content: center 做视觉居中 */
.reg-steps :deep(.n-step) {
  justify-content: center;
}

.reg-steps :deep(.n-step-content) {
  flex: none;
}

/* 连接线默认 flex:1，在收缩后的标题区里会塌成 0 宽；给固定宽度把它留住 */
.reg-steps :deep(.n-step-splitor) {
  flex: none;
  width: 24px;
}
</style>
