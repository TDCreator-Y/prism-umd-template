/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

declare global {
  interface Window {
    kivii?: {
      request: <T = unknown>(options: { url: string; method?: 'GET' | 'POST' | 'PUT' | 'DELETE'; data?: unknown; headers?: Record<string, string> }) => Promise<T>
    }
  }
}

export {}
