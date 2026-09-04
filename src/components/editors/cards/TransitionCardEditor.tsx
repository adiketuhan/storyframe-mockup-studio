import React from 'react';
import { useStory } from '../../../context/StoryContext';
import { Hourglass, Palette } from 'lucide-react';
import type { TransitionCardData } from '../../../types/story';

export const TransitionCardEditor: React.FC = () => {
  const { activeSlide, updateActiveSlide } = useStory();
  const data: TransitionCardData = activeSlide.transitionCard || {
    timeSkipTitle: '3 HARI KEMUDIAN...',
    timeBadge: 'Pukul 08:30 WIB',
    narrationText: 'Menjelang hari pelaksanaan, sebuah chat tak terduga masuk dari nomor baru...',
    themeStyle: 'dark_suspense',
  };

  const handleUpdate = (field: keyof TransitionCardData, value: any) => {
    updateActiveSlide(slide => ({
      ...slide,
      transitionCard: {
        ...(slide.transitionCard || data),
        [field]: value,
      },
    }));
  };

  return (
    <div className="space-y-4">
      {/* Time Skip Title & Details */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <h3 className="font-bold text-xs text-slate-300 flex items-center space-x-1.5">
          <Hourglass className="w-3.5 h-3.5 text-indigo-400" />
          <span>Judul Jeda Waktu / Transisi</span>
        </h3>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Judul Lompatan Waktu (Time Skip)</label>
          <input
            type="text"
            value={data.timeSkipTitle}
            onChange={(e) => handleUpdate('timeSkipTitle', e.target.value)}
            placeholder="3 HARI KEMUDIAN... / KEESOKAN HARINYA"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm font-bold text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Keterangan Jam / Waktu (Badge)</label>
          <input
            type="text"
            value={data.timeBadge}
            onChange={(e) => handleUpdate('timeBadge', e.target.value)}
            placeholder="Pukul 08:30 WIB / Malam Hari"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Narasi Jembatan Cerita / Konteks</label>
          <textarea
            rows={3}
            value={data.narrationText}
            onChange={(e) => handleUpdate('narrationText', e.target.value)}
            placeholder="Tuliskan kalimat narasi penghubung sebelum masuk ke chat berikutnya..."
            className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Theme Style */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <h3 className="font-bold text-xs text-slate-300 flex items-center space-x-1.5">
          <Palette className="w-3.5 h-3.5 text-purple-400" />
          <span>Suasana Visual Jeda Scene</span>
        </h3>

        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'dark_suspense', name: 'Suspense Gelap' },
            { id: 'crimson_danger', name: 'Bahaya Merah' },
            { id: 'slate_minimal', name: 'Minimalis Abu' },
          ].map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => handleUpdate('themeStyle', theme.id)}
              className={`py-2 px-2 rounded-xl text-xs font-semibold text-center transition-all ${
                data.themeStyle === theme.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {theme.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
