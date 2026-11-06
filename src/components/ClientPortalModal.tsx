import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  PhoneCall, 
  FileText, 
  Printer, 
  CheckCircle2, 
  X, 
  Download,
  Lock,
  UserCheck
} from 'lucide-react';
import { ConsultationRequest, Language, FirmSettings } from '../types';

interface ClientPortalModalProps {
  language: Language;
  onClose: () => void;
  consultations: ConsultationRequest[];
  settings: FirmSettings;
}

export const ClientPortalModal: React.FC<ClientPortalModalProps> = ({
  language,
  onClose,
  consultations,
  settings,
}) => {
  const isAr = language === 'ar';
  const [searchRef, setSearchRef] = useState('');
  const [foundBooking, setFoundBooking] = useState<ConsultationRequest | null>(null);
  const [searchError, setSearchError] = useState(false);
  const [showCharter, setShowCharter] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(false);
    const cleaned = searchRef.trim().toUpperCase();
    if (!cleaned) return;

    const match = consultations.find(
      (c) => c.referenceNumber.toUpperCase() === cleaned || c.id.toUpperCase() === cleaned
    );

    if (match) {
      setFoundBooking(match);
    } else {
      setSearchError(true);
      setFoundBooking(null);
    }
  };

  const handlePrint = () => {
    window.print();
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

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-amber-400/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Lock className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-serif">
              {isAr ? 'بوابة العميل والاستعلام عن ملف الاستشارة' : 'Client Confidential Portal & Booking Tracker'}
            </h3>
            <span className="text-xs text-amber-400/90 font-mono">
              {isAr ? 'استعلام مباشر مشفر وميثاق السرية' : 'Encrypted File Lookup & Legal Charter'}
            </span>
          </div>
        </div>

        {/* Search Bar by Reference Code */}
        <form onSubmit={handleSearch} className="mb-6">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            {isAr ? 'أدخل الرقم المرجعي للحجز (مثال: ADL-2026-9142)' : 'Enter Booking Reference (e.g. ADL-2026-9142)'}
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="ADL-2026-XXXX"
                value={searchRef}
                onChange={(e) => setSearchRef(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute end-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold bg-amber-400 text-slate-950 rounded-xl hover:bg-amber-300 transition-colors shrink-0"
            >
              {isAr ? 'استعلام' : 'Track File'}
            </button>
          </div>

          {searchError && (
            <p className="text-xs text-red-400 mt-2">
              {isAr
                ? 'لم يتم العثور على حجز بهذا الرقم المرجعي. يمكنك تجربة أحد الأرقام التجريبية: ADL-2026-9142 أو ADL-2026-8821'
                : 'No record matching this reference number. Try sample codes: ADL-2026-9142 or ADL-2026-8821'}
            </p>
          )}
        </form>

        {/* If Booking is found */}
        {foundBooking ? (
          <div className="space-y-6">
            
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-amber-500/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[11px] text-slate-400 block">{isAr ? 'صاحب الملف' : 'Client Name'}</span>
                  <span className="text-base font-bold text-white font-serif">{foundBooking.clientName}</span>
                  {foundBooking.companyName && (
                    <span className="text-xs text-amber-400/90 block">{foundBooking.companyName}</span>
                  )}
                </div>

                <div className="sm:text-end">
                  <span className="text-[11px] text-slate-400 block">{isAr ? 'حالة الطلب' : 'Current Status'}</span>
                  <span
                    className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold ${
                      foundBooking.status === 'confirmed'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : foundBooking.status === 'completed'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {foundBooking.status === 'confirmed'
                      ? (isAr ? 'تم تأكيد الموعد واعتماد المستشار' : 'Confirmed & Counsel Assigned')
                      : foundBooking.status === 'completed'
                      ? (isAr ? 'تمت الجلسة بنجاح' : 'Session Completed')
                      : (isAr ? 'قيد المراجعة وإعداد الملف' : 'Pending Formal Review')}
                  </span>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">{isAr ? 'المجال القانوني' : 'Practice Area'}</span>
                  <span className="text-white font-medium">{foundBooking.serviceType}</span>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">{isAr ? 'تاريخ ووقت الجلسة' : 'Scheduled Date & Time'}</span>
                  <span className="text-white font-medium">{foundBooking.preferredDate} ({foundBooking.preferredTime})</span>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">{isAr ? 'صيغة الانعقاد' : 'Meeting Format'}</span>
                  <span className="text-white font-medium flex items-center gap-1.5">
                    {foundBooking.meetingType === 'in_person' ? (
                      <>
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isAr ? 'المقر الرئيسي (برج العدالة المالي)' : 'Al-Adalah Financial Tower'}</span>
                      </>
                    ) : (
                      <>
                        <Video className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isAr ? 'جلسة فيديو مشفرة (رابط خاص)' : 'Encrypted Video Conference'}</span>
                      </>
                    )}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">{isAr ? 'الأتعاب المبدئية المعتمدة' : 'Approved Initial Retainer'}</span>
                  <span className="text-amber-400 font-bold font-mono tabular-nums">{foundBooking.estimatedFee.toLocaleString()} {isAr ? 'ر.س' : 'SAR'}</span>
                </div>
              </div>

              {/* Action buttons inside booking */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setShowCharter(!showCharter)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>{showCharter ? (isAr ? 'إخفاء ميثاق السرية' : 'Hide NDA Charter') : (isAr ? 'عرض ميثاق السرية (NDA)' : 'View Confidentiality NDA')}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isAr ? 'طباعة إشعار الحجز' : 'Print Booking Slip'}</span>
                </button>
              </div>

            </div>

            {/* Confidentiality Charter & NDA Text Box */}
            {showCharter && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/40 text-xs space-y-3 font-sans">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isAr ? 'ميثاق الحماية والسرية المهنية المشفرة' : 'Professional Confidentiality & Privilege Charter'}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{foundBooking.referenceNumber}</span>
                </div>

                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {isAr
                    ? `بموجب أنظمة المحاماة المعمول بها، يلتزم صرح العدالة للمحاماة والاستشارات القانونية بالحفاظ على السرية المطلقة لجميع المستندات، المعطيات، والملفات المقدمة من ${foundBooking.clientName} وتعتبر كافة المداولات مشمولة بالحصانة المهنية ضد الإفصاح لأي طرف ثالث.`
                    : `Pursuant to statutory attorney-client privilege codes, Sarh Al-Adalah undertakes strict perpetual confidentiality over all disclosures, briefs, and discovery submitted by ${foundBooking.clientName}. All consultative deliberations remain privileged and confidential.`}
                </p>

                <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500">
                  <span>{settings.licenseNumber}</span>
                  <span>{isAr ? 'ختم الاعتماد الرقمي' : 'Digital Verification Seal'}</span>
                </div>
              </div>
            )}

          </div>
        ) : (
          /* Empty / Suggestion state */
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400 space-y-3">
            <p>
              {isAr
                ? 'يمكنك الاستعلام عن موعدك ومتابعة تحديثات ملفك القانوني باستخدام الرقم المرجعي المرسل لك عند الحجز.'
                : 'Track your consultation schedule and access executed confidentiality certificates using your reference code.'}
            </p>
            <div className="text-[11px] text-slate-500">
              <span>{isAr ? 'عينة أرقام تجريبية للاختبار: ' : 'Sample codes for testing: '}</span>
              <button
                type="button"
                onClick={() => setSearchRef('ADL-2026-9142')}
                className="text-amber-400 font-mono underline hover:text-amber-300 mx-1"
              >
                ADL-2026-9142
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setSearchRef('ADL-2026-8821')}
                className="text-amber-400 font-mono underline hover:text-amber-300 mx-1"
              >
                ADL-2026-8821
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
