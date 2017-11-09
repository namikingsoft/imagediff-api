// @flow

export type Bitmap = {
  width: number,
  height: number,
  data: number[],
};

export type RGB = {
  r: number,
  g: number,
  b: number,
};

export type RGBA = RGB & {
  a: number,
};

export type X = number;
export type Y = number;
export type Point = [X, Y];

export const getRGB:
  (X, Y) => Bitmap => RGB
= (x, y) => image => {
  const pos = (y * image.width + x) * 4;
  const r = image.data[pos];
  const g = image.data[pos + 1];
  const b = image.data[pos + 2];
  return { r, g, b };
};

export const distRGB:
  (RGB, RGB) => number
= (c1, c2) =>
  Math.abs(c1.r - c2.r) +
  Math.abs(c1.g - c2.g) +
  Math.abs(c1.b - c2.b);

const brightnessDelta:
  (RGB, RGB) => number
= (color1, color2) => {
  // gamma-corrected luminance of a color (YIQ NTSC transmission color space)
  // see https://www.academia.edu/8200524/DIGITAL_IMAGE_PROCESSING_Digital_Image_Processing_PIKS_Inside_Third_Edition
  const rgb2y = (r, g, b) => r * 0.29889531 + g * 0.58662247 + b * 0.11448223;
  return rgb2y(color1.r, color1.g, color1.b) - rgb2y(color2.r, color2.g, color2.b);
};

export const isAntialiased:
  Bitmap => (X, Y) => boolean
= bitmap => (x1, y1) => {
  const { width, height } = bitmap;
  const color1 = getRGB(x1, y1)(bitmap);
  const x0 = Math.max(x1 - 1, 0);
  const y0 = Math.max(y1 - 1, 0);
  const x2 = Math.min(x1 + 1, width - 1);
  const y2 = Math.min(y1 + 1, height - 1);
  let zeroCount = 0;
  let otherCount = 0;
  let otherColor;
  for (let y = y0; y <= y2; y += 1) {
    for (let x = x0; x <= x2; x += 1) {
      if (x === x1 && y === y1) continue;
      const color2 = getRGB(x, y)(bitmap);
      const delta = brightnessDelta(color1, color2);
      if (Math.abs(delta) <= 5) {
        zeroCount += 1;
      } else if (!otherColor) {
        otherColor = color2;
      } else {
        const delta1 = brightnessDelta(otherColor, color2);
        if (Math.abs(delta1) <= 5) {
          otherCount += 1;
        }
      }
      if (zeroCount >= 3) {
        return false;
      }
    }
  }
  if (zeroCount >= 2 && otherCount >= 4) {
    return false;
  }
  return true;
};

export const compareRadius:
  (Bitmap, Bitmap, number, number | void) => (X, Y) => boolean
= (bitmap1, bitmap2, radius, sameDist = 0) => (x1, y1) => {
  const { width, height } = bitmap1;
  const x0 = Math.max(x1 - radius, 0);
  const y0 = Math.max(y1 - radius, 0);
  const x2 = Math.min(x1 + radius, width - 1);
  const y2 = Math.min(y1 + radius, height - 1);
  const threshold = sameDist || 0;
  const bcolor1 = getRGB(x1, y1)(bitmap1);
  const bcolor2 = getRGB(x1, y1)(bitmap2);
  if (distRGB(bcolor1, bcolor2) <= threshold) {
    return true;
  }
  let same1 = false;
  let same2 = false;
  for (let y = y0; y <= y2; y += 1) {
    for (let x = x0; x <= x2; x += 1) {
      if (x === x1 && y === y1) continue;
      if (!same1) {
        const color = getRGB(x, y)(bitmap1);
        const dist = distRGB(bcolor2, color);
        if (dist <= threshold) {
          same1 = true;
          if (same1 && same2) {
            return true;
          }
        }
      }
      if (!same2) {
        const color = getRGB(x, y)(bitmap2);
        const dist = distRGB(bcolor1, color);
        if (dist <= threshold) {
          same2 = true;
          if (same1 && same2) {
            return true;
          }
        }
      }
    }
  }
  return false;
};
