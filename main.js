// 重庆外贸自动获客系统 — Electron 桌面壳
// 作用：把随包内置的本地网页（index.html/app.js/styles.css）用一个原生窗口打开，
// 无需终端、无需浏览器，数据存在应用自己的空间里。
const { app, BrowserWindow, Menu, shell, dialog } = require("electron");
const path = require("path");

// 单实例：避免重复双击开出多个窗口（数据同一份，多窗口会互相覆盖）
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
}

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 900,
    minWidth: 1024,
    minHeight: 680,
    title: "重庆外贸自动获客系统",
    backgroundColor: "#f4f5f2",
    autoHideMenuBar: false,
    webPreferences: {
      // 本地单机应用，加载的是随包内置的本地文件；放宽同源限制，
      // 确保 Claude API 与你自己的 Webhook 调用不被浏览器 CORS 拦截。
      webSecurity: false,
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));

  // 外部链接（Google 搜索、wa.me、官网等）用系统默认浏览器打开，
  // 不在应用窗口里导航，避免"走丢"回不到系统。
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: "deny" };
  });
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith("file://")) {
      event.preventDefault();
      if (/^https?:/i.test(url)) shell.openExternal(url);
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function buildMenu() {
  const template = [
    {
      label: "文件",
      submenu: [
        {
          label: "打开数据存放位置",
          click: () => shell.openPath(app.getPath("userData"))
        },
        { type: "separator" },
        { role: "quit", label: "退出" }
      ]
    },
    {
      label: "视图",
      submenu: [
        { role: "reload", label: "刷新" },
        { role: "forceReload", label: "强制刷新" },
        { role: "toggleDevTools", label: "开发者工具" },
        { type: "separator" },
        { role: "resetZoom", label: "实际大小" },
        { role: "zoomIn", label: "放大" },
        { role: "zoomOut", label: "缩小" },
        { type: "separator" },
        { role: "togglefullscreen", label: "全屏" }
      ]
    },
    {
      label: "帮助",
      submenu: [
        {
          label: "关于",
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: "info",
              title: "关于",
              message: "重庆外贸自动获客系统 · 本地桌面版",
              detail:
                "纯本地运行，数据只存在本机。\n发送始终需人工审批；Claude API Key 与备份 JSON 请妥善保管。\n\n提示：换电脑时，在「设置 → 数据与备份」导出 JSON，到新机器里用「导入备份」恢复。"
            });
          }
        }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.on("second-instance", () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

app.whenReady().then(() => {
  buildMenu();
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
