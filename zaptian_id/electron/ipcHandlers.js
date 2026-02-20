export function registerIpcHandlers(win,store,ipcMain,fileService) {
ipcMain.on("window-minimize", ()=>win.minimize());
ipcMain.on("window-maximize", ()=>{
if (win.isMaximized()) win.unmaximize();
else win.maximize();
});
ipcMain.on("window-close",() =>win.close());

ipcMain.handle("store:get", async(_,key)=>{
  return await store.get(key);
});
ipcMain.handle("store:set",async(_,{ key,value })=>{
  await store.set(key, value);
  return true;
});
ipcMain.handle("store:delete", async (_,key)=>{
  await store.delete(key);
  return true;
});
ipcMain.handle("json:read", async (_,filepath) => {
  return await fileService.readJson(filepath);
});

ipcMain.handle("json:write", async (_, {filepath, data}) => {
  await fileService.writeJson(filepath, data);
  return true;

});

ipcMain.handle("json:list", async ()=>{
  return await fileService.getallJson();
});
}
