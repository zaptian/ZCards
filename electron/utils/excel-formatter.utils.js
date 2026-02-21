import { parentPort, workerData } from "worker_threads";
import ExcelJS from "exceljs";
import { ExcelDatabase } from "../dbconfig/database.config.js";

let GLOBAL_DB_HANDLE = null;

/**
 * @function formatDate(date)
 * @purpose  Converts an Excel date serial number to an ISO date string (YYYY-MM-DD).
 * @param   {number} date  Excel date serial (e.g. 38971)
 * @returns {string}         ISO date string  (e.g. "2006-09-15")
 */
function formatDate(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/*-----------------------------------------------------------*/
/**
 * @function  normalizeCell(value)
 * @purpose   Make the cell data to normalized text.
 */
/*-----------------------------------------------------------*/
function normalizeCell(cell) {
  const value = cell.value;

  if (!value) return null;

  // 1️⃣ If already a Date
  if (value instanceof Date) {
    return formatDate(value);
  }

  // 2️⃣ If object
  if (typeof value === "object") {
    if (value.text) return value.text;

    if (value.richText) {
      return value.richText.map((r) => r.text).join("");
    }

    if (value.hyperlink) return value.text;
  }

  // 3️⃣ If Number
  if (typeof value === "number") {
    return value;
  }

  return value;
}

/*-----------------------------------------------------------*/
/**
 * @function  importExcelData(file_Data)
 * @purpose   Import file data from excel and save to DB.
 */
/*-----------------------------------------------------------*/
async function importExcelData(file_Data) {
  try {
    /*-----------------------------------------------------------*/
    /* META DATA EXTRACTION */
    /*-----------------------------------------------------------*/
    const { id, name, targetPath, size } = file_Data;

    /*-----------------------------------------------------------*/
    /* WORKBOOK INIT */
    /*-----------------------------------------------------------*/
    const workbook = new ExcelJS.stream.xlsx.WorkbookReader(targetPath, {
      worksheets: "emit",
      sharedStrings: "cache",
      hyperlinks: "ignore",
      styles: "cache",
    });

    /*-----------------------------------------------------------*/
    /* DATABASE INIT */
    /*-----------------------------------------------------------*/
    GLOBAL_DB_HANDLE.init();

    /*-----------------------------------------------------------*/
    /* INSERT FILE META DATA */
    /*-----------------------------------------------------------*/
    GLOBAL_DB_HANDLE.getStatement("insertFile").run(
      id,
      name,
      targetPath,
      size,
      1,
    );

    let totalSheets = 0;
    let totalRows = 0;
    let sheetData = {};
    let sheetNames = [];

    return new Promise((resolve, reject) => {
      /*-----------------------------------------------------------*/
      /* WORKBOOK SHEETS CALLBACK */
      /*-----------------------------------------------------------*/
      workbook.on("worksheet", async (worksheet) => {
        totalSheets++;
        let rowCount = 0;
        let colCount = 0;

        GLOBAL_DB_HANDLE.getStatement("insertSheet").run(
          id,
          worksheet.name,
          0,
          0,
        );

        /*-----------------------------------------------------------*/
        /* BEGIN COMMIT */
        /*-----------------------------------------------------------*/
        GLOBAL_DB_HANDLE.beginTransaction();
        let counter = 0;

        for await (const row of worksheet) {
          rowCount++;

          const rowData = [];

          row.eachCell({ includeEmpty: true }, (cell) => {
            rowData.push(normalizeCell(cell));
          });
          colCount = Math.max(colCount, rowData.length);

          GLOBAL_DB_HANDLE.getStatement("insertRow").run(
            id,
            worksheet.name,
            row.number,
            JSON.stringify(rowData),
          );

          counter++;

          if (counter % 2000 === 0) {
            /*-----------------------------------------------------------*/
            /* CLOSE COMMIT */
            /*-----------------------------------------------------------*/
            GLOBAL_DB_HANDLE.commit();
            /*-----------------------------------------------------------*/
            /* BEGIN COMMIT */
            /*-----------------------------------------------------------*/
            GLOBAL_DB_HANDLE.beginTransaction();
          }
        }
        /*-----------------------------------------------------------*/
        /* CLOSE COMMIT */
        /*-----------------------------------------------------------*/
        GLOBAL_DB_HANDLE.commit();

        GLOBAL_DB_HANDLE.getStatement("updateSheet").run(
          rowCount,
          colCount,
          id,
          worksheet.name,
        );

        totalRows += rowCount;

        sheetData[worksheet.name] = {
          name: worksheet.name,
          rowCount: rowCount,
          colCount: colCount,
        };

        sheetNames.push(worksheet.name);

        parentPort.postMessage({
          type: "sheetComplete",
          sheet: worksheet.name,
          rows: rowCount,
          cols: colCount,
        });
      });

      /*-----------------------------------------------------------*/
      /* WORKBOOK END CALLBACK */
      /*-----------------------------------------------------------*/
      workbook.on("end", () => {
        resolve({
          sheetNames,
          sheetData,
          totalSheets,
          totalRows,
        });
      });

      /*-----------------------------------------------------------*/
      /* WORKBOOK ERROR CALLBACK */
      /*-----------------------------------------------------------*/
      workbook.on("error", (err) => {
        /*-----------------------------------------------------------*/
        /* EMIT REJECT ERROR */
        /*-----------------------------------------------------------*/
        reject(err);
      });

      /*-----------------------------------------------------------*/
      /* WORKBOOK READ CALLBACK */
      /*-----------------------------------------------------------*/
      workbook.read();
    });
  } catch (error) {
    console.error("[worker:importExcelData] : ", error);
    throw new Error(`[worker:importExcelData] : ${error}`);
  }
}

/**
 * @function  async init()
 * @purpose   Init worker and DB workspace config
 */
(async () => {
  try {
    /*-----------------------------------------------------------*/
    /* WORKER DATA EXTRACTION */
    /*-----------------------------------------------------------*/
    const { file_Data, dbconfig_Path } = workerData;

    /*-----------------------------------------------------------*/
    /* CREATE DB-HANDLE OBJECT */
    /*-----------------------------------------------------------*/
    GLOBAL_DB_HANDLE = new ExcelDatabase(dbconfig_Path);

    // const result_row = GLOBAL_DB_HANDLE.getStatement("getFile").all(
    //   file_Data.id,
    // );
    // console.log(GLOBAL_DB_HANDLE);

    // console.log(result_row, file_Data);

    const importResult = await importExcelData(file_Data);
    /*-----------------------------------------------------------*/
    /* DB CONFIG FILE STATUS */
    /*-----------------------------------------------------------*/
    // console.log("===========>", GLOBAL_DB_HANDLE.getStats());

    parentPort.postMessage({ type: "done", result: importResult });
  } catch (err) {
    parentPort.postMessage({ type: "error", error: err.message });
  } finally {
    console.log("FINALLY BLOCK EXECUTED");
    try {
      /*-----------------------------------------------------------*/
      /* DATABASE CLOSE */
      /*-----------------------------------------------------------*/
      GLOBAL_DB_HANDLE.close();
    } catch (error) {
      console.error("[worker:init] :", error);
    }
  }
})();
