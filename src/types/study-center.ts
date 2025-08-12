/**
 * 视频项类型定义
 */
export interface VideoItem {
  id: string
  title: string
  url: string
  poster: string
  duration: string
  views: number
  date: string
  description: string
}

/**
 * 评论类型定义
 */
export interface CommentItem {
  id: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  time: string
  likes: number
  replies?: CommentReply[]
}

/**
 * 评论回复类型定义
 */
export interface CommentReply {
  id: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  time: string
  likes: number
  isAuthor?: boolean // 是否为作者回复
}

/**
 * 播放列表类型定义
 */
export interface Playlist {
  id: string
  name: string
  videoIds: string[]
  createTime: string
}
