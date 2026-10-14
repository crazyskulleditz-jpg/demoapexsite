import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Wrench, 
  Car, 
  Zap, 
  Globe, 
  Menu, 
  X, 
  PhoneCall, 
  MapPin, 
  Calendar,
  Home,
  Tag,
  User as UserIcon,
  LogOut,
  Package,
  Layers
} from 'lucide-react';
import { Language, Product, Vehicle, GarageService, DetailItem, PageView, User } from '../types';

interface NavbarProps {
  language: Language;
  activePage: PageView;
  currentUser: User | null;
  onToggleLanguage: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenBooking: () => void;
  onOpenAuth: () => void;
  onNavigatePage: (page: PageView, detailItem?: DetailItem) => void;
  onLogout: () => void;
  allSearchableItems: Array<{
    id: string | number;
    title: string;
    category: string;
    price?: number;
    priceDisplay?: string;
    image: string;
    itemType: 'product' | 'service' | 'vehicle';
    raw: Product | GarageService | Vehicle;
  }>;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  activePage,
  currentUser,
  onToggleLanguage,
  cartCount,
  onOpenCart,
  onOpenBooking,
  onOpenAuth,
  onNavigatePage,
  onLogout,
  allSearchableItems,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  const isAr = language === 'ar';

  const filteredResults = searchQuery.trim() === '' 
    ? [] 
    : allSearchableItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLinkClick = (page: PageView) => {
    onNavigatePage(page);
    setMobileMenuOpen(false);
    setAccountMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResultClick = (result: typeof allSearchableItems[0]) => {
    if (result.itemType === 'product') {
      onNavigatePage('product-detail', { type: 'product', data: result.raw as Product });
    } else if (result.itemType === 'service') {
      onNavigatePage('product-detail', { type: 'service', data: result.raw as GarageService });
    } else if (result.itemType === 'vehicle') {
      onNavigatePage('product-detail', { type: 'vehicle', data: result.raw as Vehicle });
    }
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-sky-100 shadow-sm">
      {/* Top Utility Bar */}
      <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-cyan-700 text-white text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a 
              href="https://maps.google.com/?q=Shuwaikh+Industrial+Area+Kuwait" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:underline font-medium"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              <span>{isAr ? '📍 الشويخ الصناعية 1 - الكويت' : '📍 Shuwaikh Industrial 1, Kuwait'}</span>
            </a>
            <span className="hidden md:inline text-sky-300">|</span>
            <span className="hidden md:inline text-sky-100 font-medium">
              {isAr ? '⚡ متوفر حجز فوري وخدمة فحص كمبيوتر' : '⚡ Certified European & Desert Performance Workshop'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a href="tel:+96522002739" className="flex items-center gap-1 hover:text-amber-300 font-bold">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>+965 2200-APEX</span>
            </a>

            {/* Language Switcher */}
            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider transition-colors"
            >
              <Globe className="w-3 h-3 text-amber-300" />
              <span>{isAr ? 'English' : 'عربي'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleLinkClick('home')} 
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-11 h-11 bg-sky-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-sky-600/30 group-hover:bg-sky-500 transition-all">
            <Wrench className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-2xl font-black tracking-tight text-slate-900 leading-none">
              APEX<span className="text-sky-600">TORQUE</span>
            </div>
            <div className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mt-0.5">
              {isAr ? 'كراج وأوتو ستور الكويت' : 'GARAGE & AUTO STORE'}
            </div>
          </div>
        </div>

        {/* Global Live Search Bar */}
        <div ref={searchRef} className="relative hidden md:block flex-1 max-w-sm lg:max-w-md mx-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder={isAr ? 'ابحث عن قطع الغيار، الخدمات، كود العطل...' : 'Search parts, repairs, OBD2 codes, cars...'}
              className="w-full bg-slate-100/90 border border-slate-200 rounded-full pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100 transition-all"
            />
          </div>

          {/* Search Dropdown Results */}
          {isSearchOpen && searchQuery.trim() !== '' && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-sky-100 p-2 z-50 overflow-hidden">
              <div className="text-[11px] font-bold text-slate-400 px-3 py-1.5 uppercase tracking-wider">
                {isAr ? 'نتائج البحث الفورية' : 'Live Matching Results'}
              </div>
              {filteredResults.length > 0 ? (
                <div className="space-y-1">
                  {filteredResults.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleResultClick(item)}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-sky-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-10 h-10 rounded-lg object-cover border border-slate-100 shrink-0" 
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</div>
                          <div className="text-[10px] text-sky-600 font-medium">{item.category}</div>
                        </div>
                      </div>
                      <div className="text-xs font-black text-sky-700 font-mono shrink-0">
                        {item.priceDisplay ? item.priceDisplay : `${item.price} KWD`}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-500">
                  {isAr ? '🔍 لا توجد نتائج مطابقة، يرجى كتابة اسم آخر' : '🔍 No matching parts, cars, or services found.'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center / Navigation Links for Standalone Pages */}
        <nav className="hidden xl:flex items-center gap-5 text-xs font-bold text-slate-700 uppercase tracking-wide">
          <button 
            onClick={() => handleLinkClick('home')} 
            className={`transition-colors flex items-center gap-1 py-1 px-2 rounded-lg ${
              activePage === 'home' ? 'text-sky-600 bg-sky-50 font-black' : 'hover:text-sky-600'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>{isAr ? 'الرئيسية' : 'Home'}</span>
          </button>

          <button 
            onClick={() => handleLinkClick('diagnostics')} 
            className={`transition-colors flex items-center gap-1 py-1 px-2 rounded-lg ${
              activePage === 'diagnostics' ? 'text-sky-600 bg-sky-50 font-black' : 'hover:text-sky-600'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>{isAr ? 'الصيانة والتصليح' : 'Diagnosing & Repair'}</span>
          </button>

          <button 
            onClick={() => handleLinkClick('performance')} 
            className={`transition-colors flex items-center gap-1 py-1 px-2 rounded-lg ${
              activePage === 'performance' ? 'text-sky-600 bg-sky-50 font-black' : 'hover:text-sky-600'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isAr ? 'البرمجة والتعديل' : 'Performance'}</span>
          </button>

          <button 
            onClick={() => handleLinkClick('parts')} 
            className={`transition-colors flex items-center gap-1 py-1 px-2 rounded-lg ${
              activePage === 'parts' ? 'text-sky-600 bg-sky-50 font-black' : 'hover:text-sky-600'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>{isAr ? 'قطع الغيار والأجهزة' : 'Auto Parts & Tools'}</span>
          </button>

          <button 
            onClick={() => handleLinkClick('showroom')} 
            className={`transition-colors flex items-center gap-1 py-1 px-2 rounded-lg ${
              activePage === 'showroom' ? 'text-sky-600 bg-sky-50 font-black' : 'hover:text-sky-600'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>{isAr ? 'سيارات للبيع' : 'Showroom'}</span>
          </button>
        </nav>

        {/* Right Action CTAs */}
        <div className="flex items-center gap-2.5">
          {/* User Account Button / Dropdown */}
          <div ref={accountRef} className="relative">
            {currentUser ? (
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-sky-50 border border-slate-200 text-slate-800 transition-all text-xs font-bold"
              >
                <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center text-xs font-black">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline max-w-[100px] truncate">{currentUser.name}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-sky-50 border border-slate-200 text-slate-700 hover:text-sky-600 transition-all text-xs font-bold"
              >
                <UserIcon className="w-4 h-4" />
                <span className="hidden sm:inline">{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
              </button>
            )}

            {/* Account Dropdown */}
            {accountMenuOpen && currentUser && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 space-y-1">
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-500 truncate">{currentUser.email}</div>
                </div>

                <button
                  onClick={() => handleLinkClick('account')}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-sky-50 text-xs font-bold text-slate-700 flex items-center gap-2 transition-colors"
                >
                  <Wrench className="w-4 h-4 text-sky-600" />
                  <span>{isAr ? 'حجوزاتي وطلباتي' : 'My Bookings & Orders'}</span>
                </button>

                <button
                  onClick={() => {
                    handleLinkClick('account');
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-sky-50 text-xs font-bold text-slate-700 flex items-center gap-2 transition-colors"
                >
                  <Car className="w-4 h-4 text-sky-600" />
                  <span>{isAr ? 'المركبات المحفوظة' : 'My Saved Vehicles'}</span>
                </button>

                <button
                  onClick={() => {
                    onLogout();
                    setAccountMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50 text-xs font-bold text-red-600 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{isAr ? 'تسجيل الخروج' : 'Sign Out'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Primary Appointment Button */}
          <button
            onClick={onOpenBooking}
            className="hidden sm:flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider px-3.5 py-2.5 rounded-xl shadow-md shadow-sky-600/25 transition-all active:scale-95"
          >
            <Calendar className="w-4 h-4 text-amber-300" />
            <span>{isAr ? 'حجز موعد' : 'Book Bay'}</span>
          </button>

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-sky-50 border border-slate-200 text-slate-700 hover:text-sky-600 transition-all"
            aria-label="Open Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-sky-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-md animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-slate-700 hover:text-slate-900"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white p-6 space-y-4 shadow-xl">
          <div className="mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'بحث سريع...' : 'Search catalog...'}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 text-sm"
            />
          </div>
          <button
            onClick={() => handleLinkClick('home')}
            className={`block w-full text-left font-bold py-2 ${activePage === 'home' ? 'text-sky-600' : 'text-slate-800'}`}
          >
            🏠 {isAr ? 'الصفحة الرئيسية' : 'Home'}
          </button>
          <button
            onClick={() => handleLinkClick('diagnostics')}
            className={`block w-full text-left font-bold py-2 ${activePage === 'diagnostics' ? 'text-sky-600' : 'text-slate-800'}`}
          >
            🛠️ {isAr ? 'خدمات الصيانة وتصليح الأعطال' : 'Diagnosing & Repairing'}
          </button>
          <button
            onClick={() => handleLinkClick('performance')}
            className={`block w-full text-left font-bold py-2 ${activePage === 'performance' ? 'text-sky-600' : 'text-slate-800'}`}
          >
            ⚡ {isAr ? 'قطع الغيار والبرمجة' : 'Performance Upgrades'}
          </button>
          <button
            onClick={() => handleLinkClick('parts')}
            className={`block w-full text-left font-bold py-2 ${activePage === 'parts' ? 'text-sky-600' : 'text-slate-800'}`}
          >
            🔩 {isAr ? 'قطع غيار ميكانيكية وأجهزة فحص' : 'Auto Parts & Hardware Tools'}
          </button>
          <button
            onClick={() => handleLinkClick('showroom')}
            className={`block w-full text-left font-bold py-2 ${activePage === 'showroom' ? 'text-sky-600' : 'text-slate-800'}`}
          >
            🏎️ {isAr ? 'معرض سيارات للبيع' : 'Vehicles For Sale'}
          </button>
          {currentUser && (
            <button
              onClick={() => handleLinkClick('account')}
              className={`block w-full text-left font-bold py-2 ${activePage === 'account' ? 'text-sky-600' : 'text-slate-800'}`}
            >
              👤 {isAr ? 'حسابي وحجوزاتي' : 'My Bookings & Profile'}
            </button>
          )}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenBooking();
            }}
            className="w-full py-3 bg-sky-600 text-white font-bold rounded-xl text-center shadow-lg"
          >
            📅 {isAr ? 'حجز موعد فحص فوري' : 'Book Service Appointment'}
          </button>
        </div>
      )}
    </header>
  );
};
