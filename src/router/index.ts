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
    component:()=>import('@/views/Layout/index.vue')
  }  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
