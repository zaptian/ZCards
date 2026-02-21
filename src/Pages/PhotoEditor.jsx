// import React from "react";

// const PhotoEditor = () => {
//   return <div>PhotoEdit</div>;
// };

// export default PhotoEditor;

import React, { useState, useRef, useEffect } from "react";
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
} from "lucide-react";

export default function PhotoEditor() {
  const [photos, setPhotos] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState(new Set());
  const [theme, setTheme] = useState("dark");
  const [webcamActive, setWebcamActive] = useState(false);
  const [settings, setSettings] = useState({
    cropStyle: "passport",
    bgColor: "#ffffff",
    bgRemoval: true,
    faceAlign: true,
  });

  const fileInputRef = useRef(null);
  const webcamRef = useRef(null);
  const streamRef = useRef(null);

  const isDark = theme === "dark";

  // Simulated photo analysis
  const analyzePhoto = () => {
    const statuses = [];

    if (Math.random() > 0.2) {
      statuses.push({ type: "success", text: "Face detected", icon: Check });
    } else {
      statuses.push({ type: "error", text: "No face", icon: X });
    }

    if (Math.random() > 0.3) {
      statuses.push({ type: "success", text: "High res", icon: Check });
    } else {
      statuses.push({
        type: "warning",
        text: "Low res",
        icon: AlertTriangle,
        tooltip: "Resolution below 600x600px",
      });
    }

    return statuses;
  };

  const handleFiles = (files) => {
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newPhoto = {
            id: Date.now() + Math.random(),
            src: e.target.result,
            name: file.name,
            size: file.size,
            status: analyzePhoto(),
          };
          setPhotos((prev) => [...prev, newPhoto]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      if (webcamRef.current) {
        webcamRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setWebcamActive(true);
    } catch (err) {
      alert("Camera access denied");
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setWebcamActive(false);
  };

  const capturePhoto = () => {
    if (webcamRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = webcamRef.current.videoWidth;
      canvas.height = webcamRef.current.videoHeight;
      canvas.getContext("2d").drawImage(webcamRef.current, 0, 0);

      canvas.toBlob(
        (blob) => {
          const file = new File([blob], `capture-${Date.now()}.jpg`, {
            type: "image/jpeg",
          });
          const reader = new FileReader();
          reader.onload = (e) => {
            const newPhoto = {
              id: Date.now() + Math.random(),
              src: e.target.result,
              name: file.name,
              size: file.size,
              status: analyzePhoto(),
            };
            setPhotos((prev) => [...prev, newPhoto]);
            stopWebcam();
          };
          reader.readAsDataURL(file);
        },
        "image/jpeg",
        0.95,
      );
    }
  };

  const togglePhotoSelection = (id) => {
    setSelectedPhotos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    if (selectedPhotos.size === photos.length) {
      setSelectedPhotos(new Set());
    } else {
      setSelectedPhotos(new Set(photos.map((p) => p.id)));
    }
  };

  const deleteSelected = () => {
    setPhotos((prev) => prev.filter((p) => !selectedPhotos.has(p.id)));
    setSelectedPhotos(new Set());
  };

  const fixAllPhotos = () => {
    setPhotos((prev) =>
      prev.map((photo) => ({
        ...photo,
        status: [
          { type: "success", text: "Face detected", icon: Check },
          { type: "success", text: "High res", icon: Check },
        ],
      })),
    );
  };

  const hasIssues = photos.some((p) =>
    p.status.some((s) => s.type !== "success"),
  );

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100"
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-slate-900"
      }`}
    >
      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={`fixed top-6 right-6 z-50 p-3 rounded-2xl backdrop-blur-xl border transition-all hover:scale-105 ${
          isDark
            ? "bg-zinc-800/80 border-zinc-700/50 hover:bg-zinc-700/80"
            : "bg-white/80 border-slate-200/50 hover:bg-slate-50/80"
        }`}
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-amber-400" />
        ) : (
          <Moon className="w-5 h-5 text-indigo-600" />
        )}
      </button>

      <div className="max-w-[1800px] mx-auto p-6">
        <div
          className={`rounded-3xl overflow-hidden backdrop-blur-xl border shadow-2xl transition-colors ${
            isDark
              ? "bg-zinc-900/50 border-zinc-800/50"
              : "bg-white/60 border-slate-200/50"
          }`}
        >
          <div className="grid lg:grid-cols-[320px_1fr_380px] gap-0">
            {/* Left Sidebar */}
            <div
              className={`p-8 border-r transition-colors ${
                isDark
                  ? "bg-zinc-900/80 border-zinc-800/50"
                  : "bg-slate-50/80 border-slate-200/50"
              }`}
            >
              {/* Logo & Title */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isDark
                        ? "bg-gradient-to-br from-violet-600 to-fuchsia-600"
                        : "bg-gradient-to-br from-indigo-500 to-purple-600"
                    }`}
                  >
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold tracking-tight">
                      PhotoMatic
                    </h1>
                    <p
                      className={`text-xs ${isDark ? "text-zinc-500" : "text-slate-500"}`}
                    >
                      AI-Powered
                    </p>
                  </div>
                </div>
              </div>

              {/* Upload Section */}
              <div className="space-y-4 mb-8">
                <h3
                  className={`text-xs font-bold uppercase tracking-wider mb-4 ${
                    isDark ? "text-zinc-500" : "text-slate-500"
                  }`}
                >
                  Upload
                </h3>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFiles(e.target.files)}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFiles(e.dataTransfer.files);
                  }}
                  className={`relative group cursor-pointer rounded-2xl border-2 border-dashed p-8 transition-all hover:scale-[1.02] ${
                    isDark
                      ? "border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 hover:border-violet-500"
                      : "border-slate-300 bg-white hover:bg-slate-50 hover:border-indigo-400"
                  }`}
                >
                  <div className="text-center">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-colors ${
                        isDark
                          ? "bg-zinc-700 group-hover:bg-violet-600"
                          : "bg-slate-100 group-hover:bg-indigo-500"
                      }`}
                    >
                      <Upload
                        className={`w-7 h-7 transition-colors ${
                          isDark
                            ? "text-zinc-400 group-hover:text-white"
                            : "text-slate-600 group-hover:text-white"
                        }`}
                      />
                    </div>
                    <p
                      className={`font-semibold mb-1 ${isDark ? "text-zinc-300" : "text-slate-700"}`}
                    >
                      Drop photos here
                    </p>
                    <p
                      className={`text-xs ${isDark ? "text-zinc-600" : "text-slate-400"}`}
                    >
                      or click to browse
                    </p>
                  </div>
                </div>

                <button
                  onClick={startWebcam}
                  className={`w-full p-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 hover:scale-[1.02] ${
                    isDark
                      ? "bg-zinc-800 hover:bg-zinc-700 border border-zinc-700"
                      : "bg-white hover:bg-slate-50 border border-slate-200 shadow-sm"
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  Capture Photo
                </button>
              </div>

              {/* Batch Actions */}
              <div className="space-y-3">
                <h3
                  className={`text-xs font-bold uppercase tracking-wider mb-4 ${
                    isDark ? "text-zinc-500" : "text-slate-500"
                  }`}
                >
                  Batch Actions
                </h3>

                <button
                  onClick={selectAll}
                  disabled={photos.length === 0}
                  className={`w-full p-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed ${
                    isDark
                      ? "bg-zinc-800 hover:bg-zinc-700 border border-zinc-700"
                      : "bg-white hover:bg-slate-50 border border-slate-200"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  {selectedPhotos.size === photos.length
                    ? "Deselect All"
                    : "Select All"}
                </button>

                <button
                  onClick={deleteSelected}
                  disabled={selectedPhotos.size === 0}
                  className={`w-full p-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed ${
                    isDark
                      ? "bg-red-900/30 hover:bg-red-900/50 border border-red-800/50 text-red-400"
                      : "bg-red-50 hover:bg-red-100 border border-red-200 text-red-700"
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Selected ({selectedPhotos.size})
                </button>

                <button
                  disabled={selectedPhotos.size === 0}
                  className={`w-full p-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed ${
                    isDark
                      ? "bg-emerald-900/30 hover:bg-emerald-900/50 border border-emerald-800/50 text-emerald-400"
                      : "bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700"
                  }`}
                >
                  <Download className="w-4 h-4" />
                  Download ({selectedPhotos.size})
                </button>
              </div>
            </div>

            {/* Center Content */}
            <div
              className={`p-8 overflow-y-auto max-h-[calc(100vh-3rem)] ${
                isDark ? "bg-zinc-950/50" : "bg-slate-50/30"
              }`}
            >
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                  Your Photos
                </h2>
                <p
                  className={`text-sm ${isDark ? "text-zinc-500" : "text-slate-500"}`}
                >
                  {photos.length} photo{photos.length !== 1 ? "s" : ""} •{" "}
                  {selectedPhotos.size} selected
                </p>
              </div>

              {/* Fix All Banner */}
              {hasIssues && photos.length > 0 && (
                <div
                  className={`mb-8 p-6 rounded-2xl backdrop-blur-xl border ${
                    isDark
                      ? "bg-gradient-to-r from-violet-900/40 to-fuchsia-900/40 border-violet-700/50"
                      : "bg-gradient-to-r from-indigo-100 to-purple-100 border-indigo-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap
                          className={`w-5 h-5 ${isDark ? "text-violet-400" : "text-indigo-600"}`}
                        />
                        <h3 className="font-bold">Auto-Fix Available</h3>
                      </div>
                      <p
                        className={`text-sm ${isDark ? "text-zinc-400" : "text-slate-600"}`}
                      >
                        Automatically enhance all photos with AI
                      </p>
                    </div>
                    <button
                      onClick={fixAllPhotos}
                      className={`px-6 py-3 rounded-xl font-bold shadow-lg transition-all hover:scale-105 ${
                        isDark
                          ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:shadow-violet-500/50"
                          : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-indigo-500/50"
                      }`}
                    >
                      Fix All
                    </button>
                  </div>
                </div>
              )}

              {/* Photo Grid */}
              {photos.length === 0 ? (
                <div className="text-center py-20">
                  <div
                    className={`w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center ${
                      isDark ? "bg-zinc-800" : "bg-slate-100"
                    }`}
                  >
                    <ImageIcon
                      className={`w-12 h-12 ${isDark ? "text-zinc-600" : "text-slate-400"}`}
                    />
                  </div>
                  <h3
                    className={`text-xl font-bold mb-2 ${isDark ? "text-zinc-400" : "text-slate-600"}`}
                  >
                    No photos yet
                  </h3>
                  <p
                    className={`text-sm ${isDark ? "text-zinc-600" : "text-slate-400"}`}
                  >
                    Upload or capture to get started
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {photos.map((photo) => {
                    const isSelected = selectedPhotos.has(photo.id);
                    return (
                      <div
                        key={photo.id}
                        onClick={() => togglePhotoSelection(photo.id)}
                        className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02] ${
                          isSelected
                            ? isDark
                              ? "ring-4 ring-violet-500 shadow-2xl shadow-violet-500/30"
                              : "ring-4 ring-indigo-500 shadow-2xl shadow-indigo-500/30"
                            : "hover:shadow-xl"
                        } ${isDark ? "bg-zinc-800" : "bg-white"}`}
                      >
                        <div className="aspect-square relative">
                          <img
                            src={photo.src}
                            alt={photo.name}
                            className="w-full h-full object-cover"
                          />

                          {/* Selection Indicator */}
                          <div
                            className={`absolute top-3 left-3 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                              isSelected
                                ? isDark
                                  ? "bg-violet-600 scale-100"
                                  : "bg-indigo-600 scale-100"
                                : "bg-black/50 scale-0 group-hover:scale-100"
                            }`}
                          >
                            {isSelected && (
                              <Check className="w-4 h-4 text-white" />
                            )}
                          </div>

                          {/* Status Badges */}
                          <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                            {photo.status.map((status, idx) => {
                              const Icon = status.icon;
                              return (
                                <div
                                  key={idx}
                                  className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 backdrop-blur-md shadow-lg ${
                                    status.type === "success"
                                      ? "bg-emerald-500/90 text-white"
                                      : status.type === "warning"
                                        ? "bg-amber-500/90 text-white"
                                        : "bg-red-500/90 text-white"
                                  }`}
                                  title={status.tooltip}
                                >
                                  <Icon className="w-3 h-3" />
                                  <span className="hidden sm:inline">
                                    {status.text}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="p-3">
                          <p
                            className={`text-sm font-semibold truncate ${
                              isDark ? "text-zinc-300" : "text-slate-700"
                            }`}
                          >
                            {photo.name}
                          </p>
                          <p
                            className={`text-xs ${isDark ? "text-zinc-600" : "text-slate-400"}`}
                          >
                            {formatFileSize(photo.size)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div
              className={`p-8 border-l overflow-y-auto max-h-[calc(100vh-3rem)] transition-colors ${
                isDark
                  ? "bg-zinc-900/80 border-zinc-800/50"
                  : "bg-slate-50/80 border-slate-200/50"
              }`}
            >
              {/* Settings */}
              <div className="mb-8">
                <h3
                  className={`text-xs font-bold uppercase tracking-wider mb-6 ${
                    isDark ? "text-zinc-500" : "text-slate-500"
                  }`}
                >
                  Auto-Adjust Settings
                </h3>

                {/* Crop Style */}
                <div className="mb-6">
                  <label
                    className={`text-sm font-bold mb-3 block ${
                      isDark ? "text-zinc-300" : "text-slate-700"
                    }`}
                  >
                    Crop Style
                  </label>
                  <div className="space-y-2">
                    {[
                      'Passport (2×2")',
                      'Visa (2×2")',
                      "Square (1:1)",
                      "Profile (4:5)",
                    ].map((style, idx) => {
                      const value = ["passport", "visa", "square", "profile"][
                        idx
                      ];
                      const isSelected = settings.cropStyle === value;
                      return (
                        <button
                          key={value}
                          onClick={() =>
                            setSettings({ ...settings, cropStyle: value })
                          }
                          className={`w-full p-3 rounded-xl text-sm font-medium text-left transition-all ${
                            isSelected
                              ? isDark
                                ? "bg-violet-600 text-white"
                                : "bg-indigo-600 text-white"
                              : isDark
                                ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                                : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {style}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Background Color */}
                <div className="mb-6">
                  <label
                    className={`text-sm font-bold mb-3 block ${
                      isDark ? "text-zinc-300" : "text-slate-700"
                    }`}
                  >
                    Background Color
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {["#ffffff", "#e8f4ff", "#f0f0f0", "#fff9e6"].map(
                      (color) => (
                        <button
                          key={color}
                          onClick={() =>
                            setSettings({ ...settings, bgColor: color })
                          }
                          className={`aspect-square rounded-xl transition-all hover:scale-110 ${
                            settings.bgColor === color
                              ? "ring-4 ring-offset-2 " +
                                (isDark
                                  ? "ring-violet-500 ring-offset-zinc-900"
                                  : "ring-indigo-500 ring-offset-slate-50")
                              : "hover:ring-2 " +
                                (isDark
                                  ? "hover:ring-zinc-600"
                                  : "hover:ring-slate-300")
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ),
                    )}
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-3">
                  <div
                    className={`p-4 rounded-xl flex items-center justify-between ${
                      isDark
                        ? "bg-zinc-800"
                        : "bg-white border border-slate-200"
                    }`}
                  >
                    <span
                      className={`text-sm font-medium ${isDark ? "text-zinc-300" : "text-slate-700"}`}
                    >
                      Background Removal
                    </span>
                    <button
                      onClick={() =>
                        setSettings({
                          ...settings,
                          bgRemoval: !settings.bgRemoval,
                        })
                      }
                      className={`w-12 h-6 rounded-full transition-all ${
                        settings.bgRemoval
                          ? isDark
                            ? "bg-violet-600"
                            : "bg-indigo-600"
                          : isDark
                            ? "bg-zinc-700"
                            : "bg-slate-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          settings.bgRemoval
                            ? "translate-x-6"
                            : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  <div
                    className={`p-4 rounded-xl flex items-center justify-between ${
                      isDark
                        ? "bg-zinc-800"
                        : "bg-white border border-slate-200"
                    }`}
                  >
                    <span
                      className={`text-sm font-medium ${isDark ? "text-zinc-300" : "text-slate-700"}`}
                    >
                      Face Auto-Alignment
                    </span>
                    <button
                      onClick={() =>
                        setSettings({
                          ...settings,
                          faceAlign: !settings.faceAlign,
                        })
                      }
                      className={`w-12 h-6 rounded-full transition-all ${
                        settings.faceAlign
                          ? isDark
                            ? "bg-violet-600"
                            : "bg-indigo-600"
                          : isDark
                            ? "bg-zinc-700"
                            : "bg-slate-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          settings.faceAlign
                            ? "translate-x-6"
                            : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div
                className={`p-5 rounded-2xl ${
                  isDark ? "bg-zinc-800/50" : "bg-white border border-slate-200"
                }`}
              >
                <h4
                  className={`text-xs font-bold uppercase tracking-wider mb-4 ${
                    isDark ? "text-zinc-500" : "text-slate-500"
                  }`}
                >
                  Preview on ID
                </h4>
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200">
                  {photos.length > 0 ? (
                    <img
                      src={photos[photos.length - 1].src}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Eye className="w-12 h-12 text-zinc-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3/5 h-4/5 border-2 border-dashed border-white/60 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Webcam Modal */}
      {webcamActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div
            className={`max-w-2xl w-full rounded-3xl overflow-hidden ${
              isDark ? "bg-zinc-900" : "bg-white"
            }`}
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Capture Photo</h2>
              <div className="relative rounded-2xl overflow-hidden bg-black mb-6">
                <video
                  ref={webcamRef}
                  autoPlay
                  playsInline
                  className="w-full"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-1/2 h-3/4 border-4 border-violet-500/60 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]" />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={capturePhoto}
                  className="flex-1 px-6 py-4 rounded-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:scale-105 transition-transform"
                >
                  <Camera className="w-5 h-5 inline mr-2" />
                  Capture
                </button>
                <button
                  onClick={stopWebcam}
                  className={`flex-1 px-6 py-4 rounded-xl font-bold transition-all ${
                    isDark
                      ? "bg-zinc-800 hover:bg-zinc-700"
                      : "bg-slate-100 hover:bg-slate-200"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
