<template>
  <div class="container mx-auto px-4 py-6 max-w-6xl">
    <el-row :gutter="20">
      <!-- 左侧区域 (30%) -->
      <el-col :span="8">
        <!-- 用户信息卡片 -->
        <el-card shadow="hover" class="mb-4">
          <el-row :gutter="16" align="middle">
            <el-col :span="6">
              <el-avatar 
                :size="80"
                :src="userInfo.avatar"
              />
            </el-col>
            
            <el-col :span="18">
              <h2 class="text-xl font-bold text-gray-800 mb-2">{{ userInfo.nickname }}</h2>
              <p class="text-gray-500 text-sm mb-3">{{ userInfo.bio || '暂无简介' }}</p>
              
              <el-row :gutter="8">
                <el-col :span="12">
                  <div class="text-center">
                    <div class="text-lg font-bold text-gray-800">{{ stats.fans }}</div>
                    <div class="text-xs text-gray-500">粉丝</div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="text-center">
                    <div class="text-lg font-bold text-gray-800">{{ stats.following }}</div>
                    <div class="text-xs text-gray-500">关注</div>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-card>
        
        <!-- 个人中心菜单 -->
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
          </el-menu>
        </el-card>
      </el-col>

      <!-- 右侧区域 (70%) -->
      <el-col :span="16">
        <el-card shadow="hover" class="h-full">
          <!-- 使用新的个人简介子组件 -->
          <personal-profile
            :user-info="userInfo"
            :stats="stats"
            @update-info="updateUserInfo"
            @update-avatar="updateUserAvatar"
          />
        </el-card>
      </el-col>
    </el-row>

    <!-- 头像上传对话框 -->
    <el-dialog 
      title="更换头像" 
      :visible.sync="showAvatarDialog" 
      width="400px"
    >
      <el-upload
        action="/api/upload/avatar"
        :show-file-list="false"
        :on-success="handleAvatarUpload"
        :before-upload="beforeAvatarUpload"
      >
        <el-avatar 
          :size="150" 
          :src="userInfo.avatar" 
          class="upload-avatar"
        />
        <div class="text-center mt-4">
          <el-button size="small" type="primary">点击上传头像</el-button>
          <p class="text-xs text-gray-500 mt-2">支持JPG、PNG格式，大小不超过2MB</p>
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import PersonalProfile from "@/components/User/PersonalProfile.vue";

export default {
  components: { 
    PersonalProfile
  },
  name: "Personal",
  data() {
    return {
      activeMenu: 'profile',
      showAvatarDialog: false,
      // 用户核心信息
      userInfo: {
        avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        nickname: '用户名',
        bio: '个人简介示例',
        gender: '',
        birthday: '',
        location: '',
        registerTime: new Date().toISOString()
      },
      // 基础统计数据
      stats: {
        fans: 100,
        following: 50
      }
    };
  },
  methods: {
    // 菜单选择处理
    handleMenuSelect(index) {
      this.activeMenu = index;
    },
    // 更新用户信息
    updateUserInfo(newInfo) {
      this.userInfo = { ...this.userInfo, ...newInfo };
    },
    // 更新用户头像
    updateUserAvatar(newAvatar) {
      this.userInfo.avatar = newAvatar;
      this.showAvatarDialog = false;
    },
    // 头像上传前校验
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      
      if (!isJPG) {
        this.$message.error('只能上传JPG/PNG格式的图片');
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过2MB');
      }
      return isJPG && isLt2M;
    },
    // 头像上传成功处理
    handleAvatarUpload(response) {
      this.userInfo.avatar = response.url || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';
      this.$message.success('头像上传成功');
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}

.upload-avatar {
  display: block;
  margin: 0 auto;
}
::v-deep .el-card.right-card {
  border: none !important;
  box-shadow: none !important;
  --el-card-border-color: transparent !important; /* 覆盖组件 CSS 变量 */
}

/* 确保卡片内部区域也无额外边框 */
::v-deep .el-card.right-card .el-card__body {
  border: none !important;
  padding: 0; /* 根据实际布局需求调整内边距 */
}
</style>