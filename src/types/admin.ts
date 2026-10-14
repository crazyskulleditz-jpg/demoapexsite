import { Product, GarageService, Vehicle } from '../types';

export type FontStyleOption = 'sans' | 'mono' | 'serif' | 'heading-bold' | 'cairo' | 'tajawal' | 'orbitron' | 'montserrat';

export interface SiteConfig {
  phone: string;
  whatsapp: string;
  location: string;
  themeColor: string;
  fontStyle: FontStyleOption;
  customFontFamily?: string;
  headerBg?: string;
  headerText?: string;
  accentColor?: string;
  cardBg?: string;
  footerBg?: string;
  heroBg?: string;
  logoUrl?: string;
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
