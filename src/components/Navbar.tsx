import React, { useState } from 'react';
import { Scale, Globe, Shield, Menu, X, ArrowUpRight, Search, FileCheck } from 'lucide-react';
import { Language, FirmSettings } from '../types';

interface NavbarProps {
  language: Language;
  onLanguageToggle: () => void;
  onOpenBooking: () => void;
  onToggleAdmin: () => void;
  onOpenAssessment: () => void;
  onOpenClientPortal: () => void;
  isAdminOpen: boolean;
  settings: FirmSettings;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageToggle,
  onOpenBooking,
  onToggleAdmin,
  onOpenAssessment,
  onOpenClientPortal,
  isAdminOpen,
  settings,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAr = language === 'ar';

  const navLinks = isAr ? [
    { label: 'مجالات الممارسة', href: '#practice-areas' },
    { label: 'القضايا الكبرى', href: '#landmark-cases' },
    { label: 'فريق المستشارين', href: '#attorneys' },
    { label: 'حاسبة الاستشارة', href: '#calculator' },
    { label: 'الأسئلة الشائعة', href: '#faq' },
  ] : [
    { label: 'Practice Areas', href: '#practice-areas' },
    { label: 'Landmark Cases', href: '#landmark-cases' },
    { label: 'Attorneys', href: '#attorneys' },
    { label: 'Fee Estimator', href: '#calculator' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080d1a]/95 backdrop-blur-md border-b border-amber-500/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        
        {/* Zone 1: Single text element wordmark with legal crest */}
        <a href="#" className="flex items-center gap-3 text-slate-100 hover:text-amber-300 transition-colors shrink-0 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400/20 to-amber-700/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
            <Scale className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg sm:text-xl tracking-tight text-white font-serif whitespace-nowrap">
              {isAr ? settings.firmNameAr.split(' ')[0] + ' ' + settings.firmNameAr.split(' ')[1] : 'SARH AL-ADALAH'}
            </span>
            <span className="text-[10px] tracking-wider uppercase text-amber-400/80 -mt-1 font-sans">
              {isAr ? 'للمحاماة والاستشارات القانونية' : 'Law Firm & Advisory'}
            </span>
          </div>
        </a>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-amber-500/50"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Primary Action + Utilities (Language Toggle, Portal, Admin) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Case Assessment Shortcut */}
          <button
            onClick={onOpenAssessment}
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900/60 border border-slate-700 text-slate-300 hover:text-amber-300 hover:border-amber-500/40 transition-colors whitespace-nowrap"
            title={isAr ? 'تقييم فوري لموقفك القانوني' : 'Case Assessment'}
          >
            <FileCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? 'تقييم القضية' : 'Case Triage'}</span>
          </button>

          {/* Client Portal Tracker */}
          <button
            onClick={onOpenClientPortal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900/60 border border-slate-700 text-slate-300 hover:text-amber-300 hover:border-amber-500/40 transition-colors whitespace-nowrap"
            title={isAr ? 'الاستعلام عن حجز وميثاق السرية' : 'Track Consultation & NDA'}
          >
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? 'متابعة الحجز' : 'Client Portal'}</span>
          </button>

          {/* Admin Dashboard Toggle */}
          <button
            onClick={onToggleAdmin}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              isAdminOpen
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                : 'bg-slate-900/60 border-slate-700/70 text-slate-300 hover:text-amber-300 hover:border-amber-500/40'
            }`}
            title={isAr ? 'لوحة تحكم إدارة المحتوى والخدمات' : 'Admin Content & Management Dashboard'}
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">{isAr ? 'لوحة التحكم' : 'Admin'}</span>
          </button>

          {/* Prominent Bilingual Language Switcher */}
          <button
            onClick={onLanguageToggle}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-all flex items-center gap-1.5 whitespace-nowrap shadow-sm active:scale-95"
            title={isAr ? 'Switch Language to English' : 'التحويل إلى اللغة العربية'}
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? 'English' : 'عربي'}</span>
          </button>

          {/* Primary CTA */}
          <button
            onClick={onOpenBooking}
            className="px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 rounded-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:brightness-105 transition-all whitespace-nowrap flex items-center gap-1.5 shadow-md active:scale-95"
          >
            <span>{isAr ? 'حجز استشارة' : 'Book Session'}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg border border-slate-800"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0c1222] border-b border-amber-500/20 px-4 pt-3 pb-6 flex flex-col gap-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-sm text-slate-200 hover:text-amber-400 border-b border-slate-800/80"
            >
              {link.label}
            </a>
          ))}
          
          <div className="pt-2 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onOpenAssessment();
                setMobileMenuOpen(false);
              }}
              className="py-2 text-xs font-medium bg-slate-800 border border-slate-700 rounded-lg text-slate-200 flex items-center justify-center gap-1.5"
            >
              <FileCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? 'تقييم القضية' : 'Case Triage'}</span>
            </button>

            <button
              onClick={() => {
                onOpenClientPortal();
                setMobileMenuOpen(false);
              }}
              className="py-2 text-xs font-medium bg-slate-800 border border-slate-700 rounded-lg text-slate-200 flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? 'متابعة الحجز' : 'Client Portal'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onToggleAdmin();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 text-xs font-medium bg-slate-800 border border-slate-700 rounded-lg text-slate-200 flex items-center justify-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? 'لوحة التحكم' : 'Admin Portal'}</span>
            </button>

            <button
              onClick={() => {
                onLanguageToggle();
                setMobileMenuOpen(false);
              }}
              className="py-2 px-4 text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg flex items-center justify-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isAr ? 'English' : 'عربي'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
