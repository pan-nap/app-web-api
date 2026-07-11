import { setActivePinia, createPinia } from 'pinia'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { useDictionaryStore } from '../dictionary'

const mockLocalStorage = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value }),
    clear: vi.fn(() => { store = {} })
  }
})()

Object.defineProperty(global, 'localStorage', { value: mockLocalStorage })

vi.mock('hs-admin-ui', () => ({
  Utils: {
    useRequest: vi.fn()
  }
}))

const { Utils } = await import('hs-admin-ui')

describe('字典Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockLocalStorage.clear()
  })

  it('getDictionary 应在 key 不存在时返回空数组', () => {
    const store = useDictionaryStore()
    const result = store.getDictionary('nonexistent')
    expect(result).toEqual([])
  })

  it('getDictionary 应为已存在的 key 返回字典项', () => {
    const store = useDictionaryStore()
    mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify({
      school: [{ label: '第一学校', value: 'school1' }],
      grade: [{ label: '一年级', value: 'grade1' }]
    }))

    const result = store.getDictionary('school')
    expect(result).toEqual([{ label: '第一学校', value: 'school1' }])
  })

  it('fetchDictionaries 应调用 Utils.useRequest 并更新 localStorage', async () => {
    const store = useDictionaryStore()
    const mockData = {
      school: [{ label: '第一学校', value: 'school1' }],
      grade: [{ label: '一年级', value: 'grade1' }]
    }
    ;(Utils.useRequest as any).mockResolvedValue({ data: mockData })

    const result = await store.fetchDictionaries()

    expect(Utils.useRequest).toHaveBeenCalledWith('/sf-web/dictionary', {}, 'get')
    expect(result).toEqual(mockData)
  })

  it('addDictionary 应以 POST 方法调用 Utils.useRequest', async () => {
    const store = useDictionaryStore()
    const dictData = { type: 'school', label: '第二学校', value: 'school2', sort_order: 1 }
    ;(Utils.useRequest as any).mockResolvedValue({ data: { id: 1 } })

    const result = await store.addDictionary(dictData)

    expect(Utils.useRequest).toHaveBeenCalledWith('/sf-web/dictionary', dictData, 'post')
    expect(result).toEqual({ data: { id: 1 } })
  })

  it('updateDictionary 应以 PUT 方法调用 Utils.useRequest', async () => {
    const store = useDictionaryStore()
    const dictData = { label: '更新后的标签' }
    ;(Utils.useRequest as any).mockResolvedValue({ data: null })

    const result = await store.updateDictionary(1, dictData)

    expect(Utils.useRequest).toHaveBeenCalledWith('/sf-web/dictionary/1', dictData, 'put')
    expect(result).toEqual({ data: null })
  })

  it('deleteDictionary 应以 DELETE 方法调用 Utils.useRequest', async () => {
    const store = useDictionaryStore()
    ;(Utils.useRequest as any).mockResolvedValue({ data: null })

    const result = await store.deleteDictionary(1)

    expect(Utils.useRequest).toHaveBeenCalledWith('/sf-web/dictionary/1', {}, 'delete')
    expect(result).toEqual({ data: null })
  })
})
