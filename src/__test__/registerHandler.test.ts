import type { Mock } from 'vitest'
import { app, ipcMain } from 'electron'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineHandler, defineProto, Method } from '../'
import { getHandlerName } from '../common'
import { batchRegisterHandlers, registerHandler, registerList } from '../main'

vi.mock('electron', () => ({
  ipcMain: {
    handle: vi.fn(),
    removeHandler: vi.fn(),
  },
  BrowserWindow: {
    fromId: vi.fn().mockReturnValue({}),
  },
  app: {
    on: vi.fn(),
  },
}))

const mockEvent = {
  sender: {
    id: 1,
  },
}

const CHANNEL_NAME_BASE = 'TestChannel'
const CHANNEL_FULL_NAME = getHandlerName(CHANNEL_NAME_BASE)
const TEST_RESULT = 'TestResult'

const TestProto = defineProto(CHANNEL_NAME_BASE, {
  testMethod: Method as () => any,
})

const TestHandler = defineHandler(TestProto, {
  testMethod: vi.fn().mockResolvedValue(TEST_RESULT),
})

describe('registerHandler', () => {
  let unregister: () => void

  beforeEach(() => {
    unregister = registerHandler(TestHandler)
  })

  afterEach(() => {
    unregister()
  })

  it('should register the handler correctly', ({ expect }) => {
    expect(ipcMain.handle).toHaveBeenCalledWith(
      CHANNEL_FULL_NAME,
      expect.any(Function),
    )
  })

  it('should handle the method call and return the result', async () => {
    const handler = (ipcMain.handle as Mock).mock.calls[0][1]
    const result = await handler(mockEvent, 'testMethod', 'arg1', 'arg2')

    expect(result).toBe(TEST_RESULT)
    expect(TestHandler.methods.testMethod).toHaveBeenCalledWith(
      { event: mockEvent, win: expect.any(Object) },
      'arg1',
      'arg2',
    )
  })

  it('should throw an error if the method is not found', async () => {
    const handler = (ipcMain.handle as Mock).mock.calls[0][1]

    const NAME = 'nonExistentMethod'

    await expect(handler(mockEvent, NAME))
      .rejects
      .toThrow(
        `${CHANNEL_FULL_NAME} channel: method ${NAME} not found`,
      )
  })

  it('should throw an error if the method is not a function', async () => {
    const handler = (ipcMain.handle as Mock).mock.calls[0][1]

    const NAME = 'invalidMethod'

    TestHandler.methods[NAME] = 'not a function' as any

    await expect(handler(mockEvent, 'invalidMethod'))
      .rejects
      .toThrow(
        `${CHANNEL_FULL_NAME} channel: method ${NAME} is not a function.`,
      )
  })

  it('should remove the handler when all windows are closed', () => {
    (app.on as Mock).mock.calls[0][1]()

    expect(ipcMain.removeHandler).toHaveBeenCalledWith(CHANNEL_FULL_NAME)
    expect(app.on).toHaveBeenCalledWith('window-all-closed', expect.any(Function))
  })

  it('should add the channel to registerList when registering', () => {
    expect(registerList.has(CHANNEL_FULL_NAME)).toBe(true)
  })

  it('should remove the channel from registerList when unregister', () => {
    unregister()
    expect(registerList.has(CHANNEL_FULL_NAME)).toBe(false)
  })

  it('should remove the channel from registerList when all windows are closed', () => {
    (app.on as Mock).mock.calls[0][1]()
    expect(registerList.has(CHANNEL_FULL_NAME)).toBe(false)
  })
})

const TestHandler2 = defineHandler(TestProto, {
  testMethod: vi.fn().mockResolvedValue('TestResult2'),
})

const TestHandler3 = defineHandler(TestProto, {
  testMethod: vi.fn().mockResolvedValue('TestResult3'),
})

describe('batchRegisterHandlers', () => {
  const handlers = [TestHandler, TestHandler2, TestHandler3]

  batchRegisterHandlers(handlers)

  it('should register all handlers', () => {
    handlers.forEach((handler) => {
      expect(ipcMain.handle).toHaveBeenCalledWith(
        getHandlerName(handler.name),
        expect.any(Function),
      )
    })
  })

  it('should remove all handlers when all windows are closed', () => {
    (app.on as Mock).mock.calls[0][1]()

    handlers.forEach((handler) => {
      expect(ipcMain.removeHandler).toHaveBeenCalledWith(getHandlerName(handler.name))
    })
  })
})
