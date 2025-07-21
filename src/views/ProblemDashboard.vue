<template>
  <main class="flex-1 container mx-auto px-4 py-6">
    <!-- 页面标题和快捷操作 -->
    <!-- <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h2 class="text-[clamp(1.5rem,3vw,2rem)] font-bold text-gray-900">刷题看板</h2>
        <p class="text-gray-500 mt-1">掌握学习进度，高效刷题</p>
      </div>
      
      <div class="flex flex-wrap gap-3">
        <button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
          <i class="fa fa-play-circle"></i>
          <span>开始刷题</span>
        </button>
        <button class="px-4 py-2 bg-white border border-gray-200 hover:border-blue-600 text-gray-700 hover:text-blue-600 rounded-lg flex items-center gap-2 transition-all">
          <i class="fa fa-calendar"></i>
          <span>学习计划</span>
        </button>
      </div>
    </div> -->
    
    <!-- 数据概览卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      <!-- 总题数卡片 -->
      <div class="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        <div class="flex justify-between items-start mb-4">
          <div>
            <p class="text-gray-500 text-sm">总题数</p>
            <h3 class="text-3xl font-bold mt-1">1,250</h3>
          </div>
          <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <i class="fa fa-book"></i>
          </div>
        </div>
        <div class="flex items-center text-sm">
          <span class="text-green-600 flex items-center">
            <i class="fa fa-arrow-up mr-1"></i>12%
          </span>
          <span class="text-gray-500 ml-2">较上周</span>
        </div>
      </div>
      
      <!-- 已完成卡片 -->
      <div class="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        <div class="flex justify-between items-start mb-4">
          <div>
            <p class="text-gray-500 text-sm">已完成</p>
            <h3 class="text-3xl font-bold mt-1">428</h3>
          </div>
          <div class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <i class="fa fa-check-circle"></i>
          </div>
        </div>
        <div class="flex items-center text-sm">
          <div class="w-full bg-gray-200 rounded-full">
            <div class="bg-green-600 h-full rounded-full" style="width: 34%"></div>
          </div>
          <span class="text-gray-600 ml-2">34%</span>
        </div>
      </div>
      
      <!-- 正确率卡片 -->
      <div class="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        <div class="flex justify-between items-start mb-4">
          <div>
            <p class="text-gray-500 text-sm">正确率</p>
            <h3 class="text-3xl font-bold mt-1">78%</h3>
          </div>
          <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <i class="fa fa-trophy"></i>
          </div>
        </div>
        <div class="flex items-center text-sm">
          <span class="text-green-600 flex items-center">
            <i class="fa fa-arrow-up mr-1"></i>5%
          </span>
          <span class="text-gray-500 ml-2">较上周</span>
        </div>
      </div>
      
      <!-- 错题数卡片 -->
      <div class="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        <div class="flex justify-between items-start mb-4">
          <div>
            <p class="text-gray-500 text-sm">错题数</p>
            <h3 class="text-3xl font-bold mt-1">95</h3>
          </div>
          <div class="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
            <i class="fa fa-exclamation-circle"></i>
          </div>
        </div>
        <div class="flex items-center text-sm">
          <span class="text-red-600 flex items-center">
            <i class="fa fa-arrow-down mr-1"></i>8%
          </span>
          <span class="text-gray-500 ml-2">较上周</span>
        </div>
      </div>
    </div>
    
    <!-- 图表和题目列表区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 左侧刷题趋势图表 -->
      <div class="lg:col-span-1 bg-white rounded-xl p-5 shadow-md">
        <div class="flex justify-between items-center mb-6">
          <h3 class="font-bold text-lg">刷题趋势</h3>
          <div class="text-sm text-gray-500">
            <select v-model="selectedTimeRange" @change="updateChart" class="bg-gray-100 border-none rounded p-1 focus:outline-none focus:ring-1 focus:ring-blue-600">
              <option value="week">近7天</option>
              <option value="month">近30天</option>
              <option value="semester">本学期</option>
            </select>
          </div>
        </div>
        <div class="h-64">
          <canvas ref="chartRef"></canvas>
        </div>
      </div>
      
      <!-- 右侧题目列表 -->
      <div class="lg:col-span-2 bg-white rounded-xl p-5 shadow-md">
        <div class="flex justify-between items-center mb-6">
          <h3 class="font-bold text-lg">题目进度</h3>
          <div class="flex gap-2">
            <button 
              @click="filterStatus = 'all'"
              :class="{ 'bg-blue-50 text-blue-600': filterStatus === 'all', 'bg-gray-100 text-gray-600': filterStatus !== 'all' }"
              class="text-sm px-3 py-1 rounded-full hover:bg-blue-100 transition-colors">
              全部
            </button>
            <button 
              @click="filterStatus = 'unfinished'"
              :class="{ 'bg-yellow-50 text-yellow-600': filterStatus === 'unfinished', 'bg-gray-100 text-gray-600': filterStatus !== 'unfinished' }"
              class="text-sm px-3 py-1 rounded-full hover:bg-yellow-100 transition-colors">
              未完成
            </button>
            <button 
              @click="filterStatus = 'completed'"
              :class="{ 'bg-blue-50 text-blue-600': filterStatus === 'completed', 'bg-gray-100 text-gray-600': filterStatus !== 'completed' }"
              class="text-sm px-3 py-1 rounded-full hover:bg-blue-100 transition-colors">
              已掌握
            </button>
          </div>
        </div>
        
        <!-- 题目列表 -->
        <div class="space-y-4">
          <!-- 题目项 -->
          <div 
            v-for="question in filteredQuestions" 
            :key="question.id"
            class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all">
            <div class="flex justify-between items-start">
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <span 
                    :class="{
                      'bg-green-50 text-green-600': question.status === '已完成',
                      'bg-yellow-50 text-yellow-600': question.status === '未完成',
                      'bg-red-50 text-red-600': question.status === '错题'
                    }"
                    class="text-xs font-medium px-2 py-0.5 rounded-full">
                    {{ question.status }}
                  </span>
                  <span class="text-sm text-gray-500">{{ question.type }} · {{ question.difficulty }}</span>
                </div>
                <h4 class="font-medium mb-2">{{ question.title }}</h4>
                <div class="flex items-center text-sm text-gray-500">
                  <span class="flex items-center mr-4">
                    <i 
                      :class="{
                        'fa-check text-green-600': question.isCorrect === true,
                        'fa-times text-red-600': question.isCorrect === false,
                        'fa-bookmark text-yellow-500': question.isBookmarked
                      }"
                      class="mr-1"></i>
                    {{ question.isCorrect === true ? '正确' : question.isCorrect === false ? '错误' : '已收藏' }}
                  </span>
                  <span>
                    <i class="fa fa-clock-o mr-1"></i>{{ question.date }}
                  </span>
                </div>
              </div>
              <button class="text-blue-600 hover:text-blue-700 transition-colors">
                <i class="fa fa-angle-right"></i>
              </button>
            </div>
          </div>
        </div>
        
        <!-- 查看更多按钮 -->
        <div class="mt-6 text-center">
          <button class="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 mx-auto">
            <span>查看全部题目</span>
            <i class="fa fa-chevron-right text-xs"></i>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 知识点掌握情况 -->
    <div class="mt-6 bg-white rounded-xl p-5 shadow-md">
      <h3 class="font-bold text-lg mb-6">知识点掌握情况</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- 知识点进度条 -->
        <div v-for="topic in topics" :key="topic.name">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-medium">{{ topic.name }}</span>
            <span class="text-sm text-gray-500">{{ topic.progress }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full">
            <div 
              class="bg-blue-600 h-full rounded-full transition-all duration-700" 
              :style="{ width: `${topic.progress}%` }"
              :title="`已完成 ${topic.completed}/${topic.total}`"></div>
          </div>
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>已完成 {{ topic.completed }}/{{ topic.total }}</span>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import Chart from 'chart.js/auto';

export default {
  name: 'PracticeDashboard',
  setup() {
    // 数据
    const chartRef = ref(null);
    const chart = ref(null);
    const selectedTimeRange = ref('week');
    const filterStatus = ref('all');
    
    const questions = ref([
      {
        id: 1,
        title: "以下哪种数据结构适合实现队列？",
        type: "选择题",
        difficulty: "简单",
        status: "已完成",
        isCorrect: true,
        date: "2023-06-15",
        isBookmarked: false
      },
      {
        id: 2,
        title: "实现一个冒泡排序算法，并优化时间复杂度",
        type: "编程题",
        difficulty: "中等",
        status: "未完成",
        isCorrect: null,
        date: "待完成",
        isBookmarked: true
      },
      {
        id: 3,
        title: "计算机网络中，TCP协议的三次握手过程是怎样的？",
        type: "填空题",
        difficulty: "困难",
        status: "错题",
        isCorrect: false,
        date: "2023-06-14",
        isBookmarked: false
      }
    ]);
    
    const topics = ref([
      { name: "数据结构", progress: 75, completed: 82, total: 109 },
      { name: "算法", progress: 42, completed: 53, total: 126 },
      { name: "计算机网络", progress: 68, completed: 76, total: 112 },
      { name: "操作系统", progress: 35, completed: 41, total: 117 }
    ]);
    
    // 计算属性
    const filteredQuestions = computed(() => {
      if (filterStatus.value === 'all') {
        return questions.value;
      } else if (filterStatus.value === 'unfinished') {
        return questions.value.filter(q => q.status === '未完成');
      } else if (filterStatus.value === 'completed') {
        return questions.value.filter(q => q.status === '已完成' || q.status === '错题');
      }
      return questions.value;
    });
    
    // 方法
    const initChart = () => {
      if (!chartRef.value) return;
      
      const ctx = chartRef.value.getContext('2d');
      
      // 根据时间范围设置不同的数据
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
      };
      
      chart.value = new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartData[selectedTimeRange.value].labels,
          datasets: [{
            label: '刷题数量',
            data: chartData[selectedTimeRange.value].data,
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#3B82F6',
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              titleColor: '#333',
              bodyColor: '#666',
              borderColor: '#eee',
              borderWidth: 1,
              padding: 10,
              boxPadding: 5,
              usePointStyle: true,
              callbacks: {
                label: function(context) {
                  return `刷题数: ${context.raw} 道`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              },
              ticks: {
                precision: 0
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    };
    
    const updateChart = () => {
      if (chart.value) {
        chart.value.destroy();
      }
      initChart();
    };
    
    const handleResize = () => {
      if (chart.value) {
        chart.value.resize();
      }
    };
    
    // 生命周期钩子
    onMounted(() => {
      initChart();
      window.addEventListener('resize', handleResize);
    });
    
    onUnmounted(() => {
      if (chart.value) {
        chart.value.destroy();
      }
      window.removeEventListener('resize', handleResize);
    });
    
    return {
      chartRef,
      selectedTimeRange,
      filterStatus,
      questions,
      topics,
      filteredQuestions,
      updateChart
    };
  }
}
</script>

<style scoped>
/* Tailwind 已覆盖大部分样式，如需微调可在此添加 */
</style>