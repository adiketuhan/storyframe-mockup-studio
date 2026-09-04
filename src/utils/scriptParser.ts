import type { Slide, PlatformType, WAMessage, Character } from '../types/story';
import { PRESET_AVATARS, PRESET_MEDIA } from './imageUtils';
import { incrementTimeString } from './timeUtils';

export interface ParsedStoryResult {
  projectTitle: string;
  characters: Character[];
  slides: Slide[];
}

export const SAMPLE_SCRIPT_TEMPLATE = `Pemeran 1  "TukangSoun galek" @reneosound
pemeran2 "Mas Jagad" @imutnyojag4d

Scene 1 (wa)
Selamat pagi mas
mau tanya tentang sewa sound

pagi juga mas
ada yang bisa saya bantu?

scene 2 (wa)
jadi gini mas saya mau sewa soun untuk nikahan apa bisa?
bisa banget mas, untuk tanggal berapa?

scene 3 (twitter)
Alhamdulillah akhirnya ada yang mau menggenapi list jadwal horeg, semoga bisa lekas budal umroh #rezeki

scene 4 (thread)
akhirnya nemu Tukang sound yang humble serta responsip, semoga bisa deal sampai hari H

scene 5 (wa)
vn
siap mas, kalua masalah DP bisa kita bicarakan nantinya, yang penting speknya bisa dipahami terlebih dahulu
oiya itu untuk inddor atau aoutdoor ya mas?

Scene 6 (wa)
vn
hehhe kalua itu terserah dari yang tuan rumah mas, kami speknya komplit, mau indoor atau outdorr gasss pokoknya
tapi anu mas duh gimana ya.....

Scene 7 (twitter)
waduh kok ada kata "tapi" nya, wah perasaaanku mulai ndak enak nih...

Scene 8 (wa)
(deleted)
anu mas, tanggal segitu genset utama kami lagi disewa acara karnaval desa sebelah...
waduh terus gimana mas solusinya??

Scene 9 (wa)
[BLOKIR]: Anda telah memblokir kontak ini. Ketuk untuk membuka blokir.
THEM: maaf mas kami cancel sepihak yaa
ME: (system: 🔒 Kontak ini telah diblokir.)

Scene 10 (thread)
duh pelajaran hari ini, cari vendor itu harus yang fix dari awal, jangan kena PHP h-seminggu gini wkwk. Tetap sabar dan ikhlas!
`;

export const AI_MASTER_PROMPT_10_SCENES = `Tolong buatkan naskah cerita bergambar (storyboard carousel) 10 Scene yang viral, seru, dan emosional dalam format teks baku di bawah ini.

FORMAT WAJIB YANG HARUS DIIKUTI (JANGAN UBAH STRUKTUR KATA KUNCI):
Pemeran 1 "[Nama Lawan Bicara]" @[handle1]
Pemeran 2 "[Nama Tokoh Utama (Saya)]" @[handle2]

Scene 1 (wa)
[Pesan pembuka / sapaan dari Pemeran 1]

[Balasan dari Pemeran 2]

Scene 2 (wa)
[Kelanjutan obrolan yang mulai mendalam]
[Tanggapan / penawaran]

Scene 3 (twitter)
[Tweet curhatan singkat / reaksi sudut pandang Pemeran 1 di X/Twitter]

Scene 4 (thread)
[Utas cerita opini / latar belakang dari Pemeran 2 di Threads]

Scene 5 (wa)
vn
[Pesan penjelasan suara (Voice Note) dan obrolan detail]

Scene 6 (wa)
vn
[Mulai muncul kejanggalan / drama / alasan aneh]
[Pernyataan yang memancing kecurigaan]

Scene 7 (twitter)
[Tweet rasa panik / curiga / kekesalan dari Pemeran 2]

Scene 8 (wa)
(deleted)
[Pesan dihapus dan puncak konflik / alasan pembatalan / pengakuan]
[Reaksi terkejut]

Scene 9 (wa)
[BLOKIR]: Anda telah memblokir kontak ini. Ketuk untuk membuka blokir.
THEM: [Pesan terakhir sebelum diblokir]
ME: (system: 🔒 Kontak ini telah diblokir.)

Scene 10 (thread)
[Kesimpulan akhir cerita, hikmah / punchline penutup yang mengundang interaksi di Threads]

---
Tema Cerita: [Tuliskan tema yang diinginkan, misal: Drama Rental Sound / Mantan Ngajak Balikan / Pelanggan Olshop Absurd / Horor Villa Angker]`;

