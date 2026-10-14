import React, { useState } from 'react';
import { 
  Terminal, 
  Search, 
  CheckCircle2, 
  Activity, 
  ShoppingCart, 
  RefreshCw, 
  Wrench, 
  HelpCircle,
  AlertTriangle 
} from 'lucide-react';
import { DTCResult, Product, Language } from '../types';
import { SAMPLE_PRODUCTS } from './ProductGrid';

const DTC_DATABASE: Record<string, DTCResult> = {
  'P0300': {
    code: 'P0300',
    description: 'Random / Multiple Cylinder Misfire Detected',
    severity: 'CRITICAL',
    suggestedFix: 'Inspect ignition coils, check AFR lambda balance, and verify spark plug electrode gap.',
    matchingProductId: 1
  },
  'P0171': {
    code: 'P0171',
    description: 'System Too Lean (Bank 1) - Fuel Trim Limit Exceeded',
    severity: 'MODERATE',
    suggestedFix: 'Check for intake boost leaks, verify MAF/MAP sensor scaling, and inspect wideband oxygen sensor.',
    matchingProductId: 5
  },
  'P0420': {
    code: 'P0420',
    description: 'Catalyst System Efficiency Below Threshold (Bank 1)',
    severity: 'LOW',
    suggestedFix: 'Downpipe sensor recalibration required. Clear fault code or deploy Stage II off-road calibration.',
    matchingProductId: 1
  },
  'P0299': {
    code: 'P0299',
    description: 'Turbocharger / Supercharger Underboost Condition',
    severity: 'CRITICAL',
    suggestedFix: 'Wastegate actuator solenoid duty cycle failure or diverter valve tear. Deploy electronic boost controller.',
    matchingProductId: 3
  },
  'P0135': {
    code: 'P0135',
    description: 'O2 Sensor Heater Circuit Malfunction (Bank 1, Sensor 1)',
    severity: 'LOW',
    suggestedFix: 'Heater element resistance out of tolerance. Install replacement wideband lambda probe.',
    matchingProductId: 5
  }
};

interface DiagnosticToolProps {
  language: Language;
  onAddToCart: (product: Product) => void;
  onOpenBooking: () => void;
}

