import { rect } from '@jujulego/2d-maths';

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
    const bbox = rect(block.bbox);

    for (let y = 0; y <= bbox.size.dy; ++y) {
      for (let x = 0; x <= bbox.size.dx; ++x) {
        yield {
          pos: { x, y },
          biome: opts.biome
        };
      }
    }
  }
}
