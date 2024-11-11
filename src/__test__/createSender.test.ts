import { BrowserWindow } from 'electron'
import { beforeEach, describe, expect, it, vi } from 'vitest'
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
  let sender: typeof TestProto.methods

  beforeEach(() => {
    sender = createSender(mockWin, TestProto)
  })

  it('should return an object with the same methods as proto.methods', () => {
    expect(sender).toHaveProperty('testMethod1')
    expect(sender).toHaveProperty('testMethod2')
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
