import { Data_Management_Label } from "../Utils/label_render";
import CustomLabel from "./CustomLabel";
import MIME_File_icon from "./MIME_File_icon";

function formatFileSize(bytes, decimals = 2) {
  if (!bytes || bytes === 0) return "0 B";

  const k = 1024;
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${
    units[i]
  }`;
}

function formatDateTimeNoSeconds(dateValue) {
  const date = new Date(dateValue);

  return date
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace("am", "AM")
    .replace("pm", "PM");
}

const HistoryFilePreview = ({ filetype = {}, mimetype = {} }) => {
  return (
    <div className="flex flex-col w-full h-full">
      {/* Header Label */}
      <div className="flex justify-start items-center m-[10px]">
        <CustomLabel
          label_text={`${Data_Management_Label.file_Details.label} ${
            filetype ? ` : ${filetype.name}` : ""
          } `}
          label_style="text-[16px] font-semibold tracking-wide text-light-text dark:text-dark-text truncate "
        />
      </div>
      <div className="w-full h-[2px] bg-light-border dark:bg-dark-border"></div>

      {/* File Icon */}
      {mimetype ? (
        <div className="w-full h-[256px] flex justify-center items-center">
          <MIME_File_icon
            key={filetype.id}
            dynamicText={mimetype.text}
            stroke_color={"var(--mime-stroke)"}
            text_bg_color={mimetype.bg_text_color}
            text_color={mimetype.text_color}
          />
        </div>
      ) : null}
      {/* Overview Label */}
      {filetype && mimetype ? (
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex justify-start items-center m-[10px]">
            <CustomLabel
              label_text={Data_Management_Label.file_Overview.label}
              label_style="text-[16px] font-semibold tracking-wide text-light-text dark:text-dark-text"
            />
          </div>
          <div className="w-full h-[2px] bg-light-border dark:bg-dark-border"></div>

          {/* File Overview Details */}
          <div className="m-[10px] grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
            {/* File Name */}
            <div className="col-span-1 sm:col-span-2 flex flex-col">
              <span className="text-[12px] font-medium text-light-text_muted dark:text-dark-text_muted uppercase tracking-wide">
                {Data_Management_Label.file_name.label}
              </span>
              <span className="font-semibold text-light-text dark:text-dark-text truncate">
                {filetype.name}
              </span>
            </div>

            {/* File Type */}
            <div className="flex flex-col">
              <span className="text-[12px] font-medium text-light-text_muted dark:text-dark-text_muted uppercase tracking-wide">
                {Data_Management_Label.file_Type.label}
              </span>
              <span className="uppercase font-semibold text-light-text dark:text-dark-text">
                {filetype.mime_type_data.type}
              </span>
            </div>

            {/* File Extension */}
            <div className="flex flex-col">
              <span className="text-[12px] font-medium text-light-text_muted dark:text-dark-text_muted uppercase tracking-wide">
                {Data_Management_Label.file_extension.label}
              </span>
              <span className="font-semibold text-light-text dark:text-dark-text">
                {filetype.mime_type_data.extension}
              </span>
            </div>

            {/* File Size */}
            <div className="flex flex-col">
              <span className="text-[12px] font-medium text-light-text_muted dark:text-dark-text_muted uppercase tracking-wide">
                {Data_Management_Label.file_size.label}
              </span>
              <span className="font-semibold text-light-text dark:text-dark-text">
                {formatFileSize(filetype.size)}
              </span>
            </div>

            {/* Last Modified */}
            <div className="flex flex-col">
              <span className="text-[12px] font-medium text-light-text_muted dark:text-dark-text_muted uppercase tracking-wide">
                {Data_Management_Label.file_modified_at.label}
              </span>
              <span className="w-[100px] font-semibold text-light-text dark:text-dark-text">
                {formatDateTimeNoSeconds(filetype.last_modified_at)}
              </span>
            </div>

            {/* Last Opened */}
            <div className="flex flex-col">
              <span className="text-[12px] font-medium text-light-text_muted dark:text-dark-text_muted uppercase tracking-wide">
                {Data_Management_Label.file_last_open_at.label}
              </span>
              <span className="w-[100px] font-semibold text-light-text dark:text-dark-text">
                {formatDateTimeNoSeconds(filetype.imported_at)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-[200px] justify-center items-center text-lg font-bold text-light-text_secondary dark:text-dark-text_secondary">
          {Data_Management_Label.no_overview.label}
        </div>
      )}
    </div>
  );
};

export default HistoryFilePreview;
