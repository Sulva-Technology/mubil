/** Browser-side image prep: resize to max 1600px wide and encode as WebP under 2 MB. */
export const MAX_WIDTH = 1600;
export const MAX_BYTES = 2 * 1024 * 1024;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That file isn't an image we can read. Try a JPG or PNG."));
    };
    img.src = url;
  });
}

function toBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/webp", quality));
}

export async function compressImage(file: File): Promise<Blob> {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file (JPG, PNG or WebP).");
  const img = await loadImage(file);
  let width = Math.min(MAX_WIDTH, img.naturalWidth);
  let height = Math.round((img.naturalHeight / img.naturalWidth) * width);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser can't prepare images. Try another browser.");

  for (let attempt = 0; attempt < 6; attempt++) {
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);
    for (const quality of [0.82, 0.72, 0.6]) {
      const blob = await toBlob(canvas, quality);
      if (blob && blob.size <= MAX_BYTES && blob.type === "image/webp") return blob;
    }
    width = Math.round(width * 0.8);
    height = Math.round(height * 0.8);
  }
  throw new Error("This image is too large even after compressing. Try a smaller photo.");
}
