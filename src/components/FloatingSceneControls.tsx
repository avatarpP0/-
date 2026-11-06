import React, { useState } from 'react';
import { 
  Sliders, 
  RotateCw, 
  Pause, 
  Play, 
  Eye, 
  Sun, 
  Moon, 
  Award, 
  Scale, 
  X, 
  ChevronUp, 
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { LightingMood, TiltMode } from './FixedBackgroundScale3D';
import { Language } from '../types';

interface FloatingSceneControlsProps {
  language: Language;
  tiltMode: TiltMode;
  onSelectTiltMode: (mode: TiltMode) => void;
  lightingMood: LightingMood;
  onSelectLightingMood: (mood: LightingMood) => void;
  isPaused: boolean;
  onTogglePause: () => void;
  zenMode: boolean;
  onToggleZenMode: () => void;
}

export const FloatingSceneControls: React.FC<FloatingSceneControlsProps> = ({
  language,
  tiltMode,
  onSelectTiltMode,
  lightingMood,
  onSelectLightingMood,
  isPaused,
  onTogglePause,
  zenMode,
  onToggleZenMode,
}) => {
  const isAr = language === 'ar';
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside aria-label="3D Scene Controls" className="fixed bottom-6 start-6 z-40 select-none">
      
      {/* If Expanded: Full Control Card */}
      {isExpanded ? (
        <div className="p-4 rounded-2xl bg-slate-900/95 border border-amber-500/35 shadow-2xl backdrop-blur-md max-w-xs w-72 text-xs space-y-4 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Scale className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'التحكم في الميزان 3D' : '3D Scale Atmosphere'}</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Section 1: Tilt / Movement Mode */}
          <div>
            <span className="text-[11px] text-slate-400 block mb-2 font-medium">
              {isAr ? 'حالة التوازن والتأرجح:' : 'Balance & Physics State:'}
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'natural', labelAr: 'تأرجح طبيعي', labelEn: 'Natural Sway' },
                { id: 'equilibrium', labelAr: 'توازن تام', labelEn: 'Equilibrium' },
                { id: 'right', labelAr: 'ترجيح الحق', labelEn: 'Favor Right' },
                { id: 'left', labelAr: 'قوة البينة', labelEn: 'Favor Left' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => onSelectTiltMode(m.id as TiltMode)}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border text-center transition-all ${
                    tiltMode === m.id
                      ? 'bg-amber-400 text-slate-950 border-amber-400 font-semibold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {isAr ? m.labelAr : m.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Lighting Mood */}
          <div>
            <span className="text-[11px] text-slate-400 block mb-2 font-medium">
              {isAr ? 'إضاءة الاستوديو ثلاثي الأبعاد:' : 'Studio Lighting Mood:'}
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'royal_gold', icon: Sparkles, labelAr: 'ذهبي ملكي', labelEn: 'Royal Gold' },
                { id: 'midnight', icon: Moon, labelAr: 'ليلي فاخر', labelEn: 'Midnight' },
                { id: 'courtroom', icon: Sun, labelAr: 'قضائي ناصع', labelEn: 'Courtroom' },
              ].map((l) => {
                const Icon = l.icon;
                return (
                  <button
                    key={l.id}
                    onClick={() => onSelectLightingMood(l.id as LightingMood)}
                    className={`py-1.5 px-1 rounded-lg text-[10px] font-medium border flex flex-col items-center gap-1 transition-all ${
                      lightingMood === l.id
                        ? 'bg-amber-400 text-slate-950 border-amber-400 font-semibold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{isAr ? l.labelAr : l.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Play/Pause and Zen Mode */}
          <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
            <button
              onClick={onTogglePause}
              className={`flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-medium border flex items-center justify-center gap-1.5 transition-colors ${
                isPaused
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              {isPaused ? <Play className="w-3 h-3 text-amber-400" /> : <Pause className="w-3 h-3 text-amber-400" />}
              <span>{isPaused ? (isAr ? 'استئناف الدوران' : 'Resume Rotation') : (isAr ? 'إيقاف الدوران' : 'Pause Rotation')}</span>
            </button>

            <button
              onClick={onToggleZenMode}
              className={`py-1.5 px-3 rounded-lg text-[11px] font-medium border flex items-center gap-1.5 transition-colors ${
                zenMode
                  ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title={isAr ? 'إخفاء واجهة الموقع لمشاهدة الميزان بالكامل' : 'Zen View (Full Scale Mode)'}
            >
              <Eye className="w-3 h-3" />
              <span>{isAr ? 'وضع المعاينة' : 'Zen View'}</span>
            </button>
          </div>

        </div>
      ) : (
        /* Collapsed Floating Pill */
        <button
          onClick={() => setIsExpanded(true)}
          className="p-2.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-amber-500/35 text-amber-300 hover:text-white shadow-xl transition-all flex items-center gap-2 group active:scale-95"
          title={isAr ? 'التحكم في حركة وإضاءة ميزان العدالة 3D' : '3D Scale Controls'}
        >
          <Scale className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline text-xs font-semibold">
            {isAr ? 'ميزان العدالة 3D' : '3D Scene'}
          </span>
          <ChevronUp className="w-3.5 h-3.5 text-amber-400/80" />
        </button>
      )}

    </aside>
  );
};
