import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, 
  Droplet, 
  Gauge, 
  Cpu, 
  Calendar, 
  Clock, 
  Check, 
  X, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  HelpCircle,
  PhoneCall
} from 'lucide-react';
import { GarageService, Language, DetailItem } from '../types';

export const GARAGE_SERVICES: GarageService[] = [
  {
    id: "consultation-diagnosis",
    title: "Unidentified Car Issue / Custom Inspection",
    titleAr: "استشارة فحص عطل غير محدد / تشخيص مخصص",
    duration: "30-45 Mins in Workshop",
    price: 0,
    priceDisplay: "??? KWD",
    description: "Don't know what's wrong with your vehicle? Book a consultation with our master mechanics for computerized diagnostics and road testing.",
    descriptionAr: "لا تعرف سبب المشكلة في سيارتك؟ احجز موعد استشارة مع كبار المهندسين لفحص الكمبيوتر وتجربة الطريق وتحديد التكلفة بدقة.",
    longDescription: "❓ Mystery knocking, power loss, or warning lights? 🔍 Full vehicle computer scan and multi-point master mechanic inspection. 📞 Variable custom quote provided directly after initial diagnosis before any repairs begin.",
    icon: "help",
    popular: true,
    isConsultation: true,
    warranty: "Accurate Quote Guarantee",
    image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1000&q=80", // Master Inspection
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1000&q=80", // Diagnostic Tool Scan
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1000&q=80", // Engine Bay Inspection
      "https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?auto=format&fit=crop&w=1000&q=80", // Underbody Lift Check
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1000&q=80"  // Dyno & Sensor Output
    ],
    features: [
      "Master Mechanic Physical Inspection",
      "Full ECU Sensor & Error Scan",
      "Exact Transparent Quote Before Repair",
      "Road Test & Suspension Noise Check"
    ],
    featuresAr: [
      "فحص ميكانيكي مباشر وشامل",
      "مسح كمبيوتر كامل لجميع الحساسات",
      "تسعير شفاف ودقيق قبل بدء التصليح",
      "اختبار قيادة وفحص أصوات الهيئة"
    ],
    workSteps: [
      "1. Vehicle Intake & Customer Symptom Consultation",
      "2. Comprehensive 30-Point OBD2 Sensor & Telemetry Health Scan",
      "3. Lift Inspection of Underbody, Suspension, Steering & Bushings",
      "4. Smoke Pressure Testing for Vacuum & Intake Boost Leaks (if needed)",
      "5. Detailed Written Report & Itemized Quotation Issued"
    ],
    specsTable: {
      "Diagnostic Tools Used": "Autel MaxiSys Ultra, Bosch Master Diagnostic & OEM CAN-Bus Interfaces",
      "Turnaround Time": "30 to 45 Minutes in Bay",
      "Report Type": "Digital PDF Report Sent Direct to WhatsApp",
      "Inspection Guarantee": "100% Free Follow-Up Check if Same Code Reappears"
    }
  },
  {
    id: "ecu-tune",
    title: "Stage I & II Custom Dyno ECU Remapping",
    titleAr: "برمجة كمبيوتر المحرك على الداينو (ستيج 1 و 2)",
    duration: "2-3 Hours in Bay",
    price: 285,
    description: "Custom dyno-calibrated ECU flash improving throttle response, ignition advance, and boost curves for peak power in high desert temperatures.",
    descriptionAr: "برمجة متقدمة لكمبيوتر السيارة لرفع الأحصنة والعزم مع تحسين استجابة دواسة الوقود وتبريد حرارة المحرك.",
    longDescription: "🚀 Dyno-proven Stage I and II calibrations custom configured for Kuwait fuels and climate. ⚙️ Calibrated by master technicians with safety limiters intact. 🔧 Includes before & after dyno graph report.",
    icon: "cpu",
    popular: true,
    warranty: "2 Years / 40,000 KM",
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1000&q=80", // Dyno Run
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80", // Software Map Tables
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80", // Supercar on Dynojet
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1000&q=80", // Engine Bay Sensor Hookups
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1000&q=80"  // Dyno Chart Printout
    ],
    features: [
      "+45 to +85 WHP Dyno Gains",
      "Removal of Speed Governor",
      "Overrun Pops & Burbles Config",
      "High Heat Thermal Map Protection"
    ],
    featuresAr: [
      "زيادة من 45 إلى 85 حصان",
      "إلغاء محدد السرعة القصوى",
      "خاصية فرقعة الإكزوزت الرياضي",
      "حماية درجات الحرارة العالية"
    ],
    workSteps: [
      "1. Baseline Stock Dyno Run & AFR Telemetry Recording",
      "2. ECU Memory Extraction & Calibration Optimization",
      "3. Dyno Tuning under Simulated High Desert Heat Loads",
      "4. Final Verification Run & Power Certificate Printout"
    ],
    specsTable: {
      "Dyno Facility": "Dynojet 4WD All-Wheel Drive High-Inertia Cell",
      "Supported Fuels": "95 Octane, 98 Super, E85 Flex-Fuel",
      "Average Gains": "+45 WHP (Stage 1) / +85 WHP (Stage 2 with Downpipe)",
      "Warranty": "2 Years Official Map & Calibration Warranty"
    }
  },
  {
    id: "synthetic-oil",
    title: "Full Synthetic Racing Oil & Filter Service",
    titleAr: "تبديل زيت تخليقي كامل وفلتر أصلي مع فحص الصيف",
    duration: "45 Minutes",
    price: 45,
    description: "Liqui Moly / Motul 300V high-temperature synthetic oil replacement, OEM filter, and 30-point Kuwait summer vehicle safety check.",
    descriptionAr: "تبديل زيت عالي الجودة للحرارة المرتفعة مع فلتر وكالة وفحص شامل لـ 30 نقطة سلامة.",
    longDescription: "🛢️ Premium Motul/Liqui Moly 5W-40 full synthetic oil designed to withstand 50°C+ ambient heat. 🔍 Comprehensive brake fluid, coolant, battery health, and suspension inspection. 🚗 Fast 45-minute express lane service.",
    icon: "droplet",
    warranty: "6 Months / 10,000 KM",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1000&q=80", // Oil Service
      "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1000&q=80", // OEM Filter Replacement
      "https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?auto=format&fit=crop&w=1000&q=80", // Fluid Level Checks
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1000&q=80", // Inspection Checklist
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80"  // Service Completed
    ],
    features: [
      "OEM Certified Filter Replacement",
      "30-Point Desert Health Inspection",
      "Coolant & Brake Fluid Top-off",
      "Diagnostic Scan Report Included"
    ],
    featuresAr: [
      "تركيب فلتر أصلي معتمد",
      "فحص حرارة وسلامة لـ 30 نقطة",
      "تزويد جميع سوائل التبريد والفرامل",
      "تقرير فحص كمبيوتر مجاني"
    ],
    workSteps: [
      "1. Engine Warm-Up & High-Temperature Gravity Oil Drain",
      "2. OEM Oil Filter Cartridge Replacement & O-Ring Lubrication",
      "3. Fresh Motul/Liqui Moly 5W-40 Full Synthetic Oil Fill",
      "4. Digital Service Indicator Light Reset on Dashboard",
      "5. Comprehensive 30-Point Desert Safety Check"
    ],
    includedFluids: ["Up to 8 Liters Full Synthetic Oil", "Windshield Washer Booster", "Radiator Coolant Top-Off"],
    specsTable: {
      "Oil Specifications": "API SP, ACEA A3/B4, MB 229.5, Porsche A40",
      "Inspection Points": "30 Mechanical, Electrical & Suspension Points",
      "Service Duration": "45 Minutes",
      "Warranty": "6 Months / 10,000 KM Guarantee"
    }
  },
  {
    id: "engine-overhaul",
    title: "Performance Engine & Transmission Overhaul",
    titleAr: "توضيب وتجديد المحركات والجير بأحدث الأجهزة",
    duration: "3-5 Working Days",
    price: 650,
    description: "Precision engine rebuilding, forged internals installation, cylinder head machining, and valve timing calibration by certified masters.",
    descriptionAr: "تجديد وتوضيب المحركات بأحدث الأجهزة مع قطع مقواة وضبط التايمنج وفحص الضغط.",
    longDescription: "🔧 Full blueprinting and high-performance rebuild. ⚙️ Forged connecting rods, pistons, and ARP stud installation. 🏆 Dyno break-in procedure and comprehensive warranty.",
    icon: "wrench",
    warranty: "1 Year Comprehensive",
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1000&q=80", // Engine Block Assembly
      "https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?auto=format&fit=crop&w=1000&q=80", // Forged Pistons & Rods
      "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1000&q=80", // Cylinder Head Machining
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80", // Precision Torque Calibration
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1000&q=80"  // Dyno Break-in
    ],
    features: [
      "Precision Cylinder Blueprinting",
      "Forged Rods & Pistons Upgrade",
      "Leak-down & Compression Test",
      "Complete Gasket Kit OEM"
    ],
    featuresAr: [
      "خراطة وضبط دقيق للبلوك",
      "تركيب بساتن وأذرعة رياضية",
      "فحص تسريب وضغط المحرك",
      "طقم كازكيتات أصلي كامل"
    ],
    workSteps: [
      "1. Complete Engine Disassembly, Chemical Cleaning & Ultrasonic Wash",
      "2. Micrometer Measurement of Crankshaft, Journals & Cylinder Bores",
      "3. High-Precision Cylinder Honing & Deck Resurfacing",
      "4. Installation of Forged Internals, ARP Main Studs & Multi-Layer Gaskets",
      "5. Pressure Leak-Down Testing & Dyno Break-In Calibration"
    ],
    specsTable: {
      "Tolerances": "Precision Measured to within ±0.0001 inch",
      "Hardware Used": "ARP 2000 Fasteners, King Racing Bearings, Cometic Gaskets",
      "Testing": "Full Hot Oil Pressure & Compression Certification",
      "Warranty": "1 Year Unlimited Mileage Comprehensive Garage Warranty"
    }
  },
  {
    id: "brake-upgrade",
    title: "High-Performance Ceramic & Big Brake Kit Overhaul",
    titleAr: "صيانة وبريكات رياضية وسفايف سيراميك مع غسيل الزيت",
    duration: "2-3 Hours",
    price: 180,
    description: "Installation of Brembo/AP Racing multi-piston calipers, drilled rotors, stainless steel braided lines, and racing fluid flush.",
    descriptionAr: "تركيب دسكات مهواة وسفايف سيراميك وكليبرات رياضية مع تبديل زيت الفرامل DOT 5.1.",
    longDescription: "🛑 Unmatched stopping power for track and highway. 🏎️ Drilled and slotted rotors to prevent heat fade under emergency stops. 🛡️ High-friction ceramic pads with zero noise and minimal dust.",
    icon: "gauge",
    warranty: "1 Year / 25,000 KM",
    image: "https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?auto=format&fit=crop&w=1000&q=80", // Big Brake Caliper
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1000&q=80", // Drilled Rotors
      "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1000&q=80", // Brake Fluid Flush
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80", // Wheel Fitment
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1000&q=80"  // Bedding-in Road Test
    ],
    features: [
      "High-Friction Ceramic Pads",
      "Drilled & Slotted Anti-Fade Discs",
      "DOT 5.1 Fluid Flush & Bleed",
      "Bedding-in Calibration"
    ],
    featuresAr: [
      "سفايف سيراميك مقاومة للحرارة",
      "دسكات مهواة ضد التلاشي",
      "غسيل كامل لزيت الفرامل DOT 5.1",
      "معايرة واختبار الفرملة"
    ],
    workSteps: [
      "1. Rotor & Caliper Inspection with Micrometer Runout Gauge",
      "2. Hub Cleaning, Rust Removal & Anti-Seize Application",
      "3. Installation of Ceramic Pads & High-Carbon Discs",
      "4. Complete Pressure Bleed with Motul RBF 600 DOT 5.1 Fluid",
      "5. Professional Road Bedding-In Procedure"
    ],
    specsTable: {
      "Fluid Grade": "Motul RBF 600 Synthetic Brake Fluid (312°C Dry Boiling Point)",
      "Pad Material": "High-Friction Carbon-Ceramic Matrix (Noise-Free)",
      "Rotor Finish": "Zinc-Plated Anti-Corrosion Curved Vanes",
      "Warranty": "1 Year / 25,000 KM Warranty"
    }
  }
];

