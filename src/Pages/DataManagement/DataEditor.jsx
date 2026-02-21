import { useParams } from "react-router-dom";
import { Grid, List } from "react-virtualized";
import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { CopyIcon, FileImageIcon, View } from "lucide-react";

import CustomButton from "../../Components/CustomButton";
import { useToast } from "../../Components/ToastMessage/ToastContext";
import { FileImport_Error_Message } from "../../Utils/error_message_render";
import { DataEditor_Label, DataEditor_message } from "../../Utils/label_render";
import CustomLabel from "../../Components/CustomLabel";
import { data_control_icon } from "../../Utils/img_render";
import CustomInput from "../../Components/CustomInput";

// GLOBAL VALUES
const MAX_ROW_LIMIT = 1_048_576;
const MAX_COLUMN_LIMIT = 16_384;

const GRID_VIEWPORT_HEIGHT = 600;
const MIN_ROW_HEADER_WIDTH = 56;
const COLUMN_WIDTH = 128;
const ROW_HEIGHT = 35;

const SCAN_COLUMN_COUNT = 5;
const SCAN_ROW_COUNT = 5;
const DATA_BUFFER = 30;

/*--------------------------------------------------------------- */
/**
 * @function  getExcelColumnName(index)
 * @purpose       To Assign the column Names
 */
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
/*--------------------------------------------------------------- */

/*--------------------------------------------------------------- */
/**
 * @function  renderCellValue(value)
 * @purpose       To render the cell value
 */
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
/*--------------------------------------------------------------- */

/*--------------------------------------------------------------- */
/**
 * @function  renderRowHeaderCell -> { index, key, style }
 * @purpose   To render the Row Header value
 */
const renderRowHeaderCell = ({ index, key, style }) => {
  return (
    <div
      key={key}
      style={{ ...style }}
      className="sticky left-0 z-10 h-[35px] w-full
                 border-r border-b
                 bg-light-card dark:bg-dark-card
                 border-light-border dark:border-dark-border
                 text-light-text dark:text-dark-text
                 text-xs font-extrabold
                 flex items-center justify-center
                 cursor-pointer select-none"
    >
      {index === 0 ? "" : index}
    </div>
  );
};

/*--------------------------------------------------------------- */

/*--------------------------------------------------------------- */
/**
 * @function  RowHeaderComponent -> { rowCount, height, scrollTop }
 * @purpose       To render the Row Header List
 */

const getRowHeaderWidth = (rowCount) => {
  const digits = rowCount.toString().length;
  return Math.max(MIN_ROW_HEADER_WIDTH, digits * 10 + 20);
};

const RowHeaderComponent = ({ rowCount, height, scrollTop }) => {
  const width = useMemo(() => getRowHeaderWidth(rowCount), [rowCount]);
  return (
    <List
      width={width}
      height={height}
      rowCount={rowCount}
      rowHeight={ROW_HEIGHT}
      scrollTop={scrollTop}
      rowRenderer={renderRowHeaderCell}
      overscanRowCount={SCAN_ROW_COUNT}
      scrollingResetTimeInterval={0}
      style={{ overflowY: "hidden", minWidth: width }}
    />
  );
};

/*--------------------------------------------------------------- */

/*--------------------------------------------------------------- */
/**
 * @function  renderColumnHeaderCell -> { columnIndex, key, style }
 * @purpose       To render the Column Header value
 */
const renderColumnHeaderCell = ({ columnIndex, key, style }) => {
  return (
    <div
      key={key}
      style={style}
      className="flex sticky top-0 z-10 bg-light-card dark:bg-dark-card w-32 h-[35px] px-2 py-2 border-r border-b text-xs text-center justify-center font-extrabold
    border-light-border dark:border-dark-border text-light-text dark:text-dark-text"
    >
      {columnIndex >= 0 ? getExcelColumnName(columnIndex) : ""}
    </div>
  );
};
/*--------------------------------------------------------------- */

/*--------------------------------------------------------------- */
/**
 * @function  ColumnHeaderComponent -> { colCount, columnWidth }
 * @purpose       To render the Column Header List
 */
