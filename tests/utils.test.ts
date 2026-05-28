import { describe, it, expect, vi, afterEach } from 'vitest'
import { debounce, toPascalCase, getBridge } from '../src/build/utils'

const setMockWindow = (kivii?: unknown) => {
  Object.defineProperty(globalThis, 'window', {
    value: { kivii },
    writable: true,
    configurable: true,
  })
}

describe('debounce', () => {
  afterEach(() => { vi.useRealTimers() })

  it('在 wait 时间内只执行一次', async () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const debounced = debounce(fn, 100)
    debounced()
    debounced()
    debounced()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })
})

describe('toPascalCase', () => {
  it('kebab-case 转 PascalCase', () => {
    expect(toPascalCase('theme-switch-test')).toBe('ThemeSwitchTest')
  })

  it('snake_case 转 PascalCase', () => {
    expect(toPascalCase('my_component')).toBe('MyComponent')
  })

  it('单个单词首字母大写', () => {
    expect(toPascalCase('button')).toBe('Button')
  })
})

describe('getBridge', () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'window')
  })

  it('window.kivii 未初始化时返回 null', () => {
    setMockWindow()
    const result = getBridge()
    expect(result).toBeNull()
  })

  it('window.kivii 已初始化时返回 bridge 对象', () => {
    const mockBridge = { request: vi.fn() }
    setMockWindow(mockBridge)
    const result = getBridge()
    expect(result).toBe(mockBridge)
  })
})
