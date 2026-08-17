<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/api/http'
import type { ExamPaper, ExamPart } from '@/types/exam'

const route = useRoute()
const paper = ref<ExamPaper | null>(null)
const years = ref<{ year: number; title: string }[]>([])
const selectedYear = ref(2025)
const loading = ref(true)
const error = ref('')
const showAnswer = ref(false)
const optionLetters = ['A', 'B', 'C', 'D']
const expandedNames = ref<string[]>(['reading'])
const highlightBlock = ref('')

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

async function loadPaper(year: number) {
  loading.value = true
  error.value = ''
  try {
    paper.value = await api<ExamPaper>(`/papers/${year}`)
    const targetBlock = route.query.block as string | undefined
    if (targetBlock) {
      const targetPart =
        (route.query.part as string) ||
        paper.value.parts.find((p) => p.blocks.some((b) => b.id === targetBlock))?.id
      if (targetPart) expandedNames.value = [targetPart]
      highlightBlock.value = targetBlock
      nextTick(() => {
        document.getElementById(`block-${targetBlock}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    loading.value = false
  }
}

function switchYear(year: number) {
  if (year === selectedYear.value) return
  selectedYear.value = year
  highlightBlock.value = ''
  loadPaper(year)
}

interface TocItem {
  partId: string
  blockId: string
  label: string
}

/** 目录：所有题型及其题号范围 */
const tocItems = computed<TocItem[]>(() => {
  if (!paper.value) return []
  const items: TocItem[] = []
  for (const part of paper.value.parts) {
    for (const block of part.blocks) {
      const nos: number[] = []
      block.passages?.forEach((p) => p.questions.forEach((q) => nos.push(q.no)))
      block.questions?.forEach((q) => nos.push(q.no))
      const type = block.type ?? ''
      const range = nos.length ? `${Math.min(...nos)}-${Math.max(...nos)}` : ''
      items.push({
        partId: part.id,
        blockId: block.id,
        label: range ? `${type} ${range}` : block.title,
      })
    }
  }
  return items
})

/** 目录跳转：展开所在 Part 并滚动到对应题型 */
function jumpToBlock(partId: string, blockId: string) {
  expandedNames.value = [partId]
  highlightBlock.value = blockId
  // 等 collapse 内容渲染完成后再滚动（n-collapse 折叠内容为懒渲染）
  nextTick(() => {
    setTimeout(() => {
      document.getElementById(`block-${blockId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 150)
  })
}

onMounted(async () => {
  try {
    years.value = await api<{ year: number; title: string }[]>('/papers')
  } catch {
    years.value = []
  }
  await loadPaper(selectedYear.value)
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
        <n-h2>{{ selectedYear }} 年浙江专升本英语真题</n-h2>
        <n-p>{{ paper.title }}</n-p>
        <n-space vertical :size="12">
          <n-space>
            <n-button-group size="small">
              <n-button v-for="y in years" :key="y.year" :type="selectedYear === y.year ? 'primary' : 'default'"
                :secondary="selectedYear !== y.year" @click="switchYear(y.year)">
                {{ y.year }} 年
              </n-button>
            </n-button-group>
          </n-space>
          <n-space>
            <n-tag type="info">{{ paper.year }} 年真题</n-tag>
            <n-tag type="warning">总分 150 分</n-tag>
            <n-tag>考试时长 150 分钟</n-tag>
            <n-tag>题目 {{ totalQuestions }} 道</n-tag>
          </n-space>
          <div class="answer-toggle">
            <n-switch v-model:value="showAnswer" size="small" />
            <span>显示答案</span>
          </div>
        </n-space>
      </n-card>

      <n-card class="toc-card" size="small">
        <div class="toc-title">📑 目录</div>
        <n-space wrap :size="8">
          <n-button v-for="item in tocItems" :key="item.blockId" size="small"
            :type="highlightBlock === item.blockId ? 'primary' : 'default'" :secondary="highlightBlock !== item.blockId"
            @click="jumpToBlock(item.partId, item.blockId)">
            {{ item.label }}
          </n-button>
        </n-space>
      </n-card>

      <n-collapse v-model:expanded-names="expandedNames">
        <n-collapse-item v-for="part in paper.parts" :key="part.id" :name="part.id"
          :title="`${part.title}（${part.score}）`">
          <div v-for="block in part.blocks" :key="block.id" :id="'block-' + block.id" class="block"
            :class="{ 'block-highlight': highlightBlock === block.id }">
            <div class="block-header">
              <n-space :size="8" align="center">
                <n-tag v-if="block.type" size="small" type="success" :bordered="false">{{ block.type }}</n-tag>
                <strong>{{ block.title }}</strong>
              </n-space>
              <n-tag size="small" type="info">{{ block.score }}</n-tag>
            </div>

            <n-p v-if="block.directions" class="directions">{{ block.directions }}</n-p>

            <div v-for="passage in block.passages" :key="passage.title" class="passage">
              <div class="passage-title">{{ passage.title }}</div>
              <n-card size="small" :bordered="true" class="passage-content">
                <pre>{{ passage.content }}</pre>
              </n-card>

              <template v-for="q in passage.questions" :key="q.no">
                <div v-if="q.stem || q.choices || showAnswer" class="question">
                  <div class="q-no">{{ q.no }}.</div>
                  <div class="q-body">
                    <div v-if="q.stem" class="q-stem">{{ q.stem }}</div>
                    <ul v-if="q.choices" class="q-choices">
                      <li v-for="(choice, i) in q.choices" :key="i">
                        <span class="opt-letter">{{ optionLetters[i] }}</span>
                        {{ choice }}
                      </li>
                    </ul>
                    <div v-if="showAnswer && q.answer" class="q-answer">
                      <n-tag size="small" type="success" :bordered="false">答案</n-tag>
                      {{ q.answer }}
                    </div>
                    <div v-if="showAnswer && q.point" class="q-meta">
                      <n-tag size="small" type="info" :bordered="false">考点</n-tag>
                      {{ q.point }}
                    </div>
                    <div v-if="showAnswer && q.analysis" class="q-analysis">
                      <n-tag size="small" type="warning" :bordered="false">解析</n-tag>
                      {{ q.analysis }}
                    </div>
                  </div>
                </div>
              </template>
            </div>

            <template v-for="q in block.questions" :key="q.no">
              <div v-if="q.stem || q.choices || showAnswer" class="question">
                <div class="q-no">{{ q.no }}.</div>
                <div class="q-body">
                  <div v-if="q.stem" class="q-stem" style="white-space: pre-line">{{ q.stem }}</div>
                  <ul v-if="q.choices" class="q-choices">
                    <li v-for="(choice, i) in q.choices" :key="i">
                      <span class="opt-letter">{{ optionLetters[i] }}</span>
                      {{ choice }}
                    </li>
                  </ul>
                  <div v-if="showAnswer && q.answer" class="q-answer">
                    <n-tag size="small" type="success" :bordered="false">答案</n-tag>
                    {{ q.answer }}
                  </div>
                  <div v-if="showAnswer && q.point" class="q-meta">
                    <n-tag size="small" type="info" :bordered="false">考点</n-tag>
                    {{ q.point }}
                  </div>
                  <div v-if="showAnswer && q.analysis" class="q-analysis">
                    <n-tag size="small" type="warning" :bordered="false">解析</n-tag>
                    {{ q.analysis }}
                  </div>
                </div>
              </div>
            </template>

            <div v-if="block.optionBank" class="option-bank">
              <div class="bank-title">选项 / 词库：</div>
              <n-space wrap :size="4">
                <n-tag v-for="opt in block.optionBank" :key="opt" size="small" :bordered="true">
                  {{ opt }}
                </n-tag>
              </n-space>
            </div>
            <div v-if="showAnswer && block.answers" class="q-answer">
              <n-tag size="small" type="success" :bordered="false">答案</n-tag>
              {{ block.answers }}
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

.toc-card {
  margin-bottom: 16px;
  background: color-mix(in srgb, var(--n-primary-color) 4%, transparent);
}

.toc-title {
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 14px;
}

.block {
  padding: 12px 0;
  scroll-margin-top: 16px;
}

.block-highlight {
  border: 2px solid var(--n-success-color);
  border-radius: 8px;
  padding: 10px 12px;
  background: color-mix(in srgb, var(--n-success-color) 7%, transparent);
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

.answer-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  font-size: 13px;
}

.q-answer {
  margin-top: 6px;
  color: var(--n-success-color);
  font-weight: 500;
}

.q-meta {
  margin-top: 6px;
  color: var(--n-info-color);
  font-weight: 500;
}

.q-analysis {
  margin-top: 4px;
  color: var(--n-text-color-3);
  font-size: 13px;
  line-height: 1.7;
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
