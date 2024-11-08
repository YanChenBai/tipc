import { join } from 'node:path'
import process from 'node:process'
import { is } from '@electron-toolkit/utils'
import { app, BrowserWindow } from 'electron'
import { defineHandler } from 'tipc'
import { createSender, registerHandler } from 'tipc/main'

import icon from '../../resources/icon.png?asset'
import { Common2HandlerMethods, CommonHandlerMethods, CommonListenerMethods } from '../commons/tipc/common'

export const commonHandler = defineHandler(CommonHandlerMethods, {
  minimize(req) {
    req.win.minimize()
  },
})

export const common2Handler = defineHandler(Common2HandlerMethods, {
  getWinId(req) {
    return req.win.id
  },
})

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 670,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  registerHandler(commonHandler)
  registerHandler(common2Handler)

  const sender = createSender(win, CommonListenerMethods)

  sender.tell('hello!')

  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(process.env.ELECTRON_RENDERER_URL)
  }
  else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return win
}

app.whenReady().then(() => {
  createWindow()
  createWindow()
})

app.on('window-all-closed', () => app.quit())
