import { app,BrowserWindow,dialog,ipcMain } from "electron";
import {registerIpcHandlers} from "./ipcHandlers.js";
import { createFileService } from "./services/fileservice.js";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import path from "node:path";
async function createWindow() {
const StoreModule= await import('electron-store');
const Store = StoreModule.default;
const store = new Store();
const windowBounds=store.get('windowBounds') || { width: 1200, height: 800 };
const wasMaximized=store.get('isMaximized') || false;
const win=new BrowserWindow({
    ...windowBounds,
    minWidth:1000,
    minHeight:600,
    frame:false,
    backgroundColor:'#181818',
    webPreferences:{
    preload:path.join(__dirname, "preload.js"),
    contextIsolation:true,
    nodeIntegration:false,
    sandbox:false,  
  }
});

win.removeMenu();
if(process.env.APP_MODE) {
win.loadURL(process.env.VITE_DEV_SERVER_URL);
win.webContents.openDevTools();
}else{win.loadFile(path.join(__dirname, "../build/index.html"));}
win.webContents.on("did-finish-load", () => {
win.webContents.send("window-is-maximized", win.isMaximized());
});
win.webContents.openDevTools();
const userDataPath=path.join(app.getPath("userData"),"projects");
const fileService=createFileService(userDataPath);
registerIpcHandlers(win,store,ipcMain,fileService);
let resizeTimeout;
win.on('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (!win.isMaximized()) {
      store.set('windowBounds', win.getBounds());
    }
  }, 300);
});

win.on('maximize', () => {
  win.webContents.send('window-is-maximized', true);
});

win.on('unmaximize', () => {
  win.webContents.send('window-is-maximized', false);
});

if (wasMaximized) {
  win.maximize();
}
win.on('close', () => {
  store.set('isMaximized', win.isMaximized());
  if (!win.isMinimized() && !win.isMaximized()) {
    store.set('windowBounds', win.getBounds());
  }
});



//  win.on("ready-to-show",() => {
//     win.show();
//   });

}



app.whenReady().then(async () => {
  try {
    await createWindow();
  } catch (err) {
    console.error(err);
    app.quit();
  }
});
app.on("window-all-closed",()=>{
  if (process.platform !== "darwin") app.quit();
});
