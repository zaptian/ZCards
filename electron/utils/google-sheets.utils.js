import fs from "fs/promises";
import path from "path";
import fetch from "node-fetch";

/* ---- Google Sheet upload ---- */
function extractSheetId(url) {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

function generateXlsxUrl(sheetUrl) {
  const sheetId = extractSheetId(sheetUrl);
  if (!sheetId) throw new Error("Invalid Google Sheets URL");
  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=xlsx`;
}

function extractFileNameFromHeaders(res) {
  const disposition = res.headers.get("content-disposition");
  if (!disposition) return null;

  const match = disposition.match(/filename\*?=(?:UTF-8'')?"?([^"]+)"?/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function saveGoogleSheetAsXlsx(sheetUrl, outputDir, fileId) {
  try {
    const downloadUrl = generateXlsxUrl(sheetUrl);
    const res = await fetch(downloadUrl);

    if (!res.ok) {
      throw new Error("Failed to download sheet (check sharing permission)");
    }

    const fileName =
      extractFileNameFromHeaders(res) || `google_sheet_${fileId}.xlsx`;
    const buffer = await res.arrayBuffer();
    const filePath = path.join(outputDir, `${fileId}.xlsx`);

    await fs.writeFile(filePath, Buffer.from(buffer));
    return { status: true, filePath: filePath, fileName: fileName };
  } catch (error) {
    return { status: false, error: error.message };
  }
}
