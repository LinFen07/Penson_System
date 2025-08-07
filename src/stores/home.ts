import { defineStore } from 'pinia'
import { ref ,computed} from 'vue'

// 定义导航项类型
interface NavItem {
  title: string
  path: string
}

export const useSearchAndNavStore = defineStore('searchAndNav', () => {
  // 搜索相关状态
  const searchQuery = ref('')

  // 导航栏下划线相关状态
  const activeIndex = ref(0)
  const underlineWidth = ref(0)
  const underlineOffset = ref(0)
  const currentComponent = ref('/problemBank')
  
  // 导航项列表
  const navItems: NavItem[] = [
    { title: '算法沙盒', path: '/problemBank' },
    { title: '刷题看板', path: '/dashboard' },
    { title: '社区创作', path: '/community' },
    { title: '学习中心', path: '/learning' }
  ]

  // 搜索相关方法
  const clearSearch = () => {
    searchQuery.value = ''
  }

  const handleSearch = () => {
    if (searchQuery.value.trim()) {
      console.log('搜索内容:', searchQuery.value)
      // 实际搜索逻辑
    }
  }

  // 计算属性（下划线样式）
  const underlineStyle = computed(() => ({
    width: `${underlineWidth.value}px`,
    transform: `translateX(${underlineOffset.value}px)`
  }))

  return {
    // 状态
    searchQuery,
    activeIndex,
    underlineWidth,
    underlineOffset,
    currentComponent,
    navItems,
    underlineStyle,
    // 方法
    clearSearch,
    handleSearch
  }
})
