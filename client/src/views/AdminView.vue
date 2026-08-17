<script setup lang="ts">
import { h, onMounted, ref } from 'vue'
import { NButton, NPopconfirm, NTag, useMessage } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import dayjs from 'dayjs'
import { api } from '@/api/http'

interface UserRow {
  id: string
  email: string
  nickname: string | null
  role: string
  createdAt: string
}

interface PageResult {
  items: UserRow[]
  total: number
  page: number
  pageSize: number
}

const message = useMessage()

const roleLabels: Record<string, string> = {
  user: '普通用户',
  member: '会员用户',
  admin: '管理员',
}

async function handleDelete(id: string) {
  try {
    await api(`/users/${id}`, { method: 'DELETE' })
    message.success('已删除')
    fetchUsers()
  } catch (e) {
    message.error((e as Error).message)
  }
}

const columns: DataTableColumns<UserRow> = [
  { title: 'ID', key: 'id', ellipsis: true },
  { title: '邮箱', key: 'email' },
  { title: '昵称', key: 'nickname', render: (row) => row.nickname ?? '未设置' },
  { title: '角色', key: 'role', render: (row) => roleLabels[row.role] ?? row.role },
  {
    title: '注册时间',
    key: 'createdAt',
    render: (row) => dayjs(row.createdAt).format('YYYY-MM-DD HH:mm'),
  },
  {
    title: '操作',
    key: 'actions',
    width: 80,
    render: (row) =>
      h(
        NPopconfirm,
        {
          onPositiveClick: () => handleDelete(row.id),
          positiveText: '删除',
          negativeText: '取消',
        },
        {
          trigger: () =>
            h(NButton, { size: 'small', type: 'error', text: true }, { default: () => '删除' }),
          default: () => '确定删除该用户？',
        },
      ),
  },
]

const data = ref<UserRow[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = 10
const loading = ref(false)
const keyword = ref('')
const searchKeyword = ref('')

async function fetchUsers() {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page: String(page.value),
      pageSize: String(pageSize),
    })
    if (searchKeyword.value) params.set('keyword', searchKeyword.value)
    const res = await api<PageResult>(`/users?${params.toString()}`)
    data.value = res.items
    total.value = res.total
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  page.value = 1
  searchKeyword.value = keyword.value.trim()
  fetchUsers()
}

// —— 反馈管理 ——
interface FeedbackRow {
  id: string
  userId: string
  email: string | null
  content: string
  status: 'pending' | 'resolved'
  createdAt: string
}

const feedbackStatusLabels: Record<string, string> = {
  pending: '未处理',
  resolved: '已解决',
}

const feedbackList = ref<FeedbackRow[]>([])

async function fetchFeedback() {
  feedbackList.value = await api<FeedbackRow[]>('/feedback/all')
}

async function toggleFeedback(row: FeedbackRow) {
  const next = row.status === 'pending' ? 'resolved' : 'pending'
  try {
    await api(`/feedback/${row.id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: next }),
    })
    message.success(next === 'resolved' ? '已标记为已解决' : '已标记为未处理')
    fetchFeedback()
  } catch (e) {
    message.error((e as Error).message)
  }
}

const feedbackColumns: DataTableColumns<FeedbackRow> = [
  { title: '提交者', key: 'email', render: (row) => row.email ?? '未知' },
  { title: '反馈内容', key: 'content', ellipsis: { tooltip: true } },
  {
    title: '状态',
    key: 'status',
    render: (row) =>
      h(
        NTag,
        {
          size: 'small',
          type: row.status === 'resolved' ? 'success' : 'warning',
          bordered: false,
        },
        { default: () => feedbackStatusLabels[row.status] },
      ),
  },
  {
    title: '提交时间',
    key: 'createdAt',
    render: (row) => dayjs(row.createdAt).format('YYYY-MM-DD HH:mm'),
  },
  {
    title: '操作',
    key: 'actions',
    width: 120,
    render: (row) =>
      h(
        NButton,
        {
          size: 'small',
          type: row.status === 'resolved' ? 'default' : 'primary',
          onClick: () => toggleFeedback(row),
        },
        { default: () => (row.status === 'resolved' ? '标记未处理' : '标记已解决') },
      ),
  },
]

onMounted(() => {
  fetchUsers()
  fetchFeedback()
})
</script>

<template>
  <div class="admin-page">
    <n-card>
      <n-h2>用户管理</n-h2>
      <div class="toolbar">
        <n-input v-model:value="keyword" placeholder="搜索邮箱或昵称" clearable style="max-width: 280px"
          @keyup.enter="handleSearch" />
        <n-button type="primary" @click="handleSearch">搜索</n-button>
      </div>
      <n-data-table :columns="columns" :data="data" :loading="loading" :bordered="false" :row-key="(row) => row.id" />
      <n-pagination class="admin-pagination" :page="page" :page-size="pageSize" :item-count="total"
        @update:page="(p) => { page = p; fetchUsers() }" />
    </n-card>

    <n-card class="feedback-card">
      <n-h2>反馈管理</n-h2>
      <n-data-table :columns="feedbackColumns" :data="feedbackList" :bordered="false" :row-key="(row) => row.id" />
    </n-card>
  </div>
</template>

<style scoped>
.admin-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 16px;
}

.toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.admin-pagination {
  margin-top: 16px;
  justify-content: flex-end;
}

.feedback-card {
  margin-top: 16px;
}
</style>
