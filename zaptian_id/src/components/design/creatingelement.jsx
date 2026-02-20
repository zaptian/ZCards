export default function CreatingRenderer({ element }) {
  const style = {
    position: "absolute",
    pointerEvents: "none",
    left: Math.min(element.start.x, element.current.x),
    top: Math.min(element.start.y, element.current.y),
    width: Math.abs(element.current.x - element.start.x),
    height: Math.abs(element.current.y - element.start.y),
    border: "1px solid rgb(0, 120, 215)",
    background: "rgba(0, 120, 215, 0.25)",
    zIndex:9,
  };
  // console.log(style);
  switch (element.type) {
    case "text":
      return <div style={style}></div>;
    case "img":
      return <img style={style} src={resolveImage(element.data.src)} />;
    case "qr":
      return <QRCode value={element.data.value} style={style} />;
    case "shape":
      return <div style={style}></div>;
  }
}
