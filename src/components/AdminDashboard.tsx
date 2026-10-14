import React, { useState } from 'react';
import { useSiteContext } from '../context/SiteContext';
import { Product, GarageService, Vehicle, Language, OrderRecord, BookingRecord, TestDriveRecord } from '../types';
import { FontStyleOption } from '../types/admin';
import { 
  ShieldAlert, 
  Settings, 
  Layers, 
  Phone, 
  MapPin, 
  Palette, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Save, 
  RotateCcw, 
  Package, 
  Wrench, 
  Car, 
  X, 
  MessageCircle, 
  Eye, 
  Type, 
  LogOut, 
  Lock, 
  UserCheck, 
  Upload, 
  ShoppingCart, 
  Users, 
  Calendar, 
  Clock, 
  FileText, 
  Sliders, 
  Copy, 
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  Search
} from 'lucide-react';

interface AdminDashboardProps {
  language: Language;
  isAdmin?: boolean;
  onNavigateHome?: () => void;
  orders?: OrderRecord[];
  onUpdateOrder?: (id: string, updated: Partial<OrderRecord>) => void;
  onDeleteOrder?: (id: string) => void;
  bookings?: BookingRecord[];
  onUpdateBooking?: (id: string, updated: Partial<BookingRecord>) => void;
  testDrives?: TestDriveRecord[];
  onUpdateTestDrive?: (id: string, updated: Partial<TestDriveRecord>) => void;
}

