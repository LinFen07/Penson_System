import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { debounce } from '../../utils/debounce'
import type { NoteItem } from '../../types/note.d'

export const useNoteStore = defineStore('note', () => {
  // 所有笔记列表
  const notes = ref<NoteItem[]>([])
  
  // 当前编辑笔记
  const currentNote = ref<NoteItem | null>(null)
  
  // 编辑内容
  const editorContent = ref('')
  const editorTitle = ref('')
  const editorTags = ref<string[]>([])
  
  // 筛选条件
  const filter = ref({
    keyword: '',
    tags: [] as string[],
    sortBy: 'updatedAt' as 'updatedAt' | 'createdAt' | 'title',
    sortOrder: 'desc' as 'asc' | 'desc'
  })

  // 状态标志
  const isLoading = ref(false)
  const isSaving = ref(false)
  const lastSavedTime = ref<Date | null>(null)

  // 自动保存防抖函数
  const autoSave = debounce(async () => {
    if (!currentNote.value) return
    
    isSaving.value = true
    try {
      const updatedNote = {
        ...currentNote.value,
        title: editorTitle.value,
        content: editorContent.value,
        tags: editorTags.value,
        updatedAt: Date.now()
      }
      
      // 更新或添加笔记
      const index = notes.value.findIndex(n => n.id === updatedNote.id)
      if (index >= 0) {
        notes.value[index] = updatedNote
      } else {
        notes.value.push({
          ...updatedNote,
          id: Date.now().toString(),
          createdAt: Date.now()
        })
      }
      
      currentNote.value = updatedNote
      lastSavedTime.value = new Date()
    } catch (error) {
      console.error('保存笔记失败:', error)
    } finally {
      isSaving.value = false
    }
  }, 1000)

  // 监听编辑内容变化，触发自动保存
  watch([editorContent, editorTitle, editorTags], () => {
    if (currentNote.value) autoSave()
  })

  // 筛选后的笔记列表
  const filteredNotes = computed(() => {
    return notes.value
      .filter(note => {
        const matchesKeyword = note.title.includes(filter.value.keyword) || 
                             note.content.includes(filter.value.keyword)
        const matchesTags = filter.value.tags.length === 0 || 
                          filter.value.tags.every(tag => note.tags.includes(tag))
        return matchesKeyword && matchesTags
      })
      .sort((a, b) => {
        const order = filter.value.sortOrder === 'asc' ? 1 : -1
        if (filter.value.sortBy === 'title') {
          return a.title.localeCompare(b.title) * order
        }
        return (a[filter.value.sortBy] - b[filter.value.sortBy]) * order
      })
  })

  // 初始化编辑状态
  const initEditor = (note?: NoteItem) => {
    try {
      const targetNote = note ? {...note} : null
      currentNote.value = targetNote
      
      // 确保编辑器状态与当前笔记同步
      if (targetNote) {
        editorContent.value = targetNote.content || ''
        editorTitle.value = targetNote.title || ''
        editorTags.value = targetNote.tags || []
        
        // 如果传入新笔记且不在列表中，则添加
        if (!notes.value.some(n => n.id === targetNote.id)) {
          notes.value.push(targetNote)
        }
      } else {
        editorContent.value = ''
        editorTitle.value = ''
        editorTags.value = []
      }
      
      console.log('initEditor成功:', targetNote?.id)
    } catch (error) {
      console.error('initEditor失败:', error)
    }
  }

  // 监听当前笔记变化，同步到编辑器
  watch(currentNote, (newNote) => {
    if (newNote) {
      editorContent.value = newNote.content
      editorTitle.value = newNote.title
      editorTags.value = newNote.tags || []
    }
  }, { immediate: true })

  // 创建新笔记
  const createNewNote = () => {
    initEditor({
      id: '',
      title: '',
      content: '',
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    })
  }

  // 显式保存笔记
  const saveNote = async () => {
    await autoSave.flush()
  }

  // 本地存储键名
  const STORAGE_KEY = 'study-notes'

  // 从本地存储加载笔记
  const loadFromStorage = () => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  }

  // 保存笔记到本地存储
  const saveToStorage = (notes: NoteItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  }

  // 加载笔记列表
  const loadNotes = async () => {
    isLoading.value = true
    try {
      const savedNotes = loadFromStorage()
      notes.value = savedNotes
    } catch (error) {
      console.error('从本地存储加载笔记失败:', error)
    } finally {
      isLoading.value = false
    }
  }

  // 监听笔记变化，自动保存到本地存储
  watch(notes, (newNotes) => {
    saveToStorage(newNotes)
  }, { deep: true })

  // 删除笔记
  const deleteNote = (id: string) => {
    const index = notes.value.findIndex(note => note.id === id)
    if (index >= 0) notes.value.splice(index, 1)
    if (currentNote.value?.id === id) currentNote.value = null
  }

  // 更新筛选条件
  const updateFilter = (newFilter: Partial<typeof filter.value>) => {
    filter.value = { ...filter.value, ...newFilter }
  }

  // 导入文件
  const importFile = (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        editorContent.value = content
        editorTitle.value = file.name.replace(/\.[^/.]+$/, "")
        resolve()
      }
      reader.onerror = () => reject(new Error('文件读取失败'))
      reader.readAsText(file)
    })
  }

  return {
    // 状态
    notes,
    currentNote,
    filteredNotes,
    filter,
    isLoading,
    isSaving,
    lastSavedTime,
    editorContent,
    editorTitle,
    editorTags,
    
    // 方法
    loadNotes,
    initEditor,
    createNewNote,
    saveNote,
    deleteNote,
    updateFilter,
    importFile
  }
})