import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface DailyStat {
  date: string
  value: number
}

interface PracticeStat {
  total: number
  correct: number
  wrong: number
  accuracy: number
  averageTime: number
}

interface ProgressStat {
  completed: number
  total: number
  progress: number
}

export const useDashboardStore = defineStore('dashboard', () => {
  // 练习统计
  const practiceStats = ref<PracticeStat>({
    total: 0,
    correct: 0,
    wrong: 0,
    accuracy: 0,
    averageTime: 0
  })

  // 刷题进度
  const progressStats = ref<ProgressStat>({
    completed: 0,
    total: 100,
    progress: 0
  })

  // 图表数据
  const chartData = ref<DailyStat[]>([])

  // Getters
  const accuracyRate = computed(() => {
    return practiceStats.value.total > 0 
      ? (practiceStats.value.correct / practiceStats.value.total) * 100
      : 0
  })

  const completionRate = computed(() => {
    return progressStats.value.total > 0
      ? (progressStats.value.completed / progressStats.value.total) * 100
      : 0
  })

  // Actions
  const updatePracticeStats = (stats: Partial<PracticeStat>) => {
    practiceStats.value = { ...practiceStats.value, ...stats }
    practiceStats.value.accuracy = accuracyRate.value
  }

  const updateProgress = (completed: number) => {
    progressStats.value.completed = completed
    progressStats.value.progress = completionRate.value
  }

  const updateChartData = (data: DailyStat[]) => {
    chartData.value = data
  }

  return {
    practiceStats,
    progressStats,
    chartData,
    accuracyRate,
    completionRate,
    updatePracticeStats,
    updateProgress,
    updateChartData
  }
})
