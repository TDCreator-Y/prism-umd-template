/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  // ⚠️ 此值必须与 src/build/constants.ts 中的 WRAPPER_CLASS_NAME 保持一致。
  // tailwind.config.js 由 Node 进程直接读取，无法 import TypeScript，故手动维护。
  // 修改时请同步修改两处，否则样式隔离将完全失效。
  important: '.kivii-demo-lib-wrapper',
  corePlugins: {
    preflight: false,
  },
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
