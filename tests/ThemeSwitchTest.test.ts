import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { describe, it, expect } from 'vitest'
import ThemeSwitchTest from '../src/build/components/ThemeSwitchTest.vue'

const renderComponent = (props?: Record<string, unknown>) =>
  renderToString(
    createSSRApp({
      render: () => h(ThemeSwitchTest, props),
    })
  )

describe('ThemeSwitchTest 组件', () => {
  it('默认使用 light 主题', async () => {
    const html = await renderComponent()
    expect(html).toContain('w-full transition-colors duration-300')
    expect(html).not.toContain('class="dark')
  })

  it('传入 dark 主题时根节点含 dark 类', async () => {
    const html = await renderComponent({ theme: 'dark' })
    expect(html).toContain('class="dark w-full transition-colors duration-300"')
  })

  it('声明 toggle-theme 事件', () => {
    const emits = (ThemeSwitchTest as unknown as { emits?: string[] | Record<string, unknown> }).emits

    if (Array.isArray(emits)) {
      expect(emits).toContain('toggle-theme')
      return
    }

    expect(emits).toBeDefined()
    expect(emits).toHaveProperty('toggle-theme')
  })

  it('渲染主题标识文本', async () => {
    const html = await renderComponent({ theme: 'dark' })
    expect(html).toContain('Current Theme:')
    expect(html).toContain('dark')
  })
})
