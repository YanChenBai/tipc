import type { MainSender } from '../commons/main'
import { join } from 'node:path'
import process from 'node:process'
import { is } from '@electron-toolkit/utils'
import { app, BrowserWindow } from 'electron'
import { createSender, registerHandler } from 'tipc'
import icon from '../../resources/icon.png?asset'
import { MainHandler } from './handler'

function createWindow() {
  const mainWindow = new BrowserWindow({
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

  const sender = createSender<MainSender>(mainWindow)

  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  }
  else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  setInterval(() => sender('sum', 1, 2), 1000)

  return mainWindow
}

app.whenReady().then(() => {
  registerHandler(MainHandler)
  createWindow()
})

app.on('window-all-closed', () => app.quit())
