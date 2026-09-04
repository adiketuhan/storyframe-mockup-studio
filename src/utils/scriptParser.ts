import type { Slide, PlatformType, WAMessage, Character, TitleCardData, TransitionCardData, WhatsAppStatusData } from '../types/story';
import { PRESET_AVATARS, PRESET_MEDIA } from './imageUtils';
import { incrementTimeString } from './timeUtils';

export interface ParsedStoryResult {
  projectTitle: string;
  characters: Character[];
  slides: Slide[];
}

export const SAMPLE_SCRIPT_TEMPLATE = `Pemeran 1  "TukangSoun galek" @reneosound
pemeran2 "Mas Jagad" @imutnyojag4d

Scene 1 (cover)
[JUDUL]: Rental Sound Berujung Drama Horeg
[SUBTITLE]: Kisah nyata pesanan sound hajatan yang mendadak penuh misteri dan pembatalan sepihak...
[BADGE]: KISAH NYATA • VIRAL

Scene 2 (wa)
Selamat pagi mas
mau tanya tentang sewa sound untuk tanggal 12 bulan depan

pagi juga mas
bisa banget mas, ada yang bisa saya bantu untuk speknya?

Scene 3 (twitter)
Alhamdulillah akhirnya ada yang mau menggenapi list jadwal horeg, semoga bisa lekas budal umroh #rezeki

Scene 4 (wa status)
Alhamdulillah deal satu jadwal lagi untuk hajatan bulan depan. Berkah lancar jaya! 🤲🔊

Scene 5 (thread)
akhirnya nemu Tukang sound yang humble serta responsip, semoga bisa deal aman sampai hari H

Scene 6 (wa)
vn
siap mas, kalau masalah DP bisa kita bicarakan nantinya, yang penting speknya bisa dipahami terlebih dahulu
[GAMBAR: Truk pickup muat tumpukan sound system horeg di jalan desa malam hari]
Ini mas armada kami sudah mulai dipacking!

Scene 7 (jeda)
[TIMESKIP]: 3 HARI MENJELANG H-1...
[WAKTU]: Pukul 19:45 WIB
Keesokan harinya, Mas Jagad mendapat kabar mengejutkan saat sedang mengecek lokasi panggung...

Scene 8 (wa)
(deleted)
anu mas, tanggal segitu genset utama kami lagi ditarik acara karnaval desa sebelah...
waduh terus gimana mas solusinya?? panggung udah berdiri!

Scene 9 (wa)
[BLOKIR]: Anda telah memblokir kontak ini. Ketuk untuk membuka blokir.
THEM: maaf mas kami cancel sepihak yaa
ME: (system: 🔒 Kontak ini telah diblokir.)

Scene 10 (thread)
duh pelajaran mahal hari ini, cari vendor sound itu harus yang berani teken kontrak, jangan kena PHP h-seminggu gini wkwk. Tetap sabar dan ikhlas!
`;

