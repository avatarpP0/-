import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Calculator, 
  Calendar, 
  Clock, 
  Building, 
  User, 
  Mail, 
  Phone, 
  CheckCircle2, 
  ShieldAlert, 
  Video, 
  MapPin, 
  PhoneCall, 
  FileText,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check
} from 'lucide-react';
import { Language, ConsultationRequest, Attorney, PracticeArea } from '../types';

interface ConsultationCalculatorProps {
  language: Language;
  practiceAreas: PracticeArea[];
  attorneys: Attorney[];
  onConsultationBooked: (newBooking: ConsultationRequest) => void;
  preselectedService?: string;
}

export const ConsultationCalculator: React.FC<ConsultationCalculatorProps> = ({
  language,
  practiceAreas,
  attorneys,
  onConsultationBooked,
  preselectedService,
}) => {
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  // Form State
  const [selectedService, setSelectedService] = useState<string>(
    preselectedService || (practiceAreas[0] ? (isAr ? practiceAreas[0].title : practiceAreas[0].titleEn) : '')
  );
  const [complexity, setComplexity] = useState<'standard' | 'medium' | 'high'>('standard');
  const [urgency, setUrgency] = useState<'normal' | 'urgent'>('normal');
  const [meetingType, setMeetingType] = useState<'in_person' | 'virtual' | 'encrypted_call'>('in_person');
  const [selectedAttorneyId, setSelectedAttorneyId] = useState<string>('auto');
  
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [preferredDate, setPreferredDate] = useState('2026-11-12');
  const [preferredTime, setPreferredTime] = useState('11:00 AM');
  const [notes, setNotes] = useState('');

  const [submittedBooking, setSubmittedBooking] = useState<ConsultationRequest | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Update selectedService when preselectedService changes
  React.useEffect(() => {
    if (preselectedService) {
      setSelectedService(preselectedService);
    }
  }, [preselectedService]);

  // Dynamic fee calculation
  const calculateEstimatedFee = () => {
    let base = 2500;
    if (selectedService.includes('تحكيم') || selectedService.includes('Arbitration')) base = 5000;
    else if (selectedService.includes('شركات') || selectedService.includes('Corporate')) base = 4000;
    else if (selectedService.includes('مصرفية') || selectedService.includes('Banking')) base = 4500;
    else if (selectedService.includes('سيبراني') || selectedService.includes('Cyber')) base = 3500;

    if (complexity === 'medium') base *= 2.2;
    if (complexity === 'high') base *= 4.5;
    if (urgency === 'urgent') base *= 1.35;

    return Math.round(base);
  };

  const estimatedFee = calculateEstimatedFee();

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!clientName.trim()) {
      setValidationError(isAr ? 'يرجى إدخال اسم العميل أو الممثل القانوني' : 'Please provide client name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setValidationError(isAr ? 'يرجى إدخال بريد إلكتروني صالح' : 'Please provide a valid email');
      return;
    }
    if (!phone.trim()) {
      setValidationError(isAr ? 'يرجى إدخال رقم هاتف للتواصل والتأكيد' : 'Please provide a phone number');
      return;
    }

    const referenceNumber = `ADL-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: ConsultationRequest = {
      id: 'req-' + Date.now(),
      referenceNumber,
      clientName,
      email,
      phone,
      companyName: companyName.trim() || undefined,
      serviceType: selectedService,
      complexity,
      urgency,
      meetingType,
      preferredDate,
      preferredTime,
      attorneyId: selectedAttorneyId === 'auto' ? undefined : selectedAttorneyId,
      notes,
      status: 'pending',
      createdAt: new Date().toISOString(),
      estimatedFee,
      adminNotes: isAr ? 'طلب جديد وارد من حاسبة الموقع الحي' : 'Fresh booking from website calculator',
    };

    onConsultationBooked(newBooking);
    setSubmittedBooking(newBooking);

    // Trigger celebration
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#fef08a', '#1e293b', '#fbbf24'],
      });
    } catch {
      // safe fallback if confetti fails
    }
  };

  const copyReference = () => {
    if (!submittedBooking) return;
    navigator.clipboard.writeText(submittedBooking.referenceNumber);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2500);
  };

  return (
    <section id="calculator" className="py-20 lg:py-28 border-b border-amber-500/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-wider uppercase text-amber-400 block mb-2">
            {isAr ? 'شفافية مهنية وفورية' : 'Transparent Fee Estimator & Immediate Scheduling'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-serif tracking-tight mb-4">
            {isAr ? 'حاسبة الاستشارة وحجز موعد استراتيجي' : 'Interactive Legal Scope & Consultation Booking'}
          </h2>
          <p className="text-slate-400 text-sm">
            {isAr
              ? 'احسب تقدير الأتعاب المهنية بدقة وشفافية واحجز جلسة مباشرة مع الشريك المسؤول عن ملفك القانوني مع اتفاقية سرية فورية.'
              : 'Calculate upfront legal effort and reserve a dedicated strategy session with senior partners in total privacy.'}
          </p>
        </div>

        {submittedBooking ? (
          /* Confirmation Success Card */
          <div className="max-w-2xl mx-auto rounded-2xl bg-gradient-to-b from-[#0f172a] to-[#090e1a] border border-amber-500/40 p-8 sm:p-10 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-amber-400/20 border border-amber-500 flex items-center justify-center mx-auto mb-6 text-amber-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-white font-serif mb-2">
              {isAr ? 'تم تأكيد استلام طلب الاستشارة بنجاح' : 'Consultation Request Successfully Received'}
            </h3>
            <p className="text-slate-300 text-sm mb-6 max-w-md mx-auto">
              {isAr
                ? 'تم تسجيل طلبك وحفظه في جدول المستشارين، وسيقوم أمين سر المكتب بالتواصل معك لتأكيد الموعد وإرسال اتفاقية عدم الإفصاح (NDA).'
                : 'Your booking has been registered in our counsel roster. Our clerk will contact you promptly with confirmation and an executed NDA.'}
            </p>

            {/* Reference Number Box */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 flex items-center justify-between max-w-md mx-auto mb-6">
              <div className="text-start">
                <span className="text-[11px] text-slate-400 block">{isAr ? 'رقم الحجز المرجعي' : 'Booking Reference'}</span>
                <span className="text-lg font-mono font-bold text-amber-400">{submittedBooking.referenceNumber}</span>
              </div>
              <button
                onClick={copyReference}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedRef ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}</span>
              </button>
            </div>

            {/* Summary Details */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-start text-xs p-4 rounded-xl bg-slate-900/50 border border-slate-800 mb-8 max-w-lg mx-auto">
              <div>
                <span className="text-slate-400 block mb-1">{isAr ? 'الخدمة' : 'Service'}</span>
                <span className="text-white font-medium truncate block">{submittedBooking.serviceType}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">{isAr ? 'الموعد المفضل' : 'Preferred Date'}</span>
                <span className="text-white font-medium">{submittedBooking.preferredDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">{isAr ? 'الأتعاب التقديرية' : 'Estimated Fee'}</span>
                <span className="text-amber-400 font-bold tabular-nums font-mono">
                  {submittedBooking.estimatedFee.toLocaleString()} {isAr ? 'ر.س' : 'SAR'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setSubmittedBooking(null)}
                className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors"
              >
                {isAr ? 'حجز استشارة أخرى' : 'Book Another Session'}
              </button>
              <a
                href={`https://wa.me/966114508899?text=${encodeURIComponent(
                  isAr 
                    ? `السلام عليكم، أود متابعة طلب الاستشارة رقم: ${submittedBooking.referenceNumber}`
                    : `Hello, I would like to follow up on my legal consultation booking ref: ${submittedBooking.referenceNumber}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700 flex items-center gap-2"
              >
                <span>{isAr ? 'متابعة فورية عبر واتساب' : 'WhatsApp Instant Follow-up'}</span>
              </a>
            </div>

          </div>
        ) : (
          /* Main Interactive Form & Calculator Split */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 7 Columns: Interactive Configurator */}
            <form onSubmit={handleBookingSubmit} className="lg:col-span-7 rounded-2xl bg-slate-900/60 border border-slate-800 p-6 sm:p-8 space-y-6">
              
              {/* Step 1: Select Service */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                  1. {isAr ? 'المجال القانوني محل الاستشارة' : 'Legal Practice Area'}
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full bg-[#080d1a] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                >
                  {practiceAreas.map((pa) => (
                    <option key={pa.id} value={isAr ? pa.title : pa.titleEn}>
                      {isAr ? pa.title : pa.titleEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Complexity & Urgency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                    2. {isAr ? 'مستوى التعقيد وحجم النزاع' : 'Case Complexity'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'standard', labelAr: 'محدد', labelEn: 'Focused' },
                      { id: 'medium', labelAr: 'متوسط', labelEn: 'Medium' },
                      { id: 'high', labelAr: 'معقد/كبرى', labelEn: 'High Stakes' },
                    ].map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setComplexity(item.id as any)}
                        className={`py-2 px-2 rounded-lg text-xs font-medium border transition-all text-center ${
                          complexity === item.id
                            ? 'bg-amber-400 text-slate-950 border-amber-400 font-semibold shadow-sm'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {isAr ? item.labelAr : item.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                    3. {isAr ? 'مدى الاستعجال' : 'Urgency Timeline'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setUrgency('normal')}
                      className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all text-center ${
                        urgency === 'normal'
                          ? 'bg-amber-400 text-slate-950 border-amber-400 font-semibold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {isAr ? 'عادي (خلال 3 أيام)' : 'Standard (3-5 Days)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setUrgency('urgent')}
                      className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all text-center flex items-center justify-center gap-1 ${
                        urgency === 'urgent'
                          ? 'bg-amber-500 text-slate-950 border-amber-500 font-semibold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-900" />
                      <span>{isAr ? 'عاجل (24 ساعة)' : 'Urgent (24h)'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 3: Meeting Format */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                  4. {isAr ? 'صيغة انعقاد الجلسة' : 'Meeting Format'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'in_person', icon: MapPin, labelAr: 'حضوري بالمقر (برج العدالة)', labelEn: 'In-Person (Tower)' },
                    { id: 'virtual', icon: Video, labelAr: 'جلسة مرئية مشفرة', labelEn: 'Encrypted Video Call' },
                    { id: 'encrypted_call', icon: PhoneCall, labelAr: 'اتصال هاتفي مباشر', labelEn: 'Direct Phone' },
                  ].map((fmt) => {
                    const Icon = fmt.icon;
                    return (
                      <button
                        type="button"
                        key={fmt.id}
                        onClick={() => setMeetingType(fmt.id as any)}
                        className={`p-3 rounded-xl text-xs font-medium border flex items-center gap-2.5 transition-all text-start ${
                          meetingType === fmt.id
                            ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{isAr ? fmt.labelAr : fmt.labelEn}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Attorney selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                  5. {isAr ? 'المستشار القانوني المفضل' : 'Preferred Attorney'}
                </label>
                <select
                  value={selectedAttorneyId}
                  onChange={(e) => setSelectedAttorneyId(e.target.value)}
                  className="w-full bg-[#080d1a] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="auto">
                    {isAr ? '⭐ التعيين الذكي: اختيار الشريك الأنسب لملفك آلياً' : '⭐ Auto-Assign: Best suited Senior Partner'}
                  </option>
                  {attorneys.map((at) => (
                    <option key={at.id} value={at.id}>
                      {isAr ? `${at.name} (${at.role})` : `${at.nameEn} (${at.roleEn})`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 5: Client Contact Details */}
              <div className="pt-4 border-t border-slate-800/80">
                <span className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
                  6. {isAr ? 'بيانات التواصل والتأكيد' : 'Contact & Verification'}
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">{isAr ? 'اسم العميل / الصفة' : 'Client Full Name'}</label>
                    <input
                      type="text"
                      required
                      placeholder={isAr ? 'مثال: عبد الرحمن السعيد' : 'e.g. John Doe'}
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-[#080d1a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">{isAr ? 'اسم الشركة / المؤسسة (اختياري)' : 'Company Name (Optional)'}</label>
                    <input
                      type="text"
                      placeholder={isAr ? 'مثال: شركة الرواد للاستثمار' : 'e.g. Acme Capital'}
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-[#080d1a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">{isAr ? 'البريد الإلكتروني المهني' : 'Corporate Email'}</label>
                    <input
                      type="email"
                      required
                      placeholder="client@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#080d1a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">{isAr ? 'رقم الجوال للتأكيد الفوري' : 'Phone Number'}</label>
                    <input
                      type="tel"
                      required
                      placeholder="+966 5x xxx xxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#080d1a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">{isAr ? 'التاريخ المفضل' : 'Preferred Date'}</label>
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full bg-[#080d1a] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">{isAr ? 'الوقت المفضل' : 'Preferred Time'}</label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full bg-[#080d1a] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="10:00 AM">10:00 {isAr ? 'صباحاً' : 'AM'}</option>
                      <option value="11:30 AM">11:30 {isAr ? 'صباحاً' : 'AM'}</option>
                      <option value="02:00 PM">02:00 {isAr ? 'ظهراً' : 'PM'}</option>
                      <option value="04:30 PM">04:30 {isAr ? 'عصراً' : 'PM'}</option>
                      <option value="07:00 PM">07:00 {isAr ? 'مساءً' : 'PM'}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">{isAr ? 'نبذة مختصرة عن موضوع الاستشارة / النزاع' : 'Brief Case Notes'}</label>
                  <textarea
                    rows={2}
                    placeholder={isAr ? 'صف بإيجاز طبيعة الملف أو الاستفسار لتجهيز الأوراق مسبقاً...' : 'Summarize the legal context to prepare relevant materials...'}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-[#080d1a] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {validationError && (
                <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-xs text-red-300">
                  {validationError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 rounded-xl hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <span>{isAr ? 'تأكيد الحجز وتثبيت الموعد المبدئي' : 'Confirm & Reserve Strategy Session'}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>

            </form>

            {/* Right 5 Columns: Live Breakdown & Quotation Box */}
            <div className="lg:col-span-5 sticky top-28 space-y-6">
              
              <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-[#0b101e] border border-amber-500/30 p-6 sm:p-7 shadow-xl">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-amber-400" />
                    <span className="text-sm font-bold text-white font-serif">
                      {isAr ? 'تقدير الأتعاب والجدول الزمني' : 'Fee Estimate & Timeline'}
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {isAr ? 'حساب فوري' : 'Live Calculator'}
                  </span>
                </div>

                <div className="py-6 space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="text-slate-400">{isAr ? 'المجال المحدد:' : 'Domain:'}</span>
                    <span className="font-semibold text-white truncate max-w-[180px]">{selectedService}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="text-slate-400">{isAr ? 'مستوى النزاع / التعقيد:' : 'Complexity:'}</span>
                    <span className="font-semibold text-amber-300">
                      {complexity === 'standard' ? (isAr ? 'استشارة محددة' : 'Focused') : complexity === 'medium' ? (isAr ? 'متوسط / صياغة' : 'Medium') : (isAr ? 'معقد / تحكيم وقضايا كبرى' : 'High Stakes')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="text-slate-400">{isAr ? 'سرعة الاستجابة:' : 'Priority Delivery:'}</span>
                    <span className="font-semibold text-white">
                      {urgency === 'urgent' ? (isAr ? 'خلال 24 ساعة (طوارئ)' : '24h Emergency') : (isAr ? 'عادي (3-5 أيام)' : 'Standard (3-5 Days)')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="text-slate-400">{isAr ? 'مكان الانعقاد:' : 'Meeting Venue:'}</span>
                    <span className="font-semibold text-white">
                      {meetingType === 'in_person' ? (isAr ? 'برج العدالة (الرياض)' : 'Al-Adalah Tower') : meetingType === 'virtual' ? (isAr ? 'مرئي مشفر' : 'Encrypted Video') : (isAr ? 'هاتفي سري' : 'Direct Call')}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block">{isAr ? 'الأتعاب المهنية التقديرية' : 'Estimated Legal Retainer'}</span>
                      <span className="text-[11px] text-amber-500/80">{isAr ? 'تشمل جلسة التحليل الأولي وصياغة المذكرة' : 'Includes initial brief & analysis'}</span>
                    </div>
                    <div className="text-end">
                      <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-serif font-mono tabular-nums">
                        {estimatedFee.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-300 font-medium ms-1">
                        {isAr ? 'ر.س' : 'SAR'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-400 space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{isAr ? 'تخصم قيمة الاستشارة بالكامل من العقد النهائي في حال تكليف المكتب بالقضية.' : 'Full consultation fee credited against final retainer if firm is retained.'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{isAr ? 'اتفاقية عدم إفصاح (NDA) ملزمة وموقعة لحماية بياناتكم قبل بدء الجلسة.' : 'Binding Non-Disclosure Agreement (NDA) executed prior to file disclosure.'}</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
};
