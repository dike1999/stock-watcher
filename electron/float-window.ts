import { BrowserWindow, screen } from 'electron';
import Store from 'electron-store';

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

function buildFloatHtml(): string {
  const initialData = JSON.stringify(store.get('stockList'));
  const pollIntervalMs = store.get('pollIntervalMs');
  const pollIntervalSec = Math.round(pollIntervalMs / 1000);

  return (
    '<!DOCTYPE html><html><head><style>' +
    '* { box-sizing: border-box; margin: 0; padding: 0; }' +
    'body { width: 100%; height: 100vh; background: #1e1e1e; color: white; font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 13px; display: flex; flex-direction: column; overflow: hidden; user-select: none; }' +
    '.header { padding: 15px 10px 20px 10px; background: #2d2d2d; border-bottom: 1px solid #3d3d3d; -webkit-app-region: drag; }' +
    '.input-row { display: flex; gap: 8px; }' +
    '.input-row input { flex: 1; padding: 6px 10px; border: 1px solid #4d4d4d; border-radius: 4px; background: #3d3d3d; color: white; font-size: 12px; -webkit-app-region: no-drag; }' +
    '.input-row input:focus { outline: none; border-color: #007aff; }' +
    '.input-row button { padding: 6px 12px; border: none; border-radius: 4px; background: #007aff; color: white; cursor: pointer; font-size: 12px; -webkit-app-region: no-drag; }' +
    '.input-row button:hover { background: #0056b3; }' +
    '.input-row button:disabled { background: #4d4d4d; cursor: not-allowed; }' +
    '.interval-row { display: flex; align-items: center; gap: 8px; margin-top: 10px; }' +
    '.interval-row label { font-size: 12px; color: #8e8e93; white-space: nowrap; }' +
    '.interval-row input { width: 80px; padding: 4px 8px; border: 1px solid #4d4d4d; border-radius: 4px; background: #3d3d3d; color: white; font-size: 12px; text-align: center; -webkit-app-region: no-drag; }' +
    '.interval-row input:focus { outline: none; border-color: #007aff; }' +
    '.stock-list { flex: 1; overflow-y: auto; padding: 8px; }' +
    '.stock-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; background: #2d2d2d; border-radius: 4px; margin-bottom: 6px; -webkit-app-region: no-drag; }' +
    '.stock-item:hover { background: #3d3d3d; }' +
    '.stock-info { flex: 1; -webkit-app-region: no-drag; }' +
    '.delete-btn { width: 20px; height: 20px; border: none; border-radius: 50%; background: #ff3b30; color: white; cursor: pointer; font-size: 14px; line-height: 1; margin-left: 8px; -webkit-app-region: no-drag; }' +
    '.delete-btn:hover { background: #d32f2f; }' +
    '.footer { padding: 10px; background: #2d2d2d; border-top: 1px solid #3d3d3d; -webkit-app-region: no-drag; }' +
    '.save-btn { width: 100%; padding: 8px; border: none; border-radius: 4px; background: #34c759; color: white; cursor: pointer; font-size: 13px; font-weight: 500; -webkit-app-region: no-drag; }' +
    '.save-btn:hover { background: #2ca048; }' +
    '.empty { text-align: center; color: #8e8e93; padding: 20px; }' +
    '.status { font-size: 11px; color: #8e8e93; margin-top: 6px; text-align: center; }' +
    '.error { color: #ff3b30; }' +
    '.success { color: #34c759; }' +
    '</style></head><body>' +
    '<div class="header">' +
    '<div class="input-row">' +
    '<input type="text" id="stockInput" placeholder="请输入股票代码" />' +
    '<button id="addBtn">添加</button>' +
    '</div>' +
    '<div class="interval-row">' +
    '<label>轮询间隔(秒):</label>' +
    '<input type="number" id="intervalInput" value="' +
    pollIntervalSec +
    '" min="1" step="1" />' +
    '</div>' +
    '<div class="status" id="status"></div>' +
    '</div>' +
    '<div class="stock-list" id="stockList"></div>' +
    '<div class="footer">' +
    '<button class="save-btn" id="saveBtn">保存</button>' +
    '</div>' +
    '<script>' +
    'var localStockList = ' +
    initialData +
    ';' +
    'console.log("[Float] 初始化数据:", JSON.stringify(localStockList));' +
    'function renderList() {' +
    '  var el = document.getElementById("stockList");' +
    '  if (localStockList.length === 0) {' +
    '    el.innerHTML = "<div class=\\"empty\\">暂无股票</div>";' +
    '  } else {' +
    '    var html = "";' +
    '    localStockList.forEach(function(stock, i) {' +
    '      html += "<div class=\\"stock-item\\">";' +
    '      html += "<span class=\\"stock-info\\">" + stock.code + " " + stock.name + "</span>";' +
    '      html += "<button class=\\"delete-btn\\" data-index=\\"" + i + "\\">×</button>";' +
    '      html += "</div>";' +
    '    });' +
    '    el.innerHTML = html;' +
    '  }' +
    '  console.log("[Float] 渲染列表:", JSON.stringify(localStockList));' +
    '}' +
    'renderList();' +
    'document.getElementById("addBtn").addEventListener("click", async function() {' +
    '  var input = document.getElementById("stockInput");' +
    '  var status = document.getElementById("status");' +
    '  var code = input.value.trim();' +
    '  if (!code) { status.textContent = "请输入股票代码"; status.className = "status error"; return; }' +
    '  document.getElementById("addBtn").disabled = true;' +
    '  status.textContent = "验证中..."; status.className = "status";' +
    '  console.log("[Float] 添加股票:", code);' +
    '  try {' +
    '    var result = await require("electron").ipcRenderer.invoke("verify-stock", code);' +
    '    console.log("[Float] 验证结果:", JSON.stringify(result));' +
    '    if (result.success) {' +
    '      localStockList.push({ code: code, name: result.name });' +
    '      status.textContent = "添加成功"; status.className = "status success";' +
    '      input.value = "";' +
    '      renderList();' +
    '    } else {' +
    '      status.textContent = result.error || "股票不存在"; status.className = "status error";' +
    '    }' +
    '  } catch (e) { status.textContent = "验证失败"; status.className = "status error"; console.log("[Float] 验证异常:", e); }' +
    '  document.getElementById("addBtn").disabled = false;' +
    '});' +
    'document.getElementById("stockInput").addEventListener("keypress", function(e) {' +
    '  if (e.key === "Enter") document.getElementById("addBtn").click();' +
    '});' +
    'document.getElementById("stockList").addEventListener("click", function(e) {' +
    '  if (e.target.classList.contains("delete-btn")) {' +
    '    var index = parseInt(e.target.getAttribute("data-index")); ' +
    '    console.log("[Float] 删除股票, index:", index, "删除前:", JSON.stringify(localStockList));' +
    '    localStockList.splice(index, 1);' +
    '    console.log("[Float] 删除后:", JSON.stringify(localStockList));' +
    '    renderList();' +
    '  }' +
    '  });' +
    'document.getElementById("saveBtn").addEventListener("click", function() {' +
    '  console.log("[Float] 保存, 本地列表:", JSON.stringify(localStockList));' +
    '  var intervalInput = document.getElementById("intervalInput");' +
    '  var pollIntervalSec = parseInt(intervalInput.value) || 3;' +
    '  if (pollIntervalSec < 1) pollIntervalSec = 1;' +
    '  var pollIntervalMs = pollIntervalSec * 1000;' +
    '  require("electron").ipcRenderer.send("save-stocks", { stocks: localStockList, pollIntervalMs: pollIntervalMs });' +
    '});' +
    '</script></body></html>'
  );
}

export function showFloatWindow(): void {
  console.log('[FloatWindow] 尝试显示浮层');
  if (floatWindow) {
    console.log('[FloatWindow] 浮层已存在，显示并刷新');
    floatWindow.show();
    floatWindow.webContents.executeJavaScript('renderList()');
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
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  floatWindow.setBackgroundColor('#1e1e1e');

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

  floatWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(buildFloatHtml()));
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
