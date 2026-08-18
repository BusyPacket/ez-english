<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { api } from '@/api/http'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const message = useMessage()
const userStore = useUserStore()

/** 练习主题标题（从进度页考点带入） */
const practiceTitle = computed(() => (route.query.title as string) ?? '英语练习')

/** 练习题型：single 单选题 / fill 填空题 / judge 判断题 */
const questionType = ref<'single' | 'fill' | 'judge'>('single')
const typeOptions = [
    { label: '单选题', value: 'single' },
    { label: '填空题', value: 'fill' },
    { label: '判断题', value: 'judge' },
]

const optionLetters = ['A', 'B', 'C', 'D']

/** AI 生成状态与结果 */
const generating = ref(false)
const generated = ref<GeneratedQuestion | null>(null)
/** 已生成题目对应的题型（生成时锁定，切换题型控件不影响当前题） */
const generatedType = ref<'single' | 'fill' | 'judge'>('single')

interface GeneratedQuestion {
    stem?: string
    choices?: string[]
    answer?: string
    point?: string
    analysis?: string
}

onMounted(() => {
    if (userStore.isLoggedIn) void userStore.refreshAiAvailable()
})

/** 生成按钮文案：生成中 → 生成中；已生成过 → 再来一题；否则 → 生成题目 */
const generateBtnText = computed(() => {
    if (generating.value) return '生成中'
    return generated.value ? '再来一题' : '生成题目'
})

/** 答题状态 */
const selectedChoice = ref<number | null>(null)
const judgeChoice = ref<'正确' | '错误' | null>(null)
const fillInput = ref('')
const submitted = ref(false)
const isCorrect = ref(false)

/** 重置答题状态（生成新题时调用） */
function resetAnswer() {
    selectedChoice.value = null
    judgeChoice.value = null
    fillInput.value = ''
    submitted.value = false
    isCorrect.value = false
}

/** 生成题目：需 AI 可用；按当前考点与题型调用后端 */
async function generateQuestion() {
    if (generating.value) return
    if (!userStore.aiAvailable) {
        message.warning('要使用 AI 功能必须先进行配置')
        router.push('/profile')
        return
    }
    generating.value = true
    try {
        generated.value = await api<GeneratedQuestion>('/ai/generate-practice', {
            method: 'POST',
            body: JSON.stringify({ point: route.query.point ?? '', type: questionType.value }),
        })
        generatedType.value = questionType.value // 锁定当前题目题型
        resetAnswer()
        message.success('已生成题目')
    } catch (e) {
        message.error((e as Error).message)
    } finally {
        generating.value = false
    }
}

/** 归一化：去空白、句点、转小写，用于答案比较 */
function normalize(s?: string): string {
    return (s ?? '').trim().toLowerCase().replace(/[。．.\s]/g, '')
}

/** 判断题答案归一化：正确/T/True/对 → right；错误/F/False/错 → wrong */
function judgeValue(s?: string): string {
    const v = normalize(s)
    if (['正确', 't', 'true', '对'].includes(v)) return 'right'
    if (['错误', 'f', 'false', '错'].includes(v)) return 'wrong'
    return v
}

/** 选择题选项是否命中正确答案（用于提交后高亮） */
function isChoiceCorrect(i: number): boolean {
    const letter = optionLetters[i]
    return normalize(letter) === normalize(generated.value?.answer)
}

function pickChoice(i: number) {
    if (submitted.value) return
    selectedChoice.value = i
}

/** 提交答案并判断对错 */
function submitAnswer() {
    if (!generated.value || submitted.value) return
    let correct = false
    if (generatedType.value === 'single') {
        if (selectedChoice.value === null) {
            message.warning('请先选择答案')
            return
        }
        const letter = optionLetters[selectedChoice.value]
        correct = normalize(letter) === normalize(generated.value.answer)
    } else if (generatedType.value === 'judge') {
        if (!judgeChoice.value) {
            message.warning('请先选择正确或错误')
            return
        }
        correct = judgeValue(judgeChoice.value) === judgeValue(generated.value.answer)
    } else {
        if (!fillInput.value.trim()) {
            message.warning('请输入答案')
            return
        }
        correct = normalize(fillInput.value) === normalize(generated.value.answer)
    }
    isCorrect.value = correct
    submitted.value = true
}
</script>

