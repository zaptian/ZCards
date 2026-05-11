import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  IdCard,
  Palette,
  Users,
  Copy,
  Edit,
  Check,
  Download,
  Eye,
  Layers,
  Filter,
  Sparkles,
  X,
  ChevronDown,
  Printer,
  QrCode,
  Camera,
  Shield,
  Tag,
  Zap,
  BadgeCheck,
  CloudUpload,
  Settings,
  Layout,
  Grid3x3,
  Search,
  FolderOpen,
  FileText,
  Image as ImageIcon,
  ScanLine,
  CreditCard,
  UserCheck,
  UserPlus,
  Database
} from 'lucide-react';

// ID Card Template Data
const idCardTemplates = [
  {
    id: 1,
    name: 'Corporate Security Badge',
    category: 'Corporate',
    orientation: 'Landscape',
    colorScheme: 'Professional',
    editableFields: 8,
    compatibleFields: ['Employee ID', 'Name', 'Department', 'Photo', 'QR Code', 'Issue Date', 'Signature', 'Access Level'],
    previewColor: '#2563eb',
    popularity: 98,
    isFeatured: true,
    uses: ['Office Access', 'Security', 'Corporate Events'],
    previewData: {
      name: 'John Smith',
      title: 'Senior Developer',
      idNumber: 'EMP-2024-00123',
      department: 'Engineering',
      photoPlaceholder: true,
      qrCode: true,
      signature: true
    }
  },
  {
    id: 2,
    name: 'University Student ID',
    category: 'Education',
    orientation: 'Portrait',
    colorScheme: 'Academic',
    editableFields: 10,
    compatibleFields: ['Student ID', 'Full Name', 'Faculty', 'Year', 'Photo', 'Barcode', 'Validity Date', 'Blood Group'],
    previewColor: '#7c3aed',
    popularity: 92,
    isFeatured: true,
    uses: ['Campus Access', 'Library', 'Exams'],
    previewData: {
      name: 'Sarah Johnson',
      title: 'Computer Science',
      idNumber: 'STU-2024-0456',
      department: 'Faculty of Engineering',
      photoPlaceholder: true,
      barcode: true
    }
  },
  {
    id: 3,
    name: 'Healthcare Staff ID',
    category: 'Healthcare',
    orientation: 'Landscape',
    colorScheme: 'Medical',
    editableFields: 12,
    compatibleFields: ['Staff ID', 'Name', 'Role', 'Department', 'Photo', 'QR Code', 'Emergency Contact', 'Certifications'],
    previewColor: '#059669',
    popularity: 95,
    isFeatured: true,
    uses: ['Hospital Access', 'Patient Identification', 'Medical Records'],
    previewData: {
      name: 'Dr. Emily Chen',
      title: 'Cardiologist',
      idNumber: 'MED-2024-00789',
      department: 'Cardiology',
      photoPlaceholder: true,
      qrCode: true,
      certifications: ['MD', 'PhD']
    }
  },
  {
    id: 4,
    name: 'Event VIP Pass',
    category: 'Events',
    orientation: 'Landscape',
    colorScheme: 'Premium',
    editableFields: 6,
    compatibleFields: ['Guest Name', 'Event Name', 'Access Level', 'QR Code', 'Seat Number', 'Date'],
    previewColor: '#dc2626',
    popularity: 88,
    uses: ['Conferences', 'Concerts', 'VIP Events'],
    previewData: {
      name: 'VIP Guest',
      title: 'Platinum Access',
      idNumber: 'VIP-001',
      department: 'All Areas',
      photoPlaceholder: false,
      qrCode: true
    }
  },
  {
    id: 5,
    name: 'Government Employee ID',
    category: 'Government',
    orientation: 'Portrait',
    colorScheme: 'Official',
    editableFields: 14,
    compatibleFields: ['Employee ID', 'Name', 'Position', 'Department', 'Agency', 'Photo', 'Signature', 'Security Clearance'],
    previewColor: '#475569',
    popularity: 90,
    isFeatured: true,
    uses: ['Government Buildings', 'Secure Facilities', 'Official Meetings'],
    previewData: {
      name: 'Robert Williams',
      title: 'Senior Analyst',
      idNumber: 'GOV-2024-00345',
      department: 'National Security',
      photoPlaceholder: true,
      signature: true,
      securityLevel: 'SECRET'
    }
  },
  {
    id: 6,
    name: 'Gym Membership Card',
    category: 'Fitness',
    orientation: 'Landscape',
    colorScheme: 'Modern',
    editableFields: 7,
    compatibleFields: ['Member ID', 'Name', 'Membership Type', 'Expiry Date', 'Barcode', 'QR Code', 'Photo'],
    previewColor: '#ea580c',
    popularity: 85,
    uses: ['Gym Access', 'Class Bookings', 'Locker Access'],
    previewData: {
      name: 'Mike Taylor',
      title: 'Premium Member',
      idNumber: 'GYM-2024-05678',
      department: 'Fitness Center',
      photoPlaceholder: true,
      barcode: true,
      expiryDate: '2024-12-31'
    }
  },
  {
    id: 7,
    name: 'Library Membership Card',
    category: 'Education',
    orientation: 'Portrait',
    colorScheme: 'Classic',
    editableFields: 9,
    compatibleFields: ['Member ID', 'Name', 'Membership Type', 'Expiry Date', 'Barcode', 'Contact', 'Photo'],
    previewColor: '#0d9488',
    popularity: 82,
    uses: ['Library Access', 'Book Borrowing', 'Digital Resources'],
    previewData: {
      name: 'Lisa Brown',
      title: 'Premium Member',
      idNumber: 'LIB-2024-03456',
      department: 'Main Library',
      photoPlaceholder: true,
      barcode: true
    }
  },
  {
    id: 8,
    name: 'Volunteer ID Badge',
    category: 'Non-Profit',
    orientation: 'Landscape',
    colorScheme: 'Friendly',
    editableFields: 8,
    compatibleFields: ['Volunteer ID', 'Name', 'Role', 'Organization', 'Photo', 'QR Code', 'Emergency Contact'],
    previewColor: '#db2777',
    popularity: 79,
    uses: ['Event Volunteering', 'Organization Access', 'Identification'],
    previewData: {
      name: 'David Wilson',
      title: 'Event Coordinator',
      idNumber: 'VOL-2024-001',
      department: 'Community Services',
      photoPlaceholder: true,
      qrCode: true
    }
  }
];

