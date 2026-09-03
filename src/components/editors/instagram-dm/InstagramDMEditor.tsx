import React from 'react';
import { useStory } from '../../../context/StoryContext';
import type { IGDMMessage } from '../../../types/story';
import { Plus, Trash2, ArrowUp, ArrowDown, Upload, ShieldAlert } from 'lucide-react';
import { fileToBase64, PRESET_MEDIA } from '../../../utils/imageUtils';
import { CharacterQuickPicker } from '../../characters/CharacterQuickPicker';

export const InstagramDMEditor: React.FC = () => {
  const { activeSlide, updateActiveSlide, characters } = useStory();
  const { instagramDm } = activeSlide;

  const handleUpdateHeader = (field: string, value: any) => {
    updateActiveSlide(slide => ({
      ...slide,
      instagramDm: {
        ...slide.instagramDm,
        [field]: value,
      },
    }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      handleUpdateHeader('avatar', base64);
    }
  };

  const addMessage = (sender: 'me' | 'them' = 'them', type: 'text' | 'image' = 'text') => {
    const newMsg: IGDMMessage = {
      id: `ig-${Date.now()}`,
      sender,
      type,
      text: type === 'text' ? 'Halo...' : '',
      time: activeSlide.statusBar.time,
      mediaUrl: type === 'image' ? PRESET_MEDIA.cctvEvidence : undefined,
    };

    updateActiveSlide(slide => ({
      ...slide,
      instagramDm: {
        ...slide.instagramDm,
        messages: [...slide.instagramDm.messages, newMsg],
      },
    }));
  };

  const updateMessage = (index: number, updated: Partial<IGDMMessage>) => {
    updateActiveSlide(slide => {
      const msgs = [...slide.instagramDm.messages];
      msgs[index] = { ...msgs[index], ...updated };
      return {
        ...slide,
        instagramDm: {
          ...slide.instagramDm,
          messages: msgs,
        },
      };
    });
  };

  const deleteMessage = (index: number) => {
    updateActiveSlide(slide => {
      const msgs = slide.instagramDm.messages.filter((_, i) => i !== index);
      return {
        ...slide,
        instagramDm: {
          ...slide.instagramDm,
          messages: msgs,
        },
      };
    });
  };

  const moveMessage = (index: number, direction: 'up' | 'down') => {
    updateActiveSlide(slide => {
      const msgs = [...slide.instagramDm.messages];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= msgs.length) return slide;
      const temp = msgs[index];
      msgs[index] = msgs[targetIndex];
      msgs[targetIndex] = temp;
      return {
        ...slide,
        instagramDm: {
          ...slide.instagramDm,
          messages: msgs,
        },
      };
    });
  };

  return (
    <div className="space-y-4">
      {/* Profile Header Settings */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <h3 className="font-bold text-sm text-slate-200">Profil Kontak Instagram DM</h3>

        {/* Quick Character Picker */}
        <CharacterQuickPicker
          label="Pilih Lawan Bicara DM dari Pemeran:"
          selectedCharacterId={instagramDm.characterId}
          onSelect={(charId) => {
            const char = characters.find(c => c.id === charId);
            if (char) {
              handleUpdateHeader('contactName', char.name);
              handleUpdateHeader('handle', char.handle);
              handleUpdateHeader('avatar', char.avatar);
              handleUpdateHeader('verified', !!char.verified);
              handleUpdateHeader('characterId', char.id);
            }
          }}
        />

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Nama Kontak</label>
            <input
              type="text"
              value={instagramDm.contactName}
              onChange={(e) => handleUpdateHeader('contactName', e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Status Aktivitas</label>
            <input
              type="text"
              value={instagramDm.activeStatus}
              onChange={(e) => handleUpdateHeader('activeStatus', e.target.value)}
              placeholder="Online / Aktif 15 mnt lalu"
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-1">
          <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={instagramDm.verified}
              onChange={(e) => handleUpdateHeader('verified', e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0"
            />
            <span>Badge Centang Biru (Verified)</span>
          </label>
        </div>

        {/* Avatar */}
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Foto Profil</label>
          <div className="flex items-center space-x-2">
            <img
              src={instagramDm.avatar}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover border border-slate-700 bg-slate-800"
            />
            <label className="flex-1 cursor-pointer">
              <div className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs text-slate-300 font-medium flex items-center justify-center space-x-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Foto Profil</span>
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

      {/* Feature: BLOKIR AKUN DM (Konten Lucu & Drama) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <div>
              <h3 className="font-bold text-sm text-slate-200">Status Blokir Akun DM (Konten Lucu)</h3>
              <p className="text-[11px] text-slate-400">Mengubah input bar DM menjadi banner "Akun Diblokir"</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={!!instagramDm.isBlocked}
              onChange={(e) => handleUpdateHeader('isBlocked', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
          </label>
        </div>

        {instagramDm.isBlocked && (
          <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs">
            <label className="block text-[11px] text-slate-400">Teks Banner Blokir DM</label>
            <input
              type="text"
              value={instagramDm.blockedNoticeText || 'Anda telah memblokir akun ini.'}
              onChange={(e) => handleUpdateHeader('blockedNoticeText', e.target.value)}
              placeholder="Anda telah memblokir akun ini."
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-rose-500"
            />
          </div>
        )}
      </div>

      {/* Messages Manager */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-200">Daftar Pesan DM ({instagramDm.messages.length})</h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => addMessage('them', 'text')}
            className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Pesan Masuk (Abu-abu)</span>
          </button>
          <button
            type="button"
            onClick={() => addMessage('me', 'text')}
            className="p-2 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-800/60 text-indigo-200 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Pesan Keluar (Gradien)</span>
          </button>
        </div>

        <div className="space-y-3">
          {instagramDm.messages.map((msg, index) => (
            <div
              key={msg.id || index}
              className={`p-3 rounded-xl border ${
                msg.sender === 'me'
                  ? 'bg-indigo-950/20 border-indigo-900/40'
                  : 'bg-slate-950 border-slate-800'
              } space-y-2`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => updateMessage(index, { sender: 'them' })}
                    className={`px-2 py-0.5 text-xs rounded font-medium ${
                      msg.sender === 'them' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Lawan
                  </button>
                  <button
                    type="button"
                    onClick={() => updateMessage(index, { sender: 'me' })}
                    className={`px-2 py-0.5 text-xs rounded font-medium ${
                      msg.sender === 'me' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Saya
                  </button>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveMessage(index, 'up')}
                    className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-30"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === instagramDm.messages.length - 1}
                    onClick={() => moveMessage(index, 'down')}
                    className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-30"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteMessage(index)}
                    className="p-1 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <textarea
                value={msg.text}
                onChange={(e) => updateMessage(index, { text: e.target.value })}
                rows={2}
                placeholder="Teks pesan DM..."
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
              />

              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <span>Jam:</span>
                <input
                  type="text"
                  value={msg.time}
                  onChange={(e) => updateMessage(index, { time: e.target.value })}
                  className="w-20 px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-xs text-slate-200"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
