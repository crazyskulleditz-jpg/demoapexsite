import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useSiteContext } from '../context/SiteContext';
import { supabase } from '../lib/supabase';
import { 
import { supabase } from '../lib/supabase';
  Product, 
  GarageService, 
  Vehicle, 
  Language, 
  OrderRecord, 
  BookingRecord, 
  TestDriveRecord, 
  User, 
  StoreCategory 
} from '../types';
import { FontStyleOption } from '../types/admin';
import { supabase } from '../lib/supabase';
import { 
import { supabase } from '../lib/supabase';
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
  Sliders, 
  Copy, 
  ToggleLeft, 
  ToggleRight, 
  Search, 
  Mail, 
  UserX, 
  Image as ImageIcon, 
  Video, 
  Globe, 
  Sparkles,
  Star,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  ListPlus,
  Maximize2,
  SlidersHorizontal,
  Square
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
  onDeleteBooking?: (id: string) => void;
  testDrives?: TestDriveRecord[];
  onUpdateTestDrive?: (id: string, updated: Partial<TestDriveRecord>) => void;
  onDeleteTestDrive?: (id: string) => void;
}

import { saveMediaFile } from '../utils/mediaStore';
import { supabase } from '../lib/supabase';

const SESSION_STORAGE_KEY = 'apex_admin_auth';

