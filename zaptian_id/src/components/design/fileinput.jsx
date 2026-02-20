import { useState,useRef,useEffect } from "react";
export default function FileInput({onSave ,setisCreateFile}){
  const [name,setName]=useState("");
  const [error, setError] = useState("");
    const inputRef = useRef(null);
      useEffect(() => {
        inputRef.current?.focus();
      }, []);
  const handleKeyDown = (e)=> {
    setError("");
     if (e.key === "Enter") handleSave();
    if (/[\\/:*?"<>|]/.test(e.key)) e.preventDefault();
    if (e.key === "Escape") setisCreateFile(false);

  };
 const handleSave =async()=>{
    if (!name.trim()) return;
    const filename =`${name}.json`;
    const result = await onSave(filename);
    if (!result.success) {
      setError(result.error);
      setName("");
      setTimeout(() => inputRef.current?.focus(), 0);
      return;
    }
    setError("");
    setName("");
    setisCreateFile(false);
  };

  return (
    <div className="flex-box-row full-box clear-ex-pad cent-box" id="Filenameinputboxoverlay"  onClick={() => setisCreateFile(false)}>
    <div className="flex-box-col clear-ex-pad" id="Filenameinputbox" onClick={(e) => e.stopPropagation()} >
        <div id="Filenameinputboxtitle" className="flex-box-row clear-ex-pad cent-box-ver"> File Name </div>
        <div className="Filenamesentenve">Enter the name for file to be created</div>
        <div className="fileinput-box flex-box-row clear-ex-pad cent-box-ver">File Name: <input
         ref={inputRef}
        type="text"
        placeholder="Enter File Name"
        className="Filenameinput"
        value={name}
        onKeyDown={handleKeyDown}
        onChange={(e) =>setName(e.target.value)}
        autoFocus
      /></div>
       {error && <div className="file-error">{error}</div>}
      <button onClick={handleSave} className="Filenameinputsubmit">Save</button>
    </div>
    </div>
  );
}
