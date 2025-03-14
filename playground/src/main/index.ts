import { join } from 'node:path'
import process from 'node:process'
import { useTipc } from '@byc/tipc/main'
import { app, BrowserWindow } from 'electron'
import icon from '../../resources/icon.png?asset'

interface CommonTipc {
  handles: {
    hello: (msg: string) => void
  }
  listeners: {
    hello: (msg: string) => void
  }
}

const { init, sender } = useTipc<CommonTipc>('common', {
  hello(_meta, msg) {
    // eslint-disable-next-line no-console
    console.log(msg)
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
      // contextIsolation: false,
      devTools: true,
    },
  })

  init()

  const send = sender(win)

  setInterval(() => send.hello('hello!'), 1000)

  win.loadURL(process.env.ELECTRON_RENDERER_URL ?? '')

  return win
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => app.quit())
