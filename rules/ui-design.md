# prism-umd-template · UI 设计规范

> 提炼自 `doc/ui-design-spec.md`，保留与 UMD 组件开发相关的部分。

---

## 一、设计原则

| 原则 | 说明 |
|------|------|
| **简洁优先** | 避免过度装饰，信息层次清晰，大量留白 |
| **一致性** | 相同类型的元素使用统一的间距、圆角、色彩 |
| **双模式** | 每个组件都必须同时适配亮色 / 暗色模式 |
| **响应式** | 移动端首先考虑折叠布局，断点遵循 Tailwind 标准 |

---

## 二、色彩系统

### 中性色（亮色模式）

```
页面背景    bg-white / bg-slate-50
悬停背景    hover:bg-slate-100
分割线      border-slate-200
主文字      text-slate-900
次要文字    text-slate-600 / text-slate-500
辅助文字    text-slate-400
```

### 中性色（暗色模式）

```
页面背景    dark:bg-slate-900
卡片背景    dark:bg-slate-800
悬停背景    dark:hover:bg-slate-700/50
分割线      dark:border-slate-700
主文字      dark:text-white / dark:text-slate-100
次要文字    dark:text-slate-400
辅助文字    dark:text-slate-500
```

### 语义色

| 用途 | 亮色 | 暗色 |
|------|------|------|
| 成功 | `text-green-600 bg-green-100` | `dark:text-green-400 dark:bg-green-900/30` |
| 警告 | `text-amber-600 bg-amber-100` | `dark:text-amber-400 dark:bg-amber-900/30` |
| 错误 | `text-red-600 bg-red-100` | `dark:text-red-400 dark:bg-red-900/30` |
| 信息 | `text-blue-600 bg-blue-100` | `dark:text-blue-400 dark:bg-blue-900/30` |
| 强调 | `text-indigo-600` | `dark:text-indigo-400` |

### 暗色模式完整对照

| 属性 | 亮色 | 暗色 |
|------|------|------|
| 页面背景 | `bg-white` | `dark:bg-slate-900` |
| 卡片背景 | `bg-slate-50` | `dark:bg-slate-800` |
| 悬停背景 | `hover:bg-slate-100` | `dark:hover:bg-slate-700/50` |
| 边框 | `border-slate-200` | `dark:border-slate-700` |
| 主文字 | `text-slate-900` | `dark:text-white` |
| 次要文字 | `text-slate-500` | `dark:text-slate-400` |
| 辅助文字 | `text-slate-400` | `dark:text-slate-500` |
| 图标 | `text-slate-600` | `dark:text-slate-400` |

---

## 三、圆角规范

| Token | 像素 | 使用场景 |
|-------|------|---------|
| `rounded-md` | 6px | 小标签、角标、徽章 |
| `rounded-lg` | 8px | **默认**：按钮、输入框、下拉菜单、小卡片 |
| `rounded-xl` | 12px | 卡片、面板、大型容器 |
| `rounded-full` | 9999px | 头像、圆形图标按钮、徽章圆点 |

同一组合组件内禁止混用不同圆角值（卡片内的按钮用 `rounded-lg`，不能用 `rounded-xl`）。

---

## 四、间距规范

| Token | 像素 | 典型用途 |
|-------|------|---------|
| `gap-2 / p-2` | 8px | 图标按钮内边距、行内小间距 |
| `gap-3 / p-3` | 12px | 列表项水平内边距 |
| `gap-4 / p-4` | 16px | **卡片间距**（最常用） |
| `p-6` | 24px | **卡片内边距**（最常用） |

---

## 五、排版规范

| 级别 | Token | 用途 |
|------|-------|------|
| 页面大标题 | `text-2xl font-bold` | 页面主标题、卡片大数字 |
| 区块标题 | `text-lg font-semibold` | 卡片标题、区块 heading |
| 正文小 / 标签 | `text-sm` | **最常用**：列表项、表单、描述文字 |
| 辅助 | `text-xs` | 时间戳、角标、提示文字 |

字体栈使用系统原生字体，不引入外部字体（保障加载性能）。

---

## 六、常用布局模式

### 横排 · 两端对齐（卡片头、工具栏）
```html
<div class="flex items-center justify-between">
```

