import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'

interface SearchResult {
  // 定义搜索结果类型
  id: string
  title: string
  type: 'question' | 'topic' | 'video'
  [key: string]: any
}

export const useSearchStore = defineStore('search', () => {
  // 搜索历史
  const searchHistory: Ref<string[]> = ref([])
  
  // 当前搜索条件
  const searchQuery: Ref<string> = ref('')
  
  // 搜索结果缓存
  const searchResults: Ref<Record<string, SearchResult[]>> = ref({})
  
  // 当前活动标签
  const activeTab: Ref<'all' | 'questions' | 'topics' | 'videos'> = ref('all')
  
  // 添加搜索历史
  const addToHistory = (query: string) => {
    // 去重
    searchHistory.value = searchHistory.value.filter(item => item !== query)
    // 添加到开头
    searchHistory.value.unshift(query)
    // 限制最多10条历史记录
    if (searchHistory.value.length > 10) {
      searchHistory.value.pop()
    }
    // 保存到本地存储
    try {
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
    } catch (error) {
      console.error('保存搜索历史失败:', error)
    }
  }
  
  // 清除搜索历史
  const clearSearchHistory = () => {
    searchHistory.value = []
    localStorage.removeItem('searchHistory')
  }
  
  // 删除单个历史记录项
  const removeHistoryItem = (index: number) => {
    searchHistory.value.splice(index, 1)
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
  }
  
  // 执行搜索
  const executeSearch = (router: any) => {
    const query = searchQuery.value.trim()
    if (!query) return
    
    // 添加到历史记录
    addToHistory(query)
    
    // 跳转到搜索页面
    if (router) {
      router.push({
        path: '/search',
        query: { q: query }
      })
    }
  }
  
  // 从本地存储加载搜索历史
  const loadSearchHistory = () => {
    try {
      const savedHistory = localStorage.getItem('searchHistory')
      if (savedHistory) {
        searchHistory.value = JSON.parse(savedHistory)
      }
    } catch (error) {
      console.error('加载搜索历史失败:', error)
      localStorage.removeItem('searchHistory')
    }
  }
  
  // 缓存搜索结果
  const cacheResults = (query: string, results: SearchResult[]) => {
    searchResults.value[query] = results
  }
  
  // 获取缓存结果
  const getCachedResults = (query: string): SearchResult[] | null => {
    return searchResults.value[query] || null
  }
  
  return {
    // 状态
    searchHistory,
    searchQuery, 
    searchResults,
    activeTab,
    
    // 方法
    addToHistory,
    clearSearchHistory,
    removeHistoryItem,
    executeSearch,
    loadSearchHistory,
    cacheResults,
    getCachedResults
  }
})
