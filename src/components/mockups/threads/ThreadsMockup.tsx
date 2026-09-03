import React from 'react';
import type { ThreadsData, ThemeMode } from '../../../types/story';
import { ArrowLeft, MoreHorizontal, Heart, MessageCircle, Repeat2, Send, CheckCircle2 } from 'lucide-react';

interface ThreadsMockupProps {
  data: ThreadsData;
  themeMode: ThemeMode;
  onUpdate?: (field: keyof ThreadsData, value: any) => void;
}

export const ThreadsMockup: React.FC<ThreadsMockupProps> = ({
  data,
  themeMode,
  onUpdate,
}) => {
  const isDark = themeMode === 'dark';

  return (
    <div className={`flex flex-col h-full w-full select-none ${isDark ? 'bg-[#101010] text-white' : 'bg-white text-black'}`}>
      {/* Threads App Top Header */}
      <div
        className={`px-4 py-3 flex items-center justify-between border-b shrink-0 ${
          isDark ? 'border-[#282828] bg-[#101010]' : 'border-neutral-200 bg-white'
        }`}
      >
        <ArrowLeft className="w-5 h-5 cursor-pointer" />
        <div className="font-bold text-[17px] tracking-tight">Utas</div>
        <MoreHorizontal className="w-5 h-5 cursor-pointer text-neutral-400" />
      </div>

      {/* Utas Thread Body */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {/* Main Post Item */}
        <div className="relative flex space-x-3">
          {/* Avatar & Thread Vertical Line */}
          <div className="flex flex-col items-center">
            <img
              src={data.avatar}
              alt={data.authorName}
              className="w-10 h-10 rounded-full object-cover shrink-0 bg-neutral-800"
            />
            {data.hasReply && (
              <div className="w-0.5 flex-1 my-1 bg-[#333333] rounded-full min-h-[30px]" />
            )}
          </div>

          {/* Post Content */}
          <div className="flex-1 min-w-0 pb-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-1">
                <span
                  className="font-bold text-[14.5px] leading-tight truncate"
                  contentEditable={!!onUpdate}
                  suppressContentEditableWarning
                  onBlur={(e) => onUpdate && onUpdate('authorName', e.currentTarget.textContent || '')}
                >
                  {data.authorName}
                </span>
                {data.verified && (
                  <CheckCircle2 className="w-3.5 h-3.5 fill-[#0095f6] text-white shrink-0" />
                )}
              </div>
              <div className="flex items-center space-x-2 text-neutral-500 text-[13px]">
                <span
                  contentEditable={!!onUpdate}
                  suppressContentEditableWarning
                  onBlur={(e) => onUpdate && onUpdate('timestamp', e.currentTarget.textContent || '')}
                >
                  {data.timestamp}
                </span>
                <MoreHorizontal className="w-4 h-4 cursor-pointer" />
              </div>
            </div>

            {/* Post Text */}
            <p
              className="text-[14.5px] leading-relaxed mb-2.5 whitespace-pre-wrap"
              contentEditable={!!onUpdate}
              suppressContentEditableWarning
              onBlur={(e) => onUpdate && onUpdate('text', e.currentTarget.textContent || '')}
            >
              {data.text}
            </p>

            {/* Media */}
            {data.mediaUrl && (
              <div className="mb-3 rounded-2xl overflow-hidden border border-[#282828] max-h-64">
                <img
                  src={data.mediaUrl}
                  alt="Threads Media"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center space-x-4 text-neutral-400 py-1">
              <Heart className="w-5 h-5 cursor-pointer hover:text-red-500" />
              <MessageCircle className="w-5 h-5 cursor-pointer" />
              <Repeat2 className="w-5 h-5 cursor-pointer" />
              <Send className="w-5 h-5 -rotate-12 cursor-pointer" />
            </div>

            {/* Metrics */}
            <div className="flex items-center space-x-2 text-[12.5px] text-neutral-500 mt-1">
              <span>{data.repliesCount} balasan</span>
              <span>·</span>
              <span>{data.likesCount} suka</span>
            </div>
          </div>
        </div>

        {/* Nested Reply Post Item (If enabled) */}
        {data.hasReply && (
          <div className="flex space-x-3 pt-2">
            <img
              src={data.replyAvatar || data.avatar}
              alt="Reply Avatar"
              className="w-9 h-9 rounded-full object-cover shrink-0 bg-neutral-800"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span
                  className="font-bold text-[14px] leading-tight truncate"
                  contentEditable={!!onUpdate}
                  suppressContentEditableWarning
                  onBlur={(e) => onUpdate && onUpdate('replyAuthorName', e.currentTarget.textContent || '')}
                >
                  {data.replyAuthorName || 'User Lain'}
                </span>
                <span className="text-neutral-500 text-[12px]">{data.replyTimestamp || '1m'}</span>
              </div>
              <p
                className="text-[14px] leading-relaxed text-neutral-200"
                contentEditable={!!onUpdate}
                suppressContentEditableWarning
                onBlur={(e) => onUpdate && onUpdate('replyText', e.currentTarget.textContent || '')}
              >
                {data.replyText || 'Ini adalah balasan dalam utas.'}
              </p>
              <div className="flex items-center space-x-4 text-neutral-400 pt-2">
                <Heart className="w-4 h-4 cursor-pointer" />
                <MessageCircle className="w-4 h-4 cursor-pointer" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
