# AI 开发规范与最佳实践 (AI Coding Standards & Best Practices)

本规范旨在为团队成员及 AI 辅助工具（如 Trae, Copilot, ChatGPT 等）提供统一的开发标准。通过遵循本规范，我们可以确保生成的代码风格一致、结构清晰、易于维护，并完全兼容现有的开发指南。

---

## 1. 核心原则 (Core Principles)

- **一致性 (Consistency)**: 无论是人工编写还是 AI 生成，必须遵循相同的代码风格和项目结构。
- **模块化 (Modularity)**: 组件应职责单一，逻辑复杂时应抽取为 Composables。
- **自描述 (Self-Describing)**: 代码应包含必要的类型定义和 Manifest 元数据，便于理解和工具解析。
- **无障碍 (Accessibility)**: 始终考虑 Dark Mode 适配和响应式设计。

---

## 2. 技术栈规范 (Tech Stack)

所有代码生成和开发必须严格基于以下技术版本：

- **Framework**: Vue 3 (Composition API + `<script setup>`)
- **Language**: TypeScript (Strict Mode)
- **Build Tool**: Vite (UMD Build Target)
- **Styling**: Tailwind CSS (v3.x)
- **Icons**: FontAwesome (Class-based, e.g., `fas fa-home`)

---

## 3. 命名与目录规范 (Naming & Directory Standards)

### 3.1 目录结构

- **组件目录**: `src/build/components/`
    - 单文件组件：`src/build/components/ComponentName.vue`
    - 复杂组件包：`src/build/components/ComponentName/` (包含 `index.ts` 和多个 `.vue` 文件)
- **类型定义**: `src/build/types/`
- **工具函数**: `src/build/utils/`

### 3.2 命名约定

- **文件/目录名**: 严格使用 **PascalCase** (大驼峰)。
    - ✅ `ProductClassification.vue`
    - ❌ `productClassification.vue`, `product-classification.vue`
- **组件名**: **PascalCase**，尽量由两个单词组成以避免冲突。
    - ✅ `KvcCard`, `RiskEvaluation`
    - ❌ `Card`, `Risk`
- **Props/Emits**: **camelCase** (小驼峰)。
    - ✅ `defineProps<{ userName: string }>()`
- **事件名**: 模板中使用 kebab-case，脚本中使用 camelCase。
    - Template: `@update:model-value`
    - Script: `emit('update:modelValue')`

---

## 4. 组件开发规范 (Component Standards)

### 4.1 SFC 结构顺序

所有 `.vue` 文件必须严格遵循以下顺序：

1.  `<template>`
2.  `<script setup lang="ts">`
3.  `<style>` (尽量避免，优先使用 Tailwind)

### 4.2 Script Setup 规范

```vue
<script setup lang="ts">
// 1. Imports (Vue core -> Third party -> Local)
import { computed, ref } from 'vue'
import type { Manifest } from '@/build/types'

// 2. Type Definitions (Props & Emits)
export interface Props {
	title?: string
	theme?: 'light' | 'dark'
}

// 3. Component Manifest (MUST HAVE)
const manifest: Manifest = {
	name: 'MyComponent',
	type: 'component',
	description: '组件功能的简要描述',
	version: '1.0.0',
	author: 'Kivii Team',
}

// 4. Props with Defaults
const props = withDefaults(defineProps<Props>(), {
	title: 'Default Title',
	theme: 'light',
})

// 5. Emits
const emit = defineEmits<{
	(e: 'click', id: string): void
}>()

// 6. State & Logic
const isDark = computed(() => props.theme === 'dark')

// 7. Expose (Optional)
defineExpose({ manifest })
</script>
```

### 4.3 组件元数据 (Manifest)

**强制要求**: 每个业务组件内部必须定义 `manifest` 常量，描述组件的基本信息。这有助于未来的自动化工具提取文档和元数据。

---

## 5. 样式规范 (Styling Standards)

### 5.1 Tailwind CSS 优先

- 禁止编写传统的 `<style scoped>` CSS，除非遇到 Tailwind 无法解决的复杂动画或伪类。
- 使用 Utility Classes 实现布局和样式。

### 5.2 Dark Mode 适配 (强制)

所有组件**必须**同时适配浅色和深色模式。

- **规则**: 使用 `dark:` 前缀修饰深色模式样式。
- **配置**: 确保父容器或 HTML 标签可以通过添加 `.dark` 类切换主题。
- **背景色**:
    - Light: `bg-white`, `bg-slate-50`
    - Dark: `dark:bg-slate-900`, `dark:bg-slate-800`
- **文本色**:
    - Light: `text-slate-900`, `text-slate-600`
    - Dark: `dark:text-white`, `dark:text-slate-300`
