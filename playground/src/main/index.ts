import type { ICommonHandler } from '../commons/tipc/common'
import { join } from 'node:path'
import process from 'node:process'
import { is } from '@electron-toolkit/utils'
import { app, BrowserWindow } from 'electron'
import { defineHandler } from 'tipc'
import { createSender, initTIPC, registerHandler } from 'tipc/main'

import icon from '../../resources/icon.png?asset'
import { CommonListenerProps } from '../commons/tipc/common'

export const commonHandler = defineHandler<ICommonHandler>({
  minimize(req) {
    req.win.minimize()
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

  registerHandler(win, commonHandler)

  const sender = createSender(win, CommonListenerProps)

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
  initTIPC()
  createWindow()
})

app.on('window-all-closed', () => app.quit())
