import React from 'react';
import { Mail, Phone, GraduationCap, Award, ArrowUpRight, Scale } from 'lucide-react';
import { Attorney, Language } from '../types';

interface AttorneysSectionProps {
  attorneys: Attorney[];
  language: Language;
  onSelectAttorney: (attorney: Attorney) => void;
}

export const AttorneysSection: React.FC<AttorneysSectionProps> = ({
  attorneys,
  language,
  onSelectAttorney,
}) => {
  const isAr = language === 'ar';

  return (
    <section id="attorneys" className="py-20 lg:py-28 border-b border-amber-500/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-amber-400 block mb-2">
              {isAr ? 'نخبة الكفاءات القانونية' : 'Distinguished Senior Partners & Counsel'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-serif tracking-tight">
              {isAr ? 'قامات قانونية تقود قضاياك لأعلى درجات الأمان' : 'Eminent Legal Minds Directing Your Most Sensitive Affairs'}
            </h2>
          </div>
          <p className="text-slate-400 text-sm max-w-md">
            {isAr
              ? 'يضم فريقنا نخبة من خريجي أرقى كليات القانون العالمية (هارفارد، السوربون، كينجز لندن) ومحكمين دوليين معتمدين.'
              : 'Our partners hold advanced doctorates and master degrees from world-renowned faculties with certified seats on global arbitral panels.'}
          </p>
        </div>

        {/* Executive Atmosphere Banner */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 mb-16 h-48 sm:h-64 shadow-xl">
          <img
            src="/src/assets/images/law_firm_library_heritage_1793923199250.jpg"
            alt="Executive Legal Library and Conference Suite"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080d1a] via-[#080d1a]/80 to-transparent p-6 sm:p-10 flex flex-col justify-center">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
              {isAr ? 'البيئة المهنية الفاخرة' : 'Bespoke Executive Environment'}
            </span>
            <h3 className="text-lg sm:text-2xl font-bold text-white font-serif max-w-md">
              {isAr
                ? 'قاعات اجتماعات تنفيذية مجهزة بأعلى درجات السرية والتشفير'
                : 'Executive Boardrooms Configured for Total Discretion and High-Level Negotiations'}
            </h3>
          </div>
        </div>

        {/* Attorneys Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {attorneys.map((at) => (
            <div
              key={at.id}
              className="rounded-2xl bg-gradient-to-b from-slate-900/80 to-[#0c1222] border border-slate-800 hover:border-amber-500/40 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
            >
              <div>
                {/* Portrait Image */}
                <div className="w-full h-64 rounded-xl overflow-hidden mb-6 border border-slate-700/60 relative bg-slate-950">
                  <img
                    src={at.image}
                    alt={isAr ? at.name : at.nameEn}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <span className="absolute bottom-3 start-3 text-xs font-mono font-semibold text-amber-300 bg-slate-900/80 px-2 py-0.5 rounded border border-amber-500/30">
                    +{at.experienceYears} {isAr ? 'سنة خبرة' : 'Yrs Experience'}
                  </span>
                </div>

                {/* Name & Role */}
                <h3 className="text-xl font-bold text-white font-serif mb-1 group-hover:text-amber-300 transition-colors">
                  {isAr ? at.name : at.nameEn}
                </h3>
                <span className="text-xs font-medium text-amber-400/90 block mb-4">
                  {isAr ? at.role : at.roleEn}
                </span>

                {/* Education */}
                <div className="flex items-start gap-2 text-xs text-slate-300 mb-4 pb-3 border-b border-slate-800">
                  <GraduationCap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{isAr ? at.education : at.educationEn}</span>
                </div>

                {/* Bio brief */}
                <p className="text-slate-400 text-xs leading-relaxed mb-5">
                  {isAr ? at.bio : at.bioEn}
                </p>

                {/* Specializations list */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {(isAr ? at.specializations : at.specializationsEn).map((sp, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60"
                    >
                      {sp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Direct Action */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <button
                  onClick={() => onSelectAttorney(at)}
                  className="flex-1 py-2.5 px-3 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>{isAr ? 'حجز جلسة مع المستشار' : 'Reserve Strategy Call'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
