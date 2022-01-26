import { filter, firstValueFrom, map } from 'rxjs';

import { IVector } from '../../math2d';

import { AntMemory } from '../memory/AntMemory';
import { ParallelAnt } from '../ParallelAnt';
import { AntWorkerMemoryUpdate } from './message';

// Class
export class AntWorkerMemory<T> extends AntMemory<T> {
  // Attributes
  readonly updates$ = this.ant.results$.pipe(
    filter((msg): msg is AntWorkerMemoryUpdate => msg.type === 'memoryUpdate'),
    map((msg) => [msg.position, msg.data] as [IVector, T])
  );

  // Constructor
  constructor(
    readonly ant: ParallelAnt,
  ) { super(); }

  // Methods
  get(pos: IVector): Promise<T | undefined> {
    return firstValueFrom(
      this.ant.request({ type: 'getMemory', position: pos }).pipe(
        map((res) => res.data as T | undefined)
      )
    );
  }

  put() {
    throw new Error('Not yet implemented !');
  }
}
