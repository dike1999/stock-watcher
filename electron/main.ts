import { app, Tray, Menu, nativeImage, ipcMain, powerMonitor } from 'electron';
import Store from 'electron-store';
import {
  showFloatWindow,
  hideFloatWindow,
  initFloatWindow,
  isFloatWindowVisible,
} from './float-window';
import { fetchStockData, verifyStock } from './stock-api';
import { formatStockDisplay } from './stock-formatter';
import { StoreSchema, StockItem } from './types';

const store = new Store<StoreSchema>({
  defaults: {
    floatWindowBounds: {
      x: -1,
      y: -1,
      width: 250,
      height: 300,
    },
    stockList: [
      { code: 'usBABA', name: '阿里巴巴' },
      { code: 'usAAPL', name: '苹果' },
    ],
    pollIntervalMs: 3000,
  },
});

console.log('Electron 纯托盘应用启动');

let tray: Tray | null = null;
let updateInterval: NodeJS.Timeout | null = null;
let consecutiveFailures = 0;
const MAX_FAILURES = 3;
let isPaused = false;
let onPauseStateChange: (() => void) | null = null;

let stockList: StockItem[] = store.get('stockList');
let currentStockIndex = 0;

function stopUpdates(showPaused: boolean = true): void {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
  consecutiveFailures = 0;
  if (showPaused) {
    isPaused = true;
    tray?.setTitle('▪ 服务已暂停');
    tray?.setToolTip('服务已暂停，点击"重新启动"恢复');
    console.log('[stopUpdates] 服务已停止');
  } else {
    tray?.setTitle('▪ 股票分析');
    console.log('[stopUpdates] 列表为空，显示默认标题');
  }
  onPauseStateChange?.();
}

function pauseUpdates(): void {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
  isPaused = true;
  tray?.setToolTip('服务已暂停');
  console.log('[pauseUpdates] 服务已暂停，保持当前托盘标题不变');
  onPauseStateChange?.();
}

function restartUpdates(): void {
  console.log('[restartUpdates] 重新启动更新');
  isPaused = false;
  consecutiveFailures = 0;
  if (!updateInterval) {
    updateStockInfo();
    const intervalMs = store.get('pollIntervalMs');
    updateInterval = setInterval(updateStockInfo, intervalMs);
    console.log('[restartUpdates] 已设置定时器，间隔 ' + intervalMs + 'ms');
  }
  onPauseStateChange?.();
}

export function isUpdatesPaused(): boolean {
  return isPaused;
}

async function updateStockInfo(): Promise<void> {
  if (isPaused) {
    return;
  }

  if (stockList.length === 0) {
    tray?.setTitle('▪ 股票分析');
    currentStockIndex = 0;
    return;
  }

  const stock = stockList[currentStockIndex];
  const stockCode = stock.code;
  console.log('正在获取股票数据: ' + stockCode);

  const stockData = await fetchStockData(stockCode);

  if (stockData && stockData.name) {
    consecutiveFailures = 0;
    const displayText = formatStockDisplay(stockData);

    tray?.setTitle(displayText);
    tray?.setToolTip(displayText);
    console.log('托盘标题已更新: ' + displayText);
  } else {
    consecutiveFailures++;
    console.log('股票数据获取失败，当前连续失败次数: ' + consecutiveFailures);

    if (consecutiveFailures >= MAX_FAILURES) {
      stopUpdates();
      tray?.setTitle('▪ 网络异常');
      tray?.setToolTip('网络异常，请点击"重新启动"恢复');
      console.log('连续3次获取失败，已停止更新');
    }
  }

  currentStockIndex = (currentStockIndex + 1) % stockList.length;
}

function rebuildTrayMenu(): void {
  const floatVisible = isFloatWindowVisible();
  const paused = isUpdatesPaused();
  const contextMenu = Menu.buildFromTemplate([
    { label: '显示浮层', click: showFloatWindow, enabled: !floatVisible },
    { label: '隐藏浮层', click: hideFloatWindow, enabled: floatVisible },
    { type: 'separator' },
    { label: '暂停', click: pauseUpdates, enabled: !paused },
    { label: '继续', click: restartUpdates, enabled: paused },
    { type: 'separator' },
    { label: '退出', click: () => app.quit() },
  ]);
  tray?.setContextMenu(contextMenu);
}

