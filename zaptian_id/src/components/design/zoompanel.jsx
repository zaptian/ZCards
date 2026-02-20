export default function ZoomPanel({onZoom,Zoomref }) {
  const zoomIn=()=>onZoom("+");
  const zoomOut=()=>onZoom("-");
  const reset=()=>onZoom("=");

  return (
    <div className="zoom_panel flex-box-row cent-box-ver" onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}>
      <div ref={Zoomref}></div>
      <div className="zoom_panel_buttons flex-box-row">
        <div className="zoom_panel_button flex-box-row cent-box" onClick={zoomIn}>
          +
        </div>
        <div className="zoom_panel_button flex-box-row cent-box" onClick={zoomOut}>
          <svg width="12" height="12" viewBox="0 0 62 62"
            fill="currentColor" className="zoom_panel_minus">
            <rect y="24" width="62" height="10" />
          </svg>
        </div>
        <div className="zoom_panel_reset flex-box-row cent-box" onClick={reset}>
          Reset
        </div>
      </div>
    </div>
  );
}
