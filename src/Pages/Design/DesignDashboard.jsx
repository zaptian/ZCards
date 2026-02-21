import React, { useState } from "react";
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Printer,
  Users,
  FileText,
  Layout,
  Database,
  Download,
  Copy,
  Archive,
  Eye,
  ChevronRight,
  HelpCircle,
  TrendingUp,
  History,
  Shield,
  Zap,
  Grid,
  List,
  Smartphone,
  CreditCard,
  Calendar,
  UserCheck,
  Settings,
  RefreshCw,
  MoreVertical,
} from "lucide-react";

// Mock data for the dashboard
const mockDesigns = [
  {
    id: 1,
    name: "Corporate Employee ID v2",
    type: "Employee",
    format: "PVC",
    status: "ready",
    lastUpdated: "2024-01-15",
    progress: { template: true, layout: true, data: true, print: true },
  },
  {
    id: 2,
    name: "University Student Card",
    type: "Student",
    format: "A4",
    status: "draft",
    lastUpdated: "2024-01-14",
    progress: { template: true, layout: true, data: false, print: false },
  },
  {
    id: 3,
    name: "Visitor Temporary Pass",
    type: "Visitor",
    format: "PVC",
    status: "printed",
    lastUpdated: "2024-01-12",
    progress: { template: true, layout: true, data: true, print: true },
  },
];

const popularTemplates = [
  { id: 1, name: "Modern Corporate", type: "Employee", uses: 1242 },
  { id: 2, name: "University Standard", type: "Student", uses: 987 },
  { id: 3, name: "Visitor Basic", type: "Visitor", uses: 543 },
  { id: 4, name: "Security Enhanced", type: "Employee", uses: 321 },
];

const activityHistory = [
  {
    id: 1,
    action: "Template selected",
    design: "Corporate Employee ID v2",
    time: "2 hours ago",
  },
  {
    id: 2,
    action: "Layout finalized",
    design: "University Student Card",
    time: "1 day ago",
  },
  {
    id: 3,
    action: "Data linked",
    design: "Visitor Temporary Pass",
    time: "2 days ago",
  },
  {
    id: 4,
    action: "Exported to print",
    design: "Corporate Employee ID v2",
    time: "3 days ago",
  },
];

