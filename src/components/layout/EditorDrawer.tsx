import React, { useState } from 'react';
import { useStory } from '../../context/StoryContext';
import { Edit3, Film, Download, LayoutTemplate, Sun, Moon, Users } from 'lucide-react';
import type { PlatformType } from '../../types/story';
import { StatusBarEditor } from '../editors/StatusBarEditor';
import { NotificationEditor } from '../editors/NotificationEditor';
import { WatermarkEditor } from '../editors/WatermarkEditor';
import { WAEditor } from '../editors/whatsapp/WAEditor';
import { InstagramDMEditor } from '../editors/instagram-dm/InstagramDMEditor';
import { TwitterEditor } from '../editors/twitter/TwitterEditor';
import { InstagramFeedEditor } from '../editors/instagram-feed/InstagramFeedEditor';
import { ThreadsEditor } from '../editors/threads/ThreadsEditor';
import { SlideTimeline } from '../timeline/SlideTimeline';
import { ExportPanel } from '../export/ExportPanel';
import { CharacterRosterHub } from '../characters/CharacterRosterHub';
import { CharacterQuickPicker } from '../characters/CharacterQuickPicker';
import { WhatsAppIcon, InstagramIcon, TwitterIcon } from '../common/BrandIcons';

type TabType = 'characters' | 'content' | 'timeline' | 'export';

