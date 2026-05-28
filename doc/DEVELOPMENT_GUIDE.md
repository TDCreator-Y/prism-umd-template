# 开发指南 (Development Guide)

本指南旨在帮助开发者快速上手项目，涵盖组件开发、主题配置、打包构建、导出配置以及插件系统的详细说明。

## 1. 项目概览

本项目是一个基于 Vue 3 + TypeScript + Vite + Tailwind CSS 的组件库开发模板。项目支持以 UMD 格式构建，并将样式内联到 JavaScript 文件中，便于在非构建环境（如纯 HTML 页面）中直接引用。

### 目录结构

```
├── plugins/                # 本地 Vite 插件
│   └── vite-plugin-inline-css.ts
├── src/
│   ├── build/              # 组件库构建源码
│   │   ├── components/     # 组件源码目录
│   │   ├── types/          # 类型定义
│   │   └── build.ts        # 库入口文件
│   ├── dev/                # 开发环境源码（用于测试组件）
│   └── uiHtml/             # 静态 HTML 演示文件
├── build.ts                # 构建脚本
├── vite.config.ts          # Vite 配置文件
├── tailwind.config.js      # Tailwind CSS 配置文件
└── package.json            # 项目依赖与脚本
```

## 2. 快速开始

### 安装依赖

```bash
pnpm install
# or
npm install
```

### 启动开发环境

```bash
pnpm dev
```

### 构建组件库

```bash
pnpm build
```

---

## 3. 组件开发

### 3.1 创建组件

在 `src/build/components` 目录下创建新的组件目录或文件。

**示例：创建 `MyComponent`**

1.  新建文件 `src/build/components/MyComponent.vue`：

```vue
<template>
	<div class="p-4 bg-white dark:bg-slate-800 rounded shadow">
		<h2 class="text-xl font-bold text-slate-900 dark:text-white">
			{{ title }}
		</h2>
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
import { withDefaults } from 'vue'

export interface Props {
	title?: string
}

const props = withDefaults(defineProps<Props>(), {
	title: '默认标题',
})
</script>
```

### 3.2 组件导出

所有组件需要在 `src/build/components/index.ts` 中统一导出，以便在库入口中引用。

编辑 `src/build/components/index.ts`：

```typescript
import MyComponent from './MyComponent.vue'

// ... 其他组件导入

export {
	// ... 其他组件
	MyComponent,
}
```

### 3.3 类型定义与 Manifest

为了完善组件库的元数据，建议在 `src/build.ts` 中更新 `manifest` 对象，添加新组件的描述信息。

```typescript
// src/build.ts

export const manifest = {
	// ...
	componentsMap: {
		// ...
		MyComponent: '这是一个示例组件',
	},
	componentsDetailed: [
		// ...
		{
			name: 'MyComponent',
			zhName: '示例组件',
			icon: 'fas fa-cube',
			description: '这是一个示例组件',
		},
	],
}
```

---

## 4. 组件主题配置

本项目使用 Tailwind CSS 进行样式管理，并支持深色模式（Dark Mode）。

### 4.1 Tailwind 配置

Tailwind 配置文件位于 `tailwind.config.js`。

- **DarkMode**: 配置为 `class` 模式。这意味着通过在父元素（通常是组件根元素或 `html` 标签）添加 `.dark` 类来激活深色模式。
- **Preflight**: `corePlugins.preflight` 设置为 `false`。这是为了避免 Tailwind 的基础样式重置（Preflight）污染宿主环境的样式。

### 4.2 开发支持主题的组件

在编写组件时，应同时定义浅色和深色模式下的样式。

**示例：**

```html
<!-- text-slate-900 (浅色) / dark:text-white (深色) -->
<!-- bg-white (浅色) / dark:bg-slate-800 (深色) -->
<div class="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
	Content
</div>
```

### 4.3 主题切换机制

组件库通常是被动接收主题状态。推荐的做法是通过 `props` 接收主题设置，或者让宿主应用控制容器的 `class="dark"`。

参考 `src/build/components/ThemeSwitchTest.vue` 的实现，它通过 `props.theme` 来动态绑定 `.dark` 类。

---

## 5. 打包相关配置

打包配置位于 `vite.config.ts`，主要目标是生成一个包含所有逻辑和样式的 UMD 文件。

### 5.1 输出配置

