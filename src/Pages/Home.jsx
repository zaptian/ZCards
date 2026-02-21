// const Home = () => {
//   return <div>Home</div>;
// };

// export default Home;

import React, { useState } from "react";
import {
  CheckCircle,
  Circle,
  Plus,
  Upload,
  Printer,
  Clock,
  User,
  GraduationCap,
  Users,
  Info,
  Keyboard,
  Zap,
  TrendingUp,
  Eye,
  Download,
  Settings,
  Search,
  Bell,
  ChevronRight,
  Star,
  Award,
  Sparkles,
  FileText,
  Image,
  Palette,
  BarChart3,
  Share2,
  FolderOpen,
  BookOpen,
  Video,
  Lightbulb,
  History,
  Package,
  Shield,
  Layers,
  Grid,
  FileImage,
  Crop,
  AlertCircle,
  CheckSquare,
  Trophy,
  Target,
  Calendar,
  MessageSquare,
  Heart,
  Bookmark,
  Activity,
  PieChart,
  ArrowUpRight,
  Filter,
  Cloud,
  Database,
  Lock,
  Unlock,
  Edit3,
  Copy,
  Trash2,
  MoreVertical,
  Play,
} from "lucide-react";

export default function Home() {
  const [showTooltip, setShowTooltip] = useState(null);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    {
      label: "Total Designs",
      value: "12",
      change: "+3",
      icon: Sparkles,
      color: "from-blue-500 to-blue-600",
      trend: "up",
    },
    {
      label: "IDs Printed",
      value: "847",
      change: "+24",
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      trend: "up",
    },
    {
      label: "Templates",
      value: "24",
      change: "+2",
      icon: Star,
      color: "from-green-500 to-green-600",
      trend: "up",
    },
    {
      label: "Team Members",
      value: "8",
      change: "+1",
      icon: Users,
      color: "from-orange-500 to-orange-600",
      trend: "up",
    },
  ];

  const onboardingSteps = [
    {
      label: "Design Created",
      completed: true,
      icon: Sparkles,
      description: "Create your first ID card",
    },
    {
      label: "Data Imported",
      completed: false,
      icon: Upload,
      description: "Import employee data",
    },
    {
      label: "Printed / Exported",
      completed: false,
      icon: Printer,
      description: "Print or export your IDs",
    },
  ];

  const recentDesigns = [
    {
      id: 1,
      name: "Employee Badge - Blue",
      lastEdited: "2 hours ago",
      thumbnail: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      views: 45,
      status: "active",
      collaborators: 3,
      size: "85.6 × 53.98mm",
    },
    {
      id: 2,
      name: "Student ID - Green",
      lastEdited: "1 day ago",
      thumbnail: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      views: 32,
      status: "draft",
      collaborators: 2,
      size: "85.6 × 53.98mm",
    },
    {
      id: 3,
      name: "Visitor Pass - Gold",
      lastEdited: "3 days ago",
      thumbnail: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      views: 28,
      status: "active",
      collaborators: 1,
      size: "85.6 × 53.98mm",
    },
  ];

  const templates = [
    {
      id: 1,
      name: "Corporate Employee",
      type: "Employee",
      gradient: "from-blue-500 to-indigo-600",
      icon: User,
      downloads: 1240,
      rating: 4.8,
      preview: true,
    },
    {
      id: 2,
      name: "University Student",
      type: "Student",
      gradient: "from-green-500 to-teal-600",
      icon: GraduationCap,
      downloads: 982,
      rating: 4.9,
      preview: true,
    },
    {
      id: 3,
      name: "Visitor Pass",
      type: "Visitor",
      gradient: "from-orange-500 to-red-600",
      icon: Users,
      downloads: 756,
      rating: 4.7,
      preview: false,
    },
    {
      id: 4,
      name: "VIP Access",
      type: "Employee",
      gradient: "from-purple-500 to-pink-600",
      icon: Award,
      downloads: 543,
      rating: 4.6,
      preview: false,
    },
  ];

  const quickActions = [
    {
      icon: Plus,
      label: "Create New ID",
      description: "Start from scratch or template",
      gradient: "from-blue-500 to-blue-600",
      shortcut: "Ctrl+N",
      highlight: true,
    },
    {
      icon: Upload,
      label: "Import Excel",
      description: "Bulk upload employee data",
      gradient: "from-green-500 to-green-600",
      shortcut: "Ctrl+I",
      highlight: false,
    },
    {
      icon: Printer,
      label: "Print IDs",
      description: "Print your designs",
      gradient: "from-purple-500 to-purple-600",
      shortcut: "Ctrl+P",
      highlight: false,
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Exported 150 Employee IDs",
      user: "John Doe",
      time: "10 minutes ago",
      icon: Download,
      color: "text-green-400",
    },
    {
      id: 2,
      action: 'Created new template "Security Badge"',
      user: "Sarah Smith",
      time: "1 hour ago",
      icon: Plus,
      color: "text-blue-400",
    },
    {
      id: 3,
      action: "Printed 50 Visitor Passes",
      user: "Mike Johnson",
      time: "3 hours ago",
      icon: Printer,
      color: "text-purple-400",
    },
    {
      id: 4,
      action: "Imported data from HR_Database.xlsx",
      user: "Emily Chen",
      time: "5 hours ago",
      icon: Upload,
      color: "text-orange-400",
    },
  ];

  const designInsights = [
    {
      label: "Most Used Template",
      value: "Corporate Employee",
      icon: Trophy,
      color: "text-yellow-400",
    },
    {
      label: "Avg. Design Time",
      value: "12 min",
      icon: Clock,
      color: "text-blue-400",
    },
    {
      label: "Print Success Rate",
      value: "98.5%",
      icon: Target,
      color: "text-green-400",
    },
    {
      label: "Storage Used",
      value: "2.4 GB / 10 GB",
      icon: Database,
      color: "text-purple-400",
    },
  ];

  const exportHistory = [
    {
      format: "PDF",
      count: 245,
      size: "1.2 GB",
      icon: FileText,
      color: "from-red-500 to-red-600",
    },
    {
      format: "PNG",
      count: 189,
      size: "856 MB",
      icon: Image,
      color: "from-blue-500 to-blue-600",
    },
    {
      format: "PSD",
      count: 92,
      size: "3.4 GB",
      icon: Layers,
      color: "from-purple-500 to-purple-600",
    },
    {
      format: "Print",
      count: 847,
      size: "—",
      icon: Printer,
      color: "from-green-500 to-green-600",
    },
  ];

  const learningResources = [
    {
      title: "Getting Started with Zaptian",
      type: "Video Tutorial",
      duration: "12 min",
      icon: Play,
      gradient: "from-blue-500 to-blue-600",
      completed: true,
    },
    {
      title: "Advanced Design Techniques",
      type: "Guide",
      duration: "8 min read",
      icon: BookOpen,
      gradient: "from-purple-500 to-purple-600",
      completed: false,
    },
    {
      title: "Printing Best Practices",
      type: "Article",
      duration: "5 min read",
      icon: Lightbulb,
      gradient: "from-green-500 to-green-600",
      completed: false,
    },
  ];

  const teamActivity = [
    {
      name: "Sarah Smith",
      avatar: "SS",
      activity: "Created 3 new designs",
      time: "2h ago",
      online: true,
    },
    {
      name: "Mike Johnson",
      avatar: "MJ",
      activity: "Printed 150 IDs",
      time: "4h ago",
      online: true,
    },
    {
      name: "Emily Chen",
      avatar: "EC",
      activity: "Updated template library",
      time: "1d ago",
      online: false,
    },
  ];

  const tooltips = {
    pvc: "PVC: Plastic card material (credit card thickness) - Standard 0.76mm",
    bleed:
      "Bleed: Extra design area beyond cut line (typically 2mm) for edge-to-edge printing",
    dpi: "DPI: Dots Per Inch - 300 DPI minimum recommended for professional print quality",
    cmyk: "CMYK: Color mode for professional printing (Cyan, Magenta, Yellow, Black)",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-[1800px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Shield className="text-white" size={24} />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Zaptian ID Designer
              </h1>
            </div>
            <p className="text-slate-400 ml-13">
              Professional ID card design & management platform
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all hover:scale-105 border border-slate-700">
              <Search className="text-slate-400" size={20} />
            </button>
            <button className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all hover:scale-105 border border-slate-700 relative">
              <Bell className="text-slate-400" size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>
            <button
              onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
              className="flex items-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all hover:scale-105 border border-slate-700"
            >
              <Keyboard size={18} className="text-slate-400" />
              <span className="text-slate-300 text-sm font-medium">
                Shortcuts
              </span>
            </button>
            <button className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl transition-all hover:scale-105 shadow-lg shadow-blue-500/30">
              <Settings size={18} className="text-white" />
              <span className="text-white text-sm font-medium">Settings</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={idx}
                className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 overflow-hidden group hover:border-slate-600 transition-all hover:scale-105"
              >
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}
                ></div>
                <div className="relative">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-slate-400 text-sm mb-1">
                        {stat.label}
                      </p>
                      <h3 className="text-3xl font-bold text-white">
                        {stat.value}
                      </h3>
                    </div>
                    <div
                      className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl`}
                    >
                      <IconComponent className="text-white" size={24} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 text-sm font-semibold flex items-center gap-1">
                      <ArrowUpRight size={14} />
                      {stat.change}
                    </span>
                    <span className="text-slate-500 text-sm">vs last week</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Welcome Banner */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 mb-8 overflow-hidden group">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="text-yellow-300" size={28} />
              <h2 className="text-2xl font-bold text-white">
                Create your first ID in 3 steps
              </h2>
            </div>
            <p className="text-blue-100 mb-6">
              Follow the checklist below to get started with professional ID
              cards
            </p>

            {/* Progress Indicator */}
            <div className="flex gap-6 flex-wrap">
              {onboardingSteps.map((step, idx) => {
                const IconComponent = step.icon;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all cursor-pointer hover:scale-105 ${
                      step.completed
                        ? "bg-white bg-opacity-20 backdrop-blur-sm"
                        : "bg-white bg-opacity-10 backdrop-blur-sm hover:bg-opacity-15"
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle className="text-green-300" size={24} />
                    ) : (
                      <Circle className="text-blue-200" size={24} />
                    )}
                    <div>
                      <span className="text-sm font-semibold text-white block">
                        {step.label}
                      </span>
                      <span className="text-xs text-blue-100">
                        {step.description}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Left Column - Recent Designs */}
          <div className="lg:col-span-4 space-y-6">
            {/* Recent Designs */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Clock size={22} className="text-blue-400" />
                  Recent Designs
                </h3>
                <button className="text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1">
                  View All
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="space-y-4">
                {recentDesigns.map((design) => (
                  <div
                    key={design.id}
                    className="group bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all cursor-pointer"
                  >
                    <div className="flex gap-4">
                      <div
                        className="w-24 h-32 rounded-lg flex items-center justify-center text-white font-bold shadow-lg relative overflow-hidden flex-shrink-0"
                        style={{ background: design.thumbnail }}
                      >
                        <span className="text-2xl font-black opacity-80">
                          ID
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                      </div>
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-start justify-between mb-2 gap-2">
                            <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                              {design.name}
                            </h4>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${
                                design.status === "active"
                                  ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                  : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                              }`}
                            >
                              {design.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-400 mb-2">
                            {design.lastEdited}
                          </p>
                          <p className="text-xs text-slate-500 mb-2">
                            {design.size}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Eye size={14} />
                              {design.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users size={14} />
                              {design.collaborators}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button className="flex-1 text-sm text-blue-400 font-semibold hover:text-blue-300 flex items-center justify-center gap-1 py-1.5 px-3 bg-blue-500/10 rounded-lg hover:bg-blue-500/20 transition-all">
                            <Edit3 size={14} />
                            Edit
                          </button>
                          <button className="text-sm text-slate-400 hover:text-slate-300 p-1.5 hover:bg-slate-700 rounded-lg transition-all">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Design Insights */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <BarChart3 size={22} className="text-purple-400" />
                Design Insights
              </h3>
              <div className="space-y-4">
                {designInsights.map((insight, idx) => {
                  const IconComponent = insight.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-slate-800 rounded-xl border border-slate-700 hover:border-slate-600 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className={insight.color} size={20} />
                        <span className="text-slate-300 text-sm">
                          {insight.label}
                        </span>
                      </div>
                      <span className="text-white font-semibold text-sm">
                        {insight.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Middle Column - Templates & Actions */}
          <div className="lg:col-span-5 space-y-6">
            {/* Templates */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Grid size={22} className="text-green-400" />
                  Template Library
                </h3>
                <div className="flex gap-2">
                  {["All", "Employee", "Student", "Visitor"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        activeFilter === filter
                          ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                          : "bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {templates.map((template) => {
                  const IconComponent = template.icon;
                  return (
                    <div
                      key={template.id}
                      className="group bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/10 transition-all cursor-pointer"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${template.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}
                        >
                          <IconComponent className="text-white" size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white mb-1 group-hover:text-purple-400 transition-colors text-sm truncate">
                            {template.name}
                          </h4>
                          <p className="text-xs text-slate-400">
                            {template.type}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Download size={12} />
                            {template.downloads}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star
                              size={12}
                              className="text-yellow-400 fill-yellow-400"
                            />
                            {template.rating}
                          </span>
                        </div>
                        <button className="text-purple-400 hover:text-purple-300 font-medium text-xs">
                          Use
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Zap size={22} className="text-yellow-400" />
                Quick Actions
              </h3>

              <div className="grid grid-cols-3 gap-4">
                {quickActions.map((action, idx) => {
                  const IconComponent = action.icon;
                  return (
                    <button
                      key={idx}
                      className={`relative bg-gradient-to-br ${action.gradient} rounded-xl p-5 hover:shadow-2xl transition-all hover:scale-105 overflow-hidden group ${
                        action.highlight
                          ? "ring-2 ring-yellow-400 ring-offset-2 ring-offset-slate-900"
                          : ""
                      }`}
                    >
                      {action.highlight && (
                        <div className="absolute top-2 right-2">
                          <Sparkles className="text-yellow-300" size={16} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                      <div className="relative text-center">
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform mx-auto">
                          <IconComponent className="text-white" size={24} />
                        </div>
                        <h4 className="font-bold text-white text-sm mb-1">
                          {action.label}
                        </h4>
                        <p className="text-xs text-white text-opacity-80 mb-2">
                          {action.description}
                        </p>
                        <kbd className="inline-block px-2 py-1 bg-black bg-opacity-30 text-white text-opacity-90 rounded text-xs font-mono">
                          {action.shortcut}
                        </kbd>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Export History */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Package size={22} className="text-orange-400" />
                Export History
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {exportHistory.map((item, idx) => {
                  const IconComponent = item.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-all"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center`}
                        >
                          <IconComponent className="text-white" size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">
                            {item.format}
                          </h4>
                          <p className="text-xs text-slate-400">
                            {item.count} exports
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">{item.size}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Activity & Resources */}
          <div className="lg:col-span-3 space-y-6">
            {/* Recent Activity */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Activity size={22} className="text-blue-400" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={activity.id} className="flex gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 ${activity.color}`}
                      >
                        <IconComponent size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white mb-1 truncate">
                          {activity.action}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>{activity.user}</span>
                          <span>•</span>
                          <span>{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Team Activity */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Users size={22} className="text-green-400" />
                Team Activity
              </h3>
              <div className="space-y-4">
                {teamActivity.map((member, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {member.avatar}
                      </div>
                      {member.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">
                        {member.name}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {member.activity}
                      </p>
                    </div>
                    <span className="text-xs text-slate-500 whitespace-nowrap">
                      {member.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Resources */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <BookOpen size={22} className="text-purple-400" />
                Learning Hub
              </h3>
              <div className="space-y-3">
                {learningResources.map((resource, idx) => {
                  const IconComponent = resource.icon;
                  return (
                    <div
                      key={idx}
                      className="group bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-purple-500 transition-all cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 bg-gradient-to-br ${resource.gradient} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                        >
                          <IconComponent className="text-white" size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-white mb-1 group-hover:text-purple-400 transition-colors truncate">
                            {resource.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span>{resource.type}</span>
                            <span>•</span>
                            <span>{resource.duration}</span>
                          </div>
                        </div>
                        {resource.completed && (
                          <CheckCircle
                            className="text-green-400 flex-shrink-0"
                            size={18}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Reference */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Info size={20} className="text-blue-400" />
                Quick Reference
              </h3>

              <div className="space-y-3">
                {Object.entries(tooltips).map(([key, value]) => (
                  <div key={key} className="relative group">
                    <button
                      className="text-left w-full px-4 py-3 rounded-xl bg-slate-800 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 border border-slate-700 hover:border-blue-500 transition-all"
                      onMouseEnter={() => setShowTooltip(key)}
                      onMouseLeave={() => setShowTooltip(null)}
                    >
                      <span className="font-bold text-blue-400 uppercase text-sm">
                        {key}
                      </span>
                    </button>
                    {showTooltip === key && (
                      <div className="absolute z-20 left-0 top-full mt-2 w-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 text-white text-xs rounded-xl p-4 shadow-2xl">
                        <div className="absolute -top-2 left-6 w-4 h-4 bg-slate-700 border-l border-t border-slate-600 transform rotate-45"></div>
                        {value}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Help Footer */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Lightbulb className="text-white" size={24} />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">
                  Need help getting started?
                </h4>
                <p className="text-slate-400 text-sm">
                  Watch our comprehensive tutorial or browse documentation
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-all hover:scale-105 border border-slate-700 flex items-center gap-2">
                <BookOpen size={18} />
                Documentation
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all hover:scale-105 shadow-lg shadow-blue-500/30 flex items-center gap-2">
                <Play size={18} />
                Watch Tutorial
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
