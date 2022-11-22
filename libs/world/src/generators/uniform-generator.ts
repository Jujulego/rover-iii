import { TileGenerator, TileGeneratorOpts } from './tile-generator';
import { ITile } from '../tile';

// Types
export interface UniformGeneratorOpts extends TileGeneratorOpts {
  readonly biome: string;
}

// Class
export class UniformGenerator extends TileGenerator<UniformGeneratorOpts> {
  // Methods
  protected *generate(world: string, opts: UniformGeneratorOpts): Generator<ITile> {
    for (let y = opts.bbox.b; y <= opts.bbox.t; ++y) {
      for (let x = opts.bbox.l; x <= opts.bbox.r; ++x) {
        yield {
          pos: { x, y },
          biome: opts.biome
        };
      }
    }
  }
}
