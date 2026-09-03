/**
 * Convert any File / Blob to base64 Data URL to prevent CORS / tainted canvas issues
 */
export const fileToBase64 = (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * High quality SVG Base64 preset avatars for instant drama storytelling
 */
export const PRESET_AVATARS = {
  mysteriousMan: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" fill="#1e293b"/>
      <circle cx="50" cy="38" r="20" fill="#475569"/>
      <path d="M15 90c0-19.33 15.67-35 35-35s35 15.67 35 35" fill="#334155"/>
      <path d="M35 36c0 0 5-4 15-4s15 4 15 4" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
      <circle cx="42" cy="40" r="3" fill="#0f172a"/>
      <circle cx="58" cy="40" r="3" fill="#0f172a"/>
      <path d="M44 50c3 2 9 2 12 0" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `)}`,
  girlFriend: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" fill="#f43f5e"/>
      <circle cx="50" cy="40" r="22" fill="#fed7aa"/>
      <path d="M28 35c0-15 10-25 22-25s22 10 22 25c0 8-4 14-8 17l-3 10H39l-3-10c-4-3-8-9-8-17z" fill="#78350f"/>
      <path d="M20 95c0-18 13.43-32 30-32s30 14 30 32" fill="#fb7185"/>
      <circle cx="43" cy="42" r="2.5" fill="#451a03"/>
      <circle cx="57" cy="42" r="2.5" fill="#451a03"/>
      <path d="M46 50c2 1.5 6 1.5 8 0" stroke="#be123c" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `)}`,
  detective: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" fill="#0f172a"/>
      <circle cx="50" cy="42" r="18" fill="#e2e8f0"/>
      <path d="M20 95c0-16.5 13.5-30 30-30s30 13.5 30 30" fill="#1e293b"/>
      <ellipse cx="50" cy="30" rx="32" ry="7" fill="#334155"/>
      <path d="M30 30c0-10 9-18 20-18s20 8 20 18z" fill="#1e293b"/>
      <rect x="36" y="38" width="11" height="8" rx="2" fill="#0284c7" fill-opacity="0.7"/>
      <rect x="53" y="38" width="11" height="8" rx="2" fill="#0284c7" fill-opacity="0.7"/>
      <line x1="47" y1="42" x2="53" y2="42" stroke="#64748b" stroke-width="2"/>
    </svg>
  `)}`,
  unknownContact: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" fill="#475569"/>
      <circle cx="50" cy="38" r="18" fill="#cbd5e1"/>
      <path d="M20 92c0-16.569 13.431-30 30-30s30 13.431 30 30" fill="#cbd5e1"/>
    </svg>
  `)}`,
  verifiedBrand: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" fill="#0284c7"/>
      <circle cx="50" cy="50" r="30" fill="#ffffff" fill-opacity="0.2"/>
      <path d="M35 50l10 10 22-22" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `)}`,
};

/**
 * Drama preset media attachments for suspense scenes
 */
export const PRESET_MEDIA = {
  cctvEvidence: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none">
      <rect width="400" height="300" fill="#050505"/>
      <rect x="20" y="20" width="360" height="260" fill="#111827" stroke="#374151" stroke-width="2"/>
      <!-- Grid lines -->
      <line x1="20" y1="150" x2="380" y2="150" stroke="#1f2937" stroke-dasharray="4 4"/>
      <line x1="200" y1="20" x2="200" y2="280" stroke="#1f2937" stroke-dasharray="4 4"/>
      <!-- Suspicious shadow figure -->
      <path d="M190 120c0-10 8-18 18-18s18 8 18 18c0 8-6 15-14 17l-2 30h-4l-2-30c-8-2-14-9-14-17z" fill="#000000" opacity="0.85"/>
      <path d="M175 190l25-35 8 35 15-35 25 35" stroke="#000000" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- CCTV OSD Info -->
      <circle cx="45" cy="45" r="6" fill="#ef4444"/>
      <text x="58" y="50" fill="#ef4444" font-family="monospace" font-size="14" font-weight="bold">REC • CAM 04 (BACKYARD)</text>
      <text x="35" y="260" fill="#9ca3af" font-family="monospace" font-size="12">2026-10-24 23:47:12 WIB</text>
      <text x="310" y="260" fill="#9ca3af" font-family="monospace" font-size="12">FPS: 30.0</text>
    </svg>
  `)}`,
  abandonedHouse: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none">
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#334155"/>
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#skyGrad)"/>
      <circle cx="330" cy="70" r="30" fill="#f8fafc" opacity="0.8"/>
      <!-- House silhouette -->
      <polygon points="120,180 200,100 280,180" fill="#090d16"/>
      <rect x="135" y="180" width="130" height="100" fill="#090d16"/>
      <rect x="185" y="210" width="30" height="70" fill="#1e293b"/>
      <polygon points="260,160 300,120 340,160" fill="#0f172a"/>
      <rect x="270" y="160" width="60" height="120" fill="#0f172a"/>
      <!-- Glowing window -->
      <rect x="155" y="195" width="20" height="25" fill="#f59e0b" opacity="0.9"/>
      <rect x="290" y="175" width="20" height="20" fill="#dc2626" opacity="0.75"/>
      <!-- Mist & Ground -->
      <rect x="0" y="270" width="400" height="30" fill="#020617"/>
    </svg>
  `)}`,
  documentEvidence: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none">
      <rect width="400" height="300" fill="#1e293b"/>
      <rect x="70" y="25" width="260" height="250" rx="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
      <rect x="95" y="45" width="120" height="15" fill="#dc2626"/>
      <text x="100" y="57" fill="#ffffff" font-family="sans-serif" font-size="10" font-weight="bold">RAHASIA / CONFIDENTIAL</text>
      <!-- Redacted text lines -->
      <rect x="95" y="80" width="210" height="8" fill="#1e293b"/>
      <rect x="95" y="100" width="180" height="8" fill="#1e293b"/>
      <rect x="95" y="120" width="200" height="8" fill="#1e293b"/>
      <rect x="95" y="140" width="150" height="8" fill="#dc2626" opacity="0.7"/>
      <rect x="95" y="160" width="210" height="8" fill="#1e293b"/>
      <rect x="95" y="180" width="190" height="8" fill="#1e293b"/>
      <!-- Stamp -->
      <circle cx="280" cy="220" r="30" stroke="#dc2626" stroke-width="3" stroke-dasharray="6 2"/>
      <text x="255" y="225" fill="#dc2626" font-family="sans-serif" font-size="11" font-weight="bold">TOP SECRET</text>
    </svg>
  `)}`,
};
