import { ISize } from '../../math2d';

import { Map } from '../map';

// Type
export type MapOptions = Record<string, unknown>;

// Class
export abstract class MapGenerator<O extends MapOptions> {
  // Methods
  abstract generate(name: string, size: ISize, opts: O): Promise<Map>;
}
