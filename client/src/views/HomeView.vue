<script setup lang="ts">
import { useRouter } from 'vue-router'
import { examStructure } from '@/data/knowledgePoints'

const router = useRouter()

function parseExamPoint(title: string): { name: string; detail: string } {
  const match = title.match(/^(.*?)（(.*)）$/)
  return match ? { name: match[1] ?? title, detail: match[2] ?? '' } : { name: title, detail: '' }
}
</script>

<template>
  <div class="home">
    <div class="home-hero">
      <n-h1>专升本英语学习站</n-h1>
      <n-p>让学习英语变得简单。</n-p>
      <n-button type="primary" size="large" @click="router.push('/progress')">开始学习</n-button>
    </div>

    <n-card class="home-exam" :bordered="true">
      <n-h2 class="exam-title">考试结构（题型与分值）</n-h2>
      <n-table :bordered="false" size="small">
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
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 36px;
  padding: 40px 16px;
}

.home-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.home-exam {
  width: 100%;
  max-width: 560px;
}

.exam-title {
  text-align: center;
  margin-bottom: 12px;
}
</style>
