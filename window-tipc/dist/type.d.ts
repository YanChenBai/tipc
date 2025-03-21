import { BrowserWindow } from 'electron';

type AnyFn = (...args: any[]) => any;
type FnMap = Record<string, AnyFn>;

interface WindowHandler extends FnMap {
    maximize: () => void;
    unmaximize: () => void;
    minimize: () => void;
    hidden: () => void;
    close: () => void;
    isMaximized: () => boolean;
    isMinimized: () => boolean;
    isAlwaysOnTop: () => boolean;
    setAspectRatio: (aspectRatio: number, extraSize?: Electron.Size) => any;
    setAlwaysOnTop: BrowserWindow['setAlwaysOnTop'];
    center: () => void;
    reload: () => void;
}
interface WindowListener extends FnMap {
    onMaximize: () => void;
    onUnmaximize: () => void;
    onMinimize: () => void;
    onHidden: () => void;
    onMove: (pos: {
        x: number;
        y: number;
    }) => void;
    onEnter: () => void;
    onLeave: () => void;
    onAlwaysOnTopChange: (isAlwaysOnTop: boolean) => void;
}

export type { WindowHandler, WindowListener };
