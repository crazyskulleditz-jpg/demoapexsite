import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SiteConfig, SiteContextType } from '../types/admin';
import { Product, GarageService, Vehicle } from '../types';
import { SAMPLE_PRODUCTS } from '../components/ProductGrid';
import { GARAGE_SERVICES } from '../components/ServicesSection';
import { SHOWROOM_VEHICLES } from '../components/ShowroomGrid';

const STORAGE_KEY = 'apex_torque_site_config_v2';

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  siteName: 'ApexTorque Performance',
  motto: 'Kuwait Premier Dyno & Tuning Hub',
  logoUrl: '',
  faviconUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=120',
  phone: '+965 2200 2739',
  whatsapp: '+965 9900 1234',
  location: 'Shuwaikh Industrial Area 1, Block 2, Street 18, Kuwait City',
  
  // Theme & Color Engine
  themeColor: '#0284c7',       // Primary Accent
  secondaryAccent: '#f59e0b',  // Secondary Accent (Badges, Highlights, CTAs)
  accentColor: '#0284c7',
  headerBg: '#0f172a',
  headerText: '#ffffff',
  footerBg: '#0b0f19',
  cardBg: '#1e293b',
  pageBg: '#0f172a',
  fontStyle: 'sans',
  customFontFamily: '',

  // Advanced UI & Typography
  fontSizeScale: '100%',
  cardBorderRadius: '1.5rem',
  cardBorderColor: '#334155',
  cardBorderWidth: '1px',
  enableCarbonPattern: true,
  enableNeonGlow: true,

  // Background Media System
  bgType: 'none',
  bgMediaUrl: '',
  bgOverlayOpacity: 0.15,

  // Text Content & Announcement
  announcementText: '⚡ Kuwait Premier Dyno Tuning & Performance Garage — Shuwaikh Branch',
  announcementTextAr: '⚡ كراج الأداء والبرمجة الأول في الكويت — فرع الشويخ',
  heroTitle: 'Kuwait Premier Automotive Dyno & Tuning Hub',
  heroTitleAr: 'مركز الأداء العالي والبرمجة وفحص السيارات بالكويت',
  heroSubtitle: 'Direct dealer diagnostic telemetry, bespoke Stage 1-3 ECU calibration, and certified parts catalogue.',
  heroSubtitleAr: 'فحص شامل بأحدث أجهزة الوكالة، برمجة مخصصة على الداينو، وقطع غيار أصلية مكفولة.',
  servicesTitle: 'Engineering Diagnostic & Repair Services',
  partsTitle: 'Performance Parts & Track Hardware',
  showroomTitle: 'Verified GCC Spec Pre-Owned Showroom',
  footerAbout: 'State of the art automotive engineering center in Shuwaikh.',

  // Interactive Widgets
  showAnnouncement: true,
  showObdScanner: true,
  showChatbot: true,
  showSalesToast: true,

  products: SAMPLE_PRODUCTS,
  services: GARAGE_SERVICES,
  vehicles: SHOWROOM_VEHICLES
};

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SITE_CONFIG,
          ...parsed,
          products: parsed.products?.length ? parsed.products : DEFAULT_SITE_CONFIG.products,
          services: parsed.services?.length ? parsed.services : DEFAULT_SITE_CONFIG.services,
          vehicles: parsed.vehicles?.length ? parsed.vehicles : DEFAULT_SITE_CONFIG.vehicles
        };
      }
    } catch (e) {
      console.warn('Failed to parse saved site configuration, falling back to defaults:', e);
    }
    return DEFAULT_SITE_CONFIG;
  });

  // Inject CSS root variables dynamically
  useEffect(() => {
    const root = document.documentElement;
    const primary = config.themeColor || '#0284c7';
    const secondary = config.secondaryAccent || '#f59e0b';
    const header = config.headerBg || '#0f172a';
    const footer = config.footerBg || '#0b0f19';
    const card = config.cardBg || '#1e293b';
    const page = config.pageBg || '#0f172a';
    const fontScale = config.fontSizeScale || '100%';
    const cardRadius = config.cardBorderRadius || '1.5rem';
    const cardBorderColor = config.cardBorderColor || '#334155';
    const cardBorderWidth = config.cardBorderWidth || '1px';

    root.style.setProperty('--primary-accent', primary);
    root.style.setProperty('--secondary-accent', secondary);
    root.style.setProperty('--header-bg', header);
    root.style.setProperty('--footer-bg', footer);
    root.style.setProperty('--card-bg', card);
    root.style.setProperty('--page-bg', page);
    root.style.setProperty('--main-bg', page);
    root.style.setProperty('--font-scale', fontScale);
    root.style.setProperty('--card-radius', cardRadius);
    root.style.setProperty('--card-border-color', cardBorderColor);
    root.style.setProperty('--card-border-width', cardBorderWidth);

    // ---- derive readable text colours from the page background ----
    const toRgb = (hex: string): number[] | null => {
      const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(String(hex).trim());
      return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null;
    };
    const pageRgb = toRgb(page);
    const lightBg = pageRgb ? (0.299 * pageRgb[0] + 0.587 * pageRgb[1] + 0.114 * pageRgb[2]) > 150 : false;
    root.style.setProperty('--text-primary', lightBg ? '#0f172a' : '#f8fafc');
    root.style.setProperty('--text-secondary', lightBg ? '#334155' : '#cbd5e1');
    root.style.setProperty('--text-muted', lightBg ? '#64748b' : '#94a3b8');
    root.style.setProperty('--surface-2', lightBg ? '#eef2f7' : '#1a2436');

    // ---- explicit overrides from the admin Theme panel ----
    const cfgAny = config as any;
    if (cfgAny.bodyText) root.style.setProperty('--text-primary', cfgAny.bodyText);
    root.style.setProperty('--header-text', cfgAny.headerText || '#ffffff');
    if (cfgAny.listingText) root.style.setProperty('--listing-text', cfgAny.listingText);

    // ---- FONT FAMILY: this was stored by the admin panel but never applied ----
    const DEFAULT_STACK = "'Inter', 'Geist', system-ui, -apple-system, 'Segoe UI', sans-serif";
    const SPECIFIC_FONTS: [RegExp, string][] = [
      [/orbitron|motorsport|hud/i, "'Orbitron', 'Rajdhani', 'Inter', sans-serif"],
      [/jetbrain|mono|technical|ecu/i, "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace"],
      [/montserrat|geometric/i, "'Montserrat', 'Inter', sans-serif"],
      [/tajawal|cairo|arabic/i, "'Tajawal', 'Cairo', 'Inter', sans-serif"],
      [/jakarta|crisp/i, "'Plus Jakarta Sans', 'Inter', sans-serif"],
      [/sync|avant|luxury|garde/i, "'Sync', 'Avant Garde', 'Poppins', 'Inter', sans-serif"],
    ];
    const GENERIC_FONTS: [RegExp, string][] = [[/geist|inter|modern|sans|ui|system/i, DEFAULT_STACK]];
    const fontCandidates = [config.customFontFamily, config.fontStyle]
      .filter((v) => typeof v === 'string' && v.trim().length > 0) as string[];
    let fontStack = '';
    for (const cand of fontCandidates) {
      if (/,|"/.test(cand)) { fontStack = cand; break; }
      const hit = SPECIFIC_FONTS.find(([re]) => re.test(cand));
      if (hit) { fontStack = hit[1]; break; }
    }
    if (!fontStack) {
      for (const cand of fontCandidates) {
        const hit = GENERIC_FONTS.find(([re]) => re.test(cand));
        if (hit) { fontStack = hit[1]; break; }
      }
    }
    if (!fontStack) fontStack = DEFAULT_STACK;
    root.style.setProperty('--app-font', fontStack);
    root.style.fontFamily = fontStack;

    // Pull the file down now instead of waiting for the browser to decide.
    const rawFirstFamily = String(fontStack).split(',')[0];
    const firstFamily = rawFirstFamily.split(String.fromCharCode(39)).join('').split(String.fromCharCode(34)).join('').trim();
    const fontApi = (document as any).fonts;
    if (firstFamily && fontApi && typeof fontApi.load === 'function') {
      ['400 1em', '700 1em', '800 1em'].forEach((spec) => {
        fontApi.load(spec + ' "' + firstFamily + '"').catch(() => {});
      });
    }

    // Apply font scale to root
    root.style.fontSize = fontScale;
  }, [config]);   // re-run on ANY setting change (incl. fontStyle / customFontFamily)

  // Sync state changes with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save site configuration to localStorage:', e);
    }
  }, [config]);

  // Product Operations
  const addProduct = (product: Omit<Product, 'id'> & { id?: number }) => {
    setConfig((prev) => {
      const nextId = product.id ?? Math.max(0, ...prev.products.map((p) => p.id)) + 1;
      const newProd: Product = {
        ...product,
        id: nextId
      };
      return {
        ...prev,
        products: [newProd, ...prev.products]
      };
    });
  };

  const updateProduct = (id: number, updatedFields: Partial<Product>) => {
    setConfig((prev) => ({
      ...prev,
      products: prev.products.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    }));
  };

  const deleteProduct = (id: number) => {
    setConfig((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== id)
    }));
  };

  // Service Operations
  const addService = (service: GarageService) => {
    setConfig((prev) => ({
      ...prev,
      services: [service, ...prev.services]
    }));
  };

  const updateService = (id: string, updatedFields: Partial<GarageService>) => {
    setConfig((prev) => ({
      ...prev,
      services: prev.services.map((s) => (s.id === id ? { ...s, ...updatedFields } : s))
    }));
  };

  const deleteService = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s.id !== id)
    }));
  };

  // Vehicle Operations
  const addVehicle = (vehicle: Omit<Vehicle, 'id'> & { id?: number }) => {
    setConfig((prev) => {
      const nextId = vehicle.id ?? Math.max(0, ...prev.vehicles.map((v) => v.id)) + 1;
      const newVeh: Vehicle = {
        ...vehicle,
        id: nextId
      };
      return {
        ...prev,
        vehicles: [newVeh, ...prev.vehicles]
      };
    });
  };

  const updateVehicle = (id: number, updatedFields: Partial<Vehicle>) => {
    setConfig((prev) => ({
      ...prev,
      vehicles: prev.vehicles.map((v) => (v.id === id ? { ...v, ...updatedFields } : v))
    }));
  };

  const deleteVehicle = (id: number) => {
    setConfig((prev) => ({
      ...prev,
      vehicles: prev.vehicles.filter((v) => v.id !== id)
    }));
  };

  // Site Settings Operations
  const updateSiteSettings = (settings: Partial<SiteConfig>) => {
    setConfig((prev) => ({
      ...prev,
      ...settings
    }));
  };

  const resetToDefaults = () => {
    setConfig(DEFAULT_SITE_CONFIG);
  };

  return (
    <SiteContext.Provider
      value={{
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
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSiteContext = (): SiteContextType => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSiteContext must be used within a SiteProvider');
  }
  return context;
};