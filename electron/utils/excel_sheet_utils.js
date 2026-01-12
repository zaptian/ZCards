import XLSX from "xlsx";

export async function excel_sheet_data_handle(payload) {
  try {
    if (!payload?.targetPath) {
      throw new Error("Invalid payload: targetPath missing");
    }
    const wb = XLSX.readFile(payload.targetPath, { cellDates: true }); // { cellDates: true }
    const sheetsData = [];

    for (const sheetName of wb.SheetNames) {
      const sheet = wb.Sheets[sheetName];

      if (!sheet || !sheet["!ref"]) continue;

      const range = XLSX.utils.decode_range(sheet["!ref"]);
      const cells = {};

      // Iterate ONLY actual cells, not full grid
      for (const ref in sheet) {
        if (ref[0] === "!") continue;

        const cell = sheet[ref];
        if (!cell) continue;

        const decoded = XLSX.utils.decode_cell(ref);
        const row = decoded.r + 1;
        const col = decoded.c + 1;

        cells[`${row}:${col}`] = {
          row,
          col,
          value: cell.v,
        };
      }

      sheetsData.push({
        sheetName,
        rowCount: range.e.r + 1,
        colCount: range.e.c + 1,
        cells,
      });
    }

    return {
      status: true,
      excel_data: {
        file_sheet: wb.SheetNames,
        sheet_data: sheetsData,
      },
    };
  } catch (error) {
    return { status: false, error: "Failed to read the file." };
  }
}
