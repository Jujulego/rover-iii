import { BiomeName } from '../../biomes';
import { IVector } from '../../math2d';

import { Ant } from '../Ant';
import { AntNetworkMapUpdate, AntNetworkMessage, Received } from './message';
import { nanoid } from 'nanoid';
import { filter, Subject } from 'rxjs';

// Interface
export interface AntWithNetwork extends Ant {
  // Attributes
  readonly network: AntNetwork;
}

// Utils
export function hasNetwork(ant: Ant): ant is AntWithNetwork {
  return 'network' in ant;
}

// Class
export class AntNetwork {
  // Attributes
  private readonly _channel: BroadcastChannel;

  private readonly _messages$$ = new Subject<Received<AntNetworkMessage>>();
  readonly messages$ = this._messages$$.asObservable()
    .pipe(
      filter((msg) => msg.from !== this.ant.id)
    );

  readonly mapUpdates$ = this.messages$
    .pipe(
      filter((msg): msg is Received<AntNetworkMapUpdate> => msg.type === 'mapUpdate')
    );

  // Constructor
  constructor(readonly ant: Ant) {
    // Setup receive pipeline
    this._channel = new BroadcastChannel(this.ant.map.name);
    this._channel.addEventListener('message', (evt: MessageEvent<Received<AntNetworkMessage>>) => {
      this._messages$$.next(evt.data);
    });
  }

  // Methods
  send(msg: AntNetworkMessage): void {
    this._channel.postMessage({
      ...msg,
      id: nanoid(),
      from: this.ant.id,
    });
  }

  sendMapUpdate(pos: IVector, biome: BiomeName): void {
    return this.send({
      type: 'mapUpdate',
      pos, biome
    });
  }
}
