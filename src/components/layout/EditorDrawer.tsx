import React, { useState } from 'react';
import { useStory } from '../../context/StoryContext';
import { Edit3, Film, Download, Users, Moon, Sun } from 'lucide-react';
import { WAEditor } from '../editors/whatsapp/WAEditor';
import { WhatsAppStatusEditor } from '../editors/whatsapp/WhatsAppStatusEditor';
import { TitleCardEditor } from '../editors/cards/TitleCardEditor';
import { TransitionCardEditor } from '../editors/cards/TransitionCardEditor';
import { InstagramDMEditor } from '../editors/instagram-dm/InstagramDMEditor';
import { TwitterEditor } from '../editors/twitter/TwitterEditor';
import { InstagramFeedEditor } from '../editors/instagram-feed/InstagramFeedEditor';
import { ThreadsEditor } from '../editors/threads/ThreadsEditor';
import { SlideTimeline } from '../timeline/SlideTimeline';
import { ExportPanel } from '../export/ExportPanel';
import { CharacterRosterHub } from '../characters/CharacterRosterHub';

type TabType = 'characters' | 'content' | 'timeline' | 'export';

export const EditorDrawer: React.FC = () => {
  const { activeSlide, updateActiveSlide, slides, currentSlideIndex, characters } = useStory();
  const [activeTab, setActiveTab] = useState<TabType>('content');

  const renderActivePlatformEditor = () => {
    switch (activeSlide.platform) {
      case 'whatsapp':
        return <WAEditor />;
      case 'whatsapp-status':
        return <WhatsAppStatusEditor />;
      case 'title-card':
        return <TitleCardEditor />;
      case 'transition-card':
        return <TransitionCardEditor />;
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
          className={`flex-1 min-w-[95px] py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-1.5 transition-all ${
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
          className={`flex-1 min-w-[95px] py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-1.5 transition-all ${
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

        {/* Tab 4: Ekspor / Download Gambar (Highlighted) */}
        <button
          type="button"
          onClick={() => setActiveTab('export')}
          className={`flex-1 min-w-[105px] py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-1.5 transition-all ${
            activeTab === 'export'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 hover:bg-emerald-900/60'
          }`}
          title="Download gambar slide sebagai PNG atau ZIP 1080x1440"
        >
          <Download className="w-4 h-4" />
          <span>Download 3:4</span>
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

        {/* Tab Content: Platform Active Editor */}
        {activeTab === 'content' && (
          <div className="animate-fade-in pb-16 space-y-4">
            {/* Theme Mode Selector (Dark vs Normal/Light) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {activeSlide.themeMode === 'dark' ? (
                  <Moon className="w-4 h-4 text-indigo-400" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-400" />
                )}
                <div>
                  <span className="text-xs font-bold text-slate-200">Tema Tampilan HP</span>
                  <p className="text-[10px] text-slate-400">Pilih tema Gelap (Dark) atau Normal (Terang)</p>
                </div>
              </div>

              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => updateActiveSlide({ themeMode: 'dark' })}
                  className={`px-3 py-1 text-xs rounded-lg font-bold flex items-center space-x-1.5 transition-all ${
                    activeSlide.themeMode === 'dark'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Gelap</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateActiveSlide({ themeMode: 'light' })}
                  className={`px-3 py-1 text-xs rounded-lg font-bold flex items-center space-x-1.5 transition-all ${
                    activeSlide.themeMode === 'light'
                      ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Normal</span>
                </button>
              </div>
            </div>

            {renderActivePlatformEditor()}
          </div>
        )}

        {/* Tab Content: Slide Timeline Alur Cerita */}
        {activeTab === 'timeline' && (
          <div className="animate-fade-in pb-16">
            <SlideTimeline />
          </div>
        )}

        {/* Tab Content: Export 3:4 High-DPI Panel */}
        {activeTab === 'export' && (
          <div className="animate-fade-in pb-16">
            <ExportPanel />
          </div>
        )}
      </div>
    </div>
  );
};
