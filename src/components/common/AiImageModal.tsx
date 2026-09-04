import React, { useState } from 'react';
import { Sparkles, X, Wand2, RefreshCw, Check, Image as ImageIcon, Camera, Film, AlertCircle } from 'lucide-react';
import { REALISTIC_DRAMA_PRESETS, generateRealisticAiImageBase64, getAiImageDirectUrl } from '../../utils/imageUtils';
import type { DramaAiPreset } from '../../utils/imageUtils';

interface AiImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (base64OrUrl: string) => void;
  title?: string;
  defaultPrompt?: string;
}

export const AiImageModal: React.FC<AiImageModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  title = 'AI Generator Gambar Realistis',
  defaultPrompt = '',
}) => {
  const [prompt, setPrompt] = useState(defaultPrompt || 'Truk pickup muat sound system horeg di jalanan desa malam hari');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const handleGenerate = async (customPrompt?: string) => {
    const targetPrompt = customPrompt || prompt;
    if (!targetPrompt.trim()) return;

    setIsGenerating(true);
    setErrorMsg(null);

    try {
      // First set direct preview URL for instant visual feedback
      const directUrl = getAiImageDirectUrl(targetPrompt);
      setPreviewUrl(directUrl);

      // Fetch base64 in background for permanent offline/export safety
      const base64 = await generateRealisticAiImageBase64(targetPrompt);
      setPreviewUrl(base64);
    } catch (err: any) {
      console.error('Error generating image:', err);
      setErrorMsg('Gagal memuat gambar. Silakan coba lagi dengan kata kunci lain.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyPreset = (preset: DramaAiPreset) => {
    setPrompt(preset.indonesianPrompt);
    handleGenerate(preset.indonesianPrompt);
  };

  const handleConfirmUse = () => {
    if (previewUrl) {
      onSelectImage(previewUrl);
      onClose();
    }
  };

  const filteredPresets = selectedCategory === 'all'
    ? REALISTIC_DRAMA_PRESETS
    : REALISTIC_DRAMA_PRESETS.filter(p => p.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Wand2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-1.5">
                <span>{title}</span>
                <span className="text-[10px] bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold px-1.5 py-0.5 rounded-full">
                  Flux Realism
                </span>
              </h3>
              <p className="text-xs text-slate-400">Generate foto nyata & realistis seperti jepretan kamera HP asli</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* Prompt Input Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Deskripsikan Foto yang Ingin Dibuat (Bahasa Indonesia / Bebas):</span>
              <span className="text-[11px] text-indigo-400">Otomatis dioptimalkan ke gaya foto nyata</span>
            </label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={2}
                placeholder="Misal: Truk pickup muat sound system di jalan desa, foto cctv rumah malam hari, struk atm di meja..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 resize-none pr-28 placeholder-slate-500"
              />
              <button
                type="button"
                disabled={isGenerating || !prompt.trim()}
                onClick={() => handleGenerate()}
                className="absolute right-2.5 bottom-3 px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-indigo-600/30 transition-all"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Buat Foto</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Category & Presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1">
                <Film className="w-3.5 h-3.5 text-purple-400" />
                <span>Pilih Template Adegan Drama Siap Pakai:</span>
              </span>
              
              {/* Category Filter Pills */}
              <div className="flex space-x-1 text-[11px]">
                {[
                  { id: 'all', label: 'Semua' },
                  { id: 'sound_horeg', label: 'Sound Horeg' },
                  { id: 'cctv', label: 'CCTV' },
                  { id: 'bukti', label: 'Bukti/Struk' },
                  { id: 'misteri', label: 'Misteri' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
              {filteredPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="text-left p-2 rounded-xl bg-slate-950/70 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-600/50 transition-all flex items-start space-x-2 group"
                >
                  <div className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-indigo-600 text-slate-300 group-hover:text-white transition-all">
                    <Camera className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-200 group-hover:text-indigo-200 truncate">
                      {preset.title}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">
                      {preset.indonesianPrompt}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Generated Result Preview Card */}
          <div className="border border-slate-800 rounded-xl bg-slate-950 p-3 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center space-x-1.5">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>Hasil Preview Gambar:</span>
              </span>
              {previewUrl && (
                <span className="text-[11px] text-emerald-400 font-medium flex items-center space-x-1">
                  <Check className="w-3 h-3" />
                  <span>Siap Dipasang</span>
                </span>
              )}
            </div>

            {previewUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-black aspect-[4/3] flex items-center justify-center group">
                <img
                  src={previewUrl}
                  alt="Hasil AI"
                  className="w-full h-full object-cover"
                />
                {isGenerating && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white space-y-2">
                    <RefreshCw className="w-8 h-8 animate-spin text-indigo-400" />
                    <span className="text-xs font-medium">Sedang men-generate foto ultra-realistis...</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-800 rounded-xl aspect-[4/3] flex flex-col items-center justify-center text-slate-500 space-y-2 p-6 text-center">
                <Camera className="w-10 h-10 text-slate-600" />
                <div className="text-xs font-medium text-slate-400">Belum ada gambar yang di-generate</div>
                <div className="text-[11px] text-slate-600 max-w-sm">
                  Ketik deskripsi di atas atau klik salah satu template di atas untuk membuat foto realistis dengan AI
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-2.5 bg-red-950/50 border border-red-800/50 rounded-lg text-xs text-red-300 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800 bg-slate-950/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-all"
          >
            Batal
          </button>
          
          <div className="flex items-center space-x-2">
            {previewUrl && (
              <button
                type="button"
                onClick={() => handleGenerate()}
                disabled={isGenerating}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>Generate Ulang</span>
              </button>
            )}
            
            <button
              type="button"
              disabled={!previewUrl || isGenerating}
              onClick={handleConfirmUse}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-emerald-600/30 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Gunakan Gambar Ini</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
