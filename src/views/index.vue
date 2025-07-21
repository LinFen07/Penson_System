<template>
  <div class="common-layout">
    <el-container>
      <el-header>
         <el-row :gutter="10">
   <!-- 左侧窄列 -->
          <el-col :span="4">
            <div class="grid-content component-space"><el-image url="image.png"></el-image></div>
          </el-col>
          <!-- 中间宽列 -->
          <el-col :span="16">
            <div class="grid-content component-space">
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
                    :class="{ 'active': isActive }"
                  >
                    <div class="nav-title">{{ item.title }}</div>
                  </div>
                </router-link>
                <div class="nav-underline" :style="underlineStyle"></div>
              </div>
            </div>
          </el-col>
          <!-- 右侧窄列 -->
          <el-col :span="4">
            <div class="grid-content component-space right-section">
              <div class="avatar-container">
                <el-avatar :size="40" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
                <div class="user-name">用户名</div>
              </div>
            </div>
          </el-col>
  </el-row>
</el-header>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>


<script>
export default {
  data() {
    return {
      activeIndex: 0,
      underlineWidth: 0,
      underlineOffset: 0,
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
    // 首次加载默认跳转至算法沙盒
    if (this.$route.path === '/') {
      this.$router.replace('/problemBank')
    }
  },
  methods: {
    updateUnderlinePosition(index) {
      const navItems = this.$el.querySelectorAll('.nav-item')
      if (navItems[index]) {
        const item = navItems[index]
        const title = item.querySelector('.nav-title')
        this.underlineWidth = title.offsetWidth
        this.underlineOffset = item.offsetLeft + (item.offsetWidth - title.offsetWidth) / 2
      }
    }
  },
  watch: {
    '$route.path'(newPath) {
      const index = this.navItems.findIndex(item => item.path === newPath)
      if (index !== -1) {
        this.activeIndex = index
        this.updateUnderlinePosition(index)
      }
    }
  }
}
</script>

<style scoped>
.el-header {
  height: 80px;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.component-space {
  min-height: 20px;
  height: 80px;
  margin: 5px 0;
  background: #f0f0f0;
  border-radius: 4px;
  padding: 10px;
}

.right-section {
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}



.user-name {
  font-size: 14px;
  color: #333;
}

.sections-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  width: 100%;
  position: relative;
}

.nav-item {
  padding: 12px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-item:hover {
  color: #409eff;
  transform: translateY(-2px);
}

.nav-item.active {
  color: #409eff;
}

.nav-title {
  font-size: 16px;
  font-weight: 500;
}

.nav-underline {
  position: absolute;
  bottom: -5px;
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