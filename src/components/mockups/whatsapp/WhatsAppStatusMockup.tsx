import React from 'react';
import type { WhatsAppStatusData } from '../../../types/story';
import { ArrowLeft, MoreVertical, Smile, Send, ChevronUp } from 'lucide-react';

interface WhatsAppStatusMockupProps {
  data: WhatsAppStatusData;
  onUpdate?: (field: keyof WhatsAppStatusData, value: any) => void;
}

export const WhatsAppStatusMockup: React.FC<WhatsAppStatusMockupProps> = ({ data, onUpdate }) => {
  const isImageMode = data.statusType === 'image' && data.mediaUrl;
  const totalSegments = Math.max(1, Math.min(6, data.totalSegments || 3));
  const activeSegment = Math.min(totalSegments - 1, Math.max(0, data.activeSegmentIndex || 0));

  const fontStyleClass =
    data.fontStyle === 'serif'
      ? 'font-serif'
      : data.fontStyle === 'comic'
      ? 'font-sans italic font-black tracking-wide'
      : data.fontStyle === 'mono'
      ? 'font-mono'
      : 'font-sans font-extrabold';

  return (
    <div
      className="w-full h-full flex flex-col justify-between relative overflow-hidden select-none"
      style={{
        backgroundColor: isImageMode ? '#000000' : data.backgroundColor || '#075E54',
      }}
    >
      {/* Background Image if image status */}
      {isImageMode && data.mediaUrl && (
        <div className="absolute inset-0 z-0">
          <img
            src={data.mediaUrl}
            alt="Status Media"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
        </div>
      )}

      {/* Top Section: Segmented Progress Bar + Status Author Header */}
      <div className="relative z-20 px-3.5 pt-2 space-y-2 bg-gradient-to-b from-black/70 to-transparent pb-4">
        {/* Segmented Progress Bars (Garis Status Atas) */}
        <div className="flex items-center space-x-1.5 w-full">
          {Array.from({ length: totalSegments }).map((_, idx) => (
            <div
              key={idx}
              className="h-1 flex-1 rounded-full overflow-hidden bg-white/30 backdrop-blur-sm"
            >
              <div
                className={`h-full ${
                  idx < activeSegment
                    ? 'w-full bg-white'
                    : idx === activeSegment
                    ? 'w-3/5 bg-white'
                    : 'w-0'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Author Header */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <button type="button" className="p-1 -ml-1 text-white/90">
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Avatar with WhatsApp Status Green Ring */}
            <div className="relative p-[1.5px] rounded-full ring-2 ring-emerald-400">
              <img
                src={data.avatar}
                alt={data.contactName}
                className="w-9 h-9 rounded-full object-cover bg-slate-800"
              />
            </div>

            <div>
              <h3
                contentEditable={!!onUpdate}
                suppressContentEditableWarning
                onBlur={(e) => onUpdate && onUpdate('contactName', e.currentTarget.textContent?.trim() || data.contactName)}
                className="font-bold text-sm leading-tight hover:opacity-80 transition-opacity"
              >
                {data.contactName}
              </h3>
              <p
                contentEditable={!!onUpdate}
                suppressContentEditableWarning
                onBlur={(e) => onUpdate && onUpdate('timestamp', e.currentTarget.textContent?.trim() || data.timestamp)}
                className="text-[11px] text-white/75 font-normal leading-tight hover:opacity-80"
              >
                {data.timestamp || 'Hari ini 09:15'}
              </p>
            </div>
          </div>

          <button type="button" className="p-1 text-white/80">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Middle Section: Status Content (Text or Image Overlay) */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6 text-center">
        {!isImageMode ? (
          <div
            contentEditable={!!onUpdate}
            suppressContentEditableWarning
            onBlur={(e) => onUpdate && onUpdate('text', e.currentTarget.textContent?.trim() || data.text)}
            className={`text-white text-xl sm:text-2xl leading-relaxed max-w-sm px-2 focus:outline-none drop-shadow-md ${fontStyleClass}`}
          >
            {data.text || 'Tulis status WhatsApp di sini...'}
          </div>
        ) : data.caption ? (
          <div className="self-end w-full pb-2">
            <div
              contentEditable={!!onUpdate}
              suppressContentEditableWarning
              onBlur={(e) => onUpdate && onUpdate('caption', e.currentTarget.textContent?.trim() || data.caption)}
              className="text-white text-sm bg-black/50 backdrop-blur-md rounded-2xl p-3 text-center border border-white/10"
            >
              {data.caption}
            </div>
          </div>
        ) : null}
      </div>

      {/* Bottom Section: Reply Bar (Balas Status) */}
      <div className="relative z-20 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center space-y-1.5">
        <div className="flex items-center text-white/70 text-[11px] space-x-1 font-medium">
          <ChevronUp className="w-4 h-4 animate-bounce" />
          <span>Balas</span>
        </div>

        <div className="w-full flex items-center space-x-2">
          <div className="flex-1 bg-white/15 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 flex items-center justify-between text-white/90 text-xs">
            <span className="text-white/60">Ketik balasan...</span>
            <Smile className="w-4 h-4 text-white/70" />
          </div>

          <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg">
            <Send className="w-4 h-4 -rotate-45 ml-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
