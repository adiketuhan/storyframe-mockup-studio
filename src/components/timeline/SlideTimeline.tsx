import React, { useState } from 'react';
import { useStory } from '../../context/StoryContext';
import type { PlatformType } from '../../types/story';
import { Plus, Copy, Trash2, ChevronLeft, ChevronRight, MessageSquare, ChevronDown, FileCode } from 'lucide-react';
import { TwitterIcon, InstagramIcon, WhatsAppIcon } from '../common/BrandIcons';
import { ScriptParserModal } from '../parser/ScriptParserModal';

export const SlideTimeline: React.FC = () => {
  const {
    slides,
    activeSlideId,
    setActiveSlideId,
    addSlide,
    duplicateSlide,
    deleteSlide,
    reorderSlides,
    updateSlideById,
  } = useStory();

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showScriptModal, setShowScriptModal] = useState(false);

  const getPlatformIcon = (platform: PlatformType) => {
    switch (platform) {
      case 'whatsapp':
        return <div className="p-1 rounded-md bg-[#25D366] text-white"><WhatsAppIcon className="w-3.5 h-3.5" /></div>;
      case 'instagram-dm':
        return <div className="p-1 rounded-md bg-gradient-to-tr from-purple-600 to-indigo-600 text-white"><MessageSquare className="w-3.5 h-3.5" /></div>;
      case 'twitter':
        return <div className="p-1 rounded-md bg-black border border-neutral-700 text-white"><TwitterIcon className="w-3 h-3" /></div>;
      case 'instagram-feed':
        return <div className="p-1 rounded-md bg-gradient-to-tr from-yellow-500 via-rose-500 to-purple-600 text-white"><InstagramIcon className="w-3.5 h-3.5" /></div>;
      case 'threads':
        return <div className="p-1 rounded-md bg-[#101010] border border-neutral-700 text-white text-xs font-bold px-1.5">@</div>;
    }
  };

  const handleAddPlatformSlide = (platform: PlatformType) => {
    addSlide(platform);
    setShowAddMenu(false);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Top Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
          <div>
            <h3 className="font-bold text-sm text-slate-200">Alur Cerita Bergambar ({slides.length} Slide)</h3>
            <p className="text-xs text-slate-400">Kelola urutan, duplikasi, dan format adegan cerita</p>
          </div>

          {/* Master Action Buttons */}
          <div className="flex items-center space-x-2 relative">
            {/* Script Regex Generator */}
            <button
              type="button"
              onClick={() => setShowScriptModal(true)}
              className="py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-indigo-300 rounded-xl text-xs font-semibold flex items-center space-x-1.5"
              title="Tulis teks naskah dan generate otomatis dengan regex"
            >
              <FileCode className="w-4 h-4" />
              <span>Impor Naskah</span>
            </button>

            {/* Key Feature: DUPLICATE SLIDE */}
            <button
              type="button"
              onClick={() => duplicateSlide()}
              className="py-2 px-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
              title="Duplikasi konfigurasi slide aktif agar alur chat/feed dapat dilanjutkan tanpa setting ulang"
            >
              <Copy className="w-4 h-4" />
              <span>Duplikasi</span>
            </button>

            {/* Add Slide with Template Picker Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ Slide</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {showAddMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 z-30 animate-fade-in">
                  <button
                    type="button"
                    onClick={() => handleAddPlatformSlide('whatsapp')}
                    className="w-full px-3 py-2 text-left text-xs text-slate-200 hover:bg-slate-800 flex items-center space-x-2"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <span>+ WhatsApp Chat</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddPlatformSlide('instagram-feed')}
                    className="w-full px-3 py-2 text-left text-xs text-rose-300 font-semibold hover:bg-slate-800 flex items-center space-x-2"
                  >
                    <InstagramIcon className="w-3.5 h-3.5" />
                    <span>+ Postingan IG Feed</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddPlatformSlide('instagram-dm')}
                    className="w-full px-3 py-2 text-left text-xs text-slate-200 hover:bg-slate-800 flex items-center space-x-2"
                  >
                    <InstagramIcon className="w-3.5 h-3.5 text-purple-400" />
                    <span>+ DM Instagram</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddPlatformSlide('twitter')}
                    className="w-full px-3 py-2 text-left text-xs text-slate-200 hover:bg-slate-800 flex items-center space-x-2"
                  >
                    <TwitterIcon className="w-3 h-3 text-sky-400" />
                    <span>+ Post X (Twitter)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddPlatformSlide('threads')}
                    className="w-full px-3 py-2 text-left text-xs text-slate-200 hover:bg-slate-800 flex items-center space-x-2"
                  >
                    <span className="font-bold text-xs">@</span>
                    <span>+ Utas Threads</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Slide Thumbnails List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {slides.map((slide, index) => {
            const isActive = slide.id === activeSlideId;

            return (
              <div
                key={slide.id}
                onClick={() => setActiveSlideId(slide.id)}
                className={`relative rounded-2xl p-3.5 border transition-all cursor-pointer select-none ${
                  isActive
                    ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xl'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center space-x-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isActive ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {index + 1}
                    </span>
                    <div className="flex items-center space-x-1.5">
                      {getPlatformIcon(slide.platform)}
                      {/* Direct Platform Selector inside Card */}
                      <select
                        value={slide.platform}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updateSlideById(slide.id, { platform: e.target.value as PlatformType })}
                        className="bg-slate-950/80 border border-slate-700/80 rounded-lg px-2 py-0.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="whatsapp">WhatsApp</option>
                        <option value="instagram-feed">Postingan IG Feed</option>
                        <option value="instagram-dm">DM Instagram</option>
                        <option value="twitter">X (Twitter)</option>
                        <option value="threads">Threads</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 text-slate-500 text-xs">
                    <span>{slide.statusBar.time}</span>
                    {slide.notification.enabled && (
                      <span className="w-2 h-2 rounded-full bg-amber-400" title="Notifikasi Popup Aktif" />
                    )}
                  </div>
                </div>

                {/* Title Input */}
                <input
                  type="text"
                  value={slide.title}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => updateSlideById(slide.id, { title: e.target.value })}
                  className="w-full px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500 mb-2.5"
                  placeholder="Judul Slide / Adegan"
                />

                {/* Card Bottom Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  {/* Reorder Left/Right */}
                  <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => reorderSlides(index, index - 1)}
                      className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-30 rounded hover:bg-slate-800"
                      title="Pindahkan ke kiri / atas"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={index === slides.length - 1}
                      onClick={() => reorderSlides(index, index + 1)}
                      className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-30 rounded hover:bg-slate-800"
                      title="Pindahkan ke kanan / bawah"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Duplicate & Delete Actions */}
                  <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => duplicateSlide(slide.id)}
                      className="p-1.5 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/60 rounded-lg"
                      title="Duplikasi slide ini"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteSlide(slide.id)}
                      className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/60 rounded-lg"
                      title="Hapus slide"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Script Parser Modal */}
      <ScriptParserModal
        isOpen={showScriptModal}
        onClose={() => setShowScriptModal(false)}
      />
    </>
  );
};
