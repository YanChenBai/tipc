import type { BrowserWindow } from 'electron'
import { ipcMain } from 'electron'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { joinName, TIPC_HANDLER, TIPC_LISTENER } from '../common'
import { clearAllTipc, getAllTipc, useTipc } from '../main'

const mockWindow = {
  webContents: {
    send: vi.fn(),
  },
}

vi.mock('electron', () => {
  return {
    ipcMain: {
      handle: vi.fn(),
      removeHandler: vi.fn(),
    },
    BrowserWindow: {
      fromId: vi.fn(id => id === 1 ? mockWindow : null),
    },
  }
})

function clear() {
  vi.clearAllMocks()
  clearAllTipc()
}
function clearMock() {
  beforeEach(clear)
  afterEach(clear)
}

describe('返回方法测试', () => {
  clearMock()

  it('正常流程的使用', () => {
    const name = 'normal'
    const channelName = joinName(TIPC_HANDLER, name)

    const { init } = useTipc('normal', {})
    init()

    expect(ipcMain.handle).toHaveBeenCalledTimes(1)

    expect(ipcMain.handle)
      .toHaveBeenCalledWith(channelName, expect.any(Function))

    expect(getAllTipc().has(channelName)).toBe(true)
  })

  it('未初始化时无任何调用', () => {
    const name = 'no-init'
    useTipc(name, {})

    expect(ipcMain.handle).not.toHaveBeenCalled()
    expect(getAllTipc().has(name)).toBe(false)
  })

  it('重复初始化应只注册一次', () => {
    const { init } = useTipc('duplicate', {})
    init()
    init()

    expect(ipcMain.handle).toHaveBeenCalledTimes(1)
  })

  it('调用 off() 后应移除处理器', () => {
    const name = 'remove-test'
    const channelName = joinName(TIPC_HANDLER, name)

    const { init, off } = useTipc(name, {})
    init()
    off()

    expect(ipcMain.removeHandler).toHaveBeenCalledWith(channelName)
    expect(getAllTipc().has(channelName)).toBe(false)
  })

  it('sender测试', () => {
    const name = 'sender'
    const { createSender } = useTipc<any, { test: (arg1: string, args2: number) => void }>(name, {})

    const mockWindow = { webContents: { send: vi.fn() } } as unknown as BrowserWindow

    const sender = createSender(mockWindow)
    sender.test('test', 2)

    expect(mockWindow.webContents.send)
      .toHaveBeenCalledWith(
        joinName(TIPC_LISTENER, name, 'test'),
        'test',
        2,
      )
  })

  it('handle参数检测', async () => {
    const mockHandle = {
      test: vi.fn().mockResolvedValue(1),
    }

    const { init } = useTipc('args', mockHandle)

    init()

    const handle = vi.mocked(ipcMain.handle).mock.calls[0][1]
    const event = { sender: { id: 1 } } as any

    const args = [1, 2, 3]
    await handle(event, {
      method: 'test',
      args,
    })

    expect(mockHandle.test)
      .toHaveBeenCalledWith(
        {
          event,
          win: mockWindow,
        },
        ...args,
      )
  })
})

describe('错误处理', () => {
  clearMock()

  const event = { sender: { id: 1 } } as any

  it('handle抛出异常', async () => {
    const mockHandle = {
      test: vi.fn().mockRejectedValue(new Error('handler error')),
    }

    const { init } = useTipc('error', mockHandle)

    init()

    const handle = vi.mocked(ipcMain.handle).mock.calls[0][1]

    await expect(
      handle(event, {
        method: 'test',
        args: [],
      }),
    ).rejects.toThrow('handler error')
  })

  it('处理不存在的方法', async () => {
    const mockHandle = {
      test: vi.fn(),
    }

    const { init } = useTipc('empty', mockHandle)
    init()

    const handle = vi.mocked(ipcMain.handle).mock.calls[0][1]

    await expect(handle(event, {
      method: 'UndefinedMethod',
      args: [],
    })).rejects.toThrow('Method \'UndefinedMethod\' is nonexistent.')
  })
})

describe('clear', () => {
  clearMock()

  it('clearAllTipc()', () => {
    useTipc('tipc1', {}).init()
    useTipc('tipc2', {}).init()

    clearAllTipc()

    expect(ipcMain.removeHandler)
      .toHaveBeenCalledTimes(2)

    expect(ipcMain.removeHandler)
      .toHaveBeenNthCalledWith(1, joinName(TIPC_HANDLER, 'tipc1'))

    expect(ipcMain.removeHandler)
      .toHaveBeenNthCalledWith(2, joinName(TIPC_HANDLER, 'tipc2'))

    expect(getAllTipc().size).toBe(0)
  })
})

describe('utils', () => {
  it('joinName', () => {
    expect(joinName('a', 'b')).toBe('a:b')
  })
})
