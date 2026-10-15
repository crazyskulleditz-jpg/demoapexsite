// src/context/CatalogContext.tsx
//
// The storefront grids need to read the LIVE catalog, but they cannot import
// SiteContext: SiteContext imports the seed arrays FROM those same components,
// so importing it back would create a circular import and DEFAULT_SITE_CONFIG
// could end up with empty products/services/vehicles depending on load order.
//
// This module imports types only. No cycle. No risk.

import { createContext, useContext } from 'react';
import type { Product, GarageService, Vehicle } from '../types';

export interface CatalogShape {
  products: Product[];
  services: GarageService[];
  vehicles: Vehicle[];
}

const EMPTY: CatalogShape = { products: [], services: [], vehicles: [] };

export const CatalogContext = createContext<CatalogShape>(EMPTY);

export const useCatalog = (): CatalogShape => useContext(CatalogContext);

