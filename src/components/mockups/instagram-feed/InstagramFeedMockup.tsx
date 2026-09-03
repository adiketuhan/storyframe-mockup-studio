import React from 'react';
import type { InstagramFeedData, ThemeMode } from '../../../types/story';
import { MoreHorizontal, Heart, MessageCircle, Send, Bookmark, CheckCircle2, Home, Search, PlusSquare, Clapperboard } from 'lucide-react';

interface InstagramFeedMockupProps {
  data: InstagramFeedData;
  themeMode: ThemeMode;
  onUpdate?: (field: keyof InstagramFeedData, value: any) => void;
}

export const InstagramFeedMockup: React.FC<InstagramFeedMockupProps> = ({
  data,
  themeMode,
  onUpdate,
}) => {
  const isDark = themeMode === 'dark';

  return (
    <div className={`flex flex-col h-full w-full select-none ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Top Feed App Header */}
      <div
        className={`px-4 py-2.5 flex items-center justify-between border-b shrink-0 ${
          isDark ? 'border-neutral-900 bg-black' : 'border-neutral-200 bg-white'
        }`}
      >
        <span className="font-serif italic font-bold text-2xl tracking-tighter">Instagram</span>
        <div className="flex items-center space-x-4">
          <Heart className="w-6 h-6 cursor-pointer" />
          <Send className="w-6 h-6 -rotate-12 cursor-pointer" />
        </div>
      </div>

      {/* Post Scrollable Container */}
      <div className="flex-1 overflow-y-auto">
        {/* Post Author Header */}
        <div className="px-3.5 py-2.5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            {/* Story ring */}
            <div className="p-0.5 rounded-full bg-gradient-to-tr from-yellow-500 via-rose-500 to-purple-600">
              <img
                src={data.avatar}
                alt={data.authorName}
                className="w-8 h-8 rounded-full object-cover border-2 border-black bg-neutral-800"
              />
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center space-x-1">
                <span
                  className="font-bold text-[13.5px] leading-tight truncate"
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
              {data.location && (
                <span
                  className="text-[11px] text-neutral-400 leading-tight truncate"
                  contentEditable={!!onUpdate}
                  suppressContentEditableWarning
                  onBlur={(e) => onUpdate && onUpdate('location', e.currentTarget.textContent || '')}
                >
                  {data.location}
                </span>
              )}
            </div>
          </div>

          <MoreHorizontal className="w-5 h-5 cursor-pointer text-neutral-400" />
        </div>

        {/* Main Post Media */}
        <div className="w-full bg-neutral-900 aspect-[4/3] max-h-72 overflow-hidden flex items-center justify-center">
          {data.mediaUrl ? (
            <img
              src={data.mediaUrl}
              alt="Post media"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-neutral-500 text-xs">Belum ada foto</div>
          )}
        </div>

        {/* Post Action Buttons */}
        <div className="px-3.5 pt-3 pb-1 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Heart
              className={`w-6 h-6 cursor-pointer transition-transform active:scale-125 ${
                data.isLiked ? 'fill-[#ff3040] text-[#ff3040]' : ''
              }`}
              onClick={() => onUpdate && onUpdate('isLiked', !data.isLiked)}
            />
            <MessageCircle className="w-6 h-6 -scale-x-100 cursor-pointer" />
            <Send className="w-6 h-6 -rotate-12 cursor-pointer" />
          </div>
          <Bookmark className="w-6 h-6 cursor-pointer" />
        </div>

        {/* Likes Count */}
        <div className="px-3.5 py-1">
          <span
            className="font-bold text-[13.5px]"
            contentEditable={!!onUpdate}
            suppressContentEditableWarning
            onBlur={(e) => onUpdate && onUpdate('likesCount', e.currentTarget.textContent || '')}
          >
            {data.likesCount}
          </span>
        </div>

        {/* Caption */}
        <div className="px-3.5 py-0.5 text-[13.5px] leading-snug">
          <span className="font-bold mr-1.5">{data.authorName}</span>
          <span
            contentEditable={!!onUpdate}
            suppressContentEditableWarning
            onBlur={(e) => onUpdate && onUpdate('caption', e.currentTarget.textContent || '')}
          >
            {data.caption}
          </span>
        </div>

        {/* Comments preview */}
        {data.commentCount && (
          <div className="px-3.5 pt-1 text-[13px] text-neutral-400 cursor-pointer">
            <span
              contentEditable={!!onUpdate}
              suppressContentEditableWarning
              onBlur={(e) => onUpdate && onUpdate('commentCount', e.currentTarget.textContent || '')}
            >
              {data.commentCount}
            </span>
          </div>
        )}

        {/* Relative Timestamp */}
        <div className="px-3.5 pt-1 pb-3 text-[10px] text-neutral-500 uppercase tracking-wide">
          <span
            contentEditable={!!onUpdate}
            suppressContentEditableWarning
            onBlur={(e) => onUpdate && onUpdate('timestamp', e.currentTarget.textContent || '')}
          >
            {data.timestamp}
          </span>
        </div>
      </div>

      {/* Bottom App Navigation Bar */}
      <div
        className={`px-6 py-2.5 flex items-center justify-between border-t shrink-0 ${
          isDark ? 'border-neutral-900 bg-black' : 'border-neutral-200 bg-white'
        }`}
      >
        <Home className="w-6 h-6 cursor-pointer" />
        <Search className="w-6 h-6 cursor-pointer" />
        <PlusSquare className="w-6 h-6 cursor-pointer" />
        <Clapperboard className="w-6 h-6 cursor-pointer" />
        <div className="w-6 h-6 rounded-full overflow-hidden border border-current">
          <img src={data.avatar} alt="User" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};
