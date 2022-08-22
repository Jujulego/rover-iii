import { IVector } from '@ants/maths';
import { filter, firstValueFrom, map, Observable } from 'rxjs';

import { AntMemory } from '../memory/AntMemory';
import { AntRequest, AntResult, AntWorkerMemoryUpdate } from './message';
import { RequestSender } from '../../workers/RequestSender';

// Class
export class AntWorkerMemory<T> extends AntMemory<T> {
  // Attributes
  readonly updates$: Observable<[IVector, T]>;

  // Constructor
  constructor(
    readonly requests: RequestSender<AntRequest, AntResult>,
  ) {
    super();

    this.updates$ = this.requests.results$.pipe(
      filter((msg): msg is AntWorkerMemoryUpdate => msg.type === 'memoryUpdate'),
      map((msg) => [msg.position, msg.data] as [IVector, T])
    );
  }

  // Methods
  get(pos: IVector): Promise<T | undefined> {
    return firstValueFrom(
      this.requests.request({ type: 'getMemory', position: pos }).pipe(
        map((res) => res.data as T | undefined)
      )
    );
  }
}
