<template>
  <header class="bg-white shadow-sm sticky top-0 z-10">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center">
        <!-- 返回按钮 -->
        <el-button 
          icon="ArrowLeft" 
          circle 
          @click="$emit('back')"
          class="mr-4 md:mr-6 text-gray-600 hover:text-primary hover:bg-primary/5 border-none bg-transparent"
        />
        
        <!-- 搜索框 -->
        <div class="relative flex-grow max-w-3xl">
          <input 
            type="text" 
            v-model="localSearchQuery"
            placeholder="搜索题库、话题或视频..." 
            class="w-full py-2.5 pl-10 pr-10 rounded-full border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
            @keyup.enter="$emit('search')"
          >
          <el-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Search />
          </el-icon>
          <el-button 
            icon="Close" 
            circle 
            size="small"
            @click="clearSearch"
            v-if="localSearchQuery"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 border-none bg-transparent"
          />
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { ArrowLeft, Search, Close } from '@element-plus/icons-vue';
import { ElButton, ElIcon } from 'element-plus';

export default {
  name: 'SearchBar',
  components: {
    ElButton,
    ElIcon,
    ArrowLeft,
    Search,
    Close
  },
  props: {
    searchQuery: {
      type: String,
      default: ''
    }
  },
  computed: {
    localSearchQuery: {
      get() {
        return this.searchQuery;
      },
      set(value) {
        this.$emit('update:searchQuery', value);
      }
    }
  },
  methods: {
    clearSearch() {
      this.localSearchQuery = '';
    }
  }
};
</script>
