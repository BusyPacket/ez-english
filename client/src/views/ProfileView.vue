<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import dayjs from 'dayjs'
import { api } from '@/api/http'
import { useUserStore, type User } from '@/stores/user'

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



// 昵称修改
const nicknameInput = ref(userStore.user?.nickname ?? '')
const editingNickname = ref(false)
const savingNickname = ref(false)

function startEditNickname() {
  nicknameInput.value = userStore.user?.nickname ?? ''
  editingNickname.value = true
}

async function saveNickname() {
  const value = nicknameInput.value.trim()
  if (!value) {
    message.warning('昵称不能为空')
    return
  }
  if (value.length > 20) {
    message.warning('昵称最长 20 个字符')
    return
  }
  if (!/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/.test(value)) {
    message.warning('昵称仅支持中文、字母、数字和下划线，不能包含特殊字符')
    return
  }
  savingNickname.value = true
  try {
    await userStore.updateNickname(value)
    editingNickname.value = false
    message.success('昵称修改成功')
  } catch (e) {
    message.error((e as Error).message)
  } finally {
    savingNickname.value = false
  }
}

// 修改密码
const showPwdModal = ref(false)
const pwdCurrent = ref('')
const pwdNew = ref('')
const pwdConfirm = ref('')
const savingPassword = ref(false)

function openPwdModal() {
  pwdCurrent.value = ''
  pwdNew.value = ''
  pwdConfirm.value = ''
  showPwdModal.value = true
}

async function savePassword() {
  if (!pwdCurrent.value) {
    message.warning('请输入当前密码')
    return
  }
  if (!pwdNew.value || pwdNew.value.length < 6) {
    message.warning('新密码至少 6 位')
    return
  }
  if (pwdNew.value !== pwdConfirm.value) {
    message.warning('两次输入的新密码不一致')
    return
  }
  savingPassword.value = true
  try {
    await userStore.changePassword(pwdCurrent.value, pwdNew.value, pwdConfirm.value)
    showPwdModal.value = false
    message.success('密码修改成功')
  } catch (e) {
    message.error((e as Error).message)
  } finally {
    savingPassword.value = false
  }
}

function handleLogout() {
  userStore.logout()
  message.success('已退出登录')
  router.push('/')
}

// AI 配置（API Key / 模型）
const aiProvider = ref('deepseek')
const aiModel = ref('deepseek-v4-flash')
const apiKeyInput = ref('')
const hasApiKey = ref(false)
const savingAi = ref(false)
const verifyingKey = ref(false)
const queryingBalance = ref(false)
const verifyResult = ref<{ valid: boolean; message: string } | null>(null)
const balanceResult = ref<{
  isAvailable: boolean
  balances: { currency: string; total: string; granted: string; toppedUp: string }[]
} | null>(null)

interface ProviderOption {
  value: string
  label: string
  platformUrl: string
  models: { value: string; label: string }[]
}

// AI 公司与模型选项：公司从后端获取，模型实时从 DeepSeek 拉取
const providerOptions = ref<ProviderOption[]>([])
const aiProviderOptions = computed(() =>
  providerOptions.value.map((p) => ({ label: p.label, value: p.value })),
)

// 实时模型（后端调 DeepSeek /models；未配置 key 时为空 → 用内置兜底）
const liveModels = ref<{ value: string; label: string }[]>([])
const modelSource = ref<'live' | 'fallback'>('fallback')
const modelOptions = computed(() => {
  if (liveModels.value.length) return liveModels.value
  const p = providerOptions.value.find((o) => o.value === aiProvider.value)
  return p?.models ?? []
})

// 当前所选 AI 公司的平台信息（用于「创建 key」链接，跟随公司切换）
const currentProvider = computed(() =>
  providerOptions.value.find((o) => o.value === aiProvider.value),
)
const platformName = computed(() => currentProvider.value?.label ?? 'AI 公司')
const platformUrl = computed(() => currentProvider.value?.platformUrl ?? '')

// 切换公司时，若当前模型不属于新公司，则重置为该公司的第一个模型
function onProviderChange() {
  if (!modelOptions.value.some((m) => m.value === aiModel.value)) {
    aiModel.value = modelOptions.value[0]?.value ?? ''
  }
}

/** 实时拉取可用模型（用已保存的 key 调 DeepSeek） */
async function refreshLiveModels() {
  try {
    const live = await api<{
      models: { value: string; label: string }[]
      source: 'live' | 'fallback'
    }>('/profile/ai-config/models')
    liveModels.value = live.models
    modelSource.value = live.source
  } catch {
    liveModels.value = []
    modelSource.value = 'fallback'
  }
}

async function loadAiConfig() {
  try {
    // 1. 公司列表
    const opts = await api<{ providers: ProviderOption[] }>('/profile/ai-options')
    providerOptions.value = opts.providers
    // 2. 实时模型
    await refreshLiveModels()
    // 3. 已保存配置
    const cfg = await api<{ aiProvider: string; model: string; hasApiKey: boolean }>('/profile/ai-config')
    aiProvider.value = cfg.aiProvider
    aiModel.value = cfg.model
    hasApiKey.value = cfg.hasApiKey
    // 若已保存的模型不在当前列表中，回退到第一个
    if (!modelOptions.value.some((m) => m.value === aiModel.value)) {
      aiModel.value = modelOptions.value[0]?.value ?? ''
    }
  } catch {
    // 忽略加载失败
  }
}

