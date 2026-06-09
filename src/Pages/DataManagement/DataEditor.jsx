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
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Columns,
  CopyIcon,
  Edit3,
  Hash,
  Layout,
  MousePointer2,
  PinIcon,
  PinOff,
  Rows,
  Save,
  TableIcon,
  Trash2,
  Undo2,
  LayoutList,
  FileText,
  X,
} from "lucide-react";

import CustomButton from "../../Components/CustomButton";
import { useToast } from "../../Components/ToastMessage/ToastContext";
import { FileImport_Error_Message } from "../../Utils/error_message_render";
import {
  DataEditor_Cell_Editor_Label,
  DataEditor_Discard_Label,
  DataEditor_Fields_Label,
  DataEditor_Label,
  DataEditor_message,
  DataEditor_Modified_Data_Label,
  DataEditor_Side_Panel_Label,
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
  hasVerticalScrollbar = false,
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
    <>
      <style>{`
        .header-scroll-hidden::-webkit-scrollbar {
          background: transparent !important;
        }
        .header-scroll-hidden::-webkit-scrollbar-thumb {
          background: transparent !important;
        }
        .header-scroll-hidden::-webkit-scrollbar-button {
          display: none !important;
        }
        .header-scroll-hidden {
          scrollbar-color: transparent transparent;
        }
      `}</style>
      <Grid
        className="custom-scroll header-scroll-hidden"
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
        style={{
          overflowX: "hidden",
          overflowY: hasVerticalScrollbar ? "scroll" : "hidden",
          borderTopRightRadius: "8px",
        }}
        scrollingResetTimeInterval={0}
      />
    </>
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
    const [containerHeight, setContainerHeight] =
      useState(GRID_VIEWPORT_HEIGHT);
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
        <div className="flex h-full overflow-hidden">
          <RowHeaderComponent
            rowCount={effectiveRowCount + 1}
            height={containerHeight}
            scrollTop={scrollTop}
            selectedRow={selectedCell?.rowIndex}
          />
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            <div>
              <ColumnHeaderComponent
                colCount={effectiveColCount}
                width={gridViewportWidth}
                scrollLeft={scrollLeft}
                selectedColumn={selectedCell?.colIndex}
                hasVerticalScrollbar={
                  effectiveRowCount * ROW_HEIGHT >
                  containerHeight -
                    ROW_HEIGHT -
                    (effectiveColCount * COLUMN_WIDTH > gridViewportWidth
                      ? 15
                      : 0)
                }
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
 * @purpose   To make Excel data entry side panel
 */
const ExcelSidePanel = memo(function SidePanel({
  gridFileID,
  sheetName,
  gridDataCount,
  isEditorEnabledPanel,
  formDataCache,
  onFormSaved,
  formData,
  setFormData,
  isPanelEditorEnabled,
  setIsPanelEditorEnabled,
}) {
  const { addToast: ToastMessage } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const formElement = [
    {
      label: DataEditor_Side_Panel_Label?.header_row?.label,
      key: DataEditor_Side_Panel_Label?.header_row?.key,
      type: DataEditor_Side_Panel_Label?.header_row?.type,
      singleValue: DataEditor_Side_Panel_Label?.header_row?.singleValue,
      icon: (
        <Layout size={16} className="text-icon-bg dark:text-icon_dark-bg" />
      ),
    },
    {
      label: DataEditor_Side_Panel_Label?.column?.label,
      key: DataEditor_Side_Panel_Label?.column?.key,
      type: DataEditor_Side_Panel_Label?.column?.type,
      singleValue: DataEditor_Side_Panel_Label?.column?.singleValue,
      icon: (
        <Columns size={16} className="text-icon-bg dark:text-icon_dark-bg" />
      ),
    },
    {
      label: DataEditor_Side_Panel_Label?.data_row?.label,
      key: DataEditor_Side_Panel_Label?.data_row?.key,
      type: DataEditor_Side_Panel_Label?.data_row?.type,
      singleValue: DataEditor_Side_Panel_Label?.data_row?.singleValue,
      icon: <Rows size={16} className="text-icon-bg dark:text-icon_dark-bg" />,
    },
  ];

  const fieldStructure = {
    headerRow: {
      type: DataEditor_Side_Panel_Label?.header_row?.type,
      label: DataEditor_Side_Panel_Label?.header_row?.label,
      singleValue: DataEditor_Side_Panel_Label?.header_row?.singleValue,
    },
    column: {
      type: DataEditor_Side_Panel_Label?.column?.type,
      label: DataEditor_Side_Panel_Label?.column?.label,
      singleValue: DataEditor_Side_Panel_Label?.column?.singleValue,
    },
    dataRow: {
      type: DataEditor_Side_Panel_Label?.data_row?.type,
      label: DataEditor_Side_Panel_Label?.data_row?.label,
      singleValue: DataEditor_Side_Panel_Label?.data_row?.singleValue,
    },
  };

  /*-----------------------------------------------------------*/
  /* INITIALIZE FORM DATA */
  /*-----------------------------------------------------------*/
  useEffect(() => {
    const isConfigured =
      formDataCache &&
      (formDataCache.headerRow !== undefined ||
        formDataCache.columnheader ||
        formDataCache.dataRow);

    if (!isConfigured) {
      return;
    }

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
    setIsPanelEditorEnabled(false);
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
      setIsPanelEditorEnabled(true);
    } else {
      // Re-enable if it was already configured previously
      const isConfigured =
        formDataCache &&
        (formDataCache.headerRow !== undefined ||
          formDataCache.columnheader ||
          formDataCache.dataRow);
      setIsPanelEditorEnabled(!!isConfigured);
    }

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
    h-[38px] px-3 w-full text-sm font-semibold rounded-md
    bg-light-card2 dark:bg-dark-card2
    border border-light-border dark:border-dark-border
    text-light-text2 dark:text-dark-text2
    placeholder:text-light-placeholder dark:placeholder:text-dark-placeholder
    focus:outline-none focus:ring-2 focus:ring-icon-bg focus:border-icon_dark-bg
    transition-all duration-200
    ${type === "number" ? "no-number-arrows" : "uppercase"}
  `;

  return (
    <div className="w-full h-full p-5 flex flex-col">
      {/* Header Section */}
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-lg bg-icon-50 dark:bg-icon_dark-900 text-icon-bg dark:text-icon_dark-bg">
          <TableIcon size={20} />
        </div>
        <div>
          <div className="text-base font-semibold text-light-text dark:text-dark-text">
            Sheet Configuration
          </div>
          <div className="text-xs text-light-text2 dark:text-dark-text2 opacity-70">
            Define the range and headers
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 space-y-6">
        {formElement.map(({ label, key, type, singleValue, icon }) => (
          <div key={key} className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              {icon}
              <span className="text-xs font-bold uppercase tracking-wider text-light-text2 dark:text-dark-text2 opacity-80">
                {label}
              </span>
            </div>

            <div className="bg-light-card1 dark:bg-dark-card1 p-3 rounded-lg border border-light-border dark:border-dark-border">
              {singleValue ? (
                <div className="relative group">
                  <label className="absolute -top-2 left-3 px-1 text-[10px] font-bold text-icon-bg dark:text-icon_dark-bg bg-light-card dark:bg-dark-card z-10 transition-colors duration-200">
                    Value
                  </label>
                  <CustomInput
                    type={type}
                    input_placeholder={gridDataCount.gridRowData.minCount}
                    search_text={formData[key].value}
                    onChange_Access={handleSingleChange(key)}
                    input_classname={inputClass(type)}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative group">
                    <label className="absolute -top-2 left-3 px-1 text-[10px] font-bold text-icon-bg dark:text-icon_dark-bg bg-light-card dark:bg-dark-card z-10 transition-colors duration-200">
                      From
                    </label>
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
                  </div>
                  <div className="flex-1 relative group">
                    <label className="absolute -top-2 left-3 px-1 text-[10px] font-bold text-icon-bg dark:text-icon_dark-bg bg-light-card dark:bg-dark-card z-10 transition-colors duration-200">
                      To
                    </label>
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
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="pt-6 border-t border-light-border dark:border-dark-border flex flex-col gap-3">
        {/* Save Button */}
        <CustomButton
          label={
            <div className="flex items-center justify-center gap-2 w-full">
              {isLoading ? (
                <LoadingCircle />
              ) : (
                <>
                  <Save size={18} />
                  <span>{DataEditor_Label.saveData_label.label}</span>
                </>
              )}
            </div>
          }
          onClick={handleSave}
          disabled={isLoading}
          btn_bg_color="
            w-full h-[44px] rounded-xl text-sm font-bold
            bg-button-primary hover:bg-button-primary-hover
            text-button-primary-text shadow-lg shadow-button-primary/20
            transition-all duration-200 active:scale-[0.98]
          "
        />

        {/* Open Editor */}
        <CustomButton
          label={
            <div className="flex items-center justify-center gap-2 w-full">
              <Edit3 size={18} />
              <span>{DataEditor_Label.openEditor_label.label}</span>
            </div>
          }
          disabled={!isPanelEditorEnabled}
          onClick={handleEdit}
          btn_bg_color={`
            w-full h-[44px] rounded-xl text-sm font-bold
            transition-all duration-200 active:scale-[0.98]
            ${
              isPanelEditorEnabled
                ? "bg-button-success hover:bg-button-success-hover text-button-success-text shadow-lg shadow-button-success/20"
                : "bg-light-label2 dark:bg-dark-label2 text-light-text1 dark:text-dark-text1 cursor-not-allowed"
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
const ExcelGridContainer = memo(
  forwardRef(function ExcelGridContainer(
    {
      grid,
      gridFileID,
      SheetNameSelected,
      ToastMessage,
      onEditsChange,
      onSheetsWithEditsChange,
    },
    ref,
  ) {
    const [isOpen, setIsOpen] = useState(true);
    const [isPinned, setIsPinned] = useState(true);
    const showPanel = isOpen || isPinned;

    const [editorEnabledBySheet, setEditorEnabledBySheet] = useState({});
    const [panelEnabledBySheet, setPanelEnabledBySheet] = useState({});
    const [formDataBySheet, setFormDataBySheet] = useState({});

    const isEditorEnabled = editorEnabledBySheet[SheetNameSelected] || true; // [Debug] False
    const isPanelEditorEnabled =
      panelEnabledBySheet[SheetNameSelected] || false;
    const formData = formDataBySheet[SheetNameSelected] || {
      headerRow: { value: "" },
      column: { from: "", to: "" },
      dataRow: { from: "", to: "" },
    };

    const setIsEditorEnabled = useCallback(
      (val) => {
        setEditorEnabledBySheet((prev) => ({
          ...prev,
          [SheetNameSelected]: val,
        }));
      },
      [SheetNameSelected],
    );

    const setIsPanelEditorEnabled = useCallback(
      (val) => {
        setPanelEnabledBySheet((prev) => ({
          ...prev,
          [SheetNameSelected]: val,
        }));
      },
      [SheetNameSelected],
    );

    const setFormData = useCallback(
      (updater) => {
        setFormDataBySheet((prev) => {
          const current = prev[SheetNameSelected] || {
            headerRow: { value: "" },
            column: { from: "", to: "" },
            dataRow: { from: "", to: "" },
          };
          const next =
            typeof updater === "function" ? updater(current) : updater;
          return { ...prev, [SheetNameSelected]: next };
        });
      },
      [SheetNameSelected],
    );

    const [formDataCacheBySheet, setFormDataCacheBySheet] = useState({});
    const formDataCache = formDataCacheBySheet[SheetNameSelected] || null;
    const [selectedCell, setSelectedCell] = useState(null);
    const [editedCellsBySheet, setEditedCellsBySheet] = useState({});
    const [editorInputValue, setEditorInputValue] = useState("");

    useImperativeHandle(ref, () => ({
      getSheetsWithEdits: () => {
        return Object.entries(editedCellsBySheet)
          .filter(([_, edits]) => Object.keys(edits).length > 0)
          .map(([name, edits]) => ({ name, count: Object.keys(edits).length }));
      },
      discardAll: () => {
        setEditedCellsBySheet({});
        if (tableRef.current) {
          tableRef.current.applyEdits({});
        }
      },
      saveAll: async () => {
        const sheetsWithEdits = Object.entries(editedCellsBySheet).filter(
          ([_, edits]) => Object.keys(edits).length > 0,
        );

        let successCount = 0;
        for (const [sheetName, edits] of sheetsWithEdits) {
          try {
            const result = await window.DataDashBoard_API.updateEditedData({
              fileID: gridFileID,
              sheetName,
              editedData: Object.entries(edits).map(([key, value]) => {
                const [rowIndex, colIndex] = key.split(":").map(Number);
                return { rowIndex, colIndex, value };
              }),
            });
            if (result?.status) successCount++;
          } catch (err) {
            console.error(`Error saving sheet ${sheetName}:`, err);
          }
        }

        setEditedCellsBySheet({});
        return successCount === sheetsWithEdits.length;
      },
    }));

    useEffect(() => {
      const total = Object.values(editedCellsBySheet).reduce(
        (acc, sheet) => acc + Object.keys(sheet).length,
        0,
      );
      onEditsChange?.(total > 0);
      const editsInfo = Object.entries(editedCellsBySheet)
        .filter(([_, edits]) => Object.keys(edits).length > 0)
        .map(([name]) => name);
      onSheetsWithEditsChange?.(editsInfo);
    }, [editedCellsBySheet, onEditsChange, onSheetsWithEditsChange]);
    const [headerColTrigger, setHeaderColTrigger] = useState(0);

    const tableRef = useRef(null);

    /*-----------------------------------------------------------*/
    /* MANAGE GRID DATA */
    /*-----------------------------------------------------------*/
    if (!grid) {
      return (
        <div className="text-sm text-gray-500">No sheet data available</div>
      );
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
      setFormDataCacheBySheet((prev) => {
        const next = { ...prev };
        delete next[SheetNameSelected];
        return next;
      });
    }, [SheetNameSelected]);

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
    /* REVERT SPECIFIC CELL */
    /*-----------------------------------------------------------*/
    const handleRevertSpecificCell = useCallback(
      (row, col) => {
        const key = `${row}:${col}`;
        if (selectedCell?.rowIndex === row && selectedCell?.colIndex === col) {
          setEditorInputValue(selectedCell?.rawValue ?? "");
        }
        setEditedCellsBySheet((prev) => {
          const sheetEdits = { ...(prev[SheetNameSelected] ?? {}) };
          delete sheetEdits[key];
          return { ...prev, [SheetNameSelected]: sheetEdits };
        });
      },
      [selectedCell, SheetNameSelected],
    );

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
    const getOriginalValue = useCallback((row, col) => {
      const cache = tableRef.current?.getRowCache();
      return cache?.[row]?.[col] ?? "";
    }, []);

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

      if (formDataCacheBySheet[SheetNameSelected] !== undefined) return;

      const fetchCache = async () => {
        try {
          const result = await window.DataDashBoard_API.fetchFormData({
            fileID: gridFileID,
            sheetName: SheetNameSelected,
          });

          if (result?.status) {
            setFormDataCacheBySheet((prev) => ({
              ...prev,
              [SheetNameSelected]: result?.response,
            }));
          } else {
            setFormDataCacheBySheet((prev) => ({
              ...prev,
              [SheetNameSelected]: null,
            }));
          }
        } catch (err) {
          console.error("Error fetching form data cache:", err);
          setFormDataCacheBySheet((prev) => ({
            ...prev,
            [SheetNameSelected]: null,
          }));
        }
      };

      fetchCache();
    }, [SheetNameSelected, gridFileID, formDataCacheBySheet]);

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
            flex-1 min-w-0 rounded-lg
            ${showPanel ? "rounded-tr-none rounded-br-none" : ""}
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
            relative
            ${showPanel ? "shrink-0" : "w-0 border-0"}
            h-full w-[420px] z-50
            bg-light-card dark:bg-dark-card
            border border-light-border dark:border-dark-border
            transform transition-transform duration-500 ease-in-out
            ${showPanel ? " translate-x-0 opacity-100 rounded-tl-none rounded-bl-none rounded-lg" : "translate-x-full"}
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
                    ToastMessageType.warning,
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
            <div
              className={`px-2 py-2 w-full h-full flex flex-col ${showPanel ? "" : "hidden"}`}
            >
              {/*-----------------------------------------------------------*/
              /* SIDEBAR HEADER SECTION */
              /*-----------------------------------------------------------*/}
              <div className="flex items-center justify-between gap-3 pt-0 pb-2 pl-2 pr-2 mb-2 border-b border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card rounded-t-xl">
                <div className="flex items-center gap-2">
                  {/* BACK BUTTON */}
                  {isEditorEnabled && (
                    <button
                      onClick={() => setIsEditorEnabled(false)}
                      className="
                    group
                    inline-flex items-center justify-center
                    p-1.5
                    rounded-lg
                    transition-all duration-300 ease-in-out
                    bg-light-card1 dark:bg-dark-card1
                    hover:bg-icon-bg dark:hover:bg-icon_dark-bg
                    text-icon-bg dark:text-icon_dark-bg hover:text-white dark:hover:text-white
                    border border-light-border dark:border-dark-border
                    active:scale-90
                    shadow-sm hover:shadow-md"
                      title="Back"
                    >
                      <ChevronLeft
                        size={16}
                        strokeWidth={3}
                        className="transition-transform duration-300 group-hover:-translate-x-1"
                      />
                    </button>
                  )}

                  {/* SHEET NAME BADGE */}
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-light-card1 dark:bg-dark-card1 border border-light-border dark:border-dark-border rounded-lg shadow-sm max-w-[180px]">
                    <TableIcon
                      size={14}
                      className="text-icon-bg dark:text-icon_dark-bg shrink-0"
                    />
                    <span
                      title={SheetNameSelected}
                      className="text-xs font-bold text-light-text dark:text-dark-text truncate tracking-tight"
                    >
                      {SheetNameSelected}
                    </span>
                  </div>
                </div>

                {/* PIN BUTTON */}
                <button
                  onClick={() => handleClick(setIsPinned)}
                  className={`
                  p-2 rounded-lg transition-all duration-200
                  ${
                    isPinned
                      ? "bg-icon-bg dark:bg-icon_dark-bg text-white"
                      : "bg-light-card1 dark:bg-dark-card1 border border-light-border dark:border-dark-border text-light-text2 dark:text-dark-text2 hover:bg-light-card2 dark:hover:bg-dark-card2"
                  }
                `}
                  title={isPinned ? "Unpin Panel" : "Pin Panel"}
                >
                  {isPinned ? <PinOff size={16} /> : <PinIcon size={16} />}
                </button>
              </div>

              {/*-----------------------------------------------------------*/
              /* SIDEBAR DATA CONTENT */
              /*-----------------------------------------------------------*/}
              {isEditorEnabled ? (
                <ExcelEditorPanel
                  selectedCell={selectedCell}
                  editorInputValue={editorInputValue}
                  onInputChange={handleEditorInputChange}
                  onRevertCell={handleRevertCell}
                  onRevertSpecificCell={handleRevertSpecificCell}
                  getOriginalValue={getOriginalValue}
                  onDiscardAll={handleDiscardAll}
                  onSave={handleSaveEdits}
                  onCellSelect={handleCellSelect}
                  editCount={editCount}
                  editedCells={editedCells}
                  headerColumns={handleHeaderColumns}
                />
              ) : (
                <ExcelSidePanel
                  key={SheetNameSelected}
                  gridFileID={gridFileID}
                  sheetName={SheetNameSelected}
                  gridDataCount={gridDataCount}
                  isEditorEnabledPanel={setIsEditorEnabled}
                  formDataCache={formDataCacheBySheet[SheetNameSelected]}
                  onFormSaved={refreshHeaderColumns}
                  formData={formData}
                  setFormData={setFormData}
                  isPanelEditorEnabled={isPanelEditorEnabled}
                  setIsPanelEditorEnabled={setIsPanelEditorEnabled}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }),
);
/*--------------------------------------------------------------- */

/*--------------------------------------------------------------- */
/**
 * @function  ExcelEditorPanel => memo
 * @purpose   To add the editing feature on the Excel Grid Container
 */
const ExcelEditorPanel = memo(function ExcelEditorPanel({
  selectedCell,
  editorInputValue,
  onInputChange,
  onRevertCell,
  onRevertSpecificCell,
  onCellSelect,
  getOriginalValue,
  onDiscardAll,
  onSave,
  editCount,
  editedCells,
  headerColumns = [],
}) {
  const [activeTab, setActiveTab] = useState("cell");
  const [detailedRow, setDetailedRow] = useState(null);
  const [expandedCells, setExpandedCells] = useState({});

  /*-------------------------------------------------------------------*
   *  CELL LABEL
   *-------------------------------------------------------------------*/
  const cellLabel = selectedCell
    ? `${getExcelColumnName(selectedCell.colIndex)}${selectedCell.rowIndex + 1}`
    : "—";

  /*-------------------------------------------------------------------*
   *  GROUP EDITED DATA BY ROW FOR SUMMARY
   *-------------------------------------------------------------------*/
  const EditedDatas = useMemo(() => {
    return Object.keys(editedCells ?? {}).reduce((acc, key) => {
      const [rowKey, colKey] = key.split(":");
      if (!acc[rowKey]) acc[rowKey] = [];
      acc[rowKey].push(Number(colKey));
      return acc;
    }, {});
  }, [editedCells]);

  /*-------------------------------------------------------------------*
   *  CELL EDIT TAB BUTTON CLASS
   *-------------------------------------------------------------------*/
  const CellTabClass = (tab) =>
    `flex-1 px-2 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all duration-200 whitespace-nowrap ${
      activeTab === tab
        ? "bg-light-card3 dark:bg-dark-card3 shadow-sm text-icon-bg dark:text-icon_dark-bg"
        : "text-light-text2 dark:text-dark-text2 hover:bg-light-hover dark:hover:bg-dark-hover"
    }`;

  /*-------------------------------------------------------------------*
   *  CELL EDIT ACTION BUTTONS
   *-------------------------------------------------------------------*/
  const CellActionButtons = (
    <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-light-border dark:border-dark-border">
      {/*-----------------------------------------------------------*/
      /* SAVE (COMMIT) DATA BUTTON /*
        /*-----------------------------------------------------------*/}
      <CustomButton
        label={
          <div className="flex items-center justify-center gap-2 w-full">
            <CheckCircle2 size={18} />
            <span>
              {editCount > 0
                ? `Save ${editCount} Change${editCount > 1 ? "s" : ""}`
                : DataEditor_Cell_Editor_Label.already_saved_label.label}
            </span>
          </div>
        }
        disabled={editCount === 0}
        onClick={onSave}
        btn_bg_color="w-full h-[44px] rounded-xl text-sm font-bold bg-button-primary hover:bg-button-primary-hover text-white shadow-lg shadow-button-primary/20 transition-all duration-200 active:scale-[0.98] disabled:opacity-30"
      />
      {/*-----------------------------------------------------------*/
      /* DISCARD ALL DATA BUTTON /*
        /*-----------------------------------------------------------*/}
      <CustomButton
        label={
          <div className="flex items-center justify-center gap-2 w-full ">
            <Trash2 size={16} />
            <span>{DataEditor_Cell_Editor_Label.discard_label.label}</span>
          </div>
        }
        disabled={editCount === 0}
        onClick={onDiscardAll}
        btn_bg_color="w-full h-[44px] rounded-xl border border-red-500 bg-red-50 dark:bg-red-700 text-red-600 dark:text-white text-[10px] font-bold uppercase hover:bg-red-100 dark:hover:bg-red-900/20 transition-all duration-200 disabled:opacity-30"
      />
    </div>
  );

  return (
    <div className="w-full h-full overflow-y-auto custom-scroll flex flex-col gap-4 mt-2 px-1">
      {/*-----------------------------------------------------------*/
       /* EDITOR TAB SECTION */
       /*-----------------------------------------------------------*/}
      <div className="flex gap-1 p-1 rounded-xl bg-light-card1 dark:bg-dark-card1 border border-light-border dark:border-dark-border">
        {/*-----------------------------------------------------------*/
        /* CELL EDITOR TAB */
        /*-----------------------------------------------------------*/}
        <button
          className={CellTabClass("cell")}
          onClick={() => setActiveTab("cell")}
        >
          <MousePointer2 size={14} />
          {DataEditor_Label.cell_editor_label.label}
        </button>
        {/*-----------------------------------------------------------*/
        /* CHANGES TAB */
        /*-----------------------------------------------------------*/}
        <button
          className={CellTabClass("changes")}
          onClick={() => setActiveTab("changes")}
        >
          <LayoutList size={14} />
          {DataEditor_Label.changes_label.label}
          {editCount > 0 && (
            <span className="ml-1 min-w-[18px] h-[18px] inline-flex items-center justify-center px-1.5 rounded-full bg-orange-500 text-white text-[9px] font-black shadow-sm shadow-orange-500/30">
              {editCount}
            </span>
          )}
        </button>
        {/*-----------------------------------------------------------*/
        /* FIELDS TAB */
        /*-----------------------------------------------------------*/}
        <button
          className={CellTabClass("fields")}
          onClick={() => setActiveTab("fields")}
        >
          <Hash size={14} />
          {DataEditor_Label.header_field_label.label}
          {headerColumns.length > 0 && (
            <span className="ml-1 min-w-[18px] h-[18px] inline-flex items-center justify-center px-1.5 rounded-full bg-icon-500 text-white text-[9px] font-black shadow-sm shadow-icon-500/30">
              {headerColumns.length}
            </span>
          )}
        </button>
      </div>

      {/*-----------------------------------------------------------*/
       /* CELL TAB SECTION */
       /*-----------------------------------------------------------*/}
      {activeTab === "cell" && (
        <div className="flex flex-col gap-4 flex-1 min-h-0">
          {/*-----------------------------------------------------------*/
          /* CELL STATUS SECTION */
          /*-----------------------------------------------------------*/}
          <div className="grid grid-cols-2 gap-2">
            {/*-----------------------------------------------------------*/
            /* SELECTED CELL STATUS */
            /*-----------------------------------------------------------*/}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-light-card1 dark:bg-dark-card1 border border-light-border dark:border-dark-border shadow-sm">
              <div className="p-1 rounded-md bg-icon-50 dark:bg-icon_dark-700 text-icon-bg dark:text-icon_dark-bg">
                <MousePointer2 size={12} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-light-text2 dark:text-dark-text2">
                  {DataEditor_Cell_Editor_Label.selected_cell_label.label}
                </span>
                <span className="text-xs font-mono font-bold text-light-text dark:text-dark-text">
                  {cellLabel}
                </span>
              </div>
            </div>
            {/*-----------------------------------------------------------*/
            /* PENDING CHANGES STATUS */
            /*-----------------------------------------------------------*/}
            <div className="flex items-center px-3 py-2 rounded-xl bg-light-card1 dark:bg-dark-card1 border border-light-border dark:border-dark-border shadow-sm">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-orange-50 dark:bg-orange-700 text-orange-600 dark:text-orange-200">
                  <AlertCircle size={12} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-bold text-light-text2 dark:text-dark-text2">
                    {DataEditor_Cell_Editor_Label.pending_changes_label.label}
                  </span>
                  <span className="text-xs font-mono font-bold text-light-text dark:text-dark-text">
                    {editCount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/*-----------------------------------------------------------*/
          /* EDITOR CONTAINER SECTION */
          /*-----------------------------------------------------------*/}
          <div className="flex flex-col flex-1 min-h-0 rounded-2xl overflow-hidden border border-light-border dark:border-dark-border bg-white dark:bg-dark-card focus-within:ring-2 focus-within:ring-icon-500/20 focus-within:border-icon-bg transition-all duration-200 shadow-sm">
            {/*-----------------------------------------------------------*/
            /* CELL CONTENT HEADER SECTION */
            /*-----------------------------------------------------------*/}
            <div className="flex items-center justify-between px-4 py-2 bg-light-card1 dark:bg-dark-card1 border-b border-light-border dark:border-dark-border">
              {/*-----------------------------------------------------------*/
               /* CELL CONTENT HEADER ICON AND TEXT SECTION */
               /*-----------------------------------------------------------*/}
              <div className="flex items-center gap-2">
                <Edit3 size={12} className="text-icon-bg dark:text-icon_dark-bg" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-light-text1 dark:text-dark-text1">
                  {DataEditor_Cell_Editor_Label.cell_editor_content_label.label}
                </span>
              </div>
              
              {/*-----------------------------------------------------------*/
               /* CELL CONTENT REVERT BUTTON SECTION */
               /*-----------------------------------------------------------*/}
              <div>
                <button
                  disabled={!selectedCell}
                  onClick={onRevertCell}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-50 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase hover:bg-red-100 dark:hover:bg-red-900/20 transition-all border border-red-100 dark:border-red-900/20 shadow-sm disabled:opacity-30"
                >
                  <Undo2 size={12} strokeWidth={2.5} />
                  {DataEditor_Cell_Editor_Label.revert_label.label}
                </button>
              </div>
            </div>
            {/*-----------------------------------------------------------*/
            /* CELL CONTENT INPUT SECTION */
            /*-----------------------------------------------------------*/}
            <textarea
              rows={5}
              disabled={!selectedCell}
              value={editorInputValue}
              onChange={onInputChange}
              placeholder={
                selectedCell
                  ? DataEditor_Cell_Editor_Label.type_something_here_placeholder_label.label
                  : DataEditor_Cell_Editor_Label.select_cell_to_edit_placeholder_label.label
              }
              className="custom-scroll flex-1 w-full min-h-[120px] px-4 py-3 text-sm font-medium resize-none bg-light-card1 dark:bg-dark-card1 text-light-text dark:text-dark-text placeholder:text-input-light-text_secondary dark:placeholder:text-input-dark-text_secondary focus:outline-none disabled:opacity-30 disabled:text-input-light-text_disabled dark:disabled:text-input-dark-text_disabled leading-relaxed transition-all"
            />
            {/*-----------------------------------------------------------*/
             /* CELL CONTENT CHARS COUNT SECTION */
             /*-----------------------------------------------------------*/}
            <div className="flex items-center justify-end px-3 py-2 bg-light-card1 dark:bg-dark-card1 border-t border-light-border dark:border-dark-border">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border shadow-sm">
                <span className="text-[10px] font-mono font-bold text-light-text_muted dark:text-dark-text_muted">
                  {editorInputValue?.length ?? 0}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-light-text_muted dark:text-dark-text_muted">
                  {DataEditor_Cell_Editor_Label.chars_label.label}
                </span>
              </div>
            </div>
          </div>

          {/*-----------------------------------------------------------*/
          /* CELL ACTION BUTTONS SECTION */
          /*-----------------------------------------------------------*/}
          {CellActionButtons}
        </div>
      )}

      {/*-----------------------------------------------------------*/
       /* CHANGES TAB SECTION */
       /*-----------------------------------------------------------*/}
      {activeTab === "changes" && (
        <div className="flex flex-col gap-4 flex-1 min-h-0 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="flex flex-col flex-1 min-h-0 rounded-2xl overflow-hidden border border-light-border dark:border-dark-border bg-white dark:bg-dark-card transition-all duration-200 shadow-sm">
            {detailedRow === null ? (
              /*-----------------------------------------------------------*/
              /* VIEW 1: LIST OF MODIFIED ROWS */
              /*-----------------------------------------------------------*/
              <div className="flex flex-col flex-1 min-h-0">
                {/*-----------------------------------------------------------*/
                /* MODIFIED ROWS HEADER */
                /*-----------------------------------------------------------*/}
                <div className="px-4 py-3 bg-light-card1 dark:bg-dark-card1 border-b border-light-border dark:border-dark-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LayoutList
                      size={14}
                      className="text-icon-bg dark:text-icon_dark-bg"
                    />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-light-text2 dark:text-dark-text2">
                      {DataEditor_Modified_Data_Label.modified_data_label.label}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-icon-bg dark:bg-icon_dark-bg text-light-bg text-[10px] font-bold">
                    {Object.keys(EditedDatas).length}{" "}
                    {DataEditor_Modified_Data_Label.record_label.label}
                  </span>
                </div>
                {/*-----------------------------------------------------------*/
                /* MODIFIED ROWS LISTS */
                /*-----------------------------------------------------------*/}
                <div className="flex-1 bg-light-card1 dark:bg-dark-card1 overflow-y-auto custom-scroll p-3 space-y-2.5">
                  {Object.entries(EditedDatas).length === 0 ? (
                    /*-----------------------------------------------------------*/
                    /* DEFAULT MODIFIED DATA CONTAINER */
                    /*-----------------------------------------------------------*/
                    <div className="flex flex-col items-center justify-center h-full opacity-70">
                      <LayoutList
                        size={40}
                        className="mb-2 text-light-text_muted dark:text-dark-text_muted"
                      />
                      <p className="text-[12px] font-bold text-light-text dark:text-dark-text tracking-widest">
                        {
                          DataEditor_Modified_Data_Label
                            .no_modified_data_message.label
                        }
                      </p>
                    </div>
                  ) : (
                    Object.entries(EditedDatas).map(([rowIdx, cols]) => (
                      /*-----------------------------------------------------------*/
                      /* MODIFIED DATA ROWS */
                      /*-----------------------------------------------------------*/
                      <div
                        key={rowIdx}
                        onClick={() => setDetailedRow(rowIdx)}
                        className="flex items-center gap-3 p-3 rounded-xl bg-light-card1 dark:bg-dark-card1 
                        border border-light-border dark:border-dark-border group 
                        hover:border-icon-bg dark:hover:border-icon_dark-bg 
                        hover:bg-light-card dark:hover:bg-dark-card transition-all cursor-pointer shadow-sm"
                      >
                        {/*-----------------------------------------------------------*/
                        /* MODIFIED DATA ROW INDEX */
                        /*-----------------------------------------------------------*/}
                        <div className="w-10 h-10 rounded-xl bg-light-card dark:bg-dark-card flex items-center justify-center text-xs font-bold text-icon-500 shadow-sm border border-light-border dark:border-dark-border group-hover:bg-icon-500 group-hover:text-white transition-all">
                          R{Number(rowIdx) + 1}
                        </div>
                        {/*-----------------------------------------------------------*/
                        /* MODIFIED DATA ROW INFO */
                        /*-----------------------------------------------------------*/}
                        <div className="flex flex-col flex-1">
                          {/*-----------------------------------------------------------*/
                          /* MODIFIED COLUMN COUNT */
                          /*-----------------------------------------------------------*/}
                          <span className="text-xs font-bold text-light-text dark:text-dark-text">
                            {cols.length} Column
                            {cols.length > 1 ? "s" : ""} Modified
                          </span>
                          {/*-----------------------------------------------------------*/
                          /* MODIFIED COLUMN LIST ROWS */
                          /*-----------------------------------------------------------*/}
                          <div className="flex items-center gap-1.5 mt-1.5">
                            {/*-----------------------------------------------------------*/
                            /* MODIFIED COLUMN LIST DATA */
                            /*-----------------------------------------------------------*/}
                            {cols.slice(0, 5).map((col) => (
                              <span
                                key={col}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const rawValue = getOriginalValue?.(
                                    Number(rowIdx),
                                    col,
                                  );
                                  onCellSelect?.(Number(rowIdx), col, rawValue);
                                  setActiveTab("cell");
                                }}
                                className="text-[12px] font-mono font-bold px-2 py-0.5 rounded bg-light-card dark:bg-dark-card 
                                border border-light-border dark:border-dark-border text-light-text1 dark:text-dark-text1 
                                hover:text-icon-bg dark:hover:text-icon_dark-bg hover:border-icon-bg dark:hover:border-icon_dark-bg 
                                transition-all"
                              >
                                {getExcelColumnName(col)}
                              </span>
                            ))}
                            {/*-----------------------------------------------------------*/
                            /* MODIFIED COLUMN LIST DATA EXTRA */
                            /*-----------------------------------------------------------*/}
                            {cols.length > 5 && (
                              <span className="text-[12px] font-bold text-icon-bg dark:text-icon_dark-bg bg-icon-50 px-2 py-0.5 rounded">
                                +{cols.length - 5}
                              </span>
                            )}
                          </div>
                        </div>
                        {/*-----------------------------------------------------------*/
                        /* MODIFIED COLUMN LIST DATA EXTRA */
                        /*-----------------------------------------------------------*/}
                        <ChevronRight
                          size={16}
                          className="text-light-text dark:text-dark-text opacity-0 group-hover:opacity-100 transition-all"
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              /*-----------------------------------------------------------*/
              /* VIEW 2: DETAILED CELL EDITS FOR ROW */
              /*-----------------------------------------------------------*/
              <div className="flex flex-col flex-1 min-h-0">
                {/*-----------------------------------------------------------*/
                /* MODIFIED DATA VIEW 2 HEADER */
                /*-----------------------------------------------------------*/}
                <div className="px-4 py-3 bg-light-card1 dark:bg-dark-card1 border-b border-light-border dark:border-dark-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/*-----------------------------------------------------------*/
                    /* MODIFIED DATA VIEW 2 HEADER BACK BUTTON */
                    /*-----------------------------------------------------------*/}
                    <button
                      onClick={() => setDetailedRow(null)}
                      className="p-1 rounded-lg text-light-text2/30 dark:text-dark-text2 hover:text-icon-bg dark:hover:text-icon_dark-bg hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    {/*-----------------------------------------------------------*/
                    /* MODIFIED DATA VIEW 2 HEADER LABELS TEXT */
                    /*-----------------------------------------------------------*/}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-light-text2 dark:text-dark-text2">
                        Row
                      </span>
                      <span
                        className="text-[12px] font-mono font-bold px-1 py-0.25 rounded-[4px] bg-icon-50 dark:bg-icon_dark-50 
                            border border-light-border dark:border-dark-border text-icon-bg dark:text-icon_dark-bg shadow-sm"
                      >
                        {Number(detailedRow) + 1}
                      </span>
                    </div>
                  </div>
                </div>

                {/*-----------------------------------------------------------*/
                /* MODIFIED DATA VIEW 2 DATA LIST */
                /*-----------------------------------------------------------*/}
                <div className="flex-1 bg-light-card1 dark:bg-dark-card1 overflow-y-auto custom-scroll p-3 space-y-4">
                  {EditedDatas[detailedRow]?.map((colIdx) => {
                    const cellKey = `${detailedRow}:${colIdx}`;
                    const newValue = editedCells[cellKey];
                    const oldValue = getOriginalValue?.(
                      Number(detailedRow),
                      colIdx,
                    );

                    return (
                      <div
                        key={cellKey}
                        className="rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border shadow-sm overflow-hidden hover:border-icon-bg dark:hover:border-icon_dark-bg transition-all group"
                      >
                        {/*-----------------------------------------------------------*/
                        /* MODIFIED DATA VIEW 2 DATA LIST HEADER */
                        /*-----------------------------------------------------------*/}
                        <div
                          className="flex items-center justify-between  p-3 cursor-pointer bg-light-card1 dark:bg-dark-card1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedCells((prev) => ({
                              ...prev,
                              [cellKey]: !prev[cellKey],
                            }));
                          }}
                        >
                          {/*-----------------------------------------------------------*/
                          /* MODIFIED DATA VIEW 2 DATA LIST ICONS */
                          /*-----------------------------------------------------------*/}
                          <div className="flex items-center gap-2">
                            <ChevronLeft
                              size={14}
                              className={`text-light-text2/30 dark:text-dark-text2 transition-transform duration-200 ${
                                expandedCells[cellKey]
                                  ? "-rotate-90"
                                  : "rotate-180"
                              }`}
                            />
                            <span className="text-[11px] font-mono font-bold text-icon-bg dark:text-icon_dark-bg bg-icon-50 dark:bg-icon_dark-700 px-2.5 py-1 rounded-lg border border-light-border dark:border-dark-border">
                              {getExcelColumnName(colIdx)}
                              {Number(detailedRow) + 1}
                            </span>
                            {!expandedCells[cellKey] && (
                              <span className="text-[10px] max-w-[100px] italic text-light-text1 dark:text-dark-text1 bg-light-card2 dark:bg-dark-card2 px-1.5 py-0.5 roun rounded-[4px] border border-light-border dark:border-dark-border shadow-sm truncate">
                                {newValue || (
                                  <span className="italic opacity-30 text-[10px]">
                                    {
                                      DataEditor_Modified_Data_Label.empty_label
                                        .label
                                    }
                                  </span>
                                )}
                              </span>
                            )}
                          </div>

                          {/*-----------------------------------------------------------*/
                          /* MODIFIED DATA VIEW 2 DATA LIST DELETE AND REVERT BUTTON */
                          /*-----------------------------------------------------------*/}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onRevertSpecificCell?.(
                                  Number(detailedRow),
                                  colIdx,
                                );
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-50 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase hover:bg-red-100 dark:hover:bg-red-900/20 transition-all border border-red-100 dark:border-red-900/20 shadow-sm"
                            >
                              <Undo2 size={12} strokeWidth={2.5} />
                              {
                                DataEditor_Modified_Data_Label.revert_label
                                  .label
                              }
                            </button>
                          </div>
                        </div>

                        {/*-----------------------------------------------------------*/
                        /* MODIFIED DATA VIEW 2 DATA EXPANDED DATA */
                        /*-----------------------------------------------------------*/}
                        {expandedCells[cellKey] && (
                          <div
                            className="px-4 pb-4 pt-1 space-y-3 bg-light-card1 dark:bg-dark-card1 border-t border-light-border dark:border-dark-border cursor-pointer"
                            onClick={() => {
                              onCellSelect?.(
                                Number(detailedRow),
                                colIdx,
                                newValue,
                              );
                              setDetailedRow(null);
                              setActiveTab("cell");
                            }}
                          >
                            <div className="grid grid-cols-2 gap-3 mt-[2px]">
                              {/*-----------------------------------------------------------*/
                              /* MODIFIED DATA VIEW 2 EXPANDED DATA - ORIGINAL VALUE */
                              /*-----------------------------------------------------------*/}
                              <div className="flex flex-col gap-1.5">
                                <span className="text-[9px] uppercase ml-[2px] font-bold text-light-text_muted dark:text-dark-text_muted tracking-wider">
                                  {
                                    DataEditor_Modified_Data_Label
                                      .original_label.label
                                  }
                                </span>
                                <div className="flex items-center px-3 py-2 bg-input-light-background_hover dark:bg-input-dark-background_hover rounded-xl border border-light-border dark:border-dark-border min-h-[40px]">
                                  <p className="text-[11px] text-light-text2 dark:text-dark-text2 font-medium break-words italic">
                                    {oldValue || (
                                      <span className="italic opacity-30 text-[10px]">
                                        {
                                          DataEditor_Modified_Data_Label
                                            .empty_label.label
                                        }
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>
                              {/*-----------------------------------------------------------*/
                              /* MODIFIED DATA VIEW 2 EXPANDED DATA - UPDATED VALUE */
                              /*-----------------------------------------------------------*/}
                              <div className="flex flex-col gap-1.5">
                                <span className="text-[9px] uppercase w-fit ml-[2px] px-[4px] py-0.5 bg-light-card1 dark:bg-dark-card1 rounded-md border border-light-border dark:border-dark-border font-bold text-icon-bg dark:text-icon_dark-bg tracking-wider">
                                  {
                                    DataEditor_Modified_Data_Label.updated_label
                                      .label
                                  }
                                </span>
                                <div className="flex items-center px-3 py-2 bg-light-card1 dark:bg-dark-card1 rounded-xl border border-light-border dark:border-dark-border min-h-[40px]">
                                  <p className="text-[11px] text-light-text1 dark:text-dark-text1 font-bold break-words">
                                    {newValue || (
                                      <span className="italic opacity-30 text-[10px]">
                                        {
                                          DataEditor_Modified_Data_Label
                                            .empty_label.label
                                        }
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/*-----------------------------------------------------------*/
       /* FIELDS TAB SECTION */
       /*-----------------------------------------------------------*/}
      {activeTab === "fields" && (
        <div className="flex flex-col gap-4 flex-1 min-h-0">
          {headerColumns.length === 0 ? (
            /*-----------------------------------------------------------*/
            /* DEFAULT FIELD CONTAINER */
            /*-----------------------------------------------------------*/
            <div className="flex flex-col items-center bg-light-card1 dark:bg-dark-card1 justify-center border border-light-border_strong dark:border-dark-border_strong rounded-2xl flex-1 gap-3 py-10 opacity-70">
              <TableIcon
                size={40}
                className="text-light-text_muted dark:text-dark-text_muted"
              />
              <div className="text-center">
                <p className="text-sm font-bold text-light-text dark:text-dark-text">
                  {DataEditor_Fields_Label.no_fields_detected.label}
                </p>
                <p className="text-xs text-light-text_secondary dark:text-dark-text_secondary">
                  {DataEditor_Fields_Label.configure_sheet_settings.label}
                </p>
              </div>
            </div>
          ) : (
            /*-----------------------------------------------------------*/
            /* FIELD ITEMS CONTAINER */
            /*-----------------------------------------------------------*/
            <div className="overflow-y-auto custom-scroll flex-1 space-y-2 pr-1 pb-20">
              {headerColumns.map(({ key, label }, index) => (
                <div
                  key={key}
                  className="p-3 rounded-2xl bg-light-card1 dark:bg-dark-card1 border border-light-border dark:border-dark-border shadow-sm hover:shadow-md hover:border-icon-bg dark:hover:border-icon_dark-bg transition-all duration-200 overflow-hidden"
                >
                  <div className="flex items-center gap-3">
                    {/*-----------------------------------------------------------*/
                    /* FIELD INDEX COUNT BADGE */
                    /*-----------------------------------------------------------*/}
                    <div className="shrink-0 w-8 h-8 rounded-xl bg-icon-50 dark:bg-icon_dark-700/10 text-icon-bg dark:text-icon_dark-bg flex items-center justify-center text-xs font-bold border border-icon-bg/20 dark:border-icon_dark-bg/20 ">
                      {index + 1}
                    </div>
                    {/*-----------------------------------------------------------*/
                    /* FIELD ITEMS SECTION */
                    /*-----------------------------------------------------------*/}
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 w-full bg-light-card3 dark:bg-dark-card3 p-2 rounded-lg border border-light-border dark:border-dark-border">
                        {/*-----------------------------------------------------------*/
                        /* FIELD LABEL */
                        /*-----------------------------------------------------------*/}
                        <span
                          title={label}
                          className="text-[10px] font-bold text-light-text dark:text-dark-text leading-tight truncate"
                        >
                          {label}
                        </span>
                        {/*-----------------------------------------------------------*/
                        /* FIELD ARROW ICON */
                        /*-----------------------------------------------------------*/}
                        <div className="flex items-center justify-center text-icon-bg dark:text-icon_dark-bg">
                          <ArrowRight size={14} strokeWidth={2.5} />
                        </div>
                        {/*-----------------------------------------------------------*/
                        /* FIELD ID LABEL */
                        /*-----------------------------------------------------------*/}
                        <div className="flex items-center min-w-0">
                          <span
                            title={`${key.split("_")[0]}_${label
                              .replace(/[^a-zA-Z0-9 ]/g, "")
                              .trim()
                              .replace(/\s+/g, "_")}`}
                            className="text-[10px] w-full font-mono font-bold text-icon-bg dark:text-icon_dark-bg bg-light-card1 dark:bg-dark-card1 px-2 py-1 rounded-md border border-light-border dark:border-dark-border truncate shadow-sm max-w-full"
                          >
                            ID: {key.split("_")[0]}_
                            {label
                              .replace(/[^a-zA-Z0-9 ]/g, "")
                              .trim()
                              .replace(/\s+/g, "_")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {/* Spacer to ensure the last item is fully scrollable */}
              <div className="h-10 w-full" aria-hidden="true" />
            </div>
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
const BackButton = ({ path, onClick }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    } else {
      navigate(path);
    }
  };

  return (
    <button
      onClick={handleClick}
      title="Back"
      className="
        group
        relative
        inline-flex items-center justify-center
        p-1.5
        rounded-lg
        transition-all duration-300 ease-in-out
        bg-light-card1 dark:bg-dark-card1
        hover:bg-icon-bg dark:hover:bg-icon_dark-bg
        text-icon-bg dark:text-icon_dark-bg hover:text-white dark:hover:text-white
        border border-light-border dark:border-dark-border
        active:scale-90
        shadow-sm hover:shadow-md
      "
    >
      <ChevronLeft
        size={16}
        strokeWidth={3}
        className="transition-transform duration-300 group-hover:-translate-x-1"
      />
    </button>
  );
};
/*--------------------------------------------------------------- */

/**
 * @function  DiscardChangesModal => COMPONENT
 * @purpose   To show confirmation for unsaved changes
 */
const DiscardChangesModal = ({
  isOpen,
  onClose,
  onDiscard,
  onSave,
  sheetsWithEdits,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-light-card dark:bg-dark-card w-full max-w-md p-6 rounded-2xl shadow-2xl border border-light-border dark:border-dark-border overflow-hidden animate-in zoom-in-95 duration-300">
        {/*-----------------------------------------------------------*/
         /* DISCARD HEADER SECTION */
         /*-----------------------------------------------------------*/}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
              <AlertCircle size={16} />
            </div>
            <div className="text-lg font-bold text-light-text dark:text-dark-text">
              {DataEditor_Discard_Label.unsaved_changes.label}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-light-text  dark:text-dark-text hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        {/*-----------------------------------------------------------*/
         /* DISCARD MESSAGE SECTION */
         /*-----------------------------------------------------------*/}
        <p className="text-sm text-light-text2 dark:text-dark-text2 mb-6 leading-relaxed">
          {DataEditor_Discard_Label.descption_message.label}
        </p>
        {/*-----------------------------------------------------------*/
         /* DISCARD CHANGES SHEETS SECTION */
         /*-----------------------------------------------------------*/}
        <div className="space-y-2 mb-6 max-h-40 overflow-y-auto custom-scroll pr-2">
          {sheetsWithEdits.map((sheet) => (
            <div
              key={sheet.name}
              className="flex items-center justify-between p-3 rounded-xl bg-light-card1 dark:bg-dark-card1 border border-light-border dark:border-dark-border"
            >
              <div className="flex items-center gap-2">
                <TableIcon size={14} className="text-icon-bg dark:text-icon_dark-bg" />
                <span className="text-xs font-bold text-light-text dark:text-dark-text">
                  {sheet.name}
                </span>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-icon-50 dark:bg-icon_dark-700 text-icon-bg dark:text-icon_dark-bg tracking-tighter">
                <span>{sheet.count}</span>
                <span>{sheet.count === 1 ? "Edit" : "Edits"}</span>
              </span>
            </div>
          ))}
        </div>
        {/*-----------------------------------------------------------*/
         /* DISCARD ACTION BUTTONS SECTION */
         /*-----------------------------------------------------------*/}
        <div className="flex flex-row w-full gap-3">
          {/*-----------------------------------------------------------*/
           /* DISCARD ACTION DISCARD BUTTON */
           /*-----------------------------------------------------------*/}
          <button
            onClick={onDiscard}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 font-bold text-sm transition-all duration-200 active:scale-[0.98]"
          >
            <Trash2 size={18} />
            {DataEditor_Discard_Label.discard_all_label.label}
          </button>
          {/*-----------------------------------------------------------*/
           /* DISCARD ACTION SAVE BUTTON */
           /*-----------------------------------------------------------*/}
          <button
            onClick={onSave}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-button-primary text-white hover:bg-button-primary-hover font-bold text-sm transition-all duration-200 shadow-lg shadow-icon-500/20 active:scale-[0.98]"
          >
            <Save size={18} />
            {DataEditor_Discard_Label.save_changes_label.label}
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [sheetsWithEdits, setSheetsWithEdits] = useState([]);
  const [pendingSheetNames, setPendingSheetNames] = useState([]);

  const gridRef = useRef(null);
  const navigate = useNavigate();

  /*-----------------------------------------------------------*/
  /* HANDEL BACK BUTTON */
  /*-----------------------------------------------------------*/
  const handleBackClick = () => {
    if (hasUnsavedChanges) {
      const sheets = gridRef.current?.getSheetsWithEdits() || [];
      setSheetsWithEdits(sheets);
      setShowDiscardModal(true);
    } else {
      navigate("/data");
    }
  };

  /*-----------------------------------------------------------*/
  /* HANDEL SAVE ALL AND EXIT BUTTON */
  /*-----------------------------------------------------------*/
  const handleSaveAllAndExit = async () => {
    const success = await gridRef.current?.saveAll();
    if (success) {
      setShowDiscardModal(false);
      navigate("/data");
    }
  };

  /*-----------------------------------------------------------*/
  /* HANDEL DISCARD ALL AND EXIT BUTTON */
  /*-----------------------------------------------------------*/
  const handleDiscardAllAndExit = () => {
    gridRef.current?.discardAll();
    setShowDiscardModal(false);
    navigate("/data");
  };

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
        <div className="flex flex-row items-center gap-4 mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border shadow-sm">
              <BackButton path={"/data"} onClick={handleBackClick} />
              <div className="w-[1.6px] h-[20px] rounded-full bg-light-border_strong dark:bg-dark-border_strong"></div>
              <div className="p-2 rounded-lg bg-icon-bg dark:bg-icon_dark-bg text-dark-text">
                <FileText size={16} />
              </div>
              <div className="flex">
                <div
                  title={fileData?.name}
                  className="text-[14px] font-bold text-light-text dark:text-dark-text truncate max-w-[200px]"
                >
                  {fileData?.name}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/*-----------------------------------------------------------*/
      /* EXCEL SHEETS SELECT SECTION */
      /*-----------------------------------------------------------*/}
      {totalSheets > 0 && (
        <div className="mt-6 mb-4 overflow-x-auto custom-scroll no-scrollbar">
          <div className="flex items-center gap-1.5 p-1.5 w-fit rounded-xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border ">
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
                    relative flex items-center gap-2 px-2 py-2 rounded-lg text-[10px] font-black transition-all duration-300
                    ${
                      isActive
                        ? "bg-light-card1 dark:bg-dark-card1 text-icon-bg shadow-lg scale-[1.02] ring-1 ring-light-border dark:ring-dark-border"
                        : "text-light-label2 dark:text-dark-label2  hover:text-light-text dark:hover:text-dark-text hover:bg-light-border_strong dark:hover:bg-dark-border_strong"
                    }
                  `}
                >
                  <span className="whitespace-nowrap uppercase tracking-[0.15em]">
                    {name}
                  </span>
                  {pendingSheetNames.includes(name) && (
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce-soft shadow-[0_0_8px_rgba(249,115,22,0.5)]"
                      title="Pending changes"
                    />
                  )}
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-icon-bg rounded-full" />
                  )}
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
          ref={gridRef}
          grid={sheetData[activesheetName]}
          gridFileID={fileID}
          SheetNameSelected={activesheetName}
          ToastMessage={addToast}
          onEditsChange={setHasUnsavedChanges}
          onSheetsWithEditsChange={setPendingSheetNames}
        />
      )}

      {/*-----------------------------------------------------------*/
      /* DISCARD CHANGES MODAL */
      /*-----------------------------------------------------------*/}
      <DiscardChangesModal
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        onSave={handleSaveAllAndExit}
        onDiscard={handleDiscardAllAndExit}
        sheetsWithEdits={sheetsWithEdits}
      />
    </div>
  );
};
/*--------------------------------------------------------------- */

export default DataEditor;
