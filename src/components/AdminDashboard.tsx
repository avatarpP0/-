import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  Briefcase, 
  Calendar, 
  Settings, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  RotateCcw, 
  Search, 
  Phone, 
  Mail, 
  DollarSign, 
  FileText,
  ExternalLink,
  MessageCircle,
  Filter
} from 'lucide-react';
import { 
  PracticeArea, 
  Attorney, 
  ConsultationRequest, 
  FirmSettings, 
  Language 
} from '../types';

interface AdminDashboardProps {
  language: Language;
  onClose: () => void;
  settings: FirmSettings;
  onUpdateSettings: (newSettings: FirmSettings) => void;
  practiceAreas: PracticeArea[];
  onUpdatePracticeAreas: (areas: PracticeArea[]) => void;
  attorneys: Attorney[];
  onUpdateAttorneys: (attorneys: Attorney[]) => void;
  consultations: ConsultationRequest[];
  onUpdateConsultations: (consultations: ConsultationRequest[]) => void;
  onResetDefaults: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  language,
  onClose,
  settings,
  onUpdateSettings,
  practiceAreas,
  onUpdatePracticeAreas,
  attorneys,
  onUpdateAttorneys,
  consultations,
  onUpdateConsultations,
  onResetDefaults,
}) => {
  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState<'overview' | 'consultations' | 'services' | 'attorneys' | 'settings'>('overview');
  
  // Status filter for consultations
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Editing state for settings
  const [formSettings, setFormSettings] = useState<FirmSettings>({ ...settings });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // New Practice Area Form Modal state
  const [showAddService, setShowAddService] = useState(false);
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServiceTitleEn, setNewServiceTitleEn] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceFee, setNewServiceFee] = useState<number>(10000);
  const [newServiceLead, setNewServiceLead] = useState('د. خالد بن سلطان الرشيد');

  // Handle consultation status toggle
  const handleUpdateStatus = (id: string, newStatus: ConsultationRequest['status']) => {
    const updated = consultations.map((item) =>
      item.id === id ? { ...item, status: newStatus } : item
    );
    onUpdateConsultations(updated);
  };

  // Handle consultation deletion
  const handleDeleteConsultation = (id: string) => {
    if (window.confirm(isAr ? 'هل أنت متأكد من حذف هذا السجل نهائياً؟' : 'Delete this record?')) {
      const updated = consultations.filter((item) => item.id !== id);
      onUpdateConsultations(updated);
    }
  };

  // Save Site Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formSettings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  // Add New Service Area
  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceTitle.trim()) return;

    const newArea: PracticeArea = {
      id: 'custom-' + Date.now(),
      title: newServiceTitle,
      titleEn: newServiceTitleEn || newServiceTitle,
      iconName: 'Scale',
      description: newServiceDesc || 'خدمة قانونية متخصصة تحت إشراف نخبة المستشارين.',
      descriptionEn: newServiceDesc || 'Specialized legal practice overseen by senior partners.',
      keyPoints: ['دراسة ملفات القضية بدقة', 'صياغة المذكرات القانونية', 'تمثيل قضائي وحماية مصالح العميل'],
      keyPointsEn: ['In-depth case forensics', 'Statutory drafting', 'Client defense and advocacy'],
      leadAttorney: newServiceLead,
      leadAttorneyEn: 'Senior Partner',
      avgDuration: '2 - 4 أسابيع',
      avgDurationEn: '2 - 4 weeks',
      startingFee: newServiceFee,
      casesCount: 15,
    };

    onUpdatePracticeAreas([...practiceAreas, newArea]);
    setShowAddService(false);
    setNewServiceTitle('');
    setNewServiceTitleEn('');
    setNewServiceDesc('');
  };

  // Delete Service Area
  const handleDeleteService = (id: string) => {
    if (practiceAreas.length <= 1) {
      alert(isAr ? 'يجب الإبقاء على مجال قانوني واحد على الأقل.' : 'At least one practice area is required.');
      return;
    }
    if (window.confirm(isAr ? 'هل ترغب في حذف هذا المجال القانوني من الموقع الحي؟' : 'Remove this practice area?')) {
      onUpdatePracticeAreas(practiceAreas.filter((a) => a.id !== id));
    }
  };

  // Filter consultations
  const filteredConsultations = consultations.filter((c) => {
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesSearch =
      c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.companyName && c.companyName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  // Calculate Metrics
  const totalBookingsCount = consultations.length;
  const pendingCount = consultations.filter((c) => c.status === 'pending').length;
  const confirmedCount = consultations.filter((c) => c.status === 'confirmed').length;
  const totalEstimatedFees = consultations.reduce((acc, curr) => acc + (curr.estimatedFee || 0), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/85 backdrop-blur-md flex flex-col">
      
      {/* Top Admin Header Bar */}
      <header className="bg-[#080d1a] border-b border-amber-500/25 px-4 sm:px-8 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Shield className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white font-serif flex items-center gap-2">
              <span>{isAr ? 'لوحة تحكم إدارة المحتوى والخدمات' : 'Content & Legal Practice Control Suite'}</span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                PRO ADMIN
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              {isAr ? 'إدارة فورية للحجوزات، المحتوى، والبيانات الحية للموقع' : 'Live management of bookings, practice domains, and site data'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (window.confirm(isAr ? 'هل تريد استعادة البيانات الافتراضية الأولية؟' : 'Reset all data to defaults?')) {
                onResetDefaults();
              }
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors"
            title={isAr ? 'إعادة ضبط البيانات الأصلية' : 'Reset to Initial Data'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isAr ? 'إعادة الضبط' : 'Reset Defaults'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold bg-amber-400 text-slate-950 rounded-lg hover:bg-amber-300 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>{isAr ? 'العودة للموقع' : 'Exit to Live Site'}</span>
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Admin Workspace with Sidebar Navigation */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Navigation Sidebar */}
        <aside className="w-56 sm:w-64 bg-[#0a0f1d] border-e border-slate-800/80 p-4 flex flex-col gap-2 shrink-0 overflow-y-auto">
          {[
            { id: 'overview', icon: Briefcase, labelAr: 'نظرة عامة وإحصائيات', labelEn: 'Overview & KPIs' },
            { id: 'consultations', icon: Calendar, labelAr: 'طلبات الاستشارات', labelEn: 'Consultations', badge: pendingCount },
            { id: 'services', icon: FileText, labelAr: 'مجالات الممارسة والخدمات', labelEn: 'Practice Areas' },
            { id: 'attorneys', icon: Users, labelAr: 'فريق المحامين', labelEn: 'Attorneys' },
            { id: 'settings', icon: Settings, labelAr: 'إعدادات وبيانات الموقع', labelEn: 'Site Settings' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full p-3 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                  <span className="truncate">{isAr ? tab.labelAr : tab.labelEn}</span>
                </div>
                {tab.badge && tab.badge > 0 ? (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-slate-950 text-amber-300' : 'bg-amber-400 text-slate-950'}`}>
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#070b16]">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="max-w-6xl mx-auto space-y-8">
              
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-serif mb-1">
                  {isAr ? 'مؤشرات الأداء والنشاط القانوني' : 'Executive Overview & Legal Activity'}
                </h2>
                <p className="text-xs text-slate-400">
                  {isAr ? 'متابعة حية للطلبات الواردة والإيرادات المقدرة وحالة القضايا' : 'Real-time telemetry on consultation pipeline and client engagements'}
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">{isAr ? 'إجمالي طلبات الاستشارة' : 'Total Consultations'}</span>
                  <span className="text-2xl font-bold text-white font-mono tabular-nums">{totalBookingsCount}</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">{isAr ? 'طلبات جديدة قيد المراجعة' : 'Pending Review'}</span>
                  <span className="text-2xl font-bold text-amber-400 font-mono tabular-nums">{pendingCount}</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">{isAr ? 'جلسات مؤكدة مجدولة' : 'Confirmed Sessions'}</span>
                  <span className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">{confirmedCount}</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">{isAr ? 'قيمة الأتعاب المبدئية المقدرة' : 'Estimated Pipeline'}</span>
                  <span className="text-2xl font-bold text-amber-300 font-mono tabular-nums">
                    {totalEstimatedFees.toLocaleString()} <span className="text-xs font-sans text-slate-400">{isAr ? 'ر.س' : 'SAR'}</span>
                  </span>
                </div>
              </div>

              {/* Quick Urgent Alert if urgent requests exist */}
              {consultations.some((c) => c.urgency === 'urgent' && c.status === 'pending') && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-amber-300">
                        {isAr ? 'تنبيه: توجد استشارات عاجلة (خلال 24 ساعة) تحتاج للتأكيد' : 'Alert: High-priority urgent requests require immediate confirmation'}
                      </h4>
                      <p className="text-[11px] text-slate-300">
                        {isAr ? 'يرجى مراجعة قائمة الطلبات والتواصل مع العميل لإرسال رابط الجلسة المشفرة.' : 'Please open consultations tab and initiate encrypted venue link.'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setStatusFilter('pending');
                      setActiveTab('consultations');
                    }}
                    className="px-3.5 py-1.5 text-xs font-semibold bg-amber-400 text-slate-950 rounded-lg hover:bg-amber-300 whitespace-nowrap"
                  >
                    {isAr ? 'عرض الطلبات العاجلة' : 'Review Urgent'}
                  </button>
                </div>
              )}

              {/* Recent Consultations Table Preview */}
              <div className="rounded-2xl bg-slate-900/40 border border-slate-800 overflow-hidden">
                <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white font-serif">
                    {isAr ? 'أحدث الطلبات الواردة' : 'Recent Inbound Consultation Bookings'}
                  </h3>
                  <button
                    onClick={() => setActiveTab('consultations')}
                    className="text-xs text-amber-400 hover:underline"
                  >
                    {isAr ? 'عرض الكل' : 'View All'}
                  </button>
                </div>

                <div className="divide-y divide-slate-800/80">
                  {consultations.slice(0, 4).map((c) => (
                    <div key={c.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-white">{c.clientName}</span>
                          {c.companyName && (
                            <span className="text-slate-400 text-[11px]">({c.companyName})</span>
                          )}
                          <span className="text-[10px] font-mono text-amber-400 bg-slate-950 px-1.5 py-0.5 rounded">
                            {c.referenceNumber}
                          </span>
                        </div>
                        <div className="text-slate-400 text-[11px] flex items-center gap-3">
                          <span>{c.serviceType}</span>
                          <span>·</span>
                          <span>{c.preferredDate} - {c.preferredTime}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-semibold ${
                            c.status === 'confirmed'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : c.status === 'completed'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {c.status === 'confirmed' ? (isAr ? 'مؤكد' : 'Confirmed') : c.status === 'completed' ? (isAr ? 'مكتمل' : 'Completed') : (isAr ? 'قيد الانتظار' : 'Pending')}
                        </span>
                        <span className="font-mono font-bold text-amber-400 tabular-nums">
                          {c.estimatedFee.toLocaleString()} {isAr ? 'ر.س' : 'SAR'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: CONSULTATIONS MANAGEMENT */}
          {activeTab === 'consultations' && (
            <div className="max-w-6xl mx-auto space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-serif mb-1">
                    {isAr ? 'إدارة طلبات الاستشارات وحجوزات المواعيد' : 'Consultation Inbound Roster & Schedule'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {isAr ? 'متابعة وتأكيد المواعيد، التواصل مع العملاء، وإدارة الحالات' : 'Manage inquiries, assign counsel, update states, and reach clients'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                  >
                    <option value="all">{isAr ? 'جميع الحالات' : 'All States'}</option>
                    <option value="pending">{isAr ? 'قيد المراجعة' : 'Pending'}</option>
                    <option value="confirmed">{isAr ? 'مؤكد' : 'Confirmed'}</option>
                    <option value="completed">{isAr ? 'مكتمل' : 'Completed'}</option>
                    <option value="cancelled">{isAr ? 'ملغي' : 'Cancelled'}</option>
                  </select>
                </div>
              </div>

              {/* Search Filter */}
              <div className="relative">
                <input
                  type="text"
                  placeholder={isAr ? 'بحث بالاسم، رقم الحجز، الشركة، أو نوع الخدمة...' : 'Search by client, reference number, company...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900/70 border border-slate-700/80 rounded-xl ps-10 pe-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
              </div>

              {/* Consultations List */}
              <div className="space-y-4">
                {filteredConsultations.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap mb-1">
                          <span className="font-bold text-white text-sm">{item.clientName}</span>
                          {item.companyName && (
                            <span className="text-slate-400 text-xs">| {item.companyName}</span>
                          )}
                          <span className="text-xs font-mono font-bold text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-amber-500/20">
                            {item.referenceNumber}
                          </span>
                          {item.urgency === 'urgent' && (
                            <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded">
                              {isAr ? 'عاجل (24 ساعة)' : '24h Urgent'}
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-300 flex items-center gap-3 flex-wrap">
                          <span className="text-amber-300 font-medium">{item.serviceType}</span>
                          <span>·</span>
                          <span>{item.meetingType === 'in_person' ? (isAr ? 'حضوري بالبرج' : 'In-Person') : item.meetingType === 'virtual' ? (isAr ? 'مرئي مشفر' : 'Encrypted Video') : (isAr ? 'هاتفي' : 'Phone')}</span>
                          <span>·</span>
                          <span>{item.preferredDate} ({item.preferredTime})</span>
                        </div>
                      </div>

                      {/* Status and Fee */}
                      <div className="flex items-center gap-3">
                        <div className="text-end">
                          <span className="text-[11px] text-slate-400 block">{isAr ? 'الأتعاب المقدرة' : 'Est. Fee'}</span>
                          <span className="text-base font-bold font-mono text-amber-400 tabular-nums">
                            {item.estimatedFee.toLocaleString()} {isAr ? 'ر.س' : 'SAR'}
                          </span>
                        </div>

                        <select
                          value={item.status}
                          onChange={(e) => handleUpdateStatus(item.id, e.target.value as any)}
                          className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 border focus:outline-none ${
                            item.status === 'confirmed'
                              ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                              : item.status === 'completed'
                              ? 'bg-blue-950 border-blue-500 text-blue-300'
                              : item.status === 'cancelled'
                              ? 'bg-red-950 border-red-500 text-red-300'
                              : 'bg-amber-950 border-amber-500 text-amber-300'
                          }`}
                        >
                          <option value="pending">{isAr ? 'قيد الانتظار' : 'Pending'}</option>
                          <option value="confirmed">{isAr ? 'تأكيد الموعد' : 'Confirmed'}</option>
                          <option value="completed">{isAr ? 'مكتمل' : 'Completed'}</option>
                          <option value="cancelled">{isAr ? 'إلغاء' : 'Cancelled'}</option>
                        </select>
                      </div>
                    </div>

                    {/* Notes & Client contact strip */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                      <div className="text-slate-300">
                        {item.notes ? (
                          <p className="line-clamp-2">
                            <span className="text-slate-500 font-medium">{isAr ? 'ملاحظات العميل: ' : 'Client Notes: '}</span>
                            {item.notes}
                          </p>
                        ) : (
                          <span className="text-slate-500">{isAr ? 'لا توجد ملاحظات إضافية' : 'No extra notes provided'}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={`tel:${item.phone}`}
                          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                          title={isAr ? 'اتصال بالعميل' : 'Call Client'}
                        >
                          <Phone className="w-3.5 h-3.5 text-amber-400" />
                          <span>{item.phone}</span>
                        </a>

                        <a
                          href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            isAr
                              ? `السلام عليكم ورحمة الله، بخصوص طلب الاستشارة القانونية رقم ${item.referenceNumber} لدى صرح العدالة.`
                              : `Hello, regarding legal consultation request ref ${item.referenceNumber} with Sarh Al-Adalah.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-800/80 hover:bg-emerald-900 transition-colors flex items-center gap-1"
                          title={isAr ? 'مراسلة واتساب' : 'WhatsApp'}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>

                        <button
                          onClick={() => handleDeleteConsultation(item.id)}
                          className="p-2 rounded-lg bg-red-950/40 text-red-400 border border-red-900/60 hover:bg-red-900/60 transition-colors"
                          title={isAr ? 'حذف السجل' : 'Delete'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredConsultations.length === 0 && (
                  <div className="p-8 text-center text-slate-400 text-xs bg-slate-900/30 rounded-xl border border-slate-800">
                    {isAr ? 'لا توجد طلبات استشارة مطابقة لمعايير البحث.' : 'No consultations matched.'}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: PRACTICE AREAS & SERVICES */}
          {activeTab === 'services' && (
            <div className="max-w-6xl mx-auto space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-serif mb-1">
                    {isAr ? 'إدارة مجالات الممارسة والخدمات القانونية' : 'Manage Legal Practice Areas & Retainer Pricing'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {isAr ? 'إضافة خدمات جديدة، تعديل الأسعار التقديرية، والوصف المعروض على الموقع' : 'Update scopes, pricing baselines, and lead partners'}
                  </p>
                </div>

                <button
                  onClick={() => setShowAddService(true)}
                  className="px-4 py-2 text-xs font-semibold bg-amber-400 text-slate-950 rounded-xl hover:bg-amber-300 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAr ? 'إضافة مجال قانوني جديد' : 'Add Practice Area'}</span>
                </button>
              </div>

              {/* Add Service Modal */}
              {showAddService && (
                <div className="p-6 rounded-2xl bg-slate-900 border border-amber-500/40 mb-6">
                  <h3 className="text-base font-bold text-white mb-4">
                    {isAr ? 'إضافة مجال ممارسة قانونية جديد' : 'New Practice Domain'}
                  </h3>
                  <form onSubmit={handleCreateService} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-400 block mb-1">{isAr ? 'عنوان المجال (بالعربية)' : 'Title (Arabic)'}</label>
                        <input
                          type="text"
                          required
                          value={newServiceTitle}
                          onChange={(e) => setNewServiceTitle(e.target.value)}
                          placeholder="مثال: حوكمة الذكاء الاصطناعي وتقنية البلوكشين"
                          className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-2.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">{isAr ? 'عنوان المجال (بالإنجليزية)' : 'Title (English)'}</label>
                        <input
                          type="text"
                          value={newServiceTitleEn}
                          onChange={(e) => setNewServiceTitleEn(e.target.value)}
                          placeholder="e.g. AI Governance & Web3 Law"
                          className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-2.5 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">{isAr ? 'الوصف والنطاق القانوني' : 'Description & Scope'}</label>
                      <textarea
                        rows={2}
                        value={newServiceDesc}
                        onChange={(e) => setNewServiceDesc(e.target.value)}
                        placeholder="نبذة عن نطاق التدخل والخدمات المقدمة..."
                        className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-2.5 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-400 block mb-1">{isAr ? 'الرسوم المبدئية التقديرية (ر.س)' : 'Base Fee (SAR)'}</label>
                        <input
                          type="number"
                          value={newServiceFee}
                          onChange={(e) => setNewServiceFee(Number(e.target.value))}
                          className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">{isAr ? 'المستشار المسؤول' : 'Lead Partner'}</label>
                        <input
                          type="text"
                          value={newServiceLead}
                          onChange={(e) => setNewServiceLead(e.target.value)}
                          className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-2.5 text-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-amber-400 text-slate-950 font-semibold rounded-lg hover:bg-amber-300"
                      >
                        {isAr ? 'حفظ وإضافة للموقع الحي' : 'Save to Live Site'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddService(false)}
                        className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                      >
                        {isAr ? 'إلغاء' : 'Cancel'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Existing Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {practiceAreas.map((area) => (
                  <div
                    key={area.id}
                    className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-base font-bold text-white font-serif">
                          {isAr ? area.title : area.titleEn}
                        </h4>
                        <button
                          onClick={() => handleDeleteService(area.id)}
                          className="text-slate-500 hover:text-red-400 p-1"
                          title={isAr ? 'حذف المجال' : 'Delete'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed mb-4">
                        {isAr ? area.description : area.descriptionEn}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-500 block">{isAr ? 'المستشار:' : 'Partner:'}</span>
                        <span className="text-slate-200">{isAr ? area.leadAttorney : area.leadAttorneyEn}</span>
                      </div>
                      <div className="text-end">
                        <span className="text-slate-500 block">{isAr ? 'تبدأ من:' : 'Starting from:'}</span>
                        <span className="font-mono font-bold text-amber-400">
                          {area.startingFee.toLocaleString()} {isAr ? 'ر.س' : 'SAR'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 4: ATTORNEYS */}
          {activeTab === 'attorneys' && (
            <div className="max-w-6xl mx-auto space-y-6">
              
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-serif mb-1">
                  {isAr ? 'إدارة فريق المحامين والمستشارين' : 'Attorney Roster & Partner Bios'}
                </h2>
                <p className="text-xs text-slate-400">
                  {isAr ? 'استعراض الشركاء والمؤهلات والسير الذاتية المعروضة على الموقع' : 'Review credentials, leadership roles, and contact channels'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {attorneys.map((at) => (
                  <div key={at.id} className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
                    <div className="w-full h-44 rounded-xl overflow-hidden mb-4 bg-slate-950">
                      <img src={at.image} alt={at.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-bold text-white text-base mb-1">{isAr ? at.name : at.nameEn}</h3>
                    <span className="text-xs text-amber-400 block mb-2">{isAr ? at.role : at.roleEn}</span>
                    <p className="text-[11px] text-slate-400 mb-3">{isAr ? at.education : at.educationEn}</p>
                    <div className="text-xs text-slate-300 space-y-1 pt-2 border-t border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-amber-400" />
                        <span>{at.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-amber-400" />
                        <span>{at.phone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 5: SITE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-6">
              
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-serif mb-1">
                  {isAr ? 'إعدادات وبيانات الموقع الأساسية' : 'Global Site Settings & Metrics'}
                </h2>
                <p className="text-xs text-slate-400">
                  {isAr ? 'تحديث أرقام التواصل، نسب الإنجاز، والعناوين التي تظهر على الموقع الحي مباشرة' : 'Update identity, hotline numbers, address, and live showcase metrics'}
                </p>
              </div>

              {settingsSaved && (
                <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>{isAr ? 'تم حفظ التعديلات بنجاح وتحديث الموقع الحي فورياً!' : 'Settings saved successfully and reflected immediately!'}</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-6 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 block mb-1">{isAr ? 'اسم شركة المحاماة (بالعربية)' : 'Firm Name (Arabic)'}</label>
                    <input
                      type="text"
                      value={formSettings.firmNameAr}
                      onChange={(e) => setFormSettings({ ...formSettings, firmNameAr: e.target.value })}
                      className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">{isAr ? 'اسم شركة المحاماة (بالإنجليزية)' : 'Firm Name (English)'}</label>
                    <input
                      type="text"
                      value={formSettings.firmNameEn}
                      onChange={(e) => setFormSettings({ ...formSettings, firmNameEn: e.target.value })}
                      className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-2.5 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 block mb-1">{isAr ? 'رقم الهاتف الموحد' : 'Hotline Phone'}</label>
                    <input
                      type="text"
                      value={formSettings.phone}
                      onChange={(e) => setFormSettings({ ...formSettings, phone: e.target.value })}
                      className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">{isAr ? 'البريد الإلكتروني الرسمي' : 'Official Email'}</label>
                    <input
                      type="email"
                      value={formSettings.email}
                      onChange={(e) => setFormSettings({ ...formSettings, email: e.target.value })}
                      className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-2.5 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">{isAr ? 'عنوان المقر الرئيسي' : 'Headquarters Address'}</label>
                  <input
                    type="text"
                    value={formSettings.addressAr}
                    onChange={(e) => setFormSettings({ ...formSettings, addressAr: e.target.value })}
                    className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <span className="text-slate-200 font-bold block mb-4">
                    {isAr ? 'الإحصائيات الحية المعروضة بشريط الإنجازات' : 'Showcase KPI Metrics'}
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="text-slate-400 block mb-1">{isAr ? 'سنوات الخبرة' : 'Years Experience'}</label>
                      <input
                        type="number"
                        value={formSettings.yearsExperience}
                        onChange={(e) => setFormSettings({ ...formSettings, yearsExperience: Number(e.target.value) })}
                        className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-2 text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">{isAr ? 'نسبة كسب القضايا (%)' : 'Cases Won (%)'}</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formSettings.casesWonPercent}
                        onChange={(e) => setFormSettings({ ...formSettings, casesWonPercent: Number(e.target.value) })}
                        className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-2 text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">{isAr ? 'حجم النزاعات والصفقات' : 'Dispute Volume'}</label>
                      <input
                        type="text"
                        value={formSettings.totalDisputeValueSAR}
                        onChange={(e) => setFormSettings({ ...formSettings, totalDisputeValueSAR: e.target.value })}
                        className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-2 text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">{isAr ? 'عدد كبرى الشركات' : 'Corporate Clients'}</label>
                      <input
                        type="number"
                        value={formSettings.corporateClientsCount}
                        onChange={(e) => setFormSettings({ ...formSettings, corporateClientsCount: Number(e.target.value) })}
                        className="w-full bg-[#080d1a] border border-slate-700 rounded-lg p-2 text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl transition-colors flex items-center gap-2 shadow-md"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isAr ? 'حفظ التغييرات للموقع الحي' : 'Save Live Changes'}</span>
                  </button>
                </div>

              </form>

            </div>
          )}

        </main>

      </div>

    </div>
  );
};
