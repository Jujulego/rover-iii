import { parseRectArgs, Rect } from './rect';

// Tests
// - utils
describe('parseRectArgs', () => {
  test('with an object no options', () => {
    expect(parseRectArgs([{ t: 1, l: 1, b: 2, r: 2 }]))
      .toEqual([{ t: 1, l: 1, b: 2, r: 2 }]);
  });

  test('with an object and options', () => {
    expect(parseRectArgs([{ t: 1, l: 1, b: 2, r: 2 }, 'test', 85]))
      .toEqual([{ t: 1, l: 1, b: 2, r: 2 }, 'test', 85]);
  });

  test('with numbers no options', () => {
    expect(parseRectArgs<[]>([1, 1, 2, 2]))
      .toEqual([{ t: 1, l: 1, b: 2, r: 2 }]);
  });

  test('with numbers and options', () => {
    expect(parseRectArgs<[string, number]>([1, 1, 2, 2, 'test', 85]))
      .toEqual([{ t: 1, l: 1, b: 2, r: 2 }, 'test', 85]);
  });

  test('with invalid args', () => {
    // @ts-expect-error should not be callable with a [number] tuple
    expect(() => parseRectArgs<[]>([1]))
      .toThrow('Invalid arguments !');

    // @ts-expect-error should not be callable with a [number, number, number, string] tuple
    expect(() => parseRectArgs<[]>([1, 1, 2, '2']))
      .toThrow('Invalid arguments !');
  });
});

// - builders
test('Rect.fromVectors', () => {
  expect(Rect.fromVectors(1, 2, 2, 1))
    .toEqual({ t: 1, l: 1, b: 2, r: 2 });
});

test('Rect.fromVectorSize', () => {
  expect(Rect.fromVectorSize(1, 1, 1, 2))
    .toEqual({ t: 1, l: 1, b: 3, r: 2 });
});

// - tests
describe('Rect.within', () => {
  const r = new Rect(1, 1, 2, 2);

  it('should be within', () => {
    expect(r.within(0, 0, 3, 3))
      .toBeTruthy();
  });

  it('should be out (on r)', () => {
    expect(r.within(0, 0, 3, 1.5))
      .toBeFalsy();
  });

  it('should be out (on b)', () => {
    expect(r.within(0, 0, 1.5, 3))
      .toBeFalsy();
  });

  it('should be out (on l)', () => {
    expect(r.within(0, 1.5, 3, 3))
      .toBeFalsy();
  });

  it('should be out (on t)', () => {
    expect(r.within(1.5, 0, 3, 3))
      .toBeFalsy();
  });
});

// - properties
test('Rect.tl', () => {
  const r = new Rect(1, 1, 2, 2);

  expect(r.tl).toEqual({ x: 1, y: 1 });
});

test('Rect.tr', () => {
  const r = new Rect(1, 1, 2, 2);

  expect(r.tr).toEqual({ x: 2, y: 1 });
});

test('Rect.bl', () => {
  const r = new Rect(1, 1, 2, 2);

  expect(r.bl).toEqual({ x: 1, y: 2 });
});

test('Rect.br', () => {
  const r = new Rect(1, 1, 2, 2);

  expect(r.br).toEqual({ x: 2, y: 2 });
});

test('Rect.w', () => {
  const r = new Rect(1, 1, 2, 3);

  expect(r.w).toBe(2);
});

test('Rect.h', () => {
  const r = new Rect(1, 1, 3, 2);

  expect(r.h).toBe(2);
});

test('Rect.size', () => {
  const r = new Rect(1, 1, 3, 2);

  expect(r.size).toEqual({ w: 1, h: 2 });
});
