import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './index'
import type { ProfileForm, ContactInfo } from '@/types/user'
import { validateEmail, validatePhone } from '@/utils/validation'

export const useProfileStore = defineStore('userProfile', () => {
  const userStore = useUserStore()
  
  // 编辑状态
  const isEditing = ref(false)
  const editForm = ref<ProfileForm>({
    name: '',
    bio: '',
    avatar: '',
    contact: {
      email: '',
      phone: ''
    }
  })

  // 上传状态
  const isUploading = ref(false)
  const uploadProgress = ref(0)
  const uploadError = ref<string | null>(null)

  // 表单验证状态
  const formErrors = ref<Record<string, string>>({})

  // 从user store初始化表单
  const initFromUserStore = () => {
    if (userStore.userInfo) {
      editForm.value = {
        name: userStore.userInfo.name || '',
        bio: userStore.userInfo.bio || '',
        avatar: userStore.userInfo.avatar || '',
        contact: {
          email: userStore.userInfo.contact?.email || '',
          phone: userStore.userInfo.contact?.phone || ''
        }
      }
    }
  }

  // 表单验证
  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!editForm.value.name.trim()) {
      errors.name = '请输入昵称'
    }
    
    if (editForm.value.contact.email && !validateEmail(editForm.value.contact.email)) {
      errors.email = '邮箱格式不正确'
    }
    
    if (editForm.value.contact.phone && !validatePhone(editForm.value.contact.phone)) {
      errors.phone = '手机号格式不正确'
    }
    
    formErrors.value = errors
    return Object.keys(errors).length === 0
  }

  // Actions
  const startEditing = () => {
    isEditing.value = true
    initFromUserStore()
  }

  const cancelEditing = () => {
    isEditing.value = false
    formErrors.value = {}
  }

  const saveProfile = async () => {
    if (!validateForm()) return false
    
    try {
      await userStore.updateUserInfo({
        name: editForm.value.name,
        bio: editForm.value.bio,
        avatar: editForm.value.avatar,
        contact: {
          email: editForm.value.contact.email,
          phone: editForm.value.contact.phone
        }
      })
      
      isEditing.value = false
      return true
    } catch (error) {
      formErrors.value.general = error.message || '保存失败'
      return false
    }
  }

  const uploadAvatar = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      uploadError.value = '请上传图片文件'
      return
    }
    
    if (file.size > 5 * 1024 * 1024) {
      uploadError.value = '图片大小不能超过5MB'
      return
    }
    
    try {
      isUploading.value = true
      uploadProgress.value = 0
      uploadError.value = null
      
      // 模拟上传API调用
      await new Promise((resolve, reject) => {
        const interval = setInterval(() => {
          uploadProgress.value += 20
          if (uploadProgress.value >= 100) {
            clearInterval(interval)
            const avatarUrl = URL.createObjectURL(file)
            editForm.value.avatar = avatarUrl
            resolve(avatarUrl)
          }
        }, 200)
      })
    } catch (error) {
      uploadError.value = error.message || '上传失败'
      throw error
    } finally {
      isUploading.value = false
    }
  }

  return {
    isEditing,
    editForm,
    isUploading,
    uploadProgress,
    uploadError,
    formErrors,
    startEditing,
    cancelEditing,
    saveProfile,
    uploadAvatar,
    validateForm
  }
})
