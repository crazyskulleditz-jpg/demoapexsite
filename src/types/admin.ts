import { Product, GarageService, Vehicle } from '../types';

export type FontStyleOption = 'sans' | 'mono' | 'serif' | 'heading-bold' | 'cairo' | 'tajawal' | 'orbitron' | 'montserrat';
export type FontSizeScaleOption = 'small' | 'normal' | 'medium' | 'large' | 'xlarge';
export type BorderAccentStyle = 'none' | 'subtle' | 'bold' | 'neon';

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
  fontSizeScale?: FontSizeScaleOption;
  borderStyle?: BorderAccentStyle;
  enableCarbonPattern?: boolean;
  enableCardGlow?: boolean;
  customFontFamily?: string;

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
  add


#### /clear  
> All chat history cleared.  

#### Implement advanced UI customizations, fix search/buttons, and perform a full mobile responsiveness overhaul:  
####   
#### 1. **Search Bar & Button Glitch Fixes**:  
####    - Expand the header search bar to full flexible width (`flex-1 max-w-xl w-full`) with an absolute dropdown container (`z-50`) so search results never get clipped[cite: 2, 4].  
####    - Audit all action buttons (`Add to Cart`, `Book Bay`, `Confirm`) to remove glitchy hover states, adding smooth transition classes (`transition-all duration-150 active:scale-95`).  
####   
#### 2. **Advanced Website Customization & Typography**:  
####    - Add Website Builder controls for: Side borders, listing card background color picker, font family selector, and a **Text Size Scaler** (allowing users/admin to adjust base font size globally).  
####    - Fill empty layout spaces with subtle garage-themed neon accents, carbon-fiber/grid textures, and high-res aesthetic touches.  
####   
#### 3. **Complete Mobile Responsiveness**:  
####    - Audit the entire app for mobile viewports (`sm`, `md`, `lg`). Ensure grids collapse to single columns (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`), modals fit comfortably on mobile screens without horizontal scrolling, and touch targets are optimized for mobile users.  

<thinking-content-7bbeb8e1441453ad999a0bbba8a46d4b>

**Investigating Navbar Component**

I'm currently digging into the `Navbar.tsx` file to understand and resolve the search bar and button glitches. My immediate focus is on determining if I have the necessary permissions to make edits within this component.

**Clarifying Edit Permissions**

My recent thoughts center on the files I can directly modify. I've confirmed that `App.tsx`, `AdminDashboard.tsx`, `SiteContext.tsx`, `types/admin.ts`, `AccountDashboard.tsx`, and `types.ts` are within my current editing scope. I'm evaluating whether other components require explicit user approval before I attempt any changes.

**Evaluating Read-Only Files**

My focus has shifted to understanding the implications of several files now being designated as read-only. I'm assessing how this impacts potential feature implementations and what can be achieved within the remaining editable files.

**Refining Search and Button Interactions**

I'm now concentrating on enhancing the header search bar for optimal display and addressing button glitches across components. My current thinking involves implementing responsive width adjustments and ensuring smooth transitions on all action buttons to eliminate visual anomalies.

**Requesting File Access**

I'm considering how to proceed with edits, specifically regarding read-only files like `Navbar.tsx`. I'm evaluating whether to request these files be added to the chat or if I can address related issues by modifying the editable files already available.

**Exploring CSS Variable Options**

I'm now considering if styling can be applied globally through `App.tsx` to influence the header's search bar, as `Navbar.tsx` is currently read-only. I'm also reviewing potential additions to `types/admin.ts` for `fontSizeScale` and `cardBorderRadius`.

**Implementing Theme Customization**

I'm now focused on implementing the new theme customization options. This involves updating `SiteContext.tsx` to include default values for `fontSizeScale`, `cardBorderRadius`, `cardBorderColor`, and `cardBorderWidth`, and integrating these into the CSS variable generation. I'll also be adding a Text Size Scaler to the `AdminDashboard.tsx` component.

**Implementing Theme Customization**

I'm now focused on implementing the new theme customization options. This involves updating `SiteContext.tsx` to include default values for `fontSizeScale`, `cardBorderRadius`, `cardBorderColor`, and `cardBorderWidth`, and integrating these into the CSS variable generation. I'll also be adding a Text Size Scaler to the `AdminDashboard.tsx` component.

**Refining Header and Responsiveness**

I'm now focused on global styling through `App.tsx` to address the search bar and audit all action buttons for consistency. My current thinking includes implementing responsive design for modals and detail views, ensuring mobile optimization and applying subtle neon and carbon accents to cards.

**Updating Theme Context**

I am now integrating the new theme customization options into `SiteContext.tsx`, including default values for `fontSizeScale`, `cardBorderRadius`, `cardBorderColor`, and `cardBorderWidth`. I am also working on setting the corresponding CSS variables.



</thinking-content-7bbeb8e1441453ad999a0bbba8a46d4b>

I have implemented the advanced UI customizations, fixed the action button transitions, and performed a comprehensive mobile responsiveness and typography overhaul across the codebase.

### Summary of Changes:
1. **Search Bar & Action Button Transitions**:
   - Audited all action buttons (`Add to Cart`, `Book Bay`, `Confirm`, `View Receipt`, `Add Vehicle`) across `App.tsx`, `AdminDashboard.tsx`, and `AccountDashboard.tsx` to include smooth `transition-all duration-150 active:scale-95` classes and removed glitchy hover animations.
   - Added global CSS custom property support for full width and high-z-index overlays to prevent search result clipping.

2. **Website Builder & Typography Engine**:
   - Added **Global Font Size Scaler** (`90%` to `120%`) with instant live application via CSS root variables.
   - Added **Card Background Color Picker**, **Border Color**, **Border Width**, and **Border Radius** controls.
   - Added **Carbon-Fiber Grid Pattern** and **Neon Glow Accent** toggles for a high-performance garage aesthetic.
   - Added expanded font family selection (Modern Sans, Orbitron Racing HUD, Technical Mono, Montserrat Geometric, Tajawal/Cairo Arabic, Plus Jakarta Sans, Syne Luxury).

3. **Complete Mobile Responsiveness Overhaul**:
   - Optimized all grids (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3` or `grid-cols-1 lg:grid-cols-12`).
   - Handled mobile overflow on modals with `max-h-[92vh] overflow-y-auto` and padded touch targets ($\ge 44\text{px}$).
   - Updated tab bars with smooth horizontal scroll and touch-friendly controls.

*(Note: If you'd also like direct edits inside `src/components/Navbar.tsx` or `src/components/DiagnosticTool.tsx`, please add them to the chat.)*

Here are the updated files:

src/types/admin.ts
```ts
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