interface ServicesSectionProps {
  language: Language;
  isStandalonePage?: boolean;
  isBookingModalOpen: boolean;
  onOpenBookingModal: (service?: GarageService) => void;
  onCloseBookingModal: () => void;
  onSelectDetail: (item: DetailItem) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  language,
  isStandalonePage = false,
  isBookingModalOpen,
  onOpenBookingModal,
  onCloseBookingModal,
  onSelectDetail
}) => {
  const [selectedService, setSelectedService] = useState<GarageService>(GARAGE_SERVICES[0]);
  const [vehicleModel, setVehicleModel] = useState('');
  const [bookingDate, setBookingDate] = useState('2025-05-20');
  const [timeSlot, setTimeSlot] = useState('10:00 AM');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const isAr = language === 'ar';

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      onCloseBookingModal();
      setVehicleModel('');
      setCustomerName('');
      setCustomerPhone('');
    }, 2500);
  };

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600 mb-2">
              <Wrench className="w-4 h-4" />
              <span>{isAr ? '🛠️ الفحص والإصلاح المعتمد' : '🛠️ Diagnosing & Repairing Catalog'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {isAr ? 'خدمات الكراج والصيانة الدقيقة' : 'Certified Garage Services & Repair'}
            </h2>
            <div className="h-1 w-20 bg-sky-600 rounded-full mt-3" />
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="tel:+96522002739"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5 text-sky-600" />
              <span>{isAr ? 'اتصال مباشر بالكراج' : 'Call Workshop Direct'}</span>
            </a>
            <button
              onClick={() => onOpenBookingModal()}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
              <span>{isAr ? 'حجز موعد فحص' : 'Book Custom Inspection'}</span>
            </button>
          </div>
        </div>

        {/* Featured Consultation Card for Unknown Issues */}
        <div className="mb-10 bg-gradient-to-r from-sky-50 via-cyan-50 to-amber-50/50 border border-sky-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-sky-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-md">
              <HelpCircle className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <div className="inline-block bg-amber-400 text-slate-900 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full mb-1">
                {isAr ? 'استشارة فورية' : 'FREE INITIAL ADVICE'}
              </div>
              <h3 className="text-xl font-black text-slate-900">
                {isAr ? '❓ لا تعرف سبب المشكلة في سيارتك؟ احجز موعد استشارة أو اتصل بنا!' : '❓ Don’t know what’s wrong with your car? Book a Consultation or Call Us!'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                {isAr 
                  ? 'سعر الفحص المبدئي والاستشارة: ??? د.ك (تسعير متغير حسب المشكلة). يقوم كبار المهندسين بفحص كمبيوتر السيارة وتحديد التكلفة بدقة تامة.'
                  : 'Diagnostic Price: ??? KWD (Variable Inquiry Quote). Master technicians perform deep ECU and physical diagnostics before providing a guaranteed quote.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setSelectedService(GARAGE_SERVICES[0]);
                onOpenBookingModal(GARAGE_SERVICES[0]);
              }}
              className="px-6 py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95"
            >
              {isAr ? 'حجز استشارة فحص' : 'Book Diagnostic Bay'}
            </button>
            <a
              href="tel:+96522002739"
              className="p-3.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl transition-colors shadow-sm"
              title="Call Garage"
            >
              <PhoneCall className="w-4 h-4 text-sky-600" />
            </a>
          </div>
        </div>

        {/* Services Cards Grid - Fully clickable across entire card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {GARAGE_SERVICES.map((service) => (
            <motion.div
              key={service.id}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectDetail({ type: 'service', data: service })}
              className="bg-slate-50 border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-sky-100 hover:border-sky-300 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Photo with Counter */}
                <div className="h-48 relative overflow-hidden bg-slate-200">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  {service.popular && (
                    <div className="absolute top-3 right-3 bg-sky-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-300" /> {isAr ? 'الأكثر طلباً' : 'POPULAR'}
                    </div>
                  )}
                  <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-sky-600" />
                    <span>{service.duration}</span>
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                    📸 {service.gallery.length} Photos
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors mb-2">
                    {isAr && service.titleAr ? service.titleAr : service.title}
                  </h3>
                  
                  <p className="text-xs text-slate-600 mb-4 leading-relaxed line-clamp-2">
                    {isAr && service.descriptionAr ? service.descriptionAr : service.description}
                  </p>

                  {/* Checklist */}
                  <div className="space-y-1.5 mb-5">
                    {(isAr && service.featuresAr ? service.featuresAr : service.features).slice(0, 3).map((feat, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-5 pt-0 border-t border-slate-200/60 flex items-center justify-between mt-auto">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">{isAr ? 'التسعير' : 'PRICE'}</div>
                  <div className="text-xl font-black text-slate-900">
                    {service.priceDisplay ? (
                      <span className="text-sky-600">{service.priceDisplay}</span>
                    ) : (
                      <>
                        {service.price} <span className="text-xs text-slate-500 font-normal">KWD</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-sky-600 group-hover:underline flex items-center gap-1">
                    <span>{isAr ? 'عرض التفاصيل والحجز' : 'View & Book'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Interactive Appointment Modal */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseBookingModal}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 border border-slate-100 overflow-hidden"
            >
              <button 
                onClick={onCloseBookingModal}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>

              {bookingSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-4 animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
                    {isAr ? 'تم تأكيد حجز الموعد بنجاح!' : 'Service Bay Confirmed!'}
                  </h3>
                  <p className="text-sm text-slate-600 max-w-sm mx-auto mb-4">
                    {isAr 
                      ? `تم تأكيد موعدك لـ ${selectedService.titleAr || selectedService.title} بتاريخ ${bookingDate} الساعة ${timeSlot}. سنرسل لك تذكرة الدخول عبر واتساب.`
                      : `Your booking for ${selectedService.title} on ${bookingDate} at ${timeSlot} is locked in. Entry pass sent via WhatsApp.`}
                  </p>
                  <div className="text-xs font-mono text-sky-600 font-bold">
                    Apex Shuwaikh // Bay #3 Ready
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 font-bold">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900">
                        {isAr ? 'حجز موعد صيانة فوري' : 'Instant Garage Booking'}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {isAr ? 'اختر اليوم والوقت المناسب لك في الشويخ' : 'Select your preferred date & time at Shuwaikh'}
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        {isAr ? 'الخدمة المطلوبة' : 'Selected Service'}
                      </label>
                      <select
                        value={selectedService.id}
                        onChange={(e) => {
                          const found = GARAGE_SERVICES.find(s => s.id === e.target.value);
                          if (found) setSelectedService(found);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-sky-500 focus:bg-white"
                      >
                        {GARAGE_SERVICES.map(s => (
                          <option key={s.id} value={s.id}>
                            {isAr && s.titleAr ? s.titleAr : s.title} ({s.priceDisplay || `${s.price} KWD`})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                          {isAr ? 'نوع وموديل السيارة' : 'Vehicle Model'}
                        </label>
                        <input
                          type="text"
                          required
                          value={vehicleModel}
                          onChange={(e) => setVehicleModel(e.target.value)}
                          placeholder="e.g. 2022 Nissan Patrol / Porsche"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-sky-500 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                          {isAr ? 'التاريخ المفضل' : 'Preferred Date'}
                        </label>
                        <input
                          type="date"
                          required
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-sky-500 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                          {isAr ? 'الفترة' : 'Time Slot'}
                        </label>
                        <select
                          value={timeSlot}
                          onChange={(e) => setTimeSlot(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-sky-500 focus:bg-white"
                        >
                          <option>09:00 AM - Morning Slot</option>
                          <option>11:30 AM - Midday Slot</option>
                          <option>02:00 PM - Afternoon Slot</option>
                          <option>05:30 PM - Evening Express</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                          {isAr ? 'رقم الهاتف (الكويت)' : 'Mobile (+965)'}
                        </label>
                        <input
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="+965 9900 0000"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-sky-500 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        {isAr ? 'اسم العميل' : 'Customer Name'}
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Bader Al-Ali"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-sky-500 focus:bg-white"
                      />
                    </div>

                    <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-500">{isAr ? 'الإجمالي التقديري: ' : 'Total: '}</span>
                        <span className="text-xl font-extrabold text-sky-600">
                          {selectedService.priceDisplay || `${selectedService.price} KWD`}
                        </span>
                      </div>

                      <button
                        type="submit"
                        className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95"
                      >
                        {isAr ? 'تأكيد الحجز' : 'Confirm Bay'}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
