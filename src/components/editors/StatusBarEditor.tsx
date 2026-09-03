import React from 'react';
import { useStory } from '../../context/StoryContext';
import { Clock, Battery, Signal, Plus, Sparkles } from 'lucide-react';

export const StatusBarEditor: React.FC = () => {
  const { activeSlide, updateActiveSlide, incrementTime } = useStory();
  const { statusBar } = activeSlide;

  const handleUpdate = (field: string, value: any) => {
    updateActiveSlide(slide => {
      let updatedWA = { ...slide.whatsapp };
      let updatedIGDM = { ...slide.instagramDm };

      // When updating time, sync with the latest chat message
      if (field === 'time') {
        if (updatedWA.messages && updatedWA.messages.length > 0) {
          const msgs = updatedWA.messages.map((m, idx) => {
            if (idx === updatedWA.messages.length - 1) {
              return { ...m, time: value };
            }
            return m;
          });
          updatedWA.messages = msgs;
        }

        if (updatedIGDM.messages && updatedIGDM.messages.length > 0) {
          const msgs = updatedIGDM.messages.map((m, idx) => {
            if (idx === updatedIGDM.messages.length - 1) {
              return { ...m, time: value };
            }
            return m;
          });
          updatedIGDM.messages = msgs;
        }
      }

      return {
        ...slide,
        statusBar: {
          ...slide.statusBar,
          [field]: value,
        },
        whatsapp: updatedWA,
        instagramDm: updatedIGDM,
      };
    });
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
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="5G">5G</option>
                <option value="4G">4G / LTE</option>
                <option value="3G">3G</option>
                <option value="WiFi">WiFi Saja</option>
              </select>
            </div>

            {/* Carrier Name */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">Operator</label>
              <input
                type="text"
                value={statusBar.carrier || ''}
                onChange={(e) => handleUpdate('carrier', e.target.value)}
                placeholder="Telkomsel, Indosat, dll"
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
