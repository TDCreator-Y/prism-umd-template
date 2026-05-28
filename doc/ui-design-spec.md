# Kivii Dashboard — UI 设计规范文档

> 版本：v1.0 · 日期：2026-03-10
> 技术栈：Vue 3 · Tailwind CSS 3.4 · CSS Variables · FontAwesome 6

---

## 目录

1. [设计原则](#1-设计原则)
2. [色彩系统](#2-色彩系统)
3. [圆角规范](#3-圆角规范)
4. [间距规范](#4-间距规范)
5. [排版规范](#5-排版规范)
6. [布局规范](#6-布局规范)
7. [卡片样式](#7-卡片样式)
8. [表格样式](#8-表格样式)
9. [按钮样式](#9-按钮样式)
10. [输入框样式](#10-输入框样式)
11. [下拉框样式](#11-下拉框样式)
12. [动效规范](#12-动效规范)
13. [图标规范](#13-图标规范)
14. [暗色模式适配](#14-暗色模式适配)

---

## 1. 设计原则

| 原则         | 说明                                                  |
| ------------ | ----------------------------------------------------- |
| **简洁优先** | 避免过度装饰，信息层次清晰，大量留白                  |
| **一致性**   | 相同类型的元素使用统一的间距、圆角、色彩              |
| **动态主题** | 所有交互色通过 CSS 变量驱动，支持 8 种预设 + 自定义色 |
| **双模式**   | 每个组件都必须同时适配亮色 / 暗色模式                 |
| **响应式**   | 移动端首先考虑折叠布局，断点遵循 Tailwind 标准        |

---

## 2. 色彩系统

### 2.1 主题色（CSS 变量）

所有交互色、强调色通过以下 CSS 变量驱动，**禁止**在组件中硬编码具体颜色值（仅用于主色）：

```css
:root {
	--color-primary: #3b82f6; /* 主色（默认蓝） */
	--color-primary-hover: #2563eb; /* 主色 hover */
	--color-primary-light: #dbeafe; /* 主色浅色（背景/标签） */
	--color-primary-dark: #1d4ed8; /* 主色深色 */
	--color-primary-bg: rgba(59, 130, 246, 0.1); /* 主色极淡背景 */
}

/* 暗色模式覆盖（由 JS 动态注入） */
.dark {
	--color-primary-light: rgba(59, 130, 246, 0.15);
	--color-primary-bg: rgba(59, 130, 246, 0.1);
	--color-primary-hover: rgba(59, 130, 246, 0.25);
}
```

> **动态计算规则**（store.ts 中的颜色算法）：
>
> - `--color-primary-light`：原色亮度 +40%
> - `--color-primary-dark`：原色亮度 -10%
> - `--color-primary-hover`：原色亮度 -5%
> - `--color-primary-bg`：原色 + 10% 透明度

### 2.2 预设主题色

| 名称         | Hex       | Tailwind 参考 |
| ------------ | --------- | ------------- |
| Blue（默认） | `#3b82f6` | blue-500      |
| Emerald      | `#10b981` | emerald-500   |
| Violet       | `#8b5cf6` | violet-500    |
| Amber        | `#f59e0b` | amber-500     |
| Red          | `#ef4444` | red-500       |
| Pink         | `#ec4899` | pink-500      |
| Cyan         | `#06b6d4` | cyan-500      |
| Indigo       | `#6366f1` | indigo-500    |

### 2.3 中性色（亮色模式）

```
背景层级（从深到浅）：
  页面背景    gray-100  (#f3f4f6)
  组件背景    white / gray-50
  悬停背景    gray-100  (#f3f4f6)
  分割线      gray-200  (#e5e7eb)

文字层级：
  主文字      gray-900  (#111827)
  次要文字    gray-600  (#4b5563)
  辅助文字    gray-400  (#9ca3af)
  占位文字    gray-300  (#d1d5db)
```

### 2.4 中性色（暗色模式）

```
页面背景    #111827  (gray-900)
组件背景    gray-800 (#1f2937)
悬停背景    gray-700/50 (带透明度)
分割线      gray-700 (#374151)

主文字      gray-100 (#f3f4f6)  ← 对应 .dark body
次要文字    gray-400 (#9ca3af)
辅助文字    gray-500 (#6b7280)
```

### 2.5 语义色

| 用途      | 亮色                              | 暗色                                 |
| --------- | --------------------------------- | ------------------------------------ |
| 成功      | `text-green-600` / `bg-green-100` | `text-green-400` / `bg-green-900/30` |
| 危险/错误 | `text-red-600` / `bg-red-100`     | `text-red-400` / `bg-red-900/30`     |
| 警告      | `text-amber-600` / `bg-amber-100` | `text-amber-400` / `bg-amber-900/30` |
| 信息      | `text-blue-600` / `bg-blue-100`   | `text-blue-400` / `bg-blue-900/30`   |

---

## 3. 圆角规范

遵循"**组件越大，圆角越大**"的原则：

| Token          | 像素值 | 使用场景                                   |
| -------------- | ------ | ------------------------------------------ |
| `rounded-md`   | 6px    | 小标签、角标、小型徽章                     |
| `rounded-lg`   | 8px    | **默认**：按钮、输入框、下拉菜单、小卡片   |
| `rounded-xl`   | 12px   | 卡片、面板、大型容器、模态框               |
| `rounded-2xl`  | 16px   | 特大容器（仅在 safelist 中保留，谨慎使用） |
| `rounded-full` | 9999px | 头像、圆形图标按钮、徽章圆点               |

**禁止**混用不同圆角值在同一个组合组件中（例如卡片内的按钮必须用 `rounded-lg`，不能用 `rounded-xl`）。

---

## 4. 间距规范

### 4.1 基础间距单位

Tailwind 默认 1 unit = 4px，项目中常用的间距值：

| Token               | 像素 | 典型用途                   |
| ------------------- | ---- | -------------------------- |
| `gap-1` / `p-1`     | 4px  | 最小分隔，图标内边距       |
| `gap-1.5` / `p-1.5` | 6px  | 标签页内边距（垂直）       |
| `gap-2` / `p-2`     | 8px  | 图标按钮内边距、行内小间距 |
| `gap-3` / `p-3`     | 12px | 侧边栏菜单水平内边距       |
| `gap-4` / `p-4`     | 16px | **网格卡片间距**（最常用） |
| `p-6`               | 24px | **卡片内边距**（最常用）   |
| `p-8`               | 32px | 大页面区块内边距           |

### 4.2 组件内间距规则

```
卡片内容区：    p-6 (24px 四周)
列表项：        px-4 py-2 (水平24px，垂直8px)
下拉选项：      px-4 py-2
表单控件：      px-3 py-2
图标按钮：      p-2 (8px 四周)
颜色色板：      gap-3 (12px 间距)
卡片网格：      gap-4 (16px 间距)
```

### 4.3 页面级间距

```
顶部 Header 高度：    h-16  (64px)
侧边栏折叠宽度：      72px
侧边栏展开宽度：      220px
标签栏高度：          h-9   (36px)
页面内容区水平内边距：px-6  (24px) 或 p-4 (16px)
```

---

## 5. 排版规范

### 5.1 字体栈

```css
font-family:
	-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica,
	Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
```

统一使用系统原生字体栈，**不引入**外部字体（如 Google Fonts），确保加载性能。

### 5.2 字号规范

| 级别        | Token                   | 像素       | 用途                                       |
| ----------- | ----------------------- | ---------- | ------------------------------------------ |
| 页面大标题  | `text-2xl font-bold`    | 24px / 700 | 页面主标题、卡片大数字                     |
| 区块标题    | `text-lg font-semibold` | 18px / 600 | 卡片标题、区块 heading                     |
| 正文        | `text-base`             | 16px / 400 | 正文默认（较少使用）                       |
| 标签/正文小 | `text-sm`               | 14px / 400 | **最常用**：菜单项、标签页、表单、描述文字 |
| 辅助/时间   | `text-xs`               | 12px / 400 | 时间戳、角标、提示文字                     |

### 5.3 字重规范

| Token           | 值  | 用途                   |
| --------------- | --- | ---------------------- |
| `font-bold`     | 700 | 页面主标题、Logo 文字  |
| `font-semibold` | 600 | 区块标题、强调小标题   |
| `font-medium`   | 500 | 按钮文字、次要强调     |
| （默认）        | 400 | 正文、描述文字、菜单项 |

### 5.4 行高

- 全局行高：`line-height: 1.5`（通过 `:root` 设置）
- 组件内不单独设置行高，依赖 Tailwind 默认

### 5.5 文字颜色

```
主要文字：  text-gray-900 dark:text-gray-100
次要文字：  text-gray-600 dark:text-gray-400
辅助文字：  text-gray-400 dark:text-gray-500
主题色文字：text-primary (.text-primary)
```

---

## 6. 布局规范

> 布局规范以**组件内部结构**为核心，描述各类常见组件的内部排列方式，
> 确保新增组件与现有风格保持一致。

---

### 6.1 基础 Flex 模式（高频使用）

以下是项目中出现频率最高的四种 flex 排列，**优先使用这四种，不要创造新变体**：

```html
<!-- ① 横排 · 左对齐 · 垂直居中（按钮内部、菜单项、列表行）-->
<div class="flex items-center gap-2">
	<!-- ② 横排 · 两端对齐（卡片头、toolbar）-->
	<div class="flex items-center justify-between">
		<!-- ③ 竖排 · 间距堆叠（卡片内容区、表单、侧边栏）-->
		<div class="flex flex-col gap-4">
			<!-- 或 space-y-4 -->

			<!-- ④ 横排 · 全宽均分（顶部导航菜单）-->
			<div class="flex items-center h-full w-full"></div>
		</div>
	</div>
</div>
```

---

### 6.2 图标 + 文字组合

项目中所有「图标 + 文字」组合遵循同一模式：

```html
<!-- 标准组合：图标固定不缩放，文字截断 -->
<div class="flex items-center gap-2">
	<i class="fas fa-icon flex-shrink-0"></i>
	<span class="truncate">文字</span>
</div>
```

各场景的 gap 和图标尺寸：

| 场景         | gap            | 图标尺寸              | 文字尺寸              |
| ------------ | -------------- | --------------------- | --------------------- |
| 侧边栏菜单项 | `gap-3`        | `w-5 h-5`             | `text-sm`             |
| 顶部菜单项   | `gap-1.5`      | `text-base`           | `text-sm font-medium` |
| 下拉选项     | `gap-2`        | `w-4`（固定宽度对齐） | `text-sm`             |
| 面包屑       | `mr-1`（图标） | `text-sm`             | `text-sm`             |
| 按钮内       | `gap-2`        | `text-sm`             | `text-sm font-medium` |
| 标签页       | `gap-1.5`      | `text-xs`             | `text-sm`             |

---

### 6.3 卡片内部布局

#### 标准信息卡片

```html
<!-- 头部：标题 + 操作按钮两端对齐 -->
<div class="flex items-center justify-between mb-4">
	<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">标题</h3>
	<button class="p-2 rounded-lg ...">操作</button>
</div>

<!-- 内容：垂直堆叠，统一间距 -->
<div class="space-y-4">
	<!-- 列表项 -->
	<div class="flex items-start gap-4">
		<!-- 图标容器（固定尺寸，不参与 flex 缩放）-->
		<div
			class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30
                flex items-center justify-center flex-shrink-0"
		>
			<i class="fas fa-icon text-blue-600 dark:text-blue-400"></i>
		</div>
		<!-- 文字内容（flex-1 占满剩余空间）-->
		<div class="flex-1 min-w-0">
			<p class="text-sm text-gray-800 dark:text-white truncate">
				主要文字
			</p>
			<p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
				次要文字
			</p>
		</div>
	</div>
</div>
```

#### 统计卡片（数字 + 图标）

```html
<!-- 左：文字垂直堆叠；右：图标容器固定尺寸 -->
<div class="flex items-center justify-between">
	<div>
		<p class="text-sm text-gray-500 dark:text-gray-400">标签</p>
		<p class="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
			数值
		</p>
		<!-- 趋势行 -->
		<p
			class="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1"
		>
			<i class="fas fa-arrow-up text-xs"></i>
			<span>+12.5%</span>
		</p>
	</div>
	<div
		class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30
              flex items-center justify-center flex-shrink-0"
	>
		<i
			class="fas fa-chart-bar text-blue-600 dark:text-blue-400 text-xl"
		></i>
	</div>
</div>
```

#### 带分隔线的卡片（头/身/尾）

```html
<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
	<!-- 头部：固定高度，底部分隔线 -->
	<div
		class="flex items-center justify-between px-6 h-14
              border-b border-gray-200 dark:border-gray-700"
	>
		<h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">
			标题
		</h3>
		<button>...</button>
	</div>
	<!-- 内容区 -->
	<div class="p-6 space-y-4">...</div>
	<!-- 尾部（可选）-->
	<div
		class="px-6 py-3 border-t border-gray-200 dark:border-gray-700
              flex items-center justify-end gap-2"
	>
		<button>取消</button>
		<button>确认</button>
	</div>
</div>
```

---

### 6.4 列表项布局

项目中所有列表行（菜单、通知、活动流）共用同一骨架：

```html
<!-- 基础列表项：图标 · 主文 + 副文 · 右侧附加信息 -->
<div
	class="flex items-center gap-3 px-4 py-3
            hover:bg-gray-50 dark:hover:bg-gray-700/50
            transition-colors cursor-pointer"
>
	<!-- 左侧图标（可选，固定宽度防止文字位移）-->
	<div
		class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
              bg-blue-100 dark:bg-blue-900/30"
	>
		<i class="fas fa-bell text-blue-600 dark:text-blue-400 text-xs"></i>
	</div>

	<!-- 中间内容（占满剩余空间，最小宽度 0 防止溢出）-->
	<div class="flex-1 min-w-0">
		<p class="text-sm text-gray-800 dark:text-gray-200 truncate">
			主要文字
		</p>
		<p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
			次要说明
		</p>
	</div>

	<!-- 右侧附加（时间戳、角标、操作）-->
	<span class="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0"
		>2分钟前</span
	>
</div>
```

---

### 6.5 表单字段布局

```html
<!-- 单个表单字段：标签 → 控件 垂直排列 -->
<div class="flex flex-col gap-1.5">
	<label class="text-sm font-medium text-gray-700 dark:text-gray-300">
		字段名称
	</label>
	<input class="px-3 py-2 rounded-lg text-sm border ..." />
	<!-- 错误提示（可选）-->
	<p class="text-xs text-red-500 flex items-center gap-1">
		<i class="fas fa-circle-exclamation"></i>
		错误信息
	</p>
</div>

<!-- 表单整体：字段之间统一 gap-4（18px）-->
<form class="flex flex-col gap-4">
	<!-- 字段... -->
	<button class="w-full btn-primary py-2.5 rounded-lg ...">提交</button>
</form>

<!-- 两列并排表单字段 -->
<div class="grid grid-cols-2 gap-4">
	<div class="flex flex-col gap-1.5">...</div>
	<div class="flex flex-col gap-1.5">...</div>
</div>
```

---

### 6.6 设置项布局（开关/选择类）

主题抽屉中的设置行模式，适用于所有「标签 + 控件」横排的场景：

```html
<!-- 标签 + Toggle 开关 -->
<label class="flex items-center justify-between cursor-pointer">
	<span class="text-sm text-gray-600 dark:text-gray-400">功能名称</span>
	<!-- Toggle 开关 -->
	<div
		class="relative w-11 h-6 rounded-full transition-colors cursor-pointer
              bg-gray-200 dark:bg-gray-600"
		:class="{ 'bg-primary': enabled }"
	>
		<div
			class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow
                transition-transform"
			:class="{ 'translate-x-5': enabled }"
		></div>
	</div>
</label>

<!-- 标签 + 分组按钮选择（如布局模式）-->
<div>
	<p class="text-sm text-gray-600 dark:text-gray-400 mb-3">选项标签</p>
	<div class="grid grid-cols-3 gap-3">
		<button
			class="flex flex-col items-center gap-2 p-3 rounded-lg border-2
                   transition-all text-sm"
		>
			<i class="fas fa-icon text-xl"></i>
			<span class="text-xs">选项名</span>
		</button>
	</div>
</div>

<!-- 标签 + 色板选择 -->
<div>
	<p class="text-sm text-gray-600 dark:text-gray-400 mb-3">颜色</p>
	<div class="flex flex-wrap gap-3">
		<button
			class="w-8 h-8 rounded-full transition-transform hover:scale-110"
		></button>
	</div>
</div>
```

---

### 6.7 导航菜单项布局

侧边栏菜单项（展开态）：

```html
<!-- 一级无子项 -->
<button
	class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
               transition-colors w-full text-left"
>
	<i class="fas fa-icon w-5 h-5 flex-shrink-0"></i>
	<span class="flex-1 truncate">菜单名</span>
</button>

<!-- 一级有子项 -->
<button
	class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
               transition-colors"
>
	<i class="fas fa-icon w-5 h-5 flex-shrink-0"></i>
	<span class="flex-1 truncate text-left">父菜单</span>
	<i
		class="fas fa-chevron-right text-xs transition-transform duration-200"
		:class="{ 'rotate-90': isOpen }"
	></i>
</button>

<!-- 二级子项（缩进 ml-4，宽度略小）-->
<ul class="ml-4 mt-1 space-y-1">
	<li>
		<button
			class="w-[calc(100%-0.5rem)] flex items-center gap-2 px-3 py-2
                   text-sm mx-1 rounded text-left transition-colors"
		>
			<i class="fas fa-icon w-4 flex-shrink-0"></i>
			<span class="truncate">子菜单</span>
		</button>
	</li>
</ul>
```

侧边栏菜单项（折叠态，仅图标）：

```html
<button
	class="flex items-center justify-center px-3 py-2.5 rounded-lg
               text-sm transition-colors w-full"
>
	<i class="fas fa-icon w-5 h-5"></i>
	<span class="sr-only">菜单名（无障碍）</span>
</button>
```

顶部菜单项：

```html
<!-- 无子项 -->
<button
	class="h-full flex items-center gap-1.5 px-3 text-sm font-medium
               transition-all duration-200 border-b-2 -mb-px"
>
	<i class="fas fa-icon text-base flex-shrink-0"></i>
	<span class="truncate max-w-[110px]">菜单名</span>
</button>

<!-- 有子项（含下箭头，展开时旋转）-->
<button
	class="h-full flex items-center gap-1.5 px-3 text-sm font-medium
               border-b-2 -mb-px transition-all duration-200"
>
	<i class="fas fa-icon flex-shrink-0"></i>
	<span class="truncate max-w-[110px]">父菜单</span>
	<i
		class="fas fa-chevron-down text-xs transition-transform duration-200"
		:class="{ 'rotate-180': isOpen }"
	></i>
</button>
```

---

### 6.8 标签页 Tab 布局

```html
<!-- Tab 容器：横向滚动 -->
<div
	class="flex items-center gap-1 flex-1 overflow-x-auto overflow-y-hidden
            scrollbar-hide cursor-grab"
>
	<!-- 单个 Tab -->
	<div
		class="group flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm
              cursor-pointer transition-all duration-200 whitespace-nowrap
              border border-transparent flex-shrink-0"
	>
		<i class="fas fa-icon text-xs flex-shrink-0"></i>
		<span class="truncate max-w-[100px]">标签名</span>
		<!-- 关闭按钮（hover 时显示）-->
		<button
			class="w-4 h-4 rounded-full flex items-center justify-center
                   transition-all opacity-0 group-hover:opacity-100"
		>
			<i class="fas fa-xmark text-[10px]"></i>
		</button>
	</div>
</div>
```

---

### 6.9 面包屑布局

```html
<nav class="flex items-center gap-2 text-sm min-w-0">
	<!-- 可点击层级 -->
	<button
		class="text-gray-500 dark:text-gray-400
                 hover:text-gray-700 dark:hover:text-gray-200
                 transition-colors truncate max-w-40"
	>
		<i class="fas fa-home mr-1"></i>首页
	</button>

	<!-- 分隔符 -->
	<i
		class="fas fa-chevron-right text-gray-300 dark:text-gray-600 text-xs flex-shrink-0"
	></i>

	<!-- 当前层级（不可点击，加粗）-->
	<span class="text-gray-800 dark:text-white font-medium truncate">
		<i class="fas fa-icon mr-1"></i>当前页
	</span>
</nav>
```

---

### 6.10 网格卡片布局

响应式网格遵循以下三种规格，不创造新规格：

```html
<!-- 4列统计卡片（首页 KPI 区）-->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
	<!-- 3列内容卡片（组件列表、功能入口）-->
	<div
		class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
	>
		<!-- 2列内容区（左右对称布局）-->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
			<!-- 4列数据行（紧凑信息网格）-->
			<div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm"></div>
		</div>
	</div>
</div>
```

---

### 6.11 抽屉/面板内部布局

```html
<!-- 抽屉容器：固定宽高，flex 列方向 -->
<div
	class="fixed right-0 top-0 h-full w-80 flex flex-col
            bg-white dark:bg-gray-800 shadow-2xl z-[201]"
>
	<!-- 头部：固定高度 h-16 -->
	<div
		class="flex items-center justify-between h-16 px-6
              border-b border-gray-200 dark:border-gray-700 flex-shrink-0"
	>
		<h2 class="text-base font-semibold text-gray-900 dark:text-gray-100">
			标题
		</h2>
		<button class="p-2 rounded-lg ...">关闭</button>
	</div>

	<!-- 内容区：flex-1 可滚动，sections 之间 space-y-6 -->
	<div class="flex-1 overflow-y-auto p-6 space-y-6">
		<!-- 每个 section 标题 -->
		<div>
			<h3
				class="text-xs font-semibold text-gray-400 dark:text-gray-500
                 uppercase tracking-wider mb-3"
			>
				分组标题
			</h3>
			<!-- 分组内容 -->
		</div>
	</div>

	<!-- 尾部（可选）-->
	<div
		class="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0"
	>
		<button
			class="w-full btn-primary py-2.5 rounded-lg text-sm font-medium"
		>
			确认
		</button>
	</div>
</div>
```

---

### 6.12 空状态布局

```html
<!-- 居中空状态 -->
<div class="flex flex-col items-center justify-center py-16 gap-3">
	<div
		class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700
              flex items-center justify-center"
	>
		<i class="fas fa-inbox text-3xl text-gray-400 dark:text-gray-500"></i>
	</div>
	<p class="text-sm font-medium text-gray-500 dark:text-gray-400">暂无数据</p>
	<p class="text-xs text-gray-400 dark:text-gray-500">描述文字</p>
</div>
```

---

## 7. 卡片样式

### 7.1 基础卡片

```html
<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
	<!-- 内容 -->
</div>
```

| 属性   | 亮色                | 暗色                                    |
| ------ | ------------------- | --------------------------------------- |
| 背景   | `bg-white`          | `dark:bg-gray-800`                      |
| 圆角   | `rounded-xl` (12px) | 同                                      |
| 内边距 | `p-6` (24px)        | 同                                      |
| 阴影   | `shadow-sm`         | 同（暗色阴影自然减弱）                  |
| 边框   | 无（依靠阴影分层）  | 可选 `dark:border dark:border-gray-700` |

### 7.2 统计卡片（数据展示）

```html
<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
	<div class="flex items-center justify-between">
		<div>
			<p class="text-sm text-gray-600 dark:text-gray-400">标题</p>
			<p class="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
				数值
			</p>
		</div>
		<!-- 图标区域 -->
		<div
			class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full
                flex items-center justify-center"
		>
			<i class="fas fa-icon text-blue-600 dark:text-blue-400"></i>
		</div>
	</div>
</div>
```

### 7.3 渐变卡片（强调/Banner）

```html
<div
	class="bg-gradient-to-r from-blue-500 to-blue-600
            dark:from-blue-900 dark:to-gray-800
            rounded-xl p-6 text-white"
>
	<!-- 白色文字内容 -->
</div>
```

### 7.4 带操作的卡片

```html
<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
	<!-- 卡片头部 -->
	<div
		class="flex items-center justify-between p-6 border-b
              border-gray-200 dark:border-gray-700"
	>
		<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
			标题
		</h3>
		<button class="...">操作</button>
	</div>
	<!-- 卡片内容 -->
	<div class="p-6">...</div>
</div>
```

---

## 8. 表格样式

### 8.1 基础表格

```html
<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
	<table class="w-full">
		<thead>
			<tr class="border-b border-gray-200 dark:border-gray-700">
				<th
					class="text-left px-6 py-3 text-xs font-semibold
                   text-gray-500 dark:text-gray-400 uppercase tracking-wider"
				>
					列名
				</th>
			</tr>
		</thead>
		<tbody class="divide-y divide-gray-200 dark:divide-gray-700">
			<tr
				class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
			>
				<td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
					内容
				</td>
			</tr>
		</tbody>
	</table>
</div>
```

### 8.2 表格规范细则

| 元素         | 样式规则                                                                 |
| ------------ | ------------------------------------------------------------------------ |
| 表格容器     | `rounded-xl overflow-hidden shadow-sm`，圆角需配合 overflow-hidden       |
| 表头行       | `border-b border-gray-200 dark:border-gray-700`                          |
| 表头单元格   | `px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider` |
| 数据行分割线 | `divide-y divide-gray-200 dark:divide-gray-700`                          |
| 数据行悬停   | `hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors`           |
| 数据单元格   | `px-6 py-4 text-sm`                                                      |
| 主要数据     | `text-gray-900 dark:text-gray-100`                                       |
| 次要数据     | `text-gray-500 dark:text-gray-400`                                       |

### 8.3 状态徽章（用于表格内）

```html
<!-- 成功状态 -->
<span
	class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
             bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
>
	已完成
</span>

<!-- 警告状态 -->
<span
	class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
             bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
>
	待处理
</span>

<!-- 错误状态 -->
<span
	class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
             bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
>
	失败
</span>
```

---

## 9. 按钮样式

### 9.1 主要按钮（Primary）

```html
<button
	class="btn-primary px-4 py-2.5 rounded-lg font-medium
               transition-colors text-sm"
>
	操作文字
</button>
```

CSS 驱动：

```css
.btn-primary {
	background-color: var(--color-primary);
	color: white;
}
.btn-primary:hover {
	background-color: var(--color-primary-hover);
}
```

### 9.2 次要按钮（Secondary）

```html
<button
	class="px-4 py-2.5 rounded-lg font-medium text-sm
               bg-gray-100 hover:bg-gray-200
               dark:bg-gray-700 dark:hover:bg-gray-600
               text-gray-700 dark:text-gray-300
               transition-colors"
>
	次要操作
</button>
```

### 9.3 轮廓按钮（Outline）

```html
<button
	class="px-4 py-2.5 rounded-lg font-medium text-sm
               border border-gray-200 dark:border-gray-600
               hover:bg-gray-50 dark:hover:bg-gray-700/50
               text-gray-700 dark:text-gray-300
               transition-colors"
>
	轮廓按钮
</button>
```

### 9.4 图标按钮（Icon Button）

```html
<button
	class="p-2 rounded-lg
               text-gray-600 dark:text-gray-400
               hover:bg-gray-100 dark:hover:bg-gray-700/50
               transition-colors"
>
	<i class="fas fa-icon w-4 h-4"></i>
</button>
```

### 9.5 危险按钮（Danger）

```html
<button
	class="px-4 py-2.5 rounded-lg font-medium text-sm
               bg-red-500 hover:bg-red-600
               text-white transition-colors"
>
	删除
</button>
```

### 9.6 按钮尺寸规范

| 尺寸    | 内边距          | 字号      | 圆角         | 用途             |
| ------- | --------------- | --------- | ------------ | ---------------- |
| 小 (sm) | `px-3 py-1.5`   | `text-xs` | `rounded-md` | 表格行操作       |
| 中 (md) | `px-3 py-2`     | `text-sm` | `rounded-lg` | 卡片操作、工具栏 |
| 大 (lg) | `px-4 py-2.5`   | `text-sm` | `rounded-lg` | 表单提交、主操作 |
| 全宽    | `w-full py-2.5` | `text-sm` | `rounded-lg` | 抽屉底部确认     |

### 9.7 按钮状态

```
默认：  正常颜色
悬停：  hover:opacity-90 或 更深背景色
禁用：  opacity-50 cursor-not-allowed（pointer-events-none）
激活：  scale-95（可选）
```

---

## 10. 输入框样式

### 10.1 基础文本输入框

```html
<input
	type="text"
	class="w-full px-3 py-2 rounded-lg text-sm
         border border-gray-200 dark:border-gray-600
         bg-white dark:bg-gray-700
         text-gray-900 dark:text-gray-100
         placeholder:text-gray-400 dark:placeholder:text-gray-500
         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
         transition-colors"
	placeholder="占位文字"
/>
```

### 10.2 带前缀/后缀图标的输入框

```html
<div class="relative">
	<div
		class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
	>
		<i class="fas fa-search text-gray-400 text-sm"></i>
	</div>
	<input
		type="text"
		class="w-full pl-9 pr-3 py-2 rounded-lg text-sm
           border border-gray-200 dark:border-gray-600
           bg-white dark:bg-gray-700
           text-gray-900 dark:text-gray-100
           focus:outline-none focus:ring-2 focus:ring-primary
           transition-colors"
		placeholder="搜索..."
	/>
</div>
```

### 10.3 输入框尺寸规范

| 尺寸       | 内边距          | 字号      | 圆角         |
| ---------- | --------------- | --------- | ------------ |
| 小         | `px-2.5 py-1.5` | `text-xs` | `rounded-md` |
| 中（默认） | `px-3 py-2`     | `text-sm` | `rounded-lg` |
| 大         | `px-4 py-3`     | `text-sm` | `rounded-lg` |

### 10.4 输入框状态规范

| 状态 | 样式                                                                  |
| ---- | --------------------------------------------------------------------- |
| 默认 | `border-gray-200 dark:border-gray-600`                                |
| 悬停 | `border-gray-300 dark:border-gray-500`（可选）                        |
| 聚焦 | `focus:ring-2 focus:ring-primary focus:border-transparent`            |
| 禁用 | `disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50` |
| 错误 | `border-red-500 focus:ring-red-500`                                   |

### 10.5 表单标签规范

```html
<label
	class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
>
	标签文字
</label>
```

### 10.6 Checkbox / Radio

原生表单控件使用主题色 accent-color：

```css
input[type='checkbox'],
input[type='radio'] {
	appearance: auto;
	color-scheme: light; /* 强制亮色渲染 */
	accent-color: var(--color-primary);
}
.dark input[type='checkbox'],
.dark input[type='radio'] {
	color-scheme: dark; /* 暗色模式恢复 */
}
```

---

## 11. 下拉框样式

### 11.1 自定义下拉菜单（最常用）

```html
<div class="relative">
	<!-- 触发器 -->
	<button
		class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                 text-gray-700 dark:text-gray-300
                 hover:bg-gray-100 dark:hover:bg-gray-700/50
                 transition-colors"
	>
		<span>选项文字</span>
		<i class="fas fa-chevron-down text-xs text-gray-400"></i>
	</button>

	<!-- 下拉面板 -->
	<Transition
		enter-active-class="transition duration-200 ease-out"
		enter-from-class="opacity-0 scale-95"
		enter-to-class="opacity-100 scale-100"
		leave-active-class="transition duration-150 ease-in"
		leave-from-class="opacity-100 scale-100"
		leave-to-class="opacity-0 scale-95"
	>
		<div
			class="absolute right-0 mt-2 w-48 z-50
                bg-white dark:bg-gray-800
                rounded-lg shadow-lg
                border border-gray-200 dark:border-gray-700
                py-1"
		>
			<!-- 选项 -->
			<button
				class="w-full flex items-center gap-2 px-4 py-2 text-sm
                     text-gray-600 dark:text-gray-400
                     hover:bg-gray-100 dark:hover:bg-gray-700/50
                     transition-colors"
			>
				<i class="fas fa-icon w-4"></i>
				选项文字
			</button>
			<!-- 分割线 -->
			<hr class="my-1 border-gray-200 dark:border-gray-700" />
		</div>
	</Transition>
</div>
```

### 11.2 下拉面板尺寸

| 场景     | 宽度           | 备注               |
| -------- | -------------- | ------------------ |
| 操作菜单 | `w-48` (192px) | 用户菜单、更多操作 |
| 通知面板 | `w-80` (320px) | 通知、消息         |
| 筛选面板 | `w-56` (224px) | 筛选条件           |

### 11.3 下拉面板规范

| 属性       | 规则                                                     |
| ---------- | -------------------------------------------------------- |
| 定位       | `absolute right-0 mt-2`（相对触发器右对齐）              |
| 层级       | `z-50`                                                   |
| 背景       | `bg-white dark:bg-gray-800`                              |
| 边框       | `border border-gray-200 dark:border-gray-700`            |
| 圆角       | `rounded-lg` (8px)                                       |
| 阴影       | `shadow-lg`                                              |
| 内边距     | `py-1`（上下各 4px）                                     |
| 选项内边距 | `px-4 py-2`                                              |
| 分割线     | `<hr class="my-1 border-gray-200 dark:border-gray-700">` |

### 11.4 原生 Select 样式（表单中使用）

```html
<select
	class="w-full px-3 py-2 rounded-lg text-sm
               border border-gray-200 dark:border-gray-600
               bg-white dark:bg-gray-700
               text-gray-900 dark:text-gray-100
               focus:outline-none focus:ring-2 focus:ring-primary
               transition-colors cursor-pointer"
>
	<option value="">请选择</option>
	<option value="1">选项一</option>
</select>
```

---

## 12. 动效规范

### 12.1 过渡时长

| 场景                   | 时长           | 缓动          |
| ---------------------- | -------------- | ------------- |
| 颜色变化（hover 背景） | `duration-200` | `ease-out`    |
| 弹出层出现             | `duration-200` | `ease-out`    |
| 弹出层消失             | `duration-150` | `ease-in`     |
| 侧边栏展开/折叠        | `duration-300` | `ease-in-out` |
| 图标旋转               | `duration-200` | `ease-out`    |

### 12.2 标准过渡类

```html
<!-- 颜色 hover -->
<class ="transition-colors">
	<!-- 全属性（含尺寸变化）-->
	<class ="transition-all duration-300">
		<!-- 弹出动画（缩放 + 透明度）-->
		enter-active-class="transition duration-200 ease-out"
		enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100
		scale-100" leave-active-class="transition duration-150 ease-in"
		leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0
		scale-95"</class
	></class
>
```

### 12.3 禁止使用的效果

- **禁止**使用 `animate-pulse` 等持续动画（影响性能）
- **禁止**使用超过 `duration-500` 的过渡时长（用户感知迟钝）
- **禁止**在大面积元素上使用 `transition-all`（改用 `transition-colors` 或 `transition-transform`）

---

## 13. 图标规范

### 13.1 图标库

使用 **FontAwesome Free 6.7.2**，风格遵循：

- 主要使用 `fas`（Solid 实心）
- 部分场景使用 `far`（Regular 线条）
- 禁止在同一页面混用实心和线条风格（除非有明确语义区分）

### 13.2 图标尺寸

| 场景         | 尺寸                    | 说明                      |
| ------------ | ----------------------- | ------------------------- |
| 表单输入前缀 | `text-sm`               | 与输入框对齐              |
| 按钮内图标   | `text-sm` / `w-4 h-4`   | 与按钮文字对齐            |
| 导航菜单     | `w-4 h-4` / `text-base` | 菜单项图标                |
| 统计卡片     | `text-xl`               | 放置在 `w-12 h-12` 容器中 |
| 页面级大图标 | `text-3xl`              | 空状态页面                |

### 13.3 图标容器规范

```html
<!-- 圆形图标容器（统计卡片）-->
<div
	class="w-12 h-12 rounded-full
            bg-blue-100 dark:bg-blue-900/30
            flex items-center justify-center"
>
	<i class="fas fa-chart-bar text-blue-600 dark:text-blue-400"></i>
</div>

<!-- 方形图标容器 -->
<div
	class="w-10 h-10 rounded-lg
            bg-primary-bg
            flex items-center justify-center"
>
	<i class="fas fa-icon text-primary"></i>
</div>
```

---

## 14. 暗色模式适配

### 14.1 适配原则

- 每个组件的亮色/暗色样式**必须同时编写**，不允许缺失
- 使用 `dark:` 前缀（Tailwind class 策略），由 `.dark` class 驱动
- 颜色切换通过 `document.documentElement.classList.toggle('dark')` 完成

### 14.2 对照速查表

| 属性     | 亮色                | 暗色                           |
| -------- | ------------------- | ------------------------------ |
| 页面背景 | `bg-gray-100`       | `dark:bg-gray-900` (`#111827`) |
| 组件背景 | `bg-white`          | `dark:bg-gray-800`             |
| 悬停背景 | `hover:bg-gray-100` | `dark:hover:bg-gray-700/50`    |
| 边框     | `border-gray-200`   | `dark:border-gray-700`         |
| 主文字   | `text-gray-900`     | `dark:text-gray-100`           |
| 次要文字 | `text-gray-600`     | `dark:text-gray-400`           |
| 辅助文字 | `text-gray-400`     | `dark:text-gray-500`           |
| 分割线   | `border-gray-200`   | `dark:border-gray-700`         |
| 图标     | `text-gray-600`     | `dark:text-gray-400`           |

### 14.3 主题色在暗色模式下

| 变量                    | 亮色值                   | 暗色值                   |
| ----------------------- | ------------------------ | ------------------------ |
| `--color-primary-light` | `#dbeafe`                | `rgba(59,130,246, 0.15)` |
| `--color-primary-bg`    | `rgba(59,130,246, 0.10)` | `rgba(59,130,246, 0.10)` |
| `--color-primary-hover` | `#2563eb`                | `rgba(59,130,246, 0.25)` |

---

## 附录：常用工具类速查

```html
<!-- 卡片 -->
bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm

<!-- 卡片标题 -->
text-lg font-semibold text-gray-900 dark:text-gray-100

<!-- 次要文字 -->
text-sm text-gray-600 dark:text-gray-400

<!-- 分割线 -->
border-t border-gray-200 dark:border-gray-700

<!-- 主按钮 -->
btn-primary px-4 py-2.5 rounded-lg font-medium text-sm transition-colors

<!-- 图标按钮 -->
p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100
dark:hover:bg-gray-700/50 transition-colors

<!-- 输入框 -->
px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-600
bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none
focus:ring-2 focus:ring-primary transition-colors

<!-- 下拉面板 -->
absolute right-0 mt-2 w-48 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg
border border-gray-200 dark:border-gray-700 py-1

<!-- 状态徽章（成功）-->
inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400

<!-- 网格布局 -->
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4
```

---

## 15. 图表设计规范

### 15.1 技术约定

- 统一使用 ECharts 作为图表库
- 构建规范：在 UMD 构建中将 `echarts` 设为 external，并在 globals 中声明 `echarts`，宿主环境通过 CDN 注入 `window.echarts`
- 代码引用：组件内使用 `import * as echarts from 'echarts'`（类型与 API 访问），运行时依赖宿主提供的全局
- 宿主示例：`<script src="https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js"></script>`

### 15.2 视觉规范

- 颜色映射：遵循主题色与语义色约定
    - 主系列（primary）：`--color-primary` 或对应 Tailwind 主色
    - 成功/警告/错误/信息系列遵循“语义色”表（2.5）
- 网格与轴：
    - 背景网格线默认使用中性浅色（亮色 `gray-200`、暗色 `gray-700/50`）
    - 轴线颜色与文字遵循“中性色”规范，暗色模式自动降低亮度
- 字体与字号：与“排版规范”一致，标题 `text-lg`、标签 `text-sm`、标注 `text-xs`
- 边距与间距：
    - 图表容器内边距：`padding: 16px`（与卡片一致）
    - 图例与工具栏之间建议保持 `8–12px` 间距
- 交互元素（tooltip/legend）：
    - 圆角遵循 `rounded-lg`
    - 背景颜色按明暗模式切换，阴影适度（`shadow` 或 `shadow-md`）

### 15.3 交互与可用性

- Tooltip：默认开启，延迟 80–120ms，内容尽量结构化（名称、数值、单位）
- Legend：可点击筛选系列，保持状态一致性
- 响应式：在宽度 < 480px 时，自动隐藏非关键轴标签或旋转为 30°/45°
- 无障碍：
    - 提供高对比度模式（暗色下提高线条与点的亮度）
    - 重要数据点支持可视化强调（加粗、加大、着色）

### 15.4 性能规范

- 初始化与销毁：在组件挂载时 `init`，卸载时 `dispose`
- Resize：节流到 100–200ms，避免频繁重绘
- 大数据集：使用 `dataset` 与内置优化（如 `large: true` 选项），避免复杂阴影与过度渐变

### 15.5 数据与格式

- 标准数据结构：
    - 折线/柱状：`{ xAxis: string[], series: { name: string, data: number[] }[] }`
    - 饼/环：`{ name: string, value: number }[]`
- 单位与精度：在 tooltip 与轴标签统一展示单位与小数精度

### 15.6 代码参考（Vue 组件最小模板）

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
		tooltip: { trigger: 'axis' },
		xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
		yAxis: { type: 'value' },
		series: [{ type: 'line', data: [120, 200, 150, 80, 70], name: '示例' }],
	})
	window.addEventListener('resize', resizeThrottled)
})

const resizeThrottled = throttle(() => chart?.resize(), 150)

onBeforeUnmount(() => {
	window.removeEventListener('resize', resizeThrottled)
	chart?.dispose()
})

function throttle(fn: () => void, wait: number) {
	let t = 0
	return () => {
		const now = Date.now()
		if (now - t > wait) {
			t = now
			fn()
		}
	}
}
</script>
```

### 15.7 与主题系统的结合

- 颜色采用 CSS 变量计算，ECharts 颜色使用变量值注入
- 明暗模式切换时，重新设置 `option` 或调用 `chart.resize()` 以适配
