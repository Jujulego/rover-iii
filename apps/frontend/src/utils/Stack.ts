// Class
export class Stack<T> {
  // Attributes
  private readonly _stack: T[] = [];

  // Methods
  add(value: T) {
    this._stack.push(value);
  }

  pop(): T | undefined {
    return this._stack.pop();
  }

  // Properties
  get next(): T | undefined {
    return this._stack[this._stack.length-1];
  }

  get size(): number {
    return this._stack.length;
  }

  get isEmpty(): boolean {
    return this._stack.length === 0;
  }
}
