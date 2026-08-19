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
      <n-h1>浙江专升本英语学习站</n-h1>
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
  /* 扣除导航栏高度，保证一屏放得下、无滚动条 */
  min-height: calc(100vh - var(--navbar-h));
  /* padding 计入高度，避免内容超出视口产生滚动条 */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 内容靠上排列，避免标题上方留白过大 */
  justify-content: flex-start;
  gap: 36px;
  padding: 28px 16px 60px;
}

.home-hero {
  margin-top: 5%;
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
