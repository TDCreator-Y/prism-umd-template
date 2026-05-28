# prism-umd-template · Trae AI 开发规则

> 此文件由 Trae 自动注入到每次 AI 对话。完整使用说明见 `doc/TRAE_AI_GUIDE.md`。

---

## 项目性质

Vue 3 UMD 组件库模板。构建产物为单个 `.umd.js` 文件，供纯 HTML 页面通过 `<script>` 标签引入，无需打包工具。

**构建产物**：`dist/kivii-component-demo-library.umd.js`  
**消费方式**：`window.VueComponent.install` / `window.VueComponent.组件名`

---

## 强制技术栈

- **Vue 3** + `<script setup lang="ts">` — 不接受 Options API
- **TypeScript** 严格模式 — 不允许 `any` 类型
- **Tailwind CSS v3** — 不写 `<style>` 块，不写内联颜色 style
- **FontAwesome** 图标类名 — `fas fa-xxx` 格式

---

## 目录约定（绝对不能违反）

| 路径 | 用途 |
|------|------|
| `src/build/components/ComponentName.vue` | **业务组件**（唯一合法位置） |
| `src/build/components/index.ts` | 统一导出入口 |
| `src/build.ts` | 库入口，含 withWrapper 注册和 manifest |
| `src/build/types/` | TypeScript 类型定义 |
| `src/build/utils/index.ts` | 工具函数（含 getBridge） |
| `src/build/composables/index.ts` | 组合式函数 |
| `src/dev/` | **仅开发调试用，不打包** |

---

## Vue SFC 固定顺序

```
<template>
<script setup lang="ts">
<style>（几乎不用）
```

### script 内部固定顺序

```typescript
// 1. imports（vue core → import type → 本地）
import { computed, ref } from 'vue'
import type { Manifest } from '@/build/types'  // ← 必须 import type

// 2. Props 接口（必须 export）
export interface Props { ... }

// 3. manifest 常量（每个组件必须有）
const manifest: Manifest = { name, type, description, version, author }

// 4. Props + 默认值
const props = withDefaults(defineProps<Props>(), { ... })

// 5. Emits（必须类型声明形式）
defineEmits<{ 事件名: [参数类型] }>()

// 6. 响应式状态和计算属性

// 7. 暴露（必须保留）
defineExpose({ manifest })
```

---

## 关键规则速查

### ✅ 必须这样写

```typescript
import type { Manifest } from '@/build/types'          // type import
defineEmits<{ change: [val: string]; close: [] }>()    // 类型形式
export interface Props { theme?: 'light' | 'dark' }    // export
```

```html
<!-- 每个颜色类必须同时写 dark: 版本 -->
<div class="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
```

### ❌ 绝对禁止

```typescript
import { Manifest } from '@/build/types'    // ❌ 缺少 type
defineEmits(['change', 'close'])            // ❌ 数组形式
interface Props { ... }                     // ❌ 缺少 export
const x: any = ...                          // ❌ any 类型
await fetch('/api/...')                     // ❌ 用 getBridge() 代替
import axios from 'axios'                   // ❌ 会打包进 UMD
```

```html
<div class="bg-white">      <!-- ❌ 缺 dark: 版本 -->
<style scoped>...</style>   <!-- ❌ 用 Tailwind 代替 -->
```

---

## Dark Mode 标准色板

| 场景 | Light | Dark |
|------|-------|------|
| 页面/根背景 | `bg-white` | `dark:bg-slate-900` |
| 卡片背景 | `bg-slate-50` | `dark:bg-slate-800` |
| 主文本 | `text-slate-900` | `dark:text-white` |
| 次要文本 | `text-slate-500` | `dark:text-slate-400` |
| 边框 | `border-slate-200` | `dark:border-slate-700` |
| 强调色 | `text-indigo-600` | `dark:text-indigo-400` |

---

## 数据请求

```typescript
// 唯一合法的请求方式
import { getBridge } from '@/build/utils'

const bridge = getBridge()
if (!bridge) return   // bridge 未初始化时安全退出
const data = await bridge.request({ url: '/api/xxx', method: 'GET' })
```

---

## ECharts 使用

```typescript
import * as echarts from 'echarts'   // 构建时自动外部化，不打包
// 组件卸载时必须 dispose
onBeforeUnmount(() => { chart?.dispose() })
```

---

## 新增组件三步（缺一不可）

1. 创建 `src/build/components/NewComponent.vue`
2. 在 `src/build/components/index.ts` 添加 `export { NewComponent }`
3. 在 `src/build.ts` 中：
   - import 并用 `withWrapper()` 包裹
   - 加入 `components` 对象
   - 在 `manifest.componentsMap` 和 `manifest.componentsDetailed` 中补充条目

---

## 样式隔离（AI 不需要手动处理）

`withWrapper` HOC 自动在每个导出组件外层包裹 `.kivii-demo-lib-wrapper` div。  
Tailwind `important` 配置确保所有样式在该作用域下生效。  
→ **AI 在组件 template 中不需要手动添加 wrapper div**。

---

*完整说明：`doc/TRAE_AI_GUIDE.md`*
