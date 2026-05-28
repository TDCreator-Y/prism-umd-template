import { describe, it, expect } from 'vitest'
import { manifest, VueDemoComponent, install } from '../src/build'

describe('Library manifest', () => {
  it('包含所有必需字段', () => {
    expect(manifest).toHaveProperty('libName')
    expect(manifest).toHaveProperty('format')
    expect(manifest).toHaveProperty('fileName')
    expect(manifest).toHaveProperty('zhName')
    expect(manifest).toHaveProperty('version')
    expect(manifest).toHaveProperty('components')
    expect(manifest).toHaveProperty('componentsMap')
    expect(manifest).toHaveProperty('componentsDetailed')
  })

  it('format 为合法的 LibraryFormat 值', () => {
    expect(['umd', 'cjs', 'esm']).toContain(manifest.format)
  })

  it('components 列表非空且与 componentsMap 键一致', () => {
    expect(manifest.components.length).toBeGreaterThan(0)
    for (const name of manifest.components) {
      expect(manifest.componentsMap).toHaveProperty(name)
    }
  })

  it('componentsDetailed 与 components 数量一致', () => {
    expect(manifest.componentsDetailed.length).toBe(manifest.components.length)
  })

  it('componentsDetailed 每项含 name / zhName / icon / description', () => {
    for (const item of manifest.componentsDetailed) {
      expect(item).toHaveProperty('name')
      expect(item).toHaveProperty('zhName')
      expect(item).toHaveProperty('icon')
      expect(item).toHaveProperty('description')
    }
  })
})

describe('Library 导出完整性', () => {
  it('install 是函数', () => {
    expect(typeof install).toBe('function')
  })

  it('VueDemoComponent 包含 install 和 manifest', () => {
    expect(VueDemoComponent).toHaveProperty('install')
    expect(VueDemoComponent).toHaveProperty('manifest')
    expect(VueDemoComponent.manifest).toStrictEqual(manifest)
  })
})
