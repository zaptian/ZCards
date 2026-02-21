import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

class ExcelDatabase {
  constructor(dbconfig_path) {
    this.dbHandler = null;
    this.dbPath = path.join(dbconfig_path || "", "excel-storage.db");
    this.statements = new Map();
  }

  /*-------------------------------------------------
   * @function : init()
   * Purpose   : Initialize database connection and schema
   * Returns   : Database handler instance
   *------------------------------------------------*/
  init() {
    try {
      const dbDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      this.dbHandler = new Database(this.dbPath, {
        verbose: process.env.NODE_ENV === "development" ? console.log : null,
        fileMustExist: false,
      });

      this.dbHandler.pragma("journal_mode = WAL");
      this.dbHandler.pragma("synchronous = NORMAL");
      this.dbHandler.pragma("foreign_keys = ON");
      this.dbHandler.pragma("cache_size = -65536"); // 64MB - Cache Size

      this.createTables();
      this.createIndexes();
      this.prepareStatements();

      console.log("# ---------- DataBase Init() Success ---------#");
      return this.dbHandler;
    } catch (error) {
      console.error("Database init failed:", error);
      throw error;
    }
  }

  /*-------------------------------------------------
   * @function : createTables()
   * Purpose   : Create required database tables
   * Returns   : void
   *------------------------------------------------*/
  createTables() {
    const queries = [
      // Table -> Excel Files
      `CREATE TABLE IF NOT EXISTS excel_files (
        file_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        original_path TEXT,
        size INTEGER,
        imported_at INTEGER DEFAULT (unixepoch()),
        last_opened INTEGER,
        version INTEGER DEFAULT 1,
        created_at INTEGER DEFAULT (unixepoch()),
        updated_at INTEGER DEFAULT (unixepoch())
      )`,
      // Table -> Excel Sheets
      `CREATE TABLE IF NOT EXISTS excel_sheets (
        file_id TEXT NOT NULL,
        sheet TEXT NOT NULL,
        row_count INTEGER DEFAULT 0,
        col_count INTEGER DEFAULT 0,
        created_at INTEGER DEFAULT (unixepoch()),
        updated_at INTEGER DEFAULT (unixepoch()),
        PRIMARY KEY (file_id, sheet),
        FOREIGN KEY (file_id) REFERENCES excel_files(file_id) ON DELETE CASCADE
      )`,
      // Table -> Excel Rows
      `CREATE TABLE IF NOT EXISTS excel_rows (
        file_id TEXT NOT NULL,
        sheet TEXT NOT NULL,
        row INTEGER NOT NULL,
        data TEXT NOT NULL,
        created_at INTEGER DEFAULT (unixepoch()),
        updated_at INTEGER DEFAULT (unixepoch()),
        PRIMARY KEY (file_id, sheet, row),
        FOREIGN KEY (file_id, sheet)
          REFERENCES excel_sheets(file_id, sheet)
          ON DELETE CASCADE,
        CHECK (row >= 1)
      )`,
    ];

    this.dbHandler.transaction(() => {
      queries.forEach((q) => this.dbHandler.prepare(q).run());
    })();
  }

  /*-------------------------------------------------
   * @function : createIndexes()
   * Purpose   : Improve lookup performance
   * Returns   : void
   *------------------------------------------------*/
  createIndexes() {
    const indexes = [
      `CREATE INDEX IF NOT EXISTS idx_files_name ON excel_files(name)`,
      `CREATE INDEX IF NOT EXISTS idx_files_imported ON excel_files(imported_at)`,
      `CREATE INDEX IF NOT EXISTS idx_sheets_file ON excel_sheets(file_id)`,
      `CREATE INDEX IF NOT EXISTS idx_rows_lookup ON excel_rows(file_id, sheet, row)`,
    ];

    this.dbHandler.transaction(() => {
      indexes.forEach((i) => this.dbHandler.prepare(i).run());
    })();
  }

