import { BST } from './bst';

// Prepare data
const numbers = [1, 2, 4, 5];
let bst: BST<number>;

beforeEach(() => {
  bst = BST.fromArray(numbers, n => n, (a, b) => a - b);
});

// Tests
describe('BST.indexOf', () => {
  test('on all existing elements', () => {
    for (let i = 0; i < numbers.length; i++) {
      expect(bst.indexOf(numbers[i]))
        .toBe(i);
    }
  });

  test('on unknown elements', () => {
    expect(bst.indexOf(3))
      .toBe(-1);

    expect(bst.indexOf(10))
      .toBe(-1);
  });
});

describe('BST.find', () => {
  test('on all existing elements', () => {
    for (const n of numbers) {
      expect(bst.find(n)).toBe(n);
    }
  });

  test('on unknown elements', () => {
    expect(bst.find(3))
      .toBeNull();

    expect(bst.find(10))
      .toBeNull();
  });
});

describe('BST.insert', () => {
  test('a new element in the middle', () => {
    bst.insert(3);

    expect(bst.array)
      .toEqual([1, 2, 3, 4, 5]);
  });

  test('a new element before first', () => {
    bst.insert(0);

    expect(bst.array)
      .toEqual([0, 1, 2, 4, 5]);
  });

  test('a new element after last', () => {
    bst.insert(6);

    expect(bst.array)
      .toEqual([1, 2, 4, 5, 6]);
  });

  test('in an empty bst', () => {
    const bst = BST.empty<number>(n => n, (a, b) => a - b);
    bst.insert(6);

    expect(bst.array)
      .toEqual([6]);
  });
});

describe('BST.remove', () => {
  test('an existing element', () => {
    bst.remove(2);

    expect(bst.array)
      .toEqual([1, 4, 5]);
  });

  test('a missing element', () => {
    bst.remove(0);

    expect(bst.array)
      .toEqual([1, 2, 4, 5]);
  });
});
