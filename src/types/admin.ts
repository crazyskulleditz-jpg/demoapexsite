import { Product, GarageService, Vehicle } from '../types';

export type FontStyleOption = 
  | 'sans' 
  | 'mono' 
  | 'serif' 
  | 'heading-bold' 
  | 'cairo' 
  | 'tajawal' 
  | 'orbitron' 
  | 'montserrat'
  | 'jakarta'
  | 'syne';

export interface SiteConfig {
  siteName: string;
  motto: string;
  logoUrl?: string;
  faviconUrl?: string;
  phone: string;
  whatsapp: string;
  location: string;
  
  // Theme & Color Variables
  themeColor: string;          // Primary Accent
  secondaryAccent: string;     // Secondary Accent / Badges
  accentColor?: string;        // Compatibility alias
  headerBg: string;            // Navbar / Header Background
  headerText?: string;         // Header Text Color
  footerBg: string;            // Footer Background
  cardBg: string;              // Card Background
  pageBg: string;              // Main Page Background
  fontStyle: FontStyleOption;
  customFontFamily?: string;

  // Advanced UI & Typography Controls
  fontSizeScale?: string;       // e.g. '100%', '105%', '110%', '95%'
  cardBorderRadius?: string;    // e.g. '1rem', '1.5rem', '0.75rem'
  cardBorderColor?: string;     // e.g. 'rgba(51, 65, 85, 0.6)'
  cardBorderWidth?: string;     // e.g. '1px', '2px'
  enableCarbonPattern?: boolean;
  enableNeonGlow?: boolean;

  // Background Media System
  bgType?: 'none' | 'image' | 'video';
  bgMediaUrl?: string;
  bgOverlayOpacity?: number;

  // Copy & Announcement
  announcementText?: string;
  announcementTextAr?: string;
  heroTitle?: string;
  heroTitleAr?: string;
  heroSubtitle?: string;
  heroSubtitleAr?: string;
  heroCtaText?: string;
  servicesTitle?: string;
  partsTitle?: string;
  showroomTitle?: string;
  footerAbout?: string;
  footerAboutAr?: string;

  // Widgets
  showAnnouncement?: boolean;
  showObdScanner?: boolean;
  showChatbot?: boolean;
  showSalesToast?: boolean;

  products: Product[];
  services: GarageService[];
  vehicles: Vehicle[];
}

export interface SiteContextType {
  config: SiteConfig;
  addProduct: (product: Omit<Product, 'id'> & { id?: number }) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  addService: (service: GarageService) => void;
  updateService: (id: string, service: Partial<GarageService>) => void;
  deleteService: (id: string) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id'> & { id?: number }) => void;
  updateVehicle: (id: number, vehicle: Partial<Vehicle>) => void;
  deleteVehicle: (id: number) => void;
  updateSiteSettings: (
    settings: Partial<Omit<SiteConfig, 'products' | 'services' | 'vehicles'>>
  ) => void;
  resetToDefaults: () => void;
}
