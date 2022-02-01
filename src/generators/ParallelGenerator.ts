import { firstValueFrom, map } from 'rxjs';

import { Map } from '../maps';
import { ISize, Rect } from '../math2d';
import { RequestSender } from '../workers/RequestSender';

import { MapGenerator, MapGenOptions } from './MapGenerator';
import { MapGenRequest, MapGenResult } from './worker/message';

// Class
export abstract class ParallelGenerator<O extends MapGenOptions = MapGenOptions> extends MapGenerator<O> {
  // Attributes
  readonly requests = new RequestSender<MapGenRequest, MapGenResult>(this.worker());

  // Constructor
  constructor() {
    super();

    this._setup();
  }

  // Methods
  protected abstract worker(): Worker;

  private _setup() {
    // Initiate worker
    this.requests.request({
      type: 'setup',
    });
  }

  protected async run(name: string, size: ISize, opts: O): Promise<Map> {
    return firstValueFrom(this.requests.request({ type: 'generate', name, size, opts }).pipe(
      map((msg) => new Map(name, new Rect(msg.bbox)))
    ));
  }
}
