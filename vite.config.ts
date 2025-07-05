import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "path";
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import { fileURLToPath } from "url";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    //设置别名
    alias: {
      // "@": path.resolve(__dirname, "src"),
      "@":fileURLToPath(new URL("./src", import.meta.url)) &&path.resolve(__dirname, "src")
    },
  },
  plugins: [
    vue(),
    viteCommonjs({
      include: ['jspdf', 'jspdf-autotable']
    })
  ],
  optimizeDeps: {
    include: ['jspdf', 'jspdf-autotable'],
    exclude: [],
  },
  server: {
    port: 8080, //启动端口
    hmr: {
      host: "127.0.0.1",
      port: 8080,
    },
    // 设置 https 代理
    proxy: {
      "/api": {
        target: "your https address",
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, ""),
      },
    },
  },
});
