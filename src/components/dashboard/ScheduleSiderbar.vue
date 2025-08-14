<template>
  <!-- 侧边栏容器：从左侧展开，占页面1/3宽度 -->
  <div class="fixed inset-y-0 left-0 w-1/3 bg-white shadow-2xl z-40 transform transition-transform duration-300 ease-in-out" 
       :class="{ 'translate-x-0': visible, '-translate-x-full': !visible }">
    <!-- 顶部栏：包含返回按钮和标题 -->
    <div class="flex items-center justify-between p-5 border-b border-gray-200">
      <button @click="$emit('close')" class="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors">
        <i class="fa fa-arrow-left"></i>
        <span class="font-medium">返回</span>
      </button>
      <h2 class="font-bold text-xl text-center flex-1">计划与日程管理</h2>
      <div class="w-20"></div>
    </div>

    <!-- 内容区（带滚动） -->
    <div class="h-[calc(100vh-64px)] overflow-y-auto p-5">
      <!-- 标签页切换 -->
      <div class="flex border-b mb-5">
        <button 
          @click="activeTab = 'plan'"
          :class="{ 'border-blue-600 text-blue-600': activeTab === 'plan', 'text-gray-500': activeTab !== 'plan' }"
          class="px-4 py-2 font-medium border-b-2 transition-colors"
        >
          我的计划
        </button>
        <button 
          @click="activeTab = 'schedule'"
          :class="{ 'border-blue-600 text-blue-600': activeTab === 'schedule', 'text-gray-500': activeTab !== 'schedule' }"
          class="px-4 py-2 font-medium border-b-2 transition-colors"
        >
          学习日程
        </button>
      </div>

      <!-- 计划面板 -->
      <div v-if="activeTab === 'plan'" class="space-y-6">
        <!-- 计划创建卡片 -->
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl shadow-sm border border-blue-100">
          <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
            <i class="fa fa-plus-circle text-blue-600 mr-2"></i>创建学习计划
          </h3>
          <form @submit.prevent="handleCreatePlan" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">计划名称 <span class="text-red-500">*</span></label>
              <input 
                v-model="newPlan.name"
                type="text" 
                placeholder="例如：30天算法刷题挑战"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">目标题数 <span class="text-red-500">*</span></label>
              <div class="relative">
                <input 
                  v-model="newPlan.targetCount"
                  type="number" 
                  min="1"
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                >
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">题</span>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">优先级 <span class="text-red-500">*</span></label>
              <div class="flex gap-2">
                <label class="inline-flex items-center cursor-pointer flex-1">
                  <input type="radio" name="priority" value="high" v-model="newPlan.priority" class="text-red-500">
                  <span class="ml-2 text-sm py-1 px-2 bg-red-50 text-red-700 rounded-full w-full text-center">高</span>
                </label>
                <label class="inline-flex items-center cursor-pointer flex-1">
                  <input type="radio" name="priority" value="medium" v-model="newPlan.priority" class="text-yellow-500" checked>
                  <span class="ml-2 text-sm py-1 px-2 bg-yellow-50 text-yellow-700 rounded-full w-full text-center">中</span>
                </label>
                <label class="inline-flex items-center cursor-pointer flex-1">
                  <input type="radio" name="priority" value="low" v-model="newPlan.priority" class="text-green-500">
                  <span class="ml-2 text-sm py-1 px-2 bg-green-50 text-green-700 rounded-full w-full text-center">低</span>
                </label>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">开始日期 <span class="text-red-500">*</span></label>
              <input 
                v-model="newPlan.startDate"
                type="date" 
                class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">结束日期 <span class="text-red-500">*</span></label>
              <input 
                v-model="newPlan.endDate"
                type="date" 
                :min="newPlan.startDate"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              >
            </div>
            
            <button 
              type="submit"
              class="md:col-span-2 w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <i class="fa fa-check"></i>确认创建
            </button>
          </form>
        </div>
        
        <!-- 计划列表 -->
        <div>
          <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
            <i class="fa fa-list-alt text-gray-600 mr-2"></i>我的计划
          </h3>
          
          <!-- 进行中的计划 -->
          <div class="mb-6">
            <h4 class="text-sm font-medium text-blue-600 mb-3 flex items-center">
              <span class="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>进行中 <span class="text-gray-500 ml-1">({{ ongoingPlans.length }})</span>
            </h4>
            <div class="space-y-3">
              <div 
                v-for="plan in ongoingPlans" 
                :key="plan.id"
                class="p-4 bg-white border border-blue-100 rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <p class="font-medium text-gray-900">{{ plan.name }}</p>
                    <p class="text-xs text-gray-500 mt-0.5">
                      {{ formatDate(plan.startDate) }} - {{ formatDate(plan.endDate) }} | 目标{{ plan.targetCount }}题
                    </p>
                  </div>
                  <span 
                    :class="plan.priority === 'high' ? 'bg-red-100 text-red-600' : 
                           plan.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' : 
                           'bg-green-100 text-green-600'"
                    class="text-xs px-2 py-0.5 rounded-full"
                  >
                    {{ plan.priority === 'high' ? '高' : plan.priority === 'medium' ? '中' : '低' }}
                  </span>
                </div>
                
                <!-- 进度条 -->
                <div class="mt-3">
                  <div class="flex justify-between text-xs mb-1">
                    <span class="text-gray-600">当前进度</span>
                    <span class="font-medium">{{ plan.progress }}%</span>
                  </div>
                  <div class="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div 
                      class="h-full bg-blue-600 rounded-full transition-all duration-500"
                      :style="{ width: plan.progress + '%' }"
                    ></div>
                  </div>
                </div>
                
                <!-- 操作按钮 -->
                <div class="mt-3 flex justify-end gap-2">
                  <button @click="markPlanComplete(plan.id)" class="text-sm text-green-600 hover:text-green-700">
                    <i class="fa fa-check mr-1"></i>标记完成
                  </button>
                  <button @click="handleDeletePlan(plan.id)" class="text-sm text-red-500 hover:text-red-600">
                    <i class="fa fa-trash mr-1"></i>删除
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 已完成的计划 -->
          <div>
            <h4 class="text-sm font-medium text-green-600 mb-3 flex items-center">
              <span class="w-2 h-2 bg-green-600 rounded-full mr-2"></span>已完成 <span class="text-gray-500 ml-1">({{ completedPlans.length }})</span>
            </h4>
            <div class="space-y-3">
              <div 
                v-for="plan in completedPlans" 
                :key="plan.id"
                class="p-4 bg-white border border-green-100 rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <p class="font-medium text-gray-900 line-through">{{ plan.name }}</p>
                    <p class="text-xs text-gray-500 mt-0.5">
                      已完成于 {{ formatDate(plan.endDate) }} | 完成率100%
                    </p>
                  </div>
                  <span class="text-xs px-2 py-0.5 bg-green-100 text-green-600 rounded-full">
                    已完成
                  </span>
                </div>
                
                <div class="mt-3 flex justify-end">
                  <button @click="handleDeletePlan(plan.id)" class="text-sm text-red-500 hover:text-red-600">
                    <i class="fa fa-trash mr-1"></i>删除
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 空状态 -->
          <div v-if="plans.length === 0" class="py-10 text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-3">
              <i class="fa fa-calendar-o text-2xl"></i>
            </div>
            <p class="text-gray-500 mb-4">暂无学习计划</p>
            <button 
              @click="newPlan.name = '我的第一个计划'" 
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              创建第一个计划
            </button>
          </div>
        </div>
      </div>

      <!-- 日程面板 -->
      <div v-if="activeTab === 'schedule'" class="space-y-6">
        <!-- 日历导航与视图切换 -->
        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div class="flex flex-wrap justify-between items-center gap-3 mb-4">
            <div class="flex items-center gap-3">
              <button 
                @click="changeWeek(-1)"
                class="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="上一周"
              >
                <i class="fa fa-chevron-left text-gray-600"></i>
              </button>
              <h3 class="font-semibold text-gray-800">{{ getCurrentMonth() }} {{ new Date().getFullYear() }}</h3>
              <button 
                @click="changeWeek(1)"
                class="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="下一周"
              >
                <i class="fa fa-chevron-right text-gray-600"></i>
              </button>
            </div>
            
            <div class="flex gap-2">
              <button 
                @click="viewMode = 'week'"
                :class="viewMode === 'week' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'"
                class="px-3 py-1 rounded-full text-sm transition-colors"
              >
                周视图
              </button>
              <button 
                @click="viewMode = 'day'"
                :class="viewMode === 'day' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'"
                class="px-3 py-1 rounded-full text-sm transition-colors"
              >
                日视图
              </button>
            </div>
          </div>
          
          <!-- 周视图日历 -->
          <div v-if="viewMode === 'week'" class="grid grid-cols-7 gap-1 mb-2">
            <!-- 星期标题 -->
            <div v-for="(day, i) in weekDays" :key="i" class="text-center text-xs font-medium text-gray-500 py-2">
              {{ day.weekday }}
              <span class="block mt-1">{{ formatDate(day.date, 'md') }}</span>
              <span v-if="day.date === today" class="inline-block mt-1 w-2 h-2 bg-blue-600 rounded-full"></span>
            </div>
            
            <!-- 日程概览 -->
            <div v-for="(day, i) in weekDays" :key="i + 'content'" class="min-h-[80px] p-1 border-t border-gray-100">
              <div 
                v-for="(schedule, sIdx) in day.schedules.slice(0, 2)" 
                :key="sIdx"
                class="text-xs p-1.5 rounded mb-1 truncate"
                :class="schedule.completed ? 'bg-gray-100 text-gray-600 line-through' : 'bg-blue-50 text-blue-700'"
              >
                {{ schedule.content }}
              </div>
              <div v-if="day.schedules.length > 2" class="text-xs text-gray-400 mt-1">
                +{{ day.schedules.length - 2 }} 项
              </div>
            </div>
          </div>
        </div>
        
        <!-- 当日日程详情 -->
        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
            <i class="fa fa-calendar text-gray-600 mr-2"></i>
            {{ selectedDate === today ? '今日' : formatDate(selectedDate) }} 日程
            <span v-if="selectedDate === today" class="ml-2 text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">今天</span>
          </h3>
          
          <!-- 时间选择器（仅日视图显示） -->
          <div v-if="viewMode === 'day'" class="mb-4">
            <input 
              v-model="selectedDate"
              type="date" 
              class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
            >
          </div>
          
          <!-- 日程列表 -->
          <div class="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            <div 
              v-for="(schedule, sIdx) in filteredSchedules" 
              :key="sIdx"
              class="p-3 rounded-lg border-l-4 transition-all hover:shadow-sm"
              :class="schedule.completed 
                ? 'border-gray-300 bg-gray-50' 
                : schedule.priority === 'high' 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-blue-500 bg-blue-50'"
            >
              <div class="flex justify-between items-start">
                <p class="text-sm" :class="schedule.completed ? 'line-through text-gray-500' : ''">
                  {{ schedule.content }}
                </p>
                <div class="flex gap-2">
                  <label class="cursor-pointer">
                    <input 
                      type="checkbox" 
                      v-model="schedule.completed"
                      @change="updateScheduleStatus(selectedDate, sIdx)"
                      class="form-checkbox h-4 w-4 text-blue-600"
                    >
                  </label>
                  <button @click="deleteSchedule(selectedDate, sIdx)" class="text-gray-400 hover:text-red-500">
                    <i class="fa fa-times"></i>
                  </button>
                </div>
              </div>
              
              <div class="mt-2 flex items-center justify-between">
                <span 
                  v-if="schedule.priority"
                  class="text-xs px-2 py-0.5 rounded-full"
                  :class="schedule.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'"
                >
                  {{ schedule.priority === 'high' ? '高优先级' : '普通' }}
                </span>
                <span class="text-xs text-gray-500">
                  {{ schedule.time || '全天' }}
                </span>
              </div>
            </div>
            
            <!-- 空状态 -->
            <div v-if="filteredSchedules.length === 0" class="py-8 text-center">
              <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-400 mb-2">
                <i class="fa fa-list-o"></i>
              </div>
              <p class="text-gray-500 text-sm">暂无日程安排</p>
            </div>
          </div>
          
          <!-- 添加日程按钮 -->
          <button 
            @click="openAddScheduleModal"
            class="mt-4 w-full py-2 border border-dashed border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-1"
          >
            <i class="fa fa-plus"></i> 添加新日程
          </button>
        </div>
        
        <!-- 添加日程弹窗 -->
        <div v-if="showScheduleModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-xl p-5 max-w-md w-full">
            <h4 class="font-bold text-lg mb-4">添加日程</h4>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">日期</label>
                <input 
                  v-model="currentScheduleDate"
                  type="date" 
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readonly
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">时间</label>
                <input 
                  v-model="newScheduleTime"
                  type="time" 
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">内容 <span class="text-red-500">*</span></label>
                <textarea 
                  v-model="newScheduleContent"
                  placeholder="例如：完成10道动态规划题目"
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                ></textarea>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">优先级</label>
                <select 
                  v-model="newSchedulePriority"
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="normal">普通</option>
                  <option value="high">高优先级</option>
                </select>
              </div>
              
              <div class="flex justify-end gap-3">
                <button 
                  @click="showScheduleModal = false"
                  class="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button 
                  @click="confirmAddSchedule"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  确认添加
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 遮罩层 -->
  <div 
    v-if="visible"
    @click="$emit('close')"
    class="fixed inset-0 bg-black/20 z-30 transition-opacity duration-300"
  ></div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// 接收父组件传入的数据
