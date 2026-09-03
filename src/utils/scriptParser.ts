import type { Slide, PlatformType, WAMessage, Character } from '../types/story';
import { PRESET_AVATARS, PRESET_MEDIA } from './imageUtils';
import { incrementTimeString } from './timeUtils';

export interface ParsedStoryResult {
  projectTitle: string;
  characters: Character[];
  slides: Slide[];
}

export const SAMPLE_SCRIPT_TEMPLATE = `[JUDUL]: Misteri Villa Pine Hills
[WAKTU_MULAI]: 23:45

[SLIDE 1 - WHATSAPP]
[KONTAK]: Nomor Misterius | +62 812-9900-XXXX
[STATUS]: online
[WAKTU]: 23:45

THEM: Pesan ini telah dihapus (deleted)
THEM: Jangan buka pintu belakang malam ini, Rian.
THEM: Aku tahu kamu sedang sendirian di lantai dua.
ME: SIAPA KAMU?! Jangan main-main! (23:46)
ME: (vn: 0:14)

---

[SLIDE 2 - IG_FEED]
[USER]: sarahamanda (verified)
[LOKASI]: Pine Hills Hillside Villa
[FOTO]: villa
[LIKES]: 1,420 suka
[WAKTU]: 3 JAM YANG LALU
CAPTION: Katanya villa ini ada penjaganya... tapi kok sunyi banget ya? 🌲🏚️
[KOMENTAR]: Lihat semua 42 komentar
[NOTIFIKASI]: WhatsApp | +62 812-9900-XXXX | Langkah kakiku sudah ada di tangga bawah.

---

[SLIDE 3 - TWITTER]
[USER]: Metropolis News Radar | @MetropolisRadar (blue)
[TEKS]: ⚠️ PERINGATAN DARURAT: Sosok mencurigakan dilaporkan berkeliaran di sekitar Kompleks Villa Pine Hills pukul 23:30 WIB. Warga diimbau mengunci pintu.
[FOTO]: rumah
[METRIK]: 48.2K views | 1.4K reposts | 5.9K likes
[WAKTU]: 11:48 PM · 24 Okt 2026

---

[SLIDE 4 - WHATSAPP]
[KONTAK]: Nomor Misterius | +62 812-9900-XXXX
[BLOKIR]: Anda telah memblokir kontak ini. Ketuk untuk membuka blokir.
[WAKTU]: 23:50

ME: Maaf nomor kamu aku blokir ya.
THEM: (system: 🔒 Anda telah memblokir kontak ini.)
`;

/**
 * Regex Script Parser to convert raw written script into rich slides and characters
 */
