<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * 回到顶部按钮：固定右下角，贴着指定内容的右边缘。
 *
 * 用法：
 *   <BackToTop />                    // 默认对齐 .paper-page
 *   <BackToTop align-to=".my-box" /> // 对齐其它容器
 *
 * 注意：必须在参照内容已渲染后挂载（如放在 v-else-if 分支内），
 * 否则 onMounted 时取不到参照元素、无法对齐。
 */
const props = withDefaults(
    defineProps<{
        /** 对齐参照的内容选择器（按钮贴它的右边缘） */
        alignTo?: string
        /** 与参照内容右边缘的间隙（px） */
        gap?: number
        /** 距视口底部的距离（px） */
        bottom?: number
    }>(),
    {
        alignTo: '.paper-page',
        gap: 8,
        bottom: 24,
    },
)

const right = ref(20)
/** n-back-top 显式监听 document 滚动（避免被 overflow:hidden 容器干扰而不显示） */
const docListener = () => document

function syncPosition() {
    const el = document.querySelector<HTMLElement>(props.alignTo)
    if (!el) return
    // fixed 定位基于布局视口（不含滚动条），须用 clientWidth 计算，否则右偏一个滚动条宽度
    right.value = Math.max(
        document.documentElement.clientWidth - el.getBoundingClientRect().right + props.gap,
        8,
    )
}

onMounted(() => {
    syncPosition()
    window.addEventListener('resize', syncPosition)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', syncPosition)
})
</script>

<template>
    <n-back-top :right="right" :bottom="bottom" :listen-to="docListener" />
</template>
