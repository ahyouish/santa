import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputPath = 'C:\\Users\\AYUSH G\\.gemini\\antigravity-ide\\brain\\f9340d13-ca7a-4f13-bae7-9f0111592048\\.user_uploaded\\media_1790409099616.jpg';
const outputDir = path.resolve('public');

async function processCursor() {
  console.log('Loading cursor image:', inputPath);
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  console.log(`Original dimensions: ${metadata.width}x${metadata.height}`);

  // Get raw RGBA buffer
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Process alpha: replace dark background with transparency
  // Dark background threshold
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Calculate brightness/luminance
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const maxVal = Math.max(r, g, b);

    if (maxVal < 18) {
      // Pure background
      data[i + 3] = 0;
    } else if (maxVal < 45) {
      // Smooth feathering
      const factor = (maxVal - 18) / (45 - 18);
      data[i + 3] = Math.round(data[i + 3] * factor);
    }
  }

  // Find bounding box of non-transparent content
  let minX = width, minY = height, maxX = 0, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const alpha = data[idx + 3];
      if (alpha > 40) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log(`Bounding box: x=[${minX}, ${maxX}], y=[${minY}, ${maxY}]`);
  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;

  // Re-encode processed buffer to PNG
  const processedBuffer = await sharp(data, {
    raw: { width, height, channels }
  }).extract({
    left: minX,
    top: minY,
    width: cropW,
    height: cropH
  }).png().toBuffer();

  // Save full-res cropped transparent PNG
  fs.writeFileSync(path.join(outputDir, 'cursor-santa-full.png'), processedBuffer);

  // Resize to 48x48 (ideal standard for crisp modern custom cursor on Retina / 1080p / 4K)
  // Index finger tip is at the top left of the hand!
  // In the cropped hand, the tip of the index finger is at the highest non-transparent pixel on the left!
  const croppedRaw = await sharp(processedBuffer).raw().toBuffer({ resolveWithObject: true });
  let tipX = 0, tipY = 0;
  let found = false;
  for (let y = 0; y < croppedRaw.info.height; y++) {
    for (let x = 0; x < croppedRaw.info.width; x++) {
      const idx = (y * croppedRaw.info.width + x) * croppedRaw.info.channels;
      if (croppedRaw.data[idx + 3] > 150) {
        tipX = x;
        tipY = y;
        found = true;
        break;
      }
    }
    if (found) break;
  }

  console.log(`Index finger tip in cropped image: (${tipX}, ${tipY}) out of (${cropW}x${cropH})`);
  
  // Hotspot ratio
  const ratioX = tipX / cropW;
  const ratioY = tipY / cropH;
  console.log(`Hotspot ratio: x=${ratioX.toFixed(2)}, y=${ratioY.toFixed(2)}`);

  // Create 48x48 cursor
  const size48 = 48;
  const buffer48 = await sharp(processedBuffer)
    .resize(size48, size48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(outputDir, 'cursor-santa-48.png'), buffer48);
  fs.writeFileSync(path.join(outputDir, 'cursor-santa.png'), buffer48);

  // Create 36x36 and 32x32 for standard fallback
  const buffer36 = await sharp(processedBuffer)
    .resize(36, 36, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(outputDir, 'cursor-santa-36.png'), buffer36);

  const buffer32 = await sharp(processedBuffer)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(outputDir, 'cursor-santa-32.png'), buffer32);

  console.log('Successfully generated transparent cursor PNGs in public/ directory!');
  console.log(`Hotspot for 48px cursor: ${Math.round(size48 * ratioX)} ${Math.round(size48 * ratioY)}`);
}

processCursor().catch(console.error);
