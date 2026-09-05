import React from 'react';
import { useStory } from '../../../context/StoryContext';
import { CharacterQuickPicker } from '../../characters/CharacterQuickPicker';
import { Palette, Type, Image as ImageIcon, Upload } from 'lucide-react';
import type { WhatsAppStatusData } from '../../../types/story';

const BG_COLOR_PRESETS = [
  { name: 'Hijau WA', value: '#075E54' },
  { name: 'Ungu Terong', value: '#6C3483' },
  { name: 'Merah Bata', value: '#922B21' },
  { name: 'Biru Tua', value: '#1A5276' },
  { name: 'Hitam Slate', value: '#1E293B' },
  { name: 'Coklat Kopi', value: '#5D4037' },
];

export const WhatsAppStatusEditor: React.FC = () => {
  const { activeSlide, updateActiveSlide, characters } = useStory();
  const data: WhatsAppStatusData = activeSlide.whatsappStatus || {
    contactName: 'Target Kontak',
    avatar: '',
    timestamp: 'Hari ini 09:15',
    statusType: 'text',
    text: 'Tulis status WhatsApp di sini...',
    backgroundColor: '#075E54',
    fontStyle: 'sans',
    activeSegmentIndex: 0,
    totalSegments: 3,
  };

  const handleUpdate = (field: keyof WhatsAppStatusData, value: any) => {
    updateActiveSlide(slide => ({
      ...slide,
      whatsappStatus: {
        ...(slide.whatsappStatus || data),
        [field]: value,
      },
    }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleUpdate('avatar', event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleUpdate('mediaUrl', event.target.result as string);
          handleUpdate('statusType', 'image');
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick Character Cast Selector */}
      <CharacterQuickPicker
        label="Pilih Pengirim Status dari Pemeran:"
        selectedCharacterId={data.characterId}
        onSelect={(charId) => {
          const char = characters.find(c => c.id === charId);
          if (char) {
            handleUpdate('contactName', char.name);
            handleUpdate('avatar', char.avatar);
            handleUpdate('characterId', char.id);
          }
        }}
      />

      {/* Status Mode Toggle: Teks vs Foto */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <label className="block text-xs font-bold text-slate-300">Tipe Status WhatsApp</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleUpdate('statusType', 'text')}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 border transition-all ${
              data.statusType === 'text'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>Status Teks Khas WA</span>
          </button>

          <button
            type="button"
            onClick={() => handleUpdate('statusType', 'image')}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 border transition-all ${
              data.statusType === 'image'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Status Foto / Media</span>
          </button>
        </div>
      </div>

      {/* Header Info: Nama & Jam Tayang & Avatar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <h3 className="font-bold text-xs text-slate-300">Pengirim & Waktu Status</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Nama Kontak</label>
            <input
              type="text"
              value={data.contactName}
              onChange={(e) => handleUpdate('contactName', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Keterangan Waktu</label>
            <input
              type="text"
              value={data.timestamp}
              onChange={(e) => handleUpdate('timestamp', e.target.value)}
              placeholder="Hari ini 09:15"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Contact Avatar Upload */}
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Foto Profil Pengirim</label>
          <div className="flex items-center space-x-2">
            <img
              src={data.avatar || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23475569"/></svg>'}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover border border-slate-700 bg-slate-800"
            />
            <label className="flex-1 cursor-pointer">
              <div className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs text-slate-300 font-medium flex items-center justify-center space-x-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>Ganti Foto Profil</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Progress Bar Segments */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <h3 className="font-bold text-xs text-slate-300">Garis Progress Status WA</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Total Garis Status</label>
            <input
              type="number"
              min="1"
              max="6"
              value={data.totalSegments || 3}
              onChange={(e) => handleUpdate('totalSegments', parseInt(e.target.value, 10) || 1)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Posisi Slide Aktif</label>
            <input
              type="number"
              min="1"
              max={data.totalSegments || 3}
              value={(data.activeSegmentIndex || 0) + 1}
              onChange={(e) => handleUpdate('activeSegmentIndex', (parseInt(e.target.value, 10) || 1) - 1)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200"
            />
          </div>
        </div>
      </div>

      {/* Content Editor */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <label className="block text-xs font-bold text-slate-300">
          {data.statusType === 'text' ? 'Isi Teks Status WhatsApp' : 'Caption Foto Status'}
        </label>

        {data.statusType === 'text' ? (
          <>
            <textarea
              rows={4}
              value={data.text}
              onChange={(e) => handleUpdate('text', e.target.value)}
              placeholder="Ketik isi status WhatsApp di sini..."
              className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />

            {/* Background Color Presets */}
            <div>
              <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-2">
                <Palette className="w-3.5 h-3.5" />
                <span>Warna Background Khas WA:</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {BG_COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => handleUpdate('backgroundColor', preset.value)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold text-white flex items-center justify-center space-x-1.5 border transition-all ${
                      data.backgroundColor === preset.value
                        ? 'ring-2 ring-white border-transparent'
                        : 'border-white/10 opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: preset.value }}
                  >
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Style */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {(['sans', 'serif', 'comic', 'mono'] as const).map((font) => (
                <button
                  key={font}
                  type="button"
                  onClick={() => handleUpdate('fontStyle', font)}
                  className={`py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                    data.fontStyle === font
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {font}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <label className="block text-xs text-slate-400">Pilih Foto Status:</label>
              
              <label className="flex items-center justify-center space-x-2 py-2.5 px-3 border border-slate-700 hover:border-slate-500 rounded-xl cursor-pointer bg-slate-950/60 transition-colors">
                <Upload className="w-4 h-4 text-slate-300" />
                <span className="text-xs font-semibold text-slate-300">Upload Foto dari File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {data.mediaUrl && (
                <div className="relative rounded-xl overflow-hidden border border-slate-800 aspect-video">
                  <img src={data.mediaUrl} alt="Status Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleUpdate('mediaUrl', undefined)}
                    className="absolute top-2 right-2 px-2 py-1 bg-red-600/80 hover:bg-red-600 text-white rounded text-[11px] font-bold"
                  >
                    Hapus Foto
                  </button>
                </div>
              )}
            </div>

            <textarea
              rows={2}
              value={data.caption || ''}
              onChange={(e) => handleUpdate('caption', e.target.value)}
              placeholder="Tulis caption foto di sini (opsional)..."
              className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </>
        )}
      </div>
    </div>
  );
};
