/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PracticeAreasSection } from './components/PracticeAreasSection';
import { ConsultationCalculator } from './components/ConsultationCalculator';
import { LandmarkCasesSection } from './components/LandmarkCasesSection';
import { AttorneysSection } from './components/AttorneysSection';
import { ClientTestimonialsSection } from './components/ClientTestimonialsSection';
import { FAQAndKnowledgeSection } from './components/FAQAndKnowledgeSection';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { CaseAssessmentModal } from './components/CaseAssessmentModal';
import { ClientPortalModal } from './components/ClientPortalModal';
import { FixedBackgroundScale3D, LightingMood, TiltMode } from './components/FixedBackgroundScale3D';
import { FloatingSceneControls } from './components/FloatingSceneControls';
import { ContractRiskAnalyzerModal } from './components/ContractRiskAnalyzerModal';
import { 
  INITIAL_SETTINGS, 
  INITIAL_PRACTICE_AREAS, 
  INITIAL_ATTORNEYS, 
  INITIAL_CASE_STUDIES, 
  INITIAL_CONSULTATIONS, 
  INITIAL_FAQS 
} from './data/initialData';
import { 
  Language, 
  FirmSettings, 
  PracticeArea, 
  Attorney, 
  CaseStudy, 
  ConsultationRequest, 
  FAQItem 
} from './types';

