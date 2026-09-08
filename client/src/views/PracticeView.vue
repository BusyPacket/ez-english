<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { api } from '@/api/http'
import { useUserStore } from '@/stores/user'
import QuestionCard, { type AnswerableQuestion } from '@/components/QuestionCard.vue'
import { usePrefetchQueue } from '@/composables/usePrefetchQueue'

const route = useRoute()
const router = useRouter()
const message = useMessage()
const userStore = useUserStore()

/** 练习主题标题（从进度页考点带入） */
const practiceTitle = computed(() => (route.query.title as string) ?? '英语练习')

/** 当前考点 id */
const pointId = computed(() => (route.query.point as string) ?? '')

/** 练习题型：single 单选题 / fill 填空题 / judge 判断题 */
const questionType = ref<'single' | 'fill' | 'judge'>('single')
const typeOptions = [
  { label: '单选题', value: 'single' },
  { label: '填空题', value: 'fill' },
  { label: '判断题', value: 'judge' },
]

// —— AI 生题缓存队列 ——
// 队列本身（预生成 size 道、消费后自动补满、并发与过期响应防护）由 usePrefetchQueue 提供；
// 这里只保留业务绑定：整批锁定题型、题干去重收集、AI 可用性与错误提示。
type QuestionType = 'single' | 'fill' | 'judge'

/** 队列整批锁定的题型（随生成时的题型选择；切换题型会清空队列避免混题） */
const queueType = ref<QuestionType>('single')
/** 本次会话已生成过的题干（传给后端去重，避免连续生成重复题） */
const generatedStems = ref<string[]>([])

const typeLabels: Record<QuestionType, string> = {
  single: '单选题',
  fill: '填空题',
  judge: '判断题',
}

/** 生成一题（produce 工厂：由队列内部并发生成时调用） */
async function produceQuestion(): Promise<AnswerableQuestion> {
  const q = await api<AnswerableQuestion>('/ai/generate-practice', {
    method: 'POST',
    body: JSON.stringify({
      point: pointId.value,
      type: queueType.value,
      excludeStems: generatedStems.value,
    }),
  })
  if (q?.stem) generatedStems.value.push(q.stem)
  return q
}

const queue = usePrefetchQueue<AnswerableQuestion>({
  size: 3,
  produce: produceQuestion,
  onError: (e) => message.error(e instanceof Error ? e.message : String(e)),
})

/** 以下为模板便利别名（顶层 ref/computed 在模板中会自动解包） */
const currentQuestion = queue.current
const generating = queue.loading
const hasCachedNext = queue.hasNext
const lastGenError = queue.lastError
/** 队列当前长度（仅用于控制「生成/重新生成」按钮状态，不向用户展示数量） */
const queueLen = computed(() => queue.items.value.length)
const genBtnText = computed(() => {
  if (generating.value) return '出题中…'
  return queueLen.value ? '重新生成' : '生成题目'
})

/** AI 可用性检查：不可用时提示并跳转配置页 */
function assertAiAvailable(): boolean {
  if (userStore.aiAvailable) return true
  if (userStore.user?.trialExpired) {
    message.warning('7 天试用期已到，请联系管理员升级会员以继续使用 AI 功能')
  } else {
    message.warning('要使用 AI 功能必须先进行配置')
    router.push('/profile')
  }
  return false
}

/** 首次生成 / 重新生成：清空当前题目并重新出题（预生成数量对用户透明） */
function startGeneration() {
  if (generating.value) return
  if (!assertAiAvailable()) return
  queue.reset()
  queueType.value = questionType.value // 整批锁定当前题型
  queue.fill()
}

/** 进入下一题（模板按钮）：消费队首，队列自动在后台补一题 */
function nextQuestion() {
  queue.next()
}

/** 重新出题（模板在出题失败、且暂无可用的下一题时显示） */
function refill() {
  queue.fill()
}

// 切换题型会破坏「整批同题型」的约束：清空当前题目并提示重新生成
watch(questionType, (t) => {
  if (queueLen.value > 0 || generating.value) {
    queue.reset()
    message.info(`题型已切换为「${typeLabels[t]}」，请重新生成题目`)
  }
})

// —— 例题库（该考点全部例题，可折叠 + 上一题/下一题浏览） ——
interface BankQuestion {
  id: string
  type: string
  pointId: string
  pointTitle: string | null
  stem: string
  choices: string[]
  answer: string
  analysis: string | null
  createdAt: string
  /** 是否已答题（后端按用户附带） */
  answered: boolean
  /** 用户上次选择的答案 */
  userAnswer: string | null
  /** 上次答题是否正确 */
  isCorrect: boolean | null
}

const bankQuestions = ref<BankQuestion[]>([])
const bankLoading = ref(false)
const bankIndex = ref(0)
const bankExpanded = ref<string[]>(['bank'])

