import React from 'react';
import { useStory } from '../../context/StoryContext';
import { Hash, CheckCircle2, RotateCcw, Edit3 } from 'lucide-react';

export const WatermarkEditor: React.FC = () => {
  const {
    watermark,
    updateWatermark,
    projectTitle,
    setProjectTitle,
    currentSlideIndex,
    slides,
    activeSlide,
    updateActiveSlide,
  } = useStory();

  const startOffset = watermark.startPageNumber ? watermark.startPageNumber - 1 : 0;
  const currentNum = (currentSlideIndex + 1 + startOffset).toString().padStart(2, '0');
  const totalNum = (watermark.customTotalPages || (slides.length + startOffset)).toString().padStart(2, '0');
  const defaultPageString = `Halaman ${currentNum} / ${totalNum}`;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Hash className="w-4 h-4 text-indigo-400" />
          <div>
            <h3 className="font-bold text-sm text-slate-200">Nomor Halaman & Judul Konten</h3>
            <p className="text-[11px] text-slate-400">Dapat diedit bebas jika terjadi kesalahan urutan</p>
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
                Screenshot mockup tetap <strong>100% bersih</strong> (nomor halaman berada di luar gambar).
              </span>
            </div>
            <span className="font-mono font-bold text-indigo-300 px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-800/60 shrink-0 ml-2">
              {activeSlide.customPageLabel || defaultPageString}
            </span>
          </div>

          {/* Direct Custom Page Label for this slide */}
          <div className="p-3 rounded-xl bg-slate-950 border border-indigo-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-slate-300 flex items-center space-x-1.5">
                <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Ubah Nomor Halaman Slide Ini (Kustom):</span>
              </label>
              {activeSlide.customPageLabel && (
                <button
                  type="button"
                  onClick={() => updateActiveSlide({ customPageLabel: undefined })}
                  className="text-[10.5px] text-amber-400 hover:text-amber-300 flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset ke Otomatis</span>
                </button>
              )}
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={activeSlide.customPageLabel || ''}
                onChange={(e) => updateActiveSlide({ customPageLabel: e.target.value || undefined })}
                placeholder={`Default: ${defaultPageString}`}
                className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <p className="text-[10.5px] text-slate-500">
              *Anda juga bisa langsung mengklik nomor halaman di bawah bingkai HP untuk mengeditnya secara instan.
            </p>
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

          {/* Advanced Page Number Offsets */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Mulai Dari Nomor (Offset)</label>
              <input
                type="number"
                min={1}
                value={watermark.startPageNumber || 1}
                onChange={(e) => updateWatermark({ startPageNumber: parseInt(e.target.value) || 1 })}
                placeholder="1"
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Total Halaman Kustom</label>
              <input
                type="number"
                min={1}
                value={watermark.customTotalPages || ''}
                onChange={(e) => updateWatermark({ customTotalPages: parseInt(e.target.value) || undefined })}
                placeholder={`Otomatis (${slides.length})`}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
