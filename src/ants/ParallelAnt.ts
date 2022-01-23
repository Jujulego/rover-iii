import { filter, firstValueFrom, map, Subject } from 'rxjs';

import { Map } from '../maps';
import { Vector } from '../math2d';

import { Ant } from './Ant';
import { AntColorName } from './colors';
import { AntRequest, AntResult } from './worker/message';

// Class
export abstract class ParallelAnt extends Ant {
  // Attributes
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
      this.sendRequest({ type: 'move', position });
    });

    // Send setup message
    this.sendRequest({
      type: 'setup',
      map: {
        name: this.map.name,
        bbox: this.map.bbox,
      },
      color: this.color.name,
      position: this.position,
    });
  }

  protected sendRequest(msg: AntRequest) {
    this.worker.postMessage(msg);
  }

  protected async compute(target: Vector): Promise<Vector> {
    this.sendRequest({ type: 'compute', target });

    return await firstValueFrom(this.results$.pipe(
      filter((msg) => msg.type === 'compute'),
      map((msg) => new Vector(msg.move))
    ));
  }
}
