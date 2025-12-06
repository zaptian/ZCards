import { useNavigate } from "react-router-dom";

const CustomDropDown = ({ isExpanded, options, value, onChange }) => {
  const navigate = useNavigate();

  return (
    <div className="dropdown-nav nav-cont flex-box-col cent-box-ver clean-ex-pad">
      {options.map((opt) => (
        <div
          className={`${isExpanded ? "nav-block-expand" : "nav-block-shrink"} ${
            value === opt.value ? "link-active-dropdown" : ""
          } nav-block flex-box-row cent-box-ver clean-ex-pad`}
          key={opt.value}
          onClick={() => (onChange(opt.value), navigate(opt.nav))}
        >
          <div className="nav-icon-box flex-box-row cent-box">{opt.icon}</div>
          <p className="nav-block-name">{opt.label}</p>
          <div className="nav-mark"></div>
        </div>
      ))}
      <div className="dropdown-line"></div>
    </div>
  );
};

export default CustomDropDown;
