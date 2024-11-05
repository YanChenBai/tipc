# TIPC

## Project Setup

### Install

```bash
$ pnpm install @byc/tipc
```

### Usage

#### Main Process
```typescript
import { createSender, registerHandler } from '@byc/tipc'

export interface MainSender {
  sum: (a: number, b: number) => void
  diff: (a: number, b: number) => void
}

export const MainHandler = {
  name: 'main',
  handlers: {
    getName: () => 'byc',
  },
}

export type MainHandlerType = typeof MainHandler

const mainWindow = new BrowserWindow({
  width: 900,
  height: 670,
  webPreferences: {
    preload: join(__dirname, '../preload/index.js'),
    sandbox: false,
    nodeIntegration: false,
    contextIsolation: true,
  },
})

// Register handler
registerHandler(MainHandler)

const sender = createSender<MainSender>(mainWindow)

// Send message to renderer process
sender('sum', 1, 2)
```

### Preload
```typescript
import { exposeInvoke, exposeListener } from '@byc/tipc'
import { contextBridge, ipcRenderer } from 'electron'
import { MainHandler } from '../main/handler'

contextBridge.exposeInMainWorld('api', {
  main: exposeInvoke(ipcRenderer.invoke, MainHandler),
})

contextBridge.exposeInMainWorld('createListener', exposeListener(
  (channel: string, cb: (...args: any[]) => void) => {
    ipcRenderer.on(channel, (_e, ...args: any[]) => cb(...args))
  },
))
```

### Render Process
```typescript
// index.d.ts
import type { ExposeInvoke, ExposeListener } from '@byc/tipc'

declare global {
  interface Window {
    createListener: ExposeListener
    api: {
      main: ExposeInvoke<MainHandlerType>
    }
  }
}
```

```typescript
// App.vue
function send() {
  window.api.main.getName()
    .then((data) => {
      console.log(data)
    })
}

const mainListener = window.createListener<MainSender>()

mainListener('sum', (a, b) => {
  console.log(a + b)
})
```