const SESSION_STORAGE_KEY = 'apex_admin_auth';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  language,
  isAdmin = false,
  onNavigateHome,
  orders = [],
  onUpdateOrder,
  onDeleteOrder,
  bookings = [],
  onUpdateBooking,
  testDrives = [],
  onUpdateTestDrive
}) => {
  const {
    config,
    addProduct,
    updateProduct,
    deleteProduct,
    addService,
    updateService,
    deleteService,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    updateSiteSettings,
    resetToDefaults
  } = useSiteContext();

  const isAr = language === 'ar';

  // Secure Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
      return stored === 'true' || isAdmin;
    } catch {
      return isAdmin;
    }
  });

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Tabs: listings | orders | crm | builder | theme | business
  const [activeTab, setActiveTab] = useState<'listings' | 'orders' | 'crm' | 'builder' | 'theme' | 'business'>('listings');
  const [listingCategory, setListingCategory] = useState<'products' | 'services' | 'vehicles'>('products');
  const [listingSearch, setListingSearch] = useState('');

  // Business info form state
  const [phone, setPhone] = useState(config.phone || '+965 2200 2739');
  const [whatsapp, setWhatsapp] = useState(config.whatsapp || '+965 9900 1234');
  const [location, setLocation] = useState(config.location || 'Shuwaikh Industrial Area 1, Block 2, Street 18, Kuwait City');
  const [businessSavedToast, setBusinessSavedToast] = useState(false);

  // Theme & Colors Customizer state
  const [themeColor, setThemeColor] = useState(config.themeColor || '#0284c7');
  const [accentColor, setAccentColor] = useState(config.accentColor || '#f59e0b');
  const [headerBg, setHeaderBg] = useState(config.headerBg || '#0f172a');
  const [headerText, setHeaderText] = useState(config.headerText || '#ffffff');
  const [cardBg, setCardBg] = useState(config.cardBg || '#ffffff');
  const [footerBg, setFooterBg] = useState(config.footerBg || '#0b0f19');
  const [fontStyle, setFontStyle] = useState<FontStyleOption>(config.fontStyle || 'sans');
  const [customFontFamily, setCustomFontFamily] = useState(config.customFontFamily || '');
  const [themeSavedToast, setThemeSavedToast] = useState(false);

  // Website Text Content Editor state (Shopify-like Section Editor)
  const [logoUrl, setLogoUrl] = useState(config.logoUrl || '');
  const [announcementText, setAnnouncementText] = useState(config.announcementText || '⚡ Kuwait Premier Dyno Tuning & Performance Garage — Shuwaikh Branch');
  const [announcementTextAr, setAnnouncementTextAr] = useState(config.announcementTextAr || '⚡ كراج الأداء والبرمجة الأول في الكويت — فرع الشويخ');
  const [heroTitle, setHeroTitle] = useState(config.heroTitle || 'Kuwait Premier Automotive Dyno & Tuning Hub');
  const [heroTitleAr, setHeroTitleAr] = useState(config.heroTitleAr || 'مركز الأداء العالي والبرمجة وفحص السيارات بالكويت');
  const [heroSubtitle, setHeroSubtitle] = useState(config.heroSubtitle || 'Direct dealer diagnostic telemetry, bespoke Stage 1-3 ECU calibration, and certified parts catalogue.');
  const [heroSubtitleAr, setHeroSubtitleAr] = useState(config.heroSubtitleAr || 'فحص شامل بأحدث أجهزة الوكالة، برمجة مخصصة على الداينو، وقطع غيار أصلية مكفولة.');
  const [servicesTitle, setServicesTitle] = useState(config.servicesTitle || 'Engineering Diagnostic & Repair Services');
  const [partsTitle, setPartsTitle] = useState(config.partsTitle || 'Performance Parts & Track Hardware');
  const [showroomTitle, setShowroomTitle] = useState(config.showroomTitle || 'Verified GCC Spec Pre-Owned Showroom');
  const [footerAbout, setFooterAbout] = useState(config.footerAbout || 'State of the art automotive engineering center in Shuwaikh.');
  const [showAnnouncement, setShowAnnouncement] = useState(config.showAnnouncement ?? true);
  const [showObdScanner, setShowObdScanner] = useState(config.showObdScanner ?? true);
  const [showChatbot, setShowChatbot] = useState(config.showChatbot ?? true);
  const [showSalesToast, setShowSalesToast] = useState(config.showSalesToast ?? true);
  const [builderSavedToast, setBuilderSavedToast] = useState(false);

  // Listings Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItemType, setEditingItemType] = useState<'product' | 'service' | 'vehicle'>('product');
  const [editingItemId, setEditingItemId] = useState<string | number | null>(null);

  // Listing Form Inputs
  const [formTitle, setFormTitle] = useState('');
  const [formTitleAr, setFormTitleAr] = useState('');
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formImage, setFormImage] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDescriptionAr, setFormDescriptionAr] = useState('');
  const [formCategory, setFormCategory] = useState('Auto Parts & Hardware');
  const [formBadge, setFormBadge] = useState('VERIFIED');
  const [formStock, setFormStock] = useState<number>(10);
  const [formPartNumber, setFormPartNumber] = useState('APX-1001');
  const [formWarranty, setFormWarranty] = useState('1 Year Garage Replacement');
  const [formMileage, setFormMileage] = useState('12,000 KM');
  const [formYear, setFormYear] = useState<number>(2024);
  const [formEngine, setFormEngine] = useState('4.0L Twin-Turbo V8');
  const [formPower, setFormPower] = useState('650 HP');
  const [formDuration, setFormDuration] = useState('1.5 Hours');

  // Customer Accounts directory from localStorage
  const [registeredUsers] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('apextorque_user');
      return stored ? [JSON.parse(stored)] : [];
    } catch {
      return [];
    }
  });

  const THEME_PRESETS = [
    { name: 'Sky Blue (Default)', hex: '#0284c7' },
    { name: 'Racing Amber / Gold', hex: '#d97706' },
    { name: 'Apex Emerald', hex: '#059669' },
    { name: 'Crimson Red Track', hex: '#dc2626' },
    { name: 'Indigo Electric', hex: '#4f46e5' },
    { name: 'Dark Gunmetal Slate', hex: '#0f172a' },
    { name: 'Motorsport Orange', hex: '#ea580c' },
    { name: 'Violet Hypercar', hex: '#7c3aed' }
  ];

  const FONT_OPTIONS: { id: FontStyleOption; name: string; desc: string; sample: string }[] = [
    { id: 'sans', name: 'Inter & Geist (Modern Sans)', desc: 'Clean, high-performance automotive UI', sample: 'Modern Performance' },
    { id: 'orbitron', name: 'Orbitron (Futuristic Motorsport)', desc: 'Aggressive HUD & racing telemetry styling', sample: 'SPEED TELEMETRY 850HP' },
    { id: 'mono', name: 'JetBrains / Technical Mono', desc: 'ECU tuning and diagnostic look', sample: '0x7F DTC_DIAGNOSTICS' },
    { id: 'montserrat', name: 'Montserrat Geometric', desc: 'Bold, structured corporate auto brand', sample: 'PRECISION ENGINEERING' },
    { id: 'serif', name: 'Playfair (Executive Luxury)', desc: 'Refined elegance for VIP showroom cars', sample: 'Exclusive VIP Fleet' },
    { id: 'tajawal', name: 'Tajawal / Cairo (Arabic Optimized)', desc: 'Arabic-first high clarity font', sample: 'كراج الأداء والبرمجة' }
  ];

  // Image Upload Handler (Converts file to Base64 data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('File size exceeds 8MB. Please choose a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setter(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Login Authentication
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = usernameInput.trim().toLowerCase();
    const cleanPassword = passwordInput.trim();

    if (
      (cleanUsername === 'admin' && cleanPassword === 'ApexTorque#2026!') ||
      (cleanUsername === 'apex' && cleanPassword === 'ApexTorque#2026!') ||
      (cleanUsername === 'manager' && cleanPassword === 'admin123')
    ) {
      setIsAdminAuthenticated(true);
      setAuthError(false);
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
      } catch (err) {
        console.warn('Session write error:', err);
      }
    } else {
      setAuthError(true);
    }
  };

  const handleAdminLogout = () => {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (err) {
      console.warn('Session remove error:', err);
    }
    setIsAdminAuthenticated(false);
  };

  // Open Add Modal
  const handleOpenAdd = (type: 'product' | 'service' | 'vehicle') => {
    setEditingItemType(type);
    setEditingItemId(null);
    setFormTitle('');
    setFormTitleAr('');
    setFormPrice(type === 'product' ? 35 : type === 'service' ? 25 : 18500);
    setFormImage('https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800');
    setFormDescription('High performance component tuned for GCC conditions.');
    setFormDescriptionAr('قطعة أداء عالية الجودة ومطابقة لمواصفات الخليج.');
    setFormCategory(type === 'product' ? 'Auto Parts & Hardware' : 'Diagnosing & Repairing');
    setFormBadge(type === 'vehicle' ? 'VERIFIED PRE-OWNED' : 'OFFICIAL WORKSHOP');
    setFormStock(15);
    setFormPartNumber(`APX-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormWarranty('1 Year Full Garage Replacement');
    setFormMileage('15,000 KM');
    setFormYear(2024);
    setFormEngine('4.0L V8 Bi-Turbo');
    setFormPower('550 HP');
    setFormDuration('1.5 Hours');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (type: 'product' | 'service' | 'vehicle', item: any) => {
    setEditingItemType(type);
    setEditingItemId(item.id);
    setFormTitle(item.name || item.title || '');
    setFormTitleAr(item.nameAr || item.titleAr || '');
    setFormPrice(item.price || 0);
    setFormImage(item.image || '');
    setFormDescription(item.description || item.longDescription || '');
    setFormDescriptionAr(item.descriptionAr || '');
    setFormCategory(item.category || 'Auto Parts & Hardware');
    setFormBadge(item.badge || 'VERIFIED');
    setFormStock(item.stock || 10);
    setFormPartNumber(item.partNumber || `APX-${item.id}`);
    setFormWarranty(item.warranty || '1 Year Garage Replacement');
    setFormMileage(item.mileage || '0 KM');
    setFormYear(item.year || 2024);
    setFormEngine(item.engine || 'High Output Platform');
    setFormPower(item.power || '450+ HP');
    setFormDuration(item.duration || '1 Hour');
    setIsModalOpen(true);
  };

  // Duplicate an existing item
  const handleDuplicateItem = (type: 'product' | 'service' | 'vehicle', item: any) => {
    if (type === 'product') {
      addProduct({
        ...item,
        name: `${item.name} (Copy)`,
        nameAr: item.nameAr ? `${item.nameAr} (نسخة)` : undefined
      });
    } else if (type === 'service') {
      addService({
        ...item,
        id: `srv-${Date.now()}`,
        title: `${item.title} (Copy)`
      });
    } else if (type === 'vehicle') {
      addVehicle({
        ...item,
        name: `${item.name} (Copy)`
      });
    }
  };

  // Save Modal Data
  const handleSaveListing = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingItemType === 'product') {
      const productPayload: Omit<Product, 'id'> = {
        name: formTitle,
        nameAr: formTitleAr || formTitle,
        category: formCategory as any,
        price: Number(formPrice),
        priceDisplay: `${Number(formPrice)} KWD (Cash on Delivery)`,
        rating: 5,
        specs: ['100% Genuine Certified', 'Direct Bolt-On Fitment', formWarranty],
        image: formImage,
        gallery: [formImage],
        description: formDescription,
        descriptionAr: formDescriptionAr || formDescription,
        stock: Number(formStock),
        partNumber: formPartNumber,
        warranty: formWarranty
      };

      if (editingItemId !== null) {
        updateProduct(Number(editingItemId), productPayload);
      } else {
        addProduct(productPayload);
      }
    } else if (editingItemType === 'service') {
      const servicePayload: GarageService = {
        id: editingItemId ? String(editingItemId) : `srv-${Date.now()}`,
        title: formTitle,
        titleAr: formTitleAr || formTitle,
        duration: formDuration,
        price: Number(formPrice),
        priceDisplay: `${Number(formPrice)} KWD (Cash on Arrival)`,
        description: formDescription,
        descriptionAr: formDescriptionAr || formDescription,
        icon: 'wrench',
        image: formImage,
        gallery: [formImage],
        features: ['Certified Kuwait Dyno Calibration', 'Master Tech Signed Report', 'Diagnostic Log Backup'],
        warranty: formWarranty
      };

      if (editingItemId !== null) {
        updateService(String(editingItemId), servicePayload);
      } else {
        addService(servicePayload);
      }
    } else if (editingItemType === 'vehicle') {
      const vehiclePayload: Omit<Vehicle, 'id'> = {
        name: formTitle,
        nameAr: formTitleAr || formTitle,
        brand: 'Apex Motors',
        model: formTitle,
        year: Number(formYear),
        condition: 'Mint / GCC Spec',
        inspectionScore: '99/100 Certified',
        mileage: formMileage,
        price: Number(formPrice),
        engine: formEngine,
        engineDisplacement: '4000cc',
        power: formPower,
        powerTorque: '700 Nm',
        transmission: 'Dual-Clutch Auto',
        drivetrain: 'AWD',
        exteriorTrim: 'Carbon Package',
        exteriorColorPaintCode: 'OEM Factory',
        interiorTrim: 'Alcantara Sport',
        interiorTrimColor: 'Black / Contrast Stitch',
        fuelTankCapacity: '80L',
        ownershipHistory: '1 Kuwait Owner',
        vinStockId: `VIN-${Math.floor(100000 + Math.random() * 900000)}`,
        inspectionHistory: 'Full Garage Certification',
        image: formImage,
        gallery: [formImage],
        badge: formBadge,
        location: 'Shuwaikh VIP Showroom (Cash on Arrival)',
        description: formDescription,
        warranty: formWarranty,
        specs: ['Full Kuwait Dealer History', 'Zero Accident Record', 'Dyno Verified Output']
      };

      if (editingItemId !== null) {
        updateVehicle(Number(editingItemId), vehiclePayload);
      } else {
        addVehicle(vehiclePayload);
      }
    }

    setIsModalOpen(false);
  };

  // Save Website Builder Copy & Sections
  const handleSaveWebsiteBuilder = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      logoUrl,
      announcementText,
      announcementTextAr,
      heroTitle,
      heroTitleAr,
      heroSubtitle,
      heroSubtitleAr,
      servicesTitle,
      partsTitle,
      showroomTitle,
      footerAbout,
      showAnnouncement,
      showObdScanner,
      showChatbot,
      showSalesToast
    });
    setBuilderSavedToast(true);
    setTimeout(() => setBuilderSavedToast(false), 2500);
  };

  // Save Theme & Color Customizer
  const handleSaveThemeSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      themeColor,
      accentColor,
      headerBg,
      headerText,
      cardBg,
      footerBg,
      fontStyle,
      customFontFamily
    });
    setThemeSavedToast(true);
    setTimeout(() => setThemeSavedToast(false), 2500);
  };

  // Save Business Contacts
  const handleSaveBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      phone,
      whatsapp,
      location
    });
    setBusinessSavedToast(true);
    setTimeout(() => setBusinessSavedToast(false), 2500);
  };

  // Login Screen if not authenticated
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-slate-900 text-white">
        <div className="max-w-md w-full bg-slate-800/90 border border-slate-700/80 rounded-3xl p-8 shadow-2xl backdrop-blur-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-black mb-1.5 tracking-tight">Workshop Admin Portal</h2>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Authorized management suite for garage owners, live inventory editors, and customer orders.
          </p>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                Admin Username
              </label>
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => {
                  setUsernameInput(e.target.value);
                  setAuthError(false);
                }}
                placeholder="admin"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-500 transition-all font-sans"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                Master Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setAuthError(false);
                }}
                placeholder="••••••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-500 transition-all font-mono"
              />
            </div>

            {authError && (
              <div className="text-xs font-bold text-red-400 bg-red-950/40 border border-red-800/50 py-2.5 px-3 rounded-xl flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
                <span>Invalid credentials. (Hint: admin / ApexTorque#2026!)</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Sign In to Admin Hub</span>
            </button>

            {onNavigateHome && (
              <button
                type="button"
                onClick={onNavigateHome}
                className="text-xs text-slate-400 hover:text-white transition-colors block mx-auto pt-2"
              >
                ← Return to Public Storefront
              </button>
            )}
          </form>
        </div>
      </div>
    );
  }

  // Filter listings
  const filteredProducts = config.products.filter(p => 
    p.name.toLowerCase().includes(listingSearch.toLowerCase()) || 
    (p.nameAr && p.nameAr.includes(listingSearch))
  );

  const filteredServices = config.services.filter(s => 
    s.title.toLowerCase().includes(listingSearch.toLowerCase()) || 
    (s.titleAr && s.titleAr.includes(listingSearch))
  );

  const filteredVehicles = config.vehicles.filter(v => 
    v.name.toLowerCase().includes(listingSearch.toLowerCase()) || 
    (v.nameAr && v.nameAr.includes(listingSearch))
  );

  return (
    <div className="min-h-screen bg-slate-100/80 pb-24 pt-8 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top Header Control Strip */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-sky-600 mb-1">
              <Settings className="w-4 h-4" />
              <span>Full-Stack Workshop & Website Builder</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              ApexTorque Modular Control Suite
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Full Shopify-style live site customizer, visual listings catalog, customer CRM, and orders pipeline.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => {
                if (window.confirm('Reset all site customizations and catalog to factory default?')) {
                  resetToDefaults();
                }
              }}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-md shadow-sky-600/20"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Live Site</span>
              </button>
            )}

            <button
              onClick={handleAdminLogout}
              className="px-3.5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors border border-red-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Primary Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/80 rounded-2xl mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('listings')}
            className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'listings' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>1. Catalog & Listings</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 relative ${
              activeTab === 'orders' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>2. Customer Orders ({orders.length})</span>
            {orders.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('crm')}
            className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'crm' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>3. Customer CRM & Bookings</span>
          </button>

          <button
            onClick={() => setActiveTab('builder')}
            className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'builder' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>4. Website Builder (Shopify-Style)</span>
          </button>

          <button
            onClick={() => setActiveTab('theme')}
            className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'theme' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>5. Theme Colors & Fonts</span>
          </button>

          <button
            onClick={() => setActiveTab('business')}
            className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'business' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>6. Business & Contacts</span>
          </button>
        </div>

        {/* TAB 1: LISTINGS (Products, Services, Vehicles) */}
        {activeTab === 'listings' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setListingCategory('products')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                    listingCategory === 'products' ? 'bg-sky-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Parts & Upgrades ({config.products.length})</span>
                </button>

                <button
                  onClick={() => setListingCategory('services')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                    listingCategory === 'services' ? 'bg-sky-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Garage Services ({config.services.length})</span>
                </button>

                <button
                  onClick={() => setListingCategory('vehicles')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                    listingCategory === 'vehicles' ? 'bg-sky-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>Showroom Cars ({config.vehicles.length})</span>
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={listingSearch}
                    onChange={(e) => setListingSearch(e.target.value)}
                    placeholder="Search catalog items..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:border-sky-500"
                  />
                </div>

                <button
                  onClick={() => handleOpenAdd(listingCategory === 'products' ? 'product' : listingCategory === 'services' ? 'service' : 'vehicle')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New</span>
                </button>
              </div>
            </div>

            {/* Product Cards Grid */}
            {listingCategory === 'products' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((p) => (
                  <div key={p.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between group">
                    <div>
                      <div className="h-44 relative bg-slate-100 overflow-hidden">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase">
                          {p.category}
                        </span>
                        <span className="absolute bottom-3 right-3 bg-emerald-600 text-white px-2 py-0.5 rounded-md text-[10px] font-black">
                          {p.price} KWD • Cash on Delivery
                        </span>
                      </div>
                      <div className="p-5">
                        <div className="text-[10px] font-mono font-bold text-sky-600 mb-0.5">{p.partNumber}</div>
                        <h3 className="font-bold text-sm text-slate-900 line-clamp-1 mb-1">{p.name}</h3>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">{p.description}</p>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                          <span>Stock: {p.stock} Units</span>
                          <span>⭐ {p.rating} / 5</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 pt-0 border-t border-slate-100 flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleOpenEdit('product', p)}
                        className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-sky-600" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDuplicateItem('product', p)}
                        title="Duplicate Product"
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete product "${p.name}"?`)) {
                            deleteProduct(p.id);
                          }
                        }}
                        className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Service Cards Grid */}
            {listingCategory === 'services' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((s) => (
                  <div key={s.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between group">
                    <div>
                      <div className="h-44 relative bg-slate-100 overflow-hidden">
                        <img src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <span className="absolute top-3 left-3 bg-sky-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase">
                          ⏱️ {s.duration}
                        </span>
                        <span className="absolute bottom-3 right-3 bg-sky-600 text-white px-2 py-0.5 rounded-md text-[10px] font-black">
                          {s.price} KWD • Cash on Arrival
                        </span>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-sm text-slate-900 line-clamp-1 mb-1">{s.title}</h3>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">{s.description}</p>
                      </div>
                    </div>
                    <div className="p-4 pt-0 border-t border-slate-100 flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleOpenEdit('service', s)}
                        className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-sky-600" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDuplicateItem('service', s)}
                        title="Duplicate Service"
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete service "${s.title}"?`)) {
                            deleteService(s.id);
                          }
                        }}
                        className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Vehicle Cards Grid */}
            {listingCategory === 'vehicles' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map((v) => (
                  <div key={v.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between group">
                    <div>
                      <div className="h-44 relative bg-slate-100 overflow-hidden">
                        <img src={v.image} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <span className="absolute top-3 left-3 bg-amber-500 text-slate-900 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase">
                          {v.badge}
                        </span>
                        <span className="absolute bottom-3 right-3 bg-slate-900 text-white px-2 py-0.5 rounded-md text-[10px] font-black">
                          {v.price.toLocaleString()} KWD
                        </span>
                      </div>
                      <div className="p-5">
                        <div className="text-[11px] font-bold text-sky-600 mb-0.5">{v.year} • {v.mileage} • {v.power}</div>
                        <h3 className="font-bold text-sm text-slate-900 line-clamp-1 mb-1">{v.name}</h3>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">{v.description}</p>
                      </div>
                    </div>
                    <div className="p-4 pt-0 border-t border-slate-100 flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleOpenEdit('vehicle', v)}
                        className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-sky-600" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDuplicateItem('vehicle', v)}
                        title="Duplicate Car"
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete vehicle "${v.name}"?`)) {
                            deleteVehicle(v.id);
                          }
                        }}
                        className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CUSTOMER ORDERS & PHONE DIRECTORY */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-sky-600" />
                    <span>Customer Placed Orders & Phone Contacts</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Live feed of orders placed by customers across Kuwait. Contact clients directly via WhatsApp or phone.
                  </p>
                </div>
                <div className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3.5 py-1.5 rounded-xl">
                  Total Orders: {orders.length}
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
                  <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <div className="text-sm font-bold text-slate-700">No Orders Placed Yet</div>
                  <p className="text-xs text-slate-400 mt-1">Orders placed from the shopping cart drawer will show up here in real time.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div key={ord.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-all">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono font-bold text-sky-700 text-sm">{ord.id}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                              ord.status === 'Dispatched' ? 'bg-sky-100 text-sky-800' :
                              ord.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {ord.status}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">📅 {ord.date}</span>
                          </div>
                          
                          {/* Customer Contact Details */}
                          <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-800">
                            <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                              <Users className="w-3.5 h-3.5 text-slate-500" />
                              <span>{ord.customerName || 'Store Client'}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sky-700 font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                              <Phone className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{ord.customerPhone || '+965 9900 1234'}</span>
                            </div>
                            {ord.customerEmail && (
                              <div className="text-slate-500 text-[11px]">
                                ✉️ {ord.customerEmail}
                              </div>
                            )}
                            {ord.shippingAddress && (
                              <div className="text-slate-600 text-[11px] flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-red-500" />
                                <span>{ord.shippingAddress}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Status Updater & Actions */}
                        <div className="flex items-center gap-2 self-start md:self-center">
                          <select
                            value={ord.status}
                            onChange={(e) => onUpdateOrder && onUpdateOrder(ord.id, { status: e.target.value as any })}
                            className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-sky-500"
                          >
                            <option value="Processing">Status: Processing</option>
                            <option value="Dispatched">Status: Dispatched</option>
                            <option value="Ready for Workshop Pickup">Status: Workshop Pickup</option>
                            <option value="Delivered">Status: Delivered</option>
                            <option value="Cancelled">Status: Cancelled</option>
                          </select>

                          {ord.customerPhone && (
                            <a
                              href={`https://wa.me/${ord.customerPhone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-200 transition-colors"
                              title="Chat with Customer on WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          )}

                          {onDeleteOrder && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete order ${ord.id}?`)) {
                                  onDeleteOrder(ord.id);
                                }
                              }}
                              className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
                              title="Delete Order"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Order Items Breakdown */}
                      <div className="pt-3">
                        <div className="text-[11px] font-bold uppercase text-slate-400 mb-2">Order Line Items:</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-xs flex items-center justify-between">
                              <span className="font-semibold text-slate-800 truncate mr-2">{item.productName}</span>
                              <span className="font-mono text-sky-600 font-bold shrink-0">x{item.quantity} ({item.price * item.quantity} KWD)</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs font-bold text-slate-900 border-t border-slate-200 pt-2">
                          <span>Payment Method: <span className="font-mono text-slate-600">{ord.paymentMethod}</span></span>
                          <span className="text-sm font-black text-sky-700">Total: {ord.totalAmount} KWD</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOMER CRM, BOOKINGS & TEST DRIVES */}
        {activeTab === 'crm' && (
          <div className="space-y-8">
            
            {/* Garage Bay Bookings */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-sky-600" />
                    <span>Workshop Bay Service Appointments ({bookings.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Live service bookings made by garage customers.</p>
                </div>
              </div>

              {bookings.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl text-xs text-slate-400 font-semibold">
                  No workshop bay appointments scheduled yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.map((b) => (
                    <div key={b.id} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{b.serviceTitle}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">{b.status}</span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-3">
                          <span>🚗 {b.vehicleInfo}</span>
                          <span>📅 {b.date} ({b.timeSlot})</span>
                          <span className="font-mono text-emerald-700 font-bold">📞 {b.customerPhone || '+965 9900 1234'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={b.status}
                          onChange={(e) => onUpdateBooking && onUpdateBooking(b.id, { status: e.target.value as any })}
                          className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Car Received">Car Received</option>
                          <option value="In Service Bay">In Service Bay</option>
                          <option value="Ready for Pickup">Ready for Pickup</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* VIP Test Drive Inquiries */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Car className="w-5 h-5 text-amber-500" />
                    <span>VIP Showroom Test Drive Inquiries ({testDrives.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Customer reservations for showroom vehicles.</p>
                </div>
              </div>

              {testDrives.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl text-xs text-slate-400 font-semibold">
                  No showroom test drive requests submitted yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {testDrives.map((td) => (
                    <div key={td.id} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{td.vehicleName}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">{td.status}</span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-3">
                          <span>📍 {td.location}</span>
                          <span>📅 {td.date}</span>
                          <span className="font-mono text-emerald-700 font-bold">📞 {td.customerPhone || td.advisorPhone}</span>
                        </div>
                      </div>

                      <select
                        value={td.status}
                        onChange={(e) => onUpdateTestDrive && onUpdateTestDrive(td.id, { status: e.target.value as any })}
                        className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800"
                      >
                        <option value="Pending Confirmation">Pending Confirmation</option>
                        <option value="Confirmed VIP Slot">Confirmed VIP Slot</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Registered Customer Accounts Directory */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-1">
                <Users className="w-5 h-5 text-sky-600" />
                <span>Registered Customer User Accounts</span>
              </h3>
              <p className="text-xs text-slate-500 mb-5">Verified user profiles stored in the workshop database.</p>

              {registeredUsers.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">No registered profiles in local session.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {registeredUsers.map((u, i) => (
                    <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm text-slate-900">{u.name}</div>
                        <div className="text-xs text-slate-500">{u.email}</div>
                        <div className="text-xs font-mono font-bold text-sky-700 mt-1">📞 {u.phone}</div>
                        <div className="text-[11px] text-slate-400 mt-1">Vehicles in Garage: {u.savedVehicles?.length || 0}</div>
                      </div>
                      <a
                        href={`https://wa.me/${u.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: SHOPIFY-STYLE WEBSITE BUILDER & SECTION EDITOR */}
        {activeTab === 'builder' && (
          <div className="max-w-4xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-sky-600" />
                <span>Shopify-Style Visual Website Builder</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Directly customize headlines, announcements, logos, hero banners, and section visibility across all pages.
              </p>
            </div>

            <form onSubmit={handleSaveWebsiteBuilder} className="space-y-6">
              
              {/* Site Logo & Brand Banner */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="text-sm font-bold uppercase text-slate-900">1. Brand Logo & Header Icon</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Logo Image URL
                    </label>
                    <input
                      type="url"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Or Upload Logo Image File
                    </label>
                    <label className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white border border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors">
                      <Upload className="w-4 h-4 text-sky-600" />
                      <span>Choose Local File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, setLogoUrl)}
                      />
                    </label>
                  </div>
                </div>

                {logoUrl && (
                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-xs text-slate-500">Logo Preview:</span>
                    <img src={logoUrl} alt="Logo" className="h-10 object-contain rounded bg-white p-1 border" />
                  </div>
                )}
              </div>

              {/* Announcement Bar Customizer */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase text-slate-900">2. Top Announcement Bar</h3>
                  <button
                    type="button"
                    onClick={() => setShowAnnouncement(!showAnnouncement)}
                    className="flex items-center gap-1.5 text-xs font-bold text-sky-600"
                  >
                    {showAnnouncement ? <ToggleRight className="w-5 h-5 text-emerald-600" /> : <ToggleLeft className="w-5 h-5 text-slate-400" />}
                    <span>{showAnnouncement ? 'Visible' : 'Hidden'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Text (English)</label>
                    <input
                      type="text"
                      value={announcementText}
                      onChange={(e) => setAnnouncementText(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Text (Arabic)</label>
                    <input
                      type="text"
                      value={announcementTextAr}
                      onChange={(e) => setAnnouncementTextAr(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold"
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>

              {/* Hero Section Headlines */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="text-sm font-bold uppercase text-slate-900">3. Hero Banner Headlines & Subtitles</h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Hero Main Title (English)</label>
                    <input
                      type="text"
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Hero Main Title (Arabic)</label>
                    <input
                      type="text"
                      value={heroTitleAr}
                      onChange={(e) => setHeroTitleAr(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold"
                      dir="rtl"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Hero Subtitle (English)</label>
                      <textarea
                        rows={2}
                        value={heroSubtitle}
                        onChange={(e) => setHeroSubtitle(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Hero Subtitle (Arabic)</label>
                      <textarea
                        rows={2}
                        value={heroSubtitleAr}
                        onChange={(e) => setHeroSubtitleAr(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-medium"
                        dir="rtl"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Headlines & Titles */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="text-sm font-bold uppercase text-slate-900">4. Section Header Titles</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Services Bay Title</label>
                    <input
                      type="text"
                      value={servicesTitle}
                      onChange={(e) => setServicesTitle(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Parts Catalog Title</label>
                    <input
                      type="text"
                      value={partsTitle}
                      onChange={(e) => setPartsTitle(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Showroom Title</label>
                    <input
                      type="text"
                      value={showroomTitle}
                      onChange={(e) => setShowroomTitle(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Interactive Widget Toggles */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="text-sm font-bold uppercase text-slate-900 mb-3">5. Live Widgets & Feature Toggles</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">OBD2 Diagnostic Scanner</div>
                      <div className="text-[10px] text-slate-400">Interactive DTC Fault Decoder</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowObdScanner(!showObdScanner)}
                    >
                      {showObdScanner ? <ToggleRight className="w-6 h-6 text-emerald-600" /> : <ToggleLeft className="w-6 h-6 text-slate-400" />}
                    </button>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">Mechanic AI Chat Assistant</div>
                      <div className="text-[10px] text-slate-400">Live chat widget in corner</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowChatbot(!showChatbot)}
                    >
                      {showChatbot ? <ToggleRight className="w-6 h-6 text-emerald-600" /> : <ToggleLeft className="w-6 h-6 text-slate-400" />}
                    </button>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">Live Sales Proof Toasts</div>
                      <div className="text-[10px] text-slate-400">Popup buying activity</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowSalesToast(!showSalesToast)}
                    >
                      {showSalesToast ? <ToggleRight className="w-6 h-6 text-emerald-600" /> : <ToggleLeft className="w-6 h-6 text-slate-400" />}
                    </button>
                  </div>
                </div>
              </div>

              {builderSavedToast && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Website text copy and section configurations updated successfully!</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-600/25 active:scale-98"
              >
                <Save className="w-4 h-4" />
                <span>Save Website Builder Changes</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: THEME COLORS & FONT BUILDER */}
        {activeTab === 'theme' && (
          <div className="max-w-4xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Palette className="w-5 h-5 text-sky-600" />
                <span>Granular Color Palette & Typography Engine</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Customize individual component colors, background schemes, and typography styles.
              </p>
            </div>

            <form onSubmit={handleSaveThemeSettings} className="space-y-8">
              
              {/* Theme Color Presets & Granular Color Pickers */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase text-slate-700">Preset Brand Accents</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {THEME_PRESETS.map((p) => (
                    <button
                      key={p.hex}
                      type="button"
                      onClick={() => {
                        setThemeColor(p.hex);
                        setAccentColor(p.hex);
                      }}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                        themeColor === p.hex ? 'border-sky-600 bg-sky-50 shadow-sm ring-2 ring-sky-600/20' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full shrink-0 shadow-inner" style={{ backgroundColor: p.hex }} />
                      <div className="truncate text-xs font-bold text-slate-900">{p.name}</div>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Primary Theme / Accent
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={themeColor}
                        onChange={(e) => setThemeColor(e.target.value)}
                        className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200"
                      />
                      <input
                        type="text"
                        value={themeColor}
                        onChange={(e) => setThemeColor(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Navbar / Header Background
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={headerBg}
                        onChange={(e) => setHeaderBg(e.target.value)}
                        className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200"
                      />
                      <input
                        type="text"
                        value={headerBg}
                        onChange={(e) => setHeaderBg(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Footer Background
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={footerBg}
                        onChange={(e) => setFooterBg(e.target.value)}
                        className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200"
                      />
                      <input
                        type="text"
                        value={footerBg}
                        onChange={(e) => setFooterBg(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Typography & Custom Font Builder */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-sky-600" />
                  <span>Typography & Custom Font Family</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {FONT_OPTIONS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFontStyle(f.id)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        fontStyle === f.id ? 'border-sky-600 bg-sky-50/60 ring-2 ring-sky-600/20' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900">{f.name}</span>
                        {fontStyle === f.id && <Check className="w-4 h-4 text-sky-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500 mb-2">{f.desc}</p>
                      <div className="text-xs font-bold text-slate-800 bg-white p-2 rounded-lg border border-slate-100 truncate">
                        {f.sample}
                      </div>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Or Enter Custom Font-Family (e.g. 'Orbitron', sans-serif)
                  </label>
                  <input
                    type="text"
                    value={customFontFamily}
                    onChange={(e) => setCustomFontFamily(e.target.value)}
                    placeholder="e.g. 'Cairo', sans-serif"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono"
                  />
                </div>
              </div>

              {themeSavedToast && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Theme styling and typography applied successfully!</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-600/25 active:scale-98"
              >
                <Save className="w-4 h-4" />
                <span>Save Theme & Color Settings</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 6: BUSINESS CONTACTS */}
        {activeTab === 'business' && (
          <div className="max-w-3xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-black text-slate-900">Garage & Contact Information</h2>
              <p className="text-xs text-slate-500 mt-1">
                Reflects instantly across the top Navbar, footer contact cards, and booking receipts.
              </p>
            </div>

            <form onSubmit={handleSaveBusiness} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-sky-600" />
                  <span>Workshop Official Phone (Direct Line)</span>
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+965 2200 2739"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1 flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp Business Helpline</span>
                </label>
                <input
                  type="text"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+965 9900 1234"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  <span>Physical Garage & Showroom Location</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Shuwaikh Industrial Area 1, Block 2, Street 18, Kuwait City"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-semibold focus:outline-none focus:border-sky-500"
                />
              </div>

              {businessSavedToast && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Business contact info updated and saved!</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-600/25 active:scale-98"
              >
                <Save className="w-4 h-4" />
                <span>Save Business Information</span>
              </button>
            </form>
          </div>
        )}

      </div>

      {/* Visual Add / Edit Listing Modal with File Upload Support */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  {editingItemId ? 'Edit Listing' : 'Create New Listing'}
                </span>
                <h3 className="text-lg font-bold capitalize">
                  {editingItemType === 'product' ? 'Auto Part / Hardware' : editingItemType === 'service' ? 'Garage Service Bay' : 'Showroom Car'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveListing} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Title (English)
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Stage 2 Custom Dyno ECU Remapping"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Title (Arabic Translation)
                </label>
                <input
                  type="text"
                  value={formTitleAr}
                  onChange={(e) => setFormTitleAr(e.target.value)}
                  placeholder="e.g. برمجة ستيج 2 داينو مخصصة"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold"
                  dir="rtl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Price in Kuwaiti Dinar (KWD)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.5"
                    value={formPrice}
                    onChange={(e) => setFormPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold"
                  />
                </div>

                {editingItemType === 'product' && (
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold"
                    >
                      <option value="Performance Upgrades">Performance Upgrades</option>
                      <option value="Auto Parts & Hardware">Auto Parts & Hardware</option>
                      <option value="Diagnosing & Repairing">Diagnosing & Repairing</option>
                    </select>
                  </div>
                )}

                {editingItemType === 'service' && (
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Service Duration
                    </label>
                    <input
                      type="text"
                      value={formDuration}
                      onChange={(e) => setFormDuration(e.target.value)}
                      placeholder="e.g. 2 - 3 Hours"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold"
                    />
                  </div>
                )}

                {editingItemType === 'vehicle' && (
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Model Year & Mileage
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={formYear}
                        onChange={(e) => setFormYear(parseInt(e.target.value) || 2024)}
                        placeholder="Year (2024)"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold"
                      />
                      <input
                        type="text"
                        value={formMileage}
                        onChange={(e) => setFormMileage(e.target.value)}
                        placeholder="18,000 KM"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Image Input with Upload button */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-slate-700">
                  Item Image (URL or Local Upload)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="sm:col-span-2 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono"
                  />
                  <label className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer text-xs font-bold text-slate-700 border border-slate-200 transition-colors">
                    <Upload className="w-3.5 h-3.5 text-sky-600" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, setFormImage)}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Description & Specifications (English)
                </label>
                <textarea
                  rows={2}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detailed engineering breakdown, GCC fitment specs, or procedure."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Description (Arabic Translation)
                </label>
                <textarea
                  rows={2}
                  value={formDescriptionAr}
                  onChange={(e) => setFormDescriptionAr(e.target.value)}
                  placeholder="الوصف التفصيلي باللغة العربية"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold"
                  dir="rtl"
                />
              </div>

              {/* Live Preview Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-[10px] font-bold uppercase text-slate-400 mb-2">Live Preview Card</div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-slate-200 overflow-hidden shrink-0">
                    <img src={formImage || 'https://via.placeholder.com/150'} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-900 truncate">{formTitle || 'Item Title Preview'}</div>
                    <div className="text-xs font-black text-sky-600">{formPrice} KWD • {editingItemType === 'product' ? 'Cash on Delivery' : 'Cash on Arrival'}</div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
                >
                  Save Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
