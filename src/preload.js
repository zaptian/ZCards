// preload.js
const { contextBridge, ipcRenderer } = require("electron");

// Safe wrapper for IPC
contextBridge.exposeInMainWorld("electronAPI", {
  // App Info
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),

  // Auto Update Controls
  checkForUpdates: () => ipcRenderer.send("check-for-updates"),
  onUpdateAvailable: (callback) => ipcRenderer.on("update-available", callback),
  onUpdateNotAvailable: (callback) =>
    ipcRenderer.on("update-not-available", callback),
  onUpdateDownloaded: (callback) =>
    ipcRenderer.on("update-downloaded", callback),
  downloadUpdate: () => ipcRenderer.send("download-update"),
  installUpdate: () => ipcRenderer.send("install-update"),

  // Message to renderer
  showMessage: (msg) => ipcRenderer.invoke("show-message", msg),

  // Log from Renderer (safe)
  log: (msg) => ipcRenderer.send("renderer-log", msg),

  // IPC request
  invoke: (channel, data) => {
    const validChannels = [
      "open-file-dialog",
      "save-file-dialog",
      "get-user-data-path",
      "generate-pdf",
    ];

    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, data);
    }
  },

  // Listener wrapper
  on: (channel, callback) => {
    const validChannels = ["update-progress", "pdf-generated"];

    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_event, args) => callback(args));
    }
  },
});
