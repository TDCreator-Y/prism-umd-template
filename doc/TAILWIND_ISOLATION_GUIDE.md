# Tailwind CSS 样式隔离方案指南

在开发基于 Tailwind CSS 的 Vue 3 组件库（打包为 UMD 格式）时，如何确保组件库的样式**既不污染宿主环境，也不被宿主环境的全局样式覆盖**是一个核心痛点。

本模板采用了一套**基于 `important` 作用域与 Vue 高阶组件（HOC）结合**的自动化隔离方案，实现了对开发者和宿主环境双向透明的完美隔离。

---

## 隔离方案核心思路

1. **编译期限制**：通过配置 Tailwind 的 `important` 属性，强制让所有生成的工具类（Utility Classes）带上一个唯一的前缀选择器（如 `.kivii-demo-lib-wrapper`），并附带 `!important`。
2. **运行期包裹**：利用 Vue 的高阶组件技术，在组件库统一导出时，自动在每个顶层组件的最外层包裹一层带有上述唯一类名的 `<div>`。

这确保了：

- **向外隔离**：组件库打包出的 CSS 类似于 `.kivii-demo-lib-wrapper .flex { ... }`，宿主环境如果不加这个 Wrapper 类，绝不会被污染。
- **向内隔离**：由于所有的样式都带上了更具体的作用域以及 `!important` 权重，宿主环境普通的 CSS 无法轻易覆盖组件库的内部样式。

---

## 具体实现步骤

### 第一步：配置 Tailwind CSS 的作用域

在 `tailwind.config.js` 中，添加 `important` 配置。请注意，这里的值应该是一个**能够唯一标识当前组件库的类名**，以防止多个不同的组件库在同一宿主环境下发生样式冲突。

**⚠️ 关键提醒：这里的 `important` 类名，必须与第二步 `build.ts` 中 `withWrapper` 绑定的 `class` 完全一致！如果要修改标识，必须两处同时修改。**

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
	// 👈 使用唯一的 class 限制样式作用域，实现样式隔离。
	// 建议命名规范：.[项目或公司名]-[组件库名]-wrapper
	important: '.kivii-demo-lib-wrapper',
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	corePlugins: {
		// 强烈建议关闭 preflight，避免打包进去的全局重置样式污染宿主
		preflight: false,
	},
	// ... 其他配置
}
```

### 第二步：编写高阶组件 (HOC) 自动包裹器

为了做到对组件开发者“零侵入”，不需要在每一个 `.vue` 文件的 `<template>` 中手动添加外层 `div`，我们在统一打包的入口文件中（如 `src/build.ts`）编写一个高阶组件：

```typescript
// src/build.ts
import { h, defineComponent } from 'vue'

/**
 * 创建高阶组件，自动在最外层包裹用于 Tailwind 样式隔离的 div
 *
 * 关键点说明：
 * 1. inheritAttrs: false 配合 h(component, { ...props, ...attrs }, slots)
 *    确保宿主环境传递的所有 Props、Events 和 Slots 都能无损穿透给真实的内部组件。
 * 2. 提取 component.props 和 component.emits
 *    在 Vue 3 setup 语法糖中，必须显式声明 props 和 emits，否则会导致参数丢失。
 */
const withWrapper = (component: any) => {
	return defineComponent({
		name: component.name || component.__name || 'WrappedComponent',
		inheritAttrs: false, // 禁止默认透传
		props: component.props || {}, // 继承真实组件的 props
		emits: component.emits || [], // 继承真实组件的 emits
		setup(props, { attrs, slots }) {
			return () =>
				// 这里的 class 必须与 tailwind.config.js 中的 important 配置完全一致
				h(
					'div',
					{
						class: 'kivii-demo-lib-wrapper',
						style: 'width: 100%; height: 100%;',
					},
					[h(component, { ...props, ...attrs }, slots)],
				)
		},
	})
}
```

### 第三步：统一导出组件

在对外导出组件前，统一使用 `withWrapper` 进行包装。开发者在开发具体的 `.vue` 组件时，完全不需要关心样式隔离的逻辑，只需正常编写 Tailwind 类名即可。

```typescript
// src/build.ts
import {
	ProductClassification as _ProductClassification,
	RiskEvaluation as _RiskEvaluation,
} from '@/build/components'

// 包装组件
const ProductClassification = withWrapper(_ProductClassification)
const RiskEvaluation = withWrapper(_RiskEvaluation)

// 导出组件
export { ProductClassification, RiskEvaluation }

// 如果需要支持 app.use() 全局注册
const components = {
	ProductClassification,
	RiskEvaluation,
}

export const install = (app: App) => {
	Object.keys(components).forEach((key) => {
		app.component(key, components[key as keyof typeof components])
	})
}
```

---

## 常见问题与注意事项

### 1. 多个组件库共存怎么办？

如果同一个宿主环境引入了多个由本模板构建的 UMD 组件库，**必须确保每个组件库在 `tailwind.config.js` 中配置的 `important` 类名是全局唯一的**（例如 `.lib-a-wrapper` 和 `.lib-b-wrapper`），否则它们生成的 CSS 会互相覆盖导致样式错乱。

**如何修改 UMD 的隔离标识？**
如果您基于此模板开发了一个新的 UMD 组件库，只需要修改**两处**代码即可完成新库的隔离配置：

1. 修改 `tailwind.config.js` 中的 `important: '.your-new-lib-wrapper'`。
2. 修改 `src/build.ts` 中 `withWrapper` 渲染的 `class: 'your-new-lib-wrapper'`。
   （注意：这两处的值必须完全匹配，并且带前导点 `.` 和不带点 `.` 的区别要分清）。

### 2. 组件的主题色能被宿主环境覆盖吗？

**默认不能。** 因为打包时 Tailwind 会将配置的颜色编译成硬编码的 Hex/RGB 值（静态编译）。
如果需要让组件库能够响应宿主环境的动态主题，请在组件库的 `tailwind.config.js` 中将颜色值配置为 CSS 变量（CSS Variables），然后在宿主环境的 `:root` 中注入对应的变量值。

### 3. 宿主环境需要做任何特殊配置吗？

**完全不需要。** 这套方案对宿主环境是100%透明的。宿主环境只需正常引入生成的 `.umd.js` 并在模板中使用 `<product-classification />` 标签即可，外层的 `div` 包裹会在运行时自动生成。

---

_本文档为 Kivii 组件库开发模板标准规范，开发者请务必遵循。_
