# AI 开发使用说明书

> 适用项目：prism-umd-template
> 版本：1.1.0 · 2026-05-28
>
> **注意**：本文档中的核心规则（第 3 节）、提示词模板（第 5 节）、禁止行为（第 7 节）、验收清单（第 8 节）、常见错误（第 9 节）已整合进 `rules/CLAUDE.md`，作为所有 AI 工具的统一规范。如果你在使用支持自动加载规则文件的 AI 工具（如 Claude Code），直接使用 `rules/CLAUDE.md` 即可；对于其他工具，可手动导入本文档或 `rules/CLAUDE.md`。

---

## 目录

1. [项目背景与约束](#1-项目背景与约束)
2. [Trae 项目配置](#2-trae-项目配置)
3. [Rules 规则文件（核心）](#3-rules-规则文件核心)
4. [标准开发流程](#4-标准开发流程)
5. [AI 提示词模板库](#5-ai-提示词模板库)
6. [代码模板参考](#6-代码模板参考)
7. [禁止行为清单](#7-禁止行为清单)
8. [验收检查清单](#8-验收检查清单)
9. [常见错误与修正](#9-常见错误与修正)

---

## 1. 项目背景与约束

### 1.1 这个项目是什么

这是一个 **Vue 3 UMD 组件库模板**。开发完成后，`pnpm build` 产出一个单独的 `.umd.js` 文件，可以直接用 `<script src="...">` 在任何 HTML 页面中引入，**无需打包工具**。

最终产物：`dist/kivii-component-demo-library.umd.js`  
消费方使用：`window.VueComponent.install` / `window.VueComponent.ThemeSwitchTest`

### 1.2 AI 必须理解的 3 个核心机制

**机制一：样式隔离**  
所有 Tailwind 类在构建后都会自动加上 `.kivii-demo-lib-wrapper` 前缀（`important` 配置）。同时 `withWrapper` HOC 会在每个导出组件外层自动包裹该类名的 `<div>`。  
→ AI 写组件时**不需要**手动加这个外层 div，但**必须**让每个 Tailwind 颜色类都同时写 `dark:` 版本。

**机制二：外部依赖不打包**  
`vue`、`echarts`、`@kivii.com/bridge` 三个依赖都是 `external`，消费方的宿主页面负责提供。  
→ AI 不能引入任何其他会被打包进 UMD 的第三方库（如 axios、lodash）。

**机制三：manifest 元数据**  
每个组件有两层 manifest：
- **组件级**：组件内部 `<script setup>` 中的 `manifest` 常量（自描述）
- **库级**：`src/build.ts` 中的 `manifest` 对象（供消费方读取）

两者都必须在新增组件时同步维护。

---

## 2. AI 工具配置

### 向 AI 工具导入规范文件

使用任意 AI 工具时，建议手动导入以下文件作为上下文：

| 优先级 | 文件路径 | 用途 |
|--------|------|------|
| ★★★ | `rules/CLAUDE.md` | 完整 AI 开发规范（主文件） |
| ★★★ | `src/build.ts` | 库入口，AI 理解导出结构 |
| ★★★ | `src/build/types/manifest.ts` | 类型定义，AI 知道 Manifest 格式 |
| ★★ | `tailwind.config.js` | AI 理解样式隔离配置 |
| ★ | `src/build/components/ThemeSwitchTest.vue` | 标准组件示例 |

**Claude Code 用户**：`rules/CLAUDE.md` 会通过 `@rules/CLAUDE.md` 引用自动加载，无需手动导入。

---

## 3. 规则文件（核心）

> 以下内容已整合进 `rules/CLAUDE.md`，此处保留以供参考。建议直接使用 `rules/CLAUDE.md` 作为主规范。

```markdown
# prism-umd-template AI 开发规则

## 项目性质
这是一个 Vue 3 UMD 组件库。构建产物为单个 .umd.js 文件，供纯 HTML 页面通过 <script> 标签引入。

## 强制技术栈
- Vue 3 + `<script setup lang="ts">` — 不接受 Options API
- TypeScript 严格模式 — 不允许 `any` 类型
- Tailwind CSS v3 — 不写 <style> 块，不写内联 style=""（除非布局必需）
- FontAwesome 图标类名 — `fas fa-xxx` 格式

## 目录约定（绝对不能违反）
- 新组件必须放在：`src/build/components/ComponentName.vue`
- 组件统一导出文件：`src/build/components/index.ts`
- 库入口（注册+manifest）：`src/build.ts`
- 类型定义：`src/build/types/`
- 工具函数：`src/build/utils/index.ts`
- 组合函数：`src/build/composables/index.ts`
- `src/dev/` 目录只放开发调试文件，不会被打包

## Vue 组件必须遵守的规则

### SFC 顺序（固定）
1. <template>
2. <script setup lang="ts">
3. <style>（几乎不用）

### script 内部顺序（固定）
1. import 语句（vue → 类型 → 本地）
2. export interface Props { ... }（必须 export）
3. manifest 常量定义
4. withDefaults(defineProps<Props>(), { ... })
5. defineEmits<{ 事件名: [参数类型] }>()（必须是类型声明形式，不能用数组）
6. 响应式状态和计算属性
7. defineExpose({ manifest })

### 类型 import 规则
- 所有仅用于类型的 import 必须用 `import type`
- ✅ `import type { Manifest } from '@/build/types'`
- ❌ `import { Manifest } from '@/build/types'`

## Tailwind 样式规则

### Dark Mode（强制）
每个颜色相关的类都必须同时写 light 和 dark 版本：
- ✅ `bg-white dark:bg-slate-900`
- ✅ `text-slate-800 dark:text-slate-100`
- ❌ `bg-white`（缺少 dark 版本）

### 标准色板（参考）
| 场景 | Light | Dark |
|------|-------|------|
| 页面背景 | bg-white | dark:bg-slate-900 |
| 卡片背景 | bg-slate-50 | dark:bg-slate-800 |
| 主文本 | text-slate-900 | dark:text-white |
| 次要文本 | text-slate-500 | dark:text-slate-400 |
| 边框 | border-slate-200 | dark:border-slate-700 |

## 新增组件三步骤（缺一不可）
1. 创建 `src/build/components/NewComponent.vue`
2. 在 `src/build/components/index.ts` 添加 export
3. 在 `src/build.ts` 的 manifest 中添加 componentsMap 和 componentsDetailed 条目

## 禁止事项
- 禁止使用 `any` 类型
- 禁止用 `axios`、`fetch`（数据请求用 `window.kivii.request`）
- 禁止引入会被打包进 UMD 的第三方库（除 vue/echarts/bridge）
- 禁止用 `import` 代替 `import type` 导入纯类型
- 禁止用数组形式 `defineEmits(['xxx'])`，必须用类型形式
- 禁止在 `src/dev/` 下创建业务组件
- 禁止写 `<style scoped>` 块（特殊动画除外）
- 禁止省略 manifest 定义

## 外部依赖使用方式
- Vue：正常 import，构建时自动外部化
- ECharts：`import * as echarts from 'echarts'`，构建时外部化
- Bridge：通过 `getBridge()` 工具函数访问，不直接用 window.kivii
```

---

## 4. 标准开发流程

### 4.1 新增一个业务组件（完整流程）

```
需求确认 → AI 生成组件 → 检查 → 注册导出 → 开发环境验证 → 构建验证
```

**Step 1：用规范提示词让 AI 生成组件**

使用第 5 节的「组件生成提示词模板」，填入具体需求后发给 AI。

**Step 2：检查 AI 输出**

对照第 8 节「验收检查清单」逐项核对，重点检查：
- `import type` 是否正确
- `defineEmits` 是否为类型形式
- dark mode 类名是否完整
- manifest 常量是否存在

**Step 3：注册到导出系统**

告诉 AI：
> "组件代码已经没问题了，现在帮我完成注册步骤：  
> 1. 在 `src/build/components/index.ts` 添加导出  
> 2. 在 `src/build.ts` 的 manifest 中补充该组件的 componentsMap 和 componentsDetailed"

**Step 4：开发环境验证**

```bash
pnpm dev
```
在浏览器中查看组件渲染效果，手动验证 light / dark 两种模式。

**Step 5：类型检查与构建**

```bash
pnpm type-check   # 通过后再 build
pnpm build
```

### 4.2 修改已有组件

直接告诉 AI 修改内容，但提醒它：
- 不能改变 Props 接口名（`Props`）
- 不能改变 manifest 的 `name` 字段
- 不能删除 `defineExpose({ manifest })`
- 修改后同步更新 `src/build.ts` 的 manifest 描述字段

---

## 5. AI 提示词模板库

### 5.1 通用新建组件提示词

```
请在 prism-umd-template 项目中创建一个 Vue 3 UMD 组件库组件，要求如下：

【组件功能】
[在这里描述组件的功能和用途]

【Props 设计】
[列出需要的 props，如：theme: 'light' | 'dark'，title: string 等]

【Emits 设计】
[列出需要触发的事件，如：change: [value: string]]

【UI 设计要点】
[描述 UI 布局和视觉风格，如：卡片式布局、有标题区和内容区等]

【约束（请严格遵守）】
- 文件路径：src/build/components/[ComponentName].vue
- 使用 <script setup lang="ts">
- 类型：import type { Manifest } from '@/build/types'（不是 import { Manifest }）
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

### 5.2 ECharts 图表组件提示词

```
请创建一个包含 ECharts 图表的 Vue 3 组件，要求：

【图表类型】[折线图 / 柱状图 / 饼图 / 其他]
【数据说明】[描述数据结构]
【交互要求】[如：支持 resize，tooltip 等]

【严格约束】
- ECharts 通过 import * as echarts from 'echarts' 引入（构建时外部化，不会打包）
- 必须在 onBeforeUnmount 中调用 chart?.dispose() 防止内存泄漏
- 必须监听父容器 resize，使用 ResizeObserver 或 window.addEventListener
- chartRef 类型为 HTMLDivElement | null
- 宿主环境通过 CDN 提供 window.echarts，本组件无需关心
- 同上，所有 Tailwind 必须包含 dark: 版本

请生成完整组件代码及注册步骤。
```

---

### 5.3 数据请求组件提示词

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
- 错误时显示友好提示而不是白屏

请生成完整组件代码及注册步骤。
```

---

### 5.4 修改现有组件提示词

```
请修改 src/build/components/[ComponentName].vue，要求：

【当前问题/需求】
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

### 5.5 组件调试提示词

```
我的组件 src/build/components/[ComponentName].vue 出现了以下问题：

【现象】
[描述问题现象，如：dark mode 样式不生效 / 事件没有触发 / 数据不更新等]

【已确认的上下文】
- pnpm dev 已启动
- [其他你确认过的信息]

请帮我诊断原因，注意本项目的以下特殊约束：
- 样式通过 .kivii-demo-lib-wrapper 作用域隔离
- dark mode 通过父元素 class="dark" 控制
- 外部依赖（echarts/bridge）由宿主提供
- 组件通过 withWrapper HOC 包裹后导出

请给出具体修复方案。
```

---

## 6. 代码模板参考

### 6.1 标准组件模板（直接可用）

```vue
<template>
  <div :class="{ dark: isDark }" class="w-full">
    <div class="bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-6 rounded-lg border border-slate-200 dark:border-slate-700">
      <!-- 标题区 -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold flex items-center gap-2">
          <i class="fas fa-cube text-indigo-500"></i>
          <span>{{ title }}</span>
        </h2>
      </div>

      <!-- 内容区 -->
      <div class="space-y-4">
        <slot />
      </div>

      <!-- 操作区 -->
      <div class="flex justify-end mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
        <button
          @click="$emit('confirm')"
          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          确认
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Manifest } from '@/build/types'

export interface Props {
  title?: string
  theme?: 'light' | 'dark'
}

const manifest: Manifest = {
  name: 'MyComponent',
  type: 'component',
  description: '组件功能的简要描述',
  version: '1.0.0',
  author: 'Developer',
}

const props = withDefaults(defineProps<Props>(), {
  title: '标题',
  theme: 'light',
})

defineEmits<{
  confirm: []
}>()

const isDark = computed(() => props.theme === 'dark')

defineExpose({ manifest })
</script>
```

### 6.2 ECharts 组件模板

```vue
<template>
  <div class="w-full bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
    <h3 class="text-base font-semibold text-slate-800 dark:text-slate-100 mb-3">{{ title }}</h3>
    <div ref="chartRef" class="w-full h-64"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import * as echarts from 'echarts'
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

watch(() => props.data, () => {
  chart?.setOption({ series: [{ data: props.data }] })
})

watch(() => props.theme, () => {
  chart?.dispose()
  initChart()
})

onMounted(initChart)
onBeforeUnmount(() => { chart?.dispose() })

defineExpose({ manifest })
</script>
```

### 6.3 注册到 index.ts 的格式

```typescript
// src/build/components/index.ts
import ThemeSwitchTest from "./ThemeSwitchTest.vue";
import MyComponent from "./MyComponent.vue";    // ← 新增

export { ThemeSwitchTest, MyComponent };        // ← 新增到 export
```

### 6.4 注册到 build.ts 的格式

```typescript
// src/build.ts — 相关片段

import { ThemeSwitchTest as _ThemeSwitchTest, MyComponent as _MyComponent } from "@/build/components";

const ThemeSwitchTest = withWrapper(_ThemeSwitchTest);
const MyComponent = withWrapper(_MyComponent);             // ← 新增

const components = {
  ThemeSwitchTest,
  MyComponent,                                             // ← 新增
};

export const manifest: LibraryManifest = {
  // ...其他字段
  components: Object.keys(components),
  componentsMap: {
    ThemeSwitchTest: "主题切换测试组件",
    MyComponent: "我的新组件的简短描述",                   // ← 新增
  },
  componentsDetailed: [
    { name: "ThemeSwitchTest", zhName: "主题测试", icon: "fas fa-palette", description: "..." },
    { name: "MyComponent", zhName: "中文名称", icon: "fas fa-cube", description: "详细描述" },  // ← 新增
  ],
};
```

---

## 7. 禁止行为清单

> 发现 AI 有以下行为时，立即打断并纠正。

### 7.1 TypeScript 禁止

| 禁止写法 | 正确写法 |
|------|------|
| `component: any` | `component: WrappableComponent` |
| `import { Manifest }` | `import type { Manifest }` |
| `defineEmits(['change'])` | `defineEmits<{ change: [val: string] }>()` |
| `const x: string \| any` | 使用具体类型 |
| 省略 Props 接口的 `export` | `export interface Props { ... }` |

### 7.2 样式禁止

| 禁止写法 | 正确写法 |
|------|------|
| `bg-white`（没有 dark 版本） | `bg-white dark:bg-slate-900` |
| `<style scoped>` 块 | Tailwind 类名 |
| `style="color: red"` | `class="text-red-500 dark:text-red-400"` |
| 手动加 `.kivii-demo-lib-wrapper` 外层 div | 不需要，withWrapper 自动处理 |

### 7.3 架构禁止

| 禁止行为 | 原因 |
|------|------|
| 在 `src/dev/` 创建业务组件 | dev 目录不打包 |
| import axios / fetch 发请求 | 宿主不一定有，用 getBridge() |
| import lodash / dayjs 等工具库 | 会被打包进 UMD，体积暴增 |
| 省略 manifest 常量 | 破坏自描述机制 |
| 省略 `defineExpose({ manifest })` | 外部工具无法读取组件元数据 |
| 只改组件文件，不更新 build.ts | manifest 与实际组件不同步 |

---

## 8. 验收检查清单

每次 AI 生成/修改组件后，对照此清单逐项确认：

### 8.1 文件结构

- [ ] 文件路径：`src/build/components/ComponentName.vue`（PascalCase）
- [ ] `src/build/components/index.ts` 已添加导出
- [ ] `src/build.ts` 的 `componentsMap` 已添加
- [ ] `src/build.ts` 的 `componentsDetailed` 已添加

### 8.2 组件代码

- [ ] `<template>` 在最前，`<script>` 在其后
- [ ] 使用 `<script setup lang="ts">`
- [ ] `import type { Manifest }` 而非 `import { Manifest }`
- [ ] `export interface Props { ... }` 存在且有 `export`
- [ ] `manifest` 常量存在，name 与文件名一致
- [ ] `withDefaults(defineProps<Props>(), { ... })` 包含所有 props 的默认值
- [ ] `defineEmits<{ ... }>()` 使用类型声明形式
- [ ] `defineExpose({ manifest })` 存在
- [ ] 无 `any` 类型
- [ ] 无数组形式 `defineEmits([...])`

### 8.3 样式

- [ ] 所有颜色类都有 `dark:` 对应版本
- [ ] 无 `<style>` 块（有特殊原因除外）
- [ ] 无内联 `style=""` 颜色属性
- [ ] 响应式布局已考虑（`sm:` / `md:` 断点）

### 8.4 功能验证

- [ ] `pnpm type-check` 通过，无报错
- [ ] `pnpm dev` 后浏览器渲染正常
- [ ] Light 模式样式正确
- [ ] Dark 模式样式正确（手动给根元素加 `.dark` 类验证）
- [ ] 所有 Props 传入后响应正常
- [ ] 所有 Emits 触发后父组件能收到

---

## 9. 常见错误与修正

### 错误 1：AI 用了数组形式的 defineEmits

**AI 生成的（错误）：**
```typescript
defineEmits(['change', 'close'])
```

**正确写法：**
```typescript
defineEmits<{
  change: [value: string]
  close: []
}>()
```

**纠正提示词：**
> "defineEmits 不能用数组形式，请改为类型声明形式，使用 `defineEmits<{ 事件名: [参数类型] }>()`"

---

### 错误 2：AI 忘记了 dark mode

**AI 生成的（错误）：**
```html
<div class="bg-white text-slate-900 border border-slate-200">
```

**正确写法：**
```html
<div class="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700">
```

**纠正提示词：**
> "所有颜色相关的 Tailwind 类都必须同时包含 dark: 版本，请补全所有缺失的 dark: 类名"

---

### 错误 3：AI 使用了 fetch/axios

**AI 生成的（错误）：**
```typescript
const res = await fetch('/api/data')
const data = await res.json()
```

**正确写法：**
```typescript
import { getBridge } from '@/build/utils'

const bridge = getBridge()
if (!bridge) return
const data = await bridge.request({ url: '/api/data', method: 'GET' })
```

**纠正提示词：**
> "本项目不能用 fetch 或 axios，数据请求必须通过 `getBridge()` 工具函数，这是宿主环境注入的 Bridge API"

---

### 错误 4：AI 只生成了组件，没有注册

**纠正提示词：**
> "组件文件已生成，现在还需要完成注册：
> 1. 在 `src/build/components/index.ts` 添加 export
> 2. 在 `src/build.ts` 中：import 新组件、用 withWrapper 包裹、加入 components 对象、在 manifest 的 componentsMap 和 componentsDetailed 中补充条目
> 请给出这两个文件的修改内容"

---

### 错误 5：AI 在 src/dev/ 下创建了组件

**纠正提示词：**
> "组件必须放在 `src/build/components/` 目录下，`src/dev/` 目录只用于开发调试，不会被打包进 UMD 产物"

---

### 错误 6：AI 用了值 import 导入类型

**AI 生成的（错误）：**
```typescript
import { Manifest, ComponentType } from '@/build/types'
```

**正确写法：**
```typescript
import type { Manifest, ComponentType } from '@/build/types'
```

**纠正提示词：**
> "Manifest 和所有来自 @/build/types 的都是纯 TypeScript 类型，必须用 `import type` 而非普通 import，这是项目 ESLint 规则强制要求的"

---

## 附录 A：FontAwesome 常用图标参考

| 场景 | 图标类名 |
|------|------|
| 图表 / 统计 | `fas fa-chart-bar` / `fas fa-chart-line` |
| 用户 | `fas fa-user` / `fas fa-users` |
| 设置 | `fas fa-cog` / `fas fa-sliders-h` |
| 警告 / 信息 | `fas fa-exclamation-triangle` / `fas fa-info-circle` |
| 成功 / 错误 | `fas fa-check-circle` / `fas fa-times-circle` |
| 文件 / 文档 | `fas fa-file-alt` / `fas fa-folder` |
| 搜索 | `fas fa-search` |
| 主题 / 调色板 | `fas fa-palette` |
| 列表 | `fas fa-list` / `fas fa-th-large` |
| 时间 | `fas fa-clock` / `fas fa-calendar` |
| 金融 | `fas fa-dollar-sign` / `fas fa-coins` |
| 导出 | `fas fa-download` / `fas fa-upload` |

---

## 附录 B：快速命令速查

```bash
pnpm dev          # 启动开发服务器（查看组件效果）
pnpm type-check   # TypeScript 类型检查（提交前必跑）
pnpm build        # 构建 UMD 产物到 dist/
pnpm test         # 运行单元测试
pnpm lint         # ESLint 检查
pnpm lint:fix     # ESLint 自动修复
pnpm format       # Prettier 格式化
```

---

## 附录 C：产物文件说明

构建后 `dist/` 目录：

```
dist/
└── kivii-component-demo-library.umd.js   # 唯一产物，CSS 已内联
```

消费方 HTML 使用方式：
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<!-- 如需图表：<script src="https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js"></script> -->

<script src="./dist/kivii-component-demo-library.umd.js"></script>
<script>
  const { createApp, ref } = Vue
  const { install } = window.VueComponent
  const app = createApp({ /* ... */ })
  app.use(install)
  app.mount('#app')
</script>
```
