import CustomButton from "./CustomButton";
import { data_control_icon } from "../Utils/img_render";
import { useNavigate } from "react-router-dom";

const HistoryMenuPanel = ({ file_id, onReloadShow }) => {
  const navigate = useNavigate();

  async function handleDelete(fileId) {
    const c_result = await window.DataDashBoard_API.singleMoveToTrash(fileId);

    if (c_result.status) {
      await onReloadShow();
    } else {
      console.error(
        `[DataDashBoard:handleDeleteSelected()] : ${c_result.error}`,
      );
    }
  }

  async function handleOpenFile(fileId) {
    const c_result = await window.DataDashBoard_API.recentAdd(fileId);

    if (c_result.status) {
      const c_resultData = await window.DataDashBoard_API.recentList();
      if (c_resultData.status) {
        await onReloadShow();
        navigate(`/data/edit/${fileId}`);
      } else {
        throw new Error(c_resultData.error);
      }
    } else {
      console.error(`[DataDashBoard:handleOpenFile()] : ${c_result.error}`);
    }
  }

  return (
    <div className="flex flex-col gap-[4px] ">
      <CustomButton
        btn_bg_color=" w-full rounded-md p-[6px] gap-3
          bg-light-card dark:bg-dark-card
          text-light-text1 dark:text-dark-text1
          hover:text-button-primary-text hover:dark:text-button-primary-text
          hover:bg-button-primary hover:dark:bg-button-primary
          "
        label={data_control_icon.open_file.label}
        iconSize={`w-[24px] h-[24px] `}
        iconSrc={data_control_icon.open_file.icon}
        onClick={async () => {
          await handleOpenFile(file_id);
        }}
      />

      <CustomButton
        btn_bg_color="w-full rounded-md p-[6px] gap-3
          bg-button-danger
          text-button-danger-text
          hover:bg-button-danger-hover"
        label={data_control_icon.trash.label}
        iconSize={`w-[24px] h-[24px] `}
        iconSrc={data_control_icon.trash.icon}
        onClick={async () => {
          await handleDelete(file_id);
        }}
      />
    </div>
  );
};

export default HistoryMenuPanel;
