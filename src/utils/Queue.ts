// Class
export class Queue<T> {
  // Attributes
  private readonly _queue: T[] = [];

  // Methods
  add(value: T) {
    this._queue.unshift(value);
  }

  pop(): T | undefined {
    return this._queue.pop();
  }

  // Properties
  get next(): T | undefined {
    return this._queue[this._queue.length-1];
  }

  get size(): number {
    return this._queue.length;
  }

  get isEmpty(): boolean {
    return this._queue.length === 0;
  }
}
