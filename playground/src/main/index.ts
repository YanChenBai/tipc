import type { FnMap } from '@byc/tipc/type'
import { join } from 'node:path'
import process from 'node:process'
import { useTipc } from '@byc/tipc/main'
import { defineSchema } from '@byc/tipc/schema'
import { app, BrowserWindow } from 'electron'
import icon from '../../resources/icon.png?asset'

interface CommonHandles extends FnMap {
  hello: (msg: string) => void
}

interface CommonListeners extends FnMap {
  hello: (msg: string) => string
}

const commonTipcSchema = defineSchema<CommonHandles, CommonListeners>('common')

const { init, createSender } = useTipc(commonTipcSchema, {
  hello(_meta, msg) {
    // eslint-disable-next-line no-console
    console.log(msg)
    return msg
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

  const send = createSender(win)

  setInterval(() => send.hello('hello!'), 1000)

  win.loadURL(process.env.ELECTRON_RENDERER_URL ?? '')

  return win
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => app.quit())
