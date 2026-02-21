import React, { useState, useEffect } from "react";
import {
  Settings,
  Building2,
  Printer,
  User,
  Users,
  CreditCard,
  HelpCircle,
  Search,
  ChevronRight,
  Check,
  RotateCcw,
  X,
  MessageCircle,
  Camera,
  Play,
  BookOpen,
  Shield,
  Lock,
  Bell,
  Mail,
  Globe,
  FileText,
  Download,
  Upload,
  Eye,
  EyeOff,
  LogOut,
} from "lucide-react";

// Mock user data - in real app, this would come from auth/context
const mockUser = {
  name: "Sarah Johnson",
  email: "sarah@company.com",
  role: "admin",
  company: "TechCorp Inc.",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
};

// Mock settings data
const initialSettings = {
  company: {
    name: "TechCorp Inc.",
    logo: null,
    address: "123 Business Ave, Suite 100",
    city: "San Francisco",
    state: "CA",
    zip: "94107",
    phone: "(555) 123-4567",
    website: "www.techcorp.com",
  },
  printing: {
    defaultPrinter: "Auto-select",
    cardStock: "Standard PVC",
    printQuality: "High",
    duplexPrinting: true,
    colorMode: "Full Color",
    bleedMargin: "3mm",
    advanced: {
      dpi: 300,
      colorProfile: "sRGB",
      calibration: "Auto",
    },
  },
  account: {
    email: "sarah@company.com",
    notifications: {
      email: true,
      push: true,
      lowInk: true,
      printComplete: true,
    },
    language: "English",
    timezone: "America/Los_Angeles",
  },
  team: {
    members: [
      {
        id: 1,
        name: "Sarah Johnson",
        email: "sarah@company.com",
        role: "admin",
        status: "active",
      },
      {
        id: 2,
        name: "Mike Chen",
        email: "mike@techcorp.com",
        role: "designer",
        status: "active",
      },
      {
        id: 3,
        name: "Lisa Park",
        email: "lisa@techcorp.com",
        role: "printer",
        status: "pending",
      },
    ],
    defaultRole: "designer",
  },
  billing: {
    plan: "Professional",
    seats: 5,
    usedSeats: 3,
    nextBilling: "2024-04-15",
    paymentMethod: "•••• 4242",
    usage: {
      designs: 142,
      prints: 856,
      storage: "2.3 GB",
    },
  },
};

// Section components
const CompanySettings = ({ settings, onUpdate }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [logoPreview, setLogoPreview] = useState(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setLocalSettings((prev) => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdate("company", localSettings);
  };

  const handleReset = () => {
    setLocalSettings(settings);
    setLogoPreview(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Company Identity
          </h2>
          <p className="text-sm text-gray-500">
            This appears on your printed cards
          </p>
        </div>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Default
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organization Name
            </label>
            <input
              type="text"
              value={localSettings.name}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your organization name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Logo
            </label>
            <div className="mt-1 flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-16 h-16 object-contain"
                    />
                  ) : (
                    <Building2 className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <label className="absolute inset-0 cursor-pointer">
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleLogoUpload}
                  />
                </label>
              </div>
              <div>
                <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Logo
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleLogoUpload}
                  />
                </label>
                <p className="mt-1 text-xs text-gray-500">
                  Recommended: 200x200px PNG
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">
              Contact Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={localSettings.address}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      address: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={localSettings.phone}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      phone: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Live Preview
          </h3>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo"
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  <Building2 className="w-6 h-6 text-blue-600" />
                )}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  {localSettings.name || "Your Company"}
                </h4>
                <p className="text-sm text-gray-500">Employee ID Card</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>📍 {localSettings.address || "Your address"}</p>
              <p>📞 {localSettings.phone || "(555) 000-0000"}</p>
              <p>🌐 {localSettings.website || "www.yourcompany.com"}</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500 text-center">
            This is how your logo and company info will appear on printed IDs
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

