import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  Wrench, 
  Car, 
  Zap,
  Tag
} from 'lucide-react';
import { Language, PageView } from '../types';
import { useSiteConfig } from '../context/SiteConfigContext';
import { EditableText } from './EditableText';

interface HeroProps {
  language: Language;
  onOpenBooking: () => void;
  onNavigatePage: (page: PageView) => void;
}

export const Hero: React.FC<HeroProps> = ({
  language,
  onOpenBooking,
  onNavigatePage
}) => {
  const isAr = language === 'ar';
  const { config, updateNestedConfig, isEditMode } = useSiteConfig();

  const categoryCards = [
    {
      id: 'diagnostics' as PageView,
      icon: <Wrench className="w-5 h-5 text-sky-600" />,
      titleEn: "Diagnosing & Repairing",
      titleAr: "الفحص والصيانة الميكانيكية",
      descEn: "OBD2 diagnostics, oil & fluid services, cooling & engine rebuilds.",
      descAr: "فحص كمبيوتر، تبديل زيوت، فحص حرارة وتوضيب محركات.",
      badge: "4 BAYS READY"
    },
    {
      id: 'performance' as PageView,
      icon: <Zap className="w-5 h-5 text-cyan-600" />,
      titleEn: "Performance Upgrades",
      titleAr: "البرمجة وتعديل الأداء",
      descEn: "Dyno Stage I/II/III tuning, boost controllers, IMU track telemetry.",
      descAr: "برمجة كمبيوتر ستيج 1/2/3، منظمات تيربو وأجهزة حلبات.",
      badge: "+85 HP GAINS"
    },
    {
      id: 'parts' as PageView,
      icon: <Tag className="w-5 h-5 text-amber-500" />,
      titleEn: "Auto Parts & Tools",
      titleAr: "قطع الغيار والأجهزة",
      descEn: "Affordable OBD2 scanners from 9 KWD, fuel pumps & brake kits.",
      descAr: "أجهزة فحص بلوتوث من 9 د.ك، طرمبات بنزين وسفايف سيراميك.",
      badge: "FROM 9 KWD"
    },
    {
      id: 'showroom' as PageView,
      icon: <Car className="w-5 h-5 text-emerald-600" />,
      titleEn: "Showroom Vehicles",
      titleAr: "معرض السيارات المعتمدة",
      descEn: "Certified pre-owned sports cars & luxury SUVs with warranty.",
      descAr: "سيارات رياضية ودفع رباعي معتمدة مع فحص وضمان شامل.",
      badge: "VERIFIED"
    }
  ];

  return (
    <section className="relative pt-36 pb-20 overflow-hidden bg-gradient-to-b from-sky-50/80 via-white to-slate-50 border-b border-sky-100">
      {/* Decorative Radial Accents */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-cyan-100/40 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* Main Hero Copy */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/90 border border-sky-200 text-sky-800 text-xs font-bold tracking-wide mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>
                {isAr 
                  ? 'الكراج المعتمد لصيانة وبرمجة السيارات في الكويت' 
                  : 'Kuwait Premier Certified Automotive Center & Performance Hub'}
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.08] mb-6">
              <EditableText
                tagName="h1"
                value={config.hero.title}
                onChange={(val) => updateNestedConfig('hero', 'title', val)}
                className="inline-block"
              />
            </h1>

            <div className="text-base sm:text-lg text-slate-600 mb-8 max-w-xl leading-relaxed">
              <EditableText
                tagName="p"
                value={config.hero.subtitle}
                onChange={(val) => updateNestedConfig('hero', 'subtitle', val)}
              />
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5">
              <button 
                onClick={onOpenBooking}
                style={{ backgroundColor: config.theme.primaryColor }}
                className="px-7 py-4 text-white font-bold rounded-2xl shadow-lg shadow-sky-600/30 flex items-center gap-2 transition-all active:scale-95 hover:opacity-90"
              >
                <Calendar className="w-5 h-5 text-amber-300" />
                <span>{isAr ? '📅 حجز موعد كراج فوري' : '📅 Book Service Appointment'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <a 
                href="https://maps.google.com/?q=Shuwaikh+Industrial+Area+Kuwait" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold rounded-2xl shadow-sm flex items-center gap-2 transition-all"
              >
                <MapPin className="w-4 h-4 text-sky-600" />
                <span>{isAr ? '📍 موقعنا على الخريطة' : '📍 Visit Our Workshop'}</span>
              </a>
            </div>

            {/* Features strip */}
            <div className="mt-10 pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-slate-700 text-xs sm:text-sm font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>{isAr ? 'ضمان رسمي 1 سنة' : '1-Year Warranty'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>{isAr ? 'قطع غيار أصلية 100%' : '100% OEM Genuine'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>{isAr ? 'فحص كمبيوتر فوري' : 'Instant Diagnostic'}</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Visual Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-5"
          >
            <div className="bg-white rounded-3xl p-4 shadow-2xl shadow-sky-900/10 border border-sky-100 relative overflow-hidden group">
              <div className="h-64 sm:h-72 rounded-2xl overflow-hidden relative">
                <img 
                  src={config.hero.bgImage} 
                  alt="Apex Torque Garage"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/75 via-transparent to-transparent" />
                
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-sky-800 flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{isAr ? 'الورشة مفتوحة - 4 غرف صيانة جاهزة' : 'Open: 4 Workshop Bays Ready'}</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-xs font-mono uppercase text-amber-300 font-bold">
                    {isAr ? 'برمجة وإصلاح فوري' : 'SAME-DAY FAST TURNAROUND'}
                  </div>
                  <h3 className="text-xl font-bold leading-tight">
                    {isAr ? 'مركز الشويخ الرئيسي للأداء والصيانة' : 'Shuwaikh Industrial Master Garage'}
                  </h3>
                </div>
              </div>

              {isEditMode && (
                <div className="mt-3 p-3 bg-slate-900 rounded-xl text-left border border-slate-700">
                  <label className="text-xs text-sky-400 font-bold block mb-1">
                    {isAr ? 'رابط صورة الخلفية:' : 'Edit Hero Image URL:'}
                  </label>
                  <input
                    type="text"
                    value={config.hero.bgImage}
                    onChange={(e) => updateNestedConfig('hero', 'bgImage', e.target.value)}
                    className="w-full text-xs p-2 text-slate-900 bg-white rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              )}

              {/* Service Stat Box */}
              <div className="p-4 grid grid-cols-2 gap-3 mt-1">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-500">{isAr ? 'زمن فحص العطل' : 'Diagnostic Speed'}</div>
                  <div className="text-lg font-extrabold text-slate-900">15 Mins</div>
                </div>
                <div className="bg-sky-50 p-3 rounded-xl border border-sky-100">
                  <div className="text-xs text-sky-700">{isAr ? 'زيادة عزم وقوة' : 'Dyno Power Gain'}</div>
                  <div className="text-lg font-extrabold text-sky-700">+45 to +85 HP</div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Quick Category Navigation Hub */}
        <div className="pt-8 border-t border-slate-200">
          <div className="text-center mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-sky-600 mb-1">
              {isAr ? 'استكشف أقسام الكراج المتخصصة' : 'EXPLORE SPECIALIZED WORKSHOP HUBS'}
            </h2>
            <p className="text-xl font-black text-slate-900">
              {isAr ? 'اختر القسم المطلوب للتصفح الشامل والأسعار' : 'Direct Navigation to Catalogs & Services'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryCards.map((cat) => (
              <motion.div
                key={cat.id}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigatePage(cat.id)}
                className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-sky-100 hover:border-sky-300 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-sky-50 flex items-center justify-center transition-colors">
                      {cat.icon}
                    </div>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-sky-100 group-hover:text-sky-800 transition-colors">
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors mb-2">
                    {isAr ? cat.titleAr : cat.titleEn}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {isAr ? cat.descAr : cat.descEn}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-600 group-hover:text-sky-500">
                  <span>{isAr ? 'فتح القسم الكامل' : 'Open Catalog Page'}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};