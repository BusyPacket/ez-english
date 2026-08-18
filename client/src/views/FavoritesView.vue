<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useMessage } from 'naive-ui'
import dayjs from 'dayjs'
import { api } from '@/api/http'

interface Favorite {
    id: string
    pointId: string
    pointTitle: string | null
    type: string
    stem: string
    choices: string[] | null
    answer: string
    analysis: string | null
    createdAt: string
}

const message = useMessage()
const list = ref<Favorite[]>([])
const loading = ref(false)
const expanded = ref<Record<string, boolean>>({})
const optionLetters = ['A', 'B', 'C', 'D']
const typeLabels: Record<string, string> = { single: '单选题', fill: '填空题', judge: '判断题' }

/** 选中的考点（'' 表示全部） */
const activePoint = ref('')

/** 分页 */
const page = ref(1)
const pageSize = 10

/** 当前页的收藏（基于筛选结果切片） */
const pagedList = computed(() => {
    const start = (page.value - 1) * pageSize
    return filteredList.value.slice(start, start + pageSize)
})

/** 切换考点时重置到第一页 */
function onPointSelect(p: string) {
    activePoint.value = p
    page.value = 1
}

/** 按考点分组的收藏（去重 + 计数） */
const pointGroups = computed(() => {
    const map = new Map<string, number>()
    for (const f of list.value) {
        const key = f.pointTitle || '未分类'
        map.set(key, (map.get(key) ?? 0) + 1)
    }
    return Array.from(map.entries()).map(([title, count]) => ({ title, count }))
})

/** 按选中考点过滤后的收藏 */
const filteredList = computed(() => {
    if (!activePoint.value) return list.value
    return list.value.filter((f) => (f.pointTitle || '未分类') === activePoint.value)
})

async function fetchList() {
    loading.value = true
    try {
        list.value = await api<Favorite[]>('/favorites')
    } catch (e) {
        message.error((e as Error).message)
    } finally {
        loading.value = false
    }
}

function toggleExpand(id: string) {
    expanded.value[id] = !expanded.value[id]
}

async function removeFavorite(id: string) {
    try {
        await api(`/favorites/${id}`, { method: 'DELETE' })
        list.value = list.value.filter((f) => f.id !== id)
        // 删除后若当前页超出总页数则回退到最后一页
        const totalPages = Math.max(1, Math.ceil(filteredList.value.length / pageSize))
        if (page.value > totalPages) page.value = totalPages
        message.success('已取消收藏')
    } catch (e) {
        message.error((e as Error).message)
    }
}

onMounted(fetchList)
</script>

<template>
    <div class="fav-page">
        <n-card class="fav-header">
            <n-space align="center" justify="space-between">
                <n-h2>我的收藏</n-h2>
                <n-tag>共 {{ list.length }} 题</n-tag>
            </n-space>
        </n-card>

        <div class="fav-layout">
            <aside class="fav-sidebar">
                <div class="fav-sidebar-title">📚 按考点</div>
                <div class="fav-sidebar-btns">
                    <button class="fav-filter-btn" :class="{ active: activePoint === '' }"
                        @click="onPointSelect('')">全部（{{ list.length }}）</button>
                    <button v-for="g in pointGroups" :key="g.title" class="fav-filter-btn"
                        :class="{ active: activePoint === g.title }" @click="onPointSelect(g.title)">{{ g.title }}（{{
                        g.count }}）</button>
                </div>
            </aside>
            <div class="fav-main">
                <n-spin :show="loading">
                    <n-empty v-if="!loading && !filteredList.length" description="该分类下暂无收藏" class="fav-empty" />
                    <n-card v-for="f in pagedList" :key="f.id" class="fav-card" size="small">
                        <div class="fav-meta">
                            <n-tag size="small" type="success" :bordered="false">{{ typeLabels[f.type] ?? f.type
                                }}</n-tag>
                            <n-tag v-if="f.pointTitle" size="small" type="info" :bordered="false">{{ f.pointTitle
                                }}</n-tag>
                            <span class="fav-time">{{ dayjs(f.createdAt).format('YYYY-MM-DD') }}</span>
                        </div>
                        <div class="fav-stem" @click="toggleExpand(f.id)">{{ f.stem }}</div>
                        <template v-if="expanded[f.id]">
                            <ul v-if="f.choices" class="fav-choices">
                                <li v-for="(c, i) in f.choices" :key="i">
                                    <span class="opt-letter">{{ optionLetters[i] }}</span>
                                    {{ c }}
                                </li>
                            </ul>
                            <div class="fav-answer">答案：{{ f.answer }}</div>
                            <div v-if="f.analysis" class="fav-analysis">解析：{{ f.analysis }}</div>
                        </template>
                        <div class="fav-actions">
                            <n-button size="tiny" secondary @click="toggleExpand(f.id)">
                                {{ expanded[f.id] ? '收起' : '查看答案' }}
                            </n-button>
                            <n-popconfirm @positive-click="removeFavorite(f.id)" positive-text="确定" negative-text="取消">
                                <template #trigger>
                                    <n-button size="tiny" type="error" secondary>取消收藏</n-button>
                                </template>
                                确定要取消收藏这道题吗？
                            </n-popconfirm>
                        </div>
                    </n-card>
                    <n-pagination v-if="filteredList.length > pageSize" class="fav-pagination" :page="page"
                        :page-size="pageSize" :item-count="filteredList.length" @update:page="(p) => (page = p)" />
                </n-spin>
            </div>
        </div>
    </div>
