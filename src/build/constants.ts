/**
 * 样式隔离包裹层的 CSS 类名。
 *
 * 此值同时用于：
 *   1. src/build.ts — withWrapper HOC 中注入的 div className
 *   2. tailwind.config.js — important 选择器前缀
 *
 * ⚠️ 修改此处后必须同步修改 tailwind.config.js 中的 important 字段，
 * 否则 Tailwind 生成的样式将无法匹配包裹层，导致样式隔离完全失效。
 */
export const WRAPPER_CLASS_NAME = 'kivii-demo-lib-wrapper';
