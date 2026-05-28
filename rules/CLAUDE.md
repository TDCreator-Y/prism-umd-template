# prism-umd-template · 项目开发规范

---

## 一、项目性质

Vue 3 UMD 组件库模板。构建产物为单个 `.umd.js` 文件，供纯 HTML 页面通过 `<script>` 标签引入，无需打包工具。

**构建产物**：`dist/kivii-component-demo-library.umd.js`
**消费方式**：`window.VueComponent.install` / `window.VueComponent.组件名`

**必须理解的 3 个核心机制：**

1. **样式隔离**：所有 Tailwind 类构建后自动加 `.kivii-demo-lib-wrapper` 前缀，`withWrapper` HOC 在每个导出组件外层自动包裹该类名的 div。AI 写组件时不需要手动加这个 div，但每个 Tailwind 颜色类都必须同时写 `dark:` 版本。
2. **外部依赖不打包**：`vue`、`echarts`、`@kivii.com/bridge` 均为 external，由宿主页面负责提供。不能引入任何其他会被打包进 UMD 的第三方库。
3. **Manifest 元数据**：每个组件有两层 manifest——组件级（`<script setup>` 内的 `manifest` 常量）和库级（`src/build.ts` 的 `manifest` 对象），新增组件时两者都必须同步维护。

---

## 二、强制技术栈

- **Vue 3** + `<script setup lang="ts">` — 不接受 Options API
- **TypeScript** 严格模式 — 不允许 `any` 类型
- **Tailwind CSS v3** — 不写 `<style>` 块，不写内联颜色 style
- **FontAwesome** 图标类名 — `fas fa-xxx` 格式

---

## 三、目录约定（绝对不能违反）

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

## 四、命名约定

| 对象 | 规则 | 正确示例 | 错误示例 |
|------|------|---------|---------|
| 文件 / 目录名 | **PascalCase** | `ProductCard.vue` | `product-card.vue` |
| 组件名 | **PascalCase**，尽量两个单词 | `KvcCard`、`RiskEvaluation` | `Card`、`risk` |
| Props / 变量 | **camelCase** | `userName`、`isLoading` | `user_name` |
| Emits（script） | **camelCase** | `emit('updateModelValue')` | — |
| Emits（template） | **kebab-case** | `@update:model-value` | — |

---

## 五、Vue SFC 规范

### SFC 块顺序（固定）

```
<template>
<script setup lang="ts">
<style>（几乎不用）
```

### script 内部顺序（固定）

```typescript
// 1. imports（vue core → import type → 本地）
import { computed, ref } from 'vue'
import type { Manifest } from '@/build/types'  // 必须 import type

// 2. Props 接口（必须 export）
export interface Props {
  title?: string
  theme?: 'light' | 'dark'
}

// 3. manifest 常量（每个组件必须有）
const manifest: Manifest = {
  name: 'MyComponent',
  type: 'component',
  description: '组件功能的简要描述',
  version: '1.0.0',
  author: 'Developer',
}

// 4. Props + 默认值
const props = withDefaults(defineProps<Props>(), {
  title: '标题',
  theme: 'light',
})

// 5. Emits（必须类型声明形式，不能用数组）
defineEmits<{
  change: [value: string]
  close: []
}>()

// 6. 响应式状态和计算属性
const isDark = computed(() => props.theme === 'dark')

// 7. 暴露（必须保留）
defineExpose({ manifest })
```

### 类型 import 规则

```typescript
// 正确
import type { Manifest } from '@/build/types'

// 错误
import { Manifest } from '@/build/types'
```

---

## 六、样式规范

### Dark Mode（强制）

每个颜色相关的 Tailwind 类都必须同时写 light 和 dark 版本：

```html
<!-- 正确 -->
<div class="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700">

<!-- 错误：缺少 dark: 版本 -->
<div class="bg-white text-slate-900">
```

### 标准色板

| 场景 | Light | Dark |
|------|-------|------|
| 页面 / 根背景 | `bg-white` | `dark:bg-slate-900` |
| 卡片背景 | `bg-slate-50` | `dark:bg-slate-800` |
| 悬停背景 | `hover:bg-slate-100` | `dark:hover:bg-slate-700/50` |
| 主文本 | `text-slate-900` | `dark:text-white` |
| 次要文本 | `text-slate-500` | `dark:text-slate-400` |
| 辅助文本 | `text-slate-400` | `dark:text-slate-500` |
| 边框 | `border-slate-200` | `dark:border-slate-700` |
| 强调色文本 | `text-indigo-600` | `dark:text-indigo-400` |
| 语义色：成功 | `text-green-600 bg-green-100` | `dark:text-green-400 dark:bg-green-900/30` |
| 语义色：警告 | `text-amber-600 bg-amber-100` | `dark:text-amber-400 dark:bg-amber-900/30` |
| 语义色：错误 | `text-red-600 bg-red-100` | `dark:text-red-400 dark:bg-red-900/30` |

