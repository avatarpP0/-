import React, { useState } from 'react';
import { 
  Scale, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  FileCheck, 
  Compass,
  Award,
  Sparkles
} from 'lucide-react';
import { Language } from '../types';

interface CaseAssessmentModalProps {
  language: Language;
  onClose: () => void;
  onProceedToBooking: (serviceName: string) => void;
}

export const CaseAssessmentModal: React.FC<CaseAssessmentModalProps> = ({
  language,
  onClose,
  onProceedToBooking,
}) => {
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [step, setStep] = useState<number>(1);
  const [sector, setSector] = useState<string>('arbitration');
  const [stage, setStage] = useState<string>('dispute_arose');
  const [claimValue, setClaimValue] = useState<string>('tier2');
  const [hasArbitrationClause, setHasArbitrationClause] = useState<boolean>(true);
  const [isCalculated, setIsCalculated] = useState<boolean>(false);

  const sectors = [
    { id: 'arbitration', labelAr: 'التحكيم التجاري وعقود المقاولات (FIDIC)', labelEn: 'Commercial Arbitration & FIDIC Construction' },
    { id: 'corporate', label: 'الشركات، الاندماج والاستحواذ (M&A)', labelEn: 'Corporate M&A, Governance & Joint Ventures' },
    { id: 'banking', label: 'المصرفية، الصكوك والنزاعات التمويلية', labelEn: 'Banking, Sukuk & Islamic Financial Disputes' },
    { id: 'ip', label: 'الملكية الفكرية والتعدي على براءات الاختراع', labelEn: 'IP, Patents & Unfair Competition Defense' },
    { id: 'tech', label: 'الأمن السيبراني، حماية البيانات والجرائم التقنية', labelEn: 'Cybersecurity, PDPL Compliance & Tech Crimes' },
  ];

  const stages = [
    { id: 'negotiation', labelAr: 'مفاوضات ودية أو تعثر في تنفيذ العقد', labelEn: 'Amicable Negotiations / Contractual Breach' },
    { id: 'notice_served', labelAr: 'تم توجيه أو استلام إخطار عدلي / إنذار رسمي', labelEn: 'Formal Legal Notice Served or Received' },
    { id: 'lawsuit_filed', labelAr: 'دعوى مرفوعة أمام المحكمة المختصة أو التحكيم', labelEn: 'Active Lawsuit / Arbitral Tribunal Initiated' },
    { id: 'judgment_appeal', labelAr: 'صدور حكم ابتدائي ومرحلة الاستئناف والطعن', labelEn: 'First-Instance Judgment Issued / Appeal Stage' },
    { id: 'enforcement', labelAr: 'تنفيذ أحكام قضائية أو قرارات تحكيم أجنبية', labelEn: 'Enforcement of Foreign Awards & Judgments' },
  ];

  const claimValues = [
    { id: 'tier1', labelAr: 'أقل من 3 ملايين ريال', labelEn: 'Under SAR 3 Million' },
    { id: 'tier2', labelAr: '3 - 25 مليون ريال', labelEn: 'SAR 3M - 25M' },
    { id: 'tier3', labelAr: '25 - 100 مليون ريال', labelEn: 'SAR 25M - 100M' },
    { id: 'tier4', labelAr: 'أكثر من 100 مليون ريال (قضايا سيادية/كبرى)', labelEn: 'SAR 100M+ (High-Stakes Sovereign Claims)' },
  ];

  // Assessment recommendation calculation
  const getAssessmentOutcome = () => {
    let statute = isAr ? 'نظام التحكيم السعودي ولائحة غرفة التجارة الدولية (ICC)' : 'Saudi Arbitration Law & ICC Arbitration Rules';
    let urgencyLevel = isAr ? 'متوسط الأولوية (خلال 3-5 أيام)' : 'Medium Priority (3-5 Days)';
    let assignedPartner = isAr ? 'المستشار عبد العزيز بن ناصر التميمي' : 'Counsel Abdulaziz Al-Tamimi';
    let strategicRecommendation = isAr
      ? 'نوصي بطلب تدقيق عاجل لشرط التحكيم ومراجعة ملف المراسلات الهندسية لاستصدار مذكرة دفاع مبدئية، مع التجهيز لطلب أوامر وقتية وتحفظية لمنع تسييل خطابات الضمان المصرفية.'
      : 'Immediate audit of the dispute escalation clause and correspondence chronology recommended. Prepare emergency injunctive applications to restrain bank guarantees liquidation.';

    if (sector === 'corporate') {
      statute = isAr ? 'نظام الشركات السعودي الجديد ولوائح هيئة السوق المالية' : 'New Saudi Companies Law & CMA Regulatory Statutes';
      assignedPartner = isAr ? 'د. خالد بن سلطان الرشيد' : 'Dr. Khaled Al-Rasheed';
      strategicRecommendation = isAr
        ? 'يوصى بتشكيل فريق فحص نافٍ للجهالة قانوني ومراجعة اتفاقية المساهمين لحماية مقاعد مجلس الإدارة وصياغة بنود الحماية الاستثمارية قبل توقيع أي ملحق إضافي.'
        : 'Formulate targeted legal due diligence team; review Shareholder Agreement (SHA) voting thresholds and insert indemnity safeguards prior to executing amendments.';
    } else if (sector === 'banking') {
      statute = isAr ? 'أنظمة البنك المركزي السعودي (ساما) ولجنة تسوية المنازعات المصرفية' : 'SAMA Banking Framework & Banking Disputes Committee Regulations';
      assignedPartner = isAr ? 'المستشارة نورة بنت فهد الهاجري' : 'Counsel Noura Al-Hajri';
      strategicRecommendation = isAr
        ? 'مراجعة شروط التمويل الإسلامي، وتوثيق تواريخ الإخلال لإعداد مذكرة تسوية ودية أو الترافع المباشر أمام لجان الأوراق المالية والمنازعات التمويلية.'
        : 'Analyze Shariah compliance terms, verify default timelines, and draft structured standstill settlement or petition before Banking Disputes Tribunals.';
    }

    if (stage === 'notice_served' || stage === 'lawsuit_filed') {
      urgencyLevel = isAr ? 'أولوية قصوى عاجلة (خلال 24-48 ساعة)' : 'Critical Urgency (24-48 Hours)';
    }

    return {
      statute,
      urgencyLevel,
      assignedPartner,
      strategicRecommendation,
    };
  };

  const outcome = getAssessmentOutcome();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0b101e] border border-amber-500/35 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 end-5 p-2 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-amber-400/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Scale className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-serif">
              {isAr ? 'التقييم القانوني الأولي للملف والنزاع' : 'Strategic Case Assessment & Legal Triage'}
            </h3>
            <span className="text-xs text-amber-400/90 font-mono">
              {isAr ? 'تشخيص إجرائي فوري وسري' : 'Confidential Procedural Diagnostic'}
            </span>
          </div>
        </div>

        {!isCalculated ? (
          /* Assessment Questions Wizard */
          <div className="space-y-6">
            
            {/* Step 1: Sector */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                1. {isAr ? 'ما هو القطاع أو الموضوع الرئيسي للنزاع؟' : 'Dispute Sector or Core Subject Matter'}
              </label>
              <div className="space-y-2">
                {sectors.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSector(s.id)}
                    className={`w-full p-3 rounded-xl text-xs font-medium border text-start flex items-center justify-between transition-all ${
                      sector === s.id
                        ? 'bg-amber-400/15 border-amber-500 text-amber-300 font-semibold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span>{isAr ? (s.labelAr || s.label) : s.labelEn}</span>
                    {sector === s.id && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Current Stage */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                2. {isAr ? 'ما هي المرحلة الحالية للملف؟' : 'Current Procedural Stage'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {stages.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setStage(st.id)}
                    className={`p-3 rounded-xl text-xs font-medium border text-start flex items-start gap-2 transition-all ${
                      stage === st.id
                        ? 'bg-amber-400/15 border-amber-500 text-amber-300 font-semibold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="mt-0.5">
                      <div className={`w-2 h-2 rounded-full ${stage === st.id ? 'bg-amber-400' : 'bg-slate-600'}`} />
                    </div>
                    <span>{isAr ? st.labelAr : st.labelEn}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Claim / Transaction Value */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                3. {isAr ? 'القيمة التقديرية للمطالبة المالية أو الصفقة' : 'Estimated Claim / Transaction Magnitude'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {claimValues.map((cv) => (
                  <button
                    key={cv.id}
                    type="button"
                    onClick={() => setClaimValue(cv.id)}
                    className={`p-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                      claimValue === cv.id
                        ? 'bg-amber-400 text-slate-950 font-bold border-amber-400'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {isAr ? cv.labelAr : cv.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Arbitration Clause Check */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
              <span className="text-slate-200 font-medium">
                {isAr ? 'هل يتضمن العقد شرط تحكيم صريح؟' : 'Does the contract contain an explicit arbitration clause?'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setHasArbitrationClause(true)}
                  className={`px-3 py-1 rounded-lg font-semibold ${
                    hasArbitrationClause ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isAr ? 'نعم' : 'Yes'}
                </button>
                <button
                  type="button"
                  onClick={() => setHasArbitrationClause(false)}
                  className={`px-3 py-1 rounded-lg font-semibold ${
                    !hasArbitrationClause ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isAr ? 'لا / غير متأكد' : 'No / Unsure'}
                </button>
              </div>
            </div>

            {/* Run Assessment Button */}
            <button
              type="button"
              onClick={() => setIsCalculated(true)}
              className="w-full py-3.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2"
            >
              <span>{isAr ? 'استخراج التقرير والتشخيص الاستراتيجي' : 'Generate Strategic Case Diagnostic'}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>

          </div>
        ) : (
          /* Assessment Results Report */
          <div className="space-y-6">
            
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/30">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'التشخيص القانوني الأولي المعتمد' : 'Preliminary Strategic Assessment'}</span>
              </div>
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                {outcome.strategicRecommendation}
              </p>
            </div>

            {/* Matrix Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block mb-1">{isAr ? 'النظام والولاية القضائية' : 'Applicable Framework'}</span>
                <span className="text-white font-medium leading-snug block">{outcome.statute}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block mb-1">{isAr ? 'مستوى الأسبقية الزمنية' : 'Priority Assessment'}</span>
                <span className="text-amber-400 font-semibold block">{outcome.urgencyLevel}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block mb-1">{isAr ? 'الشريك المقترح للملف' : 'Lead Designated Counsel'}</span>
                <span className="text-white font-medium leading-snug block">{outcome.assignedPartner}</span>
              </div>
            </div>

            {/* Confidentiality Notice */}
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-900/40 border border-slate-800 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                {isAr
                  ? 'هذا التقييم أولي استرشادي؛ سيتم إبرام اتفاقية عدم إفصاح (NDA) رسمية قبل الاطلاع على وثائق ومستندات التعاقد.'
                  : 'Diagnostic is indicative; formal NDA is executed prior to examining underlying contracts and discovery files.'}
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => {
                  onClose();
                  onProceedToBooking(sectors.find((s) => s.id === sector)?.labelAr || 'التحكيم التجاري الدولي');
                }}
                className="w-full sm:flex-1 py-3 px-4 text-xs sm:text-sm font-bold bg-amber-400 text-slate-950 rounded-xl hover:bg-amber-300 transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <span>{isAr ? 'جدولة جلسة دراسة ملف مع الشريك' : 'Schedule Strategy Session with Counsel'}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsCalculated(false)}
                className="w-full sm:w-auto py-3 px-4 text-xs font-medium text-slate-300 bg-slate-800 rounded-xl hover:bg-slate-700"
              >
                {isAr ? 'تعديل المعطيات' : 'Edit Inputs'}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
