import React, { useState } from 'react';
import { useStory } from '../../context/StoryContext';
import type { PlatformType } from '../../types/story';
import { Moon, Sun, RotateCcw, Layers, FileCode } from 'lucide-react';
import { TwitterIcon, InstagramIcon, WhatsAppIcon } from '../common/BrandIcons';
import { ScriptParserModal } from '../parser/ScriptParserModal';

export const Header: React.FC = () => {
  const { projectTitle, setProjectTitle, activeSlide, updateActiveSlide, resetProject, slides, currentSlideIndex } = useStory();
  const [showScriptModal, setShowScriptModal] = useState<boolean>(false);

  const handlePlatformChange = (platform: PlatformType) => {
    updateActiveSlide({ platform });
  };

  const handleToggleTheme = () => {
    updateActiveSlide(slide => ({
      ...slide,
      themeMode: slide.themeMode === 'dark' ? 'light' : 'dark',
    }));
  };

  return (
    <>
      <header className="w-full bg-slate-900/95 border-b border-slate-800 backdrop-blur-md sticky top-0 z-50 px-3 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          {/* Brand & Project Name */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="font-extrabold text-sm sm:text-base text-slate-100 tracking-tight flex items-center space-x-1.5">
                    <span>StoryFrame</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Studio 3:4
                    </span>
                  </h1>
                </div>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="text-xs text-slate-400 bg-transparent hover:text-slate-200 focus:text-slate-100 focus:outline-none truncate max-w-[180px] sm:max-w-xs"
                  placeholder="Judul Proyek Cerita..."
                />
              </div>
            </div>

            {/* Mobile Actions: Script Generator, Slide Indicator & Theme */}
            <div className="flex items-center space-x-1.5 md:hidden">
              <button
                type="button"
                onClick={() => setShowScriptModal(true)}
                className="py-1 px-2 rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold flex items-center space-x-1"
                title="Tulis Naskah Teks (Regex Parser)"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Naskah</span>
              </button>

              <span className="text-xs text-slate-400 font-medium px-2 py-1 bg-slate-800 rounded-lg">
                Slide {currentSlideIndex + 1}/{slides.length}
              </span>

              <button
                type="button"
                onClick={handleToggleTheme}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                title="Toggle Dark/Light Mode"
              >
                {activeSlide.themeMode === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-300" />}
              </button>
            </div>
          </div>

          {/* Center: Platform Picker for Active Slide */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline mr-1">Format:</span>
            
            {/* WhatsApp */}
            <button
              type="button"
              onClick={() => handlePlatformChange('whatsapp')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shrink-0 ${
                activeSlide.platform === 'whatsapp'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            {/* Instagram Feed Post */}
            <button
              type="button"
              onClick={() => handlePlatformChange('instagram-feed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shrink-0 ${
                activeSlide.platform === 'instagram-feed'
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>Postingan IG Feed</span>
            </button>

            {/* Instagram DM */}
            <button
              type="button"
              onClick={() => handlePlatformChange('instagram-dm')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shrink-0 ${
                activeSlide.platform === 'instagram-dm'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>DM Instagram</span>
            </button>

            {/* X (Twitter) */}
            <button
              type="button"
              onClick={() => handlePlatformChange('twitter')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shrink-0 ${
                activeSlide.platform === 'twitter'
                  ? 'bg-black border border-neutral-700 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <TwitterIcon className="w-3.5 h-3.5" />
              <span>X (Twitter)</span>
            </button>

            {/* Threads */}
            <button
              type="button"
              onClick={() => handlePlatformChange('threads')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shrink-0 ${
                activeSlide.platform === 'threads'
                  ? 'bg-[#181818] border border-neutral-700 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="font-bold">@</span>
              <span>Threads</span>
            </button>
          </div>

          {/* Right Controls: Regex Script Studio Button, Theme & Reset */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Script-to-Story Studio button */}
            <button
              type="button"
              onClick={() => setShowScriptModal(true)}
              className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 transition-all active:scale-95"
              title="Tulis naskah teks cerita dan buat slide secara instan dengan regex"
            >
              <FileCode className="w-4 h-4" />
              <span>Tulis Naskah (Regex)</span>
            </button>

            <button
              type="button"
              onClick={handleToggleTheme}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Ubah Tema Dark / Light"
            >
              {activeSlide.themeMode === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-300" />}
            </button>

            <button
              type="button"
              onClick={resetProject}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-300 transition-colors"
              title="Reset ke Cerita Awal"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Script Parser Modal */}
      <ScriptParserModal
        isOpen={showScriptModal}
        onClose={() => setShowScriptModal(false)}
      />
    </>
  );
};