export const AI_MASTER_PROMPT_10_SCENES = `Tolong buatkan naskah cerita bergambar (storyboard carousel) 10 Scene yang viral, seru, dramatis, dan emosional dalam format teks baku di bawah ini.

FORMAT WAJIB YANG HARUS DIIKUTI (JANGAN UBAH STRUKTUR KATA KUNCI):
Pemeran 1 "[Nama Lawan Bicara]" @[handle1]
Pemeran 2 "[Nama Tokoh Utama (Saya)]" @[handle2]

Scene 1 (cover)
[JUDUL]: [Judul Utama Cerita yang Memancing Rasa Penasaran / Clickbait Elegan]
[SUBTITLE]: [Sinopsis singkat 1-2 kalimat pengantar cerita]
[BADGE]: KISAH NYATA • PART 1

Scene 2 (wa)
[Pesan pembuka / sapaan awal dari Pemeran 1]

[Balasan awal dari Pemeran 2]

Scene 3 (twitter)
[Tweet reaksi / sudut pandang awal di X/Twitter]

Scene 4 (wa status)
[Status WhatsApp singkat yang berkaitan dengan alur cerita]

Scene 5 (thread)
[Utas opini / curhatan latar belakang dari Pemeran 2 di Threads]

Scene 6 (wa)
vn
[Pesan penjelasan suara (Voice Note) dan obrolan detail]
[GAMBAR: deskripsi foto bukti/kejadian nyata, misal: foto truk sound system di jalan desa malam hari]
[Keterangan foto penguat cerita]

Scene 7 (jeda)
[TIMESKIP]: 3 HARI KEMUDIAN...
[WAKTU]: Pukul 21:15 WIB
[Narasi jembatan cerita yang membangun ketegangan / perubahan situasi]

Scene 8 (wa)
(deleted)
[Pesan dihapus dan alasan pembatalan / puncak kejanggalan]
[Reaksi terkejut dari tokoh utama]

Scene 9 (wa)
[BLOKIR]: Anda telah memblokir kontak ini. Ketuk untuk membuka blokir.
THEM: [Pesan terakhir sebelum diblokir]
ME: (system: 🔒 Kontak ini telah diblokir.)

Scene 10 (thread)
[Kesimpulan akhir cerita, hikmah / punchline penutup yang mengundang interaksi di Threads]

---
Tema Cerita: [Tuliskan tema yang diinginkan, misal: Drama Rental Sound / Mantan Ngajak Balikan / Pelanggan Olshop Absurd / Horor Villa Angker / Tetangga Julid]`;

/**
 * Helper to advance time realistically by random dynamic minutes
 */
function advanceTimeRandomly(timeStr: string, minMinutes: number, maxMinutes: number): string {
  const delta = Math.floor(Math.random() * (maxMinutes - minMinutes + 1)) + minMinutes;
  return incrementTimeString(timeStr, Math.max(1, delta));
}

/**
 * Helper to pick realistic preset media based on context keywords
 */
function selectPresetMedia(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('dokumen') || lower.includes('kuitansi') || lower.includes('struk') || lower.includes('transfer') || lower.includes('surat') || lower.includes('rahasia')) {
    return PRESET_MEDIA.documentEvidence;
  }
  if (lower.includes('villa') || lower.includes('rumah') || lower.includes('kamar') || lower.includes('gelap') || lower.includes('pohon')) {
    return PRESET_MEDIA.abandonedHouse;
  }
  return PRESET_MEDIA.cctvEvidence;
}

/**
 * Universal Regex & Natural Language Script Parser
 * Parses both natural script formats (Scene 1 (wa), Pemeran 1 "...", empty-line dialogue groups)
 * and structured bracket tags ([SLIDE 1 - WA], [KONTAK], THEM:, ME:).
 */
