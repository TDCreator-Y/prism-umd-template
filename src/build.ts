/**
 * 打包配置文件
 */
import "./style.css";
import type { App, Component } from "vue";
import type { LibraryManifest } from "@/build/types";
import { h, defineComponent } from "vue";
import { ThemeSwitchTest as _ThemeSwitchTest } from "@/build/components";
import { WRAPPER_CLASS_NAME } from "@/build/constants";

// 组件类型定义（只有需要传递参数的组件才需要定义类型）
export type { Props as ThemeSwitchTestProps } from "@/build/components/ThemeSwitchTest.vue";

// 导出组件
export { ThemeSwitchTest, install };

/**
 * Vue SFC 内部字段类型，兼容 <script setup> 编译产物和 Options API 两种写法
 */
type WrappableComponent = Component & {
  __name?: string;
  props?: Record<string, unknown>;
  emits?: string[] | Record<string, unknown>;
};

/**
 * 为组件自动添加样式隔离包装层的高阶组件 (HOC)
 *
 * 通过在组件外层包裹一个带有 `.kivii-demo-lib-wrapper` 类的 div，
 * 结合 tailwind.config.js 中的 important 配置，实现 CSS 样式自动隔离。
 * 同时完整透传 props、attrs 和 slots，对消费方透明。
 *
 * @param component - 要包装的原始 Vue 组件（支持 script setup 和 Options API）
 * @returns 包装后的新 Vue 组件，行为与原组件一致
 */
const withWrapper = (component: WrappableComponent) =>
  defineComponent({
    // __name 是 <script setup> 编译产物中的文件名来源，优先使用
    name: component.__name || (component as Record<string, unknown>).name as string || "WrappedComponent",
    inheritAttrs: false,
    props: (component.props ?? {}) as Record<string, unknown>,
    emits: (component.emits ?? []) as string[],
    setup(props, { attrs, slots }) {
      return () =>
        h(
          "div",
          { class: WRAPPER_CLASS_NAME, style: "width:100%;height:100%;" },
          [h(component as Component, { ...props, ...attrs }, slots)]
        );
    },
  });

const ThemeSwitchTest = withWrapper(_ThemeSwitchTest);

const components = {
  ThemeSwitchTest,
};

/**
 * Vue Plugin install 函数，将所有组件全局注册到 app 实例。
 * 用法：`app.use(install)` 或 `app.use(window.VueComponent)`
 */
const install = (app: App) => {
  Object.keys(components).forEach((key) => {
    const component = components[key as keyof typeof components];
    app.component(key, component);
  });
};

export const manifest: LibraryManifest = {
  libName: "VueComponent",
  format: "umd",
  fileName: "kivii-component-demo-library.umd.js",
  zhName: "组件库 UMD 包",
  author: "Kivii & Wemt Team",
  version: "1.0.0",
  description: "Kivii Component 组件库 UMD 包，提供基础演示组件。",
  components: Object.keys(components),
  componentsMap: {
    ThemeSwitchTest: "Test module for verifying theme switching capabilities with pure Tailwind CSS.",
  },
  componentsDetailed: [
    { name: "ThemeSwitchTest", zhName: "主题测试", icon: "fas fa-palette", description: "Test module for verifying theme switching capabilities with pure Tailwind CSS." },
  ],
};

/** 默认导出，支持 `import lib from '...'` 按需引入 */
export default {
  install,
  ...components,
  manifest,
};

/**
 * UMD 全局变量导出对象，挂载在 `window.VueComponent`。
 * 消费方通过 `const { install, ThemeSwitchTest, manifest } = window.VueComponent` 使用。
 */
export const VueDemoComponent = {
  install,
  ...components,
  manifest,
};
