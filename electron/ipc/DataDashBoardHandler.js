import { ipcMain, app, dialog } from "electron";
import path from "path";
import fs from "fs/promises";
import fsmain from "fs";
import mime from "mime-types";
import { mimeStyles } from "../utils/mime_type.js";

import {
  DataDashBoard_Files,
  atomicWrite,
  current_DateAndTime,
} from "../utils/file_management.js";

import { saveGoogleSheetAsXlsx } from "../utils/google_sheet_utils.js";
import { excel_sheet_data_handle } from "../utils/excel_sheet_utils.js";

export const WORKSPACE_STRUCTURE = {
  HISTORY: "History_file_cache",
  RECENT: "Recent_file_cache",
  DELETED: "Delete_file_cache",
  RESOURCE_FILE: "Resource_file_cache",
  GOOGLE_SHEET: "Google_sheet_cache",
};

/* -------------------------------------- Helper Functions ----------------------------- */
export function getWorkspacePath() {
  return path.join(app.getPath("userData"), "workspace_cache");
}

export function getSectionPath(section) {
  return path.join(getWorkspacePath(), section);
}

function registerHistoryHandlers() {
  ipcMain.handle("history:create", async (_, fileId, data) => {
    try {
      const filePath = path.join(
        getSectionPath(WORKSPACE_STRUCTURE.HISTORY),
        `${fileId}.json`
      );

      await atomicWrite(filePath, data);
      return { status: true };
    } catch (err) {
      return { status: false, error: err.message };
    }
  });

  ipcMain.handle("history:read", async (_, fileId) => {
    try {
      const filePath = path.join(
        getSectionPath(WORKSPACE_STRUCTURE.HISTORY),
        `${fileId}.json`
      );

      const content = await fs.readFile(filePath, "utf-8");
      return { status: true, data: JSON.parse(content) };
    } catch (err) {
      return { status: false, error: err.message };
    }
  });

  ipcMain.handle("history:list", async () => {
    try {
      const dir = getSectionPath(WORKSPACE_STRUCTURE.HISTORY);
      const files = await fs.readdir(dir);

      return { status: true, files };
    } catch (err) {
      return { status: false, error: err.message };
    }
  });
}

/*----------------------------------- Open FILE HANDLE --------------------------------  */
/**
 * @functionName  registerOpenFileHandlers()
 * @purpose       To register the Open file Handles
 */
function registerOpenFileHandlers() {
  /*-------------------------------------------------
   * IPC: [open:file]
   * Purpose : Used to open the file and extract the data
   * Returns : { status: boolean, error?: string }
   *------------------------------------------------*/
  ipcMain.handle("open:file", async (_, payload) => {
    try {
      const workspace = getWorkspacePath();
      const indexPath = path.join(
        workspace,
        DataDashBoard_Files.file_index_cache.filename
      );

      let indexData = { version: 1, files: {} };
      let file_id_data = {};

      try {
        indexData = JSON.parse(await fs.readFile(indexPath, "utf-8"));
      } catch (error) {
        indexData = { version: 1, files: {} };
      }

      if (indexData?.files[payload.file_id]) {
        file_id_data = indexData?.files[payload.file_id];
        const c_result = await excel_sheet_data_handle(file_id_data);
        if (c_result.status) {
          return {
            status: true,
            payload_result: c_result.excel_data,
            payload_file: file_id_data,
          };
        } else {
          throw new Error(c_result.error);
        }
      } else {
        throw new Error("Invalid File ID");
      }
    } catch (error) {
      console.error("[open:file] Failed :", error);
      return { status: false, error: error.message };
    }
  });
}
/*--------------------------------------------------------------------------------------------- */

/*----------------------------------- Recent FILE HANDLE --------------------------------  */
/**
 * @functionName  registerDeleteHandlers()
 * @purpose       To register the Recent file Handles
 */
