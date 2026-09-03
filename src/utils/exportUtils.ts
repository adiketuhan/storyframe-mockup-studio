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
 * Capture an element as a 1080x1440 PNG Blob
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
 * Download a single slide as PNG (1080x1440)
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
  });

  saveAs(dataUrl, filename);
};

/**
 * Batch render all slides into a ZIP archive
 */
export const batchExportZip = async (
  slides: Slide[],
  renderSlideToBlob: (slide: Slide) => Promise<Blob>,
  projectName: string = 'StoryFrame-Project',
  onProgress?: (current: number, total: number, percentage: number) => void
): Promise<void> => {
  const zip = new JSZip();
  const folder = zip.folder(projectName) || zip;
  const total = slides.length;

  for (let i = 0; i < total; i++) {
    const slide = slides[i];
    if (onProgress) {
      onProgress(i + 1, total, Math.round(((i) / total) * 100));
    }

    const slideBlob = await renderSlideToBlob(slide);
    const indexStr = (i + 1).toString().padStart(2, '0');
    const safeTitle = slide.title.replace(/[^a-zA-Z0-9_-]/g, '_') || 'slide';
    const fileName = `slide-${indexStr}_${slide.platform}_${safeTitle}.png`;

    folder.file(fileName, slideBlob);
  }

  if (onProgress) {
    onProgress(total, total, 99);
  }

  const zipContent = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  if (onProgress) {
    onProgress(total, total, 100);
  }

  const dateStr = new Date().toISOString().slice(0, 10);
  saveAs(zipContent, `${projectName}_${dateStr}.zip`);
};