- **格式**: `umd`
- **文件名**: `kivii-component-demo-library.umd.js`
- **全局变量**: `VueComponent` (在浏览器中通过 `window.VueComponent` 访问)

### 5.2 外部依赖

为了减小包体积，`vue` 被设置为外部依赖（external）。这意味着使用该组件库的项目必须在全局环境中提供 `Vue`。

```typescript
rollupOptions: {
  external: ["vue"],
  output: {
    globals: {
      vue: "Vue",
    },
  },
},
```

### 5.3 样式处理

项目使用 `vite-plugin-css-injected-by-js` 插件将 CSS 自动注入到 JavaScript 中。

- **原理**: 构建时，CSS 会被转换成 JS 字符串，并包含一段代码在运行时自动创建 `<style>` 标签插入到 `<head>` 中。
- **优势**: 用户只需引入一个 JS 文件即可使用组件库，无需单独引入 CSS 文件。

---

## 6. 组件导出相关配置

库的入口文件是 `src/build.ts`。

### 6.1 全局安装 vs 按需引入

入口文件同时支持两种使用方式：

1.  **全局安装 (Vue.use)**:
    提供了 `install` 方法，会遍历注册所有组件。

    ```typescript
    const install = (app: App) => {
    	Object.keys(components).forEach((key) => {
    		app.component(key, components[key])
    	})
    }
    ```

2.  **按需引入**:
    直接导出了所有组件对象。

    ```typescript
    import { KvcCard } from 'your-library-path'
    ```

---

## 7. 插件介绍

### 7.1 构建插件

#### `vite-plugin-css-injected-by-js` (当前使用)

这是目前 `vite.config.ts` 中配置的插件。它负责在构建过程中提取 CSS 并将其注入到生成的 JS 文件中。

#### `plugins/vite-plugin-inline-css.ts` (本地插件)

项目目录 `plugins/` 下包含一个自定义插件 `inlineCss`。这是一个备选方案或参考实现，其功能与 `vite-plugin-css-injected-by-js` 类似，但提供了更底层的控制（如手动读取 CSS 文件并拼接字符串）。

**如果需要切换到本地插件：**

1.  修改 `vite.config.ts`：

    ```typescript
    // import cssInjectedByJs from "vite-plugin-css-injected-by-js";
    import { inlineCss } from './plugins/vite-plugin-inline-css'

    export default defineConfig({
    	plugins: [vue(), inlineCss()], // 替换 cssInjectedByJs()
    	// ...
    })
    ```

---

## 8. 配置文件详解 (Configuration Details)

### 8.1 库入口配置 (`src/build.ts`)

`src/build.ts` 是组件库构建的核心入口文件，它负责聚合所有组件、定义安装逻辑以及导出库的元数据（Manifest）。

#### 8.1.1 核心导出

- **样式引入**: `import "./style.css";` 确保 Tailwind CSS 样式被包含在构建中。
- **组件导出**:
    - `export { ComponentName }`: 支持具名导入（Named Import），如 `import { KvcCard } from 'lib'`。
    - `export type { Props }`: 导出组件 Props 类型，为使用 TypeScript 的宿主项目提供类型提示。

#### 8.1.2 安装函数 (`install`)

```typescript
const install = (app: App) => {
	Object.keys(components).forEach((key) => {
		// 自动注册所有组件
		app.component(key, components[key])
	})
}
```

这是 Vue 插件的标准安装方法。当使用 `app.use(Lib)` 时，Vue 会调用此函数，将库中所有组件注册为全局组件。

#### 8.1.3 库元数据 (`manifest`)

`export const manifest` 定义了整个组件库的描述信息，这对于构建文档网站、低代码平台集成或动态加载非常有用。

| 字段                 | 类型                     | 说明                           | 示例                             |
| :------------------- | :----------------------- | :----------------------------- | :------------------------------- |
| `libName`            | `string`                 | 库的内部名称                   | `"VueComponent"`                 |
| `format`             | `string`                 | 构建格式                       | `"umd"`                          |
| `fileName`           | `string`                 | 输出文件名                     | `"library.umd.js"`               |
| `zhName`             | `string`                 | 库的中文名称                   | `"组件库 UMD 包"`                |
| `author`             | `string`                 | 作者/团队                      | `"Kivii Team"`                   |
| `version`            | `string`                 | 版本号                         | `"1.0.0"`                        |
| `description`        | `string`                 | 库的简要描述                   | `"..."`                          |
| `components`         | `string[]`               | 包含的所有组件键名列表         | `['ThemeSwitchTest', ...]`       |
| `componentsMap`      | `Record<string, string>` | 组件键名到描述的简单映射       | `{ ThemeSwitchTest: "描述..." }` |
| `componentsDetailed` | `object[]`               | 组件的详细元数据数组（见下表） | `[{ name: "...", ... }]`         |