### 样式隔离（AI 不需要手动处理）

`withWrapper` HOC 自动在每个导出组件外层包裹 `.kivii-demo-lib-wrapper` div，Tailwind `important` 配置确保所有样式在该作用域下生效。**AI 在组件 template 中不需要手动添加 wrapper div。**

修改隔离标识时必须同步修改两处：
- `tailwind.config.js` 的 `important: '.your-new-wrapper'`
- `src/build.ts` 中 `withWrapper` 渲染的 `class: 'your-new-wrapper'`

---

## 七、数据请求

```typescript
// 唯一合法的请求方式
import { getBridge } from '@/build/utils'

const bridge = getBridge()
if (!bridge) return   // bridge 未初始化时安全退出
const data = await bridge.request({ url: '/api/xxx', method: 'GET' })
```

禁止直接使用 `fetch`、`axios` 或 `window.kivii?.request`，必须通过 `getBridge()` 工具函数。

---

## 八、ECharts 使用

```vue
<template>
  <div class="w-full bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
    <h3 class="text-base font-semibold text-slate-800 dark:text-slate-100 mb-3">{{ title }}</h3>
    <div ref="chartRef" class="w-full h-64"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import * as echarts from 'echarts'   // 构建时自动外部化，不打包
import type { Manifest } from '@/build/types'

export interface Props {
  title?: string
  theme?: 'light' | 'dark'
  data?: number[]
}

const manifest: Manifest = {
  name: 'MyChart',
  type: 'component',
  description: 'ECharts 图表组件',
  version: '1.0.0',
  author: 'Developer',
}

const props = withDefaults(defineProps<Props>(), {
  title: '图表',
  theme: 'light',
  data: () => [],
})

defineEmits<{ 'data-click': [value: number] }>()

const chartRef = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null

function initChart() {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value, props.theme === 'dark' ? 'dark' : undefined)
  chart.setOption({
    xAxis: { type: 'category' },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: props.data }],
  })
}

watch(() => props.data, () => { chart?.setOption({ series: [{ data: props.data }] }) })
watch(() => props.theme, () => { chart?.dispose(); initChart() })

onMounted(initChart)
onBeforeUnmount(() => { chart?.dispose() })   // 必须 dispose，防止内存泄漏

defineExpose({ manifest })
</script>
```

---

## 九、新增组件三步（缺一不可）

**Step 1** — 创建 `src/build/components/NewComponent.vue`

**Step 2** — 在 `src/build/components/index.ts` 添加导出：
```typescript
import NewComponent from './NewComponent.vue'
export { NewComponent }
```

**Step 3** — 在 `src/build.ts` 中完成注册：
```typescript
import { NewComponent as _NewComponent } from '@/build/components'
const NewComponent = withWrapper(_NewComponent)

const components = { ..., NewComponent }

export const manifest = {
  // ...
  componentsMap: {
    NewComponent: '组件的简短描述',
  },
  componentsDetailed: [
    { name: 'NewComponent', zhName: '中文名称', icon: 'fas fa-cube', description: '详细描述' },
  ],
}
```

---

## 十、禁止行为清单

### TypeScript

| 禁止写法 | 正确写法 |
|---------|---------|
| `import { Manifest } from '@/build/types'` | `import type { Manifest } from '@/build/types'` |
| `defineEmits(['change', 'close'])` | `defineEmits<{ change: [val: string]; close: [] }>()` |
| `interface Props { ... }` | `export interface Props { ... }` |
| `const x: any = ...` | 使用具体类型 |
| `const x: string \| any` | 使用具体联合类型 |

### 样式

| 禁止写法 | 正确写法 |
|---------|---------|
| `bg-white`（无 dark 版本） | `bg-white dark:bg-slate-900` |
| `<style scoped>...</style>` | Tailwind 类名 |
| `style="color: red"` | `class="text-red-500 dark:text-red-400"` |
| 手动加 `.kivii-demo-lib-wrapper` 外层 div | 不需要，`withWrapper` 自动处理 |

### 架构

