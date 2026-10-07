import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function makePNG(width, height, renderPixel) {
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = renderPixel(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      let byte = buf[i];
      for (let j = 0; j < 8; j++) {
        if ((crc ^ byte) & 1) crc = (crc >>> 1) ^ 0xedb88320;
        else crc = crc >>> 1;
        byte >>>= 1;
      }
    }
    return (crc ^ -1) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const combined = Buffer.concat([typeBuf, data]);
    crcBuf.writeUInt32BE(crc32(combined), 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  return Buffer.concat([
    sig,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0)),
  ]);
}

// Render icon corresponding to public/icon.svg
function renderLogoPixel(x, y, w, h) {
  // Normalize coordinates to 0..512
  const nx = (x / w) * 512;
  const ny = (y / h) * 512;

  // Background rounded rect rx=96
  const margin = 12;
  const rx = 90;
  const insideRoundedRect = (px, py) => {
    if (px < margin || px > 512 - margin || py < margin || py > 512 - margin) return 0;
    const dx = Math.max(margin + rx - px, 0, px - (512 - margin - rx));
    const dy = Math.max(margin + rx - py, 0, py - (512 - margin - rx));
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > rx) return 0;
    if (dist > rx - 1.5) return Math.max(0, rx - dist);
    return 1;
  };

  const bgAlpha = insideRoundedRect(nx, ny);
  if (bgAlpha <= 0) return [0, 0, 0, 0];

  // Base background gradient: #064e3b (6, 78, 59) to #047857 (4, 120, 87)
  const gradT = (nx + ny) / 1024;
  let r = Math.round(6 + (4 - 6) * gradT);
  let g = Math.round(78 + (120 - 78) * gradT);
  let b = Math.round(59 + (87 - 59) * gradT);

  const cx = 256;
  const cy = 256;
  const distFromCenter = Math.sqrt((nx - cx) * (nx - cx) + (ny - cy) * (ny - cy));

  // Outer radar telemetry circles: r=180 (dashed/subtle) & r=140
  if (Math.abs(distFromCenter - 180) < 2.5) {
    // Subtle mint ring #6ee7b7
    const ringAlpha = 0.35 * (1 - Math.abs(distFromCenter - 180) / 2.5);
    r = Math.round(r * (1 - ringAlpha) + 110 * ringAlpha);
    g = Math.round(g * (1 - ringAlpha) + 231 * ringAlpha);
    b = Math.round(b * (1 - ringAlpha) + 183 * ringAlpha);
  }
  if (Math.abs(distFromCenter - 140) < 2) {
    const ringAlpha = 0.4 * (1 - Math.abs(distFromCenter - 140) / 2);
    r = Math.round(r * (1 - ringAlpha) + 167 * ringAlpha);
    g = Math.round(g * (1 - ringAlpha) + 243 * ringAlpha);
    b = Math.round(b * (1 - ringAlpha) + 208 * ringAlpha);
  }

  // Central Globe Emblem: r=105, gradient #34d399 to #10b981
  const globeR = 105;
  if (distFromCenter <= globeR + 1.5) {
    const globeAlpha = distFromCenter <= globeR ? 1 : Math.max(0, globeR + 1.5 - distFromCenter);
    const globeT = (ny - (cy - globeR)) / (globeR * 2);
    let gr = Math.round(52 + (16 - 52) * globeT);
    let gg = Math.round(211 + (185 - 211) * globeT);
    let gb = Math.round(153 + (129 - 153) * globeT);

    // Continents motif (dark green #047857)
    // Continent blob 1 (upper-left/center)
    const d1 = Math.hypot(nx - 245, ny - 230);
    const d2 = Math.hypot(nx - 280, ny - 285);
    if (d1 < 50 || d2 < 42 || (nx > 220 && nx < 290 && ny > 210 && ny < 290)) {
      gr = 4;
      gg = 120;
      gb = 87;
    }

    r = Math.round(r * (1 - globeAlpha) + gr * globeAlpha);
    g = Math.round(g * (1 - globeAlpha) + gg * globeAlpha);
    b = Math.round(b * (1 - globeAlpha) + gb * globeAlpha);
  }

  // Leaf sprout accent at top of globe: #fef08a (254, 240, 138)
  const leafDist = Math.hypot(nx - 285, ny - 150);
  if (leafDist < 26) {
    const leafAlpha = Math.max(0, Math.min(1, (26 - leafDist) / 1.5));
    r = Math.round(r * (1 - leafAlpha) + 254 * leafAlpha);
    g = Math.round(g * (1 - leafAlpha) + 240 * leafAlpha);
    b = Math.round(b * (1 - leafAlpha) + 138 * leafAlpha);
  }

  // Signal dot at top (cx=256, cy=90, r=12)
  const signalDist = Math.hypot(nx - 256, ny - 90);
  if (signalDist < 12) {
    const sAlpha = Math.max(0, Math.min(1, (12 - signalDist) / 1.5));
    r = Math.round(r * (1 - sAlpha) + 52 * sAlpha);
    g = Math.round(g * (1 - sAlpha) + 211 * sAlpha);
    b = Math.round(b * (1 - sAlpha) + 153 * sAlpha);
  }

  return [r, g, b, Math.round(bgAlpha * 255)];
}

const pubDir = path.resolve('public');
if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true });

console.log('Generating PWA icons...');
const png192 = makePNG(192, 192, renderLogoPixel);
fs.writeFileSync(path.join(pubDir, 'pwa-192x192.png'), png192);

const png512 = makePNG(512, 512, renderLogoPixel);
fs.writeFileSync(path.join(pubDir, 'pwa-512x512.png'), png512);

const appleIcon = makePNG(180, 180, renderLogoPixel);
fs.writeFileSync(path.join(pubDir, 'apple-touch-icon.png'), appleIcon);

console.log('Generated:');
console.log(' - public/pwa-192x192.png (', png192.length, 'bytes)');
console.log(' - public/pwa-512x512.png (', png512.length, 'bytes)');
console.log(' - public/apple-touch-icon.png (', appleIcon.length, 'bytes)');
