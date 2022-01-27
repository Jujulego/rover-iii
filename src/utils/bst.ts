import { Comparator } from '../types';

// Types
export type ExtractKey<T, K> = (elem: T) => K;

// Class
export class BST<T, K = T> {
  // Attributes
  private readonly _array: T[];
  private readonly _extractor: ExtractKey<T, K>;
  private readonly _comparator: Comparator<K>;

  // Constructor
  private constructor(extractor: (elem: T) => K, comparator: Comparator<K>, elements: T[] = []) {
    this._array = elements;
    this._extractor = extractor;
    this._comparator = comparator;
  }

  // Statics
  static empty<T, K = T>(extractor: ExtractKey<T, K>, comparator: Comparator<K>): BST<T, K> {
    return new BST<T, K>(extractor, comparator);
  }

  static fromArray<T, K = T>(elements: T[], extractor: ExtractKey<T, K>, comparator: Comparator<K>): BST<T, K> {
    // Add and sort elements
    const array = Array.from(elements);
    array.sort((a, b) => comparator(extractor(a), extractor(b)));

    return new BST<T, K>(extractor, comparator as Comparator<K>, array);
  }

  static copy<T, K>(bst: BST<T, K>): BST<T, K> {
    return this.fromArray(bst._array, bst._extractor, bst._comparator);
  }

  // Methods
  private _search(elem: K): [number, T | null] {
    let si = 0;
    let ei = this.length;

    while (si !== ei) {
      const mi = Math.floor((ei + si) / 2);
      const obj = this.item(mi);

      const cmp = this._comparator(this._extractor(obj), elem);
      if (cmp === 0) {
        return [mi, obj];
      }

      if (cmp < 0) {
        si = mi + 1;
      } else {
        ei = mi;
      }

      if (si === ei) {
        return [mi, null];
      }
    }

    return [0, null];
  }

  // - accessing
  item(i: number): T {
    return this._array[i];
  }

  shouldBeAt(key: K): number {
    if (this.length === 0) return 0;

    // Search ordered index
    const [idx,] = this._search(key);
    if (this._comparator(this._extractor(this._array[idx]), key) <= 0) {
      return idx + 1;
    }

    return idx;
  }

  search(key: K): T[] {
    const [idx, obj] = this._search(key);

    // obj null means not found
    if (obj === null) {
      return [];
    }

    // Gather all objects where comparator return 0
    const res = [obj];

    // - before
    for (let i = idx; i >= 0; --i) {
      if (this._comparator(this._extractor(this._array[i]), key) === 0) {
        res.push(this._array[i]);
      } else {
        break;
      }
    }

    // - after
    for (let i = idx; i < this._array.length; ++i) {
      if (this._comparator(this._extractor(this._array[i]), key) === 0) {
        res.push(this._array[i]);
      } else {
        break;
      }
    }

    return res;
  }

  // - modifying
  updatedKey(): void {
    this._array.sort((a, b) => this._comparator(this._extractor(a), this._extractor(b)));
  }

  insert(elem: T): T {
    if (this.length === 0) {
      this._array.push(elem);
    } else {
      const key = this._extractor(elem);
      const idx = this.shouldBeAt(key);

      this._array.splice(idx, 0, elem);
    }

    return elem;
  }

  remove(elem: K) {
    const [idx, obj] = this._search(elem);

    if (obj !== null) {
      this._array.splice(idx, 1);
    }
  }

  pop(): T | null {
    return this._array.pop() ?? null;
  }

  // - iterate
  *[Symbol.iterator]() {
    yield* this._array;
  }

  filter(predicate: (elem: T, index: number) => boolean): BST<T, K> {
    const filtered: T[] = [];

    for (let i = 0; i < this.length; ++i) {
      const elem = this.item(i);
      if (predicate(elem, i)) filtered.push(elem);
    }

    return new BST(this._extractor, this._comparator, filtered);
  }

  map<R>(fn: (elem: T, index: number) => R): R[] {
    return this._array.map(fn);
  }

  reduce<R>(fn: (acc: R, elem: T) => R, init: R): R {
    return this._array.reduce(fn, init);
  }

  // Properties
  get array(): T[] {
    return Array.from(this._array);
  }

  get length() {
    return this._array.length;
  }
}
