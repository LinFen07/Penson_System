<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header-container">
        <!-- 左侧logo -->
        <div class="logo-section">
          <el-image url="image.png"></el-image>
        </div>
        
        <!-- 中间导航和搜索框 -->
        <div class="nav-and-search">
          <!-- 中间导航 -->
          <div class="nav-section">
            <div class="sections-container">
              <!-- 导航项 -->
              <div 
                v-for="(item, index) in store.navItems" 
                :key="index"
                class="nav-item"
                @click="handleNavClick(index)"
                @mouseenter="handleMouseEnter(index)"
                @mouseleave="handleMouseLeave"
                :class="{ 'active': store.activeIndex === index }"
                ref="navItemsRefs"
              >
                <div class="nav-title">{{ item.title }}</div>
              </div>
              
              <!-- 下划线元素 -->
              <div class="nav-underline" :style="store.underlineStyle"></div>
            </div>
          </div>
          
          <!-- 搜索框 -->
          <div class="search-section">
            <el-input
              v-model="searchStore.searchQuery"
              placeholder="搜索..."
              :prefix-icon="Search"
              clearable
              @clear="searchStore.clearSearchHistory"
              @keyup.enter="() => searchStore.executeSearch(router)"
              size="default"
              class="search-input"
            />
          </div>
        </div>
        
        <!-- 右侧用户 -->
        <div class="user-section">
          <el-dropdown>
            <div class="user-container">
              <el-avatar :size="36" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
              <span class="user-name">用户名</span>
              <el-icon class="arrow-down"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="$router.push('/personal')">个人中心</el-dropdown-item>
                <el-dropdown-item divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ArrowDown, Search } from '@element-plus/icons-vue'
import { useSearchAndNavStore } from '@/stores/home'
import { useSearchStore } from '@/stores/search'
import { onMounted, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 定义store实例
const store = useSearchAndNavStore()
const searchStore = useSearchStore()
const route = useRoute()
const router = useRouter()
const navItemsRefs = ref<HTMLElement[]>([])

// 处理导航点击
const handleNavClick = (index: number) => {
  const item = store.navItems[index]
  if (item) {
    router.push(item.path)
  }
}

// 处理鼠标进入事件
const handleMouseEnter = (index: number) => {
  if (navItemsRefs.value[index]) {
    const item = navItemsRefs.value[index]
    const title = item.querySelector<HTMLElement>('.nav-title')
    
    if (title) {
      store.underlineWidth = title.offsetWidth
      store.underlineOffset = item.offsetLeft + (item.offsetWidth - title.offsetWidth) / 2
    }
  }
}

// 处理鼠标离开事件
const handleMouseLeave = () => {
  if (navItemsRefs.value[store.activeIndex]) {
    const item = navItemsRefs.value[store.activeIndex]
    const title = item.querySelector<HTMLElement>('.nav-title')
    
    if (title) {
      store.underlineWidth = title.offsetWidth
      store.underlineOffset = item.offsetLeft + (item.offsetWidth - title.offsetWidth) / 2
    }
  }
}

// 初始化下划线位置
onMounted(() => {
  setTimeout(() => {
    const index = store.navItems.findIndex(item => item.path === route.path)
    const initIndex = index !== -1 ? index : 0
    
    store.activeIndex = initIndex
    
    if (navItemsRefs.value[initIndex]) {
      const item = navItemsRefs.value[initIndex]
      const title = item.querySelector<HTMLElement>('.nav-title')
      
      if (title) {
        store.underlineWidth = title.offsetWidth
        store.underlineOffset = item.offsetLeft + (item.offsetWidth - title.offsetWidth) / 2
      }
    }
    
    if (route.path === '/') {
      router.replace('/problemBank')
    }
  }, 0)
})

// 监听路由变化，更新下划线
watch(
  () => route.path,
  (newPath) => {
    const index = store.navItems.findIndex(item => item.path === newPath)
    if (index !== -1) {
      store.activeIndex = index
      
      if (navItemsRefs.value[index]) {
        const item = navItemsRefs.value[index]
        const title = item.querySelector<HTMLElement>('.nav-title')
        
        if (title) {
          store.underlineWidth = title.offsetWidth
          store.underlineOffset = item.offsetLeft + (item.offsetWidth - title.offsetWidth) / 2
        }
      }
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.el-header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid #ebeef5;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* 左侧Logo区域 - 固定宽度 */
.logo-section {
  width: 180px; /* 固定宽度，避免挤压中间区域 */
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

/* 中间导航和搜索框容器 - 自适应宽度 */
.nav-and-search {
  flex: 1; /* 占据剩余空间 */
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 0 20px; /* 左右留出一些空间 */
}

/* 导航区域 - 占据大部分空间 */
.nav-section {
  flex: 1; /* 占据大部分空间 */
  display: flex;
  justify-content:flex-start; /* 居左显示导航项 */
}

/* 搜索框区域 - 固定宽度 */
.search-section {
  width: 200px; /* 固定宽度 */
  display: flex;
  align-items: center;
  height: 100%;
}

.search-input {
  width: 100%;
  padding-top: 8px !important;
  padding-bottom: 8px !important;
  transition: all 0.3s;
}

.search-input:focus {
  width: 220px;
}

/* 导航容器 */
.sections-container {
  display: flex;
  align-items: center;
  height: 100%;
  position: relative;
}

/* 导航项样式 */
.nav-item {
  padding: 10px 18px; /* 适当增加内边距 */
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  margin: 0 4px;
}

.nav-item.active {
  color: #409eff;
  font-weight: 500;
}

.nav-item:hover {
  color: #409eff;
}

.nav-title {
  font-size: 14px;
  font-weight: 500;
}

/* 下划线样式 */
.nav-underline {
  position: absolute;
  bottom: -1px;
  height: 2px;
  background-color: #409eff;
  transition: width 0.3s ease, transform 0.3s ease;
  pointer-events: none;
}

/* 右侧用户区域 - 固定宽度 */
.user-section {
  width: 180px; /* 固定宽度 */
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end; /* 右对齐 */
}

.user-container {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  background: #f5f7fa;
  border-radius: 18px;
  cursor: pointer;
  transition: all 0.3s;
}

.user-container:hover {
  background: #e6e9ed;
}

.user-name {
  font-size: 14px;
  color: #333;
  margin: 0 8px;
}

.arrow-down {
  color: #909399;
  font-size: 12px;
}

/* 其他样式 */
.main-sidebar {
  background-color: #f8f9fa;
  border-right: 1px solid #eaeaea;
  height: calc(100vh - 80px);
}

.sidebar-content {
  padding: 20px;
}

.main-content {
  padding: 20px;
  min-height: calc(100vh - 80px);
}
</style>
    