import { join } from 'node:path'
import process from 'node:process'
import { is } from '@electron-toolkit/utils'
import { app, BrowserWindow } from 'electron'
import { createSender, initTIPC, registerHandler } from 'tipc'
import icon from '../../resources/icon.png?asset'
import { CommonListenerMethods } from '../commons/listener/commonListener'
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
  const sender = createSender(win, CommonListenerMethods)

  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(process.env.ELECTRON_RENDERER_URL)
  }
  else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }

  const timer = setInterval(() => sender.tell('hello!'), 1000)

  win.once('closed', () => clearInterval(timer))

  return win
}

app.whenReady().then(() => {
  initTIPC()
  createWindow()
  createWindow()
})

app.on('window-all-closed', () => app.quit())
