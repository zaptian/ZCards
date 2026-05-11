import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Camera,
  Upload,
  Check,
  AlertTriangle,
  X,
  Zap,
  Download,
  Trash2,
  Grid,
  Sun,
  Moon,
  Sparkles,
  Eye,
  Image as ImageIcon,
  FolderUp,
  FolderClock,
  Folder,
  ChevronRight,
  List,
  LayoutGrid,
  Pencil,
  FileText,
  ChevronLeft,
  Home,
  Plus,
  Users,
  Lock,
  HardDrive,
  CalendarDays,
  Clock,
  MapPin,
  Share2,
  FolderOpen,
  PanelRight,
  User,
  Copy,
  Scissors,
  ImageUp,
  SquareCheckBig,
  SquareX,
  Search,
  FolderPlus,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import {
  Data_Management_Label,
  PhotoEditor_Label,
} from "../Utils/label_render";
import CustomLabel from "../Components/CustomLabel";
import CustomButton from "../Components/CustomButton";
import ActionCardButton from "../Components/ActionCardButton";
import FolderPathSelector from "../Components/PhotoEditor/FolderPathBar";
import FolderPathBar from "../Components/PhotoEditor/FolderPathBar";
import CustomImageInput from "../Components/CustomImageInput";
import { data_control_icon } from "../Utils/img_render";
import CustomCheckBox from "../Components/CustomCheckBox";
import { PageSizeSelector } from "../Components/PhotoEditor/PageSizeSelector";
import ImportManager from "../Components/PhotoEditor/ImportManager";

// const mockFiles = [
//   {
//     id: 1,
//     name: "DSC_0421.jpg",
//     size: "4.2 MB",
//     status: "success",
//     type: "jpg",
//     thumb: "hsl(200,60%,40%)",
//   },
//   {
//     id: 2,
//     name: "IMG_7823.png",
//     size: "8.1 MB",
//     status: "processing",
//     type: "png",
//     thumb: "hsl(160,50%,35%)",
//   },
//   {
//     id: 3,
//     name: "RAW_0012.arw",
//     size: "24.6 MB",
//     status: "pending",
//     type: "raw",
//     thumb: "hsl(30,50%,40%)",
//   },
//   {
//     id: 4,
//     name: "portrait_edit.webp",
//     size: "2.8 MB",
//     status: "error",
//     type: "webp",
//     thumb: "hsl(340,50%,40%)",
//   },
//   {
//     id: 5,
//     name: "landscape_001.jpg",
//     size: "6.3 MB",
//     status: "success",
//     type: "jpg",
//     thumb: "hsl(260,40%,40%)",
//   },
//   {
//     id: 6,
//     name: "macro_flower.jpg",
//     size: "5.5 MB",
//     status: "pending",
//     type: "jpg",
//     thumb: "hsl(80,50%,35%)",
//   },
// ];

// const recentFolders = [
//   {
//     id: 1,
//     name: "Tokyo Trip 2024",
//     path: "/Photos/Travel/Tokyo",
//     count: 248,
//     date: "2 days ago",
//   },
//   {
//     id: 2,
//     name: "Studio Session",
//     path: "/Photos/Work/Studio",
//     count: 87,
//     date: "1 week ago",
//   },
//   {
//     id: 3,
//     name: "Family Events",
//     path: "/Photos/Personal",
//     count: 512,
//     date: "2 weeks ago",
//   },
// ];

// const StatusBadge = ({ status }) => {
//   const map = {
//     success: { color: "#22c55e", label: "Done", bg: "rgba(34,197,94,0.12)" },
//     processing: {
//       color: "#f59e0b",
//       label: "Processing",
//       bg: "rgba(245,158,11,0.12)",
//     },
//     pending: {
//       color: "#64748b",
//       label: "Queued",
//       bg: "rgba(100,116,139,0.12)",
//     },
//     error: { color: "#ef4444", label: "Failed", bg: "rgba(239,68,68,0.12)" },
//   };
//   const s = map[status];
//   return (
//     <span
//       style={{
//         color: s.color,
//         background: s.bg,
//         fontSize: 10,
//         fontWeight: 700,
//         letterSpacing: "0.08em",
//         padding: "2px 8px",
//         borderRadius: 4,
//         textTransform: "uppercase",
//       }}
//     >
//       {status === "processing" ? (
//         <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
//           <span
//             style={{
//               width: 6,
//               height: 6,
//               borderRadius: "50%",
//               background: s.color,
//               display: "inline-block",
//               animation: "pulse 1s infinite",
//             }}
//           />
//           {s.label}
//         </span>
//       ) : (
//         s.label
//       )}
//     </span>
//   );
// };

// const FileTypeIcon = ({ type }) => {
//   const colors = {
//     jpg: "#f59e0b",
//     png: "#3b82f6",
//     raw: "#8b5cf6",
//     webp: "#10b981",
//   };
//   return (
//     <span
//       style={{
//         fontSize: 9,
//         fontWeight: 900,
//         color: colors[type] || "#64748b",
//         fontFamily: "monospace",
//         letterSpacing: "0.05em",
//       }}
//     >
//       .{type.toUpperCase()}
//     </span>
//   );
// };
// const ImportManager = ({}) => {
//   const [activeTab, setActiveTab] = useState("queue");
//   const [isDragging, setIsDragging] = useState(false);
//   const [conflictMode, setConflictMode] = useState("skip");
//   const [files, setFiles] = useState(mockFiles);
//   const [progress, setProgress] = useState(62);
//   const dropRef = useRef();

//   const handleDragOver = useCallback((e) => {
//     e.preventDefault();
//     setIsDragging(true);
//   }, []);
//   const handleDragLeave = useCallback(() => setIsDragging(false), []);
//   const handleDrop = useCallback((e) => {
//     e.preventDefault();
//     setIsDragging(false);
//   }, []);

//   const removeFile = (id) => setFiles((f) => f.filter((x) => x.id !== id));

//   const tabs = ["queue", "recent", "settings"];

//   return (
//     <div
//       style={{
//         fontFamily: "'DM Mono', 'Fira Code', monospace",
//         background: "#0d0f14",
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         padding: 24,
//       }}
//     >
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@600;700;800&display=swap');
//         * { box-sizing: border-box; margin: 0; padding: 0; }
//         ::-webkit-scrollbar { width: 4px; }
//         ::-webkit-scrollbar-track { background: transparent; }
//         ::-webkit-scrollbar-thumb { background: #1e2530; border-radius: 2px; }
//         @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
//         @keyframes spin { to { transform: rotate(360deg); } }
//         @keyframes shimmer { 0%{background-position:-200px 0} 100%{background-position:200px 0} }
//         @keyframes slideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
//         .tab-btn { background:none; border:none; cursor:pointer; transition: all 0.2s; }
//         .tab-btn:hover { color: #e2e8f0 !important; }
//         .action-btn { background:none; border:none; cursor:pointer; transition: opacity 0.15s; }
//         .action-btn:hover { opacity: 0.7; }
//         .folder-row:hover { background: rgba(255,255,255,0.03) !important; }
//         .file-row { animation: slideIn 0.3s ease both; }
//         .file-row:hover .file-actions { opacity: 1 !important; }
//       `}</style>

//       <div
//         style={{
//           width: "100%",
//           maxWidth: 720,
//           background: "#111318",
//           borderRadius: 16,
//           border: "1px solid #1e2530",
//           overflow: "hidden",
//           boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
//         }}
//       >
//         {/* Header */}
//         <div
//           style={{ padding: "20px 24px 0", borderBottom: "1px solid #1a1f2a" }}
//         >
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               marginBottom: 20,
//             }}
//           >
//             <div>
//               <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                 <div
//                   style={{
//                     width: 28,
//                     height: 28,
//                     background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
//                     borderRadius: 8,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <svg
//                     width="14"
//                     height="14"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="white"
//                     strokeWidth="2.5"
//                   >
//                     <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
//                     <polyline points="17 8 12 3 7 8" />
//                     <line x1="12" y1="3" x2="12" y2="15" />
//                   </svg>
//                 </div>
//                 <span
//                   style={{
//                     fontFamily: "'Syne', sans-serif",
//                     fontSize: 16,
//                     fontWeight: 700,
//                     color: "#e2e8f0",
//                     letterSpacing: "-0.02em",
//                   }}
//                 >
//                   Import Manager
//                 </span>
//               </div>
//               <p
//                 style={{
//                   fontSize: 11,
//                   color: "#475569",
//                   marginTop: 4,
//                   marginLeft: 38,
//                 }}
//               >
//                 6 files · 51.5 MB total
//               </p>
//             </div>
//             <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//               <div
//                 style={{
//                   background: "rgba(99,102,241,0.1)",
//                   border: "1px solid rgba(99,102,241,0.2)",
//                   borderRadius: 8,
//                   padding: "6px 14px",
//                   fontSize: 11,
//                   color: "#818cf8",
//                   fontWeight: 500,
//                   cursor: "pointer",
//                 }}
//               >
//                 Select All
//               </div>
//               <div
//                 style={{
//                   background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
//                   borderRadius: 8,
//                   padding: "6px 14px",
//                   fontSize: 11,
//                   color: "white",
//                   fontWeight: 600,
//                   cursor: "pointer",
//                   letterSpacing: "0.02em",
//                 }}
//               >
//                 Import All →
//               </div>
//             </div>
//           </div>

//           {/* Progress Bar */}
//           <div style={{ marginBottom: 16 }}>
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 marginBottom: 6,
//               }}
//             >
//               <span
//                 style={{
//                   fontSize: 10,
//                   color: "#475569",
//                   letterSpacing: "0.08em",
//                   textTransform: "uppercase",
//                 }}
//               >
//                 Import Progress
//               </span>
//               <span style={{ fontSize: 10, color: "#6366f1", fontWeight: 600 }}>
//                 {progress}%
//               </span>
//             </div>
//             <div
//               style={{
//                 height: 3,
//                 background: "#1e2530",
//                 borderRadius: 2,
//                 overflow: "hidden",
//               }}
//             >
//               <div
//                 style={{
//                   height: "100%",
//                   width: `${progress}%`,
//                   background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
//                   borderRadius: 2,
//                   transition: "width 0.5s ease",
//                 }}
//               />
//             </div>
//           </div>

//           {/* Tabs */}
//           <div style={{ display: "flex", gap: 0 }}>
//             {tabs.map((tab) => (
//               <button
//                 key={tab}
//                 className="tab-btn"
//                 onClick={() => setActiveTab(tab)}
//                 style={{
//                   padding: "10px 18px",
//                   fontSize: 11,
//                   fontWeight: activeTab === tab ? 600 : 400,
//                   color: activeTab === tab ? "#e2e8f0" : "#475569",
//                   borderBottom:
//                     activeTab === tab
//                       ? "2px solid #6366f1"
//                       : "2px solid transparent",
//                   textTransform: "uppercase",
//                   letterSpacing: "0.08em",
//                   fontFamily: "'DM Mono', monospace",
//                   marginBottom: -1,
//                 }}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Tab Content */}
//         <div style={{ padding: 24 }}>
//           {/* QUEUE TAB */}
//           {activeTab === "queue" && (
//             <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//               {/* Drop Zone */}
//               <div
//                 ref={dropRef}
//                 onDragOver={handleDragOver}
//                 onDragLeave={handleDragLeave}
//                 onDrop={handleDrop}
//                 style={{
//                   border: `2px dashed ${isDragging ? "#6366f1" : "#1e2530"}`,
//                   borderRadius: 12,
//                   padding: "28px 24px",
//                   textAlign: "center",
//                   background: isDragging
//                     ? "rgba(99,102,241,0.05)"
//                     : "rgba(255,255,255,0.01)",
//                   transition: "all 0.2s",
//                   cursor: "pointer",
//                 }}
//               >
//                 <div
//                   style={{
//                     width: 40,
//                     height: 40,
//                     background: "rgba(99,102,241,0.1)",
//                     borderRadius: 10,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     margin: "0 auto 12px",
//                   }}
//                 >
//                   <svg
//                     width="18"
//                     height="18"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="#6366f1"
//                     strokeWidth="2"
//                   >
//                     <path d="M3 15v4a2 2 0 002 2h14a2 2 0 002-2v-4M17 8l-5-5-5 5M12 3v12" />
//                   </svg>
//                 </div>
//                 <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
//                   <span
//                     style={{
//                       color: "#818cf8",
//                       fontWeight: 500,
//                       cursor: "pointer",
//                     }}
//                   >
//                     Browse files
//                   </span>{" "}
//                   or drag & drop here
//                 </p>
//                 <p
//                   style={{
//                     fontSize: 10,
//                     color: "#334155",
//                     marginTop: 6,
//                     letterSpacing: "0.06em",
//                   }}
//                 >
//                   JPG · PNG · WEBP · RAW · TIFF · up to 100MB each
//                 </p>
//               </div>

