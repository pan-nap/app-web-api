import { setActivePinia, createPinia } from 'pinia'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { useStudentStore } from '../student'

vi.mock('hs-admin-ui', () => ({
  Utils: {
    useRequest: vi.fn()
  }
}))

const { Utils } = await import('hs-admin-ui')

describe('学生Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('getList 应以正确参数调用 Utils.useRequest', async () => {
    const store = useStudentStore()
    const mockResponse = { data: [{ id: 1, name: '张三' }] }
    ;(Utils.useRequest as any).mockResolvedValue(mockResponse)

    const result = await store.getList({ name: '张三', currentPage: 1, pageSize: 10 })

    expect(Utils.useRequest).toHaveBeenCalledWith('/sf-web/student', { name: '张三', currentPage: 1, pageSize: 10 }, 'get')
    expect(result).toEqual(mockResponse)
  })

  it('getById 应以正确 URL 调用 Utils.useRequest', async () => {
    const store = useStudentStore()
    const mockResponse = { data: { id: 1, name: '张三' } }
    ;(Utils.useRequest as any).mockResolvedValue(mockResponse)

    const result = await store.getById(1)

    expect(Utils.useRequest).toHaveBeenCalledWith('/sf-web/student/1', {}, 'get')
    expect(result).toEqual(mockResponse)
  })

  it('create 应以 POST 方法调用 Utils.useRequest', async () => {
    const store = useStudentStore()
    const studentData = { name: '李四', school: '第一学校' }
    const mockResponse = { data: { id: 2 } }
    ;(Utils.useRequest as any).mockResolvedValue(mockResponse)

    const result = await store.create(studentData)

    expect(Utils.useRequest).toHaveBeenCalledWith('/sf-web/student', studentData, 'post')
    expect(result).toEqual(mockResponse)
  })

  it('update 应以 PUT 方法调用 Utils.useRequest', async () => {
    const store = useStudentStore()
    const studentData = { name: '王五' }
    const mockResponse = { data: null }
    ;(Utils.useRequest as any).mockResolvedValue(mockResponse)

    const result = await store.update(1, studentData)

    expect(Utils.useRequest).toHaveBeenCalledWith('/sf-web/student/1', studentData, 'put')
    expect(result).toEqual(mockResponse)
  })

  it('deleteById 应以 DELETE 方法调用 Utils.useRequest', async () => {
    const store = useStudentStore()
    const mockResponse = { data: null }
    ;(Utils.useRequest as any).mockResolvedValue(mockResponse)

    const result = await store.deleteById(1)

    expect(Utils.useRequest).toHaveBeenCalledWith('/sf-web/student/1', {}, 'delete')
    expect(result).toEqual(mockResponse)
  })

  it('batchDelete 应以正确参数调用 Utils.useRequest', async () => {
    const store = useStudentStore()
    const ids = [1, 2, 3]
    const mockResponse = { data: null }
    ;(Utils.useRequest as any).mockResolvedValue(mockResponse)

    const result = await store.batchDelete(ids)

    expect(Utils.useRequest).toHaveBeenCalledWith('/sf-web/student/batch/delete', { ids }, 'post')
    expect(result).toEqual(mockResponse)
  })

  it('batchUpdate 应以 PUT 方法调用 Utils.useRequest', async () => {
    const store = useStudentStore()
    const updateData = { ids: [1, 2], status: 1 }
    const mockResponse = { data: null }
    ;(Utils.useRequest as any).mockResolvedValue(mockResponse)

    const result = await store.batchUpdate(updateData)

    expect(Utils.useRequest).toHaveBeenCalledWith('/sf-web/student/batch', updateData, 'put')
    expect(result).toEqual(mockResponse)
  })
})