export function parseScriptToStory(rawScript: string): ParsedStoryResult {
  const lines = rawScript.split(/\r?\n/);
  
  let projectTitle = 'Cerita Bergambar Baru';
  let defaultStartTime = '23:45';

  // 1. Extract Global Meta
  for (const line of lines) {
    const titleMatch = line.match(/^\[(?:JUDUL|TITLE)\]\s*:\s*(.+)$/i);
    if (titleMatch) {
      projectTitle = titleMatch[1].trim();
    }
    const timeMatch = line.match(/^\[(?:WAKTU_MULAI|START_TIME)\]\s*:\s*(.+)$/i);
    if (timeMatch) {
      defaultStartTime = timeMatch[1].trim();
    }
  }

  // 2. Split script into Slide chunks by '---' or '[SLIDE'
  const rawSlideChunks: string[] = [];
  let currentChunk: string[] = [];

  for (const line of lines) {
    if (line.trim().startsWith('---') || line.trim().match(/^\[SLIDE\s*\d+/i)) {
      if (currentChunk.length > 0) {
        rawSlideChunks.push(currentChunk.join('\n'));
        currentChunk = [];
      }
      if (line.trim().match(/^\[SLIDE\s*\d+/i)) {
        currentChunk.push(line);
      }
    } else {
      currentChunk.push(line);
    }
  }
  if (currentChunk.length > 0) {
    rawSlideChunks.push(currentChunk.join('\n'));
  }

  // If no slide headers were found, treat whole text as single slide
  if (rawSlideChunks.length === 0) {
    rawSlideChunks.push(rawScript);
  }

  const generatedSlides: Slide[] = [];
  const detectedCharactersMap = new Map<string, Character>();

  let runningTime = defaultStartTime;

  rawSlideChunks.forEach((chunk, index) => {
    const chunkLines = chunk.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (chunkLines.length === 0) return;

    let platform: PlatformType = 'whatsapp';
    let slideTitle = `Slide ${index + 1}`;
    let slideTime = runningTime;
    let themeMode: 'dark' | 'light' = 'dark';

    // Slide Header detection
    const firstLine = chunkLines[0];
    const slideHeaderMatch = firstLine.match(/^\[SLIDE\s*(\d+)?\s*(?:-\s*([A-Z_]+))?\]/i);
    if (slideHeaderMatch) {
      if (slideHeaderMatch[1]) slideTitle = `Slide ${slideHeaderMatch[1]}`;
      if (slideHeaderMatch[2]) {
        const platStr = slideHeaderMatch[2].toLowerCase();
        if (platStr.includes('feed') || platStr.includes('ig_feed') || platStr.includes('post')) {
          platform = 'instagram-feed';
        } else if (platStr.includes('tweet') || platStr.includes('twitter') || platStr.includes('x')) {
          platform = 'twitter';
        } else if (platStr.includes('dm') || platStr.includes('ig_dm')) {
          platform = 'instagram-dm';
        } else if (platStr.includes('threads')) {
          platform = 'threads';
        } else {
          platform = 'whatsapp';
        }
      }
    }

    // Default Slide Data Setup
    let contactName = 'Kontak Cerita';
    let handle = 'user_cerita';
    let statusText = 'online';
    let isBlocked = false;
    let blockedNoticeText = 'Anda telah memblokir kontak ini. Ketuk untuk membuka blokir.';
    let mediaUrl = PRESET_MEDIA.abandonedHouse;
    let captionText = 'Momen malam ini...';
    let tweetText = 'Update cerita malam ini.';
    let isVerified = false;
    let verifiedType: 'blue' | 'gold' | 'none' = 'none';
    let likesCount = '1,420 suka';
    let viewsCount = '12.5K';
    let repostsCount = '340';
    let commentsText = 'Lihat komentar...';
    let locationTag = 'Villa Pine Hills';
    
    // Notification setup
    let notificationEnabled = false;
    let notifPlatform: 'whatsapp' | 'instagram' | 'twitter' | 'emergency' | 'messages' = 'whatsapp';
    let notifTitle = 'Peringatan Masuk';
    let notifMsg = 'Ada aktivitas mencurigakan...';
    let notifTime = 'Baru saja';

    const waMessages: WAMessage[] = [];

    // Parse each line in the chunk
    for (const l of chunkLines) {
      // 1. Time config
      const timeMatch = l.match(/^\[(?:WAKTU|TIME)\]\s*:\s*(.+)$/i);
      if (timeMatch) {
        slideTime = timeMatch[1].trim();
        runningTime = slideTime;
      }

      // 2. Contact / User info
      const userMatch = l.match(/^\[(?:KONTAK|USER|AUTHOR|AKUN)\]\s*:\s*(.+)$/i);
      if (userMatch) {
        const rawUser = userMatch[1].trim();
        const parts = rawUser.split('|').map(p => p.trim());
        contactName = parts[0].replace(/[@()]/g, '');
        if (parts.length > 1) {
          handle = parts[1].replace(/^@/, '');
        } else {
          handle = contactName.toLowerCase().replace(/\s+/g, '_');
        }

        if (rawUser.toLowerCase().includes('(verified)') || rawUser.toLowerCase().includes('(blue)')) {
          isVerified = true;
          verifiedType = 'blue';
        } else if (rawUser.toLowerCase().includes('(gold)')) {
          isVerified = true;
          verifiedType = 'gold';
        }

        // Register character
        if (!detectedCharactersMap.has(contactName)) {
          detectedCharactersMap.set(contactName, {
            id: `char-${contactName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
            name: contactName,
            handle,
            avatar: contactName.toLowerCase().includes('sarah') || contactName.toLowerCase().includes('cewe')
              ? PRESET_AVATARS.girlFriend
              : contactName.includes('+62') || contactName.toLowerCase().includes('misterius')
              ? PRESET_AVATARS.unknownContact
              : contactName.toLowerCase().includes('radar') || contactName.toLowerCase().includes('berita')
              ? PRESET_AVATARS.verifiedBrand
              : PRESET_AVATARS.mysteriousMan,
            roleLabel: contactName.includes('+62') ? 'Peneror' : isVerified ? 'Akun Resmi' : 'Pemeran',
            colorTag: 'indigo',
            verified: isVerified,
            phoneOrStatus: 'online',
          });
        }
      }

      // 3. Status text
      const statusMatch = l.match(/^\[STATUS\]\s*:\s*(.+)$/i);
      if (statusMatch) {
        statusText = statusMatch[1].trim();
      }

      // 4. Blocked Contact input
      const blockMatch = l.match(/^\[(?:BLOKIR|BLOCK|BLOCKED)\]\s*(?::\s*(.+))?$/i);
      if (blockMatch) {
        isBlocked = true;
        if (blockMatch[1] && blockMatch[1].trim() !== 'ON' && blockMatch[1].trim() !== 'TRUE') {
          blockedNoticeText = blockMatch[1].trim();
        }
      }

      // 5. Location
      const locMatch = l.match(/^\[(?:LOKASI|LOCATION)\]\s*:\s*(.+)$/i);
      if (locMatch) {
        locationTag = locMatch[1].trim();
      }

      // 6. Photo / Media
      const photoMatch = l.match(/^\[(?:FOTO|MEDIA|IMAGE)\]\s*:\s*(.+)$/i);
      if (photoMatch) {
        const pKey = photoMatch[1].toLowerCase();
        if (pKey.includes('cctv')) mediaUrl = PRESET_MEDIA.cctvEvidence;
        else if (pKey.includes('dokumen') || pKey.includes('surat')) mediaUrl = PRESET_MEDIA.documentEvidence;
        else mediaUrl = PRESET_MEDIA.abandonedHouse;
      }

      // 7. Caption
      const capMatch = l.match(/^(?:CAPTION|TEKS|TWEET)\s*:\s*(.+)$/i);
      if (capMatch) {
        captionText = capMatch[1].trim();
        tweetText = capMatch[1].trim();
      }

      // 8. Likes / Metrics
      const likesMatch = l.match(/^\[(?:LIKES|METRIK)\]\s*:\s*(.+)$/i);
      if (likesMatch) {
        const mStr = likesMatch[1].trim();
        likesCount = mStr;
        if (mStr.includes('views')) {
          const parts = mStr.split('|').map(p => p.trim());
          viewsCount = parts[0].replace(/views/i, '').trim();
          if (parts[1]) repostsCount = parts[1].replace(/reposts/i, '').trim();
          if (parts[2]) likesCount = parts[2].replace(/likes/i, '').trim();
        }
      }

      // 9. Comments
      const commMatch = l.match(/^\[(?:KOMENTAR|COMMENTS)\]\s*:\s*(.+)$/i);
      if (commMatch) {
        commentsText = commMatch[1].trim();
      }

      // 10. Notification Pop-up
      const notifMatch = l.match(/^\[(?:NOTIFIKASI|NOTIF|SUSPENSE)\]\s*:\s*(.+)$/i);
      if (notifMatch) {
        const nParts = notifMatch[1].split('|').map(p => p.trim());
        notificationEnabled = true;
        if (nParts.length >= 3) {
          const platStr = nParts[0].toLowerCase();
          if (platStr.includes('ig') || platStr.includes('instagram')) notifPlatform = 'instagram';
          else if (platStr.includes('sos') || platStr.includes('darurat')) notifPlatform = 'emergency';
          else notifPlatform = 'whatsapp';
          notifTitle = nParts[1];
          notifMsg = nParts[2];
        } else if (nParts.length === 2) {
          notifTitle = nParts[0];
          notifMsg = nParts[1];
        } else {
          notifMsg = nParts[0];
        }
      }

      // 11. Dialogue Bubbles (WhatsApp / DM)
      // Syntax: THEM: message | ME: message | SARAH: message | KIRI: message | KANAN: message
      const msgMatch = l.match(/^(THEM|ME|SAYA|LAWAN|KIRI|KANAN|SYSTEM|SISTEM|[A-Za-z0-9_+ -]+)\s*:\s*(.+)$/i);
      if (msgMatch && !l.startsWith('[') && !l.startsWith('CAPTION:') && !l.startsWith('TEKS:')) {
        const senderTag = msgMatch[1].toUpperCase();
        let content = msgMatch[2].trim();
        const isMe = senderTag === 'ME' || senderTag === 'SAYA' || senderTag === 'KANAN';
        const isSystem = senderTag === 'SYSTEM' || senderTag === 'SISTEM';

        // Check for (deleted), (vn: 0:15), (img: cctv), (time: 23:45), (system: ...)
        let msgType: 'text' | 'image' | 'voice' | 'deleted' | 'system' = isSystem ? 'system' : 'text';
        let voiceDuration = '0:15';
        let msgMedia: string | undefined = undefined;
        let msgTime = slideTime;

        if (content.toLowerCase().includes('(deleted)') || content.toLowerCase().includes('(dihapus)')) {
          msgType = 'deleted';
          content = 'Pesan ini telah dihapus';
        }

        const sysMatch = content.match(/\((?:system|sistem|blokir)\s*:\s*([^)]+)\)/i);
        if (sysMatch) {
          msgType = 'system';
          content = sysMatch[1];
        }

        const vnMatch = content.match(/\((?:vn|voice)\s*:\s*([0-9:]+)\)/i);
        if (vnMatch) {
          msgType = 'voice';
          voiceDuration = vnMatch[1];
          content = 'Voice Message';
        }

        const imgMatch = content.match(/\((?:img|foto|gambar)\s*:\s*([a-z0-9_]+)\)/i);
        if (imgMatch) {
          msgType = 'image';
          const iKey = imgMatch[1].toLowerCase();
          msgMedia = iKey.includes('cctv') ? PRESET_MEDIA.cctvEvidence : PRESET_MEDIA.abandonedHouse;
          content = content.replace(/\((?:img|foto|gambar)\s*:\s*([a-z0-9_]+)\)/i, '').trim();
        }

        const timeInMsg = content.match(/\(([0-9]{1,2}:[0-9]{2})\)/);
        if (timeInMsg) {
          msgTime = timeInMsg[1];
          content = content.replace(/\(([0-9]{1,2}:[0-9]{2})\)/, '').trim();
        }

        waMessages.push({
          id: `m-${Date.now()}-${waMessages.length}`,
          sender: isMe ? 'me' : 'them',
          type: msgType,
          text: content,
          time: msgTime,
          status: 'read',
          voiceDuration: msgType === 'voice' ? voiceDuration : undefined,
          mediaUrl: msgMedia,
        });
      }
    }

    // Next slide runs 2 minutes later
    runningTime = incrementTimeString(slideTime, 2);

    const activeChar = detectedCharactersMap.get(contactName);
    const chosenAvatar = activeChar ? activeChar.avatar : PRESET_AVATARS.unknownContact;

    const newSlide: Slide = {
      id: `slide-${Date.now()}-${index}`,
      title: slideTitle,
      platform,
      themeMode,
      statusBar: {
        show: true,
        time: slideTime,
        batteryLevel: Math.max(10, 85 - index * 5),
        signalType: '5G',
        carrier: 'Telkomsel',
      },
      notification: {
        enabled: notificationEnabled,
        platform: notifPlatform,
        title: notifTitle,
        message: notifMsg,
        time: notifTime,
        avatar: PRESET_AVATARS.unknownContact,
      },
      whatsapp: {
        contactName,
        avatar: chosenAvatar,
        status: statusText,
        showCallButtons: true,
        isBlocked,
        blockedNoticeText,
        messages: waMessages.length > 0 ? waMessages : [
          {
            id: `m1-${index}`,
            sender: 'them',
            type: 'text',
            text: 'Kelanjutan cerita...',
            time: slideTime,
            status: 'read',
          }
        ],
      },
      instagramDm: {
        contactName,
        handle,
        avatar: chosenAvatar,
        verified: isVerified,
        activeStatus: statusText,
        isBlocked,
        blockedNoticeText,
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
        authorName: contactName,
        handle,
        avatar: chosenAvatar,
        verified: isVerified,
        verifiedType,
        text: tweetText,
        mediaUrl,
        device: 'Twitter for iPhone',
        timestamp: `${slideTime} · Hari Ini`,
        viewsCount,
        repostsCount,
        quotesCount: '45',
        likesCount,
        bookmarksCount: '120',
      },
      instagramFeed: {
        authorName: handle,
        avatar: chosenAvatar,
        location: locationTag,
        verified: isVerified,
        mediaUrl,
        isLiked: true,
        likesCount,
        caption: captionText,
        timestamp: '3 JAM YANG LALU',
        commentCount: commentsText,
      },
      threads: {
        authorName: handle,
        handle,
        avatar: chosenAvatar,
        verified: isVerified,
        text: captionText || tweetText,
        mediaUrl,
        timestamp: '10m',
        likesCount: '450',
        repliesCount: '32',
        repostsCount: '14',
        hasReply: false,
      },
    };

    generatedSlides.push(newSlide);
  });

  return {
    projectTitle,
    characters: Array.from(detectedCharactersMap.values()),
    slides: generatedSlides,
  };
}