const props = defineProps({
  plans: { type: Array, default: () => [] },
  schedules: { type: Array, default: () => [] },
  visible: { type: Boolean, default: false }
});

// 向父组件传递事件
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'update:plans', plans: any[]): void;
  (e: 'update:schedules', schedules: any[]): void;
}>();

// ===================== 计划相关逻辑 =====================
const activeTab = ref('plan');
const newPlan = ref({
  name: '',
  targetCount: 10,
  startDate: '',
  endDate: '',
  priority: 'medium',
  progress: 0
});

// 初始化计划日期
onMounted(() => {
  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  newPlan.value.startDate = today;
  newPlan.value.endDate = nextWeek.toISOString().split('T')[0];
  initWeekDays();
});

// 计算属性：区分进行中/已完成计划（必要逻辑，保留）
const ongoingPlans = computed(() => props.plans.filter(plan => plan.progress < 100));
const completedPlans = computed(() => props.plans.filter(plan => plan.progress === 100));

// 创建计划
const handleCreatePlan = () => {
  const newPlanObj = { id: Date.now(), ...newPlan.value };
  emit('update:plans', [newPlanObj, ...props.plans]);
  // 重置表单（简化写法）
  newPlan.value = { ...newPlan.value, name: '', progress: 0 };
};

// 标记计划为完成
const markPlanComplete = (id: number) => {
  emit('update:plans', props.plans.map(plan => 
    plan.id === id ? { ...plan, progress: 100 } : plan
  ));
};

