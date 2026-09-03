import React from 'react';
import { useStory } from '../../context/StoryContext';
import { Users, CheckCircle2 } from 'lucide-react';

interface CharacterQuickPickerProps {
  label?: string;
  onSelect?: (characterId: string) => void;
  selectedCharacterId?: string;
}

export const CharacterQuickPicker: React.FC<CharacterQuickPickerProps> = ({
  label = 'Pilih dari Daftar Pemeran Cerita:',
  onSelect,
  selectedCharacterId,
}) => {
  const { characters, applyCharacterToActiveSlide } = useStory();

  const handlePick = (charId: string) => {
    if (onSelect) {
      onSelect(charId);
    } else {
      applyCharacterToActiveSlide(charId);
    }
  };

  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-400 flex items-center space-x-1.5">
          <Users className="w-3.5 h-3.5 text-indigo-400" />
          <span>{label}</span>
        </span>
      </div>

      {/* Horizontal Carousel of Characters */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin">
        {characters.map((char) => {
          const isSelected = selectedCharacterId === char.id;

          return (
            <button
              key={char.id}
              type="button"
              onClick={() => handlePick(char.id)}
              className={`px-2.5 py-1.5 rounded-xl border flex items-center space-x-2 shrink-0 transition-all ${
                isSelected
                  ? 'bg-indigo-950/80 border-indigo-500 text-indigo-200 ring-2 ring-indigo-500/20 shadow-md'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
              title={`Terapkan ${char.name} (${char.roleLabel})`}
            >
              <img
                src={char.avatar}
                alt={char.name}
                className="w-6 h-6 rounded-full object-cover border border-slate-700 shrink-0"
              />
              <div className="flex flex-col text-left">
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-bold leading-tight max-w-[100px] truncate">
                    {char.name}
                  </span>
                  {char.verified && (
                    <CheckCircle2 className="w-3 h-3 fill-sky-500 text-white shrink-0" />
                  )}
                </div>
                <span className="text-[9.5px] text-slate-400 leading-tight truncate">
                  {char.roleLabel}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
