<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { api, streamApi } from '@/api/http'
import { useUserStore } from '@/stores/user'
import MarkdownView from '@/components/MarkdownView.vue'
import { writingLessons } from '@/data/writingLessons'

const route = useRoute()
const router = useRouter()
const message = useMessage()
const userStore = useUserStore()

const pointTitle = computed(() => (route.query.title as string) ?? '写作练习')
const pointId = computed(() => (route.query.point as string) ?? '')

/** 是否「完整作文」考点：只有它进入后写整篇作文 */
const isFullEssay = computed(() => pointId.value === 'writing-essay')

/** 前 4 个专项考点的知识讲解（学习模式） */
const lesson = computed(() => writingLessons[pointId.value])

/** AI 可用性检查：试用期到期或未配置 key 时提示并拦截 */
function ensureAiAvailable(): boolean {
  if (userStore.aiAvailable) return true
  if (userStore.user?.trialExpired) {
    message.warning('7 天试用期已到，请联系管理员升级会员以继续使用 AI 功能')
  } else {
    message.warning('要使用 AI 功能必须先进行配置')
    router.push('/profile')
  }
  return false
}

// —— AI 生成作文题 ——
const generating = ref(false)
const topic = ref<{ stem: string; analysis: string | null } | null>(null)

const generateBtnText = computed(() => {
  if (generating.value) return '生成中'
  return topic.value ? '再来一题' : '生成作文题'
})

async function generateWriting() {
  if (generating.value) return
  if (!ensureAiAvailable()) return
  generating.value = true
  try {
    topic.value = await api<{ stem: string; analysis: string | null }>('/ai/generate-writing', {
      method: 'POST',
      body: JSON.stringify({ point: pointId.value }),
    })
    message.success('已生成作文题')
  } catch (e) {
    message.error((e as Error).message)
  } finally {
    generating.value = false
  }
}

// —— 作文输入 + AI 点评 ——
const essay = ref('')
const reviewing = ref(false)
const review = ref('')

async function reviewWriting() {
  if (reviewing.value) return
  if (!essay.value.trim()) {
    message.warning('请先写作文')
    return
  }
  if (!ensureAiAvailable()) return
  reviewing.value = true
  review.value = ''
  try {
    await streamApi(
      '/ai/review-writing',
      {
        method: 'POST',
        body: JSON.stringify({ essay: essay.value, topic: topic.value?.stem }),
      },
      (content) => {
        review.value += content
      },
    )
  } catch (e) {
    message.error((e as Error).message)
  } finally {
    reviewing.value = false
  }
}

onMounted(() => {
  if (userStore.isLoggedIn) void userStore.refreshAiAvailable()
})
</script>

<template>
  <div class="writing-page">
    <n-card class="writing-header">
      <n-space justify="space-between" align="center">
        <n-h2 class="writing-title">{{ pointTitle }}</n-h2>
        <n-button size="small" secondary @click="router.push('/progress')">返回进度</n-button>
      </n-space>
    </n-card>

    <!-- 专项考点：知识讲解 + 示例（学习模式） -->
    <n-card v-if="!isFullEssay && lesson" class="writing-card">
      <div class="lesson-intro">{{ lesson.intro }}</div>
      <div v-for="p in lesson.points" :key="p.title" class="lesson-point">
        <div class="lesson-point-title">{{ p.title }}</div>
        <div class="lesson-point-content">{{ p.content }}</div>
      </div>
      <div class="lesson-example">
        <div class="lesson-example-title">💡 {{ lesson.exampleTitle }}</div>
        <pre class="lesson-example-body">{{ lesson.example }}</pre>
      </div>
    </n-card>

    <!-- 完整作文：AI 生成作文题 + 写作文 + 点评 -->
    <template v-else-if="isFullEssay">
      <n-card class="writing-card" size="small" title="📝 AI 作文题">
        <div class="writing-topic">
          <div v-if="topic" class="topic-stem">{{ topic.stem }}</div>
          <div v-if="topic?.analysis" class="topic-analysis">💡 {{ topic.analysis }}</div>
          <div v-else class="topic-empty">点击下方按钮，AI 根据当前考点生成一道专升本作文题。</div>
        </div>
        <n-button type="primary" :loading="generating" @click="generateWriting">
          {{ generateBtnText }}
        </n-button>
      </n-card>

      <n-card class="writing-card" size="small" title="🖊️ 写作文">
        <n-input
          v-model:value="essay"
          type="textarea"
          :rows="8"
          placeholder="在这里写你的英语作文（约 100-120 词）…"
        />
        <div class="writing-actions">
          <n-button type="success" :loading="reviewing" @click="reviewWriting">AI 点评</n-button>
        </div>
        <div v-if="review" class="review-box">
          <div class="review-title">🤖 AI 点评</div>
          <MarkdownView :content="review" />
        </div>
      </n-card>
    </template>

    <n-empty v-else description="未找到该考点的内容" class="writing-empty" />
  </div>
</template>

<style scoped>
.writing-page {
  max-width: 820px;
  margin: 0 auto;
  padding: 24px 16px;
}

.writing-title {
  margin: 0;
}

.writing-card {
  margin-top: 16px;
}

.writing-empty {
  margin-top: 48px;
}

/* —— 专项考点讲解 —— */
.lesson-intro {
  font-size: 0.95rem;
  line-height: 1.7;
  color: #6b7280;
  padding: 4px 0 12px;
  border-bottom: 1px dashed var(--n-border-color);
}

.lesson-point {
  margin-top: 14px;
}

.lesson-point-title {
  font-weight: 700;
  margin-bottom: 4px;
}

.lesson-point-content {
  font-size: 0.93rem;
  line-height: 1.7;
  color: var(--n-text-color-2);
}

.lesson-example {
  margin-top: 18px;
  padding: 14px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--n-info-color) 6%, transparent);
}

.lesson-example-title {
  font-weight: 700;
  margin-bottom: 8px;
}

.lesson-example-body {
  margin: 0;
  font-family: inherit;
  font-size: 0.9rem;
  line-height: 1.7;
  white-space: pre-wrap;
  color: var(--n-text-color-2);
}

/* —— 完整作文 —— */
.writing-topic {
  margin-bottom: 14px;
  min-height: 40px;
}

.topic-stem {
  font-weight: 600;
  line-height: 1.7;
  white-space: pre-wrap;
}

.topic-analysis {
  margin-top: 8px;
  color: #6b7280;
  font-size: 0.92rem;
}

.topic-empty {
  color: #8a93a6;
  font-size: 0.92rem;
}

.writing-actions {
  margin-top: 12px;
}

.review-box {
  margin-top: 16px;
  padding: 14px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--n-success-color) 6%, transparent);
}

.review-title {
  font-weight: 700;
  margin-bottom: 8px;
}
</style>
