import { useState, useRef, useEffect } from "react";
import CustomSelect from "@/Components/CustomSelect";
import {
  preview_layout_select,
  preview_layout_type,
} from "@/Utils/preview_card_options";
import PreviewBackground from "@/Components/PreviewBackground";
import CustomButton from "@/Components/CustomButton";
import { new_design_img } from "@/Utils/img_render";
import CutsomLabel from "@/Components/CutsomLabel";
import CustomImage from "@/Components/CustomImage";
import CustomInput from "@/Components/CustomInput";

function zoom_in_control(value, option, type) {
  const mode =
    type === option.zoom_in_control.portrait.type
      ? option.zoom_in_control.portrait
      : option.zoom_in_control.landscape;

  if (value >= mode.max_range) {
    return value;
  }

  return value + mode.increment_value;
}

function zoom_out_control(value, range, decrement) {
  if (value <= range) {
    return value;
  } else {
    return value - decrement;
  }
}

const NewDesigner = () => {
  const [zoom, setZoom] = useState(1); // default 10%
  const [selectedLayout, setSelectedLayout] = useState(
    preview_layout_select[0]
  );
  const [selectedOrientation, setSelectedOrientation] = useState(
    preview_layout_type[0]
  );
  const [toolsOpen, setToolsOpen] = useState(true);
  const containerRef = useRef(null);

  let CARD_WIDTH =
    selectedOrientation.value === "Portrait"
      ? selectedLayout.portrait.width
      : selectedLayout.landscape.width;
  let CARD_HEIGHT =
    selectedOrientation.value === "Portrait"
      ? selectedLayout.portrait.height
      : selectedLayout.landscape.height;

  const fitToWidth = () => {
    const wrapperWidth = containerRef.current?.clientWidth;
    if (!wrapperWidth) return;

    const scale = wrapperWidth / CARD_WIDTH;
    console.log("Fit To Width Scale:", scale);
    setZoom(scale);
  };

  const fitToHeight = () => {
    const wrapperHeight = containerRef.current?.clientHeight;
    if (!wrapperHeight) return;

    const scale = wrapperHeight / CARD_HEIGHT;
    console.log("Fit To Height Scale:", scale);
    setZoom(scale);
  };
  useEffect(() => {
    setZoom(selectedLayout.default_zoom_range);

    CARD_WIDTH =
      selectedOrientation.value === "Portrait"
        ? selectedLayout.portrait.width
        : selectedLayout.landscape.width;

    CARD_HEIGHT =
      selectedOrientation.value === "Portrait"
        ? selectedLayout.portrait.height
        : selectedLayout.landscape.height;
  }, [selectedLayout, selectedOrientation]);

  return (
    <div className="flex flex-1 w-full h-full">
      {/* Code Panel */}
      <div className="flex-[6] bg-light-bg dark:bg-dark-bg border-r-[1px] border-gray-300 dark:border-gray-500 relative">
        <div className="w-full h-full bg-black"></div>
        {/* Tools Menu */}
        {toolsOpen ? (
          <div className="w-[250px] h-fit absolute top-[20px] right-[10px]  bg-white border-gray-200 border-[2px] shadow-2xl py-2 px-2 flex flex-col gap-[10px] rounded-[10px]">
            {/* Tools Heading */}
            <div
              className="font-semibold text-[12px] w-fit px-2 py-[2px]
                bg-gray-200 dark:bg-gray-700 
                text-gray-800 dark:text-gray-100
                rounded-sm"
            >
              Edit Tools
            </div>

            {/* Layout Select */}
            <div className=" flex flex-row gap-[10px]">
              <CustomImage
                src={new_design_img.layout.icon}
                width={`${new_design_img.layout.width}px`}
                height={`${new_design_img.layout.height}px`}
                frameClassNmae={`bg-white min-w-[40px] min-h-[40px] flex justify-center items-center rounded-[10px] border-gray-300 border-[1px]`}
                alt={`${new_design_img.layout.name}`}
              />
              <CustomSelect
                options={preview_layout_select}
                placeholder="Select Layout"
                onChange={(option) => {
                  setSelectedLayout(option);
                }}
                value={selectedLayout}
              />
            </div>

            <div
              className="font-semibold text-[12px] w-fit px-2 py-[2px]
                bg-gray-200 dark:bg-gray-700 
                text-gray-800 dark:text-gray-100
                rounded-sm"
            >
              Screen Orientation
            </div>

            {/* Orientation Select */}
            <div className="w-fit h-fit p-[5px] bg-gray-100 rounded-[5px] flex flex-row gap-[5px]">
              <CustomButton
                img_src={new_design_img.portrait.icon}
                img_style={{
                  width: new_design_img.portrait.width,
                  height: new_design_img.portrait.height,
                }}
                button_style={`min-w-[30px] min-h-[30px] p-2 rounded-[8px] border-[2px]
                  ${
                    selectedOrientation.value === "Portrait"
                      ? "bg-blue-100 text-blue-500 border-blue-300"
                      : "bg-white text-gray-700"
                  }
                `}
                onClick={() => setSelectedOrientation({ value: "Portrait" })}
              />

              <CustomButton
                img_src={new_design_img.landscape.icon}
                img_style={{
                  width: new_design_img.landscape.width,
                  height: new_design_img.landscape.height,
                }}
                button_style={`min-w-[30px] min-h-[30px] p-2 rounded-[8px] border-[2px]
                  ${
                    selectedOrientation.value === "Landscape"
                      ? "bg-blue-100 text-blue-500 border-blue-300"
                      : "bg-white text-gray-700"
                  }
                `}
                onClick={() => setSelectedOrientation({ value: "Landscape" })}
              />
            </div>

            {/* <CustomInput /> */}
          </div>
        ) : null}
      </div>
      {/* Inside Preview */}

      {/* Menu */}
      {/* <div className="h-12 px-4 flex items-center gap-2 border-b bg-white dark:bg-dark-bg">
              <button onClick={() => setZoom((z) => Math.max(0.1, z - 0.1))}>
                -
              </button>
              <span>{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom((z) => z + 0.1)}>+</button>

              <button onClick={() => setZoom(0.4)}>Reset</button>
              <button onClick={fitToWidth}>Fit Width</button>
              <button onClick={fitToHeight}>Fit Height</button>
            </div> */}
      {/* Preview Panel */}
      <div className="flex-[4] bg-light-bg dark:bg-dark-bg">
        {/* Preview Background */}
        <PreviewBackground>
          <div>
            {/* Open close Navigation */}
            <div className="absolute top-[20px] left-[20px]">
              <CustomButton
                img_src={
                  toolsOpen
                    ? new_design_img.open_tools.icon
                    : new_design_img.close_tools.icon
                }
                img_style={{
                  width: toolsOpen
                    ? new_design_img.open_tools.width
                    : new_design_img.close_tools.width,
                  height: toolsOpen
                    ? new_design_img.open_tools.height
                    : new_design_img.close_tools.height,
                }}
                button_style="p-2 bg-white rounded-[8px] text-black border-gray-200 border-[2px]"
                onClick={() => setToolsOpen(!toolsOpen)}
              />
            </div>
            {/* Zoom Panel */}
            <div className="absolute top-[20px] right-[20px] w-fit h-[35px] flex flex-row gap-[10px]">
              <div className="flex flex-row">
                <CustomButton
                  img_src={new_design_img.zoom_out.icon}
                  img_style={{
                    width: new_design_img.zoom_out.width,
                    height: new_design_img.zoom_out.height,
                  }}
                  button_style="p-2 bg-white text-black rounded-tl-[8px] rounded-bl-[8px] border-r-0  border-gray-200 border-[2px]"
                  onClick={() =>
                    setZoom((zoom_value) =>
                      zoom_out_control(
                        Number(zoom_value.toFixed(1)),
                        selectedLayout.zoom_out_control.min_range,
                        selectedLayout.zoom_out_control.decrement_value
                      )
                    )
                  }
                />
                {/* <div className="w-[2px] h-full bg-light-text "></div> */}
                <CustomButton
                  img_src={new_design_img.zoom_in.icon}
                  img_style={{
                    width: new_design_img.zoom_out.width,
                    height: new_design_img.zoom_out.height,
                  }}
                  button_style="p-2 bg-white rounded-tr-[8px] rounded-br-[8px] text-black border-l-0  border-gray-200 border-[2px]"
                  onClick={() =>
                    setZoom((zoom_value) =>
                      zoom_in_control(
                        Number(zoom_value.toFixed(1)),
                        selectedLayout,
                        selectedOrientation.type
                      )
                    )
                  }
                />
              </div>
              <CutsomLabel
                label_text={`${Number(Number(zoom.toFixed(1)) * 100).toFixed(
                  0
                )}%`}
                label_style={`w-[80px] text-[20px] p-2 bg-white text-black rounded-[8px] flex justify-center items-center border-gray-200 border-[2px] font-semibold shadow-lg`}
              />
            </div>
          </div>

          {/* ID Card Panel */}
          <div ref={containerRef}>
            <div style={{ transform: `scale(${zoom})` }}>
              {/* <div
                className="bg-white flex justify-center items-center"
                style={{
                  width: `${CARD_WIDTH}mm`,
                  height: `25px`,
                }}
              >
                <div className="w-[44px] h-[12px] rounded-lg bg-gradient-to-r from-gray-500 to-gray-700 flex items-center justify-center">
                  <div className="w-[36px] h-[6px] rounded bg-gradient-to-r from-gray-300 to-gray-500"></div>
                </div>
              </div> */}

              <div
                className="flex" // shadow-[0_0_15px_rgba(200,200,200,0.4),0_0_30px_rgba(200,200,200,0.3),0_0_45px_rgba(200,200,200,0.2)]"
                style={{
                  width: `${CARD_WIDTH}mm`,
                  height: `${CARD_HEIGHT}mm`,
                }}
              >
                <div className="flex-grow bg-gray-900 dark:bg-light-bg "></div>
              </div>
            </div>
          </div>
        </PreviewBackground>
      </div>
    </div>
  );
};

export default NewDesigner;
