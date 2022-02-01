import { Map } from '../maps';
import { ISize } from '../math2d';

// Type
export type MapOptions = Record<string, unknown>;

// Class
export abstract class MapGenerator<O extends MapOptions> {
  // Methods
  protected abstract run(name: string, size: ISize, opts: O): Promise<Map>;

  generate(name: string, size: ISize, opts: O): Promise<Map> {
    return this.run(name, size, opts);
  }
}
