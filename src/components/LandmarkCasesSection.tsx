import React, { useState } from 'react';
import { Trophy, TrendingUp, ShieldAlert, Award, ArrowUpRight, Scale } from 'lucide-react';
import { CaseStudy, Language } from '../types';

interface LandmarkCasesSectionProps {
  caseStudies: CaseStudy[];
  language: Language;
  onOpenBooking: () => void;
}

export const LandmarkCasesSection: React.FC<LandmarkCasesSectionProps> = ({
  caseStudies,
  language,
  onOpenBooking,
}) => {
  const isAr = language === 'ar';
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = isAr ? [
    { id: 'all', label: 'جميع الإنجازات' },
    { id: 'arbitration-litigation', label: 'التحكيم الدولي' },
    { id: 'corporate-investment', label: 'صفقات الاندماج M&A' },
    { id: 'intellectual-property', label: 'الملكية الفكرية' },
    { id: 'banking-islamic-finance', label: 'إعادة الهيكلة المصرفية' },
  ] : [
    { id: 'all', label: 'All Cases' },
    { id: 'arbitration-litigation', label: 'International Arbitration' },
    { id: 'corporate-investment', label: 'M&A Transactions' },
    { id: 'intellectual-property', label: 'IP Enforcement' },
    { id: 'banking-islamic-finance', label: 'Debt Restructuring' },
  ];

  const filtered = caseStudies.filter((c) => {
    if (activeCategory === 'all') return true;
    return c.practiceAreaId === activeCategory;
  });

  return (
    <section id="landmark-cases" className="py-20 lg:py-28 border-b border-amber-500/15 relative bg-[#060a14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-amber-400 block mb-2 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'سجل الانتصارات والقضايا الكبرى' : 'Track Record of Landmark Victories'}</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-serif tracking-tight">
              {isAr ? 'نتائج موثقة بالأرقام والوقائع القضائية' : 'Documented Precedents & High-Stakes Victories'}
            </h2>
          </div>
          <p className="text-slate-400 text-sm max-w-md">
            {isAr
              ? 'مجموعة مختارة من النزاعات والصفقات الكبرى التي حقق فيها فريقنا أحكاماً قطعية ملزمة وتسويات تصب في مصلحة موكلينا.'
              : 'A curated selection of high-value disputes and cross-border transactions where our advocacy secured decisive outcomes.'}
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-2 mb-10 p-1.5 bg-slate-900/80 border border-slate-800 rounded-xl max-w-fit">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Highlight Banner with Arbitration Hall Image */}
        <div className="relative rounded-2xl overflow-hidden border border-amber-500/25 mb-12 shadow-2xl">
          <div className="h-64 sm:h-80 w-full relative">
            <img
              src="/src/assets/images/law_arbitration_hall_1793923200946.jpg"
              alt="International Commercial Arbitration Courtroom"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a] via-[#080d1a]/70 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="max-w-2xl">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
                  {isAr ? 'غرفة التجارة الدولية بباريس (ICC) والمركز السعودي (SCCA)' : 'ICC Paris & Saudi Center for Commercial Arbitration (SCCA)'}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-serif">
                  {isAr
                    ? 'كسب وإلزام بسداد أكثر من 420 مليون ريال في نزاع بنية تحتية هندسي'
                    : 'Securing SAR 420M Final Arbitral Award in Multi-Tier Infrastructure Dispute'}
                </h3>
              </div>
              <button
                onClick={onOpenBooking}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors whitespace-nowrap shrink-0 shadow-md flex items-center gap-1.5 self-start sm:self-auto"
              >
                <span>{isAr ? 'مناقشة نزاع مماثل' : 'Consult on Similar Dispute'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Case Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {filtered.map((cs) => (
            <div
              key={cs.id}
              className="p-6 sm:p-7 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header: Year & Client Type (No pill box) */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-4 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-mono font-semibold">{cs.year}</span>
                    <span aria-hidden="true">·</span>
                    <span>{isAr ? cs.clientType : cs.clientTypeEn}</span>
                  </div>
                  <span className="text-amber-400 font-bold font-mono tabular-nums text-sm">
                    {isAr ? cs.amount : cs.amountEn}
                  </span>
                </div>

                {/* Case Title */}
                <h4 className="text-lg font-bold text-white font-serif mb-3 leading-snug">
                  {isAr ? cs.title : cs.titleEn}
                </h4>

                {/* Summary */}
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                  {isAr ? cs.summary : cs.summaryEn}
                </p>
              </div>

              {/* Outcome Badge Strip */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                <span className="text-amber-400/90 font-semibold block mb-1">
                  {isAr ? 'النتيجة والحكم الصادر:' : 'Judgment & Conclusive Outcome:'}
                </span>
                <span className="text-slate-200 font-medium">
                  {isAr ? cs.outcome : cs.outcomeEn}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