| 禁止行为 | 原因 |
|---------|------|
| 在 `src/dev/` 创建业务组件 | dev 目录不打包进 UMD |
| `import axios` / 直接 `fetch` | 会被打包进 UMD 或宿主不一定有 |
| `import lodash` / `import dayjs` 等 | 会被打包进 UMD，体积暴增 |
| 直接用 `window.kivii?.request` | 必须通过 `getBridge()` 封装 |
| 省略 `manifest` 常量 | 破坏自描述机制 |
| 省略 `defineExpose({ manifest })` | 外部工具无法读取组件元数据 |
| 只改组件文件，不更新 `src/build.ts` | manifest 与实际组件不同步 |

---

## 十一、验收检查清单

每次生成或修改组件后，逐项核对：

### 文件结构
- [ ] 文件路径：`src/build/components/ComponentName.vue`（PascalCase）
- [ ] `src/build/components/index.ts` 已添加导出
- [ ] `src/build.ts` 的 `componentsMap` 已添加
- [ ] `src/build.ts` 的 `componentsDetailed` 已添加

### 组件代码
- [ ] `<template>` 在最前，`<script setup lang="ts">` 在其后
- [ ] `import type { Manifest }` 而非 `import { Manifest }`
- [ ] `export interface Props { ... }` 存在且有 `export`
- [ ] `manifest` 常量存在，`name` 与文件名一致
- [ ] `withDefaults(defineProps<Props>(), { ... })` 包含所有 props 默认值
- [ ] `defineEmits<{ ... }>()` 使用类型声明形式（非数组形式）
- [ ] `defineExpose({ manifest })` 存在
- [ ] 无 `any` 类型

### 样式
- [ ] 所有颜色类都有 `dark:` 对应版本
- [ ] 无 `<style>` 块（特殊动画除外）
- [ ] 无内联 `style=""` 颜色属性

### 功能验证
- [ ] `pnpm type-check` 通过，无报错
- [ ] `pnpm dev` 后浏览器渲染正常
- [ ] Light 模式样式正确
- [ ] Dark 模式样式正确（给根元素加 `.dark` 类验证）
- [ ] 所有 Props 传入后响应正常
- [ ] 所有 Emits 触发后父组件能收到

---

## 十二、常见错误与修正

### 错误 1：用了数组形式的 defineEmits

```typescript
// 错误
defineEmits(['change', 'close'])

// 正确
defineEmits<{
  change: [value: string]
  close: []
}>()
```

> 纠正提示词：`"defineEmits 不能用数组形式，请改为 defineEmits<{ 事件名: [参数类型] }>()"

---

### 错误 2：忘记了 dark mode

```html
<!-- 错误 -->
<div class="bg-white text-slate-900 border border-slate-200">

<!-- 正确 -->
<div class="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700">
```

> 纠正提示词：`"所有颜色相关的 Tailwind 类都必须同时包含 dark: 版本，请补全所有缺失的 dark: 类名"`

---

### 错误 3：使用了 fetch / axios

```typescript
// 错误
const res = await fetch('/api/data')

// 正确
import { getBridge } from '@/build/utils'
const bridge = getBridge()
if (!bridge) return
const data = await bridge.request({ url: '/api/data', method: 'GET' })
```

> 纠正提示词：`"本项目不能用 fetch 或 axios，数据请求必须通过 getBridge() 工具函数"`

---

### 错误 4：只生成了组件，没有注册

> 纠正提示词：`"组件文件已生成，现在还需要：1. 在 src/build/components/index.ts 添加 export；2. 在 src/build.ts 中 import、用 withWrapper 包裹、加入 components 对象、在 manifest 的 componentsMap 和 componentsDetailed 中补充条目"`

---

### 错误 5：在 src/dev/ 下创建了组件

> 纠正提示词：`"组件必须放在 src/build/components/ 目录下，src/dev/ 目录只用于开发调试，不会被打包进 UMD 产物"`

---

### 错误 6：用值 import 导入了类型

```typescript
// 错误
import { Manifest, ComponentType } from '@/build/types'

// 正确
import type { Manifest, ComponentType } from '@/build/types'
```

> 纠正提示词：`"来自 @/build/types 的都是纯 TypeScript 类型，必须用 import type，这是 ESLint 规则强制要求的"`

---

## 十三、AI 提示词模板

### 新建通用组件

```
请在 prism-umd-template 项目中创建一个 Vue 3 UMD 组件库组件，要求如下：

【组件功能】
[描述组件的功能和用途]

【Props 设计】
[列出需要的 props，如：theme: 'light' | 'dark'，title: string 等]

【Emits 设计】
[列出需要触发的事件，如：change: [value: string]]

【UI 设计要点】
[描述 UI 布局和视觉风格]