- **边框色**:
    - Light: `border-slate-200`
    - Dark: `dark:border-slate-700`

**示例代码**:

```html
<div
	class="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
>
	<!-- Content -->
</div>
```

---

## 6. 工程化与导出规范 (Engineering & Export)

### 6.1 组件导出流程

当创建一个新组件 `NewComponent` 时，必须完成以下三个步骤：

1.  **开发组件**: 在 `src/build/components/NewComponent.vue` 中完成代码。
2.  **统一导出**: 在 `src/build/components/index.ts` 中添加导出语句。
    ```typescript
    import NewComponent from './NewComponent.vue'
    export { NewComponent }
    ```
3.  **注册元数据**: 在 `src/build.ts` 的 `manifest` 对象中添加描述。
    - `componentsMap`: 添加简短描述。
    - `componentsDetailed`: 添加详细对象 `{ name, zhName, icon, description }`。

### 6.2 外部依赖处理

以下三个依赖均配置为 `external`，不打包进 UMD，由宿主页面负责提供：

| 依赖 | 全局变量 | 说明 |
|------|----------|------|
| `vue` | `Vue` | 宿主必须提供 Vue 3 |
| `echarts` | `echarts` | 宿主可选加载 ECharts |
| `@kivii.com/bridge` | `kivii` | 可选的平台 Bridge API |

禁止引入任何其他会被打包进 UMD 的第三方库（如 axios、lodash、dayjs）。

- **图标**: 使用 FontAwesome 类名（如 `fas fa-user`），假设宿主环境已加载 FontAwesome CSS。

---

## 7. AI 辅助开发指令 (Prompts for AI)

当要求 AI 生成组件时，建议附带以下指令以确保符合规范：

> "请创建一个 Vue 3 + TypeScript 组件，使用 `<script setup>` 语法。样式必须使用 Tailwind CSS 并完全适配 Dark Mode（使用 `dark:` 前缀）。组件内部必须包含 `Manifest` 定义。请确保文件名和组件名使用 PascalCase。完成后，请给出在 `index.ts` 和 `src/build.ts` 中注册该组件所需的代码片段。"

---

## 8. 图表规范 (Charts)

- 统一使用 ECharts 作为图表库。
- 安装依赖：`pnpm add echarts`。
- 构建外部化：在 UMD 构建中将 `echarts` 标记为 external，并在 `globals` 中声明 `echarts`，宿主环境通过 CDN 提供全局变量 `window.echarts`。
- 代码引用：在组件中使用 `import * as echarts from 'echarts'` 获取类型与 API，打包不会内联（因 external）。
- 运行假设：宿主页面必须先通过 CDN 脚本加载 ECharts，例如 `https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js`。

示例（组件内最小使用模版）：

```vue
<template>
	<div ref="chartRef" class="w-full h-64"></div>
</template>
<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null

onMounted(() => {
	if (!chartRef.value) return
	chart = echarts.init(chartRef.value)
	chart.setOption({
		xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
		yAxis: { type: 'value' },
		series: [{ type: 'line', data: [120, 200, 150, 80, 70] }],
	})
})

onBeforeUnmount(() => {
	chart?.dispose()
})
</script>
```

构建配置要求（参考 `vite.config.ts`）：

```ts
rollupOptions: {
  external: ['vue', 'echarts', '@kivii.com/bridge'],
  output: {
    globals: { vue: 'Vue', echarts: 'echarts', '@kivii.com/bridge': 'kivii' },
  },
}
```

## 9. 数据请求规范 (Bridge)

- 数据请求统一通过 `getBridge()` 工具函数进行，禁止在组件内直接使用 `fetch`、`axios` 或 `window.kivii?.request`。
- `getBridge()` 已封装了安全获取逻辑，调用前检查返回值即可。
- 宿主环境需通过 CDN 注入 `window.kivii`（例如 `<script src=".../bridge.min.js"></script>`）。

示例：

```ts
import { getBridge } from '@/build/utils'

async function fetchData() {
	const bridge = getBridge()
	if (!bridge) return   // bridge 未初始化时安全退出
	return bridge.request<{ ok: boolean }>({
		url: '/api/example',
		method: 'GET',
	})
}
```

## 附录：开发指南摘要

以下内容摘自 `DEVELOPMENT_GUIDE.md`，作为快速参考。

### 快速常用命令

- `pnpm dev`: 启动开发服务器
- `pnpm build`: 构建 UMD 库

### 库文件输出

- 路径: `dist/kivii-component-demo-library.umd.js`
- 全局变量: `window.VueComponent`
- CSS: 已内联注入到 JS 中，无需单独引用。

### 配置文件路径

- Vite: `vite.config.ts`
- Tailwind: `tailwind.config.js`
- 库入口: `src/build.ts`
- 组件入口: `src/build/components/index.ts`
