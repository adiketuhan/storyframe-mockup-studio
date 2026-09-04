import React, { useState, useMemo } from 'react';
import { useStory } from '../../context/StoryContext';
import { SAMPLE_SCRIPT_TEMPLATE, AI_MASTER_PROMPT_10_SCENES, parseScriptToStory } from '../../utils/scriptParser';
import { FileCode, Sparkles, Check, Copy, HelpCircle, X, ArrowRight, BookOpen, Bot, Trash2 } from 'lucide-react';

interface ScriptParserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScriptParserModal: React.FC<ScriptParserModalProps> = ({ isOpen, onClose }) => {
  const { importStoryFromScript } = useStory();
  const [scriptText, setScriptText] = useState<string>(SAMPLE_SCRIPT_TEMPLATE);
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [copiedSample, setCopiedSample] = useState<boolean>(false);

  // Live parsing preview statistics
  const preview = useMemo(() => {
    try {
      return parseScriptToStory(scriptText);
    } catch {
      return null;
    }
  }, [scriptText]);

  if (!isOpen) return null;

  const handleApply = () => {
    if (!preview || preview.slides.length === 0) {
      alert('Naskah belum memiliki slide yang valid. Silakan periksa format penulisan.');
      return;
    }

    if (window.confirm(`Generate ${preview.slides.length} slide dan ${preview.characters.length} tokoh pemeran dari naskah ini? Slide lama akan diperbarui.`)) {
      importStoryFromScript(scriptText);
      onClose();
    }
  };

  const handleCopyAIPrompt = () => {
    navigator.clipboard.writeText(AI_MASTER_PROMPT_10_SCENES);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  const handleCopySample = () => {
    navigator.clipboard.writeText(SAMPLE_SCRIPT_TEMPLATE);
    setCopiedSample(true);
    setTimeout(() => setCopiedSample(false), 2000);
  };

  const handleClear = () => {
    setScriptText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <span>Script-to-Story Studio (Regex Parser)</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Universal Parser
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Tulis naskah dialog atau copy hasil dari AI (ChatGPT/Gemini/Claude), sistem akan menyusun seluruh slide seketika!
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowGuide(!showGuide)}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                showGuide ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
              title="Lihat Panduan Format"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Panduan Format</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Bar: Copy AI Prompt, Load 10-Scene Sample, Clear */}
        <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center space-x-2">
            {/* 1-Click Copy AI Prompt */}
            <button
              type="button"
              onClick={handleCopyAIPrompt}
              className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 transition-all active:scale-95"
              title="Salin instruksi prompt siap pakai untuk dimasukkan ke ChatGPT, Claude, atau Gemini"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>{copiedPrompt ? '✅ Prompt AI Tersalin!' : 'Salin Prompt untuk AI (10 Scene)'}</span>
            </button>

            <button
              type="button"
              onClick={() => setScriptText(SAMPLE_SCRIPT_TEMPLATE)}
              className="py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center space-x-1 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Muat Contoh 10 Scene</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleCopySample}
              className="text-slate-400 hover:text-slate-200 flex items-center space-x-1"
            >
              {copiedSample ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSample ? 'Tersalin!' : 'Salin Teks'}</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="text-slate-400 hover:text-rose-400 flex items-center space-x-1 ml-2"
              title="Kosongkan kotak naskah"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Kosongkan</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden p-4 sm:p-5 flex flex-col lg:flex-row gap-4">
          {/* Left: Script Text Editor */}
          <div className="flex-1 flex flex-col space-y-2 min-h-[300px]">
            <textarea
              value={scriptText}
              onChange={(e) => setScriptText(e.target.value)}
              placeholder={`Paste naskah cerita dari AI atau tulis di sini:\n\nPemeran 1 "Tukang Sound" @reneosound\nPemeran 2 "Mas Jagad" @imutnyojag4d\n\nScene 1 (wa)\nSelamat pagi mas\nmau tanya tentang sewa sound\n\npagi juga mas\nada yang bisa saya bantu?\n\nScene 2 (wa)\n...\n\nScene 3 (twitter)\n...\n\nScene 4 (thread)\n...`}
              className="w-full flex-1 p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs sm:text-sm font-mono text-slate-200 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed overflow-y-auto"
            />
          </div>

          {/* Right: Live Preview Detection Stats & Syntax Cheat Sheet */}
          <div className="w-full lg:w-80 flex flex-col space-y-3 shrink-0">
            {/* Realtime Detection Card */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3.5 space-y-2.5">
              <h3 className="font-bold text-xs text-slate-200 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Hasil Deteksi Otomatis Real-time</span>
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                  <span className="text-slate-400">Judul Cerita:</span>
                  <span className="font-semibold text-slate-200 truncate max-w-[140px]">
                    {preview?.projectTitle || '-'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                  <span className="text-slate-400">Total Slide:</span>
                  <span className="font-bold text-indigo-400 px-2 py-0.5 rounded-lg bg-indigo-950/60 border border-indigo-800/60">
                    {preview?.slides.length || 0} Slide
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                  <span className="text-slate-400">Karakter Terdaftar:</span>
                  <span className="font-bold text-emerald-400 px-2 py-0.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60">
                    {preview?.characters.length || 0} Tokoh
                  </span>
                </div>
              </div>

              {/* Detected Slides Pill List */}
              {preview && preview.slides.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] text-slate-500 font-semibold">Urutan Adegan Terdeteksi:</span>
                  <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                    {preview.slides.map((s, idx) => (
                      <div
                        key={idx}
                        className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] flex items-center justify-between"
                      >
                        <span className="font-semibold text-slate-300">
                          {idx + 1}. {s.title}
                        </span>
                        <span className="uppercase text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300">
                          {s.platform}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Syntax Cheat Sheet */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5 space-y-2 flex-1 text-xs overflow-y-auto max-h-52">
              <div className="flex items-center space-x-1.5 text-slate-300 font-bold text-xs">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span>Format Kata Kunci Naskah:</span>
              </div>
              <ul className="space-y-1 text-[11px] text-slate-400 leading-snug">
                <li><code className="text-indigo-300 bg-slate-900 px-1 rounded">Pemeran 1 "Nama" @handle</code></li>
                <li><code className="text-indigo-300 bg-slate-900 px-1 rounded">Scene 1 (wa)</code></li>
                <li><code className="text-indigo-300 bg-slate-900 px-1 rounded">Scene 3 (twitter)</code></li>
                <li><code className="text-indigo-300 bg-slate-900 px-1 rounded">Scene 4 (thread)</code></li>
                <li><code className="text-emerald-300 bg-slate-900 px-1 rounded">Baris kosong</code> = Balik giliran bicara</li>
                <li><code className="text-amber-300 bg-slate-900 px-1 rounded">vn</code> = Balon Voice Note</li>
                <li><code className="text-red-300 bg-slate-900 px-1 rounded">(deleted)</code> = Pesan Dihapus</li>
                <li><code className="text-rose-300 bg-slate-900 px-1 rounded">[BLOKIR]: Teks</code> = Blokir kontak</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/80">
          <span className="text-xs text-slate-500 hidden sm:inline">
            Setelah digenerate, Anda tetap bisa mengedit tiap slide secara visual di studio.
          </span>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleApply}
              disabled={!preview || preview.slides.length === 0}
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Seluruh Slide ({preview?.slides.length || 0})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
