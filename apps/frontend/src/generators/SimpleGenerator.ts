import { Vector } from '@ants/maths';

import { BiomeName } from '../biomes';
import { TileEntity } from '../db';
import { Map } from '../maps';
import { MapGenOptions } from './MapGenerator';
import { MapIterator } from './MapIterator';

// Types
export interface SimpleGeneratorOptions extends MapGenOptions {
  biome: BiomeName;
}

// Class
export class SimpleGenerator extends MapIterator<SimpleGeneratorOptions> {
  // Methods
  protected *iterate(map: Map, opts: SimpleGeneratorOptions): Generator<TileEntity> {
    for (let y = 0; y < map.bbox.h; ++y) {
      for (let x = 0; x < map.bbox.w; ++x) {
        yield {
          map: map.name,
          pos: new Vector(x, y),
          biome: opts.biome
        };
      }
    }
  }
}