//               {/* File Queue */}
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: 2,
//                   maxHeight: 300,
//                   overflowY: "auto",
//                 }}
//               >
//                 {files.map((file, i) => (
//                   <div
//                     key={file.id}
//                     className="file-row"
//                     style={{
//                       animationDelay: `${i * 0.04}s`,
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 12,
//                       padding: "10px 12px",
//                       borderRadius: 10,
//                       background: "#0d0f14",
//                       border: "1px solid #1a1f2a",
//                       position: "relative",
//                     }}
//                   >
//                     {/* Thumb */}
//                     <div
//                       style={{
//                         width: 40,
//                         height: 40,
//                         borderRadius: 8,
//                         background: file.thumb,
//                         flexShrink: 0,
//                         display: "flex",
//                         alignItems: "flex-end",
//                         justifyContent: "flex-end",
//                         padding: 3,
//                       }}
//                     >
//                       <FileTypeIcon type={file.type} />
//                     </div>

//                     {/* Info */}
//                     <div style={{ flex: 1, minWidth: 0 }}>
//                       <p
//                         style={{
//                           fontSize: 12,
//                           color: "#cbd5e1",
//                           fontWeight: 500,
//                           overflow: "hidden",
//                           textOverflow: "ellipsis",
//                           whiteSpace: "nowrap",
//                         }}
//                       >
//                         {file.name}
//                       </p>
//                       <p
//                         style={{ fontSize: 10, color: "#334155", marginTop: 2 }}
//                       >
//                         {file.size}
//                       </p>
//                     </div>

//                     <StatusBadge status={file.status} />

//                     {/* Actions */}
//                     <div
//                       className="file-actions"
//                       style={{
//                         opacity: 0,
//                         display: "flex",
//                         gap: 4,
//                         transition: "opacity 0.15s",
//                       }}
//                     >
//                       <button
//                         className="action-btn"
//                         style={{
//                           width: 26,
//                           height: 26,
//                           borderRadius: 6,
//                           background: "#1a1f2a",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                         }}
//                       >
//                         <svg
//                           width="12"
//                           height="12"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="#64748b"
//                           strokeWidth="2"
//                         >
//                           <polyline points="1 4 1 10 7 10" />
//                           <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
//                         </svg>
//                       </button>
//                       <button
//                         className="action-btn"
//                         onClick={() => removeFile(file.id)}
//                         style={{
//                           width: 26,
//                           height: 26,
//                           borderRadius: 6,
//                           background: "#1a1f2a",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                         }}
//                       >
//                         <svg
//                           width="12"
//                           height="12"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="#64748b"
//                           strokeWidth="2"
//                         >
//                           <line x1="18" y1="6" x2="6" y2="18" />
//                           <line x1="6" y1="6" x2="18" y2="18" />
//                         </svg>
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Summary Row */}
//               <div style={{ display: "flex", gap: 8 }}>
//                 {[
//                   ["2", "Completed", "#22c55e"],
//                   ["1", "Processing", "#f59e0b"],
//                   ["2", "Queued", "#6366f1"],
//                   ["1", "Failed", "#ef4444"],
//                 ].map(([n, label, color]) => (
//                   <div
//                     key={label}
//                     style={{
//                       flex: 1,
//                       background: "#0d0f14",
//                       border: "1px solid #1a1f2a",
//                       borderRadius: 10,
//                       padding: "12px 8px",
//                       textAlign: "center",
//                     }}
//                   >
//                     <div
//                       style={{
//                         fontSize: 20,
//                         fontWeight: 700,
//                         color,
//                         fontFamily: "'Syne', sans-serif",
//                       }}
//                     >
//                       {n}
//                     </div>
//                     <div
//                       style={{
//                         fontSize: 10,
//                         color: "#475569",
//                         marginTop: 2,
//                         letterSpacing: "0.06em",
//                       }}
//                     >
//                       {label}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* RECENT TAB */}
//           {activeTab === "recent" && (
//             <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//               <p
//                 style={{
//                   fontSize: 10,
//                   color: "#334155",
//                   letterSpacing: "0.1em",
//                   textTransform: "uppercase",
//                   marginBottom: 4,
//                 }}
//               >
//                 Recently Imported Folders
//               </p>
//               {recentFolders.map((folder) => (
//                 <div
//                   key={folder.id}
//                   className="folder-row"
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 14,
//                     padding: "14px 16px",
//                     borderRadius: 12,
//                     background: "#0d0f14",
//                     border: "1px solid #1a1f2a",
//                     cursor: "pointer",
//                     transition: "background 0.15s",
//                   }}
//                 >
//                   <div
//                     style={{
//                       width: 42,
//                       height: 42,
//                       background: "rgba(99,102,241,0.1)",
//                       borderRadius: 10,
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       flexShrink: 0,
//                     }}
//                   >
//                     <svg
//                       width="18"
//                       height="18"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="#818cf8"
//                       strokeWidth="1.5"
//                     >
//                       <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
//                     </svg>
//                   </div>
//                   <div style={{ flex: 1, minWidth: 0 }}>
//                     <p
//                       style={{
//                         fontSize: 13,
//                         color: "#cbd5e1",
//                         fontWeight: 500,
//                         overflow: "hidden",
//                         textOverflow: "ellipsis",
//                         whiteSpace: "nowrap",
//                       }}
//                     >
//                       {folder.name}
//                     </p>
//                     <p
//                       style={{
//                         fontSize: 10,
//                         color: "#334155",
//                         marginTop: 3,
//                         overflow: "hidden",
//                         textOverflow: "ellipsis",
//                         whiteSpace: "nowrap",
//                       }}
//                     >
//                       {folder.path}
//                     </p>
//                   </div>
//                   <div style={{ textAlign: "right", flexShrink: 0 }}>
//                     <p style={{ fontSize: 12, color: "#475569" }}>
//                       {folder.count} files
//                     </p>
//                     <p style={{ fontSize: 10, color: "#2d3748", marginTop: 2 }}>
//                       {folder.date}
//                     </p>
//                   </div>
//                   <div
//                     style={{
//                       width: 28,
//                       height: 28,
//                       borderRadius: 8,
//                       background: "#1a1f2a",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       flexShrink: 0,
//                     }}
//                   >
//                     <svg
//                       width="12"
//                       height="12"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="#475569"
//                       strokeWidth="2"
//                     >
//                       <polyline points="9 18 15 12 9 6" />
//                     </svg>
//                   </div>
//                 </div>
//               ))}
//               <div
//                 style={{
//                   marginTop: 8,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   gap: 6,
//                   padding: 12,
//                   borderRadius: 10,
//                   border: "1px dashed #1e2530",
//                   cursor: "pointer",
//                 }}
//               >
//                 <svg
//                   width="12"
//                   height="12"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="#475569"
//                   strokeWidth="2"
//                 >
//                   <line x1="12" y1="5" x2="12" y2="19" />
//                   <line x1="5" y1="12" x2="19" y2="12" />
//                 </svg>
//                 <span style={{ fontSize: 11, color: "#475569" }}>
//                   Add New Folder Source
//                 </span>
//               </div>
//             </div>
//           )}

//           {/* SETTINGS TAB */}
//           {activeTab === "settings" && (
//             <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//               {/* File Filters */}
//               <div>
//                 <p
//                   style={{
//                     fontSize: 10,
//                     color: "#334155",
//                     letterSpacing: "0.1em",
//                     textTransform: "uppercase",
//                     marginBottom: 12,
//                   }}
//                 >
//                   Accepted File Types
//                 </p>
//                 <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
//                   {[
//                     ["JPG", true, "#f59e0b"],
//                     ["PNG", true, "#3b82f6"],
//                     ["WEBP", true, "#10b981"],
//                     ["RAW", true, "#8b5cf6"],
//                     ["TIFF", false, "#6366f1"],
//                     ["HEIC", false, "#ec4899"],
//                     ["BMP", false, "#64748b"],
//                   ].map(([t, active, color]) => (
//                     <div
//                       key={t}
//                       style={{
//                         padding: "5px 12px",
//                         borderRadius: 6,
//                         cursor: "pointer",
//                         fontSize: 11,
//                         fontWeight: 600,
//                         letterSpacing: "0.06em",
//                         background: active ? `${color}18` : "#0d0f14",
//                         border: `1px solid ${active ? color + "40" : "#1e2530"}`,
//                         color: active ? color : "#334155",
//                       }}
//                     >
//                       {t}
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Conflict Resolution */}
//               <div>
//                 <p
//                   style={{
//                     fontSize: 10,
//                     color: "#334155",
//                     letterSpacing: "0.1em",
//                     textTransform: "uppercase",
//                     marginBottom: 12,
//                   }}
//                 >
//                   Duplicate Handling
//                 </p>
//                 <div
//                   style={{ display: "flex", flexDirection: "column", gap: 6 }}
//                 >
//                   {[
//                     [
//                       "skip",
//                       "Skip duplicates",
//                       "Leave existing files unchanged",
//                     ],
//                     [
//                       "overwrite",
//                       "Overwrite",
//                       "Replace existing with new version",
//                     ],
//                     ["rename", "Keep both", "Auto-rename to avoid conflicts"],
//                   ].map(([val, label, desc]) => (
//                     <div
//                       key={val}
//                       onClick={() => setConflictMode(val)}
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 12,
//                         padding: "12px 14px",
//                         borderRadius: 10,
//                         cursor: "pointer",
//                         background:
//                           conflictMode === val
//                             ? "rgba(99,102,241,0.06)"
//                             : "#0d0f14",
//                         border: `1px solid ${conflictMode === val ? "rgba(99,102,241,0.3)" : "#1a1f2a"}`,
//                         transition: "all 0.15s",
//                       }}
//                     >
//                       <div
//                         style={{
//                           width: 16,
//                           height: 16,
//                           borderRadius: "50%",
//                           border: `2px solid ${conflictMode === val ? "#6366f1" : "#334155"}`,
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           flexShrink: 0,
//                         }}
//                       >
//                         {conflictMode === val && (
//                           <div
//                             style={{
//                               width: 7,
//                               height: 7,
//                               borderRadius: "50%",
//                               background: "#6366f1",
//                             }}
//                           />
//                         )}
//                       </div>
//                       <div>
//                         <p
//                           style={{
//                             fontSize: 12,
//                             color: conflictMode === val ? "#e2e8f0" : "#64748b",
//                             fontWeight: 500,
//                           }}
//                         >
//                           {label}
//                         </p>
//                         <p
//                           style={{
//                             fontSize: 10,
//                             color: "#334155",
//                             marginTop: 2,
//                           }}
//                         >
//                           {desc}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Toggles */}
//               <div>
//                 <p
//                   style={{
//                     fontSize: 10,
//                     color: "#334155",
//                     letterSpacing: "0.1em",
//                     textTransform: "uppercase",
//                     marginBottom: 12,
//                   }}
//                 >
//                   Post-Import Actions
//                 </p>
//                 <div
//                   style={{ display: "flex", flexDirection: "column", gap: 8 }}
//                 >
//                   {[
//                     ["Read EXIF metadata on import", true],
//                     ["Auto-group by date taken", true],
//                     ["Auto-tag by folder name", false],
//                     ["Open collection after import", false],
//                   ].map(([label, on]) => (
//                     <div
//                       key={label}
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                         padding: "10px 14px",
//                         background: "#0d0f14",
//                         border: "1px solid #1a1f2a",
//                         borderRadius: 10,
//                       }}
//                     >
//                       <span style={{ fontSize: 12, color: "#64748b" }}>
//                         {label}
//                       </span>
//                       <div
//                         style={{
//                           width: 36,
//                           height: 20,
//                           borderRadius: 10,
//                           background: on ? "#6366f1" : "#1e2530",
//                           position: "relative",
//                           cursor: "pointer",
//                           transition: "background 0.2s",
//                         }}
//                       >
//                         <div
//                           style={{
//                             position: "absolute",
//                             top: 3,
//                             left: on ? 18 : 3,
//                             width: 14,
//                             height: 14,
//                             borderRadius: "50%",
//                             background: "white",
//                             transition: "left 0.2s",
//                             boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
//                           }}
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

