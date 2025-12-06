import { useEffect, useState } from "react";
import NavigationTitleBar from "./NavigationTitleBar";
import NavigationItems from "./NavigationItems";
import NavigationRoutes from "./NavigationRoutes";

const NavigationTemplete = () => {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  return (
    <div className="clean-ex-pad flex-box-col full-box">
      <NavigationTitleBar
        isExpanded={isNavExpanded}
        setIsExpanded={setIsNavExpanded}
      />
      <div className="layout clean-ex-pad flex-box-row">
        <NavigationItems
          isExpanded={isNavExpanded}
          setIsExpanded={setIsNavExpanded}
        />
        <NavigationRoutes
          className={`${isNavExpanded ? "page-shrink" : "page"} page-layout`}
        />
      </div>
    </div>
  );
};

export default NavigationTemplete;
