import { ipcRenderer } from 'electron'
import { describe, expect, it, vi } from 'vitest'
import { defineProto } from '../'
import { geListenerName, getHandlerName, Method } from '../common'
import { exposeInvokes, exposeListeners } from '../preload'

vi.mock('electron', () => ({
  ipcRenderer: {
    on: vi.fn(),
    invoke: vi.fn(),
    removeListener: vi.fn(),
  },
}))

describe('exposeInvokes', () => {
  const CHANNEL_NAME_BASE = 'TestChannel'
  const CHANNEL_FULL_NAME = getHandlerName(CHANNEL_NAME_BASE)

  const TestProto = defineProto(CHANNEL_NAME_BASE, {
    testMethod: Method as (...args: string[]) => any,
  })

  it('should expose invokes', () => {
    const invokes = exposeInvokes(TestProto)

    invokes.testMethod('arg1', 'arg2')

    expect(ipcRenderer.invoke).toHaveBeenCalledWith(CHANNEL_FULL_NAME, 'testMethod', 'arg1', 'arg2')
  })
})

describe('exposeListeners', () => {
  const LISTENER_NAME_BASE = 'TestListener'

  const TestProto = defineProto(LISTENER_NAME_BASE, {
    testMethod1: Method as (...args: any[]) => any,
    testMethod2: Method as (...args: any[]) => any,
  })

  const listeners = exposeListeners(TestProto)

  it('should expose listeners', () => {
    const remove = listeners.testMethod1(() => {})

    listeners.testMethod2(() => {})

    expect(ipcRenderer.on).toHaveBeenCalledWith(
      geListenerName(LISTENER_NAME_BASE, 'testMethod1'),
      expect.any(Function),
    )

    expect(ipcRenderer.on).toHaveBeenCalledWith(
      geListenerName(LISTENER_NAME_BASE, 'testMethod2'),
      expect.any(Function),
    )

    remove()
    expect(ipcRenderer.removeListener).toHaveBeenCalledWith(
      geListenerName(LISTENER_NAME_BASE, 'testMethod1'),
      expect.any(Function),
    )
  })
})