// 删除计划
const handleDeletePlan = (id: number) => {
  emit('update:plans', props.plans.filter(plan => plan.id !== id));
};

// ===================== 日程相关逻辑 =====================
const weekDays = ref([]);
const currentWeekOffset = ref(0);
const viewMode = ref('week');
const today = ref(new Date().toISOString().split('T')[0]);
const selectedDate = ref(today.value);
const showScheduleModal = ref(false);
const currentScheduleDate = ref(today.value);
const newScheduleContent = ref('');
const newScheduleTime = ref('');
const newSchedulePriority = ref('normal');

// 计算属性：过滤选中日期的日程（必要逻辑，保留）
const filteredSchedules = computed(() => {
  return props.schedules.find(item => item.date === selectedDate.value)?.schedules || [];
});

// 初始化本周日程（核心逻辑，保留）
const initWeekDays = () => {
  const days = [];
  const monday = new Date();
  monday.setDate(monday.getDate() - monday.getDay() + 1 + currentWeekOffset.value * 7);
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    days.push({
      date: dateStr,
      weekday: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][i],
      schedules: props.schedules.find(item => item.date === dateStr)?.schedules || []
    });
  }
  weekDays.value = days;
};

// 切换周
const changeWeek = (offset: number) => {
  currentWeekOffset.value += offset;
  initWeekDays();
};

