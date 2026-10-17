export type Language = 'en' | 'ar';

export type PageView = 
  | 'home' 
  | 'diagnostics' 
  | 'performance' 
  | 'parts' 
  | 'showroom' 
  | 'product-detail'
  | 'account';

export interface UserVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  engineTrim: string;
  plateNumber?: string;
  vinNumber?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role?: string;
  savedVehicles: UserVehicle[];
  paymentMethod?: string;
  createdAt?: string;
}

export interface BookingRecord {
  id: string;
  serviceId: string;
  serviceTitle: string;
  vehicleInfo: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  date: string;
  timeSlot: string;
  status: 'Confirmed' | 'Car Received' | 'In Service Bay' | 'Ready for Pickup' | 'Completed';
  paymentStatus: 'Paid' | 'Pending in Garage' | 'Deposit Paid';
  totalAmount: number;
  laborFee: number;
  partsFee: number;
  createdAt: string;
}

export interface OrderRecord {
  id: string;
  userId?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  shippingAddress?: string;
  items: {
    productName: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  deliveryFee: number;
  status: 'Processing' | 'Dispatched' | 'Delivered' | 'Ready for Workshop Pickup' | 'Cancelled';
  paymentMethod: string;
  date: string;
  trackingNumber: string;
  dateAr?: string;
  name?: string;
  nameAr?: string;
  title?: string;
  titleAr?: string;
  itemName?: string;
  itemNameAr?: string;
  item_name?: string;
  productNameAr?: string;
  product_name?: string;
  partName?: string;
  partNameAr?: string;
  part_name?: string;
  description?: string;
  descriptionAr?: string;
  desc?: string;
  item?: string;
  label?: string;
  labelAr?: string;
  summary?: string;
  summaryAr?: string;
  details?: string;
  qty?: number;
  count?: number;
  total?: number;
  subtotal?: number;
  paymentMethodAr?: string;
  statusAr?: string;
  parts?: unknown[];
  products?: unknown[];
  services?: unknown[];
  jobs?: unknown[];
  breakdown?: unknown[];
}

export interface TestDriveRecord {
  id: string;
  vehicleId: number;
  vehicleName: string;
  customerName?: string;
  customerPhone?: string;
  location: string;
  date: string;
  status: 'Pending Confirmation' | 'Confirmed VIP Slot' | 'Completed' | 'Cancelled';
  advisorName: string;
  advisorPhone: string;
}

export interface ReceiptBreakdown {
  transactionId: string;
  type: 'Service' | 'Part Order' | 'Showroom Reservation';
  title: string;
  date: string;
  items: {
    description: string;
    cost: number;
  }[];
  laborCost?: number;
  partsCost?: number;
  deliveryOrBayFee: number;
  totalKWD: number;
  paymentMethod: string;
}

export type StoreCategory = 
  | 'Performance Upgrades' 
  | 'Auto Parts & Hardware' 
  | 'Diagnosing & Repairing' 
  | 'Vehicles for Sale'
  | 'Performance'
  | 'Auto Parts & Tools'
  | 'Diagnostics & Repairing'
  | 'Vehicle Sales';

export interface Product {
  id: number;
  name: string;
  nameAr?: string;
  category: StoreCategory;
  price: number; // in KWD
  priceDisplay?: string;
  rating: number;
  specs: string[];
  specsAr?: string[];
  description: string;
  descriptionAr?: string;
  longDescription?: string;
  image: string;
  images?: string[];
  gallery: string[];
  stock: number;
  partNumber: string;
  oemCrossReference?: string;
  material?: string;
  installDifficulty?: 'Easy (DIY)' | 'Medium (Basic Garage)' | 'Expert (Master Mechanic)' | '1/5 (Plug & Play)' | '2/5 (Basic Hand Tools)' | '3/5 (Moderate Garage)' | '4/5 (Advanced Tuner)' | '5/5 (Engine Out Rebuild)' | string;
  installTime?: string;
  inTheBox?: string[];
  specsTable?: Record<string, string>;
  warranty: string;
  compatibility?: string[];
  isConsultation?: boolean;
  reviews?: Array<{
    author: string;
    rating: number;
    comment: string;
    date: string;
    vehicle: string;
  }>;
}

export interface Vehicle {
  id: number;
  name: string;
  nameAr?: string;
  brand: string;
  model: string;
  year: number;
  condition: string;
  inspectionScore: string;
  mileage: string;
  engine: string;
  engineDisplacement: string;
  power: string;
  powerTorque: string;
  transmission: string;
  drivetrain: string;
  exteriorTrim: string;
  exteriorColorPaintCode: string;
  interiorTrim: string;
  interiorTrimColor: string;
  fuelTankCapacity: string;
  ownershipHistory: string;
  vinStockId: string;
  inspectionHistory: string;
  price: number; // in KWD
  image: string;
  images?: string[];
  gallery: string[];
  badge: string;
  featured?: boolean;
  location: string;
  description: string;
  warranty: string;
  specs: string[];
  specsTable?: Record<string, string>;
  compatibility?: string[];
  inTheBox?: string[];
  reviews?: Array<{
    author: string;
    rating: number;
    comment: string;
    date: string;
    vehicle: string;
  }>;
}

export interface GarageService {
  id: string;
  title: string;
  titleAr?: string;
  duration: string;
  price: number; // in KWD
  priceDisplay?: string;
  description: string;
  descriptionAr?: string;
  longDescription?: string;
  icon: string;
  image: string;
  images?: string[];
  gallery: string[];
  popular?: boolean;
  isConsultation?: boolean;
  features: string[];
  featuresAr?: string[];
  workSteps?: string[];
  includedFluids?: string[];
  specsTable?: Record<string, string>;
  compatibility?: string[];
  inTheBox?: string[];
  warranty: string;
  reviews?: Array<{
    author: string;
    rating: number;
    comment: string;
    date: string;
    vehicle: string;
  }>;
  specs?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface DTCResult {
  code: string;
  description: string;
  severity: 'LOW' | 'MODERATE' | 'CRITICAL';
  suggestedFix: string;
  matchingProductId?: number;
}

export type DetailItem = 
  | { type: 'product'; data: Product }
  | { type: 'service'; data: GarageService }
  | { type: 'vehicle'; data: Vehicle };