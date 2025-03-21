import type { WindowHandler, WindowListener } from './type'
import { useTipc } from '@byc/tipc/main'
import { BrowserWindow, screen } from 'electron'
import hmc from 'hmc-win32'

function throttle<T extends (args: any[]) => void>(fn: T, wait: number) {
  let lastExecTime = 0
  return function (...args: Parameters<T>) {
    const now = Date.now()
    if (now - lastExecTime >= wait) {
      lastExecTime = now
      return fn(args)
    }
  }
}

function getMouseInWinPos(win: BrowserWindow) {
  const { x, y } = screen.getCursorScreenPoint()
  const [winX, winY] = win.getPosition()
  const [width, height] = win.getSize()

  const xInRange = x >= winX && x <= winX + width
  const yInRange = y >= winY && y <= winY + height

  if (xInRange && yInRange) {
    return {
      x: x - winX,
      y: y - winY,
    }
  }
  else {
    return null
  }
}

export function useWindowTipc(name: string) {
  const windowTipc = useTipc<WindowHandler, WindowListener>(name, {
    maximize({ win }) {
      win?.maximize()
    },
    unmaximize({ win }) {
      win?.unmaximize()
    },
    minimize({ win }) {
      win?.minimize()
    },
    hidden({ win }) {
      win?.hide()
    },
    close({ win }) {
      win?.close()
    },
    isMaximized({ win }) {
      return win?.isMaximized() ?? false
    },
    isMinimized({ win }) {
      return win?.isMinimized() ?? false
    },
    isAlwaysOnTop({ win }): boolean {
      return win?.isAlwaysOnTop() ?? false
    },
    setAspectRatio({ win }, aspectRatio: number, extraSize?: Electron.Size | undefined) {
      win?.setAspectRatio(aspectRatio, extraSize)
    },
    setAlwaysOnTop({ win }, flag, level, relativeLevel) {
      win?.setAlwaysOnTop(flag, level, relativeLevel)
    },
    center({ win }) {
      win?.center()
    },
    reload({ win }) {
      win?.reload()
    },
  })

  let currentWindowId: number | null = null

  function checkMouse(win: BrowserWindow) {
    const sender = windowTipc.createSender(win)
    const isVisible = win.isVisible()
    const pos = getMouseInWinPos(win)

    if (!isVisible || !pos) {
      sender.onLeave()
      currentWindowId = null
      return
    }

    if (currentWindowId !== win.id) // 防止重复发送事件
      sender.onEnter()

    currentWindowId = win.id

    sender.onMove(pos)
  }

  const checkAllWindow = throttle(() => {
    for (const win of BrowserWindow.getAllWindows()) {
      checkMouse(win)
    }
  }, 60)

  function init() {
    windowTipc.init()
    hmc.mouseHook.start()
    hmc.mouseHook.on('move', checkAllWindow)
  }

  function destroy() {
    windowTipc.off()
    hmc.mouseHook.off('move', checkAllWindow)
    hmc.mouseHook.stop()
  }

  return {
    checkAllWindow,
    destroy,
    init,
  }
}