const ColumnHeaderComponent = ({ colCount, width, scrollLeft }) => {
  return (
    <Grid
      columnCount={colCount}
      rowCount={1}
      columnWidth={COLUMN_WIDTH}
      rowHeight={ROW_HEIGHT}
      height={ROW_HEIGHT}
      width={width}
      scrollLeft={scrollLeft}
      cellRenderer={renderColumnHeaderCell}
      overscanColumnCount={SCAN_COLUMN_COUNT}
      scrollTop={0}
      style={{ overflowX: "hidden" }}
      scrollingResetTimeInterval={0}
    />
  );
};
/*--------------------------------------------------------------- */

/*--------------------------------------------------------------- */
/**
 * @function  ExcelTableView => memo
 * @purpose       To Make a view of Excel Table
 */
const ExcelTableView = memo(function ExcelTabel({
  gridTableData = [],
  gridFileID,
  ToastMessage,
}) {
  const [sheetName, setSheetName] = useState("");
  const [rowCount, setRowCount] = useState(0);
  const [colCount, setColCount] = useState(0);
  const [copiedCell, setCopiedCell] = useState(false);

  useEffect(() => {
    setSheetName(gridTableData?.name || "");
    setRowCount(gridTableData?.rowCount || 0);
    setColCount(gridTableData?.colCount || 0);
  }, [gridTableData]);

  useEffect(() => {
    setRowCache({});
  }, [sheetName]);

  /*-----------------------------------------------------------*/
  /*Row Count Validations */
  /*-----------------------------------------------------------*/
  const effectiveRowCount = useMemo(() => {
    if (rowCount > MAX_ROW_LIMIT) {
      ToastMessage(
        `[RowHeaderComponent] Row limit exceeded.
        Requested: ${rowCount}
        Maximum allowed: ${MAX_ROW_LIMIT}
        Rows have been capped to ${MAX_ROW_LIMIT}.`,
        "error",
      );
      console.error(
        `[RowHeaderComponent] Row limit exceeded.
        Requested: ${rowCount}
        Maximum allowed: ${MAX_ROW_LIMIT}
        Rows have been capped to ${MAX_ROW_LIMIT}.`,
      );
      return MAX_ROW_LIMIT;
    }
    return rowCount;
  }, [rowCount]);

  /*-----------------------------------------------------------*/
  /*Column Count Validations */
  /*-----------------------------------------------------------*/
  const effectiveColCount = useMemo(() => {
    if (colCount > MAX_COLUMN_LIMIT) {
      ToastMessage(
        `[RowHeaderComponent] Column limit exceeded.
        Requested: ${rowCount}
        Maximum allowed: ${MAX_COLUMN_LIMIT}
        Columns have been capped to ${MAX_COLUMN_LIMIT}.`,
        "error",
      );
      console.error(
        `[RowHeaderComponent] Column limit exceeded.
        Requested: ${rowCount}
        Maximum allowed: ${MAX_COLUMN_LIMIT}
        Columns have been capped to ${MAX_COLUMN_LIMIT}.`,
      );
      return MAX_COLUMN_LIMIT;
    }
    return colCount;
  }, [colCount]);

  /*-----------------------------------------------------------*/
  /* Container width measurement */
  /*-----------------------------------------------------------*/
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const rowHeaderWidth = useMemo(
    () => getRowHeaderWidth(effectiveRowCount),
    [effectiveRowCount],
  );
  const gridViewportWidth = Math.max(0, containerWidth - rowHeaderWidth);

  /*-----------------------------------------------------------*/
  /* Scroll Sync */
  /*-----------------------------------------------------------*/
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const onGridScroll = ({ scrollLeft, scrollTop }) => {
    setScrollLeft(scrollLeft);
    setScrollTop(scrollTop);
  };

  /* ===================================================== */
  /* ROW CACHE                                             */
  /* ===================================================== */
  const [rowCache, setRowCache] = useState({});
  const isFetchingRef = useRef(false);

  /* ===================================================== */
  /* FETCH RANGE                                           */
  /* ===================================================== */
  const fetchRange = useCallback(
    async (startIndex, stopIndex) => {
      if (!sheetName) return;
      if (isFetchingRef.current) return;

      const start = Math.max(0, startIndex - DATA_BUFFER);
      const end = Math.min(effectiveRowCount - 1, stopIndex + DATA_BUFFER);

      // Check if we already have data
      let needsFetch = false;
      for (let i = start; i <= end; i++) {
        if (!rowCache[i]) {
          needsFetch = true;
          break;
        }
      }

      if (!needsFetch) return;

      try {
        isFetchingRef.current = true;

        const result = await window.DataDashBoard_API.fetchDataRange({
          fileID: gridFileID,
          sheetName,
          startRow: start + 1,
          endRow: end + 1,
        });

        if (result.status) {
          setRowCache((prev) => {
            const updated = { ...prev };

            result.rows.forEach((dbRow) => {
              const zeroBasedIndex = dbRow.row - 1; // IMPORTANT
              updated[zeroBasedIndex] = JSON.parse(dbRow.data);
            });

            return updated;
          });
        } else {
          console.error(result.error);
        }
      } catch (err) {
        console.error("Range fetch failed:", err);
      } finally {
        isFetchingRef.current = false;
      }
    },
    [sheetName, effectiveRowCount, rowCache],
  );

  /* -----------------------------------------------------------*/
  /* Cell Data Rendering */
  /* -----------------------------------------------------------*/
  const cellRenderer = useCallback(
    ({ rowIndex, columnIndex, key, style }) => {
      const row = rowCache?.[rowIndex];
      const cellValue = row?.[columnIndex];
      const renderedValue = renderCellValue(cellValue);

      return (
        <div
          key={key}
          style={style}
          title={renderedValue ?? ""}
          className="
          group relative
          p-[6px]
          border-r border-b border-light-border dark:border-dark-border
          text-sm text-light-text2 dark:text-dark-text2
          whitespace-nowrap overflow-hidden text-ellipsis
        "
        >
          {renderedValue ?? ""}

          {/* Copy icon — only visible on hover */}
          {renderedValue && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.DataDashBoard_API.copyClipBoardText(renderedValue);
                setCopiedCell(true);
                setTimeout(() => setCopiedCell(false), 250);
                ToastMessage(
                  DataEditor_message.clipboard_copied_message.message,
                  DataEditor_message.clipboard_copied_message.message_type,
                );
              }}
              className="
              absolute right-1 top-1/2 -translate-y-1/2
              opacity-0 group-hover:opacity-100
              transition-opacity duration-150
              p-[2px] rounded
              border border-light-border dark:border-dark-border
              bg-light-card1 dark:bg-dark-card2
              hover:bg-light-hover dark:hover:bg-dark-hover
              hover:scale-105
              text-light-text2 dark:text-dark-text2
            "
              title="Copy"
            >
              <CopyIcon
                size={12}
                className={`transition-colors duration-150 ${
                  copiedCell
                    ? "text-clipboard_copy" // ← copied color
                    : "text-light-text2 dark:text-dark-text2" // ← normal color
                }`}
              />
            </button>
          )}
        </div>
      );
    },
    [rowCache, renderCellValue, copiedCell],
  );

  /* ===================================================== */
  /* HANDLE VISIBLE RANGE                                  */
  /* ===================================================== */

  const handleSectionRendered = useCallback(
    ({ rowStartIndex, rowStopIndex }) => {
      fetchRange(rowStartIndex, rowStopIndex);
    },
    [fetchRange],
  );

  return (
    <div
      ref={containerRef}
      className={`
        relative
        min-h-[600px]        
        border bg-light-card dark:bg-dark-card
        border-light-border dark:border-dark-border
        shadow-sm
      `}
    >
      <div className="flex">
        <RowHeaderComponent
          rowCount={effectiveRowCount + 1}
          height={GRID_VIEWPORT_HEIGHT}
          scrollTop={scrollTop}
        />
        <div className="flex flex-col">
          <div>
            <ColumnHeaderComponent
              colCount={effectiveColCount}
              width={gridViewportWidth}
              scrollLeft={scrollLeft}
            />
          </div>
          <Grid
            className="custom-scroll"
            columnCount={effectiveColCount}
            rowCount={effectiveRowCount}
            columnWidth={COLUMN_WIDTH}
            rowHeight={ROW_HEIGHT}
            height={GRID_VIEWPORT_HEIGHT - ROW_HEIGHT}
            width={gridViewportWidth}
            overscanColumnCount={SCAN_COLUMN_COUNT}
            overscanRowCount={SCAN_ROW_COUNT}
            scrollLeft={scrollLeft}
            scrollTop={scrollTop}
            onScroll={onGridScroll}
            onSectionRendered={handleSectionRendered}
            cellRenderer={cellRenderer}
          />
        </div>
      </div>
    </div>
  );
});
/*--------------------------------------------------------------- */

