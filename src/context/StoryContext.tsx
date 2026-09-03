import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Slide, PlatformType, StoryProject, Character, PageWatermarkConfig } from '../types/story';
import { PRESET_AVATARS, PRESET_MEDIA } from '../utils/imageUtils';
import { incrementTimeString } from '../utils/timeUtils';
import { parseScriptToStory, SAMPLE_SCRIPT_TEMPLATE } from '../utils/scriptParser';

const STORAGE_KEY = 'storyframe_mockup_project_v3';
const BACKUP_STORAGE_KEY = 'storyframe_mockup_backup';

// Initial Characters for Sound Horeg Drama
const createSoundHoregCharacters = (): Character[] => [
  {
    id: 'char-sound',
    name: 'TukangSoun galek',
    handle: 'reneosound',
    avatar: PRESET_AVATARS.detective,
    roleLabel: 'Rental Sound (Lawan)',
    colorTag: 'indigo',
    verified: false,
    phoneOrStatus: 'online',
    isMe: false,
  },
  {
    id: 'char-jagad',
    name: 'Mas Jagad',
    handle: 'imutnyojag4d',
    avatar: PRESET_AVATARS.mysteriousMan,
    roleLabel: 'Klien Horeg (Saya)',
    colorTag: 'emerald',
    verified: false,
    phoneOrStatus: 'online',
    isMe: true,
  },
];

// Initial Mystery Story Characters
const createMysteryCharacters = (): Character[] => [
  {
    id: 'char-rian',
    name: 'Rian Aditya',
    handle: 'rian_aditya',
    avatar: PRESET_AVATARS.mysteriousMan,
    roleLabel: 'Tokoh Utama (Saya)',
    colorTag: 'indigo',
    verified: false,
    phoneOrStatus: 'online',
    isMe: true,
  },
  {
    id: 'char-stranger',
    name: '+62 812-9900-XXXX',
    handle: 'unknown_sender',
    avatar: PRESET_AVATARS.unknownContact,
    roleLabel: 'Peneror Misterius',
    colorTag: 'red',
    verified: false,
    phoneOrStatus: 'online',
    isMe: false,
  },
  {
    id: 'char-sarah',
    name: 'Sarah Amanda',
    handle: 'sarahamanda',
    avatar: PRESET_AVATARS.girlFriend,
    roleLabel: 'Teman di Villa',
    colorTag: 'rose',
    verified: false,
    phoneOrStatus: 'Aktif 5 mnt lalu',
    isMe: false,
  },
];

