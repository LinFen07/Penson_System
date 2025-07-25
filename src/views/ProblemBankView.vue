<template>
  <div class="w-full px-4  min-w-[320px] h-screen overflow-hidden flex flex-col">
    <div class="flex flex-grow overflow-hidden">
      <!-- 左侧导航栏 - 数据结构分类 -->
      <div class="w-56 flex-shrink-0 p-4 space-y-2 border-r border-gray-200 bg-white">
        <div class="grid grid-cols-2 gap-3">
          <div 
            v-for="ds in dataStructureOptions" 
            :key="ds.value"
            class="w-20 h-20 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all"
            :class="{
              'bg-blue-100 hover:bg-blue-200': !filterForm.dataStructure.includes(ds.value),
              'bg-blue-500 hover:bg-blue-600': filterForm.dataStructure.includes(ds.value)
            }"
            @click="toggleDataStructureFilter(ds.value)"
          >
            <span 
              class="font-medium mb-1"
              :class="{
                'text-blue-600': !filterForm.dataStructure.includes(ds.value),
                'text-white': filterForm.dataStructure.includes(ds.value)
              }"
            >
              {{ ds.label }}
            </span>
            <span 
              class="text-xs"
              :class="{
                'text-blue-400': !filterForm.dataStructure.includes(ds.value),
                'text-blue-100': filterForm.dataStructure.includes(ds.value)
              }"
            >
              {{ getProblemCountByStructure(ds.value) }}题
            </span>
          </div>
        </div>
      </div>

      <!-- 右侧题库区域 - 可滚动 -->
      <div class="flex-grow p-5 min-w-0 overflow-y-auto">
        <!-- 标题 -->
        <div class="flex justify-between items-center mb-3">
          <h1 class="text-xl font-semibold">题库中心</h1>
        </div>
        
        <!-- 搜索区域 -->
        <div class="flex items-center space-x-2 mb-5 flex-wrap gap-2">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索题目"
            clearable
            style="max-width: 200px; border-radius: 20px;"
            @keyup.enter="searchProblems"
          >
            <template #prefix>
              <el-icon class="text-gray-400">
                <Search />
              </el-icon>
            </template>
          </el-input>

          <!-- 优化后的筛选按钮（修复图标问题） -->
          <el-button
            type="primary"
            :icon="showFilterModal ? Search : Filter" 
            size="small"
            style="border-radius: 20px; transition: all 0.3s ease;"
            @click="showFilterModal = true"
            class="relative group"
          >
            筛选
            <!-- 筛选条件提示 -->
            <template v-if="hasActiveFilters">
              <span class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {{ activeFilterCount }}
              </span>
            </template>
            
            <!-- 悬停时显示当前筛选条件 -->
            <div v-if="hasActiveFilters" class="absolute bottom-full left-0 mb-2 p-2 bg-white rounded shadow-lg text-sm w-48 z-10 hidden group-hover:block">
              <div class="font-medium text-gray-700 mb-1">当前筛选条件：</div>
              <div v-if="filterForm.difficulty" class="text-gray-600">• 难度：{{ filterForm.difficulty }}</div>
              <div v-if="filterForm.dataStructure.length" class="text-gray-600">• 数据结构：{{ filterForm.dataStructure.map(getStructureLabel).join('、') }}</div>
              <div v-if="filterForm.language.length" class="text-gray-600">• 语言：{{ filterForm.language.map(getLanguageLabel).join('、') }}</div>
              <div v-if="filterForm.passRateMin > 0 || filterForm.passRateMax < 100" class="text-gray-600">• 通过率：{{ filterForm.passRateMin }}%-{{ filterForm.passRateMax }}%</div>
            </div>
          </el-button>

          <!-- 新增：清除筛选按钮 -->
          <el-button
            v-if="hasActiveFilters"
            type="default"
            icon="el-icon-refresh-left"
            size="small"
            style="border-radius: 20px; background: #f5f5f5;"
            @click="resetFilterForm"
          >
            清除筛选
          </el-button>
        </div>
        
        <!-- 题库表格 -->
        <el-table 
          :data="currentProblemList" 
          class="w-full mt-3" 
          highlight-current-row
          @row-click="(row) => viewProblem(row.id)"
        >
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="title" label="题目" />
          <el-table-column prop="difficulty" label="难度" width="120">
            <template #default="{ row }">
              <el-tag :type="getDifficultyTagType(row.difficulty)">{{ row.difficulty }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="数据结构" width="120">
            <template #default="{ row }">{{ getStructureLabel(row.dataStructure) }}</template>
          </el-table-column>
          <el-table-column label="语言" width="100">
            <template #default="{ row }">{{ getLanguageLabel(row.language) }}</template>
          </el-table-column>
          <el-table-column prop="passRate" label="通过率" width="120">
            <template #default="{ row }">
              <el-progress :percentage="parseInt(row.passRate)" :stroke-width="14" />
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页控件 -->
        <el-pagination
          class="mt-4 flex justify-center"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalProblems"
          :page-sizes="[5, 10, 20]"
          :page-size="pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
        
        <!-- 筛选条件弹窗 -->
        <el-dialog
          v-model="showFilterModal"
          title="筛选条件"
          width="40%"
          @close="onFilterModalClose"
        >
          <div class="p-4">
            <el-form :model="filterForm" label-width="100px" class="space-y-4">
              <!-- 难度筛选 -->
              <el-form-item label="难度">
                <el-select
                  v-model="filterForm.difficulty"
                  placeholder="选择难度"
                  clearable
                  style="width: 100%;"
                >
                  <el-option
                    v-for="item in difficultyOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              
              <!-- 数据结构筛选 -->
              <el-form-item label="数据结构">
                <el-select
                  v-model="filterForm.dataStructure"
                  multiple
                  collapse-tags
                  placeholder="选择数据结构"
                  clearable
                  style="width: 100%;"
                >
                  <el-option
                    v-for="item in dataStructureOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              
              <!-- 语言筛选 -->
              <el-form-item label="语言">
                <el-select
                  v-model="filterForm.language"
                  multiple
                  collapse-tags
                  placeholder="选择语言"
                  clearable
                  style="width: 100%;"
                >
                  <el-option
                    v-for="item in languageOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              
              <!-- 通过率筛选 -->
              <el-form-item label="通过率范围">
                <div class="flex items-center space-x-2">
                  <el-input
                    v-model.number="filterForm.passRateMin"
                    type="number"
                    placeholder="最小"
                    size="small"
                    style="width: 80px;"
                  />
                  <span class="text-gray-500">至</span>
                  <el-input
                    v-model.number="filterForm.passRateMax"
                    type="number"
                    placeholder="最大"
                    size="small"
                    style="width: 80px;"
                  />
                  <span class="text-gray-500 ml-2">%</span>
                </div>
                <el-slider
                  v-model="filterForm.passRateRange"
                  range
                  :min="0"
                  :max="100"
                  :step="5"
                  show-tooltip
                  @change="updatePassRateInputs"
                />
              </el-form-item>
            </el-form>
          </div>
          
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="resetFilterForm">重置</el-button>
              <el-button type="primary" @click="applyFilters">应用筛选</el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Filter } from '@element-plus/icons-vue'  // 只导入存在的图标

