import React from 'react';
import { useStory } from '../../context/StoryContext';
import { PlusCircle, FileCode, Sparkles, FileText, X, Volume2, Ghost, Smile, ArrowRight } from 'lucide-react';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenScriptModal: () => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onOpenScriptModal,
}) => {
  const { startBlankProject, loadPresetStory } = useStory();

  if (!isOpen) return null;

  const handleBlank = () => {
    if (window.confirm('Mulai proyek baru dengan kanvas kosong (1 slide)?')) {
      startBlankProject();
      onClose();
    }
  };

  const handlePreset = (preset: 'sound_horeg' | 'misteri_villa' | 'chat_lucu') => {
    loadPresetStory(preset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <span>Mulai Proyek Cerita Baru / Reset</span>
              </h2>
              <p className="text-xs text-slate-400">
                Pilih cara paling nyaman untuk memulai produksi storyboard Anda
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Option 1: Start from Script (Most Recommended for Creators) */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenScriptModal();
            }}
            className="w-full text-left p-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-purple-950/60 to-slate-900 border border-indigo-500/40 hover:border-indigo-400 shadow-lg shadow-indigo-950/40 transition-all hover:scale-[1.01] active:scale-95 group flex items-center justify-between"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <FileCode className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-0.5">
                  <h3 className="font-bold text-sm text-slate-100 group-hover:text-indigo-300 transition-colors">
                    Tulis / Paste Naskah Cerita (Paling Cepat)
                  </h3>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Rekomendasi
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tulis naskah dialog santai, sistem langsung otomatis membuatkan seluruh slide WhatsApp, Twitter, dan Threads secara instan.
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-indigo-400 shrink-0 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Option 2: Blank Canvas */}
          <button
            type="button"
            onClick={handleBlank}
            className="w-full text-left p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all hover:scale-[1.01] active:scale-95 group flex items-center justify-between"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:bg-slate-700 group-hover:text-white transition-colors">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-200 group-hover:text-slate-100 transition-colors mb-0.5">
                  Mulai dari Kanvas Bersih (Kosong)
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Mulai dari 1 slide kosong tanpa teks cerita lama, lalu tambahkan dialog satu per satu sesuai keinginan.
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-500 shrink-0 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Section: Preset Stories */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Atau Gunakan Template Cerita Siap Pakai:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Preset 1: Sound Horeg */}
              <button
                type="button"
                onClick={() => handlePreset('sound_horeg')}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 hover:bg-amber-950/20 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2">
                  <Volume2 className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-200 group-hover:text-amber-300 mb-1">
                  Rental Sound Horeg
                </h4>
                <p className="text-[10.5px] text-slate-400 leading-tight">
                  8 Slide lengkap (Mas Jagad & Tukang Soun, WA, Tweet & Thread).
                </p>
              </button>

              {/* Preset 2: Misteri Villa */}
              <button
                type="button"
                onClick={() => handlePreset('misteri_villa')}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 hover:bg-purple-950/20 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2">
                  <Ghost className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-200 group-hover:text-purple-300 mb-1">
                  Misteri Villa Horor
                </h4>
                <p className="text-[10.5px] text-slate-400 leading-tight">
                  3 Slide thriller (Pesan Misterius, Bukti CCTV & IG Feed).
                </p>
              </button>

              {/* Preset 3: Chat Lucu & Blokir */}
              <button
                type="button"
                onClick={() => handlePreset('chat_lucu')}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-rose-500/50 hover:bg-rose-950/20 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-2">
                  <Smile className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-200 group-hover:text-rose-300 mb-1">
                  Chat Lucu & Blokir
                </h4>
                <p className="text-[10.5px] text-slate-400 leading-tight">
                  4 Slide komedi penolakan mantan & punchline banner blokir.
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