// Filter options
const categories = ['All', 'Corporate', 'Education', 'Healthcare', 'Government', 'Events', 'Fitness', 'Non-Profit'];
const orientations = ['All', 'Landscape', 'Portrait'];
const colorSchemes = ['All', 'Professional', 'Academic', 'Medical', 'Premium', 'Official', 'Modern', 'Classic', 'Friendly'];

const TempleteDesign = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [templates, setTemplates] = useState(idCardTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [filters, setFilters] = useState({
    category: 'All',
    orientation: 'All',
    colorScheme: 'All'
  });
  const [showPreview, setShowPreview] = useState(false);
  const [cloning, setCloning] = useState(false);
  const [cloneComplete, setCloneComplete] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Filter templates
  useEffect(() => {
    let filtered = idCardTemplates;
    
    if (filters.category !== 'All') {
      filtered = filtered.filter(t => t.category === filters.category);
    }
    
    if (filters.orientation !== 'All') {
      filtered = filtered.filter(t => t.orientation === filters.orientation);
    }
    
    if (filters.colorScheme !== 'All') {
      filtered = filtered.filter(t => t.colorScheme === filters.colorScheme);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.uses.some(use => use.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    if (activeTab === 'featured') {
      filtered = filtered.filter(t => t.isFeatured);
    }
    
    setTemplates(filtered);
  }, [filters, searchQuery, activeTab]);

  const handleCloneTemplate = (template) => {
    setCloning(true);
    setSelectedTemplate(template);
    
    setTimeout(() => {
      setCloning(false);
      setCloneComplete(true);
      setTimeout(() => {
        setCloneComplete(false);
        setShowPreview(true);
      }, 1500);
    }, 1000);
  };

  const handleCustomize = (template) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const resetFilters = () => {
    setFilters({
      category: 'All',
      orientation: 'All',
      colorScheme: 'All'
    });
    setSearchQuery('');
    setActiveTab('all');
  };

  const IDCardPreview = ({ template, size = 'medium' }) => {
    const sizeClasses = {
      small: 'w-64 h-40',
      medium: 'w-80 h-52',
      large: 'w-96 h-64'
    };
    
    return (
      <div 
        className={`${sizeClasses[size]} rounded-2xl overflow-hidden border-2 border-white shadow-xl transform transition-transform hover:scale-105`}
        style={{ 
          background: `linear-gradient(135deg, ${template.previewColor}20, ${template.previewColor}40, ${template.previewColor}20)`
        }}
      >
        {/* Card Content */}
        <div className="h-full p-4 relative">
          {/* Card Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {template.category}
              </div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">
                {template.previewData.name}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {template.previewData.qrCode && (
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded flex items-center justify-center">
                  <QrCode size={20} className="text-gray-600 dark:text-gray-400" />
                </div>
              )}
              {template.previewData.photoPlaceholder && (
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {template.previewData.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
            </div>
          </div>
          
          {/* Card Body */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Tag size={12} className="text-gray-500" />
              <div className="text-xs font-mono font-bold text-gray-800 dark:text-gray-200">
                {template.previewData.idNumber}
              </div>
            </div>
            
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {template.previewData.title}
            </div>
            
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {template.previewData.department}
            </div>
            
            {template.previewData.securityLevel && (
              <div className="mt-2">
                <div className="inline-block px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold rounded">
                  {template.previewData.securityLevel}
                </div>
              </div>
            )}
          </div>
          
          {/* Card Footer */}
          <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {template.name}
            </div>
            {template.previewData.barcode && (
              <div className="flex items-center space-x-1">
                {[1,2,3,4,5,6,7,8].map(i => (
                  <div 
                    key={i}
                    className="w-1 bg-gray-800 dark:bg-gray-300"
                    style={{ height: `${Math.random() * 20 + 10}px` }}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Security Hologram Effect */}
          <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-gradient-to-br from-transparent via-white/30 to-transparent" />
        </div>
      </div>
    );
  };

  const TemplateCard = ({ template }) => (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:-translate-y-2">
      {/* Featured badge */}
      {template.isFeatured && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full">
          <Sparkles size={12} />
          <span>Featured</span>
        </div>
      )}

      {/* Preview section */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <IDCardPreview template={template} size="small" />
        
        {/* Hover actions */}
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button 
            onClick={() => handleCustomize(template)}
            className="p-3 bg-white dark:bg-gray-800 rounded-full hover:scale-110 transition-transform shadow-lg"
          >
            <Eye size={18} className="text-gray-700 dark:text-gray-300" />
          </button>
          <button 
            onClick={() => handleCloneTemplate(template)}
            className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:scale-110 transition-transform shadow-lg"
          >
            <Copy size={18} />
          </button>
          <button className="p-3 bg-emerald-500 text-white rounded-full hover:scale-110 transition-transform shadow-lg">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Content section */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">{template.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium">
                {template.category}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                {template.orientation}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <Edit size={12} />
            <span>{template.editableFields} fields</span>
          </div>
        </div>

        {/* Use cases */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Users size={12} className="text-gray-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Uses:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {template.uses.slice(0, 2).map((use, index) => (
              <span 
                key={index}
                className="text-xs px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
              >
                {use}
              </span>
            ))}
            {template.uses.length > 2 && (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                +{template.uses.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Palette size={14} className="text-gray-400" />
            <span className="text-xs text-gray-600 dark:text-gray-300">{template.colorScheme}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(i => (
                <div 
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${i <= Math.floor(template.popularity/20) ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
              {template.popularity}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const PreviewModal = () => (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl border border-gray-300 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
              <IdCard size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedTemplate?.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <span>ID Card Template</span>
                <span>•</span>
                <span>{selectedTemplate?.category}</span>
                <span>•</span>
                <span>{selectedTemplate?.editableFields} editable fields</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <Printer size={18} />
              <span>Print Preview</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transition-shadow">
              <Download size={18} />
              <span>Use Template</span>
            </button>
            <button 
              onClick={() => setShowPreview(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Preview content */}
        <div className="p-6 overflow-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          <div className="grid grid-cols-3 gap-8">
            {/* Left sidebar - Template details */}
            <div className="col-span-1 space-y-6">
              {/* Card Preview */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                <div className="flex justify-center mb-4">
                  <IDCardPreview template={selectedTemplate} size="medium" />
                </div>
                <div className="text-center">
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:border-blue-500 transition-colors">
                    <Camera size={16} />
                    <span>Change Photo</span>
                  </button>
                </div>
              </div>
              
              {/* Fields */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-5">
                <h4 className="font-bold text-lg mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText size={18} />
                  Available Fields
                </h4>
                <div className="space-y-3">
                  {selectedTemplate?.compatibleFields.map((field, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <span className="text-gray-700 dark:text-gray-300">{field}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">
                          Editable
                        </span>
                        <Settings size={14} className="text-gray-400 hover:text-blue-500 cursor-pointer" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main preview - Customization panel */}
            <div className="col-span-2">
              <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Customization Panel</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Auto-save enabled</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  </div>
                </div>
                
                {/* Customization tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6">
                  {['Design', 'Fields', 'Security', 'Export'].map(tab => (
                    <button
                      key={tab}
                      className="px-4 py-2 font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 border-b-2 border-transparent hover:border-blue-500"
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                
                {/* Design customization */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Color Scheme
                      </label>
                      <div className="flex gap-2">
                        {['#2563eb', '#7c3aed', '#059669', '#dc2626', '#475569'].map(color => (
                          <div
                            key={color}
                            className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-700 cursor-pointer hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Orientation
                      </label>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium">
                          Landscape
                        </button>
                        <button className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
                          Portrait
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Security Features
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-blue-500">
                        <input type="checkbox" className="rounded text-blue-600" />
                        <span className="text-gray-700 dark:text-gray-300">QR Code</span>
                      </label>
                      <label className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-blue-500">
                        <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                        <span className="text-gray-700 dark:text-gray-300">Barcode</span>
                      </label>
                      <label className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-blue-500">
                        <input type="checkbox" className="rounded text-blue-600" />
                        <span className="text-gray-700 dark:text-gray-300">Hologram</span>
                      </label>
                      <label className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-blue-500">
                        <input type="checkbox" className="rounded text-blue-600" />
                        <span className="text-gray-700 dark:text-gray-300">Watermark</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                        <Zap size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">AI Design Assistant</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Let AI suggest design improvements based on your industry
                        </p>
                      </div>
                      <button className="ml-auto px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:shadow-lg transition-shadow">
                        Generate
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end gap-3">
                  <button className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
                    Save as Draft
                  </button>
                  <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-xl transition-shadow flex items-center gap-2">
                    <BadgeCheck size={18} />
                    Generate ID Card
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-white/90 dark:bg-gray-900/90 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                <IdCard size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
                  ID Card Designer Pro
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <Shield size={12} />
                  Professional ID card design software • Create in minutes
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
                <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
              </div>
              
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium hover:shadow-lg transition-shadow">
                <CloudUpload size={18} />
                <span>Import Data</span>
              </button>
              
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats Banner */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Design Professional ID Cards in Minutes</h2>
              <p className="text-blue-100">Choose from industry-specific templates. Customize every detail.</p>
            </div>
            <div className="flex gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold">{idCardTemplates.length}+</div>
                <div className="text-blue-100">Templates</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-blue-100">Fields Each</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">99.9%</div>
                <div className="text-blue-100">Compatibility</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid grid-cols-4 gap-4">
          {[
            { icon: UserPlus, label: 'Bulk Generate', color: 'from-blue-500 to-cyan-500' },
            { icon: ScanLine, label: 'QR/Barcode', color: 'from-purple-500 to-pink-500' },
            { icon: CreditCard, label: 'Print Preview', color: 'from-amber-500 to-orange-500' },
            { icon: Database, label: 'Data Import', color: 'from-emerald-500 to-teal-500' }
          ].map((action, index) => (
            <button
              key={index}
              className={`bg-gradient-to-r ${action.color} text-white p-4 rounded-2xl hover:shadow-lg transition-shadow flex flex-col items-center gap-2`}
            >
              <action.icon size={24} />
              <span className="font-medium">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
            {[
              { id: 'all', label: 'All Templates', icon: Grid3x3 },
              { id: 'featured', label: 'Featured', icon: Sparkles },
              { id: 'corporate', label: 'Corporate', icon: Users },
              { id: 'education', label: 'Education', icon: IdCard }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Filter size={20} />
              Filter by Category
            </h2>
            <div className="flex items-center gap-4">
              <button
                onClick={resetFilters}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1"
              >
                <X size={14} />
                Reset filters
              </button>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {templates.length} of {idCardTemplates.length} templates
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {categories.slice(1).map(category => (
              <button
                key={category}
                onClick={() => setFilters(prev => ({ ...prev, category }))}
                className={`px-4 py-2 rounded-xl transition-all ${
                  filters.category === category
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured templates */}
        {activeTab === 'all' || activeTab === 'featured' ? (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={20} className="text-amber-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Featured Templates</h2>
              <div className="ml-2 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full">
                Most Popular
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {templates.filter(t => t.isFeatured).slice(0, 4).map(template => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </div>
        ) : null}

        {/* All templates */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {activeTab === 'all' ? 'All ID Card Templates' : 
             activeTab === 'featured' ? 'Featured Templates' : 
             `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Templates`}
          </h2>
          {templates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {templates.map(template => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-block p-4 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 mb-4">
                <Search size={48} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No templates found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Try adjusting your filters or search terms</p>
              <button
                onClick={resetFilters}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transition-shadow"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Clone notification */}
      {cloning && (
        <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 border border-gray-200 dark:border-gray-700 min-w-64">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <Copy size={16} className="text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full animate-ping" />
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-white">Cloning template...</div>
                <div className="text-sm text-gray-500">Preparing customization workspace</div>
              </div>
            </div>
            <div className="mt-2 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 animate-progress" />
            </div>
          </div>
        </div>
      )}

      {cloneComplete && (
        <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-2xl p-4 text-white min-w-64">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Check size={16} />
              </div>
              <div>
                <div className="font-bold">Template ready!</div>
                <div className="text-sm text-emerald-100">Opening designer...</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview modal */}
      {showPreview && selectedTemplate && <PreviewModal />}

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <IdCard size={20} className="text-blue-500" />
                <span className="font-bold text-gray-900 dark:text-white">ID Card Pro</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Professional ID card design software trusted by 10,000+ organizations worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>Bulk ID Generation</li>
                <li>QR Code Integration</li>
                <li>Data Import/Export</li>
                <li>Print Ready Templates</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>Documentation</li>
                <li>Video Tutorials</li>
                <li>Community Forum</li>
                <li>Contact Support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>About Us</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
          <div className="py-6 border-t border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} ID Card Designer Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 1s ease-in-out;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TempleteDesign;