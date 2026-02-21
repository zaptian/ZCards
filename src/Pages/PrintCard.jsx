// import React from 'react'

// const PrintCard = () => {
//   return (
//     <div>
//       printCards

//     </div>
//   )
// }

// export default PrintCard

import React, { useState, useRef, useEffect } from "react";
import {
  Printer,
  Scissors,
  Settings,
  FileOutput,
  Eye,
  EyeOff,
  Check,
  Download,
  RotateCw,
  Sun,
  Moon,
  CreditCard,
  Save,
  ChevronRight,
  Zap,
  DollarSign,
  Upload,
  X,
  AlertCircle,
  FileText,
  Image,
  TrendingUp,
} from "lucide-react";

// Theme Context
const ThemeContext = React.createContext();

// Theme Toggle Component
const ThemeToggle = () => {
  const { theme, toggleTheme } = React.useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-gray-700" />
      )}
    </button>
  );
};

// File Upload Component
const FileUploadPanel = ({ onFileUpload, uploadedFile }) => {
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        onFileUpload(file);
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="mb-6">
      {!uploadedFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 sm:p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-800"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-8 h-8 sm:w-10 sm:h-10 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
          <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
            Upload ID Card Design
          </p>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
            PNG, JPG, or GIF (Max 10MB)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-4">
          <button
            onClick={() => onFileUpload(null)}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-3">
            <Image className="w-8 h-8 text-blue-500 flex-shrink-0" />
            <div className="text-left flex-1">
              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                {uploadedFile.name}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Preview Card Component
const CardPreview = ({ imageSrc, front = true, type = "pvc" }) => {
  return (
    <div className="relative">
      <div
        className={`
        ${type === "pvc" ? "w-40 h-60 sm:w-52 sm:h-80" : "w-48 h-28 sm:w-56 sm:h-36"}
        rounded-2xl border-2 border-gray-300 dark:border-gray-600 
        bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900
        shadow-lg transform transition-transform hover:scale-105 overflow-hidden
      `}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="Card Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="p-4 sm:p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                {type === "pvc" ? "PVC" : "CARD"}
              </span>
            </div>

            <div className="flex-1">
              <div className="h-3 sm:h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2 sm:mb-3" />
              <div className="h-3 sm:h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2 sm:mb-3 w-3/4" />
              <div className="h-3 sm:h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2 sm:mb-3 w-1/2" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="h-2 sm:h-3 bg-gray-400 dark:bg-gray-600 rounded mb-1 sm:mb-2 w-16 sm:w-20" />
                <div className="h-4 sm:h-6 bg-gray-400 dark:bg-gray-600 rounded w-24 sm:w-32" />
              </div>
              {front && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Preview
                </div>
              )}
            </div>
          </div>
        )}

        {/* Corner decoration */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
      </div>
    </div>
  );
};

// Sheet Preview Component
const SheetPreview = ({ cards = 10, orientation = "portrait" }) => {
  const isPortrait = orientation === "portrait";
  const cardWidth = 56;
  const cardHeight = 86;
  const cardSpacingX = 60;
  const cardSpacingY = 90;
  const cardsPerRow = 3;

  return (
    <div className="relative">
      <div
        className={`
        ${isPortrait ? "w-48 h-80 sm:w-64 sm:h-96" : "w-80 h-48 sm:w-96 sm:h-64"}
        bg-white dark:bg-gray-900 border-2 border-gray-400 dark:border-gray-700
        shadow-2xl rounded-lg overflow-hidden relative
      `}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ pointerEvents: "none" }}
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="grid"
              width={cardSpacingX}
              height={cardSpacingY}
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="0"
                x2={cardSpacingX}
                y2="0"
                stroke="rgba(59, 130, 246, 0.2)"
                strokeWidth="1"
                strokeDasharray="3,3"
              />
              <line
                x1="0"
                y1="0"
                x2="0"
                y2={cardSpacingY}
                stroke="rgba(59, 130, 246, 0.2)"
                strokeWidth="1"
                strokeDasharray="3,3"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: cards }).map((_, i) => {
            const col = i % cardsPerRow;
            const row = Math.floor(i / cardsPerRow);
            const left = col * cardSpacingX + 2;
            const top = row * cardSpacingY + 2;

            return (
              <div
                key={i}
                className="absolute border border-red-400/40 hover:border-red-500/70 transition-colors"
                style={{
                  width: `${cardWidth}px`,
                  height: `${cardHeight}px`,
                  left: `${left}px`,
                  top: `${top}px`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/20 dark:from-blue-900/10 dark:to-purple-900/10" />
                <div className="absolute top-0.5 left-0.5 text-[6px] sm:text-[8px] text-red-500 font-semibold">
                  {i + 1}
                </div>
              </div>
            );
          })}
        </div>

        <div className="absolute bottom-2 right-2 px-2 py-1 bg-gray-800/90 text-white text-xs rounded-lg z-10">
          A4 • {cards}
        </div>
      </div>

      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 flex items-center space-x-1">
        <Scissors className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
        <span className="text-xs font-semibold text-red-600 dark:text-red-400">
          Cut Lines
        </span>
        <Scissors className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
      </div>
    </div>
  );
};

