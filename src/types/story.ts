export type PlatformType =
  | 'whatsapp'
  | 'whatsapp-status'
  | 'instagram-dm'
  | 'twitter'
  | 'instagram-feed'
  | 'threads'
  | 'title-card'
  | 'transition-card';

export type ThemeMode = 'dark' | 'light';

export interface Character {
  id: string;
  name: string; // e.g. "Sarah Amanda" or "+62 812-9900-XXXX"
  handle: string; // e.g. "sarahamanda"
  avatar: string; // Base64 or preset
  roleLabel: string; // e.g. "Pemeran Utama (Saya)", "Teman Dekat", "Peneror Misterius", "Akun Berita"
  colorTag: string; // e.g. "indigo" | "emerald" | "rose" | "amber" | "red" | "sky"
  verified?: boolean;
  phoneOrStatus?: string; // e.g. "online", "mengetik..."
  isMe?: boolean; // If true, marked as protagonist ("Saya / Me")
}

export interface StatusBarConfig {
  show: boolean;
  time: string;
  batteryLevel: number;
  isCharging?: boolean;
  signalType: '5G' | '4G' | 'LTE' | 'WiFi';
  carrier?: string;
}

export interface PageWatermarkConfig {
  show: boolean;
  format: 'title_and_page' | 'page_only' | 'custom_prefix'; // e.g. "Misteri Villa • 01/05" vs "01/05" vs "Part 1 • 01/05"
  customPrefix?: string; // e.g. "Part 1" or "Eps. 01"
  customTitle?: string; // specific content title override
  useProjectTitle: boolean; // if true, uses projectTitle
  startPageNumber?: number; // e.g. start counting from 1, or 5, or 10
  customTotalPages?: number; // e.g. override total count (e.g. out of 15)
  position: 'bottom_right' | 'bottom_left' | 'top_right';
  style: 'glass_dark' | 'glass_light' | 'minimal' | 'solid_dark';
}

export interface NotificationOverlayConfig {
  enabled: boolean;
  platform: 'whatsapp' | 'instagram' | 'twitter' | 'messages' | 'emergency';
  title: string;
  message: string;
  time: string;
  avatar?: string;
  characterId?: string;
}

export type WAMessageType = 'text' | 'image' | 'voice' | 'deleted' | 'system';
export type WAMessageStatus = 'sent' | 'delivered' | 'read';

export interface WAMessage {
  id: string;
  sender: 'me' | 'them';
  type: WAMessageType;
  text: string;
  time: string;
  status: WAMessageStatus;
  mediaUrl?: string;
  voiceDuration?: string;
  isPlayed?: boolean;
  characterId?: string;
}

export interface WhatsAppData {
  contactName: string;
  avatar: string;
  status: string; // "online", "mengetik...", "terakhir dilihat..."
  showCallButtons: boolean;
  isBlocked?: boolean; // If true, replaces bottom typing bar with Blocked Banner
  blockedNoticeText?: string; // e.g. "Anda telah memblokir kontak ini. Ketuk untuk membuka blokir."
  characterId?: string;
  messages: WAMessage[];
}

export interface WhatsAppStatusData {
  contactName: string;
  avatar: string;
  timestamp: string; // e.g. "Hari ini 09:15" or "25 menit yang lalu"
  statusType: 'text' | 'image'; // Text status vs Media Photo/Video status
  text: string; // Status text content
  mediaUrl?: string; // Image URL if image status
  caption?: string; // Caption below photo
  backgroundColor: string; // e.g. '#075E54' (Green), '#6C3483' (Purple), '#922B21' (Red), '#1A5276' (Blue), '#1E293B' (Slate)
  fontStyle: 'sans' | 'serif' | 'comic' | 'mono';
  activeSegmentIndex: number; // 0, 1, 2
  totalSegments: number; // 1 to 5 dashes
  characterId?: string;
}

export interface TitleCardData {
  mainTitle: string; // e.g. "Rental Sound Berujung Drama Horeg"
  subtitle: string; // e.g. "Kisah nyata pesanan sound hajatan yang mendadak penuh misteri..."
  badgeText: string; // e.g. "KISAH NYATA • PART 1"
  callToAction: string; // e.g. "Geser ke kanan untuk membaca ➔"
  themeStyle: 'cinematic_dark' | 'horror_red' | 'viral_purple' | 'midnight_blue';
  coverImageUrl?: string;
}

export interface TransitionCardData {
  timeSkipTitle: string; // e.g. "3 HARI KEMUDIAN..." or "KEESOKAN HARINYA"
  timeBadge: string; // e.g. "Pukul 08:30 WIB"
  narrationText: string; // e.g. "Menjelang hari H pelaksanaan, sebuah chat tak terduga masuk dari nomor baru..."
  themeStyle: 'dark_suspense' | 'crimson_danger' | 'slate_minimal';
}

export interface IGDMMessage {
  id: string;
  sender: 'me' | 'them';
  type: 'text' | 'image' | 'heart' | 'system';
  text: string;
  time: string;
  isSeen?: boolean;
  mediaUrl?: string;
  characterId?: string;
}

export interface InstagramDMData {
  contactName: string;
  handle: string;
  avatar: string;
  verified: boolean;
  activeStatus: string; // "Aktif 15 mnt lalu", "Online"
  isBlocked?: boolean;
  blockedNoticeText?: string;
  characterId?: string;
  messages: IGDMMessage[];
}

export interface TwitterData {
  authorName: string;
  handle: string;
  avatar: string;
  verified: boolean;
  verifiedType: 'blue' | 'gold' | 'none';
  text: string;
  mediaUrl?: string;
  device: string; // "Twitter for iPhone"
  timestamp: string; // "8:42 PM · 24 Okt 2024"
  viewsCount: string; // "1.2M"
  repostsCount: string; // "14.2K"
  quotesCount: string; // "3,890"
  likesCount: string; // "89.4K"
  bookmarksCount: string; // "12.1K"
  characterId?: string;
}

export interface InstagramFeedData {
  authorName: string;
  avatar: string;
  location?: string;
  verified: boolean;
  mediaUrl: string;
  isLiked: boolean;
  likesCount: string; // "24,591 suka"
  caption: string;
  timestamp: string; // "2 JAM YANG LALU"
  commentCount?: string; // "Lihat semua 842 komentar"
  characterId?: string;
}

export interface ThreadsData {
  authorName: string;
  handle: string;
  avatar: string;
  verified: boolean;
  text: string;
  mediaUrl?: string;
  timestamp: string; // "3j"
  likesCount: string; // "1,420"
  repliesCount: string; // "86"
  repostsCount: string; // "12"
  hasReply: boolean;
  replyAuthorName?: string;
  replyAvatar?: string;
  replyText?: string;
  replyTimestamp?: string;
  characterId?: string;
}

export interface Slide {
  id: string;
  title: string;
  customPageLabel?: string; // Custom override for page number (e.g. "Halaman 03 / 10" or "03/10" or "Part 2 - 01")
  platform: PlatformType;
  themeMode: ThemeMode;
  statusBar: StatusBarConfig;
  notification: NotificationOverlayConfig;
  whatsapp: WhatsAppData;
  whatsappStatus: WhatsAppStatusData;
  titleCard: TitleCardData;
  transitionCard: TransitionCardData;
  instagramDm: InstagramDMData;
  twitter: TwitterData;
  instagramFeed: InstagramFeedData;
  threads: ThreadsData;
}

export interface StoryProject {
  title: string;
  activeSlideId: string;
  watermark: PageWatermarkConfig;
  characters: Character[];
  slides: Slide[];
}