export function parseScriptToStory(rawScript: string): ParsedStoryResult {
  const lines = rawScript.split(/\r?\n/);
  
  let projectTitle = 'Cerita StoryFrame';
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

    // Check Scene Header: e.g. "Scene 1 (cover)", "Scene 2 (wa)", "Scene 4 (wa status)", "Scene 7 (jeda)", "scene 3 (twitter)", "[SLIDE 1 - WA]"
    const sceneMatch = trimmed.match(/^(?:(?:scene|slide|bagian|part)\s*(\d+)?\s*(?:\(([^)]+)\)|-\s*([A-Za-z0-9_ -]+))?|\[SLIDE\s*(\d+)?\s*(?:-\s*([A-Za-z0-9_ -]+))?\])/i);

    if (sceneMatch) {
      const numStr = sceneMatch[1] || sceneMatch[4];
      const platformRaw = (sceneMatch[2] || sceneMatch[3] || sceneMatch[5] || 'wa').toLowerCase().trim();
      const slideNum = numStr ? parseInt(numStr, 10) : slideCounter;
      slideCounter = Math.max(slideCounter, slideNum) + 1;

      let platform: PlatformType = 'whatsapp';
      if (platformRaw.includes('cover') || platformRaw.includes('judul') || platformRaw.includes('title') || platformRaw.includes('opening')) {
        platform = 'title-card';
      } else if (platformRaw.includes('status') || platformRaw.includes('sw') || platformRaw.includes('wa-status') || platformRaw.includes('story')) {
        platform = 'whatsapp-status';
      } else if (platformRaw.includes('jeda') || platformRaw.includes('narasi') || platformRaw.includes('timeskip') || platformRaw.includes('time-skip') || platformRaw.includes('transisi') || platformRaw.includes('transition') || platformRaw.includes('break')) {
        platform = 'transition-card';
      } else if (platformRaw.includes('twitter') || platformRaw.includes('tweet') || platformRaw.includes(' x') || platformRaw === 'x') {
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

  // Phase 3: Build Slides from Scene Chunks with Continuous Chat History Accumulation
  const slides: Slide[] = [];
  let currentTime = '09:00';
  let activeThemChar = charThem;
  let activeMeChar = charMe;

  // Map to store cumulative conversation history per character contact
  const conversationHistoryMap = new Map<string, WAMessage[]>();

  if (sceneChunks.length > 0) {
    projectTitle = `Cerita ${charThem.name} & ${charMe.name}`;

    for (let sIdx = 0; sIdx < sceneChunks.length; sIdx++) {
      const chunk = sceneChunks[sIdx];
      const slideId = `slide-${chunk.slideNumber || (sIdx + 1)}`;
      const slideTitle = `Slide ${chunk.slideNumber || (sIdx + 1)}`;

      // Check if this scene chunk defines specific characters (e.g. switching chat to Cak Narto)
      for (const line of chunk.lines) {
        const charMatch = line.trim().match(/^(?:pemeran|tokoh|karakter|actor|cast)\s*(\d+)?\s*[:=]?\s*["“]([^"”]+)["”]\s*(?:@?([A-Za-z0-9_.-]+))?/i);
        if (charMatch) {
          const idx = charMatch[1] ? parseInt(charMatch[1], 10) : 1;
          const charName = charMatch[2].trim();
          const charHandle = charMatch[3] ? charMatch[3].trim() : charName.toLowerCase().replace(/\s+/g, '_');
          const isMe = idx === 1 && (charName.toLowerCase().includes('saya') || charName.toLowerCase().includes('operator') || charName.toLowerCase().includes('sound') || charName.toLowerCase().includes('rizki'));
          const reg = registerChar(charName, charHandle, isMe ? 'Saya (Tokoh Utama)' : `Lawan Bicara (${charName})`, isMe);
          if (idx === 2 || !isMe) {
            activeThemChar = reg;
          } else {
            activeMeChar = reg;
          }
        }
      }

      // Realistic Dynamic Time Progression between Scenes
      if (sIdx > 0) {
        const prevPlatform = sceneChunks[sIdx - 1].platform;
        if (chunk.platform === 'transition-card') {
          currentTime = advanceTimeRandomly(currentTime, 15, 45);
        } else if (chunk.platform === 'twitter' || chunk.platform === 'threads' || chunk.platform === 'whatsapp-status' || chunk.platform === 'instagram-feed') {
          currentTime = advanceTimeRandomly(currentTime, 8, 25);
        } else if (prevPlatform === 'whatsapp' && chunk.platform === 'whatsapp') {
          currentTime = advanceTimeRandomly(currentTime, 2, 5);
        } else {
          currentTime = advanceTimeRandomly(currentTime, 4, 12);
        }
      }

      // Check explicit time tag in chunk lines
      for (const l of chunk.lines) {
        const timeMatch = l.match(/^\[(?:WAKTU|JAM|TIME)\]\s*:\s*(?:pukul\s*)?(\d{1,2}[:.]\d{2})/i);
        if (timeMatch) {
          currentTime = timeMatch[1].replace('.', ':').padStart(5, '0');
          break;
        }
      }

      // Realistic battery drain
      const batteryLevel = Math.max(12, Math.min(98, 92 - sIdx * 3 - Math.floor(Math.random() * 2)));

      // Default Title Card Data
      const defaultTitleCard: TitleCardData = {
        mainTitle: `Cerita ${activeThemChar.name}`,
        subtitle: 'Kisah nyata yang tak terduga...',
        badgeText: 'KISAH NYATA • PART 1',
        callToAction: 'Geser ke kanan untuk membaca ➔',
        themeStyle: 'cinematic_dark',
      };

      // Default Transition Card Data
      const defaultTransitionCard: TransitionCardData = {
        timeSkipTitle: 'BEBERAPA SAAT KEMUDIAN...',
        timeBadge: `Pukul ${currentTime} WIB`,
        narrationText: 'Suasana semakin tegang saat kejanggalan mulai terungkap...',
        themeStyle: 'dark_suspense',
      };

      // Default WhatsApp Status Data
      const defaultWhatsAppStatus: WhatsAppStatusData = {
        contactName: activeThemChar.name,
        avatar: activeThemChar.avatar,
        timestamp: `${currentTime}`,
        statusType: 'text',
        text: 'Ada yang seru hari ini... pantau terus!',
        backgroundColor: '#075E54',
        fontStyle: 'sans',
        activeSegmentIndex: 0,
        totalSegments: 3,
        characterId: activeThemChar.id,
      };

      const slide: Slide = {
        id: slideId,
        title: slideTitle,
        platform: chunk.platform,
        themeMode: 'dark',
        statusBar: {
          show: true,
          time: currentTime,
          batteryLevel,
          isCharging: false,
          signalType: '5G',
          carrier: 'Telkomsel',
        },
        notification: {
          enabled: false,
          platform: 'whatsapp',
          title: activeThemChar.name,
          message: 'Pesan baru...',
          time: 'Baru saja',
          avatar: activeThemChar.avatar,
        },
        whatsapp: {
          contactName: activeThemChar.name,
          avatar: activeThemChar.avatar,
          status: 'online',
          showCallButtons: true,
          characterId: activeThemChar.id,
          messages: [],
        },
        whatsappStatus: defaultWhatsAppStatus,
        titleCard: defaultTitleCard,
        transitionCard: defaultTransitionCard,
        instagramDm: {
          contactName: activeThemChar.name,
          handle: activeThemChar.handle,
          avatar: activeThemChar.avatar,
          verified: !!activeThemChar.verified,
          activeStatus: 'Online',
          characterId: activeThemChar.id,
          messages: [],
        },
        twitter: {
          authorName: activeMeChar.name || activeThemChar.name,
          handle: activeMeChar.handle || activeThemChar.handle,
          avatar: activeMeChar.avatar || activeThemChar.avatar,
          verified: !!activeMeChar.verified,
          verifiedType: 'blue',
          characterId: activeMeChar.id,
          text: '',
          device: 'Twitter for iPhone',
          timestamp: `${currentTime} · Hari Ini`,
          viewsCount: `${Math.floor(Math.random() * 40 + 10)}.${Math.floor(Math.random() * 9)}K`,
          repostsCount: `${Math.floor(Math.random() * 300 + 40)}`,
          quotesCount: `${Math.floor(Math.random() * 50 + 10)}`,
          likesCount: `${Math.floor(Math.random() * 3 + 1)}.${Math.floor(Math.random() * 9)}K`,
          bookmarksCount: `${Math.floor(Math.random() * 120 + 20)}`,
        },
        instagramFeed: {
          authorName: activeThemChar.handle,
          avatar: activeThemChar.avatar,
          location: 'Indonesia',
          verified: !!activeThemChar.verified,
          characterId: activeThemChar.id,
          mediaUrl: PRESET_MEDIA.abandonedHouse,
          isLiked: false,
          likesCount: `${Math.floor(Math.random() * 800 + 150)} suka`,
          caption: '',
          timestamp: '1 JAM YANG LALU',
        },
        threads: {
          authorName: activeMeChar.handle,
          handle: activeMeChar.handle,
          avatar: activeMeChar.avatar,
          verified: !!activeMeChar.verified,
          characterId: activeMeChar.id,
          text: '',
          timestamp: '2m',
          likesCount: `${Math.floor(Math.random() * 150 + 30)}`,
          repliesCount: `${Math.floor(Math.random() * 25 + 5)}`,
          repostsCount: `${Math.floor(Math.random() * 10 + 2)}`,
          hasReply: false,
        },
      };

      // Format-Specific Parsers
      if (chunk.platform === 'title-card') {
        let mainTitle = '';
        let subtitle = '';
        let badgeText = 'KISAH NYATA • PART 1';
        let callToAction = 'Geser ke kanan untuk membaca ➔';
        let coverImageUrl: string | undefined = undefined;

        const rawLines = chunk.lines.map(l => l.trim()).filter(Boolean);
        for (const l of rawLines) {
          if (/^\[JUDUL\]|^\[TITLE\]/i.test(l)) {
            mainTitle = l.replace(/^\[(?:JUDUL|TITLE)\]\s*:\s*/i, '').trim();
          } else if (/^\[SUBTITLE\]|^\[SUB\]/i.test(l)) {
            subtitle = l.replace(/^\[(?:SUBTITLE|SUB)\]\s*:\s*/i, '').trim();
          } else if (/^\[BADGE\]|^\[KATEGORI\]/i.test(l)) {
            badgeText = l.replace(/^\[(?:BADGE|KATEGORI)\]\s*:\s*/i, '').trim();
          } else if (/^\[CTA\]|^\[ACTION\]/i.test(l)) {
            callToAction = l.replace(/^\[(?:CTA|ACTION)\]\s*:\s*/i, '').trim();
          } else if (/^\[(?:PROMPT_IMAGE|PROMPT_GAMBAR|GAMBAR|FOTO|IMAGE)\]/i.test(l)) {
            const p = l.replace(/^\[(?:PROMPT_IMAGE|PROMPT_GAMBAR|GAMBAR|FOTO|IMAGE)\]\s*:\s*/i, '').trim();
            coverImageUrl = selectPresetMedia(p);
          } else if (!mainTitle) {
            mainTitle = l;
          } else if (!subtitle) {
            subtitle = l;
          }
        }

        if (mainTitle) {
          slide.titleCard.mainTitle = mainTitle;
          projectTitle = mainTitle;
        }
        if (subtitle) slide.titleCard.subtitle = subtitle;
        if (badgeText) slide.titleCard.badgeText = badgeText;
        if (callToAction) slide.titleCard.callToAction = callToAction;
        if (coverImageUrl) slide.titleCard.coverImageUrl = coverImageUrl;
      } else if (chunk.platform === 'transition-card') {
        let timeSkipTitle = '3 HARI KEMUDIAN...';
        let timeBadge = `Pukul ${currentTime} WIB`;
        const narrationLines: string[] = [];

        for (const line of chunk.lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          if (/^\[TIMESKIP\]|^\[JEDA\]|^\[WAKTU_SKIP\]/i.test(trimmed)) {
            timeSkipTitle = trimmed.replace(/^\[(?:TIMESKIP|JEDA|WAKTU_SKIP)\]\s*:\s*/i, '').trim();
          } else if (/^\[WAKTU\]|^\[JAM\]/i.test(trimmed)) {
            timeBadge = trimmed.replace(/^\[(?:WAKTU|JAM)\]\s*:\s*/i, '').trim();
          } else if (trimmed.toUpperCase() === trimmed && (trimmed.includes('KEMUDIAN') || trimmed.includes('HARI') || trimmed.includes('MALAM') || trimmed.includes('PAGI') || trimmed.includes('SAAT'))) {
            timeSkipTitle = trimmed;
          } else {
            narrationLines.push(trimmed);
          }
        }

        slide.transitionCard.timeSkipTitle = timeSkipTitle;
        slide.transitionCard.timeBadge = timeBadge;
        slide.transitionCard.narrationText = narrationLines.join('\n') || 'Situasi semakin tidak terduga di obrolan berikutnya...';
      } else if (chunk.platform === 'whatsapp-status') {
        const bodyText = chunk.lines.map(l => l.trim()).filter(Boolean).join('\n');
        // Check if image status
        const imgMatch = bodyText.match(/^\[(?:GAMBAR|FOTO|IMAGE|PROMPT_IMAGE|PROMPT_GAMBAR)\]\s*:\s*(.+)$/im);
        if (imgMatch) {
          slide.whatsappStatus.statusType = 'image';
          slide.whatsappStatus.mediaUrl = selectPresetMedia(imgMatch[1].trim());
          slide.whatsappStatus.caption = bodyText.replace(/^\[(?:GAMBAR|FOTO|IMAGE|PROMPT_IMAGE|PROMPT_GAMBAR|KIRIM_GAMBAR)\](?:\s*:\s*.+)?$/gim, '').trim();
        } else {
          slide.whatsappStatus.text = bodyText || 'Story WhatsApp terbaru...';
        }
        slide.whatsappStatus.timestamp = `${currentTime}`;
        slide.whatsappStatus.contactName = activeThemChar.name;
        slide.whatsappStatus.avatar = activeThemChar.avatar;
      } else if (chunk.platform === 'whatsapp' || chunk.platform === 'instagram-dm') {
        const newChunkMessages: WAMessage[] = [];
        let currentSpeaker: 'them' | 'me' = 'them';
        let currentParagraphLines: string[] = [];
        let msgTime = currentTime;

        const flushParagraph = () => {
          if (currentParagraphLines.length === 0) return;

          let msgType: 'text' | 'voice' | 'image' | 'deleted' | 'system' = 'text';
          let fullText = currentParagraphLines.join('\n').trim();
          let mediaUrl: string | undefined = undefined;

          // Check if containing image tag
          if (/\[(?:GAMBAR|FOTO|IMAGE|CCTV|PROMPT_IMAGE|PROMPT_GAMBAR)\]/i.test(fullText) || /^\[KIRIM_GAMBAR\]/i.test(fullText)) {
            msgType = 'image';
            const imgMatch = fullText.match(/\[(?:GAMBAR|FOTO|IMAGE|CCTV|PROMPT_IMAGE|PROMPT_GAMBAR)\]\s*:\s*([^\]\n]+)/i);
            const promptDesc = imgMatch ? imgMatch[1].trim() : fullText.replace(/^\[KIRIM_GAMBAR\]/gi, '').trim();
            mediaUrl = selectPresetMedia(promptDesc);
            fullText = fullText.replace(/^\[KIRIM_GAMBAR\]\s*/gim, '').replace(/\[(?:GAMBAR|FOTO|IMAGE|CCTV|PROMPT_IMAGE|PROMPT_GAMBAR)\]\s*:\s*[^\]\n]+/gi, '').trim();
          } else if (/^vn\b|^voice note/i.test(fullText)) {
            msgType = 'voice';
            fullText = fullText.replace(/^vn\b|^voice note[:\s]*/i, '').trim() || 'Voice Message';
          } else if (/^\(deleted\)|\(pesan dihapus\)/i.test(fullText)) {
            msgType = 'deleted';
            fullText = 'Pesan ini telah dihapus';
          } else if (/^\(system:|^\[BLOKIR\]/i.test(fullText)) {
            msgType = 'system';
            fullText = fullText.replace(/^\(system:|\)$|^\[BLOKIR\]:?/gi, '').trim();
          }

          if (fullText || msgType === 'image') {
            // Incremental realistic dynamic chat time (+1 to +2 min per exchange)
            if (newChunkMessages.length > 0) {
              msgTime = incrementTimeString(msgTime, Math.random() > 0.4 ? 1 : 2);
            }

            newChunkMessages.push({
              id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              sender: currentSpeaker,
              type: msgType,
              text: fullText,
              mediaUrl,
              time: msgTime,
              status: 'read',
              voiceDuration: msgType === 'voice' ? '0:14' : undefined,
            });
          }

          currentParagraphLines = [];
        };

        for (const line of chunk.lines) {
          const trimmed = line.trim();
          if (!trimmed) {
            flushParagraph();
            currentSpeaker = currentSpeaker === 'them' ? 'me' : 'them';
            continue;
          }

          // Ignore character declarations inside chunk lines so they don't appear as text messages
          if (/^(?:pemeran|tokoh|karakter|actor|cast)\s*(\d+)?\s*[:=]?\s*["“]/i.test(trimmed)) {
            continue;
          }

          // Check block banner tag
          if (/^\[BLOKIR\]/i.test(trimmed)) {
            slide.whatsapp.isBlocked = true;
            slide.whatsapp.blockedNoticeText = 'Anda telah memblokir kontak ini. Ketuk untuk membuka blokir.';
            slide.instagramDm.isBlocked = true;
            continue;
          }

          // If line starts with image tags, flush previous text before creating image
          if (/^\[KIRIM_GAMBAR\]|^\[(?:PROMPT_IMAGE|PROMPT_GAMBAR|GAMBAR|FOTO)\]/i.test(trimmed)) {
            flushParagraph();
            currentParagraphLines.push(trimmed);
            flushParagraph();
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

          currentParagraphLines.push(trimmed);
        }

        flushParagraph();

        if (newChunkMessages.length === 0) {
          newChunkMessages.push({
            id: `m-default-${Date.now()}`,
            sender: 'them',
            type: 'text',
            text: '...',
            time: msgTime,
            status: 'read',
          });
        }

        // Feature: Continuous chat progression across consecutive scenes
        const threadKey = (activeThemChar.id || activeThemChar.name || 'default_contact').toLowerCase();
        const priorMessages = conversationHistoryMap.get(threadKey) || [];

        // Combine prior history + new messages
        const allMessages = [...priorMessages, ...newChunkMessages];
        conversationHistoryMap.set(threadKey, allMessages);

        // Update current time to latest message time
        currentTime = msgTime;
        slide.statusBar.time = currentTime;

        slide.whatsapp.messages = allMessages;
        slide.instagramDm.messages = allMessages.map(m => ({
          id: m.id,
          sender: m.sender,
          type: m.type === 'voice' ? 'text' : (m.type as any),
          text: m.text,
          mediaUrl: m.mediaUrl,
          time: m.time,
        }));
      } else if (chunk.platform === 'twitter') {
        const bodyText = chunk.lines.filter(l => !/^(?:pemeran|tokoh)\s*\d+/i.test(l.trim())).map(l => l.trim()).filter(Boolean).join('\n');
        const imgMatch = bodyText.match(/^\[(?:GAMBAR|FOTO|IMAGE|PROMPT_IMAGE)\]\s*:\s*(.+)$/im);
        if (imgMatch) {
          slide.twitter.mediaUrl = selectPresetMedia(imgMatch[1].trim());
          slide.twitter.text = bodyText.replace(/^\[(?:GAMBAR|FOTO|IMAGE|PROMPT_IMAGE)\]\s*:\s*.+$/im, '').trim();
        } else {
          slide.twitter.text = bodyText || 'Tweet terbaru...';
        }
      } else if (chunk.platform === 'threads') {
        const bodyText = chunk.lines.filter(l => !/^(?:pemeran|tokoh)\s*\d+/i.test(l.trim())).map(l => l.trim()).filter(Boolean).join('\n');
        const imgMatch = bodyText.match(/^\[(?:GAMBAR|FOTO|IMAGE|PROMPT_IMAGE)\]\s*:\s*(.+)$/im);
        if (imgMatch) {
          slide.threads.mediaUrl = selectPresetMedia(imgMatch[1].trim());
          slide.threads.text = bodyText.replace(/^\[(?:GAMBAR|FOTO|IMAGE|PROMPT_IMAGE)\]\s*:\s*.+$/im, '').trim();
        } else {
          slide.threads.text = bodyText || 'Utas terbaru...';
        }
      } else if (chunk.platform === 'instagram-feed') {
        const bodyText = chunk.lines.filter(l => !/^(?:pemeran|tokoh)\s*\d+/i.test(l.trim())).map(l => l.trim()).filter(Boolean).join('\n');
        const imgMatch = bodyText.match(/^\[(?:GAMBAR|FOTO|IMAGE|PROMPT_IMAGE)\]\s*:\s*(.+)$/im);
        if (imgMatch) {
          slide.instagramFeed.mediaUrl = selectPresetMedia(imgMatch[1].trim());
          slide.instagramFeed.caption = bodyText.replace(/^\[(?:GAMBAR|FOTO|IMAGE|PROMPT_IMAGE)\]\s*:\s*.+$/im, '').trim();
        } else {
          slide.instagramFeed.caption = bodyText || 'Caption terbaru...';
        }
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