// Print Settings Panel
const PrintSettingsPanel = ({ settings, onSettingsChange }) => {
  const printers = [
    { id: "hp-officejet", name: "HP OfficeJet Pro", type: "inkjet" },
    { id: "epson-eco", name: "Epson EcoTank", type: "inkjet" },
    { id: "brother-laser", name: "Brother Laser", type: "laser" },
    { id: "canon-pixma", name: "Canon PIXMA", type: "inkjet" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Printer Type
        </label>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {printers.map((printer) => (
            <button
              key={printer.id}
              onClick={() =>
                onSettingsChange({ ...settings, printer: printer.id })
              }
              className={`
                p-3 sm:p-4 rounded-xl border-2 transition-all text-sm
                ${
                  settings.printer === printer.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
                }
              `}
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Printer
                  className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${
                    printer.type === "laser" ? "text-red-500" : "text-blue-500"
                  }`}
                />
                <div className="text-left hidden sm:block">
                  <div className="font-medium text-gray-800 dark:text-gray-200 text-xs sm:text-sm">
                    {printer.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {printer.type.toUpperCase()}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Orientation
        </label>
        <div className="flex gap-2 sm:gap-4">
          {["portrait", "landscape"].map((orientation) => (
            <button
              key={orientation}
              onClick={() => onSettingsChange({ ...settings, orientation })}
              className={`
                flex-1 p-3 sm:p-4 rounded-xl border-2 transition-all
                ${
                  settings.orientation === orientation
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
                }
              `}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`
                  w-8 h-10 sm:w-12 sm:h-16 border-2 border-gray-400 dark:border-gray-600 rounded-lg mb-2
                  ${orientation === "landscape" ? "rotate-90" : ""}
                `}
                >
                  <div className="absolute inset-1 border border-dashed border-gray-300 dark:border-gray-500 rounded" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 capitalize">
                  {orientation}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Margins
          </label>
          <span className="text-sm text-blue-600 dark:text-blue-400">
            {settings.margin}mm
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="20"
          value={settings.margin}
          onChange={(e) =>
            onSettingsChange({ ...settings, margin: parseInt(e.target.value) })
          }
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>Minimal</span>
          <span>Optimal</span>
          <span>Maximum</span>
        </div>
      </div>
    </div>
  );
};

// Cost Configuration Panel
const CostConfigPanel = ({ costs, onCostsChange }) => {
  return (
    <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-xl p-4 sm:p-6 space-y-4">
      <h4 className="font-semibold text-gray-900 dark:text-white text-sm flex items-center space-x-2">
        <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <span>Cost Configuration</span>
      </h4>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            Paper Cost per Card (USD)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={costs.paperCost}
            onChange={(e) =>
              onCostsChange({
                ...costs,
                paperCost: parseFloat(e.target.value) || 0,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            PVC Card Cost per Unit (USD)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={costs.pvcCost}
            onChange={(e) =>
              onCostsChange({
                ...costs,
                pvcCost: parseFloat(e.target.value) || 0,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ink Cost per Card (USD)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={costs.inkCost}
            onChange={(e) =>
              onCostsChange({
                ...costs,
                inkCost: parseFloat(e.target.value) || 0,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
};

// Export Options Component
const ExportOptionsPanel = ({
  settings,
  cardCount,
  estimatedCost,
  uploadedFile,
}) => {
  const handlePDFExport = () => {
    // Create a simple PDF representation with canvas-based export
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas size to A4 (210 x 297mm at 72dpi)
    canvas.width = 210;
    canvas.height = 297;

    // White background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw border
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Add text
    ctx.fillStyle = "#000000";
    ctx.font = "12px Arial";
    ctx.fillText(
      `Print Center Export - ${new Date().toLocaleDateString()}`,
      10,
      20,
    );
    ctx.fillText(
      `Layout: ${settings.cardType} - ${settings.orientation}`,
      10,
      40,
    );
    ctx.fillText(
      `Cards per sheet: ${cardCount} - Estimated Cost: $${estimatedCost.toFixed(2)}`,
      10,
      60,
    );

    // Convert to blob and download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `print-center-export-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  };

  const handleImageExport = (format) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 800;
    canvas.height = 600;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#000000";
    ctx.font = "20px Arial";
    ctx.fillText("Print Center Preview", 20, 40);
    ctx.font = "16px Arial";
    ctx.fillText(
      `Format: ${format.toUpperCase()} - Cards: ${cardCount}`,
      20,
      80,
    );

    const mimeType = format === "jpg" ? "image/jpeg" : "image/png";
    const extension = format === "jpg" ? "jpg" : "png";

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `print-center-${Date.now()}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900 dark:text-white text-sm flex items-center space-x-2">
        <FileOutput className="w-4 h-4 text-orange-500" />
        <span>Export Options</span>
      </h4>

      <button
        onClick={handlePDFExport}
        disabled={!uploadedFile}
        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-sm ${
          uploadedFile
            ? "border-orange-300 bg-orange-50 dark:bg-orange-900/20 hover:border-orange-500 dark:hover:border-orange-400 cursor-pointer"
            : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-50 cursor-not-allowed"
        }`}
      >
        <div className="flex items-center space-x-3">
          <FileText className="w-5 h-5 text-orange-500" />
          <div className="text-left">
            <div className="font-semibold text-gray-900 dark:text-white">
              PDF Export
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Print-ready document
            </div>
          </div>
        </div>
        <Download className="w-4 h-4 text-gray-400" />
      </button>

      <button
        onClick={() => handleImageExport("png")}
        disabled={!uploadedFile}
        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-sm ${
          uploadedFile
            ? "border-blue-300 bg-blue-50 dark:bg-blue-900/20 hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer"
            : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-50 cursor-not-allowed"
        }`}
      >
        <div className="flex items-center space-x-3">
          <Image className="w-5 h-5 text-blue-500" />
          <div className="text-left">
            <div className="font-semibold text-gray-900 dark:text-white">
              PNG Export
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Digital preview
            </div>
          </div>
        </div>
        <Download className="w-4 h-4 text-gray-400" />
      </button>

      <button
        onClick={() => handleImageExport("jpg")}
        disabled={!uploadedFile}
        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-sm ${
          uploadedFile
            ? "border-purple-300 bg-purple-50 dark:bg-purple-900/20 hover:border-purple-500 dark:hover:border-purple-400 cursor-pointer"
            : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-50 cursor-not-allowed"
        }`}
      >
        <div className="flex items-center space-x-3">
          <Image className="w-5 h-5 text-purple-500" />
          <div className="text-left">
            <div className="font-semibold text-gray-900 dark:text-white">
              JPG Export
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Compressed format
            </div>
          </div>
        </div>
        <Download className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  );
};

// Main Print Center Component
export default function PrintCard() {
  const [activeTab, setActiveTab] = useState("layout");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [settings, setSettings] = useState({
    printer: "hp-officejet",
    orientation: "portrait",
    margin: 5,
    cardType: "pvc",
    showFront: true,
    cardsPerSheet: 10,
  });
  const [costs, setCosts] = useState({
    paperCost: 0.05,
    pvcCost: 0.25,
    inkCost: 0.03,
  });
  const [theme, setTheme] = useState("light");

  // Calculate estimated cost
  const calculateEstimatedCost = () => {
    const baseCard =
      settings.cardType === "pvc" ? costs.pvcCost : costs.paperCost;
    const totalCost = (baseCard + costs.inkCost) * settings.cardsPerSheet;
    return totalCost;
  };

  const estimatedCost = calculateEstimatedCost();

  const handleFileUpload = (file) => {
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImageUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setUploadedFile(null);
      setUploadedImageUrl(null);
    }
  };

  const applyRecommendedSettings = () => {
    setSettings({
      ...settings,
      margin: 3,
      orientation: "portrait",
      printer: "epson-eco",
    });
  };

  const performTestPrint = () => {
    if (!uploadedFile) {
      alert("Please upload a design first!");
      return;
    }
    alert(
      "Test print initiated! A single card will be printed for verification.",
    );
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const tabs = [
    { id: "layout", label: "Layout", icon: <Scissors className="w-4 h-4" /> },
    { id: "print", label: "Print", icon: <Printer className="w-4 h-4" /> },
    { id: "export", label: "Export", icon: <FileOutput className="w-4 h-4" /> },
  ];

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
          <div className="px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                  <Printer className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    Print Center
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Confidence before print
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
                <div className="hidden sm:block px-4 py-2 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">
                      ${estimatedCost.toFixed(2)}
                    </span>
                  </div>
                </div>

                <ThemeToggle />

                <button className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity text-sm">
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-6 py-6 sm:py-8">
          {/* Tabs Navigation */}
          <div className="flex space-x-1 sm:space-x-2 mb-6 sm:mb-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 px-4 sm:px-6 py-3 rounded-t-lg border-b-2 transition-all whitespace-nowrap text-sm sm:text-base
                  ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-900"
                      : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                  }
                `}
              >
                {tab.icon}
                <span className="font-semibold">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Left Column - Preview */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 sm:p-6">
                {/* File Upload for Layout Tab */}
                {activeTab === "layout" && (
                  <FileUploadPanel
                    onFileUpload={handleFileUpload}
                    uploadedFile={uploadedFile}
                  />
                )}

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    {activeTab === "layout"
                      ? "Card Preview"
                      : activeTab === "print"
                        ? "Print Settings Preview"
                        : "Export Preview"}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
                    {settings.cardType === "pvc" && activeTab !== "export" && (
                      <button
                        onClick={() =>
                          setSettings({
                            ...settings,
                            showFront: !settings.showFront,
                          })
                        }
                        className="flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm"
                      >
                        {settings.showFront ? (
                          <>
                            <Eye className="w-4 h-4" />
                            <span>Front</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-4 h-4" />
                            <span>Back</span>
                          </>
                        )}
                      </button>
                    )}

                    {activeTab !== "export" && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            setSettings({ ...settings, cardType: "paper" })
                          }
                          className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm ${
                            settings.cardType === "paper"
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          Sheet
                        </button>
                        <button
                          onClick={() =>
                            setSettings({ ...settings, cardType: "pvc" })
                          }
                          className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm ${
                            settings.cardType === "pvc"
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          Card
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preview Area */}
                <div className="flex justify-center items-center p-4 sm:p-8 bg-gray-100 dark:bg-gray-800 rounded-xl min-h-[300px] sm:min-h-[500px] overflow-auto">
                  {settings.cardType === "pvc" ? (
                    <CardPreview
                      imageSrc={uploadedImageUrl}
                      front={settings.showFront}
                      type="pvc"
                    />
                  ) : (
                    <SheetPreview
                      cards={settings.cardsPerSheet}
                      orientation={settings.orientation}
                    />
                  )}
                </div>

                {/* Confidence Indicators */}
                <div className="mt-6 sm:mt-8 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-emerald-500 flex-shrink-0">
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                          {uploadedFile
                            ? "Ready to Print"
                            : "Upload Design to Continue"}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          {uploadedFile
                            ? "All settings optimized"
                            : "Upload an ID card design"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`w-2 h-5 sm:h-6 mx-0.5 rounded-full ${
                              uploadedFile
                                ? "bg-emerald-500"
                                : "bg-gray-300 dark:bg-gray-700"
                            }`}
                            style={{ opacity: i / 5 }}
                          />
                        ))}
                      </div>
                      <span
                        className={`text-xs sm:text-sm font-semibold ${
                          uploadedFile
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {uploadedFile ? "98%" : "0%"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Settings */}
            <div className="space-y-6 sm:space-y-8">
              {/* Settings Panel - Show different content based on tab */}
              {activeTab === "layout" && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Layout Options
                    </h3>
                    <Scissors className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Cards per Sheet
                      </label>
                      <select
                        value={settings.cardsPerSheet}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            cardsPerSheet: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        {[4, 6, 8, 10, 12, 15, 20].map((num) => (
                          <option key={num} value={num}>
                            {num} cards per sheet
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-900 dark:text-blue-300">
                          <p className="font-semibold mb-1">Safe Zone</p>
                          <p className="text-xs">
                            Keep content at least 5mm from card edges to ensure
                            no loss during cutting.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "print" && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Print Settings
                    </h3>
                    <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </div>

                  <PrintSettingsPanel
                    settings={settings}
                    onSettingsChange={setSettings}
                  />
                </div>
              )}

              {activeTab === "export" && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 sm:p-6">
                  <ExportOptionsPanel
                    settings={settings}
                    cardCount={settings.cardsPerSheet}
                    estimatedCost={estimatedCost}
                    uploadedFile={uploadedFile}
                  />
                </div>
              )}

              {/* Cost Configuration */}
              {activeTab === "print" && (
                <CostConfigPanel costs={costs} onCostsChange={setCosts} />
              )}

              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Actions
                </h3>

                <div className="space-y-3">
                  <button
                    onClick={applyRecommendedSettings}
                    className="w-full flex items-center justify-between p-3 sm:p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 hover:opacity-90 transition-opacity text-sm"
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left hidden sm:block">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          Recommended
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Minimal waste
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                  </button>

                  <button
                    onClick={performTestPrint}
                    disabled={!uploadedFile}
                    className={`w-full flex items-center justify-between p-3 sm:p-4 rounded-xl transition-opacity text-sm ${
                      uploadedFile
                        ? "bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 hover:opacity-90"
                        : "bg-gray-100 dark:bg-gray-800 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-500 flex-shrink-0">
                        <RotateCw className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left hidden sm:block">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          Test Print
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Verify settings
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                  </button>
                </div>
              </div>

              {/* Print Button */}
              <button
                disabled={!uploadedFile}
                className={`w-full py-3 sm:py-4 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2 sm:space-x-3 text-sm sm:text-base ${
                  uploadedFile
                    ? "bg-gradient-to-r from-blue-500 to-purple-500"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                <Printer className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Print with Confidence</span>
                <div className="text-xs sm:text-sm bg-white/20 px-2 py-1 rounded-full">
                  ${estimatedCost.toFixed(2)}
                </div>
              </button>
            </div>
          </div>
        </main>

        {/* Footer Stats */}
        <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mt-12">
          <div className="px-4 sm:px-6 py-6 sm:py-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                <CreditCard className="w-8 h-8 text-blue-500 flex-shrink-0" />
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    2,847
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Cards saved
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                <DollarSign className="w-8 h-8 text-emerald-500 flex-shrink-0" />
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    $428.50
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Total savings
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                <Check className="w-8 h-8 text-purple-500 flex-shrink-0" />
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    99.2%
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Success rate
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ThemeContext.Provider>
  );
}
