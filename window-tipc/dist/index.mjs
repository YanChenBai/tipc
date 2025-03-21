// index.ts
import { useTipc } from "@byc/tipc/main";
import { BrowserWindow, screen } from "electron";
import hmc from "hmc-win32";
function throttle(fn, wait) {
  let lastExecTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastExecTime >= wait) {
      lastExecTime = now;
      return fn(args);
    }
  };
}
function getMouseInWinPos(win) {
  const { x, y } = screen.getCursorScreenPoint();
  const [winX, winY] = win.getPosition();
  const [width, height] = win.getSize();
  const xInRange = x >= winX && x <= winX + width;
  const yInRange = y >= winY && y <= winY + height;
  if (xInRange && yInRange) {
    return {
      x: x - winX,
      y: y - winY
    };
  } else {
    return null;
  }
}
function useWindowTipc(name) {
  const windowTipc = useTipc(name, {
    maximize({ win }) {
      win?.maximize();
    },
    unmaximize({ win }) {
      win?.unmaximize();
    },
    minimize({ win }) {
      win?.minimize();
    },
    hidden({ win }) {
      win?.hide();
    },
    close({ win }) {
      win?.close();
    },
    isMaximized({ win }) {
      return win?.isMaximized() ?? false;
    },
    isMinimized({ win }) {
      return win?.isMinimized() ?? false;
    },
    isAlwaysOnTop({ win }) {
      return win?.isAlwaysOnTop() ?? false;
    },
    setAspectRatio({ win }, aspectRatio, extraSize) {
      win?.setAspectRatio(aspectRatio, extraSize);
    },
    setAlwaysOnTop({ win }, flag, level, relativeLevel) {
      win?.setAlwaysOnTop(flag, level, relativeLevel);
    },
    center({ win }) {
      win?.center();
    },
    reload({ win }) {
      win?.reload();
    }
  });
  let currentWindowId = null;
  function checkMouse(win) {
    const sender = windowTipc.createSender(win);
    const isVisible = win.isVisible();
    const pos = getMouseInWinPos(win);
    if (!isVisible || !pos) {
      sender.onLeave();
      currentWindowId = null;
      return;
    }
    if (currentWindowId !== win.id)
      sender.onEnter();
    currentWindowId = win.id;
    sender.onMove(pos);
  }
  const checkAllWindow = throttle(() => {
    for (const win of BrowserWindow.getAllWindows()) {
      checkMouse(win);
    }
  }, 60);
  function init() {
    windowTipc.init();
    hmc.mouseHook.start();
    hmc.mouseHook.on("move", checkAllWindow);
  }
  function destroy() {
    windowTipc.off();
    hmc.mouseHook.off("move", checkAllWindow);
    hmc.mouseHook.stop();
  }
  return {
    checkAllWindow,
    destroy,
    init
  };
}
export {
  useWindowTipc
};
