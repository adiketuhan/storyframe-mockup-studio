import React, { useState, useRef } from 'react';
import { StoryProvider, useStory } from './context/StoryContext';
import { Header } from './components/layout/Header';
import { CanvasStage } from './components/layout/CanvasStage';
import { EditorDrawer } from './components/layout/EditorDrawer';
import { ChevronLeft, ChevronRight, Copy, Plus, ZoomIn, ZoomOut, Sparkles } from 'lucide-react';
import type { PlatformType } from './types/story';

const StudioMain: React.FC = () => {
  const { slides, setActiveSlideId, currentSlideIndex, duplicateSlide, addSlide, activeSlide } = useStory();
  const [zoomScale, setZoomScale] = useState<number>(1);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setActiveSlideId(slides[currentSlideIndex - 1].id);
    }
  };

  const handleNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setActiveSlideId(slides[currentSlideIndex + 1].id);
    }
  };

  const getPlatformBadge = (platform: PlatformType) => {
    switch (platform) {
      case 'whatsapp': return <span className="text-emerald-400">WhatsApp</span>;
      case 'instagram-dm': return <span className="text-indigo-400">Instagram DM</span>;
      case 'twitter': return <span className="text-sky-400">X (Twitter)</span>;
      case 'instagram-feed': return <span className="text-rose-400">Instagram Feed</span>;
      case 'threads': return <span className="text-slate-300">Threads</span>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500">
      {/* Top Main Navigation Header */}
      <Header />

      {/* Main Studio Workspace */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left / Top Section: 3:4 Responsive Preview Canvas Stage */}
        <div className="flex-1 flex flex-col bg-slate-950 border-b lg:border-b-0 lg:border-r border-slate-800/80 min-h-[520px] lg:min-h-0 relative">
          {/* Canvas Sub-Header Controls */}
          <div className="px-3 sm:px-4 py-2 border-b border-slate-800/60 bg-slate-900/40 flex items-center justify-between text-xs text-slate-400 select-none shrink-0">
            {/* Slide Quick Switcher */}
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                disabled={currentSlideIndex === 0}
                onClick={handlePrevSlide}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                title="Slide Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="font-semibold text-slate-200 px-1">
                Slide {currentSlideIndex + 1} / {slides.length}
              </span>

              <button
                type="button"
                disabled={currentSlideIndex === slides.length - 1}
                onClick={handleNextSlide}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                title="Slide Berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="hidden sm:flex items-center space-x-1 pl-2 text-[11px] text-slate-400">
                <span>(3:4 • {getPlatformBadge(activeSlide.platform)})</span>
              </div>
            </div>

            {/* Quick Actions & Zoom */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => duplicateSlide()}
                className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/40 text-indigo-300 rounded-lg text-[11px] font-bold flex items-center space-x-1 transition-all active:scale-95"
                title="Duplikasi Slide Aktif"
              >
                <Copy className="w-3 h-3" />
                <span>Duplikat</span>
              </button>

              <button
                type="button"
                onClick={() => addSlide('whatsapp')}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-medium flex items-center space-x-1"
                title="Tambah Slide Baru"
              >
                <Plus className="w-3 h-3" />
                <span className="hidden sm:inline">Slide Baru</span>
              </button>

              <div className="hidden sm:flex items-center space-x-1 border-l border-slate-800 pl-2">
                <button
                  type="button"
                  onClick={() => setZoomScale(s => Math.max(0.7, +(s - 0.1).toFixed(1)))}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] w-8 text-center text-slate-400 font-mono">
                  {Math.round(zoomScale * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomScale(s => Math.min(1.3, +(s + 0.1).toFixed(1)))}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Center Stage Container */}
          <div className="flex-1 overflow-y-auto flex items-center justify-center p-2 sm:p-4 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
            <CanvasStage ref={canvasRef} scale={zoomScale} />
          </div>

          {/* Bottom Interactive Tips */}
          <div className="p-2 bg-slate-900/60 border-t border-slate-800/60 flex items-center justify-center space-x-1.5 text-[11px] text-slate-400 text-center select-none">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>
              Tip Storytelling: Ketuk langsung teks di layar HP di atas untuk <strong>edit langsung (inline-editing)</strong>!
            </span>
          </div>
        </div>

        {/* Right / Bottom Section: Editor & Controls Drawer */}
        <div className="w-full lg:w-[480px] xl:w-[540px] flex-shrink-0 flex flex-col h-auto lg:h-[calc(100vh-57px)]">
          <EditorDrawer />
        </div>
      </main>

      {/* Floating Mobile Bottom Slide Navigation Bar */}
      <div className="lg:hidden sticky bottom-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-3 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            disabled={currentSlideIndex === 0}
            onClick={handlePrevSlide}
            className="p-2 bg-slate-800 disabled:opacity-30 rounded-xl text-slate-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-200">
            Slide {currentSlideIndex + 1}/{slides.length}
          </span>
          <button
            type="button"
            disabled={currentSlideIndex === slides.length - 1}
            onClick={handleNextSlide}
            className="p-2 bg-slate-800 disabled:opacity-30 rounded-xl text-slate-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => duplicateSlide()}
            className="py-1.5 px-3 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1 shadow-md shadow-indigo-600/30"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Duplikat</span>
          </button>
          <button
            type="button"
            onClick={() => addSlide('whatsapp')}
            className="py-1.5 px-3 bg-slate-800 text-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Slide</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <StoryProvider>
      <StudioMain />
    </StoryProvider>
  );
};

export default App;
