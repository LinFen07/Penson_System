import { createApp } from "vue";
import App from "./App.vue";
import store from "./stores";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import * as monaco from 'monaco-editor';
import './index.css';
import './output.css';

// Monaco Editor Worker配置
(window as any).MonacoEnvironment = {
  getWorkerUrl: function (moduleId: string, label: string) {
    if (label === 'json') {
      return './monaco-editor/esm/vs/language/json/json.worker.js';
    }
    if (label === 'css') {
      return './monaco-editor/esm/vs/language/css/css.worker.js';
    }
    if (label === 'html') {
      return './monaco-editor/esm/vs/language/html/html.worker.js';
    }
    if (label === 'typescript' || label === 'javascript') {
      return './monaco-editor/esm/vs/language/typescript/ts.worker.js';
    }
    return './monaco-editor/esm/vs/editor/editor.worker.js';
  }
};

// 预加载Monaco Editor
try {
  monaco.editor.create(document.createElement('div'), {
    value: '',
    language: 'javascript'
  });
} catch (error) {
  console.warn('Monaco Editor初始化失败:', error);
}

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
