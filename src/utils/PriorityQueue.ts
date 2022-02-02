import { BST } from './bst';

// Class
export class PriorityQueue<T> {
  // Attributes
  private readonly _queue = BST.empty<[T, number], number>(([, cost]) => cost, ((a, b) => b - a));

  // Methods
  updateCosts(fn: (elem: T) => number): void {
    for (const elem of this._queue) {
      elem[1] = fn(elem[0]);
    }

    this._queue.updatedKeys();
  }

  search(cost: number): T[] {
    return this._queue.search(cost).map(([elem,]) => elem);
  }

  add(value: T, cost: number) {
    this._queue.insert([value, cost]);
  }

  /**
   * Returns the element with the smallest cost
   */
  pop(): T | undefined {
    return this._queue.pop()?.[0];
  }

  // Properties
  get next(): T | undefined {
    return this._queue.item(this._queue.length - 1)?.[0];
  }

  get size(): number {
    return this._queue.length;
  }

  get isEmpty(): boolean {
    return this._queue.length === 0;
  }
}
