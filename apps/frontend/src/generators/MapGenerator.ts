import { Map } from '../maps';

// Type
export type MapGenOptions = Record<string, unknown>;

// Class
export abstract class MapGenerator<O extends MapGenOptions = MapGenOptions> {
  // Methods
  protected abstract run(map: Map, opts: O): Promise<void>;

  generate(map: Map, opts: O): Promise<void> {
    return this.run(map, opts);
  }
}
