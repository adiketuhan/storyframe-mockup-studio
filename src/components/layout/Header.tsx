import React, { useState, useRef } from 'react';
import { useStory } from '../../context/StoryContext';
import type { PlatformType } from '../../types/story';
import { Moon, Sun, Layers, FileCode, Save, FolderOpen, CheckCircle2, ChevronDown, PlusCircle } from 'lucide-react';
import { TwitterIcon, InstagramIcon, WhatsAppIcon } from '../common/BrandIcons';
import { ScriptParserModal } from '../parser/ScriptParserModal';
import { NewProjectModal } from '../modals/NewProjectModal';

export const Header: React.FC = () => {
  const {
    projectTitle,
    setProjectTitle,
    activeSlide,
    updateActiveSlide,
    slides,
    currentSlideIndex,
    lastSavedTime,
    exportProjectAsJson,
    importProjectFromJson,
  } = useStory();

  const [showNewProjectModal, setShowNewProjectModal] = useState<boolean>(false);
  const [showScriptModal, setShowScriptModal] = useState<boolean>(false);
  const [showProjectMenu, setShowProjectMenu] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePlatformChange = (platform: PlatformType) => {
    updateActiveSlide({ platform });
  };

  const handleToggleTheme = () => {
    updateActiveSlide(slide => ({
      ...slide,
      themeMode: slide.themeMode === 'dark' ? 'light' : 'dark',
    }));
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await importProjectFromJson(e.target.files[0]);
      setShowProjectMenu(false);
    }
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

                  {/* Auto-Save live indicator */}
                  <span
                    className="hidden sm:inline-flex items-center space-x-1 text-[10.5px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full"
                    title={`Auto-save aktif. Terakhir disimpan: ${lastSavedTime}`}
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Tersimpan {lastSavedTime}</span>
                  </span>
                </div>

                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="text-xs text-slate-400 bg-transparent hover:text-slate-200 focus:text-slate-100 focus:outline-none truncate max-w-[180px] sm:max-w-xs font-medium"
                  placeholder="Judul Proyek Cerita..."
                />
              </div>
            </div>

            {/* Mobile Actions: New Project, Script Generator & Theme */}
            <div className="flex items-center space-x-1.5 md:hidden">
              <button
                type="button"
                onClick={() => setShowNewProjectModal(true)}
                className="py-1 px-2 rounded-lg bg-indigo-600/30 border border-indigo-500/50 text-indigo-300 text-xs font-bold flex items-center space-x-1"
                title="Mulai Proyek Baru / Reset"
              >
                <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />
                <span>Baru</span>
              </button>

              <button
                type="button"
                onClick={() => setShowScriptModal(true)}
                className="py-1 px-2 rounded-lg bg-purple-600/30 border border-purple-500/50 text-purple-300 text-xs font-bold flex items-center space-x-1"
                title="Tulis Naskah Teks (Regex Parser)"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Naskah</span>
              </button>

              <button
                type="button"
                onClick={exportProjectAsJson}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                title="Simpan File Cadangan (.json)"
              >
                <Save className="w-4 h-4 text-emerald-400" />
              </button>

              <span className="text-xs text-slate-400 font-medium px-2 py-1 bg-slate-800 rounded-lg">
                {currentSlideIndex + 1}/{slides.length}
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

          {/* Right Controls: New Project, Script Studio, Project Backup & Theme */}
          <div className="hidden md:flex items-center space-x-2">
            {/* New Project / Reset Button */}
            <button
              type="button"
              onClick={() => setShowNewProjectModal(true)}
              className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 transition-all active:scale-95"
              title="Mulai proyek cerita baru atau reset kanvas"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Proyek Baru</span>
            </button>

            {/* Script-to-Story Studio button */}
            <button
              type="button"
              onClick={() => setShowScriptModal(true)}
              className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-all active:scale-95"
              title="Tulis naskah teks cerita dan buat slide secara instan dengan regex"
            >
              <FileCode className="w-4 h-4 text-purple-400" />
              <span>Tulis Naskah</span>
            </button>

            {/* Project Backup & Restore Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProjectMenu(!showProjectMenu)}
                className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 transition-colors"
              >
                <Save className="w-3.5 h-3.5 text-emerald-400" />
                <span>Simpan/Buka</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showProjectMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
                  <div className="px-2.5 py-1.5 border-b border-slate-800">
                    <p className="text-[11px] font-semibold text-slate-300">Cadangan Proyek Cerita</p>
                    <p className="text-[10px] text-slate-500">Mencegah data hilang saat ganti browser/refresh</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      exportProjectAsJson();
                      setShowProjectMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 flex items-center space-x-2 transition-colors"
                  >
                    <Save className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-medium">Download Backup (.json)</div>
                      <div className="text-[10px] text-slate-400">Simpan salinan proyek ke file</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full text-left px-2.5 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 flex items-center space-x-2 transition-colors"
                  >
                    <FolderOpen className="w-4 h-4 text-indigo-400 shrink-0" />
                    <div>
                      <div className="font-medium">Buka File Proyek (.json)</div>
                      <div className="text-[10px] text-slate-400">Muat kembali proyek tersimpan</div>
                    </div>
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileImport}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleToggleTheme}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Ubah Tema Dark / Light"
            >
              {activeSlide.themeMode === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-300" />}
            </button>
          </div>
        </div>
      </header>

      {/* New Project / Reset Modal */}
      <NewProjectModal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        onOpenScriptModal={() => setShowScriptModal(true)}
      />

      {/* Script Parser Modal */}
      <ScriptParserModal
        isOpen={showScriptModal}
        onClose={() => setShowScriptModal(false)}
      />
    </>
  );
};
