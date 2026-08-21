<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMessage } from 'naive-ui'
import { api } from '@/api/http'
import MarkdownView from './MarkdownView.vue'

/** 可答题题目结构（AI 生成题 / 例题库通用） */
export interface AnswerableQuestion {
  stem?: string
  choices?: string[]
  answer?: string
  point?: string
  analysis?: string
}

const props = defineProps<{
  question: AnswerableQuestion | null
  questionType: 'single' | 'judge' | 'fill'
  pointId: string
  pointTitle: string
}>()

const message = useMessage()
const optionLetters = ['A', 'B', 'C', 'D']

// —— 答题状态 ——
const selectedChoice = ref<number | null>(null)
const judgeChoice = ref<'正确' | '错误' | null>(null)
const fillInput = ref('')
const submitted = ref(false)
const isCorrect = ref(false)

function resetAnswer() {
  selectedChoice.value = null
  judgeChoice.value = null
  fillInput.value = ''
  submitted.value = false
  isCorrect.value = false
}

/** 归一化：去空白、句点、转小写，用于答案比较 */
function normalize(s?: string): string {
  return (s ?? '')
    .trim()
    .toLowerCase()
    .replace(/[。．.\s]/g, '')
}

/** 判断题答案归一化：正确/T/True/对 → right；错误/F/False/错 → wrong */
function judgeValue(s?: string): string {
  const v = normalize(s)
  if (['正确', 't', 'true', '对'].includes(v)) return 'right'
  if (['错误', 'f', 'false', '错'].includes(v)) return 'wrong'
  return v
}

/** 选择题选项是否命中正确答案（用于提交后高亮） */
function isChoiceCorrect(i: number): boolean {
  return normalize(optionLetters[i]) === normalize(props.question?.answer)
}

function pickChoice(i: number) {
  if (submitted.value) return
  selectedChoice.value = i
}

/** 提交答案并判分 */
function submitAnswer() {
  const q = props.question
  if (!q || submitted.value) return
  let correct = false
  if (props.questionType === 'single') {
    if (selectedChoice.value === null) {
      message.warning('请先选择答案')
      return
    }
    correct = normalize(optionLetters[selectedChoice.value]) === normalize(q.answer)
  } else if (props.questionType === 'judge') {
    if (!judgeChoice.value) {
      message.warning('请先选择正确或错误')
      return
    }
    correct = judgeValue(judgeChoice.value) === judgeValue(q.answer)
  } else {
    if (!fillInput.value.trim()) {
      message.warning('请输入答案')
      return
    }
    correct = normalize(fillInput.value) === normalize(q.answer)
  }
  isCorrect.value = correct
  submitted.value = true
  // 上报答题数（后台统计，失败不影响答题体验）
  void api('/profile/answer', { method: 'POST' }).catch(() => {})
}

// —— 收藏 ——
const favoriting = ref(false)
const favoriteId = ref<string | null>(null)

async function toggleFavorite() {
  const q = props.question
  if (!q || favoriting.value) return
  favoriting.value = true
  try {
    if (favoriteId.value) {
      await api(`/favorites/${favoriteId.value}`, { method: 'DELETE' })
      favoriteId.value = null
      message.success('已取消收藏')
    } else {
      const res = await api<{ id: string }>('/favorites', {
        method: 'POST',
        body: JSON.stringify({
          pointId: props.pointId,
          pointTitle: props.pointTitle,
          type: props.questionType,
          stem: q.stem,
          choices: q.choices,
          answer: q.answer,
          analysis: q.analysis,
        }),
      })
      favoriteId.value = res.id
      message.success('已收藏')
    }
  } catch (e) {
    message.error((e as Error).message)
  } finally {
    favoriting.value = false
  }
}

// —— 追问 ——
const followUpInput = ref('')
const followUpAsking = ref(false)
const followUpList = ref<{ question: string; reply: string }[]>([])
const followUpMessages = ref<{ role: 'user' | 'assistant'; content: string }[]>([])

/** 题目的可读上下文文本（供追问携带） */
function questionContext(q: AnswerableQuestion): string {
  const parts = [`题目：${q.stem}`]
  if (q.choices?.length) {
    parts.push(`选项：${q.choices.map((c, i) => `${optionLetters[i]}. ${c}`).join('；')}`)
  }
  parts.push(`答案：${q.answer}`)
  if (q.analysis) parts.push(`解析：${q.analysis}`)
  return parts.join('\n')
}

/** 追问：携带此前多轮上下文，回答用户新问题 */
async function askFollowUp() {
  const question = followUpInput.value.trim()
  const q = props.question
  if (!question || followUpAsking.value || !q) return
  followUpAsking.value = true
  try {
    const res = await api<{ reply: string }>('/ai/follow-up', {
      method: 'POST',
      body: JSON.stringify({
        point: props.pointId,
        type: props.questionType,
        history: followUpMessages.value,
        question,
      }),
    })
    followUpMessages.value.push(
      { role: 'user', content: question },
      { role: 'assistant', content: res.reply },
    )
    followUpList.value.push({ question, reply: res.reply })
    followUpInput.value = ''
  } catch (e) {
    message.error((e as Error).message)
  } finally {
    followUpAsking.value = false
  }
}

