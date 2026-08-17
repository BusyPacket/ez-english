<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { api } from '@/api/http'
import type { ExamPaper, ExamPart } from '@/types/exam'

const paper = ref<ExamPaper | null>(null)
const loading = ref(true)
const error = ref('')
const optionLetters = ['A', 'B', 'C', 'D']

const totalQuestions = computed(() => {
  if (!paper.value) return 0
  let count = 0
  for (const part of paper.value.parts) {
    for (const block of part.blocks) {
      count += block.passages?.reduce((sum, p) => sum + p.questions.length, 0) ?? 0
      count += block.questions?.length ?? 0
    }
  }
  return count
})

function partScore(part: ExamPart) {
  return part.blocks.map((b) => b.score).join(' + ')
}

onMounted(async () => {
  loading.value = true
  try {
    paper.value = await api<ExamPaper>('/papers/2025')
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="paper-page">
    <n-card v-if="loading" class="paper-header">
      <n-spin />
    </n-card>
    <n-alert v-else-if="error" type="error" :title="error" />
    <template v-else-if="paper">
      <n-card class="paper-header">
        <n-h2>2025 年浙江专升本英语真题</n-h2>
        <n-p>{{ paper.title }}</n-p>
        <n-space>
          <n-tag type="info">{{ paper.year }} 年真题</n-tag>
          <n-tag type="warning">总分 150 分</n-tag>
          <n-tag>考试时长 150 分钟</n-tag>
          <n-tag>题目 {{ totalQuestions }} 道</n-tag>
        </n-space>
      </n-card>

      <n-collapse :default-expanded-names="['reading']">
        <n-collapse-item v-for="part in paper.parts" :key="part.id" :name="part.id"
          :title="`${part.title}（${part.score}）`">
          <div v-for="block in part.blocks" :key="block.id" class="block">
            <div class="block-header">
              <strong>{{ block.title }}</strong>
              <n-tag size="small" type="info">{{ block.score }}</n-tag>
            </div>

            <n-p v-if="block.directions" class="directions">{{ block.directions }}</n-p>

            <div v-for="passage in block.passages" :key="passage.title" class="passage">
              <div class="passage-title">{{ passage.title }}</div>
              <n-card size="small" :bordered="true" class="passage-content">
                <pre>{{ passage.content }}</pre>
              </n-card>

              <div v-for="q in passage.questions" :key="q.no" class="question">
                <div class="q-no">{{ q.no }}.</div>
                <div class="q-body">
                  <div v-if="q.stem" class="q-stem">{{ q.stem }}</div>
                  <ul v-if="q.choices" class="q-choices">
                    <li v-for="(choice, i) in q.choices" :key="i">
                      <span class="opt-letter">{{ optionLetters[i] }}</span>
                      {{ choice }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div v-for="q in block.questions" :key="q.no" class="question">
              <div class="q-no">{{ q.no }}.</div>
              <div class="q-body">
                <div v-if="q.stem" class="q-stem" style="white-space: pre-line">{{ q.stem }}</div>
                <ul v-if="q.choices" class="q-choices">
                  <li v-for="(choice, i) in q.choices" :key="i">
                    <span class="opt-letter">{{ optionLetters[i] }}</span>
                    {{ choice }}
                  </li>
                </ul>
              </div>
            </div>

            <div v-if="block.optionBank" class="option-bank">
              <div class="bank-title">选项 / 词库：</div>
              <n-space wrap :size="4">
                <n-tag v-for="opt in block.optionBank" :key="opt" size="small" :bordered="true">
                  {{ opt }}
                </n-tag>
              </n-space>
            </div>
          </div>
        </n-collapse-item>
      </n-collapse>
    </template>
  </div>
</template>

<style scoped>
.paper-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 16px;
}

.paper-header {
  margin-bottom: 16px;
}

.block {
  padding: 12px 0;
}

.block-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.directions {
  color: var(--n-text-color-3);
  font-size: 13px;
}

.passage {
  margin-top: 12px;
}

.passage-title {
  font-weight: 600;
  margin-bottom: 6px;
}

.passage-content pre {
  white-space: pre-wrap;
  word-break: break-word;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.7;
  margin: 0;
}

.question {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding: 8px 10px;
  border-radius: 6px;
  background: var(--n-card-color, rgba(128, 128, 128, 0.06));
}

.q-no {
  font-weight: 600;
  min-width: 22px;
}

.q-body {
  flex: 1;
}

.q-stem {
  font-weight: 500;
}

.q-choices {
  list-style: none;
  margin: 6px 0 0;
  padding: 0;
}

.q-choices li {
  margin: 2px 0;
}

.opt-letter {
  font-weight: 600;
  margin-right: 4px;
}

.option-bank {
  margin-top: 12px;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px dashed var(--n-border-color, #ccc);
}

.bank-title {
  font-weight: 600;
  margin-bottom: 6px;
  font-size: 13px;
}
</style>
