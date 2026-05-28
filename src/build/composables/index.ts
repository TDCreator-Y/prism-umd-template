/**
 * 组合式函数集合（统一导出）
 */

import { ref, readonly } from 'vue'

/**
 * 主题状态管理 Composable。
 *
 * 提供响应式的主题值和切换函数，适用于需要在多个组件间共享主题状态的场景。
 * 若主题由父组件通过 prop 控制，则无需使用此 composable，直接接收 prop 即可。
 *
 * @example
 * ```ts
 * const { theme, toggleTheme, setTheme } = useTheme()
 * ```
 */
export function useTheme(initial: 'light' | 'dark' = 'light') {
  const theme = ref<'light' | 'dark'>(initial)

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  const setTheme = (value: 'light' | 'dark') => {
    theme.value = value
  }

  return {
    theme: readonly(theme),
    toggleTheme,
    setTheme,
  }
}
