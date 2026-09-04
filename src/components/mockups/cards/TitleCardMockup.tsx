import React from 'react';
import type { TitleCardData } from '../../../types/story';
import { Flame } from 'lucide-react';

interface TitleCardMockupProps {
  data: TitleCardData;
  onUpdate?: (field: keyof TitleCardData, value: any) => void;
}

export const TitleCardMockup: React.FC<TitleCardMockupProps> = ({ data, onUpdate }) => {
  const getThemeBg = () => {
    switch (data.themeStyle) {
      case 'horror_red':
        return 'from-red-950 via-black to-slate-950';
      case 'viral_purple':
        return 'from-purple-950 via-slate-950 to-indigo-950';
      case 'midnight_blue':
        return 'from-blue-950 via-slate-950 to-black';
      case 'cinematic_dark':
      default:
        return 'from-slate-900 via-slate-950 to-black';
    }
  };

  return (
    <div
      className={`w-full h-full flex flex-col justify-between p-6 sm:p-8 bg-gradient-to-b ${getThemeBg()} text-white relative overflow-hidden select-none`}
    >
      {/* Background Cover Image if provided */}
      {data.coverImageUrl && (
        <div className="absolute inset-0 z-0">
          <img
            src={data.coverImageUrl}
            alt="Cover Background"
            className="w-full h-full object-cover scale-105 filter brightness-75 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/90" />
        </div>
      )}

      {/* Decorative Glow Orb */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/25 rounded-full blur-3xl pointer-events-none" />

      {/* Top Section: Category Badge */}
      <div className="relative z-10 flex justify-center">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-[11px] font-bold uppercase tracking-widest text-amber-300 shadow-lg">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span
            contentEditable={!!onUpdate}
            suppressContentEditableWarning
            onBlur={(e) => onUpdate && onUpdate('badgeText', e.currentTarget.textContent?.trim() || data.badgeText)}
            className="hover:opacity-80"
          >
            {data.badgeText || 'KISAH NYATA • PART 1'}
          </span>
        </div>
      </div>

      {/* Middle Section: Main Title & Hook Subtitle */}
      <div className="relative z-10 my-auto text-center space-y-4 px-2">
        <h1
          contentEditable={!!onUpdate}
          suppressContentEditableWarning
          onBlur={(e) => onUpdate && onUpdate('mainTitle', e.currentTarget.textContent?.trim() || data.mainTitle)}
          className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 drop-shadow-lg hover:opacity-90 transition-opacity"
        >
          {data.mainTitle || 'Judul Cerita Viral'}
        </h1>

        <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto" />

        <p
          contentEditable={!!onUpdate}
          suppressContentEditableWarning
          onBlur={(e) => onUpdate && onUpdate('subtitle', e.currentTarget.textContent?.trim() || data.subtitle)}
          className="text-xs sm:text-sm text-slate-300/90 leading-relaxed font-normal max-w-xs mx-auto hover:opacity-90"
        >
          {data.subtitle || 'Kisah nyata yang mendadak viral dan penuh drama...'}
        </p>
      </div>

      {/* Bottom Section: Call to Action Swipe Bar */}
      <div className="relative z-10 pt-4 flex flex-col items-center space-y-2">
        <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold text-white flex items-center space-x-2 shadow-xl animate-pulse">
          <span
            contentEditable={!!onUpdate}
            suppressContentEditableWarning
            onBlur={(e) => onUpdate && onUpdate('callToAction', e.currentTarget.textContent?.trim() || data.callToAction)}
          >
            {data.callToAction || 'Geser ke kanan untuk membaca ➔'}
          </span>
        </div>
        <p className="text-[10px] text-slate-500">StoryFrame Studio 3:4</p>
      </div>
    </div>
  );
};
