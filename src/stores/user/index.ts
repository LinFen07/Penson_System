import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  // 状态
  const isLoggedIn = ref(false)
  const authToken = ref<string | null>(null)
  const userInfo = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 从localStorage初始化
  const initFromLocalStorage = () => {
    const token = localStorage.getItem('authToken')
    const user = localStorage.getItem('userInfo')
    if (token && user) {
      authToken.value = token
      userInfo.value = JSON.parse(user)
      isLoggedIn.value = true
    }
  }

  // Getters
  const isAdmin = computed(() => userInfo.value?.role === 'admin')
  const userName = computed(() => userInfo.value?.name || '')
  const userId = computed(() => userInfo.value?.id || '')
  const userAvatar = computed(() => userInfo.value?.avatar || '')
  const userContact = computed(() => userInfo.value?.contact || {})

  // Actions
  const login = async (token: string, user: User) => {
    try {
      isLoading.value = true
      error.value = null
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      
      authToken.value = token
      userInfo.value = user
      isLoggedIn.value = true
      
      // 持久化到localStorage
      localStorage.setItem('authToken', token)
      localStorage.setItem('userInfo', JSON.stringify(user))
    } catch (err) {
      error.value = err.message || '登录失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    authToken.value = null
    userInfo.value = null
    isLoggedIn.value = false
    error.value = null
    
    // 清除localStorage
    localStorage.removeItem('authToken')
    localStorage.removeItem('userInfo')
  }

  const refreshUserInfo = async () => {
    if (!isLoggedIn.value) return
    
    try {
      isLoading.value = true
      error.value = null
      
      // 模拟API调用获取最新用户信息
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // 更新localStorage中的用户信息
      if (userInfo.value) {
        localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      }
    } catch (err) {
      error.value = err.message || '获取用户信息失败'
    } finally {
      isLoading.value = false
    }
  }

  const updateUserInfo = async (info: Partial<User>) => {
    if (!userInfo.value) return
    
    try {
      isLoading.value = true
      error.value = null
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 300))
      
      userInfo.value = { ...userInfo.value, ...info }
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
    } catch (err) {
      error.value = err.message || '更新用户信息失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 初始化
  initFromLocalStorage()

  return {
    isLoggedIn,
    authToken,
    userInfo,
    isLoading,
    error,
    isAdmin,
    userName,
    userId,
    userAvatar,
    userContact,
    login,
    logout,
    refreshUserInfo,
    updateUserInfo
  }
})
