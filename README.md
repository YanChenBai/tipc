# TIPC

## Project Setup

### Install

```bash
$ pnpm install @byc/tipc
```

### Usage
#### Common
```typescript
import { defineProto, Method } from '@byc/tipc'

export const CommonHandlerProto = defineProto('CommonHandler', {
  minimize: Method as () => void,
})

export const CommonListenerProto = defineProto('CommonListener', {
  tell: Method as (msg: string) => void,
})

// type
export type ICommonHandler = typeof CommonHandlerProto
export type ICommonListener = typeof CommonListenerProto
```

#### Main Process

```typescript
import { join } from 'node:path'
import process from 'node:process'
import { defineHandler } from '@byc/tipc'
import { createSender, registerHandler } from '@byc/tipc/main'
import { app, BrowserWindow } from 'electron'

export const commonHandler = defineHandler(CommonHandlerProto, {
  minimize(req) {
    req.win.minimize()
  },
})

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 670,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: false,
      devTools: true,
    },
  })

  // register handler
  registerHandler(commonHandler)

  // create sender
  const sender = createSender(win, CommonListenerProto)

  // send message
  setInterval(() => sender.tell('hello!'), 1000)

  win.loadURL(process.env.ELECTRON_RENDERER_URL ?? '')

  return win
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => app.quit())
```

#### Preload
```typescript
import { exposeInvokes, exposeListeners } from '@byc/tipc/preload'
import { contextBridge } from 'electron'

// expose invoke and listener
contextBridge.exposeInMainWorld('invoke', exposeInvokes(CommonHandlerProto))
contextBridge.exposeInMainWorld('listener', exposeListeners(CommonListenerProto))
```

#### Renderer Process
```typescript
// listen message
window.listener.tell((msg) => {
  console.log(msg)
})

// invoke handler
function minimize() {
  window.invoke.minimize()
}
```
