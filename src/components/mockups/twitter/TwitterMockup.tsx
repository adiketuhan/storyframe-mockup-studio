import React from 'react';
import type { TwitterData, ThemeMode } from '../../../types/story';
import { ArrowLeft, MoreHorizontal, MessageCircle, Repeat2, Heart, Bookmark, Share, CheckCircle2 } from 'lucide-react';

interface TwitterMockupProps {
  data: TwitterData;
  themeMode: ThemeMode;
  onUpdate?: (field: keyof TwitterData, value: any) => void;
}

export const TwitterMockup: React.FC<TwitterMockupProps> = ({
  data,
  themeMode,
  onUpdate,
}) => {
  const isDark = themeMode === 'dark';

  return (
    <div className={`flex flex-col h-full w-full select-none ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Twitter App Header */}
      <div
        className={`px-4 py-3 flex items-center justify-between border-b shrink-0 z-20 ${
          isDark ? 'border-[#2f3336] bg-black/90' : 'border-[#eff3f4] bg-white/90'
        }`}
      >
        <div className="flex items-center space-x-6">
          <ArrowLeft className="w-5 h-5 cursor-pointer" />
          <span className="font-bold text-[18px]">Post</span>
        </div>
      </div>

      {/* Tweet Body Container */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {/* Author Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3 min-w-0">
            <img
              src={data.avatar}
              alt={data.authorName}
              className="w-11 h-11 rounded-full object-cover shrink-0 bg-neutral-800"
            />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center space-x-1">
                <span
                  className="font-bold text-[15px] leading-tight truncate hover:underline"
                  contentEditable={!!onUpdate}
                  suppressContentEditableWarning
                  onBlur={(e) => onUpdate && onUpdate('authorName', e.currentTarget.textContent || '')}
                >
                  {data.authorName}
                </span>
                {data.verified && (
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ${
                      data.verifiedType === 'gold'
                        ? 'fill-[#e2b714] text-black'
                        : 'fill-[#1d9bf0] text-white'
                    }`}
                  />
                )}
              </div>
              <span
                className="text-[13.5px] text-[#71767b] leading-tight truncate"
                contentEditable={!!onUpdate}
                suppressContentEditableWarning
                onBlur={(e) => onUpdate && onUpdate('handle', e.currentTarget.textContent || '')}
              >
                @{data.handle.replace(/^@/, '')}
              </span>
            </div>
          </div>
          <MoreHorizontal className="w-5 h-5 text-[#71767b] shrink-0 cursor-pointer" />
        </div>

        {/* Tweet Text Content */}
        <p
          className="text-[17px] leading-[1.38] mb-3 whitespace-pre-wrap font-normal"
          contentEditable={!!onUpdate}
          suppressContentEditableWarning
          onBlur={(e) => onUpdate && onUpdate('text', e.currentTarget.textContent || '')}
        >
          {data.text}
        </p>

        {/* Media Attachment */}
        {data.mediaUrl && (
          <div className="mb-3 rounded-2xl overflow-hidden border border-neutral-800 max-h-72">
            <img
              src={data.mediaUrl}
              alt="Tweet Media"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Date & Device Line */}
        <div className="py-3 border-b border-[#2f3336]/60 flex items-center space-x-1.5 text-[14px] text-[#71767b]">
          <span
            contentEditable={!!onUpdate}
            suppressContentEditableWarning
            onBlur={(e) => onUpdate && onUpdate('timestamp', e.currentTarget.textContent || '')}
          >
            {data.timestamp}
          </span>
          <span>·</span>
          <span
            className="text-white font-medium hover:underline cursor-pointer"
            contentEditable={!!onUpdate}
            suppressContentEditableWarning
            onBlur={(e) => onUpdate && onUpdate('device', e.currentTarget.textContent || '')}
          >
            {data.device}
          </span>
        </div>

        {/* Views & Metrics Box */}
        <div className="py-3 border-b border-[#2f3336]/60 flex items-center space-x-4 text-[14px] text-[#71767b] flex-wrap gap-y-1">
          <div className="flex items-center space-x-1">
            <span
              className="font-bold text-white"
              contentEditable={!!onUpdate}
              suppressContentEditableWarning
              onBlur={(e) => onUpdate && onUpdate('repostsCount', e.currentTarget.textContent || '')}
            >
              {data.repostsCount}
            </span>
            <span>Repost</span>
          </div>
          <div className="flex items-center space-x-1">
            <span
              className="font-bold text-white"
              contentEditable={!!onUpdate}
              suppressContentEditableWarning
              onBlur={(e) => onUpdate && onUpdate('quotesCount', e.currentTarget.textContent || '')}
            >
              {data.quotesCount}
            </span>
            <span>Kutipan</span>
          </div>
          <div className="flex items-center space-x-1">
            <span
              className="font-bold text-white"
              contentEditable={!!onUpdate}
              suppressContentEditableWarning
              onBlur={(e) => onUpdate && onUpdate('likesCount', e.currentTarget.textContent || '')}
            >
              {data.likesCount}
            </span>
            <span>Suka</span>
          </div>
          <div className="flex items-center space-x-1">
            <span
              className="font-bold text-white"
              contentEditable={!!onUpdate}
              suppressContentEditableWarning
              onBlur={(e) => onUpdate && onUpdate('bookmarksCount', e.currentTarget.textContent || '')}
            >
              {data.bookmarksCount}
            </span>
            <span>Markah</span>
          </div>
        </div>

        {/* Bottom Interaction Action Icons */}
        <div className="py-2.5 flex items-center justify-around text-[#71767b] border-b border-[#2f3336]/60">
          <MessageCircle className="w-5 h-5 cursor-pointer hover:text-[#1d9bf0]" />
          <Repeat2 className="w-5 h-5 cursor-pointer hover:text-[#00ba7c]" />
          <Heart className="w-5 h-5 cursor-pointer hover:text-[#f91880]" />
          <Bookmark className="w-5 h-5 cursor-pointer hover:text-[#1d9bf0]" />
          <Share className="w-5 h-5 cursor-pointer hover:text-[#1d9bf0]" />
        </div>
      </div>
    </div>
  );
};
