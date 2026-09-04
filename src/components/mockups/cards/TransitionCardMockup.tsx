import React from 'react';
import type { TransitionCardData } from '../../../types/story';
import { Clock, Hourglass } from 'lucide-react';

interface TransitionCardMockupProps {
  data: TransitionCardData;
  onUpdate?: (field: keyof TransitionCardData, value: any) => void;
}

export const TransitionCardMockup: React.FC<TransitionCardMockupProps> = ({ data, onUpdate }) => {
  const getThemeBg = () => {
    switch (data.themeStyle) {
      case 'crimson_danger':
        return 'from-red-950/60 via-slate-950 to-black border-red-900/30';
      case 'dark_suspense':
        return 'from-indigo-950/50 via-slate-950 to-black border-indigo-900/30';
      case 'slate_minimal':
      default:
        return 'from-slate-900 via-slate-950 to-black border-slate-800';
    }
  };

  return (
    <div
      className={`w-full h-full flex flex-col justify-between p-6 sm:p-8 bg-gradient-to-b ${getThemeBg()} text-white relative overflow-hidden select-none`}
    >
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Section: Time Skip Badge */}
      <div className="relative z-10 flex justify-center pt-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-[11px] font-semibold text-slate-300 shadow-md">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span
            contentEditable={!!onUpdate}
            suppressContentEditableWarning
            onBlur={(e) => onUpdate && onUpdate('timeBadge', e.currentTarget.textContent?.trim() || data.timeBadge)}
            className="hover:opacity-80"
          >
            {data.timeBadge || 'Pukul 08:30 WIB'}
          </span>
        </div>
      </div>

      {/* Middle Section: Time Skip Big Title & Narrative Text */}
      <div className="relative z-10 my-auto text-center space-y-4 px-3">
        <div className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/30 shadow-lg">
          <Hourglass className="w-4 h-4 animate-spin duration-3000" />
        </div>

        <h2
          contentEditable={!!onUpdate}
          suppressContentEditableWarning
          onBlur={(e) => onUpdate && onUpdate('timeSkipTitle', e.currentTarget.textContent?.trim() || data.timeSkipTitle)}
          className="text-xl sm:text-2xl font-black uppercase tracking-widest text-slate-100 drop-shadow-md hover:opacity-80"
        >
          {data.timeSkipTitle || '3 HARI KEMUDIAN...'}
        </h2>

        <div className="w-10 h-0.5 bg-indigo-500/60 rounded-full mx-auto" />

        <p
          contentEditable={!!onUpdate}
          suppressContentEditableWarning
          onBlur={(e) => onUpdate && onUpdate('narrationText', e.currentTarget.textContent?.trim() || data.narrationText)}
          className="text-xs sm:text-sm text-slate-300/90 leading-relaxed font-normal max-w-xs mx-auto italic hover:opacity-90"
        >
          {data.narrationText || 'Menjelang hari pelaksanaan, sebuah chat tak terduga masuk...'}
        </p>
      </div>

      {/* Bottom Section: Aesthetic Dots */}
      <div className="relative z-10 flex justify-center items-center space-x-1.5 pb-2 text-slate-600">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
        <div className="w-2 h-2 rounded-full bg-indigo-400" />
        <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
      </div>
    </div>
  );
};
