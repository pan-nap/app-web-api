import { setActivePinia, createPinia } from 'pinia'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { useEmployeeStore } from '../employee'

vi.mock('hs-admin-ui', () => ({
  Utils: {
    useRequest: vi.fn()
  }
}))

const { Utils } = await import('hs-admin-ui')

describe('员工Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('getList 应以正确参数调用 Utils.useRequest', async () => {
    const store = useEmployeeStore()
    const mockResponse = { data: [{ id: 1, name: '张三', username: 'zhangsan' }] }
    ;(Utils.useRequest as any).mockResolvedValue(mockResponse)

    const result = await store.getList({ name: '张三', currentPage: 1, pageSize: 10 })

    expect(Utils.useRequest).toHaveBeenCalledWith('/sf-web/employee', { name: '张三', currentPage: 1, pageSize: 10 }, 'get')
    expect(result).toEqual(mockResponse)
  })

  it('getById 应以正确 URL 调用 Utils.useRequest', async () => {
    const store = useEmployeeStore()
    const mockResponse = { data: { id: 1, name: '张三', username: 'zhangsan' } }
    ;(Utils.useRequest as any).mockResolvedValue(mockResponse)

    const result = await store.getById(1)

    expect(Utils.useRequest).toHaveBeenCalledWith('/sf-web/employee/1', {}, 'get')
    expect(result).toEqual(mockResponse)
  })

  it('create 应以 POST 方法调用 Utils.useRequest', async () => {
    const store = useEmployeeStore()
    const employeeData = { username: 'lisi', name: '李四', phone: '13800138000' }
    const mockResponse = { data: { id: 2 } }
    ;(Utils.useRequest as any).mockResolvedValue(mockResponse)

    const result = await store.create(employeeData)

    expect(Utils.useRequest).toHaveBeenCalledWith('/sf-web/employee', employeeData, 'post')
    expect(result).toEqual(mockResponse)
  })

  it('update 应以 PUT 方法调用 Utils.useRequest', async () => {
    const store = useEmployeeStore()
    const employeeData = { name: '王五', phone: '13900139000' }
    const mockResponse = { data: null }
    ;(Utils.useRequest as any).mockResolvedValue(mockResponse)

    const result = await store.update(1, employeeData)

    expect(Utils.useRequest).toHaveBeenCalledWith('/sf-web/employee/1', employeeData, 'put')
    expect(result).toEqual(mockResponse)
  })

  it('deleteById 应以 DELETE 方法调用 Utils.useRequest', async () => {
    const store = useEmployeeStore()
    const mockResponse = { data: null }
    ;(Utils.useRequest as any).mockResolvedValue(mockResponse)

    const result = await store.deleteById(1)

    expect(Utils.useRequest).toHaveBeenCalledWith('/sf-web/employee/1', {}, 'delete')
    expect(result).toEqual(mockResponse)
  })

  it('batchDelete 应以正确参数调用 Utils.useRequest', async () => {
    const store = useEmployeeStore()
    const ids = [1, 2, 3]
    const mockResponse = { data: null }
    ;(Utils.useRequest as any).mockResolvedValue(mockResponse)

    const result = await store.batchDelete(ids)

    expect(Utils.useRequest).toHaveBeenCalledWith('/sf-web/employee/batch/delete', { ids }, 'post')
    expect(result).toEqual(mockResponse)
  })
})