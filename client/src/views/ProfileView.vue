<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import dayjs from 'dayjs'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const message = useMessage()
const userStore = useUserStore()

const roleLabels: Record<string, string> = {
    user: '普通用户',
    member: '会员用户',
    admin: '管理员',
}

const createdAt = computed(() =>
    userStore.user?.createdAt ? dayjs(userStore.user.createdAt).format('YYYY-MM-DD HH:mm') : '-',
)

// 昵称修改
const nicknameInput = ref(userStore.user?.nickname ?? '')
const editingNickname = ref(false)
const savingNickname = ref(false)

function startEditNickname() {
    nicknameInput.value = userStore.user?.nickname ?? ''
    editingNickname.value = true
}

async function saveNickname() {
    const value = nicknameInput.value.trim()
    if (!value) {
        message.warning('昵称不能为空')
        return
    }
    if (value.length > 20) {
        message.warning('昵称最长 20 个字符')
        return
    }
    if (!/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/.test(value)) {
        message.warning('昵称仅支持中文、字母、数字和下划线，不能包含特殊字符')
        return
    }
    savingNickname.value = true
    try {
        await userStore.updateNickname(value)
        editingNickname.value = false
        message.success('昵称修改成功')
    } catch (e) {
        message.error((e as Error).message)
    } finally {
        savingNickname.value = false
    }
}

// 修改密码
const showPwdModal = ref(false)
const pwdCurrent = ref('')
const pwdNew = ref('')
const pwdConfirm = ref('')
const savingPassword = ref(false)

function openPwdModal() {
    pwdCurrent.value = ''
    pwdNew.value = ''
    pwdConfirm.value = ''
    showPwdModal.value = true
}

async function savePassword() {
    if (!pwdCurrent.value) {
        message.warning('请输入当前密码')
        return
    }
    if (!pwdNew.value || pwdNew.value.length < 6) {
        message.warning('新密码至少 6 位')
        return
    }
    if (pwdNew.value !== pwdConfirm.value) {
        message.warning('两次输入的新密码不一致')
        return
    }
    savingPassword.value = true
    try {
        await userStore.changePassword(pwdCurrent.value, pwdNew.value, pwdConfirm.value)
        showPwdModal.value = false
        message.success('密码修改成功')
    } catch (e) {
        message.error((e as Error).message)
    } finally {
        savingPassword.value = false
    }
}

function handleLogout() {
    userStore.logout()
    message.success('已退出登录')
    router.push('/')
}
</script>

<template>
    <div class="profile-page">
        <n-card class="profile-card">
            <n-h2 class="profile-title">个人资料</n-h2>
            <n-descriptions bordered :column="1" label-placement="left" size="large">
                <n-descriptions-item label="邮箱">
                    {{ userStore.user?.email ?? '-' }}
                </n-descriptions-item>
                <n-descriptions-item label="昵称">
                    <div class="nickname-row">
                        <template v-if="editingNickname">
                            <n-input v-model:value="nicknameInput" placeholder="请输入昵称（1-20 位，中文/字母/数字/下划线）"
                                :maxlength="20" size="small" style="max-width: 260px" @keyup.enter="saveNickname" />
                            <n-button size="small" type="primary" :loading="savingNickname" @click="saveNickname">
                                保存
                            </n-button>
                            <n-button size="small" @click="editingNickname = false">取消</n-button>
                        </template>
                        <template v-else>
                            <span class="nickname-value">{{ userStore.user?.nickname ?? '未设置' }}</span>
                            <n-button size="tiny" secondary @click="startEditNickname">修改</n-button>
                        </template>
                    </div>
                </n-descriptions-item>
                <n-descriptions-item label="角色">
                    {{ roleLabels[userStore.user?.role ?? ''] ?? userStore.user?.role ?? '-' }}
                </n-descriptions-item>
                <n-descriptions-item label="注册时间">
                    {{ createdAt }}
                </n-descriptions-item>
            </n-descriptions>
        </n-card>
        <n-button secondary block class="pwd-btn" @click="openPwdModal">
            修改密码
        </n-button>
        <n-button type="error" block class="logout-btn" @click="handleLogout">
            退出登录
        </n-button>

        <n-modal v-model:show="showPwdModal" preset="card" title="修改密码" style="max-width: 420px" :bordered="false"
            @keydown.esc="showPwdModal = false">
            <n-form label-placement="left" label-width="90" size="large">
                <n-form-item label="当前密码">
                    <n-input v-model:value="pwdCurrent" type="password" show-password-on="click"
                        placeholder="请输入当前密码" />
                </n-form-item>
                <n-form-item label="新密码">
                    <n-input v-model:value="pwdNew" type="password" show-password-on="click" placeholder="至少 6 位" />
                </n-form-item>
                <n-form-item label="确认新密码">
                    <n-input v-model:value="pwdConfirm" type="password" show-password-on="click" placeholder="再次输入新密码"
                        @keyup.enter="savePassword" />
                </n-form-item>
            </n-form>
            <template #footer>
                <n-space justify="end">
                    <n-button @click="showPwdModal = false">取消</n-button>
                    <n-button type="primary" :loading="savingPassword" @click="savePassword">确认修改</n-button>
                </n-space>
            </template>
        </n-modal>
    </div>
</template>

<style scoped>
.profile-page {
    max-width: 480px;
    margin: 48px auto;
    padding: 0 16px;
}

.profile-title {
    text-align: center;
}

.nickname-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.nickname-value {
    margin-right: 4px;
}

.pwd-btn {
    margin-top: 16px;
}

.logout-btn {
    margin-top: 12px;
}
</style>
