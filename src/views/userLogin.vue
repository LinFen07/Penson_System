<template>
  <div class="login-container">
    <el-header class="header-container">
      <div class="logo-container">
        <span class="logo-text">个人学习平台</span>
      </div>
    </el-header>
    <el-main class="split-container">
      <el-row :gutter="20">
        <!-- 左侧轮播图 -->
        <el-col :span="12" class="left-panel">
          <el-carousel height="100vh" indicator-position="outside" arrow="always" :interval="5000">
            <el-carousel-item v-for="(item, index) in carouselItems" :key="index">
              <div class="carousel-content">
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
                <el-image :src="item.imageUrl" fit="contain" class="carousel-image" />
              </div>
            </el-carousel-item>
          </el-carousel>
        </el-col>
        
        <!-- 右侧登录表单 -->
        <el-col :span="12" class="right-panel">
          <div class="login-form-container">
            <div class="login-form-header">
              <h2>用户登录</h2>
              <p>欢迎回来，请登录您的账号</p>
            </div>
            
            <el-form :model="form" :rules="rules" ref="formRef" label-position="top" class="login-form">
              <el-form-item prop="username">
                <template #label>
                  <span>用户名</span>
                </template>
                <el-input 
                  v-model="form.username" 
                  placeholder="请输入用户名或邮箱"
                  prefix-icon="el-icon-user"
                />
              </el-form-item>
              
              <el-form-item prop="password">
                <template #label>
                  <span>密码</span>
                </template>
                <el-input 
                  v-model="form.password" 
                  type="password" 
                  placeholder="请输入密码"
                  prefix-icon="el-icon-lock"
                  @keyup.enter.native="handleLogin"
                />
              </el-form-item>
              
              <el-form-item class="remember-me">
                <el-checkbox v-model="form.rememberMe">记住密码</el-checkbox>
                <a href="#" class="forgot-password">忘记密码?</a>
              </el-form-item>
              
              <el-form-item>
                <el-button 
                  type="primary" 
                  :loading="loading"
                  class="login-button"
                  @click="handleLogin"
                >
                  登录
                </el-button>
              </el-form-item>
              
              <el-form-item class="register-option">
                <span>还没有账号?</span>
                <a href="#" class="register-link">立即注册</a>
              </el-form-item>
            </el-form>
            
            <div class="social-login">
              <div class="divider">
                <span>其他登录方式</span>
              </div>
              <div class="social-buttons">
                <el-button icon="el-icon-weixin" circle class="social-button" @click="handleSocialLogin('weixin')"></el-button>
                <el-button icon="el-icon-qq" circle class="social-button" @click="handleSocialLogin('qq')"></el-button>
                <el-button icon="el-icon-github" circle class="social-button" @click="handleSocialLogin('github')"></el-button>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
       <div class="footer-container">
      <div class="footer-content">
        <p>© 2025 算法学习平台 版权所有</p>
        <div class="footer-links">
          <a href="#">关于我们</a>
          <a href="#">使用条款</a>
          <a href="#">隐私政策</a>
          <a href="#">联系我们</a>
        </div>
      </div>
    </div>
    </el-main>
   
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'

export default defineComponent({
  setup() {
    const formRef = ref(null)
    
    const form = reactive({
      username: '',
      password: '',
      rememberMe: false
    })
    
    const rules = reactive({
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, message: '用户名长度至少为3个字符', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度至少为6个字符', trigger: 'blur' }
      ]
    })
    
    const loading = ref(false)
    
    const carouselItems = [
      {
        title: '丰富的算法资源',
        description: '提供海量算法题目和详细解析，助您快速掌握算法精髓',
        imageUrl: '/src/assets/images/algorithm1.png'
      },
      {
        title: '个性化学习路径',
        description: '根据您的水平和目标定制专属学习计划，高效提升算法能力',
        imageUrl: '/src/assets/images/algorithm2.png'
      },
      {
        title: '实时代码编辑与调试',
        description: '在线编辑和运行代码，即时获取反馈，快速迭代解决方案',
        imageUrl: '/src/assets/images/algorithm3.png'
      }
    ]
    
    const handleLogin = () => {
      (formRef.value as any).validate((valid: boolean) => {
        if (valid) {
          loading.value = true
          console.log('登录信息:', form)
          
          // 模拟登录请求
          setTimeout(() => {
            loading.value = false
            alert('登录成功！')
          }, 1500)
        } else {
          console.log('验证失败')
          return false
        }
      })
    }
    
    const handleSocialLogin = (type: string) => {
      console.log(`使用${type}登录`)
      alert(`使用${type}登录功能开发中...`)
    }
    
    return {
      form,
      formRef,
      rules,
      loading,
      carouselItems,
      handleLogin,
      handleSocialLogin
    }
  }
})
</script>

<style scoped>
.login-container {
  height: 100vh;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
}

.header-container {
  height: 60px !important;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 0 40px;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo-text {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
}

.split-container {
  flex: 1;
  padding: 0;
}

.carousel-content,
.login-form-container {
  overflow: auto;
  max-height: calc(100vh - 120px); /* 减去header和footer高度 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

/* 隐藏所有浏览器滚动条 */
.carousel-content::-webkit-scrollbar,
.login-form-container::-webkit-scrollbar {
  width: 0 !important;
  height: 0 !important;
  display: none !important;
}

.carousel-content,
.login-form-container {
  -webkit-overflow-scrolling: touch; /* 启用iOS平滑滚动 */
  overflow: -moz-scrollbars-none; /* 旧版Firefox */
}

.left-panel {
  height: 100%;
  padding: 0;
}

.right-panel {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.carousel-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 60px;
  text-align: center;
}

.carousel-content h3 {
  font-size: 28px;
  color: #303133;
  margin-bottom: 20px;
}

.carousel-content p {
  font-size: 18px;
  color: #606266;
  margin-bottom: 40px;
}

.carousel-image {
  max-width: 80%;
  max-height: 50vh;
  margin: 0 auto;
}

.login-form-container {
  width: 80%;
  max-width: 450px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 40px 50px;
}

.login-form-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-form-header h2 {
  font-size: 24px;
  color: #303133;
  margin-bottom: 10px;
}

.login-form-header p {
  font-size: 16px;
  color: #909399;
}

.login-form {
  margin-bottom: 30px;
}

.login-form .el-form-item__label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.login-form .el-input__inner {
  height: 44px;
  line-height: 44px;
  border-radius: 6px;
}

.remember-me {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.forgot-password {
  color: #409eff;
  text-decoration: none;
  font-size: 14px;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  border-radius: 6px;
}

.register-option {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #909399;
}

.register-link {
  color: #409eff;
  text-decoration: none;
  margin-left: 5px;
}

.register-link:hover {
  text-decoration: underline;
}

/* .social-login {
  margin-top: 40px;
} */  

.divider {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.divider::before, .divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: #ebeef5;
}

.divider span {
  margin: 0 15px;
  color: #909399;
  font-size: 14px;
}

.social-buttons {
  display: flex;
  justify-content: center;
}

.social-button {
  width: 40px;
  height: 40px;
  margin: 0 10px;
  font-size: 18px;
  transition: all 0.3s;
}

.social-button:hover {
  transform: translateY(-3px);
}

.footer-container {
  height: 60px !important;
  background-color: #fff;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-content {
  text-align: center;
}

.footer-content p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.footer-links {
  margin-top: 5px;
}

.footer-links a {
  color: #909399;
  text-decoration: none;
  margin: 0 10px;
  font-size: 14px;
}

.footer-links a:hover {
  color: #409eff;
}
</style>  