### 横排 · 左对齐（按钮内部、列表行）
```html
<div class="flex items-center gap-2">
```

### 竖排 · 间距堆叠（卡片内容区、表单）
```html
<div class="flex flex-col gap-4">
```

### 图标 + 文字标准组合
```html
<div class="flex items-center gap-2">
  <i class="fas fa-icon flex-shrink-0"></i>
  <span class="truncate">文字</span>
</div>
```

### 卡片内部布局（头 / 身 / 尾）
```html
<div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm">
  <!-- 头部 -->
  <div class="flex items-center justify-between px-6 h-14 border-b border-slate-200 dark:border-slate-700">
    <h3 class="text-base font-semibold text-slate-900 dark:text-slate-100">标题</h3>
  </div>
  <!-- 内容区 -->
  <div class="p-6 space-y-4">...</div>
  <!-- 尾部（可选）-->
  <div class="px-6 py-3 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
    <button>取消</button><button>确认</button>
  </div>
</div>
```

### 列表项布局
```html
<div class="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
  <!-- 左侧图标 -->
  <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100 dark:bg-blue-900/30">
    <i class="fas fa-bell text-blue-600 dark:text-blue-400 text-xs"></i>
  </div>
  <!-- 中间内容 -->
  <div class="flex-1 min-w-0">
    <p class="text-sm text-slate-800 dark:text-slate-200 truncate">主要文字</p>
    <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">次要说明</p>
  </div>
  <!-- 右侧附加 -->
  <span class="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">2分钟前</span>
</div>
```

### 空状态布局
```html
<div class="flex flex-col items-center justify-center py-16 gap-3">
  <div class="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
    <i class="fas fa-inbox text-3xl text-slate-400 dark:text-slate-500"></i>
  </div>
  <p class="text-sm font-medium text-slate-500 dark:text-slate-400">暂无数据</p>
</div>
```

### 响应式网格
```html
<!-- 4 列统计卡片 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
<!-- 3 列内容卡片 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
<!-- 2 列对称布局 -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
```

---

## 七、卡片样式

```html
<!-- 基础卡片 -->
<div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">

<!-- 统计卡片（数字 + 图标） -->
<div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
  <div class="flex items-center justify-between">
    <div>
      <p class="text-sm text-slate-500 dark:text-slate-400">标签</p>
      <p class="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">数值</p>
      <p class="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
        <i class="fas fa-arrow-up text-xs"></i><span>+12.5%</span>
      </p>
    </div>
    <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
      <i class="fas fa-chart-bar text-blue-600 dark:text-blue-400 text-xl"></i>
    </div>
  </div>
</div>
```

---

## 八、表格样式

```html
<div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
  <table class="w-full">
    <thead>
      <tr class="border-b border-slate-200 dark:border-slate-700">
        <th class="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">列名</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
        <td class="px-6 py-4 text-sm text-slate-900 dark:text-slate-100">内容</td>
      </tr>
    </tbody>
  </table>
</div>
```

### 状态徽章
```html
<!-- 成功 -->
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">已完成</span>
<!-- 警告 -->
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">待处理</span>
<!-- 错误 -->
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">失败</span>
```

---

## 九、按钮样式

```html
<!-- 主要按钮 -->
<button class="px-4 py-2.5 rounded-lg font-medium text-sm bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white transition-colors">操作</button>

<!-- 次要按钮 -->
<button class="px-4 py-2.5 rounded-lg font-medium text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 transition-colors">次要操作</button>

<!-- 轮廓按钮 -->
<button class="px-4 py-2.5 rounded-lg font-medium text-sm border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 transition-colors">轮廓按钮</button>

<!-- 图标按钮 -->
<button class="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
  <i class="fas fa-icon"></i>
</button>

<!-- 危险按钮 -->
<button class="px-4 py-2.5 rounded-lg font-medium text-sm bg-red-500 hover:bg-red-600 text-white transition-colors">删除</button>
```

| 尺寸 | 内边距 | 字号 | 圆角 |
|------|--------|------|------|
| 小 | `px-3 py-1.5` | `text-xs` | `rounded-md` |
| 中 | `px-3 py-2` | `text-sm` | `rounded-lg` |
| 大 | `px-4 py-2.5` | `text-sm` | `rounded-lg` |

---

## 十、输入框样式

