import { createApp } from 'vue'
import App from '@/dev/App.vue'

const app = createApp(App)

// 全局错误处理：捕获组件树中任意未处理的异常，避免静默失败
app.config.errorHandler = (err, _instance, info) => {
  console.error(`[App] 组件错误 (${info}):`, err)
}

app.mount('#app')