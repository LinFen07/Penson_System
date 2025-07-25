import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "path";
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import { fileURLToPath } from "url";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)) && path.resolve(__dirname, "src")
    },
  },
  plugins: [
    vue(),
    viteCommonjs({
      include: ['jspdf', 'jspdf-autotable', 'tailwindcss', 'video.js', 'videojs-hls.js']
    }),
  ],
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer()
      ]
    }
  },
  optimizeDeps: {
    include: ['jspdf', 'jspdf-autotable'],
    exclude: [],
  },
  server: {
    port: 8080,
    hmr: {
      host: "127.0.0.1",
      port: 8080,
    },
    proxy: {
      "/api": {
        target: "your https address",
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, ""),
      },
    },
  },
});
