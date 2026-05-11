import { useState, useRef, useEffect } from "react";
import { ChevronDown, LayoutList } from "lucide-react";

const PAGE_SIZE_OPTIONS = [0, 1, 2, 5, 10, 20, 50];

export function PageSizeSelector({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`
          group flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium
          border transition-all duration-200
          bg-light-card1 dark:bg-dark-card1
          text-gray-500 dark:text-gray-400
          ${
            open
              ? "border-button-primary shadow-[0_0_0_3px_rgba(var(--button-primary-rgb),0.12)]"
              : "border-light-border dark:border-dark-border hover:border-button-primary hover:text-gray-700 dark:hover:text-gray-200"
          }
        `}
      >
        {/* Icon */}
        <LayoutList
          size={13}
          className={`transition-colors ${open ? "text-button-primary" : "text-gray-400 group-hover:text-button-primary"}`}
        />

        {/* Label */}
        <span>
          <span
            className={`transition-colors ${open ? "text-button-primary" : ""}`}
          >
            {value}
          </span>
          <span className="text-gray-400 ml-1">/ page</span>
        </span>

        {/* Chevron */}
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 text-gray-400 ${open ? "rotate-180 text-button-primary" : "group-hover:text-button-primary"}`}
        />
      </button>

      {/* Dropdown Panel */}
      <div
        className={`
          absolute bottom-full left-0 mb-2 w-36 z-50
          bg-light-card1 dark:bg-dark-card1
          border border-light-border dark:border-dark-border
          rounded-xl shadow-lg overflow-hidden
          transition-all duration-200 origin-bottom
          ${open ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 translate-y-1 pointer-events-none"}
        `}
      >
        {/* Header */}
        <div className="px-3 py-2 border-b border-light-border dark:border-dark-border">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Rows per page
          </span>
        </div>

        {/* Options */}
        <div className="p-1">
          {PAGE_SIZE_OPTIONS.map((size) => {
            const isSelected = value === size;
            return (
              <button
                key={size}
                onClick={() => {
                  onChange(size);
                  setOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between px-3 py-1.5 rounded-lg
                  text-xs font-medium transition-all duration-150
                  ${
                    isSelected
                      ? "bg-button-primary/10 text-button-primary"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200"
                  }
                `}
              >
                <span>{size} rows</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-button-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