/**
 * FileExplorer.jsx — Renderer (React)
 *
 * Integrates with Electron via window.electronFS (exposed by preload.js).
 * No AI, no mock data — every file/folder comes from the real OS file system.
 *
 * Features:
 *  - Import folder via native OS picker (dialog:openFolder)
 *  - Lazy-load children when a folder node is expanded (fs:readDirectory)
 *  - Sidebar tree + main panel (grid / list view)
 *  - Breadcrumb navigation with back button
 *  - Context menu: Open, Rename, Delete, Reveal in Explorer
 *  - Search (debounced, filters current folder)
 *  - Pagination with configurable page size
 *  - Multi-select with select-all banner
 *  - Rename inline
 *  - Create new folder
 */

// ─────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────

/** Format bytes to human-readable string */
function fmtSize(bytes) {
  if (bytes === null || bytes === undefined) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)} MB`;
  return `${(bytes / 1073741824).toFixed(2)} GB`;
}

/** Format ISO date string to readable form */
function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** File-type icon mapping */
const EXT_ICONS = {
  folder: "📁",
  folderOpen: "📂",
  png: "🖼",
  jpg: "🖼",
  jpeg: "🖼",
  gif: "🖼",
  svg: "🎨",
  webp: "🖼",
  mp4: "🎬",
  mov: "🎬",
  avi: "🎬",
  mp3: "🎵",
  wav: "🎵",
  flac: "🎵",
  pdf: "📕",
  doc: "📝",
  docx: "📝",
  txt: "📝",
  md: "📝",
  xls: "📊",
  xlsx: "📊",
  csv: "📊",
  ppt: "📑",
  pptx: "📑",
  zip: "📦",
  rar: "📦",
  gz: "📦",
  tar: "📦",
  js: "📜",
  jsx: "📜",
  ts: "📜",
  tsx: "📜",
  json: "📋",
  xml: "📋",
  yaml: "📋",
  yml: "📋",
  html: "🌐",
  css: "🎨",
  fig: "🎨",
  sketch: "🎨",
  default: "📄",
};

function fileIcon(entry, open = false) {
  if (entry.type === "folder")
    return open ? EXT_ICONS.folderOpen : EXT_ICONS.folder;
  return EXT_ICONS[entry.ext] || EXT_ICONS.default;
}

// ─────────────────────────────────────────────
// TREE HELPERS
// ─────────────────────────────────────────────

/**
 * Immutably update a node anywhere in the tree by its `path` key.
 * Returns new tree array.
 */
function updateNodeByPath(nodes, targetPath, updater) {
  return nodes.map((node) => {
    if (node.path === targetPath) return updater(node);
    if (node.type === "folder" && node.children) {
      return {
        ...node,
        children: updateNodeByPath(node.children, targetPath, updater),
      };
    }
    return node;
  });
}

/** Remove a node from the tree by path */
function removeNodeByPath(nodes, targetPath) {
  return nodes
    .filter((n) => n.path !== targetPath)
    .map((n) =>
      n.type === "folder" && n.children
        ? { ...n, children: removeNodeByPath(n.children, targetPath) }
        : n,
    );
}

/** Find a node by path (returns undefined if not found) */
function findNodeByPath(nodes, targetPath) {
  for (const n of nodes) {
    if (n.path === targetPath) return n;
    if (n.type === "folder" && n.children) {
      const found = findNodeByPath(n.children, targetPath);
      if (found) return found;
    }
  }
}

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

/** Single sidebar tree node (recursive) */
function TreeNode({ node, depth, activePath, onSelect, onToggle }) {
  const isActive = activePath === node.path;
  const isOpen = node._open;
  const hasKids =
    node.type === "folder" &&
    (node.hasChildren || (node.children && node.children.length > 0));

  return (
    <div>
      <div
        className={`
          flex items-center gap-1.5 py-1 pr-2 rounded-lg cursor-pointer select-none group
          ${isActive ? "bg-icon-50 dark:bg-icon-900/30 text-icon-bg dark:text-icon_dark-bg font-medium" : "text-light-text dark:text-dark-text hover:bg-light-hover dark:hover:bg-dark-hover"}
        `}
        style={{ paddingLeft: `${10 + depth * 14}px` }}
        onClick={() => {
          if (node.type === "folder") onToggle(node);
          onSelect(node);
        }}
      >
        {/* expand arrow */}
        <span className="w-3 flex-shrink-0 text-gray-400">
          {node.type === "folder" && hasKids ? (
            isOpen ? (
              <ChevronDown size={12} />
            ) : (
              <ChevronRight size={12} />
            )
          ) : null}
        </span>
        <span style={{ fontSize: 14 }}>{fileIcon(node, isOpen)}</span>
        <span className="text-xs truncate flex-1">{node.name}</span>
      </div>
      {isOpen && node.children && node.children.length > 0 && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              depth={depth + 1}
              activePath={activePath}
              onSelect={onSelect}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ChevronDown shim (lucide doesn't export it by name in older versions)
function ChevronDown({ size }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/** Breadcrumb bar */
function Breadcrumbs({ stack, onNavigate }) {
  const MAX = 3;
  const visible =
    stack.length <= MAX ? stack : [stack[0], "...", ...stack.slice(-2)];
  const realIndex = (vi) => {
    if (stack.length <= MAX) return vi;
    if (vi === 0) return 0;
    return stack.length - 2 + (vi - 2);
  };

  return (
    <div className="flex items-center gap-0.5 flex-wrap">
      {visible.map((crumb, vi) => {
        if (crumb === "...") {
          return (
            <span key="ellipsis" className="text-xs text-gray-400 px-1">
              ···
            </span>
          );
        }
        const idx = realIndex(vi);
        const isLast = idx === stack.length - 1;
        return (
          <span key={crumb.path} className="flex items-center">
            {vi > 0 && (
              <ChevronRight size={13} className="text-gray-300 mx-0.5" />
            )}
            <button
              disabled={isLast}
              onClick={() => !isLast && onNavigate(idx)}
              className={`
                text-xs px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors
                ${
                  isLast
                    ? "font-semibold text-icon-bg dark:text-icon_dark-bg bg-icon-50 dark:bg-icon-900/20 border border-icon-200 dark:border-icon-700 cursor-default"
                    : "text-light-text dark:text-dark-text hover:bg-light-hover dark:hover:bg-dark-hover"
                }
              `}
            >
              {vi === 0 && <Home size={12} />}
              {crumb.name}
            </button>
          </span>
        );
      })}
    </div>
  );
}

/** Context menu */
function ContextMenu({ menu, onClose, onAction }) {
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  if (!menu) return null;

  const actions = [
    menu.item.type === "folder"
      ? { id: "open", label: "Open Folder", icon: <FolderOpen size={13} /> }
      : { id: "preview", label: "Preview", icon: <Eye size={13} /> },
    {
      id: "reveal",
      label: "Show in Explorer",
      icon: <ExternalLink size={13} />,
    },
    { id: "rename", label: "Rename", icon: <Pencil size={13} /> },
    { id: "copy-path", label: "Copy Path", icon: <Copy size={13} /> },
    { divider: true },
    { id: "delete", label: "Delete", icon: <Trash2 size={13} />, danger: true },
  ];

  return (
    <div
      ref={ref}
      className="fixed z-[999] bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-xl py-1.5 w-48 text-sm"
      style={{ top: menu.y, left: menu.x }}
    >
      <div className="px-3 py-1.5 mb-1 border-b border-light-border dark:border-dark-border">
        <p className="text-xs text-gray-400 truncate font-medium">
          {menu.item.name}
        </p>
      </div>
      {actions.map((a, i) =>
        a.divider ? (
          <div
            key={i}
            className="my-1 border-t border-light-border dark:border-dark-border"
          />
        ) : (
          <button
            key={a.id}
            onClick={() => {
              onAction(a.id, menu.item);
              onClose();
            }}
            className={`flex items-center gap-2.5 w-full px-3 py-2 transition-colors
                ${
                  a.danger
                    ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    : "text-light-text dark:text-dark-text hover:bg-light-hover dark:hover:bg-dark-hover"
                }`}
          >
            {a.icon}
            {a.label}
          </button>
        ),
      )}
    </div>
  );
}

/** Rename modal */
function RenameModal({ item, onConfirm, onCancel }) {
  const [value, setValue] = useState(item.name);
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30">
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5 w-80 shadow-xl">
        <p className="text-sm font-semibold mb-3 text-light-text dark:text-dark-text">
          Rename
        </p>
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onConfirm(value.trim());
            if (e.key === "Escape") onCancel();
          }}
          className="w-full px-3 py-2 rounded-lg text-sm border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-icon-300"
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-sm rounded-lg border border-light-border dark:border-dark-border text-light-text dark:text-dark-text hover:bg-light-hover"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(value.trim())}
            disabled={!value.trim() || value.trim() === item.name}
            className="px-3 py-1.5 text-sm rounded-lg bg-icon-bg dark:bg-icon_dark-bg text-white disabled:opacity-40"
          >
            Rename
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

const FileExplorer = () => {
  // ── State ────────────────────────────────────────────────────────────────
  const [importedRoot, setImportedRoot] = useState(null); // { name, path, children }
  const [treeNodes, setTreeNodes] = useState([]); // full sidebar tree
  const [folderStack, setFolderStack] = useState([]); // breadcrumb stack [{name, path}]
  const [currentItems, setCurrentItems] = useState([]); // items shown in main panel
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [viewMode, setViewMode] = useState("list"); // "grid" | "list"
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]); // selected item paths
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [contextMenu, setContextMenu] = useState(null); // { x, y, item }
  const [renameTarget, setRenameTarget] = useState(null); // item to rename

  // ── Debounce search ──────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Reset page on search/folder change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery, folderStack]);

  // ── Derived: filtered + paginated items ─────────────────────────────────
  const filteredItems = debouncedQuery
    ? currentItems.filter((i) =>
        i.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
      )
    : currentItems;

  // Folders first
  const sortedItems = [
    ...filteredItems.filter((i) => i.type === "folder"),
    ...filteredItems.filter((i) => i.type === "file"),
  ];

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / pageSize));
  const pageItems = sortedItems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const allPagePaths = pageItems.map((i) => i.path);
  const allSelected =
    allPagePaths.length > 0 &&
    allPagePaths.every((p) => selectedIds.includes(p));
  const someSelected = allPagePaths.some((p) => selectedIds.includes(p));

  // ── Import folder ────────────────────────────────────────────────────────
  const handleImport = useCallback(async () => {
    setError(null);
    const result = await window.electronFS.openFolder();
    if (result.canceled) return;

    setLoading(true);
    try {
      // Get full tree (up to 5 levels deep for sidebar)
      const treeResult = await window.electronFS.getFullTree(
        result.folderPath,
        5,
      );
      if (!treeResult.ok) throw new Error(treeResult.error);

      const root = treeResult.root;
      setImportedRoot(root);
      setTreeNodes([{ ...root, _open: true }]);

      // Navigate into root
      setFolderStack([{ name: root.name, path: root.path }]);
      setCurrentItems(root.children || []);
      setSelectedIds([]);
      setSearchQuery("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Navigate into a folder ───────────────────────────────────────────────
  const openFolder = useCallback(async (item) => {
    if (item.type !== "folder") return;
    setLoading(true);
    setError(null);
    try {
      // Lazy-load children if not already loaded
      let children = item.children;
      if (!children) {
        const res = await window.electronFS.readDirectory(item.path);
        if (!res.ok) throw new Error(res.error);
        children = res.items;
        // Update tree
        setTreeNodes((prev) =>
          updateNodeByPath(prev, item.path, (n) => ({
            ...n,
            children,
            _open: true,
          })),
        );
      }
      setFolderStack((prev) => [...prev, { name: item.name, path: item.path }]);
      setCurrentItems(children || []);
      setSelectedIds([]);
      setSearchQuery("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Breadcrumb navigate ──────────────────────────────────────────────────
  const navigateTo = useCallback(
    async (index) => {
      const target = folderStack[index];
      if (!target) return;
      setLoading(true);
      setError(null);
      try {
        const res = await window.electronFS.readDirectory(target.path);
        if (!res.ok) throw new Error(res.error);
        setFolderStack((prev) => prev.slice(0, index + 1));
        setCurrentItems(res.items);
        setSelectedIds([]);
        setSearchQuery("");
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    [folderStack],
  );

  // ── Refresh current folder ───────────────────────────────────────────────
  const refresh = useCallback(async () => {
    if (!folderStack.length) return;
    const current = folderStack[folderStack.length - 1];
    setLoading(true);
    try {
      const res = await window.electronFS.readDirectory(current.path);
      if (!res.ok) throw new Error(res.error);
      setCurrentItems(res.items);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [folderStack]);

  // ── Toggle sidebar tree node ─────────────────────────────────────────────
  const toggleTreeNode = useCallback(async (node) => {
    if (node.type !== "folder") return;

    // If children not loaded yet, load them
    if (!node.children && node.hasChildren) {
      const res = await window.electronFS.readDirectory(node.path);
      if (res.ok) {
        setTreeNodes((prev) =>
          updateNodeByPath(prev, node.path, (n) => ({
            ...n,
            children: res.items,
            _open: !n._open,
          })),
        );
        return;
      }
    }

    setTreeNodes((prev) =>
      updateNodeByPath(prev, node.path, (n) => ({ ...n, _open: !n._open })),
    );
  }, []);

  // ── Context menu actions ─────────────────────────────────────────────────
  const handleContextAction = useCallback(
    async (actionId, item) => {
      switch (actionId) {
        case "open":
          openFolder(item);
          break;

        case "reveal":
          await window.electronFS.openInExplorer(item.path);
          break;

        case "rename":
          setRenameTarget(item);
          break;

        case "copy-path":
          navigator.clipboard.writeText(item.path).catch(() => {});
          break;

        case "delete": {
          const ok = window.confirm(`Move "${item.name}" to Trash?`);
          if (!ok) break;
          const res = await window.electronFS.delete(item.path);
          if (res.ok) {
            setCurrentItems((prev) => prev.filter((i) => i.path !== item.path));
            setTreeNodes((prev) => removeNodeByPath(prev, item.path));
            setSelectedIds((prev) => prev.filter((p) => p !== item.path));
          } else {
            setError(res.error);
          }
          break;
        }

        default:
          break;
      }
    },
    [openFolder],
  );

  // ── Rename confirm ───────────────────────────────────────────────────────
  const handleRenameConfirm = useCallback(
    async (newName) => {
      if (!renameTarget || !newName) {
        setRenameTarget(null);
        return;
      }
      const res = await window.electronFS.rename(renameTarget.path, newName);
      if (res.ok) {
        setCurrentItems((prev) =>
          prev.map((i) =>
            i.path === renameTarget.path
              ? { ...i, name: newName, path: res.newPath }
              : i,
          ),
        );
        setTreeNodes((prev) =>
          updateNodeByPath(prev, renameTarget.path, (n) => ({
            ...n,
            name: newName,
            path: res.newPath,
          })),
        );
      } else {
        setError(res.error);
      }
      setRenameTarget(null);
    },
    [renameTarget],
  );

  // ── Create folder ────────────────────────────────────────────────────────
  const handleCreateFolder = useCallback(async () => {
    if (!folderStack.length) return;
    const current = folderStack[folderStack.length - 1];
    const name = window.prompt("New folder name:");
    if (!name) return;
    const res = await window.electronFS.createFolder(current.path, name);
    if (res.ok) {
      await refresh();
    } else {
      setError(res.error);
    }
  }, [folderStack, refresh]);

  // ── Selection ─────────────────────────────────────────────────────────────
  const toggleSelect = (path) =>
    setSelectedIds((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path],
    );
  const toggleSelectAll = () => {
    if (allSelected)
      setSelectedIds((prev) => prev.filter((p) => !allPagePaths.includes(p)));
    else setSelectedIds((prev) => [...new Set([...prev, ...allPagePaths])]);
  };

  // ── Pagination pages ─────────────────────────────────────────────────────
  const getPageNumbers = () => {
    const pages = new Set([
      1,
      totalPages,
      currentPage,
      currentPage - 1,
      currentPage + 1,
    ]);
    const sorted = [...pages]
      .filter((p) => p >= 1 && p <= totalPages)
      .sort((a, b) => a - b);
    const result = [];
    let prev = null;
    for (const p of sorted) {
      if (prev !== null && p - prev > 2) result.push("...");
      else if (prev !== null && p - prev === 2) result.push(prev + 1);
      result.push(p);
      prev = p;
    }
    return result;
  };

  // ── Delete selected ───────────────────────────────────────────────────────
  const deleteSelected = async () => {
    const ok = window.confirm(`Move ${selectedIds.length} item(s) to Trash?`);
    if (!ok) return;
    for (const p of selectedIds) {
      await window.electronFS.delete(p);
      setTreeNodes((prev) => removeNodeByPath(prev, p));
    }
    setCurrentItems((prev) =>
      prev.filter((i) => !selectedIds.includes(i.path)),
    );
    setSelectedIds([]);
  };

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────

  const currentFolderPath = folderStack[folderStack.length - 1]?.path;

  return (
    <div className="w-full h-[calc(100vh-50px)] flex flex-col bg-light-bg dark:bg-dark-bg overflow-hidden">
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card flex-shrink-0">
        <div>
          <h1 className="text-[15px] font-semibold text-light-text dark:text-dark-text tracking-wide">
            File Explorer
          </h1>
          {importedRoot && (
            <p className="text-xs text-gray-400 mt-0.5 font-mono truncate max-w-[400px]">
              {importedRoot.path}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleImport}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-icon-bg dark:bg-icon_dark-bg text-white text-sm hover:bg-icon-bg/80 transition-colors disabled:opacity-50"
          >
            <ImageUp size={15} />
            {importedRoot ? "Change Folder" : "Import Folder"}
          </button>
          {importedRoot && (
            <button
              onClick={refresh}
              disabled={loading}
              className="p-1.5 rounded-lg border border-light-border dark:border-dark-border text-gray-500 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            </button>
          )}
        </div>
      </div>

      {/* ── ERROR BANNER ── */}
      {error && (
        <div className="flex items-center justify-between px-4 py-2 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-700 text-sm text-red-600 dark:text-red-400">
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── EMPTY STATE ── */}
      {!importedRoot && !loading && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="p-6 rounded-2xl bg-light-card dark:bg-dark-card border-2 border-dashed border-light-border dark:border-dark-border text-center max-w-xs">
            <FolderUp size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm font-medium text-light-text dark:text-dark-text mb-1">
              No folder imported
            </p>
            <p className="text-xs text-gray-400 mb-4">
              Click below to choose a folder from your system
            </p>
            <button
              onClick={handleImport}
              className="px-4 py-2 rounded-lg bg-icon-bg dark:bg-icon_dark-bg text-white text-sm"
            >
              Import Folder
            </button>
          </div>
        </div>
      )}

      {/* ── MAIN LAYOUT ── */}
      {importedRoot && (
        <div className="flex flex-1 overflow-hidden">
          {/* ── SIDEBAR TREE ── */}
          <div className="w-56 min-w-[200px] flex-shrink-0 border-r border-light-border dark:border-dark-border overflow-y-auto custom-scroll bg-light-card2 dark:bg-dark-card2 py-2">
            <p className="px-3 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
              Explorer
            </p>
            {treeNodes.map((node) => (
              <TreeNode
                key={node.path}
                node={node}
                depth={0}
                activePath={currentFolderPath}
                onSelect={(n) => {
                  if (n.type === "folder") openFolder(n);
                }}
                onToggle={toggleTreeNode}
              />
            ))}
          </div>

          {/* ── MAIN PANEL ── */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card flex-shrink-0 gap-3">
              {/* Left: back + breadcrumbs */}
              <div className="flex items-center gap-2 min-w-0">
                <button
                  onClick={() =>
                    folderStack.length > 1 && navigateTo(folderStack.length - 2)
                  }
                  disabled={folderStack.length <= 1}
                  className="p-1.5 rounded-lg border border-light-border dark:border-dark-border text-gray-400 disabled:opacity-30 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors flex-shrink-0"
                >
                  <ChevronLeft size={15} />
                </button>
                <div className="min-w-0 overflow-hidden">
                  <Breadcrumbs stack={folderStack} onNavigate={navigateTo} />
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                  {sortedItems.length} item{sortedItems.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Right: search + actions + view toggle */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="relative">
                  <Search
                    size={13}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-1 focus:ring-icon-300 w-44"
                  />
                </div>
                <button
                  onClick={handleCreateFolder}
                  className="p-1.5 rounded-lg border border-light-border dark:border-dark-border text-gray-500 hover:bg-light-hover transition-colors"
                  title="New Folder"
                >
                  <FolderPlus size={15} />
                </button>
                <div className="flex items-center border border-light-border dark:border-dark-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 transition-colors ${viewMode === "grid" ? "bg-icon-bg dark:bg-icon_dark-bg text-white" : "text-gray-400 hover:bg-light-hover dark:hover:bg-dark-hover"}`}
                  >
                    <LayoutGrid size={14} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 transition-colors ${viewMode === "list" ? "bg-icon-bg dark:bg-icon_dark-bg text-white" : "text-gray-400 hover:bg-light-hover dark:hover:bg-dark-hover"}`}
                  >
                    <List size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* selection banner */}
            {selectedIds.length > 0 && (
              <div className="flex items-center justify-between px-4 py-2 bg-icon-50/30 dark:bg-icon-900/20 border-b border-light-border dark:border-dark-border flex-shrink-0">
                <span className="text-xs font-semibold text-icon-bg dark:text-icon_dark-bg">
                  {selectedIds.length} selected
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setSelectedIds(sortedItems.map((i) => i.path))
                    }
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-icon-bg dark:bg-icon_dark-bg text-white"
                  >
                    <SquareCheckBig size={13} />
                    Select all ({sortedItems.length})
                  </button>
                  <button
                    onClick={deleteSelected}
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-button-danger text-button-danger-text"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                  <button
                    onClick={() => setSelectedIds([])}
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg border border-light-border dark:border-dark-border text-gray-500"
                  >
                    <SquareX size={13} />
                    Clear
                  </button>
                </div>
              </div>
            )}

            {/* content area */}
            <div
              className="flex-1 overflow-y-auto custom-scroll"
              onClick={() => setContextMenu(null)}
            >
              {loading && (
                <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
                  <RefreshCw size={16} className="animate-spin mr-2" /> Loading…
                </div>
              )}

              {!loading && pageItems.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <Folder size={36} className="mb-3 text-gray-300" />
                  <p className="text-sm">
                    {debouncedQuery
                      ? "No results found"
                      : "This folder is empty"}
                  </p>
                </div>
              )}

              {!loading && viewMode === "grid" && pageItems.length > 0 && (
                <div className="p-4 grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-3">
                  {pageItems.map((item) => {
                    const sel = selectedIds.includes(item.path);
                    return (
                      <div
                        key={item.path}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelect(item.path);
                        }}
                        onDoubleClick={() =>
                          item.type === "folder" && openFolder(item)
                        }
                        onContextMenu={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setContextMenu({ x: e.clientX, y: e.clientY, item });
                        }}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer border transition-all
                          ${sel ? "border-icon-400 bg-icon-50/30 dark:bg-icon-900/20" : "border-transparent hover:border-light-border dark:hover:border-dark-border hover:bg-light-hover dark:hover:bg-dark-hover"}`}
                      >
                        <span style={{ fontSize: 32 }}>{fileIcon(item)}</span>
                        <span className="text-xs text-center text-light-text dark:text-dark-text leading-tight break-all line-clamp-2">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {item.type === "file" ? fmtSize(item.size) : ""}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {!loading && viewMode === "list" && pageItems.length > 0 && (
                <table className="w-full table-fixed text-sm">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-light-card1 dark:bg-dark-card1 border-b border-light-border dark:border-dark-border">
                      <th className="w-10 px-4 py-3">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          ref={(el) => {
                            if (el)
                              el.indeterminate = someSelected && !allSelected;
                          }}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 rounded accent-icon-500 cursor-pointer"
                        />
                      </th>
                      <th className="text-left px-2 py-3 font-semibold text-xs text-light-text1 dark:text-dark-text1">
                        Name
                      </th>
                      <th className="text-left px-2 py-3 font-semibold text-xs text-light-text1 dark:text-dark-text1 w-24">
                        Type
                      </th>
                      <th className="text-left px-2 py-3 font-semibold text-xs text-light-text1 dark:text-dark-text1 w-24">
                        Size
                      </th>
                      <th className="text-left px-2 py-3 font-semibold text-xs text-light-text1 dark:text-dark-text1 w-32">
                        Modified
                      </th>
                      <th className="text-right px-4 py-3 font-semibold text-xs text-light-text1 dark:text-dark-text1 w-20">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageItems.map((item) => {
                      const sel = selectedIds.includes(item.path);
                      return (
                        <tr
                          key={item.path}
                          onClick={() => toggleSelect(item.path)}
                          onDoubleClick={() =>
                            item.type === "folder" && openFolder(item)
                          }
                          onContextMenu={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setContextMenu({
                              x: e.clientX,
                              y: e.clientY,
                              item,
                            });
                          }}
                          className={`border-b border-light-border dark:border-dark-border transition-colors select-none
                            ${sel ? "bg-icon-50/20 dark:bg-icon-900/20" : "bg-light-card1 dark:bg-dark-card1 hover:bg-light-hover dark:hover:bg-dark-hover"}
                            ${item.type === "folder" ? "cursor-pointer" : "cursor-default"}`}
                        >
                          <td
                            className="px-4 py-2.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={sel}
                              onChange={() => toggleSelect(item.path)}
                              className="w-4 h-4 rounded accent-icon-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-2 py-2.5">
                            <div className="flex items-center gap-2 truncate">
                              <span style={{ fontSize: 18, flexShrink: 0 }}>
                                {fileIcon(item)}
                              </span>
                              <span className="truncate font-medium text-light-text dark:text-dark-text">
                                {item.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-2 py-2.5">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-icon-100 dark:bg-dark-bg text-icon-bg dark:text-icon_dark-bg">
                              {item.type === "folder"
                                ? "Folder"
                                : item.ext?.toUpperCase() || "File"}
                            </span>
                          </td>
                          <td className="px-2 py-2.5 text-xs text-gray-500">
                            {fmtSize(item.size)}
                          </td>
                          <td className="px-2 py-2.5 text-xs text-gray-500">
                            {fmtDate(item.modified)}
                          </td>
                          <td
                            className="px-4 py-2.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-end gap-1">
                              {item.type === "folder" && (
                                <button
                                  onClick={() => openFolder(item)}
                                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                  <FolderOpen size={13} />
                                </button>
                              )}
                              <button
                                onClick={() => setRenameTarget(item)}
                                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                <Pencil size={13} />
                              </button>
                              <button
                                onClick={async () => {
                                  if (
                                    !window.confirm(
                                      `Move "${item.name}" to Trash?`,
                                    )
                                  )
                                    return;
                                  const res = await window.electronFS.delete(
                                    item.path,
                                  );
                                  if (res.ok) {
                                    setCurrentItems((prev) =>
                                      prev.filter((i) => i.path !== item.path),
                                    );
                                    setTreeNodes((prev) =>
                                      removeNodeByPath(prev, item.path),
                                    );
                                    setSelectedIds((prev) =>
                                      prev.filter((p) => p !== item.path),
                                    );
                                  } else setError(res.error);
                                }}
                                className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* ── PAGINATION ── */}
            {sortedItems.length > 0 && (
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-light-border dark:border-dark-border bg-light-card1 dark:bg-dark-card1 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    {(currentPage - 1) * pageSize + 1}–
                    {Math.min(currentPage * pageSize, sortedItems.length)} of{" "}
                    {sortedItems.length}
                  </span>
                  <PageSizeSelector
                    value={pageSize}
                    onChange={(s) => {
                      setPageSize(s);
                      setCurrentPage(1);
                    }}
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-2.5 py-1 rounded-lg text-xs border border-light-border dark:border-dark-border text-gray-500 disabled:opacity-30 hover:bg-light-hover transition-colors"
                  >
                    Previous
                  </button>
                  {getPageNumbers().map((p, i) =>
                    p === "..." ? (
                      <span
                        key={`d${i}`}
                        className="text-gray-400 text-xs px-1"
                      >
                        ···
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-medium transition-colors
                          ${currentPage === p ? "border border-icon-bg dark:border-icon_dark-bg text-icon-bg dark:text-icon_dark-bg" : "text-gray-500 hover:bg-light-hover dark:hover:bg-dark-hover"}`}
                      >
                        {p}
                      </button>
                    ),
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-2.5 py-1 rounded-lg text-xs bg-icon-bg dark:bg-icon_dark-bg text-white disabled:opacity-30 hover:bg-icon-bg/80 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CONTEXT MENU ── */}
      <ContextMenu
        menu={contextMenu}
        onClose={() => setContextMenu(null)}
        onAction={handleContextAction}
      />

      {/* ── RENAME MODAL ── */}
      {renameTarget && (
        <RenameModal
          item={renameTarget}
          onConfirm={handleRenameConfirm}
          onCancel={() => setRenameTarget(null)}
        />
      )}
    </div>
  );
};

/*--------------------------------------------------------------- */
/**
 * @function  PreviewPanel => COMPONENT
 * @purpose   To show the file or folder preview
 */
const PreviewPanel = ({
  selectedIds,
  contextMenu,
  FILE_SYSTEM,
  folderStack,
}) => {
  return (
    <div>
      {!selectedIds.length && !contextMenu ? (
        /* ── Empty State ── */
        <div className="flex flex-col items-center justify-center h-full min-h-[550px] gap-3 text-center px-4">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <PanelRight
              size={28}
              className="text-gray-300 dark:text-gray-600"
            />
          </div>
          <p className="text-sm font-medium text-gray-400 dark:text-gray-500">
            No item selected
          </p>
          <p className="text-xs text-gray-300 dark:text-gray-600 leading-relaxed">
            Click an item to preview details, or right-click for more options
          </p>
        </div>
      ) : (
        (() => {
          // Resolve which item to preview
          const previewId = selectedIds[selectedIds.length - 1];
          const allItems = Object.values(FILE_SYSTEM).flat();
          const item = allItems.find((i) => i.id === previewId);

          if (!item)
            return (
              <div className="flex flex-col items-center justify-center h-full min-h-[550px] gap-3 text-center px-4">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <PanelRight
                    size={28}
                    className="text-gray-300 dark:text-gray-600"
                  />
                </div>
                <p className="text-sm text-gray-400">
                  Select an item to preview
                </p>
              </div>
            );

          const isFolder = item.type === "Folder";
          const childItems =
            isFolder && item.children ? FILE_SYSTEM[item.children] || [] : [];
          const childFolders = childItems.filter((c) => c.type === "Folder");
          const childFiles = childItems.filter((c) => c.type === "File");

          // Fake metadata
          const META = {
            owner: "You",
            created: "Jan 15, 2026",
            size: isFolder ? `${childItems.length} items` : "2.4 MB",
            location: folderStack.map((f) => f.name).join(" / "),
            access: "Private",
            shared: ["Alice M.", "Bob T."],
          };

          return (
            <div className="flex flex-col gap-0 py-3">
              {/* ── Icon & Title ── */}
              <div className="flex flex-col items-center gap-3 py-6 px-2">
                <div
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-sm
                          ${isFolder ? "bg-yellow-50 dark:bg-yellow-900/20" : "bg-blue-50 dark:bg-blue-900/20"}`}
                >
                  {isFolder ? (
                    <Folder size={40} className="text-yellow-400" />
                  ) : (
                    <FileText size={40} className="text-blue-400" />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-light-text1 dark:text-dark-text1 break-all leading-snug">
                    {item.name}
                  </p>
                  <span
                    className={`mt-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                            ${
                              isFolder
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                            }`}
                  >
                    {item.type}
                  </span>
                </div>
              </div>

              {/* ── Quick Actions ── */}
              <div className="flex items-center justify-center gap-2 pb-4 border-b border-light-border dark:border-dark-border">
                {isFolder && (
                  <button
                    onClick={() => openFolder(item)}
                    className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                  >
                    <FolderOpen
                      size={18}
                      className="text-indigo-500 group-hover:text-indigo-600"
                    />
                    <span className="text-[10px] text-gray-500">Open</span>
                  </button>
                )}
                <button className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
                  <Download
                    size={18}
                    className="text-gray-400 group-hover:text-indigo-500"
                  />
                  <span className="text-[10px] text-gray-500">Download</span>
                </button>
                <button className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
                  <Share2
                    size={18}
                    className="text-gray-400 group-hover:text-indigo-500"
                  />
                  <span className="text-[10px] text-gray-500">Share</span>
                </button>
                <button className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group">
                  <Trash2
                    size={18}
                    className="text-gray-400 group-hover:text-red-500"
                  />
                  <span className="text-[10px] text-gray-500 group-hover:text-red-400">
                    Delete
                  </span>
                </button>
              </div>

              {/* ── Info ── */}
              <div className="pt-3 pb-2 px-1">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-2 px-1">
                  Info
                </p>
                <div className="flex flex-col gap-0 rounded-xl overflow-hidden border border-light-border dark:border-dark-border">
                  {[
                    {
                      icon: <Clock size={13} />,
                      label: "Modified",
                      value: item.modified,
                    },
                    {
                      icon: <CalendarDays size={13} />,
                      label: "Created",
                      value: META.created,
                    },
                    {
                      icon: <HardDrive size={13} />,
                      label: "Size",
                      value: META.size,
                    },
                    {
                      icon: <User size={13} />,
                      label: "Owner",
                      value: META.owner,
                    },
                    {
                      icon: <MapPin size={13} />,
                      label: "Location",
                      value: META.location,
                      small: true,
                    },
                  ].map(({ icon, label, value, small }, i, arr) => (
                    <div
                      key={label}
                      className={`flex items-start gap-2.5 px-3 py-2.5 bg-light-card dark:bg-dark-card
                  ${i !== arr.length - 1 ? "border-b border-light-border dark:border-dark-border" : ""}`}
                    >
                      <span className="text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0">
                        {icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-gray-400 dark:text-gray-500">
                          {label}
                        </p>
                        <p
                          className={`text-gray-700 dark:text-gray-300 font-medium truncate ${small ? "text-[11px]" : "text-xs"}`}
                        >
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Access / Permissions ── */}
              <div className="pt-3 pb-2 px-1">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-2 px-1">
                  Access
                </p>
                <div className="rounded-xl overflow-hidden border border-light-border dark:border-dark-border">
                  {/* Visibility */}
                  <div className="flex items-center gap-2.5 px-3 py-2.5 bg-light-card dark:bg-dark-card border-b border-light-border dark:border-dark-border">
                    <Lock size={13} className="text-gray-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-[10px] text-gray-400">Visibility</p>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {META.access}
                      </p>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                  </div>

                  {/* Shared with */}
                  <div className="px-3 py-2.5 bg-light-card dark:bg-dark-card">
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <Users
                        size={13}
                        className="text-gray-400 flex-shrink-0"
                      />
                      <p className="text-[10px] text-gray-400">Shared with</p>
                    </div>
                    <div className="flex flex-col gap-1.5 pl-5">
                      {META.shared.map((person) => (
                        <div key={person} className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] font-semibold text-indigo-500">
                              {person
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {person}
                          </span>
                          <span className="ml-auto text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-full">
                            Editor
                          </span>
                        </div>
                      ))}
                      <button className="flex items-center gap-1.5 text-[11px] text-indigo-500 hover:text-indigo-600 mt-0.5 transition-colors">
                        <Plus size={12} /> Add people
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Contents (folders only) ── */}
              {isFolder && childItems.length > 0 && (
                <div className="pt-3 pb-4 px-1">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-2 px-1">
                    Contents
                  </p>
                  <div className="rounded-xl overflow-hidden border border-light-border dark:border-dark-border">
                    {/* Summary row */}
                    <div className="flex items-center gap-4 px-3 py-2.5 bg-light-card dark:bg-dark-card border-b border-light-border dark:border-dark-border">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Folder size={13} className="text-yellow-400" />
                        <span>
                          {childFolders.length} folder
                          {childFolders.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <FileText size={13} className="text-blue-400" />
                        <span>
                          {childFiles.length} file
                          {childFiles.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    {/* Child list (max 4) */}
                    {childItems.slice(0, 4).map((child, i, arr) => (
                      <div
                        key={child.id}
                        className={`flex items-center gap-2 px-3 py-2 bg-light-card dark:bg-dark-card
                    ${i !== Math.min(arr.length, 4) - 1 ? "border-b border-light-border dark:border-dark-border" : ""}`}
                      >
                        {child.type === "Folder" ? (
                          <Folder
                            size={13}
                            className="text-yellow-400 flex-shrink-0"
                          />
                        ) : (
                          <FileText
                            size={13}
                            className="text-blue-400 flex-shrink-0"
                          />
                        )}
                        <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {child.name}
                        </span>
                      </div>
                    ))}

                    {childItems.length > 4 && (
                      <div className="px-3 py-2 bg-light-card dark:bg-dark-card border-t border-light-border dark:border-dark-border">
                        <button
                          onClick={() => openFolder(item)}
                          className="text-[11px] text-indigo-500 hover:text-indigo-600 transition-colors"
                        >
                          +{childItems.length - 4} more — Open folder
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Multiple selection summary ── */}
              {selectedIds.length > 1 && (
                <div className="mt-1 mx-1 mb-4 px-3 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                    {selectedIds.length} items selected
                  </p>
                  <p className="text-[11px] text-indigo-400 mt-0.5">
                    Previewing the last selected item
                  </p>
                </div>
              )}
            </div>
          );
        })()
      )}
    </div>
  );
};

const PhotoEditor = ({}) => {
  /*-----------------------------------------------------------*/
  /* DEFAULT PATH */
  /*-----------------------------------------------------------*/
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [itemsPrePage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [folderStack, setFolderStack] = useState([
    { id: "home", name: "Home" },
  ]);
  const [contextMenu, setContextMenu] = useState(null); // { x, y, item }
  const [showRecentFolderView, setShowRecentFolderView] = useState(false);
  const [showImportImageFolderView, setShowImportImageFolderView] =
    useState(false);

  /* ---------------------- Debouncing search ------------------ */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  /* ---------------------- ViewMode Change ------------------ */
  const changeView = (mode) => {
    setViewMode(mode);
    onChange?.(mode);
  };

  const FILE_SYSTEM = {
    home: [
      {
        id: 1,
        name: "Design Assets",
        type: "Folder",
        modified: "Mar 10, 2026",
        children: "folder_1",
      },
      {
        id: 2,
        name: "Project Proposals",
        type: "Folder",
        modified: "Mar 8, 2026",
        children: "folder_2",
      },
      {
        id: 3,
        name: "Client Documents",
        type: "Folder",
        modified: "Mar 7, 2026",
        children: "folder_3",
      },
      {
        id: 4,
        name: "Marketing Campaigns",
        type: "Folder",
        modified: "Mar 5, 2026",
        children: "folder_4",
      },
      {
        id: 5,
        name: "Source Code",
        type: "Folder",
        modified: "Mar 4, 2026",
        children: "folder_5",
      },
      {
        id: 6,
        name: "Meeting Notes",
        type: "Folder",
        modified: "Mar 3, 2026",
        children: "folder_6",
      },
      {
        id: 7,
        name: "Q1 Financial Report",
        type: "File",
        modified: "Feb 28, 2026",
      },
      {
        id: 8,
        name: "Employee Handbook",
        type: "File",
        modified: "Feb 25, 2026",
      },
      {
        id: 9,
        name: "Product Roadmap",
        type: "File",
        modified: "Feb 20, 2026",
      },
    ],
    folder_1: [
      {
        id: 101,
        name: "Icons Pack",
        type: "Folder",
        modified: "Mar 9, 2026",
        children: "folder_1_1",
      },
      {
        id: 102,
        name: "Wireframes",
        type: "Folder",
        modified: "Mar 8, 2026",
        children: "folder_1_2",
      },
      {
        id: 103,
        name: "logo-final.png",
        type: "File",
        modified: "Mar 7, 2026",
      },
      {
        id: 104,
        name: "style-guide.pdf",
        type: "File",
        modified: "Mar 6, 2026",
      },
    ],
    folder_1_1: [
      {
        id: 201,
        name: "icon-set-v1.svg",
        type: "File",
        modified: "Mar 5, 2026",
      },
      {
        id: 202,
        name: "icon-set-v2.svg",
        type: "File",
        modified: "Mar 4, 2026",
      },
      {
        id: 300,
        name: "Icons Pack 1",
        type: "Folder",
        modified: "Mar 9, 2026",
        children: "folder_1_1_1",
      },
    ],
    folder_1_1_1: [
      {
        id: 301,
        name: "Icons Pack 2",
        type: "Folder",
        modified: "Mar 9, 2026",
        children: "folder_1_1_1_1",
      },
    ],
    folder_1_1_1_1: [
      {
        id: 302,
        name: "Icons Pack 3",
        type: "Folder",
        modified: "Mar 9, 2026",
        children: "folder_1_1_1_1_1",
      },
    ],
    folder_1_1_1_1_1: [],
    folder_1_2: [
      {
        id: 203,
        name: "homepage.fig",
        type: "File",
        modified: "Mar 3, 2026",
      },
      {
        id: 204,
        name: "dashboard.fig",
        type: "File",
        modified: "Mar 2, 2026",
      },
    ],
    folder_2: [
      {
        id: 105,
        name: "Client A Proposal",
        type: "File",
        modified: "Mar 6, 2026",
      },
      {
        id: 106,
        name: "Client B Proposal",
        type: "File",
        modified: "Mar 5, 2026",
      },
    ],
    folder_3: [
      {
        id: 107,
        name: "Contracts 2026",
        type: "Folder",
        modified: "Mar 4, 2026",
        children: "folder_3_1",
      },
      {
        id: 108,
        name: "NDA Template.docx",
        type: "File",
        modified: "Mar 3, 2026",
      },
    ],
    folder_3_1: [
      {
        id: 205,
        name: "Contract-AlphaInc.pdf",
        type: "File",
        modified: "Mar 2, 2026",
      },
    ],
    folder_4: [
      {
        id: 109,
        name: "campaign-brief.pptx",
        type: "File",
        modified: "Mar 2, 2026",
      },
    ],
    folder_5: [
      {
        id: 110,
        name: "frontend",
        type: "Folder",
        modified: "Mar 1, 2026",
        children: "folder_5_1",
      },
      {
        id: 111,
        name: "backend",
        type: "Folder",
        modified: "Feb 28, 2026",
        children: "folder_5_2",
      },
      {
        id: 112,
        name: "README.md",
        type: "File",
        modified: "Feb 27, 2026",
      },
    ],
    folder_5_1: [
      {
        id: 206,
        name: "App.jsx",
        type: "File",
        modified: "Feb 26, 2026",
      },
      {
        id: 207,
        name: "index.css",
        type: "File",
        modified: "Feb 25, 2026",
      },
    ],
    folder_5_2: [
      {
        id: 208,
        name: "server.js",
        type: "File",
        modified: "Feb 24, 2026",
      },
    ],
    folder_6: [
      {
        id: 113,
        name: "Q1 Kickoff Notes.docx",
        type: "File",
        modified: "Feb 23, 2026",
      },
    ],
  };

  const currentFolderId = folderStack[folderStack.length - 1].id;
  const rawItems = FILE_SYSTEM[currentFolderId] || [];
  const SORTED_ITEMS = [
    ...rawItems.filter((i) => i.type === "Folder"),
    ...rawItems.filter((i) => i.type === "File"),
  ];

  const totalPages = Math.ceil(SORTED_ITEMS.length / itemsPrePage);
  const paginatedItems = SORTED_ITEMS.slice(
    (currentPage - 1) * itemsPrePage,
    currentPage * itemsPrePage,
  );

  // --- Select All ---
  const allPageIds = paginatedItems.map((i) => i.id);
  const allSelected =
    allPageIds.length > 0 && allPageIds.every((id) => selectedIds.includes(id));
  const someSelected = allPageIds.some((id) => selectedIds.includes(id));

  const toggleSelectAll = () => {
    if (allSelected)
      setSelectedIds((p) => p.filter((id) => !allPageIds.includes(id)));
    else setSelectedIds((p) => [...new Set([...p, ...allPageIds])]);
  };

  const toggleSelectOne = (id) =>
    setSelectedIds((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
    );

  // --- Navigation ---
  const openFolder = (item) => {
    if (item.type !== "Folder" || !item.children) return;
    setFolderStack((p) => [...p, { id: item.children, name: item.name }]);
    setCurrentPage(1);
    setSelectedIds([]);
    setContextMenu(null);
  };

  const navigateToBreadcrumb = (index) => {
    setFolderStack((p) => p.slice(0, index + 1));
    setCurrentPage(1);
    setSelectedIds([]);
    setContextMenu(null);
  };

  // --- Context Menu ---
  const handleContextMenu = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, item });
  };

  const closeContextMenu = () => setContextMenu(null);

  const CONTEXT_ACTIONS = (item) => [
    ...(item.type === "Folder"
      ? [
          {
            icon: <FolderOpen size={14} />,
            label: "Open Folder",
            action: () => openFolder(item),
          },
        ]
      : [
          {
            icon: <Eye size={14} />,
            label: "Preview File",
            action: closeContextMenu,
          },
        ]),
    {
      icon: <Pencil size={14} />,
      label: "Rename",
      action: closeContextMenu,
    },
    {
      icon: <Copy size={14} />,
      label: "Copy",
      action: closeContextMenu,
    },
    {
      icon: <Scissors size={14} />,
      label: "Cut",
      action: closeContextMenu,
    },
    {
      icon: <Download size={14} />,
      label: "Download",
      action: closeContextMenu,
    },
    { divider: true },
    {
      icon: <Trash2 size={14} />,
      label: "Delete",
      action: closeContextMenu,
      danger: true,
    },
  ];

  // --- Breadcrumb display (max 3 visible + ellipsis) ---
  const renderBreadcrumbs = () => {
    const maxVisible = 3;
    if (folderStack.length <= maxVisible) {
      return folderStack.map((crumb, i) => (
        <BreadcrumbItem
          key={crumb.id}
          crumb={crumb}
          index={i}
          isLast={i === folderStack.length - 1}
          navigate={navigateToBreadcrumb}
        />
      ));
    }
    const first = folderStack[0];
    const visible = folderStack.slice(-2);
    const hiddenCount = folderStack.length - 3;
    return (
      <>
        <BreadcrumbItem
          crumb={first}
          index={0}
          isLast={false}
          navigate={navigateToBreadcrumb}
        />
        <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
        <button className="px-1.5 py-0.5 rounded text-xs text-gray-400 hover:bg-gray-100 transition-colors">
          ··· {hiddenCount > 0 ? `+${hiddenCount}` : ""}
        </button>
        {visible.map((crumb, i) => {
          const realIndex = folderStack.length - 2 + i;
          return (
            <BreadcrumbItem
              key={crumb.id}
              crumb={crumb}
              index={realIndex}
              isLast={realIndex === folderStack.length - 1}
              navigate={navigateToBreadcrumb}
            />
          );
        })}
      </>
    );
  };

  const BreadcrumbItem = ({ crumb, index, isLast, navigate }) => (
    <>
      {index > 0 && (
        <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
      )}
      <button
        onClick={() => !isLast && navigate(index)}
        className={`text-sm px-1.5 py-0.5 rounded transition-colors flex items-center gap-1
                      ${
                        isLast
                          ? "bg-light-card2 dark:bg-dark-card2 border border-light-border dark:border-dark-border text-icon-bg dark:text-icon_dark-bg font-semibold cursor-default"
                          : "text-light-text dark:text-dark-text hover:bg-light-card2 hover:text-icon-bg dark:hover:bg-dark-card2 dark:hover:text-icon_dark-bg"
                      }`}
      >
        {index === 0 ? <Home size={16} /> : null}
        {crumb.name}
      </button>
    </>
  );

  const getPageNumbers = () => {
    const delta = 1; // siblings on each side of current page

    // Build the core set: always include first, last, current ± delta
    const corePages = new Set([
      1,
      totalPages,
      currentPage,
      currentPage - delta,
      currentPage + delta,
    ]);

    // Sort and filter to valid range
    const pages = [...corePages]
      .filter((p) => p >= 1 && p <= totalPages)
      .sort((a, b) => a - b);

    // Insert "..." or fill single-page gaps
    const result = [];
    let prev = null;

    for (const page of pages) {
      if (prev !== null) {
        const gap = page - prev;
        if (gap === 2)
          result.push(prev + 1); // fill gap of 1 with real number
        else if (gap > 2) result.push("..."); // real gap → ellipsis
      }
      result.push(page);
      prev = page;
    }

    return result;
  };

  return (
    <div
      className={`w-full p-3 h-[calc(100vh-50px)] overflow-y-auto custom-scroll bg-light-bg dark:bg-dark-bg`}
    >
      {/*-----------------------------------------------------------*/
      /* HEADER SECTION */
      /*-----------------------------------------------------------*/}
      <div className="flex justify-between h-[50px]">
        {/* Heading Label */}
        <div
          className="h-fit 
          bg-card dark:bg-dark-card
          p-[6px] shadow-[0_2px_6px_rgba(200,200,200,0.5)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.5)]
          border-l-[4px] border-l-icon-bg
          rounded-[4px]"
        >
          <CustomLabel
            label_text={PhotoEditor_Label.header_Label.label}
            label_style="text-[16px] font-semibold tracking-wide text-light-text dark:text-dark-text"
          />
        </div>
      </div>

      {/*-----------------------------------------------------------*/
      /* FOLDER ACTION SECTION */
      /*-----------------------------------------------------------*/}
      <div
        className="
          inline-flex flex-col
          px-4 py-3 mt-2
          bg-light-card2 dark:bg-dark-card2
          border border-light-border dark:border-dark-border
          rounded-[10px]
          gap-3
        "
      >
        {/*-----------------------------------------------------------*/
        /* FOLDER LABEL SECTION */
        /*-----------------------------------------------------------*/}
        <CustomLabel
          label_text={PhotoEditor_Label.folder_actions_label.label}
          label_style="
            text-[15px] font-semibold tracking-wide
            text-light-text dark:text-dark-text
          "
        />

        <div className="flex flex-row gap-3">
          {/*-----------------------------------------------------------*/
          /* RECENT FOLDER SECTION BUTTON */
          /*-----------------------------------------------------------*/}
          <div className="">
            <ActionCardButton
              icon={FolderClock}
              label={PhotoEditor_Label.recent_folder_label.label}
              onClick={() => setShowRecentFolderView((prev) => !prev)}
            />
          </div>
          {/*-----------------------------------------------------------*/
          /* IMPORT FOLDER SECTION BUTTON */
          /*-----------------------------------------------------------*/}
          <ActionCardButton
            icon={ImageUp}
            label={PhotoEditor_Label.folder_import_label.label}
            onClick={() => setShowImportImageFolderView((prev) => !prev)}
          />
        </div>
      </div>

      {/*-----------------------------------------------------------*/
      /* FOLDER LAYOUT SECTION */
      /*-----------------------------------------------------------*/}
      <div className="flex flex-row gap-2 mt-4">
        {/*-----------------------------------------------------------*/
        /* FOLDER LIST VIEW SECTION */
        /*-----------------------------------------------------------*/}
        <div
          className="w-full
              flex flex-col
              px-4 py-2 custom-scroll rounded-md
              bg-light-card dark:bg-dark-card
              border border-light-border dark:border-dark-border"
        >
          {/*-----------------------------------------------------------*/
          /* FOLDER LIST LABEL SECTION */
          /*-----------------------------------------------------------*/}
          <CustomLabel
            label_text={"Folder List"}
            label_style="
              text-[15px] font-semibold tracking-wide
              text-light-text dark:text-dark-text
            "
          />
          {/*-----------------------------------------------------------*/
          /* FOLDER LIST SETTINGS */
          /*-----------------------------------------------------------*/}
          <div className="flex flex-row justify-between items-center mt-4">
            {/* Search panel */}
            <div className="flex flex-row items-center gap-2">
              <CustomImageInput
                componentStyle="w-[250px] h-[36px]"
                iconpresent={true}
                type="text"
                input_placeholder="Search folders"
                search_text={searchQuery}
                onChange_Access={(e) => setSearchQuery(e.target.value)}
                input_classname="
                      w-full h-full
                      pl-3 pr-3
                      rounded-md
                      bg-input-light-background dark:bg-input-dark-background 
                      border-[1px] border-input-light-border dark:border-input-dark-border
                      text-input-light-text dark:text-input-dark-text
                      placeholder:input-light-placeholder dark:placeholder:input-light-placeholder
                      focus:outline-none focus:ring-2 focus:input-light-border_focus
                    "
                iconStyle={
                  "w-[20px] h-[20px] text-input-light-placeholder dark:text-input-light-placeholder"
                }
                icon={data_control_icon.search_icon.icon}
              />
              <div>
                <CustomButton
                  iconSize="w-[24px] h-[24px]"
                  btn_bg_color="bg-button-danger min-w-[36px] max-w-[72px] h-[36px] p-[4px] gap-[5px] rounded-md hover:bg-button-danger-hover active:bg-button-danger-active"
                  icon_animation="group-hover:scale-110"
                  textColor="text-button-danger-text"
                  iconSrc={data_control_icon.clear.icon}
                  label={
                    <span className="flex items-center gap-1">
                      <span
                        className="min-w-[18px] h-[18px] px-[5px] text-[11px] font-extrabold
                              flex items-center justify-center
                              rounded-full bg-button-danger-100 text-light-text"
                      >
                        100
                      </span>
                    </span>
                  }
                />
              </div>
            </div>

            {/* Sub-Setting panel */}
            <div className="flex flex-row gap-[10px]">
              <div>
                <CustomButton
                  iconSize="w-[24px] h-[24px]"
                  btn_bg_color="bg-button-danger min-w-[36px] max-w-[72px] h-[36px] p-[4px] gap-[5px] rounded-md hover:bg-button-danger-hover active:bg-button-danger-active"
                  icon_animation="group-hover:scale-110"
                  textColor="text-button-danger-text"
                  iconSrc={data_control_icon.trash.icon}
                  label={
                    <span className="flex items-center gap-1">
                      <span
                        className="min-w-[18px] h-[18px] px-[5px] text-[11px] font-extrabold
                              flex items-center justify-center
                              rounded-full bg-button-danger-100 text-light-text"
                      >
                        100
                      </span>
                    </span>
                  }
                />
              </div>

              {/* clear Filter Options */}
              <div>
                <CustomButton
                  iconSize="w-[24px] h-[24px]"
                  btn_bg_color="bg-button-danger min-w-[36px] max-w-[72px] h-[36px] p-[4px] gap-[5px] rounded-md hover:bg-button-danger-hover active:bg-button-danger-active"
                  icon_animation="group-hover:scale-110"
                  textColor="text-button-danger-text"
                  iconSrc={data_control_icon.clear_filter.icon}
                  label={
                    <span
                      className="min-w-[18px] h-[18px] px-[5px] text-[11px] font-extrabold
                              flex items-center justify-center
                              rounded-full bg-button-danger-100 text-light-text"
                    >
                      100
                    </span>
                  }
                />
              </div>

              {/* Filter search*/}
              <div className="relative">
                <CustomButton
                  iconSize="w-[24px] h-[24px]"
                  btn_bg_color="bg-button-primary min-w-[96px] max-w-[124px] h-[36px] p-[4px] gap-[5px] rounded-md hover:bg-button-primary-hover active:bg-button-primary-active"
                  icon_animation="group-hover:scale-110"
                  textColor="text-button-primary-text"
                  label={
                    <span className="flex items-center gap-1">
                      {data_control_icon.filter_icon.label}

                      <span
                        className="min-w-[18px] h-[18px] px-[5px] text-[11px] font-extrabold
                              flex items-center justify-center
                              rounded-full bg-icon-200 text-light-text"
                      >
                        100
                      </span>
                    </span>
                  }
                  iconSrc={data_control_icon.filter_icon.icon}
                />

                {/* Filter Panel */}
                {/* {showFilter && (
                      <div
                        ref={filterRef}
                        className="
                        absolute right-0 mt-2
                        w-[250px] h-fit
                        bg-light-card dark:bg-dark-card
                        border border-light-border dark:border-dark-border
                        rounded-lg shadow-lg
                        p-4 z-50
                      "
                      >
                        <HistoryFilterPanel
                          filters={filters}
                          setFilters={setFilters}
                        />
                      </div>
                    )} */}
              </div>

              {/* SortBy search */}
              <div className="relative">
                <CustomButton
                  iconSize="w-[24px] h-[24px]"
                  btn_bg_color="bg-button-primary h-[36px] p-[4px] gap-[5px] rounded-md hover:bg-button-primary-hover active:bg-button-primary-active"
                  icon_animation="group-hover:scale-110"
                  textColor="text-button-primary-text"
                  label={
                    <span className="flex items-center gap-1">
                      {data_control_icon.sort_ascending.label}
                      <span
                        className="min-w-[18px] h-[18px] px-[5px] text-[11px] font-extrabold
                              flex items-center justify-center
                              rounded-full bg-icon-200 text-light-text"
                      >
                        100
                      </span>
                    </span>
                  }
                  iconSrc={data_control_icon.sort_ascending.icon}
                />
                {/* {showSort && (
                      <div
                        ref={sortRef}
                        className="
                        absolute right-0 mt-2
                        w-[250px] h-fit
                        bg-light-card dark:bg-dark-card
                        border border-light-border dark:border-dark-border
                        rounded-lg shadow-lg
                        p-4 z-50
                      "
                      >
                        <HistorySortPanel sort={sort} setSort={setSort} />
                      </div>
                    )} */}
              </div>

              {/* Group By Order */}
              <div
                className="w-fit h-[36px] flex items-center p-[2px] gap-1 
                    border border-light-border dark:border-dark-border rounded-md overflow-hidden shadow-sm"
              >
                {/* Grid Button */}
                <button
                  onClick={() => changeView("grid")}
                  className={`flex w-[32px] h-full items-center justify-center rounded-md transition-colors duration-150
                        ${
                          viewMode === "grid"
                            ? "bg-button-primary hover:bg-button-primary-hover active:bg-button-primary-active text-white"
                            : "text-light-text dark:text-dark-text"
                        }`}
                >
                  <LayoutGrid size={16} />
                </button>
                {/* Divider */}
                <div className="w-px h-4 bg-light-border dark:bg-dark-border flex-shrink-0" />
                {/* List Button */}
                <button
                  onClick={() => changeView("list")}
                  className={`flex w-[32px] h-full items-center justify-center rounded-md transition-colors duration-150
                      ${
                        viewMode === "list"
                          ? "bg-button-primary hover:bg-button-primary-hover active:bg-button-primary-active text-white"
                          : "text-light-text dark:text-dark-text"
                      }`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/*-----------------------------------------------------------*/
          /* FOLDER LIST PANEL VIEW */
          /*-----------------------------------------------------------*/}
          <div className="flex flex-col my-[20px]" onClick={closeContextMenu}>
            {/*-----------------------------------------------------------*/}
            {/* BREADCRUMB BAR */}
            {/*-----------------------------------------------------------*/}
            <div className="flex items-center gap-1 px-4 py-2.5 bg-light-card1 dark:bg-dark-card1 border border-light-border dark:border-dark-border rounded-t-xl">
              {/* Back Button */}
              <button
                onClick={() =>
                  folderStack.length > 1 &&
                  navigateToBreadcrumb(folderStack.length - 2)
                }
                disabled={folderStack.length === 1}
                className={`p-1.5 rounded-lg mr-1 transition-colors
                          ${
                            folderStack.length === 1
                              ? "text-light-text_muted/20 dark:text-dark-text_muted/20  border border-light-border dark:border-dark-border cursor-not-allowed"
                              : "text-light-text_muted dark:text-dark-text_muted bg-light-bg dark:bg-dark-bg hover:bg-light-hover dark:hover:bg-dark-hover border border-light-border dark:border-dark-border"
                          }`}
              >
                <ChevronLeft size={16} />
              </button>

              {/* Divider */}
              <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mr-2 flex-shrink-0" />

              {/* Breadcrumbs */}
              <div className="flex items-center gap-0.5 flex-wrap">
                {renderBreadcrumbs()}
              </div>

              {/* Item count */}
              <span className="ml-auto text-xs text-gray-400 flex-shrink-0">
                {SORTED_ITEMS.length} item
                {SORTED_ITEMS.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/*-----------------------------------------------------------*/}
            {/* SELECT BANNER */}
            {/*-----------------------------------------------------------*/}
            {selectedIds.length > 0 && (
              <div className="h-12 flex items-center justify-between px-4 py-2 bg-icon-50/20 dark:bg-icon-900/20 border-x border-light-border_strong dark:border-dark-border_strong text-sm">
                <span className="font-bold text-sm bg-light-bg dark:bg-dark-bg p-2 rounded-md text-icon-bg dark:text-icon_dark-bg">
                  ({selectedIds.length}) item
                  {selectedIds.length > 1 ? "s" : ""} selected
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      setSelectedIds(SORTED_ITEMS.map((i) => i.id))
                    }
                    className="flex flex-row gap-1 justify-center items-center text-sm bg-icon-bg dark:bg-icon_dark-bg rounded-md p-2 hover:bg-icon-bg/80 dark:hover:bg-icon_dark-bg/80 text-white transition-colors"
                  >
                    <SquareCheckBig size={16} />
                    Select all ({SORTED_ITEMS.length})
                  </button>

                  <button
                    onClick={() => setSelectedIds([])}
                    className=" flex flex-row gap-1 justify-center items-center text-sm bg-button-danger text-button-danger-text p-2 hover:bg-button-danger-hover rounded-md transition-colors"
                  >
                    <SquareX size={16} />
                    Clear
                  </button>
                </div>
              </div>
            )}

            {/*-----------------------------------------------------------*/}
            {/* TABLE */}
            {/*-----------------------------------------------------------*/}
            <div className="flex flex-col min-h-[300px] max-h-[600px] overflow-y-auto custom-scroll  border-x border-light-border dark:border-dark-border">
              {/* Header */}
              <div
                className="
                  w-full grid grid-cols-[40px_1fr_150px_150px_100px]
                  items-center px-4 py-4
                  bg-light-card1 dark:bg-dark-card1
                  border-b border-light-border dark:border-dark-border
                  text-sm font-medium text-light-text1 dark:text-dark-text1
                  sticky top-0 z-[10]
                "
              >
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected && !allSelected;
                    }}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded accent-icon-500 cursor-pointer"
                  />
                </div>
                <div className="pl-2 font-extrabold">
                  <CustomLabel label_text="Name" />
                </div>
                <div className="pl-2 font-extrabold">
                  <CustomLabel label_text="Type" />
                </div>
                <div className="pl-2 font-extrabold">
                  <CustomLabel label_text="Last Modified" />
                </div>
                <div className="pl-2 font-extrabold flex justify-end items-center">
                  <CustomLabel label_text="Actions" />
                </div>
              </div>

              {/* Empty State */}
              {paginatedItems.length === 0 && (
                <div className="flex flex-col items-center justify-center flex-1 py-16 text-gray-400">
                  <Folder size={40} className="mb-3 text-gray-300" />
                  <p className="text-sm">This folder is empty</p>
                </div>
              )}

              {/* Rows */}
              {paginatedItems.map((item, index) => {
                const isSelected = selectedIds.includes(item.id);
                const isFolder = item.type === "Folder";
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleSelectOne(item.id)}
                    onDoubleClick={() => isFolder && openFolder(item)}
                    onContextMenu={(e) => handleContextMenu(e, item)}
                    className={`
                      w-full grid grid-cols-[40px_1fr_150px_150px_100px]
                      items-center px-4 py-3
                      border-b border-light-border dark:border-dark-border
                      text-sm text-light-text1 dark:text-dark-text1
                      transition-colors duration-100 select-none
                      ${isFolder ? "cursor-pointer" : "cursor-default"}
                      ${
                        isSelected
                          ? "bg-icon-50/20 dark:bg-icon-900/20"
                          : "bg-light-card1 dark:bg-dark-card1 hover:bg-light-hover dark:hover:bg-dark-hover"
                      }
                    `}
                  >
                    {/* Checkbox */}
                    <div
                      className="flex items-center justify-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(item.id)}
                        className="w-4 h-4 rounded accent-icon-500 cursor-pointer"
                      />
                    </div>

                    {/* Name */}
                    <div className="pl-2 flex items-center gap-2 font-medium truncate">
                      {isFolder ? (
                        <Folder
                          size={24}
                          className="text-icon-bg dark:text-icon_dark-bg flex-shrink-0"
                        />
                      ) : (
                        <FileText
                          size={24}
                          className="text-icon-bg dark:text-icon_dark-bg flex-shrink-0"
                        />
                      )}
                      <span className="truncate">{item.name}</span>
                      {isFolder &&
                        item.children &&
                        FILE_SYSTEM[item.children]?.length > 0 && (
                          <span className="text-xs text-gray-400 font-normal flex-shrink-0">
                            ({FILE_SYSTEM[item.children].length})
                          </span>
                        )}
                    </div>

                    {/* Type Badge */}
                    <div className="pl-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                          bg-icon-100 text-icon-bg dark:bg-dark-bg dark:text-icon_dark-bg`}
                      >
                        {item.type}
                      </span>
                    </div>

                    {/* Modified */}
                    <div className="pl-2 text-gray-500 dark:text-gray-400">
                      {item.modified}
                    </div>

                    {/* Actions */}
                    <div
                      className="flex items-center justify-end gap-1 pr-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onDoubleClick={(e) => e.stopPropagation()}
                        onClick={() => isFolder && openFolder(item)}
                        className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onDoubleClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/*-----------------------------------------------------------*/}
            {/* PAGINATION */}
            {/*-----------------------------------------------------------*/}
            <div className="min-h-[50px] w-full flex items-center justify-between px-4 py-3 border border-light-border dark:border-dark-border bg-light-card1 dark:bg-dark-card1 rounded-b-xl">
              {/* Left: Showing info + Items per page selector */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">
                  Showing {(currentPage - 1) * itemsPrePage + 1}–
                  {Math.min(currentPage * itemsPrePage, SORTED_ITEMS.length)} of{" "}
                  {SORTED_ITEMS.length} items
                </span>

                <PageSizeSelector
                  value={itemsPrePage}
                  onChange={(size) => {
                    setItemsPerPage(size);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <div className="flex items-center gap-2">
                {/* Previous */}
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors
                    ${
                      currentPage === 1
                        ? "text-gray-300 border-transparent cursor-not-allowed"
                        : "text-icon-seleceted_text border-light-border dark:border-dark-border hover:border-transparent hover:bg-button-primary-hover hover:text-button-primary-text"
                    }`}
                >
                  Previous
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((page, index) =>
                  page === "..." ? (
                    <span
                      key={`dots-${index}`}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm"
                    >
                      ···
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors
                        ${
                          currentPage === page
                            ? "border border-button-primary text-icon-selected_text"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                    >
                      {page}
                    </button>
                  ),
                )}

                {/* Next */}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                    ${
                      currentPage === totalPages
                        ? "text-gray-300 border-transparent cursor-not-allowed"
                        : "bg-button-primary text-button-primary-text hover:bg-button-primary-hover"
                    }`}
                >
                  Next
                </button>
              </div>
            </div>

            {/*-----------------------------------------------------------*/}
            {/* CONTEXT MENU */}
            {/*-----------------------------------------------------------*/}
            {contextMenu && (
              <div
                className="fixed z-[999] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl py-1.5 w-48 text-sm"
                style={{ top: contextMenu.y, left: contextMenu.x }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Item name header */}
                <div className="px-3 py-1.5 mb-1 border-b border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-400 truncate font-medium">
                    {contextMenu.item.name}
                  </p>
                </div>

                {CONTEXT_ACTIONS(contextMenu.item).map((action, i) =>
                  action.divider ? (
                    <div
                      key={i}
                      className="my-1 border-t border-gray-100 dark:border-gray-800"
                    />
                  ) : (
                    <button
                      key={i}
                      onClick={action.action}
                      className={`flex items-center gap-2.5 w-full px-3 py-2 transition-colors
                              ${
                                action.danger
                                  ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                              }`}
                    >
                      {action.icon}
                      {action.label}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>
        </div>

        {/*-----------------------------------------------------------*/
        /* FOLDER PREVIEW PANEL SECTION */
        /*-----------------------------------------------------------*/}
        <div
          className="w-[300px] min-h-[550px] max-h-[750px] overflow-y-auto custom-scroll 
              px-[12px] rounded-md
              bg-light-card1 dark:bg-dark-card1 
              border border-light-border dark:border-dark-border"
        >
          <PreviewPanel
            selectedIds={selectedIds}
            contextMenu={contextMenu}
            FILE_SYSTEM={FILE_SYSTEM}
            folderStack={folderStack}
          />
        </div>
      </div>
      <FileExplorer />
      <ImportManager />
    </div>
  );
};

export default PhotoEditor;
