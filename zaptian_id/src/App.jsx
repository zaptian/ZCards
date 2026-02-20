import { useState,useEffect } from "react";
import Template from "./components/template.jsx"


function App() {
 useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && document.fullscreenElement) {
        document.exitFullscreen();
      }

      if (e.key === "F11") {
 if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);
return (
    <>
      <Template/>
    </>
);
}

export default App