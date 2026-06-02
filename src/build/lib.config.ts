/**
 * UMD 库的单一事实源配置。
 *
 * 此文件仅含纯字符串常量，不引入 Vue / CSS 等副作用依赖，
 * 因此可被 vite.config.ts 与 src/build.ts 同时安全 import，避免全局名 / 文件名分散硬编码后漂移。
 */

/**
 * 挂载到 window 的 UMD 全局变量名。
 *
 * ⚠️ 每个基于本模板派生的组件库都必须改为**全局唯一**的名称，
 * 否则在宿主（如 prism-admin-web）同时加载多个库时，后加载者会覆盖
 * 同名的 window 全局变量，导致组件错乱。
 */
export const LIB_NAME = 'VueComponent';

/** 构建产物文件名，vite.config 的 fileName 与 manifest.fileName 共用此值。 */
export const LIB_FILE_NAME = 'kivii-component-demo-library.umd.js';
