import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, 
  Gauge, 
  Zap, 
  MapPin, 
  X, 
  CheckCircle2, 
  ShieldCheck,
  Calendar,
  Sparkles,
  FileText
} from 'lucide-react';
import { Vehicle, Language, DetailItem } from '../types';

export const SHOWROOM_VEHICLES: Vehicle[] = [
  {
    id: 101,
    name: "Nissan Patrol Nismo 5.6L V8 (428 HP)",
    nameAr: "نيسان باترول نيسمو 5.6 لتر V8 (428 حصان)",
    brand: "Nissan",
    model: "Patrol Nismo Y62",
    year: 2021,
    condition: "Certified Pre-Owned (Mint Grade)",
    inspectionScore: "98/100 Multi-Point Passed",
    mileage: "38,500 KM",
    engine: "5.6L Naturally Aspirated V8 (VK56VD)",
    engineDisplacement: "5,552 cc (DOHC 32-Valve DIG)",
    power: "428 HP @ 5,800 RPM",
    powerTorque: "428 HP @ 5,800 RPM | 560 Nm @ 4,000 RPM",
    transmission: "7-Speed Automatic with Manual Mode & Rev-Matching",
    drivetrain: "All-Mode 4WD with Rear Differential Lock",
    exteriorTrim: "Pearl White Metallic with Signature Nismo Red Aero Bodykit",
    exteriorColorPaintCode: "Pearl White Metallic (Code: QAB)",
    interiorTrim: "Two-Tone Black & Crimson Red Alcantara with Carbon Fiber Dash Inlays",
    interiorTrimColor: "Black & Nismo Crimson Alcantara (Code: G)",
    fuelTankCapacity: "Super 98 Octane Petrol | 140-Liter Dual Fuel Tanks",
    ownershipHistory: "1 Owner (Kuwait Agency Maintained) | Full Service Records Available",
    vinStockId: "VIN: JN8AZ2NC5MW108921 | Stock #AT-KW-8921",
    inspectionHistory: "150-Point Certified Inspection Passed | Clean Service Record at Shuwaikh Garage | No Accident History",
    price: 16800,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80", // Front 3/4 View
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80", // Rear Profile & Nismo Exhaust
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80", // Cockpit & Alcantara Wheel
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1000&q=80", // 5.6L V8 Engine Bay Clean
      "https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?auto=format&fit=crop&w=1000&q=80", // 22-inch RAYS Forged Alloys
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1000&q=80"  // Dyno Inspection & Undercarriage
    ],
    badge: "NISMO FACTORY SPEC",
    featured: true,
    location: "Shuwaikh VIP Showroom",
    warranty: "APEX Certified Warranty Valid Until Nov 2028 (Engine, Gear & 4WD)",
    description: "Immaculate single-owner Nismo Patrol equipped with Bilstein sport suspension, 22-inch RAYS forged alloys, sports exhaust, and full ceramic paint protection.",
    specs: ["Bilstein Sport Suspension", "22-inch RAYS Forged Alloys", "13-Speaker Bose Audio", "Full Ceramic Coating"],
    specsTable: {
      "Engine Displacement": "5.6L V8 (VK56VD DIG Direct Injection)",
      "Horsepower & Torque": "428 HP @ 5,800 RPM | 560 Nm @ 4,000 RPM",
      "Transmission & Drivetrain": "7-Speed Automatic | All-Mode 4WD + Rear Lock",
      "Exterior Color & Paint Code": "Pearl White Metallic (QAB)",
      "Interior Color & Trim": "Black & Crimson Red Alcantara / Real Carbon Fiber",
      "Fuel Tank Capacity": "140 Liters (Dual Sub-Tank)",
      "Mileage & Model Year": "38,500 km | 2021 Model Year",
      "Ownership & History": "1 Expat Owner (Al-Babtain Kuwait Agency Maintained)",
      "Condition Inspection Score": "98/100 Certified Score (Chassis & Body 100% Original)",
      "VIN & Stock Ref": "JN8AZ2NC5MW108921 | Stock #AT-KW-8921",
      "Warranty Status": "APEX Certified Warranty Valid Until Nov 2028"
    },
    reviews: [
      {
        author: "Khaled Al-Marzouq",
        rating: 5,
        vehicle: "Nissan Patrol Nismo 2021",
        comment: "Inspected the vehicle in person at Shuwaikh. Car is completely immaculate like brand new with flawless paint.",
        date: "5 days ago"
      }
    ]
  },
  {
    id: 102,
    name: "Porsche 911 GT3 Clubsport (992 Generation)",
    nameAr: "بورشه 911 جي تي 3 كلوب سبورت (جيل 992)",
    brand: "Porsche",
    model: "911 GT3 (992)",
    year: 2023,
    condition: "Collector Grade / Mint",
    inspectionScore: "99/100 Multi-Point Passed",
    mileage: "7,800 KM",
    engine: "4.0L Naturally Aspirated Boxer-6",
    engineDisplacement: "3,996 cc (9,000 RPM Redline)",
    power: "502 HP @ 8,400 RPM",
    powerTorque: "502 HP @ 8,400 RPM | 470 Nm @ 6,100 RPM",
    transmission: "7-Speed Porsche Doppelkupplung (PDK)",
    drivetrain: "Rear-Wheel Drive with Electronic Rear Locking Differential (PTV+)",
    exteriorTrim: "Shark Blue with Carbon Fiber Lightweight Roof & Carbon Swan-Neck Wing",
    exteriorColorPaintCode: "Shark Blue (Code: D5C)",
    interiorTrim: "Full Black Leather/Race-Tex with Shark Blue Contrast Stitching & Full Carbon Bucket Seats",
    interiorTrimColor: "Black Race-Tex & Carbon Fiber (Code: 72)",
    fuelTankCapacity: "Super 98 Octane Petrol | 90-Liter Extended Range Fuel Tank",
    ownershipHistory: "1 Owner (Behbehani Porsche Kuwait Maintained) | Service Book Stamped",
    vinStockId: "VIN: WP0AC2A91PS29**** | Stock #AT-KW-9921",
    inspectionHistory: "150-Point Certified Inspection Passed | Porsche Approved Service Book | Zero Track Wear",
    price: 64000,
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1000&q=80", // Shark Blue Front 3/4
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80", // Rear Wing Swan Neck Detail
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1000&q=80", // Full Carbon Bucket Interior
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1000&q=80", // Center Lock Lightweight Wheels
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1000&q=80", // PCCB Carbon Ceramic Yellow Caliper
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80"  // Cockpit Steering & Chrono Dial
    ],
    badge: "TRACK CLUBSPORT",
    featured: true,
    location: "Shuwaikh VIP Showroom",
    warranty: "Porsche Approved Official Factory Warranty Valid Until 2026",
    description: "Unmatched track weapon equipped with Front Axle Lift system, Porsche Ceramic Composite Brakes (PCCB), Chrono Package, and Bose Surround Sound.",
    specs: ["9,000 RPM Flat-6 Engine", "PCCB Carbon Ceramic Brakes", "Front Axle Lift System", "Full Carbon Bucket Seats"],
    specsTable: {
      "Engine Displacement": "4.0L Naturally Aspirated Flat-6 (3,996 cc)",
      "Horsepower & Torque": "502 HP @ 8,400 RPM | 470 Nm @ 6,100 RPM",
      "Transmission & Drivetrain": "7-Speed PDK Dual-Clutch | RWD with PTV+",
      "Exterior Color & Paint Code": "Shark Blue (Code: D5C)",
      "Interior Color & Trim": "Race-Tex Black / Shark Blue Stitch / Full Carbon Buckets",
      "Fuel Tank Capacity": "90 Liters Extended Range Fuel Tank",
      "Mileage & Model Year": "7,800 km | 2023 Model Year",
      "Ownership & History": "1 Owner (Behbehani Porsche Kuwait Full History)",
      "Condition Inspection Score": "99/100 Pristine Condition",
      "VIN & Stock Ref": "WP0AC2A91PS294481 | Stock #AT-KW-9921",
      "Warranty Status": "Porsche Approved Factory Warranty Valid"
    }
  },
  {
    id: 103,
    name: "Ford Mustang Shelby GT500 (Supercharged 760 HP)",
    nameAr: "فورد موستانج شيلبي GT500 سوبرتشارج (760 حصان)",
    brand: "Ford",
    model: "Shelby GT500 Carbon Track Pack",
    year: 2020,
    condition: "Certified Pre-Owned",
    inspectionScore: "97/100 Multi-Point Passed",
    mileage: "24,000 KM",
    engine: "5.2L Supercharged Cross-Plane Predator V8",
    engineDisplacement: "5,163 cc (2.65L Roots Eaton Supercharger)",
    power: "760 HP @ 7,300 RPM",
    powerTorque: "760 HP @ 7,300 RPM | 847 Nm @ 5,000 RPM",
    transmission: "7-Speed Tremec Dual-Clutch Automatic",
    drivetrain: "Rear-Wheel Drive with Torsen 3.73 Limited-Slip Diff",
    exteriorTrim: "Twister Orange with Over-the-Top Painted White Racing Stripes",
    exteriorColorPaintCode: "Twister Orange Tri-Coat (Code: CA)",
    interiorTrim: "Ebony Leather Recaro Racing Seats with Miko Suede Accents",
    interiorTrimColor: "Ebony Leather & Suede Recaro Seats",
    fuelTankCapacity: "Super 98 Octane Petrol | 61-Liter Fuel Tank",
    ownershipHistory: "1 Owner (Alghanim Ford Kuwait Maintained) | No Track Abuse",
    vinStockId: "VIN: 1FA6P8SJ8L550**** | Stock #AT-KW-5001",
    inspectionHistory: "150-Point Certified Inspection Passed | Borla ATAK Active Exhaust Installed | No Dyno Abuse",
    price: 26800,
    image: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=1000&q=80", // GT500 Front Hero
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80", // Supercharged V8 Predator Engine
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80", // Recaro Bucket Cockpit
      "https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?auto=format&fit=crop&w=1000&q=80", // Red Brembo 6-Piston Brakes
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1000&q=80"  // Carbon Track Wing & Rear Quad Tips
    ],
    badge: "BORLA ACTIVE EXHAUST",
    location: "Shuwaikh VIP Showroom",
    warranty: "1 Year APEX Comprehensive Drivetrain Warranty",
    description: "High-horsepower supercharged monster equipped with MagneRide adaptive damping, Launch Control, Line Lock, and Technology Package.",
    specs: ["760 HP Supercharged Predator V8", "MagneRide Damping", "Launch Control & Line Lock", "Recaro Bucket Seats"],
    specsTable: {
      "Engine Displacement": "5.2L Supercharged V8 (5,163 cc Predator)",
      "Horsepower & Torque": "760 HP @ 7,300 RPM | 847 Nm @ 5,000 RPM",
      "Transmission & Drivetrain": "7-Speed Tremec Dual-Clutch | RWD Torsen 3.73",
      "Exterior Color & Paint Code": "Twister Orange Tri-Coat (CA)",
      "Interior Color & Trim": "Ebony Leather / Recaro Sport Buckets",
      "Fuel Tank Capacity": "61 Liters",
      "Mileage & Model Year": "24,000 km | 2020 Model Year",
      "Ownership & History": "1 Owner (Alghanim Ford Kuwait Records)",
      "Condition Inspection Score": "97/100 Passed Complete Dyno & Mechanical Audit",
      "VIN & Stock Ref": "1FA6P8SJ8L5502194 | Stock #AT-KW-5001",
      "Warranty Status": "1 Year APEX Garage Comprehensive Warranty"
    }
  },
  {
    id: 104,
    name: "Toyota Land Cruiser GR-Sport V6 Twin-Turbo",
    nameAr: "تويوتا لاندكروزر جي آر سبورت V6 توين تيربو 2023",
    brand: "Toyota",
    model: "Land Cruiser 300 GR-Sport",
    year: 2023,
    condition: "Like New / Showroom Condition",
    inspectionScore: "99/100 Multi-Point Passed",
    mileage: "19,000 KM",
    engine: "3.5L Twin-Turbo V6 (V35A-FTS)",
    engineDisplacement: "3,444 cc (DOHC 24-Valve Dual VVT-i)",
    power: "409 HP @ 5,200 RPM",
    powerTorque: "409 HP @ 5,200 RPM | 650 Nm @ 2,000-3,600 RPM",
    transmission: "10-Speed Direct-Shift Automatic",
    drivetrain: "Full-Time 4WD with Electronic Kinetic Dynamic Suspension (E-KDSS)",
    exteriorTrim: "Precious White Pearl with Matte Black GR Sport Grille & Trim",
    exteriorColorPaintCode: "Precious White Pearl (Code: 090)",
    interiorTrim: "Two-Tone Black & Dark Red Genuine Leather with GR Embossed Headrests",
    interiorTrimColor: "Black & Dark Red Semi-Aniline Leather",
    fuelTankCapacity: "Super 98 / 95 Petrol | 110-Liter Dual Fuel Tanks",
    ownershipHistory: "1 Owner (Al-Sayer Toyota Kuwait Agency Serviced)",
    vinStockId: "VIN: JTMHA01J5P401**** | Stock #AT-KW-3001",
    inspectionHistory: "150-Point Certified Inspection Passed | Al-Sayer Agency Serviced | Pristine Underbody",
    price: 27900,
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1000&q=80", // GR Sport Front View
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80", // Side Profile & Black Wheels
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80", // Two-Tone Leather Cockpit
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1000&q=80", // 3.5L Twin Turbo V6 Bay
      "https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?auto=format&fit=crop&w=1000&q=80"  // E-KDSS Suspension Underbody
    ],
    badge: "OFF-ROAD PRO GR",
    location: "Shuwaikh VIP Showroom",
    warranty: "Al-Sayer Toyota Agency Warranty Valid till 2028 (GCC Wide)",
    description: "The ultimate desert and highway cruiser. Features Electronic Front & Rear Differential Locks, Multi-Terrain Select, Crawl Control, and 14-speaker JBL Audio.",
    specs: ["E-KDSS Electronic Suspension", "Front & Rear Diff Locks", "Crawl Control & Multi-Terrain", "JBL 14-Speaker Audio"],
    specsTable: {
      "Engine Displacement": "3.5L Twin-Turbo V6 (3,444 cc V35A-FTS)",
      "Horsepower & Torque": "409 HP @ 5,200 RPM | 650 Nm @ 2,000-3,600 RPM",
      "Transmission & Drivetrain": "10-Speed Automatic | Full-Time 4WD + Front/Rear Diff Locks",
      "Exterior Color & Paint Code": "Precious White Pearl (090)",
      "Interior Color & Trim": "Two-Tone Black & Dark Red GR Leather",
      "Fuel Tank Capacity": "110 Liters",
      "Mileage & Model Year": "19,000 km | 2023 Model Year",
      "Ownership & History": "1 Owner (Al-Sayer Toyota Kuwait Agency Service)",
      "Condition Inspection Score": "99/100 Flawless Condition",
      "VIN & Stock Ref": "JTMHA01J5P4019283 | Stock #AT-KW-3001",
      "Warranty Status": "Al-Sayer Toyota Warranty Valid Across GCC till 2028"
    }
  },
  {
    id: 105,
    name: "BMW M4 Competition xDrive Coupe (G82)",
    nameAr: "بي إم دبليو M4 كومبيتيشن xDrive كوبيه (503 حصان)",
    brand: "BMW",
    model: "M4 Competition xDrive (G82)",
    year: 2023,
    condition: "Certified Pre-Owned",
    inspectionScore: "98/100 Multi-Point Passed",
    mileage: "11,500 KM",
    engine: "3.0L S58 Twin-Turbocharged Inline-6",
    engineDisplacement: "2,993 cc (M TwinPower Turbo)",
    power: "503 HP @ 6,250 RPM",
    powerTorque: "503 HP @ 6,250 RPM | 650 Nm @ 2,750-5,500 RPM",
    transmission: "8-Speed M Steptronic with Drivelogic",
    drivetrain: "M xDrive Intelligent All-Wheel Drive with 2WD Drift Mode",
    exteriorTrim: "Isle of Man Green Metallic with Full Carbon Fiber Exterior Package",
    exteriorColorPaintCode: "Isle of Man Green Metallic (Code: C4G)",
    interiorTrim: "Kyalami Orange & Black Extended Merino Leather with Carbon Structure Trim",
    interiorTrimColor: "Kyalami Orange / Black Merino Leather (Code: X3IA)",
    fuelTankCapacity: "Super 98 Octane Petrol | 59-Liter Fuel Tank",
    ownershipHistory: "1 Owner (Ali Alghanim BMW Kuwait Maintained)",
    vinStockId: "VIN: WBA33AZ09PCH8**** | Stock #AT-KW-8201",
    inspectionHistory: "150-Point Certified Inspection Passed | Ali Alghanim BMW Service Record | Ceramic Coated",
    price: 29500,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80", // Green M4 Front
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80", // Carbon Roof & Mirrors
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80", // Orange Merino Interior Cockpit
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1000&q=80", // S58 Twin Turbo Engine Bay
      "https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?auto=format&fit=crop&w=1000&q=80"  // M Compound Brakes & Wheels
    ],
    badge: "M XDRIVE 4WD",
    location: "Al-Rai Showroom",
    warranty: "BMW Agency Warranty & Service Inclusive Valid till 2027",
    description: "Exceptional all-weather supercar performance. Features BMW Laserlights, M Drive Professional with 10-stage traction control, and Head-Up Display.",
    specs: ["M xDrive with 2WD Drift Mode", "M Carbon Exterior Package", "BMW Laserlights", "Harman Kardon Surround"],
    specsTable: {
      "Engine Displacement": "3.0L Twin-Turbo Inline-6 (2,993 cc S58)",
      "Horsepower & Torque": "503 HP @ 6,250 RPM | 650 Nm @ 2,750-5,500 RPM",
      "Transmission & Drivetrain": "8-Speed M Steptronic | M xDrive with 2WD Drift Mode",
      "Exterior Color & Paint Code": "Isle of Man Green Metallic (C4G)",
      "Interior Color & Trim": "Kyalami Orange & Black Extended Merino Leather",
      "Fuel Tank Capacity": "59 Liters",
      "Mileage & Model Year": "11,500 km | 2023 Model Year",
      "Ownership & History": "1 Owner (Ali Alghanim Sons BMW Kuwait Maintained)",
      "Condition Inspection Score": "98/100 Certified Score",
      "VIN & Stock Ref": "WBA33AZ09PCH82019 | Stock #AT-KW-8201",
      "Warranty Status": "BMW Agency Warranty & Service Inclusive Active"
    }
  }
];