function createTray(): void {
  console.log('创建托盘开始');

  try {
    const iconPath = app.getAppPath().replace(/\\/g, '/') + '/public/electron-vite.svg';
    const icon = nativeImage.createFromPath(iconPath);
    console.log('图标路径: ' + iconPath);

    tray = new Tray(icon);
    console.log('托盘创建成功');

    rebuildTrayMenu();

    tray.on('click', () => {
      tray?.popUpContextMenu();
    });

    tray.setTitle('▪ 股票分析 加载中...');
    console.log('托盘标题已设置');

    if (stockList.length > 0) {
      updateStockInfo();
      const intervalMs = store.get('pollIntervalMs');
      updateInterval = setInterval(updateStockInfo, intervalMs);
      console.log('托盘创建完成，已启动轮询，间隔 ' + intervalMs + 'ms');
    } else {
      console.log('托盘创建完成');
    }
  } catch (error) {
    console.error('创建托盘时出错:', error);
  }
}

app.dock.hide();

app.whenReady().then(() => {
  console.log('应用 ready，创建托盘');
  onPauseStateChange = rebuildTrayMenu;
  initFloatWindow(stockList, store, rebuildTrayMenu);
  createTray();

  powerMonitor.on('suspend', () => {
    console.log('[PowerMonitor] 系统休眠，停止定时查询 ' + new Date().toLocaleString('zh-CN'));
    pauseUpdates();
  });

  powerMonitor.on('resume', () => {
    console.log('[PowerMonitor] 系统唤醒，恢复定时查询 ' + new Date().toLocaleString('zh-CN'));
    if (stockList.length > 0) {
      restartUpdates();
    }
  });

  powerMonitor.on('lock-screen', () => {
    console.log('[PowerMonitor] 屏幕锁定，停止定时查询 ' + new Date().toLocaleString('zh-CN'));
    pauseUpdates();
  });

  powerMonitor.on('unlock-screen', () => {
    console.log('[PowerMonitor] 屏幕解锁，恢复定时查询 ' + new Date().toLocaleString('zh-CN'));
    if (stockList.length > 0) {
      restartUpdates();
    }
  });
});

app.on('window-all-closed', (e: Event) => {
  e.preventDefault();
});

app.on('before-quit', () => {
  stopUpdates();
  hideFloatWindow();
  console.log('应用退出，已清除定时器和浮层');
});

app.on('activate', () => {
  if (!tray) {
    createTray();
  }
});

ipcMain.handle('verify-stock', async (_event, code: string) => {
  console.log('[IPC] verify-stock 请求: ' + code);
  const result = await verifyStock(code);
  console.log('[IPC] verify-stock 结果: ' + JSON.stringify(result));
  return result;
});

ipcMain.on(
  'save-stocks',
  (_event, data: { stocks: Array<{ code: string; name: string }>; pollIntervalMs: number }) => {
    const newList = data.stocks;
    const pollIntervalMs = data.pollIntervalMs;
    console.log(
      '[IPC] save-stocks 请求，新列表: ' +
        JSON.stringify(newList) +
        '，间隔: ' +
        pollIntervalMs +
        'ms',
    );
    stockList = newList;
    store.set('stockList', stockList);
    store.set('pollIntervalMs', pollIntervalMs);
    console.log('[IPC] save-stocks 已保存到 store');
    currentStockIndex = 0;
    stopUpdates(false);

    if (stockList.length > 0) {
      updateStockInfo();
      updateInterval = setInterval(updateStockInfo, pollIntervalMs);
      console.log(
        '[IPC] save-stocks 已重启轮询，数量: ' +
          stockList.length +
          '，间隔: ' +
          pollIntervalMs +
          'ms',
      );
    } else {
      console.log('[IPC] save-stocks 列表为空');
    }

    hideFloatWindow();
    console.log('[IPC] save-stocks 完成');
  },
);
