import React from 'react';
import { useStory } from '../../context/StoryContext';
import { Bell, Image as ImageIcon, Upload } from 'lucide-react';
import { fileToBase64 } from '../../utils/imageUtils';
import { CharacterQuickPicker } from '../characters/CharacterQuickPicker';

export const NotificationEditor: React.FC = () => {
  const { activeSlide, updateActiveSlide, characters } = useStory();
  const { notification } = activeSlide;

  const handleUpdate = (field: string, value: any) => {
    updateActiveSlide(slide => ({
      ...slide,
      notification: {
        ...slide.notification,
        [field]: value,
      },
    }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      handleUpdate('avatar', base64);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-amber-400" />
          <div>
            <h3 className="font-bold text-sm text-slate-200">Suspense Push Notification</h3>
            <p className="text-[11px] text-slate-400">Pop-up banner masuk untuk efek kejutan/teror</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={notification.enabled}
            onChange={(e) => handleUpdate('enabled', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
        </label>
      </div>

      {notification.enabled && (
        <div className="space-y-3 pt-2 border-t border-slate-800/80">
          {/* Quick Character Picker for Sender */}
          <CharacterQuickPicker
            label="Pilih Pengirim Notifikasi dari Pemeran:"
            selectedCharacterId={notification.characterId}
            onSelect={(charId) => {
              const char = characters.find(c => c.id === charId);
              if (char) {
                handleUpdate('title', char.name);
                handleUpdate('avatar', char.avatar);
                handleUpdate('characterId', char.id);
              }
            }}
          />

          <div className="grid grid-cols-2 gap-3">
            {/* Platform Icon Type */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">Aplikasi Pengirim</label>
              <select
                value={notification.platform}
                onChange={(e) => handleUpdate('platform', e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="instagram">Instagram</option>
                <option value="twitter">X (Twitter)</option>
                <option value="emergency">Peringatan Darurat (SOS)</option>
                <option value="messages">Pesan SMS</option>
              </select>
            </div>

            {/* Time */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">Waktu Pop-up</label>
              <input
                type="text"
                value={notification.time}
                onChange={(e) => handleUpdate('time', e.target.value)}
                placeholder="Baru saja"
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Title / Sender Name */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">Nama Pengirim / Judul Alert</label>
            <input
              type="text"
              value={notification.title}
              onChange={(e) => handleUpdate('title', e.target.value)}
              placeholder="Contoh: +62 812-9900-XXXX atau Sarah"
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Notification Body Message */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">Isi Pesan Peringatan / Ancaman</label>
            <textarea
              value={notification.message}
              onChange={(e) => handleUpdate('message', e.target.value)}
              rows={2}
              placeholder="Contoh: Dia sudah ada di dalam rumah..."
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Notification Avatar / Presets */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Avatar Notifikasi</label>
            <div className="flex items-center space-x-2">
              {notification.avatar ? (
                <img
                  src={notification.avatar}
                  alt="Avatar"
                  className="w-9 h-9 rounded-full object-cover border border-slate-700"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                  <ImageIcon className="w-4 h-4" />
                </div>
              )}

              <label className="flex-1 cursor-pointer">
                <div className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs text-slate-300 font-medium flex items-center justify-center space-x-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Foto Sendiri</span>
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
      )}
    </div>
  );
};
