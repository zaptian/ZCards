import { useState, useRef,useEffect,useLayoutEffect } from "react";
import  BottomDesignPanel from "../../components/design/bottompanel.jsx"
import  LeftDesignPanel from "../../components/design/leftpanel.jsx"
import  RightDesignPanel from "../../components/design/rightpanel.jsx"
import ZoomPanel from "./zoompanel.jsx";
import MiniMap from "./minimap.jsx";
import Card from "./card.jsx";
import { mmToPx,pxToMm } from "./units.jsx";

export default function DesignPanel({setdesignscreenExpand,isExpandscreen,
  isFullscreen,setIsExpandscreen,template,setTemplate,viewportRef,undohistory,
  pushhistory,redohistory,setElement_selector_options,element_selector_options}) {
  const viewport=useRef({
  x:viewportRef.current.x,
  y:viewportRef.current.y,
  scale:viewportRef.current.scale,
});
    const PANEL_W=8000;
    const PANEL_H=8000;
    const MINIMAP_H=200;
    const MINIMAP_W=200;
  const [leftpanelwidth,setleftpanelwidth]=useState(230);
  const [rightpanelwidth,setrightpanelwidth]=useState(230);
  const [create_element_select,setCreate_element_select]=useState(null);
  const [activeside,setActiveside] = useState("front");
// const [selectedId, setSelectedId] = useState(null);
const [selectedelement, setSelectedelement] = useState([]);
const selectedelementRef=useRef(null);
// const [hoveredId, setHoveredId] = useState(null);
  const isPanning = useRef(false);
  const spacePressed = useRef(false);
  const startMouse = useRef({ x:0, y:0 });
  const startTranslate = useRef({ x:0, y:0 });
  const screenRef = useRef(null);
  const [screenSize,setScreenSize] = useState({width:0,height:0});
  const wheelEndTimer = useRef(null);
  const [creating, setCreating] = useState(null);
  const card = template.card; 
  const card_width= mmToPx(card.widthmm,96);
  const card_height= mmToPx(card.heightmm,96);
  const card_radius=mmToPx(card.cornerradiusmm,96);
  const vThumbRef = useRef(null);
const hThumbRef = useRef(null);
  const minimapRef=useRef(null);
  const Zoomref=useRef(null);
  const Movingelement=useRef(null);
  const viewportElRef = useRef(null);




  
  useLayoutEffect(() => {
    const el = screenRef.current;
    if (!el) return;
    const update =()=>{
      if (!screenRef.current) return;
      const { width,height }=el.getBoundingClientRect();
      setScreenSize({ width,height });
    };
    update();
    const ro =new ResizeObserver(update);
    ro.observe(el);
    return ()=>ro.disconnect();
  }, []);

useEffect(() => {
  if (screenSize.width===0 || screenSize.height===0) return;
  applyViewport();
  if (!Zoomref.current)return;
      Zoomref.current.innerHTML=Math.round(viewport.current.scale*100,2)+"%";
}, [screenSize,leftpanelwidth,rightpanelwidth]);




  const toggledesignscreen=()=>{
    setdesignscreenExpand(prev =>!prev);
    setIsExpandscreen(prev =>!prev);
  };
    const toggleFullScreen=()=>{
    if (!document.fullscreenElement){
      document.documentElement.requestFullscreen();
    } else{
      document.exitFullscreen();
    }
  };
  const fullscreenIconBg=isFullscreen ? "#fff" : "#303030";
    const expandscreenIconBg=isExpandscreen ? "#fff" : "#303030";

  useEffect(()=>{
const el=screenRef.current;
    const keyDown=(e)=>{
      const tag=e.target.tagName;
        if (
          tag==="INPUT"||
          tag==="TEXTAREA"||
          e.target.isContentEditable
        ) {
          return;
        }
      if (e.code=="Space"){
      if (!spacePressed.current) {
        spacePressed.current=true;
        el.style.cursor="grab";
      }        
      e.preventDefault();
      }
    const ctrl=e.ctrlKey||e.metaKey;
      if (ctrl && e.code==="KeyZ" && !e.shiftKey) {
        e.preventDefault();
        undohistory();
        return;
      }

      if (ctrl &&(e.code ==="KeyY" || (e.code ==="KeyZ"&& e.shiftKey))) 
        {
        e.preventDefault();
        redohistory();
        return;
      }
    };
      const keyUp=(e)=>{
        if (e.code=="Space"){
        spacePressed.current=false;
        el.style.cursor=create_element_select?"crosshair":"default";
            }};
      window.addEventListener("keydown",keyDown);
      window.addEventListener("keyup",keyUp);
      return ()=>{
        window.removeEventListener("keydown",keyDown);
      window.removeEventListener("keyup",keyUp);
      };

  },[]);
  useEffect(() => {
  const el=screenRef.current;
  if (!el) return;
  if (spacePressed.current) {
    el.style.cursor="grab";
  } else if (create_element_select) {
    el.style.cursor="crosshair";
  } else {
    el.style.cursor="default";
  }
}, [create_element_select]);

  const commitViewport=()=> {
    const v = { ...viewport.current};
  viewportRef.current = { ...v };
  window.electronStore.set("recentviewport", viewportRef.current);
};
const applyViewport = () => {
  if (!viewportElRef.current) return;
  const { x,y,scale} = viewport.current;
  viewportElRef.current.style.transform =
  `translate(${x}px, ${y}px) scale(${scale})`;
  const metrics = getScrollbarMetrics();
  if (vThumbRef.current) {
    vThumbRef.current.style.height = `${metrics.thumbH}px`;
    vThumbRef.current.style.transform = `translateY(${metrics.y}px)`;
  }
  if (hThumbRef.current) {
    hThumbRef.current.style.width = `${metrics.thumbW}px`;
    hThumbRef.current.style.transform = `translateX(${metrics.x}px)`;
  }
  if (!minimapRef.current) return;
    const miniscale=MINIMAP_W/PANEL_W;
    const visibleOffsetX = leftpanelwidth;
    const viewW = screenSize.width - leftpanelwidth - rightpanelwidth;
    const viewH = screenSize.height;
    const miniW=(viewW/scale)*miniscale;
    const miniH=(viewH/scale)*miniscale;
      const miniX=clamp(-((x - visibleOffsetX) / scale)*miniscale,0,MINIMAP_W - miniW);
  const miniY=clamp(-(y /scale)*miniscale,0,MINIMAP_H-miniH
  );
  const mini = minimapRef.current;
  mini.style.width =`${miniW}px`;
  mini.style.height =`${miniH}px`;
  mini.style.transform =`translate(${miniX}px, ${miniY}px)`;

};

const scheduleWheelCommit = () => {
  clearTimeout(wheelEndTimer.current);
  wheelEndTimer.current=setTimeout(()=>{
    commitViewport();
  }, 250);
};
useEffect(()=>{
    return()=>{
      if (wheelEndTimer.current) {
        clearTimeout(wheelEndTimer.current);
      }
    };
  }, []);

  function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

function getScrollbarMetrics() {
  if (!screenRef.current) {
    return { x: 0, y: 0, thumbW: 0, thumbH: 0 };
  }
  const scale = viewport.current.scale;
  const viewW = screenSize.width - leftpanelwidth - rightpanelwidth;
  const viewH = screenSize.height;
  const cw = PANEL_W * scale;
  const ch = PANEL_H * scale;
  const thumbW = Math.max((viewW / cw) * viewW, 30);
  const thumbH = Math.max((viewH / ch) * viewH, 30);
  const contentX = viewport.current.x - leftpanelwidth;
  const contentY = viewport.current.y;
  const ratioX =
    cw <= viewW
      ? 0
      : clamp(-contentX/(cw-viewW), 0, 1);
  const ratioY =
    ch <= viewH
      ? 0
      : clamp(-contentY / (ch - viewH), 0, 1);
  return {
    x: ratioX * (viewW - thumbW),
    y: ratioY * (viewH - thumbH),
    thumbW,
    thumbH,
  };
}

const handleScrollbarDrag = (e, orientation) => {
  e.stopPropagation();
  const startM = orientation === 'v' ? e.clientY : e.clientX;
  const startV = orientation === 'v' ? viewport.current.y : viewport.current.x;
  
  const onMouseMove = (moveE) => {
    const delta = (orientation === 'v' ? moveE.clientY : moveE.clientX) - startM;
    const { scale } = viewport.current;
    const viewW = screenSize.width - leftpanelwidth - rightpanelwidth;
    const viewH = screenSize.height;
    const bounds = getBounds(scale);

    if (orientation === 'v') {
      const contentH = PANEL_H * scale;
      const scrollRatio = contentH / viewH;
      viewport.current.y = clamp(startV - (delta * scrollRatio), bounds.minY, bounds.maxY);
    } else {
      const contentW = PANEL_W * scale;
      const scrollRatio = contentW / viewW;
      viewport.current.x = clamp(startV - (delta * scrollRatio), bounds.minX, bounds.maxX);
    }
    applyViewport();
  };

  const onMouseUp = () => {
    commitViewport();
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
};
function getBounds(scale) {
  const viewW=screenSize.width - leftpanelwidth - rightpanelwidth;
  const viewH=screenSize.height;
  return {
    minX: viewW-PANEL_W*scale+leftpanelwidth,
    maxX: leftpanelwidth,
    minY: viewH-PANEL_H*scale+0,
    maxY: 0,
  };
}

function getCardLocalPoint(e) {
  const rect=screenRef.current.getBoundingClientRect();
  const canvasX=e.clientX - rect.left;
  const canvasY=e.clientY - rect.top;
  const { x:vx,y:vy,scale } = viewport.current;
  const worldX=(canvasX-vx)/scale;
  const worldY=(canvasY-vy)/scale;

  let x=4000;
  const y=4000 ;
  if (activeside==="back"){
     x=x+card_width+50;
  }
  return {
    x:worldX-x,
    y:worldY-y,
  };
}

  const mousedown=(e)=>{
    if (spacePressed.current) {
      screenRef.current.style.cursor = "grabbing";
      isPanning.current=true;
      startMouse.current={x:e.clientX,y:e.clientY};
      startTranslate.current={x:viewport.current.x,y:viewport.current.y };
      return;
    }
      if (!Movingelement.current)
        {
          setSelectedelement([]);
        }
    if (create_element_select) {
    const p=getCardLocalPoint(e);
    const creatingsample={
    type: create_element_select,
    start: p,
    current: p,
    data:{},
    style:{
    }};
  if (create_element_select==="text") {
  creatingsample.data.text = "Sample Text";
  creatingsample.style.fontSize = 16;
  }
  if (create_element_select==="img") {
    creatingsample.data.src = "photo";
  }
  if (create_element_select==="qr") {
    creatingsample.data.value = "{id}";
  }
  if (create_element_select==="shape"){
    creatingsample.style.backgroundColor="#ffffff";
  }
      setCreating(creatingsample);
  }};

  const mousemove = (e) => {
    if (isPanning.current) {
      const dx=e.clientX-startMouse.current.x;
      const dy=e.clientY-startMouse.current.y;
      const { minX,maxX,minY,maxY } = getBounds(viewport.current.scale);
      viewport.current.x=clamp(startTranslate.current.x+dx,minX,maxX);
      viewport.current.y=clamp(startTranslate.current.y+dy,minY,maxY);
      applyViewport();
      
      return;
    }

    else if (creating){
      setCreating(prev => ({
          ...prev,
          current: getCardLocalPoint(e),
        })); 
    }
    
else if (Movingelement.current) {
  const move = Movingelement.current;
  const scale = viewport.current.scale;
  const dx = (e.clientX - move.startX) / scale;
  const dy = (e.clientY - move.startY) / scale;
  move.ids.forEach(id => {
    const el = document.querySelector(`[data-element-id="${id}"]`);
    if (!el) return;
    const origin = move.origins[id];
    el.style.transform =
      `translate3d(${dx}px, ${dy}px,0) rotate(${origin.rotation}deg)`;
  });
  if (selectedelementRef.current) {
    selectedelementRef.current.style.transform =
      `translate3d(${dx}px, ${dy}px,0)`;
  }
}



    
  };

const mouseup = (e) => {
  if (isPanning.current) {
    isPanning.current = false;
    screenRef.current.style.cursor=spacePressed.current?"grab":"default";
    commitViewport();
    return;
  }
  if (Movingelement.current) {
  pushhistory();
 const move =Movingelement.current;
  const scale =viewportRef.current.scale;
  const dx =(e.clientX -move.startX) /scale;
  const dy =(e.clientY -move.startY) /scale;
  setTemplate(prev => {
    const updated={ ...prev.elements };
    move.ids.forEach(id => {
      const origin = move.origins[id];
      updated[id] = {
        ...updated[id],
        x: origin.x + dx,
        y: origin.y + dy
      };
    });
    return { ...prev, elements: updated };
  });
  if (selectedelementRef.current) {
    selectedelementRef.current.style.transform =
      `translate(${0}px, ${0}px)`;
  }
  move.ids.forEach(id=>{
  const el=document.querySelector(`[data-element-id="${id}"]`);
  if(el) el.style.transform="";
});

  Movingelement.current = null;}


  if (creating) {
  pushhistory();
  const { start,current,type }=creating;
  const dx=current.x-start.x;
  const dy=current.y-start.y;
  const MIN_DRAG = 5;
  const isClick=Math.abs(dx)<MIN_DRAG && Math.abs(dy)<MIN_DRAG;
  const width = isClick?150: Math.abs(dx);
  const height = isClick?40: Math.abs(dy);
  const x = isClick ? start.x: Math.min(start.x, current.x);
  const y = isClick ? start.y: Math.min(start.y, current.y);
  const element_id=crypto.randomUUID();
  const element = {
    id:element_id,
    side: activeside,
    type,
    x,
    y,
    width,
    height,
    rotation: 0,
    locked: false,
    visible: true,
    style: {},
    data: {},
  };
  if (type === "text") {
    element.data.text = "Sample Text";
    element.style.fontSize = 16;
  }
  if (type === "img") {
    element.data.src = "photo";
  }
  if (type === "qr") {
    element.data.value = "{id}";
  }
  if (type==="shape"){
    element.style.backgroundColor="#ffffff";
    if (isClick){
      element.height=150;
      element.width=150;
    }
  }
    setTemplate(prev => ({
      ...prev,
      elementsId: [...(prev.elementsId||[]), element_id],
      elements:{
        ...prev.elements,[element_id]:{
          ...element
        }
      }
    }));
      setCreating(null);
      setCreate_element_select(null);
  }
};

  function hasMoreThan5Decimals(num) {
  const s=String(num);
  const i=s.indexOf(".");
  return i!== -1 && (s.length-i-1) > 5;
}

const newzoomwithbutton= (zoom) => {
  let newScale;
  if (zoom === "+") {
    newScale = viewport.current.scale + 0.1;
  } else if (zoom === "-") {
    newScale = viewport.current.scale - 0.1;
  } else {
    newScale = 1;
  }
  newScale = clamp(newScale, 0.2,4);

  const el = screenRef.current;
  if (!el) return;
  const { width,height}=el.getBoundingClientRect();
  const cx=width/2;
  const cy=height/2;
  const { x,y,scale }=viewport.current;
  const ratio=newScale/scale;
  const { minX,maxX,minY,maxY } =getBounds(newScale);
  viewport.current = {
    x:clamp(cx-(cx-x)*ratio,minX,maxX),
    y:clamp(cy-(cy-y)*ratio,minY,maxY),
    scale: newScale,
  };
  applyViewport();
  commitViewport();
 if (Zoomref.current) {
          Zoomref.current.textContent =
            `${Math.round(viewport.current.scale * 100)}%`;
  }
  }

  const wheel = (e) => {
  if (spacePressed.current) return;
  const rect=e.currentTarget.getBoundingClientRect();
  const mx=e.clientX-rect.left;
  const my=e.clientY-rect.top;

if (e.ctrlKey || e.metaKey){ 
  let dy=e.deltaY;
   if (hasMoreThan5Decimals(dy)){ dy*=5; }
     const newScale=Math.max(0.2,Math.min(4,viewport.current.scale-dy*0.002));
      const { minX,maxX,minY,maxY } = getBounds(newScale);
      const oldx=viewport.current.x;
      const oldy=viewport.current.y;
      const ratio=newScale/viewport.current.scale;
      viewport.current = {
          x: clamp(mx-(mx-oldx)*ratio,minX,maxX),
          y: clamp(my-(my-oldy)*ratio,minY,maxY),
          scale:newScale
        };
        applyViewport();
        if (Zoomref.current) {
          Zoomref.current.textContent =
            `${Math.round(viewport.current.scale * 100)}%`;
        }
        scheduleWheelCommit();
         return;
         }

  else{
        const { minX,maxX,minY,maxY }=getBounds(viewport.current.scale);
        const oldx=viewport.current.x;
        const oldy=viewport.current.y;
        if (e.shiftKey) {
          viewport.current.x=clamp(oldx+e.deltaY, minX, maxX);
          viewport.current.y=clamp(oldy+e.deltaX, minY, maxY);
        }
        else{
        viewport.current.x=clamp(oldx-e.deltaX, minX, maxX);
        viewport.current.y=clamp(oldy-e.deltaY, minY, maxY);
      } 
      applyViewport();
      
      scheduleWheelCommit();
     }
  
};

const touchstart=(e)=>{
    if (e.touches.length !==2) return;
    isPanning.current=true;
    startMouse.current={x: (e.touches[0].clientX+e.touches[1].clientX)/2, y:(e.touches[0].clientY+e.touches[1].clientY)/2};
    startTranslate.current={x:viewport.current.x,y:viewport.current.y};
  };
  const touchmove=(e)=>{
    if (!isPanning.current || e.touches.length !== 2) return;
    const dx=(e.touches[0].clientX+e.touches[1].clientX)/2-startMouse.current.x;
    const dy=(e.touches[0].clientY+e.touches[1].clientY)/2-startMouse.current.y;
    const { minX,maxX,minY,maxY }=getBounds(viewport.current.scale);
    viewport.current.x=clamp(startTranslate.current.x+dx,minX,maxX);
    viewport.current.y=clamp(startTranslate.current.y+dy,minY,maxY);
    applyViewport();
    

  };
  const touchend=(e)=>{
    if (isPanning.current) {
      isPanning.current = false;
      commitViewport();
    }

  };

const { x, y, thumbW, thumbH } = getScrollbarMetrics();

  return(
    <div id="design_panel_screen" ref={screenRef}  className="flex-box-row cent-box" onMouseDown={mousedown} onMouseMove={mousemove} onMouseUp={mouseup} onMouseLeave={mouseup} onTouchStart={touchstart} onTouchMove={touchmove} onTouchEnd={touchend} onTouchCancel={touchend} onWheel={wheel}>
      <div id="design_panel"  ref={viewportElRef} >
        <div key={"front-card"} className="card-slot" >
          <Card side="front" template={template} creating={activeside==="front" ? creating : null} create_element_select={create_element_select}
            activeside={activeside} setActiveside={setActiveside} selectedelementRef={selectedelementRef}
            spacePressed={spacePressed} Movingelement={Movingelement} selectedelement={selectedelement} setSelectedelement={setSelectedelement}
           />
        </div>
        <div key={"back-card"} className="card-slot">
          <Card side="back" template={template} creating={activeside==="back" ? creating : null} create_element_select={create_element_select}
            activeside={activeside} setActiveside={setActiveside} selectedelementRef={selectedelementRef}
            spacePressed={spacePressed} Movingelement={Movingelement}
             selectedelement={selectedelement} setSelectedelement={setSelectedelement}
             />
        </div>
      </div>
<div
  className="fake-scrollbar vertical"
  ref={vThumbRef}
    onMouseDown={(e) => handleScrollbarDrag(e, 'v')}
  style={{
    top:`0px`,
    right:`${rightpanelwidth}px`,
    height:`${thumbH}px`,
  }}>
  </div>



<div
  className="fake-scrollbar horizontal"
  ref={hThumbRef}
    onMouseDown={(e) => handleScrollbarDrag(e, 'h')}
  style={{
    left:`${leftpanelwidth}px`,
    width:`${thumbW}px`,
  }}
  >
        </div>
<div className="fullscreen-design flex-box-row cent-box-ver clean-ex-pad" style={{backgroundColor:expandscreenIconBg}} onClick={toggledesignscreen}>
      <div className="fullscreen-icon-design full-box flex-box-row cent-box clean-ex-pad">{
        <svg width="20" height="20" viewBox="0 0 100 100" fill="currentColor"  className="nav-icon-fill" xmlns="http://www.w3.org/2000/svg">
        <path d="M43.7012 42.2609C42.8564 43.4536 41.8575 44.0551 40.4297 44.3361C38.8682 44.3798 37.7116 43.8148 36.5705 42.7582C36.4018 42.6021 36.2331 42.4459 36.0593 42.285C35.2348 41.4998 34.4253 40.701 33.6219 39.8942C33.35 39.6223 33.35 39.6223 33.0726 39.345C32.582 38.8544 32.092 38.3633 31.6021 37.872C31.0877 37.3563 30.5726 36.8412 30.0577 36.326C29.0855 35.3532 28.1138 34.3799 27.1423 33.4065C26.035 32.297 24.9272 31.1881 23.8193 30.0792C21.543 27.8009 19.2674 25.5218 16.9922 23.2423C16.991 23.4272 16.9899 23.6122 16.9887 23.8027C16.9775 25.5498 16.9633 27.2969 16.9462 29.0439C16.9374 29.942 16.9298 30.84 16.9245 31.7381C16.9194 32.6056 16.9115 33.4731 16.9017 34.3405C16.8985 34.6707 16.8962 35.0008 16.895 35.331C16.8931 35.7952 16.8876 36.2593 16.8813 36.7234C16.8818 36.926 16.8818 36.926 16.8822 37.1326C16.8555 38.5341 16.435 39.8151 15.4297 40.8204C14.2336 41.6476 13.1695 41.9444 11.7188 41.797C10.6148 41.5205 9.61897 41.065 8.95387 40.1033C8.35254 39.0982 8.17918 38.3437 8.1757 37.1895C8.17403 36.856 8.17403 36.856 8.17232 36.5158C8.1721 36.2727 8.17189 36.0296 8.17166 35.7791C8.17069 35.5224 8.16972 35.2658 8.16872 35.0013C8.16616 34.2975 8.1649 33.5937 8.16403 32.8899C8.16346 32.4497 8.16266 32.0096 8.16179 31.5695C8.15912 30.1913 8.15723 28.8131 8.15648 27.4348C8.1556 25.8461 8.15217 24.2574 8.14651 22.6687C8.14228 21.4392 8.14032 20.2098 8.14006 18.9803C8.13985 18.2467 8.13871 17.5131 8.13521 16.7795C8.13198 16.0888 8.13158 15.3982 8.13329 14.7076C8.13351 14.3352 8.13084 13.9627 8.12806 13.5903C8.13632 11.8851 8.30634 10.4438 9.57032 9.17981C10.6385 8.44104 11.5278 8.17967 12.8106 8.17582C13.0329 8.1747 13.2552 8.17359 13.4843 8.17244C13.849 8.17211 13.849 8.17211 14.221 8.17177C14.4777 8.1708 14.7344 8.16984 14.9988 8.16884C15.7026 8.16628 16.4064 8.16501 17.1103 8.16415C17.5504 8.16357 17.9905 8.16277 18.4306 8.1619C19.8088 8.15923 21.1871 8.15734 22.5653 8.15659C24.154 8.15571 25.7427 8.15229 27.3314 8.14662C28.5609 8.1424 29.7904 8.14043 31.0198 8.14017C31.7535 8.13997 32.487 8.13882 33.2207 8.13533C33.9113 8.1321 34.6019 8.13169 35.2925 8.1334C35.665 8.13362 36.0374 8.13095 36.4098 8.12817C38.115 8.13643 39.5563 8.30645 40.8203 9.57043C41.6475 10.7665 41.9443 11.8307 41.7969 13.2814C41.5204 14.3853 41.0649 15.3812 40.1032 16.0463C38.9805 16.718 38.0967 16.8266 36.812 16.8371C36.6652 16.839 36.5184 16.841 36.3672 16.843C35.8832 16.8491 35.3992 16.854 34.9152 16.8588C34.5791 16.8628 34.243 16.8669 33.907 16.8711C33.0234 16.8819 32.1397 16.8915 31.2561 16.9009C30.354 16.9108 29.452 16.9216 28.55 16.9324C26.7807 16.9534 25.0115 16.9732 23.2422 16.9923C23.3441 17.0939 23.4461 17.1955 23.5511 17.3002C26.0333 19.7737 28.5143 22.2483 30.9942 24.7241C32.1935 25.9213 33.3931 27.1182 34.5936 28.3142C35.6401 29.3568 36.6859 30.4002 37.7309 31.4443C38.2841 31.997 38.8377 32.5493 39.392 33.1008C39.9142 33.6203 40.4354 34.1408 40.956 34.6619C41.1468 34.8526 41.338 35.043 41.5295 35.233C43.4978 37.1867 45.3629 39.4459 43.7012 42.2609Z" />
        <path d="M91.8242 62.8107C91.8253 63.033 91.8264 63.2553 91.8276 63.4844C91.8278 63.7275 91.828 63.9706 91.8282 64.2211C91.8292 64.4778 91.8302 64.7345 91.8312 64.9989C91.8337 65.7027 91.835 66.4065 91.8359 67.1103C91.8364 67.5505 91.8372 67.9906 91.8381 68.4307C91.8408 69.8089 91.8427 71.1872 91.8434 72.5654C91.8443 74.1541 91.8477 75.7428 91.8534 77.3315C91.8576 78.561 91.8596 79.7904 91.8598 81.0199C91.86 81.7535 91.8612 82.4871 91.8647 83.2208C91.8679 83.9114 91.8683 84.602 91.8666 85.2926C91.8664 85.6651 91.8691 86.0375 91.8718 86.4099C91.8636 88.1151 91.6936 89.5564 90.4296 90.8204C89.3613 91.5592 88.4721 91.8205 87.1893 91.8244C86.967 91.8255 86.7446 91.8266 86.5156 91.8278C86.1509 91.8281 86.1509 91.8281 85.7789 91.8284C85.5222 91.8294 85.2655 91.8304 85.001 91.8314C84.2972 91.8339 83.5934 91.8352 82.8896 91.8361C82.4495 91.8366 82.0094 91.8374 81.5693 91.8383C80.191 91.841 78.8128 91.8429 77.4346 91.8436C75.8459 91.8445 74.2572 91.8479 72.6684 91.8536C71.439 91.8578 70.2095 91.8598 68.9801 91.86C68.2464 91.8602 67.5128 91.8614 66.7792 91.8649C66.0886 91.8681 65.398 91.8685 64.7074 91.8668C64.3349 91.8666 63.9625 91.8693 63.59 91.872C61.8849 91.8638 60.4436 91.6938 59.1796 90.4298C58.3524 89.2337 58.0556 88.1695 58.203 86.7188C58.4795 85.6149 58.935 84.6191 59.8967 83.954C61.0194 83.2823 61.9032 83.1736 63.1879 83.1631C63.3347 83.1612 63.4815 83.1593 63.6327 83.1573C64.1167 83.1511 64.6007 83.1463 65.0847 83.1414C65.4208 83.1374 65.7568 83.1333 66.0929 83.1291C66.9765 83.1184 67.8602 83.1087 68.7438 83.0993C69.6459 83.0895 70.5479 83.0786 71.4499 83.0678C73.2192 83.0468 74.9884 83.027 76.7577 83.0079C76.6557 82.9063 76.5538 82.8047 76.4487 82.7001C73.9666 80.2265 71.4856 77.752 69.0057 75.2762C67.8064 74.0789 66.6068 72.882 65.4063 71.686C64.3598 70.6434 63.314 69.6001 62.269 68.5559C61.7158 68.0032 61.1622 67.4509 60.6079 66.8994C60.0857 66.3799 59.5644 65.8594 59.0439 65.3383C58.8531 65.1476 58.6619 64.9572 58.4704 64.7672C55.7075 62.0249 55.7075 62.0249 55.6502 60.0808C55.7272 58.6026 56.254 57.6294 57.2753 56.5797C58.4525 55.8573 59.5162 55.5681 60.8908 55.7389C61.9001 56.0172 62.669 56.5379 63.4294 57.242C63.5981 57.3981 63.7668 57.5543 63.9406 57.7152C64.7651 58.5004 65.5746 59.2993 66.378 60.106C66.6499 60.3779 66.6499 60.3779 66.9273 60.6552C67.4179 61.1458 67.9079 61.6369 68.3978 62.1282C68.9122 62.6439 69.4272 63.159 69.9422 63.6742C70.9144 64.647 71.8861 65.6203 72.8576 66.5938C73.9649 67.7032 75.0727 68.8121 76.1806 69.921C78.4569 72.1993 80.7325 74.4784 83.0077 76.7579C83.0094 76.4805 83.0094 76.4805 83.0112 76.1975C83.0224 74.4504 83.0366 72.7034 83.0537 70.9563C83.0624 70.0582 83.0701 69.1602 83.0754 68.2621C83.0805 67.3946 83.0884 66.5271 83.0982 65.6597C83.1014 65.3295 83.1037 64.9994 83.1049 64.6692C83.1068 64.205 83.1123 63.7409 83.1186 63.2768C83.1183 63.1418 83.118 63.0068 83.1177 62.8677C83.1444 61.4661 83.5649 60.1851 84.5702 59.1798C85.7663 58.3526 86.8304 58.0558 88.2811 58.2032C89.3851 58.4797 90.3809 58.9352 91.046 59.8969C91.6473 60.902 91.8207 61.6565 91.8242 62.8107Z" />
        </svg>

        }
      </div>
      </div>
        <div className="fullscreen-block flex-box-row cent-box-ver clean-ex-pad" style={{backgroundColor:fullscreenIconBg}}  onClick={toggleFullScreen} >
          <div className="fullscreen-icon-design full-box flex-box-row cent-box clean-ex-pad">{
            <svg width="20" height="20" viewBox="0 0 100 100" fill="currentColor"  className="nav-icon-fill" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_238_11)">
              <path d="M97.8439 65.8729C99.0659 66.9099 99.8939 68.2768 100.055 69.8877C100.077 70.548 100.081 71.2061 100.079 71.8669C100.08 72.1173 100.082 72.3678 100.083 72.6258C100.086 73.309 100.086 73.9922 100.085 74.6754C100.085 75.2476 100.086 75.8198 100.087 76.392C100.09 77.743 100.089 79.0939 100.087 80.4449C100.085 81.8344 100.088 83.2238 100.093 84.6133C100.097 85.8101 100.098 87.0069 100.097 88.2037C100.097 88.9168 100.097 89.6299 100.101 90.343C100.104 91.139 100.101 91.9349 100.098 92.731C100.101 93.0811 100.101 93.0811 100.104 93.4383C100.087 95.3242 99.6931 96.9273 98.3795 98.3337C97.1784 99.4136 95.8288 100.047 94.1985 100.052C93.8725 100.055 93.8725 100.055 93.5399 100.057C93.1865 100.057 93.1865 100.057 92.8259 100.057C92.5755 100.058 92.3251 100.059 92.0671 100.061C91.3823 100.064 90.6974 100.065 90.0126 100.065C89.5839 100.066 89.1552 100.066 88.7265 100.067C87.2287 100.071 85.7309 100.073 84.233 100.072C82.8406 100.072 81.4483 100.076 80.056 100.082C78.8575 100.088 77.6591 100.09 76.4606 100.089C75.7462 100.089 75.0318 100.09 74.3174 100.095C73.5194 100.099 72.7216 100.097 71.9236 100.095C71.6896 100.097 71.4556 100.099 71.2144 100.102C69.254 100.087 67.6325 99.6446 66.1766 98.2803C65.0207 96.8893 64.378 95.2122 64.4119 93.4051C64.5754 91.6738 65.3163 90.1061 66.5794 88.9083C68.0072 87.7695 69.3903 87.4105 71.1807 87.4334C71.3581 87.4334 71.5355 87.4333 71.7183 87.4332C72.2995 87.4336 72.8807 87.4381 73.4619 87.4427C73.8669 87.4438 74.2719 87.4447 74.6769 87.4453C75.7391 87.4475 76.8012 87.4532 77.8634 87.4597C78.9488 87.4657 80.0342 87.4684 81.1195 87.4713C83.2464 87.4776 85.3732 87.4876 87.5 87.5C87.4983 87.2767 87.4965 87.0535 87.4947 86.8235C87.4789 84.7144 87.4672 82.6054 87.4595 80.4963C87.4555 79.4121 87.4499 78.3279 87.4411 77.2438C87.4325 76.1965 87.4279 75.1492 87.4259 74.1019C87.4244 73.7033 87.4216 73.3048 87.4174 72.9063C87.3689 68.1515 87.3689 68.1515 89.2197 66.1766C91.8423 63.9972 95.104 63.9124 97.8439 65.8729Z" />
              <path d="M10.3439 65.8729C11.5211 66.872 12.3625 68.2157 12.553 69.7684C12.5715 70.2402 12.5726 70.7086 12.5665 71.1807C12.5666 71.4468 12.5666 71.4468 12.5668 71.7182C12.5664 72.2995 12.5618 72.8806 12.5572 73.4619C12.5561 73.8669 12.5553 74.2719 12.5547 74.6769C12.5525 75.7391 12.5467 76.8012 12.5402 77.8634C12.5342 78.9487 12.5315 80.0341 12.5286 81.1195C12.5223 83.2463 12.5123 85.3731 12.5 87.5C12.7232 87.4982 12.9464 87.4965 13.1764 87.4947C15.2855 87.4788 17.3946 87.4671 19.5037 87.4595C20.5879 87.4554 21.672 87.4499 22.7562 87.441C23.8035 87.4325 24.8507 87.4279 25.8981 87.4258C26.2966 87.4244 26.6951 87.4216 27.0936 87.4174C31.8484 87.3689 31.8484 87.3689 33.8234 89.2196C34.9793 90.6107 35.622 92.2877 35.5881 94.0948C35.4246 95.8261 34.6837 97.3938 33.4205 98.5916C31.7557 99.9195 30.2045 100.087 28.1331 100.079C27.8826 100.08 27.6322 100.082 27.3741 100.083C26.6909 100.086 26.0077 100.086 25.3245 100.085C24.7523 100.084 24.1801 100.086 23.6079 100.087C22.257 100.09 20.906 100.089 19.5551 100.087C18.1656 100.085 16.7762 100.088 15.3867 100.093C14.1899 100.097 12.9931 100.098 11.7963 100.097C11.0831 100.097 10.3701 100.097 9.65698 100.1C8.86093 100.104 8.06503 100.101 7.26898 100.098C6.91885 100.101 6.91885 100.101 6.56164 100.104C4.67575 100.087 3.07268 99.693 1.66624 98.3795C0.586355 97.1784 -0.0465734 95.8287 -0.0522516 94.1985C-0.0539176 93.9811 -0.0555836 93.7638 -0.0573001 93.5398C-0.0571231 93.3042 -0.056946 93.0686 -0.0567636 92.8258C-0.0580756 92.5755 -0.0593876 92.3251 -0.0607393 92.0671C-0.0641802 91.3822 -0.0651053 90.6974 -0.0653549 90.0125C-0.0656332 89.5839 -0.0664683 89.1552 -0.0675022 88.7265C-0.0711131 87.2287 -0.0727116 85.7308 -0.0724039 84.233C-0.0721695 82.8406 -0.076287 81.4483 -0.08246 80.0559C-0.0875824 78.8575 -0.0896627 77.659 -0.0894136 76.4606C-0.0893144 75.7461 -0.0904051 75.0318 -0.0945612 74.3173C-0.0990767 73.5194 -0.0972609 72.7216 -0.0949106 71.9236C-0.0971057 71.6896 -0.0993009 71.4555 -0.101562 71.2144C-0.0869327 69.2539 0.35531 67.6324 1.71965 66.1766C4.3423 63.9972 7.60399 63.9124 10.3439 65.8729Z" />
              <path d="M71.8669 -0.0789642C72.1173 -0.0803047 72.3678 -0.0816452 72.6258 -0.0830263C73.3091 -0.0865143 73.9922 -0.086303 74.6755 -0.085186C75.2477 -0.0845799 75.8199 -0.0857745 76.3921 -0.0869514C77.743 -0.0896897 79.094 -0.0893938 80.4449 -0.0871658C81.8344 -0.0849248 83.2238 -0.0876713 84.6133 -0.0929073C85.8101 -0.0972469 87.0069 -0.0985285 88.2037 -0.0973846C88.9168 -0.096729 89.6299 -0.0971812 90.343 -0.100559C91.139 -0.104165 91.935 -0.101383 92.731 -0.0980377C92.9644 -0.099926 93.1978 -0.101814 93.4383 -0.10376C95.3242 -0.0872195 96.9273 0.306871 98.3337 1.62044C99.4136 2.82153 100.047 4.17119 100.052 5.8014C100.055 6.12744 100.055 6.12744 100.057 6.46007C100.057 6.81349 100.057 6.81349 100.057 7.17406C100.058 7.42446 100.059 7.67486 100.061 7.93284C100.064 8.61769 100.065 9.30252 100.065 9.98738C100.066 10.4161 100.066 10.8447 100.067 11.2734C100.071 12.7713 100.073 14.2691 100.072 15.767C100.072 17.1593 100.076 18.5516 100.082 19.944C100.088 21.1424 100.09 22.3409 100.089 23.5394C100.089 24.2538 100.09 24.9682 100.095 25.6826C100.099 26.4805 100.097 27.2784 100.095 28.0763C100.097 28.3104 100.099 28.5444 100.102 28.7855C100.087 30.746 99.6447 32.3675 98.2803 33.8233C96.8893 34.9792 95.2123 35.622 93.4052 35.588C91.6739 35.4246 90.1062 34.6837 88.9084 33.4205C87.7696 31.9928 87.4105 30.6096 87.4335 28.8192C87.4334 28.5531 87.4334 28.5531 87.4332 28.2817C87.4336 27.7004 87.4382 27.1193 87.4428 26.538C87.4439 26.133 87.4447 25.728 87.4453 25.323C87.4475 24.2608 87.4533 23.1987 87.4598 22.1366C87.4658 21.0512 87.4684 19.9658 87.4714 18.8804C87.4777 16.7536 87.4876 14.6268 87.5 12.5C87.2768 12.5017 87.0536 12.5034 86.8236 12.5052C84.7145 12.5211 82.6054 12.5328 80.4963 12.5404C79.4121 12.5445 78.328 12.55 77.2438 12.5589C76.1965 12.5674 75.1492 12.5721 74.1019 12.5741C73.7034 12.5755 73.3049 12.5783 72.9064 12.5826C68.1515 12.631 68.1515 12.631 66.1766 10.7803C65.0207 9.38925 64.378 7.71221 64.4119 5.9051C64.5754 4.17381 65.3163 2.60611 66.5794 1.40834C68.2443 0.0804029 69.7955 -0.0867403 71.8669 -0.0789642Z" />
              <path d="M5.8014 -0.0522516C6.01876 -0.0539176 6.23612 -0.0555836 6.46007 -0.0573001C6.69569 -0.0571231 6.9313 -0.056946 7.17406 -0.0567636C7.42446 -0.0580756 7.67486 -0.0593876 7.93284 -0.0607393C8.61769 -0.0641802 9.30252 -0.0651052 9.98738 -0.0653548C10.4161 -0.0656331 10.8447 -0.0664683 11.2734 -0.0675022C12.7713 -0.0711131 14.2691 -0.0727116 15.767 -0.0724039C17.1593 -0.0721695 18.5516 -0.0762871 19.944 -0.08246C21.1424 -0.0875825 22.3409 -0.0896626 23.5394 -0.0894135C24.2538 -0.0893143 24.9682 -0.0904051 25.6826 -0.0945612C26.4805 -0.0990767 27.2784 -0.0972609 28.0763 -0.0949106C28.4274 -0.0982033 28.4274 -0.0982033 28.7855 -0.101562C30.746 -0.0869327 32.3675 0.35531 33.8233 1.71965C34.9792 3.11068 35.622 4.78773 35.588 6.59483C35.4246 8.32613 34.6837 9.89383 33.4205 11.0916C31.9928 12.2304 30.6096 12.5895 28.8192 12.5665C28.6418 12.5666 28.4644 12.5667 28.2817 12.5668C27.7004 12.5664 27.1193 12.5618 26.538 12.5572C26.133 12.5561 25.728 12.5553 25.323 12.5547C24.2608 12.5525 23.1987 12.5467 22.1366 12.5402C21.0512 12.5342 19.9658 12.5315 18.8804 12.5286C16.7536 12.5223 14.6268 12.5123 12.5 12.5C12.5017 12.7232 12.5034 12.9464 12.5052 13.1764C12.5211 15.2855 12.5328 17.3946 12.5404 19.5037C12.5445 20.5879 12.55 21.672 12.5589 22.7562C12.5674 23.8035 12.5721 24.8507 12.5741 25.8981C12.5755 26.2966 12.5783 26.6951 12.5826 27.0936C12.631 31.8484 12.631 31.8484 10.7803 33.8234C9.38925 34.9793 7.71221 35.622 5.9051 35.5881C4.17381 35.4246 2.60611 34.6837 1.40834 33.4205C0.0804029 31.7557 -0.0867403 30.2045 -0.0789642 28.1331C-0.0803047 27.8826 -0.0816452 27.6322 -0.0830263 27.3741C-0.0865143 26.6909 -0.0863029 26.0077 -0.0851858 25.3245C-0.0845798 24.7523 -0.0857744 24.1801 -0.0869513 23.6079C-0.0896895 22.257 -0.0893938 20.906 -0.0871658 19.5551C-0.0849248 18.1656 -0.0876713 16.7762 -0.0929073 15.3867C-0.0972468 14.1899 -0.0985286 12.9931 -0.0973847 11.7963C-0.0967291 11.0831 -0.0971812 10.3701 -0.100559 9.65698C-0.104165 8.86093 -0.101383 8.06503 -0.0980377 7.26898C-0.099926 7.03556 -0.101814 6.80213 -0.10376 6.56164C-0.0872195 4.67575 0.306871 3.07268 1.62044 1.66624C2.82153 0.586355 4.17119 -0.0465734 5.8014 -0.0522516Z" />
              </g>
              <defs>
              <clipPath id="clip0_238_11">
              <rect width="100" height="100" />
              </clipPath>
              </defs>
              </svg>

            }
        </div>
        </div>  
        <BottomDesignPanel element_selector_options={element_selector_options} 
        setElement_selector_options={setElement_selector_options} 
        create_element_select={create_element_select} setCreate_element_select={setCreate_element_select}
        template={template} setTemplate={setTemplate} />
    <MiniMap minimapRef={minimapRef} />
    <ZoomPanel
    Zoomref={Zoomref}
      onZoom={(Zoom)=>{newzoomwithbutton(Zoom);}}
    />
    <LeftDesignPanel setleftpanelwidth={setleftpanelwidth} template={template} setTemplate={setTemplate} activeside={activeside} setActiveside={setActiveside} pushhistory={pushhistory}/>
    <RightDesignPanel setrightpanelwidth={setrightpanelwidth} />
    </div>
  );
}
                                   