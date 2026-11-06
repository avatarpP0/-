import React, { useState } from 'react';
import { 
  Building2, 
  Scale, 
  Coins, 
  Home, 
  ShieldCheck, 
  Cpu, 
  ArrowUpRight, 
  CheckCircle, 
  Clock, 
  UserCheck, 
  X,
  FileCheck2
} from 'lucide-react';
import { PracticeArea, Language } from '../types';

interface PracticeAreasSectionProps {
  practiceAreas: PracticeArea[];
  language: Language;
  onSelectService: (serviceTitle: string) => void;
  onOpenContractAnalyzer: () => void;
}

export const PracticeAreasSection: React.FC<PracticeAreasSectionProps> = ({
  practiceAreas,
  language,
  onSelectService,
  onOpenContractAnalyzer,
}) => {
  const isAr = language === 'ar';
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedAreaModal, setSelectedAreaModal] = useState<PracticeArea | null>(null);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Building2': return <Building2 className="w-6 h-6 text-amber-400" />;
      case 'Scale': return <Scale className="w-6 h-6 text-amber-400" />;
      case 'Coins': return <Coins className="w-6 h-6 text-amber-400" />;
      case 'Home': return <Home className="w-6 h-6 text-amber-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-amber-400" />;
      case 'Cpu': return <Cpu className="w-6 h-6 text-amber-400" />;
      default: return <Scale className="w-6 h-6 text-amber-400" />;
    }
  };

  const filterTabs = isAr ? [
    { id: 'all', label: 'جميع المجالات' },
    { id: 'corporate', label: 'الشركات والاستثمار' },
    { id: 'disputes', label: 'التحكيم والتقاضي' },
    { id: 'finance', label: 'المصرفية والعقارات' },
    { id: 'tech', label: 'التقنية والملكية الفكرية' },
  ] : [
    { id: 'all', label: 'All Disciplines' },
    { id: 'corporate', label: 'Corporate & M&A' },
    { id: 'disputes', label: 'Arbitration & Litigation' },
    { id: 'finance', label: 'Banking & Real Estate' },
    { id: 'tech', label: 'Tech & IP Law' },
  ];

  const filteredAreas = practiceAreas.filter((area) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'corporate') return area.id.includes('corporate');
    if (activeFilter === 'disputes') return area.id.includes('arbitration');
    if (activeFilter === 'finance') return area.id.includes('banking') || area.id.includes('real-estate');
    if (activeFilter === 'tech') return area.id.includes('tech') || area.id.includes('intellectual');
    return true;
  });

  return (
    <section id="practice-areas" className="py-20 lg:py-28 border-b border-amber-500/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-amber-400 block mb-2">
              {isAr ? 'مجالات الاختصاص والريادة' : 'Core Disciplines & Practice Areas'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-serif tracking-tight">
              {isAr ? 'حلول قانونية متكاملة تصنع الفارق' : 'Comprehensive Legal Solutions for Critical Stakes'}
            </h2>
          </div>
          <p className="text-slate-400 text-sm max-w-md">
            {isAr
              ? 'تتولى قطاعاتنا القانونية إدارة الملفات المعقدة وفق أعلى المعايير الدولية والأنظمة المحلية لضمان أقصى درجات الحماية القانونية.'
              : 'Our specialized practice teams navigate complex regulatory and cross-border landscapes with seasoned authority and forensic rigor.'}
          </p>
        </div>

        {/* Filter Segmented Controls (Functional Buttons) */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900/80 border border-slate-800 rounded-xl mb-12 max-w-fit">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                activeFilter === tab.id
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Asymmetric Bento / Practice Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredAreas.map((area, index) => {
            const numIndex = String(index + 1).padStart(2, '0');
            return (
              <div
                key={area.id}
                className="group relative rounded-2xl bg-gradient-to-b from-slate-900/70 to-[#0b101e]/90 border border-slate-800 hover:border-amber-500/40 p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(212,175,55,0.08)] flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Icon + Human Editorial Index (No // mechanical prefix) */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-500/25 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {getIcon(area.iconName)}
                    </div>
                    <span className="text-xs font-mono font-semibold text-amber-500/80 tracking-wider">
                      {numIndex}.
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white font-serif mb-3 group-hover:text-amber-300 transition-colors">
                    {isAr ? area.title : area.titleEn}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                    {isAr ? area.description : area.descriptionEn}
                  </p>

                  {/* Key points */}
                  <ul className="space-y-2 mb-6 border-t border-slate-800/80 pt-4">
                    {(isAr ? area.keyPoints : area.keyPointsEn).slice(0, 3).map((pt, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-400 leading-snug">
                        <CheckCircle className="w-3.5 h-3.5 text-amber-400/90 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Metadata & Actions */}
                <div className="border-t border-slate-800/80 pt-4 mt-auto">
                  {/* Clean unboxed metadata */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{isAr ? area.avgDuration : area.avgDurationEn}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                      <span className="truncate max-w-[130px]">{isAr ? area.leadAttorney : area.leadAttorneyEn}</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectService(isAr ? area.title : area.titleEn)}
                      className="flex-1 py-2 px-3 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm"
                    >
                      <span>{isAr ? 'طلب دراسة الملف' : 'Request Case Review'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setSelectedAreaModal(area)}
                      className="py-2 px-3 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors"
                      title={isAr ? 'عرض التفاصيل الكاملة' : 'View Full Details'}
                    >
                      {isAr ? 'التفاصيل' : 'Details'}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Contract Risk & Clause Audit Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900/80 to-amber-500/5 border border-amber-500/25 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div className="max-w-2xl">
            <span className="text-[11px] font-mono font-semibold text-amber-400 uppercase tracking-wider block mb-1">
              {isAr ? 'أداة تدقيق الصياغة القضائية' : 'Forensic Clause Scanner'}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-serif mb-2">
              {isAr ? 'فحص مخاطر وثغرات العقود التجارية' : 'Audit Commercial Contract Clauses & Liabilities'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isAr
                ? 'فحص فوري لبنود التحكيم، سقوف المسؤولية، شروط الفسخ، والأسرار التجارية وفق الأنظمة المعمول بها لتفادي البطلان القضائي.'
                : 'Instant analysis of arbitration agreements, liability caps, default triggers, and confidentiality clauses against statutory benchmarks.'}
            </p>
          </div>

          <button
            onClick={onOpenContractAnalyzer}
            className="px-6 py-3.5 text-xs sm:text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap self-start md:self-auto"
          >
            <span>{isAr ? 'فحص مخاطر العقد الآن' : 'Launch Clause Forensics'}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Detailed Modal Dialog */}
      {selectedAreaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0c1222] border border-amber-500/30 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedAreaModal(null)}
              className="absolute top-5 left-5 rtl:left-5 rtl:right-auto ltr:right-5 ltr:left-auto p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/60"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-500/30 flex items-center justify-center">
                {getIcon(selectedAreaModal.iconName)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-serif">
                  {isAr ? selectedAreaModal.title : selectedAreaModal.titleEn}
                </h3>
                <span className="text-xs text-amber-400">
                  {isAr ? 'مجال ممارسة استراتيجي' : 'Strategic Practice Domain'}
                </span>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              {isAr ? selectedAreaModal.description : selectedAreaModal.descriptionEn}
            </p>

            <div className="mb-6">
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'نطاق الخدمات والتدخل القانوني' : 'Scope of Legal Engagement'}</span>
              </h4>
              <ul className="space-y-2.5">
                {(isAr ? selectedAreaModal.keyPoints : selectedAreaModal.keyPointsEn).map((pt, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 mb-6 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">{isAr ? 'المستشار المسؤول' : 'Lead Partner'}</span>
                <span className="text-white font-medium">{isAr ? selectedAreaModal.leadAttorney : selectedAreaModal.leadAttorneyEn}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">{isAr ? 'متوسط المدة التقديرية' : 'Estimated Timeframe'}</span>
                <span className="text-white font-medium">{isAr ? selectedAreaModal.avgDuration : selectedAreaModal.avgDurationEn}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const title = isAr ? selectedAreaModal.title : selectedAreaModal.titleEn;
                  setSelectedAreaModal(null);
                  onSelectService(title);
                }}
                className="flex-1 py-3 px-4 text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <span>{isAr ? 'طلب استشارة في هذا المجال' : 'Book Consultation in this Area'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedAreaModal(null)}
                className="py-3 px-4 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