interface ShowroomGridProps {
  language: Language;
  onSelectDetail: (item: DetailItem) => void;
}

export const ShowroomGrid: React.FC<ShowroomGridProps> = ({ 
  language,
  onSelectDetail
}) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [activeCarModal, setActiveCarModal] = useState<Vehicle | null>(null);
  const [driveRequested, setDriveRequested] = useState(false);

  const isAr = language === 'ar';

  const filteredVehicles = selectedBrand === 'All'
    ? SHOWROOM_VEHICLES
    : SHOWROOM_VEHICLES.filter(v => v.brand === selectedBrand);

  const handleDriveRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setDriveRequested(true);
    setTimeout(() => {
      setDriveRequested(false);
      setActiveCarModal(null);
    }, 2500);
  };

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600 mb-2">
              <Car className="w-4 h-4" />
              <span>{isAr ? '🏎️ سيارات معتمدة للبيع' : '🏎️ Certified Vehicle Showroom'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {isAr ? 'معرض السيارات الرياضية والفارهة' : 'Verified Sports & Luxury Showroom'}
            </h2>
            <div className="h-1 w-20 bg-sky-600 rounded-full mt-3" />
          </div>

          {/* Brand Filter */}
          <div className="flex flex-wrap gap-2">
            {['All', 'Nissan', 'Porsche', 'Ford', 'Toyota', 'BMW'].map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedBrand === brand
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Cars Grid - Whole Card Clickable */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredVehicles.map((car) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                key={car.id}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectDetail({ type: 'vehicle', data: car })}
                className="bg-slate-50 border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-sky-100 hover:border-sky-300 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Photo with photo counter */}
                  <div className="h-56 relative overflow-hidden bg-slate-200">
                    <img 
                      src={car.image} 
                      alt={car.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold text-sky-700">
                      {car.badge}
                    </div>

                    <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                      📸 {car.gallery.length} Photos
                    </div>

                    <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-300" />
                      <span>{car.location}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
                      <span>{car.year} • {car.condition}</span>
                      <span className="text-sky-600 font-mono font-bold">{car.mileage}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors mb-3">
                      {isAr && car.nameAr ? car.nameAr : car.name}
                    </h3>

                    {/* Trim and History Highlights */}
                    <div className="text-xs text-slate-600 mb-4 space-y-1">
                      <div className="truncate">🎨 <span className="font-semibold">{car.exteriorTrim}</span></div>
                      <div className="truncate text-emerald-700 font-medium">🛡️ {car.inspectionScore}</div>
                    </div>

                    {/* Specs Pills */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 mb-6 bg-white p-3 rounded-xl border border-slate-200/60 font-medium">
                      <div className="flex items-center gap-1.5 truncate">
                        <Gauge className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span className="truncate">{car.engine}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">{car.power}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 pt-0 border-t border-slate-200/60 flex items-center justify-between mt-auto">
                  <div>
                    <div className="text-[10px] font-bold uppercase text-slate-400">{isAr ? 'السعر كاش / أقساط' : 'CASH / FINANCING'}</div>
                    <div className="text-2xl font-black text-slate-900">
                      {car.price.toLocaleString()} <span className="text-xs text-slate-500 font-normal">KWD</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveCarModal(car);
                    }}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95"
                  >
                    {isAr ? 'تجربة القيادة' : 'Test Drive'}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>

      {/* Test Drive Modal */}
      <AnimatePresence>
        {activeCarModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCarModal(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-100"
            >
              <button 
                onClick={() => setActiveCarModal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-white/80 p-1.5 rounded-full z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="h-52 relative">
                <img 
                  src={activeCarModal.image} 
                  alt={activeCarModal.name} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-6 text-white">
                  <div className="text-xs font-bold text-amber-300">{activeCarModal.badge}</div>
                  <h3 className="text-xl font-bold">{activeCarModal.name}</h3>
                </div>
              </div>

              <div className="p-6">
                {driveRequested ? (
                  <div className="text-center py-6">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3 animate-bounce" />
                    <h4 className="text-xl font-bold text-slate-900 mb-1">{isAr ? 'تم تأكيد طلب تجربة القيادة!' : 'VIP Test Drive Booked!'}</h4>
                    <p className="text-xs text-slate-600">
                      {isAr 
                        ? `سيتواصل معك مدير المبيعات في ${activeCarModal.location} لتجهيز السيارة.`
                        : `Our sales specialist at ${activeCarModal.location} will contact you.`}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleDriveRequest} className="space-y-3.5">
                    <div className="text-sm font-semibold text-slate-700 mb-2">
                      {isAr ? 'احجز موعداً لمعاينة وتجربة قيادة السيارة في الشويخ:' : 'Schedule your VIP test drive session:'}
                    </div>

                    <input
                      type="text"
                      required
                      placeholder={isAr ? 'الاسم بالكامل' : 'Your Full Name'}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-sky-500"
                    />
                    <input
                      type="tel"
                      required
                      placeholder={isAr ? 'رقم الهاتف (+965)' : 'Mobile Phone (+965)'}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-sky-500"
                    />

                    <button
                      type="submit"
                      className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
                    >
                      {isAr ? 'تأكيد موعد تجربة القيادة' : 'Confirm Test Drive Session'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
