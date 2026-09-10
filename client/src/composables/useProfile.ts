import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import { useUserStore } from '@/stores/user'

/** 昵称长度上限（与后端校验保持一致） */
const NICKNAME_MAX_LENGTH = 20
/** 昵称允许的字符：中文、字母、数字、下划线 */
const NICKNAME_PATTERN = /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/
/** 新密码最短长度 */
const PASSWORD_MIN_LENGTH = 6

/**
 * useProfile
 *
 * 个人资料里「昵称 / 密码」的表单状态与提交流程，统一走：校验 → 调数据层 → 提示结果 → 收尾
 * （关闭编辑态/弹窗、清理输入）。
 *
 * 分层说明：
 * - 数据请求仍在 `stores/user.ts`（`updateNickname` / `changePassword`），本文件不直接发请求；
 * - 表单校验、message 提示、loading、弹窗开关属于 UI 关注点，故放在 composable 而不是 store，
 *   也避免编辑态这类只在单个页面存在的状态被提升为全局状态。
 */
export function useProfile() {
  const message = useMessage()
  const userStore = useUserStore()

  // —— 昵称 ——
  const nicknameInput = ref(userStore.user?.nickname ?? '')
  const editingNickname = ref(false)
  const savingNickname = ref(false)

  function startEditNickname() {
    nicknameInput.value = userStore.user?.nickname ?? ''
    editingNickname.value = true
  }

  function cancelEditNickname() {
    editingNickname.value = false
  }

  /** 校验昵称：通过返回 null，否则返回提示文案 */
  function validateNickname(value: string): string | null {
    if (!value) return '昵称不能为空'
    if (value.length > NICKNAME_MAX_LENGTH) return `昵称最长 ${NICKNAME_MAX_LENGTH} 个字符`
    if (!NICKNAME_PATTERN.test(value)) return '昵称仅支持中文、字母、数字和下划线，不能包含特殊字符'
    return null
  }

  async function saveNickname() {
    const value = nicknameInput.value.trim()
    const invalid = validateNickname(value)
    if (invalid) {
      message.warning(invalid)
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

  // —— 密码 ——
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

  /** 校验密码表单：通过返回 null，否则返回提示文案 */
  function validatePassword(): string | null {
    if (!pwdCurrent.value) return '请输入当前密码'
    if (!pwdNew.value || pwdNew.value.length < PASSWORD_MIN_LENGTH) {
      return `新密码至少 ${PASSWORD_MIN_LENGTH} 位`
    }
    if (pwdNew.value !== pwdConfirm.value) return '两次输入的新密码不一致'
    return null
  }

  async function savePassword() {
    const invalid = validatePassword()
    if (invalid) {
      message.warning(invalid)
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

  return {
    nicknameInput,
    editingNickname,
    savingNickname,
    startEditNickname,
    cancelEditNickname,
    saveNickname,
    showPwdModal,
    pwdCurrent,
    pwdNew,
    pwdConfirm,
    savingPassword,
    openPwdModal,
    savePassword,
  }
}
