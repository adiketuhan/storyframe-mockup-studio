import { toBlob, toPng } from 'html-to-image';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import type { Slide } from '../types/story';

export interface RenderOptions {
  pixelRatio?: number;
  width?: number;
  height?: number;
}

/**
 * Capture an element as a 1080x1440 PNG Blob (Sharp 90-degree square corners, no white corner artifacts)
 */
export const captureSlideElement = async (
  element: HTMLElement,
  options: RenderOptions = {}
): Promise<Blob> => {
  const pixelRatio = options.pixelRatio || 2;
  const targetWidth = options.width || 1080;
  const targetHeight = options.height || 1440;

  if (document.fonts) {
    await document.fonts.ready;
  }

  const blob = await toBlob(element, {
    pixelRatio: pixelRatio,
    canvasWidth: targetWidth,
    canvasHeight: targetHeight,
    quality: 0.98,
    cacheBust: true,
    style: {
      transform: 'none',
      borderRadius: '0px',
    },
    filter: (node: HTMLElement) => {
      if (node.classList && node.classList.contains('no-export')) {
        return false;
      }
      return true;
    }
  });

  if (!blob) {
    throw new Error('Failed to generate image blob');
  }

  return blob;
};

/**
 * Download a single slide as PNG (1080x1440, 100% rectangular bleed)
 */
export const downloadSlidePng = async (
  element: HTMLElement,
  filename: string = 'story-slide.png'
): Promise<void> => {
  const dataUrl = await toPng(element, {
    pixelRatio: 2,
    canvasWidth: 1080,
    canvasHeight: 1440,
    quality: 0.98,
    cacheBust: true,
    style: {
      transform: 'none',
      borderRadius: '0px',
    },
  });

  saveAs(dataUrl, filename);
};

/**
 * Batch export all slides into a single organized ZIP
 */
export const batchExportZip = async (
  slides: Slide[],
  renderSlideCallback: (slide: Slide) => Promise<Blob>,
  projectTitle: string = 'StoryFrame-Mockup-Project',
  onProgress?: (current: number, total: number, percentage: number) => void
): Promise<void> => {
  const zip = new JSZip();
  const folderName = projectTitle.replace(/[^a-zA-Z0-9_-]/g, '_') || 'StoryFrame-Slides';
  const folder = zip.folder(folderName) || zip;

  const total = slides.length;

  for (let i = 0; i < total; i++) {
    const slide = slides[i];
    const indexStr = (i + 1).toString().padStart(2, '0');
    const safeTitle = (slide.title || `slide-${i + 1}`).replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `slide-${indexStr}_${slide.platform}_${safeTitle}.png`;

    // Render slide element to blob
    const blob = await renderSlideCallback(slide);
    folder.file(filename, blob);

    if (onProgress) {
      const percent = Math.round(((i + 1) / total) * 100);
      onProgress(i + 1, total, percent);
    }
  }

  const content = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  saveAs(content, `${folderName}.zip`);
};
