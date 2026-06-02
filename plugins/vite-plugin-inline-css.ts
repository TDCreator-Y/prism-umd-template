import type { Plugin } from 'vite';
import { readFileSync, existsSync, unlinkSync, writeFileSync, readdirSync } from 'fs';
import { resolve } from 'path';

/** 防重复注入标记，注入后写入 JS 文件首行 */
const INJECT_MARKER = '/*__kivii-css-injected__*/';

/**
 * 按优先级尝试多种 UMD 包装器正则，返回注入位置索引。
 * 匹配失败时返回 -1。
 */
function findUmdInsertIndex(jsContent: string): number {
  const patterns = [
    /\(function\s*\(global\s*,\s*factory\s*\)\s*\{/,  // 标准 UMD (global, factory)
    /\(function\s*\([^)]*\)\s*\{/,                     // 通用 UMD (任意参数)
    /!function\s*\([^)]*\)\s*\{/,                      // 压缩版 !function
  ];

  for (const pattern of patterns) {
    const match = jsContent.match(pattern);
    if (match !== null && match.index !== undefined) {
      return match.index + match[0].length;
    }
  }

  return -1;
}

/**
 * Vite 插件：构建完成后将生成的 style.css 内联注入到 .umd.js 文件中。
 *
 * 消费端只需引入单个 .umd.js，无需额外加载 CSS 文件。
 * 注入代码在 IIFE 中动态创建 <style> 标签，对 SSR 环境安全（检测 document）。
 */
export function inlineCss(): Plugin {
  // 默认回退到 cwd/dist；configResolved 时替换为 Vite 实际解析出的 outDir，
  // 避免使用方自定义 build.outDir 后插件找不到产物。
  let resolvedOutDir = resolve(process.cwd(), 'dist');

  return {
    name: 'inline-css',
    configResolved(config) {
      // outDir 可能是绝对路径（resolve 会忽略 root）或相对 root 的路径
      resolvedOutDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const outDir = resolvedOutDir;
      const cssFile = resolve(outDir, 'style.css');

      if (!existsSync(cssFile)) {
        return;
      }

      const files = readdirSync(outDir);
      const umdFile = files.find(file => file.endsWith('.umd.js'));

      if (!umdFile) {
        console.warn('[inline-css] 未找到 .umd.js 文件，跳过 CSS 内联');
        return;
      }

      const jsFile = resolve(outDir, umdFile);
      const cssContent = readFileSync(cssFile, 'utf-8');
      let jsContent = readFileSync(jsFile, 'utf-8');

      if (jsContent.startsWith(INJECT_MARKER)) {
        console.info('[inline-css] CSS 已注入，跳过重复操作');
        return;
      }

      const cssInjectionCode = `(function(){if(typeof document==='undefined')return;var s=document.createElement('style');s.textContent=${JSON.stringify(cssContent)};document.head.appendChild(s);})();`;

      const insertIndex = findUmdInsertIndex(jsContent);

      if (insertIndex !== -1) {
        jsContent =
          INJECT_MARKER +
          jsContent.slice(0, insertIndex) +
          cssInjectionCode +
          jsContent.slice(insertIndex);
      } else {
        // 降级：在文件头部注入，并打印警告供排查
        console.warn('[inline-css] 未识别 UMD 包装器格式，降级至文件头部注入');
        jsContent = INJECT_MARKER + cssInjectionCode + jsContent;
      }

      writeFileSync(jsFile, jsContent, 'utf-8');
      unlinkSync(cssFile);

      console.info(`[inline-css] CSS 已成功内联至 ${umdFile}`);
    },
  };
}