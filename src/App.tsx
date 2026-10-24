import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { ProductGrid } from './components/ProductGrid';
import { ShowroomGrid } from './components/ShowroomGrid';
import { DiagnosticTool } from './components/DiagnosticTool';
import { CartDrawer } from './components/CartDrawer';
import { LiveSalesToast } from './components/LiveSalesToast';
import { MechanicChatWidget } from './components/MechanicChatWidget';
import { Footer } from './components/Footer';
import { ImageGallery } from './components/ImageGallery';
import { AuthModal } from './components/AuthModal';
import { AccountDashboard } from './components/AccountDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminControls } from './components/AdminControls';
import { SiteProvider, useSiteContext } from './context/SiteContext';
import { SiteConfigProvider } from './context/SiteConfigContext';
import { CatalogContext } from './context/CatalogContext';
import './styles/theme-bridge.css';
import { StickerBar } from './components/StickerBar';
import { 
  Product, 
  CartItem, 
  GarageService, 
  Vehicle, 
  Language, 
  DetailItem, 
  PageView, 
  User, 
  BookingRecord, 
  OrderRecord, 
  TestDriveRecord, 
  UserVehicle 
} from './types';
import { 
  ShieldCheck, 
  ShoppingCart, 
  Calendar, 
  ChevronRight, 
  Star, 
  ArrowLeft, 
  CheckCircle2, 
  Car, 
  Package, 
  Wrench, 
  X, 
  Settings, 
  Lock, 
  Award,
  AlertCircle
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { fetchOrders, updateOrderCloud, deleteOrderCloud } from './lib/ordersApi';
import { fetchLeads, syncLeads } from './lib/leadsApi';
import { supabase } from './lib/supabase';

const FAMOUS_BRANDS = [
  { name: 'Toyota', emblem: '🏎️ TOYOTA', origin: 'Official GCC & Land Cruiser Tuning' },
  { name: 'Chevrolet', emblem: '⚡ CHEVROLET', origin: 'Corvette & Silverado V8 Specialist' },
  { name: 'GMC', emblem: '🛠️ GMC', origin: 'Sierra & Yukon HD Calibration' },
  { name: 'Porsche', emblem: '🏁 PORSCHE', origin: 'GT3 & Turbo S Bespoke Remap' },
  { name: 'BMW', emblem: '⚙️ BMW M-POWER', origin: 'S58 / B58 Platform Dyno Hub' },
  { name: 'Mercedes-Benz', emblem: '🏆 MERCEDES-AMG', origin: 'Biturbo V8 & E-Performance' },
  { name: 'Nissan', emblem: '🏎️ NISSAN GT-R', origin: 'VR38DETT & Patrol VVEL Dig' },
  { name: 'Ford', emblem: '🐎 FORD PERFORMANCE', origin: 'Shelby GT500 & F-150 Raptor' },
  { name: 'Dodge', emblem: '🔥 DODGE SRT', origin: 'Hellcat & Hemi Supercharged' }
];

function MainApp() {
  const { config } = useSiteContext();
  const [language, setLanguage] = useState<Language>('en');
  
  const [activePage, setActivePage] = useState<PageView | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || path.startsWith('/admin') || hash === '#admin') {
        return 'admin';
      }
    }
    return 'home';
  });

  const [selectedDetail, setSelectedDetail] = useState<DetailItem | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'fitment' | 'box' | 'reviews'>('overview');

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || hash === '#admin') {
        setActivePage('admin');
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  useEffect(() => {
    const brandTitle = config.siteName || 'ApexTorque Performance';
    const tag = config.motto || 'Kuwait Premier Dyno & Tuning Hub';
    document.title = `${brandTitle} — ${tag}`;

    if (config.faviconUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = config.faviconUrl;
    }
  }, [config.siteName, config.motto, config.faviconUrl]);

  const [currentUser, setCurrentUser] = useState<(User & { isAdmin?: boolean }) | null>(() => {
    try {
      const saved = localStorage.getItem('apextorque_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [userBookings, setUserBookings] = useState<BookingRecord[]>(() => {
    try {
      const saved = localStorage.getItem('apextorque_bookings');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [userOrders, setUserOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem('apextorque_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [userTestDrives, setUserTestDrives] = useState<TestDriveRecord[]>(() => {
    try {
      const saved = localStorage.getItem('apextorque_testdrives');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleStorageUpdate = () => {
      try {
        const ords = localStorage.getItem('apextorque_orders');
        if (ords) setUserOrders(JSON.parse(ords));
        const bk = localStorage.getItem('apextorque_bookings');
        if (bk) setUserBookings(JSON.parse(bk));
        const td = localStorage.getItem('apextorque_testdrives');
        if (td) setUserTestDrives(JSON.parse(td));
      } catch (err) {
        console.error(err);
      }
    };
    window.addEventListener('storage', handleStorageUpdate);
    window.addEventListener('apextorque_orders_updated', handleStorageUpdate);
    window.addEventListener('apextorque_bookings_updated', handleStorageUpdate);
    window.addEventListener('apextorque_testdrives_updated', handleStorageUpdate);
    return () => {
      window.removeEventListener('storage', handleStorageUpdate);
      window.removeEventListener('apextorque_orders_updated', handleStorageUpdate);
      window.removeEventListener('apextorque_bookings_updated', handleStorageUpdate);
      window.removeEventListener('apextorque_testdrives_updated', handleStorageUpdate);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('apextorque_bookings', JSON.stringify(userBookings));
    } catch (e) {
      console.error(e);
    }
  }, [userBookings]);

  useEffect(() => {
    try {
      localStorage.setItem('apextorque_orders', JSON.stringify(userOrders));
    } catch (e) {
      console.error(e);
    }
  }, [userOrders]);

  useEffect(() => {
    try {
      localStorage.setItem('apextorque_testdrives', JSON.stringify(userTestDrives));
    } catch (e) {
      console.error(e);
    }
  }, [userTestDrives]);

  // Pull orders placed on other devices. RLS returns rows only for an admin.
  useEffect(() => {
    let cancelled = false;
    void fetchOrders().then((remote) => {
      if (cancelled || remote.length === 0) return;
      const incoming = remote as unknown as OrderRecord[];
      setUserOrders((prev) => {
        const seen = new Set(prev.map((o) => String(o.id)));
        const extra = incoming.filter((o) => !seen.has(String(o.id)));
        return extra.length ? [...extra, ...prev] : prev;
      });
    });
    return () => { cancelled = true; };
  }, []);

  // ---- bookings + test drives: push to the cloud (debounced, like the site config) ----
  useEffect(() => {
    if (userBookings.length === 0) return;
    const t = setTimeout(() => { void syncLeads('booking', userBookings); }, 800);
    return () => clearTimeout(t);
  }, [userBookings]);

  useEffect(() => {
    if (userTestDrives.length === 0) return;
    const t = setTimeout(() => { void syncLeads('testdrive', userTestDrives); }, 800);
    return () => clearTimeout(t);
  }, [userTestDrives]);

  // ---- pull cloud records, and again whenever an admin signs in (no hard-refresh needed) ----
  useEffect(() => {
    let cancelled = false;
    const merge = <T,>(prev: T[], incoming: T[], idOf: (x: T) => string): T[] => {
      const seen = new Set(prev.map(idOf));
      const extra = incoming.filter((x) => !seen.has(idOf(x)));
      return extra.length ? [...extra, ...prev] : prev;
    };
    const pull = () => {
      void fetchOrders().then((r) => {
        if (cancelled || r.length === 0) return;
        const incoming = r as unknown as OrderRecord[];
        setUserOrders((prev) => merge(prev, incoming, (o) => String(o.id)));
      });
      void fetchLeads('booking').then((r) => {
        if (cancelled || r.length === 0) return;
        const incoming = r as unknown as BookingRecord[];
        setUserBookings((prev) => merge(prev, incoming, (b) => String(b.id)));
      });
      void fetchLeads('testdrive').then((r) => {
        if (cancelled || r.length === 0) return;
        const incoming = r as unknown as TestDriveRecord[];
        setUserTestDrives((prev) => merge(prev, incoming, (d) => String(d.id)));
      });
    };
    pull();
    const sub: any = (supabase.auth as any).onAuthStateChange((_e: any, session: any) => { if (session) pull(); });
    return () => {
      cancelled = true;
      const s = sub && sub.data && sub.data.subscription;
      if (s && typeof s.unsubscribe === "function") s.unsubscribe();
    };
  }, []);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [activeServiceForBooking, setActiveServiceForBooking] = useState<GarageService | null>(null);
  const [bookingVehicle, setBookingVehicle] = useState('');
  const [bookingDate, setBookingDate] = useState('2025-05-25');
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [bookingPhone, setBookingPhone] = useState(currentUser?.phone || '+965 ');
  const [bookingName, setBookingName] = useState(currentUser?.name || '');
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [activeCarForDrive, setActiveCarForDrive] = useState<Vehicle | null>(null);
  const [testDriveSuccess, setTestDriveSuccess] = useState(false);
  const [driveName, setDriveName] = useState(currentUser?.name || '');
  const [drivePhone, setDrivePhone] = useState(currentUser?.phone || '+965 ');
  const [driveError, setDriveError] = useState('');

  const isAr = language === 'ar';
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const handleNavigatePage = (page: PageView | 'admin', detailItem?: DetailItem) => {
    setActivePage(page);
    if (page === 'admin') {
      window.history.pushState({}, '', '/admin');
    }
    if (detailItem) {
      setSelectedDetail(detailItem);
      setActiveTab('overview');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleAddNewVehicle = (veh: UserVehicle) => {
    if (!currentUser) return;
    const updatedUser: User & { isAdmin?: boolean } = {
      ...currentUser,
      savedVehicles: [...(currentUser.savedVehicles || []), veh]
    };
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('apextorque_user', JSON.stringify(updatedUser));
      const usersListRaw = localStorage.getItem('apextorque_users');
      if (usersListRaw) {
        const usersList: any[] = JSON.parse(usersListRaw);
        const updatedList = usersList.map(u => u.id === currentUser.id ? updatedUser : u);
        localStorage.setItem('apextorque_users', JSON.stringify(updatedList));
      }
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Failed to update saved vehicles in localStorage:', e);
    }
  };

  const handleLoginSuccess = (user: User & { isAdmin?: boolean }) => {
    setCurrentUser(user);
    setBookingName(user.name);
    setBookingPhone(user.phone);
    setDriveName(user.name);
    setDrivePhone(user.phone);
    try {
      localStorage.setItem('apextorque_user', JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save user to localStorage:', e);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('apextorque_user');
    } catch (e) {
      console.error('Failed to remove user from localStorage:', e);
    }
    setCurrentUser(null);
    setActivePage('home');
  };

  const handleUpdateOrder = (id: string, updated: Partial<OrderRecord>) => {
    void updateOrderCloud(id, updated);
    const updatedList = userOrders.map(o => o.id === id ? { ...o, ...updated } : o);
    setUserOrders(updatedList);
    try {
      localStorage.setItem('apextorque_orders', JSON.stringify(updatedList));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteOrder = (id: string) => {
    void deleteOrderCloud(id);
    const updatedList = userOrders.filter(o => o.id !== id);
    setUserOrders(updatedList);
    try {
      localStorage.setItem('apextorque_orders', JSON.stringify(updatedList));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateBooking = (id: string, updated: Partial<BookingRecord>) => {
    const updatedList = userBookings.map(b => b.id === id ? { ...b, ...updated } : b);
    setUserBookings(updatedList);
    try {
      localStorage.setItem('apextorque_bookings', JSON.stringify(updatedList));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBooking = (id: string) => {
    const updatedList = userBookings.filter(b => b.id !== id);
    setUserBookings(updatedList);
    try {
      localStorage.setItem('apextorque_bookings', JSON.stringify(updatedList));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTestDrive = (id: string, updated: Partial<TestDriveRecord>) => {
    const updatedList = userTestDrives.map(t => t.id === id ? { ...t, ...updated } : t);
    setUserTestDrives(updatedList);
    try {
      localStorage.setItem('apextorque_testdrives', JSON.stringify(updatedList));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTestDrive = (id: string) => {
    const updatedList = userTestDrives.filter(t => t.id !== id);
    setUserTestDrives(updatedList);
    try {
      localStorage.setItem('apextorque_testdrives', JSON.stringify(updatedList));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error(err);
    }
  };

  const triggerBayBookingModal = (service?: GarageService) => {
    setActiveServiceForBooking(service || config.services[0] || null);
    setIsBookingModalOpen(true);
    setBookingSuccess(false);
    setBookingError('');
    if (currentUser) {
      setBookingName(currentUser.name);
      setBookingPhone(currentUser.phone);
    }
  };

  const isValidKuwaitPhone = (val: string): boolean => {
    const digitsOnly = val.replace(/[^0-9]/g, '');
    let localDigits = digitsOnly;
    if (digitsOnly.startsWith('965')) {
      localDigits = digitsOnly.substring(3);
    }
    return localDigits.length === 8 && /^[24569]/.test(localDigits);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidKuwaitPhone(bookingPhone)) {
      setBookingError(
        isAr 
          ? 'يرجى إدخال رقم كويتي صحيح (8 أرقام يبدأ بـ 2، 4، 5، 6، 9)'
          : 'Please enter a valid 8-digit Kuwait phone number starting with 2, 4, 5, 6, or 9.'
      );
      return;
    }
    setBookingError('');

    const serviceTitle = isAr && activeServiceForBooking?.titleAr ? activeServiceForBooking.titleAr : (activeServiceForBooking?.title || 'Workshop Diagnostic Bay');
    const newBooking: BookingRecord = {
      id: `BK-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceId: activeServiceForBooking?.id || 'srv-default',
      serviceTitle,
      vehicleInfo: bookingVehicle || (currentUser?.savedVehicles?.[0]?.make ? `${currentUser.savedVehicles[0].year} ${currentUser.savedVehicles[0].make} ${currentUser.savedVehicles[0].model}` : 'Kuwait Client Vehicle'),
      customerName: bookingName.trim() || currentUser?.name || 'Workshop Client',
      customerPhone: bookingPhone.trim(),
      customerEmail: currentUser?.email || '',
      date: bookingDate,
      timeSlot: bookingTime,
      status: 'Confirmed',
      laborFee: activeServiceForBooking?.price ? Math.round(activeServiceForBooking.price * 0.7) : 25,
      partsFee: activeServiceForBooking?.price ? Math.round(activeServiceForBooking.price * 0.3) : 10,
      totalAmount: activeServiceForBooking?.price || 35,
      paymentStatus: 'Pending in Garage',
      createdAt: new Date().toISOString()
    };

    const updatedBookings = [newBooking, ...userBookings];
    setUserBookings(updatedBookings);
    try {
      localStorage.setItem('apextorque_bookings', JSON.stringify(updatedBookings));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('apextorque_bookings_updated'));
    } catch (err) {
      console.error(err);
    }

    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setIsBookingModalOpen(false);
    }, 1800);
  };

  const handleTestDriveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCarForDrive) return;

    if (!isValidKuwaitPhone(drivePhone)) {
      setDriveError(
        isAr 
          ? 'يرجى إدخال رقم هاتف كويتي صحيح (8 أرقام يبدأ بـ 2، 4، 5، 6، 9)'
          : 'Please enter a valid 8-digit Kuwait phone number starting with 2, 4, 5, 6, or 9.'
      );
      return;
    }
    setDriveError('');

    const newTD: TestDriveRecord = {
      id: `TD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      vehicleId: activeCarForDrive.id,
      vehicleName: isAr && activeCarForDrive.nameAr ? activeCarForDrive.nameAr : activeCarForDrive.name,
      customerName: driveName.trim() || currentUser?.name || 'Showroom VIP Client',
      customerPhone: drivePhone.trim(),
      location: activeCarForDrive.location,
      date: new Date().toISOString().split('T')[0],
      status: 'Confirmed VIP Slot',
      advisorName: 'Tariq Al-Ghanim',
      advisorPhone: config.phone || '+965 2200 2739'
    };

    const updatedTestDrives = [newTD, ...userTestDrives];
    setUserTestDrives(updatedTestDrives);
    try {
      localStorage.setItem('apextorque_testdrives', JSON.stringify(updatedTestDrives));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('apextorque_testdrives_updated'));
    } catch (err) {
      console.error(err);
    }

    setTestDriveSuccess(true);
    setTimeout(() => {
      setTestDriveSuccess(false);
      setActiveCarForDrive(null);
    }, 1800);
  };

  const allSearchableItems = [
    ...config.products.map(p => ({
      id: p.id,
      title: isAr && p.nameAr ? p.nameAr : p.name,
      category: p.category,
      price: p.price,
      priceDisplay: p.priceDisplay,
      image: p.image,
      itemType: 'product' as const,
      raw: p
    })),
    ...config.services.map(s => ({
      id: s.id,
      title: isAr && s.titleAr ? s.titleAr : s.title,
      category: 'Diagnosing & Repairing' as const,
      price: s.price,
      priceDisplay: s.priceDisplay,
      image: s.image,
      itemType: 'service' as const,
      raw: s
    })),
    ...config.vehicles.map(v => ({
      id: v.id,
      title: isAr && v.nameAr ? v.nameAr : v.name,
      category: 'Vehicles for Sale' as const,
      price: v.price,
      image: v.image,
      itemType: 'vehicle' as const,
      raw: v
    }))
  ];

  const customerOrders = currentUser
    ? userOrders.filter(o => 
        (o.userId && o.userId === currentUser.id) || 
        (o.customerEmail && o.customerEmail === currentUser.email) ||
        (o.customerPhone && o.customerPhone === currentUser.phone)
      )
    : [];

  const customerBookings = currentUser
    ? userBookings.filter(b => 
        (b.customerEmail && b.customerEmail === currentUser.email) || 
        (b.customerPhone && b.customerPhone === currentUser.phone)
      )
    : [];

  const customerTestDrives = currentUser
    ? userTestDrives.filter(t => 
        (t.customerPhone && t.customerPhone === currentUser.phone)
      )
    : [];

  const getDetailGallery = (data: any): string[] => {
    if (data.images && Array.isArray(data.images) && data.images.length > 0) {
      return data.images;
    }
    if (data.gallery && Array.isArray(data.gallery) && data.gallery.length > 0) {
      return data.gallery;
    }
    if (data.image) {
      return [data.image];
    }
    return ['https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800'];
  };

  return (
    <div 
      id="app-root"
      dir={isAr ? 'rtl' : 'ltr'} 
      className="min-h-screen font-sans flex flex-col justify-between relative selection:bg-sky-500 selection:text-white"
      style={{
        backgroundColor: 'var(--page-bg, #0f172a)',
        fontFamily: config.customFontFamily || undefined,
        fontSize: 'var(--font-scale, 100%)',
        '--header-bg': config.headerBg || '#0f172a',
        '--footer-bg': config.footerBg || '#0b0f19',
        '--card-bg': config.cardBg || '#1e293b',
        '--page-bg': config.pageBg || '#0f172a',
        '--main-bg': config.pageBg || '#0f172a',
        '--primary-accent': config.themeColor || '#0284c7',
        '--secondary-accent': config.secondaryAccent || '#f59e0b',
      } as React.CSSProperties}
    >
      {/* Subtle Carbon Fiber Pattern Overlay */}
      {config.enableCarbonPattern && (
        <div 
          className="fixed inset-0 pointer-events-none z-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px), radial-gradient(#38bdf8 1px, #0f172a 1px)`,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px'
          }}
        />
      )}

      {/* Dynamic Video Background */}
      {config.bgType === 'video' && config.bgMediaUrl && (
        <div 
          className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
          style={{ opacity: config.bgOverlayOpacity ?? 0.15 }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            src={config.bgMediaUrl}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Dynamic Image Background */}
      {config.bgType === 'image' && config.bgMediaUrl && (
        <div 
          className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-fixed"
          style={{ 
            backgroundImage: `url(${config.bgMediaUrl})`,
            opacity: config.bgOverlayOpacity ?? 0.15 
          }}
        />
      )}

      <div className="relative z-10 flex-1 flex flex-col">
        {currentUser?.isAdmin && activePage !== 'admin' && (
          <div className="bg-slate-900 text-white py-1.5 px-4 text-xs font-bold flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{isAr ? 'وضع مسؤول الورشة مفعل 🛠️' : 'Workshop Administrator Mode Active 🛠️'}</span>
            </div>
            <button
              onClick={() => handleNavigatePage('admin')}
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px] font-mono transition-all duration-150 active:scale-95"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{isAr ? 'فتح لوحة الإدارة' : 'Open Admin Control Hub'}</span>
            </button>
          </div>
        )}

        {/* Sticky Top Header */}
        <Navbar
          language={language}
          activePage={activePage === 'admin' ? 'home' : activePage}
          currentUser={currentUser}
          onToggleLanguage={handleToggleLanguage}
          cartCount={totalCartCount}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenBooking={() => triggerBayBookingModal()}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onNavigatePage={handleNavigatePage}
          onLogout={handleLogout}
          allSearchableItems={allSearchableItems}
        />

        {/* Brand Carousel */}
        {activePage === 'home' && (
          <div className="pt-28 pb-4 bg-slate-900 text-white border-b border-slate-800 overflow-hidden shadow-inner">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-2 flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'كراج معتمد لأشهر منصات السيارات بالكويت' : 'OFFICIAL GCC PLATFORMS & CERTIFIED TUNING SUITE'}</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                DYNO-PROVEN & FACTORY OBD2 OEM PROTOCOLS
              </span>
            </div>

            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2 px-4 sm:px-6">
              {FAMOUS_BRANDS.map((brand, i) => (
                <div 
                  key={i}
                  className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-sky-500 rounded-2xl p-3 px-4 shrink-0 flex items-center gap-3 transition-all duration-150 active:scale-95 cursor-pointer shadow-md"
                >
                  <div className="text-sm font-black text-white whitespace-nowrap">
                    {brand.emblem}
                  </div>
                  <div className="hidden md:block text-[10px] text-slate-400 border-l border-slate-700 pl-3">
                    {brand.origin}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Breadcrumb Navigation */}
        {activePage !== 'home' && (
          <div className="pt-32 pb-4 border-b border-slate-700/60 shadow-sm" style={{ backgroundColor: 'var(--card-bg, #1e293b)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider overflow-x-auto no-scrollbar whitespace-nowrap">
                <button 
                  onClick={() => handleNavigatePage('home')} 
                  className="hover:text-sky-500 transition-colors duration-150"
                >
                  {isAr ? '🏠 الرئيسية' : '🏠 Home'}
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="font-bold truncate" style={{ color: 'var(--primary-accent, #0284c7)' }}>
                  {activePage === 'diagnostics' && (isAr ? '🛠️ الصيانة وتصليح الأعطال' : '🛠️ Diagnosing & Repairing')}
                  {activePage === 'performance' && (isAr ? '⚡ البرمجة وتعديل الأداء' : '⚡ Performance Upgrades')}
                  {activePage === 'parts' && (isAr ? '🔩 قطع الغيار والأجهزة' : '🔩 Auto Parts & Hardware Tools')}
                  {activePage === 'showroom' && (isAr ? '🏎️ معرض السيارات للبيع' : '🏎️ Vehicles For Sale')}
                  {activePage === 'product-detail' && (isAr ? '🔍 تفاصيل المنتج' : '🔍 Item Details')}
                  {activePage === 'account' && (isAr ? '👤 حسابي وحجوزاتي' : '👤 My Bookings & Profile')}
                  {activePage === 'admin' && (isAr ? '⚙️ لوحة إدارة الورشة' : '⚙️ Workshop Admin Suite')}
                </span>
              </div>

              <button
                onClick={() => handleNavigatePage('home')}
                className="text-xs font-bold text-slate-400 hover:text-sky-400 flex items-center gap-1 transition-all duration-150 active:scale-95 shrink-0 ml-2"
              >
                <ArrowLeft className={`w-3.5 h-3.5 ${isAr ? 'rotate-180' : ''}`} />
                <span className="hidden sm:inline">{isAr ? 'العودة للرئيسية' : 'Back to Home'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Page Views */}
        <main className="flex-1">
          {activePage === 'admin' && (
            <AdminDashboard
              language={language}
              isAdmin={currentUser?.isAdmin}
              onNavigateHome={() => handleNavigatePage('home')}
              orders={userOrders}
              onUpdateOrder={handleUpdateOrder}
              onDeleteOrder={handleDeleteOrder}
              bookings={userBookings}
              onUpdateBooking={handleUpdateBooking}
              onDeleteBooking={handleDeleteBooking}
              testDrives={userTestDrives}
              onUpdateTestDrive={handleUpdateTestDrive}
              onDeleteTestDrive={handleDeleteTestDrive}
            />
          )}

          {activePage === 'home' && (
            <>
              <StickerBar />

              <Hero
                language={language}
                onOpenBooking={() => triggerBayBookingModal()}
                onNavigatePage={handleNavigatePage}
              />

              <ServicesSection
                language={language}
                isBookingModalOpen={false}
                onOpenBookingModal={(srv) => triggerBayBookingModal(srv)}
                onCloseBookingModal={() => setIsBookingModalOpen(false)}
                onSelectDetail={(item) => handleNavigatePage('product-detail', item)}
              />

              <ProductGrid
                language={language}
                onAddToCart={handleAddToCart}
                onSelectDetail={(item) => handleNavigatePage('product-detail', item)}
              />

              <ShowroomGrid
                language={language}
                onSelectDetail={(item) => handleNavigatePage('product-detail', item)}
              />

              {config.showObdScanner !== false && (
                <DiagnosticTool
                  language={language}
                  onAddToCart={handleAddToCart}
                  onOpenBooking={() => triggerBayBookingModal()}
                />
              )}
            </>
          )}

          {activePage === 'diagnostics' && (
            <div>
              <ServicesSection
                language={language}
                isStandalonePage={true}
                isBookingModalOpen={false}
                onOpenBookingModal={(srv) => triggerBayBookingModal(srv)}
                onCloseBookingModal={() => setIsBookingModalOpen(false)}
                onSelectDetail={(item) => handleNavigatePage('product-detail', item)}
              />
              <DiagnosticTool
                language={language}
                onAddToCart={handleAddToCart}
                onOpenBooking={() => triggerBayBookingModal()}
              />
            </div>
          )}

          {activePage === 'performance' && (
            <ProductGrid
              language={language}
              filterCategory="Performance Upgrades"
              onAddToCart={handleAddToCart}
              onSelectDetail={(item) => handleNavigatePage('product-detail', item)}
            />
          )}

          {activePage === 'parts' && (
            <ProductGrid
              language={language}
              filterCategory="Auto Parts & Hardware"
              onAddToCart={handleAddToCart}
              onSelectDetail={(item) => handleNavigatePage('product-detail', item)}
            />
          )}

          {activePage === 'showroom' && (
            <ShowroomGrid
              language={language}
              onSelectDetail={(item) => handleNavigatePage('product-detail', item)}
            />
          )}

          {activePage === 'account' && (
            currentUser ? (
              <AccountDashboard
                user={currentUser}
                bookings={customerBookings}
                orders={customerOrders}
                testDrives={customerTestDrives}
                language={language}
                onLogout={handleLogout}
                onAddVehicle={handleAddNewVehicle}
                onBookService={() => triggerBayBookingModal()}
              />
            ) : (
              <div className="py-20 text-center" style={{ backgroundColor: 'var(--card-bg, #1e293b)' }}>
                <h2 className="text-xl font-bold mb-2 text-slate-100">{isAr ? 'يرجى تسجيل الدخول لعرض حسابك' : 'Please sign in to view your account'}</h2>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-6 py-2.5 text-white font-bold text-xs rounded-xl transition-all duration-150 active:scale-95"
                  style={{ backgroundColor: 'var(--primary-accent, #0284c7)' }}
                >
                  {isAr ? 'تسجيل الدخول' : 'Sign In'}
                </button>
              </div>
            )
          )}

          {/* Dedicated Item Detail View */}
          {activePage === 'product-detail' && selectedDetail && (
            <div className="py-12" style={{ backgroundColor: 'var(--page-bg, #0f172a)' }}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
                  
                  <div className="lg:col-span-7">
                    <ImageGallery 
                      itemId={'id' in selectedDetail.data ? selectedDetail.data.id : selectedDetail.type}
                      images={getDetailGallery(selectedDetail.data)}
                      altTitle={'name' in selectedDetail.data ? selectedDetail.data.name : selectedDetail.data.title}
                      badge={
                        selectedDetail.type === 'product' ? `${selectedDetail.data.category} • ${isAr ? 'الدفع نقداً عند الاستلام' : 'Cash on Delivery'}` :
                        selectedDetail.type === 'vehicle' ? `${selectedDetail.data.badge} • ${isAr ? 'الدفع عند الحضور' : 'Cash on Arrival'}` : `${isAr ? 'خدمة معتمدة • الدفع عند الحضور' : 'CERTIFIED SERVICE • Cash on Arrival'}`
                      }
                    />
                  </div>

                  <div className="lg:col-span-5 space-y-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-950/80 px-3 py-1 rounded-full border border-sky-800">
                          {selectedDetail.type === 'product' && `${selectedDetail.data.category} — ${isAr ? 'الدفع نقداً عند الاستلام' : 'Cash on Delivery'}`}
                          {selectedDetail.type === 'service' && (isAr ? 'خدمة كراج معتمدة — الدفع عند الحضور' : 'Certified Garage Service — Cash on Arrival')}
                          {selectedDetail.type === 'vehicle' && (isAr ? 'سيارة معتمدة — الدفع عند الحضور' : 'Verified Showroom Car — Cash on Arrival')}
                        </span>
                        {selectedDetail.type === 'product' && (
                          <span className="text-xs font-mono text-slate-400 font-bold">
                            {selectedDetail.data.partNumber}
                          </span>
                        )}
                      </div>

                      <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                        {isAr && 'nameAr' in selectedDetail.data && selectedDetail.data.nameAr
                          ? selectedDetail.data.nameAr
                          : isAr && 'titleAr' in selectedDetail.data && selectedDetail.data.titleAr
                          ? selectedDetail.data.titleAr
                          : 'name' in selectedDetail.data 
                          ? selectedDetail.data.name 
                          : selectedDetail.data.title}
                      </h1>

                      <div className="mt-4 flex flex-wrap items-baseline gap-4">
                        <div className="text-3xl sm:text-4xl font-black text-sky-400" style={{ color: 'var(--primary-accent, #0284c7)' }}>
                          {('priceDisplay' in selectedDetail.data && selectedDetail.data.priceDisplay) 
                            ? selectedDetail.data.priceDisplay 
                            : `${selectedDetail.data.price.toLocaleString()} KWD`}
                        </div>

                        <div className="text-xs text-slate-400 font-semibold">
                          {isAr ? 'شامل الفحص والضمان • الدفع نقداً عند الاستلام / الحضور' : 'Tax & Inspection Included • Cash on Delivery / Cash on Arrival'}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl p-5 border border-slate-700/80 space-y-3" style={{ backgroundColor: 'var(--card-bg, #1e293b)' }}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-300 gap-2">
                        <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{selectedDetail.data.warranty || (isAr ? 'ضمان رسمي من الكراج لمدة سنة' : '1 Year Official Garage Warranty')}</span>
                        </span>
                        <span className="text-slate-400">
                          📍 {isAr ? 'الشويخ الصناعية 1 • الدفع عند الحضور' : 'Shuwaikh Industrial • Cash on Arrival'}
                        </span>
                      </div>

                      {selectedDetail.type === 'vehicle' && (
                        <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-700/80 text-slate-300">
                          <div>📅 {selectedDetail.data.year} Model</div>
                          <div>⏱️ {selectedDetail.data.mileage}</div>
                          <div>⚙️ {selectedDetail.data.engine}</div>
                          <div>🏎️ {selectedDetail.data.power}</div>
                        </div>
                      )}

                      {selectedDetail.type === 'product' && (
                        <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-700/80 text-slate-300">
                          <div>📦 {selectedDetail.data.stock} {isAr ? 'قطع متوفرة' : 'Units In Stock'}</div>
                          <div>🔧 {selectedDetail.data.installDifficulty || (isAr ? 'تركيب مباشر Bolt-On' : 'Standard Bolt-On Fitment')}</div>
                        </div>
                      )}

                      {selectedDetail.type === 'service' && (
                        <div className="text-xs pt-2 border-t border-slate-700/80 text-slate-300">
                          ⏱️ {isAr ? 'المدة التقديرية بالمنصة:' : 'Estimated Bay Duration:'} <span className="font-bold text-white">{selectedDetail.data.duration}</span>
                        </div>
                      )}
                    </div>

                    {/* Action CTAs */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                      {selectedDetail.type === 'service' && (
                        <button
                          type="button"
                          onClick={() => triggerBayBookingModal(selectedDetail.data as GarageService)}
                          className="w-full py-4 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all duration-150 active:scale-95 flex items-center justify-center gap-2"
                          style={{ backgroundColor: 'var(--primary-accent, #0284c7)' }}
                        >
                          <Calendar className="w-4 h-4 text-amber-300" />
                          <span>{isAr ? 'حجز موعد في الكراج (الدفع عند الحضور)' : 'Schedule Service Bay Appointment (Cash on Arrival)'}</span>
                        </button>
                      )}

                      {selectedDetail.type === 'product' && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              handleAddToCart(selectedDetail.data as Product);
                              setIsCartOpen(true);
                            }}
                            className="w-full sm:flex-1 py-4 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all duration-150 active:scale-95 flex items-center justify-center gap-2"
                            style={{ backgroundColor: 'var(--primary-accent, #0284c7)' }}
                          >
                            <ShoppingCart className="w-4 h-4 text-amber-300" />
                            <span>{isAr ? 'أضف للسلة (الدفع عند الاستلام)' : 'Add to Cart / Buy Now (Cash on Delivery)'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => triggerBayBookingModal(config.services[0])}
                            className="w-full sm:w-auto py-4 px-5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all duration-150 active:scale-95 flex items-center justify-center gap-2 border border-slate-700"
                          >
                            <Wrench className="w-4 h-4 text-sky-400" />
                            <span>{isAr ? 'طلب تركيب بالكراج' : 'Book Install Bay'}</span>
                          </button>
                        </>
                      )}

                      {selectedDetail.type === 'vehicle' && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveCarForDrive(selectedDetail.data as Vehicle);
                            setDriveError('');
                            if (currentUser) {
                              setDriveName(currentUser.name);
                              setDrivePhone(currentUser.phone);
                            }
                          }}
                          className="w-full py-4 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all duration-150 active:scale-95 flex items-center justify-center gap-2"
                          style={{ backgroundColor: 'var(--primary-accent, #0284c7)' }}
                        >
                          <Car className="w-4 h-4 text-amber-300" />
                          <span>{isAr ? 'حجز موعد تجربة القيادة VIP (الدفع عند الحضور)' : 'Book VIP Test Drive (Cash on Arrival)'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>

                {/* 5-Tab Deep Product & Vehicle Specifications Hub */}
                <div className="border-t border-slate-700/80 pt-10">
                  <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-slate-700/80 no-scrollbar">
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-150 active:scale-95 ${
                        activeTab === 'overview' ? 'text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                      style={{ backgroundColor: activeTab === 'overview' ? 'var(--primary-accent, #0284c7)' : undefined }}
                    >
                      📝 {isAr ? 'نظرة عامة والوصف' : '1. Overview & Description'}
                    </button>

                    <button
                      onClick={() => setActiveTab('specs')}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-150 active:scale-95 ${
                        activeTab === 'specs' ? 'text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                      style={{ backgroundColor: activeTab === 'specs' ? 'var(--primary-accent, #0284c7)' : undefined }}
                    >
                      ⚙️ {isAr ? 'المواصفات التقنية الكاملة' : '2. Detailed Specifications'}
                    </button>

                    <button
                      onClick={() => setActiveTab('fitment')}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-150 active:scale-95 ${
                        activeTab === 'fitment' ? 'text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                      style={{ backgroundColor: activeTab === 'fitment' ? 'var(--primary-accent, #0284c7)' : undefined }}
                    >
                      🚗 {isAr ? 'التوافق والسيارات المطابقة' : '3. Vehicle Compatibility'}
                    </button>

                    <button
                      onClick={() => setActiveTab('box')}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-150 active:scale-95 ${
                        activeTab === 'box' ? 'text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                      style={{ backgroundColor: activeTab === 'box' ? 'var(--primary-accent, #0284c7)' : undefined }}
                    >
                      📦 {isAr ? 'محتويات الصندوق والضمان' : '4. In the Box & Warranty'}
                    </button>

                    <button
                      onClick={() => setActiveTab('reviews')}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-150 active:scale-95 ${
                        activeTab === 'reviews' ? 'text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                      style={{ backgroundColor: activeTab === 'reviews' ? 'var(--primary-accent, #0284c7)' : undefined }}
                    >
                      ⭐ {isAr ? 'تقييمات وتجارب العملاء' : '5. Reviews & Garage Logs'}
                    </button>
                  </div>

                  <div className="py-8">
                    {activeTab === 'overview' && (
                      <div className="space-y-6 max-w-4xl">
                        <div className="p-6 sm:p-8 rounded-3xl border border-slate-700/80" style={{ backgroundColor: 'var(--card-bg, #1e293b)' }}>
                          <h3 className="text-base font-bold uppercase text-white mb-3">
                            {isAr ? 'الوصف الهندسي والمميزات' : 'Engineering Narrative & Highlights'}
                          </h3>
                          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                            {'longDescription' in selectedDetail.data && selectedDetail.data.longDescription
                              ? selectedDetail.data.longDescription
                              : selectedDetail.data.description}
                          </p>
                        </div>
                      </div>
                    )}

                    {activeTab === 'specs' && (
                      <div className="max-w-4xl">
                        <div className="rounded-2xl border border-slate-700/80 overflow-hidden shadow-sm" style={{ backgroundColor: 'var(--card-bg, #1e293b)' }}>
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-900 text-sky-400 uppercase font-bold border-b border-slate-700">
                              <tr>
                                <th className="p-4">{isAr ? 'المعيار / البند' : 'Parameter / Spec'}</th>
                                <th className="p-4">{isAr ? 'القيمة / التفاصيل المعتمدة' : 'Certified Value / Detail'}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                              {'specsTable' in selectedDetail.data && selectedDetail.data.specsTable ? (
                                Object.entries(selectedDetail.data.specsTable).map(([key, val], idx) => (
                                  <tr key={idx} className="hover:bg-slate-800/50">
                                    <td className="p-4 font-bold text-white w-1/3">{key}</td>
                                    <td className="p-4 text-slate-300 font-mono">{val}</td>
                                  </tr>
                                ))
                              ) : (
                                selectedDetail.data.specs.map((spec, idx) => (
                                  <tr key={idx} className="hover:bg-slate-800/50">
                                    <td className="p-4 font-bold text-white">Feature #{idx + 1}</td>
                                    <td className="p-4 text-slate-300">{spec}</td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {activeTab === 'fitment' && (
                      <div className="max-w-4xl space-y-4">
                        <div className="p-6 rounded-2xl border border-slate-700/80" style={{ backgroundColor: 'var(--card-bg, #1e293b)' }}>
                          <h3 className="text-sm font-bold uppercase text-white mb-3">
                            {isAr ? 'قائمة توافق المركبات المعتمدة' : 'Verified Vehicle Fitment Chart'}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {'compatibility' in selectedDetail.data && selectedDetail.data.compatibility ? (
                              selectedDetail.data.compatibility.map((comp, idx) => (
                                <div key={idx} className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 flex items-center gap-2.5 text-xs font-semibold text-slate-200">
                                  <Car className="w-4 h-4 text-sky-400 shrink-0" />
                                  <span>{comp}</span>
                                </div>
                              ))
                            ) : (
                              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-xs text-slate-300">
                                {isAr ? 'توافق شامل مع جميع سيارات مواصفات الخليج بمنفذ OBD2.' : 'Universal fitment verified across all GCC-spec OBD2 platforms.'}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'box' && (
                      <div className="max-w-4xl space-y-6">
                        <div className="p-6 sm:p-8 rounded-3xl border border-slate-700/80" style={{ backgroundColor: 'var(--card-bg, #1e293b)' }}>
                          <h3 className="text-sm font-bold uppercase text-white mb-4 flex items-center gap-2">
                            <Package className="w-4 h-4 text-sky-400" />
                            <span>{isAr ? 'محتويات الصندوق والقطع المرفقة' : 'What’s Included in the Box'}</span>
                          </h3>

                          <div className="space-y-2.5">
                            {'inTheBox' in selectedDetail.data && selectedDetail.data.inTheBox ? (
                              selectedDetail.data.inTheBox.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-900/90 rounded-xl text-xs text-slate-200 border border-slate-800">
                                  <span className="w-6 h-6 rounded-lg bg-sky-950 text-sky-400 font-bold flex items-center justify-center shrink-0 border border-sky-800">
                                    {idx + 1}
                                  </span>
                                  <span>{item}</span>
                                </div>
                              ))
                            ) : (
                              <div className="p-3 bg-slate-900/90 rounded-xl text-xs text-slate-300">
                                {isAr ? 'طقم عتاد كامل مع الكفالة ودليل التركيب المعتمد.' : 'Complete hardware kit with all factory gaskets, bolts, and instructions.'}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'reviews' && (
                      <div className="max-w-4xl space-y-4">
                        {'reviews' in selectedDetail.data && selectedDetail.data.reviews && selectedDetail.data.reviews.length > 0 ? (
                          selectedDetail.data.reviews.map((rev, idx) => (
                            <div key={idx} className="p-6 rounded-2xl border border-slate-700/80 space-y-2" style={{ backgroundColor: 'var(--card-bg, #1e293b)' }}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-xs">
                                    {rev.author.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="text-xs font-bold text-white">{rev.author}</div>
                                    <div className="text-[10px] text-sky-400 font-mono">{rev.vehicle}</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  {[...Array(rev.rating)].map((_, i) => (
                                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                  ))}
                                </div>
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                                "{rev.comment}"
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 rounded-2xl text-center text-xs text-slate-400 border border-slate-800" style={{ backgroundColor: 'var(--card-bg, #1e293b)' }}>
                            ⭐ 5.0 Rating — Verified Kuwait Workshop Dyno Logged Item
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}
        </main>

        {/* Global Garage Bay Booking Modal */}
        <AnimatePresence>
          {isBookingModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsBookingModalOpen(false)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" 
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-md bg-slate-900 text-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-700 max-h-[92vh] overflow-y-auto"
              >
                <div className="p-6 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400" style={{ color: 'var(--secondary-accent, #f59e0b)' }}>
                      {isAr ? 'حجز منصة كراج فورية' : 'Workshop Bay Reservation'}
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      {activeServiceForBooking ? (isAr && activeServiceForBooking.titleAr ? activeServiceForBooking.titleAr : activeServiceForBooking.title) : (isAr ? 'منصة فحص الكراج' : 'Garage Diagnostic Bay')}
                    </h3>
                  </div>
                  <button 
                    onClick={() => setIsBookingModalOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800 transition-all duration-150 active:scale-95"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6">
                  {bookingSuccess ? (
                    <div className="text-center py-6">
                      <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 animate-bounce" />
                      <h4 className="text-xl font-bold text-white mb-1">
                        {isAr ? 'تم تأكيد موعد المنصة بنجاح!' : 'Bay Appointment Confirmed!'}
                      </h4>
                      <p className="text-xs text-slate-300 mb-2">
                        {isAr ? 'تمت إضافة الحجز إلى حسابك. الدفع نقداً عند الحضور في كراج الشويخ.' : 'Added to your profile bookings. Cash on arrival at Shuwaikh Garage Bay #3.'}
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleBookingSubmit} className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                          {isAr ? 'الاسم الكامل' : 'Customer Name'}
                        </label>
                        <input
                          type="text"
                          required
                          value={bookingName}
                          onChange={(e) => setBookingName(e.target.value)}
                          placeholder="e.g. Faisal Al-Sabah"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                          {isAr ? 'رقم الهاتف الكويتي (8 أرقام)' : 'Kuwait Mobile (+965)'}
                        </label>
                        <input
                          type="tel"
                          required
                          value={bookingPhone}
                          onChange={(e) => {
                            setBookingPhone(e.target.value);
                            setBookingError('');
                          }}
                          placeholder="+965 9900 1234"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                          {isAr ? 'موديل ونوع السيارة' : 'Vehicle Make / Model / Year'}
                        </label>
                        <input
                          type="text"
                          required
                          value={bookingVehicle}
                          onChange={(e) => setBookingVehicle(e.target.value)}
                          placeholder="e.g. 2023 Porsche 911 GT3 / Patrol V8"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                            {isAr ? 'التاريخ المفضل' : 'Preferred Date'}
                          </label>
                          <input
                            type="date"
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                            {isAr ? 'الوقت' : 'Time Slot'}
                          </label>
                          <select
                            value={bookingTime}
                            onChange={(e) => setBookingTime(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white"
                          >
                            <option value="09:00 AM">09:00 AM</option>
                            <option value="11:30 AM">11:30 AM</option>
                            <option value="02:00 PM">02:00 PM</option>
                            <option value="04:30 PM">04:30 PM</option>
                            <option value="07:00 PM">07:00 PM</option>
                          </select>
                        </div>
                      </div>

                      {bookingError && (
                        <div className="p-2.5 bg-red-950 border border-red-800 text-red-300 rounded-xl text-xs font-bold flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{bookingError}</span>
                        </div>
                      )}

                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex justify-between items-center font-bold">
                        <span className="text-slate-400">{isAr ? 'قيمة الفحص والخدمة:' : 'Bay Service Total:'}</span>
                        <span className="text-sky-400 text-sm" style={{ color: 'var(--primary-accent, #0284c7)' }}>{activeServiceForBooking?.price || 35} KWD • {isAr ? 'الدفع عند الحضور' : 'Cash on Arrival'}</span>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all duration-150 active:scale-95"
                        style={{ backgroundColor: 'var(--primary-accent, #0284c7)' }}
                      >
                        {isAr ? 'تأكيد حجز المنصة (الدفع عند الحضور)' : 'Confirm Bay Booking (Cash on Arrival)'}
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Test Drive Request Modal */}
        <AnimatePresence>
          {activeCarForDrive && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveCarForDrive(null)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-lg bg-slate-900 text-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-700 max-h-[92vh] overflow-y-auto"
              >
                <button 
                  onClick={() => setActiveCarForDrive(null)}
                  className="absolute top-4 right-4 text-slate-300 hover:text-white bg-slate-950/80 p-1.5 rounded-full z-20 transition-all duration-150 active:scale-95"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="aspect-video relative overflow-hidden bg-slate-950">
                  <img 
                    src={activeCarForDrive.image} 
                    alt={activeCarForDrive.name} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-6 text-white">
                    <div className="text-xs font-bold text-amber-400" style={{ color: 'var(--secondary-accent, #f59e0b)' }}>
                      {activeCarForDrive.badge} • {isAr ? 'الدفع عند الحضور' : 'Cash on Arrival'}
                    </div>
                    <h3 className="text-xl font-bold">{isAr && activeCarForDrive.nameAr ? activeCarForDrive.nameAr : activeCarForDrive.name}</h3>
                  </div>
                </div>

                <div className="p-6">
                  {testDriveSuccess ? (
                    <div className="text-center py-6">
                      <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 animate-bounce" />
                      <h4 className="text-xl font-bold text-white mb-1">{isAr ? 'تم حجز موعد تجربة القيادة VIP!' : 'VIP Test Drive Booked!'}</h4>
                      <p className="text-xs text-slate-300 mb-2">
                        {isAr ? `تمت إضافة الطلب لحسابك. سيقوم المستشار بتجهيز السيارة في ${activeCarForDrive.location}.` : `Added to your account bookings. Our sales advisor will prepare the vehicle at ${activeCarForDrive.location} (Cash on Arrival).`}
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleTestDriveSubmit} className="space-y-3.5">
                      <div className="text-xs text-slate-300">
                        {isAr ? `احجز تجربة قيادة خاصة لمدة 45 دقيقة مع خبير الأداء في ${activeCarForDrive.location}.` : `Reserve a private 45-minute test drive with our performance specialist at ${activeCarForDrive.location}.`}
                      </div>

                      <input
                        type="text"
                        required
                        value={driveName}
                        onChange={(e) => setDriveName(e.target.value)}
                        placeholder={isAr ? 'الاسم الكامل' : 'Your Full Name'}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
                      />
                      <input
                        type="tel"
                        required
                        value={drivePhone}
                        onChange={(e) => {
                          setDrivePhone(e.target.value);
                          setDriveError('');
                        }}
                        placeholder={isAr ? 'الهاتف الكويتي (+965 9900 1234)' : 'Kuwait Mobile (+965 9900 1234)'}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-white"
                      />

                      {driveError && (
                        <div className="p-2.5 bg-red-950 border border-red-800 text-red-300 rounded-xl text-xs font-bold flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{driveError}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full py-3.5 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all duration-150 active:scale-95"
                        style={{ backgroundColor: 'var(--primary-accent, #0284c7)' }}
                      >
                        {isAr ? 'تأكيد حجز تجربة القيادة VIP (الدفع عند الحضور)' : 'Confirm VIP Test Drive Reservation (Cash on Arrival)'}
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AdminControls userRole={currentUser?.isAdmin ? 'admin' : currentUser?.role} />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          language={language}
        />

        <CartDrawer
          language={language}
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          currentUser={currentUser}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          onOrderPlaced={(newOrder) => {
            setUserOrders(prev => [newOrder, ...prev]);
          }}
        />

        {config.showSalesToast !== false && <LiveSalesToast />}
        {config.showChatbot !== false && <MechanicChatWidget language={language} />}

      </div>

      <div>
        <div 
          className="border-t border-slate-800/80 py-3 px-4 text-center"
          style={{ backgroundColor: 'var(--footer-bg, #0b0f19)' }}
        >
          <button
            onClick={() => handleNavigatePage('admin')}
            className="text-slate-400 hover:text-amber-400 transition-colors duration-150 text-xs font-mono inline-flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" style={{ color: 'var(--secondary-accent, #f59e0b)' }} />
            <span>{isAr ? 'بوابة إدارة الكراج والإعدادات' : 'Garage Admin Portal & Settings'}</span>
          </button>
        </div>
        <Footer language={language} />
      </div>
    </div>
  );
}

const CatalogBridge: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { config } = useSiteContext();
  return (
    <CatalogContext.Provider
      value={{
        products: config.products || [],
        services: config.services || [],
        vehicles: config.vehicles || [],
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export default function App() {
  return (
    <SiteProvider>
      <CatalogBridge>
        <SiteConfigProvider>
          <MainApp />
        </SiteConfigProvider>
      </CatalogBridge>
    </SiteProvider>
  );
}