import { useCallback, useRef, useState } from "react";

const mockFiles = [
  {
    id: 1,
    name: "DSC_0421.jpg",
    size: "4.2 MB",
    status: "success",
    type: "jpg",
    thumb: "hsl(200,60%,40%)",
  },
  {
    id: 2,
    name: "IMG_7823.png",
    size: "8.1 MB",
    status: "processing",
    type: "png",
    thumb: "hsl(160,50%,35%)",
  },
  {
    id: 3,
    name: "RAW_0012.arw",
    size: "24.6 MB",
    status: "pending",
    type: "raw",
    thumb: "hsl(30,50%,40%)",
  },
  {
    id: 4,
    name: "portrait_edit.webp",
    size: "2.8 MB",
    status: "error",
    type: "webp",
    thumb: "hsl(340,50%,40%)",
  },
  {
    id: 5,
    name: "landscape_001.jpg",
    size: "6.3 MB",
    status: "success",
    type: "jpg",
    thumb: "hsl(260,40%,40%)",
  },
  {
    id: 6,
    name: "macro_flower.jpg",
    size: "5.5 MB",
    status: "pending",
    type: "jpg",
    thumb: "hsl(80,50%,35%)",
  },
];

const recentFolders = [
  {
    id: 1,
    name: "Tokyo Trip 2024",
    path: "/Photos/Travel/Tokyo",
    count: 248,
    date: "2 days ago",
  },
  {
    id: 2,
    name: "Studio Session",
    path: "/Photos/Work/Studio",
    count: 87,
    date: "1 week ago",
  },
  {
    id: 3,
    name: "Family Events",
    path: "/Photos/Personal",
    count: 512,
    date: "2 weeks ago",
  },
];

const StatusBadge = ({ status }) => {
  const map = {
    success: { color: "#22c55e", label: "Done", bg: "rgba(34,197,94,0.12)" },
    processing: {
      color: "#f59e0b",
      label: "Processing",
      bg: "rgba(245,158,11,0.12)",
    },
    pending: {
      color: "#64748b",
      label: "Queued",
      bg: "rgba(100,116,139,0.12)",
    },
    error: { color: "#ef4444", label: "Failed", bg: "rgba(239,68,68,0.12)" },
  };
  const s = map[status];
  return (
    <span
      style={{
        color: s.color,
        background: s.bg,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.08em",
        padding: "2px 8px",
        borderRadius: 4,
        textTransform: "uppercase",
      }}
    >
      {status === "processing" ? (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: s.color,
              display: "inline-block",
              animation: "pulse 1s infinite",
            }}
          />
          {s.label}
        </span>
      ) : (
        s.label
      )}
    </span>
  );
};

const FileTypeIcon = ({ type }) => {
  const colors = {
    jpg: "#f59e0b",
    png: "#3b82f6",
    raw: "#8b5cf6",
    webp: "#10b981",
  };
  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 900,
        color: colors[type] || "#64748b",
        fontFamily: "monospace",
        letterSpacing: "0.05em",
      }}
    >
      .{type.toUpperCase()}
    </span>
  );
};

