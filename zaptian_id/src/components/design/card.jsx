import ElementRenderer from "./elementrenderer.jsx";
import { useRef,useEffect } from "react";
import { mmToPx,pxToMm } from "./units.jsx";
import CreatingRenderer from "./creatingelement.jsx";
import HoverOverlay from "./hoveroverlay.jsx";
import SelectedElementRenderer from "./selectedelementrenderer.jsx";
export default function Card({ side,template,creating,create_element_select,activeside,setActiveside,
  spacePressed,selectedelement,setSelectedelement,selectedelementRef,Movingelement })
 {const card = template.card;
  const editable = activeside==side;
  const elements = template?.elements ?? {};
    const elementsId = template?.elementsId ?? [];

const card_width  = mmToPx(card.widthmm, 96);
const card_height = mmToPx(card.heightmm, 96);
const card_radius = mmToPx(card.cornerradiusmm, 96);
  let x = 4000;
  const y= 4000 ;
  if (side==="back"){
    x=x+card_width+50;
  }
    const handleSelect = (e) => {
    if (spacePressed.current)return;
      if(create_element_select) return;
    e.stopPropagation();
    if (side!==activeside)  setActiveside(side);
    setSelectedelement([]);
  };
  const getSelectionBounds = () => {
  if (!selectedelement.length) return null;
  let minX =Infinity, minY =Infinity;
  let maxX =-Infinity, maxY =-Infinity;
selectedelement
  .filter(id => elements[id]?.side === side && elements[id]?.visible)
  .forEach(id => {
    const el = elements[id];
    if (!el || el.side !== side || !el.visible) return;
    minX =Math.min(minX,el.x);
    minY =Math.min(minY,el.y);
    maxX =Math.max(maxX,el.x +el.width);
    maxY =Math.max(maxY,el.y +el.height);
  });
  return {
    left: minX,
    top: minY,
    width: maxX - minX,
    height: maxY - minY
  };
};
const bounds = getSelectionBounds();

  return (
    <div
      className="design-card"
      key={side}
      onMouseDown={handleSelect}
      style={{
        left:x,
        top:y,
        width:card_width,
        height:card_height,
        borderRadius:card_radius,
        background: card.background[side],
        // pointerEvents: editable ? "auto" : "none",
        opacity: editable ? 1 : 0.50,
        position: "absolute",
        zIndex:editable?5:4,
        // overflow:"hidden",
      }}>
        {creating && (<CreatingRenderer element={creating} />)}
        {console.log("reload")}
        {console.log(selectedelement)}
        {console.log(template)}

          
      {elementsId
        .filter(el => elements[el].side === side && elements[el].visible && !selectedelement.includes(el))
        .map(id => {
          // {console.log(id)}
          return( <ElementRenderer key={id} element={elements[id]} activeside={activeside}
          spacePressed={spacePressed} setActiveside={setActiveside} create_element_select={create_element_select}
          Movingelement={Movingelement} setSelectedelement={setSelectedelement}  />
            );})}

            
         { editable && bounds && 
          selectedelement.filter(id => elements[id]?.side === side && elements[id]?.visible)
        .map(id => {return(
            <SelectedElementRenderer
              key={id}
              element={elements[id]} activeside={activeside}
              spacePressed={spacePressed} setActiveside={setActiveside}
              create_element_select={create_element_select} Movingelement={Movingelement}
              setSelectedelement={setSelectedelement}
            />
      );})
}

        </div>
  );
}
