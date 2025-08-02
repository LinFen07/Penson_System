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
        
        <!-- 个人中心菜单（只保留核心项） -->
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
            <!-- 暂时隐藏其他菜单项，避免依赖辅助组件 -->
          </el-menu>
        </el-card>
      </el-col>

      <!-- 右侧区域 (70%) -->
      <el-col :span="16">
        <el-card shadow="hover" class="h-full">
          <!-- 只保留个人信息展示 -->
          <h2 class="text-xl font-bold text-gray-800 mb-6">个人信息</h2>
          <personal-info 
            :user-info="userInfo"
            @edit-info="openEditDialog"
            @change-avatar="handleChangeAvatar"
          />
        </el-card>
      </el-col>
    </el-row>

    <!-- 编辑对话框 -->
    <personal-dia 
      ref="dia" 
      @save-info="updateUserInfo"
    />
    
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
import PersonalInfo from "@/components/User/PersonalInfo.vue";
import PersonalDia from "@/components/User/PersonalDia.vue";

export default {
  components: { 
    PersonalInfo, 
    PersonalDia
  },
  name: "Personal",
  data() {
    return {
      activeMenu: 'profile', // 只保留个人简介菜单
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
    // 菜单选择处理（只响应个人简介）
    handleMenuSelect(index) {
      this.activeMenu = index;
    },
    // 打开编辑对话框
    openEditDialog() {
      this.$refs.dia.open(this.userInfo);
    },
    // 更新用户信息
    updateUserInfo(newInfo) {
      this.userInfo = { ...this.userInfo, ...newInfo };
      this.$message.success('信息保存成功');
    },
    // 打开头像上传对话框
    handleChangeAvatar() {
      this.showAvatarDialog = true;
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
    // 头像上传成功处理（模拟）
    handleAvatarUpload(response) {
      // 实际项目中根据接口返回处理
      this.userInfo.avatar = response.url || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';
      this.showAvatarDialog = false;
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
</style>