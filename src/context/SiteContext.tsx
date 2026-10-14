import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SiteConfig, SiteContextType } from '../types/admin';
import { Product, GarageService, Vehicle } from '../types';
import { SAMPLE_PRODUCTS } from '../components/ProductGrid';
import { GARAGE_SERVICES } from '../components/ServicesSection';
import { SHOWROOM_VEHICLES } from '../components/ShowroomGrid';

const STORAGE_KEY = 'apex_torque_site_config_v1';

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  phone: '+965 2200 2739',
  whatsapp: '+965 9900 1234',
  location: 'Shuwaikh Industrial Area 1, Block 2, Street 18, Kuwait City',
  themeColor: '#0284c7', // Sky-600
  fontStyle: 'sans',
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
  const updateSiteSettings = (
    settings: Partial<Pick<SiteConfig, 'phone' | 'whatsapp' | 'location' | 'themeColor' | 'fontStyle'>>
  ) => {
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
