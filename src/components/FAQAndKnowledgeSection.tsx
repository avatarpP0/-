import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageSquare } from 'lucide-react';
import { FAQItem, Language } from '../types';

interface FAQAndKnowledgeSectionProps {
  faqs: FAQItem[];
  language: Language;
  onOpenBooking: () => void;
}

export const FAQAndKnowledgeSection: React.FC<FAQAndKnowledgeSectionProps> = ({
  faqs,
  language,
  onOpenBooking,
}) => {
  const isAr = language === 'ar';
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);
  const [searchTerm, setSearchTerm] = useState('');

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFaqs = faqs.filter((item) => {
    const q = isAr ? item.question : item.questionEn;
    const a = isAr ? item.answer : item.answerEn;
    const s = searchTerm.toLowerCase();
    return q.toLowerCase().includes(s) || a.toLowerCase().includes(s);
  });

  return (
    <section id="faq" className="py-20 lg:py-28 border-b border-amber-500/15 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <span className="text-xs font-semibold tracking-wider uppercase text-amber-400 block mb-2 flex items-center justify-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'المرشد القانوني والأسئلة الشائعة' : 'Legal Knowledge Base & FAQs'}</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-serif tracking-tight mb-4">
            {isAr ? 'إجابات واضحة لاستفساراتك القانونية' : 'Precise Answers to Crucial Legal Inquiries'}
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            {isAr
              ? 'إليك إجابات مفصلة حول آليات التعاقد، التحكيم، السرية المهنية، ونماذج احتساب أتعاب المحاماة.'
              : 'Detailed answers concerning retaining protocols, arbitration mandates, confidentiality, and fee arrangements.'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 max-w-md mx-auto">
          <input
            type="text"
            placeholder={isAr ? 'ابحث في الأسئلة الشائعة والأنظمة...' : 'Search legal questions & topics...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl ps-10 pe-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
          <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-xl bg-slate-900/60 border border-slate-800 transition-colors overflow-hidden"
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full p-5 text-start flex items-center justify-between gap-4 text-sm font-semibold text-white hover:text-amber-300 transition-colors"
                >
                  <span className="leading-snug">{isAr ? faq.question : faq.questionEn}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80">
                    <p>{isAr ? faq.answer : faq.answerEn}</p>
                  </div>
                )}
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs bg-slate-900/40 rounded-xl border border-slate-800">
              {isAr ? 'لم يتم العثور على نتائج مطابقة لبحثك.' : 'No matching questions found.'}
            </div>
          )}
        </div>

        {/* Additional help strip */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-start">
            <MessageSquare className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white">
                {isAr ? 'هل لديك مسألة قانونية خاصة لم تُذكر هنا؟' : 'Have a specialized legal issue not covered above?'}
              </h4>
              <p className="text-xs text-slate-400">
                {isAr ? 'فريقنا متاح لدراسة ملفك بخصوصية تامة وسرعة استجابة.' : 'Our senior partners are ready to review your files confidentially.'}
              </p>
            </div>
          </div>
          <button
            onClick={onOpenBooking}
            className="px-5 py-2.5 text-xs font-semibold bg-amber-400 text-slate-950 rounded-xl hover:bg-amber-300 transition-colors whitespace-nowrap shadow-sm"
          >
            {isAr ? 'تحدث مع مستشار الآن' : 'Speak with Counsel'}
          </button>
        </div>

      </div>
    </section>
  );
};
