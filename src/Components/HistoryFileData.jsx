import { useEffect, useRef, useState } from "react";
import { data_control_icon } from "../Utils/img_render";
import CustomButton from "./CustomButton";
import CustomCheckBox from "./CustomCheckBox";
import HistoryMenuPanel from "./HistoryMenuPanel";
import MIME_File_icon from "./MIME_File_icon";

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

export default function HistoryFileData({
  item,
  file_type,
  checked,
  onCheck,
  onClick,
  onFileListShow,
}) {
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
      className="
        w-full
        grid grid-cols-[40px_1fr_150px_150px_100px]
        items-center
        px-4 py-2
        border-b border-light-border dark:border-dark-border
        text-sm text-light-text1 dark:text-dark-text1
        bg-light-card1 dark:bg-dark-card1
        hover:bg-light-hover dark:hover:bg-dark-hover
        transition-colors
      "
      onClick={onClick}
    >
      {/* Checkbox */}
      <div className="flex items-center justify-center">
        <CustomCheckBox
          id={`file_${item.id}`}
          checked={checked}
          onChange={(e) => onCheck(item.id, e.target.checked)}
        />
      </div>

      {/* File Name */}
      <div className="flex flex-row gap-[5px] items-center">
        <div className="w-[24px] h-[24px]">
          <MIME_File_icon
            dynamicText={file_type?.text}
            stroke_color={"var(--mime-stroke)"}
            text_bg_color={file_type?.bg_text_color}
            text_color={file_type?.text_color}
          />
        </div>
        <div className="truncate">{item.name}</div>
      </div>

      {/* Type */}
      <div className="pl-2 uppercase">{item.mime_type_data.type}</div>

      {/* Last Modified */}
      <div className="pl-2 w-[100px]">
        {formatDateTimeNoSeconds(item.last_modified_at)}
      </div>

      {/* Actions */}
      <div className="pl-2 flex justify-end items-center gap-3 ml-[10px] relative">
        <div
          className="w-fit h-fit"
          onMouseEnter={() => handleMouseEnter(item.id)}
          onMouseLeave={() => handleMouseLeave(item.id)}
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
            onClick={(e) => e.stopPropagation()} // prevent accidental close
          />
        </div>

        {activeMenuId === item.id && (
          <div
            ref={menuRef}
            onMouseEnter={() => handleMouseEnterSubmenu(item.id)}
            onMouseLeave={() => handleMouseLeaveSubmenu(item.id)}
            className="
            absolute top-[-10px] right-[35px] mt-2
            w-[150px] h-fit
            bg-light-card dark:bg-dark-card
            border border-light-border dark:border-dark-border
            rounded-lg shadow-lg p-[5px]
            z-50
          "
          >
            <HistoryMenuPanel file_id={item.id} onReloadShow={onFileListShow} />
          </div>
        )}
      </div>
    </div>
  );
}
