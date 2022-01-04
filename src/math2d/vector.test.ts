import { parseVectorArgs, Vector } from './vector';

// Test
// - utils
describe('parseVectorArgs', () => {
  test('with an object no options', () => {
    expect(parseVectorArgs([{ x: 1, y: 1 }]))
      .toEqual([{ x: 1, y: 1 }]);
  });

  test('with an object and options', () => {
    expect(parseVectorArgs([{ x: 1, y: 1 }, 'test', 85]))
      .toEqual([{ x: 1, y: 1 }, 'test', 85]);
  });

  test('with numbers no options', () => {
    expect(parseVectorArgs<[]>([1, 1]))
      .toEqual([{ x: 1, y: 1 }]);
  });

  test('with numbers and options', () => {
    expect(parseVectorArgs<[string, number]>([1, 1, 'test', 85]))
      .toEqual([{ x: 1, y: 1 }, 'test', 85]);
  });

  test('with invalid arguments', () => {
    // @ts-expect-error should not be callable with a [number] tuple
    expect(() => parseVectorArgs<[]>([1]))
      .toThrow('Invalid arguments !');

    // @ts-expect-error should not be callable with a [number, string] tuple
    expect(() => parseVectorArgs<[]>([1, '1']))
      .toThrow('Invalid arguments !');
  });
});

// - builder
test('Vector.fromSize', () => {
  expect(Vector.fromSize(1, 2))
    .toEqual({ x: 1, y: 2 });
});

// - tests
describe('Vector.within', () => {
  const u = new Vector(1, 1);

  it('should be within', () => {
    expect(u.within(0, 0, 2, 2))
      .toBeTruthy();
  });

  it('should be out (on r)', () => {
    expect(u.within(0, 0, 2, .5))
      .toBeFalsy();
  });

  it('should be out (on b)', () => {
    expect(u.within(0, 0, .5, 2))
      .toBeFalsy();
  });

  it('should be out (on l)', () => {
    expect(u.within(0, 1.5, 2, 2))
      .toBeFalsy();
  });

  it('should be out (on t)', () => {
    expect(u.within(1.5, 0, 2, 2))
      .toBeFalsy();
  });
});

// - unary operations
test('Vector.norm', () => {
  expect(new Vector(0, 0).norm())
    .toBe(0);

  expect(new Vector(1, 0).norm())
    .toBe(1);

  expect(new Vector(0, 1).norm())
    .toBe(1);
});

describe('Vector.unit', () => {
  it('should return a unit vector', () => {
    expect(new Vector(2, 0).unit())
      .toEqual({ x: 1, y: 0 });

    expect(new Vector(0, 2).unit())
      .toEqual({ x: 0, y: 1 });
  });

  it('should return the null vector', () => {
    expect(new Vector(0, 0).unit())
      .toEqual({ x: 0, y: 0 });
  });
});

test('Vector.normal', () => {
  expect(new Vector(1, 2).normal())
    .toEqual({ x: 2, y: -1 });
});

// - binary operations
describe('Vector.equals', () => {
  const u = new Vector(1, 1);

  it('should return true', () => {
    expect(u.equals(1, 1))
      .toBeTruthy();
  });

  it('should return false', () => {
    expect(u.equals(1, 2))
      .toBeFalsy();

    expect(u.equals(2, 1))
      .toBeFalsy();

    expect(u.equals(2, 2))
      .toBeFalsy();
  });
});

describe('Vector.compare', () => {
  const u = new Vector(1, 1);

  it('should use xy order (default)', () => {
    expect(u.compare(1, 1)).toBe(-0);
    expect(u.compare(0, 2)).toBeLessThan(0);
    expect(u.compare(2, 0)).toBeGreaterThan(0);
  });

  it('should use yx order', () => {
    expect(u.compare(1, 1, 'yx')).toBe(-0);
    expect(u.compare(0, 2, 'yx')).toBeGreaterThan(0);
    expect(u.compare(2, 0, 'yx')).toBeLessThan(0);
  });
});

describe('Vector.distance', () => {
  const u = new Vector(1, 1);

  it('should use euclidean mode (default)', () => {
    expect(u.distance(1, 1)).toBe(0);
    expect(u.distance(0, 2)).toBe(Math.sqrt(2));
    expect(u.distance(2, 0)).toBe(Math.sqrt(2));
  });

  it('should use manhattan mode', () => {
    expect(u.distance(1, 1, 'manhattan')).toBe(0);
    expect(u.distance(0, 2, 'manhattan')).toBe(2);
    expect(u.distance(2, 0, 'manhattan')).toBe(2);
  });
});

test('Vector.add', () => {
  const u = new Vector(1, 0);

  expect(u.add(0, 1))
    .toEqual({ x: 1, y: 1 });
});

test('Vector.sub', () => {
  const u = new Vector(1, 0);

  expect(u.sub(0, 1))
    .toEqual({ x: 1, y: -1 });
});

test('Vector.mul', () => {
  const u = new Vector(1, 1);

  expect(u.mul(2))
    .toEqual({ x: 2, y: 2 });
});

test('Vector.div', () => {
  const u = new Vector(1, 1);

  expect(u.div(2))
    .toEqual({ x: .5, y: .5 });
});

test('Vector.dot', () => {
  const u = new Vector(1, 1);

  expect(u.dot(2, 1)).toBe(3);
});
