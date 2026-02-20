import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld("electronAPI", {
  minimize:()=>ipcRenderer.send("window-minimize"),
  maximize:()=>ipcRenderer.send("window-maximize"),
  close:()=>ipcRenderer.send("window-close"),
  onWindowMaximized: (callback) => {
    const listener = (_e, isMaximized) => callback(isMaximized);
    ipcRenderer.on("window-is-maximized", listener);
    return () => ipcRenderer.removeListener("window-is-maximized", listener);
  }
});

contextBridge.exposeInMainWorld('electronStore', {
  get:(key)=>ipcRenderer.invoke('store:get',key),
  set:(key,value)=>ipcRenderer.invoke('store:set',{key,value}),
  delete:(key)=>ipcRenderer.invoke('store:delete',key),
});

contextBridge.exposeInMainWorld("project_file",{
  readjson:(filepath)=>ipcRenderer.invoke('json:read',filepath),
  writejson: (filepath, data) =>ipcRenderer.invoke('json:write', {filepath, data}),
  listjson:()=>ipcRenderer.invoke('json:list'),
});