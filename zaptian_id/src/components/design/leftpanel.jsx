import { useRef, useState,useEffect } from "react";

export default function LeftDesignPanel({setleftpanelwidth,template,setTemplate,activeside,setActiveside
  ,pushhistory}) {
  const panelWidth= useRef(230);
  const [showFront,setShowFront] = useState(true);
  const [showBack,setShowBack] = useState(true);
  const panelRef=useRef(null);
  const card=template.card;
  const elementsId=template?.elementsId ?? [];
  const elements=template?.elements ?? {};
  const draggingId = useRef(null);
  const dragOverId = useRef(null);
  const dragPosition = useRef(null);
  const draggingY=useRef(null);
  const [, forceUpdate] = useState(0);
  const scrollContainerRef = useRef(null);
const scrollDirRef = useRef(null);
const scrollRafRef = useRef(null);


  const startResizing=(e) => {
    e.preventDefault();
    const startX=e.clientX;
    const startWidth=panelWidth.current;
    const onMouseMove=(e) => {
      const diff=e.clientX-startX; 
      let newWidth=startWidth+diff; 
      if (newWidth<200) newWidth=200;
      if (newWidth>300) newWidth=300;
      panelWidth.current=newWidth;
    panelRef.current.style.width = newWidth + "px";
    };
    const onMouseUp = () => {
      setleftpanelwidth(prev=>(prev==panelWidth.current ? prev:panelWidth.current));
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
    const handleMouseEnter = (element) => {
  // setHoveredId(prev => (prev === element.id ? prev : element.id));
};

  const handleMouseLeave = () => {
    // setHoveredId(null);
  };
  function togglecard(side){
    if(side!=activeside){
      // setSelectedId(null);
      setActiveside(side);
    }
  }
function toggleVisibility(id) {
  pushhistory();
  setTemplate(prev => ({
    ...prev,
    elements: {
      ...prev.elements,[id]:{
        ...prev.elements[id],
        visible:!prev.elements[id].visible
      }
    }
  }));
}
function toggleLock(id) {
  pushhistory();
  setTemplate(prev => ({
    ...prev,
    elements: {
      ...prev.elements,[id]:{
        ...prev.elements[id],
        locked:!prev.elements[id].locked
      }
    }
  }));
}
const cleardrag = () => {
  if (!draggingId.current) return;
  draggingId.current = null;
  dragOverId.current = null;
  dragPosition.current = null;
  stopAutoScroll();
  forceUpdate(v => v + 1);

};


function moveElement(dragId, targetId, position) {
  if (!dragId || !targetId || dragId === targetId) return;
  pushhistory();
  setTemplate(prev => {
    const arr = [...prev.elementsId];
    const from = arr.indexOf(dragId);
    const to = arr.indexOf(targetId);
    if (from === -1 || to === -1) return prev;
    const [item] = arr.splice(from, 1);
    let insertIndex = position === "before" ? to : to + 1;
    if (from < insertIndex) insertIndex--;
    arr.splice(insertIndex, 0, item);
    return {
      ...prev,
      elementsId: arr,
    };
  });
}
const startAutoScroll = () => {
  if (scrollRafRef.current) return;

  const step = () => {
    const container = scrollContainerRef.current;
    if (!container || !scrollDirRef.current) {
      scrollRafRef.current = null;
      return;
    }
    const speed = 6;
    if (scrollDirRef.current === "down") {
      container.scrollTop += speed;
    } else if (scrollDirRef.current === "up") {
      container.scrollTop -= speed;
    }

    scrollRafRef.current = requestAnimationFrame(step);
  };

  scrollRafRef.current = requestAnimationFrame(step);
};

const stopAutoScroll = () => {
  scrollDirRef.current = null;
  if (scrollRafRef.current) {
    cancelAnimationFrame(scrollRafRef.current);
    scrollRafRef.current = null;
  }
};



  return (
    <div
      ref={panelRef}
      id="design_left_panel"
      className="clean-ex-pad flex-box-row"
      onWheel={(e) => e.stopPropagation()}

    >
      <div id="design_left_panel_content"className="full-box flex-box-col clean-ex-pad"  onMouseLeave={cleardrag} >
        <div className="left-panel-heading"> <span className="heading-text" >Layer</span> </div>
        <div className="layer-elements flex-box-col clean-ex-pad"   ref={scrollContainerRef}
>

      <div id="front_elements" className="flex-box-col clean-ex-pad">
        <div className="card-sub-topic flex-box-row cent-box-ver" onClick={()=>togglecard("front")} >
          <div className="caret-icon-div flex-box-row cent-box" 
          style={{transform:showFront ?  "rotate(180deg)" : "rotate(0deg)" }} 

          onClick={(e) => {
            e.stopPropagation();
            setShowFront(prev => !prev); 
            }} >
          <svg width="10" height="6" viewBox="0 0 100 61" fill="currentColor" className="caret-icon" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.2571 2.0122C17.6552 2.34898 18.0359 2.68558 18.4135 3.04346C18.5218 3.1448 18.63 3.24615 18.7415 3.35056C20.1349 4.66397 21.4848 6.02176 22.8364 7.37786C23.1326 7.67429 23.4289 7.97068 23.7251 8.26702C24.5215 9.06384 25.3172 9.86126 26.1129 10.6588C26.9474 11.4951 27.7825 12.3308 28.6175 13.1666C30.1951 14.7458 31.7722 16.3256 33.3492 17.9055C35.146 19.7056 36.9433 21.5052 38.7408 23.3048C42.4349 27.0034 46.1284 30.7027 49.8214 34.4024C50.3621 34.1551 50.7603 33.9016 51.1792 33.4804C51.2882 33.3717 51.3972 33.2631 51.5096 33.1511C51.6274 33.0317 51.7451 32.9123 51.8665 32.7892C51.9932 32.6624 52.1199 32.5355 52.2504 32.4048C52.6756 31.9787 53.0993 31.5512 53.523 31.1237C53.8272 30.8182 54.1316 30.5128 54.436 30.2075C55.0919 29.5492 55.7473 28.8903 56.4022 28.231C57.4387 27.1876 58.4767 26.1459 59.515 25.1045C60.9715 23.6433 62.4275 22.1816 63.8829 20.7194C63.9753 20.6266 64.0676 20.5338 64.1628 20.4382C65.1918 19.4043 66.2207 18.3702 67.2495 17.3359C67.6219 16.9615 67.9943 16.5871 68.3667 16.2127C68.4585 16.1203 68.5504 16.0279 68.6451 15.9328C70.1808 14.3889 71.7176 12.8462 73.2553 11.3044C74.2866 10.2702 75.3166 9.23458 76.3455 8.19797C76.9877 7.55166 77.6311 6.90658 78.2748 6.26183C78.5719 5.9637 78.8686 5.66506 79.1647 5.36587C82.083 2.4182 84.8532 0.114786 89.174 0C92.1739 0.058477 94.8194 1.06645 97.0111 3.15091C99.3943 5.73626 100.063 8.49786 99.9955 11.9215C99.8218 15.9325 97.0508 18.5876 94.3717 21.2653C94.2139 21.4238 94.0561 21.5823 93.8936 21.7455C93.3705 22.2706 92.8467 22.7951 92.3229 23.3195C91.9453 23.6981 91.5679 24.0769 91.1905 24.4556C90.1693 25.4801 89.1474 26.5038 88.1254 27.5274C87.4862 28.1675 86.8472 28.8077 86.2083 29.4479C84.436 31.2238 82.6634 32.9995 80.8903 34.7745C80.7771 34.8877 80.664 35.001 80.5474 35.1177C80.434 35.2312 80.3206 35.3447 80.2038 35.4617C79.974 35.6917 79.7443 35.9216 79.5145 36.1516C79.4005 36.2657 79.2866 36.3798 79.1692 36.4973C77.321 38.3475 75.4741 40.1989 73.6278 42.051C71.7281 43.9565 69.8274 45.861 67.9255 47.7643C66.8593 48.8314 65.7935 49.8989 64.729 50.9677C63.8232 51.8771 62.9163 52.7855 62.0082 53.6926C61.5455 54.1548 61.0835 54.6176 60.6225 55.0814C60.1212 55.5855 59.6182 56.0877 59.1147 56.5895C58.8996 56.807 58.8997 56.807 58.6803 57.0289C56.2288 59.459 53.5144 60.9084 50.0408 61C47.1925 60.9446 44.5498 59.9648 42.4646 58.002C42.3581 57.9018 42.2515 57.8016 42.1417 57.6983C40.4844 56.1286 38.8757 54.5079 37.2604 52.8953C36.8845 52.5206 36.5084 52.146 36.1324 51.7714C35.0124 50.6554 33.8933 49.5385 32.7744 48.4214C32.4577 48.1052 32.1409 47.789 31.8242 47.4729C29.8501 45.5025 27.8764 43.5317 25.9036 41.5601C25.4489 41.1057 24.9942 40.6512 24.5395 40.1968C24.37 40.0275 24.37 40.0275 24.1971 39.8547C22.3647 38.0236 20.5304 36.1946 18.6952 34.3663C16.8047 32.4829 14.916 30.5976 13.0291 28.7105C11.9722 27.6535 10.9145 26.5974 9.85466 25.5433C8.95288 24.6465 8.05281 23.7479 7.15486 22.8472C6.69773 22.3888 6.23964 21.9314 5.77984 21.4757C2.63236 18.3542 0.0571795 15.5491 0 10.8902C0.0290386 7.8816 0.98335 5.38455 3.02853 3.15854C6.91896 -0.549034 12.8232 -1.0508 17.2571 2.0122Z" />
        </svg>
          </div>
          <div className={`card-sub-topic-content flex-box-row cent-box-ver ${activeside==="front"?"card-sub-active":""} `} >
          Card Front 
          </div>
        </div>
        <div className="flex-box-col clean-ex-pad" >
          { showFront && [...elementsId]
            .filter(el=>elements[el].side==="front").reverse()
            .map(id => {
              const el = elements[id];
              const isDragOver =
              draggingId.current &&
              dragOverId.current === id;

            return(<div
                key={id}
                className="card-elements flex-box-row cent-box-ver"
                
                onMouseDown={() => (draggingId.current = id)}
                onMouseMove={(e) => {
                  if (!draggingId.current || elements[draggingId.current].side=="back") return;

                  const rect = e.currentTarget.getBoundingClientRect();
                  const nextPosition =
          e.clientY < rect.top + rect.height/ 2 ? "after" : "before";

        if (
          dragOverId.current !==id ||
          dragPosition.current !==nextPosition
        ) {
          dragOverId.current =id;
          dragPosition.current =nextPosition;
          forceUpdate(v=>v+1);
        }

                  const container = scrollContainerRef.current;
                  if (!container) return;

                  const containerRect = container.getBoundingClientRect();
                  const edgeThreshold = 40;
                  if (e.clientY > containerRect.bottom - edgeThreshold) {
                    if (scrollDirRef.current !== "down") {
                      scrollDirRef.current = "down";
                      startAutoScroll();
                    }
                  } else if (e.clientY < containerRect.top + edgeThreshold) {
                    if (scrollDirRef.current !== "up") {
                      scrollDirRef.current = "up";
                      startAutoScroll();
                    }
                  } else {
                    stopAutoScroll();
                  }

                }}

                onMouseUp={() => {
                  if (!draggingId.current) return;
                  moveElement(draggingId.current, dragOverId.current, dragPosition.current);
                  draggingId.current = null;
                  dragOverId.current = null;
                  dragPosition.current = null;
                  stopAutoScroll();

                }}

                onMouseEnter={()=> handleMouseEnter(el)}
                onMouseLeave={handleMouseLeave}
                onClick={() => {
                    if (draggingId.current) return;

                  if (el.side !== activeside) setActiveside(el.side);
                  // setSelectedId(id);
                }}>
                
              {isDragOver && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    height: "2px",
                    width:"calc(100% - 14px)",
                    marginLeft:"10px",
                    background: "#0a84ff",
                    top: dragPosition.current === "after" ? 0 : "100%",
                    transform: "translateY(-1px)",
                    pointerEvents: "none",
                  }}
                />
              )}


              <div className={`card-elements-content flex-box-row cent-box-ver
                 ${ false && selectedId && id===selectedId ?"card-elements-active":""} 
                  ${ false && hoveredId&& id===hoveredId ?"card-elements-hover":""}`}>
                    {el.type} 
                    <div className="flex-box-row clean-ex-pad">
                    <button className=" flex-box-row cent-box clean-ex-pad card-element-content-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLock(id);
                      }}>
                      {el.locked ? "🔒" : "🔓"}
                    </button>
                    <button className=" flex-box-row cent-box clean-ex-pad card-element-content-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleVisibility(id);
                    }}
                  >
                    {el.visible ? "👁️" : "🚫"}
                  </button> 
                  </div>

          </div>
              </div>
          );})}
        </div>
      </div>
      <div id="back_elements" className="flex-box-col clean-ex-pad">
        <div className="card-sub-topic flex-box-row cent-box-ver" onClick={()=>togglecard("back")} >
          <div className="caret-icon-div flex-box-row cent-box"
          style={{transform:showBack ? "rotate(180deg)" : "rotate(0deg)" }}
           
          onClick={(e) => {
            e.stopPropagation();
            setShowBack(prev => !prev); 
            }} >
          <svg width="10" height="6" viewBox="0 0 100 61" fill="currentColor" className="caret-icon" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.2571 2.0122C17.6552 2.34898 18.0359 2.68558 18.4135 3.04346C18.5218 3.1448 18.63 3.24615 18.7415 3.35056C20.1349 4.66397 21.4848 6.02176 22.8364 7.37786C23.1326 7.67429 23.4289 7.97068 23.7251 8.26702C24.5215 9.06384 25.3172 9.86126 26.1129 10.6588C26.9474 11.4951 27.7825 12.3308 28.6175 13.1666C30.1951 14.7458 31.7722 16.3256 33.3492 17.9055C35.146 19.7056 36.9433 21.5052 38.7408 23.3048C42.4349 27.0034 46.1284 30.7027 49.8214 34.4024C50.3621 34.1551 50.7603 33.9016 51.1792 33.4804C51.2882 33.3717 51.3972 33.2631 51.5096 33.1511C51.6274 33.0317 51.7451 32.9123 51.8665 32.7892C51.9932 32.6624 52.1199 32.5355 52.2504 32.4048C52.6756 31.9787 53.0993 31.5512 53.523 31.1237C53.8272 30.8182 54.1316 30.5128 54.436 30.2075C55.0919 29.5492 55.7473 28.8903 56.4022 28.231C57.4387 27.1876 58.4767 26.1459 59.515 25.1045C60.9715 23.6433 62.4275 22.1816 63.8829 20.7194C63.9753 20.6266 64.0676 20.5338 64.1628 20.4382C65.1918 19.4043 66.2207 18.3702 67.2495 17.3359C67.6219 16.9615 67.9943 16.5871 68.3667 16.2127C68.4585 16.1203 68.5504 16.0279 68.6451 15.9328C70.1808 14.3889 71.7176 12.8462 73.2553 11.3044C74.2866 10.2702 75.3166 9.23458 76.3455 8.19797C76.9877 7.55166 77.6311 6.90658 78.2748 6.26183C78.5719 5.9637 78.8686 5.66506 79.1647 5.36587C82.083 2.4182 84.8532 0.114786 89.174 0C92.1739 0.058477 94.8194 1.06645 97.0111 3.15091C99.3943 5.73626 100.063 8.49786 99.9955 11.9215C99.8218 15.9325 97.0508 18.5876 94.3717 21.2653C94.2139 21.4238 94.0561 21.5823 93.8936 21.7455C93.3705 22.2706 92.8467 22.7951 92.3229 23.3195C91.9453 23.6981 91.5679 24.0769 91.1905 24.4556C90.1693 25.4801 89.1474 26.5038 88.1254 27.5274C87.4862 28.1675 86.8472 28.8077 86.2083 29.4479C84.436 31.2238 82.6634 32.9995 80.8903 34.7745C80.7771 34.8877 80.664 35.001 80.5474 35.1177C80.434 35.2312 80.3206 35.3447 80.2038 35.4617C79.974 35.6917 79.7443 35.9216 79.5145 36.1516C79.4005 36.2657 79.2866 36.3798 79.1692 36.4973C77.321 38.3475 75.4741 40.1989 73.6278 42.051C71.7281 43.9565 69.8274 45.861 67.9255 47.7643C66.8593 48.8314 65.7935 49.8989 64.729 50.9677C63.8232 51.8771 62.9163 52.7855 62.0082 53.6926C61.5455 54.1548 61.0835 54.6176 60.6225 55.0814C60.1212 55.5855 59.6182 56.0877 59.1147 56.5895C58.8996 56.807 58.8997 56.807 58.6803 57.0289C56.2288 59.459 53.5144 60.9084 50.0408 61C47.1925 60.9446 44.5498 59.9648 42.4646 58.002C42.3581 57.9018 42.2515 57.8016 42.1417 57.6983C40.4844 56.1286 38.8757 54.5079 37.2604 52.8953C36.8845 52.5206 36.5084 52.146 36.1324 51.7714C35.0124 50.6554 33.8933 49.5385 32.7744 48.4214C32.4577 48.1052 32.1409 47.789 31.8242 47.4729C29.8501 45.5025 27.8764 43.5317 25.9036 41.5601C25.4489 41.1057 24.9942 40.6512 24.5395 40.1968C24.37 40.0275 24.37 40.0275 24.1971 39.8547C22.3647 38.0236 20.5304 36.1946 18.6952 34.3663C16.8047 32.4829 14.916 30.5976 13.0291 28.7105C11.9722 27.6535 10.9145 26.5974 9.85466 25.5433C8.95288 24.6465 8.05281 23.7479 7.15486 22.8472C6.69773 22.3888 6.23964 21.9314 5.77984 21.4757C2.63236 18.3542 0.0571795 15.5491 0 10.8902C0.0290386 7.8816 0.98335 5.38455 3.02853 3.15854C6.91896 -0.549034 12.8232 -1.0508 17.2571 2.0122Z" />
        </svg>
          </div>
          <div className={`card-sub-topic-content flex-box-row cent-box-ver ${activeside==="back" ?"card-sub-active":""} `} >
          Card Back
          </div>
        </div>
        <div className="flex-box-col clean-ex-pad" >
          { showBack && [...elementsId]
            .filter(el=>elements[el].side==="back").reverse()
            .map(id => {
              const el = elements[id];
              const isDragOver =
    draggingId.current &&
    dragOverId.current === id;
              return(<div
                key={id}
                className="card-elements flex-box-row cent-box-ver"
                onMouseDown={() => (draggingId.current = id)}

                onMouseMove={(e) => {
                if (!draggingId.current || elements[draggingId.current].side=="front") return;
                const rect = e.currentTarget.getBoundingClientRect();
                const nextPosition =
                 e.clientY < rect.top + rect.height / 2 ? "after" : "before";

                if (
                  dragOverId.current !== id ||
                  dragPosition.current !== nextPosition
                ) {
                  dragOverId.current = id;
                  dragPosition.current = nextPosition;
                  forceUpdate(v => v + 1);
                }

                 const container = scrollContainerRef.current;
                  if (!container) return;

                  const containerRect = container.getBoundingClientRect();
                  const edgeThreshold = 40;
                  if (e.clientY > containerRect.bottom - edgeThreshold) {
                    if (scrollDirRef.current !== "down") {
                      scrollDirRef.current = "down";
                      startAutoScroll();
                    }
                  } else if (e.clientY < containerRect.top + edgeThreshold) {
                    if (scrollDirRef.current !== "up") {
                      scrollDirRef.current = "up";
                      startAutoScroll();
                    }
                  } else {
                    stopAutoScroll();
                  }
              }}


                onMouseUp={() => {
                  if (!draggingId.current) return;
                  moveElement(draggingId.current, dragOverId.current, dragPosition.current);
                  draggingId.current = null;
                  dragOverId.current = null;
                  dragPosition.current = null;
                                    forceUpdate(v => v + 1);

                  stopAutoScroll();

                }}

                onMouseEnter={()=> handleMouseEnter(el)}
                onMouseLeave={handleMouseLeave}
                onClick={() => {
                    if (draggingId.current) return;
                  if (el.side !== activeside) setActiveside(el.side);
                  // setSelectedId(id);
                }}>
                  
                  {isDragOver && (
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        height: 2,
                        background: "#0a84ff",
                        top: dragPosition.current === "after" ? 0 : "100%",
                        transform: "translateY(-1px)",
                        pointerEvents: "none",
                      }}
                    />
                  )}
                  
              <div className={`card-elements-content flex-box-row cent-box-ver
                 ${ false && selectedId&& id===selectedId ?"card-elements-active":""}
                   ${ false && hoveredId&& id===hoveredId ?"card-elements-hover":""}  `} >
                    {el.type}
                    <div className="flex-box-row clean-ex-pad">
                    <button className=" flex-box-row cent-box clean-ex-pad card-element-content-button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLock(id);
                    }}>
                    {el.locked ? "🔒" : "🔓"}
                  </button>
                     <button className=" flex-box-row cent-box clean-ex-pad card-element-content-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleVisibility(id);
                    }}>
                    {el.visible ? "👁️" : "🚫"}
                  </button> 
                  </div>
          </div>
              </div>
            );})}
        </div>
      </div>
      </div>


        
      </div>

      <div
        className="panel-resizer"
        onMouseDown={startResizing}
        style={{
          right: 0,
        }}
      ></div>
    </div>
  );
}
