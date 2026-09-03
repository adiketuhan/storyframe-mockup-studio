import React from 'react';
import { useStory } from '../../../context/StoryContext';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { fileToBase64 } from '../../../utils/imageUtils';
import { CharacterQuickPicker } from '../../characters/CharacterQuickPicker';

export const ThreadsEditor: React.FC = () => {
  const { activeSlide, updateActiveSlide, characters } = useStory();
  const { threads } = activeSlide;

  const handleUpdate = (field: string, value: any) => {
    updateActiveSlide(slide => ({
      ...slide,
      threads: {
        ...slide.threads,
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

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      handleUpdate('mediaUrl', base64);
    }
  };

  return (
    <div className="space-y-4">
      {/* Account Info */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <h3 className="font-bold text-sm text-slate-200">Profil Akun Threads</h3>

        {/* Quick Character Picker */}
        <CharacterQuickPicker
          label="Pilih Penulis Utas dari Pemeran:"
          selectedCharacterId={threads.characterId}
          onSelect={(charId) => {
            const char = characters.find(c => c.id === charId);
            if (char) {
              handleUpdate('authorName', char.handle || char.name.toLowerCase().replace(/\s+/g, '_'));
              handleUpdate('handle', char.handle);
              handleUpdate('avatar', char.avatar);
              handleUpdate('verified', !!char.verified);
              handleUpdate('characterId', char.id);
            }
          }}
        />

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Nama / Handle</label>
            <input
              type="text"
              value={threads.authorName}
              onChange={(e) => handleUpdate('authorName', e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Waktu Utas</label>
            <input
              type="text"
              value={threads.timestamp}
              onChange={(e) => handleUpdate('timestamp', e.target.value)}
              placeholder="3j / 10m"
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-slate-500"
            />
          </div>
        </div>

        {/* Avatar */}
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Foto Profil</label>
          <div className="flex items-center space-x-2">
            <img
              src={threads.avatar}
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

      {/* Main Post Text */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <h3 className="font-bold text-sm text-slate-200">Isi Utas Postingan</h3>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Teks Utas</label>
          <textarea
            value={threads.text}
            onChange={(e) => handleUpdate('text', e.target.value)}
            rows={3}
            placeholder="Mulai utas..."
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-slate-500"
          />
        </div>

        {/* Media */}
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Lampiran Foto Utas</label>
          <div className="flex items-center space-x-2">
            {threads.mediaUrl ? (
              <img
                src={threads.mediaUrl}
                alt="Media"
                className="w-12 h-12 rounded-lg object-cover border border-slate-700"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500">
                <ImageIcon className="w-5 h-5" />
              </div>
            )}
            <label className="flex-1 cursor-pointer">
              <div className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs text-slate-300 font-medium flex items-center justify-center space-x-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Media</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleMediaUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Suka</label>
            <input
              type="text"
              value={threads.likesCount}
              onChange={(e) => handleUpdate('likesCount', e.target.value)}
              className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Balasan</label>
            <input
              type="text"
              value={threads.repliesCount}
              onChange={(e) => handleUpdate('repliesCount', e.target.value)}
              className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Repost</label>
            <input
              type="text"
              value={threads.repostsCount}
              onChange={(e) => handleUpdate('repostsCount', e.target.value)}
              className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200"
            />
          </div>
        </div>
      </div>

      {/* Utas Nested Reply */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-200">Garis Utas & Balasan Bersambung</h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={threads.hasReply}
              onChange={(e) => handleUpdate('hasReply', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-400"></div>
          </label>
        </div>

        {threads.hasReply && (
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Nama Pembalas</label>
              <input
                type="text"
                value={threads.replyAuthorName || ''}
                onChange={(e) => handleUpdate('replyAuthorName', e.target.value)}
                placeholder="rian_aditya"
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-slate-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Isi Balasan Utas</label>
              <textarea
                value={threads.replyText || ''}
                onChange={(e) => handleUpdate('replyText', e.target.value)}
                rows={2}
                placeholder="Teks balasan..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-slate-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
