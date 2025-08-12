/**
 * 表单验证工具函数
 */

// 邮箱验证
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// 手机号验证（中国）
export const validatePhone = (phone: string): boolean => {
  const re = /^1[3-9]\d{9}$/
  return re.test(phone)
}

// 密码强度验证
export const validatePassword = (password: string): {valid: boolean; strength: number} => {
  let strength = 0
  
  // 长度至少8位
  if (password.length >= 8) strength += 1
  
  // 包含大写字母
  if (/[A-Z]/.test(password)) strength += 1
  
  // 包含小写字母
  if (/[a-z]/.test(password)) strength += 1
  
  // 包含数字
  if (/\d/.test(password)) strength += 1
  
  // 包含特殊字符
  if (/[^A-Za-z0-9]/.test(password)) strength += 1
  
  return {
    valid: strength >= 3,
    strength
  }
}

// 验证URL
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// 验证是否为空
export const validateNotEmpty = (value: string): boolean => {
  return value.trim().length > 0
}

// 验证数字范围
export const validateNumberRange = (
  value: number,
  min?: number,
  max?: number
): boolean => {
  if (min !== undefined && value < min) return false
  if (max !== undefined && value > max) return false
  return true
}
