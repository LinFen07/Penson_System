import { defineStore } from 'pinia'
import type { VideoItem } from '@/types/study-center'
import defaultPoster from '@/assets/images/image.png'

// 模拟视频数据
const mockVideos: VideoItem[] = [
  {
    id: '1',
    title: '测试视频 - 自然风景展示与讲解，带你领略大自然的魅力',
    url: 'https://stream7.iqilu.com/10339/upload_transcode/202002/09/20200209104902N3v5Vpxuvb.mp4',
    poster: defaultPoster,
    duration: '05:30',
    views: 125800,
    date: '2023-10-01',
    description: '这是一个测试用的自然风景视频，包含了山川、河流等自然景观。\n\n视频拍摄于2023年秋季，使用专业设备录制，画质清晰。\n\n喜欢本视频的话请点赞投币收藏三连支持一下UP主~\n\n相关视频可以查看我的频道专辑《自然之美》系列。'
  },
  {
    id: '2',
    title: '户外探险：深入森林秘境寻找野生动物踪迹',
    url: 'https://stream7.iqilu.com/10339/upload_transcode/202002/09/20200209104902N3v5Vpxuvb.mp4',
    poster: 'https://picsum.photos/id/29/400/225',
    duration: '12:15',
    views: 89200,
    date: '2023-09-15',
    description: '本次探险我们将深入原始森林，寻找珍稀野生动物的踪迹，记录它们的生活习性。'
  },
  {
    id: '3',
    title: '延时摄影：城市与自然的完美融合',
    url: 'https://stream7.iqilu.com/10339/upload_transcode/202002/09/20200209104902N3v5Vpxuvb.mp4',
    poster: 'https://picsum.photos/id/42/400/225',
    duration: '08:40',
    views: 210500,
    date: '2023-08-22',
    description: '通过延时摄影技术，展示城市与自然景观在不同时间的变化，感受时间的流逝之美。'
  },
  {
    id: '4',
    title: '海洋生物观察：珊瑚礁生态系统探秘',
    url: 'https://stream7.iqilu.com/10339/upload_transcode/202002/09/20200209104902N3v5Vpxuvb.mp4',
    poster: 'https://picsum.photos/id/65/400/225',
    duration: '15:20',
    views: 156300,
    date: '2023-07-30',
    description: '潜入海底，探索神秘的珊瑚礁生态系统，认识各种奇特的海洋生物。'
  }
]

export const useStudyCenterStore = defineStore('studyCenter', {
  state: () => ({
    currentVideo: null as VideoItem | null,
    playlists: [] as VideoItem[][],
    videoList: mockVideos
  }),

  actions: {
    // 获取所有视频
    getVideoList(): VideoItem[] {
      return this.videoList
    },

    // 根据ID获取视频
    getVideoById(id: string): VideoItem | undefined {
      return this.videoList.find(video => video.id === id)
    },

    // 播放视频
    playVideo(video: VideoItem) {
      this.currentVideo = video
    },

    // 刷新视频数据
    refreshVideoData(): VideoItem[] {
      // 实际项目中可以在这里从API重新获取数据
      return [...this.videoList]
    },

    // 更新视频播放进度
    updateVideoProgress(videoId: string, currentTime: number, duration: number) {
      // 实现进度更新逻辑
      console.log(`Video ${videoId} progress: ${currentTime}/${duration}`)
    }
  }
})
