import React from 'react';
import type { NotificationOverlayConfig } from '../../../types/story';
import { MessageSquare, AlertTriangle } from 'lucide-react';
import { TwitterIcon, InstagramIcon, WhatsAppIcon } from '../../common/BrandIcons';

interface IncomingNotificationProps {
  config: NotificationOverlayConfig;
  onInlineEdit?: (field: string, value: string) => void;
}

export const IncomingNotification: React.FC<IncomingNotificationProps> = ({ config, onInlineEdit }) => {
  if (!config.enabled) return null;

  const renderAppIcon = () => {
    switch (config.platform) {
      case 'whatsapp':
        return (
          <div className="w-5 h-5 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-sm">
            <WhatsAppIcon className="w-3 h-3" />
          </div>
        );
      case 'instagram':
        return (
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
            <InstagramIcon className="w-3 h-3 text-white" />
          </div>
        );
      case 'twitter':
        return (
          <div className="w-5 h-5 rounded-full bg-black border border-neutral-700 flex items-center justify-center text-white shadow-sm">
            <TwitterIcon className="w-2.5 h-2.5" />
          </div>
        );
      case 'emergency':
        return (
          <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white shadow-sm animate-pulse">
            <AlertTriangle className="w-3 h-3 stroke-[2.5]" />
          </div>
        );
      default:
        return (
          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-sm">
            <MessageSquare className="w-3 h-3" />
          </div>
        );
    }
  };

  const appLabel = () => {
    switch (config.platform) {
      case 'whatsapp': return 'WHATSAPP';
      case 'instagram': return 'INSTAGRAM';
      case 'twitter': return 'X (TWITTER)';
      case 'emergency': return 'PERINGATAN DARURAT';
      default: return 'PESAN';
    }
  };

  return (
    <div className="px-3 pt-1 pb-2 w-full z-40 animate-fade-in select-none">
      <div className="w-full bg-[#1c1c1e]/95 backdrop-blur-xl text-white rounded-2xl p-3 shadow-2xl border border-white/10 flex items-start space-x-3 transition-all transform hover:scale-[1.01]">
        {/* Avatar or App Icon */}
        <div className="relative shrink-0 mt-0.5">
          {config.avatar ? (
            <img
              src={config.avatar}
              alt="Notification Avatar"
              className="w-10 h-10 rounded-full object-cover border border-white/20"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400">
              <MessageSquare className="w-5 h-5" />
            </div>
          )}
          <div className="absolute -bottom-1 -right-1">
            {renderAppIcon()}
          </div>
        </div>

        {/* Notification Text Content */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center justify-between mb-0.5">
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-bold text-neutral-400 tracking-wider">
                {appLabel()}
              </span>
            </div>
            <span
              className="text-[10px] text-neutral-400"
              contentEditable={!!onInlineEdit}
              suppressContentEditableWarning
              onBlur={(e) => onInlineEdit && onInlineEdit('time', e.currentTarget.textContent || '')}
            >
              {config.time || 'Sekarang'}
            </span>
          </div>

          <h4
            className="text-[13px] font-semibold text-white tracking-tight leading-tight truncate"
            contentEditable={!!onInlineEdit}
            suppressContentEditableWarning
            onBlur={(e) => onInlineEdit && onInlineEdit('title', e.currentTarget.textContent || '')}
          >
            {config.title}
          </h4>

          <p
            className="text-[12px] text-neutral-200 leading-snug line-clamp-2 mt-0.5"
            contentEditable={!!onInlineEdit}
            suppressContentEditableWarning
            onBlur={(e) => onInlineEdit && onInlineEdit('message', e.currentTarget.textContent || '')}
          >
            {config.message}
          </p>
        </div>
      </div>
    </div>
  );
};
