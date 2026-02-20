import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import FileInput from "../../components/design/fileinput.jsx";
import defaultjson from "../../templates/default.json"

export default function MyDesign() {
  const [projects,setProjects]=useState([]);
  const [isLoading,setIsLoading]=useState(true);
  const navigate = useNavigate();
  const [isCreateFile,setisCreateFile]=useState(false);


  function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

  useEffect(()=>{
    let cancelled = false;
    async function loadProjects() {
        const list=await window.project_file.listjson();
        if (!cancelled){
          setProjects(list||[]);
          setIsLoading(false);
        }
    }
    loadProjects();
    return ()=>{
        cancelled=true;
    }
  }, []);
    const openProject= async (name)=>{
      await window.electronStore.set("recentdesign",name);
      await window.electronStore.set("recentviewport",{x:-3800,y:-3800,scale:1.0});
      navigate("/design");
    };
 const createFile = async (filename) => {
  if (projects.includes(filename)) {
      // alert("File already exists");
    return { success: false, error: "File already exists" };
    }
  await window.project_file.writejson(filename, defaultjson);
  openProject(filename);  
    return { success: true };
};


  return (
    <div className="full-box clean-ex-pad">
    <div className={`loader-layer ${isLoading ? "visible" : "hidden"} flex-box-col full-box cent-box loader-box`}>
      <div className="loader"></div>
      <div className="designloader"></div>
    </div>
    {!isLoading && 
    <div className={`clean-ex-pad project-grid`}  id="Myprojects">
      {isCreateFile && 
    <FileInput onSave={createFile} setisCreateFile={setisCreateFile} />
      }
      <div
          className="project-card"
          onClick={() => setisCreateFile(true)}
        >
          <div className="project-thumb">+</div>
          <div className="project-title">
            Create New File
          </div>
        </div>

      {projects.map((name)=>(
        <div
          key={name}
          className="project-card"
          onClick={() => openProject(name)}
        >
          <div className="project-thumb">🗂️</div>
          <div className="project-title">
            {name.replace(".json", "")}
          </div>
        </div>
      ))}
    </div>
}
    </div>

  );
}