// 打开添加日程弹窗
const openAddScheduleModal = () => {
  currentScheduleDate.value = selectedDate.value;
  newScheduleContent.value = newScheduleTime.value = '';
  newSchedulePriority.value = 'normal';
  showScheduleModal.value = true;
};

// 确认添加日程
const confirmAddSchedule = () => {
  if (!newScheduleContent.value.trim()) return;
  
  const newSchedule = {
    content: newScheduleContent.value,
    completed: false,
    time: newScheduleTime.value,
    priority: newSchedulePriority.value
  };
  
  const updatedSchedules = [...props.schedules];
  const dateIndex = updatedSchedules.findIndex(item => item.date === currentScheduleDate.value);
  
  if (dateIndex > -1) {
    updatedSchedules[dateIndex].schedules.push(newSchedule);
  } else {
    updatedSchedules.push({ date: currentScheduleDate.value, schedules: [newSchedule] });
  }
  
  emit('update:schedules', updatedSchedules);
  showScheduleModal.value = false;
  initWeekDays();
};

// 更新日程状态
const updateScheduleStatus = (date: string, sIdx: number) => {
  const dateItem = props.schedules.find(item => item.date === date);
  if (dateItem?.schedules[sIdx]) {
    dateItem.schedules[sIdx].completed = !dateItem.schedules[sIdx].completed;
    emit('update:schedules', [...props.schedules]);
  }
};

