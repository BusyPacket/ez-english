<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useMessage } from 'naive-ui'
import dayjs from 'dayjs'
import { api } from '@/api/http'

interface Feedback {
    id: string
    userId: string
    content: string
    status: 'pending' | 'resolved'
    createdAt: string
}

const statusMap: Record<
    string,
    { label: string; type: 'success' | 'warning'; tagType: 'success' | 'warning' }
> = {
    pending: { label: '未处理', type: 'warning', tagType: 'warning' },
    resolved: { label: '已解决', type: 'success', tagType: 'success' },
}

const message = useMessage()
const content = ref('')
const submitting = ref(false)
const list = ref<Feedback[]>([])
const loading = ref(false)

function formatTime(value: string) {
    return dayjs(value).format('YYYY-MM-DD HH:mm')
}

async function loadList() {
    loading.value = true
    try {
        list.value = await api<Feedback[]>('/feedback/my')
    } catch (e) {
        message.error((e as Error).message)
    } finally {
        loading.value = false
    }
}

async function handleSubmit() {
    if (!content.value.trim()) {
        message.warning('请填写反馈内容')
        return
    }
    submitting.value = true
    try {
        await api<Feedback>('/feedback', {
            method: 'POST',
            body: JSON.stringify({ content: content.value.trim() }),
        })
        message.success('反馈已提交，感谢你的建议！')
        content.value = ''
        await loadList()
    } catch (e) {
        message.error((e as Error).message)
    } finally {
        submitting.value = false
    }
}

onMounted(loadList)
</script>

<template>
    <div class="feedback-page">
        <n-card class="feedback-card">
            <n-h2 class="feedback-title">意见反馈</n-h2>
            <n-p class="feedback-sub">遇到问题或有建议？告诉我们，我们会持续改进 ez-english。</n-p>

            <n-input v-model:value="content" type="textarea" placeholder="请输入你的反馈内容（例如：错题、功能建议、界面问题等）" :rows="5"
                maxlength="2000" show-count :disabled="submitting" />
            <n-button type="primary" block class="submit-btn" :loading="submitting" @click="handleSubmit">
                提交反馈
            </n-button>
        </n-card>

        <n-card class="history-card">
            <template #header>我提交的反馈</template>
            <n-spin :show="loading">
                <n-empty v-if="!loading && list.length === 0" description="还没有提交过反馈" />
                <n-timeline v-else>
                    <n-timeline-item v-for="item in list" :key="item.id"
                        :type="statusMap[item.status]?.type ?? 'default'" :time="formatTime(item.createdAt)">
                        <n-tag size="small" :type="statusMap[item.status]?.tagType ?? 'default'" :bordered="false"
                            class="fb-status">
                            {{ statusMap[item.status]?.label ?? item.status }}
                        </n-tag>
                        <span class="fb-content">{{ item.content }}</span>
                    </n-timeline-item>
                </n-timeline>
            </n-spin>
        </n-card>
    </div>
</template>

<style scoped>
.feedback-page {
    max-width: 720px;
    margin: 0 auto;
    padding: 24px 16px;
}

.feedback-title {
    text-align: center;
}

.feedback-sub {
    text-align: center;
    color: var(--n-text-color-3);
}

.submit-btn {
    margin-top: 16px;
}

.history-card {
    margin-top: 16px;
}

.fb-status {
    margin-right: 8px;
}

.fb-content {
    line-height: 1.6;
}
</style>
