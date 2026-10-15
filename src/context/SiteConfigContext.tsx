// src/context/SiteConfigContext.tsx
//
// FIXED: there used to be TWO stores of truth.
//
//   SiteContext       -> "apex_torque_site_config_v2"  (the real one, ~1 MB, written
//                        by the admin panel and the Website Builder)
//   SiteConfigContext -> "apex_site_config"            (414 bytes of hardcoded
//                        defaults that NOTHING ever updated)
//
// That is why the storefront did not match the admin panel: anything reading
// useSiteConfig() got #ffffff / #e11d48 forever, while the rest of the site got
// your real theme from SiteContext.
//
// Now the values are DERIVED from SiteContext and writes are routed into the same
// store. The public API is unchanged, so no other file needs to change.

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useSiteContext } from './SiteContext';

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
    primaryColor: '#e11d48',
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

const SITE_KEY = 'apex_torque_site_config_v2';
const LEGACY_KEY = 'apex_site_config';

// nested shape (this file) <-> flat shape (SiteContext)
const FIELD_MAP: Record<string, Record<string, string>> = {
  theme: { primaryColor: 'themeColor', backgroundColor: 'pageBg', fontFamily: 'customFontFamily' },
  hero: { title: 'heroTitle', subtitle: 'heroSubtitle', bgImage: 'bgMediaUrl' },
  navigation: { brandName: 'siteName' },
};

function deriveFromSite(siteConfig: any): SiteConfig {
  const c = siteConfig || {};
  return {
    theme: {
      primaryColor: c.themeColor || defaultConfig.theme.primaryColor,
      backgroundColor: c.pageBg || defaultConfig.theme.backgroundColor,
      fontFamily: c.customFontFamily || defaultConfig.theme.fontFamily,
    },
    hero: {
      title: c.heroTitle || defaultConfig.hero.title,
      subtitle: c.heroSubtitle || defaultConfig.hero.subtitle,
      bgImage: c.bgMediaUrl || defaultConfig.hero.bgImage,
    },
    navigation: {
      brandName: c.siteName || defaultConfig.navigation.brandName,
    },
  };
}

function persistFlat(patch: Record<string, string>) {
  try {
    const raw = localStorage.getItem(SITE_KEY);
    const blob = raw ? JSON.parse(raw) : {};
    localStorage.setItem(SITE_KEY, JSON.stringify({ ...blob, ...patch }));
  } catch (e) {
    console.error('SiteConfigContext: could not persist to ' + SITE_KEY, e);
  }
}

export const SiteConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const site = useSiteContext();
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const base = deriveFromSite((site as any)?.config);

  const config: SiteConfig = {
    theme: {
      primaryColor: overrides.themeColor ?? base.theme.primaryColor,
      backgroundColor: overrides.pageBg ?? base.theme.backgroundColor,
      fontFamily: overrides.customFontFamily ?? base.theme.fontFamily,
    },
    hero: {
      title: overrides.heroTitle ?? base.hero.title,
      subtitle: overrides.heroSubtitle ?? base.hero.subtitle,
      bgImage: overrides.bgMediaUrl ?? base.hero.bgImage,
    },
    navigation: {
      brandName: overrides.siteName ?? base.navigation.brandName,
    },
  };

  const updateNestedConfig = (section: keyof SiteConfig, key: string, value: string) => {
    const map = FIELD_MAP[section as string];
    const flatKey = map ? map[key] : undefined;
    if (flatKey) {
      setOverrides((prev) => ({ ...prev, [flatKey]: value }));
      persistFlat({ [flatKey]: value });
    }
    try {
      const raw = localStorage.getItem(LEGACY_KEY);
      const legacy = raw ? JSON.parse(raw) : {};
      legacy[section as string] = { ...(legacy[section as string] || {}), [key]: value };
      localStorage.setItem(LEGACY_KEY, JSON.stringify(legacy));
    } catch (e) {
      // non fatal
    }
  };

  const updateConfig = (newConfig: Partial<SiteConfig>) => {
    Object.keys(newConfig).forEach((section) => {
      const val: any = (newConfig as any)[section];
      if (val && typeof val === "object") {
        Object.keys(val).forEach((k) => {
          if (typeof val[k] === "string") updateNestedConfig(section as keyof SiteConfig, k, val[k]);
        });
      }
    });
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
  if (!context) throw new Error("useSiteConfig must be used within a SiteConfigProvider");
  return context;
};

