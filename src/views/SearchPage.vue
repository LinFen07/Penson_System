<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 搜索栏组件 -->
    <SearchBar 
      v-model:search-query="searchQuery"
      @search="handleSearch"
      @back="handleBack"
    />

    <main class="container mx-auto px-4 py-6">
      <!-- 搜索结果统计 -->
      <div class="mb-6" v-if="searchQuery">
        <p class="text-gray-500">"{{ searchQuery }}" 的搜索结果（约 {{ totalResults }} 个）</p>
      </div>
      
      <!-- 分类标签组件 - 仅在有搜索内容时显示 -->
      <SearchTabs 
        v-if="searchQuery"
        :active-tab="activeTab"
        @change="activeTab = $event"
      />
      
      <!-- 内容区域 -->
      <div v-if="!searchQuery">
        <!-- 搜索历史组件 -->
        <SearchHistory 
          :history-list="searchHistory"
          @search="handleHistorySearch"
          @clear="clearSearchHistory"
          @remove="removeHistoryItem"
        />
      </div>
      <div v-else-if="hasResults">
        <!-- 有搜索结果时显示对应内容 -->
        <div v-if="activeTab === 'all' || activeTab === 'questions'">
          <QuestionList 
            :questions="filteredQuestions" 
            :show-empty="activeTab === 'questions'"
          />
        </div>
        
        <div v-if="activeTab === 'all' || activeTab === 'topics'">
          <TopicList 
            :topics="filteredTopics" 
            :show-empty="activeTab === 'topics'"
          />
        </div>
        
        <div v-if="activeTab === 'all' || activeTab === 'videos'">
          <VideoList 
            :videos="filteredVideos" 
            :show-empty="activeTab === 'videos'"
          />
        </div>
      </div>
      <div v-else>
        <!-- 无搜索结果时显示空状态 -->
        <EmptyState 
          :query="searchQuery"
          @clear="clearSearch"
        />
      </div>
    </main>
  </div>
</template>

<script>
import SearchBar from '@/components/search/SearchBar.vue';
import SearchTabs from '@/components/search/SearchTabs.vue';
import QuestionList from '@/components/search/QuestionList.vue';  
import TopicList from '@/components/search/TopicList.vue';
import VideoList from '@/components/search/VideoList.vue';
import SearchHistory from '@/components/search/SearchHistory.vue';
import EmptyState from '@/components/search/EmptyState.vue';  

