import { useState, useRef } from "react";
import DesignDropdown from "./designdropdown.jsx";
import {CARD_DEFS} from "./cardpreview.jsx";
import { CARD_OPTIONS,SHAPE_OPTIONS,QR_OPTIONS } from "./elementoptions.jsx";
export default function BottomDesignPanel({ element_selector_options,setElement_selector_options,create_element_select,setCreate_element_select,template,setTemplate }) {
  const [active, setActive] = useState(null);
  const closeTimer = useRef(null);
  const open = (key) => {
    clearTimeout(closeTimer.current);
    setActive(key);
  };

  const closeWithDelay = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setActive(null);
    }, 200);
  };

const changestoreelement= async  (type,value)=>{
  if (type === "card") {
    const layout = CARD_DEFS[value];
    if (!layout) return;
    const card = template.card;
    card.layout =value;
    card.widthmm=layout.widthmm;
    card.widthmm=layout.widthmm;
    card.cornerradiusmm=layout.cornerradiusmm;
    await window.project_file.writejson(
      await window.electronStore.get("recentdesign"),
      template
    );
  }
  setElement_selector_options(prev=>{
    const updated={ ...prev,[type]:value};
    window.electronStore.set("recentelementoptions",updated);
    return updated;
  });
};
const changeelementselect=(element)=>{
  setCreate_element_select(element); 
};
const TYPE_ICON_MAP = {
  RECT: "⬛",
  CIRCLE: "⚪",
  LINE: "➖",
  QR_TEXT: "🔳",
  QR_URL: "🌐",
  BARCODE: "📊",
  CR80: "💳",
  CR90: "🪪",
  CR100: "🧾",
  MINI_ID: "🏷️",
  BUSINESS_CARD: "📇",
  EU_ID: "🇪🇺",
  A7: "📄",
  CUSTOM: "⚙️"
};

  return (
    <div className="clean-ex-pad flex-box-row" id="design_bottom_panel">

      <div
        className={`elements-selector-box ${!create_element_select ? "element-active" : ""} `}        onMouseEnter={() => open("card")}
        onMouseLeave={closeWithDelay}
        style={{ borderRadius: "10px 0 0 10px" }}
        onClick={()=>setCreate_element_select(null)}>
        {/* {TYPE_ICON_MAP[element_selector_options.card]} */}
        🖐️
        {active === "card" && (
          <DesignDropdown
            options={CARD_OPTIONS}
            onMouseEnter={() => open("card")}
            onMouseLeave={closeWithDelay}
            changestoreelement={(type)=>changestoreelement("card",type)}
            
          />
        )}
      </div>

      <div className={`elements-selector-box ${create_element_select==="text" ? "element-active" : ""} `}
       onClick={()=>changeelementselect("text")} >
        {element_selector_options.text}</div>
      <div className={`elements-selector-box ${create_element_select==="input" ? "element-active" : ""} `}
      onClick={()=>changeelementselect("input")}>
        {element_selector_options.input}</div>
      <div className={`elements-selector-box ${create_element_select==="img" ? "element-active" : ""} `}
      onClick={()=>changeelementselect("img")}>
        {element_selector_options.img}</div>

      <div
        className={`elements-selector-box ${create_element_select==="shape" ? "element-active" : ""} `}
        onMouseEnter={() => open("shape")}
        onMouseLeave={closeWithDelay}
        onClick={()=>changeelementselect("shape")}>
        {TYPE_ICON_MAP[element_selector_options.shape]}
        {active === "shape" && (
          <DesignDropdown
            options={SHAPE_OPTIONS}
            onMouseEnter={() => open("shape")}
            onMouseLeave={closeWithDelay}
            changestoreelement={(type)=>changestoreelement("shape",type)}

          />
        )}
      </div>

      <div
        className={`elements-selector-box ${create_element_select==="qr" ? "element-active" : ""} `}
        onMouseEnter={() => open("qr")}
        onMouseLeave={closeWithDelay}
        style={{ borderRadius: "0 10px 10px 0" }}
        onClick={()=>changeelementselect("qr")}>
        {TYPE_ICON_MAP[element_selector_options.qr]}
        {active === "qr" && (
          <DesignDropdown
            options={QR_OPTIONS}
            onMouseEnter={() => open("qr")}
            onMouseLeave={closeWithDelay}
            changestoreelement={(type)=>changestoreelement("qr",type)}

          />
        )}
      </div>
    </div>
  );
}
