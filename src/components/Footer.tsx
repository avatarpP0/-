import React from 'react';
import { Scale, Phone, Mail, MapPin, ShieldCheck, ArrowUp } from 'lucide-react';
import { FirmSettings, Language } from '../types';

interface FooterProps {
  language: Language;
  settings: FirmSettings;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ language, settings, onOpenBooking }) => {
  const isAr = language === 'ar';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050812] border-t border-amber-500/15 pt-16 pb-12 relative text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand & Mission (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3 text-white">
              <div className="w-9 h-9 rounded-lg bg-amber-400/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Scale className="w-5 h-5 text-amber-400" />
              </div>
              <span className="font-bold text-lg font-serif">
                {isAr ? settings.firmNameAr : settings.firmNameEn}
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              {isAr
                ? 'مؤسسة قانونية رائدة متخصصة في التحكيم التجاري الدولي، حوكمة الشركات والاستثمار الأجنبي، والنزاعات العقارية والمصرفية الكبرى.'
                : 'A distinguished institutional law practice specialized in international arbitration, corporate M&A advisory, and complex commercial dispute resolution.'}
            </p>

            <div className="flex items-center gap-2 text-amber-400/80 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{settings.licenseNumber}</span>
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-white font-semibold block uppercase tracking-wider text-[11px]">
              {isAr ? 'الوصول السريع' : 'Navigation'}
            </span>
            <ul className="space-y-2">
              <li><a href="#practice-areas" className="hover:text-amber-300 transition-colors">{isAr ? 'مجالات الممارسة' : 'Practice Areas'}</a></li>
              <li><a href="#landmark-cases" className="hover:text-amber-300 transition-colors">{isAr ? 'القضايا الكبرى' : 'Landmark Cases'}</a></li>
              <li><a href="#attorneys" className="hover:text-amber-300 transition-colors">{isAr ? 'المستشارون' : 'Attorneys'}</a></li>
              <li><a href="#calculator" className="hover:text-amber-300 transition-colors">{isAr ? 'حاسبة الاستشارة' : 'Fee Estimator'}</a></li>
              <li><a href="#faq" className="hover:text-amber-300 transition-colors">{isAr ? 'الأسئلة الشائعة' : 'FAQ'}</a></li>
            </ul>
          </div>

          {/* Practice Areas list (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-white font-semibold block uppercase tracking-wider text-[11px]">
              {isAr ? 'القطاعات والخبرات' : 'Key Sectors'}
            </span>
            <ul className="space-y-2">
              <li><span>{isAr ? 'التحكيم التجاري وغرف (ICC & SCCA)' : 'International Commercial Arbitration'}</span></li>
              <li><span>{isAr ? 'الاندماج والاستحواذ وحوكمة مجالس الإدارة' : 'M&A Transactions & Due Diligence'}</span></li>
              <li><span>{isAr ? 'النزاعات الهندسية وعقود الفيديك (FIDIC)' : 'Construction & FIDIC Claims'}</span></li>
              <li><span>{isAr ? 'المصرفية والتمويل الإسلامي والصكوك' : 'Islamic Banking & Debt Structuring'}</span></li>
              <li><span>{isAr ? 'حماية البيانات الشخصية والجرائم السيبرانية' : 'PDPL Compliance & Tech Law'}</span></li>
            </ul>
          </div>

          {/* Contact & Locations (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-white font-semibold block uppercase tracking-wider text-[11px]">
              {isAr ? 'المقر والتواصل' : 'Headquarters'}
            </span>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{isAr ? settings.addressAr : settings.addressEn}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white font-mono">{settings.phone}</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white">{settings.email}</a>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenBooking}
                className="w-full py-2.5 px-3 text-center font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
              >
                {isAr ? 'حجز موعد استشارة فورية' : 'Book Direct Consultation'}
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Developer Signature & Back to Top */}
        <div className="pt-8 flex flex-col lg:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-center sm:text-start">
            <p className="text-slate-500">
              © {new Date().getFullYear()} {isAr ? settings.firmNameAr : settings.firmNameEn}. {isAr ? 'جميع الحقوق محفوظة' : 'All rights reserved'}.
            </p>
            <span aria-hidden="true" className="hidden sm:inline text-slate-700">|</span>
            <div className="inline-flex items-center justify-center gap-2 text-amber-300 font-semibold bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-amber-500/15 px-3.5 py-1.5 rounded-full border border-amber-500/35 shadow-sm shadow-amber-950/40 hover:border-amber-400 hover:text-amber-200 transition-all cursor-default group">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="tracking-wide">
                {isAr ? 'صُنع بكل فخر واحترافية بواسطة المبرمج محمد تامر' : 'Crafted with distinction by Programmer Mohamed Tamer'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>{isAr ? 'سياسة الخصوصية والسرية' : 'Privacy & Professional Privilege'}</span>
            <span aria-hidden="true">·</span>
            <span>{isAr ? 'الشروط والأحكام' : 'Terms of Engagement'}</span>
            <button
              onClick={scrollToTop}
              className="p-1.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-amber-500/40 transition-colors flex items-center gap-1 ms-2"
              title={isAr ? 'العودة للأعلى' : 'Back to Top'}
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
