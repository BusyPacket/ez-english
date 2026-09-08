import { computed, ref, shallowRef, type ComputedRef, type Ref } from 'vue'

/**
 * usePrefetchQueue
 *
 * 通用「预取缓存队列」：预先并发生成 N 项放入队首缓存，消费队首后自动向队尾补满，
 * 保证「下一项」始终就绪、零等待（适合 AI 生成、列表翻页预取等慢产场景）。
 *
 * 用法：
 * ```ts
 * const queue = usePrefetchQueue<Question>({
 *   size: 3,
 *   produce: () => api<Question>('/some-slow-endpoint'),
 *   onProduced: (q) => seenStems.push(q.stem),   // 可选：收集去重/统计
 *   onError: (e) => message.error(...),           // 可选：失败提示
 * })
 *
 * queue.fill()      // 首次/换批：补满到 size（并行）
 * queue.next()      // 消费队首并后台补一题
 * queue.reset()     // 清空（丢弃在途的过期响应）
 * ```
 *
 * 注意：
 * - `produce` 是纯工厂函数，抛错视为单次失败，不中断其它在途请求。
 * - 队列被 `reset()` 后，迟到的在途响应会自动丢弃，不会污染新一批。
 */
export interface PrefetchQueueOptions<T> {
  /** 缓存目标数量 */
  size: number
  /** 生产一项（通常是发请求）；每次调用应为同一批次的“参数” */
  produce: () => Promise<T>
  /** 生产成功回调（例如收集题干用于去重） */
  onProduced?: (item: T) => void
  /** 单项生产失败回调（例如弹出错误提示） */
  onError?: (error: unknown) => void
}

export interface PrefetchQueue<T> {
  /** 队列内容（队首即当前项；只读，请用 next/reset/fill 操作） */
  readonly items: Readonly<Ref<T[]>>
  /** 在途请求数 */
  readonly inflight: Readonly<Ref<number>>
  /** 是否还有请求在途 */
  readonly loading: ComputedRef<boolean>
  /** 队首（当前项），空队列为 null */
  readonly current: ComputedRef<T | null>
  /** 队首之外是否还有已就绪的下一项（决定能否无等待 next） */
  readonly hasNext: ComputedRef<boolean>
  /** 「已有/目标」文案，如 "2/3" */
  readonly sizeText: ComputedRef<string>
  /** 最近一次生产失败信息 */
  readonly lastError: Readonly<Ref<string>>
  /** 清空队列并丢弃在途的过期响应（换一批/参数变化时调用） */
  reset: () => void
  /** 把队列补向 size（并行发起缺口个生产请求） */
  fill: () => void
  /** 消费队首进入下一项，并在后台向队尾补满 */
  next: () => void
}

export function usePrefetchQueue<T>(options: PrefetchQueueOptions<T>): PrefetchQueue<T> {
  const { size, produce, onProduced, onError } = options
  // 用 shallowRef 保持元素类型为 T（不经 Vue 深度响应解包），增删通过整体替换数组触发更新
  const items = shallowRef<T[]>([])
  const inflight = ref(0)
  const lastError = ref('')
  /** 代际：reset 时自增，用于丢弃迟到的在途响应 */
  let epoch = 0

  const loading = computed(() => inflight.value > 0)
  const current = computed<T | null>(() => items.value[0] ?? null)
  const hasNext = computed(() => items.value.length > 1)
  const sizeText = computed(() => `${items.value.length}/${size}`)

  function reset() {
    epoch += 1
    items.value = []
    inflight.value = 0
    lastError.value = ''
  }

  async function produceOne(): Promise<void> {
    const myEpoch = epoch
    inflight.value += 1
    try {
      const item = await produce()
      if (epoch !== myEpoch) return // 队列已被 reset，丢弃过期结果
      lastError.value = ''
      items.value = [...items.value, item]
      onProduced?.(item)
    } catch (error) {
      if (epoch !== myEpoch) return
      lastError.value = error instanceof Error ? error.message : String(error)
      onError?.(error)
    } finally {
      if (epoch === myEpoch) inflight.value -= 1
    }
  }

  /** 缺口 = 目标 - 队列中 - 在途 */
  function fill() {
    const gap = size - items.value.length - inflight.value
    for (let i = 0; i < gap; i++) void produceOne()
  }

  function next() {
    if (!current.value) return
    items.value = items.value.slice(1)
    fill()
  }

  return { items, inflight, loading, current, hasNext, sizeText, lastError, reset, fill, next }
}