// Initial Starter Mystery Slides
const createMysterySlides = (): Slide[] => [
  {
    id: 'slide-1',
    title: 'Slide 1 - Pesan Misterius',
    platform: 'whatsapp',
    themeMode: 'dark',
    statusBar: {
      show: true,
      time: '23:45',
      batteryLevel: 24,
      isCharging: false,
      signalType: '5G',
      carrier: 'Telkomsel',
    },
    notification: {
      enabled: false,
      platform: 'whatsapp',
      title: 'Pesan Baru',
      message: '...',
      time: 'Baru saja',
      avatar: PRESET_AVATARS.unknownContact,
    },
    whatsapp: {
      contactName: '+62 812-9900-XXXX',
      avatar: PRESET_AVATARS.unknownContact,
      status: 'online',
      showCallButtons: true,
      characterId: 'char-stranger',
      messages: [
        {
          id: 'm1',
          sender: 'them',
          type: 'deleted',
          text: 'Pesan ini telah dihapus',
          time: '23:43',
          status: 'read',
        },
        {
          id: 'm2',
          sender: 'them',
          type: 'text',
          text: 'Jangan buka pintu belakang malam ini, Rian.',
          time: '23:44',
          status: 'read',
        },
        {
          id: 'm3',
          sender: 'them',
          type: 'text',
          text: 'Aku tahu kamu sedang sendirian di lantai dua.',
          time: '23:44',
          status: 'read',
        },
        {
          id: 'm4',
          sender: 'me',
          type: 'text',
          text: 'SIAPA KAMU?! Jangan main-main ya!',
          time: '23:45',
          status: 'read',
        },
        {
          id: 'm5',
          sender: 'me',
          type: 'voice',
          text: 'Voice message',
          voiceDuration: '0:14',
          time: '23:45',
          status: 'read',
        },
      ],
    },
    instagramDm: {
      contactName: 'sarahamanda',
      handle: 'sarahamanda',
      avatar: PRESET_AVATARS.girlFriend,
      verified: false,
      activeStatus: 'Aktif 15 mnt lalu',
      characterId: 'char-sarah',
      messages: [],
    },
    twitter: {
      authorName: 'Metropolis News Radar',
      handle: 'MetropolisRadar',
      avatar: PRESET_AVATARS.verifiedBrand,
      verified: true,
      verifiedType: 'blue',
      text: '⚠️ PERINGATAN DARURAT: Sosok mencurigakan dilaporkan berkeliaran di sekitar Kompleks Villa Pine Hills pukul 23:30 WIB.',
      mediaUrl: PRESET_MEDIA.abandonedHouse,
      device: 'Twitter for iPhone',
      timestamp: '11:48 PM · 24 Okt 2026',
      viewsCount: '48.2K',
      repostsCount: '1.4K',
      quotesCount: '382',
      likesCount: '5.9K',
      bookmarksCount: '890',
    },
    instagramFeed: {
      authorName: 'sarahamanda',
      avatar: PRESET_AVATARS.girlFriend,
      location: 'Pine Hills Hillside Villa',
      verified: false,
      characterId: 'char-sarah',
      mediaUrl: PRESET_MEDIA.abandonedHouse,
      isLiked: true,
      likesCount: '1,420 suka',
      caption: 'Katanya villa ini ada penjaganya... tapi kok sunyi banget ya? 🌲🏚️ #pinehills #misteri',
      timestamp: '3 JAM YANG LALU',
      commentCount: 'Lihat semua 42 komentar',
    },
    threads: {
      authorName: 'detektif_jalanan',
      handle: 'detektif_jalanan',
      avatar: PRESET_AVATARS.detective,
      verified: false,
      text: 'Ada laporan aneh dari kawasan Villa Pine Hills malam ini. CCTV gerbang utama mati mendadak sejak pukul 23:00. Jangan ke sana.',
      timestamp: '15m',
      likesCount: '450',
      repliesCount: '38',
      repostsCount: '24',
      hasReply: false,
    },
  },
  {
    id: 'slide-2',
    title: 'Slide 2 - Bukti CCTV',
    platform: 'whatsapp',
    themeMode: 'dark',
    statusBar: {
      show: true,
      time: '23:47',
      batteryLevel: 22,
      isCharging: false,
      signalType: '5G',
      carrier: 'Telkomsel',
    },
    notification: {
      enabled: false,
      platform: 'whatsapp',
      title: '+62 812-9900-XXXX',
      message: '...',
      time: 'Baru saja',
      avatar: PRESET_AVATARS.unknownContact,
    },
    whatsapp: {
      contactName: '+62 812-9900-XXXX',
      avatar: PRESET_AVATARS.unknownContact,
      status: 'mengetik...',
      showCallButtons: true,
      characterId: 'char-stranger',
      messages: [
        {
          id: 'm2-1',
          sender: 'them',
          type: 'image',
          text: 'Lihat siapa yang berdiri di luar jendela kamarmu.',
          mediaUrl: PRESET_MEDIA.cctvEvidence,
          time: '23:46',
          status: 'read',
        },
        {
          id: 'm2-2',
          sender: 'me',
          type: 'text',
          text: 'ANJING LU SIAPA SEBENARNYA?!',
          time: '23:47',
          status: 'read',
        },
      ],
    },
    instagramDm: {
      contactName: 'sarahamanda',
      handle: 'sarahamanda',
      avatar: PRESET_AVATARS.girlFriend,
      verified: false,
      activeStatus: 'Online',
      messages: [],
    },
    twitter: {
      authorName: 'Metropolis News Radar',
      handle: 'MetropolisRadar',
      avatar: PRESET_AVATARS.verifiedBrand,
      verified: true,
      verifiedType: 'blue',
      text: 'Update...',
      device: 'Twitter for iPhone',
      timestamp: '11:49 PM · 24 Okt 2026',
      viewsCount: '10K',
      repostsCount: '200',
      quotesCount: '40',
      likesCount: '1.2K',
      bookmarksCount: '100',
    },
    instagramFeed: {
      authorName: 'sarahamanda',
      avatar: PRESET_AVATARS.girlFriend,
      location: 'Pine Hills Hillside Villa',
      verified: false,
      mediaUrl: PRESET_MEDIA.abandonedHouse,
      isLiked: true,
      likesCount: '1,420 suka',
      caption: 'Katanya villa ini ada penjaganya...',
      timestamp: '3 JAM YANG LALU',
    },
    threads: {
      authorName: 'detektif_jalanan',
      handle: 'detektif_jalanan',
      avatar: PRESET_AVATARS.detective,
      verified: false,
      text: 'Update...',
      timestamp: '10m',
      likesCount: '100',
      repliesCount: '10',
      repostsCount: '5',
      hasReply: false,
    },
  },
  {
    id: 'slide-3',
    title: 'Slide 3 - Postingan Feed & Suspense Notif',
    platform: 'instagram-feed',
    themeMode: 'dark',
    statusBar: {
      show: true,
      time: '23:49',
      batteryLevel: 20,
      isCharging: false,
      signalType: '5G',
      carrier: 'Telkomsel',
    },
    notification: {
      enabled: true,
      platform: 'whatsapp',
      title: '+62 812-9900-XXXX',
      message: 'Langkah kakiku sudah ada di tangga lantai 2.',
      time: 'Baru saja',
      avatar: PRESET_AVATARS.unknownContact,
    },
    whatsapp: {
      contactName: '+62 812-9900-XXXX',
      avatar: PRESET_AVATARS.unknownContact,
      status: 'online',
      showCallButtons: true,
      messages: [],
    },
    instagramDm: {
      contactName: 'sarahamanda',
      handle: 'sarahamanda',
      avatar: PRESET_AVATARS.girlFriend,
      verified: false,
      activeStatus: 'Online',
      messages: [],
    },
    twitter: {
      authorName: 'Metropolis News Radar',
      handle: 'MetropolisRadar',
      avatar: PRESET_AVATARS.verifiedBrand,
      verified: true,
      verifiedType: 'blue',
      text: 'Update...',
      device: 'Twitter for iPhone',
      timestamp: '11:49 PM · 24 Okt 2026',
      viewsCount: '10K',
      repostsCount: '200',
      quotesCount: '40',
      likesCount: '1.2K',
      bookmarksCount: '100',
    },
    instagramFeed: {
      authorName: 'sarahamanda',
      avatar: PRESET_AVATARS.girlFriend,
      location: 'Pine Hills Hillside Villa',
      verified: false,
      characterId: 'char-sarah',
      mediaUrl: PRESET_MEDIA.abandonedHouse,
      isLiked: true,
      likesCount: '1,420 suka',
      caption: 'Katanya villa ini ada penjaganya... tapi kok sunyi banget ya? 🌲🏚️ #pinehills #misteri',
      timestamp: '3 JAM YANG LALU',
      commentCount: 'Lihat semua 42 komentar',
    },
    threads: {
      authorName: 'detektif_jalanan',
      handle: 'detektif_jalanan',
      avatar: PRESET_AVATARS.detective,
      verified: false,
      text: 'Update...',
      timestamp: '10m',
      likesCount: '100',
      repliesCount: '10',
      repostsCount: '5',
      hasReply: false,
    },
  },
];

