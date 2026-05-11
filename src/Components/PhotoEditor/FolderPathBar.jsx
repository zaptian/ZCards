import { useState, useRef, useEffect } from "react";

const folderTree = {
  "This PC": {
    "Local Disk (C:)": {
      "Users": {
        "Admin": {
          "Documents": { "Projects": {}, "Reports": {}, "Personal": {} },
          "Downloads": { "Software": {}, "Media": {} },
          "Desktop": {},
          "Pictures": { "Camera Roll": {}, "Screenshots": {} },
        },
      },
      "Program Files": { "Microsoft": {}, "Adobe": {}, "Google": {} },
      "Windows": { "System32": {}, "SysWOW64": {} },
    },
    "Drive (D:)": {
      "Backups": {},
      "Media": { "Movies": {}, "Music": {}, "Photos": {} },
    },
  },
  "Network": {
    "DESKTOP-PC": { "Shared": {}, "Public": {} },
  },
};

function getChildren(tree, pathArr) {
  let node = tree;
  for (const seg of pathArr) {
    if (node[seg]) node = node[seg];
    else return {};
  }
  return node;
}

function getAllPaths(tree, prefix = []) {
  let paths = [];
  for (const key of Object.keys(tree)) {
    const current = [...prefix, key];
    paths.push(current);
    paths = paths.concat(getAllPaths(tree[key], current));
  }
  return paths;
}

export default function FolderPathBar() {
  const [path, setPath] = useState(["This PC", "Local Disk (C:)", "Users", "Admin", "Documents"]);
  const [editMode, setEditMode] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [dropdownSeg, setDropdownSeg] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (editMode && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editMode]);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setDropdownSeg(null);
        setEditMode(false);
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const enterEdit = () => {
    setInputVal(path.join("\\"));
    setEditMode(true);
    setDropdownSeg(null);
  };

  const commitEdit = () => {
    const parts = inputVal.split(/[\\/]+/).filter(Boolean);
    if (parts.length) setPath(parts);
    setEditMode(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") commitEdit();
    if (e.key === "Escape") { setEditMode(false); setSuggestions([]); }
  };

  const handleInputChange = (e) => {
    setInputVal(e.target.value);
    const parts = e.target.value.split(/[\\/]+/).filter(Boolean);
    const filtered = getAllPaths(folderTree)
      .filter((p) => p.join("\\").toLowerCase().startsWith(parts.join("\\").toLowerCase()))
      .slice(0, 8);
    setSuggestions(filtered);
  };

  const navigateTo = (segIdx) => {
    setPath(path.slice(0, segIdx + 1));
    setDropdownSeg(null);
  };

  const openDropdown = (e, segIdx) => {
    e.stopPropagation();
    setDropdownSeg(dropdownSeg === segIdx ? null : segIdx);
  };

  const childrenAt = (segIdx) =>
    Object.keys(getChildren(folderTree, path.slice(0, segIdx + 1)));

  const navigateToChild = (segIdx, child) => {
    setPath([...path.slice(0, segIdx + 1), child]);
    setDropdownSeg(null);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div ref={containerRef} style={{ position: "relative", width: 520, fontFamily: "'Segoe UI', Tahoma, sans-serif" }}>
        {editMode ? (
          <>
            <div style={{ display: "flex", alignItems: "center", height: 30, border: "2px solid #0078d7", borderRadius: 3, background: "#fff", overflow: "visible" }}>
              <span style={{ padding: "0 8px", fontSize: 13 }}>📁</span>
              <input
                ref={inputRef}
                value={inputVal}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onBlur={commitEdit}
                style={{ flex: 1, border: "none", outline: "none", fontSize: 12, color: "#111", background: "transparent", paddingRight: 8 }}
              />
            </div>
            {suggestions.length > 0 && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid #ccc", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 100, borderRadius: "0 0 4px 4px", maxHeight: 200, overflowY: "auto" }}>
                {suggestions.map((p, i) => (
                  <div key={i}
                    onMouseDown={() => { setPath(p); setEditMode(false); setSuggestions([]); }}
                    style={{ padding: "5px 10px", fontSize: 12, cursor: "pointer", color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#cce8ff"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    📁 {p.join(" \\ ")}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div
            onClick={enterEdit}
            style={{ display: "flex", alignItems: "center", height: 30, border: "1px solid #bbb", borderRadius: 3, background: "#fff", cursor: "text", overflow: "visible", position: "relative" }}>
            <span style={{ padding: "0 8px", fontSize: 13, flexShrink: 0 }}>📁</span>
            <div style={{ display: "flex", alignItems: "center", flex: 1, overflow: "hidden" }}>
              {path.map((seg, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", flexShrink: 0, position: "relative" }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigateTo(i); }}
                    style={{ padding: "0 5px", height: 30, border: "none", background: "transparent", cursor: "pointer", fontSize: 12, color: "#111", whiteSpace: "nowrap" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#cce8ff"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    {seg}
                  </button>
                  <button
                    onClick={(e) => openDropdown(e, i)}
                    style={{ width: 16, height: 30, border: "none", background: dropdownSeg === i ? "#cce8ff" : "transparent", cursor: "pointer", fontSize: 8, color: "#666", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                    onMouseEnter={e => e.currentTarget.style.background = "#cce8ff"}
                    onMouseLeave={e => { if (dropdownSeg !== i) e.currentTarget.style.background = "transparent"; }}>
                    ▶
                  </button>

                  {dropdownSeg === i && (
                    <div style={{ position: "absolute", top: "100%", left: 0, minWidth: 160, background: "#fff", border: "1px solid #ccc", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 200, borderRadius: 3 }}>
                      {childrenAt(i).length === 0 ? (
                        <div style={{ padding: "6px 12px", fontSize: 12, color: "#888", fontStyle: "italic" }}>Empty folder</div>
                      ) : childrenAt(i).map((child) => (
                        <div key={child}
                          onMouseDown={() => navigateToChild(i, child)}
                          style={{ padding: "5px 12px", fontSize: 12, cursor: "pointer", color: "#111", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#cce8ff"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          📁 {child}
                        </div>
                      ))}
                    </div>
                  )}

                  {i < path.length - 1 && <span style={{ color: "#bbb", fontSize: 11, flexShrink: 0 }}>›</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}