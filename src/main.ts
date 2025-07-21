import { createApp } from "vue";
import App from "./App.vue";
import store from "./stores";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import './index.css'; // 引入全局样式
import './output.css'
// import './assets/styles/tailwind.css'

// 创建实例
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(ElementPlus)
// 挂载 pinia
app.use(store);
// 挂载路由
app.use(router);
// 挂载实例
app.mount("#app");
