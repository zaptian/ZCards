import { useEffect, useState } from "react";
import { data_control_icon, google_icons } from "../Utils/img_render";
import { Import_files_Label } from "../Utils/label_render";
import CustomButton from "./CustomButton";
import CustomImage from "./CustomImage";
import CustomLabel from "./CustomLabel";
import CustomInput from "./CustomInput";
import { mimeStyles } from "../Utils/mime_type";
import MIME_File_icon from "./MIME_File_icon";
import { useToast } from "./ToastMessage/ToastContext";
import {
  FileImport_Error_Message,
  FileImport_Success_Message,
} from "../Utils/error_message_render";

const EditFileCard = ({ fileshow_data = {}, close_click }) => {
  const mimeStyle =
    mimeStyles?.[fileshow_data?.mime_type] || mimeStyles.default;

  return (
    <div
      className="relative
        flex items-center gap-3
        rounded-md p-2
        bg-light-card hover:bg-light-hover
        dark:bg-dark-card dark:hover:bg-dark-hover
      "
    >
      {/* Progress background */}
      {fileshow_data.status === "uploading" && (
        <div
          className="absolute top-0 left-0 h-full bg-button-success-hover rounded-md opacity-20 z-0 transition-all"
          style={{ width: `${fileshow_data.progress}%` }}
        />
      )}

      {/* File Icon */}
      <div className="w-[36px] h-[36px] flex-shrink-0 flex items-center justify-center">
        <MIME_File_icon
          dynamicText={mimeStyle.text}
          stroke_color="var(--mime-stroke)"
          text_bg_color={mimeStyle.bg_text_color}
          text_color={mimeStyle.text_color}
        />
      </div>

      {/* File Name */}
      <div className="flex-1 min-w-0">
        <CustomLabel
          label_style="
        block text-sm
        text-light-text1 dark:text-dark-text1
        truncate
      "
          label_text={fileshow_data?.name}
        />
      </div>

      {/* Remove Button */}
      <div className="flex-shrink-0 ">
        <CustomButton
          iconSize="w-[24px] h-[24px]"
          iconSrc={
            fileshow_data.status === "completed"
              ? data_control_icon.upload_success.icon
              : data_control_icon.clear.icon
          }
          btn_bg_color={`
          rounded-lg
          text-button-danger-text 
          flex items-center justify-center
          ${
            fileshow_data.status === "completed"
              ? "bg-button-success"
              : "bg-button-danger hover:bg-button-danger-hover"
          }`}
          disabled={
            fileshow_data.status === "uploading" ||
            fileshow_data.status !== "queued"
          }
          onClick={() => {
            close_click(fileshow_data?.id);
          }}
        />
      </div>
    </div>
  );
};

const UploadFileSequence = ({ files = {}, clear_item_call }) => {
  const fileList = Object.values(files);
  return fileList
    .filter(
      (file) =>
        file &&
        file.id &&
        file.name &&
        file.status &&
        file.status !== "cancelled"
    )
    .map((file) => (
      <EditFileCard
        key={file.id}
        fileshow_data={file}
        close_click={clear_item_call}
      />
    ));
};

const LoadingCircle = () => {
  return (
    <div className="flex justify-center items-center">
      <div
        className="w-6 h-6 border-2 border-light-border dark:border-dark-border
      border-t-transparent rounded-full animate-spin"
      />
    </div>
  );
};

