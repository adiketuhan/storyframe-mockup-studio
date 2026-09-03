import React from 'react';
import { useStory } from '../../context/StoryContext';
import { Hash, CheckCircle2 } from 'lucide-react';

export const WatermarkEditor: React.FC = () => {
  const { watermark, updateWatermark, projectTitle, setProjectTitle, currentSlideIndex, slides } = useStory();

  const currentNum = (currentSlideIndex + 1).toString().padStart(2, '0');
  const totalNum = slides.length.toString().padStart(2, '0');

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Hash className="w-4 h-4 text-indigo-400" />
          <div>
            <h3 className="font-bold text-sm text-slate-200">Nomor Halaman & Judul Konten (Di Luar Mockup)</h3>
            <p className="text-[11px] text-slate-400">Menampilkan indikator urutan di bawah kanvas & penamaan file ekspor</p>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={watermark.show}
            onChange={(e) => updateWatermark({ show: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
      </div>

      {watermark.show && (
        <div className="space-y-3 pt-2 border-t border-slate-800/80 text-xs">
          {/* Info Banner */}
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-300 text-[11px]">
                Screenshot mockup tetap <strong>100% bersih dan otentik</strong> (tanpa watermark di dalam gambar).
              </span>
            </div>
            <span className="font-mono font-bold text-indigo-300 px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-800/60 shrink-0 ml-2">
              {currentNum} / {totalNum}
            </span>
          </div>

          {/* Title Editor */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Judul Konten / Seri Cerita</label>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="Contoh: Misteri Villa Pine Hills"
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Export Filename Preview */}
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <span className="font-semibold text-slate-300">Format Nama File Saat Di-download:</span>
            <div className="font-mono text-indigo-300 text-[10.5px]">
              slide-{currentNum}_{projectTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}.png
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
