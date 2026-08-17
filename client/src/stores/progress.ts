import { ref } from 'vue'
import { defineStore } from 'pinia'
import { examStructure, knowledgeSections, type KnowledgeStatus } from '@/data/knowledgePoints'

const KEY = 'ez-english-progress'

// 当前所有有效考点的 id 集合，用于过滤掉已失效的旧状态
const VALID_IDS = new Set<string>([
  ...examStructure.map((p) => p.id),
  ...knowledgeSections.flatMap((section) => section.points.map((p) => p.id)),
])

function load(): Record<string, KnowledgeStatus> {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, KnowledgeStatus>
    // 只保留仍存在于当前考点列表中的状态，避免残留脏数据干扰统计
    return Object.fromEntries(Object.entries(parsed).filter(([id]) => VALID_IDS.has(id)))
  } catch {
    return {}
  }
}

export const useProgressStore = defineStore('progress', () => {
  const statuses = ref<Record<string, KnowledgeStatus>>(load())

  function getStatus(id: string): KnowledgeStatus {
    return statuses.value[id] ?? 'todo'
  }

  function setStatus(id: string, status: KnowledgeStatus) {
    statuses.value[id] = status
    localStorage.setItem(KEY, JSON.stringify(statuses.value))
  }

  return { statuses, getStatus, setStatus }
})
