import React from 'react';
import { useStory } from '../../../context/StoryContext';
import type { WAMessage, WAMessageType, WAMessageStatus } from '../../../types/story';
import { Plus, Trash2, ArrowUp, ArrowDown, Mic, Ban, Image as ImageIcon, Upload, ShieldAlert, Lock } from 'lucide-react';
import { fileToBase64, PRESET_MEDIA } from '../../../utils/imageUtils';
import { CharacterQuickPicker } from '../../characters/CharacterQuickPicker';

export const WAEditor: React.FC = () => {
  const { activeSlide, updateActiveSlide, characters } = useStory();
  const { whatsapp } = activeSlide;

  const handleUpdateHeader = (field: string, value: any) => {
    updateActiveSlide(slide => ({
      ...slide,
      whatsapp: {
        ...slide.whatsapp,
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

  const addMessage = (type: WAMessageType, sender: 'me' | 'them' = 'them') => {
    const newMsg: WAMessage = {
      id: `m-${Date.now()}`,
      sender,
      type,
      text:
        type === 'deleted'
          ? 'Pesan ini telah dihapus'
          : type === 'voice'
          ? 'Voice Message'
          : type === 'system'
          ? 'Anda telah memblokir kontak ini. Ketuk untuk membuka blokir.'
          : '',
      time: activeSlide.statusBar.time,
      status: 'read',
      voiceDuration: type === 'voice' ? '0:15' : undefined,
      mediaUrl: type === 'image' ? PRESET_MEDIA.cctvEvidence : undefined,
    };

    updateActiveSlide(slide => ({
      ...slide,
      whatsapp: {
        ...slide.whatsapp,
        messages: [...slide.whatsapp.messages, newMsg],
      },
    }));
  };

  const updateMessage = (index: number, updated: Partial<WAMessage>) => {
    updateActiveSlide(slide => {
      const msgs = [...slide.whatsapp.messages];
      msgs[index] = { ...msgs[index], ...updated };
      return {
        ...slide,
        whatsapp: {
          ...slide.whatsapp,
          messages: msgs,
        },
      };
    });
  };

  const deleteMessage = (index: number) => {
    updateActiveSlide(slide => {
      const msgs = slide.whatsapp.messages.filter((_, i) => i !== index);
      return {
        ...slide,
        whatsapp: {
          ...slide.whatsapp,
          messages: msgs,
        },
      };
    });
  };

  const moveMessage = (index: number, direction: 'up' | 'down') => {
    updateActiveSlide(slide => {
      const msgs = [...slide.whatsapp.messages];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= msgs.length) return slide;
      const temp = msgs[index];
      msgs[index] = msgs[targetIndex];
      msgs[targetIndex] = temp;
      return {
        ...slide,
        whatsapp: {
          ...slide.whatsapp,
          messages: msgs,
        },
      };
    });
  };

  const handleMediaUpload = async (index: number, file: File) => {
    const base64 = await fileToBase64(file);
    updateMessage(index, { mediaUrl: base64, type: 'image' });
  };

  return (
    <div className="space-y-4">
      {/* Contact Profile Setting */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <h3 className="font-bold text-sm text-slate-200">Profil Lawan Bicara WhatsApp</h3>

        {/* Quick Cast Selector */}
        <CharacterQuickPicker
          label="Pilih Lawan Bicara dari Pemeran:"
          selectedCharacterId={whatsapp.characterId}
          onSelect={(charId) => {
            const char = characters.find(c => c.id === charId);
            if (char) {
              handleUpdateHeader('contactName', char.name);
              handleUpdateHeader('avatar', char.avatar);
              handleUpdateHeader('characterId', char.id);
              if (char.phoneOrStatus) handleUpdateHeader('status', char.phoneOrStatus);
            }
          }}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Contact Name */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">Nama Kontak / Nomor</label>
            <input
              type="text"
              value={whatsapp.contactName}
              onChange={(e) => handleUpdateHeader('contactName', e.target.value)}
              placeholder="+62 812-xxxx atau Nama"
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">Status Chat</label>
            <div className="flex space-x-1.5">
              <input
                type="text"
                value={whatsapp.status}
                onChange={(e) => handleUpdateHeader('status', e.target.value)}
                placeholder="online / mengetik..."
                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            {/* Quick preset status */}
            <div className="flex space-x-1 mt-1.5 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => handleUpdateHeader('status', 'online')}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-[11px] text-emerald-400"
              >
                Online
              </button>
              <button
                type="button"
                onClick={() => handleUpdateHeader('status', 'mengetik...')}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-[11px] text-emerald-400"
              >
                Mengetik...
              </button>
              <button
                type="button"
                onClick={() => handleUpdateHeader('status', 'terakhir dilihat hari ini pukul 23:40')}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-[11px] text-slate-300"
              >
                Last Seen
              </button>
            </div>
          </div>
        </div>

        {/* Contact Avatar */}
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Foto Profil Lawan Bicara</label>
          <div className="flex items-center space-x-2">
            <img
              src={whatsapp.avatar}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover border border-slate-700 bg-slate-800"
            />
            <label className="flex-1 cursor-pointer">
              <div className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs text-slate-300 font-medium flex items-center justify-center space-x-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>Ganti Foto Kontak</span>
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

      {/* Feature: BLOKIR NOMOR / KONTAK (Fitur Konten Lucu & Drama) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <div>
              <h3 className="font-bold text-sm text-slate-200">Status Blokir Kontak (Konten Lucu / Drama)</h3>
              <p className="text-[11px] text-slate-400">Mengubah input bar bawah menjadi banner "Kontak Diblokir"</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={!!whatsapp.isBlocked}
              onChange={(e) => handleUpdateHeader('isBlocked', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
          </label>
        </div>

        {whatsapp.isBlocked && (
          <div className="space-y-2.5 pt-2 border-t border-slate-800/80 text-xs">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Teks Banner Blokir</label>
              <input
                type="text"
                value={whatsapp.blockedNoticeText || 'Anda telah memblokir kontak ini. Ketuk untuk membuka blokir.'}
                onChange={(e) => handleUpdateHeader('blockedNoticeText', e.target.value)}
                placeholder="Anda telah memblokir kontak ini. Ketuk untuk membuka blokir."
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Quick Block Preset Phrases */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => handleUpdateHeader('blockedNoticeText', 'Anda telah memblokir kontak ini. Ketuk untuk membuka blokir.')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-[11px] text-slate-300"
              >
                🔒 Anda Memblokir Kontak Ini
              </button>
              <button
                type="button"
                onClick={() => handleUpdateHeader('blockedNoticeText', 'Kontak ini telah memblokir Anda.')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-[11px] text-rose-300"
              >
                🚫 Dia Memblokir Anda
              </button>
              <button
                type="button"
                onClick={() => handleUpdateHeader('blockedNoticeText', 'Nomor ini sudah tidak dapat menerima pesan.')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-[11px] text-amber-300"
              >
                ⚠️ Nomor Tidak Aktif
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Message List Manager */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-200">Daftar Balon Chat ({whatsapp.messages.length})</h3>
        </div>

        {/* Quick Add Message Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => addMessage('text', 'them')}
            className="p-2 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 text-emerald-200 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Pesan Masuk (Kiri)</span>
          </button>
          <button
            type="button"
            onClick={() => addMessage('text', 'me')}
            className="p-2 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 text-emerald-200 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Pesan Keluar (Kanan)</span>
          </button>
          <button
            type="button"
            onClick={() => addMessage('voice', 'me')}
            className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1"
          >
            <Mic className="w-3.5 h-3.5 text-amber-400" />
            <span>+ Voice Note</span>
          </button>
          <button
            type="button"
            onClick={() => addMessage('deleted', 'them')}
            className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1"
          >
            <Ban className="w-3.5 h-3.5 text-red-400" />
            <span>+ Pesan Dihapus</span>
          </button>
          <button
            type="button"
            onClick={() => addMessage('system', 'them')}
            className="p-2 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/60 text-rose-200 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 col-span-2 sm:col-span-2"
          >
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span>+ Notifikasi Sistem / Blokir di Chat</span>
          </button>
        </div>

        {/* Messages List Item Cards */}
        <div className="space-y-3 pt-2">
          {whatsapp.messages.map((msg, index) => (
            <div
              key={msg.id || index}
              className={`p-3 rounded-xl border ${
                msg.type === 'system'
                  ? 'bg-amber-950/20 border-amber-800/40'
                  : msg.sender === 'me'
                  ? 'bg-emerald-950/20 border-emerald-900/40'
                  : 'bg-slate-950 border-slate-800'
              } space-y-2.5 transition-all`}
            >
              {/* Message Header Controls */}
              <div className="flex items-center justify-between">
                {msg.type === 'system' ? (
                  <span className="text-xs font-bold text-amber-400 flex items-center space-x-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Notifikasi Sistem (Tengah)</span>
                  </span>
                ) : (
                  <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                    <button
                      type="button"
                      onClick={() => updateMessage(index, { sender: 'them' })}
                      className={`px-2 py-0.5 text-xs rounded font-medium ${
                        msg.sender === 'them' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      Lawan (Kiri)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateMessage(index, { sender: 'me' })}
                      className={`px-2 py-0.5 text-xs rounded font-medium ${
                        msg.sender === 'me' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      Saya (Kanan)
                    </button>
                  </div>
                )}

                {/* Reorder and Delete Actions */}
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
                    disabled={index === whatsapp.messages.length - 1}
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

              {/* Message Type Selector */}
              <div className="flex items-center space-x-1 overflow-x-auto text-[11px] pb-1">
                {(['text', 'image', 'voice', 'deleted', 'system'] as WAMessageType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => updateMessage(index, { type: t })}
                    className={`px-2.5 py-1 rounded-lg uppercase tracking-wider font-semibold ${
                      msg.type === t
                        ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}
                  >
                    {t === 'text' ? 'Teks' : t === 'image' ? 'Foto' : t === 'voice' ? 'VN' : t === 'deleted' ? 'Dihapus' : 'Sistem'}
                  </button>
                ))}
              </div>

              {/* Text Input / Voice duration / Media / System */}
              {msg.type === 'text' && (
                <textarea
                  value={msg.text}
                  onChange={(e) => updateMessage(index, { text: e.target.value })}
                  rows={2}
                  placeholder="Ketik isi pesan di sini..."
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
                />
              )}

              {msg.type === 'system' && (
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={msg.text}
                    onChange={(e) => updateMessage(index, { text: e.target.value })}
                    placeholder="🔒 Anda telah memblokir kontak ini. Ketuk untuk membuka blokir."
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-amber-200 focus:outline-none"
                  />
                  <div className="flex space-x-1">
                    <button
                      type="button"
                      onClick={() => updateMessage(index, { text: '🔒 Anda telah memblokir kontak ini. Ketuk untuk membuka blokir.' })}
                      className="px-2 py-0.5 bg-slate-800 text-[10px] text-slate-300 rounded"
                    >
                      Blokir Kontak
                    </button>
                    <button
                      type="button"
                      onClick={() => updateMessage(index, { text: 'Panggilan suara tidak terjawab' })}
                      className="px-2 py-0.5 bg-slate-800 text-[10px] text-slate-300 rounded"
                    >
                      Panggilan Tak Terjawab
                    </button>
                  </div>
                </div>
              )}

              {msg.type === 'voice' && (
                <div className="flex items-center space-x-2">
                  <label className="text-xs text-slate-400">Durasi Audio VN:</label>
                  <input
                    type="text"
                    value={msg.voiceDuration || '0:14'}
                    onChange={(e) => updateMessage(index, { voiceDuration: e.target.value })}
                    placeholder="0:14"
                    className="w-24 px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200"
                  />
                </div>
              )}

              {msg.type === 'image' && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {msg.mediaUrl ? (
                      <img
                        src={msg.mediaUrl}
                        alt="Preview"
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
                        <span>Upload Gambar Lampiran</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleMediaUpload(index, e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={msg.text}
                    onChange={(e) => updateMessage(index, { text: e.target.value })}
                    placeholder="Keterangan / Caption foto (opsional)..."
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
                  />
                </div>
              )}

              {msg.type === 'deleted' && (
                <input
                  type="text"
                  value={msg.text}
                  onChange={(e) => updateMessage(index, { text: e.target.value })}
                  placeholder="Pesan ini telah dihapus"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400 italic"
                />
              )}

              {/* Time and Ticks Setting */}
              {msg.type !== 'system' && (
                <div className="flex items-center justify-between pt-1 border-t border-slate-900">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs text-slate-500">Jam:</span>
                    <input
                      type="text"
                      value={msg.time}
                      onChange={(e) => updateMessage(index, { time: e.target.value })}
                      className="w-20 px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-xs text-slate-300"
                    />
                  </div>

                  {msg.sender === 'me' && (
                    <div className="flex items-center space-x-1 text-xs">
                      <span className="text-slate-500">Status:</span>
                      <select
                        value={msg.status}
                        onChange={(e) => updateMessage(index, { status: e.target.value as WAMessageStatus })}
                        className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-xs text-slate-300"
                      >
                        <option value="sent">Centang 1 (Terkirim)</option>
                        <option value="delivered">Centang 2 Abu (Sampai)</option>
                        <option value="read">Centang 2 Biru (Dibaca)</option>
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
