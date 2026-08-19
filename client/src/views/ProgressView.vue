<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { knowledgeSections, STATUS_OPTIONS, type KnowledgeStatus } from '@/data/knowledgePoints'
import { useProgressStore } from '@/stores/progress'

const router = useRouter()
const progressStore = useProgressStore()

// 挂载时从后端拉取当前用户的学习进度与汇总（百分比由后端计算）
onMounted(() => {
  progressStore.syncFromServer()
  progressStore.fetchSummary()
})

const totalPointCount = computed(() => progressStore.summary?.total ?? 0)
const learnedCount = computed(() => progressStore.summary?.counts.learned ?? 0)
const masteredCount = computed(() => progressStore.summary?.counts.mastered ?? 0)
const percent = computed(() => progressStore.summary?.masteredPercent ?? 0)
const progressColor = computed(() => {
  if (percent.value >= 70) return '#18a058'
  if (percent.value >= 30) return '#f0a020'
  return '#d03050'
})

function onStatusChange(pointId: string, value: string | number | null) {
  if (typeof value === 'string') {
    progressStore.setStatus(pointId, value as KnowledgeStatus)
  }
}

/** 跳转到练习页，带入考点 id 与标题 */
function openPractice(id: string, title: string) {
  router.push({ path: '/practice', query: { point: id, title } })
}
</script>

<template>
  <div class="progress-page">
    <n-card class="summary">
      <n-space align="center" justify="space-between">
        <n-h2>学习进度</n-h2>
        <n-space>
          <n-tag>总考点 {{ totalPointCount }}</n-tag>
          <n-tag type="success">已掌握 {{ masteredCount }}</n-tag>
        </n-space>
      </n-space>
      <n-progress type="line" :percentage="percent" :color="progressColor" indicator-placement="outside" />
    </n-card>

    <n-collapse :default-expanded-names="knowledgeSections.map((s) => s.id)">
      <n-collapse-item v-for="section in knowledgeSections" :key="section.id" :name="section.id" :title="section.title">
        <n-space vertical>
          <template v-for="point in section.points" :key="point.id">
            <template v-if="point.children?.length">
              <div class="point-group">{{ point.title }}</div>
              <div v-for="child in point.children" :key="child.id" class="point-row point-row-sub">
                <span class="point-title" @click="openPractice(child.id, child.title)">{{ child.title }}</span>
                <n-button size="tiny" secondary class="practice-btn" @click="openPractice(child.id, child.title)">
                  练习
                </n-button>
                <n-select class="point-select" size="small" style="width: 120px"
                  :value="progressStore.getStatus(child.id)" :options="STATUS_OPTIONS"
                  @update:value="(value) => onStatusChange(child.id, value)" />
              </div>
            </template>
            <div v-else class="point-row">
              <span class="point-title" @click="openPractice(point.id, point.title)">{{ point.title }}</span>
              <n-button size="tiny" secondary class="practice-btn" @click="openPractice(point.id, point.title)">
                练习
              </n-button>
              <n-select class="point-select" size="small" style="width: 120px"
                :value="progressStore.getStatus(point.id)" :options="STATUS_OPTIONS"
                @update:value="(value) => onStatusChange(point.id, value)" />
            </div>
          </template>
        </n-space>
      </n-collapse-item>
    </n-collapse>
  </div>
</template>

<style scoped>
.progress-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 16px;
}

.summary {
  margin-bottom: 50px;
}

.summary-detail {
  margin-top: 8px;
  font-weight: 500;
}

.point-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 8px;
}

/* 考点标题可点击跳转练习页 */
.point-title {
  font-weight: 500;
  cursor: pointer;
}

/* hover：标题变绿加粗 */
.point-title:hover {
  color: #18a058;
  font-weight: 600;
}

.practice-btn {
  flex-shrink: 0;
}

/* 状态选择器靠右，练习按钮贴近标题 */
.point-select {
  margin-left: auto;
}

/* 词类分组标题：相对「词汇」缩进 */
.point-group {
  font-weight: 600;
  color: var(--n-text-color-2);
  padding: 8px 0 2px 22px;
  font-size: 0.875rem;
}

/* 二级考点：相对分组标题再缩进 */
.point-row-sub {
  padding-left: 44px;
}
</style>
