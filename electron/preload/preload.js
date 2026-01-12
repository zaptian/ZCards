import { contextBridge, ipcRenderer, webUtils } from "electron";

/**
 * Top Header Actions
 */
contextBridge.exposeInMainWorld("electronAPI", {
  minimize: () => ipcRenderer.send("window-minimize"),
  maximize: () => ipcRenderer.send("window-maximize"),
  close: () => ipcRenderer.send("window-close"),
  onWindowMaximized: (callback) =>
    ipcRenderer.on("window-is-maximized", (event, isMaximized) =>
      callback(isMaximized)
    ),
});

/**
 * Helper Actions
 */
contextBridge.exposeInMainWorld("secureStore", {
  get: (key) => ipcRenderer.invoke("store:get", key),
  set: (key, value) => ipcRenderer.invoke("store:set", { key, value }),
  delete: (key) => ipcRenderer.invoke("store:delete", key),
});

/*-----------------------------------------------------------------------------------------*/
/**
 *  Files Name Working - DataDashBoard.js
 */
/*-----------------------------------------------------------------------------------------*/
contextBridge.exposeInMainWorld("DataDashBoard_API", {
  /* ---------------- Workspace Initialization ---------------- */
  initializeWorkspace: () => {
    return ipcRenderer.invoke("initialize_work_space");
  },

  /* -------------------- Import File Handler -------------------- */
  importFile: (payload) => ipcRenderer.invoke("import:file", payload),

  importUpload: (payload) => ipcRenderer.invoke("import:upload", payload),

  importGoogleSheet: (payload) => {
    return ipcRenderer.invoke("import:googlesheet", payload);
  },

  onUploadProgress: (callback) => {
    const handler = (_, data) => callback(data);
    ipcRenderer.on("import:upload:progress", handler);
    return () => {
      ipcRenderer.removeListener("import:upload:progress", handler);
    };
  },

  import_all_list: () => {
    return ipcRenderer.invoke("import:list");
  },

  import_file_dialog: () => {
    return ipcRenderer.invoke("import:file_dialog");
  },

  import_file_drag_and_drop: (dropFiles) => webUtils.getPathForFile(dropFiles),

  /* ---------------- (Hold) History (Per-file metadata) ---------------- */
  historyCreate: (fileId, data) => {
    return ipcRenderer.invoke("history:create", fileId, data);
  },

  historyRead: (fileId) => {
    return ipcRenderer.invoke("history:read", fileId);
  },

  historyUpdate: (fileId, data) => {
    return ipcRenderer.invoke("history:create", fileId, data);
  },

  historyList: () => {
    return ipcRenderer.invoke("history:list");
  },

  /* ---------------- Recent ---------------- */

  recentAdd: (fileId) => {
    return ipcRenderer.invoke("recent:add", fileId);
  },

  recentList: () => {
    return ipcRenderer.invoke("recent:list");
  },

  /* ---------------- Open File Handler ---------------- */

  openFile: (payload) => {
    return ipcRenderer.invoke("open:file", payload);
  },

  /* ---------------- Delete / Trash ---------------- */
  singleMoveToTrash: (fileId) => {
    return ipcRenderer.invoke("delete:singleMoveToTrash", fileId);
  },

  moveToTrash: (fileId) => {
    return ipcRenderer.invoke("delete:moveToTrash", fileId);
  },

  // (Hold)
  deletePermanent: (fileId) => {
    return ipcRenderer.invoke("delete:permanent", fileId);
  },
});
