/** Client-side photo prep for photo-to-estimate. */

export interface EditorPhoto {
  key: string;
  /** JPEG data URL, already downscaled — safe to POST. */
  dataUrl: string;
}

const MAX_DIMENSION = 1280;
const JPEG_QUALITY = 0.8;

/**
 * Downscale a job-site photo on the phone before upload: longest edge to
 * 1280px, re-encoded as JPEG. Keeps request bodies small and strips EXIF.
 * Returns null when the file isn't a readable image.
 */
export async function fileToEditorPhoto(file: File): Promise<EditorPhoto | null> {
  if (!file.type.startsWith('image/')) return null;

  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
    const width = Math.max(1, Math.round(img.width * scale));
    const height = Math.max(1, Math.round(img.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, width, height);

    return {
      key: Math.random().toString(36).slice(2),
      dataUrl: canvas.toDataURL('image/jpeg', JPEG_QUALITY),
    };
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** The base64 payload (no data: prefix) the generate API expects. */
export function photoPayload(photos: EditorPhoto[]): Array<{ mediaType: string; data: string }> {
  return photos.map((p) => ({ mediaType: 'image/jpeg', data: p.dataUrl.split(',')[1] ?? '' }));
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
