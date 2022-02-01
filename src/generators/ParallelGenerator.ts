import { firstValueFrom } from 'rxjs';

import { Map } from '../maps';
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

  protected async run(map: Map, opts: O): Promise<void> {
    await firstValueFrom(this.requests.request({
      type: 'generate',
      map: {
        name: map.name,
        bbox: map.bbox
      },
      opts
    }));
  }
}