function registerRecentHandlers() {
  /*-------------------------------------------------
   * IPC: [recent:add]
   * Purpose : Used to add in the recent file resource.
   * Returns : { status: boolean, error?: string }
   *------------------------------------------------*/
  ipcMain.handle("recent:add", async (_, fileId) => {
    try {
      let indexData = { version: 1, files: {} };
      let recentData = { version: 1, files: {} };
      const current_time = current_DateAndTime();

      let workspacePath = getWorkspacePath();
      let indexPath = path.join(
        workspacePath,
        DataDashBoard_Files.file_index_cache.filename
      );
      let recentPath = path.join(
        workspacePath,
        WORKSPACE_STRUCTURE.RECENT,
        DataDashBoard_Files.recent_file_cache.filename
      );

      try {
        const raw = await fs.readFile(indexPath, "utf-8");
        indexData = JSON.parse(raw);
        indexData.files[fileId].last_modified_at = current_time;
        indexData.updated_at = current_time;
      } catch (error) {
        indexData = { version: 1, files: {} };
      }

      recentData.files = indexData.files?.[fileId];
      recentData.updated_at = current_time;

      await atomicWrite(recentPath, recentData);
      await atomicWrite(indexPath, indexData);
      return { status: true };
    } catch (error) {
      console.error("[recent:add] Failed :", error);
      return { status: false, error: error.message };
    }
  });

  /*-------------------------------------------------
   * IPC: [recent:list]
   * Purpose : Used to Show the recent file resource.
   * Returns : { status: boolean, files?: Object, error?: string }
   *------------------------------------------------*/
  ipcMain.handle("recent:list", async () => {
    try {
      const recentDir = getSectionPath(WORKSPACE_STRUCTURE.RECENT);
      const recentPath = path.join(
        recentDir,
        DataDashBoard_Files.recent_file_cache.filename
      );
      let recentData;

      try {
        recentData = JSON.parse(await fs.readFile(recentPath, "utf-8"));
      } catch (error) {
        recentData = { version: 1, files: {} };
      }
      return { status: true, files: recentData?.files || {} };
    } catch (error) {
      console.error("[recent:list] Failed :", error);
      return { status: false, error: error.message };
    }
  });
}
/*--------------------------------------------------------------------------------------------- */

/*----------------------------------- Delete FILE HANDLE --------------------------------  */
/**
 * @functionName  registerDeleteHandlers()
 * @purpose       To register the Delete file Handles
 */
