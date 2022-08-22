import { parseSizeArgs } from '../src';

// Test
// - utils
describe('parseSizeArgs', () => {
  test('with an object no options', () => {
    expect(parseSizeArgs([{ w: 1, h: 1 }]))
      .toEqual([{ w: 1, h: 1 }]);
  });

  test('with an object and options', () => {
    expect(parseSizeArgs([{ w: 1, h: 1 }, 'test', 85]))
      .toEqual([{ w: 1, h: 1 }, 'test', 85]);
  });

  test('with numbers no options', () => {
    expect(parseSizeArgs<[]>([1, 1]))
      .toEqual([{ w: 1, h: 1 }]);
  });

  test('with numbers and options', () => {
    expect(parseSizeArgs<[string, number]>([1, 1, 'test', 85]))
      .toEqual([{ w: 1, h: 1 }, 'test', 85]);
  });

  test('with invalid arguments', () => {
    // @ts-expect-error should not be callable with a [number] tuple
    expect(() => parseSizeArgs<[]>([1]))
      .toThrow('Invalid arguments !');

    // @ts-expect-error should not be callable with a [number, string] tuple
    expect(() => parseSizeArgs<[]>([1, '1']))
      .toThrow('Invalid arguments !');
  });
});
