import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Slide, PlatformType, StoryProject, Character, PageWatermarkConfig } from '../types/story';
import { PRESET_AVATARS, PRESET_MEDIA } from '../utils/imageUtils';
import { incrementTimeString } from '../utils/timeUtils';
import { parseScriptToStory } from '../utils/scriptParser';

const STORAGE_KEY = 'storyframe_mockup_project_v3';

// Default Story Characters
const createInitialCharacters = (): Character[] => [
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
  {
    id: 'char-news',
    name: 'Metropolis News Radar',
    handle: 'MetropolisRadar',
    avatar: PRESET_AVATARS.verifiedBrand,
    roleLabel: 'Akun Berita / Humas',
    colorTag: 'sky',
    verified: true,
    phoneOrStatus: 'Official Account',
    isMe: false,
  },
  {
    id: 'char-detective',
    name: 'Detektif Jalanan',
    handle: 'detektif_jalanan',
    avatar: PRESET_AVATARS.detective,
    roleLabel: 'Penyelidik Anonim',
    colorTag: 'amber',
    verified: false,
    phoneOrStatus: 'Online',
    isMe: false,
  },
];

// Initial Starter Mystery Drama Story
const createInitialSlides = (): Slide[] => [
  {
    id: 'slide-1',
    title: 'Pesan Dari Nomor Tak Dikenal',
    platform: 'whatsapp',
    themeMode: 'dark',
    statusBar: {
      show: true,
      time: '23:45',
      batteryLevel: 28,
      signalType: '5G',
      carrier: 'Telkomsel',
    },
    notification: {
      enabled: false,
      platform: 'whatsapp',
      title: '+62 812-9900-XXXX',
      message: 'Kamu tidak bisa lari lagi.',
      time: 'Baru saja',
      avatar: PRESET_AVATARS.mysteriousMan,
      characterId: 'char-stranger',
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
          characterId: 'char-stranger',
        },
        {
          id: 'm2',
          sender: 'them',
          type: 'text',
          text: 'Jangan buka pintu belakang malam ini, Rian.',
          time: '23:44',
          status: 'read',
          characterId: 'char-stranger',
        },
        {
          id: 'm3',
          sender: 'them',
          type: 'text',
          text: 'Aku tahu kamu sedang sendirian di lantai dua.',
          time: '23:45',
          status: 'read',
          characterId: 'char-stranger',
        },
      ],
    },
    instagramDm: {
      contactName: 'Sarah Amanda',
      handle: 'sarahamanda',
      avatar: PRESET_AVATARS.girlFriend,
      verified: false,
      activeStatus: 'Aktif 5 mnt lalu',
      characterId: 'char-sarah',
      messages: [
        {
          id: 'ig-1',
          sender: 'them',
          type: 'text',
          text: 'Rian, kamu masih di villa itu?',
          time: '23:40',
        },
      ],
    },
    twitter: {
      authorName: 'Metropolis News Radar',
      handle: 'MetropolisRadar',
      avatar: PRESET_AVATARS.verifiedBrand,
      verified: true,
      verifiedType: 'blue',
      characterId: 'char-news',
      text: '⚠️ PERINGATAN DARURAT: Sosok mencurigakan dilaporkan berkeliaran di sekitar Kompleks Villa Pine Hills pukul 23:30 WIB. Warga diimbau mengunci seluruh akses pintu dan jendela.',
      mediaUrl: PRESET_MEDIA.abandonedHouse,
      device: 'Twitter for iPhone',
      timestamp: '11:38 PM · 24 Okt 2026',
      viewsCount: '48.2K',
      repostsCount: '1.4K',
      quotesCount: '320',
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
      caption: 'Katanya villa ini ada penjaganya... tapi kok sunyi banget ya? 🌲🏚️',
      timestamp: '3 JAM YANG LALU',
      commentCount: 'Lihat semua 42 komentar',
    },
    threads: {
      authorName: 'detektif_jalanan',
      handle: 'detektif_jalanan',
      avatar: PRESET_AVATARS.detective,
      verified: false,
      characterId: 'char-detective',
      text: 'Ada rekaman CCTV janggal yang masuk dari villa nomor 4B malam ini. Gerbangnya terbuka sendiri.',
      mediaUrl: PRESET_MEDIA.cctvEvidence,
      timestamp: '10m',
      likesCount: '348',
      repliesCount: '52',
      repostsCount: '18',
      hasReply: true,
      replyAuthorName: 'rian_aditya',
      replyAvatar: PRESET_AVATARS.mysteriousMan,
      replyText: 'Tunggu... itu gerbang villa tempat aku menginap!',
      replyTimestamp: '2m',
    },
  },
  {
    id: 'slide-2',
    title: 'Bukti CCTV Misterius',
    platform: 'whatsapp',
    themeMode: 'dark',
    statusBar: {
      show: true,
      time: '23:47',
      batteryLevel: 26,
      signalType: '5G',
      carrier: 'Telkomsel',
    },
    notification: {
      enabled: false,
      platform: 'whatsapp',
      title: 'Sarah',
      message: 'Rian, angkat teleponku sekarang!',
      time: '1m lalu',
      avatar: PRESET_AVATARS.girlFriend,
      characterId: 'char-sarah',
    },
    whatsapp: {
      contactName: '+62 812-9900-XXXX',
      avatar: PRESET_AVATARS.unknownContact,
      status: 'mengetik...',
      showCallButtons: true,
      characterId: 'char-stranger',
      messages: [
        {
          id: 'm1',
          sender: 'them',
          type: 'text',
          text: 'Aku tahu kamu sedang sendirian di lantai dua.',
          time: '23:45',
          status: 'read',
          characterId: 'char-stranger',
        },
        {
          id: 'm2',
          sender: 'me',
          type: 'text',
          text: 'SIAPA KAMU?! Jangan main-main ya, aku panggil polisi sekarang!',
          time: '23:46',
          status: 'read',
          characterId: 'char-rian',
        },
        {
          id: 'm3',
          sender: 'me',
          type: 'voice',
          text: 'Voice message',
          time: '23:46',
          status: 'read',
          voiceDuration: '0:14',
          isPlayed: true,
          characterId: 'char-rian',
        },
        {
          id: 'm4',
          sender: 'them',
          type: 'image',
          text: 'Lihat ke arah kamera taman sekarang.',
          time: '23:47',
          status: 'read',
          mediaUrl: PRESET_MEDIA.cctvEvidence,
          characterId: 'char-stranger',
        },
      ],
    },
    instagramDm: {
      contactName: 'Sarah Amanda',
      handle: 'sarahamanda',
      avatar: PRESET_AVATARS.girlFriend,
      verified: false,
      activeStatus: 'Online',
      characterId: 'char-sarah',
      messages: [
        {
          id: 'ig-1',
          sender: 'them',
          type: 'text',
          text: 'Rian! Cepat kunci pintu!',
          time: '23:46',
        },
      ],
    },
    twitter: {
      authorName: 'Metropolis News Radar',
      handle: 'MetropolisRadar',
      avatar: PRESET_AVATARS.verifiedBrand,
      verified: true,
      verifiedType: 'blue',
      characterId: 'char-news',
      text: '⚠️ PERINGATAN DARURAT: Sosok mencurigakan dilaporkan berkeliaran di sekitar Kompleks Villa Pine Hills pukul 23:30 WIB.',
      mediaUrl: PRESET_MEDIA.abandonedHouse,
      device: 'Twitter for iPhone',
      timestamp: '11:38 PM · 24 Okt 2026',
      viewsCount: '54.2K',
      repostsCount: '2.1K',
      quotesCount: '410',
      likesCount: '7.8K',
      bookmarksCount: '1.1K',
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
      caption: 'Katanya villa ini ada penjaganya... tapi kok sunyi banget ya? 🌲🏚️',
      timestamp: '3 JAM YANG LALU',
    },
    threads: {
      authorName: 'detektif_jalanan',
      handle: 'detektif_jalanan',
      avatar: PRESET_AVATARS.detective,
      verified: false,
      characterId: 'char-detective',
      text: 'Ada rekaman CCTV janggal yang masuk dari villa nomor 4B malam ini. Gerbangnya terbuka sendiri.',
      mediaUrl: PRESET_MEDIA.cctvEvidence,
      timestamp: '12m',
      likesCount: '490',
      repliesCount: '68',
      repostsCount: '30',
      hasReply: true,
    },
  },
  {
    id: 'slide-3',
    title: 'Suspense Banner Saat Buka Feed',
    platform: 'instagram-feed',
    themeMode: 'dark',
    statusBar: {
      show: true,
      time: '23:49',
      batteryLevel: 24,
      signalType: '5G',
      carrier: 'Telkomsel',
    },
    notification: {
      enabled: true,
      platform: 'whatsapp',
      title: '+62 812-9900-XXXX',
      message: 'Langkah kakiku sudah ada di tangga bawah.',
      time: 'Baru saja',
      avatar: PRESET_AVATARS.mysteriousMan,
      characterId: 'char-stranger',
    },
    whatsapp: {
      contactName: '+62 812-9900-XXXX',
      avatar: PRESET_AVATARS.unknownContact,
      status: 'online',
      showCallButtons: true,
      characterId: 'char-stranger',
      messages: [],
    },
    instagramDm: {
      contactName: 'Sarah Amanda',
      handle: 'sarahamanda',
      avatar: PRESET_AVATARS.girlFriend,
      verified: false,
      activeStatus: 'Online',
      characterId: 'char-sarah',
      messages: [],
    },
    twitter: {
      authorName: 'Polres Metro Tanggap',
      handle: 'HumasPolresMetro',
      avatar: PRESET_AVATARS.verifiedBrand,
      verified: true,
      verifiedType: 'blue',
      characterId: 'char-news',
      text: 'Tim patroli presisi sedang meluncur ke area Villa Pine Hills setelah menerima 3 panggilan darurat berturut-turut. Tetap berada di tempat aman.',
      mediaUrl: PRESET_MEDIA.documentEvidence,
      device: 'Twitter for iPhone',
      timestamp: '11:48 PM · 24 Okt 2026',
      viewsCount: '124.9K',
      repostsCount: '8.4K',
      quotesCount: '1.2K',
      likesCount: '21.5K',
      bookmarksCount: '3.4K',
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
      caption: 'Katanya villa ini ada penjaganya... tapi kok sunyi banget ya?',
      timestamp: '3 JAM YANG LALU',
    },
    threads: {
      authorName: 'detektif_jalanan',
      handle: 'detektif_jalanan',
      avatar: PRESET_AVATARS.detective,
      verified: false,
      characterId: 'char-detective',
      text: 'Petunjuk baru ditemukan terkait riwayat villa nomor 4B.',
      mediaUrl: PRESET_MEDIA.documentEvidence,
      timestamp: '2m',
      likesCount: '890',
      repliesCount: '112',
      repostsCount: '45',
      hasReply: false,
    },
  },
];

