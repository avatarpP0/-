import React from 'react';
import { Quote, Star, Building, CheckCircle } from 'lucide-react';
import { Language } from '../types';

interface ClientTestimonialsSectionProps {
  language: Language;
}

export const ClientTestimonialsSection: React.FC<ClientTestimonialsSectionProps> = ({ language }) => {
  const isAr = language === 'ar';

  const testimonials = [
    {
      id: 1,
      quoteAr: 'قاد فريق صرح العدالة نزاع تحكيم فيديك دولي معقد بقيمة تفوق 400 مليون ريال. كانت استراتيجيتهم المرافعة والدفاع الهندسي حاسمة في استصدار حكم قطعي لصالحنا واسترداد كامل مستحقاتنا مع التعويض.',
      quoteEn: 'Sarh Al-Adalah steered an intricate international FIDIC arbitration exceeding SAR 400M. Their courtroom engineering strategy and forensic advocacy secured a definitive arbitral award in our favor with full prolongation damages.',
      authorAr: 'م. عبد الله بن صالح الراجحي',
      authorEn: 'Eng. Abdullah Al-Rajhi',
      roleAr: 'رئيس مجلس الإدارة، شركة الأفق للمقاولات الكبرى',
      roleEn: 'Chairman of the Board, Horizon Mega Contracting',
      outcomeAr: 'كسب تحكيم تجاري بقيمة 420 مليون ر.س',
      outcomeEn: 'Secured SAR 420M arbitration victory',
    },
    {
      id: 2,
      quoteAr: 'في صفقة استحواذ عبر الحدود بلغت 680 مليون ريال، أنجز مكتب صرح العدالة فحصاً نافياً للجهالة فائق الدقة في زمن قياسي، مع حماية حقوق الشركاء المؤسسين من أية التزامات ضريبية أو عمالية خفية.',
      quoteEn: 'During a cross-border acquisition valued at SAR 680M, the firm performed surgical legal due diligence in record time, shielding our founding shareholders against latent tax and labor contingencies.',
      authorAr: 'د. فيصل المعجل',
      authorEn: 'Dr. Faisal Al-Moajil',
      roleAr: 'الرئيس التنفيذي، ركائز كابيتال للاستثمار المباشر',
      roleEn: 'CEO, Rakaez Capital Private Equity',
      outcomeAr: 'إتمام صفقة استحواذ M&A بنسبة 100%',
      outcomeEn: '100% M&A acquisition completed smoothly',
    },
    {
      id: 3,
      quoteAr: 'استشاراتهم في الامتثال لنظام حماية البيانات الشخصية والأمن السيبراني جنبت منصتنا غرامات جسيمة، وساعدتنا في الحصول على تراخيص البنك المركزي والجهات الرقابية بسرعة وثقة مطلقة.',
      quoteEn: 'Their guidance on PDPL data protection and cybersecurity compliance shielded our platform from severe exposure, expediting our regulatory sandbox licensing with the Central Bank.',
      authorAr: 'أ. ناصر السبيعي',
      authorEn: 'Nasser Al-Subaie',
      roleAr: 'الشريك المؤسس والمدير العام، منصة وثاق للمدفوعات الرقمية',
      roleEn: 'Co-Founder & MD, Wethaq FinTech Payments',
      outcomeAr: 'امتثال تنظيمي وترخيص كامل من ساما',
      outcomeEn: 'Full regulatory compliance & Central Bank license',
    },
  ];

  return (
    <section className="py-20 lg:py-28 border-b border-amber-500/15 relative bg-[#070b16]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-wider uppercase text-amber-400 block mb-2">
            {isAr ? 'شهادات الثقة والاعتماد' : 'Client Testimonials & Executive Endorsements'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-serif tracking-tight mb-4">
            {isAr ? 'شراكات استراتيجية تصنع النجاح' : 'Trusted by Foremost Industry Leaders & Executives'}
          </h2>
          <p className="text-slate-400 text-sm">
            {isAr
              ? 'نعتز بثقة كبرى المجموعات الصناعية وصناديق الاستثمار ورواد الأعمال الذين اعتمدوا على خبرتنا في أصعب المنعطفات.'
              : 'Our highest accolade is the enduring trust placed in our counsel during pivotal high-stakes corporate crossroads.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="p-7 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-amber-500/30 flex flex-col justify-between transition-all"
            >
              <div>
                <Quote className="w-8 h-8 text-amber-400/30 mb-4" />
                <p className="text-slate-200 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                  "{isAr ? t.quoteAr : t.quoteEn}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <span className="text-white font-bold text-sm block">
                  {isAr ? t.authorAr : t.authorEn}
                </span>
                <span className="text-slate-400 text-xs block mb-3">
                  {isAr ? t.roleAr : t.roleEn}
                </span>

                <div className="flex items-center gap-1.5 text-[11px] text-amber-400/90 font-medium">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{isAr ? t.outcomeAr : t.outcomeEn}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