<template>
    <div class="practice-page">
        <n-card class="practice-header">
            <n-space justify="space-between" align="center">
                <n-h2 class="practice-title">{{ practiceTitle }}</n-h2>
                <n-button size="small" secondary @click="router.push('/progress')">返回进度</n-button>
            </n-space>
        </n-card>

        <n-card class="type-card" size="small">
            <n-space align="center" justify="space-between" :size="12">
                <n-space align="center" :size="12">
                    <span class="type-label">题型</span>
                    <n-radio-group v-model:value="questionType">
                        <n-radio-button v-for="opt in typeOptions" :key="opt.value" :value="opt.value">
                            {{ opt.label }}
                        </n-radio-button>
                    </n-radio-group>
                </n-space>
                <n-button type="success" :loading="generating" @click="generateQuestion">{{ generateBtnText
                }}</n-button>
            </n-space>
        </n-card>

        <n-card v-if="generated" class="generated-card" size="small">
            <div class="gen-label">✨ 题目</div>
            <div class="gen-stem">{{ generated.stem }}</div>

            <!-- 单选题：可点击选项 -->
            <div v-if="generated.choices" class="gen-choices">
                <div v-for="(choice, i) in generated.choices" :key="i" class="choice" :class="{
                    selected: selectedChoice === i,
                    'correct-choice': submitted && isChoiceCorrect(i),
                    'wrong-choice': submitted && selectedChoice === i && !isChoiceCorrect(i),
                }" @click="pickChoice(i)">
                    <span class="opt-letter">{{ optionLetters[i] }}</span>
                    {{ choice }}
                    <span v-if="submitted && isChoiceCorrect(i)" class="choice-tag tag-correct">
                        {{ selectedChoice === i ? '✓ 正确' : '✓ 正确答案' }}
                    </span>
                    <span v-else-if="submitted && selectedChoice === i" class="choice-tag tag-wrong">✗ 你的选择</span>
                </div>
            </div>

            <!-- 判断题 -->
            <div v-else-if="generatedType === 'judge'" class="judge-row">
                <n-button size="small" :type="judgeChoice === '正确' ? 'primary' : 'default'" :disabled="submitted"
                    @click="judgeChoice = '正确'">正确</n-button>
                <n-button size="small" :type="judgeChoice === '错误' ? 'primary' : 'default'" :disabled="submitted"
                    @click="judgeChoice = '错误'">错误</n-button>
            </div>

            <!-- 填空题 -->
            <div v-else class="fill-row">
                <n-input v-model:value="fillInput" size="small" placeholder="请输入答案" style="max-width: 320px"
                    :disabled="submitted" @keyup.enter="submitAnswer" />
            </div>

            <div class="gen-actions">
                <n-button size="small" type="primary" :disabled="submitted" @click="submitAnswer">提交答案</n-button>
            </div>

            <!-- 提交后判分结果 -->
            <div v-if="submitted" class="gen-result" :class="isCorrect ? 'gen-result-ok' : 'gen-result-err'">
                {{ isCorrect ? '✅ 回答正确' : `❌ 回答错误，正确答案：${generated.answer}` }}
            </div>

            <template v-if="submitted">
                <div v-if="generated.answer" class="gen-answer">答案：{{ generated.answer }}</div>
                <div v-if="generated.point" class="gen-point">考点：{{ generated.point }}</div>
                <div v-if="generated.analysis" class="gen-analysis">解析：{{ generated.analysis }}</div>
            </template>
        </n-card>
    </div>
</template>

<style scoped>
.practice-page {
    max-width: 960px;
    margin: 0 auto;
    padding: 24px 16px;
}

.practice-title {
    margin: 0;
}

.type-card {
    margin-top: 16px;
}

.type-label {
    font-weight: 500;
}

.generated-card {
    margin-top: 16px;
}

.gen-label {
    font-weight: 600;
    margin-bottom: 8px;
}

.gen-stem {
    font-weight: 500;
    white-space: pre-wrap;
}

.gen-choices {
    margin-top: 8px;
}

.choice {
    padding: 6px 10px;
    border: 1px solid var(--n-border-color);
    border-radius: 6px;
    margin-top: 6px;
    cursor: pointer;
    transition: border-color 0.2s, background-color 0.2s;
}

.choice:hover {
    border-color: var(--n-primary-color);
}

.choice.selected {
    border-color: var(--n-primary-color);
    background: color-mix(in srgb, var(--n-primary-color) 8%, transparent);
}

.choice.correct-choice {
    border-color: #18a058;
    background: color-mix(in srgb, #18a058 8%, transparent);
}

.choice.wrong-choice {
    border-color: #d03050;
    background: color-mix(in srgb, #d03050 8%, transparent);
}

.opt-letter {
    font-weight: 600;
    margin-right: 4px;
}

.choice-tag {
    float: right;
    font-size: 0.75rem;
    font-weight: 600;
}

.tag-correct {
    color: #18a058;
}

.tag-wrong {
    color: #d03050;
}

.judge-row,
.fill-row {
    margin-top: 10px;
    display: flex;
    gap: 8px;
}

.gen-actions {
    margin-top: 14px;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
}

.gen-result {
    margin-top: 10px;
    font-weight: 600;
}

.gen-result-ok {
    color: #18a058;
}

.gen-result-err {
    color: #d03050;
}

.gen-answer {
    margin-top: 8px;
    color: #18a058;
    font-weight: 500;
}

.gen-point {
    margin-top: 4px;
    color: #2080f0;
}

.gen-analysis {
    margin-top: 4px;
    color: var(--n-text-color-3);
    line-height: 1.7;
}
</style>
