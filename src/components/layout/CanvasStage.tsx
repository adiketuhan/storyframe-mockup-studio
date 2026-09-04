import { forwardRef, useState, useEffect } from 'react';
import { useStory } from '../../context/StoryContext';
import { PhoneStatusBar } from '../mockups/common/PhoneStatusBar';
import { IncomingNotification } from '../mockups/common/IncomingNotification';
import { ExternalPageIndicator } from '../mockups/common/PageNumberWatermark';
import { WhatsAppMockup } from '../mockups/whatsapp/WhatsAppMockup';
import { InstagramDMMockup } from '../mockups/instagram-dm/InstagramDMMockup';
import { TwitterMockup } from '../mockups/twitter/TwitterMockup';
import { InstagramFeedMockup } from '../mockups/instagram-feed/InstagramFeedMockup';
import { ThreadsMockup } from '../mockups/threads/ThreadsMockup';
import { downloadSlidePng, batchExportZip, captureSlideElement } from '../../utils/exportUtils';
import { Download, FileArchive, Loader2, Plus, Mic, ShieldAlert, Sparkles, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import type { WAMessage, IGDMMessage } from '../../types/story';

interface CanvasStageProps {
  scale?: number;
}

export const CanvasStage = forwardRef<HTMLDivElement, CanvasStageProps>(({ scale = 1 }, ref) => {
  const { activeSlide, updateActiveSlide, slides, projectTitle, setActiveSlideId, currentSlideIndex } = useStory();
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportType, setExportType] = useState<'single' | 'zip' | null>(null);
  const [showTips, setShowTips] = useState<boolean>(false);

  if (!activeSlide) return null;

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

  // Keyboard Navigation: Press Left / Right arrow keys to switch slides
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevSlide();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, slides]);

  // Real-time synchronization between Status Bar Time & Chat Message Time
  const handleUpdateTime = (newTime: string) => {
    updateActiveSlide(slide => {
      let updatedWA = { ...slide.whatsapp };
      if (updatedWA.messages && updatedWA.messages.length > 0) {
        const msgs = updatedWA.messages.map((m, idx) => {
          if (idx === updatedWA.messages.length - 1) {
            return { ...m, time: newTime };
          }
          return m;
        });
        updatedWA.messages = msgs;
      }

      let updatedIGDM = { ...slide.instagramDm };
      if (updatedIGDM.messages && updatedIGDM.messages.length > 0) {
        const msgs = updatedIGDM.messages.map((m, idx) => {
          if (idx === updatedIGDM.messages.length - 1) {
            return { ...m, time: newTime };
          }
          return m;
        });
        updatedIGDM.messages = msgs;
      }

      return {
        ...slide,
        statusBar: {
          ...slide.statusBar,
          time: newTime,
        },
        whatsapp: updatedWA,
        instagramDm: updatedIGDM,
      };
    });
  };

  const handleUpdateWAHeader = (field: string, value: any) => {
    updateActiveSlide(slide => ({
      ...slide,
      whatsapp: {
        ...slide.whatsapp,
        [field]: value,
      },
    }));
  };

  const handleUpdateWAMessage = (index: number, updated: Partial<WAMessage>) => {
    updateActiveSlide(slide => {
      const msgs = [...slide.whatsapp.messages];
      msgs[index] = { ...msgs[index], ...updated };

      // Auto-sync status bar time with the last message time
      const newStatusBarTime = (index === msgs.length - 1 && updated.time)
        ? updated.time
        : slide.statusBar.time;

      return {
        ...slide,
        statusBar: {
          ...slide.statusBar,
          time: newStatusBarTime,
        },
        whatsapp: {
          ...slide.whatsapp,
          messages: msgs,
        },
      };
    });
  };

  const handleUpdateIGDMHeader = (field: string, value: any) => {
    updateActiveSlide(slide => ({
      ...slide,
      instagramDm: {
        ...slide.instagramDm,
        [field]: value,
      },
    }));
  };

  const handleUpdateIGDMMessage = (index: number, updated: Partial<IGDMMessage>) => {
    updateActiveSlide(slide => {
      const msgs = [...slide.instagramDm.messages];
      msgs[index] = { ...msgs[index], ...updated };

      // Auto-sync status bar time with the last message time
      const newStatusBarTime = (index === msgs.length - 1 && updated.time)
        ? updated.time
        : slide.statusBar.time;

      return {
        ...slide,
        statusBar: {
          ...slide.statusBar,
          time: newStatusBarTime,
        },
        instagramDm: {
          ...slide.instagramDm,
          messages: msgs,
        },
      };
    });
  };

  const handleUpdateTwitter = (field: string, value: any) => {
    updateActiveSlide(slide => ({
      ...slide,
      twitter: {
        ...slide.twitter,
        [field]: value,
      },
    }));
  };

  const handleUpdateIGFeed = (field: string, value: any) => {
    updateActiveSlide(slide => ({
      ...slide,
      instagramFeed: {
        ...slide.instagramFeed,
        [field]: value,
      },
    }));
  };

  const handleUpdateThreads = (field: string, value: any) => {
    updateActiveSlide(slide => ({
      ...slide,
      threads: {
        ...slide.threads,
        [field]: value,
      },
    }));
  };

  const handleInlineNotificationEdit = (field: string, value: string) => {
    updateActiveSlide(slide => ({
      ...slide,
      notification: {
        ...slide.notification,
        [field]: value,
      },
    }));
  };

  // Quick Direct Add Message to Active Chat
  const handleQuickAddWAMessage = (sender: 'them' | 'me', type: 'text' | 'voice' = 'text') => {
    if (activeSlide.platform === 'whatsapp') {
      const newMsg: WAMessage = {
        id: `m-${Date.now()}`,
        sender,
        type,
        text: type === 'voice' ? 'Voice Message' : sender === 'them' ? 'Pesan baru dari lawan...' : 'Pesan balasan saya...',
        time: activeSlide.statusBar.time,
        status: 'read',
        voiceDuration: type === 'voice' ? '0:14' : undefined,
      };

      updateActiveSlide(slide => ({
        ...slide,
        whatsapp: {
          ...slide.whatsapp,
          messages: [...slide.whatsapp.messages, newMsg],
        },
      }));
    } else if (activeSlide.platform === 'instagram-dm') {
      const newMsg: IGDMMessage = {
        id: `ig-${Date.now()}`,
        sender,
        type: 'text',
        text: sender === 'them' ? 'Pesan baru dari lawan...' : 'Pesan balasan saya...',
        time: activeSlide.statusBar.time,
      };

      updateActiveSlide(slide => ({
        ...slide,
        instagramDm: {
          ...slide.instagramDm,
          messages: [...slide.instagramDm.messages, newMsg],
        },
      }));
    }
  };

  const handleToggleBlock = () => {
    if (activeSlide.platform === 'whatsapp') {
      updateActiveSlide(slide => ({
        ...slide,
        whatsapp: {
          ...slide.whatsapp,
          isBlocked: !slide.whatsapp.isBlocked,
        },
      }));
    } else if (activeSlide.platform === 'instagram-dm') {
      updateActiveSlide(slide => ({
        ...slide,
        instagramDm: {
          ...slide.instagramDm,
          isBlocked: !slide.instagramDm.isBlocked,
        },
      }));
    }
  };

  const handleQuickDownloadSingle = async () => {
    const canvasElement = document.getElementById('storyframe-export-canvas');
    if (!canvasElement) return;

    try {
      setIsExporting(true);
      setExportType('single');
      const indexStr = (currentSlideIndex + 1).toString().padStart(2, '0');
      const safeProject = (projectTitle || 'story').replace(/[^a-zA-Z0-9_-]/g, '_');
      const safeTitle = activeSlide.title.replace(/[^a-zA-Z0-9_-]/g, '_') || 'slide';
      const fileName = `slide-${indexStr}_${safeProject}_${activeSlide.platform}_${safeTitle}.png`;
      await downloadSlidePng(canvasElement, fileName);
    } catch (err) {
      console.error(err);
      alert('Gagal mendownload gambar. Silakan coba lagi.');
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  const handleQuickDownloadZip = async () => {
    try {
      setIsExporting(true);
      setExportType('zip');

      const renderSlideToBlob = async (slide: typeof slides[0]) => {
        setActiveSlideId(slide.id);
        await new Promise(r => setTimeout(r, 180));
        const canvasElement = document.getElementById('storyframe-export-canvas');
        if (!canvasElement) throw new Error('Canvas not found');
        return await captureSlideElement(canvasElement, { pixelRatio: 2, width: 1080, height: 1440 });
      };

      await batchExportZip(
        slides,
        renderSlideToBlob,
        projectTitle || 'StoryFrame-Story',
        () => {}
      );
    } catch (err) {
      console.error(err);
      alert('Gagal mendownload paket ZIP.');
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  const renderMockup = () => {
    switch (activeSlide.platform) {
      case 'whatsapp':
        return (
          <WhatsAppMockup
            data={activeSlide.whatsapp}
            themeMode={activeSlide.themeMode}
            onUpdateHeader={handleUpdateWAHeader}
            onUpdateMessage={handleUpdateWAMessage}
          />
        );
      case 'instagram-dm':
        return (
          <InstagramDMMockup
            data={activeSlide.instagramDm}
            themeMode={activeSlide.themeMode}
            onUpdateHeader={handleUpdateIGDMHeader}
            onUpdateMessage={handleUpdateIGDMMessage}
          />
        );
      case 'twitter':
        return (
          <TwitterMockup
            data={activeSlide.twitter}
            themeMode={activeSlide.themeMode}
            onUpdate={handleUpdateTwitter}
          />
        );
      case 'instagram-feed':
        return (
          <InstagramFeedMockup
            data={activeSlide.instagramFeed}
            themeMode={activeSlide.themeMode}
            onUpdate={handleUpdateIGFeed}
          />
        );
      case 'threads':
        return (
          <ThreadsMockup
            data={activeSlide.threads}
            themeMode={activeSlide.themeMode}
            onUpdate={handleUpdateThreads}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-4 w-full h-full">
      {/* 3-Step Guided Workflow Banner for Beginners */}
      <div className="w-full max-w-[420px] mb-2.5 px-3 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-1.5 truncate">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-semibold text-slate-200 truncate">
            Alur: 1. Naskah/Pemeran ➔ 2. Edit Layar ➔ 3. Unduh
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowTips(!showTips)}
          className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center space-x-0.5 shrink-0 ml-1.5"
        >
          <HelpCircle className="w-3 h-3" />
          <span>{showTips ? 'Tutup' : 'Tips'}</span>
        </button>
      </div>

      {showTips && (
        <div className="w-full max-w-[420px] mb-2.5 p-3 rounded-2xl bg-indigo-950/70 border border-indigo-800/80 text-xs text-indigo-200 space-y-1.5 animate-fade-in">
          <p className="font-bold text-slate-100 flex items-center space-x-1">
            <span>💡 Tips Navigasi & Edit Cepat:</span>
          </p>
          <ul className="list-disc list-inside space-y-1 text-[11px] text-indigo-200/90">
            <li>Gunakan <strong>tombol panah bulat di samping layar HP</strong> (atau tombol panah <strong>← / →</strong> di keyboard) untuk gonta-ganti slide dengan cepat.</li>
            <li><strong>Klik langsung teks di layar HP</strong> (jam atas, nama kontak, pesan) untuk mengubahnya seketika.</li>
            <li>Jam di status bar atas <strong>otomatis sinkron</strong> dengan jam balon chat.</li>
            <li>Klik tombol hijau <strong>Unduh Slide Ini (PNG)</strong> jika gambar sudah selesai.</li>
          </ul>
        </div>
      )}

      {/* Relative Mockup Stage with Floating Side Navigation Arrows */}
      <div className="relative w-full max-w-[420px] flex items-center justify-center">
        {/* Floating Left Arrow (Previous Slide) */}
        <button
          type="button"
          disabled={currentSlideIndex === 0}
          onClick={handlePrevSlide}
          className="absolute -left-4 sm:-left-12 lg:-left-16 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/95 hover:bg-indigo-600 border border-slate-700/90 hover:border-indigo-500 text-slate-200 hover:text-white shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-20 disabled:pointer-events-none group"
          title="Slide Sebelumnya (Atau tekan tombol panah kiri keyboard ←)"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* 100% Clean Rectangular Canvas (Zero rounded corners, zero outer white gap for pixel-perfect export) */}
        <div
          ref={ref}
          id="storyframe-export-canvas"
          className="relative w-full aspect-[3/4] bg-black rounded-none shadow-2xl overflow-hidden border-0 flex flex-col transition-all select-none"
          style={{
            transform: scale !== 1 ? `scale(${scale})` : undefined,
            transformOrigin: 'top center',
            borderRadius: 0,
          }}
        >
          {/* Phone Status Bar (Synchronized with Chat Time) */}
          <PhoneStatusBar
            config={activeSlide.statusBar}
            themeMode={activeSlide.themeMode}
            isDarkPlatform={activeSlide.platform === 'twitter' || activeSlide.platform === 'threads' ? activeSlide.themeMode === 'dark' : undefined}
            onUpdateTime={handleUpdateTime}
          />

          {/* Suspense Incoming Notification Overlay */}
          <IncomingNotification
            config={activeSlide.notification}
            onInlineEdit={handleInlineNotificationEdit}
          />

          {/* Active Mockup Screen Content */}
          <div className="flex-1 min-h-0 relative overflow-hidden flex flex-col">
            {renderMockup()}
          </div>

          {/* Home Bar Indicator */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full pointer-events-none z-30" />
        </div>

        {/* Floating Right Arrow (Next Slide) */}
        <button
          type="button"
          disabled={currentSlideIndex === slides.length - 1}
          onClick={handleNextSlide}
          className="absolute -right-4 sm:-right-12 lg:-right-16 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/95 hover:bg-indigo-600 border border-slate-700/90 hover:border-indigo-500 text-slate-200 hover:text-white shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-20 disabled:pointer-events-none group"
          title="Slide Berikutnya (Atau tekan tombol panah kanan keyboard →)"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* External Page Number & Content Title Bar (OUTSIDE the mockup image) */}
      <ExternalPageIndicator />

      {/* Quick In-Context Chat Tools (for WhatsApp & IG DM) */}
      {(activeSlide.platform === 'whatsapp' || activeSlide.platform === 'instagram-dm') && (
        <div className="w-full max-w-[420px] mt-2 flex items-center justify-between gap-1.5 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl">
          <button
            type="button"
            onClick={() => handleQuickAddWAMessage('them', 'text')}
            className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-[11px] font-semibold flex items-center justify-center space-x-1 transition-all active:scale-95"
            title="Tambah balon chat dari lawan bicara (sebelah kiri)"
          >
            <Plus className="w-3 h-3 text-emerald-400" />
            <span>+ Kiri (Lawan)</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickAddWAMessage('me', 'text')}
            className="flex-1 py-1.5 px-2 bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-800/60 text-emerald-200 rounded-xl text-[11px] font-semibold flex items-center justify-center space-x-1 transition-all active:scale-95"
            title="Tambah balon chat dari saya (sebelah kanan)"
          >
            <Plus className="w-3 h-3 text-emerald-400" />
            <span>+ Kanan (Saya)</span>
          </button>

          {activeSlide.platform === 'whatsapp' && (
            <button
              type="button"
              onClick={() => handleQuickAddWAMessage('me', 'voice')}
              className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-[11px] font-semibold flex items-center justify-center space-x-1 transition-all active:scale-95"
              title="Tambah Voice Note"
            >
              <Mic className="w-3 h-3 text-amber-400" />
              <span>+ VN</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleToggleBlock}
            className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold flex items-center justify-center space-x-1 transition-all active:scale-95 ${
              (activeSlide.platform === 'whatsapp' && activeSlide.whatsapp.isBlocked) ||
              (activeSlide.platform === 'instagram-dm' && activeSlide.instagramDm.isBlocked)
                ? 'bg-rose-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
            }`}
            title="Toggle status blokir kontak"
          >
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            <span>Blokir</span>
          </button>
        </div>
      )}

      {/* Quick 1-Click Download Action Bar */}
      <div className="w-full max-w-[420px] mt-2 grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={isExporting}
          onClick={handleQuickDownloadSingle}
          className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/40 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50"
          title="Download gambar slide yang sedang tampil sebagai file PNG 1080x1440 px persegi"
        >
          {isExporting && exportType === 'single' ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Merender PNG...</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Slide Ini (PNG)</span>
            </>
          )}
        </button>

        <button
          type="button"
          disabled={isExporting}
          onClick={handleQuickDownloadZip}
          className="py-2.5 px-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 border border-indigo-500/40 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50"
          title="Download semua slide dalam cerita sekaligus sebagai file ZIP terurut"
        >
          {isExporting && exportType === 'zip' ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Membuat ZIP...</span>
            </>
          ) : (
            <>
              <FileArchive className="w-3.5 h-3.5" />
              <span>Unduh Semua ({slides.length} ZIP)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
});

CanvasStage.displayName = 'CanvasStage';