// 搜索关键词
const searchKeyword = ref('')
// 筛选条件弹窗状态
const showFilterModal = ref(false)

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)

// 筛选表单数据
const filterForm = reactive({
  difficulty: '',
  dataStructure: [],
  language: [],
  passRateRange: [0, 100],
  passRateMin: 0,
  passRateMax: 100
})

// 计算属性：是否有活跃的筛选条件
const hasActiveFilters = computed(() => {
  return filterForm.difficulty !== '' || 
         filterForm.dataStructure.length > 0 || 
         filterForm.language.length > 0 || 
         filterForm.passRateMin > 0 || 
         filterForm.passRateMax < 100
})

// 计算属性：活跃筛选条件数量
const activeFilterCount = computed(() => {
  let count = 0
  if (filterForm.difficulty !== '') count++
  if (filterForm.dataStructure.length > 0) count++
  if (filterForm.language.length > 0) count++
  if (filterForm.passRateMin > 0 || filterForm.passRateMax < 100) count++
  return count
})

// 监听滑块变化，同步到输入框
const updatePassRateInputs = () => {
  filterForm.passRateMin = filterForm.passRateRange[0]
  filterForm.passRateMax = filterForm.passRateRange[1]
}

// 监听输入框变化，同步到滑块
watch(() => [filterForm.passRateMin, filterForm.passRateMax], () => {
  // 处理非数字情况和边界值
  filterForm.passRateMin = isNaN(filterForm.passRateMin) ? 0 : Math.max(0, Math.min(100, filterForm.passRateMin))
  filterForm.passRateMax = isNaN(filterForm.passRateMax) ? 100 : Math.max(0, Math.min(100, filterForm.passRateMax))
  
  // 确保最小值不大于最大值
  if (filterForm.passRateMin > filterForm.passRateMax) {
    [filterForm.passRateMin, filterForm.passRateMax] = [filterForm.passRateMax, filterForm.passRateMin]
  }
  
  filterForm.passRateRange = [filterForm.passRateMin, filterForm.passRateMax]
})