const PrintingSettings = ({ settings, onUpdate, userRole }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const printOptions = {
    cardStock: ["Standard PVC", "Premium PVC", "Composite", "Polyester"],
    printQuality: ["Draft", "Standard", "High", "Ultra"],
    colorMode: ["Full Color", "Black & White", "Grayscale"],
    bleedMargin: ["2mm", "3mm", "5mm", "None"],
  };

  const handleSave = () => {
    onUpdate("printing", localSettings);
  };

  const handleReset = () => {
    setLocalSettings(settings);
  };

  const canEditAdvanced = userRole === "admin";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Printing Preferences
          </h2>
          <p className="text-sm text-gray-500">
            Smart defaults recommended by Zaptian
          </p>
        </div>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Default
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">
              Safe & Tested Defaults
            </p>
            <p className="text-sm text-blue-700 mt-1">
              These settings are optimized for successful printing. You can't
              break anything here.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(printOptions).map(([key, options]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {key.split(/(?=[A-Z])/).join(" ")}
            </label>
            <select
              value={localSettings[key]}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, [key]: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={localSettings.duplexPrinting}
            onChange={(e) =>
              setLocalSettings({
                ...localSettings,
                duplexPrinting: e.target.checked,
              })
            }
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">
            Enable duplex (double-sided) printing
          </span>
        </label>
      </div>

      {canEditAdvanced && (
        <div className="border-t border-gray-200 pt-6">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <ChevronRight
              className={`w-4 h-4 transition-transform ${showAdvanced ? "rotate-90" : ""}`}
            />
            Customize Advanced Settings
          </button>

          {showAdvanced && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DPI Resolution
                  </label>
                  <input
                    type="range"
                    min="150"
                    max="600"
                    step="50"
                    value={localSettings.advanced.dpi}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        advanced: {
                          ...localSettings.advanced,
                          dpi: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {localSettings.advanced.dpi} DPI
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color Profile
                  </label>
                  <select
                    value={localSettings.advanced.colorProfile}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        advanced: {
                          ...localSettings.advanced,
                          colorProfile: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="sRGB">sRGB</option>
                    <option value="Adobe RGB">Adobe RGB</option>
                    <option value="CMYK">CMYK</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};

const AccountSettings = ({ settings, onUpdate }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveNotification = (key, value) => {
    const updatedNotifications = {
      ...localSettings.notifications,
      [key]: value,
    };
    const updatedSettings = {
      ...localSettings,
      notifications: updatedNotifications,
    };
    setLocalSettings(updatedSettings);
    onUpdate("account", { notifications: updatedNotifications });
  };

  const handleSaveProfile = () => {
    onUpdate("account", {
      email: localSettings.email,
      language: localSettings.language,
      timezone: localSettings.timezone,
    });
  };

  const handlePasswordChange = () => {
    if (password && password === confirmPassword) {
      onUpdate("account", { password });
      setPassword("");
      setConfirmPassword("");
    }
  };

  const notificationOptions = [
    { key: "email", label: "Email notifications", icon: Mail },
    { key: "push", label: "Push notifications", icon: Bell },
    { key: "lowInk", label: "Low ink alerts", icon: Printer },
    { key: "printComplete", label: "Print completion alerts", icon: Check },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Personal Settings
        </h2>
        <p className="text-sm text-gray-500">Control your Zaptian experience</p>
      </div>

      {/* Profile Section */}
      <div className="space-y-6">
        <h3 className="text-sm font-medium text-gray-700">
          Profile Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={localSettings.email}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, email: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={localSettings.language}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    language: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <select
                value={localSettings.timezone}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    timezone: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/New_York">Eastern Time</option>
              </select>
            </div>
          </div>
        </div>
        <button
          onClick={handleSaveProfile}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Update Profile
        </button>
      </div>

      {/* Password Section */}
      <div className="pt-6 border-t border-gray-200 space-y-6">
        <h3 className="text-sm font-medium text-gray-700">Password Security</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-gray-500" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-500" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <button
          onClick={handlePasswordChange}
          disabled={!password || password !== confirmPassword}
          className={`px-6 py-2 font-medium rounded-lg transition-colors ${
            password && password === confirmPassword
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          Update Password
        </button>
      </div>

      {/* Notifications Section */}
      <div className="pt-6 border-t border-gray-200 space-y-6">
        <h3 className="text-sm font-medium text-gray-700">
          Notification Preferences
        </h3>
        <div className="space-y-4">
          {notificationOptions.map(({ key, label, icon: Icon }) => (
            <div
              key={key}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {label}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.notifications[key]}
                  onChange={(e) =>
                    handleSaveNotification(key, e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TeamSettings = ({ settings, onUpdate, userRole }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("designer");

  const roles = {
    admin: {
      label: "Administrator",
      description: "Full access to all settings and billing",
    },
    designer: {
      label: "Designer",
      description: "Can create and edit ID designs",
    },
    printer: {
      label: "Printer",
      description: "Can only print existing designs",
    },
  };

  const handleInvite = () => {
    if (inviteEmail) {
      const newMember = {
        id: Date.now(),
        name: inviteEmail.split("@")[0],
        email: inviteEmail,
        role: inviteRole,
        status: "pending",
      };
      const updatedMembers = [...localSettings.members, newMember];
      const updatedSettings = { ...localSettings, members: updatedMembers };
      setLocalSettings(updatedSettings);
      onUpdate("team", { members: updatedMembers });
      setInviteEmail("");
    }
  };

  const handleRoleChange = (memberId, newRole) => {
    const updatedMembers = localSettings.members.map((member) =>
      member.id === memberId ? { ...member, role: newRole } : member,
    );
    const updatedSettings = { ...localSettings, members: updatedMembers };
    setLocalSettings(updatedSettings);
    onUpdate("team", { members: updatedMembers });
  };

  const handleRemoveMember = (memberId) => {
    const updatedMembers = localSettings.members.filter(
      (member) => member.id !== memberId,
    );
    const updatedSettings = { ...localSettings, members: updatedMembers };
    setLocalSettings(updatedSettings);
    onUpdate("team", { members: updatedMembers });
  };

  const isAdmin = userRole === "admin";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Team Management
          </h2>
          <p className="text-sm text-gray-500">
            Control who can access and what they can do
          </p>
        </div>
      </div>

      {!isAdmin ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-900">
                Limited Access
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Only administrators can manage team settings. Contact your team
                admin to make changes.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Invite Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-3">
              Invite Team Members
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="team.member@company.com"
                className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(roles).map(([key, { label }]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              <button
                onClick={handleInvite}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send Invite
              </button>
            </div>
          </div>

          {/* Team Members */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Team Members</h3>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {localSettings.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="font-medium text-gray-700">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        member.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {member.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={member.role}
                      onChange={(e) =>
                        handleRoleChange(member.id, e.target.value)
                      }
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {Object.entries(roles).map(([key, { label }]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Role Descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(roles).map(([key, { label, description }]) => (
              <div key={key} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">{label}</h4>
                <p className="text-sm text-gray-600 mt-1">{description}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const BillingSettings = ({ settings }) => {
  const [localSettings] = useState(settings);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const plans = {
    Starter: { seats: 3, price: 29 },
    Professional: { seats: 10, price: 79 },
    Enterprise: { seats: 50, price: 199 },
  };

  const usagePercentage = (localSettings.usedSeats / localSettings.seats) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Billing & Usage</h2>
        <p className="text-sm text-gray-500">
          Transparent pricing, no surprises
        </p>
      </div>

      {/* Current Plan */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {localSettings.plan} Plan
            </h3>
            <p className="text-sm text-gray-500">
              ${plans[localSettings.plan]?.price}/month
            </p>
          </div>
          <button
            onClick={() => setShowUpgrade(!showUpgrade)}
            className="px-6 py-2 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
          >
            Change Plan
          </button>
        </div>

        {/* Usage Meter */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Seat Usage
            </span>
            <span className="text-sm text-gray-500">
              {localSettings.usedSeats} of {localSettings.seats} seats used
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                usagePercentage >= 90
                  ? "bg-red-600"
                  : usagePercentage >= 75
                    ? "bg-yellow-600"
                    : "bg-green-600"
              }`}
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            ></div>
          </div>
          {usagePercentage >= 90 && (
            <p className="mt-2 text-sm text-red-600">
              ⚠️ You're almost out of seats. Consider upgrading your plan.
            </p>
          )}
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Designs Created</p>
            <p className="text-2xl font-semibold text-gray-900">
              {localSettings.usage.designs}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">IDs Printed</p>
            <p className="text-2xl font-semibold text-gray-900">
              {localSettings.usage.prints}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Storage Used</p>
            <p className="text-2xl font-semibold text-gray-900">
              {localSettings.usage.storage}
            </p>
          </div>
        </div>
      </div>

      {/* Upgrade Options */}
      {showUpgrade && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Available Plans</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            {Object.entries(plans).map(([plan, details]) => (
              <div
                key={plan}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  plan === localSettings.plan
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{plan}</h4>
                  {plan === localSettings.plan && (
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  ${details.price}
                  <span className="text-sm font-normal text-gray-500">
                    /month
                  </span>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Up to {details.seats} team members
                </p>
                {plan === localSettings.plan ? (
                  <button className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium cursor-not-allowed">
                    Current Plan
                  </button>
                ) : (
                  <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Upgrade to {plan}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Billing Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="font-medium text-gray-900 mb-4">Billing Information</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Next Billing Date</span>
            <span className="text-sm font-medium text-gray-900">
              {localSettings.nextBilling}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Payment Method</span>
            <span className="text-sm font-medium text-gray-900">
              {localSettings.paymentMethod}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Billing Email</span>
            <span className="text-sm font-medium text-gray-900">
              {mockUser.email}
            </span>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            What happens if I exceed limits?
          </h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>
                Seat limit: New team members will be queued until you upgrade
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>
                Print limit: You can continue printing with a small overage fee
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>No automatic upgrades or hidden charges</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const HelpPanel = ({ isOpen, onClose, context }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHelp, setSelectedHelp] = useState(null);

  const helpTopics = {
    general: [
      {
        id: 1,
        title: "Getting Started with Zaptian",
        type: "tutorial",
        duration: "3 min",
      },
      {
        id: 2,
        title: "Designing Your First ID Card",
        type: "video",
        duration: "5 min",
      },
      {
        id: 3,
        title: "Importing Employee Data",
        type: "guide",
        duration: "4 min",
      },
    ],
    printing: [
      {
        id: 4,
        title: "Print Alignment Guide",
        type: "guide",
        duration: "2 min",
      },
      {
        id: 5,
        title: "Choosing the Right Card Stock",
        type: "video",
        duration: "3 min",
      },
      {
        id: 6,
        title: "Troubleshooting Print Issues",
        type: "guide",
        duration: "4 min",
      },
    ],
    settings: [
      {
        id: 7,
        title: "Team Roles Explained",
        type: "guide",
        duration: "2 min",
      },
      {
        id: 8,
        title: "Company Branding Setup",
        type: "tutorial",
        duration: "3 min",
      },
    ],
  };

  const contextTopics = context
    ? helpTopics[context] || []
    : helpTopics.general;

  const handleSearch = (e) => {
    e.preventDefault();
    // In real app, this would search through help articles
    console.log("Searching for:", searchQuery);
  };

  const handleReportIssue = () => {
    // In real app, this would capture screenshot and open issue reporter
    console.log("Reporting issue with screenshot");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black bg-opacity-25"
        onClick={onClose}
      ></div>

      <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
        <div className="relative w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl">
            {/* Header */}
            <div className="px-6 py-4 bg-blue-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-6 h-6 text-white" />
                  <h2 className="text-lg font-semibold text-white">
                    Help & Support
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-white hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="mt-2 text-sm text-blue-100">
                Ask questions, don't browse manuals
              </p>
            </div>

            {/* Search */}
            <div className="px-6 py-4 border-b border-gray-200">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Try: "Why is my print misaligned?"'
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </form>
            </div>

            {/* Contextual Help */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                {context === "printing"
                  ? "Print Help"
                  : context === "settings"
                    ? "Settings Help"
                    : "Popular Help Topics"}
              </h3>
              <div className="space-y-2">
                {contextTopics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedHelp(topic)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 group-hover:text-blue-600">
                        {topic.title}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          topic.type === "video"
                            ? "bg-red-100 text-red-800"
                            : topic.type === "tutorial"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {topic.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {topic.duration}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="px-6 py-4 space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                  <span className="font-medium text-gray-900 group-hover:text-blue-600">
                    Live Chat Support
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-500">Available</span>
                </div>
              </button>

              <button
                onClick={handleReportIssue}
                className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <Camera className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                <span className="font-medium text-gray-900 group-hover:text-blue-600">
                  Report Issue with Screenshot
                </span>
              </button>

              <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                <BookOpen className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                <span className="font-medium text-gray-900 group-hover:text-blue-600">
                  Interactive Tutorials
                </span>
              </button>
            </div>

            {/* Selected Help Detail */}
            {selectedHelp && (
              <div className="flex-1 border-t border-gray-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedHelp.title}
                    </h3>
                    <button onClick={() => setSelectedHelp(null)}>
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                  {selectedHelp.type === "video" && (
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                      <button className="p-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                        <Play className="w-6 h-6" />
                      </button>
                    </div>
                  )}
                  <div className="prose prose-sm">
                    <p className="text-gray-600">
                      This is where the detailed help content would appear. In a
                      real implementation, this would contain step-by-step
                      instructions, images, or embedded videos.
                    </p>
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Pro Tip:</strong> You can watch this guide while
                        continuing your work. The video will play in a small
                        floating window.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-500 text-center">
                Zaptian doesn't expect users to learn ID printing—it guides them
                through it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsPanel = () => {
  const [settings, setSettings] = useState(initialSettings);
  const [activeSection, setActiveSection] = useState("company");
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpContext, setHelpContext] = useState("settings");
  const [user] = useState(mockUser);

  const sections = [
    {
      id: "company",
      label: "Company",
      icon: Building2,
      description: "Organization identity",
    },
    {
      id: "printing",
      label: "Printing",
      icon: Printer,
      description: "Print preferences",
    },
    {
      id: "account",
      label: "Account",
      icon: User,
      description: "Personal settings",
    },
    {
      id: "team",
      label: "Team",
      icon: Users,
      description: "Collaboration controls",
    },
    {
      id: "billing",
      label: "Billing",
      icon: CreditCard,
      description: "Usage & plans",
    },
  ];

  const handleUpdateSettings = (section, data) => {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
    // In real app, this would call an API
    console.log(`Updated ${section}:`, data);
  };

  const renderSection = () => {
    const sectionProps = {
      settings: settings[activeSection],
      onUpdate: handleUpdateSettings,
      userRole: user.role,
    };

    switch (activeSection) {
      case "company":
        return <CompanySettings {...sectionProps} />;
      case "printing":
        return <PrintingSettings {...sectionProps} />;
      case "account":
        return <AccountSettings {...sectionProps} />;
      case "team":
        return <TeamSettings {...sectionProps} />;
      case "billing":
        return <BillingSettings {...sectionProps} />;
      default:
        return null;
    }
  };

  const openHelp = (context) => {
    setHelpContext(context);
    setHelpOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Settings className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Settings
                </h1>
                <p className="text-sm text-gray-500">
                  Preferences, not system administration
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => openHelp("settings")}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <HelpCircle className="w-4 h-4" />
                Help
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Exit Settings
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Left Navigation */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-5rem)]">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </p>
              </div>
            </div>
          </div>
          <nav className="p-4">
            <ul className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <li key={section.id}>
                    <button
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeSection === section.id
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${activeSection === section.id ? "text-blue-600" : "text-gray-400"}`}
                      />
                      <div className="flex-1">
                        <span className="font-medium">{section.label}</span>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {section.description}
                        </p>
                      </div>
                      {activeSection === section.id && (
                        <ChevronRight className="w-4 h-4 text-blue-600" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Safety Message */}
          <div className="p-4 mt-8 mx-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-900">
                  You can't break anything here
                </p>
                <p className="text-xs text-green-700 mt-0.5">
                  All changes are safe and reversible
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Panel */}
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <p className="text-gray-600">
                Each section is self-contained. Changes apply only to that
                section. No "Save All" pressure.
              </p>
            </div>
            {renderSection()}
          </div>
        </main>
      </div>

      {/* Floating Help Button */}
      <button
        onClick={() => openHelp("general")}
        className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      {/* Help Panel */}
      <HelpPanel
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
        context={helpContext}
      />
    </div>
  );
};

export default SettingsPanel;
