import type { EnhancedNote } from '@/types/note'

/**
 * 格式化日期显示
 * @param date 日期对象或字符串
 * @param full 是否显示完整日期时间
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date: Date | string, full = false): string => {
  const noteDate = new Date(date)
  const now = new Date()
  
  if (full) {
    return noteDate.toLocaleString()
  }
  
  const isSameDay = noteDate.toDateString() === now.toDateString()
  const isYesterday = new Date(now.getTime() - 86400000).toDateString() === noteDate.toDateString()
  
  if (isSameDay) {
    return `今天 ${noteDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  } else if (isYesterday) {
    return `昨天 ${noteDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  } else {
    return noteDate.toLocaleDateString()
  }
}

/**
 * 格式化时间显示
 * @param date 日期对象
 * @returns 格式化后的时间字符串
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

/**
 * 从本地存储加载笔记
 * @returns 笔记数组
 */
export const loadNotes = (): EnhancedNote[] => {
  const saved = localStorage.getItem('study-notes')
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as EnhancedNote[]
      return parsed.map(note => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
      }))
    } catch (e) {
      console.error('加载笔记失败', e)
      return []
    }
  }
  return []
}

/**
 * 保存笔记到本地存储
 * @param notes 笔记数组
 */
export const saveNotes = (notes: EnhancedNote[]): void => {
  try {
    localStorage.setItem('study-notes', JSON.stringify(notes))
  } catch (e) {
    console.error('保存笔记失败', e)
    alert('保存笔记失败，请检查存储空间是否充足')
  }
}
