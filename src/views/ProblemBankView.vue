<template>
  <div class="h-screen flex flex-col">
    <el-container class="flex-1">
      <!-- 侧边栏 -->
      <el-aside width="220px" class="bg-gray-50 pt-5 pb-4 px-4 border-r-2 border-gray-300 flex flex-col rounded-lg" style="padding-top: 40px;">
        <div class="grid grid-cols-2 gap-3">
          <div v-for="n in 8" :key="n" 
               class="w-20 h-20 rounded-xl bg-blue-100 flex items-center justify-center cursor-pointer hover:bg-blue-200 transition-colors"
               style="padding-bottom:20px;">
            <span class="text-blue-600 font-medium">标签{{n}}</span>
          </div>
        </div>
      </el-aside>
      
      <!-- 主内容区 -->
      <el-main class="p-5">
        <!-- 标题 -->
        <div class="flex justify-between items-center mb-3">
          <h1 class="text-xl font-semibold">题库中心</h1>
        </div>
        
        <!-- 搜索区域 -->
        <div class="flex items-center space-x-2 mb-5">
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

          <!-- 筛选按钮 -->
          <el-button
            type="primary"
            icon="el-icon-filter"
            size="small"
            style="border-radius: 20px;"
            @click="showFilterModal = true"
          >
            筛选
          </el-button>
        </div>
        
        <!-- 题库表格 -->
        <el-table :data="currentProblemList" class="w-full mt-3">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="title" label="题目" />
          <el-table-column prop="difficulty" label="难度" width="120">
            <template #default="{ row }">
              <el-tag :type="getDifficultyTagType(row.difficulty)">{{ row.difficulty }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="dataStructure" label="数据结构" width="120" />
          <el-table-column prop="language" label="语言" width="100" />
          <el-table-column prop="passRate" label="通过率" width="120">
            <template #default="{ row }">
              <el-progress :percentage="parseInt(row.passRate)" :stroke-width="14" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default>
              <el-button link @click="viewProblem">查看</el-button>
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
              <!-- 难度筛选：改为下拉框 -->
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
              
              <!-- 语言筛选：添加语言选择 -->
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
              
              <!-- 通过率筛选：优化显示 -->
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
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'

// 搜索关键词
const searchKeyword = ref('')
// 筛选条件弹窗状态
const showFilterModal = ref(false)

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const totalProblems = ref(0)

// 筛选表单数据（修改了通过率的结构）
const filterForm = reactive({
  difficulty: '', // 改为单选
  dataStructure: [],
  language: [],
  passRateRange: [0, 100], // 滑块范围
  passRateMin: 0, // 输入框最小值
  passRateMax: 100 // 输入框最大值
})

// 监听滑块变化，同步到输入框
const updatePassRateInputs = () => {
  filterForm.passRateMin = filterForm.passRateRange[0]
  filterForm.passRateMax = filterForm.passRateRange[1]
}

// 监听输入框变化，同步到滑块
watch(() => [filterForm.passRateMin, filterForm.passRateMax], () => {
  // 确保输入值在有效范围内
  filterForm.passRateMin = Math.max(0, Math.min(100, filterForm.passRateMin))
  filterForm.passRateMax = Math.max(0, Math.min(100, filterForm.passRateMax))
  // 确保最小值不大于最大值
  if (filterForm.passRateMin > filterForm.passRateMax) {
    filterForm.passRateMin = filterForm.passRateMax
  }
  // 更新滑块
  filterForm.passRateRange = [filterForm.passRateMin, filterForm.passRateMax]
})

// 筛选选项
const difficultyOptions = [
  { value: '', label: '全部' }, // 添加全部选项
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
  { value: 'dynamicProgramming', label: '动态规划' }
]

const languageOptions = [
  { value: '', label: '全部' }, // 添加全部选项
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

// 监听总题数变化
totalProblems.value = problemList.value.length

// 计算属性：当前页显示的题目（应用筛选条件）
const currentProblemList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredProblems.value.slice(start, end)
})

// 计算属性：筛选后的题目（修改了通过率的筛选逻辑）
const filteredProblems = computed(() => {
  let filtered = problemList.value
  
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
    filtered = filtered.filter(problem => 
      problem.difficulty === filterForm.difficulty
    )
  }
  
  // 按数据结构筛选
  if (filterForm.dataStructure.length > 0) {
    filtered = filtered.filter(problem => 
      filterForm.dataStructure.includes(problem.dataStructure)
    )
  }
  
  // 按语言筛选
  if (filterForm.language.length > 0 && !filterForm.language.includes('')) {
    filtered = filtered.filter(problem => 
      filterForm.language.includes(problem.language)
    )
  }
  
  // 按通过率筛选
  const minRate = filterForm.passRateRange[0]
  const maxRate = filterForm.passRateRange[1]
  filtered = filtered.filter(problem => {
    const rate = parseInt(problem.passRate)
    return rate >= minRate && rate <= maxRate
  })
  
  return filtered
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

// 搜索功能
const searchProblems = () => {
  currentPage.value = 1 // 重置到第一页
}

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
  console.log('筛选弹窗已关闭')
}

// 查看题目
const viewProblem = () => {
  console.log('查看题目逻辑待实现...')
}
</script>