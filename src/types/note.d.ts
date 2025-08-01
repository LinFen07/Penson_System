// 笔记类型定义
export interface EnhancedNote {
  id: string
  title: string
  content: string
  tag?: string
  createdAt: Date
  updatedAt: Date
}


export type NoteCreatePayload = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;
export type NoteUpdatePayload = Partial<NoteCreatePayload>;
