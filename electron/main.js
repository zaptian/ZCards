import { app, BrowserWindow, dialog, ipcMain } from "electron";
import path from "path";
import pkg from "electron-updater";
import Store from "electron-store";
const { autoUpdater } = pkg;
import { fileURLToPath } from "url";

// DataBase config Module
import { ExcelDatabase } from "./dbconfig/database.config.js";

// Import all IPC handler modules
import {
  DataDashBoardHandler,
  WORKSPACE_STRUCTURE,
  getSectionPath,
} from "./ipc-handler/DataDashBoard.handler.js";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let DATABASE_HANDLER = null;

async function MainWindow() {
  const store = new Store();
  const windowBounds = store.get("windowBounds") || {
    width: 1200,
    height: 1000,
  };
  console.log("Width :", windowBounds, store.get("windowBounds"));
  const wasMaximized = store.get("isMaximized") || false;

  /* MainWindow Creation */
  const windowCreation = new BrowserWindow({
    ...windowBounds,
    minWidth: 1200,
    minHeight: 762,
    frame: false,
    backgroundColor: "#181818",
    webPreferences: {
      preload: path.join(__dirname, "preload", "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    icon: app.isPackaged
      ? path.join(__dirname, "..", "out", "assets", "Images", "logo_512.ico")
      : path.join(process.cwd(), "public", "assets", "Images", "logo_512.ico"),
  });

  /* Remove Default Tool Menus */
  // windowCreation.removeMenu();

  /* Rendering File */
  if (!app.isPackaged) {
    windowCreation.loadURL("http://localhost:5173/");
    windowCreation.webContents.openDevTools();
  } else {
    windowCreation.loadFile(path.join(__dirname, "..", "out", "index.html"));
  }

  /* AutoUpdate Loading  & Set Window Maximized */
  windowCreation.webContents.on("did-finish-load", () => {
    autoUpdater.checkForUpdatesAndNotify();
    windowCreation.webContents.send(
      "window-is-maximized",
      windowCreation.isMaximized(),
    );
  });

  /* Open Developer Tools */
  // windowCreation.webContents.openDevTools();

  /* IPCMain Control */
  ipcMain.on("window-minimize", () => windowCreation.minimize());
  ipcMain.on("window-maximize", () => {
    if (windowCreation.isMaximized()) {
      windowCreation.unmaximize();
    } else {
      windowCreation.maximize();
    }
  });
  ipcMain.on("window-close", () => windowCreation.close());
  ipcMain.handle("store:get", (_, key) => store.get(key));
  ipcMain.handle("store:set", (_, { key, value }) => store.set(key, value));
  ipcMain.handle("store:delete", (_, key) => store.delete(key));

  let resizeTimeout;
  windowCreation.on("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (!windowCreation.isMaximized()) {
        store.set("windowBounds", windowCreation.getBounds());
      }
    }, 300);
  });

  windowCreation.on("maximize", () => {
    windowCreation.webContents.send("window-is-maximized", true);
  });

  windowCreation.on("unmaximize", () => {
    windowCreation.webContents.send("window-is-maximized", false);
  });

  if (wasMaximized) {
    windowCreation.maximize();
  }

  windowCreation.on("close", () => {
    store.set("isMaximized", windowCreation.isMaximized());
    if (!windowCreation.isMinimized() && !windowCreation.isMaximized()) {
      store.set("windowBounds", windowCreation.getBounds());
    }
  });
}

/* AutoUpdate Check Avaiable */
autoUpdater.on("update-available", () => {
  dialog.showMessageBox({
    type: "info",
    title: "Update available",
    message: "A new update is available. Downloading now...",
  });
});

/* AutoUpdate Check Download */
autoUpdater.on("update-downloaded", () => {
  dialog
    .showMessageBox({
      type: "question",
      buttons: ["Restart", "Later"],
      defaultId: 0,
      message: "Update ready. Restart now?",
    })
    .then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall();
    });
});

/* Application Init Stage */
app.whenReady().then(async () => {
  // DataBase Init
  DATABASE_HANDLER = new ExcelDatabase(
    getSectionPath(WORKSPACE_STRUCTURE.DATABASE_CONFIG),
  );
  DATABASE_HANDLER.init();

  // MainWindow Init
  await MainWindow();

  // Register all IPC handlers here:
  await DataDashBoardHandler(DATABASE_HANDLER);
});

// Application Before Quit
app.on("before-quit", () => {
  DATABASE_HANDLER.close();
});

/* Application Close Stage */
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
