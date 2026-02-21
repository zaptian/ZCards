import { Routes, Route } from "react-router-dom";
import Home from "../Pages/Home";
import NewDesigner from "../Pages/Design/NewDesigner";
import DesignDashboard from "../Pages/Design/DesignDashboard";
import MyDesign from "../Pages/Design/MyDesign";
import DataDashboard from "../Pages/DataManagement/DataDashboard";
import DataEditor from "../Pages/DataManagement/DataEditor";
import DataImport from "../Pages/DataManagement/DataImport";
import PrintCard from "../Pages/PrintCard";
import TempleteDesign from "../Pages/TempleteDesign";
import PhotoEditor from "../Pages/PhotoEditor";
import SettingsPanel from "../Pages/SettingsPanel";

const NavigationRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/design" element={<DesignDashboard />} />
      <Route path="/design/new" element={<NewDesigner />} />
      <Route path="/design/my" element={<MyDesign />} />

      <Route path="/data" element={<DataDashboard />} />
      <Route path="/data/edit/:fileId" element={<DataEditor />} />
      <Route path="/data/import" element={<DataImport />} />

      <Route path="/print" element={<PrintCard />} />

      <Route path="/template" element={<TempleteDesign />} />

      <Route path="/photo" element={<PhotoEditor />} />

      <Route path="/settings" element={<SettingsPanel />} />
    </Routes>
  );
};

export default NavigationRoutes;
