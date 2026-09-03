import React from 'react';
import type { WAMessage, ThemeMode } from '../../../types/story';
import { Check, CheckCheck, Ban, Play, Mic, Lock } from 'lucide-react';

interface WABubbleProps {
  message: WAMessage;
  themeMode: ThemeMode;
  showTail: boolean;
  onUpdateMessage?: (updated: Partial<WAMessage>) => void;
}

export const WABubble: React.FC<WABubbleProps> = ({
  message,
  themeMode,
  showTail,
  onUpdateMessage,
}) => {
  const isMe = message.sender === 'me';
  const isDark = themeMode === 'dark';

  // Case: System / Block Notice Bubble in Chat Stream
  if (message.type === 'system') {
    return (
      <div className="flex justify-center w-full my-2 px-6 select-none">
        <div
          className={`px-3 py-1.5 rounded-xl text-[11.5px] leading-snug text-center shadow-xs flex items-center justify-center space-x-1.5 border max-w-[90%] ${
            isDark
              ? 'bg-[#182229]/95 border-[#222e35] text-amber-300/90'
              : 'bg-[#fff5c4] border-[#ffe885] text-amber-900'
          }`}
        >
          <Lock className="w-3.5 h-3.5 shrink-0 opacity-80" />
          <span
            contentEditable={!!onUpdateMessage}
            suppressContentEditableWarning
            onBlur={(e) => onUpdateMessage && onUpdateMessage({ text: e.currentTarget.textContent || '' })}
            className="cursor-text"
          >
            {message.text || 'Anda telah memblokir kontak ini. Ketuk untuk membuka blokir.'}
          </span>
        </div>
      </div>
    );
  }

  const renderTicks = () => {
    if (!isMe) return null;
    switch (message.status) {
      case 'read':
        return <CheckCheck className="w-3.5 h-3.5 text-wa-blueTick stroke-[2.5]" />;
      case 'delivered':
        return <CheckCheck className="w-3.5 h-3.5 text-wa-grayTick stroke-[2]" />;
      case 'sent':
      default:
        return <Check className="w-3.5 h-3.5 text-wa-grayTick stroke-[2]" />;
    }
  };

  const bubbleBg = isMe
    ? isDark
      ? 'bg-wa-bubbleOutDark text-slate-100'
      : 'bg-wa-bubbleOutLight text-slate-900'
    : isDark
    ? 'bg-wa-bubbleInDark text-slate-100'
    : 'bg-wa-bubbleInLight text-slate-900';

  const tailClass = showTail
    ? isMe
      ? isDark
        ? 'wa-tail-out-dark rounded-tr-none'
        : 'wa-tail-out-light rounded-tr-none'
      : isDark
      ? 'wa-tail-in-dark rounded-tl-none'
      : 'wa-tail-in-light rounded-tl-none'
    : '';

  return (
    <div className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} mb-1.5 px-3`}>
      <div
        className={`relative max-w-[82%] rounded-2xl px-3 py-1.5 shadow-wa-bubble select-text transition-all ${bubbleBg} ${tailClass}`}
      >
        {/* Case 1: Deleted Message */}
        {message.type === 'deleted' && (
          <div className="flex items-center space-x-2 py-0.5 text-[13px] italic opacity-75 select-none">
            <Ban className="w-3.5 h-3.5 shrink-0 text-neutral-400" />
            <span
              contentEditable={!!onUpdateMessage}
              suppressContentEditableWarning
              onBlur={(e) => onUpdateMessage && onUpdateMessage({ text: e.currentTarget.textContent || '' })}
            >
              {message.text || 'Pesan ini telah dihapus'}
            </span>
          </div>
        )}

        {/* Case 2: Voice Note */}
        {message.type === 'voice' && (
          <div className="py-1">
            <div className="flex items-center space-x-2.5">
              <div className="relative">
                <button
                  type="button"
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                    isDark ? 'bg-wa-green/20 text-wa-green' : 'bg-wa-darkgreen text-white'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-wa-green rounded-full flex items-center justify-center text-white">
                  <Mic className="w-2 h-2" />
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center space-y-1">
                <div className="flex items-center space-x-0.5 h-6">
                  {[40, 70, 30, 90, 60, 100, 45, 80, 55, 90, 75, 40, 85, 60, 95, 50, 70, 30, 60, 40].map(
                    (height, idx) => (
                      <div
                        key={idx}
                        className={`w-1 rounded-full ${
                          idx < 8
                            ? isDark
                              ? 'bg-wa-green'
                              : 'bg-wa-darkgreen'
                            : isDark
                            ? 'bg-neutral-600'
                            : 'bg-neutral-400'
                        }`}
                        style={{ height: `${(height / 100) * 20 + 4}px` }}
                      />
                    )
                  )}
                </div>
                <div className="flex items-center justify-between text-[10px] text-neutral-400">
                  <span
                    contentEditable={!!onUpdateMessage}
                    suppressContentEditableWarning
                    onBlur={(e) => onUpdateMessage && onUpdateMessage({ voiceDuration: e.currentTarget.textContent || '0:14' })}
                  >
                    {message.voiceDuration || '0:14'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Case 3: Image Media Attachment */}
        {message.type === 'image' && (
          <div className="mb-1 rounded-lg overflow-hidden border border-black/10">
            {message.mediaUrl ? (
              <img
                src={message.mediaUrl}
                alt="Chat Attachment"
                className="w-full max-h-64 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-40 bg-neutral-800 flex items-center justify-center text-neutral-400 text-xs">
                Tidak ada gambar
              </div>
            )}
            {message.text && (
              <p
                className="text-[13.5px] leading-relaxed pt-1.5 pb-0.5 break-words"
                contentEditable={!!onUpdateMessage}
                suppressContentEditableWarning
                onBlur={(e) => onUpdateMessage && onUpdateMessage({ text: e.currentTarget.textContent || '' })}
              >
                {message.text}
              </p>
            )}
          </div>
        )}

        {/* Case 4: Standard Text Message */}
        {message.type === 'text' && (
          <p
            className="text-[14px] leading-relaxed break-words pr-2 whitespace-pre-wrap"
            contentEditable={!!onUpdateMessage}
            suppressContentEditableWarning
            onBlur={(e) => onUpdateMessage && onUpdateMessage({ text: e.currentTarget.textContent || '' })}
          >
            {message.text}
          </p>
        )}

        {/* Time and Status Footer */}
        <div className="flex items-center justify-end space-x-1 mt-0.5 ml-2 float-right text-[10.5px] text-neutral-400 select-none">
          <span
            contentEditable={!!onUpdateMessage}
            suppressContentEditableWarning
            onBlur={(e) => onUpdateMessage && onUpdateMessage({ time: e.currentTarget.textContent || '' })}
          >
            {message.time}
          </span>
          {renderTicks()}
        </div>
      </div>
    </div>
  );
};