function registerDeleteHandlers() {
  /*-------------------------------------------------
   * IPC: [delete:moveToTrash]
   * Purpose : Move the Multiple file to Trash and mark the delete status.
   * Returns : { status: boolean, error?: string }
   *------------------------------------------------*/
  ipcMain.handle("delete:moveToTrash", async (_, fileIds) => {
    try {
      const workspace = getWorkspacePath();
      const indexPath = path.join(
        workspace,
        DataDashBoard_Files.file_index_cache.filename
      );
      const recentDir = getSectionPath(WORKSPACE_STRUCTURE.RECENT);
      const recentPath = path.join(
        recentDir,
        DataDashBoard_Files.recent_file_cache.filename
      );

      let indexData = { version: 1, files: {} };
      let recentData = { version: 1, files: {} };
      const current_time = current_DateAndTime();

      try {
        indexData = JSON.parse(await fs.readFile(indexPath, "utf-8"));
        recentData = JSON.parse(await fs.readFile(recentPath, "utf-8"));
      } catch (error) {
        recentData = { version: 1, files: {} };
        indexData = { version: 1, files: {} };
      }

      for (const fileId of fileIds) {
        /* -------------------------------
          Update index
        ---------------------------------*/
        if (indexData.files?.[fileId]) {
          indexData.files[fileId].delete_status = true;
          indexData.files[fileId].deleted_at = current_time;
          indexData.updated_at = current_time;

          await atomicWrite(indexPath, indexData);
        }

        /* ------------------------------
          Update recent file
        --------------------------------*/
        if (recentData.files?.id === fileId) {
          recentData.files = {};
          await atomicWrite(recentPath, recentData);
        }

        // 2. Move history file → deleted
        const fromFilePath = path.join(
          getSectionPath(WORKSPACE_STRUCTURE.HISTORY),
          `${fileId}.json`
        );

        const toFilePath = path.join(
          getSectionPath(WORKSPACE_STRUCTURE.DELETED),
          `${fileId}.json`
        );

        try {
          await fs.rename(fromFilePath, toFilePath);
        } catch (moveErr) {
          // File may already be moved — do not break delete
          console.warn(
            `[delete:moveToTrach] Failed ${fileId}:`,
            moveErr.message
          );
        }
      }

      return { status: true };
    } catch (err) {
      console.error("[delete:moveToTrach] Failed :", error);
      return { status: false, error: error.message };
    }
  });

  /*-------------------------------------------------
   * IPC: [delete:singleMoveToTrash]
   * Purpose : Move the single file to Trash and mark the delete status.
   * Returns : { status: boolean, error?: string }
   *------------------------------------------------*/
  ipcMain.handle("delete:singleMoveToTrash", async (_, fileId) => {
    try {
      const workspace = getWorkspacePath();
      const indexPath = path.join(
        workspace,
        DataDashBoard_Files.file_index_cache.filename
      );
      const recentDir = getSectionPath(WORKSPACE_STRUCTURE.RECENT);
      const recentPath = path.join(
        recentDir,
        DataDashBoard_Files.recent_file_cache.filename
      );

      let indexData = { version: 1, files: {} };
      let recentData = { version: 1, files: {} };
      const current_time = current_DateAndTime();

      try {
        indexData = JSON.parse(await fs.readFile(indexPath, "utf-8"));
        recentData = JSON.parse(await fs.readFile(recentPath, "utf-8"));
      } catch (error) {
        recentData = { version: 1, files: {} };
        indexData = { version: 1, files: {} };
      }

      /* -------------------------------
       Update index
       ---------------------------------*/
      if (indexData.files?.[fileId]) {
        indexData.files[fileId].delete_status = true;
        indexData.files[fileId].deleted_at = current_time;
        indexData.updated_at = current_time;

        await atomicWrite(indexPath, indexData);
      }

      /* ------------------------------
        Update recent file
      --------------------------------*/
      if (recentData.files?.id === fileId) {
        recentData.files = {};
        await atomicWrite(recentPath, recentData);
      }

      /* ---------------------------------
        Move history file → deleted
      -----------------------------------*/
      const fromFilePath = path.join(
        getSectionPath(WORKSPACE_STRUCTURE.HISTORY),
        `${fileId}.json`
      );

      const toFilePath = path.join(
        getSectionPath(WORKSPACE_STRUCTURE.DELETED),
        `${fileId}.json`
      );

      try {
        await fs.rename(fromFilePath, toFilePath);
      } catch (moveErr) {
        // File may already be moved — do not break delete
        console.warn(
          `[delete:singleMoveToTrash] Failed ${fileId}:`,
          moveErr.message
        );
      }

      return { status: true };
    } catch (error) {
      console.error("[delete:singleMoveToTrash] Failed :", error);
      return { status: false, error: error.message };
    }
  });

  // (Hold)
  ipcMain.handle("delete:permanent", async (_, fileId) => {
    try {
      const filePath = path.join(
        getSectionPath(WORKSPACE_STRUCTURE.DELETED),
        `${fileId}.json`
      );

      await fs.unlink(filePath);
      return { status: true };
    } catch (err) {
      return { status: false, error: err.message };
    }
  });
}
/*--------------------------------------------------------------------------------------------- */

/*----------------------------------- IMPORT FILE HANDLE --------------------------------  */
/**
 * @functionName  registerImportHandlers()
 * @purpose       To register the Import file Handles
 */
