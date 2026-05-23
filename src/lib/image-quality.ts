export type ImageQuality = "good" | "blur" | "dark";

export async function assessImageQuality(dataUrl: string): Promise<ImageQuality> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const w = Math.min(200, img.width);
      const h = Math.min(200, (img.height * w) / img.width);
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve("good");
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;
      let sum = 0;
      let sumSq = 0;
      let n = 0;
      for (let i = 0; i < data.length; i += 4) {
        const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        sum += lum;
        sumSq += lum * lum;
        n++;
      }
      const mean = sum / n;
      const variance = sumSq / n - mean * mean;
      if (mean < 55) resolve("dark");
      else if (variance < 180) resolve("blur");
      else resolve("good");
    };
    img.onerror = () => resolve("good");
    img.src = dataUrl;
  });
}