const initialWatermark: PageWatermarkConfig = {
  show: true,
  format: 'title_and_page',
  useProjectTitle: true,
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
  resetProject: () => void;
  currentSlideIndex: number;
}

const StoryContext = createContext<StoryContextType | null>(null);

export const StoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projectTitle, setProjectTitle] = useState<string>('Misteri Villa Pine Hills');
  
  // Page number watermark badge state
  const [watermark, setWatermark] = useState<PageWatermarkConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoryProject = JSON.parse(saved);
        if (parsed.watermark) return parsed.watermark;
      }
    } catch (e) {
      console.error(e);
    }
    return initialWatermark;
  });

  const [characters, setCharacters] = useState<Character[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoryProject = JSON.parse(saved);
        if (parsed.characters && parsed.characters.length > 0) {
          return parsed.characters;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return createInitialCharacters();
  });

  const [slides, setSlides] = useState<Slide[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoryProject = JSON.parse(saved);
        if (parsed.slides && parsed.slides.length > 0) {
          return parsed.slides;
        }
      }
    } catch (e) {
      console.error('Failed to load project from localStorage:', e);
    }
    return createInitialSlides();
  });

  const [activeSlideId, setActiveSlideId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoryProject = JSON.parse(saved);
        if (parsed.activeSlideId) return parsed.activeSlideId;
      }
    } catch (e) {
      console.error(e);
    }
    return 'slide-1';
  });

  useEffect(() => {
    if (!slides.some(s => s.id === activeSlideId)) {
      if (slides.length > 0) {
        setActiveSlideId(slides[0].id);
      }
    }
  }, [slides, activeSlideId]);

  useEffect(() => {
    try {
      const project: StoryProject = {
        title: projectTitle,
        activeSlideId,
        watermark,
        characters,
        slides,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
    } catch (e) {
      console.error('Failed to save project to localStorage:', e);
    }
  }, [projectTitle, activeSlideId, watermark, characters, slides]);

  const activeSlide = slides.find(s => s.id === activeSlideId) || slides[0] || createInitialSlides()[0];
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
    
    // Merge detected characters with existing ones
    setCharacters(prev => {
      const existingNames = new Set(prev.map(c => c.name.toLowerCase()));
      const newChars = parsed.characters.filter(c => !existingNames.has(c.name.toLowerCase()));
      return [...prev, ...newChars];
    });

    setSlides(parsed.slides);
    setActiveSlideId(parsed.slides[0].id);
  }, []);

  const resetProject = useCallback(() => {
    if (window.confirm('Reset seluruh slide dan pemeran ke template awal misteri?')) {
      const initialSlides = createInitialSlides();
      const initialChars = createInitialCharacters();
      setSlides(initialSlides);
      setCharacters(initialChars);
      setWatermark(initialWatermark);
      setActiveSlideId('slide-1');
      setProjectTitle('Misteri Villa Pine Hills');
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

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
        resetProject,
        currentSlideIndex,
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
