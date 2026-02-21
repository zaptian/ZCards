import CustomLabel from "../../Components/CustomLabel";
import { mimeStyles } from "../../Utils/mime_type";
import { data_control_icon } from "../../Utils/img_render";
import CustomButton from "../../Components/CustomButton";
import HistoryFileCard from "../../Components/HistoryFileCard";
import { Data_Management_Label } from "../../Utils/label_render";
import CustomCheckBox from "../../Components/CustomCheckBox";
import { useEffect, useMemo, useRef, useState } from "react";
import HistoryFileData from "../../Components/HistoryFileData";
import HistoryFilePreview from "../../Components/HistoryFilePreview";
import HistoryFilterPanel from "../../Components/HistoryFilterPanel";
import HistorySortPanel from "../../Components/HistorySortPanel";
import { useDismissablePanel } from "../../Components/useDismissablePanel";
import ImportPopOver from "../../Components/ImportPopOver";
import EditorPopOver from "../../Components/EditorPopOver";
import { DataDashBoard_Error_Message } from "../../Utils/error_message_render";
import CustomImageInput from "../../Components/CustomImageInput";
import { useToast } from "../../Components/ToastMessage/ToastContext";

/* ------------------ Initialize Workspace ------------------ */
async function initializeWorkspace() {
  try {
    const response = await window.DataDashBoard_API.initializeWorkspace();
    if (!response?.status) {
      throw new Error(DataDashBoard_Error_Message.Init_workspace_Error.message);
    }

    return { status: true };
  } catch (error) {
    console.error("Workspace initialization failed:", error);
    return { status: false, error };
  }
}

/* ------------------ Import Default Files ------------------ */
async function importFiles() {
  try {
    const response = await window.DataDashBoard_API.import_all_list();
    if (!response?.status) {
      throw new Error(DataDashBoard_Error_Message.Import_file_Error.message);
    }
    return { status: true, files: response };
  } catch (error) {
    console.error("File import failed:", error);
    return { status: false, error };
  }
}

/* ------------------------- Get Recent file  --------------------------  */
async function recentFiles() {
  try {
    const c_result = await window.DataDashBoard_API.recentList();
    if (!c_result.status) {
      throw new Error(DataDashBoard_Error_Message.Recent_file_Error.message);
    }

    return { status: true, files: c_result.files };
  } catch (error) {
    console.error("[DataDashboard:recentFiles()] Failed:", error);
    return { status: false, error };
  }
}

