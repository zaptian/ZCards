import { contextBridge, ipcRenderer, webUtils, clipboard } from "electron";

/*-----------------------------------------------------------*/
/* TOP NAVIGATION HEADER API CALLS */
/*-----------------------------------------------------------*/
contextBridge.exposeInMainWorld("electronAPI", {
  minimize: () => ipcRenderer.send("window-minimize"),
  maximize: () => ipcRenderer.send("window-maximize"),
  close: () => ipcRenderer.send("window-close"),
  onWindowMaximized: (callback) =>
    ipcRenderer.on("window-is-maximized", (event, isMaximized) =>
      callback(isMaximized),
    ),
});

/*-----------------------------------------------------------*/
/* HELPER API CALLS */
/*-----------------------------------------------------------*/
contextBridge.exposeInMainWorld("secureStore", {
  get: (key) => ipcRenderer.invoke("store:get", key),
  set: (key, value) => ipcRenderer.invoke("store:set", { key, value }),
  delete: (key) => ipcRenderer.invoke("store:delete", key),
});

/*-----------------------------------------------------------*/
/* DataDashBoard.handler.js IPC API CALLS */
/*-----------------------------------------------------------*/
contextBridge.exposeInMainWorld("DataDashBoard_API", {
  /*-----------------------------------------------------------*/
  /* WORKSPACE INITIALIZATION API */
  /*-----------------------------------------------------------*/
  initializeWorkspace: () => {
    return ipcRenderer.invoke("initialize_work_space");
  },

  /*-----------------------------------------------------------*/
  /* IMPORT FILE ACCESS API */
  /*-----------------------------------------------------------*/
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

  /*-----------------------------------------------------------*/
  /* HISTORY FILE ACCESS API */
  /*-----------------------------------------------------------*/
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

  /*-----------------------------------------------------------*/
  /* RECENT FILE ACCESS API */
  /*-----------------------------------------------------------*/
  recentAdd: (fileId) => {
    return ipcRenderer.invoke("recent:add", fileId);
  },

  recentList: () => {
    return ipcRenderer.invoke("recent:list");
  },

  /*-----------------------------------------------------------*/
  /* FETCH FORM DATA FILE API */
  /*-----------------------------------------------------------*/
  fetchData: (payload) => {
    return ipcRenderer.invoke("fetch:Data", payload);
  },

  fetchDataRange: (payload) => {
    return ipcRenderer.invoke("fetch:DataRange", payload);
  },

  fetchFormData: (payload) => {
    return ipcRenderer.invoke("fetch:FormData", payload);
  },

  addFormData: (payload) => {
    return ipcRenderer.invoke("add:FormData", payload);
  },

  updateEditedData: (payload) => {
    return ipcRenderer.invoke("update:EditedData", payload);
  },

  /*-----------------------------------------------------------*/
  /* COPY CLIPBOARD DATA */
  /*-----------------------------------------------------------*/
  copyClipBoardText: (Text) => {
    clipboard.writeText(Text);
  },

  /*-----------------------------------------------------------*/
  /* DELETE FILE ACCESS API */
  /*-----------------------------------------------------------*/
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
