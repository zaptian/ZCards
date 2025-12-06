import React from "react";

const PreviewBackground = ({ children }) => {
  return (
    <div style={{ position: "relative", height: "100%", minHeight: "100vh" }}>
      {/* put the SVG behind content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        {/* paste one of the SVGs here */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="grid20"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect width="20" height="20" fill="transparent" />
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="20"
                stroke="#cfd8dc"
                strokeWidth="0.5"
              />
              <line
                x1="0"
                y1="0"
                x2="20"
                y2="0"
                stroke="#cfd8dc"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid20)" />
        </svg>
      </div>

      {/* your content overlays the grid */}
      <div
        className="w-full h-full flex justify-center items-center"
        style={{ position: "relative", zIndex: 1 }}
      >
        {children}
      </div>
    </div>
  );
};

export default PreviewBackground;