const ImportManager = ({ onclose }) => {
  const [activeTab, setActiveTab] = useState("queue");
  const [isDragging, setIsDragging] = useState(false);
  const [conflictMode, setConflictMode] = useState("skip");
  const [files, setFiles] = useState(mockFiles);
  const [progress, setProgress] = useState(62);
  const dropRef = useRef();

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  const handleDragLeave = useCallback(() => setIsDragging(false), []);
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeFile = (id) => setFiles((f) => f.filter((x) => x.id !== id));

  const tabs = ["queue", "recent", "settings"];

  return (
    <div
      style={{
        background: "#0d0f14",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        className="w-full max-w-[720px] overflow-hidden bg-light-bg dark:bg-dark-bg 
        border border-light-border dark:border-dark-border rounded-[16px] shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-0 border-b border-[#1a1f2a]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                  >
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <span className="font-['Syne'] text-base font-bold text-slate-200 tracking-tight">
                  Import Manager
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1 ml-[38px]">
                6 files · 51.5 MB total
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-3.5 py-1.5 text-[11px] text-indigo-300 font-medium cursor-pointer">
                Select All
              </div>
              <div className="bg-gradient-to-br from-indigo-500 to-violet-500 rounded-lg px-3.5 py-1.5 text-[11px] text-white font-semibold cursor-pointer tracking-wide">
                Import All →
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] text-slate-600 tracking-[0.08em] uppercase">
                Import Progress
              </span>
              <span className="text-[10px] text-indigo-500 font-semibold">
                {progress}%
              </span>
            </div>
            <div className="h-[3px] bg-[#1e2530] rounded overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-0">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`tab-btn px-[18px] py-2.5 text-[11px] uppercase tracking-[0.08em] font-mono -mb-px ${
                  activeTab === tab
                    ? "font-semibold text-slate-200 border-b-2 border-indigo-500"
                    : "font-normal text-slate-600 border-b-2 border-transparent"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* QUEUE TAB */}
          {activeTab === "queue" && (
            <div className="flex flex-col gap-4">
              {/* Drop Zone */}
              <div
                ref={dropRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-7 text-center transition-all cursor-pointer ${
                  isDragging
                    ? "border-indigo-500 bg-indigo-500/5"
                    : "border-[#1e2530] bg-white/1"
                }`}
              >
                <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="2"
                  >
                    <path d="M3 15v4a2 2 0 002 2h14a2 2 0 002-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  <span className="text-indigo-300 font-medium cursor-pointer">
                    Browse files
                  </span>{" "}
                  or drag & drop here
                </p>
                <p className="text-[10px] text-slate-700 mt-1.5 tracking-[0.06em]">
                  JPG · PNG · WEBP · RAW · TIFF · up to 100MB each
                </p>
              </div>

              {/* File Queue */}
              <div className="flex flex-col gap-0.5 max-h-[300px] overflow-y-auto">
                {files.map((file, i) => (
                  <div
                    key={file.id}
                    className="file-row flex items-center gap-3 p-2.5 rounded-lg bg-[#0d0f14] border border-[#1a1f2a] relative"
                    style={{ animationDelay: `${i * 0.04}s` }}
                  >
                    {/* Thumb */}
                    <div
                      className="w-10 h-10 rounded-lg flex-shrink-0 flex items-end justify-end p-0.5"
                      style={{ background: file.thumb }}
                    >
                      <FileTypeIcon type={file.type} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-300 font-medium truncate">
                        {file.name}
                      </p>
                      <p className="text-[10px] text-slate-700 mt-0.5">
                        {file.size}
                      </p>
                    </div>

                    <StatusBadge status={file.status} />

                    {/* Actions */}
                    <div className="file-actions opacity-0 flex gap-1 transition-opacity duration-150">
                      <button className="action-btn w-6.5 h-6.5 rounded-md bg-[#1a1f2a] flex items-center justify-center">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#64748b"
                          strokeWidth="2"
                        >
                          <polyline points="1 4 1 10 7 10" />
                          <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
                        </svg>
                      </button>
                      <button
                        className="action-btn w-6.5 h-6.5 rounded-md bg-[#1a1f2a] flex items-center justify-center"
                        onClick={() => removeFile(file.id)}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#64748b"
                          strokeWidth="2"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Row */}
              <div className="flex gap-2">
                {[
                  ["2", "Completed", "#22c55e"],
                  ["1", "Processing", "#f59e0b"],
                  ["2", "Queued", "#6366f1"],
                  ["1", "Failed", "#ef4444"],
                ].map(([n, label, color]) => (
                  <div
                    key={label}
                    className="flex-1 bg-[#0d0f14] border border-[#1a1f2a] rounded-lg py-3 px-2 text-center"
                  >
                    <div
                      className="text-xl font-bold font-['Syne']"
                      style={{ color }}
                    >
                      {n}
                    </div>
                    <div className="text-[10px] text-slate-600 mt-0.5 tracking-[0.06em]">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RECENT TAB */}
          {activeTab === "recent" && (
            <div className="flex flex-col gap-2.5">
              <p className="text-[10px] text-slate-700 tracking-[0.1em] uppercase mb-1">
                Recently Imported Folders
              </p>
              {recentFolders.map((folder) => (
                <div
                  key={folder.id}
                  className="folder-row flex items-center gap-3.5 p-3.5 rounded-xl bg-[#0d0f14] border border-[#1a1f2a] cursor-pointer transition-colors duration-150 hover:bg-[#111317]"
                >
                  <div className="w-10.5 h-10.5 bg-indigo-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#818cf8"
                      strokeWidth="1.5"
                    >
                      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-slate-300 font-medium truncate">
                      {folder.name}
                    </p>
                    <p className="text-[10px] text-slate-700 mt-0.5 truncate">
                      {folder.path}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-slate-600">
                      {folder.count} files
                    </p>
                    <p className="text-[10px] text-slate-800 mt-0.5">
                      {folder.date}
                    </p>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-[#1a1f2a] flex items-center justify-center flex-shrink-0">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#475569"
                      strokeWidth="2"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </div>
              ))}
              <div className="mt-2 flex items-center justify-center gap-1.5 p-3 rounded-lg border border-dashed border-[#1e2530] cursor-pointer">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#475569"
                  strokeWidth="2"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span className="text-[11px] text-slate-600">
                  Add New Folder Source
                </span>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === "settings" && (
            <div className="flex flex-col gap-5">
              {/* File Filters */}
              <div>
                <p className="text-[10px] text-slate-700 tracking-[0.1em] uppercase mb-3">
                  Accepted File Types
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    ["JPG", true, "#f59e0b"],
                    ["PNG", true, "#3b82f6"],
                    ["WEBP", true, "#10b981"],
                    ["RAW", true, "#8b5cf6"],
                    ["TIFF", false, "#6366f1"],
                    ["HEIC", false, "#ec4899"],
                    ["BMP", false, "#64748b"],
                  ].map(([t, active, color]) => (
                    <div
                      key={t}
                      className={`px-3 py-1.25 rounded-md cursor-pointer text-[11px] font-semibold tracking-[0.06em] ${
                        active
                          ? `bg-[${color}18] border border-[${color}40] text-[${color}]`
                          : "bg-[#0d0f14] border border-[#1e2530] text-slate-700"
                      }`}
                      style={
                        active
                          ? {
                              backgroundColor: `${color}18`,
                              borderColor: `${color}40`,
                              color,
                            }
                          : {}
                      }
                    >
                      {t}
                    </div>
                  ))}
                </div>
              </div>

              {/* Conflict Resolution */}
              <div>
                <p className="text-[10px] text-slate-700 tracking-[0.1em] uppercase mb-3">
                  Duplicate Handling
                </p>
                <div className="flex flex-col gap-1.5">
                  {[
                    [
                      "skip",
                      "Skip duplicates",
                      "Leave existing files unchanged",
                    ],
                    [
                      "overwrite",
                      "Overwrite",
                      "Replace existing with new version",
                    ],
                    ["rename", "Keep both", "Auto-rename to avoid conflicts"],
                  ].map(([val, label, desc]) => (
                    <div
                      key={val}
                      onClick={() => setConflictMode(val)}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                        conflictMode === val
                          ? "bg-indigo-500/5 border border-indigo-500/30"
                          : "bg-[#0d0f14] border border-[#1a1f2a]"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          conflictMode === val
                            ? "border-indigo-500"
                            : "border-slate-700"
                        }`}
                      >
                        {conflictMode === val && (
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        )}
                      </div>
                      <div>
                        <p
                          className={`text-xs font-medium ${conflictMode === val ? "text-slate-200" : "text-slate-500"}`}
                        >
                          {label}
                        </p>
                        <p className="text-[10px] text-slate-700 mt-0.5">
                          {desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div>
                <p className="text-[10px] text-slate-700 tracking-[0.1em] uppercase mb-3">
                  Post-Import Actions
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    ["Read EXIF metadata on import", true],
                    ["Auto-group by date taken", true],
                    ["Auto-tag by folder name", false],
                    ["Open collection after import", false],
                  ].map(([label, on]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between p-2.5 bg-[#0d0f14] border border-[#1a1f2a] rounded-lg"
                    >
                      <span className="text-xs text-slate-500">{label}</span>
                      <div
                        className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors duration-200 ${
                          on ? "bg-indigo-500" : "bg-[#1e2530]"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-all duration-200 shadow ${
                            on ? "left-[18px]" : "left-[3px]"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportManager;
