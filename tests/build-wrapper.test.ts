import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { describe, expect, it } from 'vitest'
import { ThemeSwitchTest } from '../src/build'
import { WRAPPER_CLASS_NAME } from '../src/build/constants'

describe('build 导出包装组件', () => {
  it('为 ThemeSwitchTest 注入样式隔离包裹层并透传 props', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () => h(ThemeSwitchTest, { theme: 'dark' }),
      })
    )

    expect(html).toContain(WRAPPER_CLASS_NAME)
    expect(html).toContain('class="dark w-full transition-colors duration-300"')
    expect(html).toContain('Theme Switch Test Module')
  })
})
