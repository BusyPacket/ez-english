<script setup lang="ts">
import { computed } from 'vue'
import {
  knowledgeSections,
  STATUS_OPTIONS,
  totalPointCount,
  type KnowledgeStatus,
} from '@/data/knowledgePoints'
import { useProgressStore } from '@/stores/progress'

const progressStore = useProgressStore()

const learnedCount = computed(
  () => Object.values(progressStore.statuses).filter((s) => s === 'learned').length,
)
const masteredCount = computed(
  () => Object.values(progressStore.statuses).filter((s) => s === 'mastered').length,
)
const doneCount = computed(() => learnedCount.value + masteredCount.value)
const percent = computed(() => Math.round((doneCount.value / totalPointCount) * 100))
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
          <div v-for="point in section.points" :key="point.id" class="point-row">
            <span class="point-title">{{ point.title }}</span>
            <n-select size="small" style="width: 120px" :value="progressStore.getStatus(point.id)"
              :options="STATUS_OPTIONS" @update:value="(value) => onStatusChange(point.id, value)" />
          </div>
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
  justify-content: space-between;
  gap: 12px;
  padding: 6px 0;
}

.point-title {
  flex: 1;
}
</style>
