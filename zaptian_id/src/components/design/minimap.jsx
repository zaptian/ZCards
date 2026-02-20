export default function MiniMap({minimapRef}){
    return (
        <div id="Minimap">
            <div ref={minimapRef} id="Minimap_camera" ></div>
        </div>
    );


}