export default function App() {
  // Persisted language state (AR by default, EN on demand)
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const savedLang = localStorage.getItem('sarh_language');
      return (savedLang === 'en' || savedLang === 'ar') ? savedLang : 'ar';
    } catch {
      return 'ar';
    }
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [isClientPortalOpen, setIsClientPortalOpen] = useState(false);
  const [isContractAnalyzerOpen, setIsContractAnalyzerOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string>('');

  // 3D Scene Atmosphere & Motion States
  const [tiltMode, setTiltMode] = useState<TiltMode>('natural');
  const [lightingMood, setLightingMood] = useState<LightingMood>('royal_gold');
  const [isPaused, setIsPaused] = useState(false);
  const [zenMode, setZenMode] = useState(false);

  // Local storage persisted state
  const [settings, setSettings] = useState<FirmSettings>(() => {
    try {
      const stored = localStorage.getItem('sarh_settings');
      return stored ? JSON.parse(stored) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [practiceAreas, setPracticeAreas] = useState<PracticeArea[]>(() => {
    try {
      const stored = localStorage.getItem('sarh_practice_areas');
      return stored ? JSON.parse(stored) : INITIAL_PRACTICE_AREAS;
    } catch {
      return INITIAL_PRACTICE_AREAS;
    }
  });

  const [attorneys, setAttorneys] = useState<Attorney[]>(() => {
    try {
      const stored = localStorage.getItem('sarh_attorneys');
      return stored ? JSON.parse(stored) : INITIAL_ATTORNEYS;
    } catch {
      return INITIAL_ATTORNEYS;
    }
  });

  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(INITIAL_CASE_STUDIES);
  const [faqs, setFaqs] = useState<FAQItem[]>(INITIAL_FAQS);

  const [consultations, setConsultations] = useState<ConsultationRequest[]>(() => {
    try {
      const stored = localStorage.getItem('sarh_consultations');
      return stored ? JSON.parse(stored) : INITIAL_CONSULTATIONS;
    } catch {
      return INITIAL_CONSULTATIONS;
    }
  });

  // Keep HTML document dir and lang synchronized
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    try {
      localStorage.setItem('sarh_language', language);
    } catch (e) {
      console.error(e);
    }
  }, [language]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('sarh_settings', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('sarh_practice_areas', JSON.stringify(practiceAreas));
    } catch (e) {
      console.error(e);
    }
  }, [practiceAreas]);

  useEffect(() => {
    try {
      localStorage.setItem('sarh_attorneys', JSON.stringify(attorneys));
    } catch (e) {
      console.error(e);
    }
  }, [attorneys]);

  useEffect(() => {
    try {
      localStorage.setItem('sarh_consultations', JSON.stringify(consultations));
    } catch (e) {
      console.error(e);
    }
  }, [consultations]);

  const handleLanguageToggle = () => {
    setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const scrollToCalculator = (serviceTitle?: string) => {
    if (serviceTitle) {
      setPreselectedService(serviceTitle);
    }
    const el = document.getElementById('calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleConsultationBooked = (newBooking: ConsultationRequest) => {
    setConsultations((prev) => [newBooking, ...prev]);
  };

  const handleResetDefaults = () => {
    setSettings(INITIAL_SETTINGS);
    setPracticeAreas(INITIAL_PRACTICE_AREAS);
    setAttorneys(INITIAL_ATTORNEYS);
    setConsultations(INITIAL_CONSULTATIONS);
    localStorage.clear();
  };

  return (
    <div className="min-h-screen bg-[#080d1a]/85 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200 relative">
      
      {/* Permanent Fixed 3D Scale of Justice Background with Natural Organic Movement */}
      <FixedBackgroundScale3D
        tiltMode={tiltMode}
        lightingMood={lightingMood}
        isPaused={isPaused}
        zenMode={zenMode}
      />

      {/* Zen Mode Quick Exit Banner */}
      {zenMode && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <button
            onClick={() => setZenMode(false)}
            className="px-5 py-2.5 rounded-full bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-2xl hover:bg-amber-300 transition-all flex items-center gap-2 border border-amber-300/50"
          >
            <span>{language === 'ar' ? 'الخروج من وضع المعاينة والعودة للموقع' : 'Exit Zen View & Show Site UI'}</span>
          </button>
        </div>
      )}

      {/* Floating 3D Scene Controls Widget */}
      <FloatingSceneControls
        language={language}
        tiltMode={tiltMode}
        onSelectTiltMode={setTiltMode}
        lightingMood={lightingMood}
        onSelectLightingMood={setLightingMood}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(!isPaused)}
        zenMode={zenMode}
        onToggleZenMode={() => setZenMode(!zenMode)}
      />

      {/* Top Bar Navigation with Language & Modal Triggers */}
      <div className={`transition-opacity duration-500 ${zenMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Navbar
          language={language}
          onLanguageToggle={handleLanguageToggle}
          onOpenBooking={() => scrollToCalculator()}
          onToggleAdmin={() => setIsAdminOpen(true)}
          onOpenAssessment={() => setIsAssessmentOpen(true)}
          onOpenClientPortal={() => setIsClientPortalOpen(true)}
          isAdminOpen={isAdminOpen}
          settings={settings}
        />
      </div>

      {/* Main Page Sections */}
      <main className={`flex-1 relative z-10 transition-opacity duration-500 ${zenMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {/* Hero with focal presentation for the 3D Scale of Justice */}
        <HeroSection
          language={language}
          onOpenBooking={() => scrollToCalculator()}
          onOpenAssessment={() => setIsAssessmentOpen(true)}
          settings={settings}
        />

        {/* Practice Areas & Specializations */}
        <PracticeAreasSection
          practiceAreas={practiceAreas}
          language={language}
          onSelectService={(service) => scrollToCalculator(service)}
          onOpenContractAnalyzer={() => setIsContractAnalyzerOpen(true)}
        />

        {/* Interactive Consultation Calculator & Scheduling */}
        <ConsultationCalculator
          language={language}
          practiceAreas={practiceAreas}
          attorneys={attorneys}
          onConsultationBooked={handleConsultationBooked}
          preselectedService={preselectedService}
        />

        {/* Landmark Cases & Multi-Million Victories */}
        <LandmarkCasesSection
          caseStudies={caseStudies}
          language={language}
          onOpenBooking={() => scrollToCalculator()}
        />

        {/* Senior Partners & Counsel */}
        <AttorneysSection
          attorneys={attorneys}
          language={language}
          onSelectAttorney={(attorney) => {
            scrollToCalculator();
          }}
        />

        {/* Client Testimonials */}
        <ClientTestimonialsSection language={language} />

        {/* Knowledge Base & FAQs */}
        <FAQAndKnowledgeSection
          faqs={faqs}
          language={language}
          onOpenBooking={() => scrollToCalculator()}
        />
      </main>

      {/* Footer */}
      <div className={`transition-opacity duration-500 ${zenMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Footer
          language={language}
          settings={settings}
          onOpenBooking={() => scrollToCalculator()}
        />
      </div>

      {/* Full-Screen Admin Dashboard Modal */}
      {isAdminOpen && (
        <AdminDashboard
          language={language}
          onClose={() => setIsAdminOpen(false)}
          settings={settings}
          onUpdateSettings={setSettings}
          practiceAreas={practiceAreas}
          onUpdatePracticeAreas={setPracticeAreas}
          attorneys={attorneys}
          onUpdateAttorneys={setAttorneys}
          consultations={consultations}
          onUpdateConsultations={setConsultations}
          onResetDefaults={handleResetDefaults}
        />
      )}

      {/* Strategic Case Assessment Modal */}
      {isAssessmentOpen && (
        <CaseAssessmentModal
          language={language}
          onClose={() => setIsAssessmentOpen(false)}
          onProceedToBooking={(serviceName) => {
            setIsAssessmentOpen(false);
            scrollToCalculator(serviceName);
          }}
        />
      )}

      {/* Client Confidential Portal & Booking Tracker */}
      {isClientPortalOpen && (
        <ClientPortalModal
          language={language}
          onClose={() => setIsClientPortalOpen(false)}
          consultations={consultations}
          settings={settings}
        />
      )}

      {/* Contract Risk & Clause Forensics Modal */}
      {isContractAnalyzerOpen && (
        <ContractRiskAnalyzerModal
          language={language}
          onClose={() => setIsContractAnalyzerOpen(false)}
          onBookAudit={(serviceTitle) => {
            setIsContractAnalyzerOpen(false);
            scrollToCalculator(serviceTitle);
          }}
        />
      )}

    </div>
  );
}
