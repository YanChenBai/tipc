"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// index.ts
var _main = require('@byc/tipc/main');
var _electron = require('electron');
var _hmcwin32 = require('hmc-win32'); var _hmcwin322 = _interopRequireDefault(_hmcwin32);
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
  const { x, y } = _electron.screen.getCursorScreenPoint();
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
  const windowTipc = _main.useTipc.call(void 0, name, {
    maximize({ win }) {
      _optionalChain([win, 'optionalAccess', _ => _.maximize, 'call', _2 => _2()]);
    },
    unmaximize({ win }) {
      _optionalChain([win, 'optionalAccess', _3 => _3.unmaximize, 'call', _4 => _4()]);
    },
    minimize({ win }) {
      _optionalChain([win, 'optionalAccess', _5 => _5.minimize, 'call', _6 => _6()]);
    },
    hidden({ win }) {
      _optionalChain([win, 'optionalAccess', _7 => _7.hide, 'call', _8 => _8()]);
    },
    close({ win }) {
      _optionalChain([win, 'optionalAccess', _9 => _9.close, 'call', _10 => _10()]);
    },
    isMaximized({ win }) {
      return _nullishCoalesce(_optionalChain([win, 'optionalAccess', _11 => _11.isMaximized, 'call', _12 => _12()]), () => ( false));
    },
    isMinimized({ win }) {
      return _nullishCoalesce(_optionalChain([win, 'optionalAccess', _13 => _13.isMinimized, 'call', _14 => _14()]), () => ( false));
    },
    isAlwaysOnTop({ win }) {
      return _nullishCoalesce(_optionalChain([win, 'optionalAccess', _15 => _15.isAlwaysOnTop, 'call', _16 => _16()]), () => ( false));
    },
    setAspectRatio({ win }, aspectRatio, extraSize) {
      _optionalChain([win, 'optionalAccess', _17 => _17.setAspectRatio, 'call', _18 => _18(aspectRatio, extraSize)]);
    },
    setAlwaysOnTop({ win }, flag, level, relativeLevel) {
      _optionalChain([win, 'optionalAccess', _19 => _19.setAlwaysOnTop, 'call', _20 => _20(flag, level, relativeLevel)]);
    },
    center({ win }) {
      _optionalChain([win, 'optionalAccess', _21 => _21.center, 'call', _22 => _22()]);
    },
    reload({ win }) {
      _optionalChain([win, 'optionalAccess', _23 => _23.reload, 'call', _24 => _24()]);
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
    for (const win of _electron.BrowserWindow.getAllWindows()) {
      checkMouse(win);
    }
  }, 60);
  function init() {
    windowTipc.init();
    _hmcwin322.default.mouseHook.start();
    _hmcwin322.default.mouseHook.on("move", checkAllWindow);
  }
  function destroy() {
    windowTipc.off();
    _hmcwin322.default.mouseHook.off("move", checkAllWindow);
    _hmcwin322.default.mouseHook.stop();
  }
  return {
    checkAllWindow,
    destroy,
    init
  };
}


exports.useWindowTipc = useWindowTipc;
