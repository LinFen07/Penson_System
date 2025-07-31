 <template>
  <div class="h-64">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps<{
  timeRange: 'week' | 'month' | 'semester'
}>()

const emit = defineEmits<{
  (e: 'update:timeRange', range: 'week' | 'month' | 'semester'): void
}>()

const chartRef = ref<HTMLCanvasElement | null>(null)
const chartInstance = ref<Chart | null>(null)

// 内置图表数据
const chartData = {
  week: {
    labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    data: [15, 28, 12, 42, 31, 45, 38]
  },
  month: {
    labels: ['第1周', '第2周', '第3周', '第4周'],
    data: [85, 120, 95, 110]
  },
  semester: {
    labels: ['第1月', '第2月', '第3月', '第4月', '第5月', '第6月'],
    data: [320, 280, 350, 420, 390, 480]
  }
}

const initChart = () => {
  if (!chartRef.value) return
  
  const ctx = chartRef.value.getContext('2d')
  if (!ctx) return

  const data = chartData[props.timeRange]
  
  chartInstance.value = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [{
        label: '刷题数量',
        data: data.data,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: false,
        pointBackgroundColor: '#3B82F6',
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      }
    }
  })
}

const destroyChart = () => {
  if (chartInstance.value) {
    chartInstance.value.destroy()
    chartInstance.value = null
  }
}

const handleResize = () => {
  chartInstance.value?.resize()
}

// 监听时间范围变化
watch(() => props.timeRange, () => {
  destroyChart()
  initChart()
})

// 初始化
onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

// 清理
onUnmounted(() => {
  destroyChart()
  window.removeEventListener('resize', handleResize)
})
</script>
