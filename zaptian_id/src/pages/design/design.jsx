import { useEffect,useState,useRef } from "react";
import  DesignPanel from "../../components/design/designpanel.jsx"
import { useNavigate } from "react-router-dom";


export default function Design({ setdesignscreenExpand  }) {
    const [isFullscreen,setIsFullscreen]=useState(false);
  const [isLoading,setIsLoading]=useState(true);
  const [isExpandscreen,setIsExpandscreen]=useState(false);
    const navigate=useNavigate();
    const [template,setTemplate]=useState(null);
    const historyRef=useRef([]);
    const redoRef=useRef([]);
    const viewportRef=useRef({});
  const [element_selector_options,setElement_selector_options]=useState({});



    useEffect(()=>{
      let cancelled=false;
    async function init() {
      const file=await window.electronStore.get("recentdesign");
      const viewport=await window.electronStore.get("recentviewport") || {x:-3800,y:-3800,scale:1.0};
      viewportRef.current=viewport
      if (!file){
        navigate("/design/my");
        return;
      }
      const data = await window.project_file.readjson(file);
      if (!data){
        navigate("/design/my");
        return;}
      if (!cancelled) {
      setTemplate(data);
      setIsLoading(false);}
    }
    init();
    return ()=>{
      cancelled=true;
    }
}, [navigate]);

useEffect(()=>{
    let cancelled=false;
    async function init() {
      const elementoptions=await window.electronStore.get("recentelementoptions");
      if (!cancelled) {
      setElement_selector_options(elementoptions || {card:"CR80",text:"text",input:"input",img:"img",shape:"RECT",qr:"qr"});
    }
    }
    init();
    return ()=>{
      cancelled=true;
    }
}, [navigate]);

    useEffect(() =>{
    const onFullscreenChange=()=>{
    setIsFullscreen(!!document.fullscreenElement);};
    document.addEventListener("fullscreenchange",onFullscreenChange);
    return () =>document.removeEventListener("fullscreenchange",onFullscreenChange);
  }, []);
  const saveTimer = useRef(null);

useEffect(() => {
  if (!template) return;
  clearTimeout(saveTimer.current);
  saveTimer.current = setTimeout(async () => {
    const filePath = await window.electronStore.get("recentdesign");
    if (!filePath) return;
    const safeTemplate = JSON.parse(JSON.stringify(template));
    await window.project_file.writejson(
      filePath,
      safeTemplate
    );
  }, 500);
  return () => clearTimeout(saveTimer.current);
}, [template]);


const MAX_HISTORY = 100;

const pushhistory = () => {
  if (!template) return;

  historyRef.current.push({elements:structuredClone(template.elements),elementsId:structuredClone(template.elementsId)});

  if (historyRef.current.length > MAX_HISTORY) {
    historyRef.current.shift();
  }

  redoRef.current.length = 0;
};


const undohistory=()=>{
  if (historyRef.current.length==0){
    return;
  }
  setTemplate(prev=>{
        const element=historyRef.current.pop();
        redoRef.current.push({elements:structuredClone(prev.elements),elementsId:structuredClone(prev.elementsId)});
        return {...prev,elements:element.elements,elementsId:element.elementsId};
      });
};
const redohistory=()=>{
if (redoRef.current.length==0){
    return;
  }
  setTemplate(prev=>{
         const element = redoRef.current.pop();
    historyRef.current.push({elements:structuredClone(prev.elements),elementsId:structuredClone(prev.elementsId)});
        return {...prev,elements:element.elements,elementsId:element.elementsId};
  });
};



  return (
    <div className="full-box clean-ex-pad">
    <div className={`loader-layer ${isLoading ? "visible" : "hidden"} flex-box-col full-box cent-box loader-box`}>
      <div className="loader"></div>
      <div className="designloader"></div>
    </div>
    {!isLoading && 
    <div className={`clean-ex-pad full-box flex-box-row cent-box clean-ex-pad ${!isExpandscreen ? "design-expand" : ""}`} id="new_design" >
        <DesignPanel setdesignscreenExpand={setdesignscreenExpand} isExpandscreen={isExpandscreen} setIsExpandscreen={setIsExpandscreen} isFullscreen={isFullscreen}
         template={template} setTemplate={setTemplate} viewportRef={viewportRef} 
        pushhistory={pushhistory} undohistory={undohistory} redohistory={redohistory} 
        element_selector_options={element_selector_options} setElement_selector_options={setElement_selector_options} />
        </div>
      }
    </div>

  );
}