export const EditorDrawer: React.FC = () => {
  const { activeSlide, updateActiveSlide, slides, currentSlideIndex, characters } = useStory();
  const [activeTab, setActiveTab] = useState<TabType>('content');

  const handlePlatformChange = (platform: PlatformType) => {
    updateActiveSlide({ platform });
  };

  const handleToggleTheme = () => {
    updateActiveSlide(slide => ({
      ...slide,
      themeMode: slide.themeMode === 'dark' ? 'light' : 'dark',
    }));
  };

  const renderActivePlatformEditor = () => {
    switch (activeSlide.platform) {
      case 'whatsapp':
        return <WAEditor />;
      case 'instagram-dm':
        return <InstagramDMEditor />;
      case 'twitter':
        return <TwitterEditor />;
      case 'instagram-feed':
        return <InstagramFeedEditor />;
      case 'threads':
        return <ThreadsEditor />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800">
      {/* Tab Navigation Header */}
      <div className="flex items-center justify-around border-b border-slate-800 bg-slate-900/60 p-2 sticky top-0 z-20 overflow-x-auto scrollbar-none gap-1">
        {/* Tab 1: Setting Peran / Karakter Cerita */}
        <button
          type="button"
          onClick={() => setActiveTab('characters')}
          className={`flex-1 min-w-[100px] py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-1.5 transition-all ${
            activeTab === 'characters'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
          title="Setting Pemeran Cerita (Rian, Sarah, Peneror, dll)"
        >
          <Users className="w-4 h-4" />
          <span>Pemeran ({characters.length})</span>
        </button>

        {/* Tab 2: Konten Slide Aktif */}
        <button
          type="button"
          onClick={() => setActiveTab('content')}
          className={`flex-1 min-w-[100px] py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-1.5 transition-all ${
            activeTab === 'content'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Konten ({currentSlideIndex + 1})</span>
        </button>

        {/* Tab 3: Timeline Alur Slide */}
        <button
          type="button"
          onClick={() => setActiveTab('timeline')}
          className={`flex-1 min-w-[90px] py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-1.5 transition-all ${
            activeTab === 'timeline'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Timeline ({slides.length})</span>
        </button>

        {/* Tab 4: Ekspor */}
        <button
          type="button"
          onClick={() => setActiveTab('export')}
          className={`flex-1 min-w-[80px] py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-1.5 transition-all ${
            activeTab === 'export'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Ekspor</span>
        </button>
      </div>

      {/* Tab Body Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4">
        {/* Tab Content: Setting Peran / Character Hub */}
        {activeTab === 'characters' && (
          <div className="animate-fade-in pb-16">
            <CharacterRosterHub />
          </div>
        )}

        {/* Tab Content: Konten Slide Aktif */}
        {activeTab === 'content' && (
          <div className="space-y-4 animate-fade-in pb-16">
            {/* Quick Character Bar on Top of Content Editor */}
            <CharacterQuickPicker
              label="Terapkan Karakter ke Slide Ini:"
              selectedCharacterId={
                activeSlide.platform === 'whatsapp'
                  ? activeSlide.whatsapp.characterId
                  : activeSlide.platform === 'instagram-feed'
                  ? activeSlide.instagramFeed.characterId
                  : activeSlide.platform === 'twitter'
                  ? activeSlide.twitter.characterId
                  : activeSlide.platform === 'instagram-dm'
                  ? activeSlide.instagramDm.characterId
                  : activeSlide.threads.characterId
              }
            />

            {/* Prominent Platform & Theme Selector for Active Slide */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <LayoutTemplate className="w-4 h-4 text-indigo-400" />
                  <h3 className="font-bold text-sm text-slate-200">Format Template Slide Ini</h3>
                </div>
                <button
                  type="button"
                  onClick={handleToggleTheme}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl text-slate-300 flex items-center space-x-1.5 transition-colors"
                >
                  {activeSlide.themeMode === 'dark' ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Dark Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-indigo-300" />
                      <span>Light Mode</span>
                    </>
                  )}
                </button>
              </div>

              {/* Grid of Platform Options */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {/* 1. WhatsApp */}
                <button
                  type="button"
                  onClick={() => handlePlatformChange('whatsapp')}
                  className={`p-2.5 rounded-xl border text-left flex flex-col space-y-1 transition-all ${
                    activeSlide.platform === 'whatsapp'
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-100 ring-2 ring-emerald-500/20 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-1.5">
                    <div className="w-5 h-5 rounded-md bg-[#25D366] text-white flex items-center justify-center">
                      <WhatsAppIcon className="w-3 h-3" />
                    </div>
                    <span className="text-xs font-bold">WhatsApp</span>
                  </div>
                  <span className="text-[10.5px] opacity-75">Chat & Voice Note</span>
                </button>

                {/* 2. Instagram Feed Post */}
                <button
                  type="button"
                  onClick={() => handlePlatformChange('instagram-feed')}
                  className={`p-2.5 rounded-xl border text-left flex flex-col space-y-1 transition-all ${
                    activeSlide.platform === 'instagram-feed'
                      ? 'bg-gradient-to-tr from-pink-950/60 to-rose-950/60 border-rose-500 text-rose-100 ring-2 ring-rose-500/20 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-1.5">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-yellow-500 via-rose-500 to-purple-600 text-white flex items-center justify-center">
                      <InstagramIcon className="w-3 h-3" />
                    </div>
                    <span className="text-xs font-bold text-rose-300">Postingan IG Feed</span>
                  </div>
                  <span className="text-[10.5px] opacity-75">Foto Feed, Likes & Caption</span>
                </button>

                {/* 3. Instagram DM */}
                <button
                  type="button"
                  onClick={() => handlePlatformChange('instagram-dm')}
                  className={`p-2.5 rounded-xl border text-left flex flex-col space-y-1 transition-all ${
                    activeSlide.platform === 'instagram-dm'
                      ? 'bg-purple-950/60 border-purple-500 text-purple-100 ring-2 ring-purple-500/20 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-1.5">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center">
                      <InstagramIcon className="w-3 h-3" />
                    </div>
                    <span className="text-xs font-bold">DM Instagram</span>
                  </div>
                  <span className="text-[10.5px] opacity-75">Direct Message Chat</span>
                </button>

                {/* 4. Twitter / X */}
                <button
                  type="button"
                  onClick={() => handlePlatformChange('twitter')}
                  className={`p-2.5 rounded-xl border text-left flex flex-col space-y-1 transition-all ${
                    activeSlide.platform === 'twitter'
                      ? 'bg-sky-950/60 border-sky-500 text-sky-100 ring-2 ring-sky-500/20 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-1.5">
                    <div className="w-5 h-5 rounded-md bg-black border border-neutral-700 text-white flex items-center justify-center">
                      <TwitterIcon className="w-2.5 h-2.5" />
                    </div>
                    <span className="text-xs font-bold">X (Twitter)</span>
                  </div>
                  <span className="text-[10.5px] opacity-75">Tweet & Repost</span>
                </button>

                {/* 5. Threads */}
                <button
                  type="button"
                  onClick={() => handlePlatformChange('threads')}
                  className={`p-2.5 rounded-xl border text-left flex flex-col space-y-1 transition-all ${
                    activeSlide.platform === 'threads'
                      ? 'bg-slate-900 border-slate-400 text-slate-100 ring-2 ring-slate-400/20 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-1.5">
                    <div className="w-5 h-5 rounded-md bg-[#181818] border border-neutral-700 text-white flex items-center justify-center font-bold text-xs">
                      @
                    </div>
                    <span className="text-xs font-bold">Threads</span>
                  </div>
                  <span className="text-[10.5px] opacity-75">Utas & Balasan</span>
                </button>
              </div>
            </div>

            {/* Nomor Halaman & Judul Konten Editor */}
            <WatermarkEditor />

            {/* Status Bar & Time incrementor */}
            <StatusBarEditor />

            {/* Suspense Push Notification Overlay Editor */}
            <NotificationEditor />

            {/* Platform Specific Form */}
            {renderActivePlatformEditor()}
          </div>
        )}

        {/* Tab Content: Timeline */}
        {activeTab === 'timeline' && (
          <div className="animate-fade-in pb-16">
            <SlideTimeline />
          </div>
        )}

        {/* Tab Content: Ekspor */}
        {activeTab === 'export' && (
          <div className="animate-fade-in pb-16">
            <ExportPanel />
          </div>
        )}
      </div>
    </div>
  );
};
