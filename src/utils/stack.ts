// Class
export class Stack<T> {
  // Attributes
  private readonly _stack = new Array<T>();

  // Properties
  get isEmpty(): boolean {
    return this._stack.length === 0;
  }

  get next(): T | undefined {
    return this._stack[this._stack.length-1];
  }

  // Methods
  add(value: T) {
    this._stack.push(value);
  }

  pop(): T | undefined {
    return this._stack.pop();
  }
}
