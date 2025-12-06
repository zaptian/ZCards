import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  minimize: () => ipcRenderer.send("window-minimize"),
  maximize: () => ipcRenderer.send("window-maximize"),
  close: () => ipcRenderer.send("window-close"),
  onWindowMaximized: (callback) =>
    ipcRenderer.on("window-is-maximized", (event, isMaximized) =>
      callback(isMaximized)
    ),
});

contextBridge.exposeInMainWorld("secureStore", {
  get: (key) => ipcRenderer.invoke("store:get", key),
  set: (key, value) => ipcRenderer.invoke("store:set", { key, value }),
  delete: (key) => ipcRenderer.invoke("store:delete", key),
});
