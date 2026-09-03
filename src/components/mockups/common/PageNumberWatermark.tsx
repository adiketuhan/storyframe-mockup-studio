import React from 'react';
import { useStory } from '../../../context/StoryContext';
import { ChevronLeft, ChevronRight, Hash, Edit3 } from 'lucide-react';

export const ExternalPageIndicator: React.FC = () => {
  const { watermark, projectTitle, currentSlideIndex, slides, setProjectTitle, setActiveSlideId } = useStory();

  if (!watermark.show) return null;

  const total = slides.length;
  const currentNum = (currentSlideIndex + 1).toString().padStart(2, '0');
  const totalNum = total.toString().padStart(2, '0');
  const pageString = `Halaman ${currentNum} / ${totalNum}`;

  const titleText = watermark.useProjectTitle
    ? projectTitle
    : watermark.customTitle || projectTitle;

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setActiveSlideId(slides[currentSlideIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setActiveSlideId(slides[currentSlideIndex + 1].id);
    }
  };

  return (
    <div className="w-full max-w-[420px] mt-3 flex items-center justify-between px-3 py-2 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg backdrop-blur-md text-xs">
      {/* Title & Edit Icon */}
      <div className="flex items-center space-x-2 truncate flex-1 mr-2">
        <Hash className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
        <div className="flex items-center space-x-1.5 truncate">
          <span
            className="text-slate-200 font-semibold truncate hover:text-indigo-300 focus:text-white cursor-text"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => setProjectTitle(e.currentTarget.textContent || projectTitle)}
            title="Klik untuk ubah judul konten"
          >
            {titleText}
          </span>
          <Edit3 className="w-3 h-3 text-slate-500 shrink-0 pointer-events-none" />
        </div>
      </div>

      {/* Slide / Page Number Badge & Navigation */}
      <div className="flex items-center space-x-1 shrink-0">
        <button
          type="button"
          disabled={currentSlideIndex === 0}
          onClick={handlePrev}
          className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800"
          title="Slide Sebelumnya"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="font-mono font-bold text-xs text-indigo-300 px-2 py-0.5 rounded-lg bg-indigo-950/80 border border-indigo-800/60 shadow-inner">
          {pageString}
        </span>

        <button
          type="button"
          disabled={currentSlideIndex === slides.length - 1}
          onClick={handleNext}
          className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800"
          title="Slide Berikutnya"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
