import { useEffect, useState } from "react";
export default function DesignDropdown({ options,changestoreelement,onMouseEnter,onMouseLeave }) {
  return (
    <div
      className="design-dropdown flex-box-col clean-ex-pad"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}>
      {options.map((opt) => (
        <div
          key={opt.type}
          className="design-dropdown-bar flex-box-row cent-box-ver clean-ex-pad"
          onClick={() => changestoreelement(opt.type)}>
          <span>{opt.icon}</span>
          <span>{opt.label}</span>
        </div>
      ))}
    </div>
  );
}
