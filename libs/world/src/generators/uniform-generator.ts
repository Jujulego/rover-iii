import { IBlock, TileGenerator, TileGeneratorOpts } from './tile-generator';
import { ITile } from '../tile';

// Types
export interface UniformGeneratorOpts extends TileGeneratorOpts {
  readonly biome: string;
}

// Class
export class UniformGenerator extends TileGenerator<UniformGeneratorOpts> {
  // Methods
  protected *generate(block: IBlock, opts: UniformGeneratorOpts): Generator<ITile> {
    for (let y = block.bbox.b; y <= block.bbox.t; ++y) {
      for (let x = block.bbox.l; x <= block.bbox.r; ++x) {
        yield {
          pos: { x, y },
          biome: opts.biome
        };
      }
    }
  }
}