</template>

<style scoped>
.fav-page {
    max-width: 960px;
    margin: 0 auto;
    padding: 24px 16px;
}

.fav-header {
    margin-bottom: 16px;
}

.fav-layout {
    display: flex;
    align-items: flex-start;
    gap: 20px;
}

/* 左侧考点分类侧边栏：sticky 跟随滚动 */
.fav-sidebar {
    width: 190px;
    flex-shrink: 0;
    position: sticky;
    top: 72px;
    max-height: calc(100vh - 88px);
    overflow-y: auto;
    padding: 12px;
    border: 1px solid var(--n-border-color);
    border-radius: 8px;
    background: var(--n-card-color);
}

.fav-sidebar-title {
    font-weight: 600;
    margin-bottom: 10px;
    font-size: 0.875rem;
}

.fav-main {
    flex: 1;
    min-width: 0;
}

/* 分类按钮组：宽屏纵向 */
.fav-sidebar-btns {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

/* 分类按钮：绿色背景方框，选中实色绿底白字 */
.fav-filter-btn {
    display: block;
    width: 100%;
    text-align: left;
    padding: 6px 10px;
    border: 1px solid #18a058;
    border-radius: 6px;
    background: color-mix(in srgb, #18a058 10%, transparent);
    color: #18a058;
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s, border-color 0.2s;
}

.fav-filter-btn:hover {
    background: color-mix(in srgb, #18a058 18%, transparent);
}

.fav-filter-btn.active {
    background: #18a058;
    border-color: #18a058;
    color: #fff;
}

/* 移动端：侧边栏改为顶部横排分类按钮 */
@media (max-width: 768px) {
    .fav-layout {
        flex-direction: column;
        gap: 12px;
    }

    .fav-sidebar {
        width: 100%;
        position: static;
        max-height: none;
        padding: 10px 12px;
    }

    .fav-sidebar-btns {
        flex-direction: row;
        flex-wrap: wrap;
    }

    .fav-filter-btn {
        width: auto;
        flex-shrink: 0;
    }
}

.fav-card {
    margin-top: 12px;
}

.fav-pagination {
    margin-top: 16px;
    justify-content: flex-end;
}

.fav-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
}

.fav-time {
    color: var(--n-text-color-3);
    font-size: 0.75rem;
    margin-left: auto;
}

.fav-stem {
    font-weight: 500;
    cursor: pointer;
}

.fav-choices {
    list-style: none;
    margin: 8px 0 0;
    padding: 0;
}

.fav-choices li {
    margin: 2px 0;
}

.opt-letter {
    font-weight: 600;
    margin-right: 4px;
}

.fav-answer {
    margin-top: 8px;
    color: #18a058;
    font-weight: 500;
}

.fav-analysis {
    margin-top: 4px;
    color: var(--n-text-color-3);
    line-height: 1.7;
}

.fav-actions {
    margin-top: 10px;
    display: flex;
    gap: 8px;
}

.fav-empty {
    margin-top: 48px;
}
</style>