export const STORE_CATEGORIES: { id: StoreCategory; labelEn: string; labelAr: string; type: 'product' | 'service' | 'vehicle' }[] = [
  { id: 'Performance Upgrades', labelEn: 'Performance Upgrades', labelAr: 'البرمجة وتعديل الأداء', type: 'product' },
  { id: 'Auto Parts & Hardware', labelEn: 'Auto Parts & Tools', labelAr: 'قطع الغيار والأجهزة', type: 'product' },
  { id: 'Diagnosing & Repairing', labelEn: 'Diagnostics & Repairing', labelAr: 'الصيانة وتصليح الأعطال', type: 'service' },
  { id: 'Vehicles for Sale', labelEn: 'Vehicle Sales (Showroom)', labelAr: 'معرض السيارات للبيع', type: 'vehicle' }
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  language,
  isAdmin = false,
  onNavigateHome,
  orders = [],
  onUpdateOrder,
  onDeleteOrder,
  bookings = [],
  onUpdateBooking,
  onDeleteBooking,
  testDrives = [],
  onUpdateTestDrive,
  onDeleteTestDrive
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

  // Tabs: listings | orders | bookings | testDrives | crm | builder | theme | business
  const [activeTab, setActiveTab] = useState<'listings' | 'orders' | 'bookings' | 'testDrives' | 'crm' | 'builder' | 'theme' | 'business'>('listings');
  const [listingCategory, setListingCategory] = useState<'products' | 'services' | 'vehicles'>('products');
  const [listingSearch, setListingSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [bookingSearch, setBookingSearch] = useState('');
  const [testDriveSearch, setTestDriveSearch] = useState('');

  // Branding, Name, Motto, Favicon & Background state
  const [siteName, setSiteName] = useState(config.siteName || 'ApexTorque Performance');
  const [motto, setMotto] = useState(config.motto || 'Kuwait Premier Dyno & Tuning Hub');
  const [logoUrl, setLogoUrl] = useState(config.logoUrl || '');
  const [faviconUrl, setFaviconUrl] = useState(config.faviconUrl || '');

  // Dynamic Background System
  const [bgType, setBgType] = useState<'none' | 'image' | 'video'>(config.bgType || 'none');
  const [bgMediaUrl, setBgMediaUrl] = useState(config.bgMediaUrl || '');
  const [bgOverlayOpacity, setBgOverlayOpacity] = useState<number>(config.bgOverlayOpacity ?? 0.15);

  // Business info form state
  const [phone, setPhone] = useState(config.phone || '+965 2200 2739');
  const [whatsapp, setWhatsapp] = useState(config.whatsapp || '+965 9900 1234');
  const [location, setLocation] = useState(config.location || 'Shuwaikh Industrial Area 1, Block 2, Street 18, Kuwait City');
  const [businessSavedToast, setBusinessSavedToast] = useState(false);

  // Color Pickers, Borders, Neon & Typography state
  const [themeColor, setThemeColor] = useState(config.themeColor || '#0284c7');
  const [secondaryAccent, setSecondaryAccent] = useState(config.secondaryAccent || '#f59e0b');
  const [headerBg, setHeaderBg] = useState(config.headerBg || '#0f172a');
  const [footerBg, setFooterBg] = useState(config.footerBg || '#0b0f19');
  const [cardBg, setCardBg] = useState(config.cardBg || '#1e293b');
  const [pageBg, setPageBg] = useState(config.pageBg || '#0f172a');
  const [fontStyle, setFontStyle] = useState<FontStyleOption>(config.fontStyle || 'sans');
  const [customFontFamily, setCustomFontFamily] = useState(config.customFontFamily || '');
  const [fontSizeScale, setFontSizeScale] = useState(config.fontSizeScale || '100%');
  const [cardBorderRadius, setCardBorderRadius] = useState(config.cardBorderRadius || '1.5rem');
  const [cardBorderColor, setCardBorderColor] = useState(config.cardBorderColor || '#334155');
  const [cardBorderWidth, setCardBorderWidth] = useState(config.cardBorderWidth || '1px');
  const [enableCarbonPattern, setEnableCarbonPattern] = useState(config.enableCarbonPattern ?? true);
  const [enableNeonGlow, setEnableNeonGlow] = useState(config.enableNeonGlow ?? true);
  const [themeSavedToast, setThemeSavedToast] = useState(false);

  // Website Text Content Editor state
  const [announcementText, setAnnouncementText] = useState(config.announcementText || '⚡ Kuwait Premier Dyno Tuning & Performance Garage — Shuwaikh Branch');
  const [announcementTextAr, setAnnouncementTextAr] = useState(config.announcementTextAr || '⚡ كراج الأداء والبرمجة الأول في الكويت — فرع الشويخ');
  const [heroTitle, setHeroTitle] = useState(config.heroTitle || 'Kuwait Premier Automotive Dyno & Tuning Hub');
  const [heroTitleAr, setHeroTitleAr] = useState(config.heroTitleAr || 'مركز الأداء العالي والبرمجة وفحص السيارات بالكويت');
  const [heroSubtitle, setHeroSubtitle] = useState(config.heroSubtitle || 'Direct dealer diagnostic telemetry, bespoke Stage 1-3 ECU calibration, and certified parts catalogue.');
  const [heroSubtitleAr, setHeroSubtitleAr] = useState(config.heroSubtitleAr || 'فحص شامل بأحدث أجهزة الوكالة، برمجة مخصصة على الداينو، وقطع غيار أصلية مكفولة.');
  const [servicesTitle, setServicesTitle] = useState(config.servicesTitle || 'Engineering Diagnostic & Repair Services');
  const [partsTitle, setPartsTitle] = useState(config.partsTitle || 'Performance Parts & Track Hardware');
  const [showroomTitle, setShowroomTitle] = useState(config.showroomTitle || 'Verified GCC Spec Pre-Owned Showroom');
  const [showAnnouncement, setShowAnnouncement] = useState(config.showAnnouncement ?? true);
  const [showObdScanner, setShowObdScanner] = useState(config.showObdScanner ?? true);
  const [showChatbot, setShowChatbot] = useState(config.showChatbot ?? true);
  const [showSalesToast, setShowSalesToast] = useState(config.showSalesToast ?? true);
  const [builderSavedToast, setBuilderSavedToast] = useState(false);

  useEffect(() => {
    setSiteName(config.siteName || 'ApexTorque Performance');
    setMotto(config.motto || 'Kuwait Premier Dyno & Tuning Hub');
    setLogoUrl(config.logoUrl || '');
    setFaviconUrl(config.faviconUrl || '');
    setBgType(config.bgType || 'none');
    setBgMediaUrl(config.bgMediaUrl || '');
    setBgOverlayOpacity(config.bgOverlayOpacity ?? 0.15);
    setThemeColor(config.themeColor || '#0284c7');
    setSecondaryAccent(config.secondaryAccent || '#f59e0b');
    setHeaderBg(config.headerBg || '#0f172a');
    setFooterBg(config.footerBg || '#0b0f19');
    setCardBg(config.cardBg || '#1e293b');
    setPageBg(config.pageBg || '#0f172a');
    setFontStyle(config.fontStyle || 'sans');
    setCustomFontFamily(config.customFontFamily || '');
    setFontSizeScale(config.fontSizeScale || '100%');
    setCardBorderRadius(config.cardBorderRadius || '1.5rem');
    setCardBorderColor(config.cardBorderColor || '#334155');
    setCardBorderWidth(config.cardBorderWidth || '1px');
    setEnableCarbonPattern(config.enableCarbonPattern ?? true);
    setEnableNeonGlow(config.enableNeonGlow ?? true);
    setPhone(config.phone || '+965 2200 2739');
    setWhatsapp(config.whatsapp || '+965 9900 1234');
    setLocation(config.location || 'Shuwaikh Industrial Area 1, Block 2, Street 18, Kuwait City');
  }, [config]);

  // Listings Modal State & 5-Tab Structured Editor State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'overview' | 'specs' | 'fitment' | 'box' | 'reviews'>('overview');
  const [editingItemType, setEditingItemType] = useState<'product' | 'service' | 'vehicle'>('product');
  const [originalItemType, setOriginalItemType] = useState<'product' | 'service' | 'vehicle'>('product');
  const [editingItemId, setEditingItemId] = useState<string | number | null>(null);

  // 1. Overview & Description Tab Form Inputs
  const [formTitle, setFormTitle] = useState('');
  const [formTitleAr, setFormTitleAr] = useState('');
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formPriceDisplay, setFormPriceDisplay] = useState('');
  const [formCategory, setFormCategory] = useState<StoreCategory>('Auto Parts & Hardware');
  const [formDescription, setFormDescription] = useState('');
  const [formDescriptionAr, setFormDescriptionAr] = useState('');
  const [formLongDescription, setFormLongDescription] = useState('');
  const [formBadge, setFormBadge] = useState('VERIFIED');
  const [formStock, setFormStock] = useState<number>(10);
  const [formPartNumber, setFormPartNumber] = useState('APX-1001');
  const [formMileage, setFormMileage] = useState('12,000 KM');
  const [formYear, setFormYear] = useState<number>(2024);
  const [formEngine, setFormEngine] = useState('4.0L Twin-Turbo V8');
  const [formPower, setFormPower] = useState('650 HP');
  const [formDuration, setFormDuration] = useState('1.5 Hours');

  // Multi-Image Gallery State
  const [formImages, setFormImages] = useState<string[]>([]);
  const [newImageUrlInput, setNewImageUrlInput] = useState('');

  // 2. Detailed Specifications Tab Inputs
  const [formSpecsList, setFormSpecsList] = useState<string[]>([]);
  const [newSpecInput, setNewSpecInput] = useState('');
  const [formSpecsTable, setFormSpecsTable] = useState<{ key: string; value: string }[]>([]);
  const [newTableKey, setNewTableKey] = useState('');
  const [newTableValue, setNewTableValue] = useState('');

  // 3. Vehicle Compatibility Tab Inputs
  const [formCompatibility, setFormCompatibility] = useState<string[]>([]);
  const [newCompatInput, setNewCompatInput] = useState('');

  // 4. In the Box & Warranty Tab Inputs
  const [formWarranty, setFormWarranty] = useState('1 Year Garage Replacement');
  const [formInstallDifficulty, setFormInstallDifficulty] = useState('Medium (Basic Garage)');
  const [formInTheBox, setFormInTheBox] = useState<string[]>([]);
  const [newBoxItemInput, setNewBoxItemInput] = useState('');

  // 5. Reviews & Garage Logs Tab Inputs
  const [formReviews, setFormReviews] = useState<Array<{
    author: string;
    rating: number;
    comment: string;
    date: string;
    vehicle: string;
  }>>([]);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewVehicle, setNewReviewVehicle] = useState('');

  // Customer Accounts Directory from localStorage
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    try {
      const stored = localStorage.getItem('apextorque_users');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
      const single = localStorage.getItem('apextorque_user');
      return single ? [JSON.parse(single)] : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const syncUsers = () => {
      try {
        const stored = localStorage.getItem('apextorque_users');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) setRegisteredUsers(parsed);
        }
      } catch (err) {
        console.error('Error syncing registered users:', err);
      }
    };

    window.addEventListener('storage', syncUsers);
    window.addEventListener('apextorque_users_updated', syncUsers);
    return () => {
      window.removeEventListener('storage', syncUsers);
      window.removeEventListener('apextorque_users_updated', syncUsers);
    };
  }, []);

  const handleDeleteUser = (userId: string) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من حذف حساب العميل من الدليل؟' : 'Delete this user profile from garage directory?')) return;
    const updated = registeredUsers.filter(u => u.id !== userId);
    setRegisteredUsers(updated);
    try {
      localStorage.setItem('apextorque_users', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error(err);
    }
  };

  const THEME_PRESETS = [
    { name: 'Sky Blue + Amber', primary: '#0284c7', secondary: '#f59e0b', headerBg: '#0f172a', footerBg: '#0b0f19', cardBg: '#1e293b', pageBg: '#0f172a' },
    { name: 'Track Crimson + Gold', primary: '#dc2626', secondary: '#d97706', headerBg: '#18181b', footerBg: '#09090b', cardBg: '#27272a', pageBg: '#121215' },
    { name: 'Apex Emerald + Lime', primary: '#059669', secondary: '#84cc16', headerBg: '#064e3b', footerBg: '#022c22', cardBg: '#0f382c', pageBg: '#041f17' },
    { name: 'Electric Indigo + Cyan', primary: '#4f46e5', secondary: '#06b6d4', headerBg: '#1e1b4b', footerBg: '#0f172a', cardBg: '#2e2868', pageBg: '#131131' },
    { name: 'Dark Gunmetal + Neon Orange', primary: '#ea580c', secondary: '#f97316', headerBg: '#090d16', footerBg: '#05070a', cardBg: '#1e293b', pageBg: '#0a0f1d' }
  ];

  const FONT_OPTIONS: { id: FontStyleOption; name: string; desc: string; sample: string }[] = [
    { id: 'sans', name: 'Inter & Geist (Modern Sans)', desc: 'Clean, high-performance automotive UI', sample: 'Modern Performance' },
    { id: 'orbitron', name: 'Orbitron (Futuristic Motorsport HUD)', desc: 'Aggressive HUD & racing telemetry styling', sample: 'SPEED TELEMETRY 850HP' },
    { id: 'mono', name: 'JetBrains / Technical Mono', desc: 'ECU tuning and diagnostic look', sample: '0x7F DTC_DIAGNOSTICS' },
    { id: 'montserrat', name: 'Montserrat Geometric', desc: 'Bold, structured corporate auto brand', sample: 'PRECISION ENGINEERING' },
    { id: 'tajawal', name: 'Tajawal / Cairo (Arabic Optimized)', desc: 'Arabic-first high clarity font', sample: 'كراج الأداء والبرمجة' },
    { id: 'jakarta', name: 'Plus Jakarta Sans (Ultra Crisp)', desc: 'Super clean modern automotive design', sample: 'TURBOCHARGED V8 GCC' },
    { id: 'syne', name: 'Syne / Avant-Garde Luxury', desc: 'Boutique supercar showroom styling', sample: 'EXOTIC PERFORMANCE' }
  ];

  const FONT_SCALES = [
    { label: 'Compact (90%)', value: '90%' },
    { label: 'Balanced (95%)', value: '95%' },
    { label: 'Default (100%)', value: '100%' },
    { label: 'Comfortable (105%)', value: '105%' },
    { label: 'Large (110%)', value: '110%' },
    { label: 'Extra Large (115%)', value: '115%' }
  ];

  const BORDER_RADIUS_OPTIONS = [
    { label: 'Sharp (0.5rem)', value: '0.5rem' },
    { label: 'Smooth (1rem)', value: '1rem' },
    { label: 'Curved (1.5rem)', value: '1.5rem' },
    { label: 'Ultra Round (2rem)', value: '2rem' }
  ];

  const handleMultiFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        if (file.size > 25 * 1024 * 1024) {
          alert(`File ${file.name} exceeds 25MB.`);
          return;
        }
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          if (uploadEvent.target?.result) {
            setFormImages(prev => [...prev, uploadEvent.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleAddImageUrl = () => {
    if (newImageUrlInput.trim()) {
      setFormImages(prev => [...prev, newImageUrlInput.trim()]);
      setNewImageUrlInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSetPrimaryImage = (index: number) => {
    setFormImages(prev => {
      const selected = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      return [selected, ...rest];
    });
  };

    const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = usernameInput.trim().toLowerCase();
    const cleanPassword = passwordInput.trim();

    const isKnownAdmin =
      ((cleanUsername === 'admin' || cleanUsername === 'apex') && cleanPassword === 'ApexTorque#2026!') ||
      (cleanUsername === 'manager' && cleanPassword === 'admin123');

    if (!isKnownAdmin) {
      setAuthError(true);
      return;
    }

    // Create a REAL Supabase session. The write policy only allows
    // authenticated users, so without this every push is refused.
    const ADMIN_EMAIL = 'ramsinghsland@gmail.com';
    const { error } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: cleanPassword,
    });
    if (error) {
      console.warn('[admin] Supabase sign-in failed:', error.message);
    }

    setIsAdminAuthenticated(true);
    setAuthError(false);
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
    } catch (err) {
      console.warn('Session write error:', err);
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

  const handleOpenAdd = (type: 'product' | 'service' | 'vehicle') => {
    setEditingItemType(type);
    setOriginalItemType(type);
    setEditingItemId(null);
    setModalTab('overview');
    
    setFormTitle('');
    setFormTitleAr('');
    setFormPrice(type === 'product' ? 35 : type === 'service' ? 25 : 18500);
    setFormPriceDisplay('');
    const defaultImg = 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800';
    setFormImages([defaultImg]);
    setNewImageUrlInput('');
    setFormDescription('High performance GCC certified automotive component.');
    setFormDescriptionAr('قطعة أداء عالية الجودة ومطابقة لمواصفات الخليج.');
    setFormLongDescription('Engineered and tested in Kuwait climate conditions. Provides direct bolt-on installation, full telemetry diagnostics compatibility, and maximum thermal durability.');
    setFormCategory(type === 'product' ? 'Auto Parts & Hardware' : type === 'service' ? 'Diagnosing & Repairing' : 'Vehicles for Sale');
    setFormBadge(type === 'vehicle' ? 'VERIFIED PRE-OWNED' : 'OFFICIAL WORKSHOP');
    setFormStock(15);
    setFormPartNumber(`APX-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormMileage('15,000 KM');
    setFormYear(2024);
    setFormEngine('4.0L V8 Bi-Turbo');
    setFormPower('550 HP');
    setFormDuration('1.5 Hours');

    setFormSpecsList(['100% Genuine Certified GCC Fitment', 'Direct Bolt-On Fitment', 'Dyno Verified Performance']);
    setNewSpecInput('');
    setFormSpecsTable([
      { key: 'Material / Construction', value: 'Aerospace Grade 6061-T6 Billet Aluminum' },
      { key: 'Operating Temperature', value: '-20°C to 180°C' },
      { key: 'Origin', value: 'German / GCC Verified Engineering' }
    ]);
    setNewTableKey('');
    setNewTableValue('');

    setFormCompatibility(['Universal GCC Platform', 'Toyota Land Cruiser (2018-2024)', 'Nissan Patrol Y62 V8', 'Porsche 911 / Cayman GT4']);
    setNewCompatInput('');

    setFormWarranty('1 Year Full Garage Replacement');
    setFormInstallDifficulty('Medium (Basic Garage)');
    setFormInTheBox(['1x Primary Assembly Unit', '2x Stainless Steel Mounting Brackets', '1x High-Temp O-Ring Seal Kit', '1x Signed Apex Dyno Quality Certificate']);
    setNewBoxItemInput('');

    setFormReviews([
      { author: 'Hamad Al-Kandari', rating: 5, comment: 'Installed at Shuwaikh Bay #3. Exceptional response and zero issues in summer heat.', date: '2025-04-12', vehicle: 'Nissan Patrol Nismo' }
    ]);
    setNewReviewAuthor('');
    setNewReviewRating(5);
    setNewReviewComment('');
    setNewReviewVehicle('');

    setIsModalOpen(true);
  };

  const handleOpenEdit = (type: 'product' | 'service' | 'vehicle', item: any) => {
    setEditingItemType(type);
    setOriginalItemType(type);
    setEditingItemId(item.id);
    setModalTab('overview');

    setFormTitle(item.name || item.title || '');
    setFormTitleAr(item.nameAr || item.titleAr || '');
    setFormPrice(item.price || 0);
    setFormPriceDisplay(item.priceDisplay || '');

    const existingImages: string[] = item.images && item.images.length > 0 
      ? item.images 
      : item.gallery && item.gallery.length > 0 
      ? item.gallery 
      : item.image 
      ? [item.image] 
      : ['https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800'];
    setFormImages(existingImages);
    setNewImageUrlInput('');

    setFormDescription(item.description || '');
    setFormDescriptionAr(item.descriptionAr || '');
    setFormLongDescription(item.longDescription || item.description || '');
    setFormCategory(item.category || (type === 'product' ? 'Auto Parts & Hardware' : type === 'service' ? 'Diagnosing & Repairing' : 'Vehicles for Sale'));
    setFormBadge(item.badge || 'VERIFIED');
    setFormStock(item.stock || 10);
    setFormPartNumber(item.partNumber || `APX-${item.id}`);
    setFormMileage(item.mileage || '0 KM');
    setFormYear(item.year || 2024);
    setFormEngine(item.engine || 'High Output Platform');
    setFormPower(item.power || '450+ HP');
    setFormDuration(item.duration || '1 Hour');

    const initialSpecs = item.specs || item.features || ['Certified GCC Spec', 'Dealer Diagnostic Telemetry'];
    setFormSpecsList(Array.isArray(initialSpecs) ? initialSpecs : []);
    setNewSpecInput('');

    if (item.specsTable && typeof item.specsTable === 'object') {
      const tableEntries = Object.entries(item.specsTable).map(([key, value]) => ({
        key,
        value: String(value)
      }));
      setFormSpecsTable(tableEntries);
    } else {
      setFormSpecsTable([
        { key: 'Platform', value: item.engine || 'GCC Specification' },
        { key: 'Warranty Period', value: item.warranty || '1 Year Garage' }
      ]);
    }
    setNewTableKey('');
    setNewTableValue('');

    setFormCompatibility(item.compatibility || ['Universal GCC OBD2 Fitment', 'Kuwait Spec Performance Fleet']);
    setNewCompatInput('');

    setFormWarranty(item.warranty || '1 Year Garage Replacement');
    setFormInstallDifficulty(item.installDifficulty || 'Medium (Basic Garage)');
    setFormInTheBox(item.inTheBox || ['1x Component Hardware Assembly', '1x Installation Hardware Pack', '1x Warranty Document']);
    setNewBoxItemInput('');

    setFormReviews(item.reviews || [
      { author: 'Verified Client', rating: 5, comment: 'Flawless fitment and performance. Inspected at Apex Garage.', date: '2025-05-01', vehicle: 'Kuwait Fleet' }
    ]);
    setNewReviewAuthor('');
    setNewReviewRating(5);
    setNewReviewComment('');
    setNewReviewVehicle('');

    setIsModalOpen(true);
  };

  const handleCategorySelectionChange = (cat: StoreCategory) => {
    setFormCategory(cat);
    const catDef = STORE_CATEGORIES.find(c => c.id === cat);
    if (catDef) {
      setEditingItemType(catDef.type);
    }
  };

  const getSpecsTableRecord = (): Record<string, string> => {
    const rec: Record<string, string> = {};
    formSpecsTable.forEach(entry => {
      if (entry.key.trim() && entry.value.trim()) {
        rec[entry.key.trim()] = entry.value.trim();
      }
    });
    return rec;
  };

  const handleDuplicateItem = (type: 'product' | 'service' | 'vehicle', item: any) => {
    const images = item.images || item.gallery || [item.image];
    if (type === 'product') {
      addProduct({
        ...item,
        name: `${item.name} (Copy)`,
        nameAr: item.nameAr ? `${item.nameAr} (نسخة)` : undefined,
        images,
        gallery: images
      });
    } else if (type === 'service') {
      addService({
        ...item,
        id: `srv-${Date.now()}`,
        title: `${item.title} (Copy)`,
        images,
        gallery: images
      });
    } else if (type === 'vehicle') {
      addVehicle({
        ...item,
        name: `${item.name} (Copy)`,
        images,
        gallery: images
      });
    }
  };

  const handleSaveListing = (e: React.FormEvent) => {
    e.preventDefault();

    const imagesToSave = formImages.length > 0 
      ? formImages 
      : ['https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800'];
    const primaryImage = imagesToSave[0];
    const specsTableData = getSpecsTableRecord();

    if (editingItemId !== null && originalItemType !== editingItemType) {
      if (originalItemType === 'product') deleteProduct(Number(editingItemId));
      if (originalItemType === 'service') deleteService(String(editingItemId));
      if (originalItemType === 'vehicle') deleteVehicle(Number(editingItemId));
    }

    if (editingItemType === 'product') {
      const productPayload: Omit<Product, 'id'> = {
        name: formTitle,
        nameAr: formTitleAr || formTitle,
        category: formCategory,
        price: Number(formPrice),
        priceDisplay: formPriceDisplay || `${Number(formPrice)} KWD (Cash on Delivery)`,
        rating: 5,
        specs: formSpecsList.length > 0 ? formSpecsList : ['100% Genuine Certified GCC Fitment', 'Direct Bolt-On Fitment', formWarranty],
        specsTable: Object.keys(specsTableData).length > 0 ? specsTableData : undefined,
        compatibility: formCompatibility.length > 0 ? formCompatibility : undefined,
        inTheBox: formInTheBox.length > 0 ? formInTheBox : undefined,
        installDifficulty: formInstallDifficulty,
        reviews: formReviews.length > 0 ? formReviews : undefined,
        image: primaryImage,
        images: imagesToSave,
        gallery: imagesToSave,
        description: formDescription,
        descriptionAr: formDescriptionAr || formDescription,
        longDescription: formLongDescription || formDescription,
        stock: Number(formStock),
        partNumber: formPartNumber,
        warranty: formWarranty
      };

      if (editingItemId !== null && originalItemType === 'product') {
        updateProduct(Number(editingItemId), productPayload);
      } else {
        addProduct(productPayload);
      }
    } else if (editingItemType === 'service') {
      const servicePayload: GarageService = {
        id: (editingItemId && originalItemType === 'service') ? String(editingItemId) : `srv-${Date.now()}`,
        title: formTitle,
        titleAr: formTitleAr || formTitle,
        duration: formDuration,
        price: Number(formPrice),
        priceDisplay: formPriceDisplay || `${Number(formPrice)} KWD (Cash on Arrival)`,
        description: formDescription,
        descriptionAr: formDescriptionAr || formDescription,
        longDescription: formLongDescription || formDescription,
        icon: 'wrench',
        image: primaryImage,
        images: imagesToSave,
        gallery: imagesToSave,
        features: formSpecsList.length > 0 ? formSpecsList : ['Certified Kuwait Dyno Calibration', 'Master Tech Signed Report', 'Diagnostic Log Backup'],
        specsTable: Object.keys(specsTableData).length > 0 ? specsTableData : undefined,
        warranty: formWarranty,
        reviews: formReviews.length > 0 ? formReviews : undefined
      };

      if (editingItemId !== null && originalItemType === 'service') {
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
        image: primaryImage,
        images: imagesToSave,
        gallery: imagesToSave,
        badge: formBadge,
        location: 'Shuwaikh VIP Showroom (Cash on Arrival)',
        description: formDescription,
        warranty: formWarranty,
        specs: formSpecsList.length > 0 ? formSpecsList : ['Full Kuwait Dealer History', 'Zero Accident Record', 'Dyno Verified Output'],
        specsTable: Object.keys(specsTableData).length > 0 ? specsTableData : undefined,
        reviews: formReviews.length > 0 ? formReviews : undefined
      };

      if (editingItemId !== null && originalItemType === 'vehicle') {
        updateVehicle(Number(editingItemId), vehiclePayload);
      } else {
        addVehicle(vehiclePayload);
      }
    }

    setIsModalOpen(false);
  };

  const handleSaveWebsiteBuilder = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      siteName,
      motto,
      logoUrl,
      faviconUrl,
      bgType,
      bgMediaUrl,
      bgOverlayOpacity,
      announcementText,
      announcementTextAr,
      heroTitle,
      heroTitleAr,
      heroSubtitle,
      heroSubtitleAr,
      servicesTitle,
      partsTitle,
      showroomTitle,
      showAnnouncement,
      showObdScanner,
      showChatbot,
      showSalesToast
    });
    setBuilderSavedToast(true);
    setTimeout(() => setBuilderSavedToast(false), 2500);
  };

  const handleSaveThemeSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      themeColor,
      secondaryAccent,
      accentColor: themeColor,
      headerBg,
      footerBg,
      cardBg,
      pageBg,
      fontStyle,
      customFontFamily,
      fontSizeScale,
      cardBorderRadius,
      cardBorderColor,
      cardBorderWidth,
      enableCarbonPattern,
      enableNeonGlow
    });
    setThemeSavedToast(true);
    setTimeout(() => setThemeSavedToast(false), 2500);
  };

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

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-slate-900 text-white">
        <div className="max-w-md w-full bg-slate-800/95 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-black mb-1.5 tracking-tight text-white">{isAr ? 'لوحة تحكم إدارة الكراج' : 'Workshop Admin Portal'}</h2>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            {isAr ? 'منصة مخصصة لإدارة المخزون، الحجوزات المباشرة، وتخصيص الموقع بالكامل.' : 'Authorized management suite for garage owners, live inventory editors, and customer orders.'}
          </p>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                {isAr ? 'اسم المستخدم الإداري' : 'Admin Username'}
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
                {isAr ? 'كلمة المرور الرئيسية' : 'Master Password'}
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
                <span>{isAr ? 'بيانات الدخول غير صحيحة.' : 'Invalid credentials. (Hint: admin / ApexTorque#2026!)'}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-150 active:scale-95 shadow-lg flex items-center justify-center gap-2"
              style={{ backgroundColor: 'var(--primary-accent, #0284c7)' }}
            >
              <UserCheck className="w-4 h-4" />
              <span>{isAr ? 'تسجيل الدخول إلى لوحة الإدارة' : 'Sign In to Admin Hub'}</span>
            </button>

            {onNavigateHome && (
              <button
                type="button"
                onClick={onNavigateHome}
                className="text-xs text-slate-400 hover:text-white transition-colors duration-150 block mx-auto pt-2"
              >
                {isAr ? '← العودة إلى المتجر العام' : '← Return to Public Storefront'}
              </button>
            )}
          </form>
        </div>
      </div>
    );
  }

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

  const filteredUsers = registeredUsers.filter(u => {
    const q = userSearch.toLowerCase();
    const nameMatch = u.name?.toLowerCase().includes(q);
    const emailMatch = u.email?.toLowerCase().includes(q);
    const phoneMatch = u.phone?.replace(/[^0-9]/g, '').includes(q.replace(/[^0-9]/g, ''));
    return nameMatch || emailMatch || phoneMatch;
  });

  const filteredBookings = bookings.filter(b => {
    const q = bookingSearch.toLowerCase();
    return (
      (b.customerName && b.customerName.toLowerCase().includes(q)) ||
      (b.customerPhone && b.customerPhone.includes(q)) ||
      (b.serviceTitle && b.serviceTitle.toLowerCase().includes(q)) ||
      (b.vehicleInfo && b.vehicleInfo.toLowerCase().includes(q)) ||
      b.id.toLowerCase().includes(q)
    );
  });

  const filteredTestDrives = testDrives.filter(t => {
    const q = testDriveSearch.toLowerCase();
    return (
      (t.customerName && t.customerName.toLowerCase().includes(q)) ||
      (t.customerPhone && t.customerPhone.includes(q)) ||
      (t.vehicleName && t.vehicleName.toLowerCase().includes(q)) ||
      t.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen pb-24 pt-8 text-slate-100" style={{ backgroundColor: 'var(--page-bg, #0f172a)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top Header Control Strip */}
        <div className="rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-md mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ backgroundColor: 'var(--card-bg, #1e293b)' }}>
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider mb-1" style={{ color: 'var(--primary-accent, #0284c7)' }}>
              <Settings className="w-4 h-4" />
              <span>{isAr ? 'نظام إدارة الورشة والتخصيص المباشر' : 'Full-Stack Workshop & Website Builder'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {siteName} {isAr ? '— لوحة التحكم' : 'Control Suite'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {isAr ? 'محرر القوائم خماسي التبويب، ضبط أحجام الخطوط، مزامنة الحجوزات وطلبات تجربة القيادة.' : 'Live visual customizer, font scaler, border engine, 5-tab listing manager, and CRM.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => {
                if (window.confirm(isAr ? 'هل تريد استعادة جميع الإعدادات الافتراضية؟' : 'Reset all site customizations and catalog to factory default?')) {
                  resetToDefaults();
                }
              }}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all duration-150 active:scale-95 border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isAr ? 'إعادة ضبط' : 'Reset Defaults'}</span>
            </button>

            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className="px-4 py-2.5 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all duration-150 active:scale-95 shadow-md"
                style={{ backgroundColor: 'var(--primary-accent, #0284c7)' }}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isAr ? 'معاينة الموقع' : 'View Live Site'}</span>
              </button>
            )}

            <button
              onClick={handleAdminLogout}
              className="px-3.5 py-2.5 bg-red-950/60 hover:bg-red-900/80 text-red-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all duration-150 active:scale-95 border border-red-800/60"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isAr ? 'خروج' : 'Logout'}</span>
            </button>
          </div>
        </div>

        {/* Primary Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-800/80 border border-slate-700 rounded-2xl mb-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('listings')}
            className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all duration-150 flex items-center gap-2 ${
              activeTab === 'listings' ? 'bg-slate-900 text-white shadow-sm ring-1 ring-white/10' : 'text-slate-400 hover:text-white'
            }`}
            style={{ color: activeTab === 'listings' ? 'var(--primary-accent, #0284c7)' : undefined }}
          >
            <Layers className="w-4 h-4" />
            <span>1. {isAr ? 'الكتالوج والمخزون' : 'Catalog & Listings'}</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all duration-150 flex items-center gap-2 relative ${
              activeTab === 'orders' ? 'bg-slate-900 text-white shadow-sm ring-1 ring-white/10' : 'text-slate-400 hover:text-white'
            }`}
            style={{ color: activeTab === 'orders' ? 'var(--primary-accent, #0284c7)' : undefined }}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>2. {isAr ? 'الطلبات' : 'Orders'} ({orders.length})</span>
            {orders.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all duration-150 flex items-center gap-2 relative ${
              activeTab === 'bookings' ? 'bg-slate-900 text-white shadow-sm ring-1 ring-white/10' : 'text-slate-400 hover:text-white'
            }`}
            style={{ color: activeTab === 'bookings' ? 'var(--primary-accent, #0284c7)' : undefined }}
          >
            <Calendar className="w-4 h-4" />
            <span>3. {isAr ? 'حجوزات الكراج' : 'Garage Bookings'} ({bookings.length})</span>
            {bookings.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('testDrives')}
            className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all duration-150 flex items-center gap-2 relative ${
              activeTab === 'testDrives' ? 'bg-slate-900 text-white shadow-sm ring-1 ring-white/10' : 'text-slate-400 hover:text-white'
            }`}
            style={{ color: activeTab === 'testDrives' ? 'var(--primary-accent, #0284c7)' : undefined }}
          >
            <Car className="w-4 h-4" />
            <span>4. {isAr ? 'تجربة القيادة' : 'Test Drives'} ({testDrives.length})</span>
            {testDrives.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('crm')}
            className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all duration-150 flex items-center gap-2 ${
              activeTab === 'crm' ? 'bg-slate-900 text-white shadow-sm ring-1 ring-white/10' : 'text-slate-400 hover:text-white'
            }`}
            style={{ color: activeTab === 'crm' ? 'var(--primary-accent, #0284c7)' : undefined }}
          >
            <Users className="w-4 h-4" />
            <span>5. {isAr ? 'دليل العملاء' : 'CRM'} ({registeredUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('builder')}
            className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all duration-150 flex items-center gap-2 ${
              activeTab === 'builder' ? 'bg-slate-900 text-white shadow-sm ring-1 ring-white/10' : 'text-slate-400 hover:text-white'
            }`}
            style={{ color: activeTab === 'builder' ? 'var(--primary-accent, #0284c7)' : undefined }}
          >
            <Sliders className="w-4 h-4" />
            <span>6. {isAr ? 'محرر الواجهة' : 'Website Builder'}</span>
          </button>

          <button
            onClick={() => setActiveTab('theme')}
            className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all duration-150 flex items-center gap-2 ${
              activeTab === 'theme' ? 'bg-slate-900 text-white shadow-sm ring-1 ring-white/10' : 'text-slate-400 hover:text-white'
            }`}
            style={{ color: activeTab === 'theme' ? 'var(--primary-accent, #0284c7)' : undefined }}
          >
            <Palette className="w-4 h-4" />
            <span>7. {isAr ? 'الألوان والتخصيص' : 'Theme & Styles'}</span>
          </button>

          <button
            onClick={() => setActiveTab('business')}
            className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all duration-150 flex items-center gap-2 ${
              activeTab === 'business' ? 'bg-slate-900 text-white shadow-sm ring-1 ring-white/10' : 'text-slate-400 hover:text-white'
            }`}
            style={{ color: activeTab === 'business' ? 'var(--primary-accent, #0284c7)' : undefined }}
          >
            <Phone className="w-4 h-4" />
            <span>8. {isAr ? 'معلومات الورشة' : 'Business'}</span>
          </button>
        </div>

        {/* TAB 1: LISTINGS */}
        {activeTab === 'listings' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl border border-slate-700/70 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ backgroundColor: 'var(--card-bg, #1e293b)' }}>
              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setListingCategory('products')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 flex items-center gap-2 shrink-0 ${
                    listingCategory === 'products' ? 'text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  style={{ backgroundColor: listingCategory === 'products' ? 'var(--primary-accent, #0284c7)' : undefined }}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>{isAr ? 'القطع والترقيات' : 'Parts & Upgrades'} ({config.products.length})</span>
                </button>

                <button
                  onClick={() => setListingCategory('services')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 flex items-center gap-2 shrink-0 ${
                    listingCategory === 'services' ? 'text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  style={{ backgroundColor: listingCategory === 'services' ? 'var(--primary-accent, #0284c7)' : undefined }}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>{isAr ? 'خدمات المنصات' : 'Garage Services'} ({config.services.length})</span>
                </button>

                <button
                  onClick={() => setListingCategory('vehicles')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 flex items-center gap-2 shrink-0 ${
                    listingCategory === 'vehicles' ? 'text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  style={{ backgroundColor: listingCategory === 'vehicles' ? 'var(--primary-accent, #0284c7)' : undefined }}
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>{isAr ? 'سيارات المعرض' : 'Showroom Cars'} ({config.vehicles.length})</span>
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={listingSearch}
                    onChange={(e) => setListingSearch(e.target.value)}
                    placeholder={isAr ? 'بحث في الكتالوج...' : 'Search catalog items...'}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <button
                  onClick={() => handleOpenAdd(listingCategory === 'products' ? 'product' : listingCategory === 'services' ? 'service' : 'vehicle')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-150 active:scale-95 flex items-center gap-1.5 shadow-md shadow-emerald-600/20 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAr ? 'إضافة جديد' : 'Add New'}</span>
                </button>
              </div>
            </div>

            {/* Product Cards Grid */}
            {listingCategory === 'products' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((p) => {
                  const galleryCount = (p.images?.length || p.gallery?.length || 1);
                  return (
                    <div 
                      key={p.id} 
                      className="rounded-3xl border border-slate-700/60 overflow-hidden shadow-lg flex flex-col justify-between group transition-all duration-200" 
                      style={{ backgroundColor: 'var(--card-bg, #1e293b)' }}
                    >
                      <div>
                        <div className="aspect-square relative overflow-hidden bg-slate-950">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <span className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase">
                            {p.category}
                          </span>
                          <span className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-sm text-amber-300 px-2 py-0.5 rounded-md text-[10px] font-bold">
                            📸 {galleryCount} {galleryCount === 1 ? (isAr ? 'صورة' : 'Photo') : (isAr ? 'صور' : 'Photos')}
                          </span>
                          <span className="absolute bottom-3 right-3 bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-[11px] font-black shadow-md">
                            {p.price} KWD • {isAr ? 'الدفع نقداً عند الاستلام' : 'Cash on Delivery'}
                          </span>
                        </div>
                        <div className="p-5">
                          <div className="text-[11px] font-mono font-bold text-sky-400 mb-0.5" style={{ color: 'var(--primary-accent, #0284c7)' }}>{p.partNumber}</div>
                          <h3 className="font-bold text-sm text-white line-clamp-1 mb-1">{isAr && p.nameAr ? p.nameAr : p.name}</h3>
                          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">{isAr && p.descriptionAr ? p.descriptionAr : p.description}</p>
                          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                            <span>{isAr ? 'المخزون:' : 'Stock:'} {p.stock}</span>
                            <span>⭐ {p.rating} / 5</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 pt-0 border-t border-slate-700/60 flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleOpenEdit('product', p)}
                          className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-all duration-150 active:scale-95 border border-slate-700"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-sky-400" />
                          <span>{isAr ? 'تعديل' : 'Edit'}</span>
                        </button>
                        <button
                          onClick={() => handleDuplicateItem('product', p)}
                          title="Duplicate"
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all duration-150 active:scale-95 border border-slate-700"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(isAr ? `حذف المنتج "${p.name}"؟` : `Delete product "${p.name}"?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="px-3 py-2 bg-red-950/60 hover:bg-red-900 text-red-300 font-bold text-xs rounded-xl transition-all duration-150 active:scale-95 border border-red-800/60"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Service Cards Grid */}
            {listingCategory === 'services' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((s) => {
                  const galleryCount = (s.images?.length || s.gallery?.length || 1);
                  return (
                    <div 
                      key={s.id} 
                      className="rounded-3xl border border-slate-700/60 overflow-hidden shadow-lg flex flex-col justify-between group transition-all duration-200" 
                      style={{ backgroundColor: 'var(--card-bg, #1e293b)' }}
                    >
                      <div>
                        <div className="aspect-square relative overflow-hidden bg-slate-950">
                          <img src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <span className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase">
                            ⏱️ {s.duration}
                          </span>
                          <span className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-sm text-amber-300 px-2 py-0.5 rounded-md text-[10px] font-bold">
                            📸 {galleryCount} {isAr ? 'صور' : 'Photos'}
                          </span>
                          <span className="absolute bottom-3 right-3 bg-sky-600 text-white px-2.5 py-1 rounded-lg text-[11px] font-black shadow-md" style={{ backgroundColor: 'var(--primary-accent, #0284c7)' }}>
                            {s.price} KWD • {isAr ? 'الدفع عند الحضور' : 'Cash on Arrival'}
                          </span>
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-sm text-white line-clamp-1 mb-1">{isAr && s.titleAr ? s.titleAr : s.title}</h3>
                          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">{isAr && s.descriptionAr ? s.descriptionAr : s.description}</p>
                        </div>
                      </div>
                      <div className="p-4 pt-0 border-t border-slate-700/60 flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleOpenEdit('service', s)}
                          className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-all duration-150 active:scale-95 border border-slate-700"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-sky-400" />
                          <span>{isAr ? 'تعديل' : 'Edit'}</span>
                        </button>
                        <button
                          onClick={() => handleDuplicateItem('service', s)}
                          title="Duplicate"
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all duration-150 active:scale-95 border border-slate-700"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(isAr ? `حذف الخدمة "${s.title}"؟` : `Delete service "${s.title}"?`)) {
                              deleteService(s.id);
                            }
                          }}
                          className="px-3 py-2 bg-red-950/60 hover:bg-red-900 text-red-300 font-bold text-xs rounded-xl transition-all duration-150 active:scale-95 border border-red-800/60"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Vehicle Cards Grid */}
            {listingCategory === 'vehicles' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map((v) => {
                  const galleryCount = (v.images?.length || v.gallery?.length || 1);
                  return (
                    <div 
                      key={v.id} 
                      className="rounded-3xl border border-slate-700/60 overflow-hidden shadow-lg flex flex-col justify-between group transition-all duration-200" 
                      style={{ backgroundColor: 'var(--card-bg, #1e293b)' }}
                    >
                      <div>
                        <div className="aspect-square relative overflow-hidden bg-slate-950">
                          <img src={v.image} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase" style={{ backgroundColor: 'var(--secondary-accent, #f59e0b)' }}>
                            {v.badge}
                          </span>
                          <span className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-sm text-amber-300 px-2 py-0.5 rounded-md text-[10px] font-bold">
                            📸 {galleryCount} {isAr ? 'صور' : 'Photos'}
                          </span>
                          <span className="absolute bottom-3 right-3 bg-slate-900/90 text-white px-2.5 py-1 rounded-lg text-[11px] font-black shadow-md">
                            {v.price.toLocaleString()} KWD
                          </span>
                        </div>
                        <div className="p-5">
                          <div className="text-[11px] font-bold text-sky-400 mb-0.5" style={{ color: 'var(--primary-accent, #0284c7)' }}>{v.year} • {v.mileage} • {v.power}</div>
                          <h3 className="font-bold text-sm text-white line-clamp-1 mb-1">{isAr && v.nameAr ? v.nameAr : v.name}</h3>
                          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">{v.description}</p>
                        </div>
                      </div>
                      <div className="p-4 pt-0 border-t border-slate-700/60 flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleOpenEdit('vehicle', v)}
                          className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-all duration-150 active:scale-95 border border-slate-700"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-sky-400" />
                          <span>{isAr ? 'تعديل' : 'Edit'}</span>
                        </button>
                        <button
                          onClick={() => handleDuplicateItem('vehicle', v)}
                          title="Duplicate"
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all duration-150 active:scale-95 border border-slate-700"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(isAr ? `حذف المركبة "${v.name}"؟` : `Delete vehicle "${v.name}"?`)) {
                              deleteVehicle(v.id);
                            }
                          }}
                          className="px-3 py-2 bg-red-950/60 hover:bg-red-900 text-red-300 font-bold text-xs rounded-xl transition-all duration-150 active:scale-95 border border-red-800/60"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-lg" style={{ backgroundColor: 'var(--card-bg, #1e293b)' }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-sky-400" style={{ color: 'var(--primary-accent, #0284c7)' }} />
                    <span>{isAr ? 'طلبات العملاء وأرقام الاتصال' : 'Customer Placed Orders & Phone Contacts'}</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {isAr ? 'جدول الطلبات المباشرة في الكويت مع إمكانية التواصل الفوري عبر الواتساب.' : 'Live feed of orders placed by customers across Kuwait. Contact clients directly via WhatsApp or phone.'}
                  </p>
                </div>
                <div className="text-xs font-mono font-bold text-slate-300 bg-slate-900 border border-slate-700 px-3.5 py-1.5 rounded-xl">
                  {isAr ? 'الإجمالي:' : 'Total Orders:'} {orders.length}
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-2xl">
                  <Package className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                  <div className="text-sm font-bold text-slate-300">{isAr ? 'لا توجد طلبات مسجلة بعد' : 'No Orders Placed Yet'}</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div key={ord.id} className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 hover:border-slate-500 transition-all">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono font-bold text-sky-400 text-sm" style={{ color: 'var(--primary-accent, #0284c7)' }}>{ord.id}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              ord.status === 'Delivered' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                              ord.status === 'Dispatched' ? 'bg-sky-950 text-sky-300 border border-sky-800' :
                              ord.status === 'Cancelled' ? 'bg-red-950 text-red-300 border border-red-800' :
                              'bg-amber-950 text-amber-300 border border-amber-800'
                            }`}>
                              {ord.status}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">📅 {ord.date}</span>
                          </div>
                          
                          <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-200">
                            <div className="flex items-center gap-1.5 text-white font-bold">
                              <Users className="w-3.5 h-3.5 text-slate-400" />
                              <span>{ord.customerName || (isAr ? 'عميل كراج' : 'Store Client')}</span>
                            </div>
                            {ord.customerPhone && (
                              <div className="flex items-center gap-1.5 text-sky-400 font-mono font-bold bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                                <span>{ord.customerPhone}</span>
                              </div>
                            )}
                            {ord.customerEmail && (
                              <div className="text-slate-400 text-[11px] flex items-center gap-1">
                                <Mail className="w-3 h-3 text-slate-500" />
                                <span>{ord.customerEmail}</span>
                              </div>
                            )}
                            {ord.shippingAddress && (
                              <div className="text-slate-300 text-[11px] flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-red-400" />
                                <span>{ord.shippingAddress}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start md:self-center">
                          <select
                            value={ord.status}
                            onChange={(e) => onUpdateOrder && onUpdateOrder(ord.id, { status: e.target.value as any })}
                            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-sky-500"
                          >
                            <option value="Processing">{isAr ? 'قيد التجهيز' : 'Status: Processing'}</option>
                            <option value="Dispatched">{isAr ? 'تم الشحن' : 'Status: Dispatched'}</option>
                            <option value="Ready for Workshop Pickup">{isAr ? 'جاهز للاستلام من الورشة' : 'Status: Workshop Pickup'}</option>
                            <option value="Delivered">{isAr ? 'تم التوصيل' : 'Status: Delivered'}</option>
                            <option value="Cancelled">{isAr ? 'ملغي' : 'Status: Cancelled'}</option>
                          </select>

                          {ord.customerPhone && (
                            <a
                              href={`https://wa.me/${ord.customerPhone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 rounded-xl border border-emerald-800 transition-all duration-150 active:scale-95"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          )}

                          {onDeleteOrder && (
                            <button
                              onClick={() => {
                                if (window.confirm(isAr ? `حذف الطلب ${ord.id}؟` : `Delete order ${ord.id}?`)) {
                                  onDeleteOrder(ord.id);
                                }
                              }}
                              className="p-2 bg-red-950/60 hover:bg-red-900 text-red-300 rounded-xl transition-all duration-150 active:scale-95 border border-red-800"
                              title="Delete Order"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="pt-3">
                        <div className="text-[11px] font-bold uppercase text-slate-400 mb-2">{isAr ? 'القطع المطلوبة:' : 'Order Line Items:'}</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs flex items-center justify-between text-slate-200">
                              <span className="font-semibold truncate mr-2">{item.productName}</span>
                              <span className="font-mono text-sky-400 font-bold shrink-0">x{item.quantity} ({item.price * item.quantity} KWD)</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs font-bold text-slate-300 border-t border-slate-800 pt-2">
                          <span>{isAr ? 'طريقة الدفع:' : 'Payment Method:'} <span className="font-mono text-slate-400">{ord.paymentMethod}</span></span>
                          <span className="text-sm font-black text-sky-400" style={{ color: 'var(--primary-accent, #0284c7)' }}>{isAr ? 'المجموع:' : 'Total:'} {ord.totalAmount} KWD</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-lg" style={{ backgroundColor: 'var(--card-bg, #1e293b)' }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-sky-400" style={{ color: 'var(--primary-accent, #0284c7)' }} />
                    <span>{isAr ? 'حجوزات منصات الفحص والداينو' : 'Customer Bay Reservations & Diagnostic Appointments'}</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {isAr ? 'مواعيد برمجة السيارات وصيانة المحركات المحجوزة مباشرة في فرع الشويخ.' : 'Direct bookings placed by vehicle owners for dyno tuning, computerized diagnostics, and repair bays.'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={bookingSearch}
                      onChange={(e) => setBookingSearch(e.target.value)}
                      placeholder={isAr ? 'بحث في الحجوزات...' : 'Search bookings...'}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-300 bg-slate-900 border border-slate-700 px-3.5 py-2 rounded-xl whitespace-nowrap">
                    {isAr ? 'الإجمالي:' : 'Total:'} {bookings.length}
                  </div>
                </div>
              </div>

              {filteredBookings.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-2xl">
                  <Calendar className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                  <div className="text-sm font-bold text-slate-300">{isAr ? 'لا توجد حجوزات صيانة نشطة' : 'No Bay Bookings Found'}</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBookings.map((bk) => (
                    <div key={bk.id} className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 hover:border-slate-500 transition-all">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono font-bold text-sky-400 text-sm" style={{ color: 'var(--primary-accent, #0284c7)' }}>{bk.id}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              bk.status === 'Completed' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                              bk.status === 'Ready for Pickup' ? 'bg-teal-950 text-teal-300 border border-teal-800' :
                              bk.status === 'In Service Bay' ? 'bg-purple-950 text-purple-300 border border-purple-800 animate-pulse' :
                              bk.status === 'Car Received' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                              'bg-sky-950 text-sky-300 border border-sky-800'
                            }`}>
                              {bk.status}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">📅 {bk.date} • ⏱️ {bk.timeSlot}</span>
                          </div>

                          <h3 className="text-base font-bold text-white mt-2">{bk.serviceTitle}</h3>
                          
                          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-200">
                            <div className="flex items-center gap-1.5 text-white font-bold">
                              <Users className="w-3.5 h-3.5 text-slate-400" />
                              <span>{bk.customerName || (isAr ? 'عميل كراج' : 'Garage Client')}</span>
                            </div>
                            {bk.customerPhone && (
                              <div className="flex items-center gap-1.5 text-sky-400 font-mono font-bold bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                                <span>{bk.customerPhone}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1.5 text-slate-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                              <Car className="w-3.5 h-3.5 text-sky-400" />
                              <span>{bk.vehicleInfo}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start lg:self-center">
                          <select
                            value={bk.status}
                            onChange={(e) => onUpdateBooking && onUpdateBooking(bk.id, { status: e.target.value as any })}
                            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-sky-500"
                          >
                            <option value="Confirmed">{isAr ? 'مؤكد' : 'Status: Confirmed'}</option>
                            <option value="Car Received">{isAr ? 'تم استلام السيارة' : 'Status: Car Received'}</option>
                            <option value="In Service Bay">{isAr ? 'في منصة الصيانة' : 'Status: In Service Bay'}</option>
                            <option value="Ready for Pickup">{isAr ? 'جاهزة للاستلام' : 'Status: Ready for Pickup'}</option>
                            <option value="Completed">{isAr ? 'مكتمل' : 'Status: Completed'}</option>
                          </select>

                          {bk.customerPhone && (
                            <a
                              href={`https://wa.me/${bk.customerPhone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 rounded-xl border border-emerald-800 transition-all duration-150 active:scale-95"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          )}

                          {onDeleteBooking && (
                            <button
                              onClick={() => {
                                if (window.confirm(isAr ? `حذف الحجز ${bk.id}؟` : `Delete booking ${bk.id}?`)) {
                                  onDeleteBooking(bk.id);
                                }
                              }}
                              className="p-2 bg-red-950/60 hover:bg-red-900 text-red-300 rounded-xl transition-all duration-150 active:scale-95 border border-red-800"
                              title="Delete Booking"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-bold text-slate-300 gap-2">
                        <div>
                          <span>{isAr ? 'حالة السداد:' : 'Payment Status:'} </span>
                          <span className="text-emerald-400 font-semibold">{bk.paymentStatus} ({isAr ? 'الدفع نقداً عند الحضور في كراج الشويخ' : 'Cash on Arrival at Shuwaikh'})</span>
                        </div>
                        <div className="text-sm font-black text-sky-400" style={{ color: 'var(--primary-accent, #0284c7)' }}>
                          {isAr ? 'تقدير الفاتورة:' : 'Job Estimate:'} {bk.totalAmount} KWD
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: TEST DRIVES */}
        {activeTab === 'testDrives' && (
          <div className="space-y-6">
            <div className="rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-lg" style={{ backgroundColor: 'var(--card-bg, #1e293b)' }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Car className="w-5 h-5 text-sky-400" style={{ color: 'var(--primary-accent, #0284c7)' }} />
                    <span>{isAr ? 'طلبات تجربة القيادة VIP في المعرض' : 'Showroom VIP Test Drive Reservations'}</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {isAr ? 'جدول العملاء الحاجزين لتجربة القيادة للسيارات الرياضية الفاخرة.' : 'Live schedule of customers requesting VIP test drives for certified showroom supercars and performance vehicles.'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={testDriveSearch}
                      onChange={(e) => setTestDriveSearch(e.target.value)}
                      placeholder={isAr ? 'بحث في الطلبات...' : 'Search test drives...'}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-300 bg-slate-900 border border-slate-700 px-3.5 py-2 rounded-xl whitespace-nowrap">
                    {isAr ? 'الإجمالي:' : 'Total:'} {testDrives.length}
                  </div>
                </div>
              </div>

              {filteredTestDrives.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-2xl">
                  <Car className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                  <div className="text-sm font-bold text-slate-300">{isAr ? 'لا توجد طلبات تجربة قيادة حالياً' : 'No VIP Test Drive Requests'}</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTestDrives.map((td) => (
                    <div key={td.id} className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 hover:border-slate-500 transition-all">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono font-bold text-sky-400 text-sm" style={{ color: 'var(--primary-accent, #0284c7)' }}>{td.id}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              td.status === 'Completed' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                              td.status === 'Cancelled' ? 'bg-red-950 text-red-300 border border-red-800' :
                              'bg-amber-950 text-amber-300 border border-amber-800'
                            }`}>
                              {td.status}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">📅 {td.date}</span>
                          </div>

                          <h3 className="text-base font-black text-white mt-2">{td.vehicleName}</h3>
                          
                          <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-200">
                            <div className="flex items-center gap-1.5 text-white font-bold">
                              <Users className="w-3.5 h-3.5 text-slate-400" />
                              <span>{td.customerName || 'VIP Client'}</span>
                            </div>
                            {td.customerPhone && (
                              <div className="flex items-center gap-1.5 text-sky-400 font-mono font-bold bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                                <span>{td.customerPhone}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                              <MapPin className="w-3.5 h-3.5 text-red-400" />
                              <span>{td.location}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start lg:self-center">
                          <select
                            value={td.status}
                            onChange={(e) => onUpdateTestDrive && onUpdateTestDrive(td.id, { status: e.target.value as any })}
                            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-sky-500"
                          >
                            <option value="Confirmed VIP Slot">{isAr ? 'موعد VIP مؤكد' : 'Confirmed VIP Slot'}</option>
                            <option value="Pending Confirmation">{isAr ? 'بانتظار التأكيد' : 'Pending Confirmation'}</option>
                            <option value="Completed">{isAr ? 'تمت التجربة' : 'Completed'}</option>
                            <option value="Cancelled">{isAr ? 'ملغي' : 'Cancelled'}</option>
                          </select>

                          {td.customerPhone && (
                            <a
                              href={`https://wa.me/${td.customerPhone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 rounded-xl border border-emerald-800 transition-all duration-150 active:scale-95"
                              title="WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          )}

                          {onDeleteTestDrive && (
                            <button
                              onClick={() => {
                                if (window.confirm(isAr ? `حذف طلب تجربة القيادة ${td.id}؟` : `Delete test drive request ${td.id}?`)) {
                                  onDeleteTestDrive(td.id);
                                }
                              }}
                              className="p-2 bg-red-950/60 hover:bg-red-900 text-red-300 rounded-xl transition-all duration-150 active:scale-95 border border-red-800"
                              title="Delete Request"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: CRM */}
        {activeTab === 'crm' && (
          <div className="space-y-8">
            <div className="rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-lg" style={{ backgroundColor: 'var(--card-bg, #1e293b)' }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div>
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-sky-400" style={{ color: 'var(--primary-accent, #0284c7)' }} />
                    <span>{isAr ? 'دليل حسابات العملاء المسجلين' : 'Registered Customer Accounts Directory'} ({registeredUsers.length})</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isAr ? 'قاعدة بيانات عملاء الورشة وسجلات سياراتهم المحفوظة.' : 'Live database of all verified garage clients, contact records, and fleet profiles.'}
                  </p>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder={isAr ? 'بحث بالاسم، الهاتف، الإيميل...' : 'Search name, phone, email...'}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {filteredUsers.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-slate-700 rounded-2xl text-xs text-slate-400 font-semibold">
                  {userSearch ? (isAr ? 'لا توجد نتائج مطابقة لبحثك' : 'No customer accounts match your search filter.') : (isAr ? 'لا يوجد عملاء مسجلين بعد' : 'No customer user accounts registered yet.')}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredUsers.map((u) => (
                    <div key={u.id} className="bg-slate-900/90 p-5 rounded-2xl border border-slate-700/80 flex flex-col justify-between hover:border-slate-500 transition-all">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-black text-sm text-white line-clamp-1">{u.name}</div>
                          <span className="text-[10px] font-mono font-bold bg-sky-950 text-sky-300 border border-sky-800 px-2 py-0.5 rounded-full">
                            ID: {u.id.substring(0, 10)}
                          </span>
                        </div>

                        <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                          <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">{u.email}</span>
                        </div>

                        <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5 mb-3">
                          <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{u.phone}</span>
                        </div>

                        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 mb-3 space-y-1">
                          <div className="flex justify-between">
                            <span>{isAr ? 'المركبات المحفوظة:' : 'Garage Vehicles:'}</span>
                            <span className="font-bold text-white">{u.savedVehicles?.length || 0}</span>
                          </div>
                          {u.savedVehicles && u.savedVehicles.length > 0 && (
                            <div className="text-sky-400 font-semibold truncate">
                              🚗 {u.savedVehicles[0].year} {u.savedVehicles[0].make} {u.savedVehicles[0].model}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                        {u.phone && (
                          <a
                            href={`https://wa.me/${u.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-95"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        )}

                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          title="Delete User"
                          className="p-2 bg-red-950/60 hover:bg-red-900 text-red-300 rounded-xl transition-all duration-150 active:scale-95 border border-red-800"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: WEBSITE BUILDER */}
        {activeTab === 'builder' && (
          <div className="max-w-4xl rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-lg space-y-8" style={{ backgroundColor: 'var(--card-bg, #1e293b)' }}>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-sky-400" style={{ color: 'var(--primary-accent, #0284c7)' }} />
                <span>{isAr ? 'تخصيص الهوية والنصوص والخلفية الديناميكية' : 'Shopify-Style Website Builder & Media Engine'}</span>
              </h2>
            </div>

            <form onSubmit={handleSaveWebsiteBuilder} className="space-y-6">
              <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-700/80 space-y-4">
                <h3 className="text-sm font-bold uppercase text-white flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-sky-400" style={{ color: 'var(--primary-accent, #0284c7)' }} />
                  <span>1. {isAr ? 'اسم الموقع والشعار' : 'Website Branding, Logo & Favicon'}</span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">{isAr ? 'اسم الموقع' : 'Brand Title'}</label>
                    <input
                      type="text"
                      required
                      value={siteName}
                      onChange={(e) => {
                        setSiteName(e.target.value);
                        updateSiteSettings({ siteName: e.target.value });
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">{isAr ? 'الشعار النصي' : 'Tagline / Motto'}</label>
                    <input
                      type="text"
                      value={motto}
                      onChange={(e) => {
                        setMotto(e.target.value);
                        updateSiteSettings({ motto: e.target.value });
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-medium text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">{isAr ? 'رابط الشعار' : 'Logo URL'}</label>
                    <input
                      type="url"
                      value={logoUrl}
                      onChange={(e) => {
                        setLogoUrl(e.target.value);
                        updateSiteSettings({ logoUrl: e.target.value });
                      }}
                      placeholder="https://..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">{isAr ? 'أيقونة التبويب Favicon' : 'Favicon URL'}</label>
                    <input
                      type="url"
                      value={faviconUrl}
                      onChange={(e) => {
                        setFaviconUrl(e.target.value);
                        updateSiteSettings({ faviconUrl: e.target.value });
                      }}
                      placeholder="https://..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white"
                    />
                  </div>
                </div>
              </div>

              {builderSavedToast && (
                <div className="p-3.5 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{isAr ? 'تم حفظ التعديلات بنجاح!' : 'Website branding configurations saved successfully!'}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-150 active:scale-95 flex items-center justify-center gap-2 shadow-lg"
                style={{ backgroundColor: 'var(--primary-accent, #0284c7)' }}
              >
                <Save className="w-4 h-4" />
                <span>{isAr ? 'حفظ إعدادات الموقع' : 'Save Website Builder Changes'}</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 7: THEME & COLOR CUSTOMIZER */}
        {activeTab === 'theme' && (
          <div className="max-w-4xl rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-lg space-y-8" style={{ backgroundColor: 'var(--card-bg, #1e293b)' }}>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-sky-400" style={{ color: 'var(--primary-accent, #0284c7)' }} />
                <span>{isAr ? 'محرر الألوان والخطوط والتحكم في الحجم' : 'Color Wheels, Font Scaler & Surface Engine'}</span>
              </h2>
            </div>

            <form onSubmit={handleSaveThemeSettings} className="space-y-8">
              
              {/* === THEME: neon hover glow on listing cards === */}
<div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-700/80 space-y-3 mt-4">
  <h3 className="text-xs font-bold uppercase text-white">Listing Hover Glow (Neon)</h3>
  <div className="flex items-center gap-2">
    <input type="color" value={String((config as any).neonColor || "#22d3ee")} onChange={(e) => updateSiteSettings({ neonColor: e.target.value } as any)} className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent p-0" />
    <input type="text" value={String((config as any).neonColor || "#22d3ee")} onChange={(e) => updateSiteSettings({ neonColor: e.target.value } as any)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white" />
  </div>
  <p className="text-[10px] text-slate-500">On/off follows the existing "Enable Subtle Neon Accent Glow" checkbox below.</p>
</div>
{/* === THEME: text colours / hero background / sticker header === */}
<div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-700/80 space-y-4 mt-4">
  <h3 className="text-xs font-bold uppercase text-white">Text Colours</h3>
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    {[{k:"bodyText",l:"Body Text",d:"#f8fafc"},{k:"headerText",l:"Header Text",d:"#ffffff"},{k:"listingText",l:"Listing Text",d:"#f8fafc"}].map((f) => (
      <div key={f.k}>
        <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">{f.l}</label>
        <div className="flex items-center gap-2">
          <input type="color" value={String((config as any)[f.k] || f.d)} onChange={(e) => updateSiteSettings({ [f.k]: e.target.value } as any)} className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent p-0" />
          <input type="text" value={String((config as any)[f.k] || f.d)} onChange={(e) => updateSiteSettings({ [f.k]: e.target.value } as any)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white" />
        </div>
      </div>
    ))}
  </div>
</div>
<div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-700/80 space-y-4 mt-4">
  <h3 className="text-xs font-bold uppercase text-white">Hero Background (Image or Video)</h3>
  <div className="flex flex-wrap gap-2">
    {["none","image","video"].map((t) => (
      <button key={t} type="button" onClick={() => updateSiteSettings({ bgType: t } as any)}
        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase border transition-all ${((config as any).bgType || "none") === t ? "bg-sky-600 border-sky-500 text-white" : "bg-slate-950 border-slate-800 text-slate-300"}`}>{t}</button>
    ))}
  </div>
  <div>
        <div className="mb-3">
      <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Upload from your device (image or video)</label>
      <input type="file" accept="image/*,video/*"
        onChange={async (e) => {
          const f = e.target.files && e.target.files[0];
          if (!f) return;
          const saved = await saveMediaFile(f);
          if (saved.url) updateSiteSettings({ bgMediaUrl: saved.url, bgType: saved.type } as any);
        }}
        className="block w-full text-xs text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-sky-600 file:text-white cursor-pointer" />
      <p className="text-[10px] text-slate-500 mt-1">Stored in IndexedDB in this browser. Videos supported - they never touch localStorage.</p>
    </div>
    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Media URL (.jpg .png or .mp4)</label>
    <input type="text" value={String((config as any).bgMediaUrl || "")} onChange={(e) => updateSiteSettings({ bgMediaUrl: e.target.value } as any)} placeholder="https://..." className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white" />
  </div>
  <div>
    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Dark Overlay: {Math.round(Number((config as any).bgOverlayOpacity ?? 0.15) * 100)}%</label>
    <input type="range" min="0" max="0.9" step="0.05" value={Number((config as any).bgOverlayOpacity ?? 0.15)} onChange={(e) => updateSiteSettings({ bgOverlayOpacity: Number(e.target.value) } as any)} className="w-full" />
  </div>
</div>
<div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-700/80 space-y-4 mt-4">
  <h3 className="text-xs font-bold uppercase text-white">Sticker Header (scrolling bar)</h3>
  <input type="text" value={String((config as any).stickerText || "")} onChange={(e) => updateSiteSettings({ stickerText: e.target.value } as any)} placeholder="Type anything here. Leave empty to hide the bar." className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white" />
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <div>
      <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Scroll speed (sec)</label>
      <input type="number" min="5" max="120" value={Number((config as any).stickerSpeed || 30)} onChange={(e) => updateSiteSettings({ stickerSpeed: Number(e.target.value) } as any)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white" />
    </div>
    <div>
      <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Bar colour</label>
      <input type="color" value={String((config as any).stickerBg || "#f59e0b")} onChange={(e) => updateSiteSettings({ stickerBg: e.target.value } as any)} className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent p-0" />
    </div>
    <div>
      <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Sticker text colour</label>
      <input type="color" value={String((config as any).stickerTextColor || "#0f172a")} onChange={(e) => updateSiteSettings({ stickerTextColor: e.target.value } as any)} className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent p-0" />
    </div>
  </div>
</div>
{/* Text Size Scaler */}
              <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase text-white flex items-center gap-1.5">
                    <Maximize2 className="w-4 h-4 text-sky-400" />
                    <span>{isAr ? 'مقياس حجم الخط الشامل للموقع' : 'Global Typography & Text Size Scaler'}</span>
                  </label>
                  <span className="text-xs font-mono font-bold text-sky-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                    {fontSizeScale}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {FONT_SCALES.map((scale) => (
                    <button
                      key={scale.value}
                      type="button"
                      onClick={() => {
                        setFontSizeScale(scale.value);
                        updateSiteSettings({ fontSizeScale: scale.value });
                      }}
                      className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all duration-150 active:scale-95 ${
                        fontSizeScale === scale.value
                          ? 'border-sky-500 bg-sky-950 text-white ring-2 ring-sky-500/20'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {scale.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Family Selection */}
              <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-700/80 space-y-3">
                <label className="block text-xs font-bold uppercase text-white flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? 'نوع الخط المعتمد' : 'Primary Font Family'}</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FONT_OPTIONS.map((font) => (
                    <button
                      key={font.id}
                      type="button"
                      onClick={() => {
                        setFontStyle(font.id);
                        updateSiteSettings({ fontStyle: font.id });
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all duration-150 active:scale-95 flex flex-col justify-between ${
                        fontStyle === font.id
                          ? 'border-sky-500 bg-slate-950 text-white ring-2 ring-sky-500/20'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-white mb-0.5">{font.name}</div>
                      <div className="text-[11px] text-slate-400">{font.desc}</div>
                      <div className="text-xs font-semibold text-sky-400 mt-2 font-mono">Aa: {font.sample}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Surface Customizer (Card Background, Borders & Neon) */}
              <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-700/80 space-y-4">
                <h3 className="text-xs font-bold uppercase text-white flex items-center gap-1.5">
                  <Square className="w-4 h-4 text-emerald-400" />
                  <span>{isAr ? 'تخصيص بطاقات العرض والحواف' : 'Listing Cards Surface & Side Borders'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">{isAr ? 'لون خلفية البطاقات' : 'Card Background'}</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={cardBg}
                        onChange={(e) => {
                          setCardBg(e.target.value);
                          updateSiteSettings({ cardBg: e.target.value });
                        }}
                        className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent p-0"
                      />
                      <input
                        type="text"
                        value={cardBg}
                        onChange={(e) => {
                          setCardBg(e.target.value);
                          updateSiteSettings({ cardBg: e.target.value });
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">{isAr ? 'لون الحواف والحدود' : 'Border Color'}</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={cardBorderColor.startsWith('#') ? cardBorderColor : '#334155'}
                        onChange={(e) => {
                          setCardBorderColor(e.target.value);
                          updateSiteSettings({ cardBorderColor: e.target.value });
                        }}
                        className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent p-0"
                      />
                      <input
                        type="text"
                        value={cardBorderColor}
                        onChange={(e) => {
                          setCardBorderColor(e.target.value);
                          updateSiteSettings({ cardBorderColor: e.target.value });
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">{isAr ? 'استدارة الزوايا' : 'Corner Curvature'}</label>
                    <select
                      value={cardBorderRadius}
                      onChange={(e) => {
                        setCardBorderRadius(e.target.value);
                        updateSiteSettings({ cardBorderRadius: e.target.value });
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white"
                    >
                      {BORDER_RADIUS_OPTIONS.map(b => (
                        <option key={b.value} value={b.value}>{b.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-800">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-200">
                    <input
                      type="checkbox"
                      checked={enableCarbonPattern}
                      onChange={(e) => {
                        setEnableCarbonPattern(e.target.checked);
                        updateSiteSettings({ enableCarbonPattern: e.target.checked });
                      }}
                      className="w-4 h-4 rounded text-sky-600 bg-slate-950 border-slate-700"
                    />
                    <span>{isAr ? 'تفعيل شبكة ألياف الكربون الخفية' : 'Enable Carbon Fiber Subtle Texture'}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-200">
                    <input
                      type="checkbox"
                      checked={enableNeonGlow}
                      onChange={(e) => {
                        setEnableNeonGlow(e.target.checked);
                        updateSiteSettings({ enableNeonGlow: e.target.checked });
                      }}
                      className="w-4 h-4 rounded text-sky-600 bg-slate-950 border-slate-700"
                    />
                    <span>{isAr ? 'توهج النيون الرياضي' : 'Enable Subtle Neon Accent Glow'}</span>
                  </label>
                </div>
              </div>

              {/* Quick Harmony Presets & Custom Color Inputs */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase text-slate-300">{isAr ? 'قوالب التناسق السريع' : 'Quick Harmony Presets'}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {THEME_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => {
                        setThemeColor(p.primary);
                        setSecondaryAccent(p.secondary);
                        setHeaderBg(p.headerBg);
                        setFooterBg(p.footerBg);
                        setCardBg(p.cardBg);
                        setPageBg(p.pageBg);
                        updateSiteSettings({ 
                          themeColor: p.primary, 
                          secondaryAccent: p.secondary, 
                          accentColor: p.primary,
                          headerBg: p.headerBg,
                          footerBg: p.footerBg,
                          cardBg: p.cardBg,
                          pageBg: p.pageBg
                        });
                      }}
                      className="p-3 rounded-2xl border border-slate-700 bg-slate-900 hover:border-sky-500 text-left flex items-center gap-2.5 transition-all duration-150 active:scale-95"
                    >
                      <div className="flex -space-x-1.5 shrink-0">
                        <div className="w-5 h-5 rounded-full shadow-sm" style={{ backgroundColor: p.primary }} />
                        <div className="w-5 h-5 rounded-full shadow-sm ring-1 ring-slate-900" style={{ backgroundColor: p.secondary }} />
                      </div>
                      <div className="truncate text-xs font-bold text-white">{p.name}</div>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                  <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800">
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                      1. {isAr ? 'اللون الأساسي' : 'Primary Accent'}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={themeColor}
                        onChange={(e) => {
                          setThemeColor(e.target.value);
                          updateSiteSettings({ themeColor: e.target.value, accentColor: e.target.value });
                        }}
                        className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent p-0"
                      />
                      <input
                        type="text"
                        value={themeColor}
                        onChange={(e) => {
                          setThemeColor(e.target.value);
                          updateSiteSettings({ themeColor: e.target.value, accentColor: e.target.value });
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800">
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                      2. {isAr ? 'اللون الثانوي' : 'Secondary Accent'}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={secondaryAccent}
                        onChange={(e) => {
                          setSecondaryAccent(e.target.value);
                          updateSiteSettings({ secondaryAccent: e.target.value });
                        }}
                        className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent p-0"
                      />
                      <input
                        type="text"
                        value={secondaryAccent}
                        onChange={(e) => {
                          setSecondaryAccent(e.target.value);
                          updateSiteSettings({ secondaryAccent: e.target.value });
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {themeSavedToast && (
                <div className="p-3.5 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{isAr ? 'تم تطبيق وحفظ إعدادات المظهر بنجاح!' : 'Theme styling applied & saved successfully!'}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-150 active:scale-95 flex items-center justify-center gap-2 shadow-lg"
                style={{ backgroundColor: 'var(--primary-accent, #0284c7)' }}
              >
                <Save className="w-4 h-4" />
                <span>{isAr ? 'حفظ إعدادات الألوان والخطوط' : 'Save Theme & Style Configurations'}</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 8: BUSINESS */}
        {activeTab === 'business' && (
          <div className="max-w-3xl rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-lg" style={{ backgroundColor: 'var(--card-bg, #1e293b)' }}>
            <div className="mb-6">
              <h2 className="text-xl font-black text-white">{isAr ? 'بيانات الكراج والاتصال الرسمي' : 'Garage & Contact Information'}</h2>
            </div>

            <form onSubmit={handleSaveBusiness} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-sky-400" style={{ color: 'var(--primary-accent, #0284c7)' }} />
                  <span>{isAr ? 'هاتف الكراج المباشر' : 'Workshop Official Phone'}</span>
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    updateSiteSettings({ phone: e.target.value });
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1 flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isAr ? 'رقم الواتساب التجاري' : 'WhatsApp Business Helpline'}</span>
                </label>
                <input
                  type="text"
                  required
                  value={whatsapp}
                  onChange={(e) => {
                    setWhatsapp(e.target.value);
                    updateSiteSettings({ whatsapp: e.target.value });
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  <span>{isAr ? 'موقع الكراج والمعرض الفعلي' : 'Physical Garage & Showroom Location'}</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    updateSiteSettings({ location: e.target.value });
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm font-semibold text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              {businessSavedToast && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{isAr ? 'تم تحديث وحفظ بيانات الاتصال!' : 'Business contact info updated and saved!'}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-150 active:scale-95 flex items-center justify-center gap-2 shadow-lg"
                style={{ backgroundColor: 'var(--primary-accent, #0284c7)' }}
              >
                <Save className="w-4 h-4" />
                <span>{isAr ? 'حفظ بيانات الكراج' : 'Save Business Information'}</span>
              </button>
            </form>
          </div>
        )}

      </div>

      {/* FULL 5-TAB STRUCTURED LISTING EDITOR MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-700/80 overflow-hidden my-6 max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 text-white flex items-center justify-between shrink-0" style={{ backgroundColor: 'var(--header-bg, #0f172a)' }}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--secondary-accent, #f59e0b)' }}>
                  {editingItemId ? (isAr ? 'تعديل العنصر (مزامنة فورية)' : 'Edit Listing (Synced Live)') : (isAr ? 'إنشاء إدراج جديد' : 'Create New Listing (Synced Live)')}
                </span>
                <h3 className="text-lg font-black tracking-tight text-white">
                  {editingItemType === 'product' ? (isAr ? 'قطعة غيار وأجهزة أداء' : 'Auto Part / Hardware Upgrade') : editingItemType === 'service' ? (isAr ? 'خدمة منصة كراج' : 'Garage Service Bay') : (isAr ? 'سيارة معرض معتمدة' : 'Showroom Car')}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl bg-white/10 transition-all duration-150 active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 5-Tab Navigation Bar */}
            <div className="flex items-center gap-1 p-2 bg-slate-950 border-b border-slate-800 overflow-x-auto shrink-0 no-scrollbar">
              <button
                type="button"
                onClick={() => setModalTab('overview')}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 whitespace-nowrap flex items-center gap-1.5 ${
                  modalTab === 'overview' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
                style={{ color: modalTab === 'overview' ? 'var(--primary-accent, #0284c7)' : undefined }}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>1. {isAr ? 'الوصف والنظرة العامة' : 'Overview & Description'}</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('specs')}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 whitespace-nowrap flex items-center gap-1.5 ${
                  modalTab === 'specs' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
                style={{ color: modalTab === 'specs' ? 'var(--primary-accent, #0284c7)' : undefined }}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>2. {isAr ? 'المواصفات التقنية' : 'Detailed Specs'} ({formSpecsTable.length + formSpecsList.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('fitment')}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 whitespace-nowrap flex items-center gap-1.5 ${
                  modalTab === 'fitment' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
                style={{ color: modalTab === 'fitment' ? 'var(--primary-accent, #0284c7)' : undefined }}
              >
                <Car className="w-3.5 h-3.5" />
                <span>3. {isAr ? 'التوافق مع السيارات' : 'Vehicle Compatibility'} ({formCompatibility.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('box')}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 whitespace-nowrap flex items-center gap-1.5 ${
                  modalTab === 'box' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
                style={{ color: modalTab === 'box' ? 'var(--primary-accent, #0284c7)' : undefined }}
              >
                <Package className="w-3.5 h-3.5" />
                <span>4. {isAr ? 'محتويات الصندوق والضمان' : 'In the Box & Warranty'}</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('reviews')}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 whitespace-nowrap flex items-center gap-1.5 ${
                  modalTab === 'reviews' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
                style={{ color: modalTab === 'reviews' ? 'var(--primary-accent, #0284c7)' : undefined }}
              >
                <Star className="w-3.5 h-3.5" />
                <span>5. {isAr ? 'التقييمات وسجلات الداينو' : 'Reviews & Logs'} ({formReviews.length})</span>
              </button>
            </div>

            <form onSubmit={handleSaveListing} className="p-6 space-y-5 overflow-y-auto flex-1">
              {modalTab === 'overview' && (
                <div className="space-y-5">
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                    <label className="block text-xs font-black uppercase tracking-wider text-sky-400 mb-2">
                      {isAr ? 'القسم التجاري المباشر' : 'Store Catalog Category'}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {STORE_CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleCategorySelectionChange(cat.id)}
                          className={`p-3 rounded-xl border text-left transition-all duration-150 active:scale-95 ${
                            formCategory === cat.id
                              ? 'text-white border-sky-500 shadow-md ring-2 ring-sky-500/20'
                              : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                          }`}
                          style={{ backgroundColor: formCategory === cat.id ? 'var(--primary-accent, #0284c7)' : undefined }}
                        >
                          <div className="text-xs font-bold leading-tight">{isAr ? cat.labelAr : cat.labelEn}</div>
                          <div className="text-[10px] opacity-80 truncate">{isAr ? cat.labelEn : cat.labelAr}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-300 mb-1">{isAr ? 'العنوان (English)' : 'Title (English)'}</label>
                      <input
                        type="text"
                        required
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-300 mb-1">{isAr ? 'العنوان بالعربي' : 'Title (Arabic Translation)'}</label>
                      <input
                        type="text"
                        value={formTitleAr}
                        onChange={(e) => setFormTitleAr(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-300 mb-1">{isAr ? 'السعر (KWD)' : 'Price (KWD)'}</label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.5"
                        value={formPrice}
                        onChange={(e) => setFormPrice(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-300 mb-1">{isAr ? 'نص السعر المخصص' : 'Custom Price Display'}</label>
                      <input
                        type="text"
                        value={formPriceDisplay}
                        onChange={(e) => setFormPriceDisplay(e.target.value)}
                        placeholder="35 KWD (Cash on Delivery)"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-300 mb-1">{isAr ? 'الشارة' : 'Badge'}</label>
                      <input
                        type="text"
                        value={formBadge}
                        onChange={(e) => setFormBadge(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
                      />
                    </div>
                  </div>

                  {/* Multi-Image Manager with Square Thumbnail Previews */}
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                    <label className="block text-xs font-bold uppercase text-slate-300 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-sky-400" />
                      <span>{isAr ? `معرض الصور متعدد الزوايا (${formImages.length} صور)` : `Multi-Image Gallery (${formImages.length} images)`}</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <input
                        type="url"
                        value={newImageUrlInput}
                        onChange={(e) => setNewImageUrlInput(e.target.value)}
                        placeholder="https://..."
                        className="sm:col-span-2 w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white"
                      />
                      
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="px-3 py-2 text-white font-bold text-xs rounded-xl transition-all duration-150 active:scale-95"
                        style={{ backgroundColor: 'var(--primary-accent, #0284c7)' }}
                      >
                        <Plus className="w-3.5 h-3.5 inline mr-1" />
                        <span>{isAr ? 'إضافة رابط' : 'Add URL'}</span>
                      </button>

                      <label className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 hover:bg-slate-800 rounded-xl cursor-pointer text-xs font-bold text-slate-200 border border-slate-700 transition-all duration-150 active:scale-95">
                        <Upload className="w-3.5 h-3.5 text-sky-400" />
                        <span>{isAr ? 'رفع ملفات' : 'Upload Multi'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleMultiFileUpload}
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 pt-2">
                      {formImages.map((imgUrl, index) => (
                        <div key={index} className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-900 aspect-square">
                          <img src={imgUrl} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                            {index !== 0 && (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryImage(index)}
                                className="p-1 bg-amber-400 text-slate-950 rounded-lg"
                                title="Primary"
                              >
                                <Star className="w-3 h-3 fill-current" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="p-1 bg-red-600 text-white rounded-lg"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {modalTab === 'specs' && (
                <div className="space-y-6">
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <h4 className="text-xs font-bold uppercase text-white flex items-center gap-1.5">
                      <Settings className="w-4 h-4 text-sky-400" />
                      <span>{isAr ? 'جدول المواصفات التقنية (مفتاح - قيمة)' : 'Technical Specifications Table (Key-Value)'}</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                      <input
                        type="text"
                        value={newTableKey}
                        onChange={(e) => setNewTableKey(e.target.value)}
                        placeholder={isAr ? 'اسم البند (مثال: قوة الضغط)' : 'Parameter (e.g. Boost Output)'}
                        className="sm:col-span-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white"
                      />
                      <input
                        type="text"
                        value={newTableValue}
                        onChange={(e) => setNewTableValue(e.target.value)}
                        placeholder={isAr ? 'القيمة (مثال: 1.85 Bar)' : 'Value (e.g. 1.85 Bar)'}
                        className="sm:col-span-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newTableKey.trim() && newTableValue.trim()) {
                            setFormSpecsTable(prev => [...prev, { key: newTableKey.trim(), value: newTableValue.trim() }]);
                            setNewTableKey('');
                            setNewTableValue('');
                          }
                        }}
                        className="py-2 px-3 text-white font-bold text-xs rounded-xl transition-all duration-150 active:scale-95"
                        style={{ backgroundColor: 'var(--primary-accent, #0284c7)' }}
                      >
                        <Plus className="w-3.5 h-3.5 inline mr-1" />
                        <span>{isAr ? 'إضافة' : 'Add Row'}</span>
                      </button>
                    </div>

                    <div className="divide-y divide-slate-800 bg-slate-900 rounded-xl border border-slate-800">
                      {formSpecsTable.map((entry, idx) => (
                        <div key={idx} className="p-2.5 px-3.5 flex items-center justify-between text-xs text-slate-200">
                          <span className="font-bold text-white">{entry.key}</span>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-slate-400">{entry.value}</span>
                            <button
                              type="button"
                              onClick={() => setFormSpecsTable(prev => prev.filter((_, i) => i !== idx))}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {modalTab === 'fitment' && (
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold uppercase text-white flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-sky-400" />
                    <span>{isAr ? 'قائمة السيارات المتوافقة' : 'Vehicle Fitment Compatibility'}</span>
                  </h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCompatInput}
                      onChange={(e) => setNewCompatInput(e.target.value)}
                      placeholder="e.g. Nissan Patrol Y62 5.6L V8 (2014-2024)"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newCompatInput.trim()) {
                          setFormCompatibility(prev => [...prev, newCompatInput.trim()]);
                          setNewCompatInput('');
                        }
                      }}
                      className="py-2 px-4 text-white font-bold text-xs rounded-xl transition-all duration-150 active:scale-95"
                      style={{ backgroundColor: 'var(--primary-accent, #0284c7)' }}
                    >
                      <Plus className="w-3.5 h-3.5 inline mr-1" />
                      <span>{isAr ? 'إضافة' : 'Add'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {formCompatibility.map((veh, idx) => (
                      <div key={idx} className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs font-semibold text-slate-200 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Car className="w-3.5 h-3.5 text-sky-400" />
                          <span>{veh}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setFormCompatibility(prev => prev.filter((_, i) => i !== idx))}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {modalTab === 'box' && (
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-300 mb-1">{isAr ? 'فترة الضمان' : 'Warranty'}</label>
                      <input
                        type="text"
                        value={formWarranty}
                        onChange={(e) => setFormWarranty(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-semibold text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-300 mb-1">{isAr ? 'مستوى صعوبة التركيب' : 'Installation Rating'}</label>
                      <select
                        value={formInstallDifficulty}
                        onChange={(e) => setFormInstallDifficulty(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-semibold text-white"
                      >
                        <option value="Easy (DIY) / Plug & Play">Easy (DIY) / Plug & Play</option>
                        <option value="Medium (Basic Garage)">Medium (Basic Garage)</option>
                        <option value="Expert (Master Mechanic)">Expert (Master Mechanic)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    {formInTheBox.map((item, idx) => (
                      <div key={idx} className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs font-semibold text-slate-200 flex items-center justify-between">
                        <span>✓ {item}</span>
                        <button
                          type="button"
                          onClick={() => setFormInTheBox(prev => prev.filter((_, i) => i !== idx))}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {modalTab === 'reviews' && (
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold uppercase text-white flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span>{isAr ? 'سجلات وتقييمات العملاء' : 'Reviews & Garage Logs'}</span>
                  </h4>
                  <div className="space-y-2">
                    {formReviews.map((rev, idx) => (
                      <div key={idx} className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{rev.author} • {rev.vehicle}</span>
                          <span className="text-amber-400">{'★'.repeat(rev.rating)}</span>
                        </div>
                        <p className="text-slate-300 italic">"{rev.comment}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all duration-150 active:scale-95"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all duration-150 active:scale-95"
                  style={{ backgroundColor: 'var(--primary-accent, #0284c7)' }}
                >
                  {isAr ? 'حفظ ونشر في المتجر' : 'Save & Publish to Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};