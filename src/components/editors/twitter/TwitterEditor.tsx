import React from 'react';
import { useStory } from '../../../context/StoryContext';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { fileToBase64, PRESET_MEDIA } from '../../../utils/imageUtils';
import { CharacterQuickPicker } from '../../characters/CharacterQuickPicker';

export const TwitterEditor: React.FC = () => {
  const { activeSlide, updateActiveSlide, characters } = useStory();
  const { twitter } = activeSlide;

  const handleUpdate = (field: string, value: any) => {
    updateActiveSlide(slide => ({
      ...slide,
      twitter: {
        ...slide.twitter,
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
        <h3 className="font-bold text-sm text-slate-200">Profil Akun X (Twitter)</h3>

        {/* Quick Character Picker */}
        <CharacterQuickPicker
          label="Pilih Akun Penulis Tweet:"
          selectedCharacterId={twitter.characterId}
          onSelect={(charId) => {
            const char = characters.find(c => c.id === charId);
            if (char) {
              handleUpdate('authorName', char.name);
              handleUpdate('handle', char.handle);
              handleUpdate('avatar', char.avatar);
              handleUpdate('verified', !!char.verified);
              handleUpdate('characterId', char.id);
            }
          }}
        />

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Nama Tampilan</label>
            <input
              type="text"
              value={twitter.authorName}
              onChange={(e) => handleUpdate('authorName', e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Handle (@username)</label>
            <input
              type="text"
              value={twitter.handle}
              onChange={(e) => handleUpdate('handle', e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Verified Badge */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Lencana Verifikasi</label>
            <select
              value={twitter.verified ? twitter.verifiedType : 'none'}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'none') {
                  handleUpdate('verified', false);
                } else {
                  handleUpdate('verified', true);
                  handleUpdate('verifiedType', val);
                }
              }}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="none">Tanpa Badge</option>
              <option value="blue">Centang Biru (Verified Blue)</option>
              <option value="gold">Centang Emas (Organisasi / Brand)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Perangkat Posting</label>
            <input
              type="text"
              value={twitter.device}
              onChange={(e) => handleUpdate('device', e.target.value)}
              placeholder="Twitter for iPhone"
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Avatar */}
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Foto Profil</label>
          <div className="flex items-center space-x-2">
            <img
              src={twitter.avatar}
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

      {/* Tweet Content */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <h3 className="font-bold text-sm text-slate-200">Konten Tweet / Post</h3>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Isi Teks Postingan</label>
          <textarea
            value={twitter.text}
            onChange={(e) => handleUpdate('text', e.target.value)}
            rows={4}
            placeholder="Apa yang sedang terjadi?"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Media Attachment */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-slate-400">Lampiran Foto Media</label>
            {twitter.mediaUrl && (
              <button
                type="button"
                onClick={() => handleUpdate('mediaUrl', '')}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Hapus Foto
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {twitter.mediaUrl ? (
              <img
                src={twitter.mediaUrl}
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
                <span>Upload Media Postingan</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleMediaUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Quick Presets */}
          <div className="flex space-x-1 mt-2 overflow-x-auto pb-1">
            <span className="text-[11px] text-slate-500 shrink-0">Preset:</span>
            <button
              type="button"
              onClick={() => handleUpdate('mediaUrl', PRESET_MEDIA.abandonedHouse)}
              className="px-2 py-0.5 bg-slate-800 text-[11px] text-slate-300 rounded shrink-0"
            >
              Rumah Gelap
            </button>
            <button
              type="button"
              onClick={() => handleUpdate('mediaUrl', PRESET_MEDIA.cctvEvidence)}
              className="px-2 py-0.5 bg-slate-800 text-[11px] text-slate-300 rounded shrink-0"
            >
              CCTV Malam
            </button>
            <button
              type="button"
              onClick={() => handleUpdate('mediaUrl', PRESET_MEDIA.documentEvidence)}
              className="px-2 py-0.5 bg-slate-800 text-[11px] text-slate-300 rounded shrink-0"
            >
              Dokumen Rahasia
            </button>
          </div>
        </div>

        {/* Timestamp */}
        <div>
          <label className="block text-xs text-slate-400 mb-1">Format Tanggal & Jam</label>
          <input
            type="text"
            value={twitter.timestamp}
            onChange={(e) => handleUpdate('timestamp', e.target.value)}
            placeholder="11:38 PM · 24 Okt 2026"
            className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Metrics Counters */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <h3 className="font-bold text-sm text-slate-200">Statistik / Metrik Interaksi</h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Views (Tayangan)</label>
            <input
              type="text"
              value={twitter.viewsCount}
              onChange={(e) => handleUpdate('viewsCount', e.target.value)}
              className="w-full px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Repost</label>
            <input
              type="text"
              value={twitter.repostsCount}
              onChange={(e) => handleUpdate('repostsCount', e.target.value)}
              className="w-full px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Kutipan (Quotes)</label>
            <input
              type="text"
              value={twitter.quotesCount}
              onChange={(e) => handleUpdate('quotesCount', e.target.value)}
              className="w-full px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Likes (Suka)</label>
            <input
              type="text"
              value={twitter.likesCount}
              onChange={(e) => handleUpdate('likesCount', e.target.value)}
              className="w-full px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Bookmarks (Markah)</label>
            <input
              type="text"
              value={twitter.bookmarksCount}
              onChange={(e) => handleUpdate('bookmarksCount', e.target.value)}
              className="w-full px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
