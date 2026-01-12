import { data_control_icon } from "../Utils/img_render";
import { Data_Management_Label } from "../Utils/label_render";
import CustomButton from "./CustomButton";
import CustomImage from "./CustomImage";

const HistorySortPanel = ({ sort, setSort }) => {
  const updateSort = (field) => {
    setSort((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className="flex flex-col text-sm">
      <div className="font-semibold mb-[8px] text-light-text dark:text-dark-text">
        {Data_Management_Label.Sort_files.label}
      </div>
      {Data_Management_Label.sort_labels.map((item) => (
        <div
          key={item.key}
          className={`flex flex-row justify-between items-center
            rounded-md 
          hover:bg-icon-50 hover:dark:bg-icon_dark-200
          
          ${
            sort.field === item.key ? "bg-icon-100 dark:bg-icon_dark-100" : null
          }
          `}
          onClick={() => updateSort(item.key)}
        >
          <CustomButton
            key={item.key}
            btn_bg_color="px-2 py-2 rounded-md"
            label={`${item.label}`}
            textColor="text-light-text1 dark:text-dark-text1"
          />
          <CustomImage
            width="24px"
            height="24px"
            frameClassNmae="h-full flex flex-end mr-[5px]"
            imgClassName="text-light-text1 dark:text-dark-text1"
            src={
              sort.field === item.key &&
              (sort.order === "asc"
                ? data_control_icon.up_arrow.icon
                : data_control_icon.down_arrow.icon)
            }
          />
        </div>
      ))}
    </div>
  );
};

export default HistorySortPanel;
