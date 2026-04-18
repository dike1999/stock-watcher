import { BrowserWindow, screen } from 'electron';
import { fileURLToPath } from 'url';
import path from 'path';
import Store from 'electron-store';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface FloatWindowBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface FloatWindowStoreSchema {
  floatWindowBounds: FloatWindowBounds;
  stockList: Array<{ code: string; name: string }>;
  pollIntervalMs: number;
}

let floatWindow: BrowserWindow | null = null;
let stockList: Array<{ code: string; name: string }> = [];
let store: Store<FloatWindowStoreSchema>;
let onVisibilityChange: (() => void) | null = null;

export function initFloatWindow(
  stockListRef: Array<{ code: string; name: string }>,
  storeRef: Store<FloatWindowStoreSchema>,
  onVisibilityChangeRef?: () => void,
): void {
  stockList = stockListRef;
  store = storeRef;
  onVisibilityChange = onVisibilityChangeRef || null;
}

export function showFloatWindow(): void {
  console.log('[FloatWindow] 尝试显示浮层');
  if (floatWindow) {
    console.log('[FloatWindow] 浮层已存在，显示并聚焦');
    floatWindow.show();
    floatWindow.focus();
    return;
  }

  console.log('[FloatWindow] 创建新浮层窗口');
  const savedBounds = store.get('floatWindowBounds');
  const display = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = display.workAreaSize;

  let x: number;
  let y: number;

  if (savedBounds.x === -1 || savedBounds.y === -1) {
    x = screenWidth - 270;
    y = screenHeight - 320;
  } else {
    x = savedBounds.x;
    y = savedBounds.y;
  }

  const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

  floatWindow = new BrowserWindow({
    width: savedBounds.width,
    height: savedBounds.height,
    x: x,
    y: y,
    frame: false,
    transparent: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: true,
    minimizable: false,
    maximizable: false,
    minWidth: 250,
    backgroundColor: '#1e1e1e',
    enableLargerThanScreen: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.mjs'),
    },
  });

  // 优化拖拽性能
  floatWindow.setHasShadow(false);

  floatWindow.on('closed', () => {
    console.log('[FloatWindow] 浮层已关闭');
    floatWindow = null;
    if (onVisibilityChange) {
      onVisibilityChange();
    }
  });

  floatWindow.on('moved', () => {
    if (floatWindow) {
      const [newX, newY] = floatWindow.getPosition();
      const [newWidth, newHeight] = floatWindow.getSize();
      store.set('floatWindowBounds', { x: newX, y: newY, width: newWidth, height: newHeight });
      console.log('[FloatWindow] 位置已保存: x=' + newX + ', y=' + newY);
    }
  });

  floatWindow.on('resized', () => {
    if (floatWindow) {
      const [newX, newY] = floatWindow.getPosition();
      const [newWidth, newHeight] = floatWindow.getSize();
      store.set('floatWindowBounds', { x: newX, y: newY, width: newWidth, height: newHeight });
      console.log('[FloatWindow] 尺寸已保存: width=' + newWidth + ', height=' + newHeight);
    }
  });

  if (isDev) {
    const devUrl = 'http://localhost:5173/#/float';
    console.log('[FloatWindow] 开发模式，加载:', devUrl);
    floatWindow.loadURL(devUrl);
  } else {
    const filePath = `file://${process.cwd()}/dist/index.html#/float`;
    console.log('[FloatWindow] 生产模式，加载:', filePath);
    floatWindow.loadURL(filePath);
  }

  console.log('[FloatWindow] 浮层窗口已创建，当前列表: ' + JSON.stringify(stockList));
  if (onVisibilityChange) {
    onVisibilityChange();
  }
}

export function hideFloatWindow(): void {
  console.log('[FloatWindow] 隐藏浮层');
  if (floatWindow) {
    floatWindow.close();
    floatWindow = null;
    if (onVisibilityChange) {
      onVisibilityChange();
    }
  }
}

export function isFloatWindowVisible(): boolean {
  return floatWindow !== null;
}
