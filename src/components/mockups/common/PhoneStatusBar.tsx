import React from 'react';
import type { StatusBarConfig, ThemeMode } from '../../../types/story';
import { Wifi, Zap } from 'lucide-react';

interface PhoneStatusBarProps {
  config: StatusBarConfig;
  themeMode: ThemeMode;
  isDarkPlatform?: boolean;
  onUpdateTime?: (newTime: string) => void;
}

export const PhoneStatusBar: React.FC<PhoneStatusBarProps> = ({ config, themeMode, isDarkPlatform, onUpdateTime }) => {
  if (!config.show) return null;

  const isDark = isDarkPlatform !== undefined ? isDarkPlatform : themeMode === 'dark';
  const textColor = isDark ? 'text-white' : 'text-slate-900';

  return (
    <div className={`w-full px-7 pt-3 pb-2 flex items-center justify-between select-none text-[13px] font-semibold tracking-tight ${textColor} z-30 transition-colors`}>
      {/* Left: Clock (Directly Editable & Synchronized with Chat) */}
      <div className="flex items-center space-x-1 font-semibold">
        <span
          contentEditable={!!onUpdateTime}
          suppressContentEditableWarning
          onBlur={(e) => onUpdateTime && onUpdateTime(e.currentTarget.textContent?.trim() || config.time)}
          className={onUpdateTime ? 'cursor-text hover:opacity-80 transition-opacity' : ''}
          title="Klik untuk mengubah jam (otomatis sinkron dengan chat)"
        >
          {config.time}
        </span>
      </div>

      {/* Middle: Minimal Speaker / Camera Pill */}
      <div className="w-20 h-4 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center space-x-1.5 opacity-60">
        <div className="w-2 h-2 rounded-full bg-black/60" />
        <div className="w-1.5 h-1.5 rounded-full bg-blue-900/40" />
      </div>

      {/* Right: Signal, WiFi, Battery */}
      <div className="flex items-center space-x-2">
        {/* Signal Bars */}
        <div className="flex items-end space-x-0.5 h-3">
          <div className="w-0.5 h-1.5 bg-current rounded-xs" />
          <div className="w-0.5 h-2 bg-current rounded-xs" />
          <div className="w-0.5 h-2.5 bg-current rounded-xs" />
          <div className="w-0.5 h-3 bg-current rounded-xs" />
        </div>

        {/* Signal Label / Type */}
        <span className="text-[10px] font-bold uppercase tracking-tighter">
          {config.signalType || '5G'}
        </span>

        {/* WiFi Icon */}
        <Wifi className="w-3.5 h-3.5 stroke-[2.4]" />

        {/* Battery with percentage */}
        <div className="flex items-center space-x-1">
          <span className="text-[11px] font-medium">{config.batteryLevel}%</span>
          <div className="relative flex items-center">
            <div className={`w-5 h-2.5 rounded-[3px] border ${isDark ? 'border-white/80' : 'border-black/80'} p-[1px] flex items-center`}>
              <div
                className={`h-full rounded-[1.5px] ${
                  config.batteryLevel <= 20
                    ? 'bg-red-500'
                    : isDark
                    ? 'bg-white'
                    : 'bg-black'
                }`}
                style={{ width: `${Math.min(100, Math.max(8, config.batteryLevel))}%` }}
              />
            </div>
            <div className={`w-0.5 h-1 rounded-r-[1px] ${isDark ? 'bg-white/80' : 'bg-black/80'} -mr-0.5`} />
            {config.isCharging && (
              <Zap className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400 absolute -left-1" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
