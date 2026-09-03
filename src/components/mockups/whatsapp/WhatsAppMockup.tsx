import React from 'react';
import type { WhatsAppData, ThemeMode, WAMessage } from '../../../types/story';
import { WABubble } from './WABubble';
import { ArrowLeft, Video, Phone, MoreVertical, Paperclip, Smile, Mic, Camera, Lock, Ban } from 'lucide-react';

interface WhatsAppMockupProps {
  data: WhatsAppData;
  themeMode: ThemeMode;
  onUpdateHeader?: (field: keyof WhatsAppData, value: any) => void;
  onUpdateMessage?: (index: number, updated: Partial<WAMessage>) => void;
}

export const WhatsAppMockup: React.FC<WhatsAppMockupProps> = ({
  data,
  themeMode,
  onUpdateHeader,
  onUpdateMessage,
}) => {
  const isDark = themeMode === 'dark';

  return (
    <div className={`flex flex-col h-full w-full select-none ${isDark ? 'wa-bg-pattern-dark text-slate-100' : 'wa-bg-pattern-light text-slate-900'}`}>
      {/* WhatsApp App Header */}
      <div
        className={`px-3 py-2.5 flex items-center justify-between shadow-sm z-20 shrink-0 ${
          isDark ? 'bg-wa-header text-slate-100' : 'bg-wa-headerLight text-white'
        }`}
      >
        <div className="flex items-center space-x-2 min-w-0">
          <ArrowLeft className="w-5 h-5 shrink-0 opacity-90 cursor-pointer" />
          
          {/* Avatar */}
          <div className="relative shrink-0">
            <img
              src={data.avatar}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover border border-black/10 bg-slate-700"
            />
            {data.isBlocked && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border border-black flex items-center justify-center text-white" title="Kontak Diblokir">
                <Ban className="w-2.5 h-2.5" />
              </span>
            )}
          </div>

          {/* Contact Info */}
          <div className="flex flex-col min-w-0 pr-1">
            <span
              className="font-semibold text-[15px] leading-tight truncate"
              contentEditable={!!onUpdateHeader}
              suppressContentEditableWarning
              onBlur={(e) => onUpdateHeader && onUpdateHeader('contactName', e.currentTarget.textContent || '')}
            >
              {data.contactName}
            </span>
            <span
              className={`text-[11.5px] leading-tight truncate ${
                data.isBlocked
                  ? 'text-red-400 font-medium'
                  : data.status === 'online' || data.status === 'mengetik...'
                  ? isDark
                    ? 'text-wa-green font-medium'
                    : 'text-emerald-100 font-medium'
                  : isDark
                  ? 'text-wa-subtextDark'
                  : 'text-emerald-100/80'
              }`}
              contentEditable={!!onUpdateHeader}
              suppressContentEditableWarning
              onBlur={(e) => onUpdateHeader && onUpdateHeader('status', e.currentTarget.textContent || '')}
            >
              {data.isBlocked ? 'Diblokir' : data.status}
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4 opacity-90 shrink-0">
          <Video className="w-5 h-5 stroke-[2.2] cursor-pointer" />
          <Phone className="w-4.5 h-4.5 stroke-[2.2] cursor-pointer" />
          <MoreVertical className="w-5 h-5 stroke-[2.2] cursor-pointer" />
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto px-1 py-3 flex flex-col justify-end space-y-1">
        <div className="flex justify-center mb-3">
          <span
            className={`px-3 py-1 rounded-lg text-[11px] font-medium shadow-xs uppercase tracking-wide ${
              isDark ? 'bg-[#182229] text-wa-subtextDark' : 'bg-white text-wa-subtextLight'
            }`}
          >
            HARI INI
          </span>
        </div>

        {data.messages.map((msg, index) => {
          const prevMsg = data.messages[index - 1];
          const isSameSenderAsPrev = prevMsg && prevMsg.sender === msg.sender;
          const showTail = !isSameSenderAsPrev;

          return (
            <WABubble
              key={msg.id || index}
              message={msg}
              themeMode={themeMode}
              showTail={showTail}
              onUpdateMessage={(updated) => onUpdateMessage && onUpdateMessage(index, updated)}
            />
          );
        })}
      </div>

      {/* Bottom Area: Either Blocked Banner OR Normal Fake Input Bar */}
      {data.isBlocked ? (
        <div className="px-3 py-2.5 shrink-0 z-20">
          <div
            className={`w-full py-2.5 px-4 rounded-2xl text-[12.5px] font-medium text-center shadow-md flex items-center justify-center space-x-2 border ${
              isDark
                ? 'bg-[#182229] border-[#2a3942] text-slate-300'
                : 'bg-white border-neutral-300 text-slate-700'
            }`}
          >
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span
              contentEditable={!!onUpdateHeader}
              suppressContentEditableWarning
              onBlur={(e) => onUpdateHeader && onUpdateHeader('blockedNoticeText', e.currentTarget.textContent || '')}
              className="cursor-text leading-tight"
            >
              {data.blockedNoticeText || 'Anda telah memblokir kontak ini. Ketuk untuk membuka blokir.'}
            </span>
          </div>
        </div>
      ) : (
        <div className="px-2 py-2 flex items-center space-x-2 shrink-0 z-20">
          <div
            className={`flex-1 flex items-center px-3 py-2 rounded-3xl shadow-sm space-x-2 ${
              isDark ? 'bg-wa-inputDark text-slate-200' : 'bg-wa-inputLight text-slate-700'
            }`}
          >
            <Smile className="w-5 h-5 text-neutral-400 shrink-0" />
            <span className="text-[14px] text-neutral-400 flex-1 truncate">Ketik pesan</span>
            <Paperclip className="w-5 h-5 text-neutral-400 shrink-0 rotate-45" />
            <Camera className="w-5 h-5 text-neutral-400 shrink-0" />
          </div>
          <div className="w-11 h-11 rounded-full bg-wa-green flex items-center justify-center text-white shadow-md shrink-0">
            <Mic className="w-5 h-5" />
          </div>
        </div>
      )}
    </div>
  );
};
