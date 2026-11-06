import React, { useState } from 'react';
import { 
  FileSearch, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle, 
  Scale, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  FileCheck2, 
  Copy, 
  Check 
} from 'lucide-react';
import { Language } from '../types';

interface ContractRiskAnalyzerModalProps {
  language: Language;
  onClose: () => void;
  onBookAudit: (serviceTitle: string) => void;
}

export const ContractRiskAnalyzerModal: React.FC<ContractRiskAnalyzerModalProps> = ({
  language,
  onClose,
  onBookAudit,
}) => {
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [contractType, setContractType] = useState<string>('fidic');
  const [clauseType, setClauseType] = useState<string>('arbitration');
  const [copiedClause, setCopiedClause] = useState<boolean>(false);

  const contractTypes = [
    { id: 'fidic', labelAr: 'عقود المقاولات والإنشاءات (FIDIC)', labelEn: 'Construction & EPC Contracts (FIDIC)' },
    { id: 'mna', labelAr: 'اتفاقيات الاستحواذ وشراء الأسهم (SPA)', labelEn: 'M&A Share Purchase Agreements (SPA)' },
    { id: 'banking', labelAr: 'عقود التمويل المصرفي والمرابحة', labelEn: 'Islamic Facility & Murabaha Agreements' },
    { id: 'commercial', labelAr: 'عقود الامتياز التجاري والتوريد (Franchise)', labelEn: 'Commercial Agency & Franchise Contracts' },
  ];

  const clauseOptions = [
    { id: 'arbitration', labelAr: 'شرط فض النزاعات والتحكيم', labelEn: 'Dispute Resolution & Arbitral Seat' },
    { id: 'liability', labelAr: 'تحديد سقف المسؤولية والتعويضات', labelEn: 'Limitation of Liability & Caps' },
    { id: 'termination', labelAr: 'فسخ العقد وسحب الأعمال للتقصير', labelEn: 'Termination & Default Triggers' },
    { id: 'confidentiality', labelAr: 'الأسرار التجارية وحظر المنافسة', labelEn: 'Trade Secrets & Non-Compete' },
  ];

  // Forensic Analysis Database
  const getAnalysis = () => {
    if (clauseType === 'arbitration') {
      return {
        riskLevel: 'critical',
        riskLabelAr: 'مخاطرة حرجة (بطلان شرط التحكيم)',
        riskLabelEn: 'High Critical Risk (Nullification Hazard)',
        pitfallAr: 'كثير من العقود تقع في خطأ الجمع بين اختصاص المحاكم التجارية والتحكيم معاً في بند واحد، أو إغفال تحديد القانون الواجب التطبيق ومقر التحكيم المؤسسي (Seat of Arbitration)، مما يؤدي لبطلان الشرط ودفع الدفوع الشكلية لإضاعة الوقت.',
        pitfallEn: 'Many cross-border drafts erroneously combine court litigation and arbitration ambiguously, or omit the seat of arbitration and institutional rules (ICC/SCCA), giving adversaries grounds to challenge jurisdictional validity.',
        recommendedDraftAr: '«أي نزاع ينشأ عن هذا العقد أو يرتبط به، يتم حسمه نهائياً عن طريق التحكيم وفق قواعد المركز السعودي للتحكيم التجاري (SCCA) / غرفة التجارة الدولية (ICC) بواسطة هيئة تحكيم ثلاثية، ويكون مقر التحكيم الرياض، ولغة التحكيم اللغة العربية، ويطبق النظام السعودي على موضوع النزاع.»',
        recommendedDraftEn: '“Any dispute arising out of or in connection with this contract shall be finally settled under the Rules of Arbitration of the Saudi Center for Commercial Arbitration (SCCA) / ICC by three arbitrators. The seat of arbitration shall be Riyadh. The language of the arbitration shall be Arabic/English.”',
        statutoryRef: isAr ? 'المادة (9) و (11) من نظام التحكيم السعودي الصادر بالمرسوم الملكي رقم م/34' : 'Articles 9 & 11 of the Saudi Arbitration Law (Royal Decree M/34)',
      };
    } else if (clauseType === 'liability') {
      return {
        riskLevel: 'medium',
        riskLabelAr: 'مخاطرة متوسطة إلى عالية (المسؤولية غير المحددة)',
        riskLabelEn: 'Moderate-High Exposure (Uncapped Liabilities)',
        pitfallAr: 'عدم النص على سقف مالي إجمالي للتعويضات (Aggregate Liability Cap) واستثناء الأضرار غير المباشرة أو التبعية، قد يُلزم شركتك بمطالبات تعويض تفوق قيمة المشروع بمرات مضاعفة.',
        pitfallEn: 'Omitting a strict aggregate liability ceiling tied to contract value, or failing to disclaim consequential and indirect loss, exposes the corporate balance sheet to disproportionate damage claims.',
        recommendedDraftAr: '«لا تتجاوز المسؤولية الإجمالية لأي من الطرفين عن أية مطالبات بموجب هذا العقد نسبة 100% من إجمالي المبالغ المدفوعة فعلياً، ولا يتحمل أي طرف أية أضرار تبعية أو خسارة أرباح متوقعة باستثناء حالات الغش أو الخطأ الجسيم العمدي.»',
        recommendedDraftEn: '“To the maximum extent permitted by applicable law, neither party’s aggregate liability shall exceed 100% of the total fees actually paid, and neither party shall be liable for any indirect, consequential, or loss of profits damages.”',
        statutoryRef: isAr ? 'المادة (178) من نظام المعاملات المدنية السعودي الجديد' : 'Article 178 of the Saudi Civil Transactions Law',
      };
    } else if (clauseType === 'termination') {
      return {
        riskLevel: 'medium',
        riskLabelAr: 'مخاطرة إجرائية (إنهاء تعسفي غير مبرر)',
        riskLabelEn: 'Procedural Exposure (Wrongful Termination)',
        pitfallAr: 'إنهاء العقد الفوري دون منح فترة إنذار وتصحيح معقولة (Cure Period لا تقل عن 14-30 يوماً) يعرض الطرف المنهي لدعاوى التعويض عن الفسخ التعسفي وغرامات التأخير غير المستحقة.',
        pitfallEn: 'Terminating a contract unilaterally without statutory notice and mandatory cure periods exposes the executing party to heavy wrongful termination suits and penalty awards.',
        recommendedDraftAr: '«يحق لأي من الطرفين إنهاء العقد في حال ارتكاب الطرف الآخر إخلالاً جوهرياً، شريطة توجيه إخطار كتابي رسمي ومنحه مهلة تصحيح مدتها ثلاثون (30) يوماً من تاريخ استلام الإخطار دون تصحيح الإخلال.»',
        recommendedDraftEn: '“Either party may terminate this agreement upon written notice if the other party commits a material breach and fails to remedy such breach within thirty (30) days following receipt of notice.”',
        statutoryRef: isAr ? 'أحكام المادتين (107) و (108) من نظام المعاملات المدنية' : 'Articles 107 & 108 of the Civil Transactions Law',
      };
    } else {
      return {
        riskLevel: 'critical',
        riskLabelAr: 'مخاطرة حماية الملكية الفكرية وسرية البيانات',
        riskLabelEn: 'Critical IP & Trade Secrets Protection',
        pitfallAr: 'صياغة بنود السرية بعبارات فضفاضة أو عدم ربطها بنظام حماية البيانات الشخصية (PDPL) ونظام الأسماء التجارية، مما يجعل إثبات الضرر والتسريب بالغ الصعوبة أمام القضاء.',
        pitfallEn: 'Drafting generic confidentiality clauses without aligning with Personal Data Protection Law (PDPL) statutory penalties renders enforcement and discovery evidentiary burdens extremely onerous.',
        recommendedDraftAr: '«يلتزم الطرف المتلقي بالحفاظ التام على سرية كافة المعلومات الفنية، المالية، والبيانات الشخصية، وتظل هذه الالتزامات سارية طيلة مدة العقد ولمدة خمس (5) سنوات تالية لانهائه أو انقضائه لأي سبب.»',
        recommendedDraftEn: '“The recipient shall hold in strict confidence all proprietary technical, financial, and personal data. These obligations shall survive termination of this contract for five (5) consecutive years.”',
        statutoryRef: isAr ? 'نظام حماية البيانات الشخصية ونظام حماية الأسرار التجارية' : 'Personal Data Protection Law (PDPL) & Trade Secrets Statutes',
      };
    }
  };

  const analysis = getAnalysis();

  const handleCopy = () => {
    const text = isAr ? analysis.recommendedDraftAr : analysis.recommendedDraftEn;
    navigator.clipboard.writeText(text);
    setCopiedClause(true);
    setTimeout(() => setCopiedClause(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0b101e] border border-amber-500/35 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 text-slate-200">
        
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
            <FileSearch className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-serif">
              {isAr ? 'فاحص مخاطر العقود والبنود القانونية' : 'Contract Risk & Legal Clause Forensics'}
            </h3>
            <span className="text-xs text-amber-400/90 font-mono">
              {isAr ? 'تدقيق احترافي للثغرات التعاقدية' : 'Forensic Clause Audit & statutory benchmarks'}
            </span>
          </div>
        </div>

        {/* Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              {isAr ? 'نوع العقد المستهدف' : 'Contract Category'}
            </label>
            <select
              value={contractType}
              onChange={(e) => setContractType(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              {contractTypes.map((c) => (
                <option key={c.id} value={c.id}>
                  {isAr ? c.labelAr : c.labelEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              {isAr ? 'البند القانوني محل الفحص' : 'Critical Clause Under Review'}
            </label>
            <select
              value={clauseType}
              onChange={(e) => setClauseType(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              {clauseOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {isAr ? o.labelAr : o.labelEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Risk Breakdown Card */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4 mb-6">
          
          {/* Risk Level Badge */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs text-slate-400 font-medium">
              {isAr ? 'مؤشر المخاطرة التعاقدية:' : 'Risk Exposure Index:'}
            </span>
            <span
              className={`px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 ${
                analysis.riskLevel === 'critical'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{isAr ? analysis.riskLabelAr : analysis.riskLabelEn}</span>
            </span>
          </div>

          {/* Pitfall Explanation */}
          <div>
            <span className="text-[11px] font-semibold text-amber-400 block mb-1">
              {isAr ? 'الثغرة الشائعة في الصياغة القضائية:' : 'Common Litigation Pitfall:'}
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isAr ? analysis.pitfallAr : analysis.pitfallEn}
            </p>
          </div>

          {/* Recommended Statutory Draft */}
          <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 text-xs relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAr ? 'الصياغة القانونية المحكمة الموصى بها:' : 'Recommended Fortress Clause Drafting:'}</span>
              </span>
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 transition-colors"
              >
                {copiedClause ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedClause ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ البند' : 'Copy')}</span>
              </button>
            </div>
            <p className="text-slate-200 leading-relaxed font-sans font-medium">
              {isAr ? analysis.recommendedDraftAr : analysis.recommendedDraftEn}
            </p>
          </div>

          {/* Statute Reference */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
            <Scale className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{analysis.statutoryRef}</span>
          </div>

        </div>

        {/* Bottom CTA to Book Contract Audit with Lead Counsel */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => {
              onClose();
              onBookAudit(isAr ? 'مراجعة وتدقيق العقود والاتفاقيات' : 'Contract Due Diligence & Audit');
            }}
            className="w-full sm:flex-1 py-3 px-4 text-xs sm:text-sm font-bold bg-amber-400 text-slate-950 rounded-xl hover:bg-amber-300 transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            <span>{isAr ? 'تكليف المستشار بفحص العقد كاملاً' : 'Retain Partner for Full Contract Audit'}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-4 text-xs font-medium text-slate-300 bg-slate-800 rounded-xl hover:bg-slate-700"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
