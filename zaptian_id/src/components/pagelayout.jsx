import { Routes, Route } from "react-router-dom";
import Home from "../pages/home.jsx";
import Design from "../pages/design/design.jsx";
import NewDesign from "../pages/design/new_design.jsx";
import MyDesign from "../pages/design/my_design.jsx";
import Data from "../pages/data/data.jsx";
import DataEdit from "../pages/data/data_edit.jsx";
import DataImport from "../pages/data/data_import.jsx";
import Print from "../pages/print.jsx";
import Template from "../pages/template.jsx";
import PhotoEdit from "../pages/photo_edit.jsx";
import Settings from "../pages/settings.jsx";

export default function Pagelayout({ setdesignscreenExpand }) {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/design" element={<Design  setdesignscreenExpand={setdesignscreenExpand}  />} />
      <Route path="/design/new" element={<NewDesign/>} />
      <Route path="/design/my" element={<MyDesign />} />

      <Route path="/data" element={<Data />} />
      <Route path="/data/edit" element={<DataEdit />} />
      <Route path="/data/import" element={<DataImport />} />

      <Route path="/print" element={<Print />} />

      <Route path="/template" element={<Template />} />

      <Route path="/photo" element={<PhotoEdit />} />

      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}
