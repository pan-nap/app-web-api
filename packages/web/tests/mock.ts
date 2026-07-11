import { vi } from 'vitest'

const mockLocalStorage = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value }),
    removeItem: vi.fn((key: string) => { delete store[key] }),
    clear: vi.fn(() => { store = {} }),
    get length() { return Object.keys(store).length },
    key: vi.fn((i: number) => Object.keys(store)[i] || null)
  }
})()

Object.defineProperty(global, 'localStorage', { value: mockLocalStorage })

export const resetLocalStorage = () => {
  mockLocalStorage.clear()
  vi.clearAllMocks()
}

export const setLocalStorageItem = (key: string, value: any) => {
  const stringValue = typeof value === 'string' ? value : JSON.stringify(value)
  mockLocalStorage.setItem(key, stringValue)
}

export { mockLocalStorage }
