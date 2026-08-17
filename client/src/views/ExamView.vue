<script setup lang="ts">
import { examStructure } from '@/data/knowledgePoints'

function parseExamPoint(title: string): { name: string; detail: string } {
  const match = title.match(/^(.*?)（(.*)）$/)
  return match ? { name: match[1] ?? title, detail: match[2] ?? '' } : { name: title, detail: '' }
}
</script>

<template>
  <div class="exam-page">
    <n-card class="exam-card">
      <n-h2>考试结构（题型与分值）</n-h2>
      <n-table :bordered="false">
        <thead>
          <tr>
            <th>题型</th>
            <th>题量 × 分值</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="point in examStructure" :key="point.id">
            <td>{{ parseExamPoint(point.title).name }}</td>
            <td>{{ parseExamPoint(point.title).detail }}</td>
          </tr>
        </tbody>
      </n-table>
    </n-card>
  </div>
</template>

<style scoped>
.exam-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 16px;
}
</style>
