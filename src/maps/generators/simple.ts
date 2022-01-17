import { BiomeName } from '../../biomes';
import { ISize, Vector } from '../../math2d';

import { Map } from '../map';
import { Tile } from '../tile';

// Generator
export async function simpleMap(name: string, size: ISize, biome: BiomeName): Promise<Map> {
  const tiles: Tile[] = [];

  for (let y = 0; y < size.h; ++y) {
    for (let x = 0; x < size.w; ++x) {
      if (biome) {
        tiles.push({
          pos: new Vector(x, y),
          biome
        });
      }
    }
  }

  return await Map.fromArray(name, tiles);
}
