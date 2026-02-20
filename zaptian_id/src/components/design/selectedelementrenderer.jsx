export default function SelectedElementRenderer({
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
        outline: "3px solid rgb(0, 120, 215)",
    zIndex:10,
    ...element.style
  };
  if ("fontSize" in style){
      style.fontSize = style.fontSize;
  }
  

const handleSelect = (e) => {
  if (spacePressed.current) return;
  if (create_element_select) return;
  e.stopPropagation();
  if (element.side !== activeside)
    setActiveside(element.side);
  const newSelection = [element.id];
  setSelectedelement(newSelection);
  const origins = {};
newSelection.forEach(id=>{
  const el = document.querySelector(`[data-element-id="${id}"]`);
  const rect = el.getBoundingClientRect();
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



  const commonProps = {
    style,
    onMouseDown:handleSelect,
        "data-element-id":element.id

    // onMouseEnter: handleMouseEnter,
    // onMouseLeave: handleMouseLeave,
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