function registerImportHandlers() {
  /*-------------------------------------------------
   * IPC: [import:file]
   * Purpose : Get the Meta data for the file.
   * Returns : { status: boolean, fileId?: string, error?: string }
   *------------------------------------------------*/
  ipcMain.handle("import:file", async (_, payload) => {
    try {
      let g_filepath = payload.filePath;

      /* ------------- Get file details --------------- */
      const current_file_meta_data = await fs.stat(path.join(g_filepath));
      if (!current_file_meta_data.isFile()) {
        throw new Error("Provided path is not a file");
      }

      /* ------------ File Data ----------------- */
      const id_unique = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
      const current_time = current_DateAndTime();
      const current_mime_type = mime.lookup(g_filepath);
      const current_mime_type_data =
        mimeStyles[current_mime_type] ?? mimeStyles.default;

      /* ---------- File Metadata ---------- */
      const file_meta_data = {
        id: id_unique,
        originalName: path.basename(g_filepath),
        absolutePath: g_filepath,
        size: current_file_meta_data.size,
        mime_type: current_mime_type,
        mime_type_data: current_mime_type_data,
        imported_at: current_time,
        opened_at: null,
        last_modified_at: current_time,
        deleted_at: null,
        delete_status: false,
      };

      return { status: true, file_data: file_meta_data };
    } catch (error) {
      console.error("[import:file] Failed:", error);
      return {
        status: false,
        error: error.message || "File import failed",
      };
    }
  });

  /*-------------------------------------------------
   * IPC: [import:upload]
   * Purpose : Upload (copy) file with progress
   * Payload : { fileId, sourcePath, targetDir }
   * Emits   : import:upload:progress
   * Returns : { status: boolean }
   *------------------------------------------------*/
  ipcMain.handle("import:upload", async (event, payload) => {
    const { fileId, sourcePath, mime_type_data } = payload;

    try {
      const current_file_meta_data = await fs.stat(sourcePath);
      const totalSize = current_file_meta_data.size;

      const targetDir = getSectionPath(WORKSPACE_STRUCTURE.RESOURCE_FILE);
      await fs.mkdir(targetDir, { recursive: true });
      const ext = mime_type_data?.extension || path.extname(sourcePath);

      const baseName = path.basename(sourcePath, ext);
      const current_time = current_DateAndTime();
      const current_mime_type = mime.lookup(sourcePath);
      const current_mime_type_data =
        mimeStyles[current_mime_type] ?? mimeStyles.default;

      // const fileName = `${baseName}_${fileId}${ext}`;
      const fileName = `${fileId}${ext}`;
      const targetPath = path.join(targetDir, fileName);

      /*---------------- History File Creation -----------------*/
      const historyDir = getSectionPath(WORKSPACE_STRUCTURE.HISTORY);
      const file_meta_data = {
        id: fileId,
        originalName: path.basename(sourcePath),
        absolutePath: sourcePath,
        targetPath: targetPath,
        size: current_file_meta_data.size,
        mime_type: current_mime_type,
        mime_type_data: current_mime_type_data,
        imported_at: current_time,
        opened_at: null,
        last_modified_at: current_time,
        deleted_at: null,
        delete_status: false,
      };
      await atomicWrite(
        path.join(historyDir, `${fileId}.json`),
        file_meta_data
      );
      /*----------------------------------------------------------*/

      /*------------------ Index File Creation -------------------*/
      let indexData;
      let workspacePath = getWorkspacePath();
      let indexPath = path.join(
        workspacePath,
        DataDashBoard_Files.file_index_cache.filename
      );
      try {
        const raw = await fs.readFile(indexPath, "utf-8");
        indexData = JSON.parse(raw);
      } catch {
        indexData = { version: 1, files: {} };
      }

      indexData.files[fileId] = {
        id: fileId,
        name: path.basename(sourcePath),
        absolutePath: sourcePath,
        targetPath: targetPath,
        size: current_file_meta_data.size,
        mime_type: current_mime_type,
        mime_type_data: current_mime_type_data,
        imported_at: current_time,
        last_modified_at: current_time,
        delete_status: false,
      };

      indexData.updated_at = current_time;

      await atomicWrite(indexPath, indexData);

      /*----------------------------------------------------------*/

      let transferred = 0;
      const readStream = fsmain.createReadStream(sourcePath);
      const writeStream = fsmain.createWriteStream(targetPath);

      return await new Promise((resolve, reject) => {
        readStream.on("data", (chunk) => {
          transferred += chunk.length;
          const progress = Math.min(
            100,
            Math.round((transferred / totalSize) * 100)
          );

          event.sender.send("import:upload:progress", {
            fileId,
            progress,
          });
        });

        readStream.on("error", reject);
        readStream.on("open", () => {
          console.log("[import:upload] Read stream opened");
        });

        writeStream.on("open", () => {
          console.log("[import:upload] Write stream opened");
        });
        writeStream.on("error", reject);

        writeStream.on("finish", () => {
          console.log("[import:upload] Write finished Success");
          event.sender.send("import:upload:progress", {
            fileId,
            progress: 100,
          });

          resolve({
            status: true,
            targetPath,
          });
        });

        readStream.pipe(writeStream);
      });
    } catch (error) {
      console.log("[import:upload] Error: ", error);
      return {
        status: false,
        error: error.message,
      };
    }
  });

  /*-------------------------------------------------
   * IPC: [import:googlesheet]
   * Purpose : Upload file from google sheets
   * Payload : { fileId, sourcePath, targetDir }
   * Returns : { status: boolean }
   *------------------------------------------------*/
  ipcMain.handle("import:googlesheet", async (_, payload) => {
    try {
      const id_unique = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
      const resourceDir = path.join(
        getSectionPath(WORKSPACE_STRUCTURE.RESOURCE_FILE)
      );
      const fileupload_payload = await saveGoogleSheetAsXlsx(
        payload.url,
        resourceDir,
        id_unique
      );

      if (!fileupload_payload.status) {
        throw new Error(fileupload_payload.error);
      }

      /*------------------ Index File Creation -------------------*/
      let indexData = { version: 1, files: {} };
      let workspacePath = getWorkspacePath();
      let indexPath = path.join(
        workspacePath,
        DataDashBoard_Files.file_index_cache.filename
      );
      const file_name = fileupload_payload.fileName;
      const file_extension = path.extname(fileupload_payload.fileName);
      const targetPath = fileupload_payload.filePath;
      const current_file_meta_data = await fs.stat(targetPath);
      const totalSize = current_file_meta_data.size;
      const current_mime_type = mime.lookup(file_name);
      const current_mime_type_data =
        mimeStyles[current_mime_type] ?? mimeStyles.default;
      const current_time = current_DateAndTime();

      try {
        const raw = await fs.readFile(indexPath, "utf-8");
        indexData = JSON.parse(raw);
      } catch {
        indexData = { version: 1, files: {} };
      }

      indexData.files[id_unique] = {
        id: id_unique,
        name: file_name,
        absolutePath: targetPath,
        targetPath: targetPath,
        size: totalSize,
        mime_type: current_mime_type,
        mime_type_data: current_mime_type_data,
        imported_at: current_time,
        last_modified_at: current_time,
        delete_status: false,
      };

      indexData.updated_at = current_time;

      await atomicWrite(indexPath, indexData);

      /*----------------------------------------------------------*/

      /*---------------- Google Sheet File Creation -----------------*/
      const historyDir = getSectionPath(WORKSPACE_STRUCTURE.GOOGLE_SHEET);
      const file_meta_data = {
        id: id_unique,
        originalName: file_name,
        absolutePath: targetPath,
        targetPath: targetPath,
        size: totalSize,
        mime_type: current_mime_type,
        mime_type_data: current_mime_type_data,
        imported_at: current_time,
        opened_at: null,
        last_modified_at: current_time,
        deleted_at: null,
        delete_status: false,
      };
      await atomicWrite(
        path.join(historyDir, `${id_unique}.json`),
        file_meta_data
      );
      /*----------------------------------------------------------*/

      return {
        status: true,
      };
    } catch (error) {
      console.log("[import:googlesheet] Failed : ", error);
      return {
        status: false,
        error: error.message || "File import failed",
      };
    }
  });

  /*-------------------------------------------------
   * IPC: [import:list]
   * Purpose : Retrieve all non-deleted file metadata
   * Returns : { status: boolean, files?: object, error?: string }
   *------------------------------------------------*/
  ipcMain.handle("import:list", async () => {
    try {
      const workspacePath = getWorkspacePath();
      const indexPath = path.join(
        workspacePath,
        DataDashBoard_Files.file_index_cache.filename
      );

      let indexData = { version: 1, files: {} };

      try {
        const raw = await fs.readFile(indexPath, "utf-8");
        const parsed = JSON.parse(raw);

        indexData = {
          ...parsed,
          files: Object.fromEntries(
            Object.entries(parsed.files || {}).filter(
              ([_, file]) => file.delete_status === false
            )
          ),
        };
      } catch {
        indexData = { version: 1, files: {} };
      }

      return { status: true, files: indexData.files };
    } catch (error) {
      console.error("[import:list] Failed:", error);
      return { status: false, error: error.message };
    }
  });

  /*-------------------------------------------------
   * IPC: [import:file_dialog]
   * Purpose : Show the File dialog window to upload the files
   * Returns : { filePaths: object }
   *------------------------------------------------*/
  ipcMain.handle("import:file_dialog", async () => {
    const { filePaths } = await dialog.showOpenDialog({
      properties: ["openFile", "multiSelections"],
      filters: [
        {
          name: "Excel Files",
          extensions: ["xlsx", "xls", "xlsm", "xlsb"],
        },
      ],
    });
    return filePaths;
  });
}
/*--------------------------------------------------------------------------------------------- */

