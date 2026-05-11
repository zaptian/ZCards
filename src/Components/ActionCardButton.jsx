import React from "react";

function ActionCardButton({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        group
        min-w-[180px] min-h-[128px]
        flex flex-col items-center justify-center
        m-1
        bg-light-card1 dark:bg-dark-card1
        border border-light-border dark:border-dark-border
        rounded-[10px]
        overflow-hidden
        hover:ring-2 hover:ring-icon-500/40
        transition-colors
      "
    >
      <Icon
        strokeWidth={1.5}
        className="
          w-[64px] h-[64px]
          text-icon-600 dark:text-icon_dark-300
          transition-transform
          group-hover:scale-125
        "
      />

      <span
        title={label}
        className="mt-2 text-sm font-medium bg-light-card2 dark:bg-dark-card2 px-[4px] rounded-md text-icon-600 dark:text-icon_dark-300"
      >
        {label}
      </span>
    </button>
  );
}

export default ActionCardButton;