const ImportPopOver = ({ onClose }) => {
  // Toast Message use
  const { addToast } = useToast();

  const [importMode, setImportMode] = useState("upload");
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [importQueue, setImportQueue] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [excelUpload, setExcelUpload] = useState(null);

  /*-------------------------- Import Drag & drop files ---------------------------- */
  async function get_drop_meta_data(files) {
    try {
      if (!files || files.length === 0) {
        addToast(FileImport_Error_Message.no_file_selected.message, "error");
        return;
      }
      const queueUpdates = {};
      let rejectedCount = 0;

      for (const file of files) {
        const result = await window.DataDashBoard_API.importFile({
          filePath: file,
        });

        if (!result?.file_data) continue;

        const isExcel = result.file_data?.mime_type_data?.type === "Excel";

        if (!isExcel) {
          rejectedCount++;
          continue;
        }
        queueUpdates[result.file_data.id] = {
          id: result.file_data.id,
          name: result.file_data.originalName,
          absolutePath: result.file_data.absolutePath,
          mime_type: result.file_data.mime_type,
          mime_type_data: result.file_data.mime_type_data,
          imported_at: result.file_data.imported_at,
          progress: 0,
          status: isExcel ? "queued" : "cancelled",
        };
      }

      if (Object.keys(queueUpdates).length === 0) {
        addToast("Only Excel files are supported.", "warning");
        return;
      }

      setImportQueue((prev) => ({
        ...prev,
        ...queueUpdates,
      }));

      if (rejectedCount > 0) {
        addToast(`${rejectedCount} non-Excel file(s) were ignored.`, "warning");
      }
    } catch (error) {
      console.error("Import Failed:", error);
    }
  }

  /*--------------------------------------------------------------------------------------------- */

  /*---------------------------------- Open File Upload Dialoag --------------------------------- */
  async function openFileDialog() {
    const filePaths = await window.DataDashBoard_API.import_file_dialog();
    if (!filePaths || filePaths.length === 0) {
      addToast(FileImport_Error_Message.no_file_selected.message, "error");
      return;
    }
    await get_drop_meta_data(filePaths);
  }
  /*--------------------------------------------------------------------------------------------- */

  /*---------------------------------------- Remove File Item in Queue ------------------------- */
  async function remove_file_item(file_id) {
    setImportQueue((prev) => {
      const file = prev[file_id];
      if (!file) return prev;

      // If uploading → cancel
      if (file.status === "uploading") {
        addToast(
          FileImport_Success_Message.import_cancelled.message,
          "success"
        );
        return {
          ...prev,
          [file_id]: {
            ...file,
            status: "cancelled",
          },
        };
      }

      // If queued or completed → safe to remove
      const updated = { ...prev };
      delete updated[file_id];
      return updated;
    });
  }
  /*--------------------------------------------------------------------------------------------- */

  /*---------------------------------------------- Handle Upload ------------------------------------ */
  const handleUpload = async () => {
    if (Object.keys(importQueue).length === 0) {
      addToast(FileImport_Error_Message.no_file_selected.message, "error");
      return;
    }

    setUploading(true);

    const files = Object.values(importQueue);

    for (const file of files) {
      if (file.status !== "queued") continue;

      // Mark as uploading (UI intent only)
      setImportQueue((prev) => {
        if (!prev[file.id]) return prev;

        return {
          ...prev,
          [file.id]: {
            ...prev[file.id],
            status: "uploading",
            progress: 0,
          },
        };
      });

      try {
        // 🔥 REAL upload (copy) handled by main process
        await startUpload(file);
      } catch (err) {
        // Optional: mark failed
        setImportQueue((prev) => {
          if (!prev[file.id]) return prev;
          return {
            ...prev,
            [file.id]: {
              ...prev[file.id],
              status: "cancelled",
            },
          };
        });
      }
    }

    setUploading(false);

    addToast(FileImport_Success_Message.import_completed.message, "success");
  };

  async function startUpload(file) {
    await window.DataDashBoard_API.importUpload({
      fileId: file.id,
      sourcePath: file.absolutePath,
      mime_type_data: file.mime_type_data,
    });
  }

  useEffect(() => {
    const unsubscribe = window.DataDashBoard_API.onUploadProgress(
      ({ fileId, progress }) => {
        setImportQueue((prev) => {
          const file = prev[fileId];
          if (!file || file.status === "cancelled") return prev;
          setUploadProgress(progress);
          return {
            ...prev,
            [fileId]: {
              ...file,
              progress: progress,
              status: progress >= 100 ? "completed" : "uploading",
            },
          };
        });
      }
    );

    return () => {
      unsubscribe(); // ✅ now safe
    };
  }, []);

  /*--------------------------------------- Handle Google sheet upload  ----------------------------- */

  /* ---------------------- Debouncing search ------------------ */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handlegooglesheet = async (debouncedQuery) => {
    if (!debouncedQuery) return;

    if (
      excelUpload?.url_search === debouncedQuery &&
      excelUpload?.upload_status === true
    ) {
      addToast(FileImport_Success_Message.import_completed.message, "success");
      return;
    }

    try {
      setUploading(true);

      const c_result = await window.DataDashBoard_API.importGoogleSheet({
        url: debouncedQuery,
      });

      setExcelUpload({
        url_search: debouncedQuery,
        upload_status: Boolean(c_result?.status),
      });

      if (c_result?.status) {
        addToast(
          FileImport_Success_Message.google_sheet_fetched.message,
          "success"
        );
      } else {
        addToast(
          FileImport_Error_Message.google_sheet_permission_denied.message,
          "error"
        );
      }
    } catch (error) {
      console.error("[ImportPopOver:handlegooglesheet()] Failed:", error);
      addToast(FileImport_Error_Message.unexpected_error.message, "error");
    } finally {
      setUploading(false);
    }
  };
  /*--------------------------------- Drag & Drop Handle -------------------------------------- */
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const dropPaths = [];

    for (const file of files) {
      const path = await window.DataDashBoard_API.import_file_drag_and_drop(
        file
      );
      if (path) dropPaths.push(path);
    }
    await get_drop_meta_data(dropPaths);
  };
  /*--------------------------------------------------------------------------------------------- */

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="
          absolute inset-0
          bg-black/10
          backdrop-blur-md
        "
      />

      {/* Modal Card */}
      <div
        className="
          relative w-[460px] max-w-[90%]
          bg-light-card1 dark:bg-dark-card1
          border border-light-border dark:border-dark-border
          rounded-[16px]
          shadow-xl
          p-6
        "
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-light-text1 dark:text-dark-text1">
              {Import_files_Label.Import_files.label}
            </h2>
            <p className="text-sm text-light-text2 dark:text-dark-text2">
              {Import_files_Label.Import_message_content.label}
            </p>
          </div>

          <CustomButton
            btn_bg_color="w-8 h-8 flex items-center justify-center
              rounded-full
              hover:bg-light-hover dark:hover:bg-dark-hover
              text-light-text2 dark:text-dark-text2"
            onClick={onClose}
            iconSize="w-[24px] h-[24px]"
            iconSrc={data_control_icon.clear.icon}
          />
        </div>

        {/* Upload Area */}
        {importMode === "upload" && (
          <div
            onClick={openFileDialog}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
            border-2 border-dashed
            border-light-border dark:border-dark-border
            rounded-[12px] p-6
            text-center
            cursor-pointer
            hover:bg-light-hover dark:hover:bg-dark-hover
            transition
            ${
              isDragging
                ? "border-icon-600 bg-icon-50 dark:bg-icon_dark-100"
                : "border-light-border dark:border-dark-border"
            }
          hover:bg-light-hover dark:hover:bg-dark-hover
          `}
          >
            <div
              className="
            mx-auto mb-3 w-12 h-12
            flex items-center justify-center
            rounded-full
            bg-icon-50 dark:bg-icon_dark-100
            text-icon-600 dark:text-icon_dark-600
          "
            >
              <CustomImage
                width="24px"
                height="24px"
                src={data_control_icon.cloud_upload.icon}
              />
            </div>

            <p className="text-sm font-medium text-light-text1 dark:text-dark-text1">
              {Import_files_Label.Upload_message_content.label}
            </p>
            <p className="text-xs text-light-text2 dark:text-dark-text2">
              {Import_files_Label.upload_file_size_content.label}
            </p>

            {/* Progress Bar */}
            {uploading && (
              <div className="mt-4">
                <div className="w-full h-2 bg-light-border dark:bg-dark-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-icon-600 transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>

                <p className="mt-1 text-xs text-light-text2 dark:text-dark-text2">
                  Uploading… {uploadProgress}%
                </p>
              </div>
            )}
          </div>
        )}

        {/* Other uploads */}
        {importMode === "google_sheets" && (
          <div className="space-y-3">
            <div>
              <CustomLabel
                label_style="block text-sm font-medium text-light-text1 dark:text-dark-text1 mb-1"
                label_text={Import_files_Label.google_sheets_link.label}
              />

              <CustomInput
                type="url"
                input_placeholder="https://docs.google.com/spreadsheets/d/..."
                input_classname="
                  w-full px-3 py-2 rounded-[10px]
                  bg-input-light-background dark:bg-input-dark-background
                  border border-input-light-border dark:border-input-dark-border
                  text-sm
                  text-input-light-text dark:text-input-dark-text
                  placeholder:text-input-light-placeholder dark:placeholder:text-input-dark-placeholder
                  focus:outline-none
                  focus:ring-2 focus:ring-icon-500
                "
                search_text={searchQuery}
                onChange_Access={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <p className="text-xs text-light-text2 dark:text-dark-text2">
              {Import_files_Label.Google_sheets_message_content.label}
            </p>
          </div>
        )}

        {/* Upload file sequence */}
        {Object.keys(importQueue).length > 0 && (
          <div
            className="w-full min-h-[70px] max-h-[200px] p-2
            bg-light-card1 dark:bg-dark-card1
            border border-light-border dark:border-dark-border
            mt-[20px] rounded-md
            flex flex-col gap-[10px]
            overflow-y-auto custom-scroll
          "
          >
            <div className="text-light-text dark:text-dark-text text-[14px] font-bold">
              Import list
            </div>

            <div className="flex flex-col gap-[10px]">
              {Object.keys(importQueue).length === 0 ? (
                <div className="flex justify-center items-center text-xs text-light-text2 dark:text-dark-text2">
                  No files imported yet
                </div>
              ) : (
                <UploadFileSequence
                  files={importQueue}
                  clear_item_call={remove_file_item}
                />
              )}
            </div>
          </div>
        )}

        {/* External Sources */}
        {Object.keys(importQueue).length === 0 &&
          (importMode === "upload" ? (
            <div>
              {/* Divider */}
              <div className="my-5 h-px bg-light-border dark:bg-dark-border" />
              <CustomButton
                btn_bg_color="w-full flex justify-start items-center gap-3 px-3 py-2 rounded-[8px]
                text-sm font-medium p-2
                text-light-text1 dark:text-dark-text1
                hover:bg-light-hover dark:hover:bg-dark-hover
                transition-colors"
                iconSize="w-9 h-9 flex items-center justify-center
                rounded-[8px] p-[6px]
                bg-icon-50 dark:bg-icon_dark-100"
                iconSrc={google_icons.google_sheets.icon}
                label={`${Import_files_Label.Google_sheets.label}`}
                onClick={() => setImportMode("google_sheets")}
              />
            </div>
          ) : null)}

        {/* Footer */}
        <div
          className={`mt-6 flex items-center ${
            importMode === "google_sheets" ? "justify-between" : "justify-end"
          }`}
        >
          {/* Back Button (Left) */}
          {importMode === "google_sheets" && (
            <CustomButton
              btn_bg_color="
                flex items-center gap-2
                px-3 py-2 rounded-[8px]
                text-sm font-medium
                text-icon-600 dark:text-icon_dark-600
                hover:bg-light-hover dark:hover:bg-dark-hover
                transition-colors
              "
              iconSize="
                w-7 h-7 flex items-center justify-center
                rounded-[8px] p-[6px]
              "
              iconSrc={data_control_icon.left_arrow_large.icon}
              label={Import_files_Label.back_file_upload.label}
              onClick={() => setImportMode("upload")}
            />
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Cancel Button */}
            <CustomButton
              btn_bg_color="
                px-4 py-2 rounded-[10px]
                border border-light-border dark:border-dark-border
                text-sm
                text-light-text1 dark:text-dark-text1
                hover:bg-light-hover dark:hover:bg-dark-hover
              "
              onClick={onClose}
              label={Import_files_Label.cancel.label}
            />

            {/* Submit Button */}
            <CustomButton
              btn_bg_color="
                px-4 py-2 rounded-[10px]
                bg-icon-600 hover:bg-icon-500
                text-white text-sm
              "
              disabled={uploading}
              onClick={() => {
                if (importMode === "upload") {
                  handleUpload();
                } else if (importMode === "google_sheets") {
                  handlegooglesheet(debouncedQuery);
                }
              }}
              label={
                uploading ? (
                  <LoadingCircle />
                ) : importMode === "upload" ? (
                  Import_files_Label.import_files.label
                ) : (
                  Import_files_Label.Get_link.label
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportPopOver;
