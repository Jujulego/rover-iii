import { Map } from '../maps';

import { Ant } from './Ant';

// Interface
export interface AntWithNetwork<T> extends Ant {
  // Attributes
  readonly network: AntNetwork<T>;
}

// Utils
export function hasNetwork(ant: Ant): ant is AntWithNetwork<unknown> {
  return 'network' in ant;
}

// Class
export class AntNetwork<T> {
  // Attributes
  private readonly _channel = new BroadcastChannel(this.map.id);

  // Constructor
  constructor(readonly map: Map) {}
}
