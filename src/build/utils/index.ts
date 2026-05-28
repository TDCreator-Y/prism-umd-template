/**
 * 工具函数集合（统一导出）
 */

/**
 * 安全读取 window.kivii Bridge 对象，若未初始化则返回 null 并打印警告。
 * 使用前调用此函数代替直接访问 window.kivii，避免因宿主未注入 Bridge 导致静默崩溃。
 */
export function getBridge(): NonNullable<Window['kivii']> | null {
  if (typeof window === 'undefined' || !window.kivii?.request) {
    console.warn('[Bridge] window.kivii 未初始化，请确认宿主环境已加载 Bridge 脚本')
    return null
  }
  return window.kivii
}

/**
 * 函数防抖：在 wait 毫秒内重复调用时，只执行最后一次。
 *
 * @param fn - 需要防抖的函数
 * @param wait - 等待时长（毫秒），默认 300ms
 */
export function debounce<T extends (...args: unknown[]) => void>(fn: T, wait = 300): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timer !== null) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), wait)
  }
}

/**
 * 将 kebab-case 或 snake_case 字符串转为 PascalCase，用于组件名称规范化。
 *
 * @example toPascalCase('theme-switch-test') // 'ThemeSwitchTest'
 */
export function toPascalCase(str: string): string {
  return str.replace(/[-_](.)/g, (_, c: string) => c.toUpperCase()).replace(/^./, s => s.toUpperCase())
}
