import React from 'react';
import { useStory } from '../../../context/StoryContext';
import { Upload, Image as ImageIcon, Heart } from 'lucide-react';
import { fileToBase64, PRESET_MEDIA } from '../../../utils/imageUtils';
import { CharacterQuickPicker } from '../../characters/CharacterQuickPicker';

export const InstagramFeedEditor: React.FC = () => {
  const { activeSlide, updateActiveSlide, characters } = useStory();
  const { instagramFeed } = activeSlide;

  const handleUpdate = (field: string, value: any) => {
    updateActiveSlide(slide => ({
      ...slide,
      instagramFeed: {
        ...slide.instagramFeed,
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
        <h3 className="font-bold text-sm text-slate-200">Profil Postingan Instagram Feed</h3>

        {/* Quick Character Picker */}
        <CharacterQuickPicker
          label="Pilih Akun Pembuat Postingan:"
          selectedCharacterId={instagramFeed.characterId}
          onSelect={(charId) => {
            const char = characters.find(c => c.id === charId);
            if (char) {
              handleUpdate('authorName', char.handle || char.name.toLowerCase().replace(/\s+/g, '_'));
              handleUpdate('avatar', char.avatar);
              handleUpdate('verified', !!char.verified);
              handleUpdate('characterId', char.id);
            }
          }}
        />

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Username</label>
            <input
              type="text"
              value={instagramFeed.authorName}
              onChange={(e) => handleUpdate('authorName', e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Tag Lokasi</label>
            <input
              type="text"
              value={instagramFeed.location || ''}
              onChange={(e) => handleUpdate('location', e.target.value)}
              placeholder="Pine Hills Hillside Villa"
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-1">
          <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={instagramFeed.verified}
              onChange={(e) => handleUpdate('verified', e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-rose-600 focus:ring-0"
            />
            <span>Badge Centang Biru</span>
          </label>
        </div>

        {/* Avatar */}
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Foto Profil</label>
          <div className="flex items-center space-x-2">
            <img
              src={instagramFeed.avatar}
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

      {/* Main Feed Post Content */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <h3 className="font-bold text-sm text-slate-200">Foto & Caption Postingan</h3>

        {/* Photo Upload */}
        <div className="space-y-2">
          <label className="block text-xs text-slate-400">Foto Utama Feed:</label>
          <div className="flex items-center space-x-2">
            {instagramFeed.mediaUrl ? (
              <img
                src={instagramFeed.mediaUrl}
                alt="Post Media"
                className="w-14 h-14 rounded-lg object-cover border border-slate-700"
              />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500">
                <ImageIcon className="w-6 h-6" />
              </div>
            )}
            <label className="flex-1 cursor-pointer">
              <div className="py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs text-slate-300 font-medium flex items-center justify-center space-x-1.5">
                <Upload className="w-4 h-4" />
                <span>Upload Foto Feed</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleMediaUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex space-x-1 mt-2 overflow-x-auto pb-1">
            <span className="text-[11px] text-slate-500 shrink-0">Preset:</span>
            <button
              type="button"
              onClick={() => handleUpdate('mediaUrl', PRESET_MEDIA.abandonedHouse)}
              className="px-2 py-0.5 bg-slate-800 text-[11px] text-slate-300 rounded shrink-0"
            >
              Villa Gelap
            </button>
            <button
              type="button"
              onClick={() => handleUpdate('mediaUrl', PRESET_MEDIA.cctvEvidence)}
              className="px-2 py-0.5 bg-slate-800 text-[11px] text-slate-300 rounded shrink-0"
            >
              CCTV Taman
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

        {/* Caption */}
        <div>
          <label className="block text-xs text-slate-400 mb-1">Caption Postingan</label>
          <textarea
            value={instagramFeed.caption}
            onChange={(e) => handleUpdate('caption', e.target.value)}
            rows={3}
            className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-rose-500"
          />
        </div>

        {/* Likes Count & Liked state */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Jumlah Suka</label>
            <input
              type="text"
              value={instagramFeed.likesCount}
              onChange={(e) => handleUpdate('likesCount', e.target.value)}
              placeholder="1,420 suka"
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Status Like (Hati Merah)</label>
            <button
              type="button"
              onClick={() => handleUpdate('isLiked', !instagramFeed.isLiked)}
              className={`w-full py-1.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 ${
                instagramFeed.isLiked
                  ? 'bg-rose-950/60 border-rose-800 text-rose-300'
                  : 'bg-slate-950 border-slate-700 text-slate-400'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${instagramFeed.isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{instagramFeed.isLiked ? 'Disukai (Merah)' : 'Belum Disukai'}</span>
            </button>
          </div>
        </div>

        {/* Comments preview & Timestamp */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Teks Komentar</label>
            <input
              type="text"
              value={instagramFeed.commentCount || ''}
              onChange={(e) => handleUpdate('commentCount', e.target.value)}
              placeholder="Lihat semua 42 komentar"
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Waktu Relatif</label>
            <input
              type="text"
              value={instagramFeed.timestamp}
              onChange={(e) => handleUpdate('timestamp', e.target.value)}
              placeholder="3 JAM YANG LALU"
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