```html
<!-- 基础输入框 -->
<input type="text"
  class="w-full px-3 py-2 rounded-lg text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
  placeholder="占位文字" />

<!-- 带前缀图标的输入框 -->
<div class="relative">
  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <i class="fas fa-search text-slate-400 text-sm"></i>
  </div>
  <input type="text"
    class="w-full pl-9 pr-3 py-2 rounded-lg text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
    placeholder="搜索..." />
</div>

<!-- 表单标签 -->
<label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">字段名称</label>
```

---

## 十一、下拉框样式

```html
<div class="relative">
  <!-- 触发器 -->
  <button class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
    <span>选项文字</span>
    <i class="fas fa-chevron-down text-xs text-slate-400"></i>
  </button>
  <!-- 下拉面板 -->
  <div class="absolute right-0 mt-2 w-48 z-50 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1">
    <button class="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
      <i class="fas fa-icon w-4"></i>选项文字
    </button>
    <hr class="my-1 border-slate-200 dark:border-slate-700" />
  </div>
</div>
```

---

## 十二、动效规范

| 场景 | 时长 | 缓动 |
|------|------|------|
| 颜色 hover | `duration-200` | `ease-out` |
| 弹出层出现 | `duration-200` | `ease-out` |
| 弹出层消失 | `duration-150` | `ease-in` |
| 图标旋转 | `duration-200` | `ease-out` |

```html
<!-- 颜色 hover -->
<div class="transition-colors">

<!-- 弹出动画（Vue Transition） -->
enter-active-class="transition duration-200 ease-out"
enter-from-class="opacity-0 scale-95"
enter-to-class="opacity-100 scale-100"
leave-active-class="transition duration-150 ease-in"
leave-from-class="opacity-100 scale-100"
leave-to-class="opacity-0 scale-95"
```

禁止使用 `animate-pulse` 等持续动画；禁止超过 `duration-300` 的过渡时长。

---

## 十三、图标规范

使用 **FontAwesome Free 6.x**，统一使用 `fas`（Solid 实心），部分语义场景可用 `far`（Regular 线条），同一组件内不混用。

### 图标容器
```html
<!-- 圆形（统计卡片） -->
<div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
  <i class="fas fa-chart-bar text-blue-600 dark:text-blue-400 text-xl"></i>
</div>

<!-- 方形 -->
<div class="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
  <i class="fas fa-icon text-indigo-600 dark:text-indigo-400"></i>
</div>
```

---

## 十四、图表规范（ECharts）

- 组件内 `import * as echarts from 'echarts'`，构建时外部化，不打包
- 挂载时 `echarts.init`，卸载时必须 `chart?.dispose()`
- 监听 resize 并节流（100–200ms），避免频繁重绘
- 暗色模式切换时重新 `dispose` + `init`，或重新 `setOption`

```typescript
onMounted(() => {
  chart = echarts.init(chartRef.value, props.theme === 'dark' ? 'dark' : undefined)
  window.addEventListener('resize', resizeThrottled)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeThrottled)
  chart?.dispose()
})
```

---

## 十五、AI 提示词（UI 相关）

### 新建组件（含 UI 要求）
```
请创建一个 Vue 3 UMD 组件，UI 设计要求如下：

【布局】[描述布局，如：卡片式、列表式、统计数字+图标等]
【色彩】遵循项目标准色板，所有颜色类必须同时写 dark: 版本
【圆角】卡片用 rounded-xl，按钮/输入框用 rounded-lg
【间距】卡片内边距 p-6，卡片间距 gap-4
【图标】FontAwesome fas 系列，图标+文字组合用 flex items-center gap-2
【动效】hover 用 transition-colors，弹出层用 scale+opacity 动画

请严格遵循以上 UI 规范生成组件代码。
```

### 修复 dark mode 问题
```
请检查组件中所有颜色相关的 Tailwind 类，补全缺失的 dark: 版本。
参考色板：
- 背景：bg-white → dark:bg-slate-900 / bg-slate-50 → dark:bg-slate-800
- 文字：text-slate-900 → dark:text-white / text-slate-500 → dark:text-slate-400
- 边框：border-slate-200 → dark:border-slate-700
- 悬停：hover:bg-slate-100 → dark:hover:bg-slate-700/50
```
