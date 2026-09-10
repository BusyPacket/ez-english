import { computed, ref } from 'vue'
import { useMessage } from 'naive-ui'
import { api } from '@/api/http'

/** 下拉选项：value 提交给后端，label 仅用于展示 */
export interface ModelOption {
  value: string
  label: string
}

/** AI 公司及其可选模型（来自后端 /profile/ai-options） */
export interface ProviderOption {
  value: string
  label: string
  platformUrl: string
  models: ModelOption[]
}

/** 模型列表来源：live = 用已保存的 Key 实时拉取；fallback = 内置兜底 */
export type ModelSource = 'live' | 'fallback'

/** 默认值与后端 schema（profiles 表默认值）保持一致 */
const DEFAULT_PROVIDER = 'deepseek'
const DEFAULT_MODEL = 'deepseek-v4-flash'

/**
 * useAiModels
 *
 * 收敛「AI 公司 / 模型」的全部状态与逻辑，让页面只负责渲染：
 * - 公司列表来自后端元数据（单一权威来源），模型列表优先用已保存的 Key 实时调 DeepSeek 拉取，
 *   无 Key / Key 无效 / 网络失败时回退内置模型；
 * - 维护「所选模型必须属于当前公司」的规则（切换公司或应用已保存配置时回退到第一项）；
 * - 手动刷新模型列表，并对「没拉到实时列表」给出原因提示。
 *
 * 用法：
 * ```ts
 * const { aiProvider, aiModel, modelOptions, loadProviders, applySaved } = useAiModels()
 * await loadProviders()                    // 进页面：公司列表 + 实时模型
 * await refreshLiveModels()                // 仅刷新模型
 * applySaved(cfg.aiProvider, cfg.model)    // 应用已保存配置（含模型合法性回退）
 * ```
 */
export function useAiModels() {
  const message = useMessage()

  /** 当前选中的 AI 公司 / 模型（模板可 v-model 双向绑定） */
  const aiProvider = ref(DEFAULT_PROVIDER)
  const aiModel = ref(DEFAULT_MODEL)

  /** 公司列表（后端元数据） */
  const providerOptions = ref<ProviderOption[]>([])
  /** 实时模型列表（未拿到时为空数组） */
  const liveModels = ref<ModelOption[]>([])
  /** 当前模型列表的来源 */
  const modelSource = ref<ModelSource>('fallback')
  /** 手动刷新中（用于按钮 loading） */
  const refreshingModels = ref(false)

  const aiProviderOptions = computed(() =>
    providerOptions.value.map((p) => ({ label: p.label, value: p.value })),
  )

  /** 当前公司的内置模型（实时列表为空时兜底） */
  const fallbackModels = computed(
    () => providerOptions.value.find((o) => o.value === aiProvider.value)?.models ?? [],
  )

  /** 模型下拉选项：实时列表优先，为空则用内置兜底 */
  const modelOptions = computed(() =>
    liveModels.value.length ? liveModels.value : fallbackModels.value,
  )

  /** 当前所选公司（用于「创建 Key」链接与平台展示名） */
  const currentProvider = computed(() =>
    providerOptions.value.find((o) => o.value === aiProvider.value),
  )
  const platformName = computed(() => currentProvider.value?.label ?? 'AI 公司')
  const platformUrl = computed(() => currentProvider.value?.platformUrl ?? '')

  /** 所选模型不在当前列表时，回退到列表第一项 */
  function ensureModelSelected() {
    if (!modelOptions.value.some((m) => m.value === aiModel.value)) {
      aiModel.value = modelOptions.value[0]?.value ?? ''
    }
  }

  /** 切换公司：模型不属于新公司时回退为该公司的第一个模型 */
  function onProviderChange() {
    ensureModelSelected()
  }

  /** 拉取公司列表（含各公司内置模型，用于兜底） */
  async function loadProviders() {
    const opts = await api<{ providers: ProviderOption[] }>('/profile/ai-options')
    providerOptions.value = opts.providers
  }

  /** 用已保存的 Key 实时拉取模型列表；返回本次结果的来源 */
  async function refreshLiveModels(): Promise<ModelSource> {
    try {
      const live = await api<{ models: ModelOption[]; source: ModelSource }>(
        '/profile/ai-config/models',
      )
      liveModels.value = live.models
      modelSource.value = live.source
    } catch {
      liveModels.value = []
      modelSource.value = 'fallback'
    }
    return modelSource.value
  }

  /** 应用已保存的配置（回填公司/模型，并把不合法的模型回退到列表第一项） */
  function applySaved(provider: string, model: string) {
    aiProvider.value = provider
    aiModel.value = model
    ensureModelSelected()
  }

  /**
   * 手动刷新模型列表：
   * - 未保存 API Key → 提示先保存（刷新拿不到实时列表）
   * - 拿到实时列表 → 提示模型数量
   * - 回退内置模型 → 提示原因，避免用户以为按钮没生效
   */
  async function refreshModelsManually(hasApiKey: boolean) {
    if (!hasApiKey) {
      message.warning('请先保存 API Key，刷新后才能获取实时模型列表')
      return
    }
    refreshingModels.value = true
    try {
      if ((await refreshLiveModels()) === 'live') {
        message.success(`已获取到 ${liveModels.value.length} 个可用模型`)
      } else {
        message.warning('未能获取实时模型列表（Key 无效或网络异常），暂显示内置模型')
      }
    } finally {
      refreshingModels.value = false
    }
  }

  return {
    aiProvider,
    aiModel,
    aiProviderOptions,
    modelOptions,
    modelSource,
    platformName,
    platformUrl,
    refreshingModels,
    loadProviders,
    refreshLiveModels,
    refreshModelsManually,
    applySaved,
    onProviderChange,
  }
}
