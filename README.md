# TIPC

## Project Setup

### Install

```bash
pnpm install @byc/tipc
```

### Usage

#### Common

```typescript
import type { FnMap } from '@byc/tipc/type'

interface CommonHandles extends FnMap {
  hello: (msg: string) => string
}

interface CommonListeners extends FnMap {
  hello: (msg: string) => void
}
```

#### Main Process

```typescript
import { join } from 'node:path'
import process from 'node:process'
import { useTipc } from '@byc/tipc/main'
import { app, BrowserWindow } from 'electron'

const { init, createSender } = useTipc<CommonHandles, CommonListeners>('common', {
  hello(_meta, msg) {
    console.log(msg)
    return msg
  },
})

app.whenReady()
  .then(() => {
    // init tipc
    init()

    const win = new BrowserWindow({
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
        nodeIntegration: false,
      },
    })

    win.loadURL('https://electronjs.org')

    const send = createSender(win)

    // send message to renderer process
    send.hello('hello!')
  })
```

#### Preload

```typescript
import { exposeTipc } from '@byc/tipc/preload'

exposeTipc()
```

#### Renderer Process

```typescript
import { invoke, listener } from '@byc/tipc'

// listen message
listener.tell((msg) => {
  console.log(msg)
})

// invoke handler
invoke.hello()
```

#### tipc.d.ts

``` typescript
export {}

declare module '@byc/tipc' {
  interface TipcInvokeExpose {
    common: CommonHandles
  }

  interface TipcListenerExpose {
    common: CommonListeners
  }
}
```

```json
{
  "include": ["tipc.d.ts"]
}
```
