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
  Lock
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

function MainApp() {
  const { config } = useSiteContext();
  const [language, setLanguage] = useState<Language>('en');
  
  // Initial active view determination
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

  // Popstate & hashchange listener
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

  // User Authentication State from localStorage
  const [currentUser, setCurrentUser] = useState<(User & { isAdmin?: boolean }) | null>(() => {
    try {
      const saved = localStorage.getItem('apextorque_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Failed to parse apextorque_user from localStorage:', e);
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Active bookings, orders & test drive records with localStorage persistence
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

  // Sync bookings, orders and test drives to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('apextorque_bookings', JSON.stringify(userBookings));
    } catch (e) {
      console.error('Failed to save bookings to localStorage:', e);
    }
  }, [userBookings]);

  useEffect(() => {
    try {
      localStorage.setItem('apextorque_orders', JSON.stringify(userOrders));
    } catch (e) {
      console.error('Failed to save orders to localStorage:', e);
    }
  }, [userOrders]);

  useEffect(() => {
    try {
      localStorage.setItem('apextorque_testdrives', JSON.stringify(userTestDrives));
    } catch (e) {
      console.error('Failed to save test drives to localStorage:', e);
    }
  }, [userTestDrives]);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [activeServiceForBooking, setActiveServiceForBooking] = useState<GarageService | null>(null);

  // Test Drive Modal
  const [activeCarForDrive, setActiveCarForDrive] = useState<Vehicle | null>(null);
  const [testDriveSuccess, setTestDriveSuccess] = useState(false);

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
    } catch (e) {
      console.error('Failed to update saved vehicles in localStorage:', e);
    }
  };

  const handleLoginSuccess = (user: User & { isAdmin?: boolean }) => {
    setCurrentUser(user);
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

  // Order & Booking Updates for Admin Hub
  const handleUpdateOrder = (id: string, updated: Partial<OrderRecord>) => {
    setUserOrders(prev => prev.map(o => o.id === id ? { ...o, ...updated } : o));
  };

  const handleDeleteOrder = (id: string) => {
    setUserOrders(prev => prev.filter(o => o.id !== id));
  };

  const handleUpdateBooking = (id: string, updated: Partial<BookingRecord>) => {
    setUserBookings(prev => prev.map(b => b.id === id ? { ...b, ...updated } : b));
  };

  const handleUpdateTestDrive = (id: string, updated: Partial<TestDriveRecord>) => {
    setUserTestDrives(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
  };

  // Build searchable items catalogue from dynamic context
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
      category: 'Diagnosing & Repairing',
      price: s.price,
      priceDisplay: s.priceDisplay,
      image: s.image,
      itemType: 'service' as const,
      raw: s
    })),
    ...config.vehicles.map(v => ({
      id: v.id,
      title: isAr && v.nameAr ? v.nameAr : v.name,
      category: 'Vehicles for Sale',
      price: v.price,
      image: v.image,
      itemType: 'vehicle' as const,
      raw: v
    }))
  ];

  return (
    <div 
      dir={isAr ? 'rtl' : 'ltr'} 
      className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between relative"
      style={{
        fontFamily: config.customFontFamily || undefined
      }}
    >
      <div>
        {/* Top Admin Shortcut */}
        {currentUser?.isAdmin && activePage !== 'admin' && (
          <div className="bg-slate-900 text-white py-1.5 px-4 text-xs font-bold flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Workshop Administrator Mode Active</span>
            </div>
            <button
              onClick={() => handleNavigatePage('admin')}
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px] font-mono transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Open Admin Control Hub</span>
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
          onOpenBooking={() => {
            setActiveServiceForBooking(config.services[0] || null);
            setIsBookingModalOpen(true);
          }}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onNavigatePage={handleNavigatePage}
          onLogout={handleLogout}
          allSearchableItems={allSearchableItems}
        />

        {/* Breadcrumb Navigation on Subpages */}
        {activePage !== 'home' && (
          <div className="pt-32 pb-4 bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <button 
                  onClick={() => handleNavigatePage('home')} 
                  className="hover:text-sky-600 transition-colors"
                >
                  {isAr ? 'الرئيسية' : 'Home'}
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-sky-600">
                  {activePage === 'diagnostics' && (isAr ? 'الصيانة وتصليح الأعطال' : 'Diagnosing & Repairing')}
                  {activePage === 'performance' && (isAr ? 'البرمجة وتعديل الأداء' : 'Performance Upgrades')}
                  {activePage === 'parts' && (isAr ? 'قطع الغيار والأجهزة' : 'Auto Parts & Tools')}
                  {activePage === 'showroom' && (isAr ? 'معرض السيارات' : 'Vehicles For Sale')}
                  {activePage === 'product-detail' && (isAr ? 'صفحة تفاصيل المنتج' : 'Item Details')}
                  {activePage === 'account' && (isAr ? 'حسابي وحجوزاتي' : 'My Bookings & Profile')}
                  {activePage === 'admin' && 'Workshop Admin Control Center'}
                </span>
              </div>

              <button
                onClick={() => handleNavigatePage('home')}
                className="text-xs font-bold text-slate-600 hover:text-sky-600 flex items-center gap-1"
              >
                <ArrowLeft className={`w-3.5 h-3.5 ${isAr ? 'rotate-180' : ''}`} />
                <span>{isAr ? 'العودة للرئيسية' : 'Back to Home'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Page Views */}
        <main>
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
              testDrives={userTestDrives}
              onUpdateTestDrive={handleUpdateTestDrive}
            />
          )}

          {activePage === 'home' && (
            <>
              <Hero
                language={language}
                onOpenBooking={() => {
                  setActiveServiceForBooking(config.services[0] || null);
                  setIsBookingModalOpen(true);
                }}
                onNavigatePage={handleNavigatePage}
              />

              {/* Featured Diagnostics / Services Preview */}
              <ServicesSection
                language={language}
                isBookingModalOpen={isBookingModalOpen}
                onOpenBookingModal={(srv) => {
                  if (srv) setActiveServiceForBooking(srv);
                  setIsBookingModalOpen(true);
                }}
                onCloseBookingModal={() => setIsBookingModalOpen(false)}
                onSelectDetail={(item) => handleNavigatePage('product-detail', item)}
              />

              {/* Performance Parts Store Preview */}
              <ProductGrid
                language={language}
                onAddToCart={handleAddToCart}
                onSelectDetail={(item) => handleNavigatePage('product-detail', item)}
              />

              {/* Verified Showroom Preview */}
              <ShowroomGrid
                language={language}
                onSelectDetail={(item) => handleNavigatePage('product-detail', item)}
              />

              {/* Interactive OBD2 Diagnostic Scanner Engine */}
              {config.showObdScanner !== false && (
                <DiagnosticTool
                  language={language}
                  onAddToCart={handleAddToCart}
                  onOpenBooking={() => {
                    setActiveServiceForBooking(config.services[0] || null);
                    setIsBookingModalOpen(true);
                  }}
                />
              )}
            </>
          )}

          {/* Dedicated Page 1: Diagnosing & Repairing */}
          {activePage === 'diagnostics' && (
            <div>
              <ServicesSection
                language={language}
                isStandalonePage={true}
                isBookingModalOpen={isBookingModalOpen}
                onOpenBookingModal={(srv) => {
                  if (srv) setActiveServiceForBooking(srv);
                  setIsBookingModalOpen(true);
                }}
                onCloseBookingModal={() => setIsBookingModalOpen(false)}
                onSelectDetail={(item) => handleNavigatePage('product-detail', item)}
              />
              <DiagnosticTool
                language={language}
                onAddToCart={handleAddToCart}
                onOpenBooking={() => {
                  setActiveServiceForBooking(config.services[0] || null);
                  setIsBookingModalOpen(true);
                }}
              />
            </div>
          )}

          {/* Dedicated Page 2: Performance Upgrades */}
          {activePage === 'performance' && (
            <ProductGrid
              language={language}
              filterCategory="Performance Upgrades"
              onAddToCart={handleAddToCart}
              onSelectDetail={(item) => handleNavigatePage('product-detail', item)}
            />
          )}

          {/* Dedicated Page 3: Auto Parts & Hardware Tools */}
          {activePage === 'parts' && (
            <ProductGrid
              language={language}
              filterCategory="Auto Parts & Hardware"
              onAddToCart={handleAddToCart}
              onSelectDetail={(item) => handleNavigatePage('product-detail', item)}
            />
          )}

          {/* Dedicated Page 4: Showroom Vehicles */}
          {activePage === 'showroom' && (
            <ShowroomGrid
              language={language}
              onSelectDetail={(item) => handleNavigatePage('product-detail', item)}
            />
          )}

          {/* Dedicated Page 5: Account Dashboard */}
          {activePage === 'account' && (
            currentUser ? (
              <AccountDashboard
                user={currentUser}
                bookings={userBookings}
                orders={userOrders}
                testDrives={userTestDrives}
                language={language}
                onLogout={handleLogout}
                onAddVehicle={handleAddNewVehicle}
                onBookService={() => {
                  setActiveServiceForBooking(config.services[0] || null);
                  setIsBookingModalOpen(true);
                }}
              />
            ) : (
              <div className="py-20 text-center bg-white">
                <h2 className="text-xl font-bold mb-2">Please sign in to view your account</h2>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-6 py-2.5 bg-sky-600 text-white font-bold text-xs rounded-xl"
                >
                  Sign In
                </button>
              </div>
            )
          )}

          {/* Dedicated Page 6: Full Product / Item Detail View */}
          {activePage === 'product-detail' && selectedDetail && (
            <div className="py-12 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                
                {/* Top Hero Section: Gallery & Primary Buy Box */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
                  
                  {/* Left Column: Interactive Photo Carousel */}
                  <div className="lg:col-span-7">
                    <ImageGallery 
                      itemId={'id' in selectedDetail.data ? selectedDetail.data.id : selectedDetail.type}
                      images={'gallery' in selectedDetail.data && selectedDetail.data.gallery ? selectedDetail.data.gallery : [selectedDetail.data.image]} 
                      altTitle={'name' in selectedDetail.data ? selectedDetail.data.name : selectedDetail.data.title}
                      badge={
                        selectedDetail.type === 'product' ? `${selectedDetail.data.category} • Cash on Delivery` :
                        selectedDetail.type === 'vehicle' ? `${selectedDetail.data.badge} • Cash on Arrival` : 'CERTIFIED SERVICE • Cash on Arrival'
                      }
                    />
                  </div>

                  {/* Right Column: Pricing, Overview & Dynamic Category CTAs */}
                  <div className="lg:col-span-5 space-y-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
                          {selectedDetail.type === 'product' && `${selectedDetail.data.category} — Cash on Delivery`}
                          {selectedDetail.type === 'service' && (isAr ? 'خدمة كراج معتمدة — الدفع عند الحضور' : 'Certified Garage Service — Cash on Arrival')}
                          {selectedDetail.type === 'vehicle' && (isAr ? 'سيارة معتمدة — الدفع عند الحضور' : 'Verified Showroom Car — Cash on Arrival')}
                        </span>
                        {selectedDetail.type === 'product' && (
                          <span className="text-xs font-mono text-slate-500 font-bold">
                            {selectedDetail.data.partNumber}
                          </span>
                        )}
                      </div>

                      <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                        {isAr && 'nameAr' in selectedDetail.data && selectedDetail.data.nameAr
                          ? selectedDetail.data.nameAr
                          : isAr && 'titleAr' in selectedDetail.data && selectedDetail.data.titleAr
                          ? selectedDetail.data.titleAr
                          : 'name' in selectedDetail.data 
                          ? selectedDetail.data.name 
                          : selectedDetail.data.title}
                      </h1>

                      <div className="mt-4 flex items-baseline gap-4">
                        <div className="text-4xl font-black text-sky-600">
                          {('priceDisplay' in selectedDetail.data && selectedDetail.data.priceDisplay) 
                            ? selectedDetail.data.priceDisplay 
                            : `${selectedDetail.data.price.toLocaleString()} KWD`}
                        </div>

                        <div className="text-xs text-slate-500 font-semibold">
                          {isAr ? 'شامل الفحص والضمان • الدفع نقداً عند الاستلام / الحضور' : 'Tax & Inspection Included • Cash on Delivery / Cash on Arrival'}
                        </div>
                      </div>
                    </div>

                    {/* Highlights Card */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/90 space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-700">
                        <span className="font-bold flex items-center gap-1.5 text-emerald-700">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>{selectedDetail.data.warranty || '1 Year Official Garage Warranty'}</span>
                        </span>
                        <span className="text-slate-500">
                          📍 {isAr ? 'الشويخ الصناعية 1 • الدفع عند الحضور' : 'Shuwaikh Industrial • Cash on Arrival'}
                        </span>
                      </div>

                      {selectedDetail.type === 'vehicle' && (
                        <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200 text-slate-600">
                          <div>📅 {selectedDetail.data.year} Model</div>
                          <div>⏱️ {selectedDetail.data.mileage}</div>
                          <div>⚙️ {selectedDetail.data.engine}</div>
                          <div>🏎️ {selectedDetail.data.power}</div>
                        </div>
                      )}

                      {selectedDetail.type === 'product' && (
                        <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200 text-slate-600">
                          <div>📦 {selectedDetail.data.stock} Units In Stock</div>
                          <div>🔧 {selectedDetail.data.installDifficulty || 'Standard Fitment'}</div>
                        </div>
                      )}

                      {selectedDetail.type === 'service' && (
                        <div className="text-xs pt-2 border-t border-slate-200 text-slate-600">
                          ⏱️ Estimated Bay Duration: <span className="font-bold text-slate-800">{selectedDetail.data.duration}</span>
                        </div>
                      )}
                    </div>

                    {/* Dynamic Category Actions */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                      {selectedDetail.type === 'service' && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveServiceForBooking(selectedDetail.data as GarageService);
                            setIsBookingModalOpen(true);
                          }}
                          className="w-full py-4 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-sky-600/25 transition-all flex items-center justify-center gap-2 active:scale-95"
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
                            className="w-full sm:flex-1 py-4 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-sky-600/25 transition-all flex items-center justify-center gap-2 active:scale-95"
                          >
                            <ShoppingCart className="w-4 h-4 text-amber-300" />
                            <span>{isAr ? 'أضف للسلة (الدفع عند الاستلام)' : 'Add to Cart / Buy Now (Cash on Delivery)'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveServiceForBooking(config.services[0] || null);
                              setIsBookingModalOpen(true);
                            }}
                            className="w-full sm:w-auto py-4 px-5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2"
                          >
                            <Wrench className="w-4 h-4 text-sky-600" />
                            <span>{isAr ? 'طلب تركيب بالكراج (الدفع عند الحضور)' : 'Book Install Bay (Cash on Arrival)'}</span>
                          </button>
                        </>
                      )}

                      {selectedDetail.type === 'vehicle' && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveCarForDrive(selectedDetail.data as Vehicle);
                          }}
                          className="w-full py-4 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-sky-600/25 transition-all flex items-center justify-center gap-2 active:scale-95"
                        >
                          <Car className="w-4 h-4 text-amber-300" />
                          <span>{isAr ? 'حجز موعد تجربة القيادة VIP (الدفع عند الحضور)' : 'Book VIP Test Drive / Inquire (Cash on Arrival)'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>

                {/* 5-Tab Deep Product & Vehicle Specifications Hub */}
                <div className="border-t border-slate-200 pt-10">
                  <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-slate-200">
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                        activeTab === 'overview' ? 'bg-sky-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      📝 {isAr ? 'نظرة عامة والوصف' : '1. Overview & Description'}
                    </button>

                    <button
                      onClick={() => setActiveTab('specs')}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                        activeTab === 'specs' ? 'bg-sky-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      ⚙️ {isAr ? 'المواصفات التقنية الكاملة' : '2. Detailed Specifications'}
                    </button>

                    <button
                      onClick={() => setActiveTab('fitment')}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                        activeTab === 'fitment' ? 'bg-sky-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      🚗 {isAr ? 'التوافق والسيارات المطابقة' : '3. Vehicle Compatibility'}
                    </button>

                    <button
                      onClick={() => setActiveTab('box')}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                        activeTab === 'box' ? 'bg-sky-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      📦 {isAr ? 'محتويات الصندوق والضمان' : '4. In the Box & Warranty'}
                    </button>

                    <button
                      onClick={() => setActiveTab('reviews')}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                        activeTab === 'reviews' ? 'bg-sky-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      ⭐ {isAr ? 'تقييمات وتجارب العملاء' : '5. Reviews & Garage Logs'}
                    </button>
                  </div>

                  {/* Tab Content Display */}
                  <div className="py-8">
                    {activeTab === 'overview' && (
                      <div className="space-y-6 max-w-4xl">
                        <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200">
                          <h3 className="text-base font-bold uppercase text-slate-900 mb-3">
                            {isAr ? 'الوصف الهندسي والمميزات' : 'Engineering Narrative & Highlights'}
                          </h3>
                          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                            {'longDescription' in selectedDetail.data && selectedDetail.data.longDescription
                              ? selectedDetail.data.longDescription
                              : selectedDetail.data.description}
                          </p>
                        </div>
                      </div>
                    )}

                    {activeTab === 'specs' && (
                      <div className="max-w-4xl">
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-sky-50 text-sky-800 uppercase font-bold border-b border-sky-100">
                              <tr>
                                <th className="p-4">{isAr ? 'المعيار / البند' : 'Parameter / Spec'}</th>
                                <th className="p-4">{isAr ? 'القيمة / التفاصيل' : 'Certified Value / Detail'}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {'specsTable' in selectedDetail.data && selectedDetail.data.specsTable ? (
                                Object.entries(selectedDetail.data.specsTable).map(([key, val], idx) => (
                                  <tr key={idx} className="hover:bg-slate-50">
                                    <td className="p-4 font-bold text-slate-900 w-1/3">{key}</td>
                                    <td className="p-4 text-slate-600 font-mono">{val}</td>
                                  </tr>
                                ))
                              ) : (
                                selectedDetail.data.specs.map((spec, idx) => (
                                  <tr key={idx} className="hover:bg-slate-50">
                                    <td className="p-4 font-bold text-slate-900">Feature #{idx + 1}</td>
                                    <td className="p-4 text-slate-600">{spec}</td>
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
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                          <h3 className="text-sm font-bold uppercase text-slate-900 mb-3">
                            {isAr ? 'قائمة توافق المركبات المعتمدة' : 'Verified Vehicle Fitment Chart'}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {'compatibility' in selectedDetail.data && selectedDetail.data.compatibility ? (
                              selectedDetail.data.compatibility.map((comp, idx) => (
                                <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                                  <Car className="w-4 h-4 text-sky-600 shrink-0" />
                                  <span>{comp}</span>
                                </div>
                              ))
                            ) : (
                              <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-700">
                                Universal fitment verified across all GCC-spec OBD2 platforms.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'box' && (
                      <div className="max-w-4xl space-y-6">
                        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200">
                          <h3 className="text-sm font-bold uppercase text-slate-900 mb-4 flex items-center gap-2">
                            <Package className="w-4 h-4 text-sky-600" />
                            <span>{isAr ? 'محتويات الصندوق والقطع المرفقة' : 'What’s Included in the Box'}</span>
                          </h3>

                          <div className="space-y-2.5">
                            {'inTheBox' in selectedDetail.data && selectedDetail.data.inTheBox ? (
                              selectedDetail.data.inTheBox.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl text-xs text-slate-800">
                                  <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 font-bold flex items-center justify-center shrink-0">
                                    {idx + 1}
                                  </span>
                                  <span>{item}</span>
                                </div>
                              ))
                            ) : (
                              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
                                Complete hardware kit with all factory gaskets, bolts, and instructions.
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
                            <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200/90 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-xs">
                                    {rev.author.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="text-xs font-bold text-slate-900">{rev.author}</div>
                                    <div className="text-[10px] text-sky-600 font-mono">{rev.vehicle}</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  {[...Array(rev.rating)].map((_, i) => (
                                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                  ))}
                                </div>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed pt-1">
                                "{rev.comment}"
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="bg-slate-50 p-8 rounded-2xl text-center text-xs text-slate-500">
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

        {/* Test Drive Request Modal */}
        <AnimatePresence>
          {activeCarForDrive && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveCarForDrive(null)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-100"
              >
                <button 
                  onClick={() => setActiveCarForDrive(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-white/80 p-1.5 rounded-full z-20"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="h-44 relative">
                  <img 
                    src={activeCarForDrive.image} 
                    alt={activeCarForDrive.name} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-6 text-white">
                    <div className="text-xs font-bold text-amber-300">{activeCarForDrive.badge} • Cash on Arrival</div>
                    <h3 className="text-xl font-bold">{activeCarForDrive.name}</h3>
                  </div>
                </div>

                <div className="p-6">
                  {testDriveSuccess ? (
                    <div className="text-center py-6">
                      <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3 animate-bounce" />
                      <h4 className="text-xl font-bold text-slate-900 mb-1">VIP Test Drive Booked!</h4>
                      <p className="text-xs text-slate-600 mb-2">
                        Added to your account bookings. Our sales advisor will prepare the vehicle at {activeCarForDrive.location} (Cash on Arrival).
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formTarget = e.currentTarget as HTMLFormElement;
                      const customerNameInput = (formTarget.elements.namedItem('customerName') as HTMLInputElement)?.value;
                      const customerPhoneInput = (formTarget.elements.namedItem('customerPhone') as HTMLInputElement)?.value;
                      
                      const newTD: TestDriveRecord = {
                        id: `TD-${Math.floor(1000 + Math.random() * 9000)}`,
                        vehicleId: activeCarForDrive.id,
                        vehicleName: activeCarForDrive.name,
                        customerName: customerNameInput || currentUser?.name || 'Showroom Client',
                        customerPhone: customerPhoneInput || currentUser?.phone || '+965 9900 1234',
                        location: activeCarForDrive.location,
                        date: '2025-05-24',
                        status: 'Confirmed VIP Slot',
                        advisorName: 'Tariq Al-Ghanim',
                        advisorPhone: '+965 2200 2739'
                      };
                      setUserTestDrives(prev => [newTD, ...prev]);
                      setTestDriveSuccess(true);
                      setTimeout(() => {
                        setTestDriveSuccess(false);
                        setActiveCarForDrive(null);
                      }, 2000);
                    }} className="space-y-3.5">
                      <div className="text-xs text-slate-600">
                        Reserve a private 45-minute test drive with our performance specialist at <span className="font-bold text-slate-800">{activeCarForDrive.location}</span>.
                      </div>

                      <input
                        type="text"
                        name="customerName"
                        required
                        defaultValue={currentUser?.name || ''}
                        placeholder="Your Full Name"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                      />
                      <input
                        type="tel"
                        name="customerPhone"
                        required
                        defaultValue={currentUser?.phone || '+965 '}
                        placeholder="Mobile Phone (+965)"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                      />

                      <button
                        type="submit"
                        className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95"
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

        {/* Dynamic Floating Admin Controls */}
        <AdminControls userRole={currentUser?.isAdmin ? 'admin' : currentUser?.role} />

        {/* User Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          language={language}
        />

        {/* Slide-over Cart Drawer */}
        <CartDrawer
          language={language}
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          onOrderPlaced={(newOrder) => {
            setUserOrders(prev => [newOrder, ...prev]);
          }}
        />

        {/* Live Sales Proof Toasts */}
        {config.showSalesToast !== false && <LiveSalesToast />}

        {/* Virtual Master Mechanic Chat Assistant */}
        {config.showChatbot !== false && <MechanicChatWidget language={language} />}

      </div>

      {/* Bottom Footer Area */}
      <div>
        <div className="bg-slate-900 border-t border-slate-800 py-3 px-4 text-center">
          <button
            onClick={() => handleNavigatePage('admin')}
            className="text-slate-400 hover:text-amber-400 transition-colors text-xs font-mono inline-flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span>Garage Admin Portal & Settings</span>
          </button>
        </div>
        <Footer language={language} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SiteConfigProvider>
      <SiteProvider>
        <MainApp />
      </SiteProvider>
    </SiteConfigProvider>
  );
}
