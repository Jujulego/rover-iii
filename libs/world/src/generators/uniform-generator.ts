import { pointsOf } from '@jujulego/2d-maths';

import { TileGenerator, TileGeneratorOpts } from './tile-generator';
import { ITile } from '../tile';
import { IWorld } from '../world';

// Types
export interface UniformGeneratorOpts extends TileGeneratorOpts {
  readonly biome: string;
}

// Class
export class UniformGenerator extends TileGenerator<UniformGeneratorOpts> {
  // Methods
  protected *generate(world: IWorld, opts: UniformGeneratorOpts): Generator<ITile> {
    for (const pos of pointsOf(opts.shape)) {
      yield {
        pos,
        biome: opts.biome,
      };
    }
  }
}
