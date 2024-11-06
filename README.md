# TIPC

## Project Setup

### Install

```bash
$ pnpm install @byc/tipc
```

### Usage

#### Common
```typescript
import { Method } from '@byc/tipc'

export const CommonHandlerProps = {
  minimize: Method as () => void,
}

export const CommonListenerProps = {
  tell: Method as (msg: string) => void,

}

export type ICommonHandler = typeof CommonHandlerProps
export type ICommonListener = typeof CommonListenerProps
```

#### Main Process
```typescript
import type { ICommonHandler } from '../commons/tipc/common'
import { join } from 'node:path'
import process from 'node:process'
import { is } from '@electron-toolkit/utils'
import { app, BrowserWindow } from 'electron'
import { defineHandler } from 'tipc'
import { createSender, initTIPC, registerHandler } from 'tipc/main'

import { CommonListenerProps } from '../commons/tipc/common'

// Handler Implementation
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
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  // Register Handler
  registerHandler(win, commonHandler)

  // Create Sender
  const sender = createSender(win, CommonListenerProps)

  // Send Message to Renderer
  sender.tell('hello!')

  win.loadURL(process.env.ELECTRON_RENDERER_URL || '')
}

app.whenReady().then(() => {
  initTIPC()
  createWindow()
})

app.on('window-all-closed', () => app.quit())
```

#### Preload
```typescript
import { contextBridge } from 'electron'
import { exposeInvoke, exposeListener } from 'tipc/preload'
import { CommonHandlerProps, CommonListenerProps } from '../commons/tipc/common'

// Expose API to Renderer
contextBridge.exposeInMainWorld('invoke', exposeInvoke(CommonHandlerProps))
contextBridge.exposeInMainWorld('listener', exposeListener(CommonListenerProps))
```

#### Render Process
```typescript
// index.d.ts
import type { ExposeInvokes, ExposeListeners } from 'tipc/renderer'
import type { ICommonHandler, ICommonListener } from '../commons/tipc/common'

declare global {
  interface Window {
    listener: ExposeListeners<ICommonListener>
    invoke: ExposeInvokes<ICommonHandler>
  }
}
```

```typescript
// App.vue
const removeListener = window.listener.tell((e) => {
  console.log(e)
})

function send() {
  window.invoke.minimize()
}
```
