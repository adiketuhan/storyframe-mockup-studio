import React, { useState } from 'react';
import { useStory } from '../../context/StoryContext';
import { downloadSlidePng, batchExportZip, captureSlideElement } from '../../utils/exportUtils';
import { Download, FileArchive, CheckCircle2, Loader2, Image as ImageIcon, Sparkles } from 'lucide-react';

export const ExportPanel: React.FC = () => {
  const { slides, activeSlide, projectTitle, setActiveSlideId, currentSlideIndex } = useStory();
  const [isExportingSingle, setIsExportingSingle] = useState(false);
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [zipProgress, setZipProgress] = useState<{ current: number; total: number; percent: number } | null>(null);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  const handleDownloadSingle = async () => {
    const canvasElement = document.getElementById('storyframe-export-canvas');
    if (!canvasElement) {
      alert('Kanvas pratinjau tidak ditemukan.');
      return;
    }

    try {
      setIsExportingSingle(true);
      setExportSuccess(null);
      const indexStr = (currentSlideIndex + 1).toString().padStart(2, '0');
      const safeProject = (projectTitle || 'story').replace(/[^a-zA-Z0-9_-]/g, '_');
      const safeTitle = activeSlide.title.replace(/[^a-zA-Z0-9_-]/g, '_') || 'slide';
      const fileName = `slide-${indexStr}_${safeProject}_${activeSlide.platform}_${safeTitle}.png`;
      
      await downloadSlidePng(canvasElement, fileName);
      setExportSuccess(`Slide ${indexStr} berhasil diunduh sebagai "${fileName}" (1080x1440 PNG)!`);
    } catch (err) {
      console.error(err);
      alert('Gagal mengekspor gambar. Pastikan browser mendukung ekspor canvas.');
    } finally {
      setIsExportingSingle(false);
    }
  };

  const handleDownloadZip = async () => {
    try {
      setIsExportingZip(true);
      setExportSuccess(null);
      setZipProgress({ current: 0, total: slides.length, percent: 0 });

      // Function to render any slide by switching state temporarily
      const renderSlideToBlob = async (slide: typeof slides[0]) => {
        // Activate the slide
        setActiveSlideId(slide.id);
        // Small delay to allow React DOM and fonts to settle
        await new Promise(r => setTimeout(r, 180));
        
        const canvasElement = document.getElementById('storyframe-export-canvas');
        if (!canvasElement) throw new Error('Canvas not found');
        return await captureSlideElement(canvasElement, { pixelRatio: 2, width: 1080, height: 1440 });
      };

      await batchExportZip(
        slides,
        renderSlideToBlob,
        projectTitle || 'StoryFrame-Mockup-Project',
        (current, total, percentage) => {
          setZipProgress({ current, total, percent: percentage });
        }
      );

      setExportSuccess(`Seluruh ${slides.length} slide berhasil diekspor ke file ZIP dengan penamaan terurut (slide-01, slide-02, dst)!`);
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat memproses batch export ZIP.');
    } finally {
      setIsExportingZip(false);
      setZipProgress(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Export Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-base text-slate-100">Ekspor Gambar 3:4 High-DPI (1080x1440)</h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Semua slide dirender otomatis pada rasio terkunci 3:4 dengan resolusi ultra-tajam tanpa watermark di dalam gambar, dan otomatis diberi penamaan nomor urut (<code className="text-indigo-300 font-mono">slide-01.png</code>, <code className="text-indigo-300 font-mono">slide-02.png</code>) sehingga tidak akan tertukar saat diunggah ke TikTok/IG Carousel.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Single PNG Export */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <ImageIcon className="w-4 h-4 text-emerald-400" />
              <h4 className="font-bold text-sm text-slate-200">Unduh Slide Aktif Saja</h4>
            </div>
            <p className="text-xs text-slate-400">
              Menyimpan slide "{activeSlide.title}" sebagai <code className="text-emerald-300 font-mono">slide-{(currentSlideIndex + 1).toString().padStart(2, '0')}.png</code>.
            </p>
          </div>

          <button
            type="button"
            disabled={isExportingSingle || isExportingZip}
            onClick={handleDownloadSingle}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
          >
            {isExportingSingle ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Merender Gambar...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Current Slide (PNG)</span>
              </>
            )}
          </button>
        </div>

        {/* Batch ZIP Export */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <FileArchive className="w-4 h-4 text-indigo-400" />
              <h4 className="font-bold text-sm text-slate-200">Unduh Seluruh Cerita (ZIP)</h4>
            </div>
            <p className="text-xs text-slate-400">
              Mengekspor {slides.length} slide secara batch dengan penamaan terurut (<code className="text-indigo-300">slide-01.png</code>, <code className="text-indigo-300">slide-02.png</code>, dst).
            </p>
          </div>

          <button
            type="button"
            disabled={isExportingSingle || isExportingZip}
            onClick={handleDownloadZip}
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
          >
            {isExportingZip ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses Batch ({zipProgress?.current}/{zipProgress?.total})...</span>
              </>
            ) : (
              <>
                <FileArchive className="w-4 h-4" />
                <span>Download All Slides (ZIP)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar during ZIP Export */}
      {isExportingZip && zipProgress && (
        <div className="bg-indigo-950/60 border border-indigo-800/80 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-indigo-200 font-medium">
            <span>Merender slide {zipProgress.current} dari {zipProgress.total}...</span>
            <span>{zipProgress.percent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-200"
              style={{ width: `${zipProgress.percent}%` }}
            />
          </div>
        </div>
      )}

      {/* Success Notification */}
      {exportSuccess && (
        <div className="bg-emerald-950/60 border border-emerald-800 text-emerald-200 rounded-2xl p-3.5 flex items-center space-x-2.5 text-xs font-medium animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{exportSuccess}</span>
        </div>
      )}

      {/* Export Specifications Info */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 space-y-1.5">
        <h5 className="font-bold text-slate-300">Spesifikasi Render Teknis:</h5>
        <ul className="list-disc list-inside space-y-1 text-slate-400">
          <li>Aspek Rasio Terkunci: <strong>3:4 (Portrait)</strong></li>
          <li>Resolusi Standar Ekspor: <strong>1080 x 1440 px</strong></li>
          <li>Kualitas: <strong>High-DPI Ultra Sharp (pixelRatio: 2)</strong></li>
          <li>Tampilan Screenshot: <strong>100% Bersih & Otentik (Zero Watermark di dalam HP)</strong>.</li>
        </ul>
      </div>
    </div>
  );
};
