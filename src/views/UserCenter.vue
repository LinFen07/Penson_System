<template>
  <div class="container mx-auto px-4 py-6 max-w-6xl">
    <el-row :gutter="20">
      <!-- 左侧区域 (30%) -->
      <el-col :span="8">
        <el-card shadow="hover" class="mb-4">
          <el-row :gutter="16" align="middle">
            <!-- 头像在左 -->
            <el-col :span="6">
              <el-avatar 
                :size="80"
                src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
              />
            </el-col>
            
            <!-- 用户名和其他信息在右 -->
            <el-col :span="18">
              <h2 class="text-xl font-bold text-gray-800 mb-2">用户名</h2>
              <p class="text-gray-500 text-sm mb-3">个人简介示例</p>
              
              <el-row :gutter="8">
                <el-col :span="12">
                  <div class="text-center">
                    <div class="text-lg font-bold text-gray-800">100</div>
                    <div class="text-xs text-gray-500">粉丝</div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="text-center">
                    <div class="text-lg font-bold text-gray-800">50</div>
                    <div class="text-xs text-gray-500">关注</div>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-card>
        
        <!-- 个人中心菜单卡片 -->
        <el-card shadow="hover" class="mb-4">
          <el-menu
            class="border-0"
            :default-active="activeMenu"
            @select="handleMenuSelect"
          >
            <el-menu-item index="profile">
              <i class="el-icon-user"></i>
              <span>个人简介</span>
            </el-menu-item>
            <el-menu-item index="posts">
              <i class="el-icon-edit-outline"></i>
              <span>发帖</span>
            </el-menu-item>
            <el-menu-item index="collections">
              <i class="el-icon-document"></i>
              <span>收藏</span>
            </el-menu-item>
            <el-menu-item index="fans">
              <i class="el-icon-tableware"></i>
              <span>粉丝</span>
            </el-menu-item>
            <el-menu-item index="following">
              <i class="el-icon-circle-plus-outline"></i>
              <span>关注</span>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>

      <!-- 右侧区域 (70%) -->
      <el-col :span="16">
        <el-card shadow="hover" class="h-full">
          <h2 class="text-xl font-bold text-gray-800 mb-6">功能区域</h2>
          <el-row :gutter="16">
            <el-col :span="12" v-for="i in 4" :key="i">
              <div class="bg-gray-100 rounded-lg p-4 h-32 flex items-center justify-center">
                <span class="text-gray-500">功能模块{{i}}</span>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <personal-dia ref="dia" />
  </div>
</template>

<script>
import PersonalDia from "./PersonalDia.vue";

export default {
  components: { PersonalDia },
  name: "Personal",
  data() {
    return {
      activeMenu: 'profile',
      userInfo: {
        nickname: "用户名",
        design: "个人简介示例"
      }
    };
  },
  methods: {
    edit() {
      this.$refs.dia.open();
    },
    handleMenuSelect(index) {
      this.activeMenu = index;
      // 根据选择执行不同操作
      if (index === 'profile') {
        this.edit();
      }
      // 其他菜单项的处理逻辑可以在这里添加
    }
  }
};
</script>

<style scoped>
/* 保留原有样式 */
.container {
  max-width: 1200px;
}
</style>
