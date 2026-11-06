import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, Award, FileText, CheckCircle2, Sliders, RotateCw, Sparkles, Scale, Compass } from 'lucide-react';
import { Language, FirmSettings } from '../types';

interface HeroSectionProps {
  language: Language;
  onOpenBooking: () => void;
  onOpenAssessment: () => void;
  settings: FirmSettings;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  language, 
  onOpenBooking, 
  onOpenAssessment,
  settings 
}) => {
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden border-b border-amber-500/15">
      
      {/* Subtle Atmospheric Light Cone highlighting the 3D Scale in background */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-gradient-to-tr from-amber-500/10 via-amber-300/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Grid: Text & Value Proposition with open aperture for the 3D Background Scale */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Column 1: Persuasive Legal Editorial Copy (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start text-start">
            
            {/* Clean Unboxed Trust Tagline */}
            <div className="flex items-center gap-2 text-xs font-medium text-amber-400/90 tracking-wide uppercase mb-4">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'نخبة المحامين والمستشارين المعتمدين' : 'Elite Attorneys & Certified International Counsel'}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{isAr ? 'الرياض · دبي · لندن' : 'Riyadh · Dubai · London'}</span>
            </div>

            {/* Master Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-serif leading-[1.25] tracking-tight mb-6 max-w-2xl">
              {isAr ? (
                <>
                  ريادة قانونية استثنائية،{' '}
                  <span className="gold-gradient-text">تحمي مكتسباتك</span> وترسخ عدالتك المؤسسية
                </>
              ) : (
                <>
                  Strategic Legal Mastery{' '}
                  <span className="gold-gradient-text">Protecting Your Enterprise</span> & High-Value Assets
                </>
              )}
            </h1>

            {/* Concrete Value Proposition */}
            <p className="text-base sm:text-lg text-slate-200/90 leading-relaxed max-w-xl mb-8">
              {isAr
                ? 'نقدم حلولاً قانونية رفيعة المستوى في التحكيم التجاري الدولي، حوكمة الشركات، وصفقات الاستحواذ والتقاضي المالي المعقد، مدعومة بخبرة تمتد لأكثر من ربع قرن لحماية مصالحك الاستراتيجية.'
                : 'Delivering world-class counsel in international commercial arbitration, cross-border M&A transactions, and complex commercial dispute resolution for sovereign funds and multinational conglomerates.'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto px-6 py-3.5 text-sm sm:text-base font-semibold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 rounded-xl hover:shadow-[0_0_25px_rgba(212,175,55,0.45)] hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <span>{isAr ? 'احجز استشارتك الاستراتيجية' : 'Schedule Strategy Consultation'}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenAssessment}
                className="w-full sm:w-auto px-6 py-3.5 text-sm sm:text-base font-medium text-slate-200 bg-slate-900/80 border border-slate-700/80 hover:border-amber-500/50 hover:text-amber-300 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'تقييم فوري لموقفك القانوني' : 'Immediate Case Diagnostic'}</span>
              </button>
            </div>

            {/* Trust Markers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 w-full">
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{isAr ? 'ترخيص رسمي من وزارة العدل' : 'Ministry of Justice Certified'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{isAr ? 'عضوية محاكم التحكيم الدولية' : 'ICC & SCCA Arbitrator Panels'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{isAr ? 'اتفاقيات سرية فورية (NDA)' : 'Strict Encrypted Confidentiality'}</span>
              </div>
            </div>

          </div>

          {/* Column 2: Elegant Glass Showcase Framing the 3D Scale (5 cols) */}
          <div className="lg:col-span-5 relative flex flex-col justify-center">
            
            <div className="rounded-2xl bg-slate-950/40 border border-amber-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              
              {/* Header Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-amber-400/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Scale className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-serif">
                      {isAr ? 'ميزان العدالة التفاعلي 3D' : 'Live 3D Balance of Justice'}
                    </h3>
                    <span className="text-[10px] text-amber-400/90 font-mono">
                      {isAr ? 'حركة فيزيائية طبيعية مستمرة' : 'Natural Harmonic Pendulum Physics'}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded font-mono">
                  3D SCENE
                </span>
              </div>

              {/* Informative Highlights */}
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                {isAr
                  ? 'يتحرك ميزان العدالة الثلاثي الأبعاد في خلفية الموقع بحركة فيزيائية طبيعية وتناغمية تحاكي توازن الأدلة ورجحان الحجة في قاعات التحكيم والمحاكم التجارية العليا.'
                  : 'The 3D Scales of Justice gently sway in the website background with natural harmonic oscillations, emulating the weighted equilibrium of legal proof across international tribunals.'}
              </p>

              {/* Dynamic Status Badges */}
              <div className="space-y-3 mb-6 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-400">{isAr ? 'ديناميكية الحركة:' : 'Motion State:'}</span>
                  <span className="text-amber-300 font-medium flex items-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '10s' }} />
                    <span>{isAr ? 'تأرجح فيزيائي طبيعي مستمر' : 'Continuous Natural Pendulum'}</span>
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-400">{isAr ? 'التفاعل مع التمرير:' : 'Scroll Parallax:'}</span>
                  <span className="text-white font-medium">{isAr ? 'تحرك عمودي وتفاعل تلقائي' : 'Active Depth & Parallax'}</span>
                </div>
              </div>

              {/* Fast Direct Action */}
              <button
                onClick={onOpenBooking}
                className="w-full py-3 px-4 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <span>{isAr ? 'طلب دراسة ملف قضية عاجلة' : 'Submit High-Stakes Case File'}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </button>

            </div>

          </div>

        </div>

        {/* Full-Width 4-Column KPI Strip in a Full-Width Row Below Hero Split */}
        <div className="mt-16 pt-8 border-t border-amber-500/20 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-serif tabular-nums">
              +{settings.yearsExperience}
            </span>
            <span className="text-xs sm:text-sm text-slate-200 font-medium mt-1">
              {isAr ? 'عاماً من التميز القانوني والتقاضي' : 'Years of Legal Prestige'}
            </span>
            <span className="text-[11px] text-slate-400 mt-1">
              {isAr ? 'منذ التأسيس عام 2001' : 'Founded in 2001'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-serif tabular-nums">
              {settings.casesWonPercent}%
            </span>
            <span className="text-xs sm:text-sm text-slate-200 font-medium mt-1">
              {isAr ? 'نسبة كسب القضايا والتحكيم' : 'Arbitration & Litigation Success'}
            </span>
            <span className="text-[11px] text-slate-400 mt-1">
              {isAr ? 'وفق سجل الأحكام القضائية القطعية' : 'Verified conclusive judgements'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-serif tabular-nums">
              {settings.totalDisputeValueSAR} {isAr ? 'ر.س' : 'SAR'}
            </span>
            <span className="text-xs sm:text-sm text-slate-200 font-medium mt-1">
              {isAr ? 'قيمة الصفقات والنزاعات المنجزة' : 'Total Managed Claims & Deals'}
            </span>
            <span className="text-[11px] text-slate-400 mt-1">
              {isAr ? 'في قطاعات المقاولات والاستثمار' : 'Across commercial & finance sectors'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-serif tabular-nums">
              +{settings.corporateClientsCount}
            </span>
            <span className="text-xs sm:text-sm text-slate-200 font-medium mt-1">
              {isAr ? 'شركة ومؤسسة متعددة الجنسيات' : 'Corporate & Sovereign Clients'}
            </span>
            <span className="text-[11px] text-slate-400 mt-1">
              {isAr ? 'عقود احتفاظ وحوكمة مستمرة' : 'Long-term corporate retainers'}
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};
