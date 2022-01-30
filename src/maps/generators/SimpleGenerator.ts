import { BiomeName } from '../../biomes';
import { ISize, Rect, Vector } from '../../math2d';

import { Map } from '../map';
import { MapOptions } from './MapGenerator';
import { db, TileEntity } from '../../db';
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

  async generate(name: string, size: ISize, opts: SimpleGeneratorOptions): Promise<Map> {
    const tiles: TileEntity[] = [];

    for (let y = 0; y < size.h; ++y) {
      for (let x = 0; x < size.w; ++x) {
        tiles.push({
          map: name,
          pos: new Vector(x, y),
          biome: opts.biome
        });
      }
    }

    await db.tiles.bulkPut(tiles);

    return new Map(name, new Rect(0, 0, size.h - 1, size.w - 1));
  }
}
