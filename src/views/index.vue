<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header-container">
        <!-- 左侧logo -->
        <div class="logo-section">
          <el-image url="image.png"></el-image>
        </div>
        
        <!-- 中间导航 -->
        <div class="nav-section">
          <div class="sections-container">
            <router-link
              v-for="(item, index) in navItems"
              :key="index"
              :to="item.path"
              custom
              v-slot="{ navigate, isActive }"
            >
              <div
                class="nav-item"
                @click="navigate"
                @mouseenter="updateUnderlinePosition(index)"
                @mouseleave="resetUnderline"
                :class="{ 'active': isActive }"
              >
                <div class="nav-title">{{ item.title }}</div>
              </div>
            </router-link>
            <div class="nav-underline" :style="underlineStyle"></div>
          </div>
        </div>
        
        <!-- 右侧用户 -->
        <div class="user-section">
          <el-dropdown>
            <div class="user-container">
              <el-avatar :size="36" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
              <span class="user-name">用户名</span>
              <el-icon class="arrow-down"><arrow-down /></el-icon>
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

<script>
import { ArrowDown } from '@element-plus/icons-vue'

export default {
  components: { ArrowDown },
  data() {
    return {
      activeIndex: 0,
      underlineWidth: 0,
      underlineOffset: 0,
      currentComponent: '/problemBank',
      navItems: [
        { title: '算法沙盒',  path: '/problemBank'},
        { title: '刷题看板', path: '/dashboard' },
        { title: '游戏竞赛', path: '/game' },
        { title: '学习中心', path: '/learning' }
      ]
    }
  },
  computed: {
    underlineStyle() {
      return {
        width: `${this.underlineWidth}px`,
        transform: `translateX(${this.underlineOffset}px)`
      }
    }
  },
  mounted() {
    this.updateUnderlinePosition(0)
    if (this.$route.path === '/') {
      this.$router.replace('/problemBank')
    }
  },
  methods: {
    updateUnderlinePosition(index) {
      this.activeIndex = index
      this.$nextTick(() => {
        const navItems = this.$el.querySelectorAll('.nav-item')
        if (navItems[index]) {
          const item = navItems[index]
          const title = item.querySelector('.nav-title')
          this.underlineWidth = title.offsetWidth
          this.underlineOffset = item.offsetLeft + (item.offsetWidth - title.offsetWidth) / 2
        }
      })
    },
    resetUnderline() {
      const index = this.navItems.findIndex(item => item.path === this.currentComponent)
      if (index !== -1) {
        this.updateUnderlinePosition(index)
      }
    }
  },
  watch: {
    '$route.path': {
      immediate: true,
      handler(newPath) {
        const index = this.navItems.findIndex(item => item.path === newPath)
        if (index !== -1) {
          this.currentComponent = newPath
          this.updateUnderlinePosition(index)
        }
      }
    }
  }
}
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

.logo-section, .nav-section, .user-section {
  height: 100%;
  display: flex;
  align-items: center;
}

.logo-section {
  width: 15%;
  justify-content: flex-start;
}

.nav-section {
  width: 70%;
  justify-content: center;
}

.user-section {
  width: 15%;
  justify-content: center;
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

.sections-container {
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  position: relative;
}

.nav-item {
  padding: 10px 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  margin-left: -1px;
}

.nav-item:first-child {
  margin-left: 0;
}

.nav-item:hover {
  color: #409eff;
  transform: translateY(-2px);
}

.nav-item.active {
  color: #409eff;
}

.nav-title {
  font-size: 14px;
  font-weight: 500;
}

.nav-underline {
  position: absolute;
  bottom: -1px;
  left:0px;
  height: 2px;
  background-color: #409eff;
  transition: all 0.3s ease;
}

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
