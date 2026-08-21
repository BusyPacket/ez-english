<script setup lang="ts">
import { h, onMounted, ref } from 'vue'
import { NButton, NPopconfirm, NTag, useMessage } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import dayjs from 'dayjs'
import { api } from '@/api/http'
import { knowledgeSections } from '@/data/knowledgePoints'

interface UserRow {
  id: string
  email: string
  nickname: string | null
  role: string
  createdAt: string
  lastActiveAt?: string | null
  lastLoginIp?: string | null
  lastLoginRegion?: string | null
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

/** 单向升级为会员：普通用户 → 会员（后端校验，不可撤销） */
async function handlePromote(id: string) {
  try {
    await api(`/users/${id}/promote`, { method: 'PATCH' })
    message.success('已升级为会员')
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
    title: '最近登录',
    key: 'lastLoginIp',
    render: (row) =>
      row.lastLoginIp
        ? `${row.lastLoginIp}${row.lastLoginRegion ? `（${row.lastLoginRegion}）` : ''}`
        : '-',
    ellipsis: { tooltip: true },
  },
  {
    title: '上次活跃',
    key: 'lastActiveAt',
    render: (row) => (row.lastActiveAt ? dayjs(row.lastActiveAt).format('YYYY-MM-DD HH:mm') : '-'),
  },
  {
    title: '操作',
    key: 'actions',
    width: 160,
    render: (row) =>
      h('div', { style: 'display:flex; gap:10px; align-items:center;' }, [
        // 单向升级：仅普通用户可升级为会员；会员显示“已是会员”标签；管理员无操作
        row.role === 'user'
          ? h(
            NPopconfirm,
            {
              onPositiveClick: () => handlePromote(row.id),
              positiveText: '升级',
              negativeText: '取消',
            },
            {
              trigger: () =>
                h(
                  NButton,
                  { size: 'small', type: 'primary', text: true },
                  { default: () => '升级会员' },
                ),
              default: () => '确定将该用户升级为会员？升级后不可撤销。',
            },
          )
          : row.role === 'member'
            ? h(
              NTag,
              { size: 'small', type: 'success', bordered: false },
              { default: () => '已是会员' },
            )
            : null,
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
      ]),
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

// —— 例题管理 ——
interface QuestionPreviewRow {
  id: string
  pointId: string
  pointTitle: string | null
  type: string
  stemPreview: string
}

interface QuestionDetail {
  id: string
  type: string
  pointId: string
  pointTitle: string | null
  stem: string
  choices: string[]
  answer: string
  analysis: string | null
}

const optionLetters = ['A', 'B', 'C', 'D']

const typeLabels: Record<string, string> = {
  single: '单选题',
  fill: '填空题',
  judge: '判断题',
}

// 考点筛选选项（扁平化全部叶子考点）
const pointOptions = knowledgeSections.flatMap((s) =>
  s.points.flatMap((p) =>
    p.children?.length
      ? p.children.map((c) => ({ label: c.title, value: c.id }))
      : [{ label: p.title, value: p.id }],
  ),
)

const questionPointFilter = ref<string | null>(null)

const questionRows = ref<QuestionPreviewRow[]>([])
const questionTotal = ref(0)
const questionPage = ref(1)
const questionPageSize = 10
const questionLoading = ref(false)
const questionKeyword = ref('')
const questionSearchKeyword = ref('')

async function fetchQuestions() {
  questionLoading.value = true
  try {
    const params = new URLSearchParams({
      page: String(questionPage.value),
      pageSize: String(questionPageSize),
    })
    if (questionSearchKeyword.value) params.set('keyword', questionSearchKeyword.value)
    if (questionPointFilter.value) params.set('pointId', questionPointFilter.value)
    const res = await api<{ items: QuestionPreviewRow[]; total: number }>(
      `/questions/admin/list?${params.toString()}`,
    )
    questionRows.value = res.items
    questionTotal.value = res.total
  } finally {
    questionLoading.value = false
  }
}

function handleQuestionSearch() {
  questionPage.value = 1
  questionSearchKeyword.value = questionKeyword.value.trim()
  fetchQuestions()
}

// 详情弹窗
const detailVisible = ref(false)
const detailLoading = ref(false)
const detail = ref<QuestionDetail | null>(null)

async function openDetail(id: string) {
  detailVisible.value = true
  detailLoading.value = true
  detail.value = null
  try {
    detail.value = await api<QuestionDetail>(`/questions/${id}`)
  } catch (e) {
    message.error((e as Error).message)
    detailVisible.value = false
  } finally {
    detailLoading.value = false
  }
}

/** 从详情进入编辑：关闭详情弹窗并打开编辑弹窗 */
function editFromDetail() {
  if (!detail.value) return
  const id = detail.value.id
  detailVisible.value = false
  openEdit(id)
}

/** 删除题目（二次确认后）：删除并刷新列表 */
async function handleDeleteQuestion() {
  if (!detail.value) return
  const id = detail.value.id
  try {
    await api(`/questions/${id}`, { method: 'DELETE' })
    message.success('已删除')
    detailVisible.value = false
    // 当前页若被删空且非第一页，回退一页
    if (questionRows.value.length <= 1 && questionPage.value > 1) {
      questionPage.value -= 1
    }
    fetchQuestions()
  } catch (e) {
    message.error((e as Error).message)
  }
}

// 编辑弹窗（新增/编辑共用：creating 区分 POST 与 PUT）
const editVisible = ref(false)
const editLoading = ref(false)
const editSaving = ref(false)
const creating = ref(false)
const editing = ref<QuestionDetail | null>(null)

const answerOptions = optionLetters.map((l) => ({ label: l, value: l }))

const typeOptions = [
  { label: '单选题', value: 'single' },
  { label: '填空题', value: 'fill' },
  { label: '判断题', value: 'judge' },
]

const judgeOptions = [
  { label: '正确', value: '正确' },
  { label: '错误', value: '错误' },
]

/** 按题型补齐选项槽：仅单选题需要 4 个输入槽 */
function ensureChoiceSlots(q: QuestionDetail) {
  if (q.type === 'single') {
    while (q.choices.length < 4) q.choices.push('')
  } else {
    q.choices = []
  }
  return q
}

/** 新增例题：打开空表单（保存时 POST） */
function openCreate() {
  creating.value = true
  editVisible.value = true
  editLoading.value = false
  editSaving.value = false
  editing.value = ensureChoiceSlots({
    id: '',
    type: 'single',
    pointId: '',
    pointTitle: null,
    stem: '',
    choices: [],
    answer: '',
    analysis: '',
  })
}

async function openEdit(id: string) {
  creating.value = false
  editVisible.value = true
  editLoading.value = true
  editSaving.value = false
  editing.value = null
  try {
    const q = await api<QuestionDetail>(`/questions/${id}`)
    q.analysis = q.analysis ?? ''
    editing.value = ensureChoiceSlots(q)
  } catch (e) {
    message.error((e as Error).message)
    editVisible.value = false
  } finally {
    editLoading.value = false
  }
}

function onEditPointChange(value: string | null) {
  if (!editing.value) return
  editing.value.pointId = value ?? ''
  const opt = pointOptions.find((o) => o.value === value)
  editing.value.pointTitle = opt?.label ?? null
}

/** 切换题型时重置选项槽与答案（不同题型的选项/答案语义不同） */
function onTypeChange() {
  if (!editing.value) return
  editing.value = ensureChoiceSlots(editing.value)
  editing.value.answer = ''
}

async function saveEdit() {
  if (!editing.value || editSaving.value) return
  if (!editing.value.stem.trim()) {
    message.warning('题干不能为空')
    return
  }
  if (!editing.value.pointId) {
    message.warning('请选择考点')
    return
  }
  const type = editing.value.type
  let choices: string[] | undefined
  if (type === 'single') {
    const validChoices = editing.value.choices.filter((c) => c.trim() !== '')
    if (validChoices.length < 2) {
      message.warning('至少填写两个选项')
      return
    }
    if (!editing.value.answer) {
      message.warning('请选择正确答案')
      return
    }
    choices = validChoices
  } else {
    if (!editing.value.answer.trim()) {
      message.warning(type === 'fill' ? '请填写正确答案' : '请选择正确或错误')
      return
    }
    choices = []
  }
  editSaving.value = true
  try {
    const payload = {
      pointId: editing.value.pointId,
      pointTitle: editing.value.pointTitle ?? '',
      type,
      stem: editing.value.stem,
      choices,
      answer: editing.value.answer,
      analysis: editing.value.analysis ?? '',
    }
    if (creating.value) {
      await api('/questions', { method: 'POST', body: JSON.stringify(payload) })
      message.success('已新增')
    } else {
      await api(`/questions/${editing.value.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      })
      message.success('已保存')
    }
    editVisible.value = false
    fetchQuestions()
  } catch (e) {
    message.error((e as Error).message)
  } finally {
    editSaving.value = false
  }
}

const questionColumns: DataTableColumns<QuestionPreviewRow> = [
  { title: '考点', key: 'pointTitle', render: (row) => row.pointTitle ?? '-' },
  {
    title: '类型',
    key: 'type',
    width: 90,
    render: (row) =>
      h(
        NTag,
        { size: 'small', type: 'info', bordered: false },
        { default: () => typeLabels[row.type] ?? row.type },
      ),
  },
  { title: '题目', key: 'stemPreview', ellipsis: { tooltip: true } },
  {
    title: '操作',
    key: 'actions',
    width: 110,
    render: (row) =>
      h(
        NButton,
        { size: 'small', type: 'primary', ghost: true, onClick: () => openDetail(row.id) },
        { default: () => '查看详情' },
      ),
  },
]

// —— 系统设置 ——
const regOpen = ref(true)
async function fetchRegOpen() {
  try {
    const res = await api<{ open: boolean }>('/settings/registration-open')
    regOpen.value = res.open
  } catch {
    // 读取失败保持默认
  }
}
async function toggleRegOpen(value: boolean) {
  try {
    await api('/settings/registration-open', {
      method: 'PUT',
      body: JSON.stringify({ open: value }),
    })
    regOpen.value = value
    message.success(value ? '已开放注册' : '已关闭注册')
  } catch (e) {
    message.error((e as Error).message)
    fetchRegOpen() // 失败回滚显示
  }
}

// —— 后台导航（桌面侧边栏 + 移动端顶部标签） ——
type AdminTab = 'users' | 'settings' | 'feedback' | 'questions'

const currentTab = ref<AdminTab>('users')

const menuOptions = [
  { label: '系统设置', key: 'settings' },
  { label: '用户管理', key: 'users' },
  { label: '反馈管理', key: 'feedback' },
  { label: '例题管理', key: 'questions' },
]

onMounted(() => {
  fetchUsers()
  fetchFeedback()
  fetchRegOpen()
  fetchQuestions()
})
</script>

<template>
  <div class="admin-page">
    <div class="admin-layout">
      <!-- 侧边栏（桌面端显示） -->
      <aside class="admin-sider">
        <n-card size="small" :bordered="true">
          <n-menu :value="currentTab" :options="menuOptions" @update:value="(v) => (currentTab = v as AdminTab)" />
        </n-card>
      </aside>

      <!-- 内容区 -->
      <div class="admin-content">
        <!-- 移动端顶部标签导航（桌面端隐藏） -->
        <n-tabs class="admin-tabs" v-model:value="currentTab" type="line" animated>
          <n-tab name="users" tab="用户管理" />
          <n-tab name="settings" tab="系统设置" />
          <n-tab name="feedback" tab="反馈管理" />
          <n-tab name="questions" tab="例题管理" />
        </n-tabs>

        <!-- 用户管理 -->
        <div v-show="currentTab === 'users'">
          <n-card>
            <n-h2>用户管理</n-h2>
            <div class="toolbar">
              <n-input v-model:value="keyword" placeholder="搜索邮箱或昵称" clearable style="max-width: 280px"
                @keyup.enter="handleSearch" />
              <n-button type="primary" @click="handleSearch">搜索</n-button>
            </div>
            <n-data-table :columns="columns" :data="data" :loading="loading" :bordered="false"
              :row-key="(row) => row.id" />
            <n-pagination class="admin-pagination" :page="page" :page-size="pageSize" :item-count="total" @update:page="
              (p) => {
                page = p
                fetchUsers()
              }
            " />
          </n-card>
        </div>

        <!-- 系统设置 -->
        <div v-show="currentTab === 'settings'">
          <n-card>
            <n-h2>系统设置</n-h2>
            <div class="setting-row">
              <span class="setting-label">开放注册</span>
              <n-switch :value="regOpen" @update:value="toggleRegOpen" />
              <n-tag size="small" :type="regOpen ? 'success' : 'warning'" :bordered="false">
                {{ regOpen ? '开放中' : '已关闭' }}
              </n-tag>
            </div>
          </n-card>
        </div>

        <!-- 反馈管理 -->
        <div v-show="currentTab === 'feedback'">
          <n-card>
            <n-h2>反馈管理</n-h2>
            <n-data-table :columns="feedbackColumns" :data="feedbackList" :bordered="false"
              :row-key="(row) => row.id" />
          </n-card>
        </div>

        <!-- 例题管理 -->
        <div v-show="currentTab === 'questions'">
          <n-card>
            <n-h2>例题管理</n-h2>
            <div class="toolbar">
              <n-input v-model:value="questionKeyword" placeholder="搜索题干" clearable style="max-width: 240px"
                @keyup.enter="handleQuestionSearch" />
              <n-select v-model:value="questionPointFilter" :options="pointOptions" clearable filterable
                placeholder="全部考点" style="max-width: 220px" @update:value="
                  () => {
                    questionPage = 1
                    fetchQuestions()
                  }
                " />
              <n-button type="primary" @click="handleQuestionSearch">搜索</n-button>
              <n-button type="primary" @click="openCreate">新增例题</n-button>
            </div>
            <n-data-table :columns="questionColumns" :data="questionRows" :loading="questionLoading" :bordered="false"
              :row-key="(row) => row.id" />
            <n-pagination class="admin-pagination" :page="questionPage" :page-size="questionPageSize"
              :item-count="questionTotal" @update:page="
                (p) => {
                  questionPage = p
                  fetchQuestions()
                }
              " />
          </n-card>
        </div>
      </div>
    </div>

    <!-- 例题详情弹窗 -->
    <n-modal v-model:show="detailVisible" preset="card" title="例题详情" style="width: 600px; max-width: 92vw">
      <template v-if="detailLoading">
        <div class="detail-loading">
          <n-spin size="large" />
        </div>
      </template>
      <template v-else-if="detail">
        <n-descriptions label-placement="left" :column="1" size="small">
          <n-descriptions-item label="考点">{{ detail.pointTitle ?? '-' }}</n-descriptions-item>
          <n-descriptions-item label="类型">{{
            typeLabels[detail.type] ?? detail.type
            }}</n-descriptions-item>
        </n-descriptions>
        <div class="detail-stem">{{ detail.stem }}</div>
        <div v-if="detail.choices?.length" class="detail-choices">
          <div v-for="(c, i) in detail.choices" :key="i" class="detail-choice">
            <span class="choice-letter">{{ optionLetters[i] }}</span>
            <span>{{ c }}</span>
          </div>
        </div>
        <div class="detail-answer">
          <n-tag type="success" size="small" :bordered="false">正确答案：{{ detail.answer }}</n-tag>
        </div>
        <div v-if="detail.analysis" class="detail-analysis">
          <div class="analysis-label">解析</div>
          <div>{{ detail.analysis }}</div>
        </div>
        <div class="detail-actions">
          <n-popconfirm @positive-click="handleDeleteQuestion" positive-text="删除" negative-text="取消">
            <template #trigger>
              <n-button type="error" ghost>删除</n-button>
            </template>
            确定删除该题目？删除后不可恢复。
          </n-popconfirm>
          <n-button type="primary" @click="editFromDetail">编辑</n-button>
        </div>
      </template>
    </n-modal>

    <!-- 例题编辑弹窗 -->
    <n-modal v-model:show="editVisible" preset="card" :title="creating ? '新增例题' : '编辑例题'"
      style="width: 640px; max-width: 94vw">
      <template v-if="editLoading">
        <div class="detail-loading">
          <n-spin size="large" />
        </div>
      </template>
      <template v-else-if="editing">
        <n-form label-placement="left" label-width="80" size="small">
          <n-form-item label="考点">
            <n-select v-model:value="editing.pointId" :options="pointOptions" filterable clearable placeholder="选择考点"
              @update:value="onEditPointChange" />
          </n-form-item>
          <n-form-item label="类型">
            <n-select v-model:value="editing.type" :options="typeOptions" style="width: 140px"
              @update:value="onTypeChange" />
          </n-form-item>
          <n-form-item label="题干">
            <n-input v-model:value="editing.stem" type="textarea" :rows="2" placeholder="题目内容" />
          </n-form-item>
          <n-form-item v-if="editing.type === 'single'" label="选项">
            <div class="edit-choices">
              <div v-for="(_, i) in optionLetters" :key="i" class="edit-choice">
                <span class="choice-letter">{{ optionLetters[i] }}</span>
                <n-input v-model:value="editing.choices[i]" placeholder="选项内容" />
              </div>
            </div>
          </n-form-item>
          <n-form-item label="答案">
            <template v-if="editing.type === 'single'">
              <n-select v-model:value="editing.answer" :options="answerOptions" placeholder="选择正确答案"
                style="width: 120px" />
            </template>
            <template v-else-if="editing.type === 'judge'">
              <n-select v-model:value="editing.answer" :options="judgeOptions" placeholder="选择正确或错误"
                style="width: 120px" />
            </template>
            <template v-else>
              <n-input v-model:value="editing.answer" placeholder="填写正确答案" style="max-width: 280px" />
            </template>
          </n-form-item>
          <n-form-item label="解析">
            <n-input v-model:value="editing.analysis" type="textarea" :rows="3" placeholder="答案解析" />
          </n-form-item>
        </n-form>
        <div class="edit-actions">
          <n-button @click="editVisible = false">取消</n-button>
          <n-button type="primary" :loading="editSaving" @click="saveEdit">
            {{ creating ? '新增' : '保存' }}
          </n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<style scoped>
.admin-page {
  max-width: 1080px;
  margin: 0 auto;
  padding: 24px 16px;
}

.admin-layout {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

/* 侧边栏：桌面端显示，固定左侧 */
.admin-sider {
  width: 190px;
  flex-shrink: 0;
  position: sticky;
  top: 16px;
}

.admin-content {
  flex: 1;
  min-width: 0;
}

/* 移动端顶部标签导航（默认隐藏） */
.admin-tabs {
  display: none;
  margin-bottom: 4px;
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

/* 例题详情弹窗 */
.detail-loading {
  display: flex;
  justify-content: center;
  padding: 24px 0;
}

.detail-stem {
  margin: 12px 0;
  font-weight: 600;
  font-size: 0.95rem;
  line-height: 1.6;
}

.detail-choices {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 12px 0;
}

.detail-choice {
  display: flex;
  gap: 8px;
  align-items: baseline;
}

.choice-letter {
  font-weight: 600;
  color: #18a058;
  flex-shrink: 0;
}

.detail-answer {
  margin: 12px 0;
}

.detail-analysis {
  margin-top: 12px;
  color: var(--n-text-color-3);
  font-size: 0.9rem;
  line-height: 1.6;
}

.analysis-label {
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--n-text-color-2);
}

.detail-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
}

/* 例题编辑弹窗 */
.edit-choices {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.edit-choice {
  display: flex;
  gap: 8px;
  align-items: center;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.setting-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.setting-label {
  font-weight: 500;
}

/* 移动端（<768px）：侧边栏收起，改用顶部标签导航 */
@media (max-width: 767px) {
  .admin-page {
    padding: 12px 8px;
  }

  .admin-layout {
    flex-direction: column;
    gap: 8px;
  }

  .admin-sider {
    display: none;
  }

  .admin-tabs {
    display: block;
  }

  .admin-content {
    width: 100%;
  }
}
</style>
