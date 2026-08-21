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
  masteredCount: number
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

/** 排行方式：progress 按已掌握考点数；answer 按答题数 */
const mode = ref<'progress' | 'answer'>('progress')
const modeOptions = [
  { label: '按掌握', value: 'progress' },
  { label: '按答题数', value: 'answer' },
]

const medalIcons: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

const title = computed(() => (mode.value === 'answer' ? '答题排行榜' : '学习进度排行榜'))
const subtitle = computed(() =>
  mode.value === 'answer' ? '按「答题数」排名' : '按「已掌握」考点数排名',
)

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
  if (mode.value === 'answer') {
    return [
      ...base,
      {
        title: '答题数',
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
      title: '已掌握',
      key: 'masteredCount',
      align: 'center' as const,
      render: (row: LeaderboardRow) =>
        h(
          NTag,
          { size: 'small', type: 'success', bordered: false },
          { default: () => `${(row as ProgressRow).masteredCount} / ${totalPointCount}` },
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
    const params = mode.value === 'answer' ? '?type=answer' : ''
    list.value = await api<LeaderboardRow[]>(`/progress/leaderboard${params}`)
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
        <n-empty v-if="!loading && list.length === 0" description="暂时还没有学习用户" />
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