export default {
  name: 'SearchPage',
  components: {
    SearchBar,
    SearchTabs,
    QuestionList,
    TopicList,
    VideoList,
    SearchHistory,
    EmptyState
  },
  data() {
    return {
      // 搜索相关
      searchQuery: '',
      activeTab: 'all',
      
      // 搜索历史
      searchHistory: [],
      
      // 原始数据
      questions: [
        {
          type: 'single',
          title: '以下哪个不是JavaScript的基本数据类型？',
          difficulty: '简单',
          participants: '3.2k',
          date: '2023-05-12',
          tags: ['JavaScript', '数据类型', '基础语法']
        },
        {
          type: 'multiple',
          title: '关于JavaScript中的事件冒泡，下列说法正确的有？',
          difficulty: '中等',
          participants: '1.8k',
          date: '2023-04-28',
          tags: ['JavaScript', '事件处理', 'DOM']
        },
        {
          type: 'coding',
          title: '实现一个函数，判断一个字符串是否为回文串',
          difficulty: '中等',
          participants: '2.5k',
          date: '2023-06-05',
          tags: ['JavaScript', '字符串', '算法']
        }
      ],
      
      topics: [
        {
          title: 'JavaScript中this关键字的指向问题总结',
          content: '本文详细总结了JavaScript中this关键字在不同场景下的指向规则...',
          authorAvatar: 'https://picsum.photos/id/1/32/32',
          authorName: '张教授',
          date: '2023-03-15',
          views: '5.2k',
          comments: '128'
        },
        {
          title: 'ES6新特性详解与实际应用场景',
          content: '随着ES6标准的推出，JavaScript引入了许多强大的新特性...',
          authorAvatar: 'https://picsum.photos/id/2/32/32',
          authorName: '李工程师',
          date: '2023-04-22',
          views: '8.7k',
          comments: '256'
        }
      ],
      
      videos: [
        {
          title: 'JavaScript变量声明与作用域详解',
          thumbnail: 'https://picsum.photos/id/160/400/225',
          duration: '15:30',
          level: 'beginner',
          source: '编程学院',
          views: '3.2万'
        },
        {
          title: '深入理解JavaScript闭包与高阶函数',
          thumbnail: 'https://picsum.photos/id/0/400/225',
          duration: '22:15',
          level: 'advanced',
          source: '前端进阶营',
          views: '5.8万'
        },
        {
          title: 'JavaScript异步编程全解析',
          thumbnail: 'https://picsum.photos/id/180/400/225',
          duration: '28:45',
          level: 'advanced',
          source: '技术讲堂',
          views: '4.5万'
        }
      ]
    };
  },
  computed: {
    // 过滤后的结果（不区分大小写）
    filteredQuestions() {
      if (!this.searchQuery) return [];
      const query = this.searchQuery.toLowerCase();
      return this.questions.filter(q => 
        q.title.toLowerCase().includes(query) || 
        q.tags.some(tag => tag.toLowerCase().includes(query))
      );
    },
    filteredTopics() {
      if (!this.searchQuery) return [];
      const query = this.searchQuery.toLowerCase();
      return this.topics.filter(t => 
        t.title.toLowerCase().includes(query) || 
        t.content.toLowerCase().includes(query)
      );
    },
    filteredVideos() {
      if (!this.searchQuery) return [];
      const query = this.searchQuery.toLowerCase();
      return this.videos.filter(v => 
        v.title.toLowerCase().includes(query)
      );
    },
    // 总结果数
    totalResults() {
      return this.filteredQuestions.length + 
             this.filteredTopics.length + 
             this.filteredVideos.length;
    },
    // 是否有搜索结果
    hasResults() {
      return this.totalResults > 0;
    }
  },
  created() {
    // 从本地存储加载搜索历史
    try {
      const savedHistory = localStorage.getItem('searchHistory');
      if (savedHistory) {
        this.searchHistory = JSON.parse(savedHistory);
      }
    } catch (error) {
      console.error('加载搜索历史失败:', error);
      localStorage.removeItem('searchHistory');
    }
  },
  methods: {
    // 处理搜索
    handleSearch() {
      if (!this.searchQuery.trim()) return;
      
      // 添加到搜索历史（去重）
      this.addToHistory(this.searchQuery.trim());
    },
    
    // 从历史记录搜索
    handleHistorySearch(query) {
      this.searchQuery = query;
      this.handleSearch();
    },
    
    // 添加到搜索历史
    addToHistory(query) {
      // 去重
      this.searchHistory = this.searchHistory.filter(item => item !== query);
      // 添加到开头
      this.searchHistory.unshift(query);
      // 限制最多10条历史记录
      if (this.searchHistory.length > 10) {
        this.searchHistory.pop();
      }
      // 保存到本地存储
      try {
        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
      } catch (error) {
        console.error('保存搜索历史失败:', error);
      }
    },
    
    // 清除搜索历史
    clearSearchHistory() {
      this.searchHistory = [];
      localStorage.removeItem('searchHistory');
    },
    
    // 删除单个历史记录项
    removeHistoryItem(index) {
      this.searchHistory.splice(index, 1);
      localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    },
    
    // 清除搜索内容
    clearSearch() {
      this.searchQuery = '';
      this.activeTab = 'all';
    },
    
    // 处理返回
    handleBack() {
      this.$router.back();
    }
  }
};
</script>
