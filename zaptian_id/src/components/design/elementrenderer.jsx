export default function ElementRenderer({
  element,
  activeside,
  setActiveside,
  create_element_select,
  spacePressed,
  Movingelement,
  selectedelement,setSelectedelement,
}) {
  const style = {
    position: "absolute",
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.height,
    
    transform: `rotate(${element.rotation}deg)`,
    transformOrigin: "center center",
    ...element.style
  };
  if ("fontSize" in style){
      style.fontSize = style.fontSize;
  }
  // if (selectedId === element.id){
  // style.zIndex=10;
  //   }

  

  const handleSelect = (e) => {
    console.log(element.id);
    if (spacePressed.current)return;
    if(create_element_select) return;
    e.stopPropagation();
    if (element.side!==activeside) setActiveside(element.side);
    // setSelectedId(element.id);
  const newSelection =
    e.shiftKey?selectedelement.includes(element.id)
        ? selectedelement.filter(id => id !== element.id)
        : [...selectedelement, element.id]
        : [element.id];

  setSelectedelement(newSelection);
const origins = {};
newSelection.forEach(id=>{
  const el = document.querySelector(`[data-element-id="${id}"]`);
  origins[id] = {
    x: element.x,
    y: element.y,
    rotation: element.rotation
  };
});
Movingelement.current = {
  ids: newSelection,
  startX: e.clientX,
  startY: e.clientY,
  origins
};

  };
const handleMouseEnter = (e) => {
  if (spacePressed.current) return;
  if (Movingelement.current) return;
  if (create_element_select) return;
  const el = document.querySelector(
    `[data-element-id="${element.id}"]`
  );
  if (!el) return;
  el.style.outline = "2px solid rgb(0, 120, 215)";
};
const handleMouseLeave = (e) => {
  const el = document.querySelector(
    `[data-element-id="${element.id}"]`
  );
  if (!el) return;
  el.style.outline = "";
  el.style.outlineOffset = "";
};

const commonProps = {
  style,
  onMouseDown:handleSelect,
    onMouseEnter: handleMouseEnter,
  onMouseLeave: handleMouseLeave,
  "data-element-id":element.id
};


  switch (element.type) {
    case "text":
      return (
        <div {...commonProps}>
          {element.data.text}
        </div>
      );

    case "img":
      return (
        <img
          {...commonProps}
          src={resolveImage(element.data.src)}
          draggable={false}
          alt=""
        />
      );

    case "qr":
      return (
        <div {...commonProps}>
          <QRCode value={element.data.value} size={element.width} />
        </div>
      );

    case "shape":
      return <div {...commonProps} />;

    default:
      return null;
  }
}
