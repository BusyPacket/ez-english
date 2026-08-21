<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
})

const props = defineProps<{ content: string }>()

const rendered = computed(() => md.render(props.content ?? ''))
</script>

<template>
  <div class="markdown-body" v-html="rendered" />
</template>

<style scoped>
.markdown-body {
  font-size: 0.875rem;
  line-height: 1.7;
  word-break: break-word;
}

.markdown-body :deep(p) {
  margin: 6px 0;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
  margin: 12px 0 6px;
  font-weight: 600;
  line-height: 1.4;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 20px;
  margin: 6px 0;
}

.markdown-body :deep(li) {
  margin: 2px 0;
}

.markdown-body :deep(code) {
  background: color-mix(in srgb, var(--n-text-color) 10%, transparent);
  border-radius: 4px;
  padding: 1px 5px;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 0.8125rem;
}

.markdown-body :deep(pre) {
  background: color-mix(in srgb, var(--n-text-color) 6%, transparent);
  border-radius: 6px;
  padding: 10px;
  overflow-x: auto;
}

.markdown-body :deep(pre code) {
  background: none;
  padding: 0;
}

.markdown-body :deep(table) {
  border-collapse: collapse;
  margin: 8px 0;
  width: 100%;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  border: 1px solid var(--n-border-color);
  padding: 4px 8px;
  text-align: left;
}

.markdown-body :deep(blockquote) {
  border-left: 3px solid var(--n-border-color);
  margin: 8px 0;
  padding: 2px 12px;
  color: var(--n-text-color-3);
}

.markdown-body :deep(a) {
  color: var(--n-primary-color);
}

.markdown-body :deep(hr) {
  border: none;
  border-top: 1px solid var(--n-border-color);
  margin: 10px 0;
}
</style>
