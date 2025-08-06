<template>
  <aside class="hidden md:block w-72 shrink-0">
    <div class="space-y-6">
      <!-- 社区公告 -->
      <CommunityAnnouncement />
      <!-- 热门话题 -->
      <HotTopics />
      <!-- 活跃用户 -->
      <ActiveUsers />
    </div>
  </aside>
</template>

<script setup>
import CommunityAnnouncement from '@/components/community/CommunityAnnouncement.vue'
import HotTopics from '@/components/community/HotTopics.vue'
import ActiveUsers from '@/components/community/ActiveUsers.vue'
</script>