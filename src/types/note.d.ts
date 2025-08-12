// 笔记类型定义
export interface NoteItem {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: number
  updatedAt: number
}

export type NoteCreatePayload = Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>
export type NoteUpdatePayload = Partial<NoteCreatePayload>

// 笔记筛选条件
export interface NoteFilter {
  keyword: string
  tags: string[]
  sortBy: 'updatedAt' | 'createdAt' | 'title'
  sortOrder: 'asc' | 'desc'
}
