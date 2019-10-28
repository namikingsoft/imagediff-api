// @flow
import Jimp, { read as readImage } from 'jimp';

import {
  isAntialiased,
  compareRadius,
} from './bitmap';

type JimpInstance = any;

type DiffMode = 'fuzzy' | 'strict';

type DiffParam = {
  mode: DiffMode,
  expect: string,
  actual: string,
  swidth: number,
  radius: number,
  colordist: number,
};

type DiffResult = {
  mode: DiffMode,
  image: JimpInstance,
  percent: number,
};

const defaultDiffParam: DiffParam = {
  mode: 'strict',
  expect: '',
  actual: '',
  swidth: 500,
  radius: 3,
  colordist: 25,
};

export const diffImage: DiffParam => Promise<DiffResult> = async param => {
  const {
    mode,
    actual,
    expect,
    swidth,
    radius,
    colordist,
  } = {
    ...defaultDiffParam,
    ...param,
  };
  const actualImage = await readImage(actual);
  const expectImage = await readImage(expect);

  if (mode === 'fuzzy') {
    const width = actualImage.bitmap.width < expectImage.bitmap.width
      ? actualImage.bitmap.width : expectImage.bitmap.width;
    const height = actualImage.bitmap.height < expectImage.bitmap.height
      ? actualImage.bitmap.height : expectImage.bitmap.height;
    actualImage
      .crop(0, 0, width, height)
      .resize(swidth, Jimp.AUTO);
    expectImage
      .crop(0, 0, width, height)
      .resize(swidth, Jimp.AUTO);
    const sheight = actualImage.bitmap.height;
    const diffJimpImage = await new Promise((resolve, reject) => new Jimp(
      swidth,
      sheight,
      0xff000000,
      (err, image) => (
        err ? reject(err) : resolve(image)
      ),
    ));
    const isAntialiasedImages = (x, y) => (
      isAntialiased(actualImage.bitmap)(x, y)
      || isAntialiased(expectImage.bitmap)(x, y)
    );
    const compare = compareRadius(
      actualImage.bitmap,
      expectImage.bitmap,
      radius,
      colordist,
    );
    let count = 0;
    for (let y = 0; y < sheight; y += 1) {
      for (let x = 0; x < swidth; x += 1) {
        if (isAntialiasedImages(x, y)) {
          // const pos = (y * swidth + x) * 4;
          // diffJimpImage.bitmap.data[pos] = 0;
          // diffJimpImage.bitmap.data[pos + 1] = 0;
          // diffJimpImage.bitmap.data[pos + 2] = 255;
          // diffJimpImage.bitmap.data[pos + 3] = 255;
          continue;
        }
        if (compare(x, y)) {
          continue;
        }
        const pos = (y * swidth + x) * 4;
        diffJimpImage.bitmap.data[pos + 3] = 255;
        count += 1;
      }
    }
    const percent = count / (swidth * sheight);
    const image = actualImage
      .brightness(0.8)
      .composite(diffJimpImage, 0, 0)
      .resize(width, height);
    return ({ mode, percent, image }: any);
  }
  {
    const { percent, image } = Jimp.diff(actualImage, expectImage, 0);
    return {
      mode,
      image,
      percent,
    };
  }
};
