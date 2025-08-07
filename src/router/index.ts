import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/video/:id',
    name: 'VideoPlay',
    component: () => import('@/views/VideoPlayView.vue'),
    meta: {
      title: '视频播放',
      KeepAlive: false,
      requireAuth: true
    }
  },
  {
    path:'/',
    name:'Layout',
    meta:{
      title:'首页',
      KeepAlive:true,
      requireAuth:false
    },
        component:()=>import('@/views/Layout.vue'),
    children: [
      {
        path: 'problemBank',
        name: 'ProblemBank',
        component: () => import('@/views/ProblemBankView.vue'),
        meta: {
          title: '算法题库'
        }
      },
      {
        path: 'algorithm',
        name: 'AlgorithmSandbox',
        component: () => import('@/views/AlgorithmSandboxView.vue'),
        meta: {
          title: '算法沙盒'
        }
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/ProblemDashboard.vue'),
        meta: {
          title: '刷题看板',
        }
      },
      {
        path: 'community',
        name: 'Community',
        component: () => import('@/views/CommunityDiscuss.vue'),
        meta: {
          title: '社区讨论',
        }
      },
      {
        path: 'learning',
        name: 'Learning',
        component: () => import('@/views/StudyCenter.vue'),
        meta: {
          title: '学习中心',
        }
      },
      {
        path: 'personal',
        name: 'Personal',
        component: () => import('@/views/UserCenter.vue'),
        meta: {     
          title: '个人中心',
        }  
      },
      {
        path: ':pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue'),
        meta: {
          title: '页面不存在'
        }
      }
    ]

  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/userLogin.vue'),
    meta: {
      title: '登录',
      KeepAlive: false,
      requireAuth: false
    }
  },
  {
      path:'/create',
      name:'CommunityCreate',
      component: () => import('@/views/CommunityCreate.vue'),
      meta: {
        title: '发布新话题',
      }
    },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
