import { useNavigate,useLocation  } from "react-router-dom";
export default function Dropdown({ isExpanded, options, value, onChange }) {
    const navigate =useNavigate();
    const location = useLocation();
    const path = location.pathname;
  // console.log(path);

  return (
    <div className="dropdown-nav nav-cont flex-box-col cent-box-ver clean-ex-pad">
      {options.map((opt, i) => (
        <div className={`${isExpanded ? "nav-block-expand" : "nav-block-shrink"} ${path==='/'+opt.value? "link-active-dropdown" : ""} nav-block flex-box-row cent-box-ver clean-ex-pad`} key={opt.value} onClick={() => (onChange(opt.value),navigate(opt.nav))}>
        <div className="nav-icon-box flex-box-row cent-box">
          {opt.icon}
          </div>
        <p className="nav-block-name">{opt.label}</p>
                <div className="nav-mark"></div>

        </div>
      ))}
      <div className="dropdown-line"></div>
    </div>
  );
}
