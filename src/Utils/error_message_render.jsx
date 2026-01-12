export const DataDashBoard_Error_Message = {
  Init_workspace_Error: {
    title: "Workspace Setup Failed",
    message:
      "We couldn’t set up your workspace. Please restart the app or try again.",
  },
  Import_file_Error: {
    title: "Files Not Loaded",
    message: "Your files could not be loaded. Please try again.",
  },

  Recent_file_Error: {
    title: "Recent File not found",
    message: "Recent file could not found.",
  },
};

export const FileImport_Success_Message = {
  
  file_selected: {
    title: "File selected",
    message: "The file has been selected successfully.",
  },

  file_validated: {
    title: "File validated",
    message: "The file format and size have been validated successfully.",
  },

  preview_generated: {
    title: "Preview ready",
    message: "File preview has been generated successfully.",
  },

  headers_detected: {
    title: "Headers detected",
    message: "Column headers were detected automatically.",
  },

  mapping_completed: {
    title: "Field mapping completed",
    message: "All required fields have been mapped successfully.",
  },

  data_validation_passed: {
    title: "Data validated",
    message: "All records passed validation checks.",
  },

  duplicate_handled: {
    title: "Duplicates handled",
    message: "Duplicate records were detected and handled successfully.",
  },

  import_started: {
    title: "Import started",
    message:
      "Data import has started. Please wait while the process completes.",
  },

  import_completed: {
    title: "Import completed",
    message: "File imported successfully.",
  },

  partial_import_completed: {
    title: "Import completed with warnings",
    message:
      "The import completed successfully, but some records were skipped due to validation issues.",
  },

  google_sheet_connected: {
    title: "Google Sheets connected",
    message: "Google Sheets data source connected successfully.",
  },

  google_sheet_fetched: {
    title: "Data fetched",
    message: "Data has been fetched successfully from Google Sheets.",
  },

  changes_applied: {
    title: "Changes applied",
    message: "Existing records were updated successfully.",
  },

  import_cancelled: {
    title: "Import cancelled",
    message: "The import process was cancelled successfully.",
  },

  file_deleted: {
    title: "File Deleted",
    message: "File deleted successfully.",
  },

  file_opened: {
    title: "File opened",
    message: "File opened successfully.",
  },
};

export const FileImport_Error_Message = {
  no_file_selected: {
    title: "No file selected",
    message: "Please select a file to upload.",
  },

  invalid_file_type: {
    title: "Unsupported file type",
    message:
      "The selected file format is not supported. Please upload a CSV or Excel (.xlsx) file.",
  },

  file_size_exceeded: {
    title: "File size exceeded",
    message: "The selected file exceeds the maximum allowed file size.",
  },

  empty_file: {
    title: "Empty file",
    message: "The uploaded file does not contain any data.",
  },

  corrupted_file: {
    title: "Corrupted file",
    message:
      "The file could not be read. It may be corrupted or improperly formatted.",
  },

  header_missing: {
    title: "Missing headers",
    message:
      "The file does not contain column headers. Please ensure the first row contains valid headers.",
  },

  duplicate_headers: {
    title: "Duplicate headers",
    message:
      "The file contains duplicate column headers. Each column must have a unique name.",
  },

  blank_headers: {
    title: "Blank headers detected",
    message:
      "One or more column headers are empty. Please fill in all header names.",
  },

  unsupported_encoding: {
    title: "Unsupported encoding",
    message:
      "The file encoding is not supported. Please upload a UTF-8 encoded file.",
  },

  row_limit_exceeded: {
    title: "Row limit exceeded",
    message: "The file contains more rows than the allowed import limit.",
  },

  column_limit_exceeded: {
    title: "Column limit exceeded",
    message: "The file contains more columns than supported.",
  },

  invalid_data_format: {
    title: "Invalid data format",
    message: "One or more fields contain data in an invalid format.",
  },

  mandatory_field_missing: {
    title: "Missing required data",
    message: "One or more required fields are missing values.",
  },

  duplicate_records: {
    title: "Duplicate records found",
    message:
      "The file contains duplicate records that already exist in the system.",
  },

  mapping_not_completed: {
    title: "Field mapping incomplete",
    message: "Please map all required fields before continuing.",
  },

  preview_failed: {
    title: "Preview failed",
    message:
      "Unable to generate file preview. Please check the file and try again.",
  },

  google_sheet_invalid_url: {
    title: "Invalid Google Sheets link",
    message: "The provided Google Sheets URL is invalid or inaccessible.",
  },

  google_sheet_permission_denied: {
    title: "Access denied",
    message:
      "Permission denied. Please ensure the Google Sheet is publicly accessible or shared properly.",
  },

  import_failed: {
    title: "Import failed",
    message: "An unexpected error occurred during import. Please try again.",
  },

  network_error: {
    title: "Network error",
    message:
      "Network connection failed. Please check your internet connection and retry.",
  },
};
