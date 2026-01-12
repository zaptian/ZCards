import { useEffect, useMemo, useRef, useState } from "react";
import { data_control_icon } from "../Utils/img_render";
import { Edit_Data_Label } from "../Utils/label_render";
import { mimeStyles } from "../Utils/mime_type";
import CustomButton from "./CustomButton";
import CustomLabel from "./CustomLabel";
import MIME_File_icon from "./MIME_File_icon";
import HistoryFilterPanel from "./HistoryFilterPanel";
import { useDismissablePanel } from "./useDismissablePanel";
import CustomImageInput from "./CustomImageInput";

/* ---------------------- Date Formating ------------------------- */
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

/* ------------------ Import Default Files ------------------ */
async function importFiles() {
  try {
    const response = await window.DataDashBoard_API.import_all_list();
    if (!response?.status) {
      throw new Error(DataDashBoard_Error_Message.Import_file_Error.message);
    }
    return response;
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

/* -------------------------------- Loading circle --------------- */
const LoadingCircle = () => {
  return (
    <div className="flex justify-center items-center h-[200px]">
      <div
        className="w-6 h-6 border-2 border-light-border dark:border-dark-border
      border-t-transparent rounded-full animate-spin"
      />
    </div>
  );
};

/* -------------------------------- FileCard -------------------------- */
const EditFileCard = ({ fileshow_data = {}, open_file_click }) => {
  const mimeStyle =
    mimeStyles?.[fileshow_data?.mime_type] || mimeStyles.default;

  return (
    <div
      className="
        flex items-center gap-3
        px-2 py-1.5 my-[3px]
        rounded-md
        bg-light-card hover:bg-light-hover
        dark:bg-dark-card dark:hover:bg-dark-hover
        transition-colors
      "
    >
      {/* File Icon */}
      <div className="w-[48px] h-[48px] flex-shrink-0 flex items-center justify-center">
        <MIME_File_icon
          dynamicText={mimeStyle.text}
          stroke_color="var(--mime-stroke)"
          text_bg_color={mimeStyle.bg_text_color}
          text_color={mimeStyle.text_color}
        />
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0 flex flex-col leading-tight">
        <CustomLabel
          label_style="
            text-sm font-medium
            text-light-text1 dark:text-dark-text1
            truncate
          "
          label_text={fileshow_data.name}
        />

        <CustomLabel
          label_style="
            text-[12px]
            text-light-text_muted dark:text-dark-text_muted
          "
          label_text={formatDateTimeNoSeconds(fileshow_data.last_modified_at)}
        />
      </div>

      {/* Open Button */}
      <div className="flex-shrink-0">
        <CustomButton
          iconSize="w-[20px] h-[20px]"
          iconSrc={data_control_icon.right_arrow_large.icon}
          btn_bg_color="
            w-[36px] h-[36px]
            rounded-md
            flex items-center justify-center
            bg-icon-50 hover:bg-icon-100
            transition-colors
          "
          onClick={() => open_file_click?.(fileshow_data.id)}
        />
      </div>
    </div>
  );
};

const EditorPopOver = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [fileList, setFileList] = useState([]);
  const [recentFile, setRecentFile] = useState({});
  const [showFilter, setShowFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: "",
    type: "",
    date: "",
  });
  const filterRef = useRef(null);

  /*------------------- Filter Settings --------------------- */
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(Boolean).length;
  }, [filters]);

  useDismissablePanel({
    refs: [filterRef],
    isOpen: showFilter,
    onClose: () => setShowFilter(false),
  });

  /* ----------------- Loading file Data ----------------------- */
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        const [fileResponse, recentResult] = await Promise.all([
          importFiles(),
          recentFiles(),
        ]);

        if (fileResponse?.status) {
          setFileList(Object.values(fileResponse.files || {}));
        } else {
          console.error("[DataDashboard:importFiles()] :", fileResponse?.error);
        }

        if (recentResult?.status) {
          setRecentFile(recentResult.files || {});
        } else {
          console.error(
            "[DataDashboard:loadRecentFile()] :",
            recentResult?.error
          );
        }
      } catch (error) {
        console.error("Dashboard load failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  /*------------------- Debouncing search --------------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  /*------------------- Search Result Filter --------------- */
  const search_result_Files = useMemo(() => {
    let result = [];
    if (fileList) {
      result = fileList;
    }

    /* -------------------- Search Result -------------------- */
    if (debouncedQuery.trim()) {
      const query = debouncedQuery.toLowerCase();
      result = result.filter((file) =>
        file.name.toLowerCase().startsWith(query)
      );
    }

    /* -------------------- ADVANCED FILTERS -------------------- */
    if (filters.name.trim()) {
      const nameQuery = filters.name.toLowerCase();
      result = result.filter((file) =>
        file.name.toLowerCase().startsWith(nameQuery)
      );
    }

    if (filters.type.trim()) {
      result = result.filter((file) =>
        file.mime_type_data.type
          .toLowerCase()
          .startsWith(filters.type.toLowerCase())
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
    return result;
  });

  /* ------------------------- Display condition ------------------ */
  const hasQuery = debouncedQuery.trim().length > 0;
  const hasSearchResults = search_result_Files.length > 0;
  const hasRecentFile = Boolean(Object.keys(recentFile).length > 0);
  const hasFilters = Object.values(filters).some(Boolean);

  const isSearchActive = hasQuery || hasFilters;

  const showRecentFiles = !isSearchActive;
  const showNoResults = isSearchActive && !hasSearchResults;
  const showSearchResults = isSearchActive && hasSearchResults;
  const isQueryOnly = hasQuery && !hasFilters;
  const isFilterOnly = hasFilters && !hasQuery;
  /* ------------------------------------------------------------- */

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
              {Edit_Data_Label.Edit_data.label}
            </h2>
            <p className="text-sm text-light-text2 dark:text-dark-text2">
              {Edit_Data_Label.Edit_data_message_content.label}
            </p>
          </div>

          {/* Close Button */}
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

        {/* Search File Area */}
        <div className="flex items-center gap-3">
          <CustomImageInput
            componentStyle="w-full h-[36px]"
            type="text"
            input_placeholder="Search files"
            search_text={searchQuery}
            onChange_Access={(e) => setSearchQuery(e.target.value)}
            iconpresent={true}
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

          {/* Filter search*/}
          <div className="relative ">
            <CustomButton
              iconSize="min-w-[24px] min-h-[24px]"
              btn_bg_color=" w-[36px] h-[36px] p-[4px] gap-[5px] rounded-md 
              flex justify-center items-center
              bg-button-primary hover:bg-button-primary-hover active:bg-button-primary-active"
              icon_animation="group-hover:scale-110"
              textColor="text-button-primary-text"
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
                <HistoryFilterPanel filters={filters} setFilters={setFilters} />
              </div>
            )}
          </div>

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
        </div>

        {/* Divider */}
        <div className="my-5 h-px bg-light-border dark:bg-dark-border" />

        {isLoading && <LoadingCircle />}

        {!isLoading && (
          <>
            {/* -------------------- Recent Files -------------------- */}
            {showRecentFiles && (
              <div className="flex flex-col">
                <div className="flex items-start justify-start mb-[3px]">
                  <CustomLabel
                    label_style="text-sm font-semibold text-light-text1 dark:text-dark-text1"
                    label_text={Edit_Data_Label.recent_files.label}
                  />
                </div>

                {hasRecentFile ? (
                  <EditFileCard
                    key={recentFile.id}
                    fileshow_data={recentFile}
                    open_file_click={(id) => {
                      console.log(id);
                    }}
                  />
                ) : (
                  <div className="flex justify-center items-center text-sm text-light-text_muted dark:text-dark-text_muted py-6">
                    No recent files available
                  </div>
                )}
              </div>
            )}

            {/* -------------------- No Search Result -------------------- */}
            {showNoResults && (
              <div className="flex flex-col">
                <div className="flex items-start justify-start mb-[3px]">
                  <CustomLabel
                    label_style="text-sm font-semibold text-light-text1 dark:text-dark-text1"
                    label_text={Edit_Data_Label.search_result.label}
                  />
                </div>

                <div className="flex justify-center items-center text-sm text-light-text_muted dark:text-dark-text_muted">
                  {isQueryOnly && (
                    <div
                      className="
                          mx-auto
                          max-w-md
                          text-center
                          text-md
                          text-light-text_muted
                          dark:text-dark-text_muted
                          break-words
                          line-clamp-2
                        "
                    >
                      {`${Edit_Data_Label.no_search_found.label} "${debouncedQuery}"`}
                    </div>
                  )}

                  {isFilterOnly && <>No results match the selected filters</>}

                  {hasQuery && hasFilters && (
                    <div
                      className="
                          mx-auto
                          max-w-md
                          text-center
                          text-md
                          text-light-text_muted
                          dark:text-dark-text_muted
                          break-words
                          line-clamp-2
                        "
                    >
                      {`${Edit_Data_Label.no_search_found.label} "${debouncedQuery}"`}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* -------------------- Search Results -------------------- */}
            {showSearchResults && (
              <div className="flex flex-col">
                <div className="flex items-start justify-start mb-[3px]">
                  <CustomLabel
                    label_style="text-sm font-semibold text-light-text1 dark:text-dark-text1"
                    label_text={Edit_Data_Label.search_result.label}
                  />
                </div>

                <div className="overflow-y-scroll max-h-[300px] custom-scroll">
                  {search_result_Files.map((file) => (
                    <EditFileCard
                      key={file.id}
                      fileshow_data={file}
                      open_file_click={(id) => {
                        console.log(id);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EditorPopOver;
