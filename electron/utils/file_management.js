import fs from "fs/promises";

export const DataDashBoard_Files = {
  file_index_cache: {
    filename: "file_index_cache.json",
  },
  recent_file_cache: {
    filename: "recent_index_cache.json",
  },
};

export async function atomicWrite(filePath, data) {
  const tmp = filePath + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(data, null, 2));
  await fs.rename(tmp, filePath);
}

export function current_DateAndTime() {
  return new Date().toISOString();
}
