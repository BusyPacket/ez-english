<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useMessage } from 'naive-ui'
import dayjs from 'dayjs'
import { api } from '@/api/http'

/** 错题（后端返回题目详情 + 错答信息，仅当前用户可见） */
interface WrongQuestion {
  id: string
  type: string
  pointId: string
  pointTitle: string | null
  stem: string
  choices: string[]
  answer: string
  analysis: string | null
  /** 最近一次答错的答案 */
  lastWrongAnswer: string
  /** 累计答错次数 */
  wrongCount: number
  /** 最近一次做错时间 */
  updatedAt: string
}

const message = useMessage()
const list = ref<WrongQuestion[]>([])
const loading = ref(false)
const expanded = ref<Record<string, boolean>>({})
const optionLetters = ['A', 'B', 'C', 'D']
const typeLabels: Record<string, string> = { single: '单选题', fill: '填空题', judge: '判断题' }

async function fetchList() {
  loading.value = true
  try {
    list.value = await api<WrongQuestion[]>('/questions/wrong')
  } catch (e) {
    message.error((e as Error).message)
  } finally {
    loading.value = false
  }
}

function toggleExpand(id: string) {
  expanded.value[id] = !expanded.value[id]
}

/** 移出错题本：之后再次做错会重新记录 */
async function removeWrong(id: string) {
  try {
    await api(`/questions/wrong/${id}`, { method: 'DELETE' })
    list.value = list.value.filter((w) => w.id !== id)
    message.success('已移出错题本')
  } catch (e) {
    message.error((e as Error).message)
  }
}

onMounted(fetchList)
</script>

<template>
  <div class="wrong-page">
    <n-card class="wrong-header">
      <n-space align="center" justify="space-between">
        <n-h2>我的错题</n-h2>
        <n-tag type="error" :bordered="false">共 {{ list.length }} 题</n-tag>
      </n-space>
    </n-card>

    <n-spin :show="loading">
      <n-empty
        v-if="!loading && !list.length"
        description="还没有错题，继续保持"
        class="wrong-empty"
      />
      <n-card v-for="w in list" :key="w.id" class="wrong-card" size="small">
        <div class="wrong-meta">
          <n-tag size="small" type="error" :bordered="false">{{
            typeLabels[w.type] ?? w.type
          }}</n-tag>
          <n-tag v-if="w.pointTitle" size="small" type="info" :bordered="false">{{
            w.pointTitle
          }}</n-tag>
          <n-tag size="small" :bordered="false">错过 {{ w.wrongCount }} 次</n-tag>
          <span class="wrong-time">{{ dayjs(w.updatedAt).format('YYYY-MM-DD HH:mm') }}</span>
        </div>
        <div class="wrong-stem" @click="toggleExpand(w.id)">{{ w.stem }}</div>
        <!-- 选项属于题面，始终展示（不被「查看答案」折叠隐藏） -->
        <ul v-if="w.choices?.length" class="wrong-choices">
          <li v-for="(c, i) in w.choices" :key="i">
            <span class="opt-letter">{{ optionLetters[i] }}</span>
            {{ c }}
          </li>
        </ul>
        <template v-if="expanded[w.id]">
          <div class="wrong-mine">你的答案：{{ w.lastWrongAnswer }}</div>
          <div class="wrong-answer">正确答案：{{ w.answer }}</div>
          <div v-if="w.analysis" class="wrong-analysis">解析：{{ w.analysis }}</div>
        </template>
        <div class="wrong-actions">
          <n-button size="tiny" secondary @click="toggleExpand(w.id)">
            {{ expanded[w.id] ? '收起' : '查看答案' }}
          </n-button>
          <n-popconfirm
            @positive-click="removeWrong(w.id)"
            positive-text="确定"
            negative-text="取消"
          >
            <template #trigger>
              <n-button size="tiny" type="error" secondary>移出错题本</n-button>
            </template>
            确定把这道题移出错题本吗？之后再次做错会重新记录。
          </n-popconfirm>
        </div>
      </n-card>
    </n-spin>
  </div>
</template>

<style scoped>
.wrong-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 16px;
}

.wrong-header {
  margin-bottom: 16px;
}

.wrong-empty {
  margin-top: 60px;
}

.wrong-card {
  margin-bottom: 12px;
}

.wrong-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.wrong-time {
  margin-left: auto;
  font-size: 0.75rem;
  color: var(--n-text-color-3);
}

.wrong-stem {
  font-weight: 500;
  line-height: 1.6;
  cursor: pointer;
}

.wrong-choices {
  margin: 8px 0 0;
  padding-left: 0;
  list-style: none;
  color: var(--n-text-color-2);
  font-size: 0.875rem;
}

.wrong-choices li {
  display: flex;
  gap: 8px;
  line-height: 1.8;
}

.opt-letter {
  color: var(--n-text-color-3);
}

.wrong-mine {
  margin-top: 10px;
  color: var(--n-error-color);
  font-size: 0.875rem;
}

.wrong-answer {
  margin-top: 4px;
  color: var(--n-success-color);
  font-size: 0.875rem;
}

.wrong-analysis {
  margin-top: 4px;
  color: var(--n-text-color-2);
  font-size: 0.875rem;
  line-height: 1.7;
}

.wrong-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
</style>
