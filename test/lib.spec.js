import {
  diffImage,
} from 'lib';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

describe('lib', () => {
  describe('diffImage', () => {
    it('should be true', async () => {
      const result = await diffImage({
        mode: 'fuzzy',
        actual: 'fixtures/actual.png',
        expect: 'fixtures/expect.png',
      });
      console.log(result.percent);
      // expect(result.image.bitmap.width).toBe(1264);
      // expect(result.image.bitmap.height).toBe(892);
      // result.image.write('fixtures/diff.png', x => console.log(x));
    });
    it.only('should be true', async () => {
      const result = await diffImage({
        mode: 'fuzzy',
        swidth: 300,
        radius: 2,
        colordist: 30,
        actual: 'fixtures/a.png',
        expect: 'fixtures/e.png',
      });
      console.log(result.percent);
      // expect(result.image.bitmap.width).tobe(1264);
      // expect(result.image.bitmap.height).tobe(892);
      result.image.write('fixtures/diff.png', x => console.log(x));
    });
    it('should be true', async () => {
      const result = await diffImage({
        mode: 'strict',
        actual: 'fixtures/actuald.png',
        expect: 'fixtures/expect.png',
      });
      console.log(result.percent);
      // expect(result.image.bitmap.width).toBe(1264);
      // expect(result.image.bitmap.height).toBe(892);
      result.image.write('fixtures/diff.png', x => console.log(x));
    });
    it.only('should be true', async () => {
      const result = await diffImage({
        mode: 'strict',
        actual: 'http://via.placeholder.com/350x150?text=AAAA',
        expect: 'http://via.placeholder.com/350x150?text=BBBB',
      });
      expect(result.image.bitmap.width).toBe(350);
      expect(result.image.bitmap.height).toBe(150);
    });
  });
});
