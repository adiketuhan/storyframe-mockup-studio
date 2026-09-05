import React from 'react';
import type { TitleCardData } from '../../../types/story';
import { Flame } from 'lucide-react';

interface TitleCardMockupProps {
  data: TitleCardData;
  onUpdate?: (field: keyof TitleCardData, value: any) => void;
}

export const TitleCardMockup: React.FC<TitleCardMockupProps> = ({ data, onUpdate }) => {
  const isClean = data.themeStyle === 'clean_photo' || data.themeStyle === 'solid_black';

  const getThemeBg = () => {
    switch (data.themeStyle) {
      case 'clean_photo':
        return 'from-black/60 via-transparent to-black/80';
      case 'solid_black':
        return 'from-black to-black';
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
      className={`w-full h-full flex flex-col justify-between p-6 sm:p-8 ${data.coverImageUrl ? 'bg-black' : `bg-gradient-to-b ${getThemeBg()}`} text-white relative overflow-hidden select-none`}
    >
      {/* Background Cover Image if provided */}
      {data.coverImageUrl && (
        <div className="absolute inset-0 z-0">
          <img
            src={data.coverImageUrl}
            alt="Cover Background"
            className={`w-full h-full object-cover ${data.themeStyle === 'clean_photo' ? 'brightness-100 contrast-100 scale-100' : 'brightness-75 contrast-110 scale-105'}`}
          />
          {data.themeStyle === 'clean_photo' ? (
            /* Foto murni 100% tanpa shadow / gradient hitam */
            null
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40" />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/90" />
            </>
          )}
        </div>
      )}

      {/* Decorative Glow Orb (only shown if not in clean/photo mode) */}
      {!isClean && !data.coverImageUrl && (
        <>
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/25 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

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
      <div className="relative z-10 my-auto text-center space-y-3 px-2">
        <h1
          contentEditable={!!onUpdate}
          suppressContentEditableWarning
          onBlur={(e) => onUpdate && onUpdate('mainTitle', e.currentTarget.textContent?.trim() || data.mainTitle)}
          className={`text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight transition-opacity hover:opacity-90 ${
            data.themeStyle === 'clean_photo'
              ? 'text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)]'
              : 'text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 drop-shadow-lg'
          }`}
        >
          {data.mainTitle || 'Judul Cerita Viral'}
        </h1>

        <p
          contentEditable={!!onUpdate}
          suppressContentEditableWarning
          onBlur={(e) => onUpdate && onUpdate('subtitle', e.currentTarget.textContent?.trim() || data.subtitle)}
          className={`text-xs sm:text-sm leading-relaxed font-normal max-w-xs mx-auto hover:opacity-90 ${
            data.themeStyle === 'clean_photo'
              ? 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] font-medium'
              : 'text-slate-300/90'
          }`}
        >
          {data.subtitle || 'Kisah nyata yang mendadak viral dan penuh drama...'}
        </p>
      </div>

      {/* Bottom Section: Call to Action Swipe Bar */}
      <div className="relative z-10 pt-4 flex flex-col items-center">
        {data.callToAction !== '' && (
          <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold text-white flex items-center space-x-2 shadow-xl animate-pulse">
            <span
              contentEditable={!!onUpdate}
              suppressContentEditableWarning
              onBlur={(e) => onUpdate && onUpdate('callToAction', e.currentTarget.textContent?.trim() || data.callToAction)}
            >
              {data.callToAction || 'Geser ke kanan untuk membaca ➔'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
