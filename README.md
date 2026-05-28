# Prism UMD Template

[中文](#中文) | [English](#english)

---

<a id="中文"></a>

# Vue 3 UMD 组件库模板

基于 Vue 3 + Vite + TypeScript 构建的 UMD 组件库模板，构建产物为单个 `.umd.js` 文件，可直接通过 `<script>` 标签引入任何 HTML 页面或低代码平台，无需打包工具。

## 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 前端框架 | Vue 3 | 3.4.x |
| 构建工具 | Vite | 5.x |
| 类型系统 | TypeScript | 5.x |
| 样式框架 | Tailwind CSS | 3.4.x |
| 图表库 | ECharts | 6.x（外部化） |
| 测试框架 | Vitest + Vue Test Utils | 1.x / 2.4.x |
| 包管理器 | pnpm | 10.x |

## 核心特性

- **单文件输出**：CSS 自动内联到 UMD JS，部署只需一个文件
- **样式隔离**：所有 Tailwind 样式加 `.kivii-demo-lib-wrapper` 前缀，不污染宿主页面
- **外部化依赖**：Vue、ECharts 由宿主页面提供，不打包进产物
- **组件清单（Manifest）**：每个组件携带名称、版本、描述等元数据，支持低代码平台自动发现
- **暗黑模式**：基于 Tailwind `class` 策略，支持 `dark:` 变体
- **HOC 自动包装**：`withWrapper` 高阶组件自动注入隔离容器，无需手动添加

## 构建产物

```
dist/
└── kivii-component-demo-library.umd.js   # 单文件产物，含内联 CSS
```

**宿主页面使用方式：**

```html
<!-- 前置依赖由宿主提供 -->
<script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js"></script>

<!-- 引入组件库 -->
<script src="./kivii-component-demo-library.umd.js"></script>

<script>
  // 全局注册所有组件
  const app = Vue.createApp({})
  app.use(window.VueComponent)

  // 或单独使用某个组件
  const { MyComponent } = window.VueComponent
</script>
```

## 环境要求

- Node.js `>=18.0.0`
- pnpm `>=10.x`

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建 UMD 产物
pnpm build

# 构建（含类型检查）
pnpm build:check
```

## 常用脚本

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发沙箱（Hot Reload） |
| `pnpm build` | 构建 UMD 产物 |
| `pnpm build:check` | 类型检查 + 构建 |
| `pnpm type-check` | vue-tsc 类型检查 |
| `pnpm lint` | ESLint 代码检查 |
| `pnpm lint:fix` | ESLint 自动修复 |
| `pnpm format` | Prettier 格式化 |
| `pnpm test` | 单次运行单元测试 |
| `pnpm test:watch` | Watch 模式单元测试 |

## 测试

使用 **Vitest** + **Vue Test Utils** + **jsdom**，测试文件位于 `tests/` 目录。

```bash
pnpm test          # 单次运行
pnpm test:watch    # Watch 模式
```

测试覆盖组件行为、库 Manifest 完整性、工具函数（防抖、类名转换、Bridge 获取）等。

## 项目结构

```
src/
├── build/               # 打包到 UMD 产物的源码
│   ├── components/      # 业务组件（唯一合法位置）
│   ├── composables/     # 组合式函数
│   ├── types/           # TypeScript 类型定义
│   ├── utils/           # 工具函数（含 getBridge）
│   └── constants.ts     # 常量（WRAPPER_CLASS_NAME）
├── dev/                 # 开发沙箱（不打包）
│   ├── App.vue
│   └── views/
└── build.ts             # 库入口（组件注册、Manifest 定义）
```

## 新增组件

1. 创建 `src/build/components/NewComponent.vue`
2. 在 `src/build/components/index.ts` 中添加 `export { NewComponent }`
3. 在 `src/build.ts` 中用 `withWrapper()` 包裹并注册，同步更新 Manifest

## 文档

| 文档 | 说明 |
|------|------|
| `doc/DEVELOPMENT_GUIDE.md` | 组件开发工作流 |
| `doc/TAILWIND_ISOLATION_GUIDE.md` | Tailwind 样式隔离策略详解 |
| `doc/UMD读取指南.md` | UMD 包集成使用方法 |
| `doc/ui-design-spec.md` | UI 设计规范 |
| `rules/CLAUDE.md` | AI 编码规范 |

## 许可证

[MIT License](./LICENSE) © 郁子恒

---

<a id="english"></a>

# Vue 3 UMD Component Library Template

A Vue 3 + Vite + TypeScript component library template that builds to a single `.umd.js` file. Drop it into any HTML page or low-code platform via a `<script>` tag — no bundler required.

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Vue 3 | 3.4.x |
| Build Tool | Vite | 5.x |
| Type System | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.4.x |
| Charts | ECharts | 6.x (externalized) |
| Testing | Vitest + Vue Test Utils | 1.x / 2.4.x |
| Package Manager | pnpm | 10.x |

## Key Features

- **Single-file output** — CSS is automatically inlined into the UMD JS; deploy with one file
- **Style isolation** — All Tailwind styles are scoped under `.kivii-demo-lib-wrapper`, preventing host page pollution
- **Externalized dependencies** — Vue and ECharts are provided by the host page, not bundled into the output
- **Component Manifest** — Each component carries metadata (name, version, description) for automatic discovery by low-code platforms
- **Dark mode** — Tailwind `class`-based strategy with full `dark:` variant support
- **Auto HOC wrapping** — `withWrapper` HOC injects the isolation container automatically; no manual wrapping needed

## Build Output

```
dist/
└── kivii-component-demo-library.umd.js   # Single file with inlined CSS
```

**Usage in a host page:**

```html
<!-- Host provides Vue -->
<script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js"></script>

<!-- Load the component library -->
<script src="./kivii-component-demo-library.umd.js"></script>

<script>
  // Register all components globally
  const app = Vue.createApp({})
  app.use(window.VueComponent)

  // Or use a specific component
  const { MyComponent } = window.VueComponent
</script>
```

## Requirements

- Node.js `>=18.0.0`
- pnpm `>=10.x`

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development sandbox
pnpm dev

# Build UMD output
pnpm build

# Build with type checking
pnpm build:check
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev sandbox with Hot Reload |
| `pnpm build` | Build UMD output |
| `pnpm build:check` | Type-check and build |
| `pnpm type-check` | vue-tsc type checking |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Auto-fix ESLint issues |
| `pnpm format` | Prettier formatting |
| `pnpm test` | Run unit tests once |
| `pnpm test:watch` | Unit tests in watch mode |

## Testing

Uses **Vitest** + **Vue Test Utils** + **jsdom**. Test files are located in the `tests/` directory.

```bash
pnpm test          # Single run
pnpm test:watch    # Watch mode
```

Tests cover component behavior, library Manifest integrity, and utility functions (debounce, case conversion, Bridge access).

## Project Structure

```
src/
├── build/               # Source code compiled into UMD output
│   ├── components/      # Business components (only valid location)
│   ├── composables/     # Composition functions
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions (including getBridge)
│   └── constants.ts     # Constants (WRAPPER_CLASS_NAME)
├── dev/                 # Development sandbox (not bundled)
│   ├── App.vue
│   └── views/
└── build.ts             # Library entry (component registration, Manifest)
```

## Adding a New Component

1. Create `src/build/components/NewComponent.vue`
2. Export it from `src/build/components/index.ts`
3. Wrap with `withWrapper()` and register in `src/build.ts`, then update the Manifest

## Documentation

| Document | Description |
|----------|-------------|
| `doc/DEVELOPMENT_GUIDE.md` | Component development workflow |
| `doc/TAILWIND_ISOLATION_GUIDE.md` | Tailwind style isolation strategy |
| `doc/UMD读取指南.md` | UMD package integration guide |
| `doc/ui-design-spec.md` | UI design specification |
| `rules/CLAUDE.md` | AI coding standards |

## License

[MIT License](./LICENSE) © Yu Ziheng
