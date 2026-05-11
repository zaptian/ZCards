import { useNavigate, useParams } from "react-router-dom";
import { Grid, List } from "react-virtualized";
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ArrowLeftCircle,
  ArrowRightSquareIcon,
  ChevronLeft,
  CopyIcon,
  IterationCw,
  PinIcon,
  PinOff,
  TableIcon,
} from "lucide-react";

import CustomButton from "../../Components/CustomButton";
import { useToast } from "../../Components/ToastMessage/ToastContext";
import { FileImport_Error_Message } from "../../Utils/error_message_render";
import {
  DataEditor_Label,
  DataEditor_message,
  ToastMessageType,
} from "../../Utils/label_render";
import CustomLabel from "../../Components/CustomLabel";
import { data_control_icon } from "../../Utils/img_render";
import CustomInput from "../../Components/CustomInput";

// GLOBAL VALUES
const MAX_ROW_LIMIT = 1_048_576;
const MAX_COLUMN_LIMIT = 16_384;

const GRID_VIEWPORT_HEIGHT = 650;
const MIN_ROW_HEADER_WIDTH = 56;
const COLUMN_WIDTH = 128;
const ROW_HEIGHT = 35;

const SCAN_COLUMN_COUNT = 5;
const SCAN_ROW_COUNT = 5;
const DATA_BUFFER = 30;

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
 * @function  buildHeaderColumns => (rowCache, colFrom, colTo)
 * @purpose   Used to Build column Header fields
 */
function buildHeaderColumns(rowCache, colFrom, colTo) {
  const headerRow = rowCache;
  if (!headerRow) return [];

  const columns = [];
  for (let c = colFrom; c <= colTo; c++) {
    const raw = headerRow[c];
    const label = raw != null ? String(raw).trim() : `Column_${c + 1}`;
    if (!label) continue;
    columns.push({
      key: `${getExcelColumnName(c)}_${label.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()}`,
      label,
    });
  }
  return columns;
}
/*--------------------------------------------------------------- */

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
const renderRowHeaderCell = ({ index, key, style, isSelected }) => {
  return (
    <div
      key={key}
      style={{ ...style }}
      className={`
        sticky left-0 z-10 h-[35px] w-full
        border-r border-b border-light-border dark:border-dark-border
        text-xs font-extrabold
        flex items-center justify-center
        cursor-pointer select-none
        ${
          isSelected
            ? "bg-icon-50 dark:bg-dark-active text-icon-bg dark:text-icon_dark-bg shadow-[inset_0_0_10px_0_theme(colors.icon.500)] dark:shadow-[inset_0_0_10px_0_theme(colors.icon.500)]"
            : "bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text"
        }
      `}
    >
      {index === 0 ? "" : index}
    </div>
  );
};
/*--------------------------------------------------------------- */

/*--------------------------------------------------------------- */
/**
 * @function  getRowHeaderWidth -> { rowCount }
 * @purpose   Get the row header width
 */
const getRowHeaderWidth = (rowCount) => {
  const digits = rowCount.toString().length;
  return Math.max(MIN_ROW_HEADER_WIDTH, digits * 10 + 20);
};
/*--------------------------------------------------------------- */

/*--------------------------------------------------------------- */
/**
 * @function  RowHeaderComponent -> { rowCount, height, scrollTop }
 * @purpose       To render the Row Header List
 */
