<template>
  <div>
    <ThemeTestDemo />
  </div>
</template>

<script setup lang="ts">
import { onErrorCaptured } from 'vue'
import ThemeTestDemo from '@/dev/views/ThemeTestDemo.vue'

// 捕获子组件的渲染异常，防止白屏时无任何提示
onErrorCaptured((err, _instance, info) => {
  console.error(`[App] 子组件异常 (${info}):`, err)
  return false // 阻止向上冒泡，由此处统一处理
})
</script>