/*-------------------------------------- Initialize workspace  --------------------------------- */
/**
 * @FunctionName  init_workspace(param_basepath)
 * @Purpose       To Initialize the workspace folders and files
 * @Params {param_basepath} : Folder base path
 * @Return {Object} : {basepath, structure}
 */
async function init_workspace(param_basepath) {
  await fs.mkdir(param_basepath, { recursive: true });

  await Promise.allSettled(
    Object.values(WORKSPACE_STRUCTURE).map((dir) =>
      fs.mkdir(path.join(param_basepath, dir), { recursive: true })
    )
  );

  return {
    param_basepath,
    structure: WORKSPACE_STRUCTURE,
  };
}
/*--------------------------------------------------------------------------------------------- */

/*-------------------------------------- DataDashBoardHandler  --------------------------------- */
/**
 * @FunctionName  DataDashBoardHandler()
 * @Purpose       To Register the handlers in IPC
 * @Return {Object} : {status, result | error}
 */
export default async function DataDashBoardHandler() {
  ipcMain.handle("initialize_work_space", async () => {
    try {
      console.log("#----------- DataDashboard Init Start -----------#");
      const workspacePath = getWorkspacePath();
      const result = await init_workspace(workspacePath);
      console.log("#----------- DataDashboard Init End -----------#");
      return { status: true, ...result };
    } catch (error) {
      console.error("Workspace init failed:", error);
      return { status: false, error: error.message };
    }
  });

  await registerHistoryHandlers();
  await registerRecentHandlers();
  await registerDeleteHandlers();
  await registerImportHandlers();
  await registerOpenFileHandlers();
}

/*--------------------------------------------------------------------------------------------- */
