import { forwardRef } from 'react';
import { useStory } from '../../context/StoryContext';
import { PhoneStatusBar } from '../mockups/common/PhoneStatusBar';
import { IncomingNotification } from '../mockups/common/IncomingNotification';
import { ExternalPageIndicator } from '../mockups/common/PageNumberWatermark';
import { WhatsAppMockup } from '../mockups/whatsapp/WhatsAppMockup';
import { InstagramDMMockup } from '../mockups/instagram-dm/InstagramDMMockup';
import { TwitterMockup } from '../mockups/twitter/TwitterMockup';
import { InstagramFeedMockup } from '../mockups/instagram-feed/InstagramFeedMockup';
import { ThreadsMockup } from '../mockups/threads/ThreadsMockup';
import type { WAMessage, IGDMMessage } from '../../types/story';

interface CanvasStageProps {
  scale?: number;
}

export const CanvasStage = forwardRef<HTMLDivElement, CanvasStageProps>(({ scale = 1 }, ref) => {
  const { activeSlide, updateActiveSlide } = useStory();

  if (!activeSlide) return null;

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
      return {
        ...slide,
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
      return {
        ...slide,
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
      {/* 100% Clean Phone Mockup Canvas (Inside image is pristine and authentic) */}
      <div
        ref={ref}
        id="storyframe-export-canvas"
        className="relative w-full max-w-[420px] aspect-[3/4] bg-black rounded-[2.5rem] shadow-2xl overflow-hidden border-[6px] border-slate-800/80 flex flex-col transition-all select-none"
        style={{
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: 'top center',
        }}
      >
        {/* Phone Status Bar */}
        <PhoneStatusBar
          config={activeSlide.statusBar}
          themeMode={activeSlide.themeMode}
          isDarkPlatform={activeSlide.platform === 'twitter' || activeSlide.platform === 'threads' ? activeSlide.themeMode === 'dark' : undefined}
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

      {/* External Page Number & Content Title Bar (OUTSIDE the mockup image) */}
      <ExternalPageIndicator />
    </div>
  );
});

CanvasStage.displayName = 'CanvasStage';
