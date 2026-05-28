import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ThemeSwitchTest from '../src/build/components/ThemeSwitchTest.vue'

describe('ThemeSwitchTest 组件', () => {
  it('默认使用 light 主题', () => {
    const wrapper = mount(ThemeSwitchTest)
    // 根节点 class 不含 dark
    expect(wrapper.classes()).not.toContain('dark')
  })

  it('传入 dark 主题时根节点含 dark 类', () => {
    const wrapper = mount(ThemeSwitchTest, { props: { theme: 'dark' } })
    expect(wrapper.classes()).toContain('dark')
  })

  it('点击按钮触发 toggle-theme 事件', async () => {
    const wrapper = mount(ThemeSwitchTest)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('toggle-theme')).toBeTruthy()
    expect(wrapper.emitted('toggle-theme')!.length).toBe(1)
  })

  it('通过 defineExpose 暴露 manifest', () => {
    const wrapper = mount(ThemeSwitchTest)
    const exposed = wrapper.vm as unknown as { manifest: { name: string } }
    expect(exposed.manifest).toBeDefined()
    expect(exposed.manifest.name).toBe('ThemeSwitchTest')
  })
})
