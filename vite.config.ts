import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "path";
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';
import { fileURLToPath } from "url";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import postcssImport from "postcss-import";
import postcssNested from "postcss-nested";

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
        postcssImport(),
        tailwindcss(),
        postcssNested(),
        autoprefixer({
          overrideBrowserslist: ['last 2 versions']
        })
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
