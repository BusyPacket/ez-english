<script setup lang="ts">
import { computed, h, onMounted, ref } from 'vue'
import { useMessage } from 'naive-ui'
import { NProgress, NTag, type DataTableColumns } from 'naive-ui'
import { totalPointCount } from '@ez-english/shared'
import { api } from '@/api/http'

interface ProgressRow {
  rank: number
  userId: string
  name: string
  maskedEmail: string
  learnedCount: number
  percent: number
}

interface AnswerRow {
  rank: number
  userId: string
  name: string
  maskedEmail: string
  answerCount: number
}

type LeaderboardRow = ProgressRow | AnswerRow

const message = useMessage()
const list = ref<LeaderboardRow[]>([])
const loading = ref(false)
const error = ref('')

type Mode = 'today' | 'answer' | 'progress'

/** 排行方式：today 今日答题数 / answer 累计答题数 / progress 已学习考点数（默认今日榜） */
const mode = ref<Mode>('today')
const modeOptions = [
  { label: '今日榜', value: 'today' },
  { label: '总榜', value: 'answer' },
  { label: '已学习', value: 'progress' },
]

const medalIcons: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

const isTodayMode = computed(() => mode.value === 'today')
const isAnswerMode = computed(() => mode.value === 'answer')

const title = computed(() => {
  if (isTodayMode.value) return '今日答题榜'
  return isAnswerMode.value ? '总答题榜' : '学习进度排行榜'
})
const subtitle = computed(() => {
  if (isTodayMode.value) return '按今日做题数排名，每天凌晨四点刷新'
  return isAnswerMode.value ? '按「累计答题数」排名' : '按「已学习」考点数排名'
})
const emptyText = computed(() => (isTodayMode.value ? '今天还没有人做题' : '暂时还没有学习用户'))

const columns = computed<DataTableColumns<LeaderboardRow>>(() => {
  const base = [
    {
      title: '排名',
      key: 'rank',
      width: 70,
      align: 'center' as const,
      render: (row: LeaderboardRow) =>
        medalIcons[row.rank] ? `${medalIcons[row.rank]} ${row.rank}` : `#${row.rank}`,
    },
    { title: '用户', key: 'name' },
  ]
  // 答题榜：今日榜 / 总榜
  if (mode.value !== 'progress') {
    return [
      ...base,
      {
        title: isTodayMode.value ? '今日答题数' : '累计答题数',
        key: 'answerCount',
        align: 'center' as const,
        render: (row: LeaderboardRow) =>
          h(
            NTag,
            { size: 'small', type: 'primary', bordered: false },
            { default: () => `${(row as AnswerRow).answerCount} 题` },
          ),
      },
    ]
  }
  return [
    ...base,
    {
      title: '已学习',
      key: 'learnedCount',
      align: 'center' as const,
      render: (row: LeaderboardRow) =>
        h(
          NTag,
          { size: 'small', type: 'success', bordered: false },
          { default: () => `${(row as ProgressRow).learnedCount} / ${totalPointCount}` },
        ),
    },
    {
      title: '完成度',
      key: 'percent',
      render: (row: LeaderboardRow) =>
        h(NProgress, {
          type: 'line',
          percentage: (row as ProgressRow).percent,
          height: 10,
          borderRadius: 5,
          indicatorPlacement: 'outside',
          color:
            (row as ProgressRow).percent >= 70
              ? '#18a058'
              : (row as ProgressRow).percent >= 30
                ? '#f0a020'
                : '#d03050',
        }),
    },
  ]
})

async function fetchLeaderboard() {
  loading.value = true
  error.value = ''
  try {
    list.value = await api<LeaderboardRow[]>(`/progress/leaderboard?type=${mode.value}`)
  } catch (e) {
    error.value = (e as Error).message
    message.error(error.value)
  } finally {
    loading.value = false
  }
}

onMounted(fetchLeaderboard)
</script>

<template>
  <div class="leaderboard-page">
    <n-card>
      <n-h2>{{ title }}</n-h2>
      <div class="toolbar">
        <n-p class="sub">{{ subtitle }}</n-p>
        <n-radio-group v-model:value="mode" @update:value="fetchLeaderboard">
          <n-radio-button v-for="opt in modeOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </n-radio-button>
        </n-radio-group>
      </div>
      <n-alert v-if="error" type="error" :title="error" />
      <n-spin :show="loading">
        <n-empty v-if="!loading && list.length === 0" :description="emptyText" />
        <n-data-table
          v-else
          :columns="columns"
          :data="list"
          :bordered="false"
          :row-key="(row) => row.userId"
        />
      </n-spin>
    </n-card>
  </div>
</template>

<style scoped>
.leaderboard-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 24px 16px;
}

.sub {
  color: var(--n-text-color-3);
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}
</style>