async function saveAiConfig() {
  const key = apiKeyInput.value.trim()
  // 只有输入了 key 才校验格式；未输入表示保留原 key（只改模型/公司）
  if (key && !key.startsWith('sk-')) {
    message.warning('API Key 必须以 sk- 开头')
    return
  }
  if (!hasApiKey.value && !key) {
    message.warning('请先输入 API Key')
    return
  }
  savingAi.value = true
  verifyResult.value = null
  balanceResult.value = null
  try {
    await api('/profile/ai-config', {
      method: 'PUT',
      body: JSON.stringify({
        aiProvider: aiProvider.value,
        model: aiModel.value,
        ...(key ? { apiKey: key } : {}),
      }),
    })
    hasApiKey.value = true
    apiKeyInput.value = ''
    message.success('AI 配置保存成功')
    // 保存后重新检测 AI 可用状态，并实时刷新模型列表
    void userStore.refreshAiAvailable()
    void refreshLiveModels()
  } catch (e) {
    message.error((e as Error).message)
  } finally {
    savingAi.value = false
  }
}

async function checkKey() {
  verifyResult.value = null
  verifyingKey.value = true
  try {
    verifyResult.value = await api<{ valid: boolean; message: string }>('/profile/ai-config/verify', {
      method: 'POST',
    })
    userStore.setAiAvailable(verifyResult.value?.valid ?? false)
  } catch (e) {
    verifyResult.value = { valid: false, message: (e as Error).message }
    userStore.setAiAvailable(false)
  } finally {
    verifyingKey.value = false
  }
}

async function queryBalance() {
  balanceResult.value = null
  queryingBalance.value = true
  try {
    balanceResult.value = await api<{
      isAvailable: boolean
      balances: { currency: string; total: string; granted: string; toppedUp: string }[]
    }>('/profile/ai-config/balance')
  } catch (e) {
    balanceResult.value = null
    message.error((e as Error).message)
  } finally {
    queryingBalance.value = false
  }
}

/** 拉取最新个人资料（含答题数）并更新本地用户 */
async function loadProfile() {
  try {
    const profile = await api<User>('/profile')
    userStore.setProfile(profile)
  } catch {
    // 拉取失败保持本地数据
  }
}

onMounted(() => {
  loadProfile()
  loadAiConfig()
})
</script>