/** AI 生题面板折叠状态 */
const aiExpanded = ref<string[]>(['ai'])

/** 当前浏览的例题（映射为可答题结构） */
const bankCurrent = computed<AnswerableQuestion | null>(() => {
  const q = bankQuestions.value[bankIndex.value]
  if (!q) return null
  return {
    id: q.id,
    stem: q.stem,
    choices: q.choices,
    answer: q.answer,
    point: q.pointTitle ?? '',
    analysis: q.analysis ?? '',
    answered: q.answered,
    userAnswer: q.userAnswer ?? undefined,
    isCorrect: q.isCorrect ?? undefined,
  }
})

/** 当前浏览例题的题型（single/fill/judge，控制 QuestionCard 渲染方式） */
const bankType = computed<'single' | 'fill' | 'judge'>(() => {
  const type = bankQuestions.value[bankIndex.value]?.type
  return type === 'fill' || type === 'judge' ? type : 'single'
})

/** 拉取当前考点的全部例题（未答在前、已答在后，由后端排序） */
async function fetchBank() {
  if (!pointId.value) return
  bankLoading.value = true
  try {
    bankQuestions.value = await api<BankQuestion[]>(
      `/questions/by-point?pointId=${encodeURIComponent(pointId.value)}`,
    )
    bankIndex.value = 0
  } catch (e) {
    message.error((e as Error).message)
  } finally {
    bankLoading.value = false
  }
}

/**
 * 例题库答题完成：仅本地把该题标记为已答并记录答案，不重新拉取列表。
 * 这样不会打断当前浏览位置；「已答排在最后」的排序在下次进入该页面时由后端返回。
 */
function handleBankAnswered(questionId: string, userAnswer: string, isCorrect: boolean) {
  const q = bankQuestions.value.find((item) => item.id === questionId)
  if (q) {
    q.answered = true
    q.userAnswer = userAnswer
    q.isCorrect = isCorrect
  }
}

function prevBank() {
  if (bankIndex.value > 0) bankIndex.value -= 1
}

function nextBank() {
  if (bankIndex.value < bankQuestions.value.length - 1) bankIndex.value += 1
}

// 考点变化（如从学习页切换到另一考点）时：重置折叠状态、回到第一题并重新加载例题
watch(
  () => route.query.point,
  () => {
    bankExpanded.value = ['bank']
    aiExpanded.value = ['ai']
    bankIndex.value = 0
    fetchBank()
  },
)

onMounted(() => {
  if (userStore.isLoggedIn) void userStore.refreshAiAvailable()
  fetchBank()
})
</script>

<template>
  <div class="practice-page">
    <n-card class="practice-header">
      <n-space justify="space-between" align="center">
        <n-h2 class="practice-title">{{ practiceTitle }}</n-h2>
        <n-button size="small" secondary @click="router.push('/progress')">返回进度</n-button>
      </n-space>
    </n-card>

    <!-- 例题库（可折叠，位于考点最上方，上一题/下一题浏览） -->
    <n-collapse v-model:expanded-names="bankExpanded" class="bank-collapse">
      <n-collapse-item name="bank" :title="`📚 例题库${bankQuestions.length ? `（${bankQuestions.length} 题）` : ''}`">
        <div v-if="bankLoading" class="bank-loading">
          <n-spin size="small" />
        </div>
        <template v-else-if="bankQuestions.length">
          <QuestionCard :question="bankCurrent" :question-type="bankType" :point-id="pointId"
            :point-title="practiceTitle" @answered="handleBankAnswered">
            <!-- 上一题/下一题导航放在「追问」上方 -->
            <template #before-followup>
              <n-divider style="margin: 10px 0" />
              <div class="bank-nav">
                <n-button size="small" :disabled="bankIndex <= 0" @click="prevBank">上一题</n-button>
                <span class="bank-count">{{ bankIndex + 1 }} / {{ bankQuestions.length }}</span>
                <n-button size="small" :disabled="bankIndex >= bankQuestions.length - 1" @click="nextBank">下一题
                </n-button>
              </div>
            </template>
          </QuestionCard>
        </template>
        <div v-else class="bank-empty">该考点暂无例题</div>
      </n-collapse-item>
    </n-collapse>

    <!-- AI 生题（可折叠）：预生成缓存队列，做完一题点「下一题」后自动补一题 -->
    <n-collapse v-model:expanded-names="aiExpanded" class="ai-collapse">
      <n-collapse-item name="ai" title="🤖 AI生题">
        <n-card class="type-card" size="small">
          <n-space align="center" justify="space-between" :size="12">
            <n-space align="center" :size="12">
              <span class="type-label">题型</span>
              <n-radio-group v-model:value="questionType">
                <n-radio-button v-for="opt in typeOptions" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </n-radio-button>
              </n-radio-group>
            </n-space>
            <n-button type="success" :loading="generating && !queueLen" :disabled="generating && queueLen > 0"
              @click="startGeneration">{{ genBtnText }}</n-button>
          </n-space>
        </n-card>

        <!-- 当前作答/浏览的题（队首） -->
        <n-card v-if="currentQuestion" class="generated-card" size="small">
          <QuestionCard :question="currentQuestion" :question-type="queueType" :point-id="pointId"
            :point-title="practiceTitle" />
          <div class="queue-bar">
            <template v-if="hasCachedNext">
              <n-button type="primary" size="small" @click="nextQuestion">下一题</n-button>
            </template>
            <template v-else>
              <n-button v-if="generating" type="primary" size="small" disabled>正在出题…</n-button>
              <n-button v-else-if="lastGenError" type="primary" size="small" @click="refill">出题失败，重试</n-button>
              <n-button v-else type="primary" size="small" disabled>下一题</n-button>
            </template>
          </div>
        </n-card>

        <!-- 首题生成中占位 -->
        <n-card v-else-if="generating" class="generated-card" size="small">
          <div class="queue-spin">
            <n-spin size="small" />
            <span>正在出题…</span>
          </div>
        </n-card>

        <!-- 空态 -->
        <n-empty v-else class="ai-empty" description="点击上方「生成题目」开始练习" />
      </n-collapse-item>
    </n-collapse>
  </div>
