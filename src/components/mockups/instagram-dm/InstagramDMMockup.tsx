import React from 'react';
import type { InstagramDMData, ThemeMode, IGDMMessage } from '../../../types/story';
import { ArrowLeft, Phone, Video, Info, Camera, Mic, Image as ImageIcon, Heart, CheckCircle2, Lock } from 'lucide-react';

interface InstagramDMMockupProps {
  data: InstagramDMData;
  themeMode: ThemeMode;
  onUpdateHeader?: (field: keyof InstagramDMData, value: any) => void;
  onUpdateMessage?: (index: number, updated: Partial<IGDMMessage>) => void;
}

export const InstagramDMMockup: React.FC<InstagramDMMockupProps> = ({
  data,
  themeMode,
  onUpdateHeader,
  onUpdateMessage,
}) => {
  const isDark = themeMode === 'dark';

  return (
    <div className={`flex flex-col h-full w-full select-none ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Instagram DM Header */}
      <div
        className={`px-4 py-3 flex items-center justify-between border-b shrink-0 z-20 ${
          isDark ? 'border-neutral-800 bg-black/90' : 'border-neutral-200 bg-white/90'
        }`}
      >
        <div className="flex items-center space-x-3 min-w-0">
          <ArrowLeft className="w-6 h-6 shrink-0 cursor-pointer" />
          
          <div className="relative shrink-0">
            <img
              src={data.avatar}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover border border-neutral-700 bg-neutral-800"
            />
          </div>

          <div className="flex flex-col min-w-0 pr-1">
            <div className="flex items-center space-x-1">
              <span
                className="font-bold text-[14.5px] leading-tight truncate"
                contentEditable={!!onUpdateHeader}
                suppressContentEditableWarning
                onBlur={(e) => onUpdateHeader && onUpdateHeader('contactName', e.currentTarget.textContent || '')}
              >
                {data.contactName}
              </span>
              {data.verified && (
                <CheckCircle2 className="w-3.5 h-3.5 fill-[#0095f6] text-white shrink-0" />
              )}
            </div>
            <span
              className={`text-[11.5px] leading-tight truncate ${data.isBlocked ? 'text-red-400 font-medium' : 'text-neutral-400'}`}
              contentEditable={!!onUpdateHeader}
              suppressContentEditableWarning
              onBlur={(e) => onUpdateHeader && onUpdateHeader('activeStatus', e.currentTarget.textContent || '')}
            >
              {data.isBlocked ? 'Akun Diblokir' : data.activeStatus || 'Aktif sekarang'}
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4 opacity-90 shrink-0">
          <Phone className="w-5 h-5 cursor-pointer" />
          <Video className="w-6 h-6 cursor-pointer" />
          <Info className="w-5 h-5 cursor-pointer" />
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col justify-end space-y-2">
        {data.messages.map((msg, index) => {
          const isMe = msg.sender === 'me';
          const isLastOut = isMe && index === data.messages.length - 1;

          return (
            <div
              key={msg.id || index}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} w-full`}
            >
              <div
                className={`max-w-[78%] rounded-3xl px-4 py-2.5 text-[14px] leading-relaxed break-words shadow-xs ${
                  isMe
                    ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 text-white rounded-br-md'
                    : isDark
                    ? 'bg-[#262626] text-white rounded-bl-md'
                    : 'bg-[#efefef] text-black rounded-bl-md'
                }`}
              >
                {msg.type === 'image' && msg.mediaUrl && (
                  <div className="mb-1 rounded-2xl overflow-hidden">
                    <img
                      src={msg.mediaUrl}
                      alt="IG Media"
                      className="w-full max-h-60 object-cover rounded-2xl"
                    />
                  </div>
                )}
                <span
                  contentEditable={!!onUpdateMessage}
                  suppressContentEditableWarning
                  onBlur={(e) => onUpdateMessage && onUpdateMessage(index, { text: e.currentTarget.textContent || '' })}
                >
                  {msg.text}
                </span>
              </div>

              {/* Seen / Dilihat footer for last message */}
              {isLastOut && (
                <span className="text-[11px] text-neutral-400 mt-1 mr-1">
                  Dilihat {msg.time}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Instagram DM Input Bar OR Blocked Banner */}
      {data.isBlocked ? (
        <div className="px-4 py-3 shrink-0 z-20 border-t border-neutral-800 bg-neutral-950">
          <div className="w-full py-2 px-3 rounded-2xl text-[12px] font-medium text-center shadow-md flex items-center justify-center space-x-2 bg-neutral-900 border border-neutral-800 text-neutral-300">
            <Lock className="w-4 h-4 text-rose-400 shrink-0" />
            <span
              contentEditable={!!onUpdateHeader}
              suppressContentEditableWarning
              onBlur={(e) => onUpdateHeader && onUpdateHeader('blockedNoticeText', e.currentTarget.textContent || '')}
            >
              {data.blockedNoticeText || 'Anda telah memblokir akun ini.'}
            </span>
          </div>
        </div>
      ) : (
        <div
          className={`px-3 py-2.5 flex items-center space-x-2 border-t shrink-0 ${
            isDark ? 'border-neutral-800 bg-black' : 'border-neutral-200 bg-white'
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0">
            <Camera className="w-5 h-5" />
          </div>
          
          <div
            className={`flex-1 flex items-center justify-between px-3.5 py-2 rounded-full border ${
              isDark ? 'border-neutral-700 bg-neutral-900 text-neutral-400' : 'border-neutral-300 bg-neutral-100 text-neutral-600'
            }`}
          >
            <span className="text-[13.5px]">Kirim pesan...</span>
            <div className="flex items-center space-x-3 text-neutral-400">
              <Mic className="w-4 h-4 cursor-pointer" />
              <ImageIcon className="w-4 h-4 cursor-pointer" />
              <Heart className="w-4 h-4 cursor-pointer" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
