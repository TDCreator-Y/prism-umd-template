# Dashboard LightWeight UMD Template

**A lightweight Vue 3 component library template that builds to a single UMD file — drop-in ready for any HTML page or low-code platform.**

[中文文档](#中文说明) | [English](#english)

---

## English

### What is this?

This template helps you build **self-contained Vue 3 component libraries** that:

- Output a **single `.umd.js` file** with all styles inlined (no separate CSS)
- Work in plain HTML via `<script>` tag — no bundler required on the consumer side
- Support **dark mode** out of the box via Tailwind CSS `class` strategy
- Integrate with platforms like **Kivii Dashboard** through a bridge API

### Tech Stack

| Tool | Version | Role |
|------|---------|------|
| Vue 3 | ^3.4 | Component framework |
| Vite | ^5.0 | Build tool |
| TypeScript | ^5.0 | Type safety |
| Tailwind CSS | ^3.4 | Utility-first styling |
| ECharts | ^6.0 | Chart rendering (external) |
| @kivii.com/bridge | ^1.1 | Platform bridge API |

### Quick Start

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build UMD library
pnpm build
```

The output is a single file at `dist/kivii-component-demo-library.umd.js`.

### Using the Built Library

```html
<!-- 1. Load peer dependencies (must be provided by the host page) -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

<!-- 2. Load the library — styles are auto-injected, no separate CSS needed -->
<script src="./dist/kivii-component-demo-library.umd.js"></script>

<div id="app"></div>

<!-- 3. Mount and use components -->
<script>
  const { createApp, ref } = Vue
  const { install } = window.VueComponent

  const app = createApp({
    template: `
      <theme-switch-test :theme="theme" @toggle-theme="toggle" />
    `,
    setup() {
      const theme = ref('light')
      const toggle = () => { theme.value = theme.value === 'light' ? 'dark' : 'light' }
      return { theme, toggle }
    }
  })

  app.use(install)   // registers all exported components globally
  app.mount('#app')
</script>
```

### Adding a New Component

1. Create `src/build/components/MyWidget.vue`
2. Export it in `src/build/components/index.ts`
3. Register it in `src/build.ts` manifest

See [Development Guide](doc/DEVELOPMENT_GUIDE.md) for full details.

### Project Structure

```
├── plugins/                  # Local Vite plugins
│   └── vite-plugin-inline-css.ts
├── src/
│   ├── build/                # Library source
│   │   ├── components/       # Component files
│   │   ├── types/            # TypeScript types
│   │   └── build.ts          # Library entry point
│   └── dev/                  # Dev sandbox (not shipped)
├── doc/                      # Documentation
├── dist/                     # Build output
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

### Key Design Decisions

- **CSS inlined into JS** — `vite-plugin-css-injected-by-js` injects styles at runtime, so consumers import one file only
- **Tailwind `preflight: false`** — prevents global style reset from leaking into host pages
- **Vue externalized** — the host page must provide `Vue` globally; keeps bundle size minimal
- **ECharts externalized** — loaded separately; accessed via `window.echarts` to avoid duplication

### Documentation

| Document | Description |
|----------|-------------|
| [Development Guide](doc/DEVELOPMENT_GUIDE.md) | Component development workflow |
| [Tailwind Isolation Guide](doc/TAILWIND_ISOLATION_GUIDE.md) | Style scoping strategy |
| [UMD Usage Guide](doc/UMD读取指南.md) | How to consume the UMD bundle |
| [UI Design Spec](doc/ui-design-spec.md) | Visual design standards |
| [AI Coding Standards](doc/AI_CODING_STANDARDS.md) | Coding conventions |

### License

[MIT](LICENSE) © 2024 高源

---

## 中文说明

### 这是什么？

这是一个 **Vue 3 组件库开发模板**，专为以下场景设计：

- 构建产物为**单个 `.umd.js` 文件**，样式内联其中，无需独立 CSS 文件
- 支持在**纯 HTML 页面**通过 `<script>` 标签直接引入，无需构建环境
- 内置 **深色模式**支持（Tailwind CSS `class` 策略）
- 可与 **Kivii Dashboard** 等低代码平台通过 Bridge API 集成

### 技术栈

| 工具 | 版本 | 用途 |
|------|------|------|
| Vue 3 | ^3.4 | 组件框架 |
| Vite | ^5.0 | 构建工具 |
| TypeScript | ^5.0 | 类型安全 |
| Tailwind CSS | ^3.4 | 原子化样式 |
| ECharts | ^6.0 | 图表渲染（外部依赖） |
| @kivii.com/bridge | ^1.1 | 平台桥接 API |

### 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建组件库
pnpm build
```

构建产物位于 `dist/kivii-component-demo-library.umd.js`。

### 在 HTML 中使用

```html
<!-- 1. 加载对等依赖（必须由宿主页面提供） -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

<!-- 2. 加载组件库（样式已内联，无需单独 CSS） -->
<script src="./dist/kivii-component-demo-library.umd.js"></script>

<div id="app"></div>

<script>
  const { createApp, ref } = Vue
  const { install } = window.VueComponent

  const app = createApp({
    template: `
      <theme-switch-test :theme="theme" @toggle-theme="toggle" />
    `,
    setup() {
      const theme = ref('light')
      const toggle = () => { theme.value = theme.value === 'light' ? 'dark' : 'light' }
      return { theme, toggle }
    }
  })

  app.use(install)  // 全局注册所有导出的组件
  app.mount('#app')
</script>
```

### 新增组件流程

1. 在 `src/build/components/` 下创建 `MyWidget.vue`
2. 在 `src/build/components/index.ts` 中导出
3. 在 `src/build.ts` 的 `manifest` 中补充元数据

详见 [开发指南](doc/DEVELOPMENT_GUIDE.md)。

### 设计说明

- **样式内联**：使用 `vite-plugin-css-injected-by-js`，构建时将 CSS 转为 JS 字符串，运行时自动插入 `<style>` 标签
- **关闭 Tailwind Preflight**：防止全局样式重置污染宿主页面
- **Vue 外部化**：宿主页面自行提供 Vue，减小包体积
- **ECharts 外部化**：通过 `window.echarts` 访问，避免重复打包

### 许可证

[MIT](LICENSE) © 2024 高源
