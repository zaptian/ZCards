export default function HoverOverlay({ element}) {
  const style = {
    position: "absolute",
    left: element.x,
    top: element.y ,
    width: element.width,
    height: element.height,
    transform: `rotate(${element.rotation}deg)`,
    transformOrigin: "center center",
    pointerEvents: "none",
    outline: "3px solid rgb(0, 120, 215)",
    zIndex: 999,
  };

  return <div style={style} />;
}
