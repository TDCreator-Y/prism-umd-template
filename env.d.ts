/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
  
  // 允许从 .vue 文件导出类型
  export interface Props {}
}

declare global {
  interface Window {
    kivii?: {
      request: <T = any>(options: { url: string; method?: 'GET' | 'POST' | 'PUT' | 'DELETE'; data?: any; headers?: Record<string, string> }) => Promise<T>
    }
  }
}

export {}
