 # UMD 读取指南
 
 本指南总结如何在打包生成 UMD 文件后，识别库的身份、文件名以及包含的组件，并在运行时读取这些信息。
 
 ## 目标
 - 确认 UMD 库名、文件名、外部依赖全局变量
 - 获取库内包含的组件清单
 - 在浏览器与 Node 环境读取库信息
 - 获取组件级元信息（名称、版本、作者等）
 
 ## 构建配置识别
 - 构建配置位置：`vite.config.ts`
 - 关键字段：
   - `build.lib.name`: UMD 全局变量名（本项目为 `VueComponent`）
   - `build.lib.fileName`: 输出文件名（本项目为 `kivii-component-demo-library.umd.js`）
   - `build.lib.formats`: 输出格式（本项目为 `umd`）
   - `rollupOptions.external/globals`: 外部依赖与全局映射（本项目将 `vue` 外部化，对应全局 `Vue`）
 
 ## 浏览器环境读取
 在浏览器中先引入 Vue（满足外部依赖），再引入 UMD 文件：
 
 ```html
 <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
 <script src="/dist/kivii-component-demo-library.umd.js"></script>
 <script>
   // UMD 全局对象
   const lib = window.VueComponent
 
   // 若入口暴露了 manifest（已在 src/build.ts 添加）
   console.log('库名:', lib.manifest.libName)             // VueComponent
   console.log('格式:', lib.manifest.format)               // umd
   console.log('文件:', lib.manifest.fileName)             // kivii-component-demo-library.umd.js
   console.log('组件清单:', lib.manifest.components)       // ['KvcCard', 'KvcCardChild', ...]
 
   // 枚举所有导出键（含 default、install、各组件等）
   console.log('所有导出键:', Object.keys(lib))
 </script>
 ```
 
 说明：
 - UMD 全局对象名称来自 `build.lib.name`
 - 若压缩设置对属性名做了混淆（默认不会），请使用 `Object.keys(lib)` 来枚举导出，再按需筛选
 
 ## Node/脚本环境读取
 UMD 包可被 `require` 加载（在 ESM 中可用 `createRequire`）：
 
 ```js
 // ESM 环境下：
 import { createRequire } from 'node:module'
 const require = createRequire(import.meta.url)
 
 // 加载 UMD 文件
 const lib = require('./dist/kivii-component-demo-library.umd.js')
 
 // 读取库级 manifest 与导出键
 console.log(lib.manifest)
 console.log(Object.keys(lib)) // ['default','install','KvcCard',...,'manifest']
 ```
 
 ## 组件级元信息（manifest）
 本项目各组件在内部通过 `defineExpose({ manifest })` 暴露了 `manifest` 对象，可在运行时读取组件的名称、描述、版本、作者等：
 
 ```html
 <div id="app"></div>
 <script type="module">
   import { createApp, ref } from 'vue'
   // 假设通过 UMD 全局读取
   const { ThemeSwitchTest } = window.VueComponent
 
   const App = {
     template: '<ThemeSwitchTest ref="comp" />',
     setup() {
       const comp = ref()
       setTimeout(() => {
         // 组件挂载后读取暴露的 manifest
         console.log(comp.value.manifest)
       }, 0)
       return { comp }
     },
     components: { ThemeSwitchTest }
   }
 
   createApp(App).mount('#app')
 </script>
 ```
 
 每个组件内部的 manifest 结构：
 ```typescript
 {
   name: string        // 组件名称
   type: string        // 类型（如 'component'）
   description: string // 组件描述
   version: string     // 组件版本
   author: string      // 组件作者
 }
 ```
 
 ## 库级清单（入口增强）
 为方便识别库内容，入口文件已增加 `manifest` 字段（位置：`src/build.ts`）：
 
 ```ts
 export const manifest = {
   libName: "VueComponent",
   format: "umd",
   fileName: "kivii-component-demo-library.umd.js",
   components: Object.keys(components),
 }
 
 export default {
   install,
   ...components,
   manifest,
 }
 
 export const VueDemoComponent = {
   install,
   ...components,
   manifest,
 }
 ```
 
 读取方式：
 - 浏览器：`window.VueComponent.manifest`
 - Node：`require('./dist/xxx.umd.js').manifest`
 
 ## 进阶与注意事项
 - 多模块 UMD：若希望“模块即文件”，可把每个模块作为独立入口，单独产出 UMD 文件（如 `ProductClassification.umd.js`、`RiskEvaluation.umd.js`）。UMD 更适合同一时间一个入口。
 - 文件头标注：可在 Rollup/Vite 中配置 `output.banner`，将库名/版本/组件摘要写入文件头，便于人工查看。
 - 外部依赖：确保先以全局变量方式提供外部依赖（本项目为 `vue`→`Vue`），否则 UMD 在浏览器中不可用。
 - 枚举导出：若属性名被压缩/混淆，可使用 `Object.keys(window.VueComponent)` 获取导出键，再按需过滤。
 
