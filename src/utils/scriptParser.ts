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
ada yang bisa saya bantu?
jadi gini mas saya mau sewa soun untuk nikahan apa bisa?
bisa banget mas, untuk tanggal berapa?

scene 3 (twitter)
Alhamdulillah akhirnya ada yang mau menggenapi list jadwal horeg, semoga bisa lekas budal umroh

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

Scene 8 (Thread)
duh gimana cara ngomongnya ya, bukan perihal nominalnya sih, tapi kan ini acaranya masih lama, semoga beliau bisa memahami kadaanku ini..
`;

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
    const avatar = cleanName.toLowerCase().includes('cewe') || cleanName.toLowerCase().includes('sarah') || cleanName.toLowerCase().includes('wanita')
      ? PRESET_AVATARS.girlFriend
      : cleanName.includes('+62') || cleanName.toLowerCase().includes('misterius')
      ? PRESET_AVATARS.unknownContact
      : cleanName.toLowerCase().includes('radar') || cleanName.toLowerCase().includes('berita')
      ? PRESET_AVATARS.verifiedBrand
      : cleanName.toLowerCase().includes('sound') || cleanName.toLowerCase().includes('audio')
      ? PRESET_AVATARS.detective
      : cleanName.toLowerCase().includes('jagad') || cleanName.toLowerCase().includes('rian') || isMe
      ? PRESET_AVATARS.mysteriousMan
      : PRESET_AVATARS.detective;

    const newChar: Character = {
      id: charId,
      name: cleanName,
      handle: cleanHandle,
      avatar,
      roleLabel,
      colorTag: parsedCharactersList.length === 0 ? 'indigo' : parsedCharactersList.length === 1 ? 'emerald' : 'amber',
      verified: false,
      phoneOrStatus: 'online',
      isMe,
    };

    detectedCharactersMap.set(cleanName.toLowerCase(), newChar);
    parsedCharactersList.push(newChar);
    return newChar;
  };

  // 1. EXTRACT CHARACTERS (Pemeran 1, Pemeran 2, Tokoh, etc.)
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (!l) continue;

    // Check [JUDUL]
    const titleMatch = l.match(/^\[(?:JUDUL|TITLE)\]\s*:\s*(.+)$/i);
    if (titleMatch) {
      projectTitle = titleMatch[1].trim();
      continue;
    }

    // Pattern: Pemeran 1 "TukangSoun galek" @reneosound OR Pemeran 2 "Mas Jagad" @imutnyojag4d
    const pemPattern = /^(?:pemeran|tokoh|karakter|actor|cast)\s*(\d+)?\s*[:=]?\s*["“]([^"”]+)["”]\s*(?:@?([A-Za-z0-9_.-]+))?/i;
    const pemMatch = l.match(pemPattern);
    if (pemMatch) {
      const pNum = pemMatch[1] || `${parsedCharactersList.length + 1}`;
      const pName = pemMatch[2].trim();
      const pHandle = pemMatch[3] ? pemMatch[3].trim() : pName.toLowerCase().replace(/\s+/g, '_');
      const isMe = pNum === '2' || pNum === '1' && parsedCharactersList.length > 0;
      registerChar(pName, pHandle, `Pemeran ${pNum}`, isMe);
      continue;
    }

    // Pattern: Pemeran 1 : Nama (@handle)
    const pemPattern2 = /^(?:pemeran|tokoh|karakter)\s*(\d+)?\s*[:=]\s*([A-Za-z0-9_ ]+)(?:\s*[@(]([A-Za-z0-9_.-]+)\)?)?/i;
    const pemMatch2 = l.match(pemPattern2);
    if (pemMatch2 && !l.toLowerCase().startsWith('scene') && !l.toLowerCase().startsWith('slide')) {
      const pNum = pemMatch2[1] || `${parsedCharactersList.length + 1}`;
      const pName = pemMatch2[2].trim();
      const pHandle = pemMatch2[3] ? pemMatch2[3].trim() : pName.toLowerCase().replace(/\s+/g, '_');
      registerChar(pName, pHandle, `Pemeran ${pNum}`, pNum === '2');
      continue;
    }
  }

  // 2. SPLIT SCRIPT INTO SCENE CHUNKS
  // Recognizes: "Scene 1 (wa)", "scene 2 (wa)", "Scene 3 (twitter)", "Scene 4 (thread)", "[SLIDE 1 - WHATSAPP]", "---"
  const rawSceneChunks: { header: string; content: string[] }[] = [];
  let currentChunkHeader = '';
  let currentChunkLines: string[] = [];

  const sceneHeaderRegex = /^(?:(?:scene|slide|bagian|part)\s*(\d+)?\s*(?:\(([^)]+)\)|-\s*([A-Za-z0-9_]+))?|\[SLIDE\s*(\d+)?\s*(?:-\s*([A-Za-z0-9_]+))?\])/i;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Ignore top character definition lines from becoming scene content
    if (trimmed.match(/^(?:pemeran|tokoh|karakter|actor|cast)\s*\d*/i) && rawSceneChunks.length === 0 && currentChunkHeader === '') {
      continue;
    }
    if (trimmed.match(/^\[(?:JUDUL|TITLE|WAKTU_MULAI)\]/i) && rawSceneChunks.length === 0 && currentChunkHeader === '') {
      continue;
    }

    if (trimmed.startsWith('---') || sceneHeaderRegex.test(trimmed)) {
      if (currentChunkHeader || currentChunkLines.length > 0) {
        rawSceneChunks.push({
          header: currentChunkHeader,
          content: currentChunkLines,
        });
        currentChunkLines = [];
      }
      currentChunkHeader = trimmed.startsWith('---') ? '' : trimmed;
    } else {
      currentChunkLines.push(rawLine);
    }
  }

  if (currentChunkHeader || currentChunkLines.length > 0) {
    rawSceneChunks.push({
      header: currentChunkHeader,
      content: currentChunkLines,
    });
  }

  // Fallback if no scenes found
  if (rawSceneChunks.length === 0) {
    rawSceneChunks.push({
      header: 'Scene 1 (wa)',
      content: lines,
    });
  }

  // If title was default and we have characters, name after them
  if (projectTitle === 'Cerita StoryFrame' && parsedCharactersList.length >= 2) {
    projectTitle = `Cerita ${parsedCharactersList[0].name} & ${parsedCharactersList[1].name}`;
  }

  // 3. PARSE EACH SCENE
  const generatedSlides: Slide[] = [];
  let runningTime = defaultStartTime;

  const p1 = parsedCharactersList[0] || registerChar('Tukang Sound', 'reneosound', 'Pemeran 1', false);
  const p2 = parsedCharactersList[1] || registerChar('Mas Jagad', 'imutnyojag4d', 'Pemeran 2', true);

  rawSceneChunks.forEach((chunk, index) => {
    let platform: PlatformType = 'whatsapp';
    let slideTitle = `Slide ${index + 1}`;
    let slideTime = runningTime;
    let themeMode: 'dark' | 'light' = 'dark';

    // Parse Scene Header (e.g. "Scene 1 (wa)", "scene 3 (twitter)", "scene 4 (thread)")
    const headerMatch = chunk.header.match(sceneHeaderRegex);
    if (headerMatch) {
      const sceneNum = headerMatch[1] || headerMatch[4] || `${index + 1}`;
      slideTitle = `Slide ${sceneNum}`;
      const platStr = (headerMatch[2] || headerMatch[3] || headerMatch[5] || '').toLowerCase().trim();

      if (platStr.includes('twitter') || platStr.includes('tweet') || platStr.includes(' x')) {
        platform = 'twitter';
      } else if (platStr.includes('thread')) {
        platform = 'threads';
      } else if (platStr.includes('feed') || platStr.includes('post') || platStr.includes('ig_feed') || platStr.includes('postingan')) {
        platform = 'instagram-feed';
      } else if (platStr.includes('dm') || platStr.includes('ig_dm') || platStr.includes('inbox')) {
        platform = 'instagram-dm';
      } else {
        platform = 'whatsapp';
      }
    }

    // Default Characters for this Slide
    // In alternating scenes, determine primary poster
    const activePoster = (platform === 'threads' || (index % 2 === 1 && platform === 'twitter')) ? p2 : p1;
    const contactForChat = p1;

    let contactName = contactForChat.name;
    let statusText = 'online';
    let isBlocked = false;
    let blockedNoticeText = 'Anda telah memblokir kontak ini. Ketuk untuk membuka blokir.';
    let mediaUrl = PRESET_MEDIA.abandonedHouse;
    let captionOrPostText = '';
    let isVerified = false;
    let verifiedType: 'blue' | 'gold' | 'none' = 'none';
    let likesCount = '1,420';
    let viewsCount = '12.5K';
    let repostsCount = '340';
    let commentsText = 'Lihat semua 24 komentar';
    let locationTag = 'Jakarta, Indonesia';

    // Notification
    let notificationEnabled = false;
    let notifPlatform: 'whatsapp' | 'instagram' | 'twitter' | 'emergency' | 'messages' = 'whatsapp';
    let notifTitle = 'Peringatan Masuk';
    let notifMsg = 'Ada pesan baru...';
    let notifTime = 'Baru saja';

    const waMessages: WAMessage[] = [];

    // Parse Content Lines
    // Group lines into paragraphs to support alternating bubble dialogue
    const paragraphs: string[][] = [];
    let currentPara: string[] = [];

    for (const rawL of chunk.content) {
      const trimmed = rawL.trim();
      if (!trimmed) {
        if (currentPara.length > 0) {
          paragraphs.push(currentPara);
          currentPara = [];
        }
      } else {
        currentPara.push(trimmed);
      }
    }
    if (currentPara.length > 0) {
      paragraphs.push(currentPara);
    }

    // Platform-specific content parsing
    if (platform === 'twitter' || platform === 'threads' || platform === 'instagram-feed') {
      const allText = chunk.content.map(l => l.trim()).filter(Boolean).join('\n');
      captionOrPostText = allText || 'Update status terbaru...';
    } else {
      // WhatsApp or Instagram DM: Parse Dialogues
      let currentSenderToggle: 'them' | 'me' = 'them';

      paragraphs.forEach((para) => {
        let isVNGroup = false;

        para.forEach((line) => {
          let content = line;

          // Check for [BLOKIR]
          const blockMatch = content.match(/^\[(?:BLOKIR|BLOCK|BLOCKED)\]\s*(?::\s*(.+))?$/i);
          if (blockMatch) {
            isBlocked = true;
            if (blockMatch[1] && blockMatch[1].trim() !== 'ON' && blockMatch[1].trim() !== 'TRUE') {
              blockedNoticeText = blockMatch[1].trim();
            }
            return;
          }

          // Check if line is just "vn" or "voice note"
          if (content.toLowerCase() === 'vn' || content.toLowerCase() === 'voice note' || content.toLowerCase() === '(vn)') {
            isVNGroup = true;
            return;
          }

          let msgType: 'text' | 'image' | 'voice' | 'deleted' | 'system' = 'text';
          let voiceDuration = '0:14';
          let msgMedia: string | undefined = undefined;
          let sender: 'me' | 'them' = currentSenderToggle;

          // Check explicit prefix: "THEM:", "ME:", "MAS JAGAD:", "TUKANG SOUND:"
          const prefixMatch = content.match(/^(THEM|ME|SAYA|LAWAN|KIRI|KANAN|SYSTEM|SISTEM|[A-Za-z0-9_+ -]+)\s*:\s*(.+)$/i);
          if (prefixMatch && !content.startsWith('[') && !content.startsWith('http')) {
            const pTag = prefixMatch[1].toUpperCase();
            content = prefixMatch[2].trim();

            if (pTag === 'ME' || pTag === 'SAYA' || pTag === 'KANAN' || pTag.includes(p2.name.toUpperCase())) {
              sender = 'me';
            } else if (pTag === 'SYSTEM' || pTag === 'SISTEM') {
              msgType = 'system';
            } else {
              sender = 'them';
            }
          }

          // Check inline tags
          if (isVNGroup || content.toLowerCase().includes('(vn') || content.toLowerCase().includes('(voice')) {
            msgType = 'voice';
            const durMatch = content.match(/\((?:vn|voice)\s*:\s*([0-9:]+)\)/i);
            if (durMatch) voiceDuration = durMatch[1];
          }

          if (content.toLowerCase().includes('(deleted)') || content.toLowerCase().includes('(dihapus)')) {
            msgType = 'deleted';
            content = 'Pesan ini telah dihapus';
          }

          const sysMatch = content.match(/\((?:system|sistem|blokir)\s*:\s*([^)]+)\)/i);
          if (sysMatch) {
            msgType = 'system';
            content = sysMatch[1];
          }

          const imgMatch = content.match(/\((?:img|foto|gambar)\s*:\s*([a-z0-9_]+)\)/i);
          if (imgMatch) {
            msgType = 'image';
            msgMedia = PRESET_MEDIA.cctvEvidence;
            content = content.replace(/\((?:img|foto|gambar)\s*:\s*([a-z0-9_]+)\)/i, '').trim();
          }

          waMessages.push({
            id: `m-${Date.now()}-${waMessages.length}`,
            sender,
            type: msgType,
            text: content,
            time: slideTime,
            status: 'read',
            voiceDuration: msgType === 'voice' ? voiceDuration : undefined,
            mediaUrl: msgMedia,
          });
        });

        // Alternate sender for the next paragraph
        currentSenderToggle = currentSenderToggle === 'them' ? 'me' : 'them';
      });
    }

    runningTime = incrementTimeString(slideTime, 2);

    const newSlide: Slide = {
      id: `slide-${Date.now()}-${index}`,
      title: slideTitle,
      platform,
      themeMode,
      statusBar: {
        show: true,
        time: slideTime,
        batteryLevel: Math.max(10, 88 - index * 4),
        signalType: '5G',
        carrier: 'Telkomsel',
      },
      notification: {
        enabled: notificationEnabled,
        platform: notifPlatform,
        title: notifTitle,
        message: notifMsg,
        time: notifTime,
        avatar: p1.avatar,
      },
      whatsapp: {
        contactName,
        avatar: p1.avatar,
        status: statusText,
        showCallButtons: true,
        isBlocked,
        blockedNoticeText,
        characterId: p1.id,
        messages: waMessages.length > 0 ? waMessages : [
          {
            id: `m1-${index}`,
            sender: 'them',
            type: 'text',
            text: 'Percakapan...',
            time: slideTime,
            status: 'read',
          }
        ],
      },
      instagramDm: {
        contactName: p1.name,
        handle: p1.handle,
        avatar: p1.avatar,
        verified: isVerified,
        activeStatus: statusText,
        isBlocked,
        blockedNoticeText,
        characterId: p1.id,
        messages: waMessages.map((w, i) => ({
          id: `ig-${i}`,
          sender: w.sender,
          type: w.type === 'image' ? 'image' : 'text',
          text: w.text,
          time: w.time,
          mediaUrl: w.mediaUrl,
        })),
      },
      twitter: {
        authorName: activePoster.name,
        handle: activePoster.handle,
        avatar: activePoster.avatar,
        verified: isVerified,
        verifiedType,
        text: captionOrPostText || 'Update status terbaru.',
        mediaUrl: undefined,
        device: 'Twitter for iPhone',
        timestamp: `${slideTime} · Hari Ini`,
        viewsCount,
        repostsCount,
        quotesCount: '12',
        likesCount,
        bookmarksCount: '48',
        characterId: activePoster.id,
      },
      instagramFeed: {
        authorName: activePoster.handle,
        avatar: activePoster.avatar,
        location: locationTag,
        verified: isVerified,
        mediaUrl,
        isLiked: true,
        likesCount: `${likesCount} suka`,
        caption: captionOrPostText,
        timestamp: '2 JAM YANG LALU',
        commentCount: commentsText,
        characterId: activePoster.id,
      },
      threads: {
        authorName: activePoster.handle,
        handle: activePoster.handle,
        avatar: activePoster.avatar,
        verified: isVerified,
        text: captionOrPostText || 'Melanjutkan utas...',
        mediaUrl: undefined,
        timestamp: '5m',
        likesCount,
        repliesCount: '18',
        repostsCount: '8',
        hasReply: false,
        characterId: activePoster.id,
      },
    };

    generatedSlides.push(newSlide);
  });

  return {
    projectTitle,
    characters: parsedCharactersList.length > 0 ? parsedCharactersList : Array.from(detectedCharactersMap.values()),
    slides: generatedSlides,
  };
}