// 筛选选项
const difficultyOptions = [
  { value: '', label: '全部' },
  { value: '简单', label: '简单' },
  { value: '中等', label: '中等' },
  { value: '困难', label: '困难' }
]

const dataStructureOptions = [
  { value: 'array', label: '数组' },
  { value: 'linkedList', label: '链表' },
  { value: 'tree', label: '树' },
  { value: 'graph', label: '图' },
  { value: 'stack', label: '栈' },
  { value: 'queue', label: '队列' },
  { value: 'hashTable', label: '哈希表' },
  { value: 'dynamicProgramming', label: '动态规划' },
  { value: 'math', label: '数学' },
  { value: 'heap', label: '堆' },
  { value: 'unionFind', label: '并查集' }
]

const languageOptions = [
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' }
]

// 题库数据
const problemList = ref([
  { id: 1, title: '两数之和', difficulty: '简单', passRate: '72%', dataStructure: 'array', language: 'python' },
  { id: 2, title: '反转链表', difficulty: '中等', passRate: '65%', dataStructure: 'linkedList', language: 'java' },
  { id: 3, title: '二叉树的中序遍历', difficulty: '简单', passRate: '68%', dataStructure: 'tree', language: 'python' },
  { id: 4, title: '最长回文子串', difficulty: '中等', passRate: '58%', dataStructure: 'dynamicProgramming', language: 'javascript' },
  { id: 5, title: '正则表达式匹配', difficulty: '困难', passRate: '42%', dataStructure: 'dynamicProgramming', language: 'python' },
  { id: 6, title: '数组排序', difficulty: '简单', passRate: '85%', dataStructure: 'array', language: 'java' },
  { id: 7, title: '快速幂', difficulty: '困难', passRate: '38%', dataStructure: 'math', language: 'cpp' },
  { id: 8, title: '广度优先搜索', difficulty: '中等', passRate: '52%', dataStructure: 'graph', language: 'python' },
  { id: 9, title: '深度优先搜索', difficulty: '中等', passRate: '55%', dataStructure: 'tree', language: 'java' },
  { id: 10, title: '动态规划入门', difficulty: '中等', passRate: '50%', dataStructure: 'dynamicProgramming', language: 'javascript' },
  { id: 11, title: '栈的应用', difficulty: '简单', passRate: '78%', dataStructure: 'stack', language: 'csharp' },
  { id: 12, title: '队列实现', difficulty: '简单', passRate: '75%', dataStructure: 'queue', language: 'python' },
  { id: 13, title: '哈希表应用', difficulty: '中等', passRate: '60%', dataStructure: 'hashTable', language: 'java' },
  { id: 14, title: '堆排序', difficulty: '困难', passRate: '35%', dataStructure: 'heap', language: 'cpp' },
  { id: 15, title: '并查集', difficulty: '中等', passRate: '53%', dataStructure: 'unionFind', language: 'python' },
  { id: 16, title: '二分查找', difficulty: '简单', passRate: '70%', dataStructure: 'array', language: 'java' },
  { id: 17, title: '回溯算法', difficulty: '困难', passRate: '32%', dataStructure: 'tree', language: 'javascript' },
  { id: 18, title: '滑动窗口', difficulty: '中等', passRate: '57%', dataStructure: 'array', language: 'python' },
  { id: 19, title: '前缀和', difficulty: '中等', passRate: '54%', dataStructure: 'array', language: 'java' },
  { id: 20, title: '拓扑排序', difficulty: '困难', passRate: '30%', dataStructure: 'graph', language: 'cpp' }
])