**componentsDetailed 结构详解:**

此数组用于描述每个组件的 UI 呈现信息，常用于在组件选择器或文档中展示。

| 字段          | 说明                                    |
| :------------ | :-------------------------------------- |
| `name`        | 组件的唯一标识符（英文 Key）            |
| `zhName`      | 组件的中文显示名称                      |
| `icon`        | 组件的图标（通常使用 FontAwesome 类名） |
| `description` | 组件的详细功能描述                      |

### 8.2 组件内部 Manifest (`Component Manifest`)

除了库级别的 Manifest，每个组件内部也可以定义自己的 Manifest，用于自描述。这通常定义在组件的 `<script setup>` 中。

**接口定义 (`src/build/types/manifest.ts`):**

```typescript
export interface Manifest {
	name: string // 组件名称
	type: string // 类型（如 'component', 'module'）
	description: string // 组件描述
	version: string // 组件版本
	author: string // 组件作者
}
```

**使用示例:**

```typescript
const manifest: Manifest = {
	name: 'ThemeSwitchTest',
	type: 'component',
	description: 'Test module for verifying theme switching...',
	version: '1.0.0',
	author: 'Developer',
}
```

**作用:**

1.  **自文档化**: 开发者可以直接在代码中了解组件的基本信息。
2.  **元数据提取**: 虽然目前构建流程可能未自动提取此信息，但它可以作为未来自动化工具（如自动生成文档、自动同步到库 Manifest）的数据源。
3.  **运行时访问**: 如果组件将其暴露（例如通过 `defineExpose`），父组件可以在运行时获取子组件的元数据。

---

## 9. 样式隔离方案 (Style Isolation)

为了确保组件库的样式既不污染宿主环境，也不被宿主环境覆盖，采用 Tailwind 的作用域限制与 Vue 高阶组件（HOC）包裹的组合方案。

- 原理概述
    - 编译期在 Tailwind 中设置 `important`，限定生成的类名都挂在唯一作用域 `.kivii-demo-lib-wrapper` 下，并提升权重。
    - 运行期通过高阶组件统一为所有导出组件包裹一层带该类名的容器 div。
    - 宿主未添加该类名时不会被污染；宿主普通样式也难以覆盖库内样式。

### 9.1 Tailwind 作用域配置

文件: [tailwind.config.js](file:///Users/_suesusan/Downloads/kivii-component-template-main/tailwind.config.js)

```javascript
/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	important: '.kivii-demo-lib-wrapper',
	corePlugins: {
		preflight: false,
	},
	darkMode: 'class',
	theme: { extend: {} },
	plugins: [],
}
```

关键点

- `important` 值必须与运行期包裹的类名保持一致
- 关闭 `preflight`，避免全局重置样式污染宿主

### 9.2 高阶组件包裹 (HOC)

文件: [build.ts](file:///Users/_suesusan/Downloads/kivii-component-template-main/src/build.ts)

```ts
import { h, defineComponent } from 'vue'
import { ThemeSwitchTest as _ThemeSwitchTest } from '@/build/components'

const withWrapper = (component: any) =>
	defineComponent({
		name: component.name || 'WrappedComponent',
		inheritAttrs: false,
		props: component.props || {},
		emits: component.emits || [],
		setup(props, { attrs, slots }) {
			return () =>
				h(
					'div',
					{
						class: 'kivii-demo-lib-wrapper',
						style: 'width:100%;height:100%;',
					},
					[h(component, { ...props, ...attrs }, slots)],
				)
		},
	})

const ThemeSwitchTest = withWrapper(_ThemeSwitchTest)
export { ThemeSwitchTest }
```

### 9.3 使用与注意事项

- 宿主无需任何特殊配置，隔离自动生效
- 如需修改隔离标识，需同时修改：
    - `tailwind.config.js` 的 `important` 值
    - `src/build.ts` 中包裹容器的 `class`
- 推荐在开发时通过 `pnpm type-check` 与 `pnpm build` 验证修改是否正确生效
