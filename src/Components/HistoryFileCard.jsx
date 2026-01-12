import { useEffect, useRef, useState } from "react";
import { data_control_icon } from "../Utils/img_render";
import CustomButton from "./CustomButton";
import MIME_File_icon from "./MIME_File_icon";
import HistoryMenuPanel from "./HistoryMenuPanel";

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

const HistoryFileCard = ({
  index = "",
  mime_ele = {},
  file_ele = {},
  onFileShow,
  onShowPreview,
}) => {
  const [activeMenuId, setActiveMenuId] = useState(null);
  const hideTimers = useRef({});
  const menuRef = useRef(null);

  const handleMouseEnter = (menuId) => {
    clearTimeout(hideTimers.current[menuId]);
    setActiveMenuId(menuId); // OPEN this menu, close others
  };

  const handleMouseLeave = (menuId) => {
    hideTimers.current[menuId] = setTimeout(() => {
      setActiveMenuId((prev) => (prev === menuId ? null : prev));
    }, 80);
  };

  const handleMouseEnterSubmenu = (menuId) => {
    clearTimeout(hideTimers.current[menuId]);
  };

  const handleMouseLeaveSubmenu = (menuId) => {
    hideTimers.current[menuId] = setTimeout(() => {
      setActiveMenuId((prev) => (prev === menuId ? null : prev));
    }, 80);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenuId(null);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    return () =>
      document.removeEventListener("pointerdown", handleClickOutside);
  }, []);

  return (
    <div
      key={index}
      className="
      w-[180px] h-[128px]
      flex flex-col relative
      bg-light-card1 dark:bg-dark-card1
      border border-b-0 border-light-border dark:border-dark-border
      rounded-[10px]
      overflow-visible
      hover:bg-light-hover dark:hover:bg-dark-hover
      transition-colors"
      onClick={onShowPreview}
    >
      {/* MENU SECTION */}
      <div className="absolute top-[5px] right-[5px]">
        <div
          className="w-fit h-fit"
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={() => handleMouseLeave(index)}
        >
          <CustomButton
            iconSize="w-[14px] h-[14px]"
            btn_bg_color="
              bg-light-border_strong hover:bg-light-text2
              dark:bg-dark-border_strong dark:hover:bg-dark-text2
              px-[6px] py-[6px] rounded-md transition-colors
            "
            textColor="text-light-text dark:text-dark-text hover:text-light-card2 dark:hover:text-dark-card2"
            icon_animation="transition-transform group-hover:scale-110"
            iconSrc={data_control_icon.three_dot_menu.icon}
            onChange={(e) => setCheckedAll(e.target.checked)}
          />
        </div>
        {activeMenuId === index && (
          <div
            ref={menuRef}
            onMouseEnter={() => handleMouseEnterSubmenu(index)}
            onMouseLeave={() => handleMouseLeaveSubmenu(index)}
            className="
            absolute top-[15px] right-[-150px] mt-2
            w-[150px] h-fit
            bg-light-card dark:bg-dark-card
            border border-light-border dark:border-dark-border
            rounded-lg shadow-lg p-[5px]
            z-[150]
          "
          >
            <HistoryMenuPanel file_id={index} onReloadShow={onFileShow} />
          </div>
        )}
      </div>

      {/* TOP SECTION */}
      <div className="flex flex-col items-center gap-1 py-[6px]">
        {/* File Icon */}
        <div className="w-[64px] h-[64px] flex items-center justify-center">
          <MIME_File_icon
            key={index}
            dynamicText={mime_ele.text}
            stroke_color="var(--mime-stroke)"
            text_bg_color={mime_ele.bg_text_color}
            text_color={mime_ele.text_color}
          />
        </div>

        {/* File Name */}
        <div
          className="max-w-full px-[10px] text-[15px] font-semibold truncate
        text-light-text_secondary dark:text-dark-text_secondary"
          title={file_ele.name}
        >
          {file_ele.name}
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-b rounded-b-[10px] border-light-border dark:border-dark-border bg-light-card2 dark:bg-dark-card2 text-light-text_muted dark:text-dark-text_muted px-1 py-1 flex justify-between items-center">
        <div className="text-[10px] font-semibold">
          Date : {formatDateTimeNoSeconds(file_ele.last_modified_at)}
        </div>
      </div>
    </div>
  );
};

export default HistoryFileCard;
