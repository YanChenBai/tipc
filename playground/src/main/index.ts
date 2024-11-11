import { join } from 'node:path'
import process from 'node:process'
import { defineHandler } from '@byc/tipc'
import { createSender, registerHandler } from '@byc/tipc/main'
import { app, BrowserWindow } from 'electron'

import icon from '../../resources/icon.png?asset'
import { CommonHandlerProto, CommonListenerProto } from '../commons/tipc/common'

export const commonHandler = defineHandler(CommonHandlerProto, {
  minimize(req) {
    req.win.minimize()
  },
})

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 670,
    autoHideMenuBar: true,
    icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  registerHandler(commonHandler)

  const sender = createSender(win, CommonListenerProto)

  sender.tell('hello!')

  win.loadURL(process.env.ELECTRON_RENDERER_URL ?? '')

  return win
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => app.quit())
