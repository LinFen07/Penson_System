interface ContactInfo {
  email: string
  phone: string
  wechat?: string
}

interface User {
  id: string
  name: string
  role: 'user' | 'admin' | 'guest'
  avatar: string
  bio?: string
  contact: ContactInfo
  createdAt: string
  updatedAt: string
}

interface ProfileForm {
  name: string
  bio: string
  avatar: string
  contact: {
    email: string
    phone: string
  }
}

export type { User, ProfileForm, ContactInfo }