/**
 * Universal Regex & Natural Language Script Parser
 * Parses both natural script formats (Scene 1 (wa), Pemeran 1 "...", empty-line dialogue groups)
 * and structured bracket tags ([SLIDE 1 - WA], [KONTAK], THEM:, ME:).
 */
export function parseScriptToStory(rawScript: string): ParsedStoryResult {
  const lines = rawScript.split(/\r?\n/);
  
  let projectTitle = 'Cerita StoryFrame';
  let defaultStartTime = '09:00';
  const detectedCharactersMap = new Map<string, Character>();
  const parsedCharactersList: Character[] = [];

  // Helper to register character
  const registerChar = (name: string, handle: string, roleLabel: string, isMe = false): Character => {
    const cleanName = name.replace(/["']/g, '').trim();
    const cleanHandle = handle.replace(/[@"']/g, '').trim() || cleanName.toLowerCase().replace(/\s+/g, '_');
    const existing = detectedCharactersMap.get(cleanName.toLowerCase());
    if (existing) return existing;

    const charId = `char-${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_') || Date.now()}`;
    const avatar = cleanName.toLowerCase().includes('cewe') || cleanName.toLowerCase().includes('sarah') || cleanName.toLowerCase().includes('wanita') || cleanName.toLowerCase().includes('mantan')
      ? PRESET_AVATARS.girlFriend
      : cleanName.includes('+62') || cleanName.toLowerCase().includes('misterius') || cleanName.toLowerCase().includes('peneror')
      ? PRESET_AVATARS.unknownContact
      : cleanName.toLowerCase().includes('radar') || cleanName.toLowerCase().includes('berita') || cleanName.toLowerCase().includes('news')
      ? PRESET_AVATARS.verifiedBrand
      : cleanName.toLowerCase().includes('sound') || cleanName.toLowerCase().includes('detektif')
      ? PRESET_AVATARS.detective
      : PRESET_AVATARS.mysteriousMan;

    const newChar: Character = {
      id: charId,
      name: cleanName,
      handle: cleanHandle,
      avatar,
      roleLabel,
      colorTag: isMe ? 'emerald' : 'indigo',
      verified: cleanName.toLowerCase().includes('official') || cleanName.toLowerCase().includes('radar'),
      phoneOrStatus: 'online',
      isMe,
    };

    detectedCharactersMap.set(cleanName.toLowerCase(), newChar);
    parsedCharactersList.push(newChar);
    return newChar;
  };

  // Phase 1: Extract Characters at top
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const charMatch = trimmed.match(/^(?:pemeran|tokoh|karakter|actor|cast)\s*(\d+)?\s*[:=]?\s*["“]([^"”]+)["”]\s*(?:@?([A-Za-z0-9_.-]+))?/i);
    if (charMatch) {
      const idx = charMatch[1] ? parseInt(charMatch[1], 10) : parsedCharactersList.length + 1;
      const charName = charMatch[2].trim();
      const charHandle = charMatch[3] ? charMatch[3].trim() : charName.toLowerCase().replace(/\s+/g, '_');
      const isMe = idx === 2; // Default: Pemeran 2 is "Saya"
      const role = isMe ? 'Saya (Tokoh Utama)' : `Lawan Bicara (Pemeran ${idx})`;
      registerChar(charName, charHandle, role, isMe);
    }
  }

  // Ensure fallback characters if none found
  let charThem = parsedCharactersList.find(c => !c.isMe);
  let charMe = parsedCharactersList.find(c => c.isMe);

  if (!charThem) {
    charThem = registerChar('Target Kontak', 'target_kontak', 'Lawan Bicara', false);
  }
  if (!charMe) {
    charMe = registerChar('Saya', 'saya_cerita', 'Tokoh Utama (Saya)', true);
  }

  // Phase 2: Split Raw Text into Scene Chunks
  interface RawSceneChunk {
    rawHeader: string;
    platform: PlatformType;
    slideNumber: number;
    lines: string[];
  }

  const sceneChunks: RawSceneChunk[] = [];
  let currentChunk: RawSceneChunk | null = null;
  let slideCounter = 1;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Check Scene Header: e.g. "Scene 1 (wa)", "scene 2 (twitter)", "Scene 3 (thread)", "[SLIDE 1 - WHATSAPP]"
    const sceneMatch = trimmed.match(/^(?:(?:scene|slide|bagian|part)\s*(\d+)?\s*(?:\(([^)]+)\)|-\s*([A-Za-z0-9_]+))?|\[SLIDE\s*(\d+)?\s*(?:-\s*([A-Za-z0-9_]+))?\])/i);

    if (sceneMatch) {
      const numStr = sceneMatch[1] || sceneMatch[4];
      const platformRaw = (sceneMatch[2] || sceneMatch[3] || sceneMatch[5] || 'wa').toLowerCase().trim();
      const slideNum = numStr ? parseInt(numStr, 10) : slideCounter;
      slideCounter = Math.max(slideCounter, slideNum) + 1;

      let platform: PlatformType = 'whatsapp';
      if (platformRaw.includes('twitter') || platformRaw.includes('tweet') || platformRaw.includes(' x') || platformRaw === 'x') {
        platform = 'twitter';
      } else if (platformRaw.includes('thread')) {
        platform = 'threads';
      } else if (platformRaw.includes('ig feed') || platformRaw.includes('instagram feed') || platformRaw.includes('feed')) {
        platform = 'instagram-feed';
      } else if (platformRaw.includes('ig dm') || platformRaw.includes('instagram dm') || platformRaw.includes('dm')) {
        platform = 'instagram-dm';
      } else {
        platform = 'whatsapp';
      }

      if (currentChunk) {
        sceneChunks.push(currentChunk);
      }

      currentChunk = {
        rawHeader: trimmed,
        platform,
        slideNumber: slideNum,
        lines: [],
      };
      continue;
    }

    if (currentChunk) {
      currentChunk.lines.push(rawLine);
    }
  }

  if (currentChunk) {
    sceneChunks.push(currentChunk);
  }

  // Phase 3: Build Slides from Scene Chunks
  const slides: Slide[] = [];
  let currentTime = defaultStartTime;

  if (sceneChunks.length > 0) {
    projectTitle = `Cerita ${charThem.name} & ${charMe.name}`;

    for (let sIdx = 0; sIdx < sceneChunks.length; sIdx++) {
      const chunk = sceneChunks[sIdx];
      const slideId = `slide-${chunk.slideNumber || (sIdx + 1)}`;
      const slideTitle = `Slide ${chunk.slideNumber || (sIdx + 1)}`;

      // Time progression per scene
      if (sIdx > 0) {
        currentTime = incrementTimeString(currentTime, 2);
      }

      const slide: Slide = {
        id: slideId,
        title: slideTitle,
        platform: chunk.platform,
        themeMode: 'dark',
        statusBar: {
          show: true,
          time: currentTime,
          batteryLevel: Math.max(10, 88 - sIdx * 2),
          isCharging: false,
          signalType: '5G',
          carrier: 'Telkomsel',
        },
        notification: {
          enabled: false,
          platform: 'whatsapp',
          title: charThem.name,
          message: 'Pesan baru...',
          time: 'Baru saja',
          avatar: charThem.avatar,
        },
        whatsapp: {
          contactName: charThem.name,
          avatar: charThem.avatar,
          status: 'online',
          showCallButtons: true,
          characterId: charThem.id,
          messages: [],
        },
        instagramDm: {
          contactName: charThem.name,
          handle: charThem.handle,
          avatar: charThem.avatar,
          verified: !!charThem.verified,
          activeStatus: 'Online',
          characterId: charThem.id,
          messages: [],
        },
        twitter: {
          authorName: charThem.name,
          handle: charThem.handle,
          avatar: charThem.avatar,
          verified: !!charThem.verified,
          verifiedType: 'blue',
          characterId: charThem.id,
          text: '',
          device: 'Twitter for iPhone',
          timestamp: `${currentTime} · Hari Ini`,
          viewsCount: '1.2K',
          repostsCount: '45',
          quotesCount: '12',
          likesCount: '340',
          bookmarksCount: '89',
        },
        instagramFeed: {
          authorName: charThem.handle,
          avatar: charThem.avatar,
          location: 'Indonesia',
          verified: !!charThem.verified,
          characterId: charThem.id,
          mediaUrl: PRESET_MEDIA.abandonedHouse,
          isLiked: false,
          likesCount: '320 suka',
          caption: '',
          timestamp: '1 JAM YANG LALU',
        },
        threads: {
          authorName: charMe.handle,
          handle: charMe.handle,
          avatar: charMe.avatar,
          verified: !!charMe.verified,
          characterId: charMe.id,
          text: '',
          timestamp: '2m',
          likesCount: '84',
          repliesCount: '12',
          repostsCount: '4',
          hasReply: false,
        },
      };

      // Process content inside chunk
      if (chunk.platform === 'whatsapp' || chunk.platform === 'instagram-dm') {
        const messages: WAMessage[] = [];
        let currentSpeaker: 'them' | 'me' = 'them';
        let currentParagraphLines: string[] = [];

        const flushParagraph = () => {
          if (currentParagraphLines.length === 0) return;

          let msgType: 'text' | 'voice' | 'image' | 'deleted' | 'system' = 'text';
          let fullText = currentParagraphLines.join('\n').trim();

          if (/^vn\b|^voice note/i.test(fullText)) {
            msgType = 'voice';
            fullText = fullText.replace(/^vn\b|^voice note[:\s]*/i, '').trim() || 'Voice Message';
          } else if (/^\(deleted\)|\(pesan dihapus\)/i.test(fullText)) {
            msgType = 'deleted';
            fullText = 'Pesan ini telah dihapus';
          } else if (/^\(system:|^\[BLOKIR\]/i.test(fullText)) {
            msgType = 'system';
            fullText = fullText.replace(/^\(system:|\)$|^\[BLOKIR\]:?/gi, '').trim();
          }

          if (fullText) {
            messages.push({
              id: `m-${messages.length + 1}-${Date.now()}`,
              sender: currentSpeaker,
              type: msgType,
              text: fullText,
              time: currentTime,
              status: 'read',
              voiceDuration: msgType === 'voice' ? '0:14' : undefined,
            });
          }

          currentParagraphLines = [];
        };

        for (const line of chunk.lines) {
          const trimmed = line.trim();

          // Check block banner tag
          if (/^\[BLOKIR\]/i.test(trimmed)) {
            slide.whatsapp.isBlocked = true;
            slide.whatsapp.blockedNoticeText = 'Anda telah memblokir kontak ini. Ketuk untuk membuka blokir.';
            slide.instagramDm.isBlocked = true;
            continue;
          }

          // Check explicit speaker tags
          if (/^THEM:|^LAWAN:/i.test(trimmed)) {
            flushParagraph();
            currentSpeaker = 'them';
            currentParagraphLines.push(trimmed.replace(/^THEM:|^LAWAN:/i, '').trim());
            continue;
          }
          if (/^ME:|^SAYA:/i.test(trimmed)) {
            flushParagraph();
            currentSpeaker = 'me';
            currentParagraphLines.push(trimmed.replace(/^ME:|^SAYA:/i, '').trim());
            continue;
          }

          // Empty line indicates alternate speaker turn in natural chat scripts
          if (!trimmed) {
            flushParagraph();
            currentSpeaker = currentSpeaker === 'them' ? 'me' : 'them';
            continue;
          }

          currentParagraphLines.push(trimmed);
        }

        flushParagraph();

        if (messages.length === 0) {
          messages.push({
            id: `m-default-${Date.now()}`,
            sender: 'them',
            type: 'text',
            text: '...',
            time: currentTime,
            status: 'read',
          });
        }

        slide.whatsapp.messages = messages;
        slide.instagramDm.messages = messages.map(m => ({
          id: m.id,
          sender: m.sender,
          type: m.type === 'voice' ? 'text' : (m.type as any),
          text: m.text,
          time: m.time,
        }));
      } else if (chunk.platform === 'twitter') {
        const bodyText = chunk.lines.map(l => l.trim()).filter(Boolean).join('\n');
        slide.twitter.text = bodyText || 'Tweet terbaru...';
      } else if (chunk.platform === 'threads') {
        const bodyText = chunk.lines.map(l => l.trim()).filter(Boolean).join('\n');
        slide.threads.text = bodyText || 'Utas terbaru...';
      } else if (chunk.platform === 'instagram-feed') {
        const bodyText = chunk.lines.map(l => l.trim()).filter(Boolean).join('\n');
        slide.instagramFeed.caption = bodyText || 'Caption terbaru...';
      }

      slides.push(slide);
    }
  }

  return {
    projectTitle,
    characters: parsedCharactersList.length > 0 ? parsedCharactersList : [charThem, charMe],
    slides,
  };
}
