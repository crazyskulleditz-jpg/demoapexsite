import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Plus, 
  Check, 
  Star, 
  Tag, 
  ShieldCheck, 
  Layers,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { Product, Language, DetailItem } from '../types';
import { FALLBACK_IMAGE } from './ImageGallery';

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Apex Stage II Tactical Flash Device & OBD Programmer",
    nameAr: "جهاز برمجة وتعديل المحرك Stage II مع كابل الفلاش",
    category: "Performance Upgrades",
    price: 275,
    rating: 5,
    stock: 4,
    partNumber: "APX-ECU-002",
    oemCrossReference: "BOSCH-MED17 / HITACHI-GEN3",
    material: "CNC Billet 6061 Aluminum Case & Gold-Plated OBD Pins",
    installDifficulty: "Medium (Basic Garage)",
    installTime: "1.5 Hours",
    specs: ["+85 WHP Dyno Gain", "Anti-Lag & Launch Control", "Map Switching via Cruise", "Overrun Pops Active Config"],
    specsAr: ["زيادة قوة 85 حصان", "نظام لانش كونترول وانتي لاج", "تبديل الماب عبر أزرار السكان", "تعديل صوت الإكزوزت"],
    description: "Dyno-calibrated ignition curves, aggressive high-boost fuel maps, and linear throttle response profile custom mapped for Gulf fuel quality.",
    descriptionAr: "مابات وقود واحتراق متقدمة لتوليد أعلى أداء مع سرعة استجابة فورية وحماية المحرك من الحرارة العالية.",
    longDescription: "🚀 High-Output Calibration engineered for extreme Kuwait desert climates (up to 55°C ambient). ⚙️ Precision Engineered OEM Fitment directly via OBD2 port without opening ECU enclosure. 🔧 Guaranteed 1-Year Garage Warranty including unlimited re-flashes.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80", // Handheld Flasher
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80", // High Tech Microchip
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80", // Code & Maps
      "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1000&q=80", // Screen Readouts
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80"  // Dyno Diagnostic Test
    ],
    inTheBox: [
      "Apex Stage II Handheld Color Touchscreen Programmer",
      "Heavy-Duty Braided OBD2 CAN-bus Cable (2.5m)",
      "USB-C PC Calibration Link Cable",
      "Apex Dyno Software License Key Card",
      "Magnetic Cockpit Mount Kit"
    ],
    specsTable: {
      "Compatibility Protocol": "ISO 15765-4 (CAN), ISO 14229 (UDS), KWP2000",
      "Flash Duration": "4.5 Minutes Full Read / 2.0 Minutes Cal Write",
      "Map Storage": "Up to 5 Selectable Calibrations (91 Oct, 95 Oct, 98 Oct, Valet, E85)",
      "Safety Limits": "Active Knock Detection & EGT Exhaust Gas Temp Reducer",
      "Payment Method": "Cash on Delivery (COD) / Pay at Bay",
      "Warranty": "2 Years Official Apex Hardware & Binary Map Warranty"
    },
    warranty: "2 Years Unlimited Support",
    compatibility: [
      "2016–2024 Nissan Patrol Y62 V8 5.6L",
      "2015–2024 Toyota Land Cruiser 3.5TT / 5.7L V8",
      "2018–2024 Ford Mustang GT 5.0 / EcoBoost",
      "2017–2023 Porsche 911 (991.2 / 992) Turbo & Carrera",
      "2019–2024 BMW M3 / M4 / M5 (S58 & S63)"
    ],
    reviews: [
      {
        author: "Bader Al-Mutawa",
        rating: 5,
        vehicle: "Nissan Patrol Nismo 2022",
        comment: "Flashed Stage 2 at Apex Shuwaikh. Car gained +72 WHP on the dyno. Paid cash at arrival.",
        date: "2 days ago"
      }
    ]
  },
  {
    id: 2,
    name: "Basic ELM327 Bluetooth 5.0 OBD2 Scanner Tool",
    nameAr: "جهاز كشف وفحص الأعطال البسيط ELM327 بلوتوث 5.0",
    category: "Auto Parts & Hardware",
    price: 9,
    rating: 5,
    stock: 25,
    partNumber: "APX-OBD-ELM9",
    oemCrossReference: "UNIVERSAL-OBD2-ISO15765",
    material: "Impact-Resistant ABS Plastic Shell",
    installDifficulty: "Easy (DIY)",
    installTime: "1 Minute Plug & Play",
    specs: ["Reads & Clears Check Engine (MIL)", "Bluetooth 5.0 Low Energy iOS/Android", "Real-Time Sensor Values", "Over 4,500 Generic & OEM Code Definitions"],
    specsAr: ["قراءة ومسح لمبة المكينة", "بلوتوث 5.0 فائق السرعة للآيفون والأندرويد", "قراءة بيانات الحساسات الحية", "قاعدة بيانات أكثر من 4,500 كود عطل"],
    description: "Affordable budget wireless OBD2 diagnostic scanner tool. Plug into any car's 16-pin diagnostic port to read live error codes directly on your smartphone.",
    descriptionAr: "جهاز فحص كمبيوتر اقتصادي ولاسلكي يشبك على الهاتف فوراً لمسح وفحص أعطال المحرك والحساسات وتوفير تكاليف الكشف.",
    longDescription: "📱 Ultra-affordable plug & play Bluetooth scanner compatible with Torque Pro, OBD Fusion, Car Scanner ELM, and GaragePro. 🔍 Clear engine check lights in seconds. 🚗 Works on 99% of cars made after 1996 in Kuwait.",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1000&q=80", // Scanner Dongle
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80", // Bluetooth PCB
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80", // Smartphone Telemetry
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80", // Port Connection
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80"  // Diagnostics Live
    ],
    inTheBox: [
      "Apex ELM327 Bluetooth 5.0 Diagnostic Dongle",
      "Quick-Start iOS & Android App Setup Guide (Arabic & English)",
      "Protective Storage Case"
    ],
    specsTable: {
      "Protocols Supported": "SAE J1850 PWM, SAE J1850 VPW, ISO9141-2, ISO14230-4, ISO15765-4 CAN",
      "Operating Voltage": "9V - 16V DC",
      "Wireless Range": "Up to 10 Meters",
      "Live Telemetry PIDs": "RPM, STFT/LTFT, O2 Sensor Volts, Coolant Temp, Speed, Intake Pressure",
      "Payment Option": "Cash on Delivery in Kuwait (9 KWD)",
      "Warranty": "1 Year Free Replacement Warranty"
    },
    warranty: "1 Year Replacement Warranty",
    compatibility: ["All Gasoline & Diesel Vehicles with 16-Pin OBD2 Port (1996–2025)"],
    reviews: [
      {
        author: "Nawaf Al-Ajmi",
        rating: 5,
        vehicle: "Toyota Camry 2019",
        comment: "For 9 KWD cash on delivery, this is a lifesaver. Identified code P0171 immediately and turned off the check engine light on my phone.",
        date: "3 days ago"
      }
    ]
  },
  {
    id: 3,
    name: "Apex Electronic Turbo Boost Controller Pro (Dual Solenoid)",
    nameAr: "منظم ضغط التوربو الإلكتروني Pro مع صمام مزدوج وشاشة OLED",
    category: "Performance Upgrades",
    price: 140,
    rating: 5,
    stock: 2,
    partNumber: "APX-BST-990",
    oemCrossReference: "UNIVERSAL-TURBO-CONTROLLER-50PSI",
    material: "Anodized Aerospace 6061 Billet Aluminum & Silicone Vacuum Hoses",
    installDifficulty: "Medium (Basic Garage)",
    installTime: "2.5 Hours",
    specs: ["Dual High-Flow Fast-Rate Solenoid", "Overboost Protection Safe Valve", "OLED Cockpit HUD Display", "Gear-Dependent Boost Curves"],
    specsAr: ["سولينويد مزدوج سريع الاستجابة", "صمام حماية ضد الضغط الزائد", "شاشة عرض OLED للكبينة", "برمجة الضغط حسب كل غيار"],
    description: "Closed-loop micro-stepper boost management system with instant gear-dependent pressure tables capable of holding up to 45 PSI rock solid.",
    descriptionAr: "تحكم إلكتروني ذكي في ضغط التيربو حسب الغيار لتوفير ثبات وقوة خيالية مع حماية التوربو من الانفجار.",
    longDescription: "⚡ Accurate closed-loop boost tables that prevent turbo lag. 🏎️ Dual high-flow MAC solenoids engineered for high boost targets. 🔧 Complete cockpit harness and silicone hose pack included.",
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1000&q=80", // Unit Front
      "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1000&q=80", // Dual Solenoids Assembly
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80", // Microcontroller HUD
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80", // Vacuum Plumbing
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80"  // In-Cabin Display
    ],
    inTheBox: [
      "Apex Pro Boost Controller OLED Head Unit (52mm Gauge Style)",
      "High-Frequency Dual MAC Solenoid Block",
      "4-Bar (58 PSI) Internal MAP Sensor",
      "3-Meter High-Temperature Reinforced Silicone Vacuum Hose",
      "Brass T-Fittings & Stainless Steel Clamps",
      "Pre-Terminated Cockpit Wiring Loom"
    ],
    specsTable: {
      "Max Pressure Rating": "50 PSI (3.45 BAR)",
      "Duty Cycle Resolution": "0.1% Micro-Step PWM Adjustment",
      "Display Type": "1.5-inch High-Contrast OLED with Peak Hold & Warning Beep",
      "Scramble Boost Feature": "Steering-Wheel Button Instant +5 PSI Burst for 10 Sec",
      "Warranty": "2-Year Unlimited Replacement Warranty"
    },
    warranty: "2 Years Official Warranty",
    compatibility: ["All Single and Twin Turbocharged Gas & Diesel Vehicles with Wastegate/Actuator"],
    reviews: [
      {
        author: "Ali Al-Fadhel",
        rating: 5,
        vehicle: "Nissan Patrol TB48 Turbo",
        comment: "Holds 22 PSI steady all the way to 7,500 RPM on desert sand dunes. Zero boost spike.",
        date: "2 weeks ago"
      }
    ]
  },
  {
    id: 4,
    name: "Walbro TI Automotive 450LPH High-Pressure Fuel Pump",
    nameAr: "طرمبة بنزين والبرو رياضية 450 لتر/ساعة أصلية E85",
    category: "Auto Parts & Hardware",
    price: 55,
    rating: 5,
    stock: 8,
    partNumber: "WAL-450-F90000274",
    oemCrossReference: "TI-AUTOMOTIVE-E85-450LPH",
    material: "Dual Channel Single Stage (DCSS) Turbine Blades",
    installDifficulty: "Medium (Basic Garage)",
    installTime: "2.0 Hours",
    specs: ["450 Liters Per Hour Flow Rate", "E85, Race Gas & 98 Octane Certified", "Supports 750+ WHP Forced Induction", "Drop-In In-Tank Universal Design"],
    specsAr: ["معدل تدفق 450 لتر في الساعة", "معتمدة لوقود E85 والبنزين العالي", "تدعم حتى 750+ حصان", "تركيب مباشر داخل التانكي"],
    description: "Genuine Walbro/TI Automotive high-pressure turbine fuel pump delivering uncompromised high-volume flow for modified turbo applications.",
    descriptionAr: "طرمبة بنزين أصلية عالية التدفق لمنع نقص الوقود وتفادي كسر المحرك أو ذوبان البساتن عند التسارع العالي.",
    longDescription: "⛽ Essential hardware upgrade for Stage 2 & 3 tuning setups to prevent dangerous lean fuel conditions under boost. 🛡️ 100% Genuine TI Automotive made in USA.",
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1000&q=80", // Fuel Pump Unit
      "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1000&q=80", // Filter Strainer & Pigtail
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80", // Submersible Hose
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80", // High Amp Relay
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80"  // Tank Drop-in
    ],
    inTheBox: [
      "Walbro F90000274 450LPH In-Tank Fuel Pump",
      "High-Flow Cleanable Filter Sock / Strainer",
      "E85-Rated Submersible Fuel Hose",
      "High-Amp Wiring Pigtail Harness & Crimp Terminals",
      "Stainless Steel Hose Clamps"
    ],
    specsTable: {
      "Flow at 40 PSI (2.75 BAR)": "450 LPH @ 13.5V",
      "Flow at 80 PSI (5.5 BAR)": "375 LPH @ 13.5V",
      "Inlet Diameter": "11mm OD",
      "Outlet Diameter": "9mm OD",
      "Operating Pressure": "Up to 112 PSI Peak",
      "Warranty": "1-Year Genuine Manufacturer Warranty"
    },
    warranty: "1 Year Official Warranty",
    compatibility: [
      "Nissan Patrol Y62 V8 / TB48",
      "Toyota Land Cruiser 3.5TT / 4.0L / 5.7L",
      "Ford Mustang GT 5.0 Coyote",
      "Chevrolet Corvette / Camaro / Tahoe 5.3 & 6.2L",
      "Dodge Charger / Challenger 5.7L & 6.4L Hemi"
    ],
    reviews: [
      {
        author: "Saad Al-Dousari",
        rating: 5,
        vehicle: "GMC Sierra 6.2L Supercharged",
        comment: "Solved my lean AFR issues on the dyno immediately. Solid fuel pressure all the way to redline.",
        date: "1 month ago"
      }
    ]
  },
  {
    id: 5,
    name: "NGK Laser Iridium Racing Spark Plugs (Set of 8)",
    nameAr: "بواجي ليزر إيريديوم رياضية NGK أصلية (طقم 8 حبات)",
    category: "Auto Parts & Hardware",
    price: 38,
    rating: 5,
    stock: 14,
    partNumber: "NGK-IRID-6619-LFR6AIX",
    oemCrossReference: "NGK-6619 / DENSO-IKH20",
    material: "Laser-Welded 0.6mm Iridium Center Electrode & Platinum Ground",
    installDifficulty: "Easy (DIY)",
    installTime: "45 Minutes",
    specs: ["1 Heat Range Colder for Turbo/Tune", "Ultra-Fine 0.6mm Iridium Tip", "Anti-Fouling Trivalent Metal Plating", "Pre-Gapped to 0.032 inch"],
    specsAr: ["درجة تبريد أبرد للمحركات المعدلة", "رأس إيريديوم فائق الدقة 0.6 مم", "مقاومة عالية للرواسب والحرارة", "مضبوطة الخلوص مسبقاً"],
    description: "High-performance spark plugs engineered specifically for tuned forced induction and high-compression desert applications in Kuwait.",
    descriptionAr: "بواجي رياضية توفر شرارة قوية ومستقرة لمنع الميسفاير تحت الضغط العالي والحرارة المرتفعة.",
    longDescription: "⚡ Maximum spark stability under high cylinder pressures. 🏎️ Prevents high-rpm misfires and spark blow-out under boost. 🛡️ Trivalent metal plating provides superior anti-corrosion properties.",
    image: "https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?auto=format&fit=crop&w=1000&q=80", // Spark Plugs Box
      "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1000&q=80", // Electrode Detail
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1000&q=80", // Engine Installation
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80", // Gap Measurement Tool
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80"  // 8 Plugs Layout
    ],
    inTheBox: [
      "8x Genuine NGK Laser Iridium Spark Plugs (Individual Factory Sleeved)",
      "Electrode Protective Gap Sleeves",
      "Authenticity QR Code Verification Seal"
    ],
    specsTable: {
      "Thread Size": "14mm x 1.25",
      "Reach": "26.5mm (Long Reach)",
      "Hex Size": "16mm (5/8 inch)",
      "Heat Range": "6 (1 Step Colder for High Boost)",
      "Service Life": "80,000 to 100,000 KM"
    },
    warranty: "100% Authenticity Guaranteed",
    compatibility: [
      "Nissan Patrol Y62 5.6L V8 (VK56VD / VK56DE)",
      "Toyota Land Cruiser 4.6L & 5.7L V8 (1UR / 3UR)",
      "Lexus LX570 / GX460",
      "Infiniti QX80 / QX70 V8"
    ],
    reviews: [
      {
        author: "Mishal Al-Otaibi",
        rating: 5,
        vehicle: "Nissan Patrol Y62 2020",
        comment: "Eliminated cylinder 4 misfire code P0304 after my Stage 1 tune. Smooth idle even with 50°C summer heat.",
        date: "3 weeks ago"
      }
    ]
  },
  {
    id: 6,
    name: "Apex Track Telemetry IMU Logger with Kuwait Motor Town Maps",
    nameAr: "مسجل بيانات الحلبات والتسارع IMU مع خرائط مدينة الكويت للمحركات",
    category: "Performance Upgrades",
    price: 185,
    rating: 5,
    stock: 6,
    partNumber: "APX-LOG-100HZ-KMT",
    oemCrossReference: "APEX-MOTORSPORT-IMU-GEN2",
    material: "CNC Aluminum Housing & Gorilla Glass Display",
    installDifficulty: "Easy (DIY)",
    installTime: "5 Minutes Suction Mount",
    specs: ["100Hz 6-Axis High-G IMU Accelerometer", "Dual-Band 20Hz Multiconstellation GNSS", "Pre-Loaded Kuwait Motor Town Circuit Layouts", "0-100 & 100-200 KM/H Live Drag Timer"],
    specsAr: ["حساسات جاذبية 100 هيرتز", "جي بي إس مزدوج 20 هيرتز", "خريطة حلبة مدينة الكويت لرياضة المحركات جاهزة", "توقيت تسارع 0-100 و 100-200 لايف"],
    description: "High-frequency precision track logging device measuring braking points, corner G-forces, lap deltas, and 1/4 mile drag times.",
    descriptionAr: "جهاز قياس التسارع 0-100 وتوقيت اللفات على الحلبة بدقة متناهية مع تحليل زوايا الفرامل والسرعة القصوى.",
    longDescription: "⏱️ Precision 20Hz GNSS lap timing accurate to 0.01 seconds. 🏁 Pre-loaded Kuwait Motor Town Grand Prix, Club, and South layouts. 📊 High-precision 6-axis G-force analysis with smartphone cloud sync.",
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1000&q=80", // Unit Front HUD
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80", // In-Car Windshield Mount
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80", // Track Telemetry Screen
      "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=1000&q=80", // Drag Mode
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80"  // GPS Antenna
    ],
    inTheBox: [
      "Apex Track Telemetry 20Hz GPS Display Unit",
      "Heavy-Duty Locking Windshield Suction Mount",
      "External High-Gain Active GNSS Antenna (Roof Mount Option)",
      "USB-C Fast Charging Cable & 12V Dual Fast Charger",
      "Hard Shell Protective Travel Case"
    ],
    specsTable: {
      "GNSS Engine": "20Hz GPS + GLONASS + Galileo Dual-Band Concurrent",
      "Accelerometer": "100Hz 3-Axis Gyro + 3-Axis ±16G Accelerometer",
      "Battery Life": "Up to 8.5 Hours Continuous Track Logging",
      "Internal Storage": "32GB High-Speed Flash (Stores 2,000+ Track Sessions)",
      "Connectivity": "Wi-Fi 802.11ac + Bluetooth 5.0 Cloud Auto-Sync"
    },
    warranty: "1 Year Official Warranty",
    compatibility: ["Universal 12V / USB — Works with all Cars, Motorcycles & UTVs"],
    reviews: [
      {
        author: "Hamad Al-Sabah",
        rating: 5,
        vehicle: "Porsche 911 GT3 (992)",
        comment: "Used at Kuwait Motor Town Track Day. The delta sector timing gave me instant feedback to shave 1.4 seconds off my personal best.",
        date: "1 week ago"
      }
    ]
  }
];

