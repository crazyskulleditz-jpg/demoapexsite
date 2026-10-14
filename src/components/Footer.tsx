import React, { useState, useEffect } from 'react';
import { Wrench, PhoneCall, MapPin, ExternalLink, ShieldCheck, Heart } from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const isAr = language === 'ar';

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-12 font-sans border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand & Location */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white font-bold">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight">
                APEX<span className="text-sky-400">TORQUE</span>
              </span>
            </div>
            
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              {isAr 
                ? 'مركز الشويخ الصناعية المتخصص في صيانة المحركات وبرمجة السيارات وتوفير قطع الغيار الأصلية المعتمدة في الكويت.'
                : 'Kuwait’s premier certified automotive repair garage, dyno ECU calibration hub, and genuine performance parts distributor.'}
            </p>

            <div className="space-y-2 text-xs text-slate-300">
              <a 
                href="https://maps.google.com/?q=Shuwaikh+Industrial+Area+Kuwait" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-sky-400 transition-colors"
              >
                <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{isAr ? '📍 الشويخ الصناعية 1 - شارع 12 - الكويت' : '📍 Street 12, Shuwaikh Industrial 1, Kuwait'}</span>
              </a>

              <a 
                href="tel:+96522002739" 
                className="flex items-center gap-2 hover:text-sky-400 transition-colors font-bold"
              >
                <PhoneCall className="w-4 h-4 text-sky-400 shrink-0" />
                <span>+965 2200-APEX (2739) / +965 9900-TORQ</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 pt-2">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1"
              >
                <span>Instagram: @apextorque.kw</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1"
              >
                <span>TikTok: @apextorque</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Quick Links 1 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-4">
              {isAr ? 'الصيانة والإصلاح' : 'Diagnosing & Repair'}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#services" className="hover:text-white transition-colors">{isAr ? 'برمجة ستيج 1 و 2' : 'Stage I & II Tuning'}</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">{isAr ? 'تبديل زيت وفلتر' : 'Synthetic Oil Service'}</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">{isAr ? 'توضيب محركات' : 'Engine Overhaul'}</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">{isAr ? 'صيانة بريكات وسيراميك' : 'Brake Kits & Discs'}</a></li>
            </ul>
          </div>

          {/* Quick Links 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-4">
              {isAr ? 'القطع والمعرض' : 'Performance & Showroom'}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#showroom" className="hover:text-white transition-colors">{isAr ? 'سيارات للبيع' : 'Cars For Sale'}</a></li>
              <li><a href="#catalog" className="hover:text-white transition-colors">{isAr ? 'متجر القطع' : 'Performance Store'}</a></li>
              <li><a href="#diagnostics" className="hover:text-white transition-colors">{isAr ? 'فاحص الأعطال OBD2' : 'DTC Fault Scanner'}</a></li>
              <li><a href="#hero" className="hover:text-white transition-colors">{isAr ? 'تقرير الداينو' : 'Dyno Telemetry'}</a></li>
            </ul>
          </div>

          {/* Workshop Credentials */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-4">
              {isAr ? 'اعتمادات الورشة' : 'Workshop Standards'}
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> ISO 9001 Certified
              </div>
              <div>Bosch Master Diagnostic Suite</div>
              <div>Dynojet 4WD All-Wheel Cell</div>
              <div>Kuwait EPA Compliant</div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} APEX TORQUE GARAGE W.L.L. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-6">
            <a href="https://maps.google.com/?q=Shuwaikh+Industrial+Area+Kuwait" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400">
              {isAr ? 'موقع الورشة' : 'Workshop Map'}
            </a>
            <a href="#" className="hover:text-sky-400">
              {isAr ? 'الشروط والضمان' : 'Terms & Warranty'}
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
