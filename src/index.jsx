import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { HashRouter } from "react-router-dom";

import "./styles/index.css";
import Templete from "./Templete";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <Templete />
    </HashRouter>
  </StrictMode>
);
