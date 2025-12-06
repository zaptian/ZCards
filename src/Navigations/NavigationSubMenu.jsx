import { useState, useRef } from "react";

const NavigationSubMenu = ({
  isExpanded,
  submenuItems = [],
  selectedItem = "",
  onItemClick = () => {},
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const hideTimer = null;

  const handleMouseEnterMenu = () => {
    clearTimeout(hideTimer);
  };

  const handleMouseLeaveMenu = () => {
    hideTimer = setTimeout(() => {
      setShowMenu(false);
    }, 150);
  };

  return (
    <>
      {showMenu && (
        <div
          className={`absolute
            ${
              isExpanded
                ? "top-[116px] left-[186px] ml-5"
                : "top-[116px] left-[56px]"
            }
            flex flex-col bg-white shadow-xl rounded-[10px]
            p-[6px] w-[200px] z-50 gap-[2px]
          `}
          onMouseEnter={handleMouseEnterMenu}
          onMouseLeave={handleMouseLeaveMenu}
        >
          {submenuItems.map((item, index) => (
            <div
              key={index}
              className={`px-2 py-2 rounded-lg hover:bg-gray-300 cursor-pointer 
                flex flex-row items-center gap-[6px]
                ${selectedItem === item.label ? "bg-icon-sub_selected" : ""}
              `}
              onClick={() => onItemClick(item)}
            >
              <div className="w-5 h-5 text-icon-bg">{item.icon}</div>
              <div className="nav-block-name">{item.label}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default NavigationSubMenu;