// Single Clean Blank Starter Slide
const createBlankSlide = (): Slide => ({
  id: 'slide-1',
  title: 'Slide 1',
  platform: 'whatsapp',
  themeMode: 'dark',
  statusBar: {
    show: true,
    time: '09:00',
    batteryLevel: 85,
    isCharging: false,
    signalType: '5G',
    carrier: 'Telkomsel',
  },
  notification: {
    enabled: false,
    platform: 'whatsapp',
    title: 'Notifikasi',
    message: '',
    time: 'Baru saja',
    avatar: PRESET_AVATARS.unknownContact,
  },
  whatsapp: {
    contactName: 'Target Kontak',
    avatar: PRESET_AVATARS.unknownContact,
    status: 'online',
    showCallButtons: true,
    messages: [
      {
        id: 'm1',
        sender: 'them',
        type: 'text',
        text: 'Halo mas, selamat pagi...',
        time: '09:00',
        status: 'read',
      },
    ],
  },
  instagramDm: {
    contactName: 'username_ig',
    handle: 'username_ig',
    avatar: PRESET_AVATARS.girlFriend,
    verified: false,
    activeStatus: 'Online',
    messages: [],
  },
  twitter: {
    authorName: 'Nama Akun',
    handle: 'handle_x',
    avatar: PRESET_AVATARS.verifiedBrand,
    verified: false,
    verifiedType: 'none',
    text: 'Tulis tweet di sini...',
    device: 'Twitter for iPhone',
    timestamp: '9:00 AM · Hari Ini',
    viewsCount: '1.2K',
    repostsCount: '24',
    quotesCount: '5',
    likesCount: '150',
    bookmarksCount: '10',
  },
  instagramFeed: {
    authorName: 'username_ig',
    avatar: PRESET_AVATARS.girlFriend,
    location: 'Indonesia',
    verified: false,
    mediaUrl: PRESET_MEDIA.abandonedHouse,
    isLiked: false,
    likesCount: '100 suka',
    caption: 'Tulis caption feed di sini...',
    timestamp: '1 JAM YANG LALU',
  },
  threads: {
    authorName: 'username_threads',
    handle: 'username_threads',
    avatar: PRESET_AVATARS.detective,
    verified: false,
    text: 'Tulis isi utas threads...',
    timestamp: '5m',
    likesCount: '45',
    repliesCount: '8',
    repostsCount: '2',
    hasReply: false,
  },
});

