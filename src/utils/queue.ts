// Class
class Queue<T> {
  // Attributes
  private readonly _queue = new Array<T>();

  // Properties
  get isEmpty(): boolean {
    return this._queue.length === 0;
  }

  get next(): T | undefined {
    return this._queue[this._queue.length-1];
  }

  // Methods
  enqueue(value: T) {
    this._queue.unshift(value);
  }

  dequeue(): T | undefined {
    return this._queue.pop();
  }
}

export default Queue;