interface ProductGridProps {
  language: Language;
  filterCategory?: 'Performance Upgrades' | 'Auto Parts & Hardware' | 'All';
  onAddToCart: (product: Product) => void;
  onSelectDetail: (item: DetailItem) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  language, 
  filterCategory = 'All',
  onAddToCart,
  onSelectDetail
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(filterCategory);
  const [addedIds, setAddedIds] = useState<number[]>([]);

  const isAr = language === 'ar';

  const categories = [
    { id: 'All', labelEn: 'All Catalog', labelAr: 'جميع المنتجات' },
    { id: 'Performance Upgrades', labelEn: '⚡ Performance Upgrades', labelAr: '⚡ قطع التعديل والبرمجة' },
    { id: 'Auto Parts & Hardware', labelEn: '🔩 Auto Parts & Hardware', labelAr: '🔩 قطع الغيار والأجهزة' }
  ];

  const filteredProducts = selectedCategory === 'All'
    ? SAMPLE_PRODUCTS
    : SAMPLE_PRODUCTS.filter(p => p.category === selectedCategory);

  const handleAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedIds(prev => [...prev, product.id]);
    setTimeout(() => {
      setAddedIds(prev => prev.filter(id => id !== product.id));
    }, 1500);
  };

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600 mb-2">
              <Zap className="w-4 h-4" />
              <span>{isAr ? 'متجر القطع والتعديل والأجهزة' : 'Performance Parts & Hardware Tools Store'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {isAr ? 'قطع الغيار وأجهزة الفحص والبرمجة' : 'High-Performance Store & Diagnostics'}
            </h2>
            <div className="h-1 w-20 bg-sky-600 rounded-full mt-3" />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {isAr ? cat.labelAr : cat.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid - Entire Card is Clickable */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          <AnimatePresence>
            {filteredProducts.map((product) => {
              const isAdded = addedIds.includes(product.id);
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                  key={product.id}
                  whileHover={{ y: -6 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectDetail({ type: 'product', data: product })}
                  className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-sky-100 hover:border-sky-300 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    {/* Image Banner */}
                    <div className="h-52 relative overflow-hidden bg-slate-100">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-mono font-bold text-slate-700">
                        {product.partNumber}
                      </div>

                      <div className="absolute top-3 right-3 bg-sky-600 text-white px-2.5 py-1 rounded-md text-[10px] font-bold">
                        {product.stock} {isAr ? 'قطع متبقية' : 'IN STOCK'}
                      </div>

                      {/* Photo Counter */}
                      <div className="absolute bottom-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                        📸 {product.gallery.length} Photos
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(product.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors mb-2">
                        {isAr && product.nameAr ? product.nameAr : product.name}
                      </h3>

                      <p className="text-xs text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                        {isAr && product.descriptionAr ? product.descriptionAr : product.description}
                      </p>

                      {/* Specs */}
                      <div className="space-y-1 mb-5">
                        {(isAr && product.specsAr ? product.specsAr : product.specs).slice(0, 3).map((spec, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                            <span>{spec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <div>
                      <div className="text-[10px] font-bold uppercase text-slate-400">{isAr ? 'السعر نقداً' : 'CASH PRICE'}</div>
                      <div className="text-2xl font-black text-slate-900">
                        {product.price} <span className="text-xs text-slate-500 font-normal">KWD</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleAdd(e, product)}
                      disabled={isAdded}
                      className={`px-4 py-2.5 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-sm active:scale-95 ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-sky-600 hover:bg-sky-500 text-white'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4 stroke-[2.5]" />
                          <span>{isAr ? 'تم الإضافة' : 'Added'}</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 stroke-[2.5]" />
                          <span>{isAr ? 'أضف للسلة' : 'Add to Cart'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
};