// 删除日程
const deleteSchedule = (date: string, sIdx: number) => {
  const updatedSchedules = [...props.schedules];
  const dateIndex = updatedSchedules.findIndex(item => item.date === date);
  
  if (dateIndex > -1) {
    updatedSchedules[dateIndex].schedules.splice(sIdx, 1);
    if (!updatedSchedules[dateIndex].schedules.length) updatedSchedules.splice(dateIndex, 1);
    emit('update:schedules', updatedSchedules);
    initWeekDays();
  }
};

// ===================== 工具函数（精简后） =====================
// 格式化日期（合并格式处理逻辑）
const formatDate = (dateStr: string, format: string = 'full') => {
  const [year, month, day] = dateStr.split('-');
  return format === 'md' ? `${month}-${day}` : `${year}-${month}-${day}`;
};

// 获取当前月份（替代原计算属性，减少响应式依赖）
const getCurrentMonth = () => {
  return ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'][new Date().getMonth()];
};

// 暴露必要方法
defineExpose({ initWeekDays });
</script>

<style scoped>
.line-through { text-decoration: line-through; }

/* 动画效果 */
.translate-x-0 { transform: translateX(0); }
.-translate-x-full { transform: translateX(-100%); }

/* 响应式宽度 */
@media (max-width: 768px) { .w-1\/3 { width: 50%; } }
@media (max-width: 480px) { .w-1\/3 { width: 100%; } }

/* 滚动条优化 */
.overflow-y-auto::-webkit-scrollbar { width: 5px; }
.overflow-y-auto::-webkit-scrollbar-thumb { background-color: #e2e2e2; border-radius: 3px; }
</style>