  /*-------------------------------------------------
   * @function : prepareStatements()
   * Purpose   : Cache prepared SQL statements
   * Returns   : void
   *------------------------------------------------*/
  prepareStatements() {
    /*-----------------------------------------------------------*/
    /* TABEL (excel_files) QUERY */
    /*-----------------------------------------------------------*/

    /*--------------------------------------------
     * INSERT FILE QUERY
     *--------------------------------------------*/
    this.statements.set(
      "insertFile",
      this.dbHandler.prepare(`
        INSERT OR REPLACE INTO excel_files
        (file_id, name, original_path, size, version, updated_at)
        VALUES (?, ?, ?, ?, ?, unixepoch())
      `),
    );

    /*--------------------------------------------
     * GET FILE QUERY
     *--------------------------------------------*/
    this.statements.set(
      "getFile",
      this.dbHandler.prepare(`SELECT * FROM excel_files WHERE file_id = ?`),
    );

    /*--------------------------------------------
     * COUNT FILE QUERY
     *--------------------------------------------*/
    this.statements.set(
      "countFiles",
      this.dbHandler.prepare(`SELECT COUNT(*) AS count FROM excel_files`),
    );

    /*-----------------------------------------------------------*/
    /* TABEL (excel_sheets) QUERY */
    /*-----------------------------------------------------------*/

    /*--------------------------------------------
     * INSERT SHEET QUERY
     *--------------------------------------------*/
    this.statements.set(
      "insertSheet",
      this.dbHandler.prepare(`
        INSERT OR REPLACE INTO excel_sheets
        (file_id, sheet, row_count, col_count, updated_at)
        VALUES (?, ?, ?, ?, unixepoch())
      `),
    );

    /*--------------------------------------------
     * UPDATE SHEET QUERY
     *--------------------------------------------*/
    this.statements.set(
      "updateSheet",
      this.dbHandler.prepare(`
      UPDATE excel_sheets
      SET 
        row_count = ?, 
        col_count = ?, 
        updated_at = unixepoch()
      WHERE file_id = ? 
        AND sheet = ?`),
    );

    /*-----------------------------------------------------------*/
    /* TABEL (excel_rows) QUERY */
    /*-----------------------------------------------------------*/

    /*--------------------------------------------
     * INSERT ROW DATA QUERY
     *--------------------------------------------*/
    this.statements.set(
      "insertRow",
      this.dbHandler.prepare(`
        INSERT OR REPLACE INTO excel_rows
        (file_id, sheet, row, data, updated_at)
        VALUES (?, ?, ?, ?, unixepoch())
      `),
    );

    /*--------------------------------------------
     * GET ROW DATA QUERY
     *--------------------------------------------*/
    this.statements.set(
      "getSheetRows",
      this.dbHandler.prepare(`
        SELECT *
        FROM excel_rows
        WHERE file_id = ?
          AND sheet = ?
          AND row BETWEEN ? AND ?
        ORDER BY row ASC;
      `),
    );
  }

  /*-------------------------------------------------
   * @function : getStatement()
   * Purpose   : Fetch prepared statement by name
   * Returns   : Prepared statement
   *------------------------------------------------*/
  getStatement(name) {
    if (!this.statements.has(name)) {
      throw new Error(`Statement not found: ${name}`);
    }
    return this.statements.get(name);
  }

  /*-------------------------------------------------
   * @function : insertRowsBulk()
   * Purpose   : High-speed row insert using transaction
   * Returns   : Number of inserted rows
   *------------------------------------------------*/
  insertRowsBulk(fileId, sheet, rows) {
    const stmt = this.getStatement("insertRow");

    this.dbHandler.transaction(() => {
      rows.forEach((r) =>
        stmt.run(fileId, sheet, r.row, JSON.stringify(r.data)),
      );
    })();

    return rows.length;
  }

  /*-------------------------------------------------
   * @function : getStats()
   * Purpose   : Fetch database statistics
   * Returns   : Object
   *------------------------------------------------*/
  getStats() {
    return {
      files: this.getStatement("countFiles").get().count,
      dbSize: fs.existsSync(this.dbPath)
        ? `${(fs.statSync(this.dbPath).size / 1024 / 1024).toFixed(2)} MB`
        : "N/A",
    };
  }

  /*-------------------------------------------------
   * @function : backup()
   * Purpose   : Backup SQLite database
   * Returns   : Backup file path
   *------------------------------------------------*/
  backup(backupPath) {
    const backupFile =
      backupPath ||
      path.join(path.dirname(this.dbPath), `backup-${Date.now()}.db`);

    this.dbHandler.backup(backupFile).catch(console.error);
    return backupFile;
  }

  /*-------------------------------------------------
   * @function : getHandler()
   * Purpose   : get Handler for SQLite database
   * Returns   : Database Handler
   *------------------------------------------------*/
  getHandler() {
    if (this.dbHandler) {
      return this.dbHandler;
    }
  }

  /*-------------------------------------------------
   * @function : close()
   * Purpose   : Close database connection
   * Returns   : void
   *------------------------------------------------*/
  close() {
    if (this.dbHandler) {
      console.log("# ---------- DataBase Close() Success ---------#");
      this.dbHandler.close();
      this.dbHandler = null;
      this.statements.clear();
    }
  }

  /*-------------------------------------------------
   * @function : beginTransaction()
   * Purpose   : Start a new database transaction
   *             Disables auto-commit mode until
   *             commit() or rollback() is called
   * Returns   : void
   *------------------------------------------------*/
  beginTransaction() {
    this.dbHandler.exec("BEGIN");
  }

  /*-------------------------------------------------
   * @function : commit()
   * Purpose   : Commit the current active transaction
   *             Persists all changes made since BEGIN
   * Returns   : void
   *------------------------------------------------*/
  commit() {
    this.dbHandler.exec("COMMIT");
  }

  /*-------------------------------------------------
   * @function : rollback()
   * Purpose   : Rollback the current active transaction
   *             Reverts all uncommitted changes made
   *             since BEGIN
   * Returns   : void
   *------------------------------------------------*/
  rollback() {
    this.dbHandler.exec("ROLLBACK");
  }
}

/*-------------------------------------------------
 * Singleton Export
 *------------------------------------------------*/
const excelDB_Config = new ExcelDatabase();

export { ExcelDatabase };
export default excelDB_Config;