// 筛选后的题目
const filteredProblems = computed(() => {
  let filtered = [...problemList.value]
  
  // 按关键词筛选
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.trim().toLowerCase()
    filtered = filtered.filter(problem => 
      problem.title.toLowerCase().includes(keyword) || 
      problem.difficulty.toLowerCase().includes(keyword) ||
      problem.dataStructure.toLowerCase().includes(keyword) ||
      problem.language.toLowerCase().includes(keyword)
    )
  }
  
  // 按难度筛选
  if (filterForm.difficulty) {
    filtered = filtered.filter(problem => problem.difficulty === filterForm.difficulty)
  }
  
  // 按数据结构筛选
  if (filterForm.dataStructure.length > 0) {
    filtered = filtered.filter(problem => filterForm.dataStructure.includes(problem.dataStructure))
  }
  
  // 按语言筛选
  if (filterForm.language.length > 0) {
    filtered = filtered.filter(problem => filterForm.language.includes(problem.language))
  }
  
  // 按通过率筛选
  filtered = filtered.filter(problem => {
    const rate = parseInt(problem.passRate)
    return rate >= filterForm.passRateMin && rate <= filterForm.passRateMax
  })
  
  return filtered
})

// 总题目数（筛选后）
const totalProblems = computed(() => filteredProblems.value.length)

// 当前页显示的题目
const currentProblemList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredProblems.value.slice(start, end)
})

// 难度标签类型
const getDifficultyTagType = (difficulty) => {
  switch(difficulty) {
    case '简单': return 'success'
    case '中等': return 'warning'
    case '困难': return 'danger'
    default: return 'info'
  }
}

// 获取数据结构中文标签
const getStructureLabel = (value) => {
  const item = dataStructureOptions.find(option => option.value === value)
  return item ? item.label : value
}

// 切换数据结构筛选
const toggleDataStructureFilter = (value) => {
  const index = filterForm.dataStructure.indexOf(value)
  if (index === -1) {
    filterForm.dataStructure.push(value)
  } else {
    filterForm.dataStructure.splice(index, 1)
  }
  currentPage.value = 1
}

// 获取每种数据结构的题目数量
const getProblemCountByStructure = (structure) => {
  return problemList.value.filter(p => p.dataStructure === structure).length
}

// 获取语言中文标签
const getLanguageLabel = (value) => {
  const item = languageOptions.find(option => option.value === value)
  return item ? item.label : value
}

// 搜索功能
const searchProblems = () => {
  currentPage.value = 1 // 重置到第一页
}

// 监听搜索关键词变化，实时筛选
watch(searchKeyword, () => {
  currentPage.value = 1 // 重置页码
})

// 处理分页大小变化
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  currentPage.value = 1 // 重置到第一页
}

// 处理页码变化
const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
}

// 重置筛选表单
const resetFilterForm = () => {
  filterForm.difficulty = ''
  filterForm.dataStructure = []
  filterForm.language = []
  filterForm.passRateRange = [0, 100]
  filterForm.passRateMin = 0
  filterForm.passRateMax = 100
}

// 应用筛选条件
const applyFilters = () => {
  currentPage.value = 1 // 重置到第一页
  showFilterModal.value = false
}

// 关闭筛选弹窗时的回调
const onFilterModalClose = () => {
  // 可以在这里添加关闭弹窗后的逻辑
}

// 查看题目
const router = useRouter()

const viewProblem = (problemId) => {
  router.push({
    name: 'AlgorithmSandbox',
    query: {
      problemId: problemId.toString()
    }
  })
}
</script>

<style scoped>
/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 表格行悬停效果 */
::v-deep .el-table__row:hover {
  background-color: #f5f7fa !important;
}
</style>
