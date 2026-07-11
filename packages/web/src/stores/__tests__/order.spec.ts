import { setActivePinia, createPinia } from 'pinia'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { useOrderStore } from '../order'

vi.mock('hs-admin-ui', () => ({
  Utils: {
    useRequest: vi.fn()
  }
}))

const { Utils } = await import('hs-admin-ui')

describe('订单Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('getList 应以正确参数调用 Utils.useRequest', async () => {
    const store = useOrderStore()
    const mockResponse = { data: [{ id: 1, orderNo: 'ORD001' }] }
    ;(Utils.useRequest as any).mockResolvedValue(mockResponse)

    const result = await store.getList({ school: '第一学校', currentPage: 1, pageSize: 10 })

    expect(Utils.useRequest).toHaveBeenCalledWith('/sf-web/order', { school: '第一学校', currentPage: 1, pageSize: 10 }, 'get')
    expect(result).toEqual(mockResponse)
  })

  it('getById 应以正确 URL 调用 Utils.useRequest', async () => {
    const store = useOrderStore()
    const mockResponse = { data: { id: 1, orderNo: 'ORD001' } }
    ;(Utils.useRequest as any).mockResolvedValue(mockResponse)

    const result = await store.getById(1)

    expect(Utils.useRequest).toHaveBeenCalledWith('/sf-web/order/1', {}, 'get')
    expect(result).toEqual(mockResponse)
  })

  it('create 应以 POST 方法调用 Utils.useRequest', async () => {
    const store = useOrderStore()
    const orderData = { school: '第一学校', packageName: '套餐A' }
    const mockResponse = { data: { id: 2 } }
    ;(Utils.useRequest as any).mockResolvedValue(mockResponse)

    const result = await store.create(orderData)

    expect(Utils.useRequest).toHaveBeenCalledWith('/sf-web/order', orderData, 'post')
    expect(result).toEqual(mockResponse)
  })

  it('update 应以 PUT 方法调用 Utils.useRequest', async () => {
    const store = useOrderStore()
    const orderData = { packageName: '套餐B' }
    ;(Utils.useRequest as any).mockResolvedValue({ data: null })

    const result = await store.update(1, orderData)

    expect(Utils.useRequest).toHaveBeenCalledWith('/sf-web/order/1', orderData, 'put')
    expect(result).toEqual({ data: null })
  })

  it('deleteById 应以 DELETE 方法调用 Utils.useRequest', async () => {
    const store = useOrderStore()
    ;(Utils.useRequest as any).mockResolvedValue({ data: null })

    const result = await store.deleteById(1)

    expect(Utils.useRequest).toHaveBeenCalledWith('/sf-web/order/1', {}, 'delete')
    expect(result).toEqual({ data: null })
  })

  it('batchDelete 应以正确参数调用 Utils.useRequest', async () => {
    const store = useOrderStore()
    const ids = [1, 2, 3]
    ;(Utils.useRequest as any).mockResolvedValue({ data: null })

    const result = await store.batchDelete(ids)

    expect(Utils.useRequest).toHaveBeenCalledWith('/sf-web/order/batch/delete', { ids }, 'post')
    expect(result).toEqual({ data: null })
  })

  it('generatePayCode 应以 POST 方法调用 Utils.useRequest', async () => {
    const store = useOrderStore()
    const mockResponse = { data: { payCode: 'PAY123456' } }
    ;(Utils.useRequest as any).mockResolvedValue(mockResponse)

    const result = await store.generatePayCode(1)

    expect(Utils.useRequest).toHaveBeenCalledWith('/sf-web/order/1/pay-code', {}, 'post')
    expect(result).toEqual(mockResponse)
  })

  it('addStudents 应以 POST 方法调用 Utils.useRequest', async () => {
    const store = useOrderStore()
    const studentIds = [1, 2, 3]
    ;(Utils.useRequest as any).mockResolvedValue({ data: null })

    const result = await store.addStudents(1, studentIds)

    expect(Utils.useRequest).toHaveBeenCalledWith('/sf-web/order/add-students', { orderId: 1, studentIds }, 'post')
    expect(result).toEqual({ data: null })
  })

  it('removeStudent 应以 POST 方法调用 Utils.useRequest', async () => {
    const store = useOrderStore()
    ;(Utils.useRequest as any).mockResolvedValue({ data: null })

    const result = await store.removeStudent(1, 2)

    expect(Utils.useRequest).toHaveBeenCalledWith('/sf-web/order/remove-student', { orderId: 1, studentId: 2 }, 'post')
    expect(result).toEqual({ data: null })
  })
})
