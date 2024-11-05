import type { ICommonListener } from '../commons/listener/commonListener'
import { join } from 'node:path'
import process from 'node:process'
import { is } from '@electron-toolkit/utils'
import { app, BrowserWindow } from 'electron'
import { createSender, initTIPC, registerHandler } from 'tipc'
import icon from '../../resources/icon.png?asset'
import { CommonHandler } from './handler'

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

  registerHandler(win, new CommonHandler())
  const sender = createSender<ICommonListener>(win)

  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(process.env.ELECTRON_RENDERER_URL)
  }
  else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }

  setInterval(() => sender('tell', 'hello!'), 1000)

  return win
}

app.whenReady().then(() => {
  initTIPC()
  createWindow()
})

app.on('window-all-closed', () => app.quit())
