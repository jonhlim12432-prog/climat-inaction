/**
 * Compresses an image File or base64 data URL to fit safely within Firestore's 1MB document limit.
 * Resizes the image to reasonable dimensions and converts to optimized WebP/PNG/JPEG.
 */
export async function compressImage(
  source: File | string,
  maxWidth = 512,
  maxHeight = 512,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const process = () => {
      let { width, height } = img;
      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      // Ensure minimum dimension of 1
      width = Math.max(1, width);
      height = Math.max(1, height);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        if (typeof source === 'string') return resolve(source);
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(source);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Try WebP first for ultra-lightweight size
      try {
        const webp = canvas.toDataURL('image/webp', quality);
        if (webp.startsWith('data:image/webp') && webp.length < 300000) {
          return resolve(webp);
        }
      } catch (_) {}

      // Try PNG (great for transparent logos)
      try {
        const png = canvas.toDataURL('image/png');
        if (png.length < 450000) {
          return resolve(png);
        }
      } catch (_) {}

      // Fallback to JPEG
      const jpeg = canvas.toDataURL('image/jpeg', quality);
      resolve(jpeg);
    };

    img.onload = process;
    img.onerror = () => {
      if (typeof source === 'string') {
        resolve(source);
      } else {
        reject(new Error('Failed to load image for compression'));
      }
    };

    if (typeof source === 'string') {
      img.src = source;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(source);
    }
  });
}
