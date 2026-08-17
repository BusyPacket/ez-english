import { ref } from 'vue'
import { defineStore } from 'pinia'
import { KnowledgeStatus, knowledgeSections } from '@ez-english/shared'
import { api } from '@/api/http'

const KEY = 'ez-english-progress'

// 当前所有有效学习考点的 id 集合，用于过滤掉已失效的旧状态
const VALID_IDS = new Set<string>(
  knowledgeSections.flatMap((section) => section.points.map((p) => p.id)),
)

interface ProgressRow {
  userId: string
  pointId: string
  status: KnowledgeStatus
  updatedAt: string
}

export interface ProgressSummary {
  total: number
  counts: Record<string, number>
  masteredPercent: number
}

function loadLocal(): Record<string, KnowledgeStatus> {
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
  const statuses = ref<Record<string, KnowledgeStatus>>(loadLocal())
  const summary = ref<ProgressSummary | null>(null)

  function getStatus(id: string): KnowledgeStatus {
    return statuses.value[id] ?? KnowledgeStatus.Todo
  }

  function persistLocal() {
    localStorage.setItem(KEY, JSON.stringify(statuses.value))
  }

  /** 从后端拉取当前用户进度（登录后调用），服务端为准 */
  async function syncFromServer() {
    try {
      const rows = await api<ProgressRow[]>('/progress')
      const next: Record<string, KnowledgeStatus> = {}
      for (const row of rows) {
        if (VALID_IDS.has(row.pointId)) next[row.pointId] = row.status
      }
      statuses.value = next
      persistLocal()
    } catch {
      // 未登录或网络异常：保留本地缓存
    }
  }

  /** 拉取学习进度汇总（各状态计数 + 后端计算的已掌握百分比） */
  async function fetchSummary() {
    try {
      summary.value = await api<ProgressSummary>('/progress/summary')
    } catch {
      // 忽略：未登录或网络异常时保持空
    }
  }

  /** 更新某个考点状态：先写本地，再同步后端，最后刷新汇总（进度条实时更新） */
  async function setStatus(id: string, status: KnowledgeStatus) {
    statuses.value[id] = status
    persistLocal()
    try {
      await api(`/progress/${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      })
      await fetchSummary()
    } catch {
      // 同步失败时本地已更新，下次 syncFromServer 会以服务端为准
    }
  }

  return { statuses, summary, getStatus, setStatus, syncFromServer, fetchSummary }
})
