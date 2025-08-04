// components/note/useNoteEditor.ts
import { ref, watch, nextTick } from 'vue'
import type { EnhancedNote } from '@/types/note'

export function useNoteEditor(props: {
  activeNote: EnhancedNote | undefined
}, emit: {
  (e: 'update-note', payload: EnhancedNote): void
  (e: 'save-note'): void
}) {
  const rawContent = ref('')
  const isEditing = ref(false)

  const renderMarkdown = (content: string): string => {
    // 简单 Markdown 渲染（可扩展）
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/__(.*?)__/g, '<u>$1</u>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^(.+)$/gm, '<p>$1</p>')
  }

  const updateContent = (html: string) => {
    if (!props.activeNote) return
    // 简单 HTML 转 Markdown（可扩展）
    const markdown = html
      .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
      .replace(/<em>(.*?)<\/em>/g, '*$1*')
      .replace(/<u>(.*?)<\/u>/g, '__$1__')
      .replace(/<br>/g, '\n')
      .replace(/<\/p><p>/g, '\n\n')
      .replace(/<\/?p>/g, '')
    props.activeNote.content = markdown
    rawContent.value = markdown
    emit('update-note', { ...props.activeNote })
    emit('save-note')
  }

  watch(
    () => props.activeNote?.content,
    (val) => {
      rawContent.value = val || ''
    },
    { immediate: true }
  )

  return {
    rawContent,
    isEditing,
    renderMarkdown,
    updateContent,
  }
}