const DataDashboard = () => {
  const [checkedAll, setCheckedAll] = useState(false);
  const [rowChecks, setRowChecks] = useState({});
  const [previewSelected, setPreviewSelected] = useState({
    file_type: null,
    mime_type: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    type: "",
    date: "",
  });
  const [sort, setSort] = useState({
    field: "date",
    order: "desc",
  });
  const [fileList, setFileList] = useState([]);
  const [recentFile, setRecentFile] = useState({});
  const [showBoxMenu, setBoxMenu] = useState(true);

  const [showImportMenu, setShowImportMenu] = useState(false);
  const [showEditDataMenu, setshowEditDataMenu] = useState(false);

  // Toast Message use
  const { addToast } = useToast();

  const filterRef = useRef(null);
  const sortRef = useRef(null);

  /* ----------------- Initialization & Default Data Show  ----------------------- */
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);

        const [initializeResult, importFileResult, recentFileResult] =
          await Promise.all([
            initializeWorkspace(),
            importFiles(),
            recentFiles(),
          ]);

        if (!initializeResult?.status) {
          console.error(
            "[DataDashBoard:initializeWorkspace()] Failed :",
            initializeResult?.error,
          );
        }

        if (importFileResult?.status) {
          setFileList(Object.values(importFileResult.files.files || {}));
        } else {
          console.error(
            "[DataDashBoard:importFiles()] Failed :",
            importFileResult?.error,
          );
        }

        if (recentFileResult?.status) {
          setRecentFile(recentFileResult?.files || {});
        } else {
          console.error(
            "[DataDashBoard:recentFiles()] Failed:",
            recentFileResult?.error,
          );
        }
      } catch (error) {
        console.error("Application initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  /* ----------------------- Loading Recent File -----------------------  */
  const loadRecentFile = async () => {
    const recentFileResult = await recentFiles();
    if (recentFileResult?.status) {
      setRecentFile(recentFileResult?.files || {});
    } else {
      console.error(
        "[DataDashboard:loadRecentFile()] :",
        recentFileResult?.error,
      );
    }
  };

  /* ----------------- Loading file Data ----------------------- */
  const loadFileList = async () => {
    const fileResponse = await importFiles();
    if (!fileResponse?.status) {
      console.error("Failed to load files");
      return;
    }
    setFileList(Object.values(fileResponse.files.files || {}));
    await loadRecentFile();
  };

  /* ----------------- Filter option count ----------------------- */
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(Boolean).length;
  }, [filters]);

  useDismissablePanel({
    refs: [filterRef],
    isOpen: showFilter,
    onClose: () => setShowFilter(false),
  });

  useDismissablePanel({
    refs: [sortRef],
    isOpen: showSort,
    onClose: () => setShowSort(false),
  });

  /* ---------------------- Debouncing search ------------------ */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  /* ------------------- SEARCH RESULT DATA ------------------- */
  const search_result_Files = useMemo(() => {
    let result = [];
    if (fileList) {
      result = fileList;
    }

    /* -------------------- Search -------------------- */
    if (debouncedQuery.trim()) {
      const query = debouncedQuery.toLowerCase();

      result = result.filter((file) =>
        file.name.toLowerCase().startsWith(query),
      );
    }

    /* -------------------- ADVANCED FILTERS -------------------- */
    if (filters.name.trim()) {
      const nameQuery = filters.name.toLowerCase();
      result = result.filter((file) =>
        file.name.toLowerCase().startsWith(nameQuery),
      );
    }

    if (filters.type.trim()) {
      result = result.filter((file) =>
        file.mime_type_data.type
          .toLowerCase()
          .startsWith(filters.type.toLowerCase()),
      );
    }

    if (filters.date) {
      result = result.filter((file) => {
        const d = new Date(file.last_modified_at);

        const fileDate = [
          d.getFullYear(),
          String(d.getMonth() + 1).padStart(2, "0"),
          String(d.getDate()).padStart(2, "0"),
        ].join("-");

        return fileDate === filters.date;
      });
    }

    /* -------------------- SORT -------------------- */
    if (sort.field) {
      result.sort((a, b) => {
        let valA;
        let valB;

        switch (sort.field) {
          case "name":
            valA = a.name.toLowerCase();
            valB = b.name.toLowerCase();
            break;

          case "type":
            valA = a.mime_type_data.type.toLowerCase();
            valB = b.mime_type_data.type.toLowerCase();
            break;

          case "date":
            valA = new Date(a["last_modified_at"]);
            valB = new Date(b["last_modified_at"]);
            break;

          default:
            return 0;
        }

        if (valA < valB) return sort.order === "asc" ? -1 : 1;
        if (valA > valB) return sort.order === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [fileList, debouncedQuery, filters, sort]);

  /*------------------------ Selected Count ------------------------ */
  const selectedCount = useMemo(() => {
    return Object.values(rowChecks).filter(Boolean).length;
  }, [rowChecks]);

  // Remove the Select List count
  const handleRemoveSelected = () => {
    setRowChecks({});
    setCheckedAll(false);
  };

  // Handle Row Check
  const handleRowCheck = (id, value) => {
    setRowChecks({ ...rowChecks, [id]: value });
  };

  // File check selected
  useEffect(() => {
    const updated = {};
    search_result_Files.forEach((f) => {
      updated[f.id] = checkedAll;
    });
    setRowChecks(updated);
  }, [checkedAll]);

  /*------------------------------ Multi Delete Handle --------------------------- */
  const handleDeleteSelected = async () => {
    // Get selected IDs
    const selectedIds = Object.entries(rowChecks)
      .filter(([, checked]) => checked)
      .map(([id]) => id);

    if (selectedIds.length === 0) return;

    // Remove selected files
    setFileList((prev) =>
      prev.filter((file) => !selectedIds.includes(file.id)),
    );

    // Change Status
    const c_result = await window.DataDashBoard_API.moveToTrash(selectedIds);

    if (c_result.status) {
      // Clear selection
      await loadFileList();
      setRowChecks({});
      setCheckedAll(false);
      setPreviewSelected({ file_type: null, mime_type: null });
    } else {
      console.error(
        `[DataDashBoard:handleDeleteSelected()] : ${c_result.error}`,
      );
    }
  };

  /* --------------------------- Condition checking ------------------------------ */
  const hasQuery = debouncedQuery.trim().length > 0;
  const hasFilters = Boolean(filters.name || filters.date || filters.type);
  const hasResults = search_result_Files.length > 0;
  const hasRecentFile = Boolean(Object.keys(recentFile).length > 0);

  const isSearchActive = hasQuery || hasFilters;

  const showNoSearchResult = hasQuery && !hasResults;
  const showNoFilterResult = !hasQuery && hasFilters && !hasResults;
  const showNoFilesImported = !isSearchActive && !hasResults;
  /* ------------------------------------------------------------------------------ */

  return (
    /* Data DashBoard */
    <div className="w-full p-3 h-[calc(100vh-50px)] overflow-y-auto custom-scroll dark:bg-dark-bg">
      {/* Left Files Panel */}
      <div>
        {/* Header Panel */}
        <div className="flex justify-between h-[50px]">
          {/* Heading Label */}
          <div
            className="h-fit 
          bg-card dark:bg-dark-card
          p-[6px] shadow-[0_2px_6px_rgba(200,200,200,0.5)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.5)]
          border-l-[4px] border-l-icon-bg
          rounded-[4px]"
          >
            <CustomLabel
              label_text={Data_Management_Label.Data_Management.label}
              label_style="text-[16px] font-semibold tracking-wide text-light-text dark:text-dark-text"
            />
          </div>
        </div>

        {/* Recent File Management */}
        <div className="max-w-fit px-[12px] py-[6px] mt-[5px] bg-light-card2 dark:bg-dark-card2 border-[1px] border-light-border dark:border-dark-border rounded-[8px]">
          {/* Recent Label */}
          <div className="m-[10px] ml-0">
            <CustomLabel
              label_text={Data_Management_Label.Recent_files.label}
              label_style="text-[16px] font-semibold tracking-wide text-light-text dark:text-dark-text"
            />
          </div>

          {/* Recent file List */}
          <div className="overflow-x-auto whitespace-nowrap pb-2 custom-scroll">
            <div className="flex flex-row gap-5">
              {/* Last Recent File Preview */}
              {hasRecentFile && (
                <HistoryFileCard
                  key={recentFile.id}
                  index={recentFile.id}
                  mime_ele={recentFile.mime_type_data}
                  file_ele={recentFile}
                  onFileShow={async () => {
                    await loadFileList();
                  }}
                  onShowPreview={() => {
                    setPreviewSelected({
                      file_type: recentFile,
                      mime_type: recentFile.mime_type_data,
                    });
                  }}
                />
              )}

              {/* Import File Panel */}
              <div>
                {/* Import Button click */}
                <CustomButton
                  btn_bg_color="min-w-[180px] min-h-[128px] flex flex-col relative
                    m-1
                    bg-light-card1 dark:bg-dark-card1
                    border border-light-border dark:border-dark-border
                    rounded-[10px]
                    overflow-hidden
                    hover:ring-2 hover:ring-icon-500/40
                    transition-colors"
                  iconSize="w-[64px] h-[64px]"
                  icon_animation="group-hover:scale-125"
                  textColor="text-icon-500 dark:text-icon_dark-500"
                  iconSrc={data_control_icon.file_import.icon}
                  label={data_control_icon.file_import.label}
                  onClick={() => {
                    setShowImportMenu((prev) => !prev);
                  }}
                />

                {/* Show Import Pop window */}
                {showImportMenu && (
                  <ImportPopOver
                    onClose={async () => {
                      setShowImportMenu(false);
                      await loadFileList();
                    }}
                  />
                )}
              </div>

              {/* Edit File Panel */}
              <div>
                {/* Edit Data Button click */}
                <CustomButton
                  btn_bg_color="min-w-[180px] min-h-[128px] flex flex-col relative
                    m-1
                    bg-light-card1 dark:bg-dark-card1
                    border border-light-border dark:border-dark-border
                    rounded-[10px]
                    overflow-hidden
                    hover:ring-2 hover:ring-icon-500/40
                    transition-colors"
                  iconSize="w-[64px] h-[64px]"
                  icon_animation="group-hover:scale-125"
                  textColor="text-icon-500 dark:text-icon_dark-500"
                  iconSrc={data_control_icon.file_Edit.icon}
                  label={data_control_icon.file_Edit.label}
                  onClick={() => {
                    setshowEditDataMenu((prev) => !prev);
                  }}
                />

                {/* Show Edit Data Popup */}
                {showEditDataMenu && (
                  <EditorPopOver
                    recent_file={recentFile}
                    onClose={async () => {
                      setshowEditDataMenu(false);
                      await loadFileList();
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* File History Management */}
        <div className="flex flex-row gap-[15px] w-full">
          <div className="flex flex-col flex-[0_0_80%]">
            <div className="flex flex-col min-h-[600px] max-h-[800px]  px-[12px] py-[6px] mt-[20px] bg-light-card2 dark:bg-dark-card2 border-[1px] border-light-border dark:border-dark-border rounded-[8px]">
              {/* History Label */}
              <div className="m-[10px] ml-0">
                <CustomLabel
                  label_text={Data_Management_Label.History_files.label}
                  label_style="text-[16px] font-semibold tracking-wide text-light-text dark:text-dark-text"
                />
              </div>

              {/* Settings Panel */}
              <div className="flex flex-row justify-between items-center">
                {/* Search panel */}
                <div className="flex flex-row items-center gap-2 ">
                  <CustomImageInput
                    componentStyle="w-[250px] h-[36px]"
                    iconpresent={true}
                    type="text"
                    input_placeholder="Search files"
                    search_text={searchQuery}
                    onChange_Access={(e) => setSearchQuery(e.target.value)}
                    input_classname="
                      w-full h-full
                      pl-3 pr-3
                      rounded-md
                      bg-input-light-background dark:bg-input-dark-background 
                      border-[1px] border-input-light-border dark:border-input-dark-border
                      text-input-light-text dark:text-input-dark-text
                      placeholder:input-light-placeholder dark:placeholder:input-light-placeholder
                      focus:outline-none focus:ring-2 focus:input-light-border_focus
                    "
                    iconStyle={
                      "w-[20px] h-[20px] text-input-light-placeholder dark:text-input-light-placeholder"
                    }
                    icon={data_control_icon.search_icon.icon}
                  />

                  {/* Selected Count */}
                  {selectedCount ? (
                    <div>
                      <CustomButton
                        iconSize="w-[24px] h-[24px]"
                        btn_bg_color="bg-button-danger w-[120px] h-[36px] p-[4px] gap-[5px] rounded-md hover:bg-button-danger-hover active:bg-button-danger-active"
                        icon_animation="group-hover:scale-110"
                        textColor="text-button-danger-text"
                        iconSrc={data_control_icon.clear.icon}
                        label={
                          <span className="flex items-center gap-1">
                            {data_control_icon.clear.label}
                            {selectedCount > 0 && (
                              <span
                                className="min-w-[18px] h-[18px] px-[5px] text-[11px] font-extrabold
                              flex items-center justify-center
                              rounded-full bg-button-danger-100 text-light-text"
                              >
                                {selectedCount}
                              </span>
                            )}
                          </span>
                        }
                        onClick={handleRemoveSelected}
                      />
                    </div>
                  ) : null}
                </div>

                {/* Sub-Setting panel */}
                <div className="flex flex-row gap-[10px]">
                  {/* Selected Count */}
                  {selectedCount ? (
                    <div>
                      <CustomButton
                        iconSize="w-[24px] h-[24px]"
                        btn_bg_color="bg-button-danger w-[125px] h-[36px] p-[4px] gap-[5px] rounded-md hover:bg-button-danger-hover active:bg-button-danger-active"
                        icon_animation="group-hover:scale-110"
                        textColor="text-button-danger-text"
                        iconSrc={data_control_icon.trash.icon}
                        label={
                          <span className="flex items-center gap-1">
                            {data_control_icon.trash.label}
                            {selectedCount > 0 && (
                              <span
                                className="min-w-[18px] h-[18px] px-[5px] text-[11px] font-extrabold
                              flex items-center justify-center
                              rounded-full bg-button-danger-100 text-light-text"
                              >
                                {selectedCount}
                              </span>
                            )}
                          </span>
                        }
                        onClick={handleDeleteSelected}
                      />
                    </div>
                  ) : null}

                  {/* clear Filter Options */}
                  {activeFilterCount ? (
                    <div>
                      <CustomButton
                        iconSize="w-[24px] h-[24px]"
                        btn_bg_color="bg-button-danger w-[72px] h-[36px] p-[4px] gap-[5px] rounded-md hover:bg-button-danger-hover active:bg-button-danger-active"
                        icon_animation="group-hover:scale-110"
                        textColor="text-button-danger-text"
                        iconSrc={data_control_icon.clear_filter.icon}
                        label={
                          activeFilterCount > 0 && (
                            <span
                              className="min-w-[18px] h-[18px] px-[5px] text-[11px] font-extrabold
                              flex items-center justify-center
                              rounded-full bg-button-danger-100 text-light-text"
                            >
                              {activeFilterCount}
                            </span>
                          )
                        }
                        onClick={() => {
                          setFilters({
                            name: "",
                            type: "",
                            date: "",
                          });
                        }}
                      />
                    </div>
                  ) : null}

                  {/* Filter search*/}
                  <div className="relative">
                    <CustomButton
                      iconSize="w-[24px] h-[24px]"
                      btn_bg_color="bg-button-primary w-[90px] h-[36px] p-[4px] gap-[5px] rounded-md hover:bg-button-primary-hover active:bg-button-primary-active"
                      icon_animation="group-hover:scale-110"
                      textColor="text-button-primary-text"
                      label={
                        <span className="flex items-center gap-1">
                          {data_control_icon.filter_icon.label}
                          {activeFilterCount > 0 && (
                            <span
                              className="min-w-[18px] h-[18px] px-[5px] text-[11px] font-extrabold
                              flex items-center justify-center
                              rounded-full bg-icon-200 text-light-text"
                            >
                              {activeFilterCount}
                            </span>
                          )}
                        </span>
                      }
                      iconSrc={data_control_icon.filter_icon.icon}
                      onClick={() => {
                        setShowFilter((prev) => !prev);
                      }}
                    />

                    {/* Filter Panel */}
                    {showFilter && (
                      <div
                        ref={filterRef}
                        className="
                        absolute right-0 mt-2
                        w-[250px] h-fit
                        bg-light-card dark:bg-dark-card
                        border border-light-border dark:border-dark-border
                        rounded-lg shadow-lg
                        p-4 z-50
                      "
                      >
                        <HistoryFilterPanel
                          filters={filters}
                          setFilters={setFilters}
                        />
                      </div>
                    )}
                  </div>

                  {/* SortBy search */}
                  <div className="relative">
                    <CustomButton
                      iconSize="w-[24px] h-[24px]"
                      btn_bg_color="bg-button-primary h-[36px] p-[4px] gap-[5px] rounded-md hover:bg-button-primary-hover active:bg-button-primary-active"
                      icon_animation="group-hover:scale-110"
                      textColor="text-button-primary-text"
                      label={
                        <span className="flex items-center gap-1">
                          {data_control_icon.sort_ascending.label}
                          {sort.field > 0 && (
                            <span
                              className="min-w-[18px] h-[18px] px-[5px] text-[11px] font-extrabold
                              flex items-center justify-center
                              rounded-full bg-icon-200 text-light-text"
                            >
                              {sort.field}
                            </span>
                          )}
                        </span>
                      }
                      iconSrc={data_control_icon.sort_ascending.icon}
                      onClick={() => setShowSort((prev) => !prev)}
                    />
                    {showSort && (
                      <div
                        ref={sortRef}
                        className="
                        absolute right-0 mt-2
                        w-[250px] h-fit
                        bg-light-card dark:bg-dark-card
                        border border-light-border dark:border-dark-border
                        rounded-lg shadow-lg
                        p-4 z-50
                      "
                      >
                        <HistorySortPanel sort={sort} setSort={setSort} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* File Management List */}
              {showBoxMenu ? (
                <div className="flex flex-col min-h-[600px] max-h-[680px] my-[20px] custom-scroll overflow-y-auto">
                  {/* Table Header Panel */}
                  <div
                    className="
                    w-full 
                    grid grid-cols-[40px_1fr_150px_150px_100px] 
                    items-center
                    px-4 py-4
                    bg-light-card1
                    dark:bg-dark-card1
                    border-b border-light-border dark:border-dark-border 
                    text-sm font-medium
                    text-light-text1 dark:text-dark-text1
                    sticky top-0 z-[10]
                  "
                  >
                    {/* Select All Checkbox */}
                    <div className="flex items-center justify-center">
                      <CustomCheckBox
                        id="file_select_all"
                        checked={checkedAll}
                        onChange={(e) => setCheckedAll(e.target.checked)}
                      />
                    </div>

                    {/* File Name */}
                    <div className="pl-2 font-extrabold">
                      <CustomLabel label_text="File Name" />
                    </div>

                    {/* Type Name */}
                    <div className="pl-2 font-extrabold">
                      <CustomLabel label_text="Type" />
                    </div>

                    {/* Last Modified */}
                    <div className="pl-2 font-extrabold">
                      <CustomLabel label_text="Last Modified" />
                    </div>

                    {/* Actions */}
                    <div className="pl-2 font-extrabold flex justify-end items-center">
                      <CustomLabel label_text="Actions" />
                    </div>
                  </div>

                  {/* -------------------- Data Panel -------------------- */}
                  <div className="flex flex-col">
                    {/* -------- No Search Result -------- */}
                    {showNoSearchResult && (
                      <div className="mt-10 px-4">
                        <div
                          className="
                          mx-auto
                          max-w-md
                          text-center
                          text-md
                          text-light-text_muted
                          dark:text-dark-text_muted
                          break-words
                        "
                        >
                          {`${Data_Management_Label.no_search_found.label} "${debouncedQuery}"`}
                        </div>
                      </div>
                    )}

                    {/* -------- No Filter Result -------- */}
                    {showNoFilterResult && (
                      <div className="mt-10 p-4 text-center text-md text-light-text_muted dark:text-dark-text_muted">
                        {Data_Management_Label.no_search_found_filter.label}
                      </div>
                    )}

                    {/* -------- File List -------- */}
                    {hasResults
                      ? search_result_Files.map((file) => (
                          <HistoryFileData
                            key={file.id}
                            item={file}
                            file_type={
                              file.mime_type_data ?? mimeStyles.default
                            }
                            checked={rowChecks[file.id] || false}
                            onClick={() => {
                              setPreviewSelected({
                                file_type: file,
                                mime_type:
                                  file.mime_type_data ?? mimeStyles.default,
                              });
                            }}
                            onCheck={handleRowCheck}
                            onFileListShow={async () => {
                              await loadFileList();
                            }}
                          />
                        ))
                      : null}

                    {/* -------- No Files Imported (Idle State) -------- */}
                    {showNoFilesImported && (
                      <div className="p-4 text-center text-lg text-light-text_muted dark:text-dark-text_muted">
                        {Data_Management_Label.no_files_imported.label}
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* File Preview Panel */}
          <div
            className="flex-1 min-w-[250px] mt-[20px]
            bg-light-card2 dark:bg-dark-card2 
            border border-light-border dark:border-dark-border
            rounded-[8px]"
          >
            {/* File Preview Content */}
            <HistoryFilePreview
              filetype={previewSelected.file_type}
              mimetype={previewSelected.mime_type}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataDashboard;
