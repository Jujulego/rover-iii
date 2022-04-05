import { firstValueFrom, map } from 'rxjs';

import { Map } from '../maps';
import { Vector } from '../math2d';

import { Ant } from './Ant';
import { AntColorName } from './colors';
import { AntRequest, AntResult } from './worker/message';
import { RequestSender } from '../workers/RequestSender';

// Class
export abstract class ParallelAnt extends Ant {
  // Attributes
  private readonly _worker = this.worker();
  readonly requests = new RequestSender<AntRequest, AntResult>(this._worker);

  // Constructor
  constructor(name: string, map: Map, color: AntColorName, position: Vector) {
    super(name, map, color, position);

    this._setup();
  }

  // Methods
  protected abstract worker(): Worker;

  private _setup() {
    // Send position events
    this.position$.subscribe((pos) => {
      this.requests.request({
        type: 'move',
        position: pos
      });
    });

    // Initiate worker
    this.requests.request({
      type: 'setup',
      name: this.name,
      map: {
        name: this.map.name,
        bbox: this.map.bbox,
      },
      color: this.color.name,
      position: this.position,
    });
  }

  protected async compute(target: Vector): Promise<Vector> {
    return await firstValueFrom(this.requests.request({ type: 'compute', target }).pipe(
      map((msg) => new Vector(msg.move))
    ));
  }

  terminate(): void {
    this._worker.terminate();
  }
}
