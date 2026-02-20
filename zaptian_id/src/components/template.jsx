import Header from "./header.jsx"
import Pagelayout from "./pagelayout.jsx"
import Titlebar from "./titlebar.jsx"
import { useState } from "react";

function Template() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [designscreenExpand, setdesignscreenExpand] = useState(false);

  return (
    <div className="clean-ex-pad flex-box-col full-box"> 
      {!designscreenExpand && (
        <Titlebar
          isExpanded={isNavExpanded}
          setIsExpanded={setIsNavExpanded}/>
      )}
      <div className={`${ !designscreenExpand ? "layout" : "layout-full"}  clean-ex-pad flex-box-row`}>
        {!designscreenExpand && (
          <Header
            isExpanded={isNavExpanded}
            setIsExpanded={setIsNavExpanded}/>
        )}
        <Pagelayout
        className={
        designscreenExpand ? `${isNavExpanded ? "page-shrink" : "page"} page-layout`: "page-full" }
          setdesignscreenExpand={setdesignscreenExpand}
        />
      </div>
    </div>
  );
}

export default Template;
