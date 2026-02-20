import path from "path";
import {readFile,writeFile,mkdir,rename,readdir} from "fs/promises";
import { dialog, app } from "electron";

export function createFileService (userDataPath){
    async function readJson(filename) {
        const fullpath=path.join(userDataPath,filename);
        try {
            const data=await readFile(fullpath,"utf8");
            return JSON.parse(data);
        } 
        catch (err){
            if (err.code==="ENOENT") return null;
                app.exit(1);
                dialog.showErrorBox("Fatal Error", err.message);
            }
    }
    async function writeJson(filename,data) {
        const fullpath=path.join(userDataPath,filename);
        const tmp_path=userDataPath+".tmp";
        try {
            await ensureDir(userDataPath);
            await writeFile(tmp_path,JSON.stringify(data,null,2),"utf8");
            await rename(tmp_path,fullpath);
        } catch (err) {
                app.exit(1);
            dialog.showErrorBox("Fatal Error", err.message);
            
        }
    }
    async function ensureDir(userDataPath) {
        try {
            await mkdir(userDataPath,{ recursive: true });
            return true;
        } catch (err) {
            app.exit(1);
            dialog.showErrorBox("Fatal Error", err.message);
            }
        }
    async function getallJson() {
        try {
            await ensureDir(userDataPath);
            const entry = await readdir(userDataPath,{withFileTypes:true})
            const list= entry.filter(e=>e.isFile() && e.name.endsWith(".json")).map(e=>e.name);
            return list
        } catch (err) {
            app.exit(1);
            dialog.showErrorBox("Fatal Error", err.message);
        }
        
    }
    return {readJson,writeJson,ensureDir,getallJson};
}