const initialWatermark: PageWatermarkConfig = {
  show: true,
  format: 'title_and_page',
  useProjectTitle: true,
  startPageNumber: 1,
  position: 'bottom_right',
  style: 'glass_dark',
};

interface StoryContextType {
  projectTitle: string;
  setProjectTitle: (title: string) => void;
  watermark: PageWatermarkConfig;
  updateWatermark: (updated: Partial<PageWatermarkConfig>) => void;
  characters: Character[];
  addCharacter: (charData?: Partial<Character>) => Character;
  updateCharacter: (id: string, updated: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;
  applyCharacterToActiveSlide: (characterId: string) => void;
  slides: Slide[];
  activeSlideId: string;
  activeSlide: Slide;
  setActiveSlideId: (id: string) => void;
  updateActiveSlide: (updater: Partial<Slide> | ((prev: Slide) => Slide)) => void;
  updateSlideById: (slideId: string, updater: Partial<Slide> | ((prev: Slide) => Slide)) => void;
  addSlide: (platform?: PlatformType) => string;
  duplicateSlide: (slideId?: string) => string;
  deleteSlide: (slideId: string) => void;
  reorderSlides: (fromIndex: number, toIndex: number) => void;
  incrementTime: (minutes: number) => void;
  importStoryFromScript: (rawScript: string) => void;
  exportProjectAsJson: () => void;
  importProjectFromJson: (file: File) => Promise<boolean>;
  startBlankProject: () => void;
  loadPresetStory: (presetKey: 'sound_horeg' | 'misteri_villa' | 'chat_lucu') => void;
  resetProject: () => void;
  currentSlideIndex: number;
  lastSavedTime: string;
}

const StoryContext = createContext<StoryContextType | null>(null);

export const StoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lastSavedTime, setLastSavedTime] = useState<string>('Baru saja');

  const [projectTitle, setProjectTitle] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoryProject = JSON.parse(saved);
        if (parsed.title) return parsed.title;
      }
    } catch (e) {
      console.error(e);
    }
    return 'Cerita TukangSoun galek & Mas Jagad';
  });

  const [watermark, setWatermark] = useState<PageWatermarkConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoryProject = JSON.parse(saved);
        if (parsed.watermark) return { ...initialWatermark, ...parsed.watermark };
      }
    } catch (e) {
      console.error(e);
    }
    return initialWatermark;
  });

  const [characters, setCharacters] = useState<Character[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoryProject = JSON.parse(saved);
        if (parsed.characters && parsed.characters.length > 0) {
          return parsed.characters;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return createSoundHoregCharacters();
  });

  const [slides, setSlides] = useState<Slide[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoryProject = JSON.parse(saved);
        if (parsed.slides && parsed.slides.length > 0) {
          return parsed.slides;
        }
      }
    } catch (e) {
      console.error('Failed to load project from localStorage:', e);
    }
    // Load Sound Horeg starter as default
    const parsed = parseScriptToStory(SAMPLE_SCRIPT_TEMPLATE);
    return parsed.slides.length > 0 ? parsed.slides : createMysterySlides();
  });

  const [activeSlideId, setActiveSlideId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoryProject = JSON.parse(saved);
        if (parsed.activeSlideId) return parsed.activeSlideId;
      }
    } catch (e) {
      console.error(e);
    }
    return 'slide-1';
  });

  // Keep activeSlideId valid
  useEffect(() => {
    if (!slides.some(s => s.id === activeSlideId)) {
      if (slides.length > 0) {
        setActiveSlideId(slides[0].id);
      }
    }
  }, [slides, activeSlideId]);

  // Prevent accidental page refresh / exit
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Perubahan cerita Anda sedang dikerjakan. Yakin ingin keluar atau merefresh halaman?';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Real-time Auto-Save to localStorage & sessionStorage with backup slot
  useEffect(() => {
    try {
      const project: StoryProject = {
        title: projectTitle,
        activeSlideId,
        watermark,
        characters,
        slides,
      };
      const serialized = JSON.stringify(project);
      localStorage.setItem(STORAGE_KEY, serialized);
      sessionStorage.setItem(STORAGE_KEY, serialized);
      localStorage.setItem(BACKUP_STORAGE_KEY, serialized);

      const now = new Date();
      setLastSavedTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`);
    } catch (e) {
      console.error('Failed to save project to storage:', e);
    }
  }, [projectTitle, activeSlideId, watermark, characters, slides]);

  const activeSlide = slides.find(s => s.id === activeSlideId) || slides[0] || createBlankSlide();
  const currentSlideIndex = Math.max(0, slides.findIndex(s => s.id === activeSlideId));

  const updateWatermark = useCallback((updated: Partial<PageWatermarkConfig>) => {
    setWatermark(prev => ({ ...prev, ...updated }));
  }, []);

  const addCharacter = useCallback((charData?: Partial<Character>): Character => {
    const newId = `char-${Date.now()}`;
    const newChar: Character = {
      id: newId,
      name: charData?.name || `Karakter Baru ${characters.length + 1}`,
      handle: charData?.handle || `user_${characters.length + 1}`,
      avatar: charData?.avatar || PRESET_AVATARS.unknownContact,
      roleLabel: charData?.roleLabel || 'Pemeran Tambahan',
      colorTag: charData?.colorTag || 'indigo',
      verified: charData?.verified || false,
      phoneOrStatus: charData?.phoneOrStatus || 'online',
      isMe: charData?.isMe || false,
    };

    setCharacters(prev => [...prev, newChar]);
    return newChar;
  }, [characters.length]);

  const updateCharacter = useCallback((id: string, updated: Partial<Character>) => {
    setCharacters(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
  }, []);

  const deleteCharacter = useCallback((id: string) => {
    if (characters.length <= 1) {
      alert('Minimal harus ada 1 karakter pemeran dalam cerita.');
      return;
    }
    setCharacters(prev => prev.filter(c => c.id !== id));
  }, [characters.length]);

  const applyCharacterToActiveSlide = useCallback((characterId: string) => {
    const char = characters.find(c => c.id === characterId);
    if (!char) return;

    setSlides(prev => {
      return prev.map(slide => {
        if (slide.id !== activeSlideId) return slide;

        switch (slide.platform) {
          case 'whatsapp':
            return {
              ...slide,
              whatsapp: {
                ...slide.whatsapp,
                contactName: char.name,
                avatar: char.avatar,
                status: char.phoneOrStatus || slide.whatsapp.status,
                characterId: char.id,
              },
            };
          case 'instagram-dm':
            return {
              ...slide,
              instagramDm: {
                ...slide.instagramDm,
                contactName: char.name,
                handle: char.handle,
                avatar: char.avatar,
                verified: !!char.verified,
                characterId: char.id,
              },
            };
          case 'twitter':
            return {
              ...slide,
              twitter: {
                ...slide.twitter,
                authorName: char.name,
                handle: char.handle,
                avatar: char.avatar,
                verified: !!char.verified,
                verifiedType: char.verified ? (slide.twitter.verifiedType || 'blue') : 'none',
                characterId: char.id,
              },
            };
          case 'instagram-feed':
            return {
              ...slide,
              instagramFeed: {
                ...slide.instagramFeed,
                authorName: char.handle || char.name.toLowerCase().replace(/\s+/g, '_'),
                avatar: char.avatar,
                verified: !!char.verified,
                characterId: char.id,
              },
            };
          case 'threads':
            return {
              ...slide,
              threads: {
                ...slide.threads,
                authorName: char.handle || char.name.toLowerCase().replace(/\s+/g, '_'),
                handle: char.handle,
                avatar: char.avatar,
                verified: !!char.verified,
                characterId: char.id,
              },
            };
          default:
            return slide;
        }
      });
    });
  }, [characters, activeSlideId]);

  const updateActiveSlide = useCallback((updater: Partial<Slide> | ((prev: Slide) => Slide)) => {
    setSlides(prevSlides => {
      return prevSlides.map(slide => {
        if (slide.id !== activeSlideId) return slide;
        if (typeof updater === 'function') {
          return updater(slide);
        }
        return { ...slide, ...updater };
      });
    });
  }, [activeSlideId]);

  const updateSlideById = useCallback((slideId: string, updater: Partial<Slide> | ((prev: Slide) => Slide)) => {
    setSlides(prevSlides => {
      return prevSlides.map(slide => {
        if (slide.id !== slideId) return slide;
        if (typeof updater === 'function') {
          return updater(slide);
        }
        return { ...slide, ...updater };
      });
    });
  }, []);

  const addSlide = useCallback((platform: PlatformType = 'whatsapp'): string => {
    const newId = `slide-${Date.now()}`;
    const newSlideNumber = slides.length + 1;
    const baseTime = activeSlide?.statusBar.time || '12:00';
    const nextTime = incrementTimeString(baseTime, 2);

    const newSlide: Slide = {
      id: newId,
      title: `Slide ${newSlideNumber}`,
      platform,
      themeMode: activeSlide ? activeSlide.themeMode : 'dark',
      statusBar: {
        show: true,
        time: nextTime,
        batteryLevel: Math.max(5, (activeSlide?.statusBar.batteryLevel ?? 75) - 2),
        signalType: activeSlide?.statusBar.signalType || '5G',
        carrier: activeSlide?.statusBar.carrier || 'Telkomsel',
      },
      notification: {
        enabled: false,
        platform: 'whatsapp',
        title: 'Notifikasi Baru',
        message: 'Pesan rahasia masuk...',
        time: 'Baru saja',
        avatar: PRESET_AVATARS.unknownContact,
      },
      whatsapp: {
        contactName: activeSlide?.whatsapp?.contactName || 'Target Kontak',
        avatar: activeSlide?.whatsapp?.avatar || PRESET_AVATARS.unknownContact,
        status: 'online',
        showCallButtons: true,
        characterId: activeSlide?.whatsapp?.characterId,
        messages: [
          {
            id: `m-${Date.now()}`,
            sender: 'them',
            type: 'text',
            text: 'Apa kelanjutan ceritanya?',
            time: nextTime,
            status: 'read',
          }
        ],
      },
      instagramDm: {
        contactName: activeSlide?.instagramDm?.contactName || 'username_ig',
        handle: activeSlide?.instagramDm?.handle || 'username_ig',
        avatar: activeSlide?.instagramDm?.avatar || PRESET_AVATARS.girlFriend,
        verified: false,
        activeStatus: 'Online',
        characterId: activeSlide?.instagramDm?.characterId,
        messages: [
          {
            id: `ig-${Date.now()}`,
            sender: 'them',
            type: 'text',
            text: 'Halo, ada update baru?',
            time: nextTime,
          }
        ],
      },
      twitter: {
        authorName: activeSlide?.twitter?.authorName || 'Akun Twitter',
        handle: activeSlide?.twitter?.handle || 'akun_x',
        avatar: activeSlide?.twitter?.avatar || PRESET_AVATARS.verifiedBrand,
        verified: false,
        verifiedType: 'blue',
        characterId: activeSlide?.twitter?.characterId,
        text: 'Ini adalah postingan baru kelanjutan cerita.',
        device: 'Twitter for iPhone',
        timestamp: `${nextTime} · Hari Ini`,
        viewsCount: '1.2K',
        repostsCount: '45',
        quotesCount: '12',
        likesCount: '340',
        bookmarksCount: '89',
      },
      instagramFeed: {
        authorName: activeSlide?.instagramFeed?.authorName || 'akun_instagram',
        avatar: activeSlide?.instagramFeed?.avatar || PRESET_AVATARS.girlFriend,
        location: 'Jakarta, Indonesia',
        verified: false,
        characterId: activeSlide?.instagramFeed?.characterId,
        mediaUrl: PRESET_MEDIA.abandonedHouse,
        isLiked: false,
        likesCount: '320 suka',
        caption: 'Momen tak terlupakan hari ini...',
        timestamp: '1 JAM YANG LALU',
      },
      threads: {
        authorName: activeSlide?.threads?.authorName || 'threads_user',
        handle: activeSlide?.threads?.handle || 'threads_user',
        avatar: activeSlide?.threads?.avatar || PRESET_AVATARS.detective,
        verified: false,
        characterId: activeSlide?.threads?.characterId,
        text: 'Melanjutkan utas cerita sebelumnya...',
        timestamp: '1m',
        likesCount: '84',
        repliesCount: '12',
        repostsCount: '4',
        hasReply: false,
      },
    };

    setSlides(prev => [...prev, newSlide]);
    setActiveSlideId(newId);
    return newId;
  }, [slides, activeSlide]);

  const duplicateSlide = useCallback((slideId?: string): string => {
    const targetId = slideId || activeSlideId;
    const targetIndex = slides.findIndex(s => s.id === targetId);
    if (targetIndex === -1) return '';

    const original = slides[targetIndex];
    const newId = `slide-${Date.now()}`;
    const nextTime = incrementTimeString(original.statusBar.time, 2);

    const cloned: Slide = JSON.parse(JSON.stringify(original));
    cloned.id = newId;
    cloned.title = `${original.title} (Lanjutan)`;
    cloned.statusBar.time = nextTime;
    cloned.statusBar.batteryLevel = Math.max(1, original.statusBar.batteryLevel - 1);

    if (cloned.whatsapp?.messages?.length > 0) {
      cloned.whatsapp.messages = cloned.whatsapp.messages.map(m => ({
        ...m,
        id: `m-${Math.random().toString(36).substring(2, 9)}`,
      }));
    }

    const newSlides = [...slides];
    newSlides.splice(targetIndex + 1, 0, cloned);

    setSlides(newSlides);
    setActiveSlideId(newId);
    return newId;
  }, [slides, activeSlideId]);

  const deleteSlide = useCallback((slideId: string) => {
    if (slides.length <= 1) {
      alert('Minimal harus ada 1 slide dalam cerita.');
      return;
    }

    const targetIndex = slides.findIndex(s => s.id === slideId);
    const newSlides = slides.filter(s => s.id !== slideId);
    setSlides(newSlides);

    if (activeSlideId === slideId) {
      const nextActiveIndex = Math.min(targetIndex, newSlides.length - 1);
      setActiveSlideId(newSlides[nextActiveIndex].id);
    }
  }, [slides, activeSlideId]);

  const reorderSlides = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex < 0 || fromIndex >= slides.length || toIndex < 0 || toIndex >= slides.length) return;
    setSlides(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  }, [slides.length]);

  const incrementTime = useCallback((minutes: number) => {
    updateActiveSlide(slide => {
      const newTime = incrementTimeString(slide.statusBar.time, minutes);
      
      let updatedWa = { ...slide.whatsapp };
      if (updatedWa.messages && updatedWa.messages.length > 0) {
        const lastMsg = updatedWa.messages[updatedWa.messages.length - 1];
        const newMsgTime = incrementTimeString(lastMsg.time, minutes);
        const updatedMsgs = [...updatedWa.messages];
        updatedMsgs[updatedMsgs.length - 1] = {
          ...lastMsg,
          time: newMsgTime,
        };
        updatedWa.messages = updatedMsgs;
      }

      return {
        ...slide,
        statusBar: {
          ...slide.statusBar,
          time: newTime,
        },
        whatsapp: updatedWa,
      };
    });
  }, [updateActiveSlide]);

  /**
   * REGEX SCRIPT TO STORY IMPORTER
   */
  const importStoryFromScript = useCallback((rawScript: string) => {
    const parsed = parseScriptToStory(rawScript);
    if (parsed.slides.length === 0) {
      alert('Gagal mendeteksi slide dalam naskah. Pastikan format penulisan sesuai panduan.');
      return;
    }

    setProjectTitle(parsed.projectTitle);
    
    // Set characters detected from script
    setCharacters(parsed.characters);
    setSlides(parsed.slides);
    setActiveSlideId(parsed.slides[0].id);
  }, []);

  /**
   * START BLANK PROJECT (1 Clean Slide)
   */
  const startBlankProject = useCallback(() => {
    const blankSlide = createBlankSlide();
    const blankChar: Character = {
      id: 'char-1',
      name: 'Target Kontak',
      handle: 'target_kontak',
      avatar: PRESET_AVATARS.unknownContact,
      roleLabel: 'Lawan Bicara',
      colorTag: 'indigo',
      verified: false,
      phoneOrStatus: 'online',
      isMe: false,
    };

    setProjectTitle('Cerita Baru');
    setWatermark(initialWatermark);
    setCharacters([blankChar]);
    setSlides([blankSlide]);
    setActiveSlideId(blankSlide.id);
  }, []);

  /**
   * LOAD POPULAR PRESET STORY TEMPLATES
   */
  const loadPresetStory = useCallback((presetKey: 'sound_horeg' | 'misteri_villa' | 'chat_lucu') => {
    if (presetKey === 'sound_horeg') {
      const parsed = parseScriptToStory(SAMPLE_SCRIPT_TEMPLATE);
      setProjectTitle('Rental Sound Horeg & Mas Jagad');
      setCharacters(parsed.characters);
      setSlides(parsed.slides);
      setActiveSlideId(parsed.slides[0].id);
    } else if (presetKey === 'misteri_villa') {
      setProjectTitle('Misteri Villa Pine Hills');
      setCharacters(createMysteryCharacters());
      setSlides(createMysterySlides());
      setActiveSlideId('slide-1');
    } else if (presetKey === 'chat_lucu') {
      const memeScript = `Pemeran 1 "Mantan Tersayang" @mantanku_dulu
pemeran2 "Aku yang Sabar" @aku_sabar

Scene 1 (wa)
Sayang, kamu masih inget aku kan?
Aku kangen banget sama kamu...

maaf ini siapa ya?
nomornya kok nggak ke-save?

Scene 2 (wa)
Jahat banget kamu, masa lupa sama aku yang nemenin dari nol :(
Balikan yuk please...

maaf ya, saya udah bahagia sama yang sekarang
jangan ganggu lagi ya

Scene 3 (wa)
[BLOKIR]: Anda telah memblokir kontak ini. Ketuk untuk membuka blokir.
THEM: Halo?? Kok centang satu??
ME: (system: 🔒 Anda telah memblokir kontak ini.)

Scene 4 (twitter)
Pelajaran hari ini: masa lalu itu dibelakang, kalau di depan namanya masa depan. Jangan lupa blokir sebelum baper wkwk #moveon #santai
`;
      const parsed = parseScriptToStory(memeScript);
      setProjectTitle('Penolakan Mantan & Blokir Nomor');
      setCharacters(parsed.characters);
      setSlides(parsed.slides);
      setActiveSlideId(parsed.slides[0].id);
    }
  }, []);

  /**
   * EXPORT PROJECT AS BACKUP JSON FILE
   */
  const exportProjectAsJson = useCallback(() => {
    try {
      const project: StoryProject = {
        title: projectTitle,
        activeSlideId,
        watermark,
        characters,
        slides,
      };
      const jsonStr = JSON.stringify(project, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const safeTitle = (projectTitle || 'StoryFrame-Backup').replace(/[^a-zA-Z0-9_-]/g, '_');
      a.href = url;
      a.download = `${safeTitle}.storyframe.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('Gagal mengekspor file cadangan proyek.');
    }
  }, [projectTitle, activeSlideId, watermark, characters, slides]);

  /**
   * IMPORT PROJECT FROM BACKUP JSON FILE
   */
  const importProjectFromJson = useCallback(async (file: File): Promise<boolean> => {
    try {
      const text = await file.text();
      const parsed: StoryProject = JSON.parse(text);
      if (!parsed.slides || !Array.isArray(parsed.slides) || parsed.slides.length === 0) {
        alert('Format file cadangan tidak valid.');
        return false;
      }

      setProjectTitle(parsed.title || 'Proyek Dimuat');
      if (parsed.watermark) setWatermark(parsed.watermark);
      if (parsed.characters) setCharacters(parsed.characters);
      setSlides(parsed.slides);
      setActiveSlideId(parsed.activeSlideId || parsed.slides[0].id);

      // Save immediately to storage
      localStorage.setItem(STORAGE_KEY, text);
      sessionStorage.setItem(STORAGE_KEY, text);
      alert(`Berhasil memulihkan proyek "${parsed.title || 'Cerita'}" dengan ${parsed.slides.length} slide!`);
      return true;
    } catch (e) {
      console.error(e);
      alert('Gagal membaca file proyek JSON.');
      return false;
    }
  }, []);

  const resetProject = useCallback(() => {
    startBlankProject();
  }, [startBlankProject]);

  return (
    <StoryContext.Provider
      value={{
        projectTitle,
        setProjectTitle,
        watermark,
        updateWatermark,
        characters,
        addCharacter,
        updateCharacter,
        deleteCharacter,
        applyCharacterToActiveSlide,
        slides,
        activeSlideId,
        activeSlide,
        setActiveSlideId,
        updateActiveSlide,
        updateSlideById,
        addSlide,
        duplicateSlide,
        deleteSlide,
        reorderSlides,
        incrementTime,
        importStoryFromScript,
        exportProjectAsJson,
        importProjectFromJson,
        startBlankProject,
        loadPresetStory,
        resetProject,
        currentSlideIndex,
        lastSavedTime,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
};

export const useStory = () => {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
};