const RowHeaderComponent = ({ rowCount, height, scrollTop, selectedRow }) => {
  const width = useMemo(() => getRowHeaderWidth(rowCount), [rowCount]);

  const rowRenderer = useCallback(
    ({ index, key, style }) => {
      const isSelected = selectedRow === index - 1;

      return renderRowHeaderCell({
        index,
        key,
        style,
        isSelected,
      });
    },
    [selectedRow],
  );

  return (
    <List
      width={width}
      height={height}
      rowCount={rowCount}
      rowHeight={ROW_HEIGHT}
      scrollTop={scrollTop}
      rowRenderer={rowRenderer}
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
const renderColumnHeaderCell = ({ columnIndex, key, style, isSelected }) => {
  return (
    <div
      key={key}
      style={style}
      className={`flex text-center justify-center sticky top-0 z-10  
        w-32 h-[35px] px-2 py-2 
        border-r border-b border-light-border dark:border-dark-border
        text-xs font-extrabold
       ${
         isSelected
           ? "bg-icon-50 dark:bg-dark-active text-icon-bg dark:text-icon_dark-bg shadow-[inset_0_0_10px_0_theme(colors.icon.500)] dark:shadow-[inset_0_0_10px_0_theme(colors.icon.500)]"
           : "bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text"
       }`}
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
const ColumnHeaderComponent = ({
  colCount,
  width,
  scrollLeft,
  selectedColumn,
}) => {
  const colRenderer = useCallback(
    ({ columnIndex, key, style }) => {
      const isSelected = selectedColumn === columnIndex;

      return renderColumnHeaderCell({
        columnIndex,
        key,
        style,
        isSelected,
      });
    },
    [selectedColumn],
  );

  return (
    <Grid
      columnCount={colCount}
      rowCount={1}
      columnWidth={COLUMN_WIDTH}
      rowHeight={ROW_HEIGHT}
      height={ROW_HEIGHT}
      width={width}
      scrollLeft={scrollLeft}
      cellRenderer={colRenderer}
      overscanColumnCount={SCAN_COLUMN_COUNT}
      scrollTop={0}
      style={{ overflowX: "hidden", borderTopRightRadius: "8px" }}
      scrollingResetTimeInterval={0}
    />
  );
};
/*--------------------------------------------------------------- */

/*--------------------------------------------------------------- */
/**
 * @function  ExcelTableView => memo
 * @purpose   To Make a view of Excel Table
 */
const ExcelTableView = memo(
  forwardRef(function ExcelTableView(
    {
      gridTableData = [],
      gridFileID,
      ToastMessage,
      isEditorEnabled = false,
      selectedCell, // { rowIndex, colIndex } — now owned by parent
      handleCellSelect, // (rowIndex, colIndex, rawValue) => void
      editedCells = {}, // { "r:c": newValue }
    },
    ref,
  ) {
    /* ===================================================== */
    /* 1. REFS                                               */
    /* ===================================================== */
    const isFetchingRef = useRef(false);
    const containerRef = useRef(null);

    useImperativeHandle(ref, () => ({
      applyEdits(edit_data) {
        setRowCache((prev) => {
          const currentRowCache = { ...prev };
          Object.entries(edit_data).forEach(([key, value]) => {
            const [rowValue, colValue] = key.split(":").map(Number);
            if (currentRowCache[rowValue]) {
              currentRowCache[rowValue] = {
                ...currentRowCache[rowValue],
                [colValue]: value,
              };
            }
          });
          return currentRowCache;
        });
      },
      getRowCache() {
        return rowCache;
      },
    }));

    /* ===================================================== */
    /* 2. STATE                                              */
    /* ===================================================== */
    const [sheetName, setSheetName] = useState("");
    const [rowCount, setRowCount] = useState(0);
    const [colCount, setColCount] = useState(0);
    const [copiedCell, setCopiedCell] = useState(false);
    const [rowCache, setRowCache] = useState({});
    const [containerWidth, setContainerWidth] = useState(0);
    const [containerHeight, setContainerHeight] = useState(GRID_VIEWPORT_HEIGHT);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);

    /* ===================================================== */
    /* 3. DERIVED STATE (useMemo)                            */
    /* ===================================================== */
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

    const effectiveColCount = useMemo(() => {
      if (colCount > MAX_COLUMN_LIMIT) {
        ToastMessage(
          `[RowHeaderComponent] Column limit exceeded.
        Requested: ${colCount}
        Maximum allowed: ${MAX_COLUMN_LIMIT}
        Columns have been capped to ${MAX_COLUMN_LIMIT}.`,
          "error",
        );
        console.error(
          `[RowHeaderComponent] Column limit exceeded.
        Requested: ${colCount}
        Maximum allowed: ${MAX_COLUMN_LIMIT}
        Columns have been capped to ${MAX_COLUMN_LIMIT}.`,
        );
        return MAX_COLUMN_LIMIT;
      }
      return colCount;
    }, [colCount]);

    const rowHeaderWidth = useMemo(
      () => getRowHeaderWidth(effectiveRowCount),
      [effectiveRowCount],
    );

    // Pure derived value — no useMemo needed (cheap calculation)
    const gridViewportWidth = Math.max(0, containerWidth - rowHeaderWidth);

    /* ===================================================== */
    /* 4. EVENT HANDLERS (useCallback)                       */
    /* ===================================================== */
    const onGridScroll = useCallback(({ scrollLeft, scrollTop }) => {
      setScrollLeft(scrollLeft);
      setScrollTop(scrollTop);
    }, []);

    /* ===================================================== */
    /* 5. API / FETCH FUNCTIONS (useCallback)                */
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

    /* ===================================================== */
    /* 6. RENDER HELPERS (useCallback)                       */
    /* ===================================================== */
    const cellRenderer = useCallback(
      ({ rowIndex, columnIndex, key, style }) => {
        const cellKey = `${rowIndex}:${columnIndex}`;

        const isEdited = Object.prototype.hasOwnProperty.call(
          editedCells,
          cellKey,
        );
        const row = rowCache?.[rowIndex];
        const rawValue = row?.[columnIndex];
        const cellValue = isEdited ? editedCells[cellKey] : rawValue;
        const renderedValue = renderCellValue(cellValue);

        const isRowEdited = Object.keys(editedCells).some((k) =>
          k.startsWith(`${rowIndex}:`),
        );

        const isSelected =
          selectedCell?.rowIndex === rowIndex &&
          selectedCell?.colIndex === columnIndex;

        const handleClick = () => {
          if (isEditorEnabled) {
            handleCellSelect?.(rowIndex, columnIndex, rawValue ?? "");
          }
        };

        return (
          <div
            key={key}
            style={style}
            onClick={handleClick}
            title={renderedValue ?? ""}
            className={[
              "group relative",
              "p-[6px]",
              "border-r border-b border-light-border dark:border-dark-border",
              "text-sm text-light-text2 dark:text-dark-text2",
              "whitespace-nowrap overflow-hidden text-ellipsis",
              /* ★ edited-row tint */
              isRowEdited && !isSelected
                ? "bg-yellow-50 dark:bg-yellow-900/10"
                : "",
              /* ★ selected cell ring */
              isSelected
                ? "shadow-[inset_0_0_0_2px_theme(colors.icon.500)] bg-icon-50 dark:bg-icon-900/20"
                : "",
              /* ★ edited-cell indicator dot (via ring) */
              isEdited && !isSelected
                ? "shadow-[inset_0_0_0_1px_theme(colors.yellow.400)]"
                : "",
              isEditorEnabled ? "cursor-pointer" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {/* CELL DATA */}
            {renderedValue ?? ""}

            {/* EDITED CELL BADGE */}
            {isEdited && (
              <span className="absolute top-[2px] right-[2px] w-[5px] h-[5px] rounded-full bg-yellow-400 dark:bg-yellow-500" />
            )}

            {/* CLIPBOARD COPY BUTTON */}
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
                      ? "text-clipboard_copy"
                      : "text-light-text2 dark:text-dark-text2"
                  }`}
                />
              </button>
            )}
          </div>
        );
      },
      [
        rowCache,
        editedCells,
        selectedCell,
        isEditorEnabled,
        handleCellSelect,
        copiedCell,
      ],
    );

    const handleSectionRendered = useCallback(
      ({ rowStartIndex, rowStopIndex }) => {
        fetchRange(rowStartIndex, rowStopIndex);
      },
      [fetchRange],
    );

    /* ===================================================== */
    /* 7. EFFECTS                                            */
    /* ===================================================== */

    // Fires before paint — must come before useEffect hooks
    useLayoutEffect(() => {
      if (!containerRef.current) return;

      const observer = new ResizeObserver(([entry]) => {
        setContainerWidth(entry.contentRect.width);
        setContainerHeight(entry.contentRect.height);
      });

      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }, []);

    // Sync grid metadata from props
    useEffect(() => {
      setSheetName(gridTableData?.name || "");
      setRowCount(gridTableData?.rowCount || 0);
      setColCount(gridTableData?.colCount || 0);
      setRowCache({});
    }, [gridTableData]);

    // Clear row cache when sheet changes
    useEffect(() => {
      setRowCache({});
    }, [sheetName]);

    useEffect(() => {
      if (!sheetName) return;
      fetchRange(0, DATA_BUFFER); // fetch first visible rows
    }, [sheetName, fetchRange]);

    /* ===================================================== */
    /* 8. MAIN RENDER                                        */
    /* ===================================================== */
    return (
      <div
        ref={containerRef}
        className={`
          relative h-full w-full
          rounded-tl-none rounded-lg
          shadow-sm
        `}
      >
        <div className="flex h-full">
          <RowHeaderComponent
            rowCount={effectiveRowCount + 1}
            height={containerHeight}
            scrollTop={scrollTop}
            selectedRow={selectedCell?.rowIndex}
          />
          <div className="flex flex-col flex-1">
            <div>
              <ColumnHeaderComponent
                colCount={effectiveColCount}
                width={gridViewportWidth}
                scrollLeft={scrollLeft}
                selectedColumn={selectedCell?.colIndex}
              />
            </div>
            <Grid
              className="custom-scroll"
              columnCount={effectiveColCount}
              rowCount={effectiveRowCount}
              columnWidth={COLUMN_WIDTH}
              rowHeight={ROW_HEIGHT}
              height={containerHeight - ROW_HEIGHT}
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
  }),
);
/*--------------------------------------------------------------- */

/*--------------------------------------------------------------- */
/**
 * @function  ExcelSidePanel => memo
 * @purpose   To Make a view of Excel Side Panel Data
 */
const ExcelSidePanel = memo(function SidePanel({
  gridFileID,
  sheetName,
  gridDataCount,
  isEditorEnabledPanel,
  formDataCache,
  onFormSaved,
}) {
  const { addToast: ToastMessage } = useToast();
  const [isEditorEnabled, setIsEditorEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    headerRow: { value: "" },
    column: { from: "", to: "" },
    dataRow: { from: "", to: "" },
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

  /*-----------------------------------------------------------*/
  /* INITIALIZE FORM DATA */
  /*-----------------------------------------------------------*/
  useEffect(() => {
    if (!formDataCache) return;

    setFormData(() => {
      return {
        headerRow: {
          value: formDataCache.headerRow?.toString() || "",
        },
        column: {
          from: formDataCache.columnheader?.from || "",
          to: formDataCache.columnheader?.to || "",
        },
        dataRow: {
          from: formDataCache.dataRow?.from?.toString() || "",
          to: formDataCache.dataRow?.to?.toString() || "",
        },
      };
    });
  }, [formDataCache]);

  /*-----------------------------------------------------------*/
  /* HELPER FUNCTION */
  /*-----------------------------------------------------------*/
  const isValidNumber = (value) => /^[0-9]+$/.test(value);
  const isValidText = (value) => /^[A-Za-z]+$/.test(value);
  const columnToIndex = (value) =>
    value
      .toUpperCase()
      .split("")
      .reduce((acc, char) => acc * 26 + (char.charCodeAt(0) - 64), 0);

  /*-----------------------------------------------------------*/
  /* FORM VALIDATE */
  /*-----------------------------------------------------------*/
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

  /*-----------------------------------------------------------*/
  /* HANDLE SAVE FORM DATA */
  /*-----------------------------------------------------------*/
  const handleSave = async () => {
    setIsEditorEnabled(false);
    setIsLoading(true);

    const error = validateFormData(formData);
    if (error) {
      ToastMessage(error, "error");
      setIsLoading(false);
      return;
    }

    const result = await window.DataDashBoard_API.addFormData({
      fileID: gridFileID,
      sheetName: sheetName,
      formData: {
        headerRow: formData.headerRow.value,
        headerColumn: formData.column,
        dataRow: formData.dataRow,
        dataColumn: formData.column,
      },
    });

    if (result?.status) {
      ToastMessage(
        DataEditor_message.save_data_message.message,
        DataEditor_message.save_data_message.message_type,
      );
      onFormSaved?.();
    }

    setIsEditorEnabled(true);
    setIsLoading(false);
  };

  /*-----------------------------------------------------------*/
  /* HANDLE EDIT FORM DATA */
  /*-----------------------------------------------------------*/
  const handleEdit = async () => {
    isEditorEnabledPanel(true);
  };

  /*-----------------------------------------------------------*/
  /* HANDLE RANGE TWO FORM DATA */
  /*-----------------------------------------------------------*/
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

  /*-----------------------------------------------------------*/
  /* HANDLE RANGE ONE FORM DATA */
  /*-----------------------------------------------------------*/
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

  /*-----------------------------------------------------------*/
  /* INPUT CLASS NAME SELECT */
  /*-----------------------------------------------------------*/
  const inputClass = (type) => `
    h-[40px] px-3 w-full text-sm font-bold rounded-md
    bg-input-light-background dark:bg-input-dark-background
    border-[1px] border-input-light-border dark:border-input-dark-border
    text-input-light-text dark:text-input-dark-text
    placeholder:input-light-placeholder dark:placeholder:input-light-placeholder
    focus:outline-none focus:ring-2 focus:input-light-border_focus
    ${type === "number" ? "no-number-arrows" : "uppercase"}
  `;

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
                      : gridDataCount.gridRowData.minCount + 1
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
          label={
            isLoading ? (
              <LoadingCircle />
            ) : (
              DataEditor_Label.saveData_label.label
            )
          }
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
          label={DataEditor_Label.openEditor_label.label}
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
 * @purpose   To Make a view of Excel Grid Container
 */
const ExcelGridContainer = memo(function ExcelGridContainer({
  grid,
  gridFileID,
  SheetNameSelected,
  ToastMessage,
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [isPinned, setIsPinned] = useState(true);
  const showPanel = isOpen || isPinned;

  const [isEditorEnabled, setIsEditorEnabled] = useState(false);
  const [formDataCache, setFormDataCache] = useState(null); //{ columnheader, dataRow, headerRow, headerData}
  const [selectedCell, setSelectedCell] = useState(null); // { rowIndex, colIndex, rawValue }
  const [editedCellsBySheet, setEditedCellsBySheet] = useState({});
  const [editorInputValue, setEditorInputValue] = useState("");
  const [headerColTrigger, setHeaderColTrigger] = useState(0);

  const tableRef = useRef(null);

  /*-----------------------------------------------------------*/
  /* MANAGE GRID DATA */
  /*-----------------------------------------------------------*/
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
  /* FORCE REFRESH EFFECT GENERATION */
  /*-----------------------------------------------------------*/
  const refreshHeaderColumns = useCallback(() => {
    setHeaderColTrigger((t) => t + 1);
  }, []);

  /*-----------------------------------------------------------*/
  /* CONVERT COLUMN HEADER TO INDEX */
  /*-----------------------------------------------------------*/
  const columnToIndex = (value) =>
    value
      .toUpperCase()
      .split("")
      .reduce((acc, char) => acc * 26 + (char.charCodeAt(0) - 64), 0);

  /*-----------------------------------------------------------*/
  /* RESET DATA ON SHEET CHANGES */
  /*-----------------------------------------------------------*/
  useEffect(() => {
    setSelectedCell(null);
    setEditorInputValue("");
  }, [SheetNameSelected]);

  /*-----------------------------------------------------------*/
  /* RESET ON EDITOR MODE EXIT */
  /*-----------------------------------------------------------*/
  useEffect(() => {
    if (!isEditorEnabled) {
      setSelectedCell(null);
      setEditorInputValue("");
    }
  }, [isEditorEnabled]);

  /*-----------------------------------------------------------*/
  /* HANDLE CELL SELECT */
  /*-----------------------------------------------------------*/
  const handleCellSelect = useCallback(
    (rowIndex, colIndex, rawValue) => {
      setSelectedCell({ rowIndex, colIndex, rawValue });
      setEditorInputValue(rawValue ?? "");
    },
    [editedCellsBySheet, SheetNameSelected],
  );

  /*-----------------------------------------------------------*/
  /* HANDLE HEADER COLUMN */
  /*-----------------------------------------------------------*/
  const handleHeaderColumns = useMemo(() => {
    if (!formDataCache) return [];
    const rowCache = formDataCache?.headerData || [];
    if (!rowCache) return [];
    const colFrom = columnToIndex(formDataCache.columnheader?.from) - 1;
    const colTo = columnToIndex(formDataCache.columnheader?.to) - 1;
    return buildHeaderColumns(rowCache, colFrom, colTo);
  }, [formDataCache, headerColTrigger]);

  /*-----------------------------------------------------------*/
  /* HANDLE DATA EDITED */
  /*-----------------------------------------------------------*/
  const handleEditorInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      setEditorInputValue(value);

      if (!selectedCell) return;
      const key = `${selectedCell.rowIndex}:${selectedCell.colIndex}`;
      setEditedCellsBySheet((prev) => ({
        ...prev,
        [SheetNameSelected]: {
          ...(prev[SheetNameSelected] ?? {}),
          [key]: value,
        },
      }));

      console.log("Sheet Name Changes : ", editedCellsBySheet);
    },
    [selectedCell],
  );

  /*-----------------------------------------------------------*/
  /* REVERT UPDATED CELL */
  /*-----------------------------------------------------------*/
  const handleRevertCell = useCallback(() => {
    if (!selectedCell) return;
    const key = `${selectedCell.rowIndex}:${selectedCell.colIndex}`;
    setEditorInputValue(selectedCell?.rawValue ?? "");
    setEditedCellsBySheet((prev) => {
      const sheetEdits = { ...(prev[SheetNameSelected] ?? {}) };
      delete sheetEdits[key];
      return { ...prev, [SheetNameSelected]: sheetEdits };
    });
  }, [selectedCell, SheetNameSelected]);

  /*-----------------------------------------------------------*/
  /* DISCARD ALL EDITS */
  /*-----------------------------------------------------------*/
  const handleDiscardAll = useCallback(() => {
    setEditorInputValue(selectedCell?.rawValue ?? "");
    /* also revert the cache */
    tableRef.current?.applyEdits({});

    setEditedCellsBySheet((prev) => ({
      ...prev,
      [SheetNameSelected]: {},
    }));
  }, [selectedCell, SheetNameSelected]);

  /*-----------------------------------------------------------*/
  /* HANDEL SAVE BUTTON CLICK */
  /*-----------------------------------------------------------*/
  const handleSaveEdits = useCallback(async () => {
    if (!Object.keys(editedCellsBySheet[SheetNameSelected]).length) return;

    tableRef.current?.applyEdits(editedCellsBySheet[SheetNameSelected]);

    try {
      console.log("Edited cells : ", editedCellsBySheet[SheetNameSelected]);
      const result = await window.DataDashBoard_API.updateEditedData({
        fileID: gridFileID,
        sheetName: SheetNameSelected,
        editedData: Object.entries(editedCellsBySheet[SheetNameSelected]).map(
          ([key, value]) => {
            const [rowIndex, colIndex] = key.split(":").map(Number);
            return { rowIndex, colIndex, value };
          },
        ),
      });

      console.log("[DataEdited:handleSaveEdits] : ", result);
      if (result?.status) {
        ToastMessage(
          DataEditor_message.changes_save_message.message,
          ToastMessageType.success,
        );
        setEditedCellsBySheet((prev) => ({
          ...prev,
          [SheetNameSelected]: {},
        }));
      } else {
        ToastMessage(
          DataEditor_message.failed_changes_save_meaage.message,
          ToastMessageType.error,
        );
      }
    } catch (err) {
      console.error("[saveEditedCells]", err);
      ToastMessage("Save failed.", "error");
    }
  }, [editedCellsBySheet, gridFileID, SheetNameSelected, ToastMessage]);

  /*-----------------------------------------------------------*/
  /* EDITED CELL COUNT */
  /*-----------------------------------------------------------*/
  const editedCells = editedCellsBySheet[SheetNameSelected] ?? {};
  const editCount = Object.keys(editedCells).length;

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

  /*-----------------------------------------------------------*/
  /* INITIALIZE FORM DATA */
  /*-----------------------------------------------------------*/
  useEffect(() => {
    if (!SheetNameSelected || !gridFileID) return;

    const loadInitialData = async () => {
      try {
        const result = await window.DataDashBoard_API.fetchFormData({
          fileID: gridFileID,
          sheetName: SheetNameSelected,
        });
        if (result?.status) {
          setFormDataCache(result?.response);
        } else {
          setFormDataCache(null);
          console.warn("[DataEditor:loadInitialData] : ", result?.error);
          ToastMessage(result?.error, ToastMessageType.error);
        }
      } catch (error) {
        console.error("[DataEditor:loadInitialData]", error);
      }
    };

    loadInitialData();
  }, [SheetNameSelected, gridFileID]);

  return (
    <div className="flex flex-col w-full h-full">
      {/*-----------------------------------------------------------*/
      /* EXCEL DATA SECTION */
      /*-----------------------------------------------------------*/}
      <div className="relative flex w-full min-h-full overflow-hidden">
        {/*-----------------------------------------------------------*/
        /* EXCEL TABEL SECTION */
        /*-----------------------------------------------------------*/}
        <div
          className={`
            border border-light-border dark:border-dark-border
            h-full
            transition-all duration-300
            ${showPanel ? "w-[calc(100%-360px)]  rounded-tl-none rounded-tr-none rounded-br-none rounded-lg" : "w-full rounded-tl-none rounded-lg"}
          `}
        >
          <ExcelTableView
            ref={tableRef}
            gridTableData={grid}
            gridFileID={gridFileID}
            ToastMessage={ToastMessage}
            isEditorEnabled={isEditorEnabled}
            selectedCell={selectedCell}
            handleCellSelect={handleCellSelect}
            editedCells={editedCells}
          />
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
            ${showPanel ? " translate-x-0 opacity-100 rounded-tl-none rounded-bl-none rounded-lg" : "translate-x-full"} }
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
          <div className="px-2 py-2 w-full h-full flex flex-col ">
            {/*-----------------------------------------------------------*/
            /* SIDEBAR HEADER SECTION */
            /*-----------------------------------------------------------*/}
            <div className="flex flex-row gap-4 items-center justify-center ">
              {/*-----------------------------------------------------------*/
              /* SIDEBAR BACK BUTTON */
              /*-----------------------------------------------------------*/}
              {isEditorEnabled ? (
                <ArrowLeftCircle
                  className="w-9 h-8 p-[4px] rounded-md bg-light-card1 dark:bg-dark-card 
                  hover:bg-light-hover/10  hover:dark:bg-dark-hover 
                  shadow-[0_2px_6px_rgba(200,200,200,0.5)]
                  dark:shadow-[0_2px_6px_rgba(0,0,0,0.5)]
                  text-icon-bg cursor-pointer"
                  onClick={() => {
                    setIsEditorEnabled(false);
                  }}
                />
              ) : null}

              {/*-----------------------------------------------------------*/
              /* SIDEBAR DATA HEADER CONTENT */
              /*-----------------------------------------------------------*/}
              <div className="w-full  flex items-center justify-between gap-2  ">
                {/*-----------------------------------------------------------*/
                /* SIDEBAR SHEET NAME */
                /*-----------------------------------------------------------*/}
                <div
                  className="
                    flex items-center justify-center
                    max-w-[240px]
                    h-[32px]
                    px-[4px]
                    bg-card dark:bg-dark-card
                    shadow-[0_2px_6px_rgba(200,200,200,0.5)]
                    dark:shadow-[0_2px_6px_rgba(0,0,0,0.5)]
                    border border-icon-bg
                    rounded-[4px]
                    overflow-hidden
                    
                  "
                >
                  <CustomLabel
                    title={SheetNameSelected}
                    label_text={SheetNameSelected}
                    label_style="
                      text-sm font-semibold tracking-wide
                      text-light-text dark:text-dark-text
                      whitespace-nowrap overflow-hidden text-ellipsis block
                    "
                  />
                </div>

                {/*-----------------------------------------------------------*/
                /* SIDEBAR PIN BUTTON */
                /*-----------------------------------------------------------*/}
                {isPinned ? (
                  <PinOff
                    className={`w-8 h-8 p-[8px]
                    ${
                      isPinned
                        ? "bg-icon-bg dark:bg-icon_dark-bg hover:bg-icon-400  text-dark-text1"
                        : "bg-light-card1 dark:bg-dark-card hover:bg-card-hover hover:dark:bg-dark-hover text-light-text2 dark:text-dark-text2"
                    } 
                    rounded-lg
                    shadow-[0_2px_6px_rgba(200,200,200,0.5)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.5)]`}
                    onClick={() => handleClick(setIsPinned)}
                  />
                ) : (
                  <PinIcon
                    className={`w-8 h-8 p-[8px]
                    ${
                      isPinned
                        ? "bg-icon-bg dark:bg-icon_dark-bg hover:bg-icon-400  text-dark-text1"
                        : "bg-light-card1 dark:bg-dark-card1 hover:bg-card-hover hover:dark:bg-dark-hover text-light-text2 dark:text-dark-text2"
                    } 
                    rounded-lg
                    shadow-[0_2px_6px_rgba(200,200,200,0.5)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.5)]`}
                    onClick={() => handleClick(setIsPinned)}
                  />
                )}
              </div>
            </div>

            {/*-----------------------------------------------------------*/
            /* SIDEBAR DATA CONTENT */
            /*-----------------------------------------------------------*/}
            {isEditorEnabled ? (
              <EditorPanel
                selectedCell={selectedCell}
                editorInputValue={editorInputValue}
                onInputChange={handleEditorInputChange}
                onRevertCell={handleRevertCell}
                onDiscardAll={handleDiscardAll}
                onSave={handleSaveEdits}
                editCount={editCount}
                editedCells={editedCells}
                headerColumns={handleHeaderColumns}
              />
            ) : (
              <ExcelSidePanel
                gridFileID={gridFileID}
                sheetName={SheetNameSelected}
                gridDataCount={gridDataCount}
                isEditorEnabledPanel={setIsEditorEnabled}
                formDataCache={formDataCache}
                onFormSaved={refreshHeaderColumns}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
/*--------------------------------------------------------------- */

/*--------------------------------------------------------------- */
/**
 * @function  EditorPanel => memo
 * @purpose   To add the editing feature on the Excel Grid Container
 */
const EditorPanel = memo(function EditorPanel({
  selectedCell,
  editorInputValue,
  onInputChange,
  onRevertCell,
  onDiscardAll,
  onSave,
  editCount,
  editedCells,
  headerColumns = [],
}) {
  const [activeTab, setActiveTab] = useState("cell");

  const cellLabel = selectedCell
    ? `${getExcelColumnName(selectedCell.colIndex)}${selectedCell.rowIndex + 1}`
    : "—";

  /* ── group pending edits by row for summary ── */
  const editsByRow = useMemo(() => {
    return Object.keys(editedCells ?? {}).reduce((acc, key) => {
      const [r, c] = key.split(":");
      if (!acc[r]) acc[r] = [];
      acc[r].push(Number(c));
      return acc;
    }, {});
  }, [editedCells]);

  /* ─────────────────────────────────────────────── */
  const tabClass = (tab) =>
    `flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
      activeTab === tab
        ? "bg-icon-bg dark:bg-icon_dark-bg text-white"
        : "text-light-text_muted dark:text-dark-text_muted hover:bg-light-hover dark:hover:bg-dark-hover"
    }`;

  return (
    <div className="w-full h-full flex flex-col gap-3 mt-3 px-1">
      {/* ── Tab Switch ─────────────────────────────── */}
      <div className="flex gap-1 p-1 rounded-lg bg-light-card1 dark:bg-dark-card2 border border-light-border dark:border-dark-border">
        <button
          className={tabClass("cell")}
          onClick={() => setActiveTab("cell")}
        >
          {DataEditor_Label.cell_editor_label.label}
        </button>
        <button
          className={tabClass("fields")}
          onClick={() => setActiveTab("fields")}
        >
          {DataEditor_Label.header_field_label.label}
          {headerColumns.length > 0 && (
            <span
              className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${activeTab ? "bg-light-card text-icon-500" : "bg-icon-500/20 text-icon-500"}`}
            >
              {headerColumns.length}
            </span>
          )}
        </button>
      </div>

      {/* ══════════════════════════════════════════════
        TAB 1 — CELL EDITOR
      ══════════════════════════════════════════════ */}
      {activeTab === "cell" && (
        <div className="flex flex-col gap-3 flex-1 min-h-0">
          {/* ── Top Bar: cell address + status ── */}
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-light-card1 dark:bg-dark-card2 border border-light-border dark:border-dark-border">
            {/* Cell address chip */}
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-icon-500 dark:bg-icon_dark-500 animate-pulse" />
              <span className="text-[11px] font-mono font-semibold text-icon-500 dark:text-icon_dark-500 tracking-wider">
                {cellLabel}
              </span>
            </div>

            {/* Row indicator */}
            {selectedCell && (
              <>
                <span className="text-light-border dark:text-dark-border">
                  |
                </span>
                <span className="text-[10px] font-mono text-light-text_muted dark:text-dark-text_muted">
                  ROW{" "}
                  <span className="text-light-text2 dark:text-dark-text2">
                    {selectedCell.rowIndex + 1}
                  </span>
                </span>
              </>
            )}

            {/* Unsaved badge */}
            {editCount > 0 && (
              <div className="ml-auto flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-yellow-400/10 border border-yellow-400/30">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                <span className="text-[10px] font-mono font-semibold text-yellow-600 dark:text-yellow-400">
                  {editCount} UNSAVED
                </span>
              </div>
            )}
          </div>

          {/* ── Cell Value Editor ── */}
          <div className="flex flex-col flex-1 min-h-0 rounded-md overflow-hidden border border-input-light-border dark:border-input-dark-border focus-within:border-icon-500 dark:focus-within:border-icon_dark-500 transition-colors duration-150">
            {/* Editor toolbar strip */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-light-card1 dark:bg-dark-card2 border-b border-input-light-border dark:border-input-dark-border">
              <span className="text-[9px] uppercase tracking-[0.12em] font-semibold text-light-text_muted dark:text-dark-text_muted">
                cell value
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[9px] font-semibold text-light-text_muted dark:text-dark-text_muted opacity-90">
                  {editorInputValue?.length ?? 0} chars
                </span>
              </div>
            </div>

            {/* Textarea */}
            <textarea
              rows={4}
              disabled={!selectedCell}
              value={editorInputValue}
              onChange={onInputChange}
              placeholder={
                selectedCell
                  ? "Edit cell value…"
                  : "Select a cell to begin editing"
              }
              className={`custom-scroll
                flex-1 w-full px-3 py-2.5 text-sm font-mono resize-none
                bg-input-light-background dark:bg-input-dark-background
                text-input-light-text dark:text-input-dark-text
                placeholder:text-input-light-placeholder dark:placeholder:text-input-dark-placeholder
                focus:outline-none
                disabled:opacity-40 disabled:cursor-not-allowed
                transition-colors leading-relaxed
              `}
            />

            {/* Bottom action strip */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-light-card1 dark:bg-dark-card2 border-t border-input-light-border dark:border-input-dark-border">
              <span className="text-[12px] px-1 rounded-sm bg-light-card2 dark:bg-dark-card2 text-light-text_muted dark:text-dark-text_muted font-mono">
                {selectedCell ? `${cellLabel}` : "—"}
              </span>
              <button
                disabled={!selectedCell}
                onClick={onRevertCell}
                className="
                  flex items-center gap-1
                  px-2 py-1
                  text-[11px] font-medium
                  bg-red-50 dark:bg-red-900/20
                  text-red-600 dark:text-red-400
                  hover:bg-red-200 dark:hover:bg-red-50
                  rounded-md
                  transition-all duration-150
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                  disabled:hover:bg-transparent
                  disabled:hover:text-red-600
                "
              >
                <IterationCw size={14} />
                {DataEditor_Label.revert_label.label}
              </button>
            </div>
          </div>

          {/* ── Pending Changes ── */}
          {editCount > 0 && (
            <div className="flex flex-col gap-1.5 min-h-0">
              {/* Section header */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-light-border dark:bg-dark-border" />
                <span className="text-[9px] uppercase tracking-[0.12em] font-semibold text-light-text_muted dark:text-dark-text_muted whitespace-nowrap">
                  Pending · {editCount}
                </span>
                <div className="flex-1 h-px bg-light-border dark:bg-dark-border" />
              </div>

              {/* Change rows list */}
              <div className="overflow-y-auto custom-scroll max-h-[90px] space-y-1 pr-0.5">
                {Object.entries(editsByRow).map(([rowIdx, cols]) => (
                  <div
                    key={rowIdx}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200/60 dark:border-yellow-700/30"
                  >
                    {/* Row dot */}
                    <div className="w-1 h-1 rounded-full bg-yellow-400 shrink-0" />
                    <span className="text-[10px] font-mono text-yellow-700 dark:text-yellow-400 font-semibold">
                      R{Number(rowIdx) + 1}
                    </span>
                    <span className="text-[10px] text-light-text_muted dark:text-dark-text_muted">
                      {cols.length} edit{cols.length > 1 ? "s" : ""}
                    </span>
                    {/* Cell positions */}
                    <div className="ml-auto flex gap-1">
                      {cols.slice(0, 4).map((col) => (
                        <span
                          key={col}
                          className="text-[9px] font-mono px-1 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-500"
                        >
                          C{col}
                        </span>
                      ))}
                      {cols.length > 4 && (
                        <span className="text-[9px] text-light-text_muted dark:text-dark-text_muted">
                          +{cols.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Save / Discard ── */}
          <div className="mt-auto flex flex-col gap-2 pt-1">
            <CustomButton
              label={
                editCount > 0
                  ? `Save (${editCount}) Change${editCount > 1 ? "s" : ""}`
                  : "No Changes"
              }
              disabled={editCount === 0}
              onClick={onSave}
              btn_bg_color={`
        inline-flex items-center justify-center w-full
        h-[38px] px-3 rounded-md text-sm font-semibold tracking-wide
        bg-button-primary hover:bg-button-primary-hover
        text-white transition-all duration-150
        disabled:opacity-30 disabled:cursor-not-allowed
        shadow-sm
      `}
            />
            <CustomButton
              label="Discard All"
              disabled={editCount === 0}
              onClick={onDiscardAll}
              btn_bg_color={`
        inline-flex items-center justify-center w-full
        h-[34px] px-3 rounded-md text-xs font-medium
        border border-red-300/50 dark:border-red-700/40
        text-red-500 dark:text-red-400
        hover:bg-red-50 dark:hover:bg-red-900/20
        hover:border-red-400 dark:hover:border-red-600
        disabled:opacity-30 disabled:cursor-not-allowed
        transition-all duration-150
      `}
            />
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          TAB 2 — HEADER COLUMN FIELDS
      ══════════════════════════════════════════════ */}
      {activeTab === "fields" && (
        <div className="flex flex-col gap-3 flex-1 min-h-0">
          {headerColumns.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center flex-1 gap-2 text-center py-8">
              <div className="w-10 h-10 rounded-full bg-light-card1 dark:bg-dark-card2 flex items-center justify-center">
                <TableIcon className="w-5 h-5 text-light-text_muted dark:text-dark-text_muted" />
              </div>
              <p className="text-sm text-light-text_muted dark:text-dark-text_muted">
                No header columns configured.
              </p>
              <p className="text-xs text-light-text_muted dark:text-dark-text_muted opacity-70">
                Save your form data first to generate fields.
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs text-light-text_muted dark:text-dark-text_muted tracking-wide uppercase font-medium">
                Fields derived from header row
              </p>

              <div className="mb-12 overflow-y-auto custom-scroll flex-1 space-y-2 pr-1">
                {headerColumns.map(({ key, label }, index) => (
                  <div
                    key={key}
                    className="group relative rounded-lg border border-light-border dark:border-dark-border bg-light-card1 dark:bg-dark-card1 hover:border-icon-500/40 dark:hover:border-icon_dark-500/40 transition-all duration-200 overflow-hidden"
                  >
                    {/* Left accent bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-icon-500/30 dark:bg-icon_dark-500/30 group-hover:bg-icon-500 dark:group-hover:bg-icon_dark-500 transition-colors duration-200" />

                    <div className="pl-4 pr-3 py-2.5 flex items-center gap-3">
                      {/* Index number */}
                      <span
                        title={index + 1}
                        className="shrink-0 text-[10px] font-mono w-5 text-center text-light-text_muted dark:text-dark-text_muted opacity-50"
                      >
                        {index + 1}
                      </span>

                      {/* Field ID */}
                      <div className="flex flex-col min-w-0 w-[38%] shrink-0">
                        <span
                          title={DataEditor_Label.field_id_label.label}
                          className="text-[9px] uppercase tracking-widest text-light-text_muted dark:text-dark-text_muted mb-0.5"
                        >
                          {DataEditor_Label.field_id_label.label}
                        </span>
                        <span
                          title={key}
                          className="text-[11px] font-mono text-icon-500 dark:text-icon_dark-500 truncate select-all bg-icon-bg/10 dark:bg-icon_dark-bg/20 px-1.5 py-0.5 rounded border border-icon-bg/20 dark:border-icon_dark-bg/20"
                        >
                          {key}
                        </span>
                      </div>

                      {/* Divider */}
                      <div className="shrink-0 flex flex-col items-center gap-0.5 opacity-30">
                        <div className="w-px h-2 bg-light-border dark:bg-dark-border" />
                        <span className="text-[9px] text-light-text_muted dark:text-dark-text_muted">
                          <ArrowRightSquareIcon className="w-5 h-5" />
                        </span>
                        <div className="w-px h-2 bg-light-border dark:bg-dark-border" />
                      </div>

                      {/* Header value */}
                      <div className="flex flex-col min-w-0 flex-1">
                        <span
                          title={DataEditor_Label.header_id_label.label}
                          className="text-[9px] uppercase tracking-widest text-light-text_muted dark:text-dark-text_muted mb-0.5"
                        >
                          {DataEditor_Label.header_id_label.label}
                        </span>
                        <span
                          title={label}
                          className="text-[12px] font-medium text-light-text dark:text-dark-text truncate select-all"
                        >
                          {label}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
});
/*--------------------------------------------------------------- */

/*--------------------------------------------------------------- */
/**
 * @function  BackButton => COMPONENT
 * @purpose   To go to back path
 */
const BackButton = ({ path }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      title="Back"
      className="
        group
        inline-flex items-center gap-1.5
        px-3 py-2
        w-fit h-fit
        rounded-xl
        cursor-pointer
        select-none

        bg-light-card1
        border border-light-border
        shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.04)]

        dark:bg-dark-card1
        dark:border-dark-border
        dark:shadow-[0_1px_3px_rgba(0,0,0,0.4),0_1px_2px_rgba(0,0,0,0.3)]

        hover:bg-light-hover
        hover:border-light-border_strong
        dark:hover:bg-dark-hover
        dark:hover:border-dark-border_strong

        active:scale-[0.96]
        active:bg-light-active
        dark:active:bg-dark-active

        transition-all duration-150 ease-out
      "
    >
      <ChevronLeft
        size={16}
        strokeWidth={2.2}
        className="
          text-icon-bg
          dark:text-icon_dark-bg
          transition-transform duration-150 ease-out
          group-hover:-translate-x-0.5
        "
      />
      <span
        className="
        text-sm font-dm font-medium tracking-tight leading-none
        text-light-label1
        dark:text-dark-label1
      "
      >
        {DataEditor_Label.back_label.label}
      </span>
    </button>
  );
};
/*--------------------------------------------------------------- */

/*--------------------------------------------------------------- */
/**
 * @function  DataEditor => COMPONENT
 * @purpose   To Make a view of DATA EDITOR SECTION
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
    <div className="w-full p-3 h-[calc(100vh-50px)] overflow-y-auto custom-scroll bg-light-bg dark:bg-dark-bg">
      {/*-----------------------------------------------------------*/
      /* HEADER SECTION */
      /*-----------------------------------------------------------*/}
      {!loading && (
        <div className="flex flex-row justify-start items-center gap-3">
          <BackButton path={"/data"} />

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
        </div>
      )}

      {/*-----------------------------------------------------------*/
      /* EXCEL SHEETS SELECT SECTION */
      /*-----------------------------------------------------------*/}
      {totalSheets > 0 && (
        <div className="mt-4 overflow-x-auto custom-scroll">
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
