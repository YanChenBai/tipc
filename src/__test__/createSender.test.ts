import { BrowserWindow } from 'electron'
import { describe, expect, it, vi } from 'vitest'
import { defineProto } from '../'
import { geListenerName, Method } from '../common'
import { createSender } from '../main'

vi.mock('electron', () => ({
  BrowserWindow: class {
    webContents = {
      send: vi.fn(),
    }
  },
}))

const LISTENER_NAME_BASE = 'TestListener'

const TestProto = defineProto(LISTENER_NAME_BASE, {
  testMethod1: Method as (...args: any[]) => any,
  testMethod2: Method as (...args: any[]) => any,
})

const mockWin = new (vi.mocked(BrowserWindow))()

describe('createSender.test', () => {
  // 模拟非Method属性
  const NotFuncMethodName = 'testMethod3'
  TestProto.methods[NotFuncMethodName] = 'not a method'

  const sender = createSender(mockWin, TestProto)

  it('should return an object with the same methods as proto.methods', () => {
    expect(sender).toHaveProperty('testMethod1')
    expect(sender).toHaveProperty('testMethod2')
  })

  it('should handle methods that are not of type Method', () => {
    expect(() => (sender as any)[NotFuncMethodName](1)).toThrow()
  })

  it('should call win.webContents.send with the correct arguments', () => {
    const args1 = ['arg1', 'arg2']
    const args2 = ['arg3', 'arg4']

    sender.testMethod1(...args1)
    sender.testMethod2(...args2)

    expect(mockWin.webContents.send)
      .toHaveBeenCalledWith(geListenerName(LISTENER_NAME_BASE, 'testMethod1'), ...args1)
    expect(mockWin.webContents.send)
      .toHaveBeenCalledWith(geListenerName(LISTENER_NAME_BASE, 'testMethod2'), ...args2)
  })
})
