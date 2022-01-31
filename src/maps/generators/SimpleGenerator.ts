import { BiomeName } from '../../biomes';
import { ISize, Rect, Vector } from '../../math2d';

import { MapOptions } from './MapGenerator';
import { TileEntity } from '../../db';
import { MapIterator } from './MapIterator';

// Types
export interface SimpleGeneratorOptions extends MapOptions {
  biome: BiomeName;
}

// Class
export class SimpleGenerator extends MapIterator<SimpleGeneratorOptions> {
  // Methods
  protected bbox(size: ISize): Rect {
    return new Rect(0, 0, size.h - 1, size.w - 1);
  }

  protected *iterate(name: string, size: ISize, opts: SimpleGeneratorOptions): Generator<TileEntity> {
    for (let y = 0; y < size.h; ++y) {
      for (let x = 0; x < size.w; ++x) {
        yield {
          map: name,
          pos: new Vector(x, y),
          biome: opts.biome
        };
      }
    }
  }
}