【约束（严格遵守）】
- 文件路径：src/build/components/[ComponentName].vue（PascalCase）
- 使用 <script setup lang="ts">
- import type { Manifest } from '@/build/types'（不是 import { Manifest }）
- defineEmits 必须用类型形式：defineEmits<{ 事件名: [参数类型] }>()
- 所有颜色 Tailwind 类必须同时写 dark: 版本
- 不能用 <style> 块，全部用 Tailwind
- manifest 常量必须存在，并在 defineExpose({ manifest }) 中暴露
- Props 接口必须 export（export interface Props）

请生成：
1. 完整的 .vue 组件文件内容
2. 在 src/build/components/index.ts 中添加的导出语句
3. 在 src/build.ts manifest 中添加的 componentsMap 和 componentsDetailed 内容
```

---

### 新建 ECharts 图表组件

```
请创建一个包含 ECharts 图表的 Vue 3 组件，要求：

【图表类型】[折线图 / 柱状图 / 饼图 / 其他]
【数据说明】[描述数据结构]
【交互要求】[如：支持 resize，tooltip 等]

【严格约束】
- ECharts 通过 import * as echarts from 'echarts' 引入（构建时外部化，不打包）
- 必须在 onBeforeUnmount 中调用 chart?.dispose() 防止内存泄漏
- 必须监听容器 resize（使用 ResizeObserver 或节流后的 window resize）
- chartRef 类型为 HTMLDivElement | null
- 同上，所有 Tailwind 必须包含 dark: 版本

请生成完整组件代码及注册步骤。
```

---

### 新建数据请求组件

```
请创建一个需要调用后端数据的 Vue 3 组件，要求：

【接口信息】
- URL：[接口路径]
- 方法：[GET/POST]
- 参数：[参数列表]
- 返回格式：[数据结构]

【严格约束】
- 数据请求必须通过 getBridge() 工具函数，不能直接用 fetch 或 axios
- 调用示例：
  import { getBridge } from '@/build/utils'
  const bridge = getBridge()
  if (!bridge) return
  const data = await bridge.request({ url: '/api/xxx', method: 'GET' })
- 必须有 loading 状态和错误处理
- loading 状态需要在 UI 上有反馈（spinner 或骨架屏）

请生成完整组件代码及注册步骤。
```

---

### 修改已有组件

```
请修改 src/build/components/[ComponentName].vue，要求：

【修改内容】
[描述需要修改的内容]

【约束】
- 不能改变 Props 接口名（保持 export interface Props）
- 不能改变 manifest.name 字段
- 不能删除 defineExpose({ manifest })
- 新增 props 时同步更新 withDefaults 的默认值
- 新增 emits 时保持 defineEmits<{...}>() 类型声明形式
- 如果功能描述有变化，同步更新 manifest.description

修改完成后，如有 componentsDetailed 字段的描述需要更新，请一并给出 src/build.ts 的修改内容。
```

---

### 调试问题

```
我的组件 src/build/components/[ComponentName].vue 出现了以下问题：

【现象】
[描述问题现象，如：dark mode 样式不生效 / 事件没有触发 / 数据不更新等]

【本项目特殊约束（供参考）】
- 样式通过 .kivii-demo-lib-wrapper 作用域隔离
- dark mode 通过父元素 class="dark" 控制
- 外部依赖（echarts/bridge）由宿主提供
- 组件通过 withWrapper HOC 包裹后导出

请给出具体修复方案。
```

---

## 附录：FontAwesome 常用图标参考

| 场景 | 图标类名 |
|------|---------|
| 图表 / 统计 | `fas fa-chart-bar` / `fas fa-chart-line` / `fas fa-chart-pie` |
| 用户 | `fas fa-user` / `fas fa-users` |
| 设置 | `fas fa-cog` / `fas fa-sliders-h` |
| 警告 / 信息 | `fas fa-exclamation-triangle` / `fas fa-info-circle` |
| 成功 / 错误 | `fas fa-check-circle` / `fas fa-times-circle` |
| 文件 / 文档 | `fas fa-file-alt` / `fas fa-folder` |
| 搜索 | `fas fa-search` |
| 主题 / 调色板 | `fas fa-palette` |
| 列表 / 网格 | `fas fa-list` / `fas fa-th-large` |
| 时间 | `fas fa-clock` / `fas fa-calendar` |
| 金融 | `fas fa-dollar-sign` / `fas fa-coins` |
| 导入 / 导出 | `fas fa-download` / `fas fa-upload` |
| 刷新 / 同步 | `fas fa-sync-alt` / `fas fa-redo` |
| 编辑 / 删除 | `fas fa-edit` / `fas fa-trash-alt` |
| 展开 / 折叠 | `fas fa-chevron-down` / `fas fa-chevron-right` |