<template>
  <div class="profile-page">
    <n-card class="profile-card">
      <n-h2 class="profile-title">个人资料</n-h2>
      <n-descriptions bordered :column="1" label-placement="left" size="large">
        <n-descriptions-item label="邮箱">
          {{ userStore.user?.email ?? '-' }}
        </n-descriptions-item>
        <n-descriptions-item label="昵称">
          <div class="nickname-row">
            <template v-if="editingNickname">
              <n-input v-model:value="nicknameInput" placeholder="请输入昵称（1-20 位，中文/字母/数字/下划线）" :maxlength="20"
                size="small" style="max-width: 260px" @keyup.enter="saveNickname" />
              <n-button size="small" type="primary" :loading="savingNickname" @click="saveNickname">
                保存
              </n-button>
              <n-button size="small" @click="editingNickname = false">取消</n-button>
            </template>
            <template v-else>
              <span class="nickname-value">{{ userStore.user?.nickname ?? '未设置' }}</span>
              <n-button size="tiny" secondary @click="startEditNickname">修改</n-button>
            </template>
          </div>
        </n-descriptions-item>
        <n-descriptions-item label="角色">
          {{ roleLabels[userStore.user?.role ?? ''] ?? userStore.user?.role ?? '-' }}
        </n-descriptions-item>
        <n-descriptions-item label="注册时间">
          {{ createdAt }}
        </n-descriptions-item>
        <n-descriptions-item label="答题数">
          {{ userStore.user?.answerCount ?? 0 }}
        </n-descriptions-item>
      </n-descriptions>
      <n-button secondary block class="pwd-btn" @click="openPwdModal">
        修改密码
      </n-button>
    </n-card>
    <n-card class="ai-card" size="small" title="AI 配置">
      <n-space vertical :size="12">
        <n-form label-placement="left" label-width="60">
          <n-form-item label="公司">
            <n-select v-model:value="aiProvider" :options="aiProviderOptions" style="width: 100%"
              @update:value="onProviderChange" />
          </n-form-item>
          <n-form-item label="模型">
            <div style="width: 100%">
              <n-select v-model:value="aiModel" :options="modelOptions" style="width: 100%" />
              <div v-if="modelSource === 'live'" class="model-src-live">✔ 已实时获取最新模型</div>
              <div v-else class="model-src-fallback">⚠ 未配置有效 API Key，暂显示内置模型</div>
            </div>
          </n-form-item>
          <n-form-item label="Key">
            <n-input v-model:value="apiKeyInput" type="password" show-password-on="click" placeholder="sk- 开头的 API Key"
              style="width: 100%" />
          </n-form-item>
        </n-form>
        <div class="ai-tip">
          🔑 前往
          <a :href="platformUrl" target="_blank" rel="noopener">{{ platformName }}</a>
          创建你的 API Key 并充值（必须以 <code>sk-</code> 开头），强烈建议新建专用的 key！
        </div>
        <div class="ai-note">
          <strong>❓ 为什么需要额外配置 AI 并充值？</strong>
          <p>
            在官方 APP 或网页内使用 AI 通常并不需要付费，但是使用 API 调用是需要付费的。本网站并不会替你向 AI
            公司付费，为了达成某些功能，我们必须使用 API 调用的方式。你充值的所有金额都是直接转到 AI
            公司账户，本网站不会从中获利。
          </p>
        </div>
        <div v-if="hasApiKey" class="ai-status">✅ 已设置 DeepSeek API Key（{{ aiModel }}）</div>
        <n-space :size="8" wrap>
          <n-button type="primary" :loading="savingAi" @click="saveAiConfig">保存配置</n-button>
          <n-button :disabled="!hasApiKey" :loading="verifyingKey" @click="checkKey">检测 Key 可用</n-button>
          <n-button :disabled="!hasApiKey" :loading="queryingBalance" @click="queryBalance">查询余额</n-button>
        </n-space>
        <div v-if="verifyResult" class="ai-result" :class="verifyResult.valid ? 'ai-result-ok' : 'ai-result-err'">
          {{ verifyResult.valid ? '✅' : '❌' }} {{ verifyResult.message }}
        </div>
        <div v-if="balanceResult" class="ai-balance">
          <div class="ai-balance-title">
            余额（{{ balanceResult.isAvailable ? '✅ 可用' : '⚠️ 余额不足' }}）
          </div>
          <div v-for="b in balanceResult.balances" :key="b.currency" class="ai-balance-row">
            <span>{{ b.currency }}</span>
            <span>总额 {{ b.total }}</span>
            <span>赠送 {{ b.granted }}</span>
            <span>充值 {{ b.toppedUp }}</span>
          </div>
        </div>
      </n-space>
    </n-card>
    <n-button type="error" block class="logout-btn" @click="handleLogout">
      退出登录
    </n-button>

    <n-modal v-model:show="showPwdModal" preset="card" title="修改密码" style="max-width: 420px" :bordered="false"
      @keydown.esc="showPwdModal = false">
      <n-form label-placement="left" label-width="90" size="large">
        <n-form-item label="当前密码">
          <n-input v-model:value="pwdCurrent" type="password" show-password-on="click" placeholder="请输入当前密码" />
        </n-form-item>
        <n-form-item label="新密码">
          <n-input v-model:value="pwdNew" type="password" show-password-on="click" placeholder="至少 6 位" />
        </n-form-item>
        <n-form-item label="确认新密码">
          <n-input v-model:value="pwdConfirm" type="password" show-password-on="click" placeholder="再次输入新密码"
            @keyup.enter="savePassword" />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button @click="showPwdModal = false">取消</n-button>
          <n-button type="primary" :loading="savingPassword" @click="savePassword">确认修改</n-button>
        </n-space>
      </template>
    </n-modal>
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

.nickname-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.nickname-value {
  margin-right: 4px;
}

.pwd-btn {
  margin-top: 16px;
}

.logout-btn {
  margin-top: 30px;
}

.ai-card {
  margin-top: 16px;
}

.model-src-live {
  font-size: 0.75rem;
  color: var(--n-success-color);
  margin-top: 4px;
}

.model-src-fallback {
  font-size: 0.75rem;
  color: var(--n-warning-color);
  margin-top: 4px;
}

.ai-tip {
  color: var(--n-text-color-3);
  font-size: 0.8125rem;
  line-height: 1.6;
}

.ai-tip a {
  color: var(--n-primary-color);
}

.ai-note {
  font-size: 0.8125rem;
  line-height: 1.7;
  color: var(--n-text-color-2);
  background: color-mix(in srgb, var(--n-info-color) 6%, transparent);
  border-radius: 6px;
  padding: 8px 10px;
}

.ai-note strong {
  display: block;
  margin-bottom: 4px;
}

.ai-note p {
  margin: 0;
}

.ai-status {
  font-size: 0.8125rem;
  color: var(--n-success-color);
}

.ai-result {
  font-size: 0.8125rem;
  padding: 6px 10px;
  border-radius: 6px;
}

.ai-result-ok {
  background: color-mix(in srgb, var(--n-success-color) 10%, transparent);
  color: var(--n-success-color);
}

.ai-result-err {
  background: color-mix(in srgb, var(--n-error-color) 10%, transparent);
  color: var(--n-error-color);
}

.ai-balance {
  font-size: 0.8125rem;
  border: 1px solid var(--n-border-color);
  border-radius: 6px;
  padding: 8px 10px;
}

.ai-balance-title {
  font-weight: 600;
  margin-bottom: 6px;
}

.ai-balance-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  color: var(--n-text-color-2);
}
</style>
