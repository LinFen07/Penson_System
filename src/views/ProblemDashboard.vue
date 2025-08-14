
    
<template>
  <main class="flex-1 container mx-auto px-4 py-6">
    <!-- 数据概览卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      <StatsCard 
        title="总题数" 
        value="1,250"
        iconClass="fa fa-book"
        iconBgColor="bg-blue-50 text-blue-600">
        <div class="flex items-center text-sm">
          <span class="text-green-600 flex items-center">
            <i class="fa fa-arrow-up mr-1"></i>12%
          </span>
          <span class="text-gray-500 ml-2">较上周</span>
        </div>
      </StatsCard>
      
      <StatsCard 
        title="已完成" 
        value="428"
        iconClass="fa fa-check-circle"
        iconBgColor="bg-green-50 text-green-600">
        <div class="flex items-center text-sm">
          <div class="w-full bg-gray-200 rounded-full">
            <div class="bg-green-600 h-full rounded-full" style="width: 34%"></div>
          </div>
          <span class="text-gray-600 ml-2">34%</span>
        </div>
      </StatsCard>
      
      <StatsCard 
        title="正确率" 
        value="78%"
        iconClass="fa fa-trophy"
        iconBgColor="bg-purple-100 text-purple-600">
        <div class="flex items-center text-sm">
          <span class="text-green-600 flex items-center">
            <i class="fa fa-arrow-up mr-1"></i>5%
          </span>
          <span class="text-gray-500 ml-2">较上周</span>
        </div>
      </StatsCard>
      
      <StatsCard 
        title="错题数" 
        value="95"
        iconClass="fa fa-exclamation-circle"
        iconBgColor="bg-red-50 text-red-600">
        <div class="flex items-center text-sm">
          <span class="text-red-600 flex items-center">
            <i class="fa fa-arrow-down mr-1"></i>8%
          </span>
          <span class="text-gray-500 ml-2">较上周</span>
        </div>
      </StatsCard>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 左侧刷题趋势图表 -->
      <div class="lg:col-span-1 bg-white rounded-xl p-5 shadow-md">
        <div class="flex justify-between items-center mb-6">
          <h3 class="font-bold text-lg">刷题趋势</h3>
          <div class="text-sm text-gray-500">
            <select 
              v-model="selectedTimeRange" 
              @change="$emit('timeRange-change', selectedTimeRange)"
              class="bg-gray-100 border-none rounded p-1 focus:outline-none focus:ring-1 focus:ring-blue-600">
              <option value="week">近7天</option>
              <option value="month">近30天</option>
              <option value="semester">本学期</option>
            </select>
          </div>
        </div>
        <PracticeChart :timeRange="selectedTimeRange" />
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
          <QuestionItem
            v-for="question in filteredQuestions"
            :key="question.id"
            :id="question.id"
            :title="question.title"
            :type="question.type"
            :difficulty="question.difficulty"
            :status="question.status"
            :isCorrect="question.isCorrect"
            :isBookmarked="question.isBookmarked"
            :date="question.date"
            @click="$emit('question-click', question.id)"
          />
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
          <TopicProgress
            v-for="topic in topics"
            :key="topic.name"
            :name="topic.name"
            :progress="topic.progress"
            :completed="topic.completed"
            :total="topic.total"
          />
        </div>
      </div>
   <!-- 打开侧边栏的按钮 -->
   <button 
      @click="showPlanSidebar = true"
      class="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105 z-20"
      aria-label="计划与日程"
    >
      <i class="fa fa-calendar-check-o text-xl mr-2"></i> <!-- 图标优化 -->
      <span class="hidden sm:inline">计划与日程</span> <!-- 小屏幕隐藏文字，只保留图标 -->
    </button>

    <!-- 侧边栏组件引用保持不变 -->
    <ScheduleSiderbar
      :plans="plans"
      :schedules="schedules"
      :visible="showPlanSidebar"
      @close="showPlanSidebar = false"
      @update:plans="plans = $event"
      @update:schedules="schedules = $event"
    />
  </main>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useDashboardStore } from '@/stores/dashboard';
import StatsCard from '@/components/dashboard/StatsCard.vue';
import QuestionItem from '@/components/dashboard/QuestionItem.vue';
import TopicProgress from '@/components/dashboard/TopicProgress.vue';
import PracticeChart from '@/components/dashboard/PracticeChart.vue';
import ScheduleSiderbar from '@/components/dashboard/ScheduleSiderbar.vue';

export default {
  name: 'ProblemDashboard',
  components: {
    StatsCard,
    QuestionItem,
    TopicProgress,
    PracticeChart,
    ScheduleSiderbar
  },
  setup() {
    const dashboardStore = useDashboardStore();
    const selectedTimeRange = ref('week');
    const filterStatus = ref('all');
    const showPlanSidebar = ref(false);
   

    // 初始化数据
    onMounted(() => {
      dashboardStore.updatePracticeStats({
        total: 1250,
        correct: 975,
        wrong: 95,
        averageTime: 12
      });
      dashboardStore.updateProgress(428);
      dashboardStore.updateChartData([
        { date: '2023-06-10', value: 15 },
        { date: '2023-06-11', value: 20 },
        { date: '2023-06-12', value: 18 },
        { date: '2023-06-13', value: 22 },
        { date: '2023-06-14', value: 25 },
        { date: '2023-06-15', value: 30 }
      ]);
    });
    
    const topics = ref([
      { name: "数据结构", progress: 75, completed: 82, total: 109 },
      { name: "算法", progress: 42, completed: 53, total: 126 },
      { name: "计算机网络", progress: 68, completed: 76, total: 112 },
      { name: "操作系统", progress: 35, completed: 41, total: 117 }
    ]);
     const plans = ref([
      {
        id: 1,
        name: "数据结构基础巩固",
        targetCount: 50,
        startDate: "2023-06-10",
        endDate: "2023-06-16",
        priority: "high"
      }
    ]);
    const schedules = ref([
      {
        date: new Date().toISOString().split('T')[0],
        schedules: [
          { content: "完成5道二叉树题目", completed: true },
          { content: "复习BFS算法", completed: false }
        ]
      }
    ]);
    // 计算属性
    const filteredQuestions = computed(() => {
      const questions = dashboardStore.practiceStats.questions || [];
      if (filterStatus.value === 'all') {
        return questions;
      } else if (filterStatus.value === 'unfinished') {
        return questions.filter(q => q.status === '未完成');
      } else if (filterStatus.value === 'completed') {
        return questions.filter(q => q.status === '已完成' || q.status === '错题');
      }
      return questions;
    });
    
    return {
      selectedTimeRange,
      filterStatus,
      topics,
      filteredQuestions,
      dashboardStore,
      showPlanSidebar,
      plans,
      schedules
    };
  }
}
</script>

<style scoped>
/* Tailwind 已覆盖大部分样式，如需微调可在此添加 */
</style>