</template>

<style scoped>
.practice-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 16px;
}

.practice-title {
  margin: 0;
}

.type-card {
  margin-top: 16px;
}

.type-label {
  font-weight: 500;
}

.generated-card {
  margin-top: 16px;
}

.queue-bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 14px;
}

.queue-spin {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 0;
  color: #888;
  font-size: 0.9rem;
}

.ai-empty {
  margin-top: 16px;
}

.gen-label {
  font-weight: 600;
  margin-bottom: 8px;
}

.gen-stem {
  font-weight: 500;
  white-space: pre-wrap;
}

.gen-choices {
  margin-top: 8px;
}

.choice {
  padding: 6px 10px;
  border: 1px solid var(--n-border-color);
  border-radius: 6px;
  margin-top: 6px;
  cursor: pointer;
  transition:
    border-color 0.2s,
    background-color 0.2s;
}

.choice:hover {
  border-color: var(--n-primary-color);
}

.choice.selected {
  border-color: var(--n-primary-color);
  background: color-mix(in srgb, var(--n-primary-color) 8%, transparent);
}

.choice.correct-choice {
  border-color: #18a058;
  background: color-mix(in srgb, #18a058 8%, transparent);
}

.choice.wrong-choice {
  border-color: #d03050;
  background: color-mix(in srgb, #d03050 8%, transparent);
}

.opt-letter {
  font-weight: 600;
  margin-right: 4px;
}

.choice-tag {
  float: right;
  font-size: 0.75rem;
  font-weight: 600;
}

.tag-correct {
  color: #18a058;
}

.tag-wrong {
  color: #d03050;
}

.judge-row,
.fill-row {
  margin-top: 10px;
  display: flex;
  gap: 8px;
}

.gen-actions {
  margin-top: 14px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.gen-result {
  margin-top: 10px;
  font-weight: 600;
}

.gen-result-ok {
  color: #18a058;
}

.gen-result-err {
  color: #d03050;
}

.gen-answer {
  margin-top: 8px;
  color: #18a058;
  font-weight: 500;
}

.gen-point {
  margin-top: 4px;
  color: #2080f0;
}

.gen-analysis {
  margin-top: 4px;
  color: var(--n-text-color-3);
  line-height: 1.7;
}

.followup-card {
  margin-top: 16px;
}

.followup-label {
  font-weight: 600;
  margin-bottom: 8px;
}

.followup-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
  max-height: 440px;
  overflow-y: auto;
}

.followup-item {
  background: var(--n-card-color, rgba(128, 128, 128, 0.06));
  border-radius: 6px;
  padding: 6px 10px;
}

.followup-q {
  color: var(--n-text-color-2);
}

.followup-a {
  margin-top: 4px;
}

.followup-a-label {
  font-weight: 500;
  margin-bottom: 2px;
}

.followup-row {
  display: flex;
  gap: 8px;
}

/* 例题库 */
.bank-collapse {
  margin-top: 16px;
}

.bank-loading {
  padding: 12px 0;
  display: flex;
  justify-content: center;
}

.bank-nav {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.bank-count {
  font-weight: 600;
  color: var(--n-text-color-2);
}

.bank-empty {
  color: var(--n-text-color-3);
  padding: 8px 0;
}

/* AI 生题面板 */
.ai-collapse {
  margin-top: 32px;
}
</style>
