<template>
  <div
    contenteditable
    ref="editorRef"
    class="flex-1 p-4 outline-none overflow-y-auto prose prose-sm max-w-none"
    @input="onInput"
    @focus="isEditing = true"
    @blur="isEditing = false"
  ></div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { EnhancedNote } from '@/types/note'

const props = defineProps<{
  activeNote: EnhancedNote | undefined
}>()

const emit = defineEmits<{
  (e: 'update-note', payload: EnhancedNote): void
  (e: 'save-note'): void
}>()

const editorRef = ref<HTMLElement>()
const isEditing = ref(false)

const renderMarkdown = (content: string): string => {
  return (
    content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/__(.*?)__/g, '<u>$1</u>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^(.+)$/gm, '<p>$1</p>')
  )
}

const updateContent = (html: string) => {
  if (!props.activeNote) return
  const markdown = html
    .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
    .replace(/<em>(.*?)<\/em>/g, '*$1*')
    .replace(/<u>(.*?)<\/u>/g, '__$1__')
    .replace(/<br>/g, '\n')
    .replace(/<\/p><p>/g, '\n\n')
    .replace(/<\/?p>/g, '')
    .trim()
  props.activeNote.content = markdown
  emit('update-note', { ...props.activeNote })
  emit('save-note')
}

const onInput = () => {
  if (editorRef.value) {
    updateContent(editorRef.value.innerHTML)
  }
}

// 监听外部内容变化，重新渲染
watch(
  () => props.activeNote?.content,
  (val) => {
    nextTick(() => {
      if (editorRef.value && editorRef.value.innerHTML !== renderMarkdown(val || '')) {
        editorRef.value.innerHTML = renderMarkdown(val || '')
      }
    })
  },
  { immediate: true }
)

// 暴露方法给父组件调用
const formatText = (type: string) => {
  if (!editorRef.value) return
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return
  const range = selection.getRangeAt(0)
  const selectedText = range.toString()

  const rules: Record<string, string> = {
    bold: '**',
    italic: '*',
    underline: '__',
    heading: '# ',
    list: '- ',
    link: '[链接](https://)',
  }

  const prefix = rules[type] || ''
  const suffix = type === 'bold' || type === 'italic' || type === 'underline' ? rules[type] : ''
  const placeholder = type === 'link' ? '链接文字' : '文本'

  const replacement = prefix + (selectedText || placeholder) + suffix
  range.deleteContents()
  range.insertNode(document.createTextNode(replacement))
  selection.removeAllRanges()
  onInput()
}

const clearFormatting = () => {
  if (!editorRef.value || !props.activeNote) return
  const text = editorRef.value.innerText
  editorRef.value.innerHTML = text
  props.activeNote.content = text
  emit('update-note', { ...props.activeNote })
  emit('save-note')
}

defineExpose({
  formatText,
  clearFormatting,
})
</script>

<style scoped>
[contenteditable] {
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>