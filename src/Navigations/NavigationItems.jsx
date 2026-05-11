import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  navigation_bottom_icon,
  navigation_dataoptions,
  navigation_designoptions,
  navigation_icon,
} from "../Utils/img_render";

function toggleTheme(options) {
  const root = document.documentElement;

  if (options) {
    // Light mode
    root.classList.remove("dark");
    root.classList.add("light");
  } else {
    // Dark mode
    root.classList.remove("light");
    root.classList.add("dark");
  }
}

const NavigationItems = ({ isExpanded, setIsExpanded }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [navsel, setnavsel] = useState("Home");
  const [subnavSelected, setSubNavSelected] = useState("");
  const [showDesignerMenu, setShowDesignerMenu] = useState(false);
  const [showDataManagerMenu, setshowDataManagerMenu] = useState(false);
  const [ThemeMode, setThemeMode] = useState(true);

  const hideTimers = {
    designer: null,
    data_control: null,
  };

  useEffect(() => {
    const path = location.pathname;

    // MAIN NAV
    const mainNav = navigation_icon.find((item) => path === item.path);

    if (mainNav) {
      setnavsel(mainNav.label);
      setSubNavSelected("");
    }

    // DESIGNER SUBMENU
    const designerSub = navigation_designoptions.find(
      (item) => path === item.path,
    );

    if (designerSub) {
      setnavsel("Designer");
      setSubNavSelected(designerSub.label);
      return;
    }

    // DATA CONTROL SUBMENU
    const dataSub = navigation_dataoptions.find((item) =>
      path.startsWith(item.matchPath),
    );
    if (dataSub) {
      setnavsel("Data Control");
      setSubNavSelected(dataSub.label);
      return;
    }

    // SETTINGS
    if (path === navigation_bottom_icon.settings.path) {
      setnavsel(navigation_bottom_icon.settings.label);
      setSubNavSelected("");
    }
  }, [location.pathname]);

  useEffect(() => {
    const applyTheme = async () => {
      await toggleTheme(ThemeMode);
    };
    applyTheme();
  }, [ThemeMode]);

  const handleMouseEnter = (menu) => {
    clearTimeout(hideTimers[menu]); // prevent closing
    if (menu === "designer") setShowDesignerMenu(true);
    if (menu === "data_control") setshowDataManagerMenu(true);
  };

  const handleMouseLeave = (menu) => {
    hideTimers[menu] = setTimeout(() => {
      if (menu === "designer") setShowDesignerMenu(false);
      if (menu === "data_control") setshowDataManagerMenu(false);
    }, 50); // delay to allow cursor to reach submenu
  };

  const handleMouseEnterSubmenu = (menu) => {
    clearTimeout(hideTimers[menu]);
  };

  const handleMouseLeaveSubmenu = (menu) => {
    hideTimers[menu] = setTimeout(() => {
      if (menu === "designer") setShowDesignerMenu(false);
      if (menu === "data_control") setshowDataManagerMenu(false);
    }, 50);
  };

  return (
    <>
      <header
        className={`${
          isExpanded ? "nav-expanded" : "nav-shrink"
        } flex-box-col bg-light-card2 dark:bg-dark-card`}
        id="Navbar"
      >
        {/* Top Navigation */}
        <div className="flex flex-col">
          {navigation_icon.map((nav_item) => (
            <div
              key={nav_item.label}
              className={`nav-block`}
              onMouseEnter={() => {
                if (nav_item.sub_menu_show) {
                  handleMouseEnter(nav_item.nav_option_show);
                }
              }}
              onMouseLeave={() => {
                if (nav_item.sub_menu_show) {
                  handleMouseLeave(nav_item.nav_option_show);
                }
              }}
              onClick={() => {
                navigate(nav_item.path);
              }}
            >
              <div
                className={`nav-icon-box w-full h-full flex flex-row 
                ${
                  isExpanded
                    ? "justify-start items-center pl-3 pr-3 nav-block-expand"
                    : "justify-center items-center nav-block-shrink"
                } 
                ${
                  navsel === nav_item.label
                    ? isExpanded
                      ? "bg-icon-seleceted border-r-[4px] border-r-icon-bg"
                      : "bg-icon-seleceted border-b-[4px] border-b-icon-bg"
                    : "hover:bg-gray-300"
                } `}
              >
                {/* Navigation Icon */}
                <div className="nav-icon-box w-5 h-5 text-icon-bg dark:text-icon_dark-bg">
                  {nav_item.icon}
                </div>

                {/* Navigation Label */}
                {isExpanded && (
                  <div className="nav-block-name text-icon-seleceted_text dark:text-icon_dark-bg">
                    {nav_item.label}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* SUBMENU - Designer*/}
        {showDesignerMenu && (
          <div
            className={`
              absolute 
              ${
                isExpanded
                  ? "top-[116px] left-[186px] ml-5"
                  : "top-[116px] left-[56px]"
              }
              ${showDesignerMenu ? "flex" : "hidden"}
              flex-col bg-light-card2 dark:bg-dark-card2 
              border-[1px] border-light-border dark:border-dark-border
              shadow-xl rounded-[10px] p-[6px]
              w-[200px] z-50 gap-[2px]
            `}
            onMouseEnter={() => handleMouseEnterSubmenu("designer")}
            onMouseLeave={() => handleMouseLeaveSubmenu("designer")}
          >
            {navigation_designoptions.map((sub_menu, key_index) => (
              <div
                key={key_index}
                className={`px-2 py-2 rounded-lg hover:bg-gray-300 cursor-pointer 
                flex flex-row items-center gap-[2px]
                ${
                  subnavSelected === sub_menu.label
                    ? "bg-icon-sub_selected text-icon-sub_navigation_text"
                    : null
                } `}
                onClick={() => {
                  navigate(sub_menu.path);
                }}
              >
                <div className="w-5 h-5 text-icon-bg dark:text-icon_dark-bg">
                  {sub_menu.icon}
                </div>
                <div className="nav-block-name text-icon-seleceted_text dark:text-icon_dark-bg">
                  {sub_menu.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Data Manager - SUBMENU */}
        {/* {showDataManagerMenu && (
          <div
            className={`
              absolute 
              ${
                isExpanded
                  ? "top-[166px] left-[186px] ml-5"
                  : "top-[166px] left-[56px]"
              }
              ${showDataManagerMenu ? "flex" : "hidden"}
              flex-col bg-light-card2 dark:bg-dark-card2 
              border-[1px] border-light-border dark:border-dark-border
              shadow-xl rounded-[10px] p-[6px]
              w-[200px] z-50 gap-[2px]
            `}
            onMouseEnter={() => handleMouseEnterSubmenu("data_control")}
            onMouseLeave={() => handleMouseLeaveSubmenu("data_control")}
          >
            {navigation_dataoptions.map((sub_menu, key_index) => (
              <div
                key={key_index}
                className={`px-2 py-2 rounded-lg hover:bg-gray-300 cursor-pointer 
                flex flex-row items-center gap-[2px]
                ${
                  subnavSelected === sub_menu.label
                    ? "bg-icon-sub_selected text-icon-sub_navigation_text"
                    : null
                } `}
                onClick={() => {
                  navigate(sub_menu.path);
                }}
              >
                <div className="w-5 h-5 text-icon-bg dark:text-icon_dark-bg">
                  {sub_menu.icon}
                </div>
                <div className="nav-block-name text-icon-seleceted_text dark:text-icon_dark-bg">
                  {sub_menu.label}
                </div>
              </div>
            ))}
          </div>
        )} */}

        {/* Bottom Navigation */}
        <div className="relative bottom-0">
          <div
            key={navigation_bottom_icon.settings.label}
            className={`nav-icon-box`}
          >
            {/* Theme Icon */}
            <div
              className={`h-[50px] flex flex-row 
                ${
                  isExpanded
                    ? "justify-start items-center pl-3 pr-3 nav-block-expand hover:bg-gray-300"
                    : " justify-center items-center nav-block-shrink"
                }
              `}
              onClick={() => {
                setThemeMode(!ThemeMode);
              }}
            >
              <div
                className={`${
                  isExpanded ? null : "hover:bg-gray-300 p-2 rounded-lg"
                }  transition`}
              >
                <div className="nav-icon-box w-5 h-5 text-icon-bg dark:text-icon_dark-bg">
                  {ThemeMode
                    ? navigation_bottom_icon.dark_theme.icon
                    : navigation_bottom_icon.light_theme.icon}
                </div>
              </div>

              {isExpanded && (
                <div className="nav-block-name ml-3 text-icon-seleceted_text dark:text-icon_dark-bg">
                  {ThemeMode
                    ? navigation_bottom_icon.dark_theme.label
                    : navigation_bottom_icon.light_theme.label}
                </div>
              )}
            </div>

            {/* Setting Icon */}
            <div
              className={`
                h-[50px] flex flex-row
                ${
                  isExpanded
                    ? "justify-start items-center pl-3 pr-3 nav-block-expand"
                    : "justify-center items-center nav-block-shrink"
                }
                
                ${
                  navsel === navigation_bottom_icon.settings.label
                    ? isExpanded
                      ? "bg-icon-seleceted border-r-[4px] border-r-icon-bg"
                      : "bg-icon-seleceted border-b-[4px] border-b-icon-bg"
                    : "hover:bg-gray-300"
                }
              `}
              onClick={() => {
                navigate(navigation_bottom_icon.settings.path);
              }}
            >
              <div>
                <div
                  className={`nav-icon-box w-5 h-5 text-icon-bg dark:text-icon_dark-bg`}
                >
                  {navigation_bottom_icon.settings.icon}
                </div>
              </div>

              {isExpanded && (
                <div className="nav-block-name text-icon-seleceted_text dark:text-icon_dark-bg">
                  {navigation_bottom_icon.settings.label}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default NavigationItems;
