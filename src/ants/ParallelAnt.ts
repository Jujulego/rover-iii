import { filter, firstValueFrom, map, Observable, Subject } from 'rxjs';

import { Map } from '../maps';
import { Vector } from '../math2d';

import { Ant } from './Ant';
import { AntColorName } from './colors';
import { AntRequest, AntResult, AntResultOf } from './worker/message';

// Class
export abstract class ParallelAnt extends Ant {
  // Attributes
  private _messageId = 0;

  abstract readonly worker: Worker;

  private readonly _results$$ = new Subject<AntResult>();
  readonly results$ = this._results$$.asObservable();

  // Constructor
  constructor(map: Map, color: AntColorName, position: Vector) {
    super(map, color, position);

    setTimeout(() => this._initWorker(), 0);
  }

  // Methods
  private _initWorker() {
    // Setup results obs
    this.worker.addEventListener('message', (msg: MessageEvent<AntResult>) => {
      this._results$$.next(msg.data);
    });

    // Send move events
    this.position$.subscribe((position) => {
      this.request({ type: 'move', position });
    });

    // Send setup message
    this.request({
      type: 'setup',
      map: {
        name: this.map.name,
        bbox: this.map.bbox,
      },
      color: this.color.name,
      position: this.position,
    });
  }

  request<R extends AntRequest>(req: R): Observable<AntResultOf<R>> {
    // Send message
    const msg = { id: ++this._messageId, ...req };
    this.worker.postMessage(msg);

    // Observe results
    return this.results$.pipe(
      filter((res): res is AntResultOf<R> => res.id === msg.id),
    );
  }

  protected async compute(target: Vector): Promise<Vector> {
    return await firstValueFrom(this.request({ type: 'compute', target }).pipe(
      filter((msg) => msg.type === 'compute'),
      map((msg) => new Vector(msg.move))
    ));
  }
}
