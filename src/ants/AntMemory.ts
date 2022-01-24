import { Observable, Subject } from 'rxjs';

import { IVector } from '../math2d';
import { Awaitable } from '../types';

import { Ant } from './Ant';

// Interfaces
export interface AntMemory<T> {
  // Attributes
  readonly updates$: Observable<IVector>;

  // Methods
  get(pos: IVector): Awaitable<T | undefined>;
  put(pos: IVector, data: T): Awaitable<void>;
}

export interface AntWithMemory<T> extends Ant {
  // Properties
  readonly memory: AntMemory<T>;
}

// Utils
function hash(pos: IVector): string {
  return pos.x + ':' + pos.y;
}

// Class
export class AntMapMemory<T> implements AntMemory<T> {
  // Attributes
  private _data = new Map<string, [IVector, T]>();

  private _updates$$ = new Subject<IVector>();
  readonly updates$ = this._updates$$.asObservable();

  // Methods
  [Symbol.iterator](): Iterator<[IVector, T]> {
    return this._data.values();
  }

  get(pos: IVector): T | undefined {
    const res = this._data.get(hash(pos));
    return res?.[1];
  }

  put(pos: IVector, data: T) {
    this._data.set(hash(pos), [pos, data]);
    this._updates$$.next(pos);
  }
}