/*--------------------------------------------------------------- */
/**
 * @function  LoadingCircle => ()
 * @purpose   To view Circle loading icon
 */
const LoadingCircle = () => (
  <div className="flex justify-center items-center h-[200px]">
    <div
      className="w-6 h-6 border-2 border-light-border dark:border-dark-border
      border-t-transparent rounded-full animate-spin"
    />
  </div>
);
/*--------------------------------------------------------------- */

/*--------------------------------------------------------------- */
/**
 * @function  ExcelSidePanel => memo
 * @purpose       To Make a view of Excel Side Panel Data
 */
const ExcelSidePanel = memo(function SidePanel({
  gridFileID,
  sheetName,
  gridDataCount,
}) {
  const { addToast: ToastMessage } = useToast();
  const [isEditorEnabled, setIsEditorEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    headerRow: { value: "" }, // single value
    column: { from: "", to: "" }, // range
    dataRow: { from: "", to: "" }, // range
  });

  const formElement = [
    {
      label: "Header Row",
      key: "headerRow",
      type: "number",
      singleValue: true,
    },
    { label: "Column", key: "column", type: "text", singleValue: false },
    { label: "Data Row", key: "dataRow", type: "number", singleValue: false },
  ];

  const fieldStructure = {
    headerRow: { type: "number", label: "Header Row", singleValue: true },
    column: { type: "text", label: "Column", singleValue: false },
    dataRow: { type: "number", label: "Data Row", singleValue: false },
  };

  // ── Helpers ────────────────────────────────────────────────

  const isValidNumber = (value) => /^[0-9]+$/.test(value);
  const isValidText = (value) => /^[A-Za-z]+$/.test(value);

  const columnToIndex = (value) =>
    value
      .toUpperCase()
      .split("")
      .reduce((acc, char) => acc * 26 + (char.charCodeAt(0) - 64), 0);

  const indexToColumn = (index) => {
    let result = "";
    while (index > 0) {
      const remainder = (index - 1) % 26;
      result = String.fromCharCode(65 + remainder) + result;
      index = Math.floor((index - 1) / 26);
    }
    return result;
  };

  // ── Validation ─────────────────────────────────────────────

  const validateFormData = (formData) => {
    for (const [fieldKey, fieldValue] of Object.entries(formData)) {
      const { type, label, singleValue } = fieldStructure[fieldKey];

      const rangeKeys = singleValue ? ["value"] : ["from", "to"];

      for (const rangeKey of rangeKeys) {
        const value = fieldValue[rangeKey];

        // Required
        if (!value) {
          return `${label} ${singleValue ? "" : rangeKey} is required`.trim();
        }

        // Type validation
        if (type === "number" && !isValidNumber(value)) {
          return `${label} must contain numbers only`;
        }
        if (type === "text" && !isValidText(value)) {
          return `${label} must contain letters A–Z only`;
        }

        // Number range bounds
        if (type === "number") {
          const num = Number(value);
          const { minCount, maxCount } = gridDataCount?.gridRowData;
          if (num < minCount || num > maxCount) {
            return `${label} must be in range (${minCount} – ${maxCount})`;
          }
        }

        // Column range bounds
        if (type === "text") {
          const colIndex = columnToIndex(value);
          const { minCount, maxCount } = gridDataCount?.gridColData;
          if (colIndex < minCount || colIndex > maxCount) {
            return `${label} must be in range (${getExcelColumnName(minCount)} – ${getExcelColumnName(maxCount)})`;
          }
        }
      }

      // from > to check — only for range fields, outside the loop
      if (!singleValue) {
        if (type === "number") {
          const fromNum = Number(fieldValue.from);
          const toNum = Number(fieldValue.to);
          if (fromNum > toNum) {
            return `${label}: 'from' (${fromNum}) cannot be greater than 'to' (${toNum})`;
          }
        }
        if (type === "text") {
          const fromCol = columnToIndex(fieldValue.from);
          const toCol = columnToIndex(fieldValue.to);
          if (fromCol > toCol) {
            return `${label}: '${fieldValue.from}' cannot be greater than '${fieldValue.to}'`;
          }
        }
      }
    }

    return "";
  };

  // ── Save ───────────────────────────────────────────────────

  const handleSave = async () => {
    setIsEditorEnabled(false);
    setIsLoading(true);

    const error = validateFormData(formData);
    if (error) {
      ToastMessage(error, "error");
      setIsLoading(false);
      // setIsEditorEnabled(true);
      return;
    }

    // Expand back to the shape the API expects
    const result = await window.DataDashBoard_API.addFormData({
      fileID: gridFileID,
      sheetName: sheetName,
      formData: {
        headerRow: formData.headerRow.value, // single number
        headerColumn: formData.column, // { from, to }
        dataRow: formData.dataRow, // { from, to }
        dataColumn: formData.column, // shared with headerColumn
      },
    });

    if (result?.status) {
      ToastMessage("Data saved successfully", "success");
    }

    setIsEditorEnabled(true);
    setIsLoading(false);
  };

  //

  const handleEdit = async () => {};

  // ── Input change handlers ──────────────────────────────────

  const handleRangeChange = useCallback(
    (section, field) => (e) => {
      const value = e.target.value;
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [field]: value },
      }));
    },
    [],
  );

  const handleSingleChange = useCallback(
    (section) => (e) => {
      const value = e.target.value;
      setFormData((prev) => ({
        ...prev,
        [section]: { value },
      }));
    },
    [],
  );

  // ── Shared input class builder ─────────────────────────────

  const inputClass = (type) => `
    h-[40px] px-3 w-full text-sm font-bold rounded-md
    bg-input-light-background dark:bg-input-dark-background
    border-[1px] border-input-light-border dark:border-input-dark-border
    text-input-light-text dark:text-input-dark-text
    placeholder:input-light-placeholder dark:placeholder:input-light-placeholder
    focus:outline-none focus:ring-2 focus:input-light-border_focus
    ${type === "number" ? "no-number-arrows" : "uppercase"}
  `;

  // ── Render ─────────────────────────────────────────────────

  return (
    <div className="w-full h-full px-3 py-2">
      <div className="mt-4 space-y-4">
        {formElement.map(({ label, key, type, singleValue }) => (
          <div
            key={key}
            className="grid grid-cols-[140px_1fr] gap-4 items-center"
          >
            <CustomLabel
              title={label}
              label_text={label}
              required={true}
              label_style="text-sm font-medium text-light-text dark:text-dark-text"
            />

            {singleValue ? (
              // ── Single input (Header Row) ──────────────────
              <CustomInput
                type={type}
                input_placeholder={gridDataCount.gridRowData.minCount}
                search_text={formData[key].value}
                onChange_Access={handleSingleChange(key)}
                input_classname={inputClass(type)}
              />
            ) : (
              // ── From / To inputs (Column, Data Row) ────────
              <div className="flex gap-3">
                <CustomInput
                  type={type}
                  input_placeholder={
                    type === "text"
                      ? gridDataCount.gridColData.minCount
                      : gridDataCount.gridRowData.minCount
                  }
                  search_text={formData[key].from}
                  onChange_Access={handleRangeChange(key, "from")}
                  input_classname={inputClass(type)}
                />
                <CustomInput
                  type={type}
                  input_placeholder={
                    type === "text"
                      ? gridDataCount.gridColData.maxCount
                      : gridDataCount.gridRowData.maxCount
                  }
                  search_text={formData[key].to}
                  onChange_Access={handleRangeChange(key, "to")}
                  input_classname={inputClass(type)}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <CustomButton
          label={isLoading ? <LoadingCircle /> : "Save Data"}
          onClick={handleSave}
          disabled={isLoading}
          btn_bg_color="
            inline-flex items-center justify-center
            h-[40px] px-3 py-2 rounded-md text-sm font-medium
            bg-button-primary hover:bg-button-primary-hover
            text-white transition-colors
          "
        />

        <CustomButton
          label="Open Editor"
          disabled={!isEditorEnabled}
          onClick={handleEdit}
          btn_bg_color={`
            inline-flex items-center justify-center
            h-[40px] px-3 py-2 rounded-md text-sm font-medium
            ${
              isEditorEnabled
                ? "bg-button-success hover:bg-button-success-hover text-white"
                : "bg-gray-300 text-light-text_muted dark:text-dark-text_muted cursor-not-allowed"
            }
          `}
        />
      </div>
    </div>
  );
});

/*--------------------------------------------------------------- */

/*--------------------------------------------------------------- */
/**
 * @function  ExcelGridContainer => memo
 * @purpose       To Make a view of Excel Grid Container
 */
const ExcelGridContainer = memo(function ExcelGridContainer({
  grid,
  gridFileID,
  SheetNameSelected,
  ToastMessage,
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [isPinned, setIsPinned] = useState(false);
  const showPanel = isOpen || isPinned;

  if (!grid) {
    return <div className="text-sm text-gray-500">No sheet data available</div>;
  }

  /*-----------------------------------------------------------*/
  /* MANAGE GRID DATA COUNT */
  /*-----------------------------------------------------------*/
  const gridDataCount = useMemo(
    () => ({
      gridRowData: { minCount: 1, maxCount: grid.rowCount },
      gridColData: {
        minCount: "A",
        maxCount: getExcelColumnName(grid.colCount - 1),
      },
    }),
    [grid],
  );

  /*-----------------------------------------------------------*/
  /* HANDEL BUTTON CLICK */
  /*-----------------------------------------------------------*/
  const lockRef = useRef(false);
  const handleClick = (setElement) => {
    if (lockRef.current) return;

    lockRef.current = true;
    setElement((prev) => !prev);

    setTimeout(() => {
      lockRef.current = false;
    }, 300);
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/*-----------------------------------------------------------*/
      /* EXCEL DATA SECTION */
      /*-----------------------------------------------------------*/}
      <div className="relative flex w-full min-h-[600px] max-h-[600px] overflow-hidden">
        {/*-----------------------------------------------------------*/
        /* EXCEL TABEL SECTION */
        /*-----------------------------------------------------------*/}
        <div
          className={`
            transition-all duration-300
            ${showPanel ? "w-[calc(100%-360px)]" : "w-full"}
          `}
        >
          <ExcelTableView
            gridTableData={grid}
            gridFileID={gridFileID}
            ToastMessage={ToastMessage}
          />
          {/* <ExcelTableView1 gridTableData={grid} isSelected={isSelected} /> */}
        </div>

        {/*-----------------------------------------------------------*/
        /* SIDEBAR PANEL SECTION */
        /*-----------------------------------------------------------*/}
        <div
          className={`
            absolute top-0 right-0 h-full w-[360px] z-50
            bg-light-card dark:bg-dark-card
            border border-light-border dark:border-dark-border
            transform transition-transform duration-500 ease-in-out
            ${showPanel ? " translate-x-0 opacity-100" : "translate-x-full"} }
          `}
        >
          {/*-----------------------------------------------------------*/
          /* SIDEBAR TOGGLE BUTTON */
          /*-----------------------------------------------------------*/}
          <div
            title={
              showPanel
                ? DataEditor_Label.title_close_sidepanel.title
                : DataEditor_Label.title_open_sidepanel.title
            }
            className="
              absolute top-1/2 -left-6 -translate-y-1/2
              w-6 h-16
              flex items-center justify-center
              bg-card dark:bg-dark-card
              border-2 border-icon-bg dark:border-icon_dark-bg
              rounded-tl-lg rounded-bl-lg
              cursor-pointer
              hover:bg-light-hover dark:hover:bg-dark-hover
            "
            onClick={() => {
              if (!isPinned) {
                handleClick(setIsOpen);
              } else {
                ToastMessage(
                  DataEditor_message.sidebar_pinned_message.message,
                  DataEditor_message.sidebar_pinned_message.message_type,
                );
              }
            }}
          >
            <CustomButton
              btn_bg_color="w-6 h-16 text-icon-bg dark:text-icon_dark-bg flex items-center justify-center"
              iconSize="w-6 h-6"
              icon_animation="hover:scale-125"
              iconSrc={
                showPanel
                  ? data_control_icon.sm_right_arrow_head.icon
                  : data_control_icon.sm_left_arrow_head.icon
              }
            />
          </div>

          {/*-----------------------------------------------------------*/
          /* SIDEBAR DATA SECTION */
          /*-----------------------------------------------------------*/}
          <div className="px-2 py-2 w-full h-full">
            {/*-----------------------------------------------------------*/
            /* SIDEBAR DATA HEADER CONTENT */
            /*-----------------------------------------------------------*/}
            <div className="flex items-center justify-between gap-2 w-full">
              {/*-----------------------------------------------------------*/
              /* SIDEBAR TITLE */
              /*-----------------------------------------------------------*/}
              <div
                className="
                    max-w-[240px]
                    bg-card dark:bg-dark-card
                    p-[6px]
                    shadow-[0_2px_6px_rgba(200,200,200,0.5)]
                    dark:shadow-[0_2px_6px_rgba(0,0,0,0.5)]
                    border-l-[4px] border-l-icon-bg
                    rounded-[4px]
                    overflow-hidden
                    
                  "
              >
                <CustomLabel
                  title={SheetNameSelected}
                  label_text={SheetNameSelected}
                  label_style="
                      text-[16px] font-semibold tracking-wide
                      text-light-text dark:text-dark-text
                      whitespace-nowrap overflow-hidden text-ellipsis block
                    "
                />
              </div>

              {/*-----------------------------------------------------------*/
              /* SIDEBAR PIN BUTTON */
              /*-----------------------------------------------------------*/}
              <CustomButton
                btn_bg_color={`w-[36px] h-[36px] 
                    ${
                      isPinned
                        ? "bg-icon-bg dark:bg-icon_dark-bg text-light-text1 dark:text-dark-text1"
                        : "bg-light-card1 dark:bg-dark-card1 text-light-text2 dark:text-dark-text2"
                    } 
                    rounded-lg
                    shadow-[0_2px_6px_rgba(200,200,200,0.5)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.5)]`}
                iconSize="w-5 h-5"
                icon_animation="hover:scale-125"
                iconSrc={data_control_icon.pin_point.icon}
                onClick={() => handleClick(setIsPinned)}
              />
            </div>

            {/*-----------------------------------------------------------*/
            /* SIDEBAR DATA CONTENT */
            /*-----------------------------------------------------------*/}
            <ExcelSidePanel
              gridFileID={gridFileID}
              sheetName={SheetNameSelected}
              gridDataCount={gridDataCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
});
/*--------------------------------------------------------------- */

const ExcelModeSwitch = ({ Mode, Label }) => {
  return (
    <div
      className="
          inline-flex items-center gap-2
          w-fit h-fit 
          bg-card dark:bg-dark-card
          p-[6px]
          shadow-[0_2px_6px_rgba(200,200,200,0.5)]
          dark:shadow-[0_2px_6px_rgba(0,0,0,0.5)]
          border border-icon-bg
          rounded-[4px]
          text-[16px] font-semibold tracking-wide
          text-light-text dark:text-dark-text
        "
    >
      {Mode && <Mode size={20} />}
      <span>{Label}</span>
    </div>
  );
};

/*--------------------------------------------------------------- */
/**
 * @function  DataEditor => COMPONENT
 * @purpose       To Make a view of DATA EDITOR SECTION
 */
const DataEditor = () => {
  const { fileId } = useParams();
  const { addToast } = useToast();

  const [totalSheets, setTotalSheets] = useState(0);
  const [sheets, setSheets] = useState([]);
  const [activeSheet, setActiveSheet] = useState(0);
  const [activesheetName, setActiveSheetName] = useState("");

  const [sheetData, setSheetData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);

  const [fileData, setFileData] = useState(null);
  const [fileID, setFileID] = useState(null);
  const [loading, setLoading] = useState(false);

  /*-----------------------------------------------------------*/
  /* TOAST MESSAGE CALLBACK CREATION */
  /*-----------------------------------------------------------*/
  const showToastMessage = useCallback(
    (ErroMessage, ErrorType) => {
      addToast(ErroMessage, ErrorType);
    },
    [addToast],
  );

  /*-----------------------------------------------------------*/
  /* AUTO-OPEN FILE SETTINGS */
  /*-----------------------------------------------------------*/
  useEffect(() => {
    if (!fileId) return;
    let cancelled = false;

    async function openFile() {
      setLoading(true);

      const result = await window.DataDashBoard_API.fetchData({
        file_id: fileId,
      });

      if (cancelled) return;

      if (!result?.status) {
        addToast(FileImport_Error_Message.invalid_data_format.message, "error");
        setSheets([]);
        setSheetData([]);
        setTotalSheets(0);
        setTotalRows(0);
        setFileID(null);
        setActiveSheetName("");
        setLoading(false);
        return;
      }

      const { sheetNames, sheetData, totalSheets, totalRows } =
        result.payload_result;

      setFileID(fileId);
      setSheets(sheetNames);
      setSheetData(sheetData);
      setActiveSheetName(sheetNames[0]);
      setActiveSheet(0);
      setTotalSheets(totalSheets);
      setTotalRows(totalRows);
      setLoading(false);
      setFileData(result.payload_file);
    }

    openFile();

    return () => {
      cancelled = true;
    };
  }, [fileId, addToast]);

  return (
    <div className="w-full p-3 h-[calc(100vh-50px)] overflow-y-auto custom-scroll dark:bg-dark-bg">
      {/*-----------------------------------------------------------*/
      /* HEADER SECTION */
      /*-----------------------------------------------------------*/}
      <div className="flex flex-row justify-between items-center">
        <div
          className="w-fit h-fit 
          bg-card dark:bg-dark-card
          p-[6px] shadow-[0_2px_6px_rgba(200,200,200,0.5)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.5)]
          border-l-[4px] border-l-icon-bg
          rounded-[4px] "
        >
          <CustomLabel
            label_text={`${fileData?.name ?? DataEditor_Label.header_label.label}`}
            label_style="text-[16px] font-semibold tracking-wide text-light-text dark:text-dark-text"
          />
        </div>
        <ExcelModeSwitch Mode={View} Label={"View Mode"} />
      </div>

      {/*-----------------------------------------------------------*/
      /* EXCEL SHEETS SELECT SECTION */
      /*-----------------------------------------------------------*/}
      {totalSheets > 0 && (
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

      {/*-----------------------------------------------------------*/
      /* LOADING SECTION */
      /*-----------------------------------------------------------*/}
      {loading && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            {/* Shaking file icon */}
            <div className="relative">
              <div className="w-24 h-28 bg-white rounded-lg shadow-md border-2 border-green-500 flex items-center justify-center animate-[shake_0.5s_ease-in-out_infinite]">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>

              {/* Data particles flying out */}
              <div className="absolute top-1/2 -right-4 w-2 h-2 bg-blue-500 rounded-full animate-[flyOut_1s_ease-out_infinite]"></div>
              <div
                className="absolute top-1/3 -right-3 w-1.5 h-1.5 bg-indigo-500 rounded-full animate-[flyOut_1s_ease-out_infinite]"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="absolute top-2/3 -right-3 w-1.5 h-1.5 bg-purple-500 rounded-full animate-[flyOut_1s_ease-out_infinite]"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>

            <div className="text-center">
              <div className="text-base font-semibold text-light-text dark:text-dark-text mb-2">
                Extracting Excel Data
              </div>
              <div className="text-sm text-light-text_muted dark:text-dark-text_muted flex items-center justify-center gap-2">
                <span>Reading spreadsheet</span>
                <span className="inline-flex gap-1">
                  <span
                    className="animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  >
                    .
                  </span>
                  <span
                    className="animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  >
                    .
                  </span>
                  <span
                    className="animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  >
                    .
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      {/*-----------------------------------------------------------*/
      /* EXCEL GRID SECTION */
      /*-----------------------------------------------------------*/}
      {!loading && sheetData[activesheetName] && (
        <ExcelGridContainer
          grid={sheetData[activesheetName]}
          gridFileID={fileID}
          SheetNameSelected={activesheetName}
          ToastMessage={showToastMessage}
        />
      )}
    </div>
  );
};
/*--------------------------------------------------------------- */

export default DataEditor;
