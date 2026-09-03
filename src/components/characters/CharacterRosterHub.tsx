import React, { useState } from 'react';
import { useStory } from '../../context/StoryContext';
import { Plus, Trash2, Upload, Users, CheckCircle2, UserCheck } from 'lucide-react';
import { fileToBase64, PRESET_AVATARS } from '../../utils/imageUtils';

export const CharacterRosterHub: React.FC = () => {
  const { characters, addCharacter, updateCharacter, deleteCharacter, applyCharacterToActiveSlide, activeSlide } = useStory();
  const [editingCharId, setEditingCharId] = useState<string | null>(characters[0]?.id || null);

  const handleCreateNew = () => {
    const newChar = addCharacter({
      name: `Karakter ${characters.length + 1}`,
      handle: `karakter_${characters.length + 1}`,
      roleLabel: 'Pemeran Tambahan',
      avatar: PRESET_AVATARS.unknownContact,
    });
    setEditingCharId(newChar.id);
  };

  const handleAvatarUpload = async (charId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      updateCharacter(charId, { avatar: base64 });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Info Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base text-slate-100">Setting Peran & Pemeran Cerita</h3>
          </div>
          <button
            type="button"
            onClick={handleCreateNew}
            className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Tambah Pemeran</span>
          </button>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Tentukan seluruh daftar tokoh cerita di awal agar Anda tidak perlu mengetik ulang nama, handle, dan mengunggah foto profil di setiap slide. Cukup 1-klik untuk menerapkan karakter ke slide mana pun!
        </p>
      </div>

      {/* Characters Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {characters.map((char) => {
          const isSelected = editingCharId === char.id;

          return (
            <div
              key={char.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                isSelected
                  ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xl'
                  : 'bg-slate-900/80 border-slate-800'
              } space-y-3`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="relative">
                    <img
                      src={char.avatar}
                      alt={char.name}
                      className="w-11 h-11 rounded-full object-cover border border-slate-700 bg-slate-800"
                    />
                    {char.isMe && (
                      <span className="absolute -bottom-1 -right-1 px-1 py-0.2 bg-indigo-600 text-white text-[9px] font-bold rounded-full">
                        SAYA
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-1">
                      <span className="font-bold text-sm text-slate-100 leading-tight">
                        {char.name}
                      </span>
                      {char.verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 fill-sky-500 text-white shrink-0" />
                      )}
                    </div>
                    <span className="text-xs text-slate-400">@{char.handle}</span>
                    <div className="mt-0.5">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-indigo-300 border border-slate-700">
                        {char.roleLabel}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => deleteCharacter(char.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
                    title="Hapus Karakter"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Character Fields Editor */}
              <div className="space-y-2 pt-1 border-t border-slate-800/80 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Nama Karakter</label>
                    <input
                      type="text"
                      value={char.name}
                      onChange={(e) => updateCharacter(char.id, { name: e.target.value })}
                      className="w-full px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Handle (@username)</label>
                    <input
                      type="text"
                      value={char.handle}
                      onChange={(e) => updateCharacter(char.id, { handle: e.target.value.replace(/^@/, '') })}
                      className="w-full px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Label Peran</label>
                    <input
                      type="text"
                      value={char.roleLabel}
                      onChange={(e) => updateCharacter(char.id, { roleLabel: e.target.value })}
                      placeholder="Contoh: Teman / Peneror"
                      className="w-full px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Status / Info Default</label>
                    <input
                      type="text"
                      value={char.phoneOrStatus || ''}
                      onChange={(e) => updateCharacter(char.id, { phoneOrStatus: e.target.value })}
                      placeholder="online / aktif"
                      className="w-full px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Avatar Upload & Quick Presets */}
                <div className="pt-1">
                  <div className="flex items-center space-x-2">
                    <label className="flex-1 cursor-pointer">
                      <div className="py-1 px-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-[11px] text-slate-300 font-medium flex items-center justify-center space-x-1">
                        <Upload className="w-3 h-3" />
                        <span>Ganti Foto Karakter</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleAvatarUpload(char.id, e)}
                        className="hidden"
                      />
                    </label>

                    <label className="flex items-center space-x-1.5 text-[11px] text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!char.verified}
                        onChange={(e) => updateCharacter(char.id, { verified: e.target.checked })}
                        className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0"
                      />
                      <span>Verified</span>
                    </label>
                  </div>

                  {/* Preset Avatar shortcuts */}
                  <div className="flex space-x-1 mt-1.5 overflow-x-auto pb-0.5">
                    <button
                      type="button"
                      onClick={() => updateCharacter(char.id, { avatar: PRESET_AVATARS.mysteriousMan })}
                      className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-[10px] text-slate-300 shrink-0"
                    >
                      Pria Misterius
                    </button>
                    <button
                      type="button"
                      onClick={() => updateCharacter(char.id, { avatar: PRESET_AVATARS.girlFriend })}
                      className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-[10px] text-slate-300 shrink-0"
                    >
                      Wanita
                    </button>
                    <button
                      type="button"
                      onClick={() => updateCharacter(char.id, { avatar: PRESET_AVATARS.detective })}
                      className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-[10px] text-slate-300 shrink-0"
                    >
                      Detektif
                    </button>
                    <button
                      type="button"
                      onClick={() => updateCharacter(char.id, { avatar: PRESET_AVATARS.verifiedBrand })}
                      className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-[10px] text-slate-300 shrink-0"
                    >
                      Brand / Berita
                    </button>
                  </div>
                </div>

                {/* 1-Click Apply to active slide */}
                <div className="pt-2 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => applyCharacterToActiveSlide(char.id)}
                    className="flex-1 py-1.5 px-3 bg-indigo-900/60 hover:bg-indigo-800/80 border border-indigo-700/60 text-indigo-200 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all active:scale-95"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Terapkan ke Slide Aktif ({activeSlide.title})</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