const DesignDashboard = () => {
  const [activeView, setActiveView] = useState("card");
  const [activeDesign, setActiveDesign] = useState(mockDesigns[0]);
  const [showFront, setShowFront] = useState(true);
  const [showSafeZone, setShowSafeZone] = useState(false);

  const StatusIndicator = ({ status, label }) => {
    const getStatusStyles = () => {
      switch (status) {
        case "ready":
          return "bg-green-100 text-green-800";
        case "draft":
          return "bg-amber-100 text-amber-800";
        case "printed":
          return "bg-blue-100 text-blue-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles()}`}
      >
        {status === "ready" && <CheckCircle className="w-4 h-4 mr-1" />}
        {status === "draft" && <AlertCircle className="w-4 h-4 mr-1" />}
        {status === "printed" && <Printer className="w-4 h-4 mr-1" />}
        {label || status}
      </span>
    );
  };

  const ProgressStep = ({ step, label, isActive, isComplete }) => (
    <div className="flex items-center">
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-full border-2
        ${
          isComplete
            ? "bg-green-500 border-green-500 text-white"
            : isActive
              ? "border-blue-500 text-blue-500"
              : "border-gray-300 text-gray-400"
        }`}
      >
        {isComplete ? <CheckCircle className="w-5 h-5" /> : step}
      </div>
      <div
        className={`ml-3 text-sm font-medium ${isActive ? "text-blue-600" : "text-gray-600"}`}
      >
        {label}
      </div>
      {step < 4 && <div className="ml-3 w-12 h-0.5 bg-gray-300"></div>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Premium Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Zap className="w-8 h-8 text-blue-600 mr-3" />
              Zaptian Design Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Command center for your ID designs • Read-only overview
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600">
              Protected • All changes saved
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Content Area - 8 columns */}
        <div className="col-span-8 space-y-6">
          {/* Top Context Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {activeDesign.name}
                </h2>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {activeDesign.type} ID
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {activeDesign.format} Format
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      Updated {activeDesign.lastUpdated}
                    </span>
                  </div>
                </div>
              </div>
              <StatusIndicator status={activeDesign.status} />
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center">
                <HelpCircle className="w-5 h-5 text-blue-500 mr-3" />
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Orientation:</span> You're
                  viewing your active design. All changes are saved
                  automatically.
                </p>
              </div>
            </div>
          </div>

          {/* Workspace Snapshot & Design Status */}
          <div className="grid grid-cols-2 gap-6">
            {/* Workspace Snapshot */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Design Preview
                </h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowFront(!showFront)}
                    className={`px-3 py-1.5 text-sm rounded-lg ${showFront ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}
                  >
                    {showFront ? "Front" : "Back"}
                  </button>
                  <button
                    onClick={() => setShowSafeZone(!showSafeZone)}
                    className={`px-3 py-1.5 text-sm rounded-lg ${showSafeZone ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                  >
                    Safe Zone
                  </button>
                </div>
              </div>

              {/* ID Card Preview */}
              <div className="relative mx-auto">
                <div className="w-full max-w-sm aspect-[3.375/2.125] bg-gradient-to-br from-blue-50 to-white border-2 border-gray-300 rounded-2xl shadow-inner p-8">
                  {showSafeZone && (
                    <div className="absolute inset-4 border-2 border-dashed border-red-300 rounded-xl pointer-events-none"></div>
                  )}
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <UserCheck className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        John Smith
                      </div>
                      <div className="text-sm text-gray-600">
                        Senior Designer
                      </div>
                      <div className="text-xs text-gray-500">EMP-2024-001</div>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Department</div>
                      <div className="font-medium">Design & Innovation</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Valid Until</div>
                      <div className="font-medium">Dec 2025</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm text-gray-500">
                  <Layout className="w-4 h-4 inline mr-1" />
                  Real-size PVC preview • Hover for field labels
                </div>
              </div>
            </div>

            {/* Design Status Panel */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Design Status
              </h3>

              <div className="space-y-4">
                {[
                  {
                    label: "Template Selected",
                    value: activeDesign.progress.template,
                    description: "Design template is chosen and applied",
                  },
                  {
                    label: "Layout Ready",
                    value: activeDesign.progress.layout,
                    description: "All elements are properly positioned",
                  },
                  {
                    label: "Data Connected",
                    value: activeDesign.progress.data,
                    description: "Linked to employee database",
                  },
                  {
                    label: "Print Ready",
                    value: activeDesign.progress.print,
                    description: "Optimized for PVC printing",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      {item.value ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-amber-500 mr-3" />
                      )}
                      <div>
                        <div className="font-medium text-gray-900">
                          {item.label}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.description}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm ${item.value ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}
                    >
                      {item.value ? "Complete" : "Action Needed"}
                    </div>
                  </div>
                ))}
              </div>

              {/* Design Flow Navigator */}
              <div className="mt-8">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">
                  Design Journey
                </h4>
                <div className="flex items-center justify-between">
                  {["1", "2", "3", "4"].map((step, index) => (
                    <ProgressStep
                      key={step}
                      step={step}
                      label={["Template", "Design", "Data", "Print"][index]}
                      isActive={index === 1}
                      isComplete={index < 2}
                    />
                  ))}
                </div>
                <div className="mt-6">
                  <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center">
                    Continue to Next Step
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </button>
                  <p className="text-center text-xs text-gray-500 mt-2">
                    Next: Connect your employee database
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* My Designs Overview */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                My Designs
              </h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setActiveView("card")}
                  className={`p-2 rounded-lg ${activeView === "card" ? "bg-blue-100 text-blue-600" : "text-gray-400"}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveView("list")}
                  className={`p-2 rounded-lg ${activeView === "list" ? "bg-blue-100 text-blue-600" : "text-gray-400"}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {mockDesigns.map((design) => (
                <div
                  key={design.id}
                  className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {design.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {design.type} • {design.format}
                          </div>
                        </div>
                      </div>
                    </div>
                    <StatusIndicator status={design.status} />
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {design.lastUpdated}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - 4 columns */}
        <div className="col-span-4 space-y-6">
          {/* Templates Insight Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Recommended Templates
              </h3>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>

            <div className="space-y-4">
              {popularTemplates.map((template) => (
                <div
                  key={template.id}
                  className="group p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                        <Layout className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {template.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {template.type} ID
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {template.uses.toLocaleString()} uses
                    </div>
                  </div>
                  <button className="mt-3 w-full py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Preview & Use
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Activity & History Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h3>
              <History className="w-5 h-5 text-gray-500" />
            </div>

            <div className="space-y-4">
              {activityHistory.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    {activity.action.includes("Template") && (
                      <Layout className="w-4 h-4 text-blue-600" />
                    )}
                    {activity.action.includes("Layout") && (
                      <Settings className="w-4 h-4 text-green-600" />
                    )}
                    {activity.action.includes("Data") && (
                      <Database className="w-4 h-4 text-purple-600" />
                    )}
                    {activity.action.includes("Exported") && (
                      <Download className="w-4 h-4 text-amber-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {activity.design}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 flex-shrink-0">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Help-in-Context Panel */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center mb-4">
              <HelpCircle className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">
                Design Guidance
              </h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-white/80 rounded-xl border border-blue-100">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      Layout Complete
                    </div>
                    <div className="text-sm text-gray-600">
                      Your design is properly positioned within safe zones
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/80 rounded-xl border border-amber-100">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      Data Connection Needed
                    </div>
                    <div className="text-sm text-gray-600">
                      Connect to your employee database to enable batch
                      processing
                    </div>
                  </div>
                </div>
                <button className="mt-3 w-full py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Connect Database
                </button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-blue-200">
              <div className="flex items-center text-sm text-gray-600">
                <Shield className="w-4 h-4 mr-2" />
                <span>All designs are automatically saved and versioned</span>
              </div>
            </div>
          </div>

          {/* Pro Features Badge */}
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl shadow-lg p-6">
            <div className="text-center">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium mb-4">
                <Zap className="w-4 h-4 mr-2" />
                PRO FEATURES ACTIVE
              </div>
              <h4 className="text-white text-lg font-semibold mb-2">
                Advanced Analytics
              </h4>
              <p className="text-purple-200 text-sm mb-4">
                Track design usage, print metrics, and team collaboration
              </p>
              <button className="w-full py-3 bg-white text-purple-900 font-medium rounded-xl hover:bg-purple-50 transition-colors">
                View Analytics Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Status */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <div className="inline-flex items-center space-x-4">
          <span className="flex items-center">
            <RefreshCw className="w-4 h-4 mr-1" />
            Auto-save enabled
          </span>
          <span>•</span>
          <span>Read-only overview • No accidental changes possible</span>
          <span>•</span>
          <span>Last synced: Just now</span>
        </div>
      </div>
    </div>
  );
};

export default DesignDashboard;
