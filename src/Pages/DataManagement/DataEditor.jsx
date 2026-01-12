import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CustomButton from "../../Components/CustomButton";
import { useToast } from "../../Components/ToastMessage/ToastContext";
import { FileImport_Error_Message } from "../../Utils/error_message_render";
import { Data_Edit_Label } from "../../Utils/label_render";
import CustomLabel from "../../Components/CustomLabel";
import { data_control_icon } from "../../Utils/img_render";

function getExcelColumnName(index) {
  let name = "";
  let n = index + 1;

  while (n > 0) {
    const rem = (n - 1) % 26;
    name = String.fromCharCode(65 + rem) + name;
    n = Math.floor((n - 1) / 26);
  }
  return name;
}

function renderCellValue(value) {
  if (value == null) return "";

  if (value instanceof Date) {
    return value.toLocaleDateString("en-IN");
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

/* -------------------------------------------
   Excel Grid Component
------------------------------------------- */
function ExcelGrid({ grid, selectedRow, onRowClick, SheetNameSelected }) {
  let isSelected = false;
  const [sidePanelExpand, setSidePanelExpand] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const showPanel = isOpen || isPinned;

  if (!grid) {
    return <div className="text-sm text-gray-500">No sheet data available</div>;
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="">
        {/* Action Buttons */}
        <div className="mb-3 flex gap-2">
          <button
            onClick={() => setIsOpen(true)}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded"
          >
            Open Panel
          </button>

          {showPanel && (
            <button
              onClick={() => setIsPinned((prev) => !prev)}
              className={`px-3 py-1 text-sm rounded ${
                isPinned ? "bg-green-600 text-white" : "bg-gray-200"
              }`}
            >
              {isPinned ? "Unpin Panel" : "Pin Panel"}
            </button>
          )}

          {showPanel && !isPinned && (
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded"
            >
              Close
            </button>
          )}
        </div>
      </div>
      <div className="flex w-full transition-all duration-300">
        {/* Table View */}
        <div
          className={`relative transition-all duration-300 ${
            showPanel ? "w-3/4" : "w-full"
          } 
          min-h-[600px] max-h-[600px] overflow-auto custom-scroll border 
        bg-light-card dark:bg-dark-card border-light-border dark:border-dark-border shadow-sm`}
        >
          {/* Header Row */}
          <div className="flex min-w-max sticky top-0 z-20 bg-light-card dark:bg-dark-card">
            <div className="w-14 flex-shrink-0 border-r border-b border-light-border dark:border-dark-border" />
            {Array.from({ length: grid.colCount }).map((_, c) => (
              <div
                key={`col-header-${c}`}
                className={`w-32 h-8 px-2 py-2 border-r border-b text-xs text-center font-extrabold 
            border-light-border dark:border-dark-border text-light-text dark:text-dark-text
            ${
              isSelected
                ? "bg-light-bg_secondary dark:bg-dark-bg_secondary"
                : "hover:bg-light-hover dark:hover:bg-dark-hover"
            }
            `}
              >
                {getExcelColumnName(c)}
              </div>
            ))}
          </div>

          {/* Data Rows */}
          {Array.from({ length: grid.rowCount }).map((_, r) => {
            const rowNumber = r + 1;
            isSelected = selectedRow === rowNumber;

            return (
              <div
                key={rowNumber}
                className={`flex min-w-max ${
                  isSelected
                    ? "bg-light-bg_secondary dark:bg-dark-bg_secondary"
                    : "hover:bg-light-hover dark:hover:bg-dark-hover"
                }`}
              >
                {/* Row Header */}
                <div
                  onClick={() => onRowClick(rowNumber)}
                  className={`sticky left-0 z-10 w-14 flex-shrink-0
                border-r border-b bg-light-card dark:bg-dark-card 
                border-light-border dark:border-dark-border
                text-light-text dark:text-dark-text
                text-xs font-extrabold
                flex items-center justify-center
                cursor-pointer select-none
                ${
                  isSelected
                    ? "bg-light-bg_secondary dark:bg-dark-bg_secondary"
                    : "hover:bg-light-hover dark:hover:bg-dark-hover"
                }
              `}
                >
                  {rowNumber}
                </div>

                {/* Cells */}
                {Array.from({ length: grid.colCount }).map((_, c) => {
                  const cellValue = grid.cells[`${rowNumber}:${c + 1}`]?.value;
                  return (
                    <div
                      key={`${rowNumber}-${c}`}
                      className={`
                    w-32 px-2 py-2
                    border-r border-b border-light-border dark:border-dark-border
                    text-sm text-light-text2 dark:text-dark-text2
                    whitespace-nowrap overflow-hidden text-ellipsis
                    ${
                      isSelected
                        ? "bg-light-bg_secondary dark:bg-dark-bg_secondary"
                        : "hover:bg-light-hover dark:hover:bg-dark-hover"
                    }
                  `}
                      title={renderCellValue(cellValue)}
                    >
                      {renderCellValue(cellValue)}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Right Side Panel */}
        {showPanel && (
          <div className="w-1/4 transition-all duration-300">
            <div
              className="h-[600px] p-4 ml-[12px] border border-t-0 
            bg-light-card dark:bg-dark-card border-light-border dark:border-dark-border"
            >
              {/* Panel header */}
              <div
                className="w-fit h-[64px] 
              bg-card dark:bg-dark-card
                p-[6px] shadow-[0_2px_6px_rgba(200,200,200,0.5)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.5)]
                border-l-[4px] border-l-icon-bg
                rounded-[4px]"
              >
                <CustomLabel
                  label_text={SheetNameSelected}
                  label_style="text-[16px] font-semibold tracking-wide text-light-text dark:text-dark-text"
                />
              </div>
              <div className="">
                <CustomButton
                  btn_bg_color="w-[200px] h-[200px] bg-icon-200"
                  iconSize="w-[64px] h-[64px] "
                  iconSrc={data_control_icon.pin_point.icon}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------
   Data Editor
------------------------------------------- */
const DataEditor = () => {
  const { fileId } = useParams();
  const { addToast } = useToast();

  const [sheets, setSheets] = useState([]);
  const [activesheetName, setActiveSheetName] = useState("");
  const [sheetData, setSheetData] = useState([]);
  const [activeSheet, setActiveSheet] = useState(0);
  const [selectedRow, setSelectedRow] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);

  /* -------------------------------------------
     Auto-open file when fileId exists/changes
  ------------------------------------------- */
  useEffect(() => {
    if (!fileId) return;
    let cancelled = false;

    async function openFile() {
      setLoading(true);

      const result = await window.DataDashBoard_API.openFile({
        file_id: fileId,
      });

      if (cancelled) return;

      if (!result?.status) {
        addToast(FileImport_Error_Message.invalid_data_format.message, "error");
        setSheets([]);
        setSheetData([]);
        setActiveSheetName("");
        setLoading(false);
        return;
      }

      const { file_sheet, sheet_data } = result.payload_result;

      setSheets(file_sheet);
      setSheetData(sheet_data);
      setActiveSheetName(file_sheet[0]);
      setActiveSheet(0);
      setSelectedRow(null);
      setLoading(false);
      setFileData(result.payload_file);
    }

    openFile();

    return () => {
      cancelled = true;
    };
  }, [fileId, addToast]);

  /*-------------------------------------------
    Reset row selection on sheet change 
    -------------------------------------------*/
  useEffect(() => {
    setSelectedRow(null);
  }, [activeSheet]);
  return (
    <div className="w-full p-3 h-[calc(100vh-50px)] overflow-y-auto custom-scroll dark:bg-dark-bg">
      {/* Heading Label */}
      <div
        className=" w-fit h-fit 
          bg-card dark:bg-dark-card
          p-[6px] shadow-[0_2px_6px_rgba(200,200,200,0.5)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.5)]
          border-l-[4px] border-l-icon-bg
          rounded-[4px]"
      >
        <CustomLabel
          label_text={`${fileData?.name ?? Data_Edit_Label.header_label.label}`}
          label_style="text-[16px] font-semibold tracking-wide text-light-text dark:text-dark-text"
        />
      </div>

      {/* Sheet Tabs */}
      {sheets.length > 0 && (
        <div className="mt-4 border-b border-light-border dark:border-dark-border overflow-x-auto custom-scroll">
          <div className="flex items-center gap-1 min-w-max">
            {sheets.map((name, index) => {
              const isActive = activeSheet === index;
              return (
                <button
                  key={name}
                  onClick={() => {
                    setActiveSheet(index);
                    setActiveSheetName(name);
                  }}
                  className={`
                      px-4 py-2 text-sm font-medium
                      border-t border-l border-r
                      rounded-t-md
                      transition-colors
                      border-light-border dark:border-dark-border
                      bg-light-card dark:bg-dark-card
                      hover:bg-light-hover dark:hover:bg-dark-hover
                      ${
                        isActive
                          ? "text-icon-seleceted_text dark:text-icon_dark-bg font-extrabold"
                          : "text-light-text_muted dark:text-dark-text_muted"
                      }
                `}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-sm text-gray-500">Loading Excel data…</div>
      )}

      {/* Excel Grid */}
      {!loading && sheetData[activeSheet] && (
        <div className="">
          <ExcelGrid
            grid={sheetData[activeSheet]}
            selectedRow={selectedRow}
            onRowClick={setSelectedRow}
            SheetNameSelected={activesheetName}
          />
        </div>
      )}
    </div>
  );
};

export default DataEditor;