export const DiagnosticTool: React.FC<DiagnosticToolProps> = ({ 
  language,
  onAddToCart,
  onOpenBooking
}) => {
  const [inputCode, setInputCode] = useState('');
  const [activeDTC, setActiveDTC] = useState<DTCResult | null>(DTC_DATABASE['P0300']);
  const [isScanning, setIsScanning] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const isAr = language === 'ar';

  const handleSearch = (codeToSearch: string) => {
    const formatted = codeToSearch.trim().toUpperCase();
    if (!formatted) return;

    setIsScanning(true);
    setNotFound(false);

    setTimeout(() => {
      setIsScanning(false);
      if (DTC_DATABASE[formatted]) {
        setActiveDTC(DTC_DATABASE[formatted]);
      } else {
        setActiveDTC(null);
        setNotFound(true);
      }
    }, 350);
  };

  const matchingProduct = activeDTC?.matchingProductId 
    ? SAMPLE_PRODUCTS.find(p => p.id === activeDTC.matchingProductId)
    : undefined;

  return (
    <section id="diagnostics" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600 mb-2">
            <Terminal className="w-4 h-4" />
            <span>{isAr ? 'فحص أكواد الأعطال OBD2' : 'OBD2 Diagnostic Terminal'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {isAr ? 'كاشف الأعطال الذكي وتحديد الحلول' : 'DTC Fault Engine & Auto-Resolver'}
          </h2>
          <p className="text-slate-600 text-sm mt-2 max-w-2xl leading-relaxed">
            {isAr 
              ? 'أدخل رمز العطل (DTC) مثل P0300 أو P0171 لمعرفة سبب المشكلة فوراً والحل الهندسي والقطع المطلوبة لإصلاحها.'
              : 'Input active Diagnostic Trouble Codes from your vehicle to view root-cause analysis and recommended genuine repair parts.'}
          </p>
        </div>

        {/* Terminal Card */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-sky-900/5">
          {/* Bar */}
          <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="ml-2 text-slate-300">apex-dtc-scanner://ecu-live-can0</span>
            </div>
            <div className="text-sky-400">STATUS: 500 kbit/s ACTIVE</div>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Input Side */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-2">
                  {isAr ? 'أدخل كود العطل (مثال: P0300, P0171, P0299)' : 'Enter Fault Code (e.g. P0300, P0171, P0299)'}
                </label>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch(inputCode);
                  }}
                  className="flex gap-2"
                >
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      placeholder="e.g. P0300"
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 pl-10 text-slate-800 font-mono uppercase text-sm focus:outline-none focus:border-sky-500 focus:bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    {isScanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>{isAr ? 'فحص' : 'Scan'}</span>}
                  </button>
                </form>
              </div>

              {/* Preset Codes */}
              <div>
                <div className="text-xs font-bold uppercase text-slate-500 mb-2.5">
                  {isAr ? 'رموز سريعة للتجربة:' : 'Quick Preset Error Codes:'}
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(DTC_DATABASE).map((code) => (
                    <button
                      key={code}
                      onClick={() => {
                        setInputCode(code);
                        handleSearch(code);
                      }}
                      className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
                        activeDTC?.code === code
                          ? 'bg-sky-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Gauges Info */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs font-mono space-y-2.5">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1 text-sky-600 font-bold">
                    <Activity className="w-3.5 h-3.5" /> STFT Fuel Trim:
                  </span>
                  <span className="font-bold text-slate-900">+18.4% [LEAN]</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Engine Speed:</span>
                  <span className="font-bold text-slate-900">2,480 RPM</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Coolant Temp:</span>
                  <span className="font-bold text-slate-900">92°C (Desert Spec)</span>
                </div>
              </div>
            </div>

            {/* Results Side */}
            <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
              {isScanning ? (
                <div className="h-56 flex flex-col items-center justify-center text-slate-500">
                  <RefreshCw className="w-8 h-8 text-sky-600 animate-spin mb-3" />
                  <span className="text-xs font-bold uppercase">{isAr ? 'جاري قراءة كود العطل...' : 'Querying OBD2 ECU Database...'}</span>
                </div>
              ) : notFound ? (
                <div className="h-56 flex flex-col items-center justify-center text-center p-4">
                  <HelpCircle className="w-10 h-10 text-amber-500 mb-2" />
                  <div className="text-sm font-bold text-slate-800">{isAr ? 'لم يتم العثور على الكود' : 'Code Not in Quick DB'}</div>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    {isAr ? 'جرب اختيار أحد الرموز السريعة أعلاه مثل P0300 أو P0171.' : 'Try clicking one of the preset pills (P0300, P0171, P0420, P0299).'}
                  </p>
                </div>
              ) : activeDTC ? (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-extrabold text-sky-600 font-mono">{activeDTC.code}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        activeDTC.severity === 'CRITICAL'
                          ? 'bg-red-100 text-red-700'
                          : activeDTC.severity === 'MODERATE'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {activeDTC.severity} SEVERITY
                      </span>
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mb-2">
                    {activeDTC.description}
                  </h4>

                  <div className="bg-white border border-slate-200 rounded-xl p-4 mb-5">
                    <div className="text-xs font-bold uppercase text-sky-700 mb-1 flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5" />
                      <span>{isAr ? 'الحل المقترح من مهندسي الكراج:' : 'Recommended Engineering Fix:'}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {activeDTC.suggestedFix}
                    </p>
                  </div>

                  {matchingProduct && (
                    <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-sky-600">
                          {isAr ? 'القطعة المناسبة للإصلاح' : 'Targeted Fix Product'}
                        </div>
                        <div className="text-sm font-bold text-slate-900">{matchingProduct.name}</div>
                        <div className="text-xs font-bold text-slate-700">{matchingProduct.price} KWD</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onAddToCart(matchingProduct)}
                          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                        >
                          <ShoppingCart className="w-3.5 h-3.5 inline mr-1" />
                          <span>{isAr ? 'شراء القطعة' : 'Order Fix'}</span>
                        </button>
                        <button
                          onClick={onOpenBooking}
                          className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs rounded-xl transition-all"
                        >
                          {isAr ? 'حجز فحص' : 'Book Bay'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

              <div className="mt-5 pt-3 border-t border-slate-200 text-[11px] font-mono text-slate-500 flex items-center justify-between">
                <span>MODULE: PCM_0x10</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> ISO-TP LIVE
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
