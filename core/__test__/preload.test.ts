import type { Mock } from 'vitest'
import { contextBridge, ipcRenderer } from 'electron'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { joinName, TIPC_EXPOSE_NAME, TIPC_HANDLER, TIPC_LISTENER } from '../common'
import { exposeTipc, tipc } from '../preload'

vi.mock('electron', () => ({
  ipcRenderer: {
    invoke: vi.fn(), // 模拟异步调用方法
    addListener: vi.fn(), // 模拟添加监听器
    removeListener: vi.fn(), // 模拟移除监听器
  },
  contextBridge: {
    exposeInMainWorld: vi.fn(),
  },
}))

const clear = vi.restoreAllMocks

function clearMock() {
  beforeEach(clear)
  afterEach(clear)
}

describe('invoke() 方法', () => {
  clearMock()

  it('应该调用ipcRenderer.invoke并携带正确格式的通道和参数', async () => {
    const name = 'test'
    const methodName = 'testMethod'
    const args = [1, 'test', { foo: 'bar' }]
    await tipc.invoke(name, methodName, ...args)

    // 验证通道格式和参数结构
    expect(ipcRenderer.invoke)
      .toHaveBeenCalledWith(
        joinName(TIPC_HANDLER, name),
        {
          method: methodName,
          args,
        },
      )
  })

  it('应该处理没有参数的调用', async () => {
    const name = 'emptyService'
    const methodName = 'emptyMethod'
    await tipc.invoke(name, methodName)
    expect(ipcRenderer.invoke).toHaveBeenCalledWith(
      joinName(TIPC_HANDLER, name),
      {
        method: methodName,
        args: [],
      },
    )
  })
})

describe('listener() 方法', () => {
  clearMock()
  const serviceName = 'testService'
  const eventName = 'testEvent'
  const channel = joinName(TIPC_LISTENER, serviceName, eventName)

  it('应该正确添加/移除事件监听器', () => {
    const callback = vi.fn() // 模拟回调函数

    // 调用监听方法并获取清理函数
    const remove = tipc.listener(serviceName, eventName, callback)

    // 验证监听器添加
    expect(ipcRenderer.addListener).toHaveBeenCalledWith(
      channel,
      expect.any(Function), // 预期添加的是函数类型
    )

    // 执行清理函数并验证移除
    remove()
    expect(ipcRenderer.removeListener).toHaveBeenCalledWith(
      channel,
      expect.any(Function), // 预期移除的是相同函数
    )
  })

  it('应该正确传递回调参数', () => {
    const callback = vi.fn()

    // 注册监听器
    tipc.listener('testService', 'testEvent', callback)

    // 获取实际的回调函数
    const registeredCallback = (ipcRenderer.addListener as Mock).mock.calls[0][1]

    // 模拟触发IPC事件
    const testArgs = [1, 'test', { foo: 'bar' }]
    registeredCallback({} as Electron.IpcRendererEvent, testArgs)

    // 验证回调被正确调用
    expect(callback).toHaveBeenCalledWith(testArgs)
  })
})

describe('exposeTipc() 方法', () => {
  it('应该通过contextBridge正确暴露API', () => {
    exposeTipc()
    // 验证暴露的API名称和内容
    expect(contextBridge.exposeInMainWorld)
      .toHaveBeenCalledWith(
        TIPC_EXPOSE_NAME, // 预期的暴露名称
        tipc, // 预期的暴露对象
      )
  })
})