// 题目切换时重置答题/收藏/追问状态，并以新题为追问上下文起点
watch(
  () => props.question,
  (q) => {
    resetAnswer()
    favoriteId.value = null
    followUpList.value = []
    followUpInput.value = ''
    followUpMessages.value = q
      ? [{ role: 'assistant', content: '已生成题目：\n' + questionContext(q) }]
      : []
  },
  { immediate: true },
)
</script>

<template>
  <div v-if="question" class="question-card">
    <div class="gen-stem">{{ question.stem }}</div>

    <!-- 单选题：可点击选项 -->
    <div v-if="question.choices" class="gen-choices">
      <div
        v-for="(choice, i) in question.choices"
        :key="i"
        class="choice"
        :class="{
          selected: selectedChoice === i,
          'correct-choice': submitted && isChoiceCorrect(i),
          'wrong-choice': submitted && selectedChoice === i && !isChoiceCorrect(i),
        }"
        @click="pickChoice(i)"
      >
        <span class="opt-letter">{{ optionLetters[i] }}</span>
        {{ choice }}
        <span v-if="!submitted && selectedChoice === i" class="choice-selected-mark">✓</span>
        <span v-if="submitted && isChoiceCorrect(i)" class="choice-tag tag-correct">
          {{ selectedChoice === i ? '✓ 正确' : '✓ 正确答案' }}
        </span>
        <span v-else-if="submitted && selectedChoice === i" class="choice-tag tag-wrong"
          >✗ 你的选择</span
        >
      </div>
    </div>

    <!-- 判断题 -->
    <div v-else-if="questionType === 'judge'" class="judge-row">
      <n-button
        size="small"
        :type="judgeChoice === '正确' ? 'primary' : 'default'"
        :disabled="submitted"
        @click="judgeChoice = '正确'"
        >正确</n-button
      >
      <n-button
        size="small"
        :type="judgeChoice === '错误' ? 'primary' : 'default'"
        :disabled="submitted"
        @click="judgeChoice = '错误'"
        >错误</n-button
      >
    </div>

    <!-- 填空题 -->
    <div v-else class="fill-row">
      <n-input
        v-model:value="fillInput"
        size="small"
        placeholder="请输入答案"
        style="max-width: 320px"
        :disabled="submitted"
        @keyup.enter="submitAnswer"
      />
    </div>

    <div class="gen-actions">
      <n-button
        size="small"
        :loading="favoriting"
        :type="favoriteId ? 'warning' : 'default'"
        @click="toggleFavorite"
      >
        {{ favoriteId ? '★ 已收藏' : '☆ 收藏' }}
      </n-button>
      <n-button v-if="!submitted" size="small" type="primary" @click="submitAnswer"
        >提交答案</n-button
      >
      <n-button v-else size="small" @click="resetAnswer">重新作答</n-button>
    </div>

    <!-- 提交后判分结果 -->
    <div
      v-if="submitted"
      class="gen-result"
      :class="isCorrect ? 'gen-result-ok' : 'gen-result-err'"
    >
      {{ isCorrect ? '✅ 回答正确' : `❌ 回答错误，正确答案：${question.answer}` }}
    </div>

    <template v-if="submitted">
      <div v-if="question.answer" class="gen-answer">答案：{{ question.answer }}</div>
      <div v-if="question.point" class="gen-point">考点：{{ question.point }}</div>
      <div v-if="question.analysis" class="gen-analysis">解析：{{ question.analysis }}</div>
    </template>

    <!-- 追问 -->
    <div class="followup-block">
      <div class="followup-label">💬 追问</div>
      <div v-if="followUpList.length" class="followup-list">
        <div v-for="(item, i) in followUpList" :key="i" class="followup-item">
          <div class="followup-q">问：{{ item.question }}</div>
          <div class="followup-a">
            <div class="followup-a-label">答：</div>
            <MarkdownView :content="item.reply" />
          </div>
        </div>
      </div>
      <div class="followup-row">
        <n-input
          v-model:value="followUpInput"
          size="small"
          placeholder="输入问题，追问这道题…"
          :disabled="followUpAsking"
          @keyup.enter="askFollowUp"
        />
        <n-button size="small" :loading="followUpAsking" @click="askFollowUp">追问</n-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  border-color: #18a058;
  background: rgba(24, 160, 88, 0.1);
  font-weight: 600;
}

.choice.selected .opt-letter {
  color: #18a058;
}

.choice-selected-mark {
  float: right;
  color: #18a058;
  font-weight: 700;
}

.choice.correct-choice {
  border-color: #18a058;
  background: rgba(24, 160, 88, 0.1);
}

.choice.wrong-choice {
  border-color: #d03050;
  background: rgba(208, 48, 80, 0.1);
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

.followup-block {
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
}

.followup-item {
  border-left: 3px solid var(--n-primary-color);
  padding-left: 10px;
}

.followup-q {
  font-weight: 500;
  margin-bottom: 4px;
}

.followup-a {
  display: flex;
  gap: 6px;
}

.followup-a-label {
  flex-shrink: 0;
  color: var(--n-text-color-3);
}

.followup-row {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
</style>
