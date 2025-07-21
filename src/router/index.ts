import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path:'/',
    name:'Layout',
    meta:{
      title:'首页',
      KeepAlive:true,
      requireAuth:false
    },
        component:()=>import('@/views/index.vue'),
    children: [
      {
        path: '/problemBank',
        name: 'ProblemBank',
        component: () => import('@/views/ProblemBankView.vue'),
        meta: {
          title: '算法题库'
        }
      },
      {
        path: '/algorithm',
        name: 'AlgorithmSandbox',
        component: () => import('@/views/AlgorithmSandboxView.vue'),
        meta: {
          title: '算法沙盒'
        }
      },
      {
        path:'/dashboard',
        name:'Dashboard',
        component: () => import('@/views/ProblemDashboard.vue'),
        meta: {
          title: '刷题看板',
      }
    },
      {
        path:'/game',
        name:'Game',
        component: () => import('@/views/GamePlay.vue'),
        meta: {
          title: '游戏',
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
  }  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
