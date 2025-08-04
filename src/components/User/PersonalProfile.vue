<template>
  <div class="personal-profile">
    <div class="profile-header">
      <h2 class="profile-title">个人资料</h2>
      <p class="profile-desc">完善您的个人信息，让他人更好地了解您</p>
    </div>

    <!-- 表单卡片分组 -->
    <el-card class="form-card mb-4">
      <div slot="header" class="card-header">
        <i class="el-icon-user mr-2"></i>基本信息
      </div>
      <el-form :model="form" label-width="120px" class="info-form">
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入您的昵称" max-length="20" show-word-limit />
        </el-form-item>

        <el-form-item label="个人简介">
          <el-input
            v-model="form.bio"
            type="textarea"
            :rows="3"
            placeholder="请简要介绍自己（100字以内）"
            max-length="100"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="性别">
          <el-radio-group v-model="form.gender">
            <el-radio label="male">男</el-radio>
            <el-radio label="female">女</el-radio>
            <el-radio label="">未设置</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="生日">
          <el-date-picker
            v-model="form.birthday"
            type="date"
            placeholder="选择生日"
            value-format="yyyy-MM-dd"
            :disabled-date="disableFutureDate"
          />
        </el-form-item>

        <el-form-item label="所在地">
          <el-input v-model="form.location" placeholder="例如：北京市 朝阳区" />
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="form-card mb-4">
      <div slot="header" class="card-header">
        <i class="el-icon-phone mr-2"></i>联系信息
      </div>
      <el-form :model="form" label-width="120px" class="info-form">
        <el-form-item label="邮箱" prop="email">
          <el-input 
            v-model="form.email" 
            placeholder="请输入邮箱地址" 
            :rules="[
              { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
            ]"
          />
          <div class="form-hint">用于账号安全验证和重要通知</div>
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input 
            v-model="form.phone" 
            placeholder="请输入手机号码"
            :maxlength="11"
            :prefix-icon="showPhone ? 'el-icon-eye' : 'el-icon-eye-invisible'"
            @click="showPhone = !showPhone"
            :type="showPhone ? 'text' : 'password'"
          />
        </el-form-item>

        <el-form-item label="个人网站">
          <el-input v-model="form.website" placeholder="例如：https://example.com" />
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="form-card mb-4">
      <div slot="header" class="card-header">
        <i class="el-icon-briefcase mr-2"></i>职业信息
      </div>
      <el-form :model="form" label-width="120px" class="info-form">
        <el-form-item label="公司/组织">
          <el-input v-model="form.company" placeholder="请输入所在公司或组织" />
        </el-form-item>

        <el-form-item label="职位">
          <el-input v-model="form.position" placeholder="请输入您的职位" />
        </el-form-item>

        <el-form-item label="行业">
          <el-select v-model="form.industry" placeholder="请选择行业">
            <el-option label="互联网/IT" value="internet" />
            <el-option label="金融" value="finance" />
            <el-option label="教育" value="education" />
            <el-option label="医疗健康" value="medical" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="form-card">
      <div slot="header" class="card-header">
        <i class="el-icon-info mr-2"></i>账号信息
      </div>
      <el-form :model="form" label-width="120px" class="info-form">
        <el-form-item label="注册时间">
          <el-input v-model="formattedRegisterTime" disabled />
        </el-form-item>

        <el-form-item label="账号状态">
          <el-tag type="success">正常</el-tag>
        </el-form-item>

        <el-form-item label="最近更新">
          <el-input v-model="formattedUpdateTime" disabled />
        </el-form-item>
      </el-form>
    </el-card>

    <div class="form-actions">
      <el-button @click="resetForm">重置</el-button>
      <el-button type="primary" @click="saveInfo">保存修改</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PersonalProfile',
  props: {
    userInfo: {
      type: Object,
      default: () => ({
        avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        nickname: '用户名',
        bio: '个人简介示例',
        gender: '',
        birthday: '',
        location: '',
        email: '',
        phone: '',
        website: '',
        company: '',
        position: '',
        industry: '',
        registerTime: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    },
    stats: {
      type: Object,
      default: () => ({
        fans: 100,
        following: 50
      })
    }
  },
  data() {
    return {
      form: {
        nickname: '',
        bio: '',
        gender: '',
        birthday: '',
        location: '',
        email: '',
        phone: '',
        website: '',
        company: '',
        position: '',
        industry: ''
      },
      showPhone: false, // 控制手机号显示/隐藏
      originalForm: {} // 用于重置的原始数据
    };
  },
  computed: {
    formattedRegisterTime() {
      if (!this.userInfo.registerTime) return '';
      const date = new Date(this.userInfo.registerTime);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    formattedUpdateTime() {
      const updateTime = this.userInfo.updatedAt || this.userInfo.registerTime;
      if (!updateTime) return '未更新';
      const date = new Date(updateTime);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  },
  watch: {
    userInfo: {
      handler(val) {
        // 初始化表单数据
        this.form = {
          nickname: val.nickname,
          bio: val.bio,
          gender: val.gender,
          birthday: val.birthday,
          location: val.location,
          email: val.email,
          phone: val.phone,
          website: val.website,
          company: val.company,
          position: val.position,
          industry: val.industry
        };
        // 保存原始数据用于重置
        this.originalForm = { ...this.form };
      },
      immediate: true
    }
  },
  methods: {
    // 禁止选择未来的生日
    disableFutureDate(date) {
      return date > new Date();
    },
    // 重置表单
    resetForm() {
      this.form = { ...this.originalForm };
      this.$message.info('已重置为原始数据');
    },
    // 保存信息
    saveInfo() {
      // 简单验证
      if (!this.form.nickname) {
        this.$message.warning('请输入昵称');
        return;
      }
      
      // 补充更新时间
      const updatedData = {
        ...this.form,
        updatedAt: new Date().toISOString()
      };
      
      this.$emit('update-info', updatedData);
      this.$message.success('信息保存成功');
      // 更新原始数据
      this.originalForm = { ...this.form };
    }
  }
};
</script>

<style scoped>
.personal-profile {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.profile-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.profile-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2329;
  margin-bottom: 8px;
}

.profile-desc {
  color: #6b7280;
  font-size: 14px;
}

.form-card {
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.card-header {
  font-weight: 500;
  color: #1f2329;
  font-size: 15px;
}

.info-form {
  padding: 20px 0;
}

.form-hint {
  margin-top: 6px;
  font-size: 12px;
  color: #6b7280;
  line-height: 1.5;
}

.form-actions {
  margin-top: 20px;
  text-align: right;
}

.form-actions .el-button {
  margin-left: 10px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .personal-profile {
    padding: 10px;
  }
  
  .el-form-item__label {
    width: 100px !important;
  }
}
</style>