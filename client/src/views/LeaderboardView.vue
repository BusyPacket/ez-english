<script setup lang="ts">
import { h, onMounted, ref } from 'vue'
import { useMessage } from 'naive-ui'
import { NProgress, NTag, type DataTableColumns } from 'naive-ui'
import { totalPointCount } from '@ez-english/shared'
import { api } from '@/api/http'

interface LeaderboardRow {
    rank: number
    userId: string
    name: string
    maskedEmail: string
    masteredCount: number
    percent: number
}

const message = useMessage()
const list = ref<LeaderboardRow[]>([])
const loading = ref(false)
const error = ref('')

const medalIcons: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

const columns: DataTableColumns<LeaderboardRow> = [
    {
        title: '排名',
        key: 'rank',
        width: 70,
        align: 'center',
        render: (row) => (medalIcons[row.rank] ? `${medalIcons[row.rank]} ${row.rank}` : `#${row.rank}`),
    },
    { title: '用户', key: 'name' },
    {
        title: '已掌握',
        key: 'masteredCount',
        align: 'center',
        render: (row) =>
            h(
                NTag,
                { size: 'small', type: 'success', bordered: false },
                { default: () => `${row.masteredCount} / ${totalPointCount}` },
            ),
    },
    {
        title: '完成度',
        key: 'percent',
        render: (row) =>
            h(NProgress, {
                type: 'line',
                percentage: row.percent,
                height: 10,
                borderRadius: 5,
                indicatorPlacement: 'outside',
                color: row.percent >= 70 ? '#18a058' : row.percent >= 30 ? '#f0a020' : '#d03050',
            }),
    },
]

onMounted(async () => {
    loading.value = true
    try {
        list.value = await api<LeaderboardRow[]>('/progress/leaderboard')
    } catch (e) {
        error.value = (e as Error).message
        message.error(error.value)
    } finally {
        loading.value = false
    }
})
</script>

<template>
    <div class="leaderboard-page">
        <n-card>
            <n-h2>学习进度排行榜</n-h2>
            <n-p class="sub">按「已掌握」考点数排名，进度由后端实时统计。</n-p>
            <n-alert v-if="error" type="error" :title="error" />
            <n-spin :show="loading">
                <n-empty v-if="!loading && list.length === 0" description="暂时还没有学习用户" />
                <n-data-table v-else :columns="columns" :data="list" :bordered="false" :row-key="(row) => row.userId" />
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
</style>
