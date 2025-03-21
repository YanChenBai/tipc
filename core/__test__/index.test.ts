import { beforeEach, describe, expect, it, vi } from 'vitest'
import { invoke, listener } from '../'
import { TIPC_EXPOSE_NAME } from '../common'

const mockWindow = {
  [TIPC_EXPOSE_NAME]: {
    invoke: vi.fn().mockResolvedValue('mock_result'),
    listener: vi.fn().mockReturnValue(() => {}),
  },
};

(globalThis as any).window = mockWindow

describe('ipc封装', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('invoke', () => {
    it('应该正确转发调用', async () => {
      const result = await invoke.user.getProfile(123)

      expect(window[TIPC_EXPOSE_NAME].invoke).toHaveBeenCalledWith(
        'user',
        'getProfile',
        123,
      )
      expect(result).toBe('mock_result')
    })

    it('应该始终返回 Promise', () => {
      const returnValue = invoke.someModule.syncMethod()
      expect(returnValue).toBeInstanceOf(Promise)
    })
  })

  describe('listener', () => {
    it('注册监听器', () => {
      const mockCallback = vi.fn()
      const remove = listener.data.update(mockCallback)

      expect(window[TIPC_EXPOSE_NAME].listener).toHaveBeenCalledWith(
        'data',
        'update',
        mockCallback,
      )
      expect(remove).toBeInstanceOf(Function)
    })

    it('移除监听器', () => {
      const mockRemove = vi.fn()
      window[TIPC_EXPOSE_NAME].listener.mockReturnValueOnce(mockRemove)

      const remove = listener.network.statusChange(() => {})
      remove()

      expect(mockRemove).toHaveBeenCalled()
    })
  })

  describe('createProxy', () => {
    it('多级属性访问', () => {
      expect(invoke).toBeTypeOf('object')
      expect(invoke.anyModule).toBeTypeOf('object')
      expect(invoke.anyModule.anyMethod).toBeTypeOf('function')
    })

    it('处理字符串转换', () => {
      const symbolModule = invoke[Symbol('test').toString()]
      expect(symbolModule.anyMethod).toBeTypeOf('function')
    })
  })
})
