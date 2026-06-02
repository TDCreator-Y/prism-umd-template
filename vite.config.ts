/// <reference types="vitest" />
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { inlineCss } from "./plugins/vite-plugin-inline-css";
import { LIB_NAME, LIB_FILE_NAME } from "./src/build/lib.config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), inlineCss()],
  build: {
    // 输出目录
    outDir: resolve(__dirname, "./dist"),
    // 不清空输出目录
    emptyOutDir: false,
    lib: {
      // 入口文件
      entry: resolve(__dirname, "src/build.ts"),
      name: LIB_NAME,
      // 文件名
      fileName: () => LIB_FILE_NAME,
      // 输出格式
      formats: ["umd"],
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ["vue", "echarts", "@kivii.com/bridge"],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: "Vue",
          echarts: "echarts",
          "@kivii.com/bridge": "kivii",
        },
      },
    },
    // 开发环境生成完整 sourcemap 便于调试；生产环境使用 hidden 模式（文件存在但 .umd.js 末尾不附加注释引用）
    sourcemap: process.env.NODE_ENV === 'development' ? true : 'hidden',
    // 最小化输出
    minify: "terser",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/**/*.test.ts'],
  },
});
