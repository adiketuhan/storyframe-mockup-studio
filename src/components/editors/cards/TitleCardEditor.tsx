import React from 'react';
import { useStory } from '../../../context/StoryContext';
import { Palette, Upload, Flame } from 'lucide-react';
import type { TitleCardData } from '../../../types/story';

export const TitleCardEditor: React.FC = () => {
  const { activeSlide, updateActiveSlide } = useStory();
  const data: TitleCardData = activeSlide.titleCard || {
    mainTitle: 'Rental Sound Berujung Drama Horeg',
    subtitle: 'Kisah nyata pesanan sound hajatan yang mendadak penuh misteri...',
    badgeText: 'KISAH NYATA • PART 1',
    callToAction: 'Geser ke kanan untuk membaca ➔',
    themeStyle: 'cinematic_dark',
  };

  const handleUpdate = (field: keyof TitleCardData, value: any) => {
    updateActiveSlide(slide => ({
      ...slide,
      titleCard: {
        ...(slide.titleCard || data),
        [field]: value,
      },
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleUpdate('coverImageUrl', event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Title & Badge Details */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <h3 className="font-bold text-xs text-slate-300 flex items-center space-x-1.5">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>Judul Cover & Hook Pembuka</span>
        </h3>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Lencana Kategori (Badge Atas)</label>
          <input
            type="text"
            value={data.badgeText}
            onChange={(e) => handleUpdate('badgeText', e.target.value)}
            placeholder="KISAH NYATA • PART 1"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Judul Utama Cerita (Tebal & Menarik)</label>
          <input
            type="text"
            value={data.mainTitle}
            onChange={(e) => handleUpdate('mainTitle', e.target.value)}
            placeholder="Judul Utama..."
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm font-bold text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Sinopsis Singkat / Kalimat Hook</label>
          <textarea
            rows={3}
            value={data.subtitle}
            onChange={(e) => handleUpdate('subtitle', e.target.value)}
            placeholder="Tulis sinopsis ringkas yang membuat penonton penasaran..."
            className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Teks Ajakan Geser (Call To Action)</label>
          <input
            type="text"
            value={data.callToAction}
            onChange={(e) => handleUpdate('callToAction', e.target.value)}
            placeholder="Geser ke kanan untuk membaca ➔"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Theme Style & Background Image */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <h3 className="font-bold text-xs text-slate-300 flex items-center space-x-1.5">
          <Palette className="w-3.5 h-3.5 text-purple-400" />
          <span>Tema Visual Cover</span>
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'cinematic_dark', name: 'Sinematik Gelap' },
            { id: 'horror_red', name: 'Misteri Horor Merah' },
            { id: 'viral_purple', name: 'Viral Ungu Modern' },
            { id: 'midnight_blue', name: 'Midnight Biru Tua' },
          ].map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => handleUpdate('themeStyle', theme.id)}
              className={`py-2 px-2.5 rounded-xl text-xs font-semibold text-center transition-all ${
                data.themeStyle === theme.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {theme.name}
            </button>
          ))}
        </div>

        {/* Optional Custom Cover Photo */}
        <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
          <label className="block text-xs text-slate-400">Gambar Latar Belakang (Opsional):</label>
          <label className="flex items-center justify-center space-x-2 py-2.5 px-4 border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl cursor-pointer bg-slate-950/60 transition-colors">
            <Upload className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-300">Pilih Gambar Background</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
