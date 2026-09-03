import React from 'react';
import { useStory } from '../../../context/StoryContext';
import { ChevronLeft, ChevronRight, Hash, Edit3, RotateCcw } from 'lucide-react';

export const ExternalPageIndicator: React.FC = () => {
  const {
    watermark,
    projectTitle,
    currentSlideIndex,
    slides,
    setProjectTitle,
    setActiveSlideId,
    activeSlide,
    updateActiveSlide,
  } = useStory();

  if (!watermark.show) return null;

  const startOffset = watermark.startPageNumber ? watermark.startPageNumber - 1 : 0;
  const currentNum = (currentSlideIndex + 1 + startOffset).toString().padStart(2, '0');
  const totalNum = (watermark.customTotalPages || (slides.length + startOffset)).toString().padStart(2, '0');
  const defaultPageString = `Halaman ${currentNum} / ${totalNum}`;

  const displayedPageString = activeSlide?.customPageLabel || defaultPageString;

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

  const handleResetCustomPage = () => {
    updateActiveSlide({ customPageLabel: undefined });
  };

  return (
    <div className="w-full max-w-[420px] mt-3 flex items-center justify-between px-3.5 py-2 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg backdrop-blur-md text-xs">
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

        {/* Editable Page Number Badge */}
        <div className="relative group flex items-center">
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
              const text = e.currentTarget.textContent?.trim();
              updateActiveSlide({ customPageLabel: text || undefined });
            }}
            className={`font-mono font-bold text-xs px-2.5 py-1 rounded-lg border shadow-inner transition-colors cursor-text ${
              activeSlide?.customPageLabel
                ? 'bg-amber-950/80 border-amber-500/80 text-amber-200'
                : 'bg-indigo-950/80 border-indigo-800/60 text-indigo-300 hover:border-indigo-500'
            }`}
            title="Klik untuk mengedit/merubah nomor halaman ini secara bebas"
          >
            {displayedPageString}
          </span>

          {activeSlide?.customPageLabel && (
            <button
              type="button"
              onClick={handleResetCustomPage}
              className="ml-1 p-0.5 text-slate-500 hover:text-amber-300"
              title="Reset ke nomor otomatis"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>

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
