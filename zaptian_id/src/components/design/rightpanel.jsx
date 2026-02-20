import { useRef, useState,useEffect } from "react";

export default function RightDesignPanel({setrightpanelwidth}) {
  const panelWidth = useRef(230);
  const panelRef = useRef(null);

const startResizing=(e) => {
    e.preventDefault();
    const startX=e.clientX;
    const startWidth=panelWidth.current;
    const onMouseMove=(e) => {
      const diff=startX-e.clientX; 
      let newWidth=startWidth+diff; 
      if (newWidth<225) newWidth=225;
      if (newWidth>300) newWidth=300;
      panelWidth.current=newWidth;
    panelRef.current.style.width = newWidth + "px";
   };
    const onMouseUp = () => {
        setrightpanelwidth(prev =>
        prev === panelWidth.current ? prev : panelWidth.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };
useEffect(() => {
      if (!panelRef.current)return;
      panelRef.current.style.width=panelWidth.current + "px";
}, []);
  return (
    <div
      ref={panelRef}
      id="design_right_panel"
      className="clean-ex-pad flex-box-row"
            onWheel={(e) => e.stopPropagation()}

      >
      <div className="panel-resizer"
        onMouseDown={startResizing}
           style={{
          left: 0,
        }}
      ></div>
      <div id="design_right_panel_content">


      </div>
    </div>
  );
}
