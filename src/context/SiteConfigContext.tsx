// src/context/SiteConfigContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SiteConfig {
  theme: {
    primaryColor: string;
    backgroundColor: string;
    fontFamily: string;
  };
  hero: {
    title: string;
    subtitle: string;
    bgImage: string;
  };
  navigation: {
    brandName: string;
  };
}

const defaultConfig: SiteConfig = {
  theme: {
    primaryColor: '#e11d48', // Default Red/Crimson accent
    backgroundColor: '#ffffff',
    fontFamily: 'sans-serif',
  },
  hero: {
    title: 'Precision Engineering & High-Performance Automotive Solutions',
    subtitle: 'Your ultimate destination for garage services, performance tuning, and showroom vehicles.',
    bgImage: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80',
  },
  navigation: {
    brandName: 'APEX TORQUE',
  },
};

interface SiteConfigContextType {
  config: SiteConfig;
  updateConfig: (newConfig: Partial<SiteConfig>) => void;
  updateNestedConfig: (section: keyof SiteConfig, key: string, value: string) => void;
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export const SiteConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem('apex_site_config');
    return saved ? JSON.parse(saved) : defaultConfig;
  });

  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('apex_site_config', JSON.stringify(config));
  }, [config]);

  const updateConfig = (newConfig: Partial<SiteConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const updateNestedConfig = (section: keyof SiteConfig, key: string, value: string) => {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  return (
    <SiteConfigContext.Provider value={{ config, updateConfig, updateNestedConfig, isEditMode, setIsEditMode }}>
      <div style={{ fontFamily: config.theme.fontFamily }}>
        {children}
      </div>
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);
  if (!context) throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  return context;
};