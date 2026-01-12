import { Data_Management_Label } from "../Utils/label_render";
import CustomInput from "./CustomInput";
import CustomLabel from "./CustomLabel";

const HistoryFilterPanel = ({ filters, setFilters }) => {
  
  return (
    <div className="flex flex-col gap-4 text-sm">
      <CustomLabel
        label_style={`font-semibold text-light-text dark:text-dark-text`}
        label_text={Data_Management_Label.filter_labels.filter_files}
      />

      {/* File Name */}
      <div className="flex flex-col gap-1 ">
        <CustomLabel
          label_style={`text-xs text-light-label1 dark:text-dark-label1`}
          label_text={Data_Management_Label.filter_labels.file_name}
        />
        <CustomInput
          type="text"
          input_placeholder="file name"
          search_text={filters.name}
          onChange_Access={(e) =>
            setFilters((prev) => ({ ...prev, name: e.target.value }))
          }
          input_classname="w-full h-[32px] px-2 py-2 rounded-md 
          bg-input-light-background dark:bg-input-dark-background 
          border-[1px] border-input-light-border dark:border-input-dark-border
          text-input-light-text dark:text-input-dark-text
          placeholder:input-light-placeholder dark:placeholder:input-light-placeholder
          focus:outline-none focus:ring-2 focus:input-light-border_focus"
        />
      </div>

      {/* File Type */}
      <div className="flex flex-col gap-1">
        <CustomLabel
          label_style={`text-xs text-light-label1 dark:text-dark-label1`}
          label_text={Data_Management_Label.filter_labels.file_type}
        />
        <CustomInput
          type="text"
          input_placeholder="file type"
          search_text={filters.type}
          onChange_Access={(e) =>
            setFilters((prev) => ({ ...prev, type: e.target.value }))
          }
          input_classname="w-full h-[32px] px-2 py-2 rounded-md 
          bg-input-light-background dark:bg-input-dark-background 
          border-[1px] border-input-light-border dark:border-input-dark-border
          text-input-light-text dark:text-input-dark-text
          placeholder:input-light-placeholder dark:placeholder:input-light-placeholder
          focus:outline-none focus:ring-2 focus:input-light-border_focus"
        />
      </div>

      {/* Date */}
      <div className="flex flex-col gap-1">
        <CustomLabel
          label_style={`text-xs text-light-label1 dark:text-dark-label1`}
          label_text={Data_Management_Label.filter_labels.modified_date}
        />

        <CustomInput
          type="date"
          search_text={filters.date}
          onChange_Access={(e) =>
            setFilters((prev) => ({ ...prev, date: e.target.value }))
          }
          input_classname="w-full h-[32px] px-2 py-2 rounded-md 
          bg-input-light-background dark:bg-input-light-background 
          border-[1px] border-input-light-border dark:border-input-dark-border
          text-input-light-text dark:text-input-light-text
          placeholder:input-light-placeholder dark:placeholder:input-light-placeholder
          focus:outline-none focus:ring-2 focus:input-light-border_focus"
        />
      </div>
    </div>
  );
};

export default HistoryFilterPanel;
