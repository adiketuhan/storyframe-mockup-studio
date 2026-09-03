import React from 'react';
import { useStory } from '../../context/StoryContext';
import { Clock, Battery, Signal, Plus, Sparkles } from 'lucide-react';

export const StatusBarEditor: React.FC = () => {
  const { activeSlide, updateActiveSlide, incrementTime } = useStory();
  const { statusBar } = activeSlide;

  const handleUpdate = (field: string, value: any) => {
    updateActiveSlide(slide => ({
      ...slide,
      statusBar: {
        ...slide.statusBar,
        [field]: value,
      },
    }));
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-indigo-400" />
          <h3 className="font-bold text-sm text-slate-200">Status Bar & Waktu</h3>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={statusBar.show}
            onChange={(e) => handleUpdate('show', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
      </div>

      {statusBar.show && (
        <>
          {/* Quick Time Incrementors (Storytelling Booster) */}
          <div>
            <div className="flex items-center space-x-1.5 mb-1.5 text-xs text-indigo-300 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto Time Incrementor (Alur Waktu Cerita):</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => incrementTime(1)}
                className="py-1.5 px-2 bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-800/60 text-indigo-200 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 transition-all active:scale-95"
              >
                <Plus className="w-3 h-3" />
                <span>+1 Menit</span>
              </button>
              <button
                type="button"
                onClick={() => incrementTime(5)}
                className="py-1.5 px-2 bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-800/60 text-indigo-200 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 transition-all active:scale-95"
              >
                <Plus className="w-3 h-3" />
                <span>+5 Menit</span>
              </button>
              <button
                type="button"
                onClick={() => incrementTime(60)}
                className="py-1.5 px-2 bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-800/60 text-indigo-200 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 transition-all active:scale-95"
              >
                <Plus className="w-3 h-3" />
                <span>+1 Jam</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Clock Input */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">Jam Ponsel</label>
              <input
                type="text"
                value={statusBar.time}
                onChange={(e) => handleUpdate('time', e.target.value)}
                placeholder="23:45"
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Battery Level */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="flex items-center space-x-1">
                  <Battery className="w-3 h-3" />
                  <span>Baterai</span>
                </span>
                <span className="text-slate-200 font-semibold">{statusBar.batteryLevel}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={statusBar.batteryLevel}
                onChange={(e) => handleUpdate('batteryLevel', parseInt(e.target.value, 10))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Signal Type */}
            <div>
              <label className="block text-xs text-slate-400 mb-1 flex items-center space-x-1">
                <Signal className="w-3 h-3" />
                <span>Jaringan</span>
              </label>
              <select
                value={statusBar.signalType}
                onChange={(e) => handleUpdate('signalType', e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="5G">5G</option>
                <option value="4G">4G</option>
                <option value="LTE">LTE</option>
                <option value="WiFi">Wi-Fi</option>
              </select>
            </div>

            {/* Carrier Name */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">Operator</label>
              <input
                type="text"
                value={statusBar.carrier || ''}
                onChange={(e) => handleUpdate('carrier', e.target.value)}
                placeholder="Telkomsel"
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
