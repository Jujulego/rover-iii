import { Subject } from 'rxjs';

import { IVector } from '../../math2d';

import { AntMemory } from './AntMemory';

// Utils
function hash(pos: IVector): string {
  return pos.x + ':' + pos.y;
}

// Class
export class AntMapMemory<T> extends AntMemory<T> {
  // Attributes
  private _data = new Map<string, [IVector, T]>();

  private _updates$$ = new Subject<[IVector, T]>();
  readonly updates$ = this._updates$$.asObservable();

  // Methods
  [Symbol.iterator](): Iterator<[IVector, T]> {
    return this._data.values();
  }

  has(pos: IVector): boolean {
    return this._data.has(hash(pos));
  }

  get(pos: IVector): T | undefined {
    const res = this._data.get(hash(pos));
    return res?.[1];
  }

  put(pos: IVector, data: T) {
    this._data.set(hash(pos), [pos, data]);
    this._updates$$.next([pos, data]